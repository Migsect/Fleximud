"use strict";

var Command = require("../Command");

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
  }
});

module.exports = new ChatCommand();
