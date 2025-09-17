const express = require('express');
const router = express.Router();
const passport = require('passport');
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
router.post('/register', async (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 6) {
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
        }
    }
});

// Login POST
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success_msg', 'You are logged out');
        res.redirect('/login');
    });
});

module.exports = router;