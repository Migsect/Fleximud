"use strict";

require("../auth");
var Utils = require("../utils");

var SocketHandler = require("../socketHandler");
var chatComponent = require("../components/chat/chat");
var LocationComponent = require("../components/location/location");

/* global io */

var characterId = Utils.getParameterByName("character");

var socket = io();

var socketHandler = new SocketHandler(socket);
socketHandler.register(characterId);

/* Initializing all the components */
var chatComponent = new chatComponent("chat-panel", socketHandler);
var locationComponent = new LocationComponent("location-panel", socketHandler);
