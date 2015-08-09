var babel = require("gulp-babel");
var concat = require('gulp-concat');
var del = require('del');
var gulp    = require('gulp');
var jshint = require('gulp-jshint');
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var tslint = require('gulp-tslint');
var webserver = require('gulp-webserver');

var tsProject = ts.createProject('tsconfig.json',{});

gulp.task('babel', function () {
    return gulp.src(['app/**/*.js'])
        .pipe(sourcemaps.init())
        .pipe(babel(
          {
            "modules":"system",
            "blacklist":["es6.forOf","es6.classes","es6.templateLiterals"] // ever green FF,CH
          }
        ))
        //.pipe(concat('all.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));
});

gulp.task('lint', function() {
   return gulp.src('app/**/*.js')
     .pipe(jshint())
     .pipe(jshint.reporter('default'));
 });

gulp.task('ts', ['clean-ts'], function() {
    var tsResult = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject));

    return tsResult.js
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('dist'));
});

gulp.task('serve', function() {

  var mockMiddleware= require('./test/mock-middleware'); // it is here because blocking (setInterval in Meters)

  gulp.src(['.'])
    .pipe(webserver({
      livereload: false,
      directoryListing: true,
      open: false,
      port: 8000,
      middleware: mockMiddleware
    }));
});

 gulp.task('ts-lint', function () {
    return gulp.src('app/**/*.ts')
    .pipe(tslint())
    .pipe(tslint.report('prose'));
});

gulp.task('clean-ts', function (cb) {
  var files = [
            'dist/**/*.js',
            'dist/*.js.map'
  ];
  del(files, cb);
});

gulp.task('default', ['ts-lint','ts']);
