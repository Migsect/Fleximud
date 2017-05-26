"use strict";

const Util = require(process.cwd() + "/modules/Util");
const Logger = require(process.cwd() + "/modules/Logger");
var Transform = require(process.cwd() + "/modules/DataStructures/Transform");

class AttributeType
{
    constructor(config)
    {
        Util.assertNotNull(config, config.id);
        const self = this;

        self.name = config.name || config.id;
        self.id = config.id;
        self.tag = config.tag;

        self.color = config.color;
        self.description = config.description;

        self.children = config.children;

        self.transforms = new Map();
        self._setupTransforms();
    }

    /**
     * sets up all the transforms for the attribute type.
     */
    _setupTransforms()
    {
        const self = this;
        self.transforms = self.transforms ? new Map() : Transform.parseDirectedTransforms(self.transforms);
        if (!self.transforms.has(self.id))
        {
            /* Adding the descriptor id if it is not in there*/
            self.transforms.set(self.id, []);
        }

        /* Getting the base attribute */
        var transform = null;
        if (self.children.length <= 0)
        {
            /* The transform will be based of the attribute's current value */
            transform = Transform.createTransform(function(value, character)
            {
                return value + character.attributes.getAttribute(self.id);
            });
        }
        else
        {
            transform = Transform.createTransform(function(value, character)
            {
                /* The attribute will be create from the children */
                var sum = 0;
                self.children.forEach(function(child)
                {
                    sum += character.getStat(child.id);
                });
                return {
                    value: sum / self.children.length,
                    final: true
                };
            });
        }
        /* Inidcating that the transform is a source */
        self.transform.tag = "attributeSource";
        self.transforms.get(self.id).push(transform);

        /* Inheritance transform (a compsite transform that uses any parent transforms. */
        self.transforms.get(self.id).push(Transform.createTransform(function(value, character)
        {
            /* Do Nothing if there is no parent */
            if (Util.isNull(self.parent))
            {
                return value;
            }

            /* Grabbing all the parent's transforms since they apply to this attribute as well. */
            var parentId = self.parent.id;
            var parentTransforms = character.getStatTransforms(parentId);

            /* Folding all the transforms down. */
            return parentTransforms.reduce(function(previous, transform)
            {
                /* If the transform is an attribute source, then don't apply it. */
                if (!Util.isNull(transform.tag) && transform.tag == "attributeSource")
                {
                    return previous;
                }

                /* Applying the transform */
                return transform.transform(previous, character);
            }, value);
        }));
    }

    /**
     * Populates all the children of the AttributeType using the actual AttributeTypes
     */
    populateChildren(typeMapping)
    {
        const self = this;
        self.children = self.children.map(function(id)
        {
            var type = typeMapping.get(id);
            if (!type)
            {
                Logger.warn("'" + id + "' did not have a type object defined.");
                return null;
            }
            /* This sets a reference to the parent of each child. */
            type.parent = self;
            return type;
        }).filter(function(element)
        {
            return element !== null;
        });
    }
}

module.exports.map = (function()
{
    /* Getting the list of attributes */
    var typesJSON = require(process.cwd() + "/config/attributes");

    /* Mapping the jsons to objects */
    var types = new Map();

    /* Creating all the AttributeTypes from the JSONs */
    typesJSON.forEach(function(json)
    {
        try
        {
            var type = new AttributeType(json);
            types.set(type.id, type);
        }
        catch (error)
        {
            /* Skipping this part of the configuration if there was an error */
            Logger.error(error);
            return;
        }
    });

    /* Populating the children of each type */
    types.forEach(function(type)
    {
        type.populateChildren(types);
    });

    /* Returning the type */
    return types;
})();

module.exports.list = Array.from(module.exports.map.keys());
module.exports.transforms = (function()
{
    var transformMap = new Map();
    module.exports.map.forEach(function(type)
    {
        type.transforms.forEach(function(transformArray, key)
        {
            /* Initializing empty array if it doesn't have the key */
            if (!transformMap.has(key))
            {
                transformMap.set(key, []);
            }
            /* Combining the two lists */
            Array.prototype.push.apply(transformMap.get(key), transformArray);
        });
    });
    return transformMap;
})();
