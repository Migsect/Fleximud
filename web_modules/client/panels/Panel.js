"use strict";

const iteract = require("interactjs");
const Utils = require("utils");

const panelMovableTemplate = require("./panelMovable.hbs");
const panelStaticTemplate = require("./panelStatic.hbs");
const panelBodyTemplate = require("./panelBody.hbs");

class Panel {

    constructor(name, body) {
        /* The body will almost never change and should always be this element. */
        this.body = Utils.htmlToElement(panelBodyTemplate(body));
        this._name = name;
        this.element = null;
        this.visible = true;
        this.listeners = new Map();
    }

    /**
     * Gets the name.
     * @return {String} The name of the panel.
     */
    get name() {
        return this._name;
    }

    /**
     * Sets the name property as well as attempts to update the name within the 
     * html element if it exists and if it has a name.
     *
     * @param {String} value The value to make the name.
     */
    set name(value) {
        this._name = value;
    }

    /**
     * Adds an event listener to the panel.
     * Events are triggered in response to certain panel events such as when it closes
     * or if it is hidden.
     *
     * @param {String} event The event to add the listener to
     * @param {Function} listener The listener callback to execute after the event.
     */
    addEventListener(event, listener) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(listener);
    }

    /**
     * Triggers an event for the panel.
     * This will call all listeners for that event and pass the additional arguments.
     * This additionally returns a list of all the returns of the listeners.
     * 
     * @param {String} event The event string to trigger
     * @param {Object[]} ... parameters to pass to the listeners.
     * @return {Object[]} The returns of all the listeners.
     */
    triggerEvent(event) {
        const args = Array.call.slice.call(arguments, 1);
        if (!this.listeners.has(event)) {
            return;
        }
        return this.listeners.get(event).map((listener) => listener.call(this, ...args));
    }

    /**
     * Sets the visibility of the panel.
     * 
     * @param  {Boolean} visible The visibility to set.
     */
    setVisible(visible) {
        this.visible = typeof visible === "boolean" ? visible : this.visible;
        this.triggerEvent("visible", this.visible);
        if (this.element) {
            if (visible) {
                this.element.classList.add("hidden");
            } else {
                this.element.classList.remove("hidden");
            }
        }
    }

    close() {

    }

    /**
     * Gets a movable panel. This will delete any of the current panels that may be linked to anything.
     * 
     * If there are any other movable or static panels already created, their bodies will be gutted
     * since this is moving the body to a new element.
     *
     * @param {Element} parent The parent element of the movable element.
     * @return {Element} The movable panel element.
     */
    getMovable(parent) {
        const element = Utils.htmlToElement(panelMovableTemplate({
            name: this.name
        }));
        element.appendChild(this.body);

        /* Handling all the interactability */
        if (parent) {
            parent.appendChild(element);
        }

        iteract(element, {
            ignoreFrom: ".panel-body,.panel-handle-minimize,.panel-handle-close"
        }).draggable({
            restrict: {
                restriction: "parent",
                endOnly: true,
                elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
            },
            onmove: function(event) {
                const target = event.target;
                /* keep the dragged position in the data-x/data-y attributes */
                var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                /* translate the element */
                target.style.webkitTransform =
                    target.style.transform =
                    'translate(' + x + 'px, ' + y + 'px)';

                /* update the posiion attributes */
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            }
        }).resizable({
            preserveAspectRatio: false,
            edges: { left: true, right: true, bottom: true, top: true }
        }).on("resizemove", function(event) {

            const target = event.target;

            /* keep the dragged position in the data-x/data-y attributes */
            var x = (parseFloat(target.getAttribute('data-x')) || 0);
            var y = (parseFloat(target.getAttribute('data-y')) || 0);

            /* update the element's style */
            target.style.width = event.rect.width + 'px';
            target.style.height = event.rect.height + 'px';

            /* translate when resizing from top or left edges */
            x += event.deltaRect.left;
            y += event.deltaRect.top;

            target.style.webkitTransform = target.style.transform =
                'translate(' + x + 'px,' + y + 'px)';

            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        });

        this.element = element;
        return element;
    }

    /**
     * Gets a static panel (non-movable) that should be added to another element and not just float on
     * the top level of the view.
     * 
     * If there are any other movable or static panels already created, their bodies will be gutted
     * since this is moving the body to a new element.
     * 
     * @param {Element} parent The parent element of the static element.
     * @return {Element} The static panel element.
     */
    getStatic(parent) {
        const element = Utils.htmlToElement(panelStaticTemplate({
            name: this.name
        }));

        element.appendChild(this.body);
        if (parent) {
            parent.appendChild(element);
        }

        this.element = element;
        return element;
    }
}

module.exports = Panel;