"use strict";
module.exports = {
  entry:
  {
    account: "./web_modules/entry/account.js",
    index: "./web_modules/entry/index.js",
    client: "./web_modules/entry/client.js",
    create: "./web_modules/entry/create.js"
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
  }
};
