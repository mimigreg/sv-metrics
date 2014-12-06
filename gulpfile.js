var gulp    = require('gulp');
var traceur = require('gulp-traceur');
var connect = require('gulp-connect');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var mockMiddleware= require('./test/mock-middleware');

gulp.task('build', function () {
    return gulp.src(['app/**/*.js'])
        .pipe(sourcemaps.init())
        .pipe(
        	traceur(
            {
              modules: 'instantiate' // 'commonjs','register','inline','amd'
              //,sourceMaps: 'file'
        	  }))

        //.pipe(concat('all.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
  gulp.watch(['app/**/*.js'], ['build']);
});

// https://github.com/bradcerasani/html-skeleton-gulp/blob/master/gulpfile.js

gulp.task('connect', function() {
  connect.server({
    root: ['.'],
    livereload: true,
    port: 8000,
    middleware: function(connect, opt) {
      return [mockMiddleware]
    }
  });
});

gulp.task('dev', ['build', 'connect', 'watch']);
gulp.task('default', ['dev']);
