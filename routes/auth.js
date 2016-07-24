"use strict";

var express = require('express');
var router = express.Router();

var Accounts = require("../modules/model/Account");
var Util = require('../modules/Util');

/* Main page get */
router.get('/', function(req, res, next)
{
    /* Checking to see if the session is already logged in */
    if (req.session.account)
    {
        res.redirect("/account");
    } else
    {
        res.redirect("/");
    }
});
router.post('/login', function(req, res, next)
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
                message : "badInfo"
            });
            return;
        }

        console.log("Result.ID: ", result.id);
        /* Setting the session's logged in account */
        session.account = result.id;
        console.log(session.account)

        /* Client handles redirection, send empty response */
        res.send();
    });
});
router.post('/create', function(req, res, next)
{
    var create = req.body;

    console.log("Create:", create);

    /* Needed Info to create an account */
    var name = create.name;
    var email = create.email;
    var pass = create.pass;

    Accounts.accountExists(
    {
        $or : [
        {
            email : email
        },
        {
            name : name
        } ]
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
            res.send()
        } else
        {
            console.log("Sending NameTaken Error");
            res.send(
            {
                message : "nameTaken"
            });
        }
    });
});
router.get('/logout', function(req, res, next)
{
    var session = req.session;
    /* Setting the session's account to null */
    session.account = null;

    /* Redirecting back to authentication */
    res.redirect("/");
});

module.exports = router;
