"use strict";

var fs = require("fs");
var logger = require(process.cwd() + "/modules/Logger");

var commands = new Map();
module.exports = commands;

fs.readdirSync(__dirname).forEach(function(file)
{
  if (file == "commands.js")
  {
    return;
  }
  var commandConstructor = require(__dirname + "/" + file);
  if (typeof commandConstructor != "function")
  {
    logger.log("Failed to register command:", file);
  }
  var command;
  try
  {
    command = new commandConstructor();
  }
  catch (error)
  {
    logger.error(error);
    return;
  }
  if (typeof command.name == "undefined")
  {
    logger.log("Failed to register command:", file);
    return;
  }
  logger.log("Registered command file:", file);
  commands.set(command.name, command);
});
