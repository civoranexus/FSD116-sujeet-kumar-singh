async function saveData() {
    const seedData = {
        
        Item: document.getElementById('Itam ID').value,
        name: document.getElementById('name').value,
        Category: document.getElementById('Category').value,
        price: document.getElementById('price').value,
        stockQuantity: document.getElementById('stock').value,
    };

    const response = await fetch("http://localhost:5000/api/seeds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(seedData)
    });

    if (response.ok) {
        alert("Seed saved!");
        getInventory(); 
    }
}