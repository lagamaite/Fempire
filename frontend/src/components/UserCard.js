import React from "react";
import "./UserCard.css";

const UserCard = ({ user, onDelete }) => {
  return (
    <div className="user-card">
      {user.picture && (
        <img
          className="user-avatar"
          src={`http://localhost:5000${user.picture}`}
          alt={`${user.name}'s avatar`}
        />
      )}
      <div className="user-info">
        <h3>{user.name}</h3>
        <p>Age: {user.age}</p>
        <p>Status: {user.status}</p>
        <p>Location: {user.location}</p>
        <div className="user-interests">
          {user.interests.map((interest, index) => (
            <span key={index} className="interest-badge">
              {interest}
            </span>
          ))}
        </div>
        <button className="delete-button" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default UserCard;
