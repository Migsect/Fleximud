"use strict";

var Util = require(process.cwd() + "/modules/Util");
var Command = require("../Command");

var ChangeName = function()
{
  Command.call(this, "changename");
  var self = this;
  Object.defineProperties(self,
  {});
};

Util.inherit(Command, ChangeName);
Object.defineProperties(ChangeName.prototype,
{
  execute:
  {
    value: function(client, data) {}
  },
  executeWithArray:
  {
    value: function(client, args)
    {
      if (args.length !== 1)
      {
        return -2;
      }
    }
  }
});
