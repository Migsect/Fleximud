"use strict";

var Util = require(process.cwd() + "/modules/Util");

/**
 * A transform is a wrapper object around a function.
 * This is a base class for the implementing classes.
 * 
 * @constructor
 * @param {[type]} baseObject [description]
 */
var Transform = function(type)
{
  var self = this;
  Object.defineProperties(self,
  {
    type:
    {
      value: type
    }
  });
};

Object.defineProperties(Transform.prototype,
{
  transform:
  {
    /**
     * Performs a transformation on the value.
     * This needs to be implemented by each different transform.
     *
     * @param  {Object} source A datasource for the transform.
     * @param  {Value}  value The value to transform.
     * @return {Object}       The result of the transformation.
     */
    value: function(value, source)
    {
      return value;
    },
    writable: true
  }
});

/**
 * A group of transforms to be executed on a value.
 *
 * @constructor
 * @param {Object[]} objectArray An array of the bjects to be parsed.
 */
var CompositeTransform = function(objectArray)
{
  if (!Array.isArray(objectArray))
  {
    throw new Error("Attempted to create a CompositeTransform with a non-array object.");
  }

  var self = this;
  Transform.call(self, "composite");
  Object.defineProperties(self,
  {
    transforms:
    {
      value: objectArray.map(function(baseObject)
      {
        module.exports.createTransform(baseObject);
      })
    }
  });
};
Util.inherit(Transform, CompositeTransform);
Object.defineProperties(CompositeTransform.prototype,
{
  transform:
  {
    value: function(value, source)
    {
      var transformedValue = value;
      this.transforms.forEach(function(transform)
      {
        transformedValue = transform(transformedValue);
      });
      return transformedValue;
    }
  }
});

/**
 * A transform that is based directly off a function.
 * 
 * @param {function} functionObject A function object.
 */
var DirectTransform = function(functionObject)
{
  if (typeof functionObject != "function")
  {
    throw new Error("Attempted to create a DirectTransform with a non-function object");
  }

  var self = this;
  Transform.call(self, "direct");
  Object.defineProperties(self,
  {
    directFunction:
    {
      value: functionObject
    }
  });
};
Util.inherit(Transform, DirectTransform);
Object.defineProperties(DirectTransform.prototype,
{
  transform:
  {
    value: function(value, source)
    {
      return this.directFunction(value, source);
      /* Possibility: Add a check to make sure there isn't an outrageous transform */
    }
  }
});

/**
 * A configured transformation is defined by a JSON object file.
 * Through the configuration it can support multiple different types of simple transforms.
 * 
 * @param {Object} configurationObject The configuration object to use.
 */
var ConfiguredTransform = function(configurationObject)
{
  if (typeof configurationObject != "object")
  {
    throw new Error("Attempted to create a ConfiguredTransform without a configurationObject");
  }

  var self = this;
  Transform.call(self, "configured");
  Object.defineProperties(self,
  {
    add:
    {
      value: Util.isNull(configurationObject.add) ? 0 : configurationObject.add
    },
    multiply:
    {
      value: Util.isNull(configurationObject.multiply) ? 1 : configurationObject.multiply
    },
    divide:
    {
      value: Util.isNull(configurationObject.divide) ? 1 : configurationObject.divide
    },
    exponent:
    {
      value: Util.isNull(configurationObject.exponent) ? 1 : configurationObject.exponent
    }
  });
};

Util.inherit(Transform, ConfiguredTransform);
Object.defineProperties(ConfiguredTransform.prototype,
{
  transform:
  {
    value: function(value, source)
    {
      return ((Math.exp(value, this.exponent) * this.add) / this.divide) + this.add;
    }
  }
});

module.exports = {
  createTransform: function(baseObject)
  {
    if (Util.isNull(baseObject))
    {
      throw new Error("Attempted to create a transform when the baseObject is null or undefined");
    }
    else if (Array.isArray(baseObject))
    {
      return new CompositeTransform(baseObject);
    }
    else if (typeof baseObject == "function")
    {
      return new DirectTransform(baseObject);
    }
    else if (typeof baseObject == "string")
    {
      /* TODO make use of a MATH parser */
      throw new Error("Attempted to create a transform with a string, this type of transform is not yet supported");
    }
    else if (typeof baseObject == "object")
    {
      return new ConfiguredTransform(baseObject);
    }
    else
    {
      throw new Error("Attempeted to create a transform with an unrecognized object.");
    }
  }
};
