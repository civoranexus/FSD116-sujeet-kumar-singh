import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Staff = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/auth/users');
                setUsers(res.data);
            } catch (err) {
                console.error("User list load nahi hui", err);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div style={{ padding: '30px' }}>
            <h2 style={{ color: '#2e7d32' }}>Registered Staff & Admins</h2>
            <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#2e7d32', color: 'white' }}>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u._id}>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>{u.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Staff;