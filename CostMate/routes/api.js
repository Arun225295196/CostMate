const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Expense = require('../models/Expense');
const AITipsEngine = require('../utils/aiTips');

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
        res.status(500).json({ error: 'Server error' });
    }
});

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
router.get('/ai/tip', ensureAuthenticated, async (req, res) => {
    try {
        const tip = await AITipsEngine.generateTip(req.user.id);
        res.json({ tip });
    } catch (err) {
        res.json({ tip: 'Track your daily expenses to better understand your spending patterns.' });
    }
});

module.exports = router;
