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
/**
 * Retrieves the "quick" name that this name model represents.
 * The name will be the shortname if it exists, otherwise it will be the
 * full name as a fallback.  (short name is not required to exist)
 * 
 * @return {String} The determined quick name.
 */
NameSchema.virtual("name").get(function()
{
  return this.shortName ? this.shortName : this.fullName;
});

module.exports = {
  schema: NameSchema,
  createLiteral: function(fullName, shortName)
  {
    /* TODO Add check to make sure fullName exists */
    return {
      fullName: fullName,
      shortName: shortName ? shortName : null
    };
  }
};
