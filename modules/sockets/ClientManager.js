"use strict";

var Util = require(process.cwd() + "/modules/Util");

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
      value: new Map(),
      enumerable: true
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
      value: new Map(),
      enumerable: true
    },
    activeCharacters:
    {
      /**
       * Retrieves a list of the currently active characters.
       * @type {Character[]} List of current active characters
       */
      get: function()
      {
        return Array.from(self.characters.values()).map(function(element)
        {
          return element[0].character;
        });
      }
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
      socket.on("register", function(characterId, callback)
      {
        console.log("registering character");
        callback(true);
        self.onRegister(socket, characterId, callback);
      });
      socket.on("command", function(command, callback)
      {
        self.onCommand(socket, command, callback);
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

      /* Splicing out the client from the character clients listing */
      var characterClients = this.characters.get(client.character.id);
      characterClients.splice(characterClients.findIndex(function(element)
      {
        return element === client;
      }), 1);
      /* Removing the character's listing if its empty */
      if (characterClients.length <= 0)
      {
        this.characters.delete(client.character.id);
      }
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
    value: function(socket, command, callback)
    {
      var socketId = socket.client.id;
      if (!this.clients.has(socketId))
      {
        /* TODO throw a proper error message or something*/
        return;
      }
      var client = this.clients.get(socketId);
      client.handleCommand(command, callback);
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
    value: function(socket, characterId, callback)
    {
      var self = this;
      var accountId = socket.handshake.session.account;
      /* Checking if the character ID or account ID are not null (and therefore exist */
      if (Util.isNull(accountId) || Util.isNull(characterId))
      {
        console.log("WARNING - Socket attempted to register with:");
        console.log("  accoundId:", accountId);
        console.log("  characterId:", characterId);
        console.log("  but one was null.");
        callback(false);
      }

      /* Grabbing the account from the database */
      Account.getAccountById(accountId).then(function(account)
      {
        /* If the account is null, then the account doesn't exist */
        if (Util.isNull(account))
        {
          console.log("WARNING - Socket attempted to register with:");
          console.log("  accoundId:", accountId);
          console.log("  characterId:", characterId);
          console.log("  but the account query returned null.");
          callback(false);
        }

        /* Getting the character object from the account object returned */
        var character = account.characters.find(function(element)
        {
          return element.id === characterId;
        });
        /* Checking if the character returned exists*/
        if (Util.isNull(character))
        {
          console.log("WARNING - Socket attempted to register with:");
          console.log("  accoundId:", accountId);
          console.log("  characterId:", characterId);
          console.log("  but the character query returned null.");
          callback(false);
        }

        /* Now to actually start registration */
        console.log("Registering:", accountId + " for character " + characterId);

        /* Creating the client instance */
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

        /* Registration was sucess */
        console.log("Registered:", client.toString());
        callback(true);
      }, function()
      {
        /* If there is an issue with the server, then we're going to callback false */
        callback(false);
      });

    }
  }
});

Object.defineProperties(module.exports,
{
  constructor:
  {
    value: ClientManager
  },
  instance:
  {
    value: new ClientManager()
  }
});
