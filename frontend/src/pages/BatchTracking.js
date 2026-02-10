import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/App.css';

const BatchTracking = () => {
    const [batches, setBatches] = useState([]);
    const [formData, setFormData] = useState({
        batchNumber: '', seedName: '', location: '', growthStatus: 'Sowing'
    });

    const stages = ['Sowing', 'Germination', 'Transplanted', 'Ready to Sell'];

    useEffect(() => { fetchBatches(); }, []);

    const fetchBatches = async () => {
        try {
            const res = await axios.get('/api/batches/tracking-list');
            setBatches(res.data);
        } catch (err) {
            console.error("Error fetching batches:", err);
        }
    };

    const handleAddBatch = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/batches/add', formData);
            alert("New Batch Added! 🌱");
            fetchBatches();
        } catch (err) {
            alert("Error adding batch");
        }
    };

    return (
        <div className="procurement-container">
            <h2 className="text-green">🌱 Batch Health & Life Cycle Tracking</h2>
            <div className="procurement-form-card">
                <form onSubmit={handleAddBatch} className="procurement-grid">
                    <input className="proc-input" placeholder="Batch ID (e.g. B-001)" onChange={e => setFormData({...formData, batchNumber: e.target.value})} required />
                    <input className="proc-input" placeholder="Seed/Plant Name" onChange={e => setFormData({...formData, seedName: e.target.value})} required />
                    <input className="proc-input" placeholder="Location (Bed No)" onChange={e => setFormData({...formData, location: e.target.value})} required />
                    <button type="submit" className="proc-btn">Start Tracking</button>
                </form>
            </div>

            <div className="batch-list">
                {batches.map(batch => (
                    <div key={batch._id} className="batch-card">
                        <div className="batch-info">
                            <h4>{batch.batchNumber} - {batch.seedName}</h4>
                            <span>📍 Location: {batch.location} | 📅 {new Date(batch.plantingDate).toLocaleDateString()}</span>
                        </div>



[Image of plant growth stages diagram]

                        <div className="timeline-wrapper">
                            {stages.map((stage, index) => {
                                const currentIdx = stages.indexOf(batch.growthStatus);
                                return (
                                    <div key={stage} className={`timeline-step ${index <= currentIdx ? 'active' : ''}`}>
                                        <div className="step-circle">{index + 1}</div>
                                        <span className="step-label">{stage}</span>
                                    </div>
                                );
                            })}
                        </div>
                        
                        <div className="batch-actions">
                            <span className={`condition-tag ${batch.condition?.toLowerCase().replace(' ', '-') || 'healthy'}`}>
                                {batch.condition || 'Healthy'}
                            </span>
                            <button className="proc-btn-sm">Update Status</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BatchTracking;