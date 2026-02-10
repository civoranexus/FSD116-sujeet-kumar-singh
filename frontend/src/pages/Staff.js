import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/App.css';

const Staff = () => {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', mobile: '' });

    const fetchUsers = async () => {
        try {
            const res = await axios.get('/api/auth/users');
            setUsers(res.data);
        } catch (err) { 
            console.error("Database Connection Error:", err); 
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleRemoveStaff = async (id) => {
        if (window.confirm("Are you sure you want to remove this staff member from the system?")) {
            try {
                await axios.delete(`/api/auth/delete-staff/${id}`);
                alert("Staff Access Revoked Successfully! ✅");
                fetchUsers(); 
            } catch (err) {
                alert(err.response?.data?.message || "Internal server error while removing staff.");
            }
        }
    };

    const handleAddStaff = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/auth/add-staff', formData);
            alert("New Staff Member Registered! 🌱");
            setFormData({ name: '', email: '', password: '', mobile: '' });
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.message || "Registration failed. Check if email already exists.");
        }
    };

    return (
        <div className="staff-management-container" style={{ padding: '30px' }}>
            <h2 className="text-green">👥 Human Resource & Staff Management</h2>

            <div className="form-card" style={{ background: '#e8f5e9', padding: '25px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                <h3>➕ Onboard New Staff</h3>
                <form onSubmit={handleAddStaff} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '15px' }}>
                    <input className="login-input" style={{flex: '1', minWidth: '200px'}} placeholder="Full Legal Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                    <input className="login-input" style={{flex: '1', minWidth: '200px'}} placeholder="Corporate Email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                    <input className="login-input" style={{flex: '1', minWidth: '200px'}} placeholder="Secure Password" type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
                    <input className="login-input" style={{flex: '1', minWidth: '200px'}} placeholder="Contact Number" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} />
                    <button className="btn-primary" style={{width: '180px', height: '45px'}} type="submit">Register Staff</button>
                </form>
            </div>

            <div className="table-container">
                <table className="custom-table" style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                    <thead style={{ background: '#2e7d32', color: 'white' }}>
                        <tr>
                            <th style={{padding: '15px', textAlign: 'left'}}>Full Name</th>
                            <th style={{padding: '15px', textAlign: 'left'}}>Email Address</th>
                            <th style={{padding: '15px', textAlign: 'left'}}>System Role</th>
                            <th style={{padding: '15px', textAlign: 'center'}}>Access Control</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u._id} style={{borderBottom: '1px solid #eee'}}>
                                <td style={{padding: '12px'}}>{u.name}</td>
                                <td style={{padding: '12px'}}>{u.email}</td>
                                <td style={{padding: '12px'}}><span className={`role-badge ${u.role}`}>{u.role.toUpperCase()}</span></td>
                                <td style={{padding: '12px', textAlign: 'center'}}>
                                    {u.role !== 'admin' ? (
                                        <button 
                                            onClick={() => handleRemoveStaff(u._id)}
                                            className="btn-remove"
                                            style={{ background: '#ff1744', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                                        >
                                            Deactivate 🗑️
                                        </button>
                                    ) : (
                                        <span style={{ color: '#888', fontStyle: 'italic', fontSize: '13px' }}>Administrative Lock 🔒</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Staff;