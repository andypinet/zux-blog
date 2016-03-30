var gulp = require('gulp-param')(require('gulp'), process.argv);
var Build = require("./build/index");
var paths = {
	srcRoot: 'v1/',
	destRoot: 'www/'
};

Build({
	gulp: gulp,
	paths: paths
});

