"use strict";
var Util = require(process.cwd() + "/modules/Util");
var DisplayName = require("../DisplayName");

var templates = require(process.cwd() + "/templates/templates");

var DescriptorTypes = require("../DescriptorTypes");

var typeMapping = new Map();

/** MainDescriptor */
var Descriptor = function(json, type)
{
  Util.assertNotNull(json.id);

  var self = this;
  Object.defineProperties(self,
  {
    id:
    {
      value: json.id
    },
    type:
    {
      value: Util.isNull(type) ? null : type
    },
    displayName:
    {
      value: new DisplayName(Util.isNull(json.name) ? "NO NAME" : json.name)
    }
  });
};

Object.defineProperties(Descriptor.prototype,
{
  merge:
  {
    /**
     * Merges a descriptor with another of its same type
     * This does so for some situations where descriptors can be merged. (sex and species descriptors)
     * 
     * @return {Descriptor} The resulting descriptor
     */
    value: function(other)
    {
      if (other.constructor !== this.constructor)
      {
        return null;
      }
      return this;
    },
    writable: true
  },
  getHTML:
  {
    /**
     * Gets an HTML representation of this descriptor for selecting it.
     * 
     * @return {HTMLString} [description]
     */
    value: function()
    {
      var template = templates("characterCreation/classification/descriptors/" + this.type);
      return template(this.getJSON());
    },
    writable: true
  },
  getJSON:
  {
    /**
     * Gets a JSON representation of the descriptor's attributes.
     * 
     * @return {JSON} The returned json representation.
     */
    value: function()
    {
      return this;
    },
    writable: true
  }
});
/** A descriptor that has a range of states. */
var RangeDescriptor = function(json)
{
  Descriptor.call(this, json, "range");
  this.center = json.center;
  this.range = json.range;
};
RangeDescriptor.isType = function(json)
{
  return !Util.isNull(json.range) && !Util.isNull(json.center);
};
typeMapping.set('RangeDescriptor', RangeDescriptor);
Util.inherit(Descriptor, RangeDescriptor);

Object.defineProperties(RangeDescriptor.prototype,
{
  merge:
  {
    value: function(other)
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
    }
  },
  getJSON:
  {
    value: function()
    {
      var json = {
        id: this.id,
        name: this.displayName.singular,
        max: this.getMax(),
        min: this.getMin(),
        average: this.getAverage()
      };
      return json;
    }
  },
  getMax:
  {
    value: function()
    {
      return this.center + this.range;
    }
  },
  getMin:
  {
    value: function()
    {
      return this.center - this.range;
    }
  },
  getAverage:
  {
    value: function()
    {
      return this.center;
    }
  }
});

/** A descriptor that can vary between different states */
var VariationDescriptor = function(json)
{
  Descriptor.call(this, json, "variation");
  this.variations = json.variations;
};
VariationDescriptor.isType = function(json)
{
  return !Util.isNull(json.variations);
};
typeMapping.set('VariationDescriptor', VariationDescriptor);
Util.inherit(Descriptor, VariationDescriptor);

Object.defineProperties(VariationDescriptor.prototype,
{
  merge:
  {
    value: function(other)
    {
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
    }
  },
  getJSON:
  {
    value: function()
    {
      var json = {
        id: this.id,
        name: this.displayName.singular,
        variations: this.variations,
        first: this.variations[0]
      };
      return json;
    }
  }
});

Object.defineProperties(module.exports,
{
  getDescriptor:
  {
    value: function(json)
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
  }
});
