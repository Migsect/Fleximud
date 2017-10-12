"use strict";

class HTTPUtils {

    /**
     * Sends a request to the specified URL of the specified type.
     * This sends a JSON along with the request.
     *
     * @param      {String}   type    The type
     * @param      {String}   url     The url
     * @param      {Object}   json    The json
     * @return     {Promise}  Returns a promise that will resolve or reject with the request.
     */
    static sendRequest(type, url, json) {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.onload = () => {
                resolve(request);
            };
            request.onerror = () => {
                reject(request);
            };
            request.setRequestHeader("Content-Type", "application/json;charset=UTF-8; charset=UTF-8");
            request.send(JSON.stringify(json));
        });
    }

    /**
     * Retrieves the value of a paramter in a URL.
     * 
     * @param  {String} name The name of the parameter to extract.
     * @param  {String} url  The url to extract the paremter from.
     * @return {String}      The parameter's value.
     */
    static getParameterByName(name, url) {
        if (!url) {
            url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
        var results = regex.exec(url);
        if (!results) {
            return null;
        }
        if (!results[2]) {
            return '';
        }
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
}

module.exports = HTTPUtils;