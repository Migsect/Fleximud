"use strict";

var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

var Attribute = require('./Attribute.js');
var AttributeTreeSchema = Attribute.schema;
var AttributeTypeSchema = Attribute.typeSchema;

var Species = require("./Classification/Species.js");

var CharacterSchema = Schema(
{
  name:
  {
    type: String,
    required: true
  },
  id:
  {
    type: String,
    required: true
  },
  attributes: AttributeTreeSchema,
  species:
  {
    type: String,
    required: true
  },
  size:
  {
    type: Number,
    "default": 1
  }
}); // Hello

var Character = Mongoose.model('Character', CharacterSchema);

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
