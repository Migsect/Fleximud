"use strict";

var Utils = require("../../utils");

var mainTemplate = require("./templates/chat.html");
var historyItemTemplate = require("./templates/history-item.html");
require("./styles/chat.css");

/**
 * Creates a chat object to be used by the user to send messages to the server.
 * Needs a div to reside in as well as a socket to send its messages through.
 * 
 * @param {String} divId  The div to construct the chat component in.
 * @param {Socket} socket The socket that will be used to send messages over.
 * @param {Integer} historyMax The maximum number of history items to keep.
 */
var Chat = function(divId, socket, historyMax)
{
  var self = this;
  /* Defining the main properties */
  Object.defineProperties(self,
  {
    view:
    {
      value: document.getElementById(divId)
    },
    socket:
    {
      value: socket
    },
    historyMax:
    {
      value: historyMax
    }
  });

  /* Setting up the div element */
  self.view.appendChild(Utils.htmlToElement(mainTemplate()));

  Object.defineProperties(self,
  {
    history:
    {
      value: self.view.querySelector("div.chat-history")
    },
    inputContent:
    {
      value: self.view.querySelector("div.chat-input-text")
    },
    inputButton:
    {
      value: self.view.querySelector("div.chat-input-button")
    }
  });

};

Object.defineProperties(Chat.prototype,
{
  sendMessage:
  {
    /**
     * Sends a message.
     * @param  {[type]} message The message object to send. Does not need all info.
     */
    value: function(message) {

    }
  },
  receiveMessage:
  {
    /**
     * Receives a message and renders it in the chat history.
     * @param  {[type]} message A message object received from the server.
     */
    value: function(message) {

    }
  }
});

module.exports = Chat;
