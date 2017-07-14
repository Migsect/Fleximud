"use strict";

const Plugin = require(process.cwd() + "/modules/Plugins/Plugin");
const Aspect = require("./modules/IdentitiesAspect");

class IdentitiesPlugin extends Plugin {
    onLoad() {

    }

    getCreationForm() {
        const formTemplate = this.getCreationTemplate();
        return formTemplate({
            max: 20
        });
    }

    getCharacterListInfo(character) {
        const data = character.data.identities;
        return {
            priority: 0,
            info: data.forename + " " + data.surname
        };
    }

    get aspectConstructor() {
        return Aspect;
    }
}

module.exports = IdentitiesPlugin;
