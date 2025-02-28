import os
from flask import Flask

# Inicialização do aplicativo Flask
app = Flask(__name__)

# Configurações do aplicativo
def configurar_app(app):
    # Configuração do diretório de uploads
    UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)

    # Configuração do diretório de histórico de chamadas
    HISTORICO_CHAMADAS_FOLDER = os.path.join(os.getcwd(), 'historico_chamadas')
    if not os.path.exists(HISTORICO_CHAMADAS_FOLDER):
        os.makedirs(HISTORICO_CHAMADAS_FOLDER)

    # Definindo configurações do app
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    app.config['HISTORICO_CHAMADAS_FOLDER'] = HISTORICO_CHAMADAS_FOLDER
    app.config['SECRET_KEY'] = 'chave_secreta_para_sessao'  # Chave secreta para sessões

# Configurar o app
configurar_app(app)

# Importação das rotas (deve ser feita no final para evitar importação circular)
from app import routes