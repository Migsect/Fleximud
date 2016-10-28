"use strict";

var Util = require(process.cwd() + "/modules/Util");
var logger = require(process.cwd() + "/modules/Logger");
var commands = require("./commands/commands");

/**
 * The Client class is used to abstract a socket connection.
 * 
 * Clients will handle most of the requests made by the user and will
 * be the server-side representation of a client connected.
 * 
 * A Client will generally be identified by an account id and a character id.
 *
 * @constructor
 * @param {ClientManager} manager The client's manager
 * @param {Socket} socket The socket the client is attached to.
 * @param {Account} account The account of the client.
 * @param {Character} character The character of the client.
 */
var Client = function(manager, socket, account, character)
{
  var self = this;
  Object.defineProperties(self,
  {
    /**
     * The manager of this client session
     * 
     * @type {ClientManager}
     */
    manager:
    {
      value: manager
    },
    /**
     * The socket for this client session
     * 
     * @type {Socket}
     */
    socket:
    {
      value: socket
    },
    /**
     * The account for this client session
     * 
     * @type {Account}
     */
    account:
    {
      enumerable: true,
      value: account
    },
    /**
     * The character for this client session
     * 
     * @type {Character}
     */
    character:
    {
      enumerable: true,
      value: character
    },
    /**
     * The family of this client.  This are all the clients that share the
     * same account and charater but do not share the same socket.  As such
     * they are not the same client but will receive the same data.
     *
     * This will return a list including this client.
     * 
     * @type {Client[]}
     */
    family:
    {
      get: function()
      {
        return this.manager.characters.get(character.id);
      }
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
      /* Removing the character of this client from the location */
      this.character.getLocation().removeCharacter(this.character);
    }
  },
  onConnection:
  {
    value: function()
    {
      /* Adding the character of this client to the location */
      this.character.getLocation().addCharacter(this.character);
    }
  },
  sendUpdate:
  {
    /**
     * Sends an update to the client. This will include the type of update as
     * well as the data in the update.  The socket message will be of type 
     * "update".
     * 
     * @param {String} type The type of the update.
     * @param {Object} data The data to send in the update.
     */
    value: function(type, data)
    {
      var message = {
        type: type,
        data: data
      };
      this.socket.emit("update", message);
    }
  },
  handleCommand:
  {
    /**
     * Handles a command which is contained within the event object passed in.
     */
    value: function(commandEvent, callback)
    {
      logger.info("Command Type:", commandEvent.command, ", Command Data:", commandEvent.data);
      if (!commands.has(commandEvent.command))
      {
        logger.warn("Could not find command '" + commandEvent.command + "'");
        return;
      }
      var command = commands.get(commandEvent.command.toLowerCase());
      var data = commandEvent.data;

      /* executing the command */
      var result = command.execute(this, data);

      /* Calling the callback if there is a callback */
      if (typeof callback == "function")
      {
        /* If the result doesn't have a then member, then it isn't a promise*/
        if (Util.isNull(result.then) || typeof result.then != "function")
        {
          callback(result);
        }
        else
        {
          /* If the result is a promise, then we'll wait before calling the callback */
          result.then(function(promiseResult)
          {
            callback(promiseResult);
          });
        }

      }
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
