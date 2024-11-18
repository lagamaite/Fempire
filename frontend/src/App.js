import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import UserCard from "./components/UserCard";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    age: "",
    status: "",
    location: "",
    interests: []
  });
  const [picture, setPicture] = useState(null); // State to hold the picture file

  // Fetch users from the backend
  useEffect(() => {
    fetch("http://localhost:5000/api/users")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched users:", data);
        setUsers(data);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  // Handle adding a new user
  const handleAddUser = (e) => {
    e.preventDefault();

    // Create a FormData object to send both file and text data
    const formData = new FormData();
    formData.append("name", newUser.name);
    formData.append("age", newUser.age);
    formData.append("status", newUser.status);
    formData.append("location", newUser.location);
    formData.append("interests", newUser.interests.join(","));
    if (picture) formData.append("picture", picture);

    fetch("http://localhost:5000/api/users", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("User added:", data);
        setUsers((prevUsers) => [...prevUsers, data]); // Add the new user to the state
        setNewUser({
          name: "",
          age: "",
          status: "",
          location: "",
          interests: []
        });
        setPicture(null); // Reset the picture file input
      })
      .catch((error) => console.error("Error adding user:", error));
  };

  // Handle deleting a user
  const handleDeleteUser = (userId) => {
    fetch(`http://localhost:5000/api/users/${userId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("User deleted:", data);
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      })
      .catch((error) => console.error("Error deleting user:", error));
  };

  return (
    <div className="app-container">
      <Header />
      <div className="results-header">{users.length} results</div>
      <div className="user-list">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onDelete={() => handleDeleteUser(user.id)}
          />
        ))}
      </div>

      <div className="add-user-form">
        <h2>Add New User</h2>
        <form onSubmit={handleAddUser}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              value={newUser.name}
              onChange={(e) =>
                setNewUser({ ...newUser, name: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="age">Age:</label>
            <input
              type="number"
              id="age"
              placeholder="Enter your age"
              value={newUser.age}
              onChange={(e) =>
                setNewUser({ ...newUser, age: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="status">Status:</label>
            <input
              type="text"
              id="status"
              placeholder="Enter your status"
              value={newUser.status}
              onChange={(e) =>
                setNewUser({ ...newUser, status: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              id="location"
              placeholder="Enter your location"
              value={newUser.location}
              onChange={(e) =>
                setNewUser({ ...newUser, location: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="interests">Interests:</label>
            <input
              type="text"
              id="interests"
              placeholder="Enter interests (comma-separated)"
              value={newUser.interests.join(", ")}
              onChange={(e) =>
                setNewUser({
                  ...newUser,
                  interests: e.target.value.split(",").map((i) => i.trim()),
                })
              }
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="picture">Upload Picture Here:</label>
            <input
              type="file"
              id="picture"
              accept="image/*"
              onChange={(e) => setPicture(e.target.files[0])}
            />
          </div>
          <button type="submit" className="add-user-button">
            Add User
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
