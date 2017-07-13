"use strict";

const express = require('express');
const router = express.Router();

// const Util = require('../modules/Util');
const Logger = require(process.cwd() + "/modules/Logger");

const templates = require(process.cwd() + "/templates/templates");
const GlobalLayout = require("./layouts/global/global");
const authPage = templates(__dirname + "/auth/auth");

const Account = require("../modules/Model/Account");

/* Gets the main view for authentication, aka the login screen */
router.get("/", (request, response) =>
{
    /* Checking to see if the session is already logged in */
    if (request.session.account)
    {
        response.redirect("/characters");
        return;
    }
    response.status(200).send(GlobalLayout(request, authPage(), [
        "/stylesheets/auth.css"
    ], [
        "/javascripts/built/auth-entry.js"
    ]));

});

/* A request to login */
router.post("/login", (request, response) =>
{
    const message = request.body;
    const session = request.session;
    if (session.account)
    {
        response.redirect("/characters");
        return;
    }

    /* The login info needed */
    const email = message.email;
    const password = message.password;

    Account.getAccountByEmail(email)
        .then(account =>
        {
            Logger.debug("Retr.Account:", account);

            Logger.debug("H.Pass.Len:", account.password.length);
            if (!account)
            {
                Logger.debug("Email sucked");
                response.status(400).json(
                {
                    message: "Could not login with that email and password combination."
                });
                return;
            }
            if (!account.verify(password))
            {
                Logger.debug("Password sucked");
                response.status(400).json(
                {
                    message: "Could not login with that email and password combination."
                });
                return;
            }
            session.account = account;
            response.status(200).json(
            {
                redirect: "/characters",
                message: "Success"
            });

        })
        .catch((error) =>
        {
            Logger.error("POST /auth/login", error);
            response.status(500).json(
            {
                message: "Internal Server Error"
            });
        });
});

/* If someone makes a request to logout, then they will be sent back to the main auth page */
router.get("/logout", (request, response) =>
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
router.post("/create", (request, response) =>
{
    const message = request.body;
    const session = request.session;

    if (session.account)
    {
        response.status(400).json(
        {
            message: "You are already logged into an account."
        });
    }

    Logger.debug("Create: ", message);

    /* Needed Info to create an account */
    const username = message.username;
    const email = message.email;
    const password = message.password;

    Account.createAccount(username, email, password).then(account =>
    {
        if (!account)
        {
            response.status(400).send(JSON.stringify(
            {
                message: "Account could not be created"
            }));
            return;
        }
        session.account = account;
        Logger.debug("Cooled down Account:", account);
        response.status(200).send(JSON.stringify(
        {
            redirect: "/characters",
            message: "Success"
        }));

    }).catch(error =>
    {
        Logger.error("POST /auth/create", error);
        response.status(500).json(
        {
            message: "Internal Server Error"
        });
    });
});

module.exports = router;
