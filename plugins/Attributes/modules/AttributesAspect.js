"use strict";

const Aspect = require(process.cwd() + "/modules/Plugins/CharacterAspect");

class AttributesAspect extends Aspect {
    /**
     * Applies the form retrieved from character creation and applies it to character data.
     * 
     * @param {Object} form The form to apply the form.
     * @param {Object} data The data to apply the form to.
     */
    static applyForm(form, data) {
        data.attributes = {};
        // TODO
    }

    /**
     * Validates the provided form from character creation.
     *
     * @param {Object} form The form to validate.
     */
    static validateForm( /*form*/ ) {
        return true;
    }

    constructor(plugin, data) {
        super(plugin, data, "attributes");
    }

    /**
     * Returns the requested attribute, calculating if it has children dependacies depending
     * on its type.
     * 
     * @param {String} attribute The attribute you wish to retrieve.
     * @return {Number} The value of the attribute (if not defined, returns 1)
     */
    getAttribute(attribute) {
        const type = this.plugin.attributeTree.map.get(attribute);
        if (!type) {
            this.plugin.logger.warn("Attempted to getAttribute of untyped attribute: '" + attribute + "'");
        }

        /* If it has children then its value is based on their average */
        if (type.children.length > 0) {
            let sum = 0;
            type.children.forEach(function(child) {
                sum += this.getAttribute(child.id);
            });
            return sum / type.children.length;
        }

        /* Otherwise we simply return the value if it exists */
        const value = this.data[attribute];
        if (!value && typeof value !== "number") {
            return 1;
        }
        return value;
    }

    /**
     * This will set the value of an attribute even if that attribute has children. This performs a recursive scale on the
     * children of an attribute to make sure that their average will return the newly set value.
     * 
     * @param {String} attribute The attribute to set the value of.
     * @param {Number} value The value to set the attribute to.
     * @return {AttributesAspect} Returns this object so it can be changed.
     */
    setAttribute(attribute, value) {
        const type = this.plugin.attributeTree.map.get(attribute);
        if (!type) {
            this.plugin.logger.warn("Attempted to setValue of untyped attribute: '" + attribute + "'");
            return null;
        }

        /* If there are children we'll need to scale up all the children as well */
        if (type.children.length > 0) {
            var currentValue = this.getAttribute(attribute);
            var valueRatio = value / currentValue;

            type.children.forEach(function(child) {
                this.scaleAttribute(child.id, valueRatio);
            });
        } else {
            this.data[attribute] = value;
        }
    }

    /**
     * Scales the specified attribute up by a certain amount.
     * This also scales up its children as well such that their average equals the value
     * of this attribute.
     *
     * @param {String} attribute The name of the attribute to scale.
     * @param {Number} scalar The amount fo scale the attribute by. 1 Changes NOTHING
     */
    scaleAttribute(attribute, scalar) {
        const self = this;
        const type = this.plugin.attributeTree.map.get(attribute);
        if (!type) {
            this.plugin.logger.warn("Attempted to setAttribute of untyped attribute: '" + attribute + "'");
            return null;
        }

        /* Scaling each child recursively */
        if (type.children.length > 0) {
            type.children.forEach(function(child) {
                self.scaleAttribute(child.id, scalar);
            });
        } else {
            /* Scaling the value if there are no children */
            let value = self.data[attribute];
            if (!value) {
                value = 1;
            }
            self.data[attribute] = value * scalar;
        }
    }
}

module.exports = AttributesAspect;
