"use strict";

var fs = require("fs");

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
    console.log("Failed to register command:", file);
  }
  var command = new commandConstructor();
  if (typeof command.name == "undefined")
  {
    console.log("Failed to register command:", file);
    return;
  }
  console.log("Registered command file:", file);
  commands.set(command.name, command);
});
