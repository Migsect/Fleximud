"use strict";

var Mongoose = require("mongoose");
var Schema = Mongoose.Schema;

/* Represents a collection of static values that can be transformed by other models */
var StatSchema = Schema(
{
  /* Stats will be values in key-value pairs */
  values:
  {
    type: Schema.Types.Mixed,
    "default":
    {}
  }
});

/**
 * Sets the static value of the stat.  This will override the current value.
 * You can use getStatStatic to get the current value stored, using just getStat
 * may result in the value spinning out of control.
 * 
 * @param {String} key  The key of the stat to retrieve
 * @param {Value}       value the value retrieved
 */
StatSchema.methods.setStat = function(key, value)
{
  this.values[key] = value;
};

/**
 * Returns the value of a stat before it would be transformed.
 * 
 * @param  {String} key The key of the stat
 * @return {Value}      The value of the stat
 */
StatSchema.methods.getStatStatic = function(key)
{
  return this.values[key];
};

/**
 * Retrieves the stat, transforming it based on the character that was passed in.
 * This will retrieve transforms from specific objects that implement the getTransforms()
 * function.
 * 
 * @param  {Character} character The character for which the transforms will base 
 *                            their transformations on.
 * @param  {String} key       The key of the stat to retrive.
 * @return {Value}            The resulting value of the stat
 */
StatSchema.methods.getStat = function(character, key)
{
  var transformedStat = this.getStatStatic(key); /* The starting place is the stored data */
  var transforms = character.getTransforms(key);
  transforms.forEach(function(transform)
  {
    transformedStat = transform.transform(transformedStat);
  });
  return transformedStat;
};

/**
 * Retrieves all the static stat keys. These are the stats that have been defined.
 * 
 * @return {String[]} The static stat keys.
 */
StatSchema.methods.getStaticKeys = function()
{
  return Object.keys(this.values);
};

/**
 * Retrieves all the possible stat keys for the specified character.  Even though this has to
 * have a character to begin with, in the future this may be better done.
 * 
 * @param  {Character} character The character
 * @return {String[]}            The list of stats
 */
StatSchema.methods.getKeys = function(character)
{
  console.log(this);
  return this.getStaticKeys().concat(character.getStatTransformsKeys());
};

Object.defineProperties(module.exports,
{
  schema:
  {
    value: StatSchema
  },
  createLiteral:
  {
    value: function()
    {
      return {
        values:
        {}
      };
    }
  }
});
