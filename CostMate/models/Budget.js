const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    period: {
        type: String,
        enum: ['Weekly', 'Monthly', 'Yearly'],
        default: 'Monthly'
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Budget', BudgetSchema);