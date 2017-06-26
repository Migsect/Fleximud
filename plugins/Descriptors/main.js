"use strict";

const Plugin = require(process.cwd() + "/modules/Plugins/Plugin");

class DescriptorsPlugin extends Plugin
{
    onLoad()
    {
        const config = this.getConfig();
        config.copyDefaults();
        config.load();

    }

    getCreationForm()
    {
        const formTemplate = this.getCreationTemplate();

        const Classifications = this.manager.getPlugin("Classifications");
        Classifications.classifications.list.forEach((classification) =>
        {

        });
        return formTemplate(
        {});
    }
}

module.exports = DescriptorsPlugin;
