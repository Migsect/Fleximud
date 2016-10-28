"use strict";

var winston = require("winston");

var config = require(process.cwd() + "/config/general");

var Logger = new(winston.Logger)(
{
  transports: [
    new(winston.transports.Console)(
    {
      colorize: true,
      level: typeof config.logging.level == "undefined" ? "error" : config.logging.level,
      timestamp: function()
      {
        var date = new Date();
        return "[" + ("0" + date.getHours()).slice(-2) + ":" +
          ("0" + date.getMinutes()).slice(-2) + ":" +
          ("0" + date.getSeconds()).slice(-2) + "]";
      }
    })
  ]
});

module.exports = Logger;
