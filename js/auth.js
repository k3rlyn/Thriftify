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
                '<i class="fa-regular fa-eye"></i>' : 
                '<i class="fa-regular fa-eye-slash"></i>';
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