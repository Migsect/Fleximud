"use strict";

var Mongoose = require("mongoose");
var Schema = Mongoose.Schema;

var Species = require("../Classification/Species.js");

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
SpeciesSexSchema.virtual("speciesType").get(function()
{
  return Species.map.get(this.species);
});
SpeciesSexSchema.virtual("sexType").get(function()
{
  return Species.map.get(this.species).sexes.get(this.sex);
});

module.exports = SpeciesSexSchema;
