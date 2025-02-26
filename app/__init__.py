import os
from flask import Flask

app = Flask(__name__)

# Configuração do diretório de uploads
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Configuração do diretório de histórico escolar
HISTORICO_ESCOLAR_FOLDER = os.path.join(os.getcwd(), 'historico_escolar')
if not os.path.exists(HISTORICO_ESCOLAR_FOLDER):
    os.makedirs(HISTORICO_ESCOLAR_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['HISTORICO_ESCOLAR_FOLDER'] = HISTORICO_ESCOLAR_FOLDER
app.config['SECRET_KEY'] = 'chave_secreta_para_sessao'

# Importação das rotas deve ser feita no final para evitar importação circular
from app import routes
