document.addEventListener('DOMContentLoaded', function() {
    const CONFIG = {
        MIN_PASSWORD_LENGTH: 8,
        API_BASE_URL: '/api/auth', 
        ENDPOINTS: {
            LOGIN: '/login',
            REGISTER: '/register'
        },
        REDIRECT_URL: '/landingPage.html'  
    };  

    class AuthManager {
        constructor() {
            this.isLoginPage = window.location.pathname.includes('login');
            this.form = document.querySelector('form');
            this.setupEventListeners();
            this.loadRememberedEmail();
        }

        setupEventListeners() {
            // Password visibility toggle
            const toggleBtn = document.querySelector('.toggle-password');
            const passwordInput = document.getElementById('password');
            if (toggleBtn && passwordInput) {
                toggleBtn.addEventListener('click', () => this.togglePasswordVisibility(passwordInput, toggleBtn));
            }

            // Form submission
            if (this.form) {
                this.form.addEventListener('submit', (e) => this.handleSubmit(e));
            }

            // Terms and conditions
            const termsCheck = document.querySelector('.terms-check');
            if (termsCheck) {
                this.setupTermsHandler(termsCheck);
            }
        }

        togglePasswordVisibility(input, button) {
            const isVisible = input.type === 'text';
            input.type = isVisible ? 'password' : 'text';
            button.innerHTML = this.getEyeIcon(isVisible);
        }

        getEyeIcon(isVisible) {
            return isVisible ? 
                `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>` :
                `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>`;
        }

        validateEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        validatePassword(password) {
            return {
                isValid: password.length >= CONFIG.MIN_PASSWORD_LENGTH,
                message: password.length < CONFIG.MIN_PASSWORD_LENGTH ? 
                    `Password minimal ${CONFIG.MIN_PASSWORD_LENGTH} karakter` : ''
            };
        }

        showError(message, fieldId = null) {
            // Create or update error message element
            const errorId = fieldId ? `${fieldId}-error` : 'form-error';
            let errorElement = document.getElementById(errorId);
            
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.id = errorId;
                errorElement.className = 'error-message';
                
                if (fieldId) {
                    const field = document.getElementById(fieldId);
                    field.parentNode.appendChild(errorElement);
                } else {
                    this.form.insertBefore(errorElement, this.form.firstChild);
                }
            }

            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }

        clearErrors() {
            const errors = document.querySelectorAll('.error-message');
            errors.forEach(error => error.style.display = 'none');
        }

        async handleSubmit(e) {
            e.preventDefault();
            this.clearErrors();
        
            const formData = this.getFormData();
            if (!this.validateForm(formData)) return;
        
            try {
                this.setLoading(true);
                const endpoint = this.isLoginPage ? 'login' : 'register';
                
                // Tambahkan logging untuk debug
                console.log('Sending request to:', endpoint);
                console.log('Request data:', formData);
                
                const response = await this.makeApiCall(endpoint, formData);
                
                console.log('Response received:', response);
                await this.handleResponse(response, formData.email);
                
            } catch (error) {
                console.error('Error details:', error);
                this.showError(error.message || 'Terjadi kesalahan, silakan coba lagi');
            } finally {
                this.setLoading(false);
            }
        }

        getFormData() {
            const data = {
                email: document.getElementById('email').value.trim(),
                password: document.getElementById('password').value
            };
        
            // Validasi dasar
            if (!data.email || !data.password) {
                throw new Error('Email dan password harus diisi');
            }
        
            if (!this.isLoginPage) {
                const username = document.getElementById('username')?.value.trim();
                const fullName = document.getElementById('fullName')?.value.trim();
                
                if (!username || !fullName) {
                    throw new Error('Semua field harus diisi');
                }
                
                Object.assign(data, { username, fullName });
            }
        
            return data;
        }

        validateForm(data) {
            if (!this.validateEmail(data.email)) {
                this.showError('Format email tidak valid', 'email');
                return false;
            }

            const passwordValidation = this.validatePassword(data.password);
            if (!passwordValidation.isValid) {
                this.showError(passwordValidation.message, 'password');
                return false;
            }

            if (!this.isLoginPage) {
                if (!data.username || !data.fullName) {
                    this.showError('Mohon lengkapi semua field');
                    return false;
                }

                const termsCheckbox = document.getElementById('terms');
                if (!termsCheckbox?.checked) {
                    this.showError('Anda harus menyetujui syarat dan ketentuan');
                    return false;
                }
            }

            return true;
        }

        async makeApiCall(endpoint, data) {
            const url = `${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS[endpoint.toUpperCase()]}`;
            
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'  // Tambahkan header ini
                    },
                    body: JSON.stringify(data)
                });
        
                // Tangani response non-JSON
                let responseData;
                const contentType = response.headers.get('content-type');
                
                if (contentType && contentType.includes('application/json')) {
                    responseData = await response.json();
                } else {
                    const textResponse = await response.text();
                    throw new Error(`Server returned non-JSON response: ${textResponse}`);
                }
        
                if (!response.ok) {
                    throw new Error(responseData.error || responseData.message || 'Terjadi kesalahan pada server');
                }
        
                return responseData;
            } catch (error) {
                if (error.name === 'SyntaxError') {
                    throw new Error('Response server tidak valid');
                }
                throw new Error(error.message || `Gagal melakukan ${endpoint}`);
            }
        }

        async handleResponse(response, email) {
            if (response.token) {
                // Securely store the token
                this.saveToken(response.token);
                
                // Handle "Remember me" for login
                if (this.isLoginPage && document.getElementById('remember')?.checked) {
                    // Store hashed email instead of raw email
                    const hashedEmail = await this.hashString(email);
                    localStorage.setItem('rememberedEmail', hashedEmail);
                }

                window.location.href = CONFIG.REDIRECT_URL;
            }
        }

        async hashString(str) {
            const encoder = new TextEncoder();
            const data = encoder.encode(str);
            const hash = await crypto.subtle.digest('SHA-256', data);
            return Array.from(new Uint8Array(hash))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');
        }

        saveToken(token) {
            // Store token in httpOnly cookie instead of localStorage
            document.cookie = `auth_token=${token}; path=/; secure; samesite=strict`;
        }

        loadRememberedEmail() {
            if (this.isLoginPage) {
                const rememberedEmail = localStorage.getItem('rememberedEmail');
                if (rememberedEmail) {
                    // Implement proper email recovery here
                    document.getElementById('email').value = rememberedEmail;
                    document.getElementById('remember').checked = true;
                }
            }
        }

        setLoading(isLoading) {
            const submitBtn = this.form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = isLoading;
                submitBtn.innerHTML = isLoading ? 
                    '<span class="spinner"></span> Memproses...' : 
                    this.isLoginPage ? 'Masuk' : 'Daftar';
            }
        }

        setupTermsHandler(termsCheck) {
            const termsText = termsCheck.querySelector('span');
            if (termsText) {
                termsText.addEventListener('click', (e) => {
                    if (e.target.tagName !== 'INPUT') {
                        this.showTermsModal();
                    }
                });
            }
        }

        showTermsModal() {
            // Implement a proper modal for terms & conditions
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <h2>Syarat dan Ketentuan</h2>
                    <div class="modal-body">
                        <!-- Add terms content here -->
                    </div>
                    <button onclick="this.parentElement.parentElement.remove()">Tutup</button>
                </div>
            `;
            document.body.appendChild(modal);
        }
    }

    // Initialize authentication manager
    new AuthManager();
});