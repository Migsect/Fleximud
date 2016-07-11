var mongoose = require('mongoose');

var CharacterSchema = mongoose.Schema(
{
    name : String
});

module.exports =
{
    schema : CharacterSchema,
    createCharacter : function()
    {
        // TODO
    }
};