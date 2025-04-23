document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    try {
      const response = await fetch('http://localhost:5000/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Login failed:', errorText);
        alert('Login failed');
        return;
      }

      const data = await response.json();
      console.log('Login success:', data);
      alert('Login successful!');
    } catch (err) {
      console.error('Error during login:', err);
      alert('Network error during login');
    }
  });
});
