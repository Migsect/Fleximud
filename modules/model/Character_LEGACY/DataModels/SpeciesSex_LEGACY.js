"use strict";

var Mongoose = require("mongoose");
var Schema = Mongoose.Schema;

var Species = require("../Classification/Species.js");

/**
 * The SpeciesSex Schema is used to represent the species and sex of a character.
 * It is mostly represented by two strings which are identifiers for the sex
 * and species type objects.  These can be retrieved through helper functions.
 * 
 * @type {Schema}
 */
var SpeciesSexSchema = new Schema(
{
  species:
  {
    type: String,
    required: true
  },
  sex:
  {
    type: String,
    required: true
  }
});
/**
 * @return {Species} The species of that is represented within this species sex.
 */
SpeciesSexSchema.virtual("speciesType").get(function()
{
  return Species.map.get(this.species);
});
/**
 * @return {Classification} The sex that is represented within this species sex.
 */
SpeciesSexSchema.virtual("sexType").get(function()
{
  return Species.map.get(this.species).sexes.get(this.sex);
});

module.exports = {
  /**
   * THe schema object
   * 
   * @type {Mongoose.Schema}
   */
  schema: SpeciesSexSchema,
  /**
   * @param species {String} The species identifier
   * @param sex {String} The sex identifier
   * @return {Object Literal} The literal to be used within a object model
   */
  createLiteral: function(species, sex)
  {
    return {
      species: species,
      sex: sex
    };
  }
};
