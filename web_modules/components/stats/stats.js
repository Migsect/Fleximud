"use strict";

/* Used Modules */
var WebUtils = require("../../utils");

/* Templates */
var mainTemplate = require("./templates/stats.html");
var barTemplate = require("./templates/bar.html");
var attributeTemplate = require("./templates/attribute.html");

/* CSS styles */
require("./styles/stats.css");

var StatComponent = function(divId, socketHandler, client)
{
  var self = this;
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
    client:
    {
      value: client
    },
    cache:
    {
      value: null
    },
    bars:
    {
      /** @type {Map} Map of Id strings to the HTMLObject */
      value: new Map()
    },
    attributes:
    {
      /** @type {Map} Map of Id strings to the HTMLObject */
      value: new Map()
    }
  });

  /* Setting up the div element */
  self.view.appendChild(WebUtils.htmlToElement(mainTemplate()));

  /* Assigning components */
  Object.defineProperties(self,
  {
    barContainer:
    {
      value: self.view.querySelector(".stats-bars")
    },
    attributesContainer:
    {
      value: self.view.querySelector(".stats-attributes")
    }
  });

  self.setAttribute();

  /* Setting up the socket handler */
  socketHandler.addHandler("stats", function(data) {

  });
};

Object.defineProperties(StatComponent.prototype,
{
  receiveUpdate:
  {
    value: function(updateData) {

    }
  },
  setAttribute:
  {
    /**
     * Sets the attribute provided in the data.
     * The data expects to have an id and some other parameters for an attribut
     * such as the value and any children.
     * 
     * @param  {[type]} attributeData [description]
     */
    value: function(attributeData)
    {
      var self = this;

      console.log("Called set Attribute.");

      /* Function for recursively creating the elements for attributes */
      var createAttribute = function(data)
      {
        var attribute = WebUtils.htmlToElement(attributeTemplate(
        {
          id: data.id,
          name: data.name,
          value: data.value,
        }));
        if (data.children)
        {
          data.children.forEach(function(element)
          {
            var childrenElement = attribute.querySelector(".stat-attribute-children");
            childrenElement.appendChild(createAttribute(element));
          });
        }
        return attribute;
      };

      /* Creating the main element */
      var attributeElement = createAttribute(attributeData);

      /* Adding the element to the attribute container */
      if (self.attributes.has(attributeData.id))
      {
        /* If the container already has an element, we need to replace it */
        self.attributeContainer.replaceChild(
          attributeElement,
          self.attributes.get(attributeData.id));
      }
      else
      {
        /* Otherwise we add it onto the end */
        self.attributeContainer.appendChild(attributeElement);
      }

      /* Regardless we need to set the map value to the new element value */
      self.attributes.set(attributeData.id, attributeElement);
    }
  },
  setBar:
  {
    value: function(barData) {

    }
  }

});

module.exports = StatComponent;
