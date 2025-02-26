from flask import render_template, request, redirect, url_for, jsonify, current_app, flash
import os
import csv
from datetime import datetime
from openpyxl import Workbook
from openpyxl.utils import get_column_letter
from app import app

# Dicionário para armazenar as chamadas dos alunos
chamadas = {}

# Função para salvar as chamadas em um arquivo Excel
def salvar_chamada_excel(escola, turma):
    try:
        # Formatar a data para o nome do arquivo
        data = datetime.today().strftime('%Y-%m-%d')
        chave = f"{escola}_{turma}_{data}"

        # Caminho do arquivo Excel
        arquivo_excel = os.path.join(current_app.config['HISTORICO_CHAMADAS_FOLDER'], f"{chave}.xlsx")

        # Criar uma nova planilha Excel
        wb = Workbook()
        ws = wb.active
        ws.title = "Chamada"

        # Adicionar cabeçalho na planilha
        ws.append(["Nome", "Presença", "Observação"])

        # Preencher as linhas com os dados dos alunos
        if chave in chamadas:
            for aluno_data in chamadas[chave]:
                ws.append([aluno_data['nome'], aluno_data['presenca'], aluno_data['observacao']])

        # Ajustar o tamanho das colunas automaticamente
        for col in range(1, 4):
            column = get_column_letter(col)
            max_length = 0
            for row in ws.iter_rows(min_col=col, max_col=col):
                for cell in row:
                    try:
                        if len(str(cell.value)) > max_length:
                            max_length = len(str(cell.value))
                    except:
                        pass
            adjusted_width = (max_length + 2)
            ws.column_dimensions[column].width = adjusted_width

        # Salvar o arquivo Excel
        wb.save(arquivo_excel)
        return arquivo_excel
    except Exception as e:
        flash(f"Erro ao salvar chamada: {str(e)}", "error")
        return None

# Rota principal para exibir a página inicial
@app.route('/')
def index():
    turma_atual = request.args.get('turma', '')
    return render_template('index.html', chamadas=chamadas, turma_atual=turma_atual)

# Rota para adicionar um aluno à chamada
@app.route('/adicionar_aluno', methods=['POST'])
def adicionar_aluno():
    escola = request.form['escola']
    turma = request.form['turma']
    aluno = request.form['aluno']

    # Validação dos campos
    if not escola or not turma or not aluno:
        flash("Preencha todos os campos para adicionar um aluno.", "error")
        return redirect(url_for('index', turma=turma))


    # Salvar a chamada em Excel
    if salvar_chamada_excel(escola, turma):
        flash("Aluno adicionado com sucesso!", "success")
    else:
        flash("Erro ao salvar a chamada.", "error")

    return redirect(url_for('index', turma=turma))

# Rota para alterar o status de presença de um aluno
@app.route('/alterar_presenca', methods=['POST'])
def alterar_presenca():
    escola = request.form.get('escola', 'Desconhecido')
    turma = request.form.get('turma', 'Desconhecida')
    aluno = request.form['aluno']
    status = request.form['status']

    data = datetime.today().strftime('%Y-%m-%d')
    chave = f"{escola}_{turma}_{data}"

    if chave in chamadas:
        for aluno_data in chamadas[chave]:
            if aluno_data['nome'] == aluno:
                aluno_data['presenca'] = status
                break

        if salvar_chamada_excel(escola, turma):
            return jsonify(success=True, message="Presença alterada com sucesso!")
        else:
            return jsonify(success=False, message="Erro ao salvar a alteração de presença.")
    
    return jsonify(success=False, message="Chamada não encontrada.")

# Rota para importar uma lista de presença a partir de um arquivo CSV
@app.route('/importar_chamada', methods=['POST'])
def importar_chamada():
    if 'file' not in request.files:
        flash("Nenhum arquivo selecionado.", "error")
        return redirect(url_for('index'))

    file = request.files['file']
    if file.filename == '':
        flash("Nome de arquivo inválido.", "error")
        return redirect(url_for('index'))

    try:
        # Salvar o arquivo no diretório de uploads
        filename = os.path.join(current_app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filename)

        # Dados da escola, turma e data para gerar a chave
        escola = request.form['escola']
        turma = request.form['turma']
        data = datetime.today().strftime('%Y-%m-%d')
        chave = f"{escola}_{turma}_{data}"

        # Se a chave não existe, cria uma nova lista de chamadas
        if chave not in chamadas:
            chamadas[chave] = []

        # Lê o arquivo CSV e adiciona os alunos na lista de chamadas
        with open(filename, newline='', encoding='utf-8') as csvfile:
            reader = csv.reader(csvfile)
            for row in reader:
                if row:
                    nome = row[0]  # Pega o nome do aluno da primeira coluna
                    chamadas[chave].append({'nome': nome, 'presenca': 'Presente', 'observacao': ''})

        # Salva a chamada importada em Excel
        if salvar_chamada_excel(escola, turma):
            flash("Chamada importada com sucesso!", "success")
        else:
            flash("Erro ao salvar a chamada importada.", "error")

    except Exception as e:
        flash(f"Erro ao importar chamada: {str(e)}", "error")

    return redirect(url_for('index'))