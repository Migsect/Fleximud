"use strict";

var express = require('express');
var router = express.Router();

var Accounts = require("../modules/model/Account");
var Util = require('../modules/Util');

/* Main page get */
router.get('/', function(req, res, next)
{
    var session = req.session;
    var accountId = session.account;
    Accounts.getAccountById(accountId).then(function(account)
    {
        if (Util.isNull(account))
        {
            res.redirect("/auth");
        }

        console.log(account);

        res.render("account/account",
        {
            account : account
        });
    });

});

router.get('/create', function(req, res, next)
{
    console.log("Going into create");
    var session = req.session;
    var accountId = session.account;
    Accounts.getAccountById(accountId).then(function(account)
    {
        console.log("Inside Promise");
        if (Util.isNull(account))
        {
            res.redirect("/auth");
        }

        res.render("account/create",
        {
            account : account
        });
        console.log("Ending Promise");
    });

});

router.get('/admin', function(req, res, next)
{
    console.log("Going into admin");
    var session = req.session;
    var accountId = session.account;
    Accounts.getAccountById(accountId).then(function(account)
    {
        console.log("Inside Promise");
        if (Util.isNull(account))
        {
            res.redirect("/auth");
        }

        if (account.name != 'radmin')
        {
            res.redirect("/account");
        }

        Accounts.getAccounts().then(function(accounts)
        {
            console.log("Got all accounts!", accounts);
            res.render("account/admin",
            {
                accounts : accounts
            });
            console.log("Leaving accounts");
        });
        console.log("Ending Promise");
    });

});

module.exports = router;