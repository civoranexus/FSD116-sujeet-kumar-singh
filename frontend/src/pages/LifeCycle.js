import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LifeCycle = () => {
    const [batches, setBatches] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState('');
    const [updateData, setUpdateData] = useState({
        currentStage: 'Germination',
        healthStatus: 'Excellent',
        observation: '',
        height: ''
    });

    useEffect(() => {
        axios.get('http://localhost:5000/api/batches/tracking-list')
            .then(res => setBatches(res.data))
            .catch(err => console.log(err));
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/batches/update-health/${selectedBatch}`, updateData);
            alert("Life-cycle updated successfully!");
        } catch (err) { alert("Update failed"); }
    };

    return (
        <div className="lifecycle-container" style={{ padding: '20px' }}>
            <h2>🌱 Plant Life-Cycle & Health Tracking</h2>
            <form onSubmit={handleUpdate} className="report-card" style={{ marginBottom: '20px' }}>
                <select onChange={(e) => setSelectedBatch(e.target.value)} required>
                    <option value="">Select Batch to Update</option>
                    {batches.map(b => (
                        <option key={b._id} value={b._id}>{b.batchNumber} - {b.seedId?.name}</option>
                    ))}
                </select>
                <select onChange={(e) => setUpdateData({...updateData, currentStage: e.target.value})}>
                    <option value="Germination">Germination</option>
                    <option value="Seedling">Seedling</option>
                    <option value="Vegetative">Vegetative</option>
                    <option value="Ready for Sale">Ready for Sale</option>
                </select>
                <input type="text" placeholder="Height (cm)" onChange={(e) => setUpdateData({...updateData, height: e.target.value})} />
                <textarea placeholder="Observations..." onChange={(e) => setUpdateData({...updateData, observation: e.target.value})}></textarea>
                <button type="submit" className="login-btn">Save Health Log</button>
            </form>

            <div className="report-card">
                <h3>Live Batch Status</h3>
                <table className="proc-table">
                    <thead>
                        <tr><th>Batch</th><th>Plant</th><th>Stage</th><th>Health</th></tr>
                    </thead>
                    <tbody>
                        {batches.map(b => (
                            <tr key={b._id}>
                                <td>{b.batchNumber}</td>
                                <td>{b.seedId?.name}</td>
                                <td><span className="badge-stage">{b.currentStage}</span></td>
                                <td style={{ color: b.healthStatus === 'Poor' ? 'red' : 'green' }}>{b.healthStatus}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LifeCycle;