"use strict";

const DescriptorManager = require("./DescriptorManager");
const Logger = require(process.cwd() + "/modules/Logger");

class Descriptors
{
    constructor(config)
    {
        if (!DescriptorManager.types.has(config.type))
        {
            Logger.warn("Could not find DescriptorType:", config.type);
            return null;
        }

        const self = this;
        self.type = DescriptorManager.types.get(config.type);
        self._data = config.data;
    }

    getDatabaseObject()
    {
        const self = this;
        return self._data;
    }

    setDescriptor(type, value)
    {
        const self = this;
        if (!DescriptorManager.types.has(type))
        {
            Logger.warn("Could not find DescriptorType:", type);
        }
        self.data[type] = value;
    }
    getDescriptor(type)
    {
        const self = this;
        if (!DescriptorManager.types.has(type))
        {
            Logger.warn("Could not find DescriptorType:", type);
            return null;
        }
        return self.data[type];
    }
}

module.exports = Descriptors;
