"use strict";

/* Tasks for starting the database, mongod needs to be in path */

var shell = require("gulp-shell");
var gulp = require("gulp");

gulp.task("database", shell.task(["mongod --dbpath ./data/"]));
