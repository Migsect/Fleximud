"use strict";

const Util = require(process.cwd() + "/modules/Util");
const Transform = require(process.cwd() + "/modules/DataStructures/Transform");
const Fuzzy = require(process.cwd() + "/modules/DataStructures/Fuzzy");

const DescriptorConfiguration = require("../DescriptorConfiguration");
const AttributeType = require("../Attributes/AttributeType");

class Classification
{
    constructor(config)
    {
        const self = this;
        self.id = config.id;
        self.name = config.name;
        self.type = config.type || "general";
        self.attributes = Util.isNull(config.attributes) ? [] : config.attributes;
        self.transforms = Util.isNull(config.transforms) ? new Map() : Transform.parseDirectedTransforms(config.transforms);
        self.documentation = Util.parseFileString(Util.isNull(config.documentation) ? "" : config.documentation, process.cwd() + "/config/documentation/");
        self.descriptorConfigurations = DescriptorConfiguration.getDescriptorConfigurations(config.descriptors);
        self.classifications = new Map();
        config.classifications.forEach(function(classification)
        {
            const type = classification.type;
            if (!self.classifications.has(type))
            {
                self.classifications.put(type, []);
            }
            self.classifications.get(classification.type).push(new Classification(classification));
        });
    }

    getDescriptorConfiguration(id)
    {
        const self = this;
        return self.getDescriptorConfigurations.get(id);
    }
    getDescriptorConfigurations()
    {
        const self = this;
        return Array.from(self.descriptorConfigurations.values());
    }

    applyAttributes(character)
    {
        const self = this;
        /* For each attribute, apply it to the character */
        self.attributes.forEach(function(attribute)
        {
            const fuzzy = new Fuzzy(attribute.center, attribute.range);
            /* Determining which attributes to change */
            const attributes = attribute.id == "default" ? AttributeType.list : [attribute.id];
            attributes.forEach(function(attribute)
            {
                const value = character.attributes.getAttribute(attribute);
                character.attributes.setAttribute(attribute, value * fuzzy.fuzzy());
            });
        });
    }
}

module.exports = Classification;
