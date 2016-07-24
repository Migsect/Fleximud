"use strict";

/**
 * Used to load and have a single reference to all templates.
 */

var fs = require('fs');
var handlebars = require('handlebars');

function compileTemplate(fileName) {
    var file = fs.readFileSync(__dirname + "/" + fileName + ".html", 'utf-8');
    var storeName = fileName.replace("/", "_");
    console.log("Loading Template '" + fileName + "' and storing to '" + storeName + "'");

    module.exports[fileName.replace("/", "_")] = handlebars.compile(file);
}

/* TODO probably automate the template loading */
compileTemplate('topBar');
compileTemplate('characterCreation/attribute');
compileTemplate('characterCreation/speciesItem');
compileTemplate('characterCreation/speciesInfo');
compileTemplate('characterCreation/sexItem');
compileTemplate('characterCreation/sexInfo');
