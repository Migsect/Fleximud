"use strict";

require("./styles/creation.css");
const CreationPlugin = require("plugins/CreationPlugin");
const Utils = require("utils");
const $ = document.querySelector.bind(document);
const tabManager = window.creation.tabManager;

class Classifications extends CreationPlugin
{
    onLoad()
    {
        const self = this;
        self.current = {
            species: "",
            race: "",
            sex: ""
        };

        self.elements = {
            speciesChoices: Utils.querySelectorAll(".classification-choice-species"),
            raceChoices: Utils.querySelectorAll(".classification-choice-race"),
            sexChoices: Utils.querySelectorAll(".classification-choice-sex"),
            informationItems: Utils.querySelectorAll(".classification-information-item")
        };

        self.elements.speciesChoices.forEach(function(element)
        {
            element.addEventListener("click", function()
            {
                const id = element.dataset.id;
                self.switchSpecies(id);
            });
        });
        self.elements.raceChoices.forEach(function(element)
        {
            element.addEventListener("click", function()
            {
                const id = element.dataset.id;
                self.switchRace(id);
            });
        });
        self.elements.sexChoices.forEach(function(element)
        {
            element.addEventListener("click", function()
            {
                const id = element.dataset.id;
                self.switchSex(id);
            });
        });

        self.switchSpecies(self.elements.speciesChoices[0].dataset.id);

    }

    updateInformation()
    {
        const self = this;
        const current = self.current;
        const legalIds = [
            current.species,
            current.species + "-" + current.race,
            current.species + "-" + current.sex,
            current.species + "-" + current.race + "-" + current.sex
        ];
        self.elements.informationItems.forEach(function(element)
        {
            const passes = legalIds.some(function(legalId)
            {
                return element.id.trim() === legalId;
            });
            if (passes)
            {
                element.classList.remove("hidden");
            }
            else
            {
                element.classList.add("hidden");
            }
        });

        self.triggerEvent("info_update", current);
    }

    switchSex(id)
    {
        const self = this;
        tabManager.setTabStatus(null, "");
        id = id.trim();
        self.current.sex = id;
        self.setField("sex", id);

        const sexElement = $("#" + self.current.species + "-" + id + ".classification-choice-sex");
        self.elements.sexChoices.forEach(function(sexElement)
        {
            sexElement.classList.remove("selected");
        });
        sexElement.classList.add("selected");

        self.updateInformation();
    }

    switchRace(id)
    {
        const self = this;
        tabManager.setTabStatus(null, "");
        id = id.trim();
        self.current.race = id;
        self.setField("race", id);

        const raceElement = $("#" + self.current.species + "-" + id + ".classification-choice-race");
        self.elements.raceChoices.forEach(function(raceElement)
        {
            raceElement.classList.remove("selected");
        });
        raceElement.classList.add("selected");

        self.updateInformation();
    }

    switchSpecies(id)
    {
        const self = this;
        tabManager.setTabStatus("descriptors", "");
        id = id.trim();
        self.current.species = id;
        self.setField("species", id);

        const speciesElement = $("#" + id + ".classification-choice-species");
        self.elements.speciesChoices.forEach(function(speciesElement)
        {
            speciesElement.classList.remove("selected");
        });
        speciesElement.classList.add("selected");

        let raceSelected = false;
        self.elements.raceChoices.forEach(function(element)
        {
            const parentId = element.dataset.parent;
            if (id === parentId)
            {
                if (!raceSelected)
                {
                    element.classList.add("selected");
                    self.switchRace(element.dataset.id);
                    raceSelected = true;
                }
                element.classList.remove("hidden");
            }
            else
            {
                element.classList.add("hidden");
            }
        });
        let sexSelected = false;
        self.elements.sexChoices.forEach(function(element)
        {
            const parentId = element.dataset.parent;
            if (id === parentId)
            {
                if (!sexSelected)
                {
                    element.classList.add("selected");
                    self.switchSex(element.dataset.id);
                    sexSelected = true;
                }
                element.classList.remove("hidden");
            }
            else
            {
                element.classList.add("hidden");
            }
        });

        self.updateInformation();
    }
}
module.exports = Classifications;
