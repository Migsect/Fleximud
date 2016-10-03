"use strict";

var Mongoose = require("mongoose");
var Schema = Mongoose.Schema;

var AttributeTypes = require("../AttributeTypes");

/* Represents a collection of attribute values */
var AttributesSchema = Schema(
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
 * @param attribute
 *            The attribute you wish to retrieve.
 */
AttributesSchema.methods.getValue = function(attribute)
{
  /* We need to know if the request attribute is a type first */
  var type = AttributeTypes.map.get(attribute);
  if (!type)
  {
    console.log("Attempted to getValue of untyped attribute: '" + attribute + "'");
    return null;
  }

  /* If it has children then its value is based on their average */
  if (type.children.length > 0)
  {
    var sum = 0;
    var attributes = this;
    type.children.forEach(function(child)
    {
      sum += attributes.getValue(child.id);
    });
    return sum / type.children.length;
  }
  else
  {
    /* Otherwise we simply return the value if it exists */
    var value = this.values[attribute];
    if (!value)
    {
      return 1;
    }
    return value;
  }
};
AttributesSchema.methods.scaleValue = function(attribute, scalar)
{
  var type = AttributeTypes.map.get(attribute);
  if (!type)
  {
    console.log("Attempted to setValue of untyped attribute: '" + attribute + "'");
    return null;
  }

  /* Scaling each child recursively */
  if (type.children.length > 0)
  {
    var attributes = this;
    type.children.forEach(function(child)
    {
      attributes.scaleValue(child.id, scalar);
    });
  }
  else
  {
    /* Scaling the value if there are no children */

    var value = this.values[attribute];
    if (!value)
    {
      value = 1;
    }
    this.values[attribute] = value * scalar;
  }
};
/**
 * This will set the value of an attribute even if that attribute has children. This performs a recursive scale on the
 * children of an attribute to make sure that their average will return the newly set value.
 * 
 * @param attribute
 *            The attribute to set the value of
 * @param value
 *            The value to set the attribute to
 */
AttributesSchema.methods.setValue = function(attribute, value)
{
  var type = AttributeTypes.map.get(attribute);
  if (!type)
  {
    console.log("Attempted to setValue of untyped attribute: '" + attribute + "'");
    return null;
  }

  /* If there are children we'll need to scale up all the children as well */
  if (type.children.length > 0)
  {
    var currentValue = this.getValue(attribute);
    var valueRatio = value / currentValue;

    var attributes = this;
    type.children.forEach(function(child)
    {
      attributes.scaleValue(child.id, valueRatio);
    });
  }
  else
  {
    this.values[attribute] = value;
  }
};

module.exports = {
  schema: AttributesSchema,
  createLiteral: function()
  {
    return {};
  }
};
