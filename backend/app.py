import sys
import os
from flask import jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from .models import db, User, FileUpload, FileType
from backend import create_app, gps_location

# Ensure the project root is in sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

app = create_app()

# JWT configuration
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'supersecretkey')  # Use environment variable
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=3)
app.config['JWT_TOKEN_LOCATION'] = ['headers']

jwt = JWTManager(app)

# Ensure upload folder is configured
app.config['UPLOAD_FOLDER'] = os.getenv('UPLOAD_FOLDER', './uploads')

# Make sure upload folder exists
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

# Helper function to validate request data
def validate_user_data(data, required_fields):
    """Validate that required fields exist in the provided data."""
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return False, f"Missing required fields: {', '.join(missing_fields)}"
    return True, None

@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Flask API!"})

# User Registration (POST) with password hashing
@app.route('/api/register', methods=['POST'])
def register_user():
    data = request.json
    is_valid, error_message = validate_user_data(data, ['name', 'email', 'password'])
    if not is_valid:
        return jsonify({"message": error_message}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({"message": "User with this email already exists"}), 409

    try:
        hashed_password = generate_password_hash(data['password'])
        new_user = User(
            username=data['name'],
            email=data['email'],
            password=hashed_password,
            created_date=datetime.utcnow()
        )
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error registering user: {e}")
        return jsonify({"message": f"Error registering user: {str(e)}"}), 500

    return jsonify({"message": "User registered successfully!"}), 201

# User Login (POST)
@app.route('/api/login', methods=['POST'])
def login_user():
    data = request.json
    is_valid, error_message = validate_user_data(data, ['email', 'password'])
    if not is_valid:
        return jsonify({"message": error_message}), 400

    user = User.query.filter_by(email=data['email']).first()
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({"message": "Incorrect email or password"}), 401

    access_token = create_access_token(identity=user.userid)
    return jsonify(access_token=access_token), 200

# Protected Route: Get User Profile (GET)
@app.route('/api/profile', methods=['GET'])
@jwt_required()
def get_user_profile():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    return jsonify({
        "id": user.userid,
        "name": user.username,
        "email": user.email,
        "created_date": user.created_date
    }), 200

# File Upload Route (POST)
@app.route('/api/upload', methods=['POST'])
@jwt_required()
def upload_file():
    user_id = get_jwt_identity()

    if 'file' not in request.files:
        return jsonify({'message': 'No file part in the request'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400

    # Ensure file_type_id is converted to an integer
    try:
        file_type_id = int(request.form.get('file_type_id'))
    except (ValueError, TypeError):
        return jsonify({'message': 'Invalid file type ID'}), 400

    # Use db.session.get() to retrieve the FileType instance
    file_type = db.session.get(FileType, file_type_id)
    if not file_type:
        return jsonify({'message': 'Invalid file type'}), 400

    # Extract other form data
    title = request.form.get('title')
    tags = request.form.get('tags')
    subject = request.form.get('subject')
    city = request.form.get('city')
    country = request.form.get('country')

    # Validate the file extension
    file_extension = file.filename.split('.')[-1].lower()
    allowed_extensions_list = file_type.allowed_extensions.split(',')
    if file_extension not in allowed_extensions_list:
        return jsonify({'message': f'Invalid file extension for {file_type.type_name}'}), 400

    secure_name = secure_filename(file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], secure_name)
    file.seek(0)  # Reset file pointer after reading

    try:
        # Save the file to the server
        file.save(file_path)

         # Extract EXIF data (including GPS coordinates)
        exif_data = gps_location.get_exif_data(file_path)
        latitude = exif_data.get('GPSLatitude')
        longitude = exif_data.get('GPSLongitude')

        # Save file metadata to the database
        new_upload = FileUpload(
            filename=secure_name,
            file_path=file_path,
            title=title,
            tags=tags,
            subject=subject,
            city=city,
            country=country,
            upload_date=datetime.utcnow(),
            user_id=user_id,
            file_type_id=file_type_id,
            lat=latitude,
            lon=longitude
        )
        db.session.add(new_upload)
        db.session.commit()

        return jsonify({'message': f'File {secure_name} uploaded successfully!'}), 200

    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error uploading file: {e}")
        return jsonify({'message': f'Error uploading file: {str(e)}'}), 500

# Get File Types (GET)
@app.route('/api/file-types', methods=['GET'])
def get_file_types():
    file_types = FileType.query.all()
    return jsonify([{'id': file_type.filetypeid, 'type_name': file_type.type_name} for file_type in file_types])

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
