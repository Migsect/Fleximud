"use strict";

var uuid = require("node-uuid");

var Mongoose = require("mongoose");
var Schema = Mongoose.Schema;
var dbUtils = require(process.cwd() + "/modules/DatabaseUtil");

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
  /** @type {UUID} The unique ID of the character that is allowed to be shown on the front end. */
  id:
  {
    type: String,
    required: true
  },
  /** @type {ObjectId.Account} The objectId of the account this character belongs to. */
  accountId:
  {
    type: Schema.Types.ObjectId,
    ref: "Account",
    required: true
  },
  /** @type {Name Schema} An object that stores name information about the character */
  name:
  {
    type: Name.schema,
    required: true
  },
  /** @type {Attributes Schema} An object that stores or calculates the attributes of a character */
  attributes:
  {
    type: Attributes.schema,
    required: true
  },
  /** @type {SpeciesSex Schema} An objet that stores the species-sex of the character */
  speciesSex:
  {
    type: SpeciesSex.schema,
    require: true
  },
  /** @type {Decriptors Schema} An object that stores all the descriptors of the character */
  descriptors:
  {
    type: Descriptors.schema,
    require: true
  },
  /** @type {String} A location path that depicts the location of the character. */
  locationPath:
  {
    type: String
  }
});

/* Defining listeners on the database */
/* Too complicated for now, going to instead do a check on each tick
 * If tick rates become too slow, we'll revert this back to the original
 * but that may wish to make a wrapper class around the data models when we do.
 */
// dbUtils.defineObserverPattern(CharacterSchema, "change");

/**
 * Retrieves the location object for the character.
 * This transforms the path into a location by using the location graph.
 * 
 * @return {Location} The location object the character is in.
 */
CharacterSchema.method.getLocation = function()
{
  /* TODO Get the location object */
};

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
