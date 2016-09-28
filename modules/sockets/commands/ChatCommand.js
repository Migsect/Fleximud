"use strict";

var Command = require("../Command");
var commands = require("./commands");

var ChatCommand = function()
{
  Command.call(this, "chatcommand");
  var self = this;
  Object.defineProperties(self,
  {});
};

ChatCommand.prototype = Object.create(Command.prototype);
Object.defineProperties(ChatCommand.prototype,
{
  constructor:
  {
    value: ChatCommand
  },
  execute:
  {
    value: function(client, data)
    {
      var command = data.command;
      var args = data.args;
    }
  }
});

module.exports = new ChatCommand();
