"use strict";

var Command = require("../Command");
var Util = require(process.cwd() + "/modules/Util");

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

      /* Constructs a message aying the command was not found */
      var commandNotFound = function()
      {
        return ["Could not find the command '" + data.command.toLowerCase() + "'.",
          "Use '/help' for a list of commands."
        ];
      };

      var commands = require("./commands");
      var command = commands.get(data.command.toLowerCase());
      if (Util.isNull(command))
      {
        return commandNotFound();
      }
      var args = data.arguments;

      /* Executing the command and getting the result */
      var result = command.executeWithArray(client, args);
      /* If the result is null or less than 0 then it says the command doesn't exist */
      if (Util.isNull(result) || result < 0)
      {
        return commandNotFound();
      }
      return result;
    }
  }
});

module.exports = ChatCommand;
