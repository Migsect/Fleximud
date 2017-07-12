"use strict";

var express = require("express");
var router = express.Router();

const templates = require(process.cwd() + "/templates/templates");
const GlobalLayout = require(process.cwd() + "/layouts/global/global");
const creationRenderer = require(process.cwd() + "/pages/creation/creation.js");

const PluginManager = require(process.cwd() + "/modules/Plugins/PluginManager");
const Logger = require(process.cwd() + "/modules/Logger");
const Character = require(process.cwd() + "/modules/model/Character");
const Account = require(process.cwd() + "/modules/model/Account");

/* GET home page. */
router.get("/", (request, response) =>
{
    response.status(200).send(GlobalLayout(request, creationRenderer(), [
        "/stylesheets/creation.css"
    ], [
        "/javascripts/built/creation-entry.js"
    ]));
});

router.post("/create", (request, response) =>
{
    const characterForm = request.body;

    /* Creating the pairs and validating the forms */
    const characterFormKeys = Object.keys(characterForm);
    const pairs = [];
    for (let i = 0; i < characterFormKeys.length; i += 1)
    {
        const key = characterFormKeys[i];
        const form = characterForm[key];
        const plugin = PluginManager.getPlugin(key);
        if (!plugin)
        {
            Logger.warn("During Creation - Could not find plugin with id:", key);
            response.status(500).json(
            {
                message: "Server Error, please contact your administrator about this."
            });
            return;
        }
        if (!plugin.validateCreationForm())
        {
            response.status(400).json(
            {
                message: "Invalid form for: " + key
            });
            return;
        }
        pairs.push(
        {
            form: form,
            plugin: plugin
        });
    }
    /* Actually creating the character */
    Character.createCharacter(1).then(character =>
    {
        pairs.forEach((pair) =>
        {
            const plugin = pair.plugin;
            const form = pair.form;
        });

        response.status(200).json(
        {
            form: characterForm
        });
    }).catch(error =>
    {
        Logger.error("During Creation - Database Error:", error);
        response.status(500).json(
        {
            message: "Server Error, please contact your administrator about this."
        });
    });
});

module.exports = router;
