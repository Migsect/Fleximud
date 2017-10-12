"use strict";

const Knex = require("knex");
const path = require("path");
const fs = require("fs-extra");

let instance = null;
class DatabaseManager {

    /**
     * Initializes a new datamanager with the provided config. This creates a
     * connection with any database method that is specified.
     * 
     * Additionally, if the database has a filename, it will generate that folder (SQLite Support)
     *
     * @param      Object           config  The configuration for the database
     * @return     {DatabaseManager}  The newly constructed database manager instance.
     */
    static initialize(config) {
        if (instance !== null) {
            throw new Error("Attempted to initialize DatabaseManager twice.");
        }
        if (config.connection && config.connection.filename) {
            const dirname = path.dirname(config.connection.filename);
            fs.ensureDirSync(dirname);
        }
        const connection = Knex(config);
        const databaseManager = new DatabaseManager(connection);
        Object.defineProperty(module.exports, "instance", {
            configurable: false,
            writable: false,
            value: databaseManager
        });
        return databaseManager;
    }
    static get instance() {
        return instance;
    }

    constructor(connection) {
        const self = this;
        Object.defineProperties(self, {
            connection: {
                value: connection
            }
        });
    }
}

module.exports = DatabaseManager;