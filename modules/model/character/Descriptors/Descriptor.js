"use strict";

const DescriptorManager = require("./DescriptorManager");
const Logger = require(process.cwd() + "/modules/Logger");

class Descriptor
{
  constructor(type, data)
  {
    if (!DescriptorManager.types.has(type))
    {
      Logger.warn("Could not find DescriptorType:", type);
      return null;
    }

    const self = this;
    Object.defineProperties(self,
    {
      type:
      {
        enumerable: true,
        value: DescriptorManager.types.get(type)
      },
      data:
      {
        enumerable: true,
        value: data
      }
    });
  }
}

module.exports = Descriptor;
