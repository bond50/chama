import React, { useState } from 'react';
import CreateUser from '../components/CreateUser';

const CreateUserPage = () => {
    const [users, setUsers] = useState([]);

    const handleUserCreated = (newUser) => {
        setUsers([...users, newUser]);
    };

    return (
        <div>
            <CreateUser onUserCreated={handleUserCreated} />
        </div>
    );
};

export default CreateUserPage;
