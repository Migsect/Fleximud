"use strict";

// var Promise = require("promise");

var Mongoose = require("mongoose");
var Schema = Mongoose.Schema;

var templates = require(process.cwd() + "/templates/templates");

var AttributeTypes = (function()
{
  /* Defining the attribute type class */
  var AttributeType = function(json)
  {
    this.name = json.name;
    this.id = json.id;
    this.tag = json.tag;
    this.children = json.children;
    this.color = json.color ? json.color : "#4444444";
  };

  AttributeType.prototype = {
    /**
     * Populates the children of the attribute type given a json array
     * @param  {JSON} typeMapping A Json of all the children
     */
    populateChildren: function(typeMapping)
    {
      this.children = this.children.map(function(id)
      {
        var type = typeMapping.get(id);
        if (!type)
        {
          console.log("WARNING - '" + id + "' did not have a type object defined.");
          return null;
        }
        return type;
      });
    },
    /**
     * Returns the HTML for this AttributeType (includes all the children's html as well)
     * @return {String} An HTML string
     */
    getHTML: function()
    {
      var template = templates("characterCreation/attribute");
      return template(
      {
        name: this.name,
        children: this.children.map(function(child)
        {
          return child.getHTML();
        }).join(""),
        color: this.color ? this.color : "#333333"
      });
    }
  };

  /* Getting the list of attributes */
  var typesJSON = require('../../../config/attributes.json');
  /* Mapping the jsons to objects */
  var types = new Map();
  typesJSON.forEach(function(json)
  {
    var type = new AttributeType(json);
    types.set(type.id, type);
  });
  types.forEach(function(type)
  {
    type.populateChildren(types);
  });

  /* Creating a list of types*/
  var typeList = [];
  types.forEach(function(type)
  {
    typeList.push(type);
  });
  /* Calculating the top level type */
  var tops = typeList.filter(function(type)
  {
    return !typeList.some(function(t)
    {
      return t.children.includes(type);
    });
  });
  /* We should only have one top level attribute */
  if (tops.length > 1)
  {
    console.log("WARNING - the number of root attributes is greater than 1.");
  }

  /* Creating the interfacing object */
  var typesObj = {
    top: tops[0],
    map: types
  };
  return typesObj;
})();

/* Represents a collection of attribute values */
var AttributeTreeSchema = Schema(
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
AttributeTreeSchema.methods.getValue = function(attribute)
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
    })
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
AttributeTreeSchema.methods.scaleValue = function(attribute, scalar)
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
AttributeTreeSchema.methods.setValue = function(attribute, value)
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

var Attribute = Mongoose.model('Attribute', AttributeTreeSchema);

// var a1 = new Attribute();
// // a1.normalize();
// console.log("Spirit:", a1.getValue('spirit'));
// console.log("Intuition:", a1.getValue('intuition'));
// console.log("Strength:", a1.getValue('strength'));
//
// a1.scaleValue("strength", 2.0);
// a1.setValue("intelligence", 10.0);
// a1.setValue("body", 10);
// a1.setValue("totality", 1);
// console.log("Body:", a1.getValue('body'));
// console.log("Totality:", a1.getValue('body'));
// console.log("Strength:", a1.getValue('strength'));
// console.log(a1.values);

/* Creating all the attribute types */

module.exports = {
  schema: AttributeTreeSchema,
  types: AttributeTypes
}
