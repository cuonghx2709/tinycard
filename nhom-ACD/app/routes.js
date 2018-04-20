module.exports = function(app, passport) {
    const lessonRouter = require('../modules/api/lesson/router');
    const cardRoter = require('../modules/api/cardlesson/router');


    // lesson routes
    app.use('/api/lesson', lessonRouter);
    app.use('/api/cardlesson', cardRoter);

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // show the lesson page 
    app.get('/lesson/:id', (req, res) => {
        res.render('lesson.ejs');
    });

    app.get('/completelesson', (req, res) => {
        res.render('complete.ejs');
    });

    app.get('/home/lesson/:id', isLoggedIn, (req, res) => {
        res.render('lessonLogin.ejs' ,{
            user: req.user
        });
    });

    app.get('/home/completelesson', isLoggedIn, (req, res) => {
        res.render('complete.ejs');
    });

    app.get('/home', isLoggedIn, function(req, res) {
        res.render('home.ejs', {
            user: req.user
        });
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // login
    app.get('/login', function(req, res) {
        res.render('home.ejs', {
            message: req.flash('loginMessage')
        });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/home', // redirect to the secure profile section
        failureRedirect: '/', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // SIGNUP =================================
    // show the signup form
    app.get('/signup', function(req, res) {
        res.render('signup.ejs', {
            message: req.flash('signupMessage')
        });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/home', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // twitter --------------------------------

    // send to twitter to do the authentication
    app.get('/auth/twitter', passport.authenticate('twitter', {
        scope: 'email'
    }));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect: '/home',
            failureRedirect: '/'
        }));


    // google ---------------------------------

    // send to google to do the authentication
    app.get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email']
    }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/home',
            failureRedirect: '/'
        }));

    // twitter

    app.get('/connect/twitter', passport.authorize('twitter', {
        scope: 'email'
    }));

    app.get('/connect/twitter/callback',
        passport.authorize('twitter', {
            successRedirect: '/home',
            failureRedirect: '/'
        }));


    // google ---------------------------------

    app.get('/connect/google', passport.authorize('google', {
        scope: ['profile', 'email']
    }));

    app.get('/connect/google/callback',
        passport.authorize('google', {
            successRedirect: '/home',
            failureRedirect: '/'
        }));

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}