import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/App.css'; 

const LifeCycle = () => {
    const [batches, setBatches] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState('');
    const [updateData, setUpdateData] = useState({
        currentStage: 'Germination',
        healthStatus: 'Excellent',
        observation: '',
        height: ''
    });

    const fetchBatches = () => {
        axios.get('http://localhost:5000/api/batches/tracking-list')
            .then(res => {
                setBatches(res.data);
            })
            .catch(err => {
                console.error("Atlas Connection Error:", err);
            });
    };

    useEffect(() => {
        fetchBatches();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!selectedBatch) return alert("Please select a specific batch to update.");
        
        try {
            await axios.put(`http://localhost:5000/api/batches/update-health/${selectedBatch}`, updateData);
            alert("Plant life-cycle records updated successfully! 🌱");
            fetchBatches();
        } catch (err) { 
            console.error("Update error:", err);
            alert(err.response?.data?.message || "Failed to update record. Check server connection."); 
        }
    };

    return (
        <div className="lifecycle-container">
            <h2 className="text-green">🌱 Life-Cycle & Health Management</h2>
            
            [Image of plant growth stages flowchart]

            <div className="lifecycle-form-card">
                <h3>Log Health & Growth Progress</h3>
                <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <select className="lifecycle-select" onChange={(e) => setSelectedBatch(e.target.value)} required>
                        <option value="">-- Select Active Batch --</option>
                        {batches.map(b => (
                            <option key={b._id} value={b._id}>
                                {b.batchNumber} - {b.seedName || b.seedId?.name || "Inventory Item"}
                            </option>
                        ))}
                    </select>

                    <select className="lifecycle-select" onChange={(e) => setUpdateData({...updateData, currentStage: e.target.value})}>
                        <option value="Germination">Germination</option>
                        <option value="Seedling">Seedling</option>
                        <option value="Vegetative">Vegetative</option>
                        <option value="Flowering">Flowering</option>
                        <option value="Ready for Sale">Ready for Sale</option>
                    </select>

                    <input className="lifecycle-input" type="text" placeholder="Current Height (cm)" onChange={(e) => setUpdateData({...updateData, height: e.target.value})} />
                    
                    <textarea className="lifecycle-textarea" placeholder="Add growth observations (e.g. leaf color, soil moisture)" onChange={(e) => setUpdateData({...updateData, observation: e.target.value})}></textarea>
                    
                    <button type="submit" className="btn-primary">Update Health Log</button>
                </form>
            </div>

            <div className="lifecycle-table-container">
                <h3>Live Growth Inventory (Cloud Sync)</h3>
                <table className="lifecycle-table">
                    <thead>
                        <tr>
                            <th>Batch ID</th>
                            <th>Plant Name</th>
                            <th>Current Stage</th>
                            <th>Health Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {batches.length > 0 ? batches.map(b => (
                            <tr key={b._id}>
                                <td><strong>{b.batchNumber}</strong></td>
                                <td>{b.seedName || b.seedId?.name || "N/A"}</td>
                                <td><span className="status-badge">{b.currentStage}</span></td>
                                <td className={b.healthStatus?.toLowerCase() === 'poor' ? 'health-poor' : 'health-excellent'}>
                                    {b.healthStatus || "Healthy"}
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="4" style={{textAlign: 'center', padding: '20px'}}>No active plant batches found in cloud database.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LifeCycle;