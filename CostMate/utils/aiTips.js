const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

class AITipsEngine {
    static async generateTip(userId) {
        try {
            const expenses = await Expense.find({ user: userId })
                .sort({ date: -1 })
                .limit(30);
            
            const budgets = await Budget.find({ user: userId, isActive: true });
            
            const analysis = this.analyzeSpending(expenses);
            return this.getTipBasedOnAnalysis(analysis, budgets);
        } catch (error) {
            console.error('Error generating AI tip:', error);
            return this.getDefaultTip();
        }
    }
    
    static analyzeSpending(expenses) {
        const categoryTotals = {};
        let totalSpent = 0;
        const dailySpending = {};
        
        expenses.forEach(expense => {
            // Category analysis
            if (!categoryTotals[expense.category]) {
                categoryTotals[expense.category] = 0;
            }
            categoryTotals[expense.category] += expense.amount;
            totalSpent += expense.amount;
            
            // Daily spending pattern
            const dayOfWeek = new Date(expense.date).getDay();
            if (!dailySpending[dayOfWeek]) {
                dailySpending[dayOfWeek] = 0;
            }
            dailySpending[dayOfWeek] += expense.amount;
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
        
        // Find peak spending day
        let peakDay = 0;
        let peakDayAmount = 0;
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        
        for (const [day, amount] of Object.entries(dailySpending)) {
            if (amount > peakDayAmount) {
                peakDayAmount = amount;
                peakDay = parseInt(day);
            }
        }
        
        return {
            totalSpent,
            categoryTotals,
            highestCategory,
            highestAmount,
            averageDaily: totalSpent / 30,
            peakSpendingDay: days[peakDay],
            expenseCount: expenses.length
        };
    }
    
    static getTipBasedOnAnalysis(analysis, budgets) {
        const tips = [];
        
        // Category-based tips
        if (analysis.highestCategory) {
            tips.push(`You've spent the most on ${analysis.highestCategory} (${((analysis.highestAmount/analysis.totalSpent)*100).toFixed(1)}%). Consider setting a specific budget for this category.`);
            
            if (analysis.highestCategory === 'Food') {
                tips.push('Meal planning can reduce food expenses by up to 25%. Try preparing meals at home more often.');
            } else if (analysis.highestCategory === 'Entertainment') {
                tips.push('Look for free entertainment options in your area. Many cities offer free events and activities.');
            } else if (analysis.highestCategory === 'Shopping') {
                tips.push('Try the 30-day rule: Wait 30 days before making non-essential purchases to avoid impulse buying.');
            }
        }
        
        // Daily average tips
        tips.push(`Your daily average spending is $${analysis.averageDaily.toFixed(2)}. Reducing it by just 10% could save you $${(analysis.averageDaily * 0.1 * 365).toFixed(0)} per year!`);
        
        // Peak day tips
        if (analysis.peakSpendingDay) {
            tips.push(`You tend to spend more on ${analysis.peakSpendingDay}s. Be extra mindful of your spending on this day.`);
        }
        
        // Expense frequency tips
        if (analysis.expenseCount > 60) {
            tips.push('You have many small transactions. Consider consolidating purchases to reduce impulse buying.');
        } else if (analysis.expenseCount < 15) {
            tips.push('Track expenses more frequently for better financial awareness. Daily tracking leads to 20% average savings.');
        }
        
        // Budget-specific tips
        if (budgets.length === 0) {
            tips.push('Set up budgets for your main spending categories to better control your finances.');
        } else if (budgets.length > 0) {
            const overBudget = budgets.filter(b => {
                const categorySpent = analysis.categoryTotals[b.category] || 0;
                return categorySpent > b.amount;
            });
            
            if (overBudget.length > 0) {
                tips.push(`Warning: You've exceeded your budget in ${overBudget.length} categories. Review and adjust your spending.`);
            } else {
                tips.push('Great job staying within your budgets! Consider saving the surplus for emergency funds.');
            }
        }
        
        // General tips
        tips.push('Use the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings and debt repayment.');
        tips.push('Review subscriptions monthly. The average person wastes $273/month on unused subscriptions.');
        tips.push('Automate your savings. Pay yourself first by setting up automatic transfers on payday.');
        
        // Return a random tip from the generated tips
        return tips[Math.floor(Math.random() * tips.length)];
    }
    
    static getDefaultTip() {
        const defaultTips = [
            "Start tracking your expenses daily to better understand your spending habits.",
            "Set up automatic savings transfers right after payday.",
            "Review and categorize your expenses weekly for better insights.",
            "Consider the 24-hour rule before making non-essential purchases.",
            "Create specific budgets for each spending category.",
            "Small daily savings add up. Saving $5/day equals $1,825 per year!",
            "Use cash for discretionary spending to better control impulse purchases.",
            "Negotiate your bills annually. Most providers offer retention discounts."
        ];
        
        return defaultTips[Math.floor(Math.random() * defaultTips.length)];
    }
}

module.exports = AITipsEngine;
