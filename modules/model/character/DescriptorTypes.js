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
      value: json.id,
      enumerable: true
    },
    type:
    {
      value: json.type,
      enumerable: true
    },
    name:
    {
      value: Util.isNull(json.name) ? null : json.name,
      enumerable: true
    },
    transforms:
    {
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
          var storedValue = character.descriptors.getDescriptor(json.id);
          /* We'll add onto it if it is a number */
          if (Util.isNumber(value) && Util.isNumber(storedValue))
          {
            return value + storedValue;
          }
          /* Otherwise we'll just return the character's current value for it */
          else
          {
            return storedValue;
          }
        }));

        return map;
      })(),
      enumerable: true
    }
  });
};

Object.defineProperties(DescriptorType.prototype,
{});

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
