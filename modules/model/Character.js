"use strict";

const uuid = require("uuid/v4");

const Logger = require(process.cwd() + "/modules/Logger");
const PluginManager = require(process.cwd() + "/modules/Plugins/PluginManager");
const Account = require("./Account");
// const Attributes = require("./Attributes/Attributes");
// const Descriptors = require("./Descriptors/Descriptors");

const DatabaseManager = require(process.cwd() + "/modules/Database/DatabaseManager");
const CHARACTERS_TABLE_NAME = "characters";

const dataSetters = new Map();
const dataGetters = new Map();

class Character
{
    static get table()
    {
        return CHARACTERS_TABLE_NAME;
    }

    static createCharacter(accountId)
    {
        const connection = DatabaseManager.instance.connection;
        const id = uuid();
        return connection(CHARACTERS_TABLE_NAME).insert(
        {
            uuid: id,
            accountId: accountId,
            data: JSON.stringify(
            {})
        }).then(dbid =>
        {
            return new Character(
            {
                id: dbid[0],
                uuid: id,
                accountId: accountId,
                data:
                {}
            });
        });
    }

    /**
     * Retrieves a list of characters for the provided account (as per accounts dbid)
     *
     * @param {Account} account The account to find characters for.
     * @return {Promise<Character[]>} A promise for a list of characters (may be empty)
     */
    static getAccountsCharacters(account)
    {
        const connection = DatabaseManager.instance.connection;
        return connection(CHARACTERS_TABLE_NAME)
            .select()
            .where(
            {
                accountId: account.dbid
            })
            .then(results => results.map(result => new Character(result)));

    }

    static getCharacter()
    {

    }

    static get dataGetters()
    {
        return dataGetters;
    }

    static get dataSetters()
    {
        return dataSetters;
    }

    static registerDataGetter(dataId, getter)
    {
        if (dataGetters.has(dataId))
        {
            throw new Error("Data Getter Id '" + dataId + "' is already under use.");
        }
        dataGetters.set(dataId, getter);
    }

    static registerDataSetter(dataId, setter)
    {
        if (dataGetters.has(dataId))
        {
            throw new Error("Data Setter Id '" + dataId + "' is already under use.");
        }
        dataSetters.set(dataId, setter);
    }

    static initializeDatabase()
    {
        return new Promise(function(resolve, reject)
        {
            const connection = DatabaseManager.instance.connection;
            connection.schema.createTableIfNotExists(CHARACTERS_TABLE_NAME, function(table)
            {
                table.increments("id").primary().notNullable();
                table.uuid("uuid").notNullable();
                table.integer("accountId").references("id").inTable(Account.table);
                table.json("data").notNullable();
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

    constructor(config)
    {
        this.dbid = config.id;
        this.uuid = config.uuid;
        this.accountId = config.accountId;
        this.data = JSON.parse(config.data
) ||
        {};
    }

    getData(statId)
    {
        const getter = dataGetters(statId);
        return getter(this.data);
    }
    setData(statId, object)
    {
        const getter = dataSetters(statId);
        return getter(this.data, object);
    }

    getListItem()
    {
        return {
            character: this,
            infos: Array.from(PluginManager.plugins.values())
                .map(plugin => plugin.getCharacterListInfo(this))
                .filter(info => info)
                .sort((a, b) => a.priority < b.priority)
                .map(info => info.info)
        };
    }

    save()
    {
        const connection = DatabaseManager.instance.connection;
        Logger.debug("dbid", this.dbid);
        return connection(CHARACTERS_TABLE_NAME)
            .where("id", this.dbid)
            .update(
            {
                data: JSON.stringify(this.data)
            });
    }
}

module.exports = Character;
