"use strict";
/* global io, decodeURIComponent */

var getParameterByName = function(name, url)
{
  if (!url)
  {
    url = window.location.href;
  }
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  var results = regex.exec(url);
  if (!results)
  {
    return null;
  }
  if (!results[2])
  {
    return '';
  }
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};

var characterId = getParameterByName("character");

var socket = io();
/* Registering a new client */
socket.emit("register", characterId);
