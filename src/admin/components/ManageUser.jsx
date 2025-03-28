import React from 'react';
import UserList from './UserList';

const ManageUser = () => {
    return (
        <div>
            <h1>Manage Users</h1>
            <UserList />
            <button>Add User</button>
            {/* Additional functionality can be added here */}
        </div>
    );
};

export default ManageUser;
