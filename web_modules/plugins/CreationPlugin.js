"use strict";
const WebPlugin = require("./WebPlugin");

class CreationPlugin extends WebPlugin
{
    constructor(plugins)
    {
        super(plugins);
        const self = this;

        self.fieldHeader = self.constructor.name;
        self.fields = {};
    }

    setFieldHeader(name)
    {
        const self = this;
        self.fieldHeader = name;
    }
    setField(key, value)
    {
        const self = this;
        self.fields[key] = value;
    }
    getField(key)
    {
        const self = this;
        return self.fields[key];
    }
    hasField(key)
    {
        const self = this;
        return self.fields.hasOwnProperty(key);
    }
    resetFields()
    {
        const self = this;
        self.fields = {};
    }

    /**
     * Checks whether or not the creation-plugin has all its fields completed.
     * By default this will return true if the plugin does not have any specific
     * constraints for its fields.
     */
    isComplete()
    {
        return true;
    }
}
module.exports = CreationPlugin;
