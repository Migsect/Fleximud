"use strict";

const Plugin = require(process.cwd() + "/modules/Plugins/Plugin");

class IdentitiesPlugin extends Plugin
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

module.exports = IdentitiesPlugin;
