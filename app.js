"use strict";

const express = require("express");
const path = require("path");
// var favicon = require('serve-favicon');
// var logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");

const config = require("./config/general");

const Logger = require(process.cwd() + "/modules/Logger");

const app = express();

/* ########################################################################## *
 * # Configuration initialization                                           # *  
 * ########################################################################## */

require("./modules/location/Location");
require("./modules/model/character/DescriptorTypes");
require("./modules/model/character/AttributeTypes");
require("./modules/model/character/ResourceTypes");

Logger.info("Configuration: Loaded");

/* ########################################################################## *
 * # Setting up the scheduler                                               # *  
 * ########################################################################## */
const Scheduler = require("./modules/scheduling/Scheduler");
Scheduler.instance.start();

Logger.info("Scheduler: Loaded");

/* ########################################################################## *
 * # Handling database initialization                                       # *  
 * ########################################################################## */
/* Creating the database connection + manager */
const databaseConfig = config.database;
const DatabaseManager = require("./modules/database/DatabaseManager");
const databaseManager = DatabaseManager.initialize(databaseConfig);

/* Setting up the database tables */
const Account = require("./modules/model/Account");
Account.initializeDatabase(databaseManager.connection);

Logger.info("Database: Loaded");

/* ########################################################################## *
 * # Setting up sessions and other middleware                               # *  
 * ########################################################################## */

/* Variable for storing all middleware */
app.locals.middleware = {};

/* View engine setup */
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "hbs");

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded(
{
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

/* Session setup */
const appSession = session(
{
  secret: config.sessions.secret ? config.sessions.secret : "secrety secret",
  cookie:
  {
    maxAge: config.sessions.maxAge ? config.sessions.maxAge : 3600000 /* An hour */
  },
  resave: true,
  saveUninitialized: true
});
app.use(appSession);
// app.locals.middleware.session = appSession;

Logger.info("Webapp: Loaded");

/* ########################################################################## *
 * # Setting up the routes                                                  # *  
 * ########################################################################## */

const index = require("./routes/index");
const auth = require("./routes/auth");
const client = require("./routes/client");
const account = require("./routes/account");

app.use('/', index);
app.use('/auth', auth);
app.use('/account', account);
app.use('/client', client);

Logger.info("Routes: Loaded");

/* ########################################################################## *
 * # Developer / Debug Stuff                                                # *  
 * ########################################################################## */

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
