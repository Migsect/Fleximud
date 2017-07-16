"use strict";

const Aspect = require(process.cwd() + "/modules/Plugins/Aspect");

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

    /**
     * Shortcut for getting the forname from the data. Will provide a placeholder if not found.
     * 
     * @return {String} The forename
     */
    get forename() {
        return this.data.forename || "UNKNOWN";
    }

    /**
     * Shortcut for getting the midname from the data. Will provide a placeholder if not found.
     * 
     * @return {String} The midname
     */
    get midname() {
        return this.data.midname || "UNKNOWN";
    }

    /**
     * Shortcut for getting the surname from the data. Will provide a placeholder if not found.
     * 
     * @return {String} The surname
     */
    get surname() {
        return this.data.surname || "UNKNOWN";
    }

    /**
     * Shortcut for getting the alias from the data. Will provide a placeholder if not found.
     * 
     * @return {String} The alias
     */
    get alias() {
        return this.data.alias || "UNKNOWN";
    }

    getListInfoConfig() {
        return {
            priority: 100,
            display: this.forename + " " + this.surname
        };
    }

}

module.exports = IdentitiesAspect;