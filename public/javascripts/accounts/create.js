"use strict";

var selectedAttributes = [];
var speciesId = "";
var sexId = "";

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
  item.addEventListener("click", onAttributeClick);
});

/* When a species sex is clicked */
var onSpeciesSexClick = function()
{
  /* Unhiding the panels for info and descriptors*/
  document.getElementById("species-sex-descriptors").classList.remove("hidden");
  document.getElementById("species-sex-infos").classList.remove("hidden");

  var clicked = this;
  if (clicked.classList.contains("selected"))
  {
    return;
  }
  var parent = clicked.parentNode.parentNode;
  var parentChildren = Array.prototype.slice.call(parent.parentNode.children, 0);
  console.log(parentChildren);
  // var parentSiblings = parentChildren.filter(function(item)
  // {
  //   return item === parent;
  // });

  /* Going through all the children of that area and removing selected */
  parentChildren.forEach(function(item)
  {
    /* Removing from the node */
    item.classList.remove("selected");
    /* removing selected from all elements in the parent's siblings*/
    Array.prototype.slice.call(item.querySelectorAll("div.species-item-sexes div.classification-item"), 0).forEach(function(item)
    {
      item.classList.remove("selected");
    });
  });

  parent.classList.add("selected");
  clicked.classList.add("selected");

  speciesId = parent.dataset.classification;
  sexId = clicked.dataset.classification;
  console.log("SpeciesId:", speciesId);
  console.log("SexId:", sexId);

  /* Unhiding the descriptors*/
  var descritporsId = "species-sex-descriptors-" + speciesId + "-" + sexId;
  Array.prototype.slice.call(document.querySelectorAll("div.species-sex-descriptors"), 0).forEach(function(element)
  {
    element.classList.add("hidden");
  });
  document.getElementById(descritporsId).classList.remove("hidden");

  /* Unhiding the spcies-sex info */
  Array.prototype.slice.call(document.querySelectorAll("div.classification-info"), 0).forEach(function(element)
  {
    element.classList.add("hidden");
  });
  document.getElementById("classification-info-" + speciesId).classList.remove("hidden");

};
var $speciesSexes = Array.prototype.slice.call(document.querySelectorAll("div.species-item-sexes div.classification-item"), 0);
$speciesSexes.forEach(function(item)
{
  item.addEventListener("click", onSpeciesSexClick);
});

/* ==== ==== Descriptor interactions Start ==== ==== */
var onSliderChange = function(event)
{
  var element = this;
  element.parentNode.querySelector(".descriptor-number").value = element.value;
  element.parentNode.dataset.value = element.value;
};
Array.prototype.slice.call(document.querySelectorAll(".descriptor-slider"), 0).forEach(function(element)
{
  element.addEventListener("change", onSliderChange);
});

var onNumberChange = function(event)
{
  var element = this;
  if (element.value > element.max)
  {
    element.value = element.max;
  }
  if (element.value < element.min)
  {
    element.value = element.min;
  }
  element.parentNode.querySelector(".descriptor-slider").value = element.value;
  element.parentNode.dataset.value = element.value;

};
Array.prototype.slice.call(document.querySelectorAll(".descriptor-number"), 0).forEach(function(element)
{
  element.addEventListener("change", onNumberChange);
});

var onDescriptorSelectChange = function(event)
{
  var element = this;
  element.parentNode.dataset.value = element.value;
};
Array.prototype.slice.call(document.querySelectorAll(".descriptor-select"), 0).forEach(function(element)
{
  element.addEventListener("change", onDescriptorSelectChange);
});

/* ==== ==== Descriptors Interactions End ==== ==== */

var $createCharacterButton = document.getElementById("createCharacterButton");
$createCharacterButton.addEventListener("click", function(event)
{
  var $characterFullName = document.getElementById("characterFullName");
  var $characterShortName = document.getElementById("characterShortName");

  var request = new XMLHttpRequest();
  request.open("POST", "/account/createCharacter", true);
  request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8; charset=UTF-8');
  request.send(
    JSON.stringify(
    {
      fullName: $characterFullName.value,
      shortName: $characterShortName.value,
      attributes: selectedAttributes,
      species: speciesId,
      sex: sexId
    }));

  request.onload = function()
  {

    console.log("Status :", request.status);
    if (request.status >= 200 && request.status < 400)
    {
      var message = request.responseText;
      console.log("Response :", message);
      if (message == "badInfo")
      {
        return;
      }
      /* Redirect to the account page if we were successful */
    }
    else
    {
      // error
    }
  };
  request.onerror = function()
  {
    // Connection error
  };
});
