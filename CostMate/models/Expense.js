const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Health', 'Other']
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Other'],
        default: 'Cash'
    }
});

module.exports = mongoose.model('Expense', ExpenseSchema);