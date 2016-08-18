"use strict";

var selectedAttributes = [];

var onAttributeClick = function(event)
{
  var updateSelected = function(element)
  {
    var clickedAttribute = element.dataset.name;
    console.log(clickedAttribute, "clicked");
    if (element.classList.contains("selected"))
    {
      element.classList.remove("selected");
      selectedAttributes = selectedAttributes.filter(function(attribute)
      {
        return attribute != clickedAttribute;
      });
    }
    else
    {

      selectedAttributes.push(clickedAttribute);
      element.classList.add("selected");
    }
    console.log(selectedAttributes);
  };

  /* Stopping the event's propogation*/
  event.stopPropagation();
  var clicked = event.target;
  if (clicked.classList.contains("attribute-family"))
  {
    updateSelected(clicked);
  }
  else
  {
    updateSelected(clicked.parentElement);
  }
};
/* Attribute selecting */
var $attributes = Array.prototype.slice.call(document.querySelectorAll("div.attribute-family"), 0);
$attributes.forEach(function(item)
{
  item.addEventListener("click", onAttributeClick)
});

var onSpeciesSexClick = function(event)
{
  /* Unhiding the panels for info and descriptors*/
  document.getElementById("species-sex-descriptors").classList.remove("hidden");
  document.getElementById("species-sex-infos").classList.remove("hidden");

  var clicked = this
  if (clicked.classList.contains("selected"))
  {
    return
  }
  var parent = clicked.parentNode;
  var parentChildren = Array.prototype.slice.call(parent.parentNode.children, 0);
  console.log(parentChildren)
  var parentSiblings = parentChildren.filter(function(item)
  {
    return item === parent;
  });

  /* Going through all the children of that area and removing selected */
  parentChildren.forEach(function(item)
  {
    /* Removing from the node */
    item.classList.remove("selected");
    /* removing selected from all elements in the parent's siblings*/
    Array.prototype.slice.call(parent.querySelectorAll("div.species-item-sexes div.classification-item"), 0).forEach(function(item)
    {
      item.classList.remove("selected");
    });
  });

  parent.classList.add("selected");
  clicked.classList.add("selected");

  var speciesId = parent.dataset.classification;
  var sexId = clicked.dataset.classification;
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

};
var $speciesSexes = Array.prototype.slice.call(document.querySelectorAll("div.species-item-sexes div.classification-item"), 0);
$speciesSexes.forEach(function(item)
{
  item.addEventListener("click", onSpeciesSexClick)
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
