"use strict";

var Util = require(process.cwd() + "/modules/Util");
var Command = require("../Command");

var Characters = function()
{
  Command.call(this, "characters");
  var self = this;
  Object.defineProperties(self,
  {});
};

Util.inherit(Command, Characters);
Object.defineProperties(Characters.prototype,
{
  execute:
  {
    value: function(client, data) {}
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
          return character.name.name;
        }));
      }
    }
  }
});

module.exports = Characters;
