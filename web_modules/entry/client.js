"use strict";

require("../auth");
var Utils = require("../utils");

var SocketHandler = require("../socketHandler");
var Chat = require("../components/chat/chat");

/* global io */

var characterId = Utils.getParameterByName("character");

var socket = io();

var socketHandler = new SocketHandler(socket);
socketHandler.register(characterId);

/* Initializing all the components */
var chatComponent = new Chat("chat-panel", socketHandler);
