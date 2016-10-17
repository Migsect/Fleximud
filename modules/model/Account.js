"use strict";

/* Includes */
var Util = require(process.cwd() + "/modules/Util");
var passwordHash = require("password-hash");
var uuid = require("node-uuid");
var Promise = require("promise");

var config = require(process.cwd() + "/config/general.json");

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
    console.log("Updated Account", document.id, "with new character:", character.id);
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
    /**
     * Creates a new account.  This requires that the account has a username,
     * an email, and a plainPassword to be supplied.  The plainpassword will not
     * be stored as a plain password but will be hashed.
     *
     * This will save the account to the database upon a successful creation.
     * 
     * @param  {String} name          The name of the account's user.
     * @param  {String} email         The email of the account's user.
     * @param  {String} plainPassword The plaintext password of the account's user.
     * @return {Account}              The created account.
     */
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
    /**
     * Checks to see if the account exists based upon the query.
     * 
     * @param  {QueryObject} query The query that searches for the account to see
     *                             if it exists.
     * @return {Promise}           A promise of the result of the existance test.
     */
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
    /**
     * Retrieves all the accounts in the database.  This should become deprecated
     * in the future since it can consume a lot of memory.
     * 
     * @return {Promise} A promise that will supply all the accounts. 
     */
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
    /**
     * Retrieves an account based on the query.
     * 
     * @param  {QueryObject} query The query to search by.
     * @return {Promise}           A promise of the account.
     */
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
  if (!result) module.exports.createAccount(
    Util.isNull(config.admin.username) ? config.admin.username : "radmin",
    Util.isNull(config.admin.email) ? config.admin.email : "radmin",
    Util.isNull(config.admin.password) ? config.admin.password : "radmin");
});
