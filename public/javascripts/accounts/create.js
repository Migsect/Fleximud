"use strict";
$(document).ready(function()
{

  var selectedAttributes = [];

  /* Attribute selecting */
  $("div.attribute-family").click(function(event)
  {
    var updateSelected = function(element)
    {
      var clickedAttribute = element.attr("data-attribute");
      console.log(clickedAttribute, "clicked");
      if (element.hasClass("selected"))
      {
        element.removeClass("selected");
        selectedAttributes = selectedAttributes.filter(function(attribute)
        {
          return attribute != clickedAttribute;
        });
      }
      else
      {

        selectedAttributes.push(clickedAttribute);
        element.addClass("selected");
      }
      console.log(selectedAttributes);
    };
    event.stopPropagation();
    var clicked = $(event.target);
    if (clicked.hasClass("attribute-family"))
    {
      updateSelected(clicked);
    }
    else
    {
      updateSelected(clicked.parent());
    }
  });
  $("div.species-item-sexes div.classification-item").click(function(event)
  {
    /* Unhiding the panels for info and descriptors*/
    $("#species-sex-descriptors").show();
    $("#species-sex-infos").show();

    var clicked = $(this);
    if (!clicked.hasClass("selected"))
    {
      var parent = clicked.parents("div.species-item").first();
      var parentSiblings = parent.siblings();
      parentSiblings.removeClass("selected");
      parentSiblings.find("div.species-item-sexes div.classification-item").removeClass("selected");
      parent.find("div.species-item-sexes div.classification-item").removeClass("selected");

      parent.addClass("selected");
      clicked.addClass("selected");

      var speciesId = parent.data("classification");
      var sexId = clicked.data("classification");
      console.log("SpeciesId:", speciesId);
      console.log("SexId:", sexId);

      /* Unhiding the descriptors*/
      var descritporsId = "species-sex-descriptors-" + speciesId + "-" + sexId;
      $("div.species-sex-descriptors").hide();
      $("#" + descritporsId).show();

      /* Unhiding the spcies-sex info */
      var infoId = "classification-info-" + speciesId;
      $("div.classification-info").hide();
      $("#" + infoId).show();
    }
  });

  /* Descriptor interactions */
  $(".descriptor-slider").change(function()
  {
    var element = $(this);
    console.log(element.parent());
    var siblings = element.siblings(".descriptor-number");
    siblings.val(element.val());
    element.parent().attr("data-value", element.val());
  });
  $(".descriptor-number").change(function()
  {
    var element = $(this);
    var siblings = element.siblings(".descriptor-slider");
    if (element.val() > element.attr("max"))
    {
      element.val(element.attr("max"));
    }
    if (element.val() < element.attr("min"))
    {
      element.val(element.attr("min"));
    }
    siblings.val(element.val());
    element.parent().attr("data-value", element.val());
  });

  $(".descriptor-select").change(function()
  {
    var element = $(this);
    element.parent().attr("data-value", element.val());
  });
});
