"use strict";

var express = require("express");
var router = express.Router();

const templates = require(process.cwd() + "/templates/templates");
const GlobalLayout = require(process.cwd() + "/layouts/global");
const creationPage = templates("pages/creation");

/* GET home page. */
router.get("/", function(request, response)
{
    response.status(200).send(GlobalLayout(request, creationPage(), [
        "/stylesheets/creation.css"
    ], [
        "/javascripts/built/creation-entry.js"
    ]));
});

module.exports = router;
