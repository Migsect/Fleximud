"use strict";

var fs = require("fs");
var Descriptors = require("./Descriptor");
var templates = require(process.cwd() + "/templates/templates");

/**
 * A classification is a way of classifying a character.
 * 
 * @param json
 *            The json to base the classification on
 */
var Classification = function(json)
{
  this.id = json.id;
  this.name = json.name;
  this.attributes = json.attributes;
  /* Grabbing the infoText from file */
  this.documentation = (function()
  {
    if (!json.documentation)
    {
      return "";
    }
    var path = process.cwd() + '/config/documentation/' + json.documentation;
    var documentation = fs.readFileSync(path, "utf-8");
    return documentation;
  })();

  /* Constructing all the descriptors*/
  this.descriptors = (function()
  {
    var descriptorMap = new Map();
    json.descriptors.forEach(function(descriptorJSON)
    {
      var descriptor = Descriptors.getDescriptor(descriptorJSON);
      if (!descriptor)
      {
        return;
      }
      descriptorMap.set(descriptor.id, descriptor);
    });
    return descriptorMap;
  }());
};

Classification.prototype = {
  /**
   * Returns a list of all the descriptor objects on this classification
   * @return {[type]} [description]
   */
  getDescriptors: function()
  {
    var list = [];
    this.descriptors.forEach(function(descriptor)
    {
      list.push(descriptor);
    });
    return list;
  },
  getDescriptor: function(id)
  {
    return this.descriptors.get(id);
  },
  getItemHTML: function()
  {
    var template = templates("characterCreation/classification/classificationItem");
    return template(
    {
      classification: this
    });

  },
  getInfoHTML: function()
  {
    var template = templates("characterCreation/classification/classificationInfo");
    return template(
    {
      classification: this
    });
  }
};

module.exports = Classification;
