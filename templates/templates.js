/**
 * Used to load and have a single reference to all templates.
 */

var fs = require('fs');
var ejs = require('ejs')

var loginBarTemplate = null;
fs.readFile('loginBar.html', 'utf-8', function(error, data)
{
    if (error)
    {
        throw error;
    }
    loginBarTemplate = ejs.compile(data);
});

module.exports =
{
    loginBarTemplate : loginBarTemplate
};