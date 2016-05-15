var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Verify = require('./verify');

var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

/* GET users listing. */
router.get('/', Verify.verifyOrdinaryUser, function (req, res, next) {
    // lets do the verifyAdmin here to customize the message
    // no need to check for decoded part as we call verifyOrdinaryUser explicitely here
    // verify that this user has admin flag
    if (req.decoded._doc.admin) {
        // in this case return the users listing
        User.find({}, function (err, users) {
            if (err) throw err;
            res.json(users);
        });
    } else {
        // else send back error
        return res.status(403).json({
            status: 'You are not authorized to perform this operation!'
        });
    }
});

router.post('/register', function (req, res) {
    User.register(new User({
            username: req.body.username,
            admin: req.body.admin
        }),
        req.body.password,
        function (err, user) {
            if (err) {
                return res.status(500).json({
                    err: err
                });
            }
            passport.authenticate('local')(req, res, function () {
                return res.status(200).json({
                    status: 'Registration Successful!'
                });
            });
        });
});

router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({
                err: info
            });
        }
        req.logIn(user, function (err) {
            if (err) {
                return res.status(500).json({
                    err: 'Could not log in user'
                });
            }

            var token = Verify.getToken(user);
            res.status(200).json({
                status: 'Login successful!',
                success: true,
                token: token
            });
        });
    })(req, res, next);
});

router.get('/logout', function (req, res) {
    req.logout();
    res.status(200).json({
        status: 'Bye!'
    });
});

module.exports = router;