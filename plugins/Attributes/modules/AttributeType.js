"use strict";

const Util = require(process.cwd() + "/modules/Util");
const Logger = require(process.cwd() + "/modules/Logger");
const Transform = require(process.cwd() + "/modules/DataStructures/Transform");

const typesConfig = require(process.cwd() + "/config/attributes");

let topAttribute = null;
let typesMap = null;
let transformsMap = null;

class AttributeType
{
    static _loadConfigs()
    {
        return AttributeType.map;
    }

    static get top()
    {
        if (topAttribute)
        {
            return topAttribute;
        }
        const tops = AttributeType.list.filter((type) =>
        {
            return !type.parent;
        });
        /* We should only have one top level attribute */
        if (tops.length > 1)
        {
            Logger.warn("The number of root attributes is greater than 1.");
        }
        if (tops.length <= 0)
        {
            Logger.error("There was apparently no top-level attribute. Someone's making circular attribute hierarchies!");
            return null;
        }
        topAttribute = tops[0];
        return topAttribute;

    }

    static get map()
    {
        if (!typesMap)
        {
            typesMap = new Map();
            /* Creating all the AttributeTypes from the JSONs */
            typesConfig.forEach(function(config)
            {
                try
                {
                    var type = new AttributeType(config);
                    typesMap.set(type.id, type);
                    Logger.info("Loaded AttributeType:", type.id);
                }
                catch (error)
                {
                    /* Skipping this part of the configuration if there was an error */
                    Logger.warn(error);
                    return;
                }
            });

            /* Populating the children of each type */
            typesMap.forEach(function(type)
            {
                type.populateChildren(typesMap);
            });
        }
        return typesMap;
    }

    static get list()
    {
        return Array.from(typesMap.values());
    }

    static get transforms()
    {
        if (!transformsMap)
        {
            transformsMap = new Map();
            module.exports.map.forEach(function(type)
            {
                type.transforms.forEach(function(transformArray, key)
                {
                    /* Initializing empty array if it doesn't have the key */
                    if (!transformsMap.has(key))
                    {
                        transformsMap.set(key, []);
                    }
                    /* Combining the two lists */
                    Array.prototype.push.apply(transformsMap.get(key), transformArray);
                });
            });
        }
        return transformsMap;

    }

    constructor(config)
    {
        Util.assertNotNull(config, config.id);
        const self = this;

        self.name = config.name || config.id;
        self.id = config.id;
        self.tag = config.tag;

        self.color = config.color;
        self.description = config.description || "";

        self.children = config.children || [];

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
        let transform = null;
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
        transform.tag = "attributeSource";
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
            const type = typeMapping.get(id);
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

AttributeType._loadConfigs();
module.exports = AttributeType;
