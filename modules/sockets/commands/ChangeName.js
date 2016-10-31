"use strict";

var Util = require(process.cwd() + "/modules/Util");
var Command = require("../Command");

var ChangeName = function()
{
  Command.call(this, "changename", true);
};

Util.inherit(Command, ChangeName);
Object.defineProperties(ChangeName.prototype,
{
  execute:
  {
    value: function(client, data) {}
  },
  executeWithArray:
  {
    value: function(client, args)
    {
      /* This requires at least one string */
      if (args.length < 1)
      {
        return -2;
      }
      /* Getting the character */
      var character = client.character;

      /* The new name will be all the arguments joined */
      var oldName = character.name.shortName;
      var newName = args.join(" ");

      /* Setting the character's new name */
      character.name.shortName = newName;

      /* Saving the character */
      character.save();

      /* Note that we are not sending out any updates since the name is only
       * used as a nickname.  The characters main name is not changed.
       */

      return "Name changed from '" + oldName + "' to '" + newName + "'.";
    }
  }
});

module.exports = ChangeName;
