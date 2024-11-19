import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/UserCard.css";

const UserCard = ({ user, onDelete, onSelect, isSelected }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/user/${user.id}`);
  };

  return (
    <div className="user-card">
      <div onClick={handleCardClick} className="card-content">
        <h3>{user.name}</h3>
        <p>Email: {user.email}</p>
        <p>City: {user.address.city}</p>
      </div>
      <div className="card-actions">
        <button onClick={() => onDelete(user.id)}>Delete</button>
        <button>Edit</button>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(user.id)}
        />
      </div>
    </div>
  );
};

export default UserCard;
