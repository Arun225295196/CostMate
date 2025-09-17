const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Expense = require('../models/Expense');
const { VictoriaData, compareWithVictorianAverage } = require('../utils/victoriaData');

router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        // Get user's monthly spending by category
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        
        const categoryBreakdown = await Expense.aggregate([
            { 
                $match: { 
                    user: req.user._id,
                    date: { $gte: startOfMonth }
                }
            },
            { 
                $group: { 
                    _id: '$category', 
                    total: { $sum: '$amount' } 
                } 
            },
            { $sort: { total: -1 } }
        ]);
        
        const monthlyTotal = categoryBreakdown.reduce((sum, cat) => sum + cat.total, 0);
        
        res.render('insights', {
            title: 'Victoria Insights - CostMate',
            user: req.user,
            monthlyTotal,
            categoryBreakdown,
            victoriaData: VictoriaData
        });
    } catch (err) {
        console.error(err);
        res.redirect('/dashboard');
    }
});

// API endpoint for comparison data
router.get('/api/compare', ensureAuthenticated, async (req, res) => {
    try {
        const { suburb, household, category } = req.query;
        
        // Get user's spending
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        
        const userSpending = await Expense.aggregate([
            {
                $match: {
                    user: req.user._id,
                    date: { $gte: startOfMonth },
                    ...(category && { category })
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);
        
        const spending = userSpending[0]?.total || 0;
        const comparison = compareWithVictorianAverage(spending, category || 'Food', household || 'single');
        
        res.json({
            userSpending: spending,
            ...comparison,
            areaData: VictoriaData.areaCosts[suburb] || VictoriaData.areaCosts['Melbourne CBD']
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Comparison error' });
    }
});

module.exports = router;