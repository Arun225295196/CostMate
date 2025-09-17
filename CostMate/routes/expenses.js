const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Expense = require('../models/Expense');
const expenseController = require('../controllers/expenseController');

<<<<<<< HEAD
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id })
            .sort({ date: -1 })
            .limit(50);
        res.render('expenses', { expenses });
    } catch (error) {
        console.error(error);
        res.redirect('/dashboard');
    }
});


=======
// Get all expenses
const expensesController = require("../controllers/expensesController");
router.get("/expenses", expensesController.getExpenses);

module.exports = router;
// Add expense form
>>>>>>> e1b026d2f834834f296bc9178de6330ffc3dae8d
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('add-expense', { 
        title: 'Add Expense - CostMate',
        user: req.user 
    });
});

<<<<<<< HEAD

router.post('/add', ensureAuthenticated, async (req, res) => {
    try {
        const { category, amount, description, paymentMethod, date } = req.body;
        
        const newExpense = new Expense({
            user: req.user.id,
            category,
            amount,
            description,
            paymentMethod,
            date: date || new Date()
        });
        
        await newExpense.save();
        req.flash('success_msg', 'Expense added successfully! 🎉');
        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Error adding expense');
        res.redirect('/expenses/add');
    }
});
=======
// Add expense
router.post('/add', ensureAuthenticated, expenseController.addExpense);

// Edit expense form
router.get('/edit/:id', ensureAuthenticated, expenseController.getEditExpense);

// Update expense
router.put('/:id', ensureAuthenticated, expenseController.updateExpense);
>>>>>>> e1b026d2f834834f296bc9178de6330ffc3dae8d

// Delete expense
router.delete('/:id', ensureAuthenticated, expenseController.deleteExpense);

// Get expenses by category
router.get('/category/:category', ensureAuthenticated, expenseController.getExpensesByCategory);

module.exports = router;
