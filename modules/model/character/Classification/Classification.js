"use strict";

var fs = require("fs");
var Descriptor = require("./Descriptor");
var templates = require(process.cwd() + "/templates/templates");

var Util = require(process.cwd() + "/modules/Util");
var Transform = require(process.cwd() + "/modules/DataStructures/Transform");

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
  }
});

module.exports = Classification;
