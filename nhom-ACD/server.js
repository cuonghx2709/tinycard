// server.js

// set up ======================================================================
// get all the tools we need
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

const leassonRouter = require('./modules/api/lesson/router')
const fileController = require('./utils/fileController')
const lessonController = require('./modules/api/lesson/controller')
const cardController = require('./modules/api/cardlesson/controller')

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url, (err) => {
    if (err) console.log(err)
    console.log("Database connect success")

    lessonController.getAll().then(docs => {
        if (docs.length == 0) {
            console.log("created")
            let data = [...fileController.readFile('./dataLesson.json')]
            data.forEach((element) => {
                let d = {title: element.title, id: element.id, imagePath: element.imgPath}
                lessonController.createLesson(d).then(data => {
                    console.log(data.id)
                }).catch(err => {
                    console.log(err)
                })
            })
        }
    }).catch(err => {
        console.log(err)
    })

    cardController.getAll().then(docs => {
        if(docs.length == 0) {
            console.log("created")
            let data = [...fileController.readFile('./database.json')]
            data.forEach((element) => {
                let idlesson = element.idlesson
                element.lessonContent.forEach((element) => {
                    let newCard = {title : element.title, idLesson: idlesson, imagePath: element.imgPath}
                    cardController.createCard(newCard).then(data => {
                        console.log(data._id)
                    }).catch(err => {
                        console.log(err)
                    }) 
                })
            })
        }
    })
}); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'ilovescotchscotchyscotchscotch', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
// launch ======================================================================
app.listen(port, (err) => {
    if (err) console.log(err)
    console.log('Sever starting at port: ' + port);
});

