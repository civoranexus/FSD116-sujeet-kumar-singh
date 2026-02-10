import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom'; 
import '../styles/App.css';

const Profile = () => {
    const userId = localStorage.getItem('userId'); 
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
                const res = await axios.get(`/api/auth/user-profile/${userId}`);
                
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
                console.error("Profile load error: Check Atlas connection.");
            }
        };
        fetchProfile();
    }, [userId]);

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/auth/update-profile/${userId}`, profileData);

            if (targetOrderId) {
                const fullAddressString = `${profileData.address}, Pincode: ${profileData.pincode}, Mobile: ${profileData.mobile}`;
                
                await axios.put(`/api/inventory/update-address/${targetOrderId}`, { 
                    newAddress: fullAddressString 
                });
                
                alert("Delivery Address and Profile Updated Successfully! ✅");
                navigate('/orders'); 
            } else {
                alert("Account Settings Saved Successfully! ✅");
            }
        } catch (err) {
            alert(err.response?.data?.message || "Update process failed. Please try again.");
        }
    };

    return (
        <div className="profile-page-container">
            <div className="profile-header-flex">
                <h2 className="text-green">
                    {targetOrderId ? 'Update Shipping Destination' : '👤 Personal Profile'}
                </h2>
                <div className="order-badge">
                    Total Purchases: {totalOrders}
                </div>
            </div>
            
            

            {targetOrderId && (
                <div className="alert-box-warning">
                    <strong>Updating Address for Order ID:</strong> (Ending in...${targetOrderId.slice(-6)})
                </div>
            )}
            
            <p className="sub-text">
                Manage your primary delivery address and contact information for seamless order processing.
            </p>
            
            <form onSubmit={handleSaveProfile} className="custom-form profile-form">
                <div className="form-group">
                    <label>Full Legal Name *</label>
                    <input 
                        type="text" 
                        className="login-input" 
                        value={profileData.name} 
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})} 
                        required 
                        placeholder="Enter your full name"
                    />
                </div>

                <div className="form-group">
                    <label>Contact Number *</label>
                    <input 
                        type="number" 
                        className="login-input" 
                        value={profileData.mobile} 
                        onChange={(e) => setProfileData({...profileData, mobile: e.target.value})} 
                        required 
                        placeholder="10-digit mobile number"
                    />
                </div>

                <div className="form-group">
                    <label>Area Pincode *</label>
                    <input 
                        type="number" 
                        className="login-input" 
                        value={profileData.pincode} 
                        onChange={(e) => setProfileData({...profileData, pincode: e.target.value})} 
                        required 
                        placeholder="e.g. 844101"
                    />
                </div>

                <div className="form-group">
                    <label>Comprehensive Delivery Address *</label>
                    <textarea 
                        className="login-input text-area-input" 
                        value={profileData.address} 
                        onChange={(e) => setProfileData({...profileData, address: e.target.value})} 
                        required 
                        placeholder="House Number, Street Name, Landmark, City, State..."
                    />
                </div>

                <button type="submit" className="btn-primary">
                    {targetOrderId ? 'Sync Address & Proceed' : 'Save Profile Changes'}
                </button>
            </form>
        </div>
    );
};

export default Profile;