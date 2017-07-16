"use strict";

var express = require("express");
var router = express.Router();

const Character = require(process.cwd() + "/modules/Model/Character");
const Logger = require(process.cwd() + "/modules/Logger");

const templates = require(process.cwd() + "/templates/templates");
const GlobalLayout = require("./layouts/global/global");
const charactersPage = templates(__dirname + "/characters/characters");

/* GET characters page. */
router.get("/", function(request, response) {
    const session = request.session;
    const account = session.account;
    if (!account) {
        response.redirect("/auth");
        return;
    }
    Character.getCharactersByAccount(account)
        .then(characters => {
            const characterItems = characters.map((character) => character.getListItem());

            Logger.debug("characterItems", characterItems);
            response.status(200).send(GlobalLayout(request, charactersPage({
                characters: characterItems
            }), [
                "/stylesheets/characters.css"
            ], [ /* Scripts */ ]));
        })
        .catch(error => {
            Logger.error("During Creation - Database Error:", error);
            response.status(500).json({
                message: "Internal Server Error"
            });
        });
});

module.exports = router;