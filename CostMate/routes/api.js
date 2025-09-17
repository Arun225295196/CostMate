const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Expense = require('../models/Expense');
const AITipsEngine = require('../utils/aiTips');

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
        res.status(500).json({ error: 'Server error' });
    }
});

// AI Tip
router.get('/ai/tip', ensureAuthenticated, async (req, res) => {
    try {
        const tip = await AITipsEngine.generateTip(req.user.id);
        res.json({ tip });
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