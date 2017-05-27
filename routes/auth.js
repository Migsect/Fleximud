"use strict";

const express = require('express');
const router = express.Router();

// const Util = require('../modules/Util');
const Logger = require(process.cwd() + "/modules/Logger");

const templates = require(process.cwd() + "/templates/templates");
const GlobalLayout = require(process.cwd() + "/layouts/global/global");
const authPage = templates("pages/auth");

const Accounts = require("../modules/Model/Account");

/* Gets the main view for authentication, aka the login screen */
router.get("/", function(request, response)
{
    /* Checking to see if the session is already logged in */
    if (request.session.account)
    {
        response.redirect("/characters");
    }
    else
    {

        response.status(200).send(GlobalLayout(request, authPage(), [
            "/stylesheets/auth.css"
        ], [
            "/javascripts/built/auth-entry.js"
        ]));
    }
});

/* A request to login */
router.post("/login", function(request, response)
{
    const message = request.body;
    const session = request.session;
    if (session.account)
    {
        response.redirect("/characters");
    }

    /* The login info needed */
    const email = message.email;
    const password = message.password;

    Accounts.getAccountByEmail(email).then(function(account)
    {
        Logger.debug("Retr.Account:", account);

        Logger.debug("H.Pass.Len:", account.password.length);
        if (!account)
        {
            Logger.debug("Email sucked");
            response.status(400).send(JSON.stringify(
            {
                message: "Could not login with that email and password combination."
            }));
            return;
        }
        if (!account.verify(password))
        {
            Logger.debug("Password sucked");
            response.status(400).send(JSON.stringify(
            {
                message: "Could not login with that email and password combination."
            }));
            return;
        }
        session.account = account;
        response.status(200).send(JSON.stringify(
        {
            redirect: "/characters",
            message: "Success"
        }));
    });
});

/* If someone makes a request to logout, then they will be sent back to the main auth page */
router.get("/logout", function(request, response)
{
    const session = request.session;
    if (!session.account)
    {
        response.status(400).send(JSON.stringify(
        {
            message: "You are not logged into an account."
        }));
    }

    /* Setting the session's account to null */
    session.account = null;

    /* Redirecting back to authentication */
    response.redirect("/auth");
});

/* This is a request to create an account */
router.post("/create", function(request, response)
{
    const message = request.body;
    const session = request.session;

    if (session.account)
    {
        response.status(400).send(JSON.stringify(
        {
            message: "You are already logged into an account."
        }));
    }

    Logger.debug("Create: ", message);

    /* Needed Info to create an account */
    const username = message.username;
    const email = message.email;
    const password = message.password;

    Accounts.newAccount(username, email, password).then(function(account)
    {
        session.account = account;
        response.status(200).send(JSON.stringify(
        {
            redirect: "/characters",
            message: "Success"
        }));

    }).catch(function(error)
    {
        response.status(400).send(JSON.stringify(
        {
            message: error
        }));
    });
});

module.exports = router;
