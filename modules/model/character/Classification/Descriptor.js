"use strict";
var Util = require(process.cwd() + "/modules/Util");
var DisplayName = require("../DisplayName");

var templates = require(process.cwd() + "/templates/templates");

var typeMapping = new Map();

/** MainDescriptor */
var Descriptor = function(json)
{
  if (!json.id)
  {
    console.log("Warning! - Found descriptor with no id :", json);
    return null;
  }
  this.id = json.id;
  this.type = "none";
  this.displayName = new DisplayName(json.name);
};
Descriptor.prototype = {
  merge: function()
  {
    if (typeof other !== typeof this)
    {
      return null;
    }
    return this;
  },
  getHTML: function()
  {
    var template = templates("characterCreation/classification/descriptors/" + this.type);
    return template(this.getJSON());
  },
  getJSON: function()
  {
    return this;
  }

};
/** A descriptor that has a range of states. */
var RangeDescriptor = function(json)
{
  Descriptor.call(this, json);
  this.type = "range";
  this.center = json.center;
  this.range = json.range;
};
RangeDescriptor.isType = function(json)
{
  return !Util.isNull(json.range) && !Util.isNull(json.center);
};
typeMapping.set('RangeDescriptor', RangeDescriptor);
RangeDescriptor.prototype = Object.create(Descriptor.prototype);
RangeDescriptor.prototype.constructo = RangeDescriptor;

/**
 * @param other
 * @return The merged descriptor
 */
RangeDescriptor.prototype.merge = function(other)
{
  console.log('r merge called');
  var value = Descriptor.prototype.merge.call(this, other);
  if (value === null)
  {
    return null;
  }

  /* merge logic */
  var otherMax = other.getMax();
  var otherMin = other.getMin();
  var thisMax = this.getMax();
  var thisMin = this.getMin();

  var newMax = otherMax > thisMax ? otherMax : thisMax;
  var newMin = otherMin < thisMin ? otherMin : thisMin;
  var newCenter = (newMin + newMax) / 2;

  return new RangeDescriptor(
  {
    center: newCenter,
    range: newMax - newCenter,
    type: this.type,
    name: this.displayName
  });
};
RangeDescriptor.prototype.getJSON = function()
{
  var json = {
    name: this.displayName.singular,
    max: this.getMax(),
    min: this.getMin(),
    average: this.getAverage()
  };
  return json;
};
RangeDescriptor.prototype.getMax = function()
{
  return this.center + this.range;
};
RangeDescriptor.prototype.getMin = function()
{
  return this.center - this.range;
};
RangeDescriptor.prototype.getAverage = function()
{
  return this.center;
};

/** A descriptor that can vary between different states */
var VariationDescriptor = function(json)
{
  Descriptor.call(this, json);
  this.type = "variation";
  this.variations = json.variations;
};
VariationDescriptor.isType = function(json)
{
  return !Util.isNull(json.variations);
};
typeMapping.set('VariationDescriptor', VariationDescriptor);
VariationDescriptor.prototype = Object.create(Descriptor.prototype);
VariationDescriptor.prototype.constructor = VariationDescriptor;

/**
 * @param other
 * @return The merged descriptor
 */
VariationDescriptor.prototype.merge = function(other)
{
  console.log('v merge called');
  var value = Descriptor.prototype.merge.call(this, other);
  if (value === null)
  {
    return null;
  }
  /* merge logic */
  var newVariations = [];
  Array.prototype.push.call(newVariations, this.variations);
  other.variations.forEach(function(variation)
  {
    if (!newVariations.includes(variation))
    {
      newVariations.push(variation);
    }
  });
  Array.prototype.push.call(newVariations, other.variations);

  return new VariationDescriptor(
  {
    type: this.type,
    name: this.displayName,
    variations: newVariations
  });
};
VariationDescriptor.prototype.getJSON = function()
{
  var json = {
    name: this.displayName.singular,
    variations: this.variations,
    first: this.variations[0]
  };
  return json;
};

module.exports = {
  getDescriptor: function(json)
  {
    if (json.type)
    {
      /* If there is a type defined */
      var constructor = typeMapping.get(json.type);
      if (!constructor)
      {
        console.log("Warning! - Could not find descriptor type :", json.type);
        return null;
      }
      if (!constructor.isType(json))
      {
        console.log("Warning! - Descriptor not properly formatted for type" + json.type + " :", json);
        return null;
      }
      return new constructor(json);
    }
    else
    {
      var foundConstructor = null;
      typeMapping.forEach(function(constructor)
      {
        if (constructor.isType(json))
        {
          foundConstructor = constructor;
        }
      });
      if (foundConstructor)
      {
        return new foundConstructor(json);
      }
      console.log("Warning! - Could not find a descriptor type for :", json);
      return null;
    }
  }
};
