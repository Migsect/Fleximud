"use strict";

var Connection = function(name, destination)
{
  var self = this;
  Object.defineProperties(self,
  {
    /** @type {String} The display name of the connection */
    name:
    {
      writable: true,
      value: name
    },
    /** @type {String} Represents the destination of the connection */
    destination:
    {
      value: destination

    },
    /** @type {Function[]} A list of predicate functions that take in a character */
    limitations:
    {
      value: []
    }
  });
};

Object.defineProperties(module.exports,
{
  constructor:
  {
    value: Connection
  }
});
