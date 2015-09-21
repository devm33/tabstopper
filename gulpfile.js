var d = require('gulp-debug');

/*jshint node:true*/
var gulp = require('gulp');

var $ = require('gulp-load-plugins')();
var es = require('event-stream');
var glob = require('glob');
var lazypipe = require('lazypipe');
var through = require('through');

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
    // .pipe(d, {title: 'js'})
    .pipe($.babel)
    .pipe($.ngAnnotate)
    .pipe($.uglify);

var bower = lazypipe()
    .pipe($.plumber);
    // .pipe(d, {title: 'bower'});
    // .pipe($.uglify, {compress: false});

/*
var templates = lazypipe()
    .pipe(d, {title: 'templates'})
    .pipe($.plumber)
    .pipe($.htmlmin)
    .pipe($.angularTemplatecache);

var addTemplates = lazypipe()
    .pipe($.plumber)
    .pipe(d, {title: 'add templates before'})
    .pipe($.addSrc, 'src/common/* * / *.html')
    .pipe(d, {title: 'add templates after'})
    .pipe(() => $.if(/html$/, templates()))
    .pipe(d, {title: 'should be templates and angular'});
*/

var addTemplatesIfAngular = () => {
    return through(write);

    function write(file) {
        if(file.isNull()) {
            return this.queue(file);
        }
        if(/angular/.test(file.path)) {
            console.log('angular detected!');
            // console.log(this);
            this.pause();
            gulp.src('src/common/**/*.html')
                .pipe(d({title:'templates'}))
                .pipe($.plumber())
                .pipe($.htmlmin())
                .pipe($.angularTemplatecache())
                .pipe(d({title:'should be templates.js'}))
                .pipe($.util.buffer((err, files) => {
                    files.forEach((file) => {
                        this.queue(file);
                    });
                    this.resume();
                }));
        }
        this.queue(file);
    }
};


gulp.task('js', (done) => glob('src/popup.html', (err, files) => {
    if(err) {
        done(err);
    }
    es.merge(files.map((file) => $.domSrc({
        file:file, selector:'script', attribute: 'src', cwd: 'src/'
    })
        .pipe($.plumber())
        .pipe($.if(/bower/, bower(), js()))
        .pipe(addTemplatesIfAngular())
        .pipe(d({title:'concatenating for '+file}))
        .pipe($.concat(file))
        .pipe($.rename({dirname:'', extname:'.js'}))
        .pipe(gulp.dest(dest))))
    .pipe(es.wait(() => done()));
}));

gulp.task('default', ['copy', 'html', 'js']);

gulp.task('clean', () => require('del')(dest));
