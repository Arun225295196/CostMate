const Expense = require('../models/Expense');
const Budget = require('../models/Budget');
const Notification = require('../models/Notification');

exports.getDashboardData = async (userId) => {
    try {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        
        const monthlyStats = await Expense.aggregate([
            {
                $match: {
                    user: userId,
                    date: { $gte: startOfMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' },
                    count: { $sum: 1 },
                    avgExpense: { $avg: '$amount' }
                }
            }
        ]);
        
        const categoryBreakdown = await Expense.aggregate([
            {
                $match: {
                    user: userId,
                    date: { $gte: startOfMonth }
                }
            },
            {
                $group: {
                    _id: '$category',
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { total: -1 } }
        ]);
        
        return {
            monthlyTotal: monthlyStats[0]?.total || 0,
            expenseCount: monthlyStats[0]?.count || 0,
            avgExpense: monthlyStats[0]?.avgExpense || 0,
            categoryBreakdown
        };
    } catch (err) {
        console.error('Dashboard data error:', err);
        return {
            monthlyTotal: 0,
            expenseCount: 0,
            avgExpense: 0,
            categoryBreakdown: []
        };
    }
};

module.exports = exports;
