"use strict";

var Mongoose = require("mongoose");
var Schema = Mongoose.Schema;

/* Represents a collection of attribute values */
var DescriptorsSchema = Schema(
{
  /* All the attribute values in key-value pairs */
  values:
  {
    type: Schema.Types.Mixed,
    "default":
    {}
  }
});

/**
 * @param {String} The key of the descriptor
 * @param {Value} The value to set the descriptor to
 */
DescriptorsSchema.methods.setDescriptor = function(key, value)
{
  this.values[key] = value;
};
/**
 * @param  {String} The key of the descriptor to return
 * @return {Value} The value that the key had, otherwise null.
 */
DescriptorsSchema.methods.getDescriptor = function(key)
{
  return this.values[key];
};

module.exports = {
  schema: DescriptorsSchema,
  createLiteral: function()
  {
    return {
      values:
      {}
    };
  }
};
