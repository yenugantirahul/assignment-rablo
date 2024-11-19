import React, { useState, useEffect } from "react";
import axios from "axios";
import UserCard from "./UserCard";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        setUsers(response.data);
        setFilteredUsers(response.data);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleSearch = () => {
    if (searchId) {
      const foundUser = users.filter((user) => user.id === parseInt(searchId));
      setFilteredUsers(foundUser.length ? foundUser : []);
    } else {
      setFilteredUsers(users);
    }
  };

  const handleDelete = (id) => {
    setFilteredUsers(filteredUsers.filter((user) => user.id !== id));
  };

  const handleMultiDelete = () => {
    setFilteredUsers(
      filteredUsers.filter((user) => !selectedUsers.includes(user.id))
    );
    setSelectedUsers([]);
  };

  const handleSelect = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="dashboard">
      <header>
        <h1>User Dashboard</h1>
        <p>
          Search for users by ID, view details, or manage data with edit and
          delete options.
        </p>
      </header>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter User ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="multi-delete">
        <button onClick={handleMultiDelete} disabled={!selectedUsers.length}>
          Delete Selected
        </button>
      </div>

      <div className="user-list">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onDelete={handleDelete}
              onSelect={handleSelect}
              isSelected={selectedUsers.includes(user.id)}
            />
          ))
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
