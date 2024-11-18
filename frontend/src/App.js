import React, { useState, useEffect } from 'react';

function App() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: '',
    age: '',
    status: '',
    location: '',
    interests: []
  });

  useEffect(() => {
    // Fetch existing users from the backend when the component mounts
    fetch("http://localhost:5000/api/users")
      .then(response => response.json())
      .then(data => {
        console.log("Fetched users:", data); // Debugging log
        setUsers(data);
      })
      .catch(error => console.error("Error fetching users:", error));
  }, []);

  const handleAddUser = (e) => {
    e.preventDefault();

    // Send a POST request to add a new user
    fetch("http://localhost:5000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
      .then(response => response.json())
      .then(data => {
        console.log("User added:", data);
        // After adding, re-fetch the users
        fetch("http://localhost:5000/api/users")
          .then(response => response.json())
          .then(data => {
            setUsers(data); // Update users state with new list
          })
          .catch(error => console.error("Error fetching users:", error));
      })
      .catch(error => console.error("Error adding user:", error));
  };

  const handleDeleteUser = (userId) => {
    fetch(`http://localhost:5000/api/users/${userId}`, {
      method: "DELETE",
    })
      .then(response => response.json())
      .then(data => {
        console.log("User deleted:", data);
        // After deleting, re-fetch the users
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      })
      .catch(error => console.error("Error deleting user:", error));
  };

  return (
    <div className="App">
      <h1>User List</h1>
      <ul>
        {users.length > 0 ? (
          users.map((user) => (
            <li key={user.id}>
              <span>{user.name}</span> - <span>{user.age}</span> - <span>{user.status}</span> - <span>{user.location}</span>
              <ul>
                {user.interests.map((interest, index) => (
                  <li key={index}>{interest}</li>
                ))}
              </ul>
              <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
            </li>
          ))
        ) : (
          <p>No users found</p>
        )}
      </ul>

      <h2>Add New User</h2>
      <form onSubmit={handleAddUser}>
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Age"
          value={newUser.age}
          onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
        />
        <input
          type="text"
          placeholder="Status"
          value={newUser.status}
          onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
        />
        <input
          type="text"
          placeholder="Location"
          value={newUser.location}
          onChange={(e) => setNewUser({ ...newUser, location: e.target.value })}
        />
        <input
          type="text"
          placeholder="Interests (comma separated)"
          value={newUser.interests.join(', ')}
          onChange={(e) => setNewUser({ ...newUser, interests: e.target.value.split(',').map(i => i.trim()) })}
        />
        <button type="submit">Add User</button>
      </form>
    </div>
  );
}

export default App;
