"use strict";

const Util = require(process.cwd() + "/modules/Util");
const DescriptorManager = require("./DescriptorManager");

/**
 * DescriptorConfigurations are per-classification instances of a specified type of Descriptor.
 * These actually hold the implementation of the descriptor.
 */
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
        self.id = Util.isNull(config.id) ? null : config.id;
        self.idType = idType;
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
}

class RangeDescriptorConfiguration extends DescriptorConfiguration
{
    constructor(config)
    {
        super(config);
        const self = this;
        self.center = config.center;
        self.range = config.range;
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
        self.variations = config.variations;
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

function getDescriptorConfiguration(config)
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

function getDescriptorConfigurations(configs)
{
    const descriptorMap = new Map();
    configs.forEach(function(config)
    {
        const descriptor = getDescriptorConfiguration(config);
        if (!descriptor)
        {
            return;
        }
        descriptorMap.set(descriptor.id, descriptor);
    });
    return descriptorMap;
}

module.exports = {
    getDescriptorConfiguration: getDescriptorConfiguration,
    getDescriptorConfigurations: getDescriptorConfigurations
};
