"use strict";

/**
 * Web plugins are a class that web-side plugins may implement to make interactions between plugins easier.
 */
class WebPlugin
{
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
            const plugin = new constructor(plugins);
            plugins.set(id, plugin);

        });
        plugins.forEach(function(plugin)
        {
            plugin.onLoad();
            console.log("Loaded Plugin:", plugin.id);
        });
        return plugins;
    }

    get id()
    {
        return this.constructor.name;
    }

    constructor(plugins)
    {
        this.events = new Map();
        this.plugins = plugins;
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
