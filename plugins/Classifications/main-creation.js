"use strict";

require("./styles/creation.css");

let currentSpecies = "";
let currentRace = "";
let currentSex = "";

const Utils = require("utils");
const $ = document.querySelector.bind(document);
const setTabStatus = window.creation.setTabStatus;

const speciesChoices = Utils.querySelectorAll(".classification-choice-species");
const raceChoices = Utils.querySelectorAll(".classification-choice-race");
const sexChoices = Utils.querySelectorAll(".classification-choice-sex");

const informationItems = Utils.querySelectorAll(".classification-information-item");

function updateInformation()
{
    const legalIds = [
        currentSpecies,
        currentSpecies + "-" + currentRace,
        currentSpecies + "-" + currentSex,
        currentSpecies + "-" + currentRace + "-" + currentSex
    ];
    informationItems.forEach(function(element)
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
}

function switchSex(id)
{
    setTabStatus(null, "");
    setTabStatus("descriptors", "");
    id = id.trim();
    currentSex = id;

    const sexElement = $("#" + currentSpecies + "-" + id + ".classification-choice-sex");
    sexChoices.forEach(function(sexElement)
    {
        sexElement.classList.remove("selected");
    });
    sexElement.classList.add("selected");

    updateInformation();
}

function switchRace(id)
{
    setTabStatus(null, "");
    setTabStatus("descriptors", "");
    id = id.trim();
    currentRace = id;

    const raceElement = $("#" + currentSpecies + "-" + id + ".classification-choice-race");
    raceChoices.forEach(function(raceElement)
    {
        raceElement.classList.remove("selected");
    });
    raceElement.classList.add("selected");

    updateInformation();
}

function switchSpecies(id)
{
    setTabStatus(null, "");
    setTabStatus("descriptors", "");
    id = id.trim();
    currentSpecies = id;

    const speciesElement = $("#" + id + ".classification-choice-species");
    speciesChoices.forEach(function(speciesElement)
    {
        speciesElement.classList.remove("selected");
    });
    speciesElement.classList.add("selected");

    let raceSelected = false;
    raceChoices.forEach(function(element)
    {
        const parentId = element.dataset.parent;
        if (id === parentId)
        {
            if (!raceSelected)
            {
                element.classList.add("selected");
                switchRace(element.dataset.id);
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
    sexChoices.forEach(function(element)
    {
        const parentId = element.dataset.parent;
        if (id === parentId)
        {
            if (!sexSelected)
            {
                element.classList.add("selected");
                switchSex(element.dataset.id);
                sexSelected = true;
            }
            element.classList.remove("hidden");
        }
        else
        {
            element.classList.add("hidden");
        }
    });

    updateInformation();
}

speciesChoices.forEach(function(element)
{
    element.addEventListener("click", function()
    {
        const id = element.dataset.id;
        switchSpecies(id);
    });
});
raceChoices.forEach(function(element)
{
    element.addEventListener("click", function()
    {
        const id = element.dataset.id;
        switchRace(id);
    });
});
sexChoices.forEach(function(element)
{
    element.addEventListener("click", function()
    {
        const id = element.dataset.id;
        switchSex(id);
    });
});

switchSpecies(speciesChoices[0].dataset.id);
