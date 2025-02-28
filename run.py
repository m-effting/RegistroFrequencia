import os
from flask import send_from_directory
from app import app

# Rota para servir arquivos estáticos
@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory(os.path.join(app.root_path, 'static'), filename)

# Inicialização do servidor Flask
if __name__ == '__main__':
    app.run(debug=True)