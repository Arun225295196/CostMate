const LocalStrategy = require('passport-local').Strategy;
<<<<<<< HEAD
=======
const bcrypt = require('bcryptjs');
>>>>>>> e1b026d2f834834f296bc9178de6330ffc3dae8d
const User = require('../models/User');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
            try {
<<<<<<< HEAD
                const user = await User.findOne({ email: email });
                if (!user) {
                    return done(null, false, { message: 'That email is not registered' });
                }

                const isMatch = await user.matchPassword(password);
=======
                const user = await User.findOne({ email: email.toLowerCase() });
                if (!user) {
                    return done(null, false, { message: 'Email not registered' });
                }

                const isMatch = await bcrypt.compare(password, user.password);
>>>>>>> e1b026d2f834834f296bc9178de6330ffc3dae8d
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Password incorrect' });
                }
            } catch (err) {
                return done(err);
            }
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
<<<<<<< HEAD
};
=======
};

>>>>>>> e1b026d2f834834f296bc9178de6330ffc3dae8d
