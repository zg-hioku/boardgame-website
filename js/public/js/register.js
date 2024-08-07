document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;

    const response = await fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();
    if (result.success) {
        alert('Registration successful!');
        window.location.href = 'login.html';
    } else {
        alert(result.message);
    }
});

document.getElementById('loginButton').addEventListener('click', function() {
    window.location.href = 'login.html';
});
