"use strict";

var Util = require(process.cwd() + "/modules/Util");
var Transform = require(process.cwd() + "/modules/DataStructures/Transform");

var templates = require(process.cwd() + "/templates/templates");

/**
 * Attribute types store information on attributes, such as sub-attributes as well
 * as help text.  They also determine implementation of some stats.
 * 
 * @param {Object} json Configuration object the attribute type is based on.
 */
var AttributeType = function(json)
{
  /* Validating the inputs */
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
      writable: true,
      value: Util.isNull(json.children) ? [] : json.children
    },
    color:
    {
      value: Util.isNull(json.color) ? "#444444" : json.color
    },
    transforms:
    {
      /**
       * Transforms for the AttributeType
       */
      value: (function()
      {
        var map = Util.isNull(json.transforms) ? new Map() : Transform.parseDirectedTransforms(json.transforms);
        /* Adding the descriptor id if it is not in there*/
        if (!map.has(json.id))
        {
          map.set(json.id, []);
        }

        /* Getting the base attribute off */
        map.get(json.id).push(Transform.createTransform(function(value, character)
        {
          return value + character.attributes.getAttribute(json.id);
        }));

        return map;
      })()
    }
  });
};

Object.defineProperties(AttributeType.prototype,
{
  populateChildren:
  {
    /**
     * Populates the children of the attribute type given a json array
     * @param  {JSON} typeMapping A Json of all the children
     */
    value: function(typeMapping)
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
    }
  },
  getHTML:
  {
    /**
     * Returns the HTML for this AttributeType (includes all the children's html as well)
     * @return {String} An HTML string
     */
    value: function()
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
  }
});

Object.defineProperty(module.exports, "map",
{
  /**
   * Map of the attribute ids to their attribute object.
   * This should include all attributes.
   * 
   * @type {[Map<String, AttributeType>}
   */
  value: (function()
  {
    /* Getting the list of attributes */
    var typesJSON = require("../../../config/attributes.json");

    /* Mapping the jsons to objects */
    var types = new Map();

    /* Creating all the AttributeTypes from the JSONs */
    typesJSON.forEach(function(json)
    {
      var type = new AttributeType(json);
      types.set(type.id, type);
    });

    /* Populating the children of each type */
    types.forEach(function(type)
    {
      type.populateChildren(types);
    });

    /* Returning the type */
    return types;
  })()
});

Object.defineProperties(module.exports,
{
  list:
  {
    value: (function()
    {
      return Array.from(module.exports.map.keys());
    })()
  },
  top:
  {
    /**
     * The top level attribute.
     * 
     * @type {AttributeType}
     */
    value: (function()
    {
      /* Creating a list of types*/
      var typeList = [];
      module.exports.map.forEach(function(type)
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

      return tops[0];
    })()
  },
  transforms:
  {
    value: (function()
    {
      var transformMap = new Map();
      module.exports.map.forEach(function(type)
      {
        type.transforms.forEach(function(transformArray, key)
        {
          /* Initializing empty array if it doesn't have the key */
          if (!transformMap.has(key))
          {
            transformMap.set(key, []);
          }
          /* Combining the two lists */
          Array.prototype.push.apply(transformMap.get(key), transformArray);
        });
      });
      return transformMap;
    })()
  }
});
