import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

// Add any custom methods if needed
userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password; // Don't send password in response
    return user;
};

const User = mongoose.model('User', userSchema);

export default User;