"use strict";

/**
 * Used to load and have a single reference to all templates.
 */

var fs = require('fs');
var handlebars = require('handlebars');

var templates = new Map();
var requireTemplate = function(path)
{
  if (templates.has(path))
  {
    return templates.get(path);
  }
  var file = fs.readFileSync(__dirname + "/" + path + ".html", 'utf-8');
  console.log("Loading Template '" + __dirname + "/" + path + "'");

  var fileCompiled = handlebars.compile(file);
  templates.set(path, fileCompiled);

  return fileCompiled;
};

// function compileTemplate(fileName)
// {
//   var file = fs.readFileSync(__dirname + "/" + fileName + ".html", 'utf-8');
//   var storeName = fileName.replace(/\//g, "_");
//   console.log("Loading Template '" + fileName + "' and storing to '" + storeName + "'");

//   module.exports[storeName] = handlebars.compile(file);
// }

/* TODO probably automate the template loading */
// compileTemplate('topBar');
// compileTemplate('characterCreation/attribute');
// compileTemplate('characterCreation/speciesItem');
// compileTemplate('characterCreation/speciesInfo');
// compileTemplate('characterCreation/speciesDescriptors');
// compileTemplate('characterCreation/sexItem');
// compileTemplate('characterCreation/sexInfo');
// compileTemplate('characterCreation/descriptors/range');
// compileTemplate('characterCreation/descriptors/variation');

module.exports = requireTemplate;
