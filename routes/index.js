'use strict';

var express = require('express');
var router = express.Router();

var Accounts = require("../modules/model/Account");

var templates = require('../templates/templates')

/* GET home page. */
router.get('/', function(req, res, next)
{
    var session = req.session;
    var accountId = session.account;

    function render(account)
    {
        res.render('index',
        {
            topBar : templates.topBar(
            {
                character : null,
                account : account
            })
        });
    }

    if (!accountId)
    {
        render(null);
    } else
    {
        Accounts.getAccountById(accountId).then(function(account)
        {
            render(account);
        });
    }

});

module.exports = router;
