"use strict";

const DOMUtils = require("./DOMUtils");

/**
 * Class for template utilities.
 * 
 * Note that if you are going to use this, you need to have DOMUtils in the same
 * directory as this Utils file.  Additionally, handlebars needs to be setup with
 * webpack such that when one require's a template, it returns a template function.
 *
 * @class      TemplateUtils (name)
 */
class TemplateUtils {

    /**
     * Returns a function that when passed arguments will pass them to a
     * template function.  This works almost identical to a normal handlbars
     * require, excepting that output is an HTML Element and not just a String.
     *
     * @param      {String}  path    The path to the template file
     * @return     {DOMElement} 	 A dom element resulting from the template.
     */
    static elementize(template) {
        return function() {
            const args = Array.prototype.slice.call(arguments);
            return DOMUtils.htmlToElement(template.apply(null, args));
        };
    }
}

module.exports = TemplateUtils;