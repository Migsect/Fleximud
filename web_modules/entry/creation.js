"use strict";

const Utils = require("utils");
const WebPlugin = require("Plugins/WebPlugin");

const $ = document.querySelector.bind(document);

window.creation = {};

/* ########################################################################## *
 * # Tab handling                                                           # *  
 * ########################################################################## */

const tabs = Utils.querySelectorAll(".creation-tab");
let currentTab = tabs[0]; // Assumption that first tab is the non-hidden one.
const forms = Utils.querySelectorAll(".creation-form");

function setTabStatus(id, status)
{
    let tab = null;
    if (!id)
    {
        tab = currentTab;
    }
    else
    {
        tab = $("#creation-tab-" + id);
    }
    if (!tab)
    {
        return;
    }
    const tabStatus = tab.querySelector(".creation-tab-status");
    if (status.toLowerCase() === "complete")
    {
        tab.dataset.complete = "true";
    }
    else
    {
        tab.dataset.complete = "false";
    }
    tabStatus.innerHTML = status;
}
window.creation.setTabStatus = setTabStatus;

tabs.forEach(function(element)
{
    element.addEventListener("click", function()
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

$("#creation-button-next").addEventListener("click", function()
{
    setTabStatus(null, "Complete");
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
    $("#" + currentTab.dataset.form).classList.add("hidden");
    $("#" + nextTab.dataset.form).classList.remove("hidden");
    currentTab = nextTab;
});

$("#creation-button-finalize").addEventListener("click", function() {});

/* ########################################################################## *
 * # Loading the main-creation scripts from the plugins.                    # *  
 * ########################################################################## */

const pluginsContext = require.context("../../plugins/", true, /main-creation\.js/);
const pluginConstructors = pluginsContext.keys().map((key) =>
{
    return pluginsContext(key);
});
const plugins = WebPlugin.loadPlugins(pluginConstructors);
