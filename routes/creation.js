"use strict";

var express = require("express");
var router = express.Router();

const templates = require(process.cwd() + "/templates/templates");
const GlobalLayout = require(process.cwd() + "/layouts/global/global");
const creationRenderer = require(process.cwd() + "/pages/creation/creation.js");

/* GET home page. */
router.get("/", function(request, response)
{
    response.status(200).send(GlobalLayout(request, creationRenderer(), [
        "/stylesheets/creation.css"
    ], [
        "/javascripts/built/creation-entry.js"
    ]));
});

module.exports = router;
