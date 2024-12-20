const { ObjectId } = require('mongodb');

class User {
    constructor(username, email, password, fullName, role = 'user', createdAt = new Date()) {
        this._id = new ObjectId();
        this.username = username;
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.role = role;
        this.createdAt = createdAt;
    }

    static validate(userData) {
        const errors = [];
        
        if (!userData.username || userData.username.length < 3) {
            errors.push('Username harus minimal 3 karakter');
        }
        
        if (!userData.email || !userData.email.includes('@')) {
            errors.push('Email tidak valid');
        }
        
        if (!userData.password || userData.password.length < 6) {
            errors.push('Password harus minimal 6 karakter');
        }

        if (!userData.fullName) {
            errors.push('Nama lengkap harus diisi');
        }
        
        return errors;
    }
}

module.exports = User;