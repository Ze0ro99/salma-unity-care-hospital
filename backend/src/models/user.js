const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the User schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Email format validation
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6, // Minimum password length
    },
    role: {
        type: String,
        enum: ['patient', 'doctor', 'admin'], // User roles
        default: 'patient',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Pre-save hook to hash the password before saving the user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // Only hash the password if it has been modified
    this.password = await bcrypt.hash(this.password, 10); // Hash the password with a salt round of 10
    next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password); // Compare the candidate password with the hashed password
};

// Create the User model
const User = mongoose.model('User ', userSchema);

module.exports = User; // Export the User model
