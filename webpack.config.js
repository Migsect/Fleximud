"use strict";

const path = require("path");

module.exports = {
    entry:
    {
        // account: "./web_modules/entry/account.js",
        // index: "./web_modules/entry/index.js",
        // client: "./web_modules/entry/client.js",
        // create: "./web_modules/entry/create.js",
        auth: "./web_modules/entry/auth.js",
        creation: "./web_modules/entry/creation.js"
    },
    output:
    {
        filename: "[name]-entry.js",
        path: __dirname + "/public/javascripts/built"
    },
    module:
    {
        rules: [
        {
            test: /\.hbs$/,
            loader: "handlebars-loader"
        },
        {
            test: /\.css$/,
            loader: "style!css"
        }]
    },
    resolve:
    {
        root: [
            path.resolve("./node_modules"),
            path.resolve("./web_modules"),
            path.resolve("./plugins")
        ],
        modulesDirectories: [
            "node_modules",
            "web_modules"
        ]
    }
};
