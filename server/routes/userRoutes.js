var express = require('express');
var router = express.Router();

var bCrypt = require('bcrypt-nodejs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var userCollection = require('../models/userSchema');


router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function (user, done) {
    done(null, user._id);
});
passport.deserializeUser(function (id, done) {
    userCollection.findById(id, function (err, user) {
        done(err, user);
    });
});
var isValidPassword = function (user, password) {
    return bCrypt.compareSync(password, user.password);
};
var createHash = function (password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(3), null);
};

router.get('/', (req, res) => {
    console.log(req.session);
    console.log(req.session.username);

    if (req.session.username) {
        res.send(req.session.username);
    } else {
        res.send(null);
    }
});

router.get('/logout', (req, res) => {
    console.log(req.session);
    if (req.session) {
        req.session=null;
        res.send("Logged Out");
    } else {
        res.send("Not logged in");
    }
});



//******************************************************************
// ***************   Check if a user exists    *********************
//******************************************************************

// This is the "strategy" for checking for an existing user
passport.use(new LocalStrategy(
    function(username, password, done) {
        console.log("Local Strat");
        userCollection.findOne({ username: username }, function (err, user) {
            if (err) { console.log("1");
                return done(err); }
            if (!user) {
                console.log("2");
                return done(null, false, { message: 'Incorrect username.' });
            }
            // if (!user.validPassword(password)) {
            if (!isValidPassword(user, password)) {
                console.log("3");
                return done(null, false, { message: 'Incorrect password.' });
            }
            console.log("4");
            console.log(user);
            return done(null, user, { user: user.username });
        });
    }
));



//check for new users
router.post('login',
    passport.authenticate('local',
        {failureRedirect: '/userRoutes/loginfail'}),
    function (req, res) {
        req.session.username = req.body.username;
        res.send(req.body.username);
    }
);


//******************************************************************
// ***************   Registering / Sign up new User   **************
//******************************************************************

// This is the "strategy" for signing up a new user
passport.use('signup', new LocalStrategy({
        passReqToCallback: true
    },
    function (req, username, password, done) {
        console.log("0");
        findOrCreateUser = function () {
            // find a user in Mongo with provided username
            userCollection.findOne({'username': username}, function (err, user) {
                // In case of any error return
                if (err) {
                    console.log("1");
                    console.log('Error in SignUp: ' + err);
                    return done(err);
                }
                // already exists
                if (user) {
                    console.log("2");
                    console.log('User already exists');
                    return done(null, false,
                        // req.flash('message','User Already Exists')
                        {message: 'User already exists.'}
                    );
                } else {
                    console.log("3");
                    // if there is no user with that email
                    // create the user
                    var newUser = new userCollection();
                    // set the user's local credentials
                    newUser.username = username;
                    newUser.password = createHash(password);

                    newUser.email = req.body.email;
                    // newUser.firstName = req.param('firstName');
                    // newUser.lastName = req.param('lastName');

                    // save the user
                    newUser.save(function (err) {
                        if (err) {
                            console.log("4");
                            console.log('Error in Saving user: ' + err);
                            throw err;
                        }
                        console.log('User Registration succesful');
                        return done(null, newUser);
                    });
                }
            });
        };

        // Delay the execution of findOrCreateUser and execute
        // the method in the next tick of the event loop
        process.nextTick(findOrCreateUser);
    })
);


//create a new user
router.post('/newuser',
    passport.authenticate('signup',
        {
            successRedirect: '/userRoutes/successNewUser',
            failureRedirect: '/userRoutes/failNewUser'
        }
    ),
    function (req, res) {
        res.send('BOOM!!')
    }
);

//on success
router.get('/successNewUser', (req, res) => {
    console.log(req.body);
    res.send("Added New User")
});

//on failure
router.get('/failNewUser', (req, res) => {
    console.log("Failed New User");
});

module.exports = router;
