"use strict";

var gulp = require("gulp");
var requireDir = require("require-dir");

requireDir("gulptasks");

gulp.task("default", ["start-server"]);
