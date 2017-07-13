"use strict";

const path = require("path");

const Plugin = require(process.cwd() + "/modules/Plugins/Plugin");
const AttributeTypes = require("./modules/AttributeType");
const Attributes = require("./modules/Attributes");

const templates = require(process.cwd() + "/templates/templates");
const elementAttribute = templates(path.join(__dirname, "templates/element_attribute"));

function compileAttributeTree(attributeType, hideDepth = 0)
{
    const children = attributeType.children.map((child) =>
    {
        return compileAttributeTree(child, hideDepth - 1);
    });
    return elementAttribute(
    {
        id: attributeType.id,
        name: attributeType.name,
        color: attributeType.color,
        children: children.join(""),
        childrenHidden: hideDepth > 0
    });
}

class AttributesPlugin extends Plugin
{
    onLoad()
    {
        const config = this.getConfig();
        config.copyDefaults();
        config.load();
        this.attributeTree = AttributeTypes.parseAttributeTypes(config.types, this.logger);
    }

    getCreationForm()
    {
        const formTemplate = this.getCreationTemplate();
        const attributesTree = compileAttributeTree(this.attributeTree.top, 2);
        return formTemplate(
        {
            tree: attributesTree,
            help: this.getConfig().get("help", ""),
            information: [].join(""),
            points: 20
        });
    }

}

module.exports = AttributesPlugin;
