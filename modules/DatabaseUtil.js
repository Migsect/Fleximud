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
  //   },
  //   defineObserverPattern:
  //   {
  //     /**
  //      * Defines an observer pattern on a variable for the schema.
  //      * This will include a method to add listeners, remove listeners, and tigger
  //      * all the listeners.  This allows for id-based listeners as well, but will
  //      * always make them optional.
  //      * 
  //      * @param  {Schema} schema   The schema to define the listeners on.
  //      * @param  {String} name     A name to identify the listener by. This will
  //      *                           determine the name of the methods and storage
  //      *                           variables for the observer pattern.
  //      *                           
  //      */
  //     value: function(schema, name)
  //     {
  //       var storageVariable = name + "Listeners";

  //       /* Defining the transient variable */
  //       dbUtils.defineTransient(schema, storageVariable);

  //       var nameCapitalized = name.charAt(0).toUpperCase() + name.slice(1);
  //       /* Method for adding new listeners */
  //       schema.method["add" + nameCapitalized + "Listener"] = function(listener, id)
  //       {
  //         /* Creating the storage object if it is not defined yet */
  //         if (!this[storageVariable])
  //         {
  //           this[storageVariable] = {
  //             unidentified: [],
  //             identified: new Map()
  //           };
  //         }
  //         /* If we have an id specified then we want to add it to the identifed map */
  //         if (id)
  //         {
  //           this[storageVariable].identified.set(id, listener);
  //         }
  //         /* Otherwise we want to merely push it to the list */
  //         else
  //         {
  //           this[storageVariable].unidentified.push(listener);
  //         }
  //       };
  //       /* Method for removing a listener with the specified id */
  //       schema.method["remove" + nameCapitalized + "Listener"] = function(id)
  //       {
  //         if (!this[storageVariable])
  //         {
  //           return;
  //         }
  //         /* Deleting the listener for the id */
  //         this[storageVariable].identifed.delete(id);
  //       };
  //       /* Method for triggering all the listeners */
  //       schema.method["trigger" + nameCapitalized + "Listeners"] = function()
  //       {
  //         /* Stroing the caller Arguments */
  //         var callerArguments = arguments;
  //         if (!this[storageVariable])
  //         {
  //           return;
  //         }
  //         /* Calling all the unidentified listeners */
  //         this[storageVariable].unidentified.forEach(function(listener)
  //         {
  //           listener.apply(this, callerArguments);
  //         });
  //         /* Calling all the identified listeners */
  //         this[storageVariable].identified.values().forEach(function(listener)
  //         {
  //           listener.apply(this, callerArguments);
  //         });
  //       };
  //     }
  //   }
});
