// DOM Elements
const openingScreen = document.getElementById('openingScreen');
const authContainer = document.getElementById('authContainer');
const authForm = document.getElementById('authForm');
const welcomeHeader = document.getElementById('welcomeHeader');
const welcomeSub = document.getElementById('welcomeSub');
const usernameGroup = document.getElementById('usernameGroup');
const loginExtras = document.getElementById('loginExtras');
const termsGroup = document.getElementById('termsGroup');
const submitBtn = document.getElementById('submitBtn');
const switchModeBtn = document.getElementById('switchMode');
const switchText = document.getElementById('switchText');
const termsModal = document.getElementById('termsModal');
const showTermsBtn = document.getElementById('showTerms');
const closeModalBtn = document.querySelector('.close-modal');
const acceptTermsBtn = document.querySelector('.accept-terms');
const termsCheckbox = document.getElementById('terms');
const togglePasswordBtn = document.querySelector('.toggle-password');
const passwordInput = document.getElementById('password');

// State
let isLoginMode = true;
let passwordVisible = false;

// Functions
function showAuth(mode) {
    openingScreen.style.display = 'none';
    authContainer.style.display = 'block';
    isLoginMode = mode === 'login';
    updateAuthUI();
}

function updateAuthUI() {
    welcomeHeader.textContent = isLoginMode ? 
        'Selamat datang kembali' : 
        'Hai, silakan daftar';
    welcomeSub.textContent = isLoginMode ? 
        'di Thriftify! 👋' : 
        'untuk masuk ke Thriftify!';
    submitBtn.textContent = isLoginMode ? 'Masuk' : 'Daftar';
    switchText.textContent = isLoginMode ? 
        'Belum memiliki akun?' : 
        'Sudah memiliki akun?';
    switchModeBtn.textContent = isLoginMode ? 'Daftar di sini' : 'Masuk di sini';
    
    usernameGroup.style.display = isLoginMode ? 'none' : 'block';
    loginExtras.style.display = isLoginMode ? 'flex' : 'none';
    termsGroup.style.display = isLoginMode ? 'none' : 'block';
    
    authForm.reset();
}

function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    updateAuthUI();
}

function togglePassword() {
    passwordVisible = !passwordVisible;
    passwordInput.type = passwordVisible ? 'text' : 'password';
    togglePasswordBtn.innerHTML = passwordVisible ? 
        '<i class="fa-regular fa-eye-slash"></i>' : 
        '<i class="fa-regular fa-eye"></i>';
}

function showTermsModal() {
    termsModal.style.display = 'flex';
}

function closeTermsModal() {
    termsModal.style.display = 'none';
}

function acceptTerms() {
    termsCheckbox.checked = true;
    closeTermsModal();
}

function handleSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(authForm);
    const data = Object.fromEntries(formData);
    
    if (!data.email || !data.password) {
        alert('Mohon lengkapi semua field yang diperlukan');
        return;
    }
    
    if (!isLoginMode) {
        if (!data.username) {
            alert('Username wajib diisi');
            return;
        }
        if (!termsCheckbox.checked) {
            alert('Anda harus menyetujui syarat dan ketentuan');
            return;
        }
    }
    
    console.log('Form submitted:', data);
    // Add your API call here
}

// Event Listeners
switchModeBtn.addEventListener('click', toggleAuthMode);
togglePasswordBtn.addEventListener('click', togglePassword);
showTermsBtn.addEventListener('click', showTermsModal);
closeModalBtn.addEventListener('click', closeTermsModal);
acceptTermsBtn.addEventListener('click', acceptTerms);
authForm.addEventListener('submit', handleSubmit);

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === termsModal) {
        closeTermsModal();
    }
});