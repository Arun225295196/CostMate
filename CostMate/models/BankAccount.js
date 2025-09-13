// models/BankAccount.js
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
        enum: ['Checking', 'Savings', 'Credit Card'],
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
    isConnected: {
        type: Boolean,
        default: false
    },
    lastSync: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('BankAccount', BankAccountSchema);