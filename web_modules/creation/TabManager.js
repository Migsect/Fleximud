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

        this.plugins = new Map();
        this.setupListeners();
    }

    /**
     * Registers the plugin
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
        if (plugin.isComplete())
        {
            this.setTabStatus(id, "Complete");
        }

        if (!plugin.onTabSwitchFrom)
        {
            return;
        }
        plugin.onTabSwitchFrom();
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
                const formId = tab.dataset.form;
                this.onTabSwitchFrom(this.currentTab.dataset.id);
                this.onTabSwitchTo(tab.dataset.id);

                this.forms.forEach(function(form)
                {
                    form.classList.add("hidden");
                });
                $("#" + formId).classList.remove("hidden");

                if (this.currentTab)
                {
                    this.currentTab.classList.remove("active");
                }
                this.currentTab = tab;
                this.currentTab.classList.add("active");
            });
        });

        $("#creation-button-next").addEventListener("click", () =>
        {
            this.setTabStatus(null, "Complete");
            let nextTab = this.currentTab.nextSibling;
            while (nextTab !== null && nextTab.tagName != 'DIV')
            {
                nextTab = nextTab.nextSibling;
            }
            if (nextTab === null)
            {
                // TODO probably show finalize
                return;
            }
            $("#" + this.currentTab.dataset.form).classList.add("hidden");
            $("#" + nextTab.dataset.form).classList.remove("hidden");

            this.onTabSwitchFrom(this.currentTab.dataset.id);
            this.currentTab.classList.remove("active");
            this.currentTab = nextTab;
            this.currentTab.classList.add("active");
            this.onTabSwitchTo(this.currentTab.dataset.id);
        });

        $("#creation-button-finalize").addEventListener("click", function() {});
    }

    setTabStatus(id, status)
    {
        let tab = !id ? this.currentTab : $("#creation-tab-" + id);
        if (!tab)
        {
            return;
        }
        const tabStatus = tab.querySelector(".creation-tab-status");
        tab.dataset.complete = status.toLowerCase() === "complete" ? "true" : "false";
        tabStatus.innerHTML = status;
    }
}

module.exports = TabManager;
