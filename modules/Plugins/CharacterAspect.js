"use strict";

class CharacterAspect {
    constructor(plugin, data, dataKey) {
        if (!data[dataKey]) {
            data[dataKey] = {};
        }
        this.data = data[dataKey];
    }
}

module.exports = CharacterAspect;
