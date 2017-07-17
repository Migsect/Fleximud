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
        this.name = name;
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
        console.log("PANEL.name:", this.name);
        const element = Utils.htmlToElement(panelMovableTemplate({
            name: this.name
        }));
        element.appendChild(this.body);

        /* Handling all the interactability */
        if (parent) {
            parent.appendChild(element);
        }

        iteract(element, {
            ignoreFrom: ".panel-body"
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

            /* 
             * Need a scale to adjust to the new panel we're working within. 
             * https://github.com/taye/interact.js/issues/430 
             */
            const container = element.parentNode;
            const scaleX = container.getBoundingClientRect().width / container.offsetWidth;
            const scaleY = container.getBoundingClientRect().height / container.offsetHeight;

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

        return element;
    }
}

module.exports = Panel;