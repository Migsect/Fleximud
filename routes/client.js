"use strict";

var express = require('express');
var router = express.Router();
var accountGrabber = require(process.cwd() + "/modules/middleware/accountGrabber");

var templates = require(process.cwd() + "/templates/templates");

router.get('/', accountGrabber, function(request, response)
{
  /* The account */
  var account = request.account;
  /* The character id for the account */
  var characterId = request.query.character;
  var character = account.characters.find(function(character)
  {
    return character.id === characterId;
  });

  if (!character)
  {
    response.redirect("/account");
    return;
  }

  /* Rendering the base client */
  response.render("client",
  {
    account: account,
    fullName: character.name.fullName,
    shortName: character.name.shortName,
    species: character.speciesSex.species,
    sex: character.speciesSex.sex,
    character: character,
    topBar: templates("topBar")(
    {
      account: account,
      character: character
    })
  });
});

module.exports = router;
