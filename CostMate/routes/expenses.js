const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Expense = require('../models/Expense');
const expenseController = require('../controllers/expenseController');

// Get all expenses
const expensesController = require("../controllers/expensesController");
router.get("/expenses", expensesController.getExpenses);

module.exports = router;
// Add expense form
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('add-expense', { 
        title: 'Add Expense - CostMate',
        user: req.user 
    });
});

// Add expense
router.post('/add', ensureAuthenticated, expenseController.addExpense);

// Edit expense form
router.get('/edit/:id', ensureAuthenticated, expenseController.getEditExpense);

// Update expense
router.put('/:id', ensureAuthenticated, expenseController.updateExpense);

// Delete expense
router.delete('/:id', ensureAuthenticated, expenseController.deleteExpense);

// Get expenses by category
router.get('/category/:category', ensureAuthenticated, expenseController.getExpensesByCategory);

module.exports = router;
