"use strict";

const Aspect = require(process.cwd() + "/modules/Plugins/Aspect");

class ClassificationsAspect extends Aspect {
    /**
     * Applies the form retrieved from character creation and applies it to character data.
     * 
     * @param {Object} form The form to apply the form.
     * @param {Object} data The data to apply the form to.
     */
    static applyForm(form, data) {
        data.classifications = {};

        const core = {};
        core.species = form.species;
        core.race = form.race;
        core.sex = form.sex;
        data.classifications.core = core;
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
        super(plugin, data, "classifications");
    }

    /**
     * Provides a getter to get the original species of the character.
     * If it the core object is not defined, it returns an error value.
     * If it is not defined, then unknown is returned.
     * 
     * @return {String} The returned data
     */
    get originalSpecies() {
        return this.data.core ? (this.data.core.species || "UNKNOWN") : "ERROR";
    }

    /**
     * Provides a getter to get the original race of the character.
     * If it the core object is not defined, it returns an error value.
     * If it is not defined, then unknown is returned.
     * 
     * @return {String} The returned data
     */
    get originalRace() {
        return this.data.core ? (this.data.core.race || "UNKNOWN") : "ERROR";
    }

    /**
     * Provides a getter to get the original sex of the character.
     * If it the core object is not defined, it returns an error value.
     * If it is not defined, then unknown is returned.
     * 
     * @return {String} The returned data
     */
    get originalSex() {
        return this.data.core ? (this.data.core.sex || "UNKNOWN") : "ERROR";
    }

    getListInfoConfig() {
        return {
            priority: 1,
            display: this.originalSpecies + " - " + this.originalSex
        };
    }
}

module.exports = ClassificationsAspect;