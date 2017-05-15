"use strict";

const Util = require(process.cwd() + "/modules/Util");
const Logger = require(process.cwd() + "/modules/Logger");

const PasswordHash = require("password-hash");
const uuid = require("uuid/v4");

class Account
{
  constructor(config)
  {
    const self = this;
    Object.defineProperties(self,
    {
      id:
      {
        value: config.email
      },
      name:
      {
        value: config.name
      },
      email:
      {
        value: config.email
      },
      password:
      {
        value: config.password
      },
    });
  }

  verify(passwordAttempt)
  {
    const self = this;
    return PasswordHash.verify(passwordAttempt, self.password);
  }

}

Object.defineProperties(module.exports,
{
  initializeDatabase:
  {
    value: function(connection)
    {
      return new Promise(function(resolve, reject)
      {
        connection.schema.createTableIfNotExists("accounts", function(table)
        {
          table.uuid("id");
          table.string("name");
          table.string("email");
          table.string("password");
        }).then(function dbThen()
        {
          Logger.debug("Created Accounts Table");
          resolve();
        }).catch(function dbCatch(error)
        {
          Logger.error(error);
          reject(error);
        });
      });
    }
  },
  createAccount:
  {
    value: function(name, email, plainPassword) {

    }
  }
});
