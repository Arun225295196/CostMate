const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

// Check if controller exists, if not, use inline handlers
let expenseController;
try {
    expenseController = require('../controllers/expenseController');
} catch (err) {
    console.log('ExpenseController not found, using inline handlers');
}

// If controller exists, use it; otherwise use inline handlers
if (expenseController) {
    // View all expenses
    router.get('/', ensureAuthenticated, expenseController.getExpenses);
    
    // Show add expense form
    router.get('/add', ensureAuthenticated, (req, res) => {
        res.render('add-expense', { 
            title: 'Add Expense - CostMate',
            user: req.user 
        });
    });
    
    // Add expense
    router.post('/add', ensureAuthenticated, expenseController.addExpense);
    
    // Show edit expense form
    router.get('/edit/:id', ensureAuthenticated, expenseController.getEditExpense);
    
    // Update expense
    router.put('/:id', ensureAuthenticated, expenseController.updateExpense);
    
    // Delete expense
    router.delete('/:id', ensureAuthenticated, expenseController.deleteExpense);
    
    // Get expenses by category
    router.get('/category/:category', ensureAuthenticated, expenseController.getExpensesByCategory);
} else {
    // Inline handlers if controller is missing
    const Expense = require('../models/Expense');
    
    // View all expenses
    router.get('/', ensureAuthenticated, async (req, res) => {
        try {
            const expenses = await Expense.find({ user: req.user.id })
                .sort({ date: -1 })
                .limit(50);
            
            res.render('expenses', {
                title: 'Expenses - CostMate',
                user: req.user,
                expenses,
                currentPage: 1,
                totalPages: 1
            });
        } catch (err) {
            console.error(err);
            req.flash('error_msg', 'Error loading expenses');
            res.redirect('/dashboard');
        }
    });
    
    // Show add expense form
    router.get('/add', ensureAuthenticated, (req, res) => {
        res.render('add-expense', { 
            title: 'Add Expense - CostMate',
            user: req.user 
        });
    });
    
    // Add expense
    router.post('/add', ensureAuthenticated, async (req, res) => {
        try {
            const { category, amount, description, paymentMethod, date } = req.body;
            
            const newExpense = new Expense({
                user: req.user.id,
                category,
                amount: parseFloat(amount),
                description,
                paymentMethod: paymentMethod || 'Cash',
                date: date || Date.now()
            });
            
            await newExpense.save();
            req.flash('success_msg', 'Expense added successfully');
            res.redirect('/expenses');
        } catch (err) {
            console.error(err);
            req.flash('error_msg', 'Error adding expense');
            res.redirect('/expenses/add');
        }
    });
    
    // Show edit expense form  
    router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
        try {
            const expense = await Expense.findOne({
                _id: req.params.id,
                user: req.user.id
            });
            
            if (!expense) {
                req.flash('error_msg', 'Expense not found');
                return res.redirect('/expenses');
            }
            
            res.render('edit-expense', {
                title: 'Edit Expense - CostMate',
                user: req.user,
                expense
            });
        } catch (err) {
            console.error(err);
            req.flash('error_msg', 'Error loading expense');
            res.redirect('/expenses');
        }
    });
    
    // Update expense
    router.put('/:id', ensureAuthenticated, async (req, res) => {
        try {
            const { category, amount, description, paymentMethod, date } = req.body;
            
            await Expense.findOneAndUpdate(
                { _id: req.params.id, user: req.user.id },
                {
                    category,
                    amount: parseFloat(amount),
                    description,
                    paymentMethod,
                    date: date || Date.now()
                }
            );
            
            req.flash('success_msg', 'Expense updated successfully');
            res.redirect('/expenses');
        } catch (err) {
            console.error(err);
            req.flash('error_msg', 'Error updating expense');
            res.redirect('/expenses');
        }
    });
    
    // Delete expense
    router.delete('/:id', ensureAuthenticated, async (req, res) => {
        try {
            await Expense.findOneAndDelete({
                _id: req.params.id,
                user: req.user.id
            });
            
            req.flash('success_msg', 'Expense deleted successfully');
            res.redirect('/expenses');
        } catch (err) {
            console.error(err);
            req.flash('error_msg', 'Error deleting expense');
            res.redirect('/expenses');
        }
    });
    
    // Get expenses by category
    router.get('/category/:category', ensureAuthenticated, async (req, res) => {
        try {
            const expenses = await Expense.find({
                user: req.user.id,
                category: req.params.category
            }).sort({ date: -1 });
            
            res.render('expenses', {
                title: `${req.params.category} Expenses - CostMate`,
                user: req.user,
                expenses,
                filterCategory: req.params.category,
                currentPage: 1,
                totalPages: 1
            });
        } catch (err) {
            console.error(err);
            req.flash('error_msg', 'Error loading expenses');
            res.redirect('/expenses');
        }
    });
}

module.exports = router;