"use strict";

const Plugin = require(process.cwd() + "/modules/Plugins/Plugin");
const DescriptorManager = require("./modules/DescriptorManager");
const templates = require(process.cwd() + "/templates/templates");
const path = require("path");

const descriptorTemplate = templates(__dirname + "/templates/descriptor");

class DescriptorsPlugin extends Plugin
{
    onLoad()
    {
        const config = this.getConfig();
        config.copyDefaults();
        config.load();

        this.descriptorManager = new DescriptorManager(config.toArray());
    }

    getDescriptorsHTML(classification, parents = [])
    {
        let childrenHTML = "";
        if (classification.classifications)
        {
            const children = Array.from(classification.classifications.values())
                .reduce((accumulator, classifications) =>
                {
                    return accumulator.concat(classifications);
                }, []);
            childrenHTML = children.map((childClassification) => this.getDescriptorsHTML(childClassification, parents.concat([
            {
                type: classification.type,
                id: classification.id
            }]))).join("");
        }

        const html = classification.descriptorConfigurations.map((descriptor) =>
        {
            const descriptorType = this.descriptorManager.types.get(descriptor.id);
            const creationType = descriptorType.creation;

            const classifications = {};
            parents.forEach((parent) =>
            {
                classifications[parent.type] = parent.id;
            });
            classifications[classification.type] = classification.id;
            // TODO check to see if the template does exist.
            try
            {
                const templatePath = path.resolve(__dirname + "/templates/creationDisplays/" + creationType);
                let template = templates(templatePath);
                return descriptorTemplate(
                {
                    type: descriptorType,
                    config: descriptor,
                    body: template(
                    {
                        type: descriptorType,
                        config: descriptor
                    }),
                    classifications: classifications
                });
            }
            catch (error)
            {
                this.logger.error("Could not find template for:", creationType);
            }

        }).join("");
        return html + childrenHTML;
    }

    getCreationForm()
    {
        const formTemplate = this.getCreationTemplate();

        const Classifications = this.manager.getPlugin("Classifications");
        const html = Classifications.classifications.list
            .map((classification) => this.getDescriptorsHTML(classification)).join("");
        return formTemplate(
        {
            descriptors: html
        });
    }
}

module.exports = DescriptorsPlugin;
