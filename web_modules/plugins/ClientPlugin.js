"use strict";
const WebPlugin = require("./WebPlugin");

class ClientPlugin extends WebPlugin {

    /**
     * The constructor for a ClientPlugins.
     * ClientPlugins offer more behavior that is to be used with the client application.
     * 
     * @param  {Map<String, Plugin>} plugins The plugins mapping.
     * @param  {String[]}  depends The dependacies this plugin has.
     * @param  {SocketManager} socketManager The socketManager, acting as a means to communicate with the server.
     * @return {ClientPlugin} The constructed Plugin.
     */
    constructor(plugins, depends, socketManager) {
        super(plugins, depends);
        this.socketManager = socketManager;
    }

    /**
     * Checks to see if the plugin has a main window body.
     * This is done in order to allow more efficient checking rather than
     * having to get the main window body and then check its length.
     *
     * @return {Boolean} True if there will be a mainwindow body.
     */
    hasMainWindowBody() {
        return false;
    }

    /**
     * Returns the HTML for a window's body.
     *
     * @return {String} The HTML for a window's body.
     */
    getMainWindowBody() {
        return "";
    }

    /**
     * Sends a command using the Socket Manager.
     * This will line up with server-side plugin and be delivered correctly using the correct character.
     * If a callback is not defined then this will return a promise.
     *
     * @param {String} command The command to send to the server.
     * @param {Object} data The data to send to the server.
     * @param {Function} callback The callback with any return data being the only argument.
     * @return {Promise<Object>} A promise if a callback is not defined.
     */
    sendCommand(command, data, callback) {

    }

}
module.exports = ClientPlugin;