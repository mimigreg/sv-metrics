var gulp    = require('gulp');
var jshint = require('gulp-jshint');
var traceur = require('gulp-traceur');
var webserver = require('gulp-webserver');
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

gulp.task('serve', function() {
  gulp.src(['.'])
    .pipe(webserver({
      livereload: true,
      directoryListing: true,
      open: false,
      port: 8000,
      middleware: mockMiddleware
    }));
});

gulp.task('lint', function() {
   return gulp.src('app/**/*.js')
     .pipe(jshint())
     .pipe(jshint.reporter('default'));
 });

gulp.task('dev', ['build', 'serve', 'watch']);
gulp.task('default', ['dev']);
