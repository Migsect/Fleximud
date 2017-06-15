"use strict";

const Plugin = require(process.cwd() + "/modules/Plugins/Plugin");

class DescriptorsPlugin extends Plugin
{
    onLoad()
    {

    }

    getCreationForm()
    {
        const formTemplate = this.getCreationTemplate();
        return formTemplate(
        {});
    }
}

module.exports = DescriptorsPlugin;
