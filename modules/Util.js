module.exports =
{
    isNull : function(value)
    {
        return (value == null) || (typeof value === undefined);
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
    }
}