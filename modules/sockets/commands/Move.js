"use strict";

var Util = require(process.cwd() + "/modules/Util");
var Command = require("../Command");
var LocationModule = require(process.cwd() + "/modules/location/Location");

var Move = function()
{
  Command.call(this, "move");
  var self = this;
  Object.defineProperties(self,
  {});

};

Util.inherit(Command, Move);
Object.defineProperties(Move.prototype,
{
  execute:
  {
    value: function(client, data)
    {
      /* The location of the character */
      var character = client.character;
      var location = character.getLocation();
      var connections = location.connections;

      if (Util.isNull(data.target))
      {
        return "Command did not have a target.";
      }

      /* Getting the connection */
      var foundConnection = connections.find(function(connection)
      {
        return connection.id == data.target;
      });
      if (Util.isNull(foundConnection))
      {
        return "Location does not have the specified connection.";
      }
      /* Getting the new location based on the destination */
      var newLocation = LocationModule.getLocation(foundConnection.destination);

      /* Updating the character's location */
      character.moveToLocation(newLocation);

      /* Updating everyone's character location */
      location.sendCharactersUpdate();
      newLocation.sendCharactersUpdate();

      /* Updating all the character clients */
      client.family.forEach(function(familyClient)
      {
        familyClient.sendUpdate("location", newLocation.getUpdateData());
        familyClient.sendUpdate("chat",
        {
          source: "Server",
          content: "You traveled through the " + foundConnection.name,
          isSelf: false,
          hideSource: true,
          clearBefore: true
        });

      });

      /* Updating all the other characters */

      return "Success";
    }
  },
  executeWithArray:
  {
    value: function(client, args)
    {
      return -1;
    }
  }
});

module.exports = Move;
