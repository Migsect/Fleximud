"use strict";

var gulp = require("gulp");
var beautify = require("gulp-jsbeautifier");

gulp.task("beautify", function()
{
  gulp.src("./**/*.js")
    .pipe(beautify(
    {
      indentSize: 2
    }))
    .pipe(gulp.dest("./build/"));
});
