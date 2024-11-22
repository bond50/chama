import React, { useState, useEffect } from 'react';
import UserList from '../components/UserList';
import { getAllUsers } from '../api';

const UserListPage = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const fetchedUsers = await getAllUsers();
            setUsers(fetchedUsers);
        };

        fetchUsers();
    }, []);

    const handleAssignNumber = async (userId) => {
        try {
            const updatedUser = await fetch(`http://localhost:9000/api/users/${userId}`, {
                method: 'PUT',
            }).then(res => res.json());
            setUsers(users.map(user => (user._id === userId ? updatedUser : user)));
        } catch (error) {
            alert("Error assigning number: " + error.message);
        }
    };

    return (
        <div>
            <h1>User List</h1>
            <UserList users={users} onAssignNumber={handleAssignNumber} />
        </div>
    );
};

export default UserListPage;
