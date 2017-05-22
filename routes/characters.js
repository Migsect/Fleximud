"use strict";

var express = require("express");
var router = express.Router();

const templates = require(process.cwd() + "/templates/templates");
const GlobalLayout = require(process.cwd() + "/layouts/global");
const charactersPage = templates("pages/characters");

/* GET home page. */
router.get("/", function(request, response)
{
    response.status(200).send(GlobalLayout(request, charactersPage(), [
        "/stylesheets/characters.css"
    ], [
        "/javascripts/built/characters-entry.js"
    ]));
});

module.exports = router;
