"use strict";

const Util = require(process.cwd() + "/modules/Util");
const Transform = require(process.cwd() + "/modules/DataStructures/Transform");

/**
 * A DescriptorType represents an overall identification of a descriptor.  It is mainly used
 * to indicated the the descriptor exists as well as offer a unifying means to declaring transforms.
 *
 * While classifications may create DescriptorConfigurations, they do not determining the
 * transforms that those descriptors have.  Additionally, those DescriptorConfigurations must
 * reference a DescriptorType.
 */
class DescriptorType
{
    constructor(config)
    {
        const self = this;
        self.id = config.id;
        self.format = config.format;
        self.name = config.name;
        self.unit = config.unit;
        self.transforms = (function()
        {
            var map = Util.isNull(config.transforms) ? new Map() : Transform.parseDirectedTransforms(config.transforms);

            /* Adding the descriptor id if it is not in there*/
            if (!map.has(config.id))
            {
                map.set(config.id, []);
            }

            /* Getting the base attribute off */
            map.get(config.id).push(Transform.createTransform(function(value, character)
            {
                var storedValue = character.descriptors.getDescriptor(config.id);
                /* We'll add onto it if it is a number */
                if (Util.isNumber(value) && Util.isNumber(storedValue))
                {
                    return value + storedValue;
                }
                /* Otherwise we'll just return the character's current value for it */
                else
                {
                    return storedValue;
                }
            }));

            return map;
        })();
    }
}

module.exports = DescriptorType;
