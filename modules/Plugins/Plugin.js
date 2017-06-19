"use strict";

const Config = require(process.cwd() + "/modules/Config");
const path = require("path");
const fs = require("fs-extra");
const Logger = require(process.cwd() + "/modules/Logger");
const templates = require(process.cwd() + "/templates/templates");

class PluginLogger
{
    constructor(name)
    {
        this._name = name;
    }

    log()
    {
        Logger.log("[" + this._name + "]", ...arguments);
    }
    error()
    {
        Logger.error("[" + this._name + "]", ...arguments);
    }
    debug()
    {
        Logger.debug("[" + this._name + "]", ...arguments);
    }
    warn()
    {
        Logger.warn("[" + this._name + "]", ...arguments);
    }
}

class Plugin
{
    constructor(manager, directory, manifest)
    {
        this.directory = directory;
        this.manager = manager;
        this.manifest = manifest;
        this.configRoot = process.cwd() + "/config/" + this.manifest.name;
        fs.ensureDirSync(this.configRoot);

        this.state = "unloaded";
    }

    /**
     * Retrieves the plugin's personal logger.
     * This will indicate the plugin as the source of the logging.
     */
    get logger()
    {
        if (!this._logger)
        {
            this._logger = new PluginLogger(this.name);
        }
        return this._logger;
    }
    getConfig()
    {
        if (this.config)
        {
            return this.config;
        }
        const mainConfig = this.configRoot + "/config.js";
        const defaultConfig = this.directory + "/config.js";
        this.config = new Config(mainConfig, defaultConfig);

        return this.config;
    }

    /**
     * Reloads the plugin
     */
    reload()
    {
        this.onUnload();
        this.onLoad();
        this.onReload();
    }

    onLoad()
    {
        // Do Nothing
    }

    onUnload()
    {
        // Do Nothing
    }

    onReload()
    {
        // Do nothing
    }

    getCreationTemplate()
    {
        return templates(path.join(this.directory, "templates/creation"));

    }
    getCreationForm()
    {
        return this.getCreationTemplate()();
    }

    getCreationSection()
    {
        const name = this.manifest.creation.name || this.manifest.name;
        const id = this.manifest.creation.id || name.toLowerCase();
        return {
            name: name,
            id: id,
            form: this.getCreationForm(),
            order: this.manifest.creation.order || 100
        };
    }
}

module.exports = Plugin;
