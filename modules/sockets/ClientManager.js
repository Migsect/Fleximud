"use strict";

var Client = require("./Client");

var ClientManager = function()
{
  var self = this;
  Object.defineProperties(self,
  {
    /** @type {Map<AccountId, Client[]>} 
     * 			A mapping of accounts to their currently active client instances.
     * 			This overall allows access and tracking of the clients in the case
     * 			That something needs to be done to all-of-them
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
    value: function(socket) {

    }
  },
  onDisconnection:
  {
    value: function(socket) {

    }
  }
});

module.exports = ClientManager;
