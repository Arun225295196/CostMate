const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Expense = require('../models/Expense');

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


router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('add-expense');
});


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

// Delete expense
router.delete('/:id', ensureAuthenticated, async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        req.flash('success_msg', 'Expense deleted');
        res.redirect('/expenses');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Error deleting expense');
        res.redirect('/expenses');
    }
});

module.exports = router;