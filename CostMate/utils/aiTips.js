const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

class AITipsEngine {
    static async generateTip(userId) {
        try {
            const expenses = await Expense.find({ user: userId })
                .sort({ date: -1 })
                .limit(30);
            
            const budgets = await Budget.find({ user: userId, isActive: true });
            
            // Analyze spending patterns
            const analysis = this.analyzeSpending(expenses);
            
            // Generate personalized tip based on analysis
            return this.getTipBasedOnAnalysis(analysis, budgets);
        } catch (error) {
            console.error('Error generating AI tip:', error);
            return this.getDefaultTip();
        }
    }
    
    static analyzeSpending(expenses) {
        const categoryTotals = {};
        let totalSpent = 0;
        
        expenses.forEach(expense => {
            if (!categoryTotals[expense.category]) {
                categoryTotals[expense.category] = 0;
            }
            categoryTotals[expense.category] += expense.amount;
            totalSpent += expense.amount;
        });
        
        // Find highest spending category
        let highestCategory = '';
        let highestAmount = 0;
        
        for (const [category, amount] of Object.entries(categoryTotals)) {
            if (amount > highestAmount) {
                highestAmount = amount;
                highestCategory = category;
            }
        }
        
        return {
            totalSpent,
            categoryTotals,
            highestCategory,
            highestAmount,
            averageDaily: totalSpent / 30
        };
    }
    
    static getTipBasedOnAnalysis(analysis, budgets) {
        const tips = [
            `You've spent the most on ${analysis.highestCategory} this month. Consider setting a specific budget for this category.`,
            `Your daily average spending is $${analysis.averageDaily.toFixed(2)}. Try to reduce it by 10% to save more.`,
            `Consider using the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings.`,
            `Track every expense, no matter how small. Small purchases add up quickly!`,
            `Review your subscriptions monthly. Cancel any services you're not actively using.`
        ];
        
        // Add budget-specific tips if applicable
        if (budgets.length > 0) {
            const overBudget = budgets.filter(b => {
                const categorySpent = analysis.categoryTotals[b.category] || 0;
                return categorySpent > b.amount;
            });
            
            if (overBudget.length > 0) {
                tips.push(`Warning: You've exceeded your budget in ${overBudget.length} categories this month.`);
            }
        }
        
        // Return a random tip from the available tips
        return tips[Math.floor(Math.random() * tips.length)];
    }
    
    static getDefaultTip() {
        const defaultTips = [
            "Start tracking your expenses daily to better understand your spending habits.",
            "Set up automatic savings transfers right after payday.",
            "Review and categorize your expenses weekly for better insights.",
            "Consider the 24-hour rule before making non-essential purchases.",
            "Create specific budgets for each spending category."
        ];
        
        return defaultTips[Math.floor(Math.random() * defaultTips.length)];
    }
}

module.exports = AITipsEngine;