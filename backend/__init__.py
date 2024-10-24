from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate  # Import Flask-Migrate
from .models import db  # Import the db instance from models
from flask_cors import CORS
import os

def create_app():
    app = Flask(__name__)

    # Enable CORS for all routes
    CORS(app)

    # Define the upload folder relative to the current file's location
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')

    # Ensure the 'uploads' directory exists
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)

    # Configure the upload folder in Flask app
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

    # Configure the PostgreSQL database URI (replace with your actual credentials)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:admin@localhost:5432/postgres'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize the database with the Flask app
    db.init_app(app)

    # Initialize Migrate
    migrate = Migrate(app, db)  # Attach Migrate to the app and db
    
    return app
