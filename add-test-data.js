const mongoose = require('mongoose');
const User = require('./models/User');
const Expense = require('./models/Expense');
const Budget = require('./models/Budget');
const Notification = require('./models/Notification');
require('dotenv').config();

async function addTestData() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/costmate');
        
        // Find test user
        const testUser = await User.findOne({ email: 'test@costmate.com' });
        
        if (!testUser) {
            console.log('Test user not found. Please run create-test-user.js first');
            process.exit(1);
        }
        
        console.log('Adding test data for user:', testUser.name);
        
        // Add sample expenses
        const expenses = [
            { category: 'Food', amount: 45.50, description: 'Grocery shopping', paymentMethod: 'Credit Card' },
            { category: 'Transport', amount: 20.00, description: 'Uber ride', paymentMethod: 'Digital Wallet' },
            { category: 'Entertainment', amount: 15.99, description: 'Netflix subscription', paymentMethod: 'Credit Card' },
            { category: 'Bills', amount: 120.00, description: 'Electricity bill', paymentMethod: 'Bank Transfer' },
            { category: 'Shopping', amount: 89.99, description: 'New shoes', paymentMethod: 'Debit Card' },
            { category: 'Health', amount: 25.00, description: 'Gym membership', paymentMethod: 'Credit Card' },
            { category: 'Food', amount: 32.50, description: 'Restaurant dinner', paymentMethod: 'Cash' },
            { category: 'Transport', amount: 50.00, description: 'Gas', paymentMethod: 'Credit Card' }
        ];
        
        for (const expense of expenses) {
            const newExpense = new Expense({
                user: testUser._id,
                ...expense,
                date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date in last 30 days
            });
            await newExpense.save();
        }
        
        console.log('✅ Added', expenses.length, 'sample expenses');
        
        // Add sample budgets
        const budgets = [
            { category: 'Food', amount: 500, period: 'Monthly' },
            { category: 'Transport', amount: 200, period: 'Monthly' },
            { category: 'Entertainment', amount: 100, period: 'Monthly' },
            { category: 'Shopping', amount: 300, period: 'Monthly' }
        ];
        
        for (const budget of budgets) {
            const startDate = new Date();
            startDate.setDate(1);
            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + 1);
            
            const newBudget = new Budget({
                user: testUser._id,
                ...budget,
                startDate,
                endDate,
                isActive: true
            });
            await newBudget.save();
        }
        
        console.log('✅ Added', budgets.length, 'sample budgets');
        
        // Add sample notifications
        const notifications = [
            { type: 'tip', title: 'Welcome!', message: 'Start tracking your expenses to get personalized insights', icon: 'lightbulb_outline' },
            { type: 'budget_alert', title: 'Budget Alert', message: 'You have used 75% of your Food budget', icon: 'warning', color: 'orange' }
        ];
        
        for (const notification of notifications) {
            const newNotification = new Notification({
                user: testUser._id,
                ...notification
            });
            await newNotification.save();
        }
        
        console.log('✅ Added', notifications.length, 'sample notifications');
        
        console.log('\n✅ Test data added successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error adding test data:', err);
        process.exit(1);
    }
}

addTestData();