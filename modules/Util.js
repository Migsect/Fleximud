var Fuzzy = function(center, range)
{
    this.center = center;
    this.range = range;
};

Fuzzy.prototype =
{
    stable : function()
    {
        return this.center;
    },
    fuzzy : function()
    {
        return this.center * (2 * Math.random() * this.range - this.range + 1);
    },
    add : function(other)
    {
        return new Fuzzy(this.center + other.center, this.range + other.range);
    },
    subtract : function(other)
    {
        return this.add(other.negate());
    },
    negate : function()
    {
        return new Fuzzy(-this.center, this.range);
    },
    reverse : function()
    {
        return new Fuzzy(this.center, 1 - this.range);
    },
    mulitply : function(other)
    {
        var max = this.center * (1 + this.range) * other.center * (1 + other.range);
        var min = this.center * (1 - this.range) * other.center * (1 - other.range);
        var mid = (max + min) / 2;
        var ran = mid - min;
        return new Fuzzy(mid, ran);
    },
    scale : function(scalar)
    {
        return new Fuzzy(this.center * scalar, this.range);
    }
};

module.exports =
{
    isNull : function(value)
    {
        return (value == null) || (value === undefined);
    },
    assertNotNull : function()
    {
        for (var i = 0; i < arguments.length; i++)
        {
            var argument = arguments[i];
            if (this.isNull(argument))
            {
                throw new Error("Argument " + i + " was found null.");
            }
        }
    },
    Fuzzy : Fuzzy
}