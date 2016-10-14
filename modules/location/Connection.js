"use strict";

var uuid = require("node-uuid");
var Util = require("../Util");
var Limitation = require("./Limitation");

var Connection = function(json)
{
  var self = this;
  Object.defineProperties(self,
  {
    /** @type {String} The display name of the connection */
    name:
    {
      writable: true,
      value: json.name
    },
    /** @type {String} Represents a unique ID that is used for client-server transfer */
    id:
    {
      value: uuid.v4()
    },
    /** @type {String} Represents the destination of the connection */
    destination:
    {
      value: json.destination
    },
    /** @type {Function[]} A list of predicate functions that take in a character */
    limitations:
    {
      value: Limitation.parseJSONList(json.limitations)

    }
  });
};

Object.defineProperties(Connection,
{
  parseJSONList:
  {
    value: function(jsonList)
    {
      if (Util.isNull(jsonList) || !Array.isArray(jsonList))
      {
        return [];
      }
      return jsonList.map(function(json)
      {
        return new Connection(json);
      });
    }
  }
});

module.exports = Connection;
