document.addEventListener('DOMContentLoaded', function() {
    const isLoginPage = window.location.pathname.includes('login');
    const API_URL = 'https://thriftify.vercel.app/api/auth';
    
    // Shared DOM Elements
    const form = document.querySelector('form');
    const togglePasswordBtn = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');

    // Function to validate email
    function isValidEmail(email) {
        return email.includes('@');
    }

    // Toggle password visibility
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', function() {
            const isVisible = passwordInput.type === 'text';
            passwordInput.type = isVisible ? 'password' : 'text';
            togglePasswordBtn.innerHTML = isVisible ? 
                `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>` : 
                `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>`;
        });
    }

    // Function to show error message
    function showError(message) {
        alert(message); // Bisa diganti dengan UI yang lebih baik
    }

    // Function to save token to localStorage
    function saveToken(token) {
        localStorage.setItem('token', token);
    }

    // Function to handle API errors
    async function handleResponse(response) {
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Terjadi kesalahan');
        }
        return data;
    }

    // Form submission
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Basic validation
            if (!email || !password) {
                return showError('Mohon lengkapi semua field yang diperlukan');
            }

            if (!isValidEmail(email)) {
                return showError('Format email tidak valid');
            }

            try {
                const endpoint = isLoginPage ? 'login' : 'register';
                const data = { email, password };

                if (!isLoginPage) {
                    // Add register-specific fields
                    const username = document.getElementById('username').value;
                    const fullName = document.getElementById('fullName').value;
                    const termsCheckbox = document.getElementById('terms');

                    if (!username || !fullName) {
                        return showError('Mohon lengkapi semua field');
                    }

                    if (!termsCheckbox?.checked) {
                        return showError('Anda harus menyetujui syarat dan ketentuan');
                    }

                    Object.assign(data, { 
                        username,
                        fullName
                    });
                }

                // Make API call
                const response = await fetch(`${API_URL}/${endpoint}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                const result = await handleResponse(response);

                // Handle successful response
                if (result.token) {
                    saveToken(result.token);
                    
                    // Handle "Remember me" for login
                    if (isLoginPage && document.getElementById('remember')?.checked) {
                        localStorage.setItem('rememberedEmail', email);
                    }

                    // Redirect to dashboard
                    window.location.href = '../pages/landingPage.html';
                }

            } catch (error) {
                console.error('Error:', error);
                showError(error.message || 'Terjadi kesalahan, silakan coba lagi');
            }
        });
    }

    // Load remembered email if exists
    if (isLoginPage) {
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail) {
            document.getElementById('email').value = rememberedEmail;
            document.getElementById('remember').checked = true;
        }
    }

    // Terms & Conditions handling
    const termsCheck = document.querySelector('.terms-check');
    if (termsCheck) {
        const termsText = termsCheck.querySelector('span');
        if (termsText) {
            termsText.addEventListener('click', function(e) {
                if (e.target.tagName !== 'INPUT') {
                    // Handle terms click - bisa menampilkan modal atau redirect
                    alert('Syarat dan ketentuan akan ditampilkan di sini');
                }
            });
        }
    }
});