"use strict";

var SocketHandler = function(socket)
{
  var self = this;
  Object.defineProperties(self,
  {
    socket:
    {
      value: socket
    },
    updateHandlers:
    {
      value: new Map()
    }
  });

  /* Setting up all the message receivers */
  socket.on("update", function(message)
  {
    self.onUpdate(message);
  });
};

Object.defineProperties(SocketHandler.prototype,
{
  sendCommand:
  {
    /**
     * Sends a command to the server to execute.
     * Commands are generally initiated by the user.
     * 
     * @param  {String}   command  The command name.
     * @param  {Object}   data     A JSON object that holds data to be used in the command.
     * @param  {Function} callback A callback function for the command's result.
     *                             The callback contains a status code (HTTP) and a result body.
     */
    value: function(command, data, callback)
    {
      this.socket.emit("command",
      {
        command: command,
        data: data
      });
    }
  },
  addHandler:
  {
    value: function(updateType, callback)
    {
      if (!this.updateHandlers.has(updateType))
      {
        this.updateHandlers.set(updateType, []);
      }
      var handlerList = this.updateHandlers.get(updateType);
      handlerList.push(callback);
    }
  },
  onUpdate:
  {
    value: function(updateEvent)
    {
      if (!this.updateHandlers.has(updateEvent.type))
      {
        return;
      }
      var handlers = this.updateHandlers.get(updateEvent.type);
      handlers.forEach(function(handler)
      {
        handler(updateEvent);
      });
    }
  },
  register:
  {
    value: function(characterId)
    {

      /* Registering a new client */
      this.socket.emit("register", characterId);
    }
  }
});

module.exports = SocketHandler;
