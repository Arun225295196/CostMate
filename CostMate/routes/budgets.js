const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const budgetController = require('../controllers/budgetController');

// Get all budgets
router.get('/', ensureAuthenticated, budgetController.getBudgets);

// Add budget form
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('add-budget', { 
        title: 'Set Budget - CostMate',
        user: req.user 
    });
});

// Add budget
router.post('/add', ensureAuthenticated, budgetController.addBudget);

// Update budget
router.put('/:id', ensureAuthenticated, budgetController.updateBudget);

// Delete budget
router.delete('/:id', ensureAuthenticated, budgetController.deleteBudget);

module.exports = router;
