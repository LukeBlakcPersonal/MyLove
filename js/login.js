// 🔑 SET YOUR SECRET PASSWORD HERE (change this!)
const CORRECT_PASSWORD = "alcapate"; // 👈 Change this to something meaningful!

document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const input = document.getElementById('passwordInput').value.trim();
    const errorEl = document.getElementById('error');

    if (input === CORRECT_PASSWORD) {
        // Save "login" status
        localStorage.setItem('isLoggedIn', 'true');
        // Redirect to main page
        window.location.href = 'index.html';
    } else {
        errorEl.style.display = 'block';
        document.getElementById('passwordInput').value = '';
        document.getElementById('passwordInput').focus();
    }
});