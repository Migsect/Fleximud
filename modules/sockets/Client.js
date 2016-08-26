"use strict";

/**
 * The Client class is used to abstract a socket connection.
 * Clients will handle most of the requests made by the user and will
 * be the server-side representation of a client connected.
 * A Client will generally be identified by an account id and a character id.
 * 
 * @constructor
 */
var Client = function(socket, accountId, characterId)
{
  var self = this;
  Object.defineProperties(self,
  {
    socket:
    {
      value: socket
    },
    accountId:
    {
      value: accountId
    },
    characterId:
    {
      value: characterId
    }
  });
};

module.exports = Client;
