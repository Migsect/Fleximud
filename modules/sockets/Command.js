"use strict";

var Util = require(process.cwd() + "/modules/Util");

var Command = function(name, isChatCommand)
{
  var self = this;
  Object.defineProperties(self,
  {
    name:
    {
      enumerable: true,
      value: name
    },
    isChatCommand:
    {
      enumerable: true,
      value: Util.isNull(isChatCommand) ? false : isChatCommand
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
     * Sucess codes: 
     *   - -> command did not exist
     *   0 -> sucess
     *   + -> command experienced issues
     * 
     * 
     * @param  {Client} client The client that called the command
     * @param  {Object} data   The data included with the command
     * @return {Object}        AData returned to the callback if there is one
     */
    value: function(client, data)
    {
      throw new Error("Command not implemented.");
    }
  },
  executeWithArray:
  {
    /**
     * Executes the command as a command-line command.
     * Takes in an array of arguments. This is generally used with the chat on
     * the client-side.
     *
     * If this is not implemented it will return with 0
     * 
     * @param  {Client} client The client that called the command
     * @param  {String[]} args   An array of the arguments
     * @return {Integer}       Returns -1 to indicated lack of command
     */
    value: function(client, args)
    {
      return -1
    }
  }
});

module.exports = Command;
