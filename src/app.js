
const express = require("express");
const path = require("path");
const engine = require('ejs-mate');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const morgan = require('morgan');
const app = express();

// initializations  
require('./database');
require('./passport/local-auth');

// settings
app.set("port", process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', engine);
app.set('view engine', 'ejs');

// static files
app.use(express.static(path.join(__dirname, "public")));

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: 'mysecretsession',
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

app.use(passport.initialize());

app.use(passport.session());

app.use((req, res, next) => {
    app.locals.signinMessage = req.flash('signinMessage');
    app.locals.signupMessage = req.flash('signupMessage');
    app.locals.user = req.user;
    next();
});

// routes
app.use('/', require('./routes/index'));

module.exports = app;
