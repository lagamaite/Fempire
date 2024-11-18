from base import db
from sqlalchemy.dialects.mysql import JSON

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    interests = db.Column(JSON, nullable=False)  # JSON column to store interests
    picture = db.Column(db.String(200), nullable=True)  # Path to the uploaded picture

    def __init__(self, name, age, status, location, interests, picture=None):
        self.name = name
        self.age = age
        self.status = status
        self.location = location
        self.interests = interests
        self.picture = picture

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "age": self.age,
            "status": self.status,
            "location": self.location,
            "interests": self.interests,
            "picture": self.picture,  # Include the picture field in the dictionary
        }
