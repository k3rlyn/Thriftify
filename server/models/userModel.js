const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username harus diisi'],
        unique: true,
        trim: true,
        minlength: [3, 'Username harus minimal 3 karakter']
    },
    email: {
        type: String,
        required: [true, 'Email harus diisi'],
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: 'Email tidak valid'
        }
    },
    password: {
        type: String,
        required: [true, 'Password harus diisi'],
        minlength: [6, 'Password harus minimal 6 karakter'],
        select: false // Password tidak akan diambil kecuali explicit request
    },
    fullName: {
        type: String,
        required: [true, 'Nama lengkap harus diisi'],
        trim: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // Menambahkan createdAt dan updatedAt secara otomatis
});

// Hash password sebelum disimpan
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method untuk verifikasi password
userSchema.methods.matchPassword = async function(enteredPassword) {
    try {
        return await bcrypt.compare(enteredPassword, this.password);
    } catch (error) {
        throw new Error('Error saat verifikasi password');
    }
};

// Method untuk validasi data user
userSchema.statics.validateUser = function(userData) {
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
};

// Virtual field untuk id (jika diperlukan)
userSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

// Konfigurasi untuk mengizinkan virtual fields
userSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret) {
        delete ret._id;
        delete ret.password;
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;