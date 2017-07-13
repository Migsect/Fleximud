"use strict";

var Util = require('../../Util');

var DisplayName = function(json)
{
    if (!json)
    {
        this.singular = 'NO NAME';
        this.plural = 'NO NAME';
    }
    else if (Util.isString(json))
    {
        this.singular = json;
        this.plural = json + "s";
    }
    else
    {
        this.singular = json.singular;
        this.plural = json.plural;
    }
};

module.exports = DisplayName;
