from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import Config

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)

    # Registrar blueprints (rotas)
    from app.routes import main_bp
    app.register_blueprint(main_bp)

    # Criar tabelas do banco de dados
    with app.app_context():
        db.create_all()

    return app