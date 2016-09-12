"use strict";

/**
 * Used to load and have a single reference to all templates.
 */

var fs = require('fs');
var handlebars = require('handlebars');

/** @type {Map} Mapping of file locations to compiled templates of those files */
var compiled = new Map();
/**
 * Compiles a template File.
 * Caches all compiled files.
 * 
 * @param  {String} path The path of the template file.
 * @return {Object}      A Compiled template.
 */
var compileTemplate = function(path)
{
  if (compiled.has(path))
  {
    return compiled.get(path);
  }
  var file = fs.readFileSync(__dirname + "/" + path + ".html", 'utf-8');
  console.log("Compiling Template '" + __dirname + "/" + path + "'");

  var fileCompiled = handlebars.compile(file);
  compiled.set(path, fileCompiled);

  return fileCompiled;
};

/** @type {Map} Mapping of file locations to precompiled templates of those files */
var precompiled = new Map();
/**
 * Precompiles a template file.
 * Caches all precompiled files.
 * 
 * @param  {String} path The path of the template file.
 * @return {Object}      The precompiled template.
 */
var precompileTemplate = function(path)
{
  if (precompiled.has(path))
  {
    return precompiled.get(path);
  }
  var file = fs.readFileSync(__dirname + "/" + path + ".html", 'utf-8');
  console.log("Precompiling Template '" + __dirname + "/" + path + "'");

  var fileCompiled = handlebars.precompile(file);
  compiled.set(path, fileCompiled);

  return fileCompiled;
};

module.exports = compileTemplate;
Object.defineProperties(module.exports,
{
  precompile: precompileTemplate,
  compile: compileTemplate
});
