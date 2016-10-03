"use strict";

var Fuzzy = function(center, range)
{
  this.center = center;
  this.range = range;
};

/* A fuzzy value, can return a random number near the center */
Object.defineProperties(Fuzzy.prototype,
{
  stable:
  {
    value: function()
    {
      return this.center;
    }
  },
  fuzzy:
  {
    value: function()
    {
      return this.center * (2 * Math.random() * this.range - this.range + 1);
    }
  },
  add:
  {
    value: function(other)
    {
      return new Fuzzy(this.center + other.center, this.range + other.range);
    }
  },
  subtract:
  {
    value: function(other)
    {
      return this.add(other.negate());
    }
  },
  negate:
  {
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
    value: function(scalar)
    {
      return new Fuzzy(this.center * scalar, this.range);
    }
  }
});

module.exports = Fuzzy;
