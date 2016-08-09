"use strict";

var shell = require("gulp-shell");
var gulp = require("gulp");

gulp.task("start-db", shell.task(["mongod --dbpath ./data/"]));
