"use strict";

const path = require("path");

const Plugin = require(process.cwd() + "/modules/Plugins/Plugin");
const AttributeTypes = require("./modules/AttributeType");
const Attributes = require("./modules/Attributes");

const templates = require(process.cwd() + "/templates/templates");
const elementAttribute = templates(path.join(__dirname, "templates/element_attribute"));

function compileAttributeTree(attributeType, hideDepth = 0)
{
    if (!attributeType)
    {
        attributeType = AttributeTypes.top;
    }
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

    }

    getCreationForm()
    {
        const formTemplate = this.getCreationTemplate();
        const attributesTree = compileAttributeTree(null, 2);
        return formTemplate(
        {
            tree: attributesTree
        });
    }
}

module.exports = AttributesPlugin;
