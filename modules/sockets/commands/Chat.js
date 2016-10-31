"use strict";

var Command = require("../Command");
var Util = require(process.cwd() + "/modules/Util");

var Chat = function()
{
  Command.call(this, "chat");
  var self = this;
  Object.defineProperties(self,
  {});
};

Util.inherit(Command, Chat);
Object.defineProperties(Chat.prototype,
{
  execute:
  {
    value: function(client, data)
    {
      /* Getting the location of the client's character */
      var location = client.character.getLocation();

      /* Getting the client's manager */
      var clientManager = client.manager;

      /* Looping through all the characters at the location to send them the message */
      var characters = location.characters;
      console.log(characters);
      characters.forEach(function(character)
      {
        /* Message construction */
        var message = {
          source: client.character.name.shortName,
          content: data.content,
          isSelf: client.character.id == character.id,
          hideSource: false
        };

        /* Sending the message to all the clients */
        var clients = clientManager.characters.get(character.id);
        if (Util.isNull(clients))
        {
          throw new Error("Clients returned null when there should be clients.");
        }
        clients.forEach(function(client)
        {
          client.sendUpdate("chat", message);
        });
      });

      return 0;
    }
  }
});

module.exports = Chat;
