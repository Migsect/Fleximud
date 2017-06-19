"use strict";

const fs = require("fs-extra");
const path = require("path");
// const SAVE_HEADER = "\"use strict\";\nmodule.exports=\n";
// const SAVE_FOOTER = ";";

class Config
{
    constructor(mainPath, defaultPath)
    {
        this._config = {};
        this._config.main = mainPath;
        this._config.default = defaultPath;
    }

    copyDefaults(overwrite = false)
    {
        if (!fs.existsSync(this._config.default))
        {
            return;
        }
        if (!fs.existsSync(this._config.main) || overwrite)
        {
            fs.copySync(path.resolve(this._config.default), this._config.main);
        }
    }

    /**
     * Loads the configuration along with the default configuration values (given the normal configuration
     * does not have those values specified.)
     *
     * All values loaded from the requires are set on the current object (only if they don't have prototypes)
     */
    load()
    {
        if (fs.existsSync(this._config.main))
        {
            delete require.cache[require.resolve(this._config.main)];

            const mainConfig = require(this._config.main);
            for (let key in mainConfig)
            {
                if (!mainConfig.hasOwnProperty(key)) continue;
                this[key] = mainConfig[key];
            }
        }

        if (fs.existsSync(this._config.default))
        {
            delete require.cache[require.resolve(this._config.default)];
            const defaultConfig = require(this._config.default);
            for (let key in defaultConfig)
            {
                if (!defaultConfig.hasOwnProperty(key)) continue;
                /* If it already has it, then skip it. */
                if (this.hasOwnProperty(key)) continue;
                this[key] = defaultConfig[key];
            }
        }
    }

    toArray()
    {
        const result = [];
        for (let key in this)
        {
            if (!this.hasOwnProperty(key)) continue;
            if (key.startsWith("_")) continue;
            result.push(this[key]);
        }
        return result;
    }

    // save()
    // {

    // }
    // 

    /**
     * Copies the default file directly over into the main path.
     *
     * This will not reload the configs automatically and if the configs need to be loaded again, a second
     * .load() should be made.
     */
    // copyDefault()
    // {

    // }

    /**
     * Will attempt to get the value at the specified path.
     * If the value does not exist, it will return the default value provided (default default-vlaue is null)
     */
    get(path, defaultValue = null)
    {
        const splitPath = path.split(".");

        let value = this;
        for (let i = 0; i < splitPath.length; i += 1)
        {
            const key = splitPath[i];
            if (!value[key])
            {
                return defaultValue;
            }
            value = value[key];
        }
        return value;
    }

    // set(path, value)
    // {

    // }

}

module.exports = Config;
