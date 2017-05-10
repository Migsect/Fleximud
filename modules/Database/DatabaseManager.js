"use strict";

const Knex = require('knex');

class DatabaseManager
{
  constructor(connection)
  {
    const self = this;
    Object.defineProperties(self,
    {
      connection:
      {
        value: connection
      }
    });
  }
}

Object.defineProperties(module.exports,
{
  initialize:
  {
    value: function(config)
    {
      if (module.exports.instance !== null)
      {
        throw new Error("Attempted to initialize DatabaseManager twice.");
      }
      const connection = Knex(config);
      const databaseManager = new DatabaseManager(connection);
      Object.defineProperty(module.exports, "instance",
      {
        configurable: false,
        writable: false,
        value: databaseManager
      });
      return databaseManager;
    }
  },
  instance:
  {
    configurable: true,
    writable: true,
    value: null
  }
});
