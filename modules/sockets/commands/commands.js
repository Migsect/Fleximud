"use strict";

var fs = require("fs");

var commands = new Map();

fs.readdirSync(__dirname).forEach(function(file)
{
  if (file == "commands.js")
  {
    return;
  }
  var command = require(__dirname + "/" + file);
  if (typeof command.name == "undefined")
  {
    console.log("command name not found", file);
    return;
  }
  commands.set(command.name, command);
});

module.exports = commands;
