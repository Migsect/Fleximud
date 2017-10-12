"use strict";

const PasswordHash = require("password-hash");
const uuid = require("uuid/v4");

const Util = require(process.cwd() + "/modules/Util");
const Logger = require(process.cwd() + "/modules/Logger");

const DatabaseManager = require(process.cwd() + "/modules/Database/DatabaseManager");
const ACCOUNTS_TABLE_NAME = "accounts";

class Account {
    static get table() {
        return ACCOUNTS_TABLE_NAME;
    }

    static initializeDatabase() {
        const connection = DatabaseManager.instance.connection;
        return connection.schema.createTableIfNotExists(ACCOUNTS_TABLE_NAME, function(table) {
            table.increments("id").primary().notNullable();
            table.uuid("uuid").notNullable();
            table.string("username").notNullable();
            table.string("email").notNullable();
            table.string("password").notNullable();
        }).then(() => {
            Logger.debug("Table Ready:", ACCOUNTS_TABLE_NAME);
        });
    }

    /**
     * Creates an account and adds it to the database.
     *
     * @param      {String}  username       The username of the account
     * @param      {String}  email          The email of the account
     * @param      {String}  plainPassword  The plain password of the account
     * @return     {Promise} A promise to return the account once created.
     */
    static createAccount(username, email, plainPassword) {
        const connection = DatabaseManager.instance.connection;
        const password = PasswordHash.generate(plainPassword);
        const id = uuid();
        return connection(ACCOUNTS_TABLE_NAME).select("email").where(function() {
            this.where("email", email).orWhere("username", username);
        }).then(emails => {
            /* Checking to see if that email exists */
            if (emails.length > 0) {
                return null;
            }
            return connection(ACCOUNTS_TABLE_NAME).insert({
                uuid: id,
                username: username,
                email: email,
                password: password
            }).then(dbid => {
                const account = new Account({
                    dbid: dbid[0],
                    uuid: id,
                    username: username,
                    email: email,
                    password: password
                });
                Logger.debug("Hot and piping Account:", account);
                return account;
            });
        });
    }

    static getAccount(query) {
        const connection = DatabaseManager.instance.connection;

        return connection(ACCOUNTS_TABLE_NAME).select().where(query).then((results) => {
            if (results.length < 1) {
                return null;
            }
            const config = results[0];
            const account = new Account(config);
            return account;

        });
    }

    static getAccountByUUID(id) {
        return Account.getAccount({ uuid: id });
    }

    static getAccountByEmail(email) {
        return Account.getAccount({ email: email });
    }

    static getAccountByName(username) {
        return Account.getAccount({ username: username });
    }

    constructor(config) {
        console.log("Account Object Recostruction:", config);
        this.dbid = config.id || config.dbid;
        this.uuid = config.uuid;
        this.username = config.username || "Unspecified";
        this.email = config.email;
        this.password = config.password;
    }

    verify(passwordAttempt) {
        return PasswordHash.verify(passwordAttempt, this.password);
    }

}

module.exports = Account;