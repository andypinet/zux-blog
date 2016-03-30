var sass = require('gulp-ruby-sass');

module.exports = function(injectors) {
    injectors.gulp.task("build-sass", function() {
        return sass(injectors.paths.srcRoot + '/sass/**/*.scss')
            .on('error', sass.logError)
            .pipe(injectors.gulp.dest(injectors.paths.destRoot + '/css/'));
    });

    injectors.gulp.task("watch-sass", function() {
        injectors.gulp.watch(injectors.paths.srcRoot + '/sass/**/*.scss', ["build-sass"]);
    });
};