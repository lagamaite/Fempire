from flask import Flask, render_template, request, jsonify, send_from_directory
from dotenv import load_dotenv
from flask_cors import CORS
from werkzeug.utils import secure_filename
from base import db
from user import User
import os

# Load environment variables from the .env file
load_dotenv()

# Creating Flask app
app = Flask(__name__)

# Get the database credentials from environment variables
user = os.getenv("DB_USER", "root")
pin = os.getenv("DB_PASSWORD")
host = os.getenv("DB_HOST", "localhost")
db_name = os.getenv("DB_NAME", "fempire_db")

# Configuring database URI
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{user}:{pin}@{host}/{db_name}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# File upload configuration
UPLOAD_FOLDER = './uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize SQLAlchemy and CORS
db.init_app(app)
CORS(app)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Create database tables
@app.before_first_request
def create_tables():
    db.create_all()

# Home endpoint
@app.route('/')
def home():
    users = User.query.all()
    return render_template('index.html', users=users)

# API to fetch all users
@app.route('/api/users', methods=['GET'])
def get_users():
    users = User.query.all()
    users_list = []
    for user in users:
        interests = user.interests.split(",") if user.interests else []
        users_list.append({
            "id": user.id,
            "name": user.name,
            "age": user.age,
            "status": user.status,
            "location": user.location,
            "interests": interests,
            "picture": f"/uploads/{user.picture}" if user.picture else None
        })
    return jsonify(users_list)

# API to add a new user with picture upload
@app.route('/api/users', methods=['POST'])
def add_user():
    data = request.form
    name = data.get('name')
    age = data.get('age')
    status = data.get('status')
    location = data.get('location')
    interests = data.get('interests', '').split(',')

    file = request.files.get('picture')
    picture_filename = None
    if file and allowed_file(file.filename):
        picture_filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], picture_filename))

    new_user = User(
        name=name,
        age=int(age),
        status=status,
        location=location,
        interests=", ".join(interests),
        picture=picture_filename
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "id": new_user.id,
        "name": new_user.name,
        "age": new_user.age,
        "status": new_user.status,
        "location": new_user.location,
        "interests": interests,
        "picture": f"/uploads/{new_user.picture}" if new_user.picture else None
    }), 201

# API to delete a user
@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    if user.picture:
        picture_path = os.path.join(app.config['UPLOAD_FOLDER'], user.picture)
        if os.path.exists(picture_path):
            os.remove(picture_path)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": f"User {user_id} deleted successfully"})

# Serve uploaded files
@app.route('/uploads/<filename>')
def serve_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == "__main__":
    app.run(debug=True)
