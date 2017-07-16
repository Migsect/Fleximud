"use strict";

var express = require("express");
var router = express.Router();

const Logger = require(process.cwd() + "/modules/Logger");
const Character = require(process.cwd() + "/modules/Model/Character");

const templates = require(process.cwd() + "/templates/templates");
const GlobalLayout = require("./layouts/global/global");
const charactersPage = templates(__dirname + "/client/client");

router.get("/", function(request, response) {
    const session = request.session;
    const account = session.account;
    if (!account) {
        response.redirect("/auth");
        return;
    }
    const characterId = request.query.character;
    Character.getCharacterById(characterId)
        .then((character) => {
            if (!character || character.accountId !== account.dbid) {
                response.redirect("/characters");
                return;
            }
            response.status(200).send(GlobalLayout(request, charactersPage({}), [
                "/stylesheets/client.css"
            ], [
                "/socket.io/socket.io.js",
                "/javascripts/built/client-entry.js"
            ]));
        }).catch(error => {
            Logger.error("During Client - Database Error:", error);
            response.status(500).json({
                message: "Internal Server Error"
            });
        });
});

module.exports = router;