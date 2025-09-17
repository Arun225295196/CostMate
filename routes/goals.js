const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Goal = require('../models/Goal');

// View goals
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const goals = await Goal.find({ 
            user: req.user.id,
            isActive: true 
        }).sort({ deadline: 1 });
        
        res.render('goals', {
            title: 'Financial Goals - CostMate',
            user: req.user,
            goals
        });
    } catch (err) {
        console.error(err);
        res.redirect('/dashboard');
    }
});

// Add goal
router.post('/add', ensureAuthenticated, async (req, res) => {
    try {
        const { title, type, targetAmount, deadline } = req.body;
        
        const newGoal = new Goal({
            user: req.user.id,
            title,
            type,
            targetAmount: parseFloat(targetAmount),
            deadline: new Date(deadline)
        });
        
        await newGoal.save();
        req.flash('success_msg', 'Goal created successfully!');
        res.redirect('/goals');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error creating goal');
        res.redirect('/goals');
    }
});

// Update goal progress
router.put('/:id/update', ensureAuthenticated, async (req, res) => {
    try {
        const { currentAmount } = req.body;
        
        const goal = await Goal.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { 
                currentAmount: parseFloat(currentAmount),
                isCompleted: parseFloat(currentAmount) >= goal.targetAmount,
                completedAt: parseFloat(currentAmount) >= goal.targetAmount ? new Date() : null
            },
            { new: true }
        );
        
        res.json({ success: true, goal });
    } catch (err) {
        res.status(500).json({ error: 'Error updating goal' });
    }
});

module.exports = router;