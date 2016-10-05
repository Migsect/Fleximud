"use strict";

var Util = require(process.cwd() + "/modules/Util");
// var Promise = require("promise");

var templates = require(process.cwd() + "/templates/templates");

/**
 * Attribute types store information on attributes, such as sub-attributes as well
 * as help text.  They also determine implementation of some stats.
 * 
 * @param {[type]} json Configuration object the attribute type is based on.
 */
var AttributeType = function(json)
{
  Util.assertNotNull(json, json.name, json.id, json.tag);

  var self = this;
  Object.defineProperties(self,
  {
    name:
    {
      value: json.name
    },
    id:
    {
      value: json.id
    },
    tag:
    {
      value: json.tag
    },
    children:
    {
      value: Util.isNull(json.children) ? [] : json.children
    },
    color:
    {
      value: Util.isNull(json.color) ? "#444444" : json.color
    }
  });
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
      id: this.id,
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

module.exports = {
  top: tops[0],
  map: types
};
