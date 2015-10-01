/*jshint node:true*/
var gulp = require('gulp');

var $ = require('gulp-load-plugins')();
var es = require('event-stream');
var glob = require('glob');
var lazypipe = require('lazypipe');

var base = {base: 'src/'};
var dest = 'extension';

gulp.task('copy', () => gulp.src([
    'src/manifest.json',
    'src/icon_128.png',
    'src/*.css'], base)
    .pipe(gulp.dest(dest)));

gulp.task('html', () => gulp.src('src/*.html', base)
    .pipe($.plumber())
    .pipe($.htmlReplace({js: {src: null, tpl: '<script src="%f.js"></script>'}}))
    .pipe($.htmlmin())
    .pipe(gulp.dest(dest)));

var js = lazypipe()
    .pipe($.plumber)
    .pipe($.babel)
    .pipe($.ngAnnotate)
    .pipe($.uglify);

var bower = lazypipe()
    .pipe($.plumber)
    .pipe($.uglify, {compress: false});

gulp.task('js', (done) => glob('src/*.html', (err, files) => {
    if(err) {
        done(err);
    }
    es.merge(files.map((file) => $.domSrc({
        file:file, selector:'script', attribute: 'src', cwd: 'src/',
    })
        .pipe($.plumber())
        .pipe($.if(/bower/, bower(), js()))
        .pipe($.ngTemplateStrings({cwd: 'src/'}))
        .pipe($.concat(file))
        .pipe($.rename({dirname:'', extname:'.js'}))
        .pipe(gulp.dest(dest))))
    .pipe(es.wait(() => done()));
}));

gulp.task('default', ['copy', 'html', 'js']);

gulp.task('clean', () => require('del')(dest));
