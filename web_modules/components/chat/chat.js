"use strict";

var WebUtils = require("../../utils");

var mainTemplate = require("./templates/chat.html");
var historyItemTemplate = require("./templates/history-item.html");

require("./styles/chat.css");

/**
 * Creates a chatcomponent object to be used by the user to send messages to the server.
 * Needs a div to reside in as well as a socket to send its messages through.
 * 
 * @param {String} divId  The div to construct the chat component in.
 * @param {Socket} socket The socket that will be used to send messages over.
 * @param {Integer} historyMax The maximum number of history items to keep.
 */
var ChatComponent = function(divId, socketHandler, client, historyMax)
{
  var self = this;
  /* Defining the main properties */
  Object.defineProperties(self,
  {
    view:
    {
      enumerable: true,
      value: document.getElementById(divId)
    },
    socketHandler:
    {
      value: socketHandler
    },
    client:
    {
      enumerable: true,
      value: client
    },
    historyMax:
    {
      enumerable: true,
      value: historyMax
    },
    messages:
    {
      enumerable: true,
      value: []
    },
    messageNumber:
    {
      enumerable: true,
      writable: true,
      value: 0
    },
    previousMessages:
    {
      enumerable: true,
      value: []
    },
    previousMessagesIndex:
    {
      enumerable: true,
      writable: true,
      value: -1
    },
    currentMessageCache:
    {
      enumerable: true,
      writable: true,
      value: ""
    }
  });

  /* Setting up the div element */
  self.view.appendChild(WebUtils.htmlToElement(mainTemplate()));

  /* Setting up the references to the gui elements */
  Object.defineProperties(self,
  {
    content:
    {
      value: self.view.querySelector(".chat-content")
    },
    history:
    {
      value: self.view.querySelector(".chat-history")
    },
    inputContent:
    {
      value: self.view.querySelector(".chat-input-text")
    },
    inputButton:
    {
      value: self.view.querySelector(".chat-input-button")
    }
  });

  /* Setting up the listener for the inputButton */
  self.inputButton.addEventListener("click", function()
  {
    self.sendMessage();
  });

  /* Setting up key listener for the inputContent */
  self.inputContent.addEventListener("keydown", function(event)
  {
    if (event.keyCode == 13)
    {
      self.sendMessage();
      event.preventDefault();
    }
  });

  /* Setting up this to receive a message from the "chat" update */
  socketHandler.addHandler("chat", function(data)
  {
    self.receiveMessage(data);
  });

  /* Getting the chat commands from the server */
  socketHandler.sendCommand("retrievecommands",
  {}, function(results)
  {
    Object.defineProperty(self, "commands",
    {
      value: results
    });
    console.log(results);
  });

  /*** Setting up special key functions ***/
  self.inputContent.addEventListener("keydown", function(event)
  {
    var TAB_KEY = 9;
    var UP_KEY = 38;
    var DOWN_KEY = 40;
    if (event.keyCode == TAB_KEY && self.inputContent.value.startsWith("/"))
    {
      event.preventDefault();
      var partialCommand = self.inputContent.value.substring(1);
      var possibleCommands = self.commands.filter(function(command)
      {
        return command.startsWith(partialCommand);
      });
      if (possibleCommands.length == 1)
      {
        /* Setting the command to the only possible one */
        self.inputContent.value = "/" + possibleCommands[0];
      }
      else if (possibleCommands.length > 1)
      {
        /* Printing out all the possibilities */
        self.addMessage(
        {
          hideSource: true,
          source: "client",
          content: possibleCommands
        });
      }
    }
    else if (event.keyCode == UP_KEY)
    {
      event.preventDefault();
      if (self.previousMessagesIndex < 0)
      {
        /* Setting the initial index and caching the current input */
        self.previousMessagesIndex = self.previousMessages.length - 1;
        self.currentMessageCache = self.inputContent.value;
      }
      else if (self.previousMessagesIndex > 0)
      {
        /* Decrementing the index of the message to show */
        self.previousMessagesIndex--;
      }
      self.inputContent.value = self.previousMessages[self.previousMessagesIndex];
    }
    else if (event.keyCode == DOWN_KEY)
    {
      event.preventDefault();
      if (self.previousMessagesIndex == self.previousMessages.length - 1)
      {
        /* Resetting to the cached message */
        self.previousMessagesIndex = -1;
        self.inputContent.value = self.currentMessageCache;
        self.currentMessageCache = "";
      }
      else if (self.previousMessagesIndex >= 0)
      {
        self.previousMessagesIndex++;
        self.inputContent.value = self.previousMessages[self.previousMessagesIndex];
      }
    }
  });
};

Object.defineProperties(ChatComponent.prototype,
{
  sendMessage:
  {
    /**
     * Sends a message.
     * @param  {[type]} message The message object to send. Does not need all info.
     */
    value: function()
    {
      var self = this;

      var content = this.inputContent.value;
      this.inputContent.value = "";

      if (content.trim().length <= 0)
      {
        return;
      }

      /* Checking to see if the content is a chat command*/
      if (content.startsWith("/"))
      {
        var splitCommand = content.substr(1).split(/ /);
        var command = splitCommand[0];
        var args = splitCommand.slice(1);

        this.socketHandler.sendCommand("chatcommand",
        {
          command: command,
          arguments: args
        }, function(results)
        {
          self.addMessage(
          {
            source: "Server",
            content: results,
            hideSource: true
          }, true);
        });
      }
      else
      {
        this.socketHandler.sendCommand("chat",
        {
          content: content
        });
      }

      /* Adding the sent input to the previous messages sent */
      if (self.previousMessages[self.previousMessages.length - 1] != content)
      {
        self.previousMessages.push(content);
      }

      /* Resetting the previous message index and the current message cache */
      self.previousMessagesIndex = -1;
      self.currentMessageCache = "";
    }
  },
  receiveMessage:
  {
    /**
     * Receives a message and renders it in the chat history.
     * Also can be used to perform other stuff.
     * 
     * @param  {[type]} message A message object received from the server.
     */
    value: function(message)
    {
      if (typeof message.clearBefore != "undefined" && message.clearBefore === true)
      {
        this.clearMessages();
      }
      this.addMessage(message);
    }
  },
  removeMessage:
  {
    /**
     * Removes the specified message from the message list.
     * This removes both the element in the DOM as well as removes it from
     * the memory.
     * 
     * @param  {Integer} number The number-id of the message to remove.
     */
    value: function(number)
    {
      var element = self.view.querySelector("#history-item-" + number);
    }
  },
  clearMessages:
  {
    value: function()
    {
      this.history.innerHTML = "";
    }
  },
  addMessage:
  {
    /**
     * Adds a message to the chat history.
     * This will also add a "messageCount" variable to the message. This will be
     * an identifier for the message when it is in the history.
     *
     * @param {Object} message The message to add to the history
     * @param {Boolean} dirty This means to add to the history an element that 
     *                        won't be cleaned of html. This will default to false.
     *                        This is useful for some commands that want HTML formatting.
     */
    value: function(message, dirty)
    {
      /* Setting the messages number before adding it to the list and then incrementing it */
      message.number = this.messageNumber++;
      /* Adding the message to the list */
      this.messages.push(message);

      var setupContent = function(content)
      {
        if (dirty)
        {
          return content.replace(/([^\s-]{5})([^\s-]{5})/g, "$1&shy;$2");
        }
        return WebUtils.escapeHTML(content).replace(/([^\s-]{5})([^\s-]{5})/g, "$1&shy;$2");
      };

      /* If the element is an array, we need to setup each element and then join with newlines*/
      var content = message.content.constructor === Array ? content = message.content.map(function(element)
      {
        return setupContent(element);
      }).join("<br>") : setupContent(message.content);

      /* Creating the html node */
      var historyItemNode = WebUtils.htmlToElement(historyItemTemplate(
      {
        hideSource: typeof message.hideSource == "undefined" ? false : message.hideSource,
        isSelf: typeof message.isSelf == "undefined" ? false : message.isSelf,
        source: message.source,
        content: content,
        number: message.number
      }));

      /* Adding the history item to the history */
      this.history.appendChild(historyItemNode);

      /* Automatically scrolling the view to the new element when a message is added */
      this.content.scrollTop = this.content.scrollHeight;
    }
  }
});

module.exports = ChatComponent;
