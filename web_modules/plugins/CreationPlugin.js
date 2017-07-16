"use strict";
const WebPlugin = require("./WebPlugin");

class CreationPlugin extends WebPlugin {
    constructor(plugins, depends) {
        super(plugins, depends);

        this.fieldHeader = this.constructor.name;
        this.fields = {};
    }
    getFieldHeader() {
        return this.fieldHeader;
    }
    setFieldHeader(name) {
        this.fieldHeader = name;
    }
    setField(key, value) {
        this.fields[key] = value;
    }
    getField(key) {
        return this.fields[key];
    }
    hasField(key) {
        return this.fields.hasOwnProperty(key);
    }
    resetFields() {
        this.fields = {};
    }
    getFields() {
        return this.fields;
    }

    /**
     * Checks whether or not the creation-plugin has all its fields completed.
     * By default this will return true if the plugin does not have any specific
     * constraints for its fields.
     *
     * @return {Boolean} True if the plugin is complete
     */
    isComplete() {
        return true;
    }
}
module.exports = CreationPlugin;