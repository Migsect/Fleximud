"use strict";

var express = require("express");
var router = express.Router();

var templates = require("../templates/templates");
var config = require("../config/general.json");

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

  response.render("account/account",
  {
    account: account,
    topBar: templates("topBar")(
    {
      account: account,
      character: null
    })
  });

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
    attributeCount: config.characterCreation.maxAttributeChoices,
    speciesItems: speciesItems,
    speciesInfos: speciesInfos,
    speciesDescriptors: speciesDescriptors
  });

});

/* Creates a character */
router.post("/createCharacter", accountGrabber, function(request, response)
{
  /* Grabbing the account */
  var account = request.account;
  /* Getting the data */
  var data = request.body;

  /* ==== Validating the received data ==== */
  /* Checking if there is a fullname or if the fullname is no empty */
  if (!data.fullName || data.fullName.length <= 0)
  {
    response.status(400).send("No full name provided.");
    return;
  }
  /* Checking if the fullName fits the constaints */
  if (data.fullName.length < config.characterCreation.minimumLongNameLength)
  {
    response.status(400).send("The name must be at least " + config.characterCreation.minimumLongNameLength + " characters long.");
    return;
  }
  /* Checking if a species was included */
  if (!data.species)
  {
    response.status(400).send("No species specified.");
    return;
  }
  /* Checking if the species is a valid species type */
  if (!Species.map.has(data.species))
  {
    response.status(400).send("'" + data.species + "' specified is not a valid species.");
    return;
  }
  /* Checking if the sex was a valid sex of the species */
  var speciesType = Species.map.get(data.species);
  /* Checking if a sex was specified */
  if (!data.sex)
  {
    response.status(400).send("No sex specified.");
    return;
  }
  /* Checking if the sex is a valid sex type */
  if (!speciesType.sexes.has(data.sex))
  {
    response.status(400).send("'" + data.sex + "' specified is not a valid sex for '" + data.species + "'.");
    return;
  }
  /* Checking the attributes is of the correct length */
  if (data.attributes && data.attributes.length > config.attributeChoices)
  {
    response.status(400).send("Too many attributes selected.");
    return;
  }

  /* ==== End Data Validation ==== */

  /* Creating the character */
  Character.createCharacter(account, data, function()
  {
    response.status(200).send("Charcter Created.");
  }, function()
  {
    response.status(500).send("Character failed to save.");
  });

});

/* Deletes a character, character must be in account otherwise it errors */
router.post("/deleteCharacter", accountGrabber, function(request, response)
{
  /* Grabbing the account */
  var account = request.account;
  /* Getting the data */
  var data = request.body;
  console.log(data);

  if (!data.character)
  {
    response.status(400).send("Failed to specify a character id.");
    return;
  }

  var characterId = data.character;
  if (account.characters.some(function(character)
    {
      return characterId == character.id;
    }))
  {
    Character.deleteCharacter(
    {
      id: characterId
    }).then(function()
    {
      response.status(200).send("Character Deleted.");
    });
  }
  else
  {
    response.status(400).send("Character specified was not listed under this account");
    return;
  }
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
