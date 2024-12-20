const form = document.getElementById('edit-profile-form');
form.addEventListener('submit', (event) => {
    event.preventDefault();

    // Ambil data dari form
    const formData = new FormData(form);

    // Kirim data ke server menggunakan fetch API atau library lain
    fetch('/api/update-profile', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Data berhasil dikirim:', data);
        // Tampilkan pesan sukses atau lakukan tindakan lain
    })
    .catch(error => {
        console.error('Terjadi kesalahan:', error);
        // Tampilkan pesan error
    });
});