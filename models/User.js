const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin']
    },
    monthlyBudget: {
        type: Number,
        default: 0
    },
    currency: {
        type: String,
        default: 'AUD'
    },
    location: {
        suburb: {
            type: String,
            default: 'Melbourne CBD'
        },
        state: {
            type: String,
            default: 'Victoria'
        },
        postcode: {
            type: String,
            default: '3000'
        }
    },
    household: {
        type: String,
        enum: ['single', 'couple', 'family'],
        default: 'single'
    },
    preferences: {
        compareWithLocal: {
            type: Boolean,
            default: true
        },
        shareAnonymousData: {
            type: Boolean,
            default: false
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('User', UserSchema);