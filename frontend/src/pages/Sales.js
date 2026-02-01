import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Sales = () => {
    const [seeds, setSeeds] = useState([]);
    const [selectedSeed, setSelectedSeed] = useState('');
    const [quantity, setQuantity] = useState(0);

    useEffect(() => {
        axios.get('http://localhost:5000/api/inventory').then(res => setSeeds(res.data));
    }, []);

    const handleSale = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/inventory/sell/${selectedSeed}`, { sellQuantity: quantity });
            alert("Stock Update ho gaya!");
            window.location.reload(); 
        } catch (err) {
            alert(err.response.data.message);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Sale Seed </h2>
            <form onSubmit={handleSale}>
                <select onChange={(e) => setSelectedSeed(e.target.value)} required style={{padding:'10px', marginRight:'10px'}}>
                    <option value="">Beej Chunein (Select Seed)</option>
                    {seeds.map(s => <option key={s._id} value={s._id}>{s.name} (Stock: {s.quantity})</option>)}
                </select>
                <input type="number" placeholder="Kitna bechna hai?" onChange={(e) => setQuantity(e.target.value)} required style={{padding:'10px', marginRight:'10px'}} />
                <button type="submit" style={{padding:'10px', background:'blue', color:'white'}}>Confirm Sale</button>
            </form>
        </div>
    );
};

export default Sales;