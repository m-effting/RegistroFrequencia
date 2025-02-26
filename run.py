# Importação do módulo os para manipulação de caminhos de arquivos
import os

# Importação do objeto 'app' da aplicação Flask
from app import app

# Importação da função 'send_from_directory' do Flask, para servir arquivos estáticos
from flask import send_from_directory

# Definindo uma rota para servir arquivos estáticos da pasta 'static'
@app.route('/static/<path:filename>')
def serve_static(filename):
    # A função 'send_from_directory' serve o arquivo estático solicitado a partir do diretório 'static'
    # A função 'os.path.join' é usada para criar o caminho correto para o arquivo dentro do diretório 'static'
    return send_from_directory(os.path.join(app.root_path, 'static'), filename)

# Condicional para garantir que o servidor Flask seja executado apenas se o script for o principal
if __name__ == '__main__':
    # Inicia o servidor Flask com o modo de depuração ativado
    app.run(debug=True)
