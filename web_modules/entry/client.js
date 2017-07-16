"use strict";

const WebPlugin = require("Plugins/WebPlugin");

/* ########################################################################## *
 * # Loading the client scripts from the plugins                            # *  
 * ########################################################################## */
const pluginsContext = require.context("../../plugins/", true, /main-client\.js/);
const pluginConstructors = pluginsContext.keys().map((key) => {
    return pluginsContext(key);
});
const plugins = WebPlugin.loadPlugins(pluginConstructors);