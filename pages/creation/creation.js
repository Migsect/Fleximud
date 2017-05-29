"use strict";

const templates = require(process.cwd() + "/templates/templates");

const pageTemplate = templates(process.cwd() + "/pages/creation/creation");
const tabTemplate = templates(process.cwd() + "/pages/creation/creation_tab");

const formTemplate = templates(process.cwd() + "/pages/creation/creation_form");
const formAttributesTemplate = templates(process.cwd() + "/pages/creation/form_classification");
const formClassificationTemplate = templates(process.cwd() + "/pages/creation/form_descriptors");
const formDescriptorsTemplate = templates(process.cwd() + "/pages/creation/form_attributes");
const formIdentityTemplate = templates(process.cwd() + "/pages/creation/form_identity");

const sections = [
{
    id: "classification",
    name: "Classification",
    createForm: function createAttributesForm()
    {
        formAttributesTemplate(
        {});
    }
},
{
    id: "descriptors",
    name: "Descriptors",
    createForm: function createClassifcationForm()
    {
        formClassificationTemplate(
        {});
    }
},
{
    id: "attributes",
    name: "Attributes",
    createForm: function createDescriptorsForm()
    {
        formDescriptorsTemplate(
        {});
    }
},
{
    id: "identity",
    name: "Identity",
    createForm: function createIdentityForm()
    {
        formIdentityTemplate(
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
