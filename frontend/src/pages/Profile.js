import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom'; 
import '../styles/App.css';

const Profile = () => {
    const userId = localStorage.getItem('id') || localStorage.getItem('userId');
    const location = useLocation(); 
    const navigate = useNavigate();
    
    const targetOrderId = location.state?.targetOrderId;
    
    const [profileData, setProfileData] = useState({
        name: '',
        mobile: '',
        pincode: '',
        address: ''
    });
    
    const [totalOrders, setTotalOrders] = useState(0);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!userId) return;
            try {
                const res = await axios.get(`http://localhost:5000/api/auth/user-profile/${userId}`);
                
                if (res.data && res.data.user) {
                    setProfileData({
                        name: res.data.user.name || '',
                        mobile: res.data.user.mobile || '',
                        pincode: res.data.user.pincode || '',
                        address: res.data.user.address || ''
                    });
                    setTotalOrders(res.data.orderCount || 0);
                }
            } catch (err) {
                console.log("Profile load error.");
            }
        };
        fetchProfile();
    }, [userId]);

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        try {
            
            await axios.put(`http://localhost:5000/api/auth/update-profile/${userId}`, profileData);

            
            if (targetOrderId) {
                const fullAddressString = `${profileData.address}, Pincode: ${profileData.pincode}, Mobile: ${profileData.mobile}`;
                
                await axios.put(`http://localhost:5000/api/inventory/update-address/${targetOrderId}`, { 
                    newAddress: fullAddressString 
                });
                
                alert("Order Address and Profile Updated Successfully! ✅");
                navigate('/orders'); 
            } else {
                alert("Profile Details Saved Successfully! ✅");
            }
        } catch (err) {
            alert("Update fail.");
        }
    };

    return (
        <div className="profile-page-container">
            <div className="profile-header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 className="text-green">
                    {targetOrderId ? 'Update Order Address' : '👤 My Profile'}
                </h2>
                <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '5px 15px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>
                    Total Orders: {totalOrders}
                </div>
            </div>
            
            {targetOrderId && (
                <div style={{ background: '#fff3e0', padding: '10px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #ffe0b2', color: '#e65100', fontSize: '13px' }}>
                    <strong>Note:</strong>  (ID: ${targetOrderId.slice(-6)})
                </div>
            )}
            
            <p style={{fontSize: '14px', color: '#666', marginBottom: '20px'}}>
                 Permanent delivery address .
            </p>
            
            <form onSubmit={handleSaveProfile} className="custom-form profile-form">
                <div className="form-group">
                    <label>Full Name *</label>
                    <input 
                        type="text" 
                        className="login-input" 
                        value={profileData.name} 
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})} 
                        required 
                    />
                </div>

                <div className="form-group">
                    <label>Mobile Number *</label>
                    <input 
                        type="number" 
                        className="login-input" 
                        value={profileData.mobile} 
                        onChange={(e) => setProfileData({...profileData, mobile: e.target.value})} 
                        required 
                    />
                </div>

                <div className="form-group">
                    <label>Pincode *</label>
                    <input 
                        type="number" 
                        className="login-input" 
                        value={profileData.pincode} 
                        onChange={(e) => setProfileData({...profileData, pincode: e.target.value})} 
                        required 
                    />
                </div>

                <div className="form-group">
                    <label>Complete Delivery Address *</label>
                    <textarea 
                        className="login-input" 
                        style={{height: '100px', paddingTop: '10px'}} 
                        value={profileData.address} 
                        onChange={(e) => setProfileData({...profileData, address: e.target.value})} 
                        required 
                        placeholder="House No, Area, City, State..."
                    />
                </div>

                <button type="submit" className="btn-save-profile">
                    {targetOrderId ? 'Update Order & Profile' : 'Save Delivery Details'}
                </button>
            </form>
        </div>
    );
};

export default Profile;