const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
<<<<<<< HEAD
const flash = require('connect-flash');
const passport = require('passport');
const methodOverride = require('method-override');
=======
const passport = require('passport');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');
>>>>>>> e1b026d2f834834f296bc9178de6330ffc3dae8d
require('dotenv').config();

const app = express();

<<<<<<< HEAD
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
=======
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
>>>>>>> e1b026d2f834834f296bc9178de6330ffc3dae8d
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
<<<<<<< HEAD
app.use('/', require('./routes/auth'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/expenses', require('./routes/expenses'));
app.use('/admin', require('./routes/admin'));
app.use('/api', require('./routes/api'));

=======
app.get('/', (req, res) => {
    res.render('index', { title: 'CostMate - Your Financial Companion' });
});

app.use('/auth', require('./routes/auth'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/expenses', require('./routes/expenses'));
app.use('/budgets', require('./routes/budgets'));
app.use('/notifications', require('./routes/notifications'));
app.use('/admin', require('./routes/admin'));
app.use('/api', require('./routes/api'));

// 404 handler
app.use((req, res) => {
    res.status(404).render('404', { title: 'Page Not Found' });
});

>>>>>>> e1b026d2f834834f296bc9178de6330ffc3dae8d
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 CostMate server running on http://localhost:${PORT}`);
<<<<<<< HEAD
    console.log(`📊 Database: MongoDB`);
    console.log('✅ Ready to use!');
});
=======
});
>>>>>>> e1b026d2f834834f296bc9178de6330ffc3dae8d
