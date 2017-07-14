"use strict";

const templates = require(process.cwd() + "/templates/templates");
const path = require("path");

const Plugin = require(process.cwd() + "/modules/Plugins/Plugin");

const DescriptorManager = require("./modules/DescriptorManager");
const DescriptorConfiguration = require("./modules/DescriptorConfiguration");
const Aspect = require("./modules/DescriptorsAspect");

const descriptorTemplate = templates(__dirname + "/templates/descriptor");

class DescriptorsPlugin extends Plugin {
    onLoad() {
        const config = this.getConfig();
        config.copyDefaults();
        config.load();

        this.descriptorManager = new DescriptorManager(config.toArray());

        this.configurationFormats = new Map();
        DescriptorConfiguration.types.forEach((type) => this.addConfigurationType(type));

        const Classifications = this.manager.getPlugin("Classifications");
        Classifications.classifications.list.forEach((classification) => this.configureDescriptors(classification));

    }

    addConfigurationType(type) {
        if (!type.format) {
            this.logger.warn("Could not add configuration type", type.name, "due to lacking id,");
            return;
        }
        this.configurationFormats.set(type.format, type);
    }

    configureDescriptors(classification) {
        classification.descriptorConfigurations = classification.descriptorConfigurations.map((config) => {
            const typeId = config.id;
            if (!typeId || !this.descriptorManager.types.has(typeId)) {
                this.logger.warn("Could not find typeId:", typeId || "None Supplied");
                return null;
            }
            const type = this.descriptorManager.types.get(typeId);

            const formatId = type.format;
            if (!formatId || !this.configurationFormats.has(formatId)) {
                this.logger.warn("Descriptor Type", typeId, "does not have a format:", formatId || "None Supplied");
                return null;
            }
            const format = this.configurationFormats.get(formatId);
            return new format(type, config);

        }).filter((descriptor) => descriptor);

        /* Configuring for all the children as well */
        classification.children.forEach((child) => this.configureDescriptors(child));

    }

    getDescriptorsHTML(classification, parents = []) {
        const childrenHTML = classification.children
            .map((childClassification) => this.getDescriptorsHTML(childClassification, parents.concat([{
                type: classification.type,
                id: classification.id
            }])))
            .join("");

        const html = classification.descriptorConfigurations.map((descriptor) => {

            const classifications = {};
            parents.forEach((parent) => {
                classifications[parent.type] = parent.id;
            });
            classifications[classification.type] = classification.id;
            try {
                return descriptor.getHTML(classifications);
            } catch (error) {
                this.logger.error("Could not find template for:", descriptor.type.id, error);
                return "";
            }

        }).join("");
        return html + childrenHTML;
    }

    getCreationForm() {
        const formTemplate = this.getCreationTemplate();

        const Classifications = this.manager.getPlugin("Classifications");
        const html = Classifications.classifications.list
            .map((classification) => this.getDescriptorsHTML(classification))
            .join("");
        return formTemplate({
            descriptors: html
        });
    }

    get aspectConstructor() {
        return Aspect;
    }
}

module.exports = DescriptorsPlugin;
