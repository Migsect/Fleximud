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
        self.type = config.type || "general";
        self.parent = null;
        self.name = config.name || self.id;

        self.transforms = Util.isNull(config.transforms) ? new Map() : Transform.parseDirectedTransforms(config.transforms);

        self.attributes = config.attributes || [];
        self.documentation = Util.parseFileString(config.documentation || "", process.cwd() + "/config/documentation/");
        self.descriptorConfigurations = DescriptorConfiguration.getDescriptorConfigurations(config.descriptors || []);
        self.classifications = new Map();
        config.classifications = config.classifications || [];
        config.classifications.forEach(function(classificationConfig)
        {
            const type = classificationConfig.type;
            if (!self.classifications.has(type))
            {
                self.classifications.put(type, []);
            }
            const classification = new Classification(classificationConfig);
            classification.parent = self.classifications.get(classification.type).push(classification);
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
