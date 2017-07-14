"use strict";

const Aspect = require(process.cwd() + "/modules/Plugins/CharacterAspect");

class IdentitiesAspect extends Aspect {

    /**
     * Applies the form retrieved from character creation and applies it to character data.
     * 
     * @param {Object} form The form to apply the form.
     * @param {Object} data The data to apply the form to.
     */
    static applyForm(form, data) {
        data.identities = form;
    }

    /**
     * Validates the provided form from character creation.
     *
     * @param {Object} form The form to validate.
     */
    static validateForm( /*form*/ ) {
        return true;
    }

    constructor(plugin, data) {
        super(plugin, data, "identities");
    }

}

module.exports = IdentitiesAspect;
