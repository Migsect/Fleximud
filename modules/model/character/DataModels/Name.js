"use strict";

var Mongoose = require("mongoose");
var Schema = Mongoose.Schema;

var NameSchema = new Schema(
{
  fullName:
  {
    type: String,
    required: true
  },
  shortName:
  {
    type: String
  }
});
NameSchema.virtual("name").get(function()
{
  return this.shortName ? this.shortName : this.fullName;
});

module.exports = NameSchema;
