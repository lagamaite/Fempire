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

  // Fetch users from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/users")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched users:", data);
        setUsers(data);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleAddUser = (e) => {
    e.preventDefault();

    fetch("http://localhost:5000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("User added:", data);
        // Optimistically add the new user to the state
        setUsers((prevUsers) => [...prevUsers, data]);
        // Reset the form
        setNewUser({
          name: "",
          age: "",
          status: "",
          location: "",
          interests: []
        });
      })
      .catch((error) => console.error("Error adding user:", error));
  };

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
      <div className="search-bar">
        <input type="text" placeholder="Hinted search text" />
        <button className="search-button">🔍</button>
      </div>

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
          <input
            type="text"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) =>
              setNewUser({ ...newUser, name: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Age"
            value={newUser.age}
            onChange={(e) =>
              setNewUser({ ...newUser, age: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Status"
            value={newUser.status}
            onChange={(e) =>
              setNewUser({ ...newUser, status: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Location"
            value={newUser.location}
            onChange={(e) =>
              setNewUser({ ...newUser, location: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Interests (comma separated)"
            value={newUser.interests.join(", ")}
            onChange={(e) =>
              setNewUser({
                ...newUser,
                interests: e.target.value.split(",").map((i) => i.trim()),
              })
            }
          />
          <button type="submit" className="add-user-button">
            Add User
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
