/*jshint node:true*/
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var merge = require('merge-stream');
var dest = 'extension';
var base = {base: 'src/'};

gulp.task('copy', () => gulp.src([
    'src/manifest.json',
    'src/icon_128.png',
    'src/*.css'], base)
    .pipe(gulp.dest(dest)));

gulp.task('html', () => gulp.src('src/*.html', base)
    .pipe($.plumber())
    .pipe($.htmlReplace({js: 'lib.js'}))
    .pipe(gulp.dest(dest)));

gulp.task('js', () => gulp.src('src/*.js', base)
    .pipe($.plumber())
    .pipe($.babel())
    .pipe($.ngAnnotate())
    .pipe($.uglify())
    .pipe(gulp.dest(dest)));


var d = require('gulp-debug');

gulp.task('lib', () => merge(
    gulp.src(['src/bower/angular/angular.min.js',
             'src/bower/lodash/lodash.min.js']),
    gulp.src('src/templates/*.html', base)
    .pipe($.plumber())
    .pipe($.angularTemplatecache()),
    gulp.src('src/common/*.js')
    .pipe($.plumber())
    .pipe($.babel())
    .pipe($.ngAnnotate()))
    .pipe($.plumber())
    .pipe(d({title:'before', minimal: false}))
    .pipe($.order(['bower/*', '**/*']))
    .pipe(d({title:'after', minimal:false}))
    .pipe($.concat('lib.js'))
    .pipe($.uglify())
    .pipe(gulp.dest(dest)));

gulp.task('default', ['copy', 'html', 'js', 'lib']);

gulp.task('clean', () => require('del')(dest));
