// routes/admin.js
const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureAdmin } = require('../config/auth');
const User = require('../models/User');
const Expense = require('../models/Expense');

router.get('/', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        const users = await User.find({});
        const totalUsers = users.length;
        const totalExpenses = await Expense.countDocuments();
        
        res.render('admin', {
            users,
            totalUsers,
            totalExpenses,
            stats: {
                activeUsers: users.filter(u => u.lastLogin > Date.now() - 7*24*60*60*1000).length,
                newUsers: users.filter(u => u.createdAt > Date.now() - 30*24*60*60*1000).length
            }
        });
    } catch (error) {
        console.error(error);
        res.redirect('/dashboard');
    }
});

module.exports = router;