"use strict";

const Logger = require(process.cwd() + "/modules/Logger");

const AttributeType = require("./AttributeType");

/** This defines the actual data for a character's attributes. */
class Attributes
{
    constructor(config)
    {
        const self = this;
        self._values = config.values;
    }

    getDatabaseObject()
    {
        const self = this;
        return self._values;
    }

    /**
     * Returns the requested attribute, calculating if it has children dependacies depending
     * on its type.
     * 
     * @param attribute The attribute you wish to retrieve.
     */
    getAttribute(attribute)
    {
        const self = this;
        const type = AttributeType.map.get(attribute);
        if (!type)
        {
            Logger.warn("Attempted to getAttribute of untyped attribute: '" + attribute + "'");
            return null;
        }

        /* If it has children then its value is based on their average */
        if (type.children.length > 0)
        {
            var sum = 0;
            type.children.forEach(function(child)
            {
                sum += self.getAttribute(child.id);
            });
            return sum / type.children.length;
        }

        /* Otherwise we simply return the value if it exists */
        const value = self._values[attribute];
        if (!value)
        {
            return 1;
        }
        return value;
    }

    scaleAttribute(attribute, scalar)
    {
        const self = this;
        const type = AttributeType.map.get(attribute);
        if (!type)
        {
            Logger.warn("Attempted to setAttribute of untyped attribute: '" + attribute + "'");
            return null;
        }

        /* Scaling each child recursively */
        if (type.children.length > 0)
        {
            type.children.forEach(function(child)
            {
                self.scaleAttribute(child.id, scalar);
            });
        }
        else
        {
            /* Scaling the value if there are no children */
            let value = self._values[attribute];
            if (!value)
            {
                value = 1;
            }
            self._values[attribute] = value * scalar;
        }
    }

    /**
     * This will set the value of an attribute even if that attribute has children. This performs a recursive scale on the
     * children of an attribute to make sure that their average will return the newly set value.
     * 
     * @param attribute
     *            The attribute to set the value of
     * @param value
     *            The value to set the attribute to
     */
    setAttribute(attribute, value)
    {
        const self = this;
        var type = AttributeType.map.get(attribute);
        if (!type)
        {
            Logger.warn("Attempted to setValue of untyped attribute: '" + attribute + "'");
            return null;
        }

        /* If there are children we'll need to scale up all the children as well */
        if (type.children.length > 0)
        {
            var currentValue = self.getAttribute(attribute);
            var valueRatio = value / currentValue;

            type.children.forEach(function(child)
            {
                self.scaleAttribute(child.id, valueRatio);
            });
        }
        else
        {
            self._values[attribute] = value;
        }
    }
}

module.exports = Attributes;
