"use strict";

/* Includes */

var passwordHash = require("password-hash");
var uuid = require("node-uuid");
var Promise = require("promise");

var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

/* Modules */
var Character = require('./character//Character.js');

/* Schemas */
var CharacterSchema = Character.schema;

/* Creating the Account Schema */
var AccountSchema = Schema(
{
  name:
  {
    type: String,
    required: true
  },
  id:
  {
    type: String,
    required: true
  },
  email:
  {
    type: String,
    required: true
  },
  characters: [
  {
    type: Schema.Types.ObjectId,
    ref: "Character"
  }],
  password:
  {
    type: String,
    required: true
  },
});
AccountSchema.methods.addCharacter = function(character)
{
  /* Adding the character to the account's character list */
  this.characters.push(character._id);
  /* Saving the account */
  this.save(function(err, document)
  {
    if (err) return console.error(err);
    console.log("Updated Account", document, "with new character:", character);
  });
};
AccountSchema.methods.removeCharacter = function(character)
{
  // TODO
};
AccountSchema.methods.verify = function(password)
{
  return passwordHash.verify(password, this.password);
};

var Account = Mongoose.model('Account', AccountSchema);

Object.defineProperties(module.exports,
{
  createAccount:
  {
    value: function(name, email, plainPassword)
    {
      var password = passwordHash.generate(plainPassword);
      var id = uuid.v4();
      var account = new Account(
      {
        id: id,
        name: name,
        email: email,
        password: password,
        characters: []
      });
      account.save(function(err, document)
      {
        if (err) return console.error(err);
        console.log("Saved Account to Database:", document);
      });

      return account;

    }
  },
  accountExists:
  {
    value: function(query)
    {
      return new Promise(function(resolve, reject)
      {
        Account.find(query, function(error, result)
        {
          if (error)
          {
            reject(error);
          }
          else
          {
            resolve(result.length > 0);
          }
        });

      });
    }
  },
  getAccounts:
  {
    value: function()
    {
      return new Promise(function(resolve, reject)
      {
        Account.find(
        {}, function(error, result)
        {
          if (error)
          {
            reject(error);
            console.log(error);
          }
          else
          {
            resolve(result);
          }
        });
      });
    }
  },
  getAccountByQuery:
  {
    value: function(query)
    {
      return new Promise(function(resolve, reject)
      {
        /* Finding the account and populating all its characters */
        Account.findOne(query).populate("characters").exec(function(error, result)
        {
          if (error)
          {
            reject(error);
            console.log(error);
          }
          else
          {
            resolve(result);
          }
        });
      });
    }
  },
  getAccountByEmail:
  {
    value: function(email)
    {
      return this.getAccountByQuery(
      {
        email: email
      });
    }
  },
  getAccountById:
  {
    value: function(id)
    {
      return this.getAccountByQuery(
      {
        id: id
      });
    }
  },
});

/* Making some basic accounts for administration */

module.exports.accountExists(
{
  name: "radmin"
}).then(function(result)
{
  if (!result) module.exports.createAccount("radmin", "radmin", "radmin");
});
