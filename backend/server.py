from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask_sqlalchemy import SQLAlchemy
import jinja2
import json
from base import db
from user import User
from dotenv import load_dotenv
import os
from flask_cors import CORS

# Load environment variables from the .env file
load_dotenv()

# Creating Flask app
app = Flask(__name__)

# Get the database credentials from environment variables
user = os.getenv("DB_USER", "root")  # Default to "root" if not found
pin = os.getenv("DB_PASSWORD")  
host = os.getenv("DB_HOST", "localhost")  # Default to "localhost" if not found
db_name = os.getenv("DB_NAME", "fempire_db")  # Default to "fempire_db" if not found

# Configuring database URI
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{user}:{pin}@{host}/{db_name}"

# Disable modification tracking
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initializing Flask app with SQLAlchemy
db.init_app(app)

# Initialize CORS
CORS(app)

def create_db():
    with app.app_context():
        db.create_all()

# Home endpoint
@app.route('/')
def home():
    users = User.query.all()
    return render_template('index.html', users=users)


## API ENDPOINTS FOR FRONTEND 
@app.route('/api/users')
def get_users():
    users = User.query.all()
    users_list = []
    
    for user in users:
        # Check if interests is already a list or a string
        if isinstance(user.interests, str):
            interests = user.interests.split(",") if user.interests else []
        else:
            interests = user.interests  # Assuming it's already a list
        
        users_list.append({
            "id": user.id,
            "name": user.name,
            "age": user.age,
            "status": user.status,
            "location": user.location,
            "interests": interests
        })
    
    return jsonify(users_list)


@app.route('/api/users', methods=['POST'])
def add_user():
    data = request.get_json()
    name = data.get('name')
    age = data.get('age')
    status = data.get('status')
    location = data.get('location')
    interests = data.get('interests')

    # Ensure interests is a list (split by commas if it's a string)
    if isinstance(interests, str):
        interests_list = [i.strip() for i in interests.split(',')]
    else:
        interests_list = interests

    new_user = User(name=name, age=int(age), status=status, location=location, interests=interests_list)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User added successfully'}), 201

@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": f"User {user_id} deleted successfully"})


if __name__ == "__main__":
    create_db()
    app.run(debug=True)
