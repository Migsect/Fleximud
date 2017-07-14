"use strict";

var express = require("express");
var router = express.Router();

const PluginManager = require(process.cwd() + "/modules/Plugins/PluginManager");
const Logger = require(process.cwd() + "/modules/Logger");
const Character = require(process.cwd() + "/modules/model/Character");
const Account = require(process.cwd() + "/modules/model/Account");

const templates = require(process.cwd() + "/templates/templates");
const GlobalLayout = require("./layouts/global/global");
const creationRenderer = require("./creation/creation");

/* GET home page. */
router.get("/", (request, response) => {
    const session = request.session;
    if (!session.account) {
        response.redirect("/auth");
        return;
    }

    response.status(200).send(GlobalLayout(request, creationRenderer(), [
        "/stylesheets/creation.css"
    ], [
        "/javascripts/built/creation-entry.js"
    ]));
});

router.post("/create", (request, response) => {

    const session = request.session;
    const characterForm = request.body;
    if (!session.account) {
        response.status(401).json({
            message: "One should be logged in to create a character."
        });
        return;
    }
    const account = session.account;
    Logger.debug("account", account);

    /* Creating the pairs and validating the forms */
    const characterFormKeys = Object.keys(characterForm);
    const pairs = [];
    for (let i = 0; i < characterFormKeys.length; i += 1) {
        const key = characterFormKeys[i];
        const form = characterForm[key];
        const plugin = PluginManager.getPlugin(key);
        if (!plugin) {
            Logger.warn("During Creation - Could not find plugin with id:", key);
            response.status(500).json({
                message: "Internal Server Error"
            });
            return;
        }

        const aspectConstructor = plugin.aspectConstructor;
        if (aspectConstructor &&
            aspectConstructor.validateCharacterForm &&
            !aspectConstructor.validateCharacterForm()
        ) {
            response.status(400).json({
                message: "Invalid form for: " + key
            });
            return;
        }
        pairs.push({
            form: form,
            plugin: plugin
        });
    }

    /* Pre-applying all the forms the data for the character. */
    const characterData = {};
    pairs.forEach((pair) => {
        const plugin = pair.plugin;
        const form = pair.form;
        const aspectConstructor = plugin.aspectConstructor;
        if (!aspectConstructor || !aspectConstructor.applyForm) {
            /* A characteristic constructor is what adds plugin behaviors to players */
            return;
        }
        aspectConstructor.applyForm(form, characterData);
    });

    Character.createCharacter(account.dbid, characterData).then(() => {

        response.status(200).json({
            mesaage: "Created Character",
            redirect: "/characters"
        });
    }).catch(error => {
        Logger.error("During Creation - Database Error:", error);
        response.status(500).json({
            message: "Internal Server Error"
        });
    });
});

module.exports = router;
