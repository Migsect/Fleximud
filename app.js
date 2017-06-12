"use strict";

const express = require("express");
const path = require("path");
// var favicon = require('serve-favicon');
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);

const http = require("http");

const config = require("./config/general");

const Logger = require(process.cwd() + "/modules/Logger");

const app = express();
const server = http.createServer(app);

/* ########################################################################## *
 * # Configuration initialization                                           # *  
 * ########################################################################## */

// require("./modules/location/Location");
// require("./modules/Model/Character/Classifications/Classification");
// require("./modules/Model/Character/Descriptors/DescriptorType");
// require("./modules/Model/Character/Attributes/AttributeType");
// require("./modules/Model/Character/ResourceTypes");

Logger.info("Configuration: Loaded");

/* ########################################################################## *
 * # Setting up the scheduler                                               # *  
 * ########################################################################## */
const Scheduler = require("./modules/Scheduling/Scheduler");
Scheduler.instance.start();

Logger.info("Scheduler: Loaded");

/* ########################################################################## *
 * # Handling database initialization                                       # *  
 * ########################################################################## */
/* Creating the database connection + manager */
const databaseConfig = config.database;
const DatabaseManager = require("./modules/Database/DatabaseManager");
const databaseManager = DatabaseManager.initialize(databaseConfig);

/* Setting up the database tables */
require("./modules/Model/Account").initializeDatabase();
// require("./modules/Model/Character/Character").initializeDatabase();

Logger.info("Database: Loaded");

/* ########################################################################## *
 * # Setting up sessions and other middleware                               # *  
 * ########################################################################## */

/* Setting up winston for logging */
const winston = require("winston");
const expressWinston = require("express-winston");
app.use(expressWinston.logger(
{
    transports: [
        new winston.transports.Console(
        {
            json: false,
            colorize: true
        })
    ],
    meta: false,
    msg: "HTTP {{req.method}} {{req.url}}",
    expressFormat: true,
    colorize: true,
    ignoreRoute: function()
    {
        return false;
    }
}));

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
    store: new KnexSessionStore(
    {
        createtable: true,
        tablename: "sessions",
        knex: DatabaseManager.instance.connection
    }),
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
 * # Socket.io initialization                                               # *  
 * ########################################################################## */
const io = require("socket.io")(server);
const sharedsession = require("express-socket.io-session");

const ClientManager = require(process.cwd() + "/modules/sockets/ClientManager").instance;
io.on("connection", function(socket)
{
    ClientManager.onConnection(socket);
});
/* Setting up socket to have access to the session variable */
io.use(sharedsession(app.locals.middleware.session,
{
    autoSave: true
}));

/* ########################################################################## *
 * # Setting up the routes                                                  # *  
 * ########################################################################## */

const index = require("./routes/index");
const auth = require("./routes/auth");
const creation = require("./routes/creation");
const characters = require("./routes/characters");
// const client = require("./routes/client");
// const account = require("./routes/account");

app.use("/'", index);
app.use("/auth", auth);
app.use("/creation", creation);
app.use("/characters", characters);
// app.use('/account', account);
// app.use('/client', client);

Logger.info("Routes: Loaded");

/* ########################################################################## *
 * # Setting up the plugins                                                 # *  
 * ########################################################################## */
const PluginManager = require("./modules/Plugins/PluginManager");
PluginManager.registerPlugins();
PluginManager.loadPlugins();

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

module.exports = {
    app: app,
    server: server
};
