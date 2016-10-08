"use strict";

var fs = require("fs");
var Descriptor = require("./Descriptor");
var templates = require(process.cwd() + "/templates/templates");

var AttributeType = require("../AttributeTypes");

var Util = require(process.cwd() + "/modules/Util");
var Transform = require(process.cwd() + "/modules/DataStructures/Transform");
var Fuzzy = require(process.cwd() + "/modules/DataStructures/Fuzzy");

/**
 * A classification is a way of classifying a character.
 * 
 * @param json
 *            The json to base the classification on
 */
var Classification = function(json)
{
  Util.assertNotNull(json, json.id, json.name);

  var self = this;
  Object.defineProperties(self,
  {
    id:
    {
      value: json.id
    },
    name:
    {
      value: json.name
    },
    attributes:
    {
      /**
       * Will be a list of objects with an id, a center, and a range (for fuzzies)
       * An ID of default will apply to all attributes.
       * Other the ID will generally be an attribute.
       * 
       * These are the initial attribute variations of a character and are 
       * different from transforms. This will be balanced in character creation
       * based on totality.
       * 
       * @type {Object}
       */
      value: Util.isNull(json.attributes) ? [] : json.attributes
    },
    transforms:
    {
      value: (function()
      {
        var map = Util.isNull(json.transforms) ? new Map() : Transform.parseDirectedTransforms(json.transforms);

        return map;
      })()
    },
    /* Grabbing the infoText from file */
    documentation:
    {
      value: (function()
      {
        if (Util.isNull(json.documentation))
        {
          return "";
        }
        var path = process.cwd() + '/config/documentation/' + json.documentation;
        var documentation = fs.readFileSync(path, "utf-8");
        return documentation;
      })()
    },
    /* Constructing all the descriptors*/
    descriptors:
    {
      value: (function()
      {
        var descriptorMap = new Map();
        json.descriptors.forEach(function(descriptorJSON)
        {
          var descriptor = Descriptor.getDescriptor(descriptorJSON);
          if (!descriptor)
          {
            return;
          }
          descriptorMap.set(descriptor.id, descriptor);
        });
        return descriptorMap;
      }())
    }
  });
};

Object.defineProperties(Classification.prototype,
{
  getDescriptors:
  {
    /**
     * Returns a list of all the descriptor objects on this classification
     * @return {[type]} [description]
     */
    value: function()
    {
      var list = [];
      this.descriptors.forEach(function(descriptor)
      {
        list.push(descriptor);
      });
      return list;
    },
    writable: true
  },
  getDescriptor:
  {
    /**
     * Returns the descriptor with the ID, this is not a descriptor value but
     * rather the actual configuration of the descriptor.
     * 
     * @param  {String}     id The id of the descriptor to retrieve.
     * @return {Descriptor} The Descriptor object with the specified id
     */
    value: function(id)
    {
      return this.descriptors.get(id);
    },
    writable: true
  },
  getItemHTML:
  {
    /**
     * Generates the HTML for classification.
     * 
     * @return {HTMLString} The HTML string that was generated.
     */
    value: function()
    {
      var template = templates("characterCreation/classification/classificationItem");
      return template(
      {
        classification: this
      });
    },
    writable: true
  },
  getInfoHTML:
  {
    /**
     * Retrieves HTML that depicts the info of the classification.
     * 
     * @return {HTMLString} The HTML string that was generated.
     */
    value: function()
    {
      var template = templates("characterCreation/classification/classificationInfo");
      return template(
      {
        classification: this
      });
    },
    writable: true
  },
  applyInitialAttributes:
  {
    /**
     * Goes over all the attributes and randomly changes them based on the
     * configured attributes.  This will not set the top attribute to be 1, this
     * should be handled outside of the function since this may be called by other
     * classifications.
     * 
     * @param  {Character} character The character whose attributes will be changed.
     */
    value: function(character)
    {
      this.attributes.forEach(function(attribute)
      {
        var fuzzy = new Fuzzy(attribute.center, attribute.range);
        /* Determining which attributes to change */
        var attributes = attribute.id == "default" ? AttributeType.list : [attribute.id];
        attributes.forEach(function(attribute)
        {
          var value = character.attributes.getAttribute(attribute);
          character.attributes.setAttribute(attribute, value * fuzzy.fuzzy());
        });
      });
    }
  }
});

module.exports = Classification;
