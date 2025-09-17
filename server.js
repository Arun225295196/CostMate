// server.js - Complete updated version with Victoria features

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');
require('dotenv').config();

const app = express();

// Passport config
require('./config/passport')(passport);

// DB Config
const connectDB = require('./config/database');
connectDB();

// EJS Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method override
app.use(methodOverride('_method'));

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Express session
app.use(session({
    secret: process.env.SESSION_SECRET || 'costmate-secret-key',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// Routes
app.get('/', (req, res) => {
    res.render('index', { title: 'CostMate - Your Financial Companion' });
});

// Authentication routes
app.use('/auth', require('./routes/auth'));

// Core feature routes
app.use('/dashboard', require('./routes/dashboard'));
app.use('/expenses', require('./routes/expenses'));
app.use('/budgets', require('./routes/budgets'));
app.use('/notifications', require('./routes/notifications'));
app.use('/admin', require('./routes/admin'));

// API routes
app.use('/api', require('./routes/api'));

// ===== NEW VICTORIA FEATURES ROUTES =====
// Victoria Insights - Local cost comparison
app.use('/insights', require('./routes/insights'));

// Financial Goals tracking
app.use('/goals', require('./routes/goals'));
// =========================================

// 404 handler
app.use((req, res) => {
    res.status(404).render('404', { title: 'Page Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 CostMate server running on http://localhost:${PORT}`);
    console.log(`📍 Victoria features enabled!`);
    console.log(`   - Insights: http://localhost:${PORT}/insights`);
    console.log(`   - Goals: http://localhost:${PORT}/goals`);
});