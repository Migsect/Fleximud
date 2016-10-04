"use strict";

/* Task file for webpack bundling of files */

var gulp = require("gulp");
var named = require("vinyl-named");
var webpack = require("webpack-stream");

/* The target entry points of files*/
var targets = [
  process.cwd() + "/web_modules/entry/account.js",
  process.cwd() + "/web_modules/entry/index.js",
  process.cwd() + "/web_modules/entry/client.js",
  process.cwd() + "/web_modules/entry/create.js"
];

/* The folder were built files go*/
var buildFolder = process.cwd() + "/public/javascripts/built";

/* Webpacks loaders */
var loaders = [
{
  test: /\.html$/,
  loader: "handlebars-loader"
},
{
  test: /\.css$/,
  loader: "style!css"
}];

/* Normal singular webpack compilation */
gulp.task("webpack", function()
{
  return gulp.src(targets)
    .pipe(named())
    .pipe(webpack(
    {
      watch: false,
      module:
      {
        loaders: loaders,
      },
    }))
    .pipe(gulp.dest(buildFolder));
});

/* Webpack compilation with webpack's watch tag */
gulp.task("webpack:watch", function()
{
  return gulp.src(targets)
    .pipe(named())
    .pipe(webpack(
    {
      watch: true,
      module:
      {
        loaders: loaders,
      },
    }))
    .pipe(gulp.dest(buildFolder));
});
