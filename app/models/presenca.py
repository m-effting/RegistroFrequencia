from app import db

class Presenca(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    aluno_id = db.Column(db.Integer, db.ForeignKey('aluno.id'), nullable=False)
    presente = db.Column(db.Boolean, nullable=False)
    observacao = db.Column(db.String(200))