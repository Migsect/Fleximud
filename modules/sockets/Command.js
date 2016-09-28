"use strict";

var Command = function(name)
{
  var self = this;
  Object.defineProperties(self,
  {
    name:
    {
      value: name
    }
  });
};

Object.defineProperties(Command.prototype,
{
  execute:
  {
    /**
     * Executing a command requires the client that called the command
     * 
     * @param  {Client} client The client that called the command
     * @param  {Object} data   The data included with the command
     * @return {Integer}        A success code returned by the command
     */
    value: function(client, data)
    {
      throw new Error("Command not implemented.");
    }
  }
});

module.exports = Command;
