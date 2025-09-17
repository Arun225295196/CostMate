const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const methodOverride = require('method-override');
require('dotenv').config();

const app = express();

// Import database connection
const connectDB = require('./config/database');

// Import passport config
require('./config/passport')(passport);

// Connect to MongoDB
connectDB();

// EJS view engine
app.set('view engine', 'ejs');

// Body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files
app.use(express.static('public'));

// Method override for DELETE requests
app.use(methodOverride('_method'));

// Express session
app.use(session({
    secret: process.env.SESSION_SECRET || 'default-secret-key',
    resave: true,
    saveUninitialized: true
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
app.use('/', require('./routes/auth'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/expenses', require('./routes/expenses'));
app.use('/admin', require('./routes/admin'));
app.use('/api', require('./routes/api'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 CostMate server running on http://localhost:${PORT}`);
    console.log(`📊 Database: MongoDB`);
    console.log('✅ Ready to use!');
});