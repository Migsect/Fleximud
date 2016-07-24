"use strict";

$(document).ready(function() {
    /* Attribute selecting */
    $("div.attribute-family").click(function(event) {
        var updateSelected = function(element) {
            if (element.hasClass("selected")) {
                element.removeClass("selected");
            } else {
                element.addClass("selected");
            }
        };

        event.stopPropagation();
        var clicked = $(event.target);
        if (clicked.hasClass("attribute-family")) {
            updateSelected(clicked);
        } else {
            updateSelected(clicked.parent());
        }
    });
});
