var Sass = require("./sass");
var Ts = require("./ts");
var System = require("./system");

var debounce = require('debounce');
var exec = require('child_process').exec;
var fileinclude = require('gulp-file-include');

var template = require('gulp-template');
var mustache = require("gulp-mustache");

module.exports = function(injectors) {
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

    Sass(injectors);
    Ts(injectors);
    System(injectors);

    injectors.gulp.task('build-angular-es', function(src, dest) {
        return injectors.gulp.src(src)
            .pipe(fileinclude({
                prefix: '@@',
                basepath: '@file'
            }))
            .pipe(injectors.gulp.dest(dest))
    });

    var zst = function(name, destpath) {
        "use strict";
        return debounce(function(){
            var src = injectors.paths.srcRoot + `${destpath}/${name}.js`;
            var dest = injectors.paths.destRoot + `${destpath}`;

            exec("gulp build-angular-es -d --src " + src + " --dest " + dest, function(err, stdout, stderr) {
                console.log(stdout);
                console.log(stderr);
            });
        }, 0);
    };

    injectors.gulp.task("watch-angular-js", function(name, dest) {
        dest = dest || '';
        injectors.gulp.watch(injectors.paths.srcRoot + `${dest}/${name}.js`, zst(name, dest))
    });

    injectors.gulp.task("build-template", function(src, dest, name) {
        var destpath = '';
        if (dest != '.' && dest != '') {
            destpath = dest + '/';
        }
        var mockdata = null;

        try {
            mockdata = require('../' + injectors.paths.srcRoot + `mockdata/${destpath}${name}`);
        } catch (e) {
            mockdata = {};
        }

        return injectors.gulp.src(src)
            .pipe(fileinclude({
                prefix: '@@',
                basepath: '@file'
            }))
            .pipe(mustache(mockdata, {
                tags: ['<<<', '>>>']
            }))
            .pipe(template({
                version: Date.now()
            }))
            .pipe(injectors.gulp.dest(dest));
    });

    var mtl = function(name, destpath) {
        "use strict";

        return debounce(function(){
            var src = injectors.paths.srcRoot + `${destpath}/${name}.html`;
            var dest = injectors.paths.destRoot + `${destpath}`;

            exec("gulp build-template -d --src " + src + " --dest " + dest + " --name " + name, function(err, stdout, stderr) {
                console.log(stdout);
                console.log(stderr);
            });
        }, 0);
    };

    injectors.gulp.task("watch-template", function(name, dest, watch){
        dest = dest || '';
        watch = watch || (dest + "/" + name);
        injectors.gulp.watch(injectors.paths.srcRoot + `${watch}.html`, mtl(name, dest));
    });

};