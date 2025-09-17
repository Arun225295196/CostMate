const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureAdmin } = require('../config/auth');
const User = require('../models/User');
const Expense = require('../models/Expense');

router.get('/', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        const totalUsers = users.length;
        const totalExpenses = await Expense.countDocuments();
        
        const stats = {
            totalUsers,
            totalExpenses,
            activeUsers: users.filter(u => {
                const lastWeek = new Date();
                lastWeek.setDate(lastWeek.getDate() - 7);
                return u.createdAt > lastWeek;
            }).length,
            totalRevenue: 0 // Placeholder for premium features
        };
        
        res.render('admin', {
            title: 'Admin Panel - CostMate',
            user: req.user,
            users,
            stats
        });
    } catch (err) {
        console.error(err);
        res.redirect('/dashboard');
    }
});

module.exports = router;
