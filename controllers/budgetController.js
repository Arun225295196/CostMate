const Budget = require('../models/Budget');
const Expense = require('../models/Expense');

exports.getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({ user: req.user.id });
        
        // Calculate spent amounts for each budget
        const budgetsWithSpent = await Promise.all(budgets.map(async (budget) => {
            const spent = await Expense.aggregate([
                {
                    $match: {
                        user: req.user._id,
                        category: budget.category,
                        date: { $gte: budget.startDate, $lte: budget.endDate }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$amount' }
                    }
                }
            ]);
            
            return {
                ...budget.toObject(),
                spent: spent[0]?.total || 0,
                percentage: ((spent[0]?.total || 0) / budget.amount * 100).toFixed(1)
            };
        }));
        
        res.render('budgets', {
            title: 'Budgets - CostMate',
            user: req.user,
            budgets: budgetsWithSpent
        });
    } catch (err) {
        console.error('Error getting budgets:', err);
        req.flash('error_msg', 'Error loading budgets');
        res.redirect('/dashboard');
    }
};

exports.addBudget = async (req, res) => {
    try {
        const { category, amount, period } = req.body;
        
        const startDate = new Date();
        const endDate = new Date();
        
        if (period === 'Weekly') {
            endDate.setDate(endDate.getDate() + 7);
        } else if (period === 'Monthly') {
            endDate.setMonth(endDate.getMonth() + 1);
        } else if (period === 'Yearly') {
            endDate.setFullYear(endDate.getFullYear() + 1);
        }
        
        const newBudget = new Budget({
            user: req.user.id,
            category,
            amount: parseFloat(amount),
            period,
            startDate,
            endDate
        });
        
        await newBudget.save();
        req.flash('success_msg', 'Budget created successfully');
        res.redirect('/budgets');
    } catch (err) {
        console.error('Error creating budget:', err);
        req.flash('error_msg', 'Error creating budget');
        res.redirect('/budgets/add');
    }
};

exports.updateBudget = async (req, res) => {
    try {
        await Budget.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body
        );
        
        req.flash('success_msg', 'Budget updated');
        res.redirect('/budgets');
    } catch (err) {
        console.error('Error updating budget:', err);
        req.flash('error_msg', 'Error updating budget');
        res.redirect('/budgets');
    }
};

exports.deleteBudget = async (req, res) => {
    try {
        await Budget.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });
        
        req.flash('success_msg', 'Budget deleted');
        res.redirect('/budgets');
    } catch (err) {
        console.error('Error deleting budget:', err);
        req.flash('error_msg', 'Error deleting budget');
        res.redirect('/budgets');
    }
};