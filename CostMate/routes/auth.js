const express = require('express');
const router = express.Router();
const passport = require('passport');
<<<<<<< HEAD
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const User = require('../models/User');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => {
    res.render('welcome');
});

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard', { user: req.user });
});

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => {
    res.render('login');
});

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => {
    res.render('register');
});

// Register POST
=======
const User = require('../models/User');
const { ensureGuest } = require('../config/auth');

// Login Page
router.get('/login', ensureGuest, (req, res) => {
    res.render('login', { title: 'Login - CostMate' });
});

// Register Page
router.get('/register', ensureGuest, (req, res) => {
    res.render('register', { title: 'Register - CostMate' });
});

// Register Handle
>>>>>>> e1b026d2f834834f296bc9178de6330ffc3dae8d
router.post('/register', async (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    if (!name || !email || !password || !password2) {
<<<<<<< HEAD
        errors.push({ msg: 'Please enter all fields' });
    }

    if (password != password2) {
=======
        errors.push({ msg: 'Please fill in all fields' });
    }

    if (password !== password2) {
>>>>>>> e1b026d2f834834f296bc9178de6330ffc3dae8d
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 6) {
<<<<<<< HEAD
        errors.push({ msg: 'Password must be at least 6 characters' });
    }

    if (errors.length > 0) {
        res.render('register', { errors, name, email, password, password2 });
    } else {
        try {
            const existingUser = await User.findOne({ email: email });
            if (existingUser) {
                errors.push({ msg: 'Email already exists' });
                res.render('register', { errors, name, email, password, password2 });
            } else {
                const newUser = new User({ name, email, password });
                await newUser.save();
                req.flash('success_msg', 'You are now registered and can log in');
                res.redirect('/login');
            }
        } catch (err) {
            console.error(err);
            res.redirect('/register');
=======
        errors.push({ msg: 'Password should be at least 6 characters' });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            title: 'Register - CostMate'
        });
    } else {
        try {
            const user = await User.findOne({ email: email.toLowerCase() });
            if (user) {
                errors.push({ msg: 'Email is already registered' });
                res.render('register', {
                    errors,
                    name,
                    email,
                    title: 'Register - CostMate'
                });
            } else {
                const newUser = new User({
                    name,
                    email: email.toLowerCase(),
                    password
                });

                await newUser.save();
                req.flash('success_msg', 'You are now registered and can log in');
                res.redirect('/auth/login');
            }
        } catch (err) {
            console.error(err);
            res.render('register', {
                errors: [{ msg: 'Something went wrong' }],
                title: 'Register - CostMate'
            });
>>>>>>> e1b026d2f834834f296bc9178de6330ffc3dae8d
        }
    }
});

<<<<<<< HEAD
// Login POST
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
=======
// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/auth/login',
>>>>>>> e1b026d2f834834f296bc9178de6330ffc3dae8d
        failureFlash: true
    })(req, res, next);
});

<<<<<<< HEAD
// Logout
router.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success_msg', 'You are logged out');
        res.redirect('/login');
    });
});

module.exports = router;
=======
// Logout Handle
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success_msg', 'You are logged out');
        res.redirect('/auth/login');
    });
});

module.exports = router;

>>>>>>> e1b026d2f834834f296bc9178de6330ffc3dae8d
