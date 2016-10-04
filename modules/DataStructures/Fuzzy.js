"use strict";

/**
 * A fuzzy value consists of a center value and a range which is a ratio of the
 * center.  For example with a center of 10 and a range of 1, the resulting values
 * of the fuzzy can be [0 20], with a center of 10 and a range of 2, the resulting
 * values can be [-10 30].
 * 
 * @constructor
 * @param {Number} center The center value.
 * @param {Number} range  The ratio of the center
 */
var Fuzzy = function(center, range)
{
  var self = this;
  Object.defineProperties(self,
  {
    center:
    {
      value: center
    },
    range:
    {
      value: range
    }
  });
};

/* A fuzzy value, can return a random number near the center */
Object.defineProperties(Fuzzy.prototype,
{
  stable:
  {
    /**
     * Returns the stable value of this fuzzy value. This is generally the
     * center of the fuzzy's distribution (or the expected value over an infinite
     * number of fuzzy calls.)
     * 
     * @return {Number} The expected value of this fuzzy.
     */
    value: function()
    {
      return this.center;
    }
  },
  fuzzy:
  {
    /**
     * Returns the randomly determined value of this fuzzy as determined by the
     * center and range of the fuzzy.
     * 
     * @return {Number} The resulting random value.
     */
    value: function()
    {
      /* let c = center
       *     r = range
       *     t = random variable with a range of [0, 1]
       *     F = the fuzzy value
       * F's range is [c - r * c, c + r * c]
       *
       * F = c * (1 + (2 * r * t - r)) 
       */
      return this.center * (2 * this.range * Math.random() - this.range + 1);
    }
  },
  add:
  {
    /**
     * Adds one fuzzy to another.
     * 
     * @param  {Fuzzy} other The other fuzzy value
     * @return {Fuzzy}       A new fuzzy that is the result of the addition.
     */
    value: function(other)
    {
      return new Fuzzy(this.center + other.center, this.range + other.range);
    }
  },
  subtract:
  {
    /**
     * Returns the subtraction of a fuzzy from another.
     * This actually just negates the other fuzzy and adds it.
     *
     * @see  Fuzzy.prototype.add
     * @see  Fuzzy.prototype.negate
     * 
     * @param  {Fuzzy} other The fuzzy value to subtract
     * @return {Fuzzy}       The resulting fuzzy.
     */
    value: function(other)
    {
      return this.add(other.negate());
    }
  },
  negate:
  {
    /**
     * Negatives the value, resulting in the center being negative but the range
     * remaining unchanged.  This returns a new fuzzy value.
     * 
     * @return {Fuzzy} A new negative fuzzy
     */
    value: function()
    {
      return new Fuzzy(-this.center, this.range);
    }
  },
  reverse:
  {
    value: function()
    {
      return new Fuzzy(this.center, 1 - this.range);
    }
  },
  mulitply:
  {
    /**
     * Multiplies this fuzzy against another fuzzy.
     * This calculates the max and min range of the new fuzzy and then takes
     * the average of this range, resulting in a new fuzzy.
     * 
     * @param  {Fuzzy} other The fuzzy to multiply by
     * @return {Fuzzy}       The new fuzzy value
     */
    value: function(other)
    {
      var max = this.center * (1 + this.range) * other.center * (1 + other.range);
      var min = this.center * (1 - this.range) * other.center * (1 - other.range);
      var mid = (max + min) / 2;
      var ran = mid - min;

      return new Fuzzy(mid, ran);
    }
  },
  scale:
  {
    /**
     * Scales the fuzzy by the scalar.  This does not change the range since the
     * range is a ratio of the center.
     * @param  {Number} scalar The number to scale by
     * @return {Fuzzy}         The resulting Fuzzy
     */
    value: function(scalar)
    {
      return new Fuzzy(this.center * scalar, this.range);
    }
  }
});

module.exports = Fuzzy;
