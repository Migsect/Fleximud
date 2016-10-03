"use strict";

/**
 * Error thrown when an object is not the specified type
 */
var TypeCheckError = function(type, value)
{
  Error.call(this, value + " was not found to be of type " + type);
  this.value = value;
  this.type = type;
};
var NullError = function(argument)
{
  Error.call(this, "Argument " + i + " was found null.");
  this.argument = argument;
};

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
  /**
   * Checks to see if the value is Null
   * 
   * @param  {Object}  value The value to check
   * @return {Boolean}       True if the value is null
   */
  isNull:
  {
    value: function(value)
    {
      return (value === null) || (value === undefined);
    }
  },
  assertNotNull:
  {
    value: function()
    {
      for (var i = 0; i < arguments.length; i++)
      {
        var argument = arguments[i];
        if (this.isNull(argument))
        {
          throw new NullError(i);
        }
      }
    }
  },
  isString:
  {
    value: function(value)
    {
      return (typeof value === 'string' || value instanceof String);
    }
  },
  assertString:
  {
    value: function(value)
    {
      if (!this.isString(value))
      {
        throw new TypeCheckError('string', value);
      }
    }
  },
  isNumber:
  {
    value: function(value)
    {
      return (typeof value === 'number' || value instanceof Number);
    }
  },
  assertNumber:
  {
    value: function(value)
    {
      if (!this.isNumber(value))
      {
        throw new TypeCheckError('number', value);
      }
    }
  }
});
