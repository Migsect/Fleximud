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
            body: this.getTemplate()(
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
        this.center = config.center;
        this.range = config.range;
    }

    get max()
    {
        return this.center + this.range;
    }

    get min()
    {
        return this.center - this.range;
    }

    get average()
    {
        return this.center;
    }

    get step()
    {
        return (this.max - this.min) / 100;
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
