"use strict";

/* Used Modules */
var WebUtils = require("../../utils");

/* Templates */
var mainTemplate = require("./templates/stats.html");
var barTemplate = require("./templates/bar.html");
var attributeTemplate = require("./templates/attribute.html");

/* CSS styles */
require("./styles/stats.css");

var getPercentage = function(top, bottom, decimals)
{
  var ratio = 100 * Number(top) / Number(bottom);
  var truncated = Math.round(ratio * Math.pow(10, decimals)) / Math.pow(10, decimals);
  return truncated + "%";
};

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

  self.socketHandler.sendCommand("stats",
    {},
    function(data)
    {
      /* Setting attributes */
      var attributes = data.attributes;
      self.setAttribute(attributes);

      /* Setting the resource bars */
      var resources = data.resources;
      resources.forEach(function(resource)
      {
        self.addBar(resource);
      });
    });

  /* Setting up the socket handler */
  socketHandler.addHandler("stats", function(data)
  {
    /* If its an array then we're going to loop it for receivings */
    if (Array.isArray(data))
    {
      data.forEach(function(element)
      {
        self.receiveUpdate(element);
      });
    }
    else
    {
      self.receiveUpdate(data);
    }
  });
};

Object.defineProperties(StatComponent.prototype,
{
  receiveUpdate:
  {
    value: function(updateData)
    {
      var self = this;
      if (updateData.type == "attributes")
      {
        self.setAttribute(updateData.content);
      }
      else if (updateData.type == "addbar")
      {
        self.addBar(updateData.content);
      }
      else if (updateData.type == "updateBar")
      {
        self.updateBar(updateData.content);
      }
      /* Otherwise do nothing, maybe throw an Error */
    }
  },
  setAttribute:
  {
    /**
     * Sets the attribute provided in the data.
     * The data expects to have an id and some other parameters for an attribut
     * such as the value and any children.
     * 
     * @param  {Object} attributeData The attribute's data
     * @param  {HTMLNode} parent The parent node of this attribute, null for the first time.
     *                           If this is defined then the element will be hidden.
     * @param  {Number} level The level at which the attribute will be displayed at.
     */
    value: function(attributeData, parent, level)
    {
      var self = this;
      level = level ? level : 0;

      var attributeElement = WebUtils.htmlToElement(attributeTemplate(
      {
        id: attributeData.id,
        name: attributeData.name,
        value: attributeData.value,
        color: attributeData.color ? attributeData.color : "#666666",
        children: attributeData.children ? attributeData.children.map(function(child)
        {
          return child.id;
        }).join(",") : "",
        level: 8 * level,
        hidden: typeof attributeData.hidden != "undefined" ? attributeData.hidden : typeof parent != "undefined"
      }));

      /* Adding the element to the attribute container */
      if (self.attributes.has(attributeData.id))
      {
        /* If the container already has an element, we need to replace it */
        self.attributesContainer.replaceChild(
          attributeElement,
          self.attributes.get(attributeData.id));
      }
      else if (parent)
      {
        self.attributesContainer.insertBefore(attributeElement, parent.nextSibling);
      }
      else
      {
        /* Otherwise we add it onto the end */
        self.attributesContainer.appendChild(attributeElement);
      }

      /* Regardless we need to set the map value to the new element value */
      self.attributes.set(attributeData.id, attributeElement);

      /* Adding the event listeners */
      attributeElement.addEventListener("click", function()
      {
        /* Retrieves all the children nodes */
        var getChildrenNodes = function(element)
        {
          return element.dataset.children.split(",").map(function(child)
          {
            return self.attributes.get(child);
          }).filter(function(child)
          {
            return !(typeof child == "undefined" || child === null);
          });
        };
        /* Recursively hides all children */
        var hideChildren = function(element)
        {
          var children = getChildrenNodes(element);
          children.forEach(function(child)
          {
            child.classList.add("hidden");
            hideChildren(child);
          });
        };
        /* Just shows the children */
        var showChildren = function(element)
        {
          var children = getChildrenNodes(element);
          children.forEach(function(child)
          {
            child.classList.remove("hidden");
          });
        };

        /* Calculting if we do show the children or not */
        if (getChildrenNodes(attributeElement).some(function(child)
          {
            return child.classList.contains("hidden");
          }))
        {
          showChildren(attributeElement);
        }
        else
        {
          hideChildren(attributeElement);
        }
      });

      /* If there are children we will now add them (but they are hidden by default */
      if (attributeData.children)
      {
        attributeData.children.forEach(function(childData)
        {
          self.setAttribute(childData, attributeElement, level + 1);
        });
      }

    }
  },
  removeBar:
  {
    value: function(data)
    {
      /* Todo */
    }
  },
  addBar:
  {
    /**
     * Adds a bar based on the data passed in.
     * 
     * @param  {Object} data The bardata thatd defines the bar.
     */
    value: function(data)
    {
      var self = this;

      /* Creating the bar element */
      var barElement = WebUtils.htmlToElement(barTemplate(
      {
        id: data.id,
        name: data.name,
        value: data.value,
        max: data.max,
        ratio: data.value + " / " + data.max,
        percentage: getPercentage(data.value, data.max, 2)
      }));
      /* Removing the old bar */
      /* TODO */

      /* Adding the new bar */
      self.bars.set(data.id, barElement);

      /* toggling the overflowed class if it starts off as overflowed */
      if (Number(data.value) > Number(data.max))
      {
        barElement.querySelector("progress").classList.add("overflowed");
      }

      /* By far the most effective means of changing the color of the progress bar */
      var style = document.createElement("style");
      style.type = "text/css";
      style.innerHTML = "progress#stat-bar-" + data.id + "::-webkit-progress-value { background: " + data.color + "; }";
      barElement.appendChild(style);

      self.barContainer.appendChild(barElement);
    }
  },
  updateBar:
  {
    /**
     * Updates t
     * @param  {String} barId The id of the bar to update.
     * @param  {Number} value The value to update the bar to.
     * @param  {Number} max   The max value to update the bar to. (optional)
     */
    value: function(barId, value, max)
    {
      var self = this;

      /* Grabbing the bar element for the id, if there is no id then we throw a hissy fit */
      var barElement = self.bars.get(barId);
      if (!barElement)
      {
        throw new Error("Bar element was not defined");
      }

      /* Updating the values of the progress element which matters the most */
      var progressElement = barElement.querySelector("progress");
      progressElement.setAttribute("value", value);
      if (max)
      {
        progressElement.setAttribute("max", max);
      }

      /* Getting the new value and the new max as attributes */
      var newValue = Number(progressElement.getAttribute("value"));
      var newMax = Number(progressElement.getAttribute("max"));

      /* Updating all the display information */
      var percentageElement = barElement.querySelector("div.stat-bar-percentage");
      percentageElement.innerHTML = getPercentage(newValue, newMax, 2);

      var ratioElement = barElement.querySelector("div.stat-bar-ratio");
      ratioElement.innerHTML = newValue + " / " + newMax;

      /* Setting the overflow */
      if (newValue > newMax)
      {
        progressElement.classList.add("overflowed");
      }
      else
      {
        progressElement.classList.remove("overflowed");
      }

    }
  }

});

module.exports = StatComponent;
