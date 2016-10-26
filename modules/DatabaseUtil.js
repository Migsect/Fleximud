"use strict";

var Util = require(process.cwd() + "/modules/Util");

Object.defineProperties(module.exports,
{
  migrate:
  {
    value: function(actual, expected)
    {
      /* If the expected is null, we don't need to compare */
      if (Util.isNull(expected)) return actual;
      /* If it is null, then we're going to return the expected */
      if (Util.isNull(actual)) return expected;

      /* looping through all the expected keys*/
      Object.keys(expected).forEach(function(key)
      {
        /* Recursing over everything */
        Object.defineProperty(actual, key,
        {
          value: module.exports.migrate(actual[key], expected[key])
        });
      });

      /* actual did not change */
      return actual;
    }
  }

  //   defineTransient:
  //   {
  //     /**
  //      * Defines a transient member on a schema that will not be persisted
  //      * to the database.
  //      * 
  //      * @param  {Schema} schema   The schema to add the transient member to.
  //      * @param  {String} variable The variable name for transient member.
  //      */
  //     value: function(schema, variable)
  //     {
  //       var internalVariable = "_" + variable;
  //       schema.virtual(variable).get(function()
  //       {
  //         return this[internalVariable];
  //       });
  //       schema.virtual(variable).set(function(value)
  //       {
  //         this[internalVariable] = value;
  //         return this[internalVariable];
  //       });
  //       schema.set("toObject",
  //       {
  //         getters: true
  //       });
  //     }
  //   }

});
