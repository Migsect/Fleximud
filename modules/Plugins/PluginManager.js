"use strict";

const path = require("path");
const fs = require("fs-extra");

const Logger = require(process.cwd() + "/modules/Logger");

const PLUGIN_DIRECTORY = process.cwd() + "/plugins";

class PluginManager
{
    constructor()
    {
        this.plugins = new Map();
        this.creationSections = [];
        this.pluginsDirectory = PLUGIN_DIRECTORY;
    }

    registerPlugin(directory)
    {
        const directoryName = path.basename(directory);
        const manifestPath = path.join(directory, "manifest");
        if (!fs.existsSync(manifestPath + ".js") && !fs.existsSync(manifestPath + ".json"))
        {
            throw new Error("Plugin lacked manifest: " + directoryName);
        }
        const manifest = require(manifestPath);
        if (!manifest.name)
        {
            throw new Error("Plugin manifest lacked name field:", directoryName);
        }
        if (!manifest.depends)
        {
            manifest.depends = [];
        }

        const mainPath = path.join(directory, "main.js");
        let main = null;
        if (!fs.existsSync(mainPath))
        {
            throw new Error("Plugin lacked main: " + directoryName);
        }
        try
        {
            const mainConstructor = require(mainPath);
            main = new mainConstructor(this, directory, manifest);
        }
        catch (error)
        {
            throw error;
        }

        this.plugins.set(manifest.name, main);
        return main;
    }

    registerPlugins()
    {
        const pluginFolders = fs.readdirSync(PLUGIN_DIRECTORY).map((item) =>
        {
            return path.join(PLUGIN_DIRECTORY, item);
        }).filter((item) =>
        {
            return fs.lstatSync(item).isDirectory();
        });
        pluginFolders.forEach((pluginFolder) =>
        {
            try
            {
                this.registerPlugin(pluginFolder);
            }
            catch (error)
            {
                Logger.warn(error.message);
            }
        });

    }

    loadPlugins()
    {
        let plugins = Array.from(this.plugins.values());
        plugins.forEach((plugin) =>
        {
            try
            {
                plugin.onLoad();
                /* Handling creation sections */
                if (plugin.manifest.creation)
                {
                    this.creationSections.push(plugin.getCreationSection());
                }
                Logger.info("Loaded Plugin:", plugin.manifest.name);
            }
            catch (error)
            {
                Logger.warn("Failed to load Plugin:", plugin.manifest.name, "Error:", error);
            }
        });
        /* Sorting the sections */
        this.creationSections = this.creationSections.sort((a, b) =>
        {
            return (a.order) > (b.order);
        });
    }

    getPlugin(name, unloaded = false)
    {
        const plugin = this.plugins.get(name);
        return (!plugin || (!unloaded && plugin.state === "unloaded")) ? null : plugin;
    }
}

module.exports = new PluginManager();
