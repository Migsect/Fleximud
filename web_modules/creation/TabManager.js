"use strict";

const Utils = require("utils");
const $ = document.querySelector.bind(document);

class TabManager
{
    constructor()
    {
        this.tabs = Utils.querySelectorAll(".creation-tab");
        this.forms = Utils.querySelectorAll(".creation-form");
        this.currentTab = this.tabs[0];
        this.currentTab.classList.add("active");

        this.nextButton = $("#creation-button-next");
        this.finalizeButton = $("#creation-button-finalize");

        this.plugins = new Map();
        this.setupListeners();
    }

    /**
     * Registers the plugin to receive updates when its tab is switched to and from
     */
    registerCreationPlugin(plugin)
    {
        this.plugins.set(plugin.id.toLowerCase(), plugin);
    }

    /**
     * Called when the tab switches to the provided tab.
     */
    onTabSwitchTo(id)
    {
        console.log("To", id);
        if (!this.plugins.has(id.toLowerCase()))
        {
            return;
        }
        const plugin = this.plugins.get(id.toLowerCase());
        if (!plugin.onTabSwitchTo)
        {
            return;
        }
        plugin.onTabSwitchTo();
    }

    /**
     * Called when the tab leaves the current. This will grab the plugin if it exists and then
     * attempt to decide if the tab is complete.
     */
    onTabSwitchFrom(id)
    {
        console.log("From", id);
        if (!this.plugins.has(id.toLowerCase()))
        {
            return;
        }
        const plugin = this.plugins.get(id.toLowerCase());
        this.setTabStatus(id, plugin.isComplete() ? "Complete" : "Incomplete");

        if (!plugin.onTabSwitchFrom)
        {
            return;
        }
        plugin.onTabSwitchFrom();
    }

    setTab(id)
    {
        const tab = this.tabs.find((tab) => tab.dataset.id === id.toLowerCase());
        if (!tab)
        {
            console.log("ERROR: Cannot find tab with data-id:", id);
            return;
        }
        const tabForm = $("#" + tab.dataset.form);
        if (!tabForm)
        {
            console.log("ERROR: Cannot find tab form with id:", tab.dataset.form);
            return;
        }
        this.forms.forEach(function(form)
        {
            form.classList.add("hidden");
        });
        tabForm.classList.remove("hidden");

        /* Changing the current tab and calling plugin events */
        this.currentTab.classList.remove("active");
        this.onTabSwitchFrom(this.currentTab.dataset.id);

        this.currentTab = tab;

        this.currentTab.classList.add("active");
        this.onTabSwitchTo(this.currentTab.dataset.id);

        /* Checking to see if we need to switch to finalize */
        let nextTab = this.currentTab.nextSibling;
        while (nextTab !== null && nextTab.tagName != 'DIV')
        {
            nextTab = nextTab.nextSibling;
        }
        if (nextTab === null)
        {
            console.log("Setup finalize");
            this.nextButton.classList.add("hidden");
            this.finalizeButton.classList.remove("hidden");
        }
    }

    /**
     * Finalizes the creation and sends the request to the server with the character creation
     * request.
     */
    finalize()
    {
        const allComplete = this.tabs.map((tab) =>
        {
            const id = tab.dataset.id;
            const plugin = this.plugins.get(id);
            const isComplete = plugin.isComplete();
            this.setTabStatus(id, isComplete ? "Complete" : "Incomplete");
            return isComplete;
        }).every((status) => status);
        if (!allComplete)
        {
            setTimeout(() => window.alert("Please complete all creation forms to finalize."), 1);
            return;
        }
        const characterForm = {};
        this.plugins.forEach((plugin) =>
        {
            const header = plugin.getFieldHeader();
            const fields = plugin.getFields();
            characterForm[header] = fields;
        });
        console.log(characterForm);
    }

    /**
     * Sets up all the listeners for the elements.
     */
    setupListeners()
    {
        this.tabs.forEach((tab) =>
        {
            tab.addEventListener("click", () =>
            {
                this.setTab(tab.dataset.id);
            });
        });

        this.nextButton.addEventListener("click", () =>
        {
            let nextTab = this.currentTab.nextSibling;
            while (nextTab !== null && nextTab.tagName != 'DIV')
            {
                nextTab = nextTab.nextSibling;
            }
            if (nextTab === null)
            {
                nextTab = this.currentTab;
            }
            this.setTab(nextTab.dataset.id);
        });

        this.finalizeButton.addEventListener("click", () =>
        {
            this.finalize();
        });
    }

    setTabStatus(id, status)
    {
        const isComplete = status.toLowerCase() === "complete";
        const tab = !id ? this.currentTab : $("#creation-tab-" + id);
        if (!tab)
        {
            return;
        }
        const tabStatus = tab.querySelector(".creation-tab-status");
        tab.dataset.complete = isComplete ? "true" : "false";
        tabStatus.innerHTML = status;
    }
}

module.exports = TabManager;
