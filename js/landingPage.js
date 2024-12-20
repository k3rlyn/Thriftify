document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (!token) {
        // Redirect ke halaman login jika tidak ada token
        window.location.href = 'https://thriftify.vercel.app/auth/login.html';
    }
});