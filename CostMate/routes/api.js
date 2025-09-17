const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Expense = require('../models/Expense');
const AITipsEngine = require('../utils/aiTips');

<<<<<<< HEAD
// Dashboard overview
router.get('/dashboard/overview', ensureAuthenticated, async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id });
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const monthlyExpenses = expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
        });

        const monthlyTotal = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        const recentTransactions = expenses.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

        res.json({
            monthlyTotal,
            budgetPercentage: 75, // Placeholder
            recentTransactions
        });
    } catch (error) {
        console.error(error);
=======
// API endpoint for dashboard data
router.get('/dashboard/overview', ensureAuthenticated, async (req, res) => {
    try {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        
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
        
        const recentTransactions = await Expense.find({ 
            user: req.user.id 
        }).sort({ date: -1 }).limit(5);
        
        const budgetPercentage = req.user.monthlyBudget > 0 
            ? Math.round((monthlyTotal[0]?.total || 0) / req.user.monthlyBudget * 100)
            : 0;
        
        res.json({
            monthlyTotal: monthlyTotal[0]?.total || 0,
            budgetPercentage,
            recentTransactions
        });
    } catch (err) {
>>>>>>> e1b026d2f834834f296bc9178de6330ffc3dae8d
        res.status(500).json({ error: 'Server error' });
    }
});

<<<<<<< HEAD
// AI Tip
=======
// API endpoint for category data
router.get('/dashboard/category-data', ensureAuthenticated, async (req, res) => {
    try {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        
        const categoryData = await Expense.aggregate([
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
            }
        ]);
        
        res.json({
            labels: categoryData.map(c => c._id),
            values: categoryData.map(c => c.total)
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// API endpoint for trend data
router.get('/dashboard/trend-data', ensureAuthenticated, async (req, res) => {
    try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        const trendData = await Expense.aggregate([
            { 
                $match: { 
                    user: req.user._id,
                    date: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$date' },
                        month: { $month: '$date' }
                    },
                    total: { $sum: '$amount' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);
        
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        res.json({
            labels: trendData.map(t => months[t._id.month - 1]),
            values: trendData.map(t => t.total)
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// API endpoint for AI tips
>>>>>>> e1b026d2f834834f296bc9178de6330ffc3dae8d
router.get('/ai/tip', ensureAuthenticated, async (req, res) => {
    try {
        const tip = await AITipsEngine.generateTip(req.user.id);
        res.json({ tip });
<<<<<<< HEAD
    } catch (error) {
        console.error(error);
        res.json({ tip: 'Track your expenses daily for better financial insights!' });
    }
});

// Category data for charts
router.get('/dashboard/category-data', ensureAuthenticated, async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id });
        const categories = {};
        
        if (expenses && expenses.length > 0) {
            expenses.forEach(expense => {
                if (categories[expense.category]) {
                    categories[expense.category] += expense.amount;
                } else {
                    categories[expense.category] = expense.amount;
                }
            });
        }

        res.json({
            labels: Object.keys(categories) || [],
            values: Object.values(categories) || [],
            totalCategories: Object.keys(categories).length || 0
        });
    } catch (error) {
        console.error('Category data error:', error);
        res.json({
            labels: [],
            values: [],
            totalCategories: 0
        });
    }
});

// Trend data for charts
router.get('/dashboard/trend-data', ensureAuthenticated, async (req, res) => {
    try {
        // Placeholder data - you can implement proper monthly trends here
        res.json({
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            values: [1200, 1500, 1000, 1800, 1300, 1600]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
=======
    } catch (err) {
        res.json({ tip: 'Track your daily expenses to better understand your spending patterns.' });
    }
});

module.exports = router;
>>>>>>> e1b026d2f834834f296bc9178de6330ffc3dae8d
