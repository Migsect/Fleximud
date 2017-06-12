"use strict";

const uuid = require("uuid/v4");

const Logger = require(process.cwd() + "/modules/Logger");

const Account = require("../Account");
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

    constructor(config)
    {
        const self = this;
        self.dbid = config.id;
        self.uuid = config.uuid;
        self.accountId = config.accountId;
        self.data = {};
        // self.identity = config.name;
        // self.attributes = new Attributes(config.attributes);
        // self.descriptors = new Descriptors(config.descriptors);

        // self.species = config.species;
        // self.sex = config.sex;
        // self.race = config.race;
        // self.breed = config.breed;
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

    save()
    {

    }
}

module.exports = Character;
