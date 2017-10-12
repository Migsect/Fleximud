"use strict";

const interact = require("interactjs");
const TemplateUtils = require("Utils/TemplateUtils");
const elementize = TemplateUtils.elementize;

const panelMovableTemplate = elementize(require("./panelMovable.hbs"));
const panelStaticTemplate = elementize(require("./panelStatic.hbs"));
const panelBodyTemplate = elementize(require("./panelBody.hbs"));

class Panel {

    constructor(name, body) {
        /* The body will almost never change and should always be this element. */
        this.body = panelBodyTemplate(body);
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

    /**
     * Closes the panel wherever it may be. This effectively removes the current element attribute from it's parent and
     * then sets the element attribute to be null.  Note that this assumes the 
     * element being closed is a movable item.
     *
     * @return     {Element}  Returns the element that was closed.
     */
    close() {
        const element = this.element;

        // TODO Remove the element from it's parent.

        return element;
    }

    /**
     * Shows the element in the provided parent.  This requires a parent parameter to be specified as this is where the
     * element will be appended.  Note that this expects the element being shown is
     * movable and not a static item.
     *
     * @param      {Element}  parent  The parent element to add the element to.
     */
    show(parent) {

    }

    /**
     * Hides the element wherver it may be.  This does not mean that it will close
     * the element since the element attribute will still be available.  Note that
     * this assumes the element being hidden is movable and not a static item.
     * 
     * Additionally the hide can be undone using the "show()" method on the panel.
     */
    hide() {

    }

    /**
     * Gets a movable panel. This will delete any of the current panels that may be linked to anything.
     * 
     * If there are any other movable or static panels already created, their bodies will be gutted
     * since this is moving the body to a new element.
     *
     * Note that it is up to the caller to attach the returned element to its parent.
     * 
     * @return {Element} The movable panel element.
     */
    getMovable(parent) {
        const element = panelMovableTemplate({
            name: this.name
        });
        element.querySelector(".panel").appendChild(this.body);

        const handleTop = element.querySelector(".panel-movable-resize-T");
        const handleBottom = element.querySelector(".panel-movable-resize-B");
        const handleLeft = element.querySelector(".panel-movable-resize-L");
        const handleRight = element.querySelector(".panel-movable-resize-R");

        interact(element, {
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
                var x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
                var y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

                /* translate the element */
                target.style.webkitTransform =
                    target.style.transform =
                    "translate(" + x + "px, " + y + "px)";

                /* update the posiion attributes */
                target.setAttribute("data-x", x);
                target.setAttribute("data-y", y);
            }
        }).resizable({
            preserveAspectRatio: false,
            edges: {
                left: handleLeft,
                right: handleRight,
                bottom: handleBottom,
                top: handleTop
            }
        }).on("resizemove", function(event) {

            const target = event.target;

            /* keep the dragged position in the data-x/data-y attributes */
            var x = (parseFloat(target.getAttribute("data-x")) || 0);
            var y = (parseFloat(target.getAttribute("data-y")) || 0);
            console.log("x y", x, y);

            /* update the element's style */
            target.style.width = event.rect.width + "px";
            target.style.height = event.rect.height + "px";
            console.log("w h", target.style.width, target.style.height);

            /* translate when resizing from top or left edges */
            x += event.deltaRect.left;
            y += event.deltaRect.top;

            target.style.webkitTransform = target.style.transform =
                "translate(" + x + "px," + y + "px)";

            target.setAttribute("data-x", x);
            target.setAttribute("data-y", y);
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
     * Note that it is up to the caller to attach the panel to its correct parent.
     * 
     * @return {Element} The static panel element.
     */
    getStatic() {
        const element = panelStaticTemplate({
            name: this.name
        });

        element.appendChild(this.body);

        this.element = element;
        return element;
    }
}

module.exports = Panel;