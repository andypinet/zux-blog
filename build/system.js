module.exports = function(injectors) {
    'use strict';

    var debounce = require('debounce');
    var exec = require('child_process').exec;

    const babel = require('gulp-babel');
    const browserify = require("gulp-browserify");
    const babelify = require("babelify");

    var es5 = browserify({
        transform: function(filename, opts){
            return babelify(filename, {
                presets: ['es2015', "react"],
                plugins: ['transform-regenerator']
            });
        }
    });

    let src = injectors.paths.srcRoot + '/lib/**/*.js';
    let dest = injectors.paths.destRoot + '/lib/';
    let watch = injectors.paths.srcRoot + '/lib/**/*.js';

    var mtl = function() {
        "use strict";

        return debounce(function(){
            exec("gulp build-system", function(err, stdout, stderr) {
                console.log(stdout);
                console.log(stderr);
            });
        }, 0);
    };

    injectors.gulp.task("build-system", function() {
        return injectors.gulp.src(src)
            .pipe(injectors.gulp.dest(dest));
    });

    injectors.gulp.task("watch-system", function() {
        injectors.gulp.watch(watch, mtl());
    });
};