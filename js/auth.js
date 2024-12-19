document.addEventListener('DOMContentLoaded', function() {
    // Check current page
    const isLoginPage = window.location.pathname.includes('login');
    
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

    // Form submission
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Validasi dasar
            if (!data.email || !data.password) {
                alert('Mohon lengkapi semua field yang diperlukan');
                return;
            }
            
            if (!isLoginPage) {
                // Validasi tambahan untuk register
                if (!data.username) {
                    alert('Username wajib diisi');
                    return;
                }
                
                const termsCheckbox = document.getElementById('terms');
                if (!termsCheckbox?.checked) {
                    alert('Anda harus menyetujui syarat dan ketentuan');
                    return;
                }
            }
            
            // Handle form submission
            console.log('Form submitted:', data);
            // Taro untuk api call disini
            
            // Contoh redirect setelah submit berhasil
            // window.location.href = isLoginPage ? '../dashboard/index.html' : 'login.html';
        });
    }

    // Terms & Conditions handling for register page
    const termsCheck = document.querySelector('.terms-check');
    if (termsCheck) {
        const termsText = termsCheck.querySelector('span');
        if (termsText) {
            termsText.addEventListener('click', function() {
                // Handle terms click - bisa menampilkan modal atau redirect ke halaman terms
                console.log('Terms clicked');
                // Implementasi terms & conditions bisa ditambahkan di sini
            });
        }
    }

    // Remember me functionality for login page
    const rememberCheck = document.getElementById('remember');
    if (rememberCheck) {
        rememberCheck.addEventListener('change', function() {
            // Implement remember me logic
            console.log('Remember me:', this.checked);
        });
    }
});