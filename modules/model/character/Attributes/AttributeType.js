"use strict";

const Util = require(process.cwd() + "/modules/Util");
const Logger = require(process.cwd() + "/modules/Logger");

class AttributeType
{
    constructor(config)
    {
        const self = this;
        Object.defineProperties(self,
        {
            name:
            {
                value: config.name || config.id
            },
            id:
            {
                value: config.id
            },
            tag:
            {
                value: config
            },
            children:
            {
                value: config
            },
            color:
            {
                value: config
            },
            description:
            {
                value: config
            }
        });
    }
}
