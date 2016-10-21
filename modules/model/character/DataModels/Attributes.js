"use strict";

var Mongoose = require("mongoose");
var Schema = Mongoose.Schema;

var AttributeTypes = require("../AttributeTypes");
var Util = require(process.cwd() + "/modules/Util");

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
 * @param attribute The attribute you wish to retrieve.
 */
AttributesSchema.methods.getAttribute = function(attribute)
{
  /* We need to know if the request attribute is a type first */
  var type = AttributeTypes.map.get(attribute);
  if (!type)
  {
    console.log("Attempted to getAttribute of untyped attribute: '" + attribute + "'");
    return null;
  }

  /* If it has children then its value is based on their average */
  if (type.children.length > 0)
  {
    var sum = 0;
    var attributes = this;
    type.children.forEach(function(child)
    {
      sum += attributes.getAttribute(child.id);
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
AttributesSchema.methods.scaleAttribute = function(attribute, scalar)
{
  var type = AttributeTypes.map.get(attribute);
  if (!type)
  {
    console.log("Attempted to setAttribute of untyped attribute: '" + attribute + "'");
    return null;
  }

  /* Scaling each child recursively */
  if (type.children.length > 0)
  {
    var attributes = this;
    type.children.forEach(function(child)
    {
      attributes.scaleAttribute(child.id, scalar);
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
AttributesSchema.methods.setAttribute = function(attribute, value)
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
    var currentValue = this.getAttribute(attribute);
    var valueRatio = value / currentValue;

    var attributes = this;
    type.children.forEach(function(child)
    {
      attributes.scaleAttribute(child.id, valueRatio);
    });
  }
  else
  {
    this.values[attribute] = value;
  }
};

/**
 * Generates update data for the stats.
 * This will return a single object representing the root attribute.
 * 
 * @param  {Number} level The level or tier to not assign the hidden tag to.
 * @return {Object[]}     The root data object, contains children.
 */
AttributesSchema.methods.getUpdateData = function(character, level, type)
{
  var self = this;
  type = Util.isNull(type) ? AttributeTypes.top : type;

  return {
    id: type.id,
    name: type.name,
    value: character.getStat(type.id),
    hidden: level >= 0 ? false : true,
    color: type.color,
    children: type.children.map(function(child)
    {
      return self.getUpdateData(character, level - 1, child);
    })
  };
};

Object.defineProperties(module.exports,
{
  schema:
  {
    value: AttributesSchema
  },
  createLiteral:
  {
    value: function()
    {
      return {
        values:
        {}
      };
    }
  }
});
