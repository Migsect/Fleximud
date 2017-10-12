"use strict";

class DOMUtils {

    /**
     * Converts a list of nodes to an array of nodes. This allows one to make
     * use of Array.prototype methods on the nodes that normally would not be
     * allowed.
     *
     * @param      {NodeList}  nodeList  The node list
     * @return     {DOMElement[]}    The converted array of nodes
     */
    static nodeListToArray(nodeList) {
        return Array.prototype.slice.call(nodeList, 0);
    }

    /**
     * Does a document.querySelectorAll but makes it into a standard array instead of
     * a node list making it better to work with.
     * 
     * @param  {String} queryString The query String
     * @return {DOMElement[]}      A list of the html elements
     */
    static querySelectorAll(queryString, context) {
        if (!context) {
            context = document;
        }
        return DOMUtils.nodeListToArray(context.querySelectorAll(queryString));
    }

    /**
     * Converts an HTML string into a DOM node. Mostly meant to be used with templates.
     *
     * @param      {String}   html    The html string to covnert to a node.
     * @return     {DOMNode}  The resulting node from the string.
     */
    static htmlToElement(html) {
        var template = document.createElement("template");
        template.innerHTML = html;
        return template.content.firstChild;
    }
}

module.exports = DOMUtils;