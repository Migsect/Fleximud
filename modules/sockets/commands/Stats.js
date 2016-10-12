"use strict";

var Command = require("../Command");
var Util = require(process.cwd() + "/modules/Util");

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
    value: function(client, data) {}
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