from flask import Blueprint, render_template, request, redirect, url_for, send_file, flash
from app.services.pdf_service import extract_names_from_pdf
from app.services.excel_service import generate_excel
from app.models.aluno import Aluno
from app.models.presenca import Presenca
from app import db
import os

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    alunos = Aluno.query.all()
    return render_template('index.html', alunos=alunos)

@main_bp.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        flash('Nenhum arquivo enviado.', 'error')
        return redirect(url_for('main.index'))
    
    file = request.files['file']
    
    if file.filename == '':
        flash('Nenhum arquivo selecionado.', 'error')
        return redirect(url_for('main.index'))
    
    if file and file.filename.endswith('.pdf'):
        try:
            # Extrai os nomes do PDF
            names = extract_names_from_pdf(file)
            print(f"Nomes extraídos: {names}")  # Log para depuração
            
            # Adiciona os nomes ao banco de dados
            for name in names:
                aluno = Aluno(nome=name)
                db.session.add(aluno)
            db.session.commit()
            
            flash('Alunos importados com sucesso!', 'success')
        except Exception as e:
            print(f"Erro ao processar o PDF: {e}")  # Log para depuração
            flash('Erro ao processar o arquivo PDF.', 'error')
    else:
        flash('Formato de arquivo inválido. Apenas PDFs são permitidos.', 'error')
    
    return redirect(url_for('main.index'))

@main_bp.route('/save', methods=['POST'])
def save():
    data = request.form
    for aluno_id, status in data.items():
        if aluno_id.startswith('status_'):
            aluno_id = aluno_id.replace('status_', '')
            observacao = data.get(f'observacao_{aluno_id}', '')
            presenca = Presenca(
                aluno_id=aluno_id,
                presente=status == 'Presente',
                observacao=observacao
            )
            db.session.add(presenca)
    db.session.commit()
    flash('Presenças salvas com sucesso!', 'success')
    return redirect(url_for('main.index'))

@main_bp.route('/export', methods=['POST'])
def export():
    presencas = Presenca.query.all()
    output = generate_excel(presencas)
    return send_file(output, as_attachment=True, download_name='presenca.xlsx')