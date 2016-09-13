"use strict";
/* global decodeURIComponent */

var Utils = {};

/**
 * The node list to convert to an array of nodes
 * @param  {NodeList} nodeList The node list
 * @return {Node[]}           The converted array of nodes
 */
Utils.convertNodeListToArray = function(nodeList)
{
  return Array.prototype.slice.call(nodeList, 0);
};

/**
 * Does a document.querySelectorAll but makes it into a standard array instead of
 * a node list making it better to work with.
 * 
 * @param  {String} queryString The query String
 * @return {HTMLElement[]}      A list of the html elements
 */
Utils.querySelectorAll = function(queryString)
{
  return Utils.convertNodeListToArray(document.querySelectorAll(queryString));
};

/**
 * Sends a post request with the json as the data to the specified URL
 * 
 * @param  {String} url  The URL to send the post to
 * @param  {Json} json A json object to send
 * @return {XMLHttpRequest}      The requuest that was sent
 */
Utils.sendPostRequest = function(url, json)
{
  var request = new XMLHttpRequest();
  request.open("POST", url, true);
  request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8; charset=UTF-8');
  request.send(JSON.stringify(json));
  return request;
};

Utils.getParameterByName = function(name, url)
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

module.exports = Utils;
