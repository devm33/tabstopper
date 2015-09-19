/*jshint node:true*/
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
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

gulp.task('lib', () => gulp.src('src/templates/*.html', base)
    .pipe($.angularTemplatecache())
    .pipe(gulp.src([
        'src/common/*.js',
        'src/bower/angular/angular.min.js',
        'src/bower/lodash/lodash.min.js']))
    .pipe($.ngAnnotate())
    .pipe($.uglify())
    .pipe($.concat('lib.js'))
    .pipe(gulp.dest(dest)));
