import React from "react";
import "./UserCard.css";

const UserCard = ({ user, onDelete }) => {
  // Use default value for interests if undefined
  const interests = user.interests || [];

  return (
    <div className="user-card">
      <img
        className="user-avatar"
        src={`https://api.dicebear.com/5.x/female/svg?seed=${user.name}`}
        alt={user.name}
      />
      <div className="user-info">
        <h3>{user.name}</h3>
        <p>Age: {user.age}</p>
        <p>Status: {user.status}</p>
        <p>Location: {user.location}</p>
        <div className="user-interests">
          {interests.map((interest, index) => (
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
