"use strict";

const Util = require(process.cwd() + "/modules/Util");
const DescriptorManager = require("./DescriptorManager");

class DescriptorConfiguration
{
  constructor(config)
  {
    const self = this;

    const idType = DescriptorManager.types.get(config.id);
    if (!idType)
    {
      throw new Error("idType '" + config.id + "' could not be determined");
    }
    Object.defineProperties(self,
    {
      id:
      {
        enumberable: true,
        value: Util.isNull(config.id) ? null : config.id
      },
      idType:
      {
        enumberable: true,
        value: idType
      }
    });

  }

  /**
   * Merges a descriptor with another of its same type
   * This does so for some situations where descriptors can be merged. (sex and species descriptors)
   * 
   * @return {Descriptor} The resulting descriptor
   */
  merge(other)
  {
    const self = this;
    if (other.constructor !== self.constructor)
    {
      return null;
    }
    return self;
  }

  // /**
  //  * Gets an HTML representation of this descriptor for selecting it.
  //  * 
  //  * @return {HTMLString} [description]
  //  */
  // getHTML()
  // {
  //   const self = this;
  //   const template = templates("characterCreation/classification/descriptors/" + self.idType.type);
  //   return template(self.getJSON());
  // }

  // /**
  //  * Gets a JSON representation of the descriptor's attributes.
  //  * 
  //  * @return {JSON} The returned json representation.
  //  */
  // getJSON()
  // {
  //   const self = this;
  //   var idType = self.getIdType();
  //   return {
  //     id: self.id,
  //     type: self.type,
  //     name: Util.isNull(self.name) ? (function()
  //     {
  //       var idType = self.getIdType();
  //       return Util.isNull(idType) ? "NO NAME" : idType.name.singular;
  //     })() : self.name.singular,
  //     unit: Util.isNull(self.unit) ? (function()
  //     {
  //       return Util.isNull(idType) ? null : (Util.isNull(idType.unit) ? null : idType.unit.singular);
  //     })() : self.unit.singular
  //   };
  // }
}

class RangeDescriptorConfiguration extends DescriptorConfiguration
{
  constructor(config)
  {
    super(config);
    const self = this;
    Object.defineProperties(self,
    {
      center:
      {
        value: config.center,
        enumberable: true
      },
      range:
      {
        value: config.range,
        enumberable: true
      }
    });
  }

  static isType(config)
  {
    return !Util.isNull(config.range) && !Util.isNull(config.center);
  }
  merge(other)
  {
    const self = this;
    const value = super.merge(self, other);
    if (value === null)
    {
      return null;
    }

    /* merge logic */
    const otherMax = other.max;

    const otherMin = other.min;
    const selfMax = self.max;
    const selfMin = self.min;

    const newMax = otherMax > selfMax ? otherMax : selfMax;
    const newMin = otherMin < selfMin ? otherMin : selfMin;
    const newCenter = (newMin + newMax) / 2;

    return new RangeDescriptorConfiguration(
    {
      center: newCenter,
      range: newMax - newCenter,
      id: self.type
    });

  }

  get max()
  {
    const self = this;
    return self.center + self.range;
  }
  get min()
  {
    const self = this;
    return self.center - self.range;
  }

  get average()
  {
    const self = this;
    return self.center;
  }
}

class VariationDescriptorConfiguration extends DescriptorConfiguration
{
  constructor(config)
  {
    const self = this;
    super(config);
    Object.defineProperties(self,
    {
      variations:
      {
        value: config.variations
      }
    });
  }

  static isType(config)
  {
    return !Util.isNull(config.variations);
  }

  merge(other)
  {
    const self = this;
    const value = super.merge(other);
    if (value === null)
    {
      return null;
    }

    /* merge logic */
    const newVariations = [];
    Array.prototype.push.call(newVariations, self.variations);
    other.variations.forEach(function(variation)
    {
      if (!newVariations.includes(variation))
      {
        newVariations.push(variation);
      }
    });
    Array.prototype.push.call(newVariations, other.variations);

    return new VariationDescriptorConfiguration(
    {
      variations: newVariations,
      id: self.id
    });
  }
}

Object.defineProperties(module.exports,
{
  getDescriptorConfiguration:
  {
    value: function(config)
    {
      if (RangeDescriptorConfiguration.isType(config))
      {
        return new RangeDescriptorConfiguration(config);
      }
      else if (VariationDescriptorConfiguration.isType(config))
      {
        return new VariationDescriptorConfiguration(config);
      }
      else
      {
        throw new Error("Could not resolve a type for:" + config);
      }
    }
  }
});
