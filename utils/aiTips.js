const Expense = require('../models/Expense');
const Budget = require('../models/Budget');
const { VictoriaData, compareWithVictorianAverage, getAreaTips } = require('./victoriaData');

class AITipsEngine {
    static async generateTip(userId) {
        try {
            const expenses = await Expense.find({ user: userId })
                .sort({ date: -1 })
                .limit(30);
            
            const budgets = await Budget.find({ user: userId, isActive: true });
            
            if (!expenses || expenses.length === 0) {
                return this.getOnboardingTip();
            }
            
            const analysis = this.analyzeSpending(expenses);
            
            // Get Victoria-specific tips
            const vicTips = this.getVictorianTips(analysis);
            
            // Combine all tips
            const allTips = [
                ...this.generateSmartTips(analysis, budgets),
                ...vicTips,
                ...VictoriaData.melbourneTips
            ];
            
            return allTips[Math.floor(Math.random() * allTips.length)];
            
        } catch (error) {
            console.error('AI Tip Error:', error);
            return this.getDefaultTip();
        }
    }
    
    static analyzeSpending(expenses) {
        let totalSpent = 0;
        const categorySpending = {};
        
        expenses.forEach(expense => {
            totalSpent += expense.amount;
            if (!categorySpending[expense.category]) {
                categorySpending[expense.category] = 0;
            }
            categorySpending[expense.category] += expense.amount;
        });
        
        let highestCategory = null;
        let highestAmount = 0;
        
        Object.keys(categorySpending).forEach(category => {
            if (categorySpending[category] > highestAmount) {
                highestAmount = categorySpending[category];
                highestCategory = category;
            }
        });
        
        return {
            totalSpent,
            dailyAverage: (totalSpent / 30).toFixed(2),
            expenseCount: expenses.length,
            highestCategory,
            highestAmount,
            categorySpending
        };
    }
    
    static getVictorianTips(analysis) {
        const tips = [];
        
        // Compare with Victorian averages
        if (analysis.categorySpending['Food']) {
            const foodComparison = compareWithVictorianAverage(
                analysis.categorySpending['Food'], 
                'Food', 
                'single'
            );
            
            if (foodComparison.status === 'above') {
                tips.push(`🍽️ You're spending ${foodComparison.percentage}% more on food than the Victorian average. Try Queen Vic Market for cheaper groceries!`);
            } else if (foodComparison.status === 'below') {
                tips.push(`✅ Great! You're spending ${Math.abs(foodComparison.percentage)}% less on food than the average Victorian. Keep it up!`);
            }
        }
        
        // Melbourne-specific tips based on spending
        if (analysis.dailyAverage > 15) {
            tips.push(`☕ Your daily average ($${analysis.dailyAverage}) could buy ${Math.floor(analysis.dailyAverage / 4.5)} Melbourne coffees. Consider making coffee at home!`);
        }
        
        if (analysis.categorySpending['Transport'] > 200) {
            tips.push(`🚊 Consider a monthly Myki Pass ($155) instead of daily fares - could save you $${(analysis.categorySpending['Transport'] - 155).toFixed(0)}!`);
        }
        
        return tips;
    }
    
    static generateSmartTips(analysis, budgets) {
        const tips = [];
        
        if (analysis.highestCategory) {
            const percentage = ((analysis.highestAmount / analysis.totalSpent) * 100).toFixed(0);
            
            switch(analysis.highestCategory) {
                case 'Food':
                    tips.push(`🍔 Food is ${percentage}% of your spending. Melbourne tip: Try lunch specials - most CBD restaurants offer 30% off 12-2pm!`);
                    break;
                case 'Entertainment':
                    tips.push(`🎭 Entertainment is ${percentage}% of expenses. Check Half-Tix Melbourne for 50% off same-day theatre tickets!`);
                    break;
                case 'Shopping':
                    tips.push(`🛍️ Shopping is ${percentage}% of spending. Visit DFO South Wharf for outlet prices on major brands!`);
                    break;
                case 'Transport':
                    tips.push(`🚗 Transport is ${percentage}% of budget. Free tram zone in CBD can save you $10/day!`);
                    break;
            }
        }
        
        tips.push(`💰 Daily spending: $${analysis.dailyAverage}. The average Victorian spends $45/day - how do you compare?`);
        
        return tips;
    }
    
    static getOnboardingTip() {
        const tips = [
            "👋 Welcome to CostMate! Track your expenses to see how you compare with other Victorians.",
            "🏙️ Melbourne tip: Set your location to get area-specific money-saving advice!",
            "🚊 New to Melbourne? A Myki card is essential - load it with a monthly pass to save!",
            "☕ The average Melbourne coffee costs $4.50 - track yours to see if you're overspending!",
            "🎯 Set a budget based on Victorian averages to stay on track with local costs."
        ];
        return tips[Math.floor(Math.random() * tips.length)];
    }
    
    static getDefaultTip() {
        return VictoriaData.melbourneTips[Math.floor(Math.random() * VictoriaData.melbourneTips.length)];
    }
}

module.exports = AITipsEngine;