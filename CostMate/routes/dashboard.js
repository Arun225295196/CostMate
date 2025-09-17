const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Expense = require('../models/Expense');

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
        });
    }
});

module.exports = router;