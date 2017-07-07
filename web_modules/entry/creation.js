"use strict";

const Utils = require("utils");
const WebPlugin = require("Plugins/WebPlugin");
const TabManager = require("creation/TabManager");

const $ = document.querySelector.bind(document);

window.creation = {};

/* ########################################################################## *
 * # Tab handling                                                           # *  
 * ########################################################################## */
const tabManager = new TabManager();
window.creation.tabManager = tabManager;

/* ########################################################################## *
 * # Loading the main-creation scripts from the plugins.                    # *  
 * ########################################################################## */

const pluginsContext = require.context("../../plugins/", true, /main-creation\.js/);
const pluginConstructors = pluginsContext.keys().map((key) =>
{
    return pluginsContext(key);
});
const plugins = WebPlugin.loadPlugins(pluginConstructors);
Array.from(plugins.values()).forEach((plugin) => tabManager.registerCreationPlugin(plugin));
