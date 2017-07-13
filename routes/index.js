'use strict';

const express = require('express');
const router = express.Router();

const GlobalLayout = require("./layouts/global/global");
const templates = require(process.cwd() + "/templates/templates");
// var topBar = templates("topBar");

/* GET home page. */
router.get('/', function(req, res)
{
    res.status(200).send("Index Folks!");
    // var session = req.session;
    // var accountId = session.account;

    // function render(account)
    // {
    //   res.render('index',
    //   {
    //     topBar: topBar(
    //     {
    //       character: null,
    //       account: account
    //     })
    //   });
    // }

    // if (!accountId)
    // {
    //   render(null);
    // }
    // else
    // {
    //   Accounts.getAccountById(accountId).then(function(account)
    //   {
    //     render(account);
    //   });
    // }

});

module.exports = router;
