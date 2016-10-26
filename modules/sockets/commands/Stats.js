"use strict";

var Command = require("../Command");
var Util = require(process.cwd() + "/modules/Util");
var config = require(process.cwd() + "/config/general");
var Resources = require(process.cwd() + "/modules/model/character/ResourceTypes");

var Stats = function()
{
  Command.call(this, "stats");
  var self = this;

  Object.defineProperties(self,
  {});
};

Util.inherit(Command, Stats);
Object.defineProperties(Stats.prototype,
{
  execute:
  {
    value: function(client, data)
    {
      var character = client.character;

      /* If there is not a specific request */
      if (Util.isNull(data.request))
      {
        return {
          attributes: character.attributes.getUpdateData(character, config.stats.attributeMidTier),
          resources: Resources.getUpdateData(character)
        };
      }
      else
      {
        switch (data.request)
        {
          case "attributes":
            return character.attributes.getUpdateData(character, config.stats.attributeMidTier);
          case "resources":
            return Resources.getUpdateData(character);
          default:
            return "Invalid Request...";
        }
      }

    }
  },
  executeWithArray:
  {
    value: function(client, args)
    {
      var character = client.character;
      var stats = character.stats.getKeys(character);
      if (args.length === 0)
      {
        return stats.map(function(stat)
        {
          return stat + ": " + character.stats.getStat(character, stat);
        });
      }
    }
  }
});

module.exports = Stats;
