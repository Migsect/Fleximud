"use strict";

var Util = require(process.cwd() + "/modules/Util");
var scheduler = require(process.cwd() + "/modules/scheduling/Scheduler").instance;
var Task = require(process.cwd() + "/modules/scheduling/Task");

var config = require(process.cwd() + "/config/general");

var ResourceType = function(json)
{
  Util.assertNotNull(json, json.id);

  var self = this;
  Object.defineProperties(self,
  {
    name:
    {
      value: Util.isNull(json.name) ? json.id : json.name,
      enumerable: true
    },
    id:
    {
      value: json.id,
      enumerable: true
    },
    showBar:
    {
      value: Util.isNull(json.showBar) ? false : json.showBar,
      enumerable: true
    },
    stats:
    {
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
      }),
      enumerable: true
    },
    color:
    {
      value: Util.isNull(json.color) ? "#cccccc" : json.color,
      enumerable: true
    }
  });
};

/* Prototype definition */
Object.defineProperties(ResourceType.prototype,
{
  getUpdateData:
  {
    /**
     * Gets the update data for this resource object.  This will always return
     * an object and does not care about the showBar property.
     * 
     * @param  {Character} character The character to get the update data for.
     * @return {Object}              The resulting update data.
     */
    value: function(character)
    {
      var self = this;
      return {
        id: self.id,
        name: self.name,
        color: self.color,
        max: character.getStat(self.stats.max),
        value: character.getStat(self.stats.current)
      };
    }
  }
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
    value: Array.from(module.exports.map.values())
  },
  getUpdateData:
  {
    enumerable: true,
    value: function(character)
    {
      return module.exports.list.filter(function(element)
        {
          return element.showBar;
        })
        .map(function(element)
        {
          return element.getUpdateData(character);
        });
    }
  }
});

/* Scheduling all the updates for regeneration */
scheduler.schedule(new Task(function()
{
  var clientManager = require(process.cwd() + "/modules/sockets/ClientManager").instance;

  /* Getting all active characters to update */
  var characters = clientManager.activeCharacters;
  characters.forEach(function(character)
  {
    var clients = clientManager.characters.get(character.id);

    /* Updating the characters stats */
    module.exports.list.forEach(function(resourceType)
    {
      var regen = config.stats.regenUpdateRate * character.getStat(resourceType.stats.regen);
      var max = character.getStat(resourceType.stats.max);
      var current = character.getStat(resourceType.stats.current);

      var newCurrent = (current + regen) > max ? max : current + regen;
      /* Checking to see if there was a change */
      if (newCurrent == current)
      {
        return;
      }
      character.stats.setStat(resourceType.stats.current, newCurrent);

      /* Sending the update data */
      var update = {
        type: "updatebar",
        content:
        {
          id: resourceType.id,
          value: newCurrent,
          max: max
        }
      };
      clients.forEach(function(client)
      {
        client.sendUpdate("stats", update);
      });

    });
  });
}, config.stats.regenUpdateRate * scheduler.tickRate));
