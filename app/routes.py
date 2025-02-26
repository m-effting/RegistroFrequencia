from flask import render_template, request, redirect, url_for, jsonify, current_app, flash
import os
import csv
from datetime import datetime
from app import app
from openpyxl import Workbook
from openpyxl.utils import get_column_letter

chamadas = {}

# Função para salvar as chamadas em um arquivo Excel
def salvar_chamada_excel(escola, turma):
    try:
        data = datetime.today().strftime('%Y-%m-%d')
        chave = f"{escola}_{turma}_{data}"

        # Usando o contexto de aplicativo para acessar as configurações
        with app.app_context():
            arquivo_excel = os.path.join(current_app.config['HISTORICO_ESCOLAR_FOLDER'], f"{chave}.xlsx")

        wb = Workbook()
        ws = wb.active
        ws.title = "Chamada"

        # Cabeçalho
        ws.append(["Nome", "Presença", "Observação"])

        # Preencher as linhas com os dados
        if chave in chamadas:
            for aluno_data in chamadas[chave]:
                ws.append([aluno_data['nome'], aluno_data['presenca'], aluno_data['observacao']])

        # Ajuste automático das colunas
        for col in range(1, 4):
            column = get_column_letter(col)
            max_length = 0
            for row in ws.iter_rows(min_col=col, max_col=col):
                for cell in row:
                    try:
                        if len(str(cell.value)) > max_length:
                            max_length = len(cell.value)
                    except:
                        pass
            adjusted_width = (max_length + 2)
            ws.column_dimensions[column].width = adjusted_width

        wb.save(arquivo_excel)
        return arquivo_excel

    except Exception as e:
        flash(f"Erro ao salvar chamada: {str(e)}", "error")
        return None

@app.route('/')
def index():
    turma_atual = request.args.get('turma', '')  # Obtém a turma da URL, se existir
    return render_template('index.html', chamadas=chamadas, turma_atual=turma_atual)

@app.route('/adicionar_aluno', methods=['POST'])
def adicionar_aluno():
    escola = request.form['escola']
    turma = request.form['turma']
    aluno = request.form['aluno']

    if not escola or not turma or not aluno:
        flash("Preencha todos os campos para adicionar um aluno.", "error")
        return redirect(url_for('index', turma=turma))

    data = datetime.today().strftime('%Y-%m-%d')
    chave = f"{escola}_{turma}_{data}"

    if chave not in chamadas:
        chamadas[chave] = []
    
    chamadas[chave].append({'nome': aluno, 'presenca': 'Presente', 'observacao': ''})

    if salvar_chamada_excel(escola, turma):
        flash("Aluno adicionado com sucesso!", "success")
    else:
        flash("Erro ao salvar a chamada.", "error")

    return redirect(url_for('index', turma=turma))  # Mantém a turma na URL

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
        with app.app_context():
            filename = os.path.join(current_app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filename)

        escola = request.form['escola']
        turma = request.form['turma']
        data = datetime.today().strftime('%Y-%m-%d')
        chave = f"{escola}_{turma}_{data}"

        if chave not in chamadas:
            chamadas[chave] = []

        with open(filename, newline='', encoding='utf-8') as csvfile:
            reader = csv.reader(csvfile)
            for row in reader:
                if row:
                    nome = row[0]  # Pegando apenas a primeira coluna (nome do aluno)
                    chamadas[chave].append({'nome': nome, 'presenca': 'Presente', 'observacao': ''})

        if salvar_chamada_excel(escola, turma):
            flash("Chamada importada com sucesso!", "success")
        else:
            flash("Erro ao salvar a chamada importada.", "error")

    except Exception as e:
        flash(f"Erro ao importar chamada: {str(e)}", "error")

    return redirect(url_for('index'))
