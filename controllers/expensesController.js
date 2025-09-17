const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

// Get all expenses
exports.getExpenses = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        
        const expenses = await Expense.find({ user: req.user.id })
            .sort({ date: -1 })
            .limit(limit)
            .skip(skip);
        
        const total = await Expense.countDocuments({ user: req.user.id });
        
        res.render('expenses', {
            title: 'Expenses - CostMate',
            user: req.user,
            expenses,
            currentPage: page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (err) {
        console.error('Error getting expenses:', err);
        req.flash('error_msg', 'Error loading expenses');
        res.redirect('/dashboard');
    }
};

// Add expense
exports.addExpense = async (req, res) => {
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
        console.error('Error adding expense:', err);
        req.flash('error_msg', 'Error adding expense');
        res.redirect('/expenses/add');
    }
};

// Get edit expense form
exports.getEditExpense = async (req, res) => {
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
        console.error('Error getting expense:', err);
        req.flash('error_msg', 'Error loading expense');
        res.redirect('/expenses');
    }
};

// Update expense
exports.updateExpense = async (req, res) => {
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
        console.error('Error updating expense:', err);
        req.flash('error_msg', 'Error updating expense');
        res.redirect('/expenses');
    }
};

// Delete expense
exports.deleteExpense = async (req, res) => {
    try {
        await Expense.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });
        
        req.flash('success_msg', 'Expense deleted successfully');
        res.redirect('/expenses');
    } catch (err) {
        console.error('Error deleting expense:', err);
        req.flash('error_msg', 'Error deleting expense');
        res.redirect('/expenses');
    }
};

// Get expenses by category
exports.getExpensesByCategory = async (req, res) => {
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
        console.error('Error getting expenses by category:', err);
        req.flash('error_msg', 'Error loading expenses');
        res.redirect('/expenses');
    }
};