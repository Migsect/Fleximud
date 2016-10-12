"use strict";

require("../auth");
var Utils = require("../utils");

var SocketHandler = require("../socketHandler");
var ChatComponent = require("../components/chat/chat");
var LocationComponent = require("../components/location/location");

/* global io, alert */

var characterId = Utils.getParameterByName("character");

var socket = io();

var socketHandler = new SocketHandler(socket);

console.log("Registering client:", characterId);
socketHandler.register(characterId).then(function()
{
  console.log("Sucessfully registered client.");
  /* Initializing all the components */
  var chatComponent = new ChatComponent("chat-panel", socketHandler);
  var locationComponent = new LocationComponent("location-panel", socketHandler);
}, function()
{
  console.log("Failed to register client.");
  alert("The server failed to register your session, please contact support I guess.");
});
