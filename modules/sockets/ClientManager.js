"use strict";

var Client = require("./Client");
var Account = require("../model/Account");

var ClientManager = function()
{
  var self = this;
  Object.defineProperties(self,
  {
    /** 
     * A mapping of Socket ids to their client object.
     * This is used to keep track of clients.
     * 
     * @type {Map<SocketId, Client[]>} 
     */
    clients:
    {
      value: new Map()
    }
  });
};

Object.defineProperties(ClientManager.prototype,
{
  /** @type {Constructor} Constructor for the Client Manager */
  constructor:
  {
    value: ClientManager
  },
  onConnection:
  {
    value: function(socket)
    {
      var self = this;
      var accountId = socket.handshake.session.account;
      console.log("Account", accountId, "connected to a socket.");
      socket.on("disconnect", function()
      {
        console.log("Account", accountId, "disconnected from a socket.");
        self.onDisconnection(socket);
      });
      socket.on("register", function(characterId)
      {
        self.onRegister(socket, characterId);
      });
      socket.on("command", function() {

      });
    }
  },
  onDisconnection:
  {
    value: function(socket)
    {
      var client = this.clients.get(socket.client.id);
      if (!client)
      {
        return;
      }
      this.clients.delete(client);
      console.log("Client Disconnected:", client.toString());
    }
  },
  onCommand:
  {
    value: function()
    {
      /* Passes a command to the client. */
    }
  },
  onRegister:
  {
    value: function(socket, characterId)
    {
      var self = this;
      var accountId = socket.handshake.session.account;
      /* TODO validate that accountID is correct */
      Account.getAccountById(accountId).then(function(account)
      {
        var character = account.characters.find(function(element)
        {
          return element.id === characterId;
        });
        /* TODO check if character is null */
        console.log("Registering:", accountId + " for character " + characterId);

        var socketId = socket.client.id;
        var client = new Client(socket, account, character);
        self.clients.set(socketId, client);

        console.log("Registered:", client.toString());
      });

    }
  }
});

module.exports = ClientManager;
