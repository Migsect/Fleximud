"use strict";

const Utils = require("../utils.js");

const $ = document.querySelector.bind(document);

const tabs = Utils.querySelectorAll(".creation-tab");
let currentTab = tabs[0]; // Assumption that first tab is the non-hidden one.
const forms = Utils.querySelectorAll(".creation-form");

tabs.forEach(function(element)
{
    element.addEventListener("click", function(event)
    {
        const formId = element.dataset.form;
        forms.forEach(function(form)
        {
            form.classList.add("hidden");
        });
        $("#" + formId).classList.remove("hidden");
        currentTab = element;
    });
});

$("#creation-button-next").addEventListener("click", function(event)
{
    let nextTab = currentTab.nextSibling;
    while (nextTab !== null && nextTab.tagName != 'DIV')
    {
        nextTab = nextTab.nextSibling;
    }
    if (nextTab === null)
    {
        // TODO probably show finalize
        return;
    }
    console.log("nxtb:", nextTab, "crtb:", currentTab);
    $("#" + currentTab.dataset.form).classList.add("hidden");
    $("#" + nextTab.dataset.form).classList.remove("hidden");
    currentTab = nextTab;
});
$("#creation-button-finalize").addEventListener("click", function(event) {});
