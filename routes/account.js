"use strict";

var express = require('express');
var router = express.Router();

var templates = require('../templates/templates');

var Accounts = require("../modules/model/Account");
var Util = require('../modules/Util');

var Species = require("../modules/model/character/Classification/Species");
var Attributes = require("../modules/model/character/AttributeTypes");

/* Main page get */
router.get('/', function(req, res)
{
  var session = req.session;
  var accountId = session.account;
  Accounts.getAccountById(accountId).then(function(account)
  {
    if (Util.isNull(account))
    {
      res.redirect("/");
    }

    res.render("account/account",
    {
      account: account,
      topBar: templates("topBar")(
      {
        account: account,
        character: null
      })
    });
  });

});

/* Character Creation Page */
router.get('/create', function(req, res)
{

  var session = req.session;
  var accountId = session.account;
  Accounts.getAccountById(accountId).then(function(account)
  {
    if (Util.isNull(account))
    {
      res.redirect("/");
    }

    var speciesItems = Species.list.map(function(species)
    {
      return species.getItemHTML();
    }).join("");
    var speciesInfos = Species.list.map(function(species)
    {
      return species.getInfoHTML();
    }).join("");
    var speciesDescriptors = Species.list.map(function(species)
    {
      return species.getDescriptorHTML();
    }).join("");

    res.render("account/create",
    {
      account: account,
      topBar: templates("topBar")(
      {
        account: account,
        character: null
      }),
      attributeTree: Attributes.top.getHTML(),
      attributeCount: 5,
      speciesItems: speciesItems,
      speciesInfos: speciesInfos,
      speciesDescriptors: speciesDescriptors
    });
  });
});

/* Admin Control Panel Page */
router.get('/admin', function(req, res)
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
        accounts: accounts
      });
      console.log("Leaving accounts");
    });
    console.log("Ending Promise");
  });

});

module.exports = router;
