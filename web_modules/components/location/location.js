"use strict";

/* Used modules */
var Utils = require("../../utils");

/* Templates */
var mainTemplate = require("./templates/location.html");

/* CSS styles */
require("./styles/location.css");

/**
 * Creates a LocationComponent object that is loaded into a div.
 * This module will handle displaying information about a location to the user
 * as well as acting as the main interface for users to iniate location moving.
 * 
 * @param {[type]} divId         [description]
 * @param {[type]} socketHandler [description]
 */
var LocationComponent = function(divId, socketHandler)
{
  var self = this;
  /* Defining the main properties */
  Object.defineProperties(self,
  {
    view:
    {
      value: document.getElementById(divId)
    },
    socketHandler:
    {
      value: socketHandler
    },
    cachedData:
    {
      value: null
    }
  });

  /* Setting up the div element */
  self.view.appendChild(Utils.htmlToElement(mainTemplate()));

  /* Setting up the references to the gui elements */
  Object.defineProperties(self,
  {

  });

  /* Setting up the handler for receiving updates from the server */
  socketHandler.addHandler("location", function(data)
  {
    self.receiveUpdate(data);
  });

  socketHandler.sendCommand("location");
};

Object.defineProperties(LocationComponent.prototype,
{
  receiveUpdate:
  {
    /**
     * Recieves an update from the server. This will update the location with
     * the information retrieved from the server. An update may indicate that
     * the current location has changes somehow or that the user has moved to
     * a new location (move command does not change their location).
     * 
     * @param  {Object} updateEvent The update event from which data will 
     *                              be extracted
     */
    value: function(data)
    {
      console.log(data);
    }
  }
});

module.exports = LocationComponent;
