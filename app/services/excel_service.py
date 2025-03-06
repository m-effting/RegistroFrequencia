from openpyxl import Workbook
from io import BytesIO

def generate_excel(presencas):
    wb = Workbook()
    ws = wb.active
    ws.append(['Data', 'Turma', 'Nome do Aluno', 'Observação', 'Presença', 'Falta', 'Falta Justificada'])
    for presenca in presencas:
        ws.append([
            presenca.aluno.nome,
            'Sim' if presenca.presente else 'Não',
            presenca.observacao
        ])
    output = BytesIO()
    wb.save(output)
    output.seek(0)
    return output