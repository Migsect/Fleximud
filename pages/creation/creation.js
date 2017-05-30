"use strict";

const Logger = require(process.cwd() + "/modules/Logger");

const templates = require(process.cwd() + "/templates/templates");

const pageTemplate = templates(process.cwd() + "/pages/creation/creation");
const tabTemplate = templates(process.cwd() + "/pages/creation/creation_tab");

const formTemplate = templates(process.cwd() + "/pages/creation/creation_form");
const formAttributesTemplate = templates(process.cwd() + "/pages/creation/form_attributes");
const formClassificationTemplate = templates(process.cwd() + "/pages/creation/form_classification");
const formDescriptorsTemplate = templates(process.cwd() + "/pages/creation/form_descriptors");
const formIdentityTemplate = templates(process.cwd() + "/pages/creation/form_identity");

const AttributeTypes = require(process.cwd() + "/modules/Model/Character/Attributes/AttributeType");
const Classification = require(process.cwd() + "/modules/Model/Character/Classifications/Classification");

function compileDocumentation(classification, parentId = null)
{
    const information = [];
    information.push(
    {
        id: parentId ? parentId + "-" + classification.id : classification.id,
        body: classification.documentation,
        type: classification.type
    });
    classification.classifications.forEach((children) =>
    {
        children.forEach((child) =>
        {
            const childInformation = compileDocumentation(child, classification.id);
            Array.prototype.push.apply(information, childInformation);
        });
    });

    return information;
}

const sections = [
{
    id: "classification",
    name: "Classification",
    createForm: function createClassifcationForm()
    {
        const species = [];
        const races = [];
        const sexes = [];
        const information = [];
        Classification.list.forEach((classification) =>
        {
            Array.prototype.push.apply(information, compileDocumentation(classification));
            species.push(
            {
                name: classification.name,
                id: classification.id
            });
            classification.getChildren("sex").forEach((sexClassification) =>
            {
                sexes.push(
                {
                    name: sexClassification.name,
                    id: sexClassification.id,
                    parentId: sexClassification.parent.id
                });
            });
            classification.getChildren("race").forEach((raceClassification) =>
            {
                races.push(
                {
                    name: raceClassification.name,
                    id: raceClassification.id,
                    parentId: raceClassification.parent.id
                });
            });
        });
        Logger.debug("Sexes:", sexes);
        return formClassificationTemplate(
        {
            species: species,
            races: races,
            sexes: sexes,
            information: information
        });
    }
},
{
    id: "descriptors",
    name: "Descriptors",
    createForm: function createDescriptorsForm()
    {
        return formDescriptorsTemplate(
        {});
    }
},
{
    id: "attributes",
    name: "Attributes",
    createForm: function createAttributesForm()
    {
        return formAttributesTemplate(
        {});
    }
},
{
    id: "identity",
    name: "Identity",
    createForm: function createIdentityForm()
    {
        return formIdentityTemplate(
        {});
    }
}];

module.exports = function renderer()
{
    const tabs = sections.map((section) =>
    {
        return tabTemplate(
        {
            id: section.id,
            name: section.name
        });
    });

    const forms = sections.map((section, index) =>
    {
        return formTemplate(
        {
            name: section.name,
            id: section.id,
            body: section.createForm(),
            hidden: index > 0
        });
    });

    return pageTemplate(
    {
        tabs: tabs.join(""),
        forms: forms.join("")
    });
};
