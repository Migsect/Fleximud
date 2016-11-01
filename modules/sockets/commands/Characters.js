"use strict";

var Util = require(process.cwd() + "/modules/Util");
var Command = require("../Command");

var Characters = function()
{
  Command.call(this, "characters", true);
};

Util.inherit(Command, Characters);
Object.defineProperties(Characters.prototype,
{
  execute:
  {
    value: function(client)
    {
      var location = client.character.getLocation();
      return location.characters.map(function(character)
      {
        return character.getUpdateData();
      });
    }
  },
  executeWithArray:
  {
    value: function(client, args)
    {
      var location = client.character.getLocation();
      if (args.length === 0)
      {
        return ["Characters:"].concat(location.characters.map(function(character)
        {
          return character.getUpdateData().name;
        }));
      }
    }
  }
});

module.exports = Characters;
