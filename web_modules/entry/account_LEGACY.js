"use strict";

require("../auth.js");

var Util = require("../utils.js");

var $deleteButtons = Util.querySelectorAll(".character-delete");
$deleteButtons.forEach(function(element)
{
  element.addEventListener("click", function(event)
  {
    var result = window.confirm("Are you sure you want to delete this character?");
    if (!result)
    {
      return;
    }
    var characterId = element.dataset.characterId;

    var request = Util.sendPostRequest("/account/deleteCharacter",
    {
      character: characterId
    });

    request.onload = function()
    {
      console.log("Status :", request.status);
      if (request.status >= 200 && request.status < 400)
      {
        /* Removing the element */
        var characterItem = document.getElementById("character-" + characterId);
        characterItem.parentNode.removeChild(characterItem);
      }
      else
      {
        /* Displaying the error message */
        var message = request.responseText;
        console.log(message);
        // TODO proper error message
      }
    };
    request.onerror = function()
    {
      // connection error
      // TODO proper error handling
    };
  });
});
