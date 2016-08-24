"use strict";

var uuid = require("node-uuid");

var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

var Attributes = require("./DataModels/Attributes");
var SpeciesSex = require("./DataModels/SpeciesSex");
var Descriptors = require("./DataModels/Descriptors");
var Name = require("./DataModels/Name");

/**
 * The character schema is represented by a character id and the character's data.
 * The character data can be anything ranging from their name to an attribute.*Because the character model may change,
 we make use of a conglomerated data attribute 
 * to store a character's varied data.
 */
var CharacterSchema = Schema(
{
  id:
  {
    type: String,
    required: true
  },
  accountId:
  {
    type: Schema.Types.ObjectId,
    ref: "Account",
    required: true
  },
  name:
  {
    type: Name.schema,
    required: true
  },
  attributes:
  {
    type: Attributes.schema,
    required: true
  },
  speciesSex:
  {
    type: SpeciesSex.schema,
    require: true
  },
  descriptors:
  {
    type: Descriptors.schema,
    require: true
  }

});
var Character = Mongoose.model("Character", CharacterSchema);

module.exports = {
  schema: CharacterSchema,
  /**
   * Creates a new character under the specified accout.
   *
   * @param  {Account} account The account that the character is being made under.
   * @param  {JSON} JSON An object literal to represent the character data to use.
   * @return {CharacterModel} The character model that was created.
   */
  createCharacter: function(account, JSON)
  {
    /* Generating information */
    var id = uuid.v4();
    /* Creating the actual model */
    var character = new Character(
    {
      id: id,
      accountId: account._id,
      name: Name.createLiteral(JSON.fullName, JSON.shortName),
      attributes: Attributes.createLiteral(),
      speciesSex: SpeciesSex.createLiteral(JSON.species, JSON.sex),
      descriptors: Descriptors.createLiteral()
    });
    /* Performing attribute and descriptor adding */

    /* Saving the character */
    character.save(function(err, document)
    {
      if (err) return console.error(err);
      console.log("Saved Character to Database:", document);
    });
    /* Adding the character to an account */
    account.addCharacter(character);
    return character;
  },
  getCharacter: function(query) {

  },
  getChatacterByName: function(name) {

  },
  getCharacterById: function(id) {

  }
};
