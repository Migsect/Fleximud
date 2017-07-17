"use strict";

const Panel = require("./Panel");

class PanelManager {

    constructor(view) {
        this.view = view;

        this.TEST_PANELS();
    }

    TEST_PANELS() {
        const testPanel = new Panel("TEST_PANEL_NAME", "<div>TEST_PABEL_BODY</div>");
        console.log("TEST_PANELS", testPanel);
        const elementPanel = testPanel.getMovable(this.view);
    }

}

module.exports = PanelManager;