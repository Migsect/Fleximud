"use strict";

const PasswordHash = require("password-hash");
const uuid = require("uuid/v4");

const Util = require(process.cwd() + "/modules/Util");
const Logger = require(process.cwd() + "/modules/Logger");

const DatabaseManager = require(process.cwd() + "/modules/Database/DatabaseManager");
const ACCOUNTS_TABLE_NAME = "accounts";

class Account
{
    static get table()
    {
        return ACCOUNTS_TABLE_NAME;
    }

    static initializeDatabase()
    {
        return new Promise((resolve, reject) =>
        {
            const connection = DatabaseManager.instance.connection;
            connection.schema.createTableIfNotExists(ACCOUNTS_TABLE_NAME, function(table)
            {
                table.increments("id").primary().notNullable();
                table.uuid("uuid").notNullable();
                table.string("username").notNullable();
                table.string("email").notNullable();
                table.string("password").notNullable();
            }).then(function dbThen()
            {
                Logger.debug("Table Ready:", ACCOUNTS_TABLE_NAME);
                resolve();
            }).catch(function dbCatch(error)
            {
                Logger.error(error);
                reject(error);
            });
        });
    }

    static createAcccount(username, email, plainPassword)
    {
        const connection = DatabaseManager.instance.connection;

        const password = PasswordHash.generate(plainPassword);
        const id = uuid();
        return new Promise((resolve, reject) =>
        {
            connection(ACCOUNTS_TABLE_NAME).select("email").where(() =>
            {
                this.where("email", email).orWhere("username", username);
            }).then(emails =>
            {
                /* Checking to see if that email exists */
                if (emails.length > 0)
                {
                    reject("An account with that email or username already exists.");
                    return;
                }
                connection(ACCOUNTS_TABLE_NAME).insert(
                {
                    uuid: id,
                    username: username,
                    email: email,
                    password: password
                }).then((dbid) =>
                {
                    const account = new Account(
                    {
                        dbid: dbid,
                        uuid: id,
                        username: username,
                        email: email,
                        password: password
                    });
                    resolve(account);
                }).catch(error =>
                {
                    Logger.error(error);
                    reject("An issue occured with the server.");
                });
                resolve();
            }).catch(error =>
            {
                Logger.error(error);
                reject("An issue occured with the server.");
            });
        });
    }

    static getAccount(query)
    {
        const connection = DatabaseManager.instance.connection;
        return new Promise(function(resolve, reject)
        {
            connection(ACCOUNTS_TABLE_NAME).select().where(query).then((results) =>
            {
                if (results.length < 1)
                {
                    resolve(null);
                }
                const config = results[0];
                Logger.debug("Account-Config:", config);
                const account = new Account(config);
                Logger.debug("Account:", account);
                resolve(account);

            }).catch((error) =>
            {
                reject(error);
            });
        });
    }

    static getAccountByUUID(id)
    {
        return Account.getAccount(
        {
            uuid: id
        });
    }
    static getAccountByEmail(email)
    {
        return Account.getAccount(
        {
            email: email
        });
    }
    static getAccountByName(username)
    {
        return Account.getAccount(
        {
            username: username
        });
    }

    constructor(config)
    {
        const self = this;
        self.dbid = config.id;
        self.uuid = config.uuid;
        self.username = config.username || "Unspecified";
        self.email = config.email;
        self.password = config.password;
    }

    /**
     * Returns a promise that will provide a list of all characters under this account.
     * This list will not include all character information, nor will it include full Character models.
     * Instead it will provide a list of Objects that include character DBID, UUID, Name, Species, and Sex
     *
     * This is utlimately meant to be used for character listings and no more.
     */
    getCharacterList()
    {

    }

    verify(passwordAttempt)
    {
        const self = this;
        return PasswordHash.verify(passwordAttempt, self.password);
    }

}

module.exports = Account;
