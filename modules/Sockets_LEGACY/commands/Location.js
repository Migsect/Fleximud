"use strict";

var Util = require(process.cwd() + "/modules/Util");

var Command = require("../Command");
// var LocationModule = require(process.cwd() + "/modules/location/Location");

var Location = function()
{
  Command.call(this, "location", true);
  var self = this;
  Object.defineProperties(self,
  {});

};

Util.inherit(Command, Location);
Object.defineProperties(Location.prototype,
{
  execute:
  {
    value: function(client)
    {
      /* The location of the character */
      var location = client.character.getLocation();

      /* Update should handle updating but the command should return this */
      return location.getUpdateData();
    }
  },
  executeWithArray:
  {
    value: function(client, args)
    {
      var location = client.character.getLocation();
      if (args.length === 0)
      {
        return ["Location",
          "- path: '" + location.getPath() + "'",
          "- localId: " + location.localId,
          "- connections: '" + location.connections.map(function(connection)
          {
            return connection.name + "-->" + connection.destination;
          }).join(", ") + "'",
        ];
      }
    }
  }
});

module.exports = Location;
