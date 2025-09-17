<<<<<<< HEAD
=======

>>>>>>> e1b026d2f834834f296bc9178de6330ffc3dae8d
module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
<<<<<<< HEAD
        req.flash('error_msg', 'Please log in to view that resource');
        res.redirect('/login');
    },
    
    forwardAuthenticated: function(req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        res.redirect('/dashboard');
    },
    
=======
        req.flash('error_msg', 'Please log in to view this resource');
        res.redirect('/auth/login');
    },
    ensureGuest: function(req, res, next) {
        if (req.isAuthenticated()) {
            res.redirect('/dashboard');
        } else {
            return next();
        }
    },
>>>>>>> e1b026d2f834834f296bc9178de6330ffc3dae8d
    ensureAdmin: function(req, res, next) {
        if (req.isAuthenticated() && req.user.role === 'admin') {
            return next();
        }
<<<<<<< HEAD
        req.flash('error_msg', 'Access denied. Admin privileges required.');
        res.redirect('/dashboard');
    }
};
=======
        req.flash('error_msg', 'Admin access required');
        res.redirect('/dashboard');
    }
};
>>>>>>> e1b026d2f834834f296bc9178de6330ffc3dae8d
