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

DescriptorsSchema.methods.setDescriptor = function(key, value) {

};
DescriptorsSchema.methods.getDescriptor = function(key) {

};

module.exports = DescriptorsSchema;
