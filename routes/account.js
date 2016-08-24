"use strict";

var express = require("express");
var router = express.Router();

var templates = require("../templates/templates");

var accountGrabber = require(process.cwd() + "/modules/middleware/accountGrabber");

var Accounts = require("../modules/model/Account");
var Character = require("../modules/model/character/Character");
var Util = require("../modules/Util");

var Species = require("../modules/model/character/Classification/Species");
var Attributes = require("../modules/model/character/AttributeTypes");

/* Main page get */
router.get("/", accountGrabber, function(request, response)
{
  var account = request.account;

  // var session = req.session;
  // var accountId = session.account;
  // Accounts.getAccountById(accountId).then(function(account)
  // {
  //   if (Util.isNull(account))
  //   {
  //     res.redirect("/");
  //   }

  response.render("account/account",
  {
    account: account,
    topBar: templates("topBar")(
    {
      account: account,
      character: null
    })
  });
  // });

});

/* Character Creation Page */
router.get("/create", accountGrabber, function(request, response)
{

  var account = request.account;

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

  response.render("account/create",
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
/* Creates a character */
router.post("/createCharacter", accountGrabber, function(request, response)
{
  var account = request.account;
  /* Getting the data */
  var data = request.body;

  /* Extracting the character information */
  var newCharacter = Character.createCharacter(account, data);

  response.status(200).send("It's kay: " + JSON.stringify(data));
});

/* Admin Control Panel Page */
router.get("/admin", accountGrabber, function(request, response)
{
  var account = request.account;
  console.log("Inside Promise");
  if (Util.isNull(account))
  {
    response.redirect("/auth");
  }

  if (account.name != "radmin")
  {
    response.redirect("/account");
  }

  Accounts.getAccounts().then(function(accounts)
  {
    console.log("Got all accounts!", accounts);
    response.render("account/admin",
    {
      accounts: accounts
    });
    console.log("Leaving accounts");
  });
  console.log("Ending Promise");

});

module.exports = router;
