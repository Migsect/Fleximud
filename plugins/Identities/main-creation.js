"use strict";

require("./styles/creation.css");

const $ = document.querySelector.bind(document);

const CreationPlugin = require("plugins/CreationPlugin");

class Identities extends CreationPlugin
{
    onLoad()
    {
        this.elements = {
            forename: $("#identity-forename"),
            midname: $("#identity-midname"),
            surname: $("#identity-surname"),
            alias: $("#identity-alias")
        };
    }

    isComplete()
    {
        const forename = this.elements.forename.value;
        const surname = this.elements.surname.value;
        const alias = this.elements.alias.value;

        this.setField("forename", this.elements.forename.value);
        this.setField("midname", this.elements.midname.value);
        this.setField("surname", this.elements.surname.value);
        this.setField("alias", this.elements.alias.value);

        return (forename.length + surname.length + alias.length) > 0;
    }
}

module.exports = Identities;
