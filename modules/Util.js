"use strict";

var fs = require("fs");

/**
 * Error thrown when a value is not a specified type when it is expected to be.
 *
 * @constructor
 * @param {Constructor} type  The type that was expected.
 */
var TypeCheckError = function(argIndex, value)
{
  Error.call(this, "Argument " + argIndex + " with value " + value + " was not found to be of a correct type.");
  this.argIndex = argIndex;
  this.value = value;
};
TypeCheckError.prototype = Object.create(Error.prototype);
TypeCheckError.prototype.constructor = TypeCheckError;

/**
 * Error thrown when a value is null or undefined when it is not expected to be.
 * 
 * @param {Number} argument The argument number that was found null.
 */
var NullError = function(argIndex)
{
  Error.call(this, "Argument " + argIndex + " was found null.");
  this.argIndex = argIndex;
};
NullError.prototype = Object.create(Error.prototype);
NullError.prototype.constructor = NullError;

Object.defineProperties(module.exports,
{
  inherit:
  {
    /**
     * Has the child class inherit from the parent class.
     * This will base the child off the prototype of the parent.  
     * It will also set the define "super" on the constructor which will point
     * to the parent constructor of the class.
     * 
     * @param  {constructor} parent Parent class
     * @param  {constructor} child  Child class
     */
    value: function(parent, child)
    {
      child.prototype = Object.create(parent.prototype);
      Object.defineProperty(child, "super",
      {
        value: parent
      });
      Object.defineProperty(child.prototype, "constructor",
      {
        value: child
      });
    }
  },
  assert:
  {
    /**
     * Asserts a check for a number of values and throws an error if the check returns true.
     * 
     * @param  {Function}  check The check function that returns a boolean and takes an input.
     * @param  {Error}     error The error to throw if there is a failed check.
     * @param  {Object[]}  values The values to check
     * @throws {TypeCheckError} If any of the variables do not pass the check
     */
    value: function(check, error, values)
    {
      /* Checking if a check was supplied */
      if (typeof check != "function")
      {
        throw new Error("Check was not defined correctly for assert.");
      }
      /* Checking if the error is defined */
      if (typeof error != "function")
      {
        throw new Error("Error was not defined correctly for assert.");
      }
      if (this.isNull(values))
      {
        throw new Error("Values was not defined correctly for assert.");
      }

      /* For loop for the check */
      for (var i = 3; i < arguments.length; i++)
      {
        var argument = arguments[i];
        if (!check(argument))
        {
          throw new error(i, argument);
        }
      }
    }
  },
  isNull:
  {
    /**
     * Checks to see if the value is Null
     * 
     * @param  {Object}  value The value to check
     * @return {Boolean}       True if the value is null
     */
    value: function(value)
    {
      return (value === null) || (typeof value == "undefined");
    }
  },
  assertNotNull:
  {
    /**
     * Asserts that the values are not null.
     *
     * @param {...Object} values The values to check
     * @throws {TypeCheckError} If any supplied value is null.
     */
    value: function()
    {
      var self = this;
      this.assert(function(value)
      {
        return self.isNull(value);
      }, NullError, arguments);
    }
  },
  isString:
  {
    /**
     * Checks if the value is a string.
     * 
     * @param  {Object} value The value being checked.
     * @return {Boolean}      True if it is a string.
     */
    value: function(value)
    {
      return (typeof value === 'string' || value instanceof String);
    }
  },
  assertString:
  {
    /**
     * Asserts that the values are strings.
     *
     * @param {...Object} values The values to check
     * @throws {TypeCheckError} If any supplied value is not a string.
     */
    value: function()
    {
      var self = this;
      this.assert(function(value)
      {
        return !self.isString(value);
      }, TypeCheckError, arguments);
    }
  },
  isNumber:
  {
    /**
     * Checks if the value is a number.
     * 
     * @param  {Object} value The value being checked.
     * @return {Boolean}      True if it is a number.
     */
    value: function(value)
    {
      return (typeof value == "number" || value instanceof Number);
    }
  },
  assertNumber:
  {
    /**
     * Asserts that the values are numbers.
     *
     * @param {...Object} values The values to check
     * @throws {TypeCheckError} If any supplied value is not a number.
     */
    value: function()
    {
      var self = this;
      this.assert(function(value)
      {
        return !self.isNumber(value);
      }, TypeCheckError, arguments);
    }
  },
  isFunction:
  {
    /**
     * Checks to see if the value is a function.
     * 
     * @param  {Object} value The value being checked
     * @return {Boolean}      True if it is a function
     */
    value: function(value)
    {
      return typeof value == "function";
    }
  },
  assertFunction:
  {
    /**
     * Asserts that the values are functions.
     *
     * @param {...Object} values The values to check
     * @throws {TypeCheckError} If any supplied value is not a function.
     */
    value: function()
    {
      var self = this;
      this.assert(function(value)
      {
        return !self.isFunction(value);
      }, TypeCheckError, arguments);
    }
  },
  parseFileString:
  {
    /**
     * Checks to see if the string is a file in the root, if it is it will
     * read that file syncronously and then return its content as a string.
     * Otherwise it will simply return the input string.
     *
     * By default it will use root as a basis to search for the file in.
     * Otherwise it will just use prcoess.cwd() as the root.
     *
     * @param {String} str [description]
     * @param {String} root The file basis to use.
     * @return {String} The returned content.
     */
    value: function(str, root)
    {
      if (this.isNull(root))
      {
        root = process.cwd() + "/";
      }
      var path = root + str;
      try
      {
        var stats = fs.lstatSync(path);
        if (!stats.isFile())
        {
          return str;
        }
        return fs.readFileSync(path, "utf-8");
      }
      catch (e)
      {
        return str;
      }

    }
  }
});
