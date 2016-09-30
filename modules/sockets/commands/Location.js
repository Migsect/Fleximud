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
    value: function(client, data) {}
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

module.exports = new Location();
