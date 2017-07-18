"use strict";

const $ = document.querySelector.bind(document);

const WebPlugin = require("Plugins/WebPlugin");
const PanelManager = require("client/panels/PanelManager");

/* ########################################################################## *
 * # Loading the panel manager                                              # *  
 * ##########################################################################*/
const view = $(".panel-view");

const panelManager = new PanelManager(view);
console.log("Panel Manager:", panelManager);

/* ########################################################################## *
 * # Loading the client scripts from the plugins                            # *  
 * ########################################################################## */
const pluginsContext = require.context("../../plugins/", true, /main-client\.js/);
const pluginConstructors = pluginsContext.keys().map((key) => {
    return pluginsContext(key);
});
const plugins = WebPlugin.loadPlugins(pluginConstructors);