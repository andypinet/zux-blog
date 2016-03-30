module.exports = function(injectors) {
    'use strict';

    let src = injectors.paths.srcRoot + '/app/**/*.js';
    let dest = injectors.paths.destRoot + '/app/';
    let watch = injectors.paths.srcRoot + '/app/**/*.js';

    injectors.gulp.task("build-ts", function() {
        return injectors.gulp.src(src)
            .pipe(injectors.gulp.dest(dest));
    });

    injectors.gulp.task("watch-ts", function() {
        injectors.gulp.watch(watch, ["build-ts"]);
    });
};