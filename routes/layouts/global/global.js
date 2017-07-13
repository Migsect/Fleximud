"use strict";

const templates = require(process.cwd() + "/templates/templates");
const layoutTemplate = templates(__dirname + "/global");

/**
 * This will generate a webpage using the following parameters.
 * This is the global, general layout for Fluxiv
 * 
 * @param  {[type]} request This is the route's request context. This is generally used to grab
 *                          accounts for showing account information.
 * @param  {[type]} view    This is HTML that will be used for the view.
 * @param  {[type]} styles  This is a list of styles that will be included in addition to the base styles
 * @param  {[type]} scripts This is a list of scripts that will be included
 * @return {[type]}         The final HTML page to be returned to the client.
 */
module.exports = function(request, view, styles, scripts)
{
    const account = request.session ? request.session.account : null;
    styles = styles || [];
    scripts = scripts || [];
    return layoutTemplate(
    {
        view: view,
        styles: styles,
        scripts: scripts,
        account: account
    });
};
