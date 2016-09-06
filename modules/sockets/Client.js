"use strict";

/**
 * The Client class is used to abstract a socket connection.
 * 
 * Clients will handle most of the requests made by the user and will
 * be the server-side representation of a client connected.
 * 
 * A Client will generally be identified by an account id and a character id.
 *
 * @constructor
 * @param {Socket} socket The socket the client is attached to.
 * @param {Account} account The account of the client.
 * @param {Character} character The character of the client.
 */
var Client = function(socket, account, character)
{
  var self = this;
  Object.defineProperties(self,
  {
    socket:
    {
      value: socket
    },
    account:
    {
      value: account
    },
    character:
    {
      value: character
    }
  });
  self.onConnection();
};

Object.defineProperties(Client.prototype,
{
  onDisconnection:
  {
    value: function()
    {
      /* TODO handle diconnection stuff */
    }
  },
  onConnection:
  {
    value: function()
    {
      /* TODO handle connection stuff (aka initialization stuff) */
    }
  },
  handleCommand:
  {
    /**
     * Handles a command which is contained within the event object passed in.
     */
    value: function(event) {

    }
  },
  toString:
  {
    value: function()
    {
      return this.account.id + "/" + this.character.id;
    }
  }
});

module.exports = Client;
