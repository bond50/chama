// src/components/UserList.js

import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../api';

const UserList = ({ onAssignNumber }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await getAllUsers();
      setUsers(fetchedUsers);
    };

    fetchUsers();
  }, []);

  return (
    <div className="user-list">
      <h2>Users List</h2>
      <ul>
        {users.map(user => (
          <li key={user._id}>
            {user.name}
            {user.assignedNumber === null ? (
              <button onClick={() => onAssignNumber(user._id)}>Assign Number</button>
            ) : (
              <span> - Number: {user.assignedNumber}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
