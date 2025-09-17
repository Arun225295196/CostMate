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
        required: true,
        min: 0
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
    },
    notifications: {
        enabled: {
            type: Boolean,
            default: true
        },
        threshold: {
            type: Number,
            default: 80 // Alert when 80% of budget is used
        }
    }
});

BudgetSchema.index({ user: 1, isActive: 1 });

module.exports = mongoose.model('Budget', BudgetSchema);
