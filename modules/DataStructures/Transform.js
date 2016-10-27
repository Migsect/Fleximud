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
      enumerable: true,
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
      enumerable: true,
      value: objectArray.map(function(baseObject)
      {
        return module.exports.createTransform(baseObject);
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
      for (var i = 0; i < this.transforms.length; i++)
      {
        /* Performing the transform */
        transformedValue = this.transforms[i].transform(transformedValue, source);

        /* This is an object return which will have special options */
        if (!Util.isNull(transformedValue.value))
        {
          /* Final values are instantly returned */
          if (!Util.isNull(transformedValue.final) && transformedValue.final)
          {
            return transformedValue.value;
          }
          transformedValue = transformedValue.value;
        }
      }

      /* Returning the result of the iteration */
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

Object.defineProperties(module.exports,
{
  createTransform:
  {
    /**
     * Creates a transform based on an object.
     * This can construct a transform from:
     * - Configuration
     * - Function
     * - Array of Objects (Composite)
     * - String (Not yet Implemented)
     * 
     * @param  {Object} baseObject The base object to parse for a transform.
     * @return {Transform}         The resulting transform.
     */
    value: function(baseObject)
    {
      /* If null or undefined then bad and error */
      if (Util.isNull(baseObject))
      {
        throw new Error("Attempted to create a transform when the baseObject is null or undefined");
      }
      /* Composite of objects */
      else if (Array.isArray(baseObject))
      {
        return new CompositeTransform(baseObject);
      }
      /* Will be based off of a lambda function */
      else if (typeof baseObject == "function")
      {
        return new DirectTransform(baseObject);
      }
      /* Will be an expression */
      else if (typeof baseObject == "string")
      {
        /* TODO make use of a MATH parser */
        throw new Error("Attempted to create a transform with a string, this type of transform is not yet supported");
      }
      /* Creating a transform from a transform does not change it */
      else if (baseObject instanceof Transform)
      {
        return baseObject;
      }
      /* Configuration transforms are an object */
      else if (typeof baseObject == "object")
      {
        return new ConfiguredTransform(baseObject);
      }
      /* If we couldn't infer it then we error */
      else
      {
        throw new Error("Attempeted to create a transform with an unrecognized object.");
      }
    }
  },
  parseDirectedTransforms:
  {
    /**
     * Generates a map of transforms that are directed to certain keywords.
     * Directed transforms contain a normal transform definition as well as a target keyword.
     * This is useful for Stat situations.
     * 
     * @param  {Object[]} directedTransforms The object to parse for transforms.
     * @return {Map<String, Transform[]>}    Map of the directed transforms.
     */
    value: function(directedTransforms)

    {
      /* Getting the export object */
      var self = this;

      /* Checking to see if it is an array and is not null */
      if (Util.isNull(directedTransforms) || !Array.isArray(directedTransforms))
      {
        throw new Error("Invalid DirectedTransforms configuration.");
      }

      /* Map of the resulting transforms */
      var map = new Map();

      directedTransforms.forEach(function(directedTransform)
      {
        /* Checking to see if the individual direcred transforms are valid */
        if (Util.isNull(directedTransform.transform, directedTransform.target) || !Util.isString(directedTransform.target))
        {
          throw new Error("Invalid DirectedTransform configuration:" + JSON.stringify(directedTransform));
        }

        /* Getting the members */
        var target = directedTransform.target;
        var transform = self.createTransform(directedTransform.transform);

        /* Creating an array in the map if it is not yet defined */
        if (!map.has(target))
        {
          map.set(target, []);
        }
        /* pushing the transform onto the new array inside the map */
        map.get(target).push(transform);
      });

      /* Returning the map of keys to transform lists */
      return map;
    }
  }
});
