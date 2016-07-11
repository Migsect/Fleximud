"use strict";

/* Includes */
var passwordHash = require('password-hash');
var uuid = require('node-uuid');
var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var Promise = require('promise');

/* Modules */
var Character = require('./Character.js');

/* Schemas */
var CharacterSchema = Character.schema;

/* Creating the Account Schema */
var AccountSchema = mongoose.Schema(
{
    name : String,
    id : String,
    email : String,
    characters : [ CharacterSchema ],
    password : String
});
AccountSchema.methods.addCharacter = function(character)
{
    this.characters.push(character);
};
AccountSchema.methods.removeCharacter = function(character)
{
    // TODO
};
AccountSchema.methods.verify = function(password)
{
    return passwordHash.verify(password, this.password);
};

var Account = mongoose.model('Account', AccountSchema);

module.exports =
{
    createAccount : function(name, email, plainPassword)
    {
        var password = passwordHash.generate(plainPassword);
        var id = uuid.v4();
        var account = new Account(
        {
            id : id,
            name : name,
            email : email,
            password : password,
            characters : []
        });
        account.save(function(err, document)
        {
            if (err) return console.error(err);
            console.log("Saved Document to Database:", document);
        });

        return account;

    },
    accountExists : function(query)
    {
        return new Promise(function(resolve, reject)
        {
            Account.find(query, function(error, result)
            {
                if (error)
                {
                    reject(error);
                } else
                {
                    resolve(result.length > 0);
                }
            })

        });
    },
    getAccounts : function()
    {
        return new Promise(function(resolve, reject)
        {
            Account.find({}, function(error, result)
            {
                if (error)
                {
                    reject(error);
                    console.log(error)
                } else
                {
                    resolve(result);
                }
            });
        });
    },
    getAccountByQuery : function(query)
    {
        return new Promise(function(resolve, reject)
        {
            Account.findOne(query, function(error, result)
            {
                if (error)
                {
                    reject(error);
                    console.log(error)
                } else
                {
                    resolve(result);
                }
            });
        });
    },
    getAccountByEmail : function(email)
    {
        return this.getAccountByQuery(
        {
            email : email
        });
    },
    getAccountById : function(id)
    {
        return this.getAccountByQuery(
        {
            id : id
        });
    },
};

/* Making some basic accounts for administration */

module.exports.accountExists(
{
    name : "radmin"
}).then(function(result)
{
    if (!result) module.exports.createAccount("radmin", "radmin", "radmin");
});

Account;