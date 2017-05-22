"use strict";

const Utils = require("../utils.js");

const $ = document.querySelector.bind(document);

$("#login-button").addEventListener("click", function()
{
    const email = $("#login-email").value;
    const password = $("#login-password").value;
    if (email.length < 6)
    {
        window.alert("Email is too short");
        return;
    }

    if (password.length < 6)
    {
        window.alert("Password is too short");
        return;
    }
    const request = Utils.sendPostRequest("/auth/login",
    {
        email: email,
        password: password
    });
    request.onload = function()
    {
        const status = request.status;
        const response = JSON.parse(request.responseText);
        if (status >= 200 && status < 400)
        {
            console.log("Message:", response.message);
            if (response.redirect)
            {
                console.log("Redirect:", response.redirect);
                window.location.replace(response.redirect);
            }
        }
        else
        {
            window.alert(response.message);
        }
    };
    request.onerror = function()
    {
        window.alert("An issue occured when attempting to contact the server.");
    };
});

$("#create-button").addEventListener("click", function()
{
    const username = $("#create-username").value;
    const email = $("#create-email").value;
    const password = $("#create-password").value;
    const confirmPassword = $("#create-confirm-password").value;

    if (username.length < 6)
    {
        window.alert("Username is too short");
        return;
    }
    if (email.length < 6)
    {
        window.alert("Password is too short");
        return;
    }
    if (password.length < 6)
    {
        window.alert("Password is too short");
        return;
    }
    if (password != confirmPassword)
    {
        window.alert("Passwords do not match");
        return;
    }

    const request = Utils.sendPostRequest("/auth/create",
    {
        email: email,
        username: username,
        password: password
    });
    request.onload = function()
    {
        const status = request.status;
        const response = JSON.parse(request.responseText);
        if (status >= 200 && status < 400)
        {
            console.log("Message:", response.message);
            if (response.redirect)
            {

                console.log("Redirect:", response.redirect);
                window.location.replace(response.redirect);
            }
        }
        else
        {
            window.alert(response.message);
        }
    };
    request.onerror = function()
    {
        window.alert("An issue occured when attempting to contact the server.");
    };
});
