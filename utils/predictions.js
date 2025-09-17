const Expense = require('../models/Expense');

class PredictionEngine {
    static async predictNextMonth(userId) {
        try {
            // Get last 3 months of expenses
            const threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
            
            const expenses = await Expense.find({
                user: userId,
                date: { $gte: threeMonthsAgo }
            });
            
            if (expenses.length < 10) {
                return { prediction: 0, confidence: 'low' };
            }
            
            // Calculate monthly averages
            const monthlyTotals = {};
            expenses.forEach(expense => {
                const monthKey = `${expense.date.getFullYear()}-${expense.date.getMonth()}`;
                if (!monthlyTotals[monthKey]) {
                    monthlyTotals[monthKey] = 0;
                }
                monthlyTotals[monthKey] += expense.amount;
            });
            
            const months = Object.values(monthlyTotals);
            const average = months.reduce((a, b) => a + b, 0) / months.length;
            
            // Simple trend calculation
            const trend = months.length > 1 ? 
                (months[months.length - 1] - months[0]) / months.length : 0;
            
            const prediction = average + trend;
            const confidence = months.length >= 3 ? 'high' : 'medium';
            
            return {
                prediction: Math.round(prediction),
                confidence,
                trend: trend > 0 ? 'increasing' : trend < 0 ? 'decreasing' : 'stable',
                average: Math.round(average)
            };
        } catch (error) {
            console.error('Prediction error:', error);
            return { prediction: 0, confidence: 'low' };
        }
    }
    
    static async predictByCategory(userId, category) {
        try {
            const threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
            
            const expenses = await Expense.find({
                user: userId,
                category: category,
                date: { $gte: threeMonthsAgo }
            });
            
            const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
            const average = expenses.length > 0 ? total / 3 : 0;
            
            return Math.round(average);
        } catch (error) {
            return 0;
        }
    }
}

module.exports = PredictionEngine;