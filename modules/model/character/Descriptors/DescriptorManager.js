/**
 * The descriptor manager is meant to handle the descriptor configurations and
 * provide it with a better means of accessing and manipulating.
 */

"use strict";

const Logger = require(process.cwd() + "/modules/Logger");

const DescriptorType = require("./DescriptorType");

const DESCRIPTOR_CONFIG = require(process.cwd() + "/config/descriptors");

class DescriptorManager
{
  constructor(config)
  {
    const self = this;
    Object.defineProperties(self,
    {
      types:
      {
        value: new Map()
      },
      transforms:
      {
        value: new Map()
      }
    });
    config.forEach(function(item)
    {
      const descriptorType = new DescriptorType(item);
      if (!descriptorType)
      {
        Logger.warn("DescriptorType config could not be parsed:", item);
        return;
      }
      self.types.set(descriptorType.id, descriptorType);
      /* Compiling a mapping of all the transforms as a result of the descriptors. */
      descriptorType.transforms.forEach(function(transformArray, key)
      {
        /* Initializing empty array if it doesn't have the key */
        if (!self.transforms.has(key))
        {
          self.transforms.set(key, []);
        }
        /* Combining the two lists */
        Array.prototype.push.apply(self.transforms.get(key), transformArray);
      });
    });

  }
}

module.exports = new DescriptorManager(DESCRIPTOR_CONFIG);
