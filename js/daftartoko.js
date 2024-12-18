document.addEventListener('DOMContentLoaded', function() {
    const categorySelection = document.getElementById('categorySelection');
    const selectedCategoriesDisplay = document.getElementById('selectedCategories');
    const selectedCategories = new Set();

    // Kategori Selection Logic
    categorySelection.addEventListener('click', function(event) {
        const categoryItem = event.target.closest('.category-item');
        
        if (categoryItem) {
            const category = categoryItem.getAttribute('data-category');
            
            if (selectedCategories.has(category)) {
                selectedCategories.delete(category);
                categoryItem.classList.remove('selected');
            } else {
                selectedCategories.add(category);
                categoryItem.classList.add('selected');
            }

            // Update selected categories display
            if (selectedCategories.size > 0) {
                selectedCategoriesDisplay.textContent = 
                    'Kategori Dipilih: ' + Array.from(selectedCategories).join(', ');
            } else {
                selectedCategoriesDisplay.textContent = '';
            }
        }
    });

    // Terms Modal Logic
    const termsModal = document.getElementById('termsModal');
    const termsLink = document.getElementById('termsLink');
    const closeModal = document.querySelector('.modal-close');

    // Open modal
    termsLink.addEventListener('click', function() {
        termsModal.style.display = 'flex';
        document.body.classList.add('no-scroll'); // Disable scroll
    });

    // Close modal when clicking X
    closeModal.addEventListener('click', function() {
        termsModal.style.display = 'none';
        document.body.classList.remove('no-scroll'); // Enable scroll
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target == termsModal) {
            termsModal.style.display = 'none';
            document.body.classList.remove('no-scroll'); // Enable scroll
        }
    });

    // Form Submission Logic
    document.getElementById('storeRegistrationForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Validasi input
        const storeName = document.getElementById('storeName');
        const storeDescription = document.getElementById('storeDescription');
        const termsAndConditions = document.getElementById('termsAndConditions');

        let isValid = true;

        // Validasi nama toko
        if (storeName.value.trim() === '') {
            alert('Nama toko harus diisi');
            isValid = false;
        }

        // Validasi deskripsi toko
        if (storeDescription.value.trim() === '') {
            alert('Deskripsi toko harus diisi');
            isValid = false;
        }

        // Validasi kategori (minimal satu)
        if (selectedCategories.size === 0) {
            alert('Pilih minimal satu kategori');
            isValid = false;
        }

        // Validasi syarat dan ketentuan
        if (!termsAndConditions.checked) {
            alert('Anda harus menyetujui Syarat dan Ketentuan');
            isValid = false;
        }

        // Jika semua validasi berhasil
        if (isValid) {
            // Redirect to after_daftartoko.html
            window.location.href = 'after_daftartoko.html';
        }
    });
});