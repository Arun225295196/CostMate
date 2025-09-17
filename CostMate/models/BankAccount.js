const mongoose = require('mongoose');

const BankAccountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    accountName: {
        type: String,
        required: true
    },
    accountType: {
        type: String,
        enum: ['Checking', 'Savings', 'Credit Card', 'Investment'],
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
    currency: {
        type: String,
        default: 'USD'
    },
    bankName: {
        type: String
    },
    accountNumber: {
        type: String // Last 4 digits only for security
    },
    color: {
        type: String,
        default: '#2196F3' // For UI display
    },
    isConnected: {
        type: Boolean,
        default: false
    },
    lastSync: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('BankAccount', BankAccountSchema);

