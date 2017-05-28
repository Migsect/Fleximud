"use strict";

const templates = require(process.cwd() + "/templates/templates");
const pageTemplate = templates(process.cwd() + "/pages/creation/creation");

module.exports = function renderer()
{
    return pageTemplate();
};
