"use strict";

var gulp = require("gulp");
var named = require("vinyl-named");
var webpack = require("webpack-stream");
gulp.task("start-webpack", function()
{
  return gulp.src([
      process.cwd() + "/web_modules/entry/account.js",
      process.cwd() + "/web_modules/entry/index.js",
      process.cwd() + "/web_modules/entry/client.js",
      process.cwd() + "/web_modules/entry/create.js"
    ])
    .pipe(named())
    .pipe(webpack(
    {
      watch: true,
      module:
      {
        loaders: [
        {
          test: /\.html$/,
          loader: "handlebars-loader"
        },
        {
          test: /\.css$/,
          loader: "style!css"
        }],
      },
    }))
    .pipe(gulp.dest(process.cwd() + "/public/javascripts/built"));
});
