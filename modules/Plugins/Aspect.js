"use strict";

/**
 * An Aspect represents a facet of a character in where many qualities can be grouped together.
 * For example a character's species is an aspect of that character.  However aspects deal less with the what and
 * more with the how of how a character is described.  As such the Aspect will be the abstract concept of speices and
 * that aspect will handle the data on the character that is the species.
 *
 * Do note that this class should always be inherited and should never be instantiated by its plain old self.
 */
class Aspect {

    /**
     * Constructs the Aspect
     * This includes the plugin that is providing the aspect as well as a means to reference the data the
     * aspect will be handling.  The data object will be the character's universal data field and the dataKey is
     * the subfield that the aspect will be handling.
     *
     * As a basis, the Aspect will ensure that the sub-field exists so that this does not need to be handled
     * on the plguin's end.
     * 
     * @param  {Plugin} plugin  The plugin providing the aspect.
     * @param  {Object} data    The character's univesal data.
     * @param  {String} dataKey The key to the sub-data that will be handled by the Aspect.
     * @return {Aspect}         The aspect that will be created.
     */
    constructor(plugin, data, dataKey) {
        if (!data[dataKey]) {
            data[dataKey] = {};
        }
        this.data = data[dataKey];
        Object.defineProperty(this, "plugin", { value: plugin, enumerable: false });
    }

    /**
     * Returns a list-info config for when a chataracter needs to be listed in some manner.
     * This is generally used for a character list.
     *
     * This returns both the display for the aspect as well as the priority the display will be placed in the character.
     * A higher priority will result in a the display being placed higher (sorted absed on priority)
     * Returning null (or any falsy) makes it so no info is displayed for the character.
     * 
     * @return {Object{priority, display}} The an object the determines how the info is displayed.
     */
    getListInfoConfig() {
        return null;
    }
}

module.exports = Aspect;