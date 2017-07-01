"use strict";

/**
 * Web plugins are a class that web-side plugins may implement to make interactions between plugins easier.
 */
class WebPlugin
{
    static loadPlugin(plugins, pluginId)
    {
        if (!plugins.has(pluginId))
        {
            return false;
        }

        const plugin = plugins.get(pluginId);
        if (plugin.state === "loaded" || plugin.state === "loading")
        {
            return true;
        }
        console.log("Loading Plugin:", pluginId);
        plugin.state = "loading";

        const supported = plugin.dependacies.every(function(dependacy)
        {
            const result = WebPlugin.loadPlugin(plugins, dependacy);
            if (!result)
            {
                console.log("Could not load dependacy", dependacy, "for", pluginId);
            }
            return result;
        });
        if (!supported)
        {
            plugin.state = "unsupported";
            console.log("Could not load Plugin:", pluginId);
            return false;
        }

        plugin.onLoad();
        plugin.state = "loaded";
        console.log("Loaded Plugin:", pluginId);
        return true;
    }

    static loadPlugins(constructors)
    {
        const plugins = new Map();
        constructors.forEach(function(constructor)
        {
            if (!constructor)
            {
                return;
            }
            const id = constructor.name;
            if (!id)
            {
                return;
            }
            const plugin = new constructor(plugins, constructor.dependacies || []);
            plugins.set(id, plugin);

        });
        plugins.forEach(function(plugin)
        {
            WebPlugin.loadPlugin(plugins, plugin.id);
        });
        return plugins;
    }

    get id()
    {
        return this.constructor.name;
    }

    constructor(plugins, dependacies)
    {
        this.events = new Map();
        this.plugins = plugins;
        this.dependacies = dependacies || [];
        this.state = "unloaded";
    }

    /**
     * Called after every WebPlugin has been constructed.
     * Here one can get other plugins if they so wish and register event listeners.
     */
    onLoad()
    {
        // Do nothing by default
    }

    addEventListener(event, callback)
    {
        if (!this.events.has(event))
        {
            this.events.set(event, []);
        }
        const callbackList = this.events.get(event);
        callbackList.push(callback);
    }

    triggerEvent(event, data)
    {
        const self = this;
        if (!self.events.has(event))
        {
            return;
        }
        self.events.get(event).forEach(function(callback)
        {
            callback(data);
        });
    }
}

module.exports = WebPlugin;
