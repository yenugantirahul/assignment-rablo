import React, { useState, useEffect } from "react";
import axios from "axios";
import UserCard from "./UserCard";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Use localStorage to persist deleted user IDs across page reloads
  const [deletedIds, setDeletedIds] = useState(() => {
    const savedDeletedIds = localStorage.getItem("deletedUserIds");
    return savedDeletedIds ? JSON.parse(savedDeletedIds) : [];
  });

  useEffect(() => {
    // Save deleted IDs to localStorage whenever they change
    localStorage.setItem("deletedUserIds", JSON.stringify(deletedIds));
  }, [deletedIds]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/users"
        );
        // Completely filter out deleted users
        const availableUsers = response.data.filter(
          (user) => !deletedIds.includes(user.id)
        );
        setUsers(availableUsers);
        setFilteredUsers(availableUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [deletedIds]);

  const handleSearch = () => {
    if (searchId) {
      const searchResults = users.filter(
        (user) => user.id === parseInt(searchId, 10)
      );
      setFilteredUsers(searchResults);
    } else {
      setFilteredUsers(users);
    }
  };

  const handleDelete = (id) => {
    // Update deletedIds state
    setDeletedIds((prevDeletedIds) => [...prevDeletedIds, id]);

    // Remove the user from both users and filteredUsers
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    setFilteredUsers((prevFilteredUsers) =>
      prevFilteredUsers.filter((user) => user.id !== id)
    );
  };

  const handleMultiDelete = () => {
    // Update deletedIds state
    setDeletedIds((prevDeletedIds) => [...prevDeletedIds, ...selectedUsers]);

    // Remove selected users from both users and filteredUsers
    setUsers((prevUsers) =>
      prevUsers.filter((user) => !selectedUsers.includes(user.id))
    );
    setFilteredUsers((prevFilteredUsers) =>
      prevFilteredUsers.filter((user) => !selectedUsers.includes(user.id))
    );

    // Clear selected users
    setSelectedUsers([]);
  };

  const handleSelect = (id) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
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
