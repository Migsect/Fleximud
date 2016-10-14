"use strict";

var Util = require(process.cwd() + "/modules/Util");

/**
 * A limitation is a constructed boolean lambda that either wraps a function or
 * generates a function based on the passed in json.  The limitation will store
 * the passed in json for preservation.
 *
 * @constructor
 * @param  {JSON|Object} json The json that the limitation will be constructed from.
 */
var Limitation = function(json)
{
  var self = this;
  /* Member Variables */
  Object.defineProperties(self,
  {
    /**
     * The source of the Limitation, used when parsing into a storable format.
     * @type {JSON}
     */
    source:
    {
      value: json
    },
    /**
     * The lambda of the Limitation that is constructed from the source.
     * This will be called for checks on characters.
     * @type {Function}
     */
    lambda:
    {
      value: (function()
      {
        /* Checking if the json includes a lambda by default */
        if (!Util.isNull(json.lambda) && typeof json.lambda == "function")
        {
          return json.lambda;
        }
        /* Otherwise its a configuration based limitation */
        if (!Util.isNull(json.type))
        {
          var noValueAssociated = function()
          {
            console.log("WARNING - Limitation of type '" + json.type + "' has no value(s) associated.");
          };
          var noTargetAssociated = function()
          {
            console.log("WARNING - Limitation of type '" + json.type + "' has no target associated.");
          };
          if (Util.isNull(json.target))
          {
            noTargetAssociated();
          }
          switch (json.type)
          {
            case "atleast":
              /* Checking to make sure it has a value */
              if (Util.isNull(json.value))
              {
                noValueAssociated();
              }
              return function(character) {

              };
            case "atmost":
              /* Checking to make sure it has a value */
              if (Util.isNull(json.value))
              {
                noValueAssociated();
              }
              return function(character) {

              };
            case "range":
              /* Checking to make sure it has a value */
              if (Util.isNull(json.minValue) || Util.isNull(json.maxValue))
              {
                noValueAssociated();
              }
              return function(character) {

              };

          }
        }

        /* TODO generate the lambda function */
      })()
    }
  });
};

/* Member functions*/
Object.defineProperties(Limitation.prototype,
{
  check:
  {
    value: function(character)
    {
      return this.lambda(character);
    }
  }
});

/* Global functions */
Object.defineProperties(Limitation,
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
        return new Limitation(json);
      });
    }
  }
});

module.exports = Limitation;
