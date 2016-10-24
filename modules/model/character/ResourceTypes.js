"use strict";

var Util = require(process.cwd() + "/modules/Util");

var ResourceType = function(json)
{
  Util.assertNotNull(json, json.id);

  var self = this;
  Object.defineProperties(self,
  {
    name:
    {
      enumerable: true,
      value: Util.isNull(json.name) ? json.id : json.name
    },
    id:
    {
      enumerable: true,
      value: json.id
    },
    showBar:
    {
      enumerable: true,
      value: Util.isNull(json.showBar) ? false : json.showBar
    },
    stats:
    {
      enumerable: true,
      value: Object.defineProperties(
      {},
      {
        current:
        {
          enumerable: true,
          value: Util.isNull(json.stats) || Util.isNull(json.stats.current) ? json.id + "_current" : json.stats.current
        },
        max:
        {
          enumerable: true,
          value: Util.isNull(json.stats) || Util.isNull(json.stats.max) ? json.id + "_max" : json.stats.max
        },
        efficiency:
        {
          enumerable: true,
          value: Util.isNull(json.stats) || Util.isNull(json.stats.efficiency) ? json.id + "_efficiency" : json.stats.efficiency
        },
        regen:
        {
          enumerable: true,
          value: Util.isNull(json.stats) || Util.isNull(json.stats.regen) ? json.id + "_regen" : json.stats.regen
        }
      })
    },
    color:
    {
      enumerable: true,
      value: Util.isNull(json.color) ? "#cccccc" : json.color
    }
  });
};

/* Prototype definition */
Object.defineProperties(ResourceType.prototype,
{

});

/* Exports definition */
Object.defineProperty(module.exports, "map",
{
  enumerable: true,
  value: (function()
  {
    var types = new Map();
    var resources = require(process.cwd() + "/config/stats/resources");

    /* Looping through all the resources */
    resources.forEach(function(resourceJSON)
    {
      try
      {
        var resource = new ResourceType(resourceJSON);
        types.set(resource.id, resource);
      }
      catch (error)
      {
        /* Skipping the configuration if there's an error*/
        console.log(error.name + " : " + error.message);
        return;
      }
    });

    /* Returning the resulting map */
    return types;
  })()
});
Object.defineProperties(module.exports,
{
  list:
  {
    enumerable: true,
    value: Array.from(module.exports.map.keys())
  }
});
