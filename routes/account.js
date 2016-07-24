"use strict";

var express = require('express');
var router = express.Router();

var templates = require('../templates/templates');

var Accounts = require("../modules/model/Account");
var Util = require('../modules/Util');

var Species = require("../modules/model/Species");
var Attribute = require("../modules/model/Attribute");

/**
 * Compiled the HTML for the attribute tree
 */
function getAttributeTree(type) {
    var name = type.name;
    /**
     * Getting the HTML for all the children
     */
    var children = [];
    if (type.children) {
        type.children.forEach(function(child) {
            children.push(getAttributeTree(child));
        });
    }

    var compiled = templates.characterCreation_attribute({
        name: name,
        children: children.join(''),
        color: type.color ? type.color : "#333333"
    });
    return compiled;
}

/* Main page get */
router.get('/', function(req, res) {
    var session = req.session;
    var accountId = session.account;
    Accounts.getAccountById(accountId).then(function(account) {
        if (Util.isNull(account)) {
            res.redirect("/");
        }

        res.render("account/account", {
            account: account,
            topBar: templates.topBar({
                account: account,
                character: null
            })
        });
    });

});

/* Character Creation Page */
router.get('/create', function(req, res) {
    var session = req.session;
    var accountId = session.account;
    Accounts.getAccountById(accountId).then(function(account) {
        if (Util.isNull(account)) {
            res.redirect("/");
        }

        var speciesItems = [];
        var speciesInfos = [];
        Species.list.forEach(function(species) {
            var sexItems = [];
            var sexInfos = [];
            species.getSexes().forEach(function(sex) {
                var sexItem = templates.characterCreation_sexItem({
                    sex: sex
                });
                var sexInfo = templates.characterCreation_sexInfo({
                    sex: sex
                });
                sexItems.push(sexItem);
                sexInfos.push(sexInfo);
            });

            var speciesItem = templates.characterCreation_speciesItem({
                species: species,
                sexItems: sexItems.join('')
            });
            var speciesInfo = templates.characterCreation_speciesInfo({
                species: species,
                sexInfos: sexInfos.join('')
            });
            speciesItems.push(speciesItem);
            speciesInfos.push(speciesInfo);

        });

        res.render("account/create", {
            account: account,
            topBar: templates.topBar({
                account: account,
                character: null
            }),
            attributeTree: getAttributeTree(Attribute.types.top),
            attributeCount: 5,
            speciesItems: speciesItems.join(''),
            speciesInfo: speciesInfos.join('')
        });
    })
});

/* Admin Control Panel Page */
router.get('/admin', function(req, res) {
    console.log("Going into admin");
    var session = req.session;
    var accountId = session.account;
    Accounts.getAccountById(accountId).then(function(account) {
        console.log("Inside Promise");
        if (Util.isNull(account)) {
            res.redirect("/auth");
        }

        if (account.name != 'radmin') {
            res.redirect("/account");
        }

        Accounts.getAccounts().then(function(accounts) {
            console.log("Got all accounts!", accounts);
            res.render("account/admin", {
                accounts: accounts
            });
            console.log("Leaving accounts");
        });
        console.log("Ending Promise");
    });

});

module.exports = router;
