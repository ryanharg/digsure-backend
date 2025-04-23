document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
  
    try {
      const response = await fetch('http://localhost:3000/api/login', {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('Login successful!');
        console.log('Token:', data.tokens.access.token);
        if (response.ok) {
            window.location.href = 'orders.html'; // or dashboard.html if you prefer
          }
          
        // TODO: Redirect or store token
      } else {
        alert(data.message || 'Login failed.');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Something went wrong.');
    }
  });
  