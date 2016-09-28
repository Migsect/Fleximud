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
     * @type {Map<SocketId, Client>} 
     */
    clients:
    {
      value: new Map()
    },
    /**
     * A mapping of character IDs to a list of the currently active clients.
     * This is used to track all active clients for a specific character such
     * that if one client makes an update, other clients will recieve that 
     * client specific information from the update.
     * 
     * @type {Map<CharacterID, Client[]>}
     */
    characters:
    {
      value: new Map()
    }
  });
};

Object.defineProperties(ClientManager.prototype,
{
  constructor:
  {
    /** @type {Constructor} Constructor for the Client Manager */
    value: ClientManager
  },

  onConnection:
  {
    /**
     * Called when the socket makes a connection.
     * This does not register the socket since the character is not yet known.
     * As such this registers all the socket message recievers.
     * 
     * @param {Socket} socket The socket that connected.
     */
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
      socket.on("command", function(command)
      {
        self.onCommand(socket, command);
      });
    }
  },
  onDisconnection:
  {
    /**
     * Called when a client disconnects. This will clean up the client and
     * remove it from the mappings.
     * 
     * @param  {Socket} socket The socket that disconnected
     */
    value: function(socket)
    {
      var client = this.clients.get(socket.client.id);
      if (!client)
      {
        return;
      }

      client.onDisconnection();
      this.clients.delete(client);
      var characterClients = this.characters.get(client.character.id);
      characterClients.splice(characterClients.findIndex(function(element)
      {
        return element === client;
      }), 1);
      console.log("Client Disconnected:", client.toString());
    }
  },
  onCommand:
  {
    /**
     * Called when a client emits a command.  This is passed to the client to
     * handle the results of the command.
     * 
     * @param  {Socket} socket  The socket that emitted the command.
     * @param  {Object} command A command object
     */
    value: function(socket, command)
    {
      var socketId = socket.client.id;
      if (!this.clients.has(socketId))
      {
        /* TODO throw a proper error message or something*/
        return;
      }
      var client = this.clients.get(socketId);
      client.handleCommand(command);
    }
  },
  onRegister:
  {
    /**
     * Called when a client wishes to be registered (and thus created).
     * This will infer the client's account from the session cookies.
     * 
     * @param  {Socket} socket      The socket to be registered with
     * @param  {CharacterID} characterId The character ID that wishes to be registered
     */
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
        var client = new Client(self, socket, account, character);
        /* Adding the client to the socket mapping */
        self.clients.set(socketId, client);
        /* Adding the client to the character mapping */
        if (!self.characters.has(characterId))
        {
          self.characters.set(characterId, []);
        }
        self.characters.get(characterId).push(client);

        console.log("Registered:", client.toString());
      });

    }
  }
});

module.exports = ClientManager;
