/*jshint node:true*/
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var merge = require('merge-stream');
var dest = 'extension';
var base = {base: 'src/'};

gulp.task('copy', () => gulp.src([
    'src/manifest.json',
    'src/icon_128.jpg',
    'src/*.css'], base)
    .pipe(gulp.dest(dest)));

gulp.task('html', () => gulp.src('src/*.html', base)
    .pipe($.htmlReplace({js: 'lib.js'}))
    .pipe(gulp.dest(dest)));

gulp.task('js', () => gulp.src('src/*.js', base)
    .pipe($.ngAnnotate())
    .pipe($.uglify())
    .pipe(gulp.dest(dest)));


var d = require('gulp-debug');

gulp.task('lib', () => merge(
    gulp.src(['src/bower/angular/angular.min.js',
             'src/bower/lodash/lodash.min.js']),
    gulp.src('src/templates/*.html', base)
    .pipe(d({title:'should have zero'}))
    .pipe($.angularTemplatecache()),
    gulp.src('src/common/*.js')
    .pipe(d({title:'should have common'}))
    .pipe($.ngAnnotate()))
    .pipe($.order(['bower/*', '**/*']))
    .pipe($.concat('lib.js'))
    // .pipe($.uglify())
    .pipe(d({title:'should have lib.js'}))
    .pipe(gulp.dest(dest)));

gulp.task('default', ['copy', 'html', 'js', 'lib']);

gulp.task('clean', () => require('del')(dest));
