const Expense = require('../models/Expense');
const Budget = require('../models/Budget');
const notificationController = require('./notificationController');

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
        console.error(err);
        res.redirect('/dashboard');
    }
};

exports.addExpense = async (req, res) => {
    try {
        const { category, amount, description, paymentMethod, date } = req.body;
        
        const newExpense = new Expense({
            user: req.user.id,
            category,
            amount: parseFloat(amount),
            description,
            paymentMethod,
            date: date || Date.now()
        });
        
        await newExpense.save();
        
        // Check budget alerts
        await checkBudgetAlert(req.user.id, category, parseFloat(amount));
        
        req.flash('success_msg', 'Expense added successfully');
        res.redirect('/expenses');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error adding expense');
        res.redirect('/expenses/add');
    }
};

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
        console.error(err);
        res.redirect('/expenses');
    }
};

exports.updateExpense = async (req, res) => {
    try {
        await Expense.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body
        );
        
        req.flash('success_msg', 'Expense updated');
        res.redirect('/expenses');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error updating expense');
        res.redirect('/expenses');
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        await Expense.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });
        
        req.flash('success_msg', 'Expense deleted');
        res.redirect('/expenses');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error deleting expense');
        res.redirect('/expenses');
    }
};

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
            filterCategory: req.params.category
        });
    } catch (err) {
        console.error(err);
        res.redirect('/expenses');
    }
};

async function checkBudgetAlert(userId, category, amount) {
    try {
        const budget = await Budget.findOne({
            user: userId,
            category: category,
            isActive: true
        });
        
        if (budget && budget.notifications.enabled) {
            const startOfPeriod = new Date();
            if (budget.period === 'Monthly') {
                startOfPeriod.setDate(1);
            }
            
            const totalSpent = await Expense.aggregate([
                {
                    $match: {
                        user: userId,
                        category: category,
                        date: { $gte: startOfPeriod }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$amount' }
                    }
                }
            ]);
        const spent = totalSpent[0] ? totalSpent[0].total : 0;

        if (spent + amount > budget.limit) {
            await notificationController.sendBudgetAlert(userId, category, budget.limit);
        }
    }
    } catch (err) {
        console.error('Budget alert check failed:', err);
    }
}
