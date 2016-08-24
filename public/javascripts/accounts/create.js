"use strict";

/* global Utils */

(function()
{
  var selectedAttributes = [];
  var speciesId = "";
  var sexId = "";

  /* Function that is called when an attribute is clicked */
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
  var $attributes = Utils.querySelectorAll("div.attribute-family");
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
    var parentChildren = Utils.convertNodeListToArray(parent.parentNode.children);
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
      Utils.querySelectorAll("div.species-item-sexes div.classification-item").forEach(function(item)
      {
        item.classList.remove("selected");
      });
    });

    parent.classList.add("selected");
    clicked.classList.add("selected");

    /* Updating the current species and sex selected */
    speciesId = parent.dataset.classification;
    sexId = clicked.dataset.classification;
    console.log("SpeciesId:", speciesId);
    console.log("SexId:", sexId);

    /* Unhiding the descriptors*/
    var descritporsId = "species-sex-descriptors-" + speciesId + "-" + sexId;
    Utils.querySelectorAll("div.species-sex-descriptors").forEach(function(element)
    {
      element.classList.add("hidden");
    });
    document.getElementById(descritporsId).classList.remove("hidden");

    /* Unhiding the spcies-sex info */
    Utils.querySelectorAll("div.classification-info").forEach(function(element)
    {
      element.classList.add("hidden");
    });
    document.getElementById("classification-info-" + speciesId).classList.remove("hidden");

  };
  var $speciesSexes = Utils.querySelectorAll("div.species-item-sexes div.classification-item");
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
  Utils.querySelectorAll(".descriptor-slider").forEach(function(element)
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
  Utils.querySelectorAll(".descriptor-number").forEach(function(element)
  {
    element.addEventListener("change", onNumberChange);
  });

  var onDescriptorSelectChange = function(event)
  {
    var element = this;
    element.parentNode.dataset.value = element.value;
  };
  Utils.querySelectorAll(".descriptor-select").forEach(function(element)
  {
    element.addEventListener("change", onDescriptorSelectChange);
  });

  /* ==== ==== Descriptors Interactions End ==== ==== */

  var $createCharacterButton = document.getElementById("createCharacterButton");
  var setCreateCharacterButtonState = function(toggledOn)
  {
    if (toggledOn)
    {
      $createCharacterButton.setAttribute("background", "blue");
      $createCharacterButton.classList.add("clickable");
    }
    else
    {

      $createCharacterButton.setAttribute("background", "grey_3");
      $createCharacterButton.classList.remove("clickable");
    }
  };
  $createCharacterButton.addEventListener("click", function(event)
  {
    if (!$createCharacterButton.classList.contains("clickable"))
    {
      return;
    }
    /* Toggling the button off */
    setCreateCharacterButtonState(false);

    var $characterFullName = document.getElementById("characterFullName");
    var $characterShortName = document.getElementById("characterShortName");

    /* Getting all the currently active descriptors */
    var descriptorParentQuery = "div#species-sex-descriptors-" + speciesId + "-" + sexId;
    var $descriptors = Utils.querySelectorAll(descriptorParentQuery + " div.descriptor");

    /* Constructing the mapping of descriptor keys to their values */
    var descriptors = {};
    $descriptors.forEach(function(descriptor)
    {
      var key = descriptor.dataset.key;
      var value = descriptor.dataset.value;
      descriptors[key] = value;
    });

    /* Sending the request to create the character */
    var request = Utils.sendPostRequest("/account/createCharacter",
    {
      fullName: $characterFullName.value,
      shortName: $characterShortName.value,

      attributes: selectedAttributes,
      species: speciesId,
      sex: sexId,
      descriptors: descriptors
    });

    request.onload = function()
    {

      console.log("Status :", request.status);
      if (request.status >= 200 && request.status < 400)
      {
        /* Forward to next page */
        var message = request.responseText;
        console.log("Response :", message);
      }
      else
      {
        setCreateCharacterButtonState(true);
        /* Unlocking for a retry */
      }

    };
    request.onerror = function()
    {
      setCreateCharacterButtonState(true);
      // Connection error
    };
  });
})();
