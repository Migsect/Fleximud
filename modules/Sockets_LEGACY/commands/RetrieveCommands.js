"use strict";

var Util = require(process.cwd() + "/modules/Util");
var Command = require("../Command");

var RetrieveCommands = function()
{
  Command.call(this, "retrievecommands");
  var self = this;
  Object.defineProperties(self,
  {});
};

Util.inherit(Command, RetrieveCommands);
Object.defineProperties(RetrieveCommands.prototype,
{
  execute:
  {
    value: function()
    {
      var commands = require("./commands");
      return Array.from(commands.values()).filter(function(command)
      {
        return command.isChatCommand;
      }).map(function(command)
      {
        return command.name;
      });
    }
  }
});

module.exports = RetrieveCommands;
