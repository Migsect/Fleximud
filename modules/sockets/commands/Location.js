"use strict";

var Command = require("../Command");

var Location = function()
{
  Command.call(this, "location");
  var self = this;
  Object.defineProperties(self,
  {});

};
Location.prototype = Object.create(Command.prototype);
Object.defineProperties(Location.prototype,
{
  constructor:
  {
    value: Location
  },
  execute:
  {
    value: function(client)
    {
      /* The location of the character */
      var location = client.character.getLocation();

      /* Building the update data to send */
      var updateData = {
        path: location.getPath(),
        localId: location.localId,
        characters: location.characters,
        connections: [] /* TODO actually calculate the connection IDs */
      };

      /* Sending the update to all the clients */
      client.family.forEach(function(element)
      {
        element.sendUpdate("location", updateData);
      });

      /* Update should handle updating but the command should return this */
      return updateData;

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
          "- globalId: " + location.globalId,
          "- characters: " + location.characters.join(", "),
          "- parent: '" + location.parent + "'",
          "- children: '" + (function()
          {
            var childKeys = [];
            var keyIterator = location.children.keys();
            var current = keyIterator.next();
            while (!current.done)
            {
              childKeys.push(current.value);
              current = keyIterator.next();
            }
            return childKeys;
          })().join(", ") + "'",
          "- connections: TODO"
        ];
      }
    }
  }
});

module.exports = Location;
