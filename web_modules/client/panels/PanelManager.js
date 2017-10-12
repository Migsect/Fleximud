"use strict";

const $ = document.querySelector.bind(document);

const Panel = require("./Panel");
const TemplateUtils = require("Utils/TemplateUtils");
const elementize = TemplateUtils.elementize;
const panelListItemTemplate = elementize(require("./panelListElement.hbs"));

const Utils = require("utils");

class PanelManager {

    constructor(view) {
        this.view = view;

        this.elements = {
            menu: $("#panel-menu"),
            menuButton: $("#panel-menu-button"),
            menuSelection: $("#panel-menu-selection"),
            active: $("#panel-active"),
        };

        this.panels = [];

        // TEMP Test for panels
        // this.TEST_PANELS();
    }

    // TEST_PANELS() {
    //     const testPanel = new Panel("TEST_PANEL_NAME.TEST_PANEL_NAME.TEST_PANEL_NAME.TEST_PANEL_NAME", "<div>TEST_PABEL_BODY</div>");
    //     console.log("TEST_PANELS", testPanel);
    //     const elementPanel = testPanel.getMovable(this.view);
    // }

    /**
     * Creates a new panel with the name and body.
     * This is different from calling the Panel constructor since this will also register the
     * panel with the PanelManager.
     *
     * @param {String} name The name of the panel to create.
     * @param {String} body The body of the panel to create.
     */
    createPanel(name, body) {
        const panel = new Panel(name, body);
        this.registerPanel(panel);
        return panel;
    }

    /**
     * Registers the panel with the manager.
     * This adds the ability for the manager to handle showing and hiding the panel
     * as well as showing the existance of the panel within the panel-bar.
     *
     * @param {Panel} panel The panel to register with the manager.
     */
    registerPanel(panel) {
        const name = panel.name;
        const activeElement = panelListItemTemplate({ name: panel.name });

    }

    /**
     * Registers a panel generator with the manager.
     * A panel generator is simply a function that creates a new panel when clicked.
     *
     * The name for the generator is also included since a button will be created for the generator.
     * Do note that the buttons for the generator are sorted dictionarily.
     *
     * Conflicting names will fail with multiple of the same generator being shown.
     * 
     * @param  {name : String, callback : Function} generator The generator to be used.
     */
    registerGenerator(generator) {

    }

    /**
     * Adds a movable panel to the screen.
     * 
     * Do note that this does not register the panel with the manager, as a result one
     * should always ensure their panel is registered.  If the panel was created through
     * the panel Manager then it should be pre-registered.
     *
     * @param {Panel} panel The panel to add as a movable panel.
     */
    addMovablePanel(panel) {

    }

}

module.exports = PanelManager;