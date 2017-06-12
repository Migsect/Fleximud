"use strict";

const Config = require("config-js");
const fs = require("fs-extra");
const Logger = require(process.cwd() + "/modules/Logger");

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
    constructor(manager, manifest)
    {
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
    getLogger()
    {
        if (!this.logger)
        {
            this.logger = new PluginLogger(this.name);
        }
        return this.logger;
    }
    getConfig()
    {

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

    getCreationForm()
    {

    }
}

module.exports = Plugin;
