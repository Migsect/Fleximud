"use strict";

var Util = require(process.cwd() + "/modules/Util");
var Transform = require(process.cwd() + "/modules/DataStructures/Transform");

/**
 * A descriptor type is additional global definition for certain classes of
 * descriptors. This allows for transforms to be assigned to descriptors as well
 * as have generally formatting for descriptors.
 * 
 * @param {Object} json Base configuration object
 */
var DescriptorType = function(json)
{
  var self = this;
  Object.defineProperties(self,
  {
    id:
    {
      value: json.id
    },
    type:
    {
      value: json.type
    },
    name:
    {
      value: Util.isNull(json.name) ? null : json.name
    },
    transforms:
    {
      value: Util.isNull(json.transforms) ? [] : json.transforms.forEach(function(element)
      {
        return Transform.createTransform(element);
      })
    }
  });
};

Object.defineProperties(DescriptorType.prototype,
{
  getStatTransform:
  {
    value: function() {

    }
  }
});
/* Defining the map of all the types */
Object.defineProperty(module.exports, "map",
{
  value: (function()
  {
    var descriptorTypes = require(process.cwd() + "/config/descriptors");
    var map = new Map();

    descriptorTypes.forEach(function(descriptorTypeJSON)
    {
      var descriptorType = new DescriptorType(descriptorTypeJSON);
      map.set(descriptorType.id, descriptorType);
    });

    return map;
  })()
});

/* The rest of the module exports */
Object.defineProperties(module.exports,
{
  transforms:
  {
    value: (function()
    {
      var transformMap = new Map();
      module.exports.map.forEach(function(type)
      {
        transformMap.set(type.id, type.getStatTransform());
      });
      return transformMap;
    })()
  }
});
