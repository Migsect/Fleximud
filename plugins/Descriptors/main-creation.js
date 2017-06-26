"use strict";

require("./styles/creation.css");
const CreationPlugin = require("plugins/CreationPlugin");

class DescriptorPlugin extends CreationPlugin
{
    onLoad()
    {
        console.log("We loaded!");
    }
}

module.exports = DescriptorPlugin;
