const Notification = require('../models/Notification');
const Budget = require('../models/Budget');
const Expense = require('../models/Expense');

class NotificationService {
    static async checkDailyNotifications(userId) {
        const notifications = [];
        
        // Check if user has added expenses today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayExpenses = await Expense.find({
            user: userId,
            date: { $gte: today }
        });
        
        if (todayExpenses.length === 0) {
            notifications.push({
                type: 'expense_reminder',
                title: 'Daily Reminder',
                message: "Don't forget to track your expenses today!",
                icon: 'alarm'
            });
        }
        
        // Check budget status
        const budgets = await Budget.find({ user: userId, isActive: true });
        
        for (const budget of budgets) {
            const spent = await this.calculateBudgetSpent(userId, budget);
            const percentage = (spent / budget.amount) * 100;
            
            if (percentage >= 90 && percentage < 100) {
                notifications.push({
                    type: 'budget_alert',
                    title: `Budget Warning: ${budget.category}`,
                    message: `You've used ${percentage.toFixed(0)}% of your ${budget.category} budget`,
                    icon: 'warning',
                    color: 'orange'
                });
            } else if (percentage >= 100) {
                notifications.push({
                    type: 'budget_alert',
                    title: `Budget Exceeded: ${budget.category}`,
                    message: `You've exceeded your ${budget.category} budget by ${(percentage - 100).toFixed(0)}%`,
                    icon: 'error',
                    color: 'red'
                });
            }
        }
        
        // Create notifications in database
        for (const notif of notifications) {
            await Notification.create({
                user: userId,
                ...notif
            });
        }
        
        return notifications;
    }
    
    static async calculateBudgetSpent(userId, budget) {
        const result = await Expense.aggregate([
            {
                $match: {
                    user: userId,
                    category: budget.category,
                    date: {
                        $gte: budget.startDate,
                        $lte: budget.endDate
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);
        
        return result[0]?.total || 0;
    }
    
    static async createAchievementNotification(userId, achievement) {
        const achievements = {
            first_expense: {
                title: 'First Step!',
                message: 'You\'ve tracked your first expense. Keep it up!',
                icon: 'star'
            },
            week_streak: {
                title: 'Week Streak!',
                message: 'You\'ve tracked expenses for 7 days straight!',
                icon: 'whatshot'
            },
            budget_master: {
                title: 'Budget Master!',
                message: 'You stayed within all your budgets this month!',
                icon: 'emoji_events'
            },
            savings_goal: {
                title: 'Savings Goal Reached!',
                message: 'Congratulations on reaching your savings goal!',
                icon: 'savings'
            }
        };
        
        const achievementData = achievements[achievement];
        
        if (achievementData) {
            await Notification.create({
                user: userId,
                type: 'achievement',
                ...achievementData,
                color: 'green'
            });
        }
    }
}

module.exports = NotificationService;
