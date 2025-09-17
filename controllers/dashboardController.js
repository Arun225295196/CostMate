const Expense = require('../models/Expense');
const Budget = require('../models/Budget');
const Notification = require('../models/Notification');

exports.getDashboard = async (req, res) => {
    try {
        // Get current month's expenses
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        
        const expenses = await Expense.find({ 
            user: req.user.id,
            date: { $gte: startOfMonth }
        }).sort({ date: -1 }).limit(5);
        
        // Calculate monthly total
        const monthlyTotal = await Expense.aggregate([
            { 
                $match: { 
                    user: req.user._id,
                    date: { $gte: startOfMonth }
                }
            },
            { 
                $group: { 
                    _id: null, 
                    total: { $sum: '$amount' } 
                } 
            }
        ]);
        
        // Get category breakdown
        const categoryBreakdown = await Expense.aggregate([
            { 
                $match: { 
                    user: req.user._id,
                    date: { $gte: startOfMonth }
                }
            },
            { 
                $group: { 
                    _id: '$category', 
                    total: { $sum: '$amount' } 
                } 
            },
            { $sort: { total: -1 } }
        ]);
        
        // Get active budgets
        const budgets = await Budget.find({ 
            user: req.user.id, 
            isActive: true 
        });
        
        // Get unread notifications
        const notifications = await Notification.find({ 
            user: req.user.id, 
            isRead: false 
        }).limit(3);
        
        res.render('dashboard', {
            title: 'Dashboard - CostMate',
            user: req.user,
            expenses,
            monthlyTotal: monthlyTotal[0]?.total || 0,
            categoryBreakdown,
            budgets,
            notifications
        });
    } catch (err) {
        console.error('Dashboard error:', err);
        res.render('dashboard', {
            title: 'Dashboard - CostMate',
            user: req.user,
            expenses: [],
            monthlyTotal: 0,
            categoryBreakdown: [],
            budgets: [],
            notifications: []
        });
    }
};