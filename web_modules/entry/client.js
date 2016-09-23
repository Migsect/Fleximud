"use strict";

require("../auth");
var Utils = require("../utils");

var Chat = require("../components/chat/chat");

/* global io */

var characterId = Utils.getParameterByName("character");

var socket = io();

/**
 * Sends a command to the server to execute.
 * Commands are generally initiated by the user.
 * 
 * @param  {String}   command  The command name.
 * @param  {Object}   data     A JSON object that holds data to be used in the command.
 * @param  {Function} callback A callback function for the command's result.
 *                             The callback contains a status code (HTTP) and a result body.
 */
var sendCommand = function(command, data, callback)
{
  /* Sending the package to the server, the callback will be called from the server */
  socket.emit("command",
  {
    command: command,
    data: data
  }, callback);
};

/* Mapping of handlers for update types */
var updateHandlers = new Map();
/* 
 * Updates are generally iniated from the server
 * Called when the server sends an update to the client. 
 */
socket.on("update", function(message)
{
  var messageType = message.type;
  if (!messageType)
  {
    /* TODO error message that there wasn't a type */
    return;
  }
  var handler = updateHandlers.get(messageType);
  if (!handler)
  {
    /* TODO error message that there wasn't a handler */
  }
  var messageBody = message.body;
  handler(messageBody);
});
/* Registering a new client */
socket.emit("register", characterId);

/* Initializing all the components */
var chatComponent = new Chat("chat-panel", socket);
