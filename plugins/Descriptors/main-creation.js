"use strict";

require("./styles/creation.css");

const Utils = require("utils");
const $ = document.querySelector.bind(document);
const $$ = Utils.querySelectorAll;

const CreationPlugin = require("plugins/CreationPlugin");

class Descriptors extends CreationPlugin
{
    static get depends()
    {
        return [
            "Classifications"
        ];
    }

    /**
     * Applies behavior to a descriptor element.
     */
    applyDescriptorBehavior(descriptor)
    {
        const format = descriptor.dataset.format;
        switch (format)
        {
            case "range":
                const sliderInput = descriptor.querySelector(".range-input-slider");
                const numberInput = descriptor.querySelector(".range-input-number");
                sliderInput.addEventListener("input", function()
                {
                    numberInput.value = sliderInput.value;
                    sliderInput.dataset.value = sliderInput.value;
                });
                numberInput.addEventListener("change", function()
                {
                    let value = numberInput.value;
                    value = value > numberInput.max ? numberInput.max : value;
                    value = value < numberInput.min ? numberInput.min : value;
                    numberInput.value = value;
                    sliderInput.value = value;
                    sliderInput.dataset.value = value;
                });
                break;
            case "variation":
                const selectInput = descriptor.querySelector(".variation-input-selection");
                selectInput.addEventListener("change", function()
                {
                    selectInput.dataset.value = selectInput.value;
                });
                break;
        }
    }

    onLoad()
    {
        const self = this;

        self.elements = {
            descriptorsList: $(".descriptors"),
            descriptors: $$(".descriptor", $(".descriptors"))
        };

        const classification = self.plugins.get("Classifications");
        classification.addEventListener("info_update", function(data)
        {
            self.updateDescriptors(data);
        });
        self.updateDescriptors(classification.current);

        /* Applying all the differening behavior between descriptors */
        $$(".descriptor", this.elements.descriptorsList).forEach(function(descriptor)
        {
            self.applyDescriptorBehavior(descriptor);
        });
    }

    /**
     * Updates all the descriptors such that they match the current classification information.
     */
    updateDescriptors(data)
    {
        const species = data.species;
        const race = data.race;
        const sex = data.sex;

        const descriptors = this.elements.descriptors;
        const activeDescriptors = new Map();
        descriptors.forEach(function(descriptor)
        {
            descriptor.classList.add("hidden");
            descriptor.dataset.active = "false";
            const type = descriptor.dataset.id;
            const descriptorSpecies = descriptor.dataset.classificationSpecies;
            const descriptorRace = descriptor.dataset.classificationRace;
            const descriptorSex = descriptor.dataset.classificationSex;

            if (descriptorSpecies !== species)
            {
                return;
            }
            if (descriptorRace && descriptorRace !== race)
            {
                return;
            }
            if (descriptorSex && descriptorSex !== sex)
            {
                return;
            }

            const activation = (descriptorSpecies ? 1 : 0) +
                (descriptorRace ? 2 : 0) +
                (descriptorSex ? 4 : 0) +
                (descriptorRace && descriptorSex ? 8 : 0);
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

    calculateFields()
    {
        this.resetFields();
        const descriptors = $$(".descriptor:not(.hidden)", this.elements.descriptorsList);
        descriptors.forEach((descriptor) =>
        {
            const designated = descriptor.querySelector(".field-designator");
            const key = descriptor.dataset.id;
            const value = designated.dataset.value.trim();
            const convertedValue = Number.isNaN(+value) ? value : Number(value);
            console.log(key, convertedValue);
            this.setField(key, value.length <= 0 ? null : convertedValue);

        });
    }

    isComplete()
    {
        this.calculateFields();
        return Object.keys(this.getFields()).every((key) => this.getField(key));
    }
}

module.exports = Descriptors;
