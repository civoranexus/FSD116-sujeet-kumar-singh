document.getElementById('multi-role-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Form se role aur email fetch karna
    const role = document.getElementById('user-role').value;
    const email = document.querySelector('input[type="email"]').value;
    const userName = email.split('@')[0]; // Email se naam nikalne ke liye

    if (role === 'admin') {
        alert("Welcome, Chief!");
        window.location.href = 'index.html#dashboard-section'; 
    } 
    else if (role === 'staff') {
        alert("Hello " + userName );
        window.location.href = 'index.html#inventory-preview';
    } 
    else if (role === 'customer') {
        alert("Welcome to our Nursery, " + userName + "! Happy Planting!");
        window.location.href = 'index.html#home';
    }
});