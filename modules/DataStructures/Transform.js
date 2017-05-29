"use strict";

const Util = require(process.cwd() + "/modules/Util");

/**
 * A transform is a wrapper object around a function.
 * This is a base class for the implementing classes.
 */
class Transform
{
    constructor(type)
    {
        const self = this;
        self.type = type;
    }

    /**
     * Performs a transformation on the value.
     * This needs to be implemented by each different transform.
     *
     * @param  {Value}  value The value to transform.
     * @param  {Object} source A datasource for the transform.
     * @return {Object}       The result of the transformation.
     */
    transform(value, source)
    {
        /* NOTE This is the default for the transform */
        return value;
    }
}

/**
 * A transform that is a group of transformations.
 * (that being it will pass the result of the first onto the next)
 */
class CompositeTransform extends Transform
{
    constructor(objects)
    {
        super("composite");
        if (!Array.isArray(objects))
        {
            throw new Error("Attempted to create a CompositeTransform with a non-array object.");
        }

        const self = this;
        self._transforms = objects.map(function(object)
        {
            return module.exports.createTransform(object);
        });
    }

    transform(value, source)
    {
        var transformedValue = value;
        for (let i = 0; i < this.transforms.length; i++)
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

/**
 * A transform that is based directly off a function.
 */
class LambdaTransform extends Transform
{
    constructor(lambda)
    {
        super("direct");
        if (typeof lambda != "function")
        {
            throw new Error("Attempted to create a DirectTransform with a non-function object");
        }

        const self = this;
        self._lambda = lambda;
    }

    trasnsform(value, source)
    {
        const self = this;
        return self._lambda(value, source);
    }
}

/**
 * A configured transformation is defined by a JSON object file.
 * Through the configuration it can support multiple different types of simple transforms.
 */
class ConfiguredTransform extends Transform
{
    constructor(config)
    {
        super("configured");
        if (typeof config != "object")
        {
            throw new Error("Attempted to create a ConfiguredTransform without a configurationObject");
        }

        const self = this;
        self._add = config.add || 0;
        self._multiply = config.multiply || 1;
        self._divide = config.divide || 1;
        self._exponent = config.exponent || 1;
    }

    transform(value, source)
    {
        const self = this;
        return ((Math.exp(value, self._exponent) * self._multiply) / self._divide) + self._add;
    }
}

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
        value: function(object)
        {
            /* If null or undefined then bad and error */
            if (Util.isNull(object))
            {
                throw new Error("Attempted to create a transform when the baseObject is null or undefined");
            }
            /* Composite of objects */
            else if (Array.isArray(object))
            {
                return new CompositeTransform(object);
            }
            /* Will be based off of a lambda function */
            else if (typeof object == "function")
            {
                return new LambdaTransform(object);
            }
            /* Will be an expression */
            else if (typeof object == "string")
            {
                /* TODO make use of a MATH parser */
                throw new Error("Attempted to create a transform with a string, this type of transform is not yet supported");
            }
            /* Creating a transform from a transform does not change it */
            else if (object instanceof Transform)
            {
                return object;
            }
            /* Configuration transforms are an object */
            else if (typeof object == "object")
            {
                return new ConfiguredTransform(object);
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
