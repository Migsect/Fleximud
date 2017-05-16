"use strict";

var express = require('express');
var router = express.Router();

var Accounts = require("../modules/Model/Account");
var Util = require('../modules/Util');

/* Gets the main view for authentication, aka the login screen */
router.get('/', function(request, response)
{
    /* Checking to see if the session is already logged in */
    if (request.session.account)
    {
        response.redirect("/characters");
    }
    else
    {
        response.render("auth");
    }
});

/* A request to login */
router.post('/login', function(req, res)
{
    var login = req.body;

    console.log("Login: ", login);

    /* The login info needed */
    var email = login.email;
    var pass = login.pass;

    var session = req.session;

    /* Getting the account based on the email */
    Accounts.getAccountByEmail(email).then(function(result)
    {
        console.log("Resulting:", result);
        /* If either the account is null or the password does not verify, return */
        if (!result)
        {
            res.send(
            {
                message: "badInfo"
            });
            return;
        }

        console.log("Result.ID: ", result.id);
        /* Setting the session's logged in account */
        session.account = result.id;
        console.log(session.account);

        /* Client handles redirection, send empty response */
        res.send();
    });
});

/* If someone makes a request to logout, then they will be sent back to the main auth page */
router.get('/logout', function(req, res)
{
    var session = req.session;
    /* Setting the session's account to null */
    session.account = null;

    /* Redirecting back to authentication */
    res.redirect("/");
});

/* This is a request to create an account */
router.post('/create', function(req, res)
{
    var create = req.body;

    console.log("Create:", create);

    /* Needed Info to create an account */
    var name = create.name;
    var email = create.email;
    var pass = create.pass;

    Accounts.accountExists(
    {
        $or: [
        {
            email: email
        },
        {
            name: name
        }]
    }).then(function(result)
    {
        /* If the query comes back false then */
        if (!result)
        {
            /* Creating the new account */
            var account = Accounts.createAccount(name, email, pass);
            console.log(account);

            var session = req.session;
            /* Setting the session's account */
            session.account = account.id;

            /* Client handles redirection, send empty response */
            res.send();
        }
        else
        {
            console.log("Sending NameTaken Error");
            res.send(
            {
                message: "nameTaken"
            });
        }
    });
});

module.exports = router;
