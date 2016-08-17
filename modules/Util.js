"use strict";

var Fuzzy = function(center, range)
{
  this.center = center;
  this.range = range;
};

/* A fuzzy value, can return a random number near the center */
Fuzzy.prototype = {
  stable: function()
  {
    return this.center;
  },
  fuzzy: function()
  {
    return this.center * (2 * Math.random() * this.range - this.range + 1);
  },
  add: function(other)
  {
    return new Fuzzy(this.center + other.center, this.range + other.range);
  },
  subtract: function(other)
  {
    return this.add(other.negate());
  },
  negate: function()
  {
    return new Fuzzy(-this.center, this.range);
  },
  reverse: function()
  {
    return new Fuzzy(this.center, 1 - this.range);
  },
  mulitply: function(other)
  {
    var max = this.center * (1 + this.range) * other.center * (1 + other.range);
    var min = this.center * (1 - this.range) * other.center * (1 - other.range);
    var mid = (max + min) / 2;
    var ran = mid - min;
    return new Fuzzy(mid, ran);
  },
  scale: function(scalar)
  {
    return new Fuzzy(this.center * scalar, this.range);
  }
};

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
}

module.exports = {
  isNull: function(value)
  {
    return (value === null) || (value === undefined);
  },
  assertNotNull: function()
  {
    for (var i = 0; i < arguments.length; i++)
    {
      var argument = arguments[i];
      if (this.isNull(argument))
      {
        throw new NullError(i);
      }
    }
  },
  isString: function(value)
  {
    return (typeof value === 'string' || value instanceof String);
  },
  assertString: function(value)
  {
    if (!this.isString(value))
    {
      throw new TypeCheckError('string', value);
    }
  },
  isNumber: function(value)
  {
    return (typeof value === 'number' || value instanceof Number)
  },
  assertNumber: function(value)
  {
    if (!this.isNumber(value))
    {
      throw new TypeCheckError('number', value);
    }
  },
  Fuzzy: Fuzzy
}
