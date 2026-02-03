import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/App.css';

const Staff = () => {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', mobile: '' });

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/auth/users');
            setUsers(res.data);
        } catch (err) { console.log(err); }
    };

    useEffect(() => { fetchUsers(); }, []);

    // --- REMOVE STAFF LOGIC ---
    const handleRemoveStaff = async (id) => {
        if (window.confirm("Kya aap wakayi is staff ko nikalna chahte hain?")) {
            try {
                await axios.delete(`http://localhost:5000/api/auth/delete-staff/${id}`);
                alert("Staff Removed! ✅");
                fetchUsers(); // List ko turant update karein
            } catch (err) {
                alert(err.response?.data?.message || "Error removing staff");
            }
        }
    };

    const handleAddStaff = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/add-staff', formData);
            alert("Staff Added!");
            setFormData({ name: '', email: '', password: '', mobile: '' });
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.message || "Error adding staff");
        }
    };

    return (
        <div style={{ padding: '30px' }}>
            <h2 style={{ color: '#2e7d32' }}>👥 Staff Management</h2>

            {/* Add Staff Form Code (Same as before) */}
            <div style={{ background: '#e8f5e9', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
                <h3>Add New Staff Member</h3>
                <form onSubmit={handleAddStaff} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input className="login-input" style={{width: '200px'}} placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                    <input className="login-input" style={{width: '200px'}} placeholder="Email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                    <input className="login-input" style={{width: '200px'}} placeholder="Password" type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
                    <input className="login-input" style={{width: '200px'}} placeholder="Mobile" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} />
                    <button className="login-button" style={{width: '150px'}} type="submit">Add Staff</button>
                </form>
            </div>

            {/* --- Updated Table with Action Column --- */}
            <table border="1" cellPadding="12" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#2e7d32', color: 'white' }}>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u._id}>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td><span className="role-badge">{u.role}</span></td>
                            <td>
                                {u.role !== 'admin' ? (
                                    <button 
                                        onClick={() => handleRemoveStaff(u._id)}
                                        style={{ background: '#ff1744', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}
                                    >
                                        Remove 🗑️
                                    </button>
                                ) : (
                                    <span style={{ color: '#888', fontSize: '12px' }}>Protected</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Staff;