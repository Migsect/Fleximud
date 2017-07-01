"use strict";

const Utils = require("utils");
const $ = document.querySelector.bind(document);
const $$ = Utils.querySelectorAll;

require("./styles/creation.css");
const CreationPlugin = require("plugins/CreationPlugin");

class DescriptorPlugin extends CreationPlugin
{
    static get dependacies()
    {
        return [
            "ClassificationPlugin"
        ];
    }

    onLoad()
    {
        const self = this;

        self.elements = {
            descriptorsList: $(".descriptors")
        };

        const classification = self.plugins.get("ClassificationPlugin");
        classification.addEventListener("info_update", function(data)
        {
            self.updateDescriptors(data);
        });
        self.updateDescriptors(classification.current);

        /* Applying all the differening behavior between descriptors */
        $$(".descriptor", this.elements.descriptorsList).forEach(function(descriptor) {

        });
    }

    updateDescriptors(data)
    {
        const species = data.species;
        const race = data.race;
        const sex = data.sex;

        const descriptors = $$(".descriptor", this.elements.descriptorsList);
        const activeDescriptors = new Map();
        descriptors.forEach(function(descriptor)
        {
            descriptor.classList.add("hidden");
            const type = descriptor.dataset.id;
            const descriptorSpecies = descriptor.dataset.classificationSpecies;
            const descriptorRace = descriptor.dataset.classificationRace;
            const descriptorSex = descriptor.dataset.classificationSex;

            if (descriptorSpecies !== species && descriptorRace !== race && descriptorSex !== sex)
            {
                return;
            }

            const activation = (descriptorRace ? 1 : 0) + (descriptorSex ? 2 : 0) + (descriptorRace && descriptorSex ? 4 : 0);
            if (activeDescriptors.has(type) && activeDescriptors.get(type).activation > activation)
            {
                return;
            }
            activeDescriptors.set(type,
            {
                descriptor: descriptor,
                activatation: activation
            });
        });
        activeDescriptors.forEach(function(activationPair)
        {
            const descriptor = activationPair.descriptor;
            descriptor.classList.remove("hidden");
            descriptor.dataset.active = "true";
        });
    }
}

module.exports = DescriptorPlugin;
