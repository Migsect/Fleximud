"use strict";

const uuid = require("uuid/v4");

const Logger = require(process.cwd() + "/modules/Logger");

const Account = require("../Account");

const DatabaseManager = require(process.cwd() + "/modules/Database/DatabaseManager");
const CHARACTERS_TABLE_NAME = "characters";

class Character
{
    constructor(config)
    {
        const self = this;
        Object.defineProperties(self,
        {
            dbid:
            {
                enumerable: true,
                value: config.id
            },
            uuid:
            {
                enumerable: true,
                value: config.uuid
            },
            accountId:
            {
                enumerable: true,
                value: config.accountId
            },
            /** @type {Identity} The identity object defines names and nickanes */
            identity:
            {
                value: config.name
            },
            /** @type {Attributes} The attributes object defines attribute values */
            attributes:
            {
                value: config.attibutes
            },
            /** @type {Descriptors} The descriptors objects defines all the descriptors of a character */
            descriptors:
            {
                value: config.descriptors
            },
            /** @type {Classification} The classification object defines the species and sex of the character */
            classification:
            {
                value: config.species
            }
        });
    }
}

Object.defineProperties(module.exports,
{
    table:
    {
        value: CHARACTERS_TABLE_NAME
    },
    initializeDatabase:
    {
        value: function()
        {
            return new Promise(function(resolve, reject)
            {
                const connection = DatabaseManager.instance.connection;
                connection.schema.createTableIfNotExists(CHARACTERS_TABLE_NAME, function(table)
                {
                    table.increments("id").primary().notNullable();
                    table.uuid("uuid").notNullable();
                    table.integer("accountId").references("id").inTable(Account.table);
                    table.json("identity").notNullable();
                    table.json("attributes").notNullable();
                    table.json("descriptors").notNullable();
                    table.json("classification").notNullable();
                }).then(function dbThen()
                {
                    Logger.debug("Table Ready:", CHARACTERS_TABLE_NAME);
                    resolve();
                }).catch(function dbCatch(error)
                {
                    Logger.error(error);
                    reject(error);
                });
            });
        }
    }
});
