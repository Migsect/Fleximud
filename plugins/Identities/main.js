"use strict";

const Plugin = require(process.cwd() + "/modules/Plugins/Plugin");

class IdentitiesPlugin extends Plugin
{
    onLoad()
    {

    }

    getCreationForm()
    {
        const formTemplate = this.getCreationTemplate();
        return formTemplate(
        {
            max: 20
        });
    }

    getCharacterListInfo(character)
    {
        const data = character.data.identities;
        return {
            priority: 0,
            info: data.forename + " " + data.surname
        };
    }
    validateCharacterForm()
    {
        return true;
    }
    applyCharacterForm(form, character)
    {
        console.log(form);
        if (!form)
        {
            // WELL Do SOMETHING
        }
        character.data.identities = form;
    }
}

module.exports = IdentitiesPlugin;
