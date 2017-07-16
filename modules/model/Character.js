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

class Character {

    /**
     * Gets the name of the table for the characters.
     * This is should be used instead of hardcoding the name of the character table.
     * 
     * @return {String} The name of the table in the database for characters.
     */
    static get table() {
        return CHARACTERS_TABLE_NAME;
    }

    /**
     * Creates a new character for the supplied account and using the data as a basis for the character's data.
     * 
     * @param  {[type]} accountId [description]
     * @param  {[type]} data      [description]
     * @return {[type]}           [description]
     */
    static createCharacter(accountId, data) {
        const connection = DatabaseManager.instance.connection;
        const id = uuid();
        return connection(CHARACTERS_TABLE_NAME).insert({
            uuid: id,
            accountId: accountId,
            data: JSON.stringify(data || {})
        }).then(dbid => {
            return new Character({
                id: dbid[0],
                uuid: id,
                accountId: accountId,
                data: data || null
            });
        });
    }

    /**
     * Retrieves a character based upon the provided query.
     * 
     * @param {Object} query The query object to search for.
     * @return {Promise<Character[]>} The list of characters matching the query.
     */
    static getCharacters(query) {
        const connection = DatabaseManager.instance.connection;
        return connection(CHARACTERS_TABLE_NAME)
            .select()
            .where(query)
            .then(results => results.map(result => new Character(result)));
    }
    /**
     * Retrieves a singular character based upon the provided query.
     * This is mostly a quality-of-line method for getting a single character.
     *
     * @param {Query} query The query object to search for.
     * @return {Promose<Character>} A promise to provide the character or otherwise null if not found.
     */
    static getCharacter(query) {
        return Character.getCharacters(query)
            .then(characters => characters.length > 0 ? characters[0] : null);
    }

    /**
     * Retrieves a list of characters for the provided account (as per accounts dbid)
     *
     * @param {Account} account The account to find characters for.
     * @return {Promise<Character[]>} A promise for a list of characters (may be empty)
     */
    static getCharactersByAccount(account) {
        return Character.getCharacters({
            accountId: account.dbid
        });
    }

    /**
     * Retrieves the character with the specified uuid.
     * If there is no character with the uuid, returns null.
     * 
     * @param  {String} uuid The UUID to match
     * @return {Promise<Character>} A promise for the character (returns null if no character found).
     */
    static getCharacterById(uuid) {
        return Character.getCharacter({
            uuid: uuid
        });
    }

    static get dataGetters() {
        return dataGetters;
    }

    static get dataSetters() {
        return dataSetters;
    }

    static registerDataGetter(dataId, getter) {

        if (dataGetters.has(dataId)) {
            throw new Error("Data Getter Id '" + dataId + "' is already under use.");
        }
        dataGetters.set(dataId, getter);
    }

    static registerDataSetter(dataId, setter) {

        if (dataGetters.has(dataId)) {
            throw new Error("Data Setter Id '" + dataId + "' is already under use.");
        }
        dataSetters.set(dataId, setter);
    }

    static initializeDatabase() {

        const connection = DatabaseManager.instance.connection;
        return connection.schema.createTableIfNotExists(CHARACTERS_TABLE_NAME, function(table) {
            table.increments("id").primary().notNullable();
            table.uuid("uuid").notNullable();
            table.integer("accountId").references("id").inTable(Account.table);
            table.json("data").notNullable();
        }).then(() => {
            Logger.debug("Table Ready:", CHARACTERS_TABLE_NAME);
            return;
        });

    }

    /**
     * Constructs the character from a database retrieved or compiled configuration.
     * 
     * @param  {Object} config A config object for the character.
     * @return {Character} The constructed character.
     */
    constructor(config) {

        if (config.data && typeof config.data === "string") {
            config.data = JSON.parse(config.data);
        }

        this.dbid = config.id;
        this.uuid = config.uuid;
        this.accountId = config.accountId;
        this.data = config.data || {};

        this.aspects = {};
        Array.from(PluginManager.plugins.values()).forEach(plugin => {
            const name = plugin.name;
            if (!plugin.aspectConstructor) {
                return;
            }
            const aspect = new plugin.aspectConstructor(plugin, this.data);
            this.aspects[name] = aspect;
        });

    }

    getData(statId) {
        const getter = dataGetters(statId);
        return getter(this.data);
    }
    setData(statId, object) {
        const getter = dataSetters(statId);
        return getter(this.data, object);
    }

    /**
     * Retrieves an object that is used when the character is being displayed as a list item.
     * 
     * @return {Object{character, infos}} An object containing the character and the infos.
     */
    getListItem() {
        return {
            character: this,
            infos: Array.from(Object.keys(this.aspects))
                .map(aspectKey => this.aspects[aspectKey])
                .map(plugin => plugin.getListInfoConfig(this))
                .filter(info => info)
                .sort((a, b) => a.priority < b.priority)
                .map(info => info.display)
        };
    }

    /**
     * Saves the character's data to the database.
     * This returns a promise that will resolve when the database updates the character.
     * The value provided by the promise is the number of characters saved, which should be 1 or 0 if
     * not update was made.
     * 
     * @return {Promise} A promise that will resolve when the database action is complete.
     */
    save() {
        const connection = DatabaseManager.instance.connection;
        return connection(CHARACTERS_TABLE_NAME)
            .where("id", this.dbid)
            .update({
                data: JSON.stringify(this.data)
            });
    }
}

module.exports = Character;