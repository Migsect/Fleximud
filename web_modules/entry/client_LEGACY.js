"use strict";

require("../auth");
var WebUtils = require("../utils");

var SocketHandler = require("../socketHandler");
var ChatComponent = require("../components/chat/chat");
var LocationComponent = require("../components/location/location");
var StatsComponent = require("../components/stats/stats");

/* global io, alert */

var characterId = WebUtils.getParameterByName("character");

var socket = io();

var socketHandler = new SocketHandler(socket);

console.log("Registering client:", characterId);
var client = {};

socketHandler.register(characterId).then(function()
{
  console.log("Sucessfully registered client.");
  /* Initializing all the components */
  Object.defineProperties(client,
  {
    chatComponent:
    {
      value: new ChatComponent("chat-panel", socketHandler, client)
    },
    locationComponent:
    {
      value: new LocationComponent("location-panel", socketHandler, client)
    },
    statsComponent:
    {
      value: new StatsComponent("stats-panel", socketHandler, client)
    }
  });
}, function()
{
  console.log("Failed to register client.");
  alert("The server failed to register your session, please contact support I guess.");
});
