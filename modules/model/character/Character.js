"use strict";

var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

var AttributesSchema = require("./DataModels/Attributes");var SpeciesSexSchema = require("./DataModels/SpeciesSex");

var DescriptorsSchema = require("./DataModels/Descriptors");

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
  attributes:
  {
    type: AttributesSchema,
    required: true
  },
  speciesSex:
  {
    type: SpeciesSexSchema,
    require: true
  },
  descriptors:
  {
    type: DescriptorsSchema,
    require: true
  }

});
var Character = Mongoose.model("Character", CharacterSchema);

module.exports = {
  schema: CharacterSchema,
  createCharacter: function()
  {
    // TODO
  },
  getCharacter: function(query) {

  },
  getChatacterByName: function(name) {

  },
  getCharacterById: function(id) {

  }
};
