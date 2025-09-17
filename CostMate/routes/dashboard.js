const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Expense = require('../models/Expense');
<<<<<<< HEAD

// Dashboard home
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        // Get recent expenses for the user
        const expenses = await Expense.find({ user: req.user.id })
            .sort({ date: -1 })
            .limit(10);
        
        // Calculate monthly total
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const monthlyExpenses = expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
        });

        const monthlyTotal = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);

        res.render('dashboard', { 
            user: req.user,
            expenses: expenses,
            monthlyTotal: monthlyTotal
        });
    } catch (error) {
        console.error(error);
        res.render('dashboard', { 
            user: req.user,
            expenses: [],
            monthlyTotal: 0
=======
const Budget = require('../models/Budget');
const Notification = require('../models/Notification');

// Dashboard
router.get('/', ensureAuthenticated, async (req, res) => {
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
        console.error(err);
        res.render('dashboard', {
            title: 'Dashboard - CostMate',
            user: req.user,
            expenses: [],
            monthlyTotal: 0,
            categoryBreakdown: [],
            budgets: [],
            notifications: []
>>>>>>> e1b026d2f834834f296bc9178de6330ffc3dae8d
        });
    }
});

<<<<<<< HEAD
module.exports = router;
=======
module.exports = router;

>>>>>>> e1b026d2f834834f296bc9178de6330ffc3dae8d
