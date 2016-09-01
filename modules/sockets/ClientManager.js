"use strict";

var Client = require("./Client");
var Account = require("../model/Account");

var ClientManager = function()
{
  var self = this;
  Object.defineProperties(self,
  {
    /** @type {Map<SocketId, Client[]>} 
     *      A mapping of Socket ids to their client object.
     *      This is used to keep track of clients.
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
      socket.on("disconnect", function()
      {
        self.onDisconnection(socket);
      });
      console.log("Account", socket.handshake.session.account, "connected");
    }
  },
  onDisconnection:
  {
    value: function(socket)
    {
      console.log("Account", socket.handshake.session.account, "disconnected");
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
    value: function()
    {
      /* Registers the character if it exists, creates a client */
    }
  }
});

module.exports = ClientManager;
