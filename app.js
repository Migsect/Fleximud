"use strict";

var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require("express-session");
var engines = require('consolidate');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');

var index = require('./routes/index');
var auth = require('./routes/auth');
var client = require('./routes/client');
var account = require('./routes/account');

var app = express();

/* Variable for storing all middleware */
app.locals.middleware = {};

/* Database setup */
/* Creating the database connection */
var databaseURL = 'mongodb://localhost/devtest';
mongoose.connect(databaseURL);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.on('connected', function()
{
  console.log("Connected to the database!");
});
db.on('disconnected', function()
{
  console.log("Disconnected from the database!");
});

/* view engine setup */
app.set('views', path.join(__dirname, 'views'));
app.engine('html', engines.handlebars);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded(
{
  extended: false
}));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

/* Session setup */
var appSession = session(
{
  store: new MongoStore(
  {
    /* TODO make this configurable */
    url: "mongodb://localhost/devtest"
  }),
  secret: "macro dogs",
  cookie:
  {
    maxAge: 24 * 60 * 60 * 1000
  },
  resave: true,
  saveUninitialized: true
});
app.use(appSession);
app.locals.middleware.session = appSession;

app.use('/', index);
app.use('/auth', auth);
app.use('/account', account);
app.use('/client', client);

// catch 404 and forward to error handler
app.use(function(req, res, next)
{
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development')
{
  app.use(function(err, req, res)
  {
    res.status(err.status || 500);
    res.render('error',
    {
      message: err.message,
      error: err
    });
  });
}

module.exports = app;
