const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

class AITipsEngine {
    static async generateTip(userId) {
        try {
            const expenses = await Expense.find({ user: userId })
                .sort({ date: -1 })
                .limit(50);
            
            const budgets = await Budget.find({ user: userId, isActive: true });
            
            if (expenses.length === 0) {
                return this.getOnboardingTip();
            }
            
            const analysis = this.analyzeSpending(expenses);
            const insights = this.generateInsights(analysis, budgets);
            
            return this.selectBestTip(insights);
        } catch (error) {
            console.error('Error generating AI tip:', error);
            return this.getDefaultTip();
        }
    }
    
    static analyzeSpending(expenses) {
        const now = new Date();
        const thisMonth = expenses.filter(e => {
            const expDate = new Date(e.date);
            return expDate.getMonth() === now.getMonth() && 
                   expDate.getFullYear() === now.getFullYear();
        });
        
        const lastMonth = expenses.filter(e => {
            const expDate = new Date(e.date);
            const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1);
            return expDate.getMonth() === lastMonthDate.getMonth() && 
                   expDate.getFullYear() === lastMonthDate.getFullYear();
        });
        
        // Category analysis
        const categoryTotals = {};
        const categoryCount = {};
        let totalSpent = 0;
        
        thisMonth.forEach(expense => {
            if (!categoryTotals[expense.category]) {
                categoryTotals[expense.category] = 0;
                categoryCount[expense.category] = 0;
            }
            categoryTotals[expense.category] += expense.amount;
            categoryCount[expense.category]++;
            totalSpent += expense.amount;
        });
        
        // Time pattern analysis
        const dayOfWeekSpending = Array(7).fill(0);
        const hourSpending = Array(24).fill(0);
        
        thisMonth.forEach(expense => {
            const date = new Date(expense.date);
            dayOfWeekSpending[date.getDay()] += expense.amount;
            hourSpending[date.getHours()] += expense.amount;
        });
        
        // Find patterns
        const highestCategory = Object.entries(categoryTotals)
            .sort((a, b) => b[1] - a[1])[0];
        
        const peakDay = dayOfWeekSpending.indexOf(Math.max(...dayOfWeekSpending));
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        
        // Calculate trends
        const lastMonthTotal = lastMonth.reduce((sum, e) => sum + e.amount, 0);
        const monthOverMonthChange = lastMonthTotal > 0 
            ? ((totalSpent - lastMonthTotal) / lastMonthTotal * 100).toFixed(1)
            : 0;
        
        return {
            totalSpent,
            categoryTotals,
            categoryCount,
            highestCategory: highestCategory ? highestCategory[0] : null,
            highestAmount: highestCategory ? highestCategory[1] : 0,
            averageDaily: totalSpent / 30,
            peakSpendingDay: days[peakDay],
            expenseCount: thisMonth.length,
            monthOverMonthChange,
            lastMonthTotal,
            averagePerTransaction: totalSpent / (thisMonth.length || 1)
        };
    }
    
    static generateInsights(analysis, budgets) {
        const insights = [];
        
        // Spending trend insights
        if (analysis.monthOverMonthChange > 20) {
            insights.push({
                priority: 'high',
                type: 'warning',
                tip: `⚠️ Your spending increased ${analysis.monthOverMonthChange}% from last month. Review your expenses to identify areas where you can cut back.`
            });
        } else if (analysis.monthOverMonthChange < -10) {
            insights.push({
                priority: 'high',
                type: 'success',
                tip: `🎉 Great job! You've reduced spending by ${Math.abs(analysis.monthOverMonthChange)}% compared to last month. Keep up the good habits!`
            });
        }
        
        // Category-specific insights
        if (analysis.highestCategory) {
            const percentage = ((analysis.highestAmount / analysis.totalSpent) * 100).toFixed(0);
            
            const categoryTips = {
                'Food': [
                    `🍔 Food accounts for ${percentage}% of your spending. Meal planning can reduce food costs by 25%. Try preparing meals at home 2-3 more times per week.`,
                    `🥗 Your food spending is ${percentage}% of total. Consider using grocery apps with cashback rewards to save 5-10% on every purchase.`,
                    `🍳 Pro tip: Cooking breakfast at home instead of buying it can save you $150+ per month!`
                ],
                'Entertainment': [
                    `🎬 Entertainment is ${percentage}% of your budget. Look for free events in your area or consider sharing streaming subscriptions with friends.`,
                    `🎮 Gaming and entertainment costs adding up? Set a monthly "fun budget" and stick to it. When it's gone, explore free alternatives.`,
                    `📺 Review your subscriptions - the average person wastes $273/month on unused services!`
                ],
                'Shopping': [
                    `🛍️ Shopping represents ${percentage}% of expenses. Try the 30-day rule: wait 30 days before buying non-essentials to avoid impulse purchases.`,
                    `💳 Before shopping, always check for coupon codes and cashback offers. You could save 10-20% on every purchase!`,
                    `📦 Consider buying generic brands - they're often 25-30% cheaper with similar quality.`
                ],
                'Transport': [
                    `🚗 Transportation costs are ${percentage}% of spending. Consider carpooling or public transport 2-3 days a week to save on fuel.`,
                    `⛽ Gas prices high? Use apps like GasBuddy to find the cheapest stations near you.`,
                    `🚴 For short trips under 2 miles, consider walking or biking - save money and improve health!`
                ],
                'Bills': [
                    `📱 Bills are ${percentage}% of expenses. Call your providers annually to negotiate better rates - most companies offer retention discounts.`,
                    `💡 Reduce electricity bills by 10-15% with smart power strips and LED bulbs.`,
                    `📞 Review your phone and internet plans - you might be paying for speed or data you don't use.`
                ]
            };
            
            const tips = categoryTips[analysis.highestCategory] || [
                `${analysis.highestCategory} is your highest expense at ${percentage}%. Review recent purchases to identify savings opportunities.`
            ];
            
            insights.push({
                priority: 'medium',
                type: 'category',
                tip: tips[Math.floor(Math.random() * tips.length)]
            });
        }
        
        // Budget-specific insights
        if (budgets.length > 0) {
            const overBudget = [];
            const nearLimit = [];
            
            budgets.forEach(budget => {
                const spent = analysis.categoryTotals[budget.category] || 0;
                const percentage = (spent / budget.amount) * 100;
                
                if (percentage > 100) {
                    overBudget.push({ category: budget.category, percentage: percentage.toFixed(0) });
                } else if (percentage > 80) {
                    nearLimit.push({ category: budget.category, percentage: percentage.toFixed(0) });
                }
            });
            
            if (overBudget.length > 0) {
                insights.push({
                    priority: 'high',
                    type: 'budget_alert',
                    tip: `🚨 Budget Alert: You've exceeded your ${overBudget[0].category} budget by ${overBudget[0].percentage - 100}%. Consider reducing spending in this category for the rest of the month.`
                });
            } else if (nearLimit.length > 0) {
                insights.push({
                    priority: 'medium',
                    type: 'budget_warning',
                    tip: `⚡ You've used ${nearLimit[0].percentage}% of your ${nearLimit[0].category} budget. Pace yourself to stay within limits.`
                });
            } else {
                insights.push({
                    priority: 'low',
                    type: 'budget_success',
                    tip: `✅ You're doing great! All spending is within budget limits. Keep maintaining this discipline!`
                });
            }
        }
        
        // Frequency insights
        if (analysis.expenseCount > 60) {
            insights.push({
                priority: 'medium',
                type: 'frequency',
                tip: `📊 You've logged ${analysis.expenseCount} transactions this month. Consider consolidating purchases to reduce impulse buying.`
            });
        }
        
        // Day-specific insights
        if (analysis.peakSpendingDay) {
            insights.push({
                priority: 'low',
                type: 'pattern',
                tip: `📅 You tend to spend more on ${analysis.peakSpendingDay}s. Plan ahead to avoid overspending on this day.`
            });
        }
        
        // Savings insights
        const savingsRate = analysis.totalSpent > 0 ? 
            `💰 If you reduce spending by just 10%, you'll save ${(analysis.totalSpent * 0.1).toFixed(2)} this month - that's ${(analysis.totalSpent * 0.1 * 12).toFixed(0)} per year!` :
            `💰 Start building an emergency fund with just $20/week - you'll have $1,040 saved in a year!`;
        
        insights.push({
            priority: 'low',
            type: 'savings',
            tip: savingsRate
        });
        
        return insights;
    }
    
    static selectBestTip(insights) {
        if (insights.length === 0) {
            return this.getDefaultTip();
        }
        
        // Sort by priority
        insights.sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
        
        // Add some randomness to avoid repetition
        const topInsights = insights.filter(i => i.priority === insights[0].priority);
        const selected = topInsights[Math.floor(Math.random() * topInsights.length)];
        
        return selected.tip;
    }
    
    static getOnboardingTip() {
        const tips = [
            "🚀 Welcome! Start by adding your first expense. The more you track, the better insights you'll get!",
            "💡 Set up budgets for your main spending categories to stay on track with your financial goals.",
            "📊 Track every expense for 30 days to understand your true spending patterns.",
            "🎯 Financial success starts with awareness. Log every purchase, no matter how small!",
            "💰 The average person saves 20% just by tracking their expenses. Start your journey today!"
        ];
        
        return tips[Math.floor(Math.random() * tips.length)];
    }
    
    static getDefaultTip() {
        const tips = [
            "💡 The 50/30/20 rule: 50% for needs, 30% for wants, 20% for savings and debt repayment.",
            "🏦 Automate your savings - treat it like a bill that must be paid every month.",
            "☕ Skip one coffee shop visit per week and save $260+ per year!",
            "📱 Review your subscriptions quarterly - cancel what you don't actively use.",
            "🛒 Never shop hungry - you'll spend 20-30% more on groceries!",
            "💳 Use the 24-hour rule for non-essential purchases over $50.",
            "🎯 Set specific, measurable financial goals with deadlines.",
            "📈 Invest in yourself - education and skills pay the best dividends.",
            "🔍 Track your net worth monthly to see your real financial progress.",
            "⚡ Pay off high-interest debt first - it's a guaranteed return on your money!"
        ];
        
        return tips[Math.floor(Math.random() * tips.length)];
    }
}

module.exports = AITipsEngine;