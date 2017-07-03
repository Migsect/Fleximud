"use strict";

const Util = require(process.cwd() + "/modules/Util");
const templates = require(process.cwd() + "/templates/templates");
const path = require("path");

const descriptorTemplate = templates(__dirname + "/../templates/descriptor");

/**
 * DescriptorConfigurations are per-classification instances of a specified type of Descriptor.
 * These actually hold the implementation of the descriptor.
 */
class DescriptorConfiguration
{

    constructor(type)
    {
        const self = this;
        self.type = type;
    }

    get format()
    {
        return this.constructor.format;
    }

    getTemplate()
    {
        return templates(__dirname + "/../templates/creationDisplays/" + this.format);
    }

    getHTML(classifications)
    {
        return descriptorTemplate(
        {

            type: this.type,
            config: this,
            body: this.getTemplate(
            {
                config: this,
                type: this.type
            }),
            classifications: classifications
        });
    }
}

class RangeDescriptorConfiguration extends DescriptorConfiguration
{
    static get format()
    {
        return "range";
    }

    constructor(type, config)
    {
        super(type);
        const self = this;
        self.center = config.center;
        self.range = config.range;
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
    static get format()
    {
        return "variation";
    }

    constructor(type, config)
    {
        super(type);
        const self = this;
        self.variations = config.variations;
    }
}

DescriptorConfiguration.types = [
    RangeDescriptorConfiguration,
    VariationDescriptorConfiguration
];

module.exports = DescriptorConfiguration;
