"use strict";

var Promise = require("promise/lib/es6-extensions");

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
      }, callback ? callback : null);
    }
  },
  addHandler:
  {
    /**
     * Adds a handler for the update type.  This will call the callback when
     * the update occurs.
     * 
     * @param  {String}   updateType The type of the update that it will listen
     *                               in on.
     * @param  {Function} callback   The callback that takes a data argument.
     */
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
    /**
     * To be called whenever there is an update.  This is generally called by
     * the socket handler itself by the inner socket it wraps.
     * 
     * @param  {Object} updateEvent The update event that was received by the socket.
     */
    value: function(updateEvent)
    {
      /* Checking to see if the update has a type (needs to have a type) */
      if (!this.updateHandlers.has(updateEvent.type))
      {
        return;
      }
      /* Getting and looping throw all the handlers */
      var handlers = this.updateHandlers.get(updateEvent.type);
      handlers.forEach(function(handler)
      {
        /* Passing all the handlers the data sent with the update */
        handler(updateEvent.data);
      });
    }
  },
  register:
  {
    /**
     * Registers the character ID.  This will only work if this is the correct
     * session for the character, otherwise this 
     * @param  {String} characterId The id of the character to register.
     * @return {Promose}            Will error if the character cannot be registered.
     */
    value: function(characterId)
    {
      var self = this;
      return new Promise(function(resolve, reject)
      {
        /* Registering a new client */
        self.socket.emit("register", characterId, function(result)
        {
          console.log("Result:", result);
          if (result)
          {
            /* If the result is true or anything other than false, then it was a sucess */
            resolve();
            return;
          }
          else
          {
            reject();
          }
        });
      });

    }
  }
});

module.exports = SocketHandler;
