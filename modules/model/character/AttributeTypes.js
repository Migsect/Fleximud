"use strict";

// var Promise = require("promise");

var templates = require(process.cwd() + "/templates/templates");

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
    console.log("getting html");
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
