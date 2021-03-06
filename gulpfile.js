'use strict';

var gulp = require('gulp'),
    coffee = require('gulp-coffee'),
    coffeelint = require('gulp-coffeelint'),
    compass = require('gulp-compass'),
    w3cjs = require('gulp-w3cjs'),
    jshint = require('gulp-jshint'),
    clean = require('gulp-clean'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    changed = require('gulp-changed'),
    connect = require('gulp-connect'),
    size = require('gulp-size');

gulp.task('coffee', function() {
    return gulp.src('app/assets/coffeescript/**/*.coffee')
        .pipe(changed('app/assets/js/', { extension: '.js' }))
        .pipe(coffeelint({'indentation': {
            'name': 'indentation',
            'value': 4,
            'level': 'error'
        }}))
        .pipe(coffeelint.reporter())
        .pipe(coffee({bare: true}))
        .pipe(gulp.dest('app/assets/js/'))
        .pipe(gulp.dest('dist/assets/js/'))
        .pipe(size())
        .pipe(connect.reload());
});

gulp.task('w3cjs', function () {
    return gulp.src('app/*.html')
        .pipe(changed('dist'))
        .pipe(w3cjs())
        .pipe(size())
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
});

gulp.task('compass', function() {
    return gulp.src('app/assets/sass/**/*.scss')
        .pipe(compass({
            css: 'app/assets/css',
            sass: 'app/assets/sass',
            image: 'app/assets/images'
        }))
        .pipe(gulp.dest('dist/assets/css/'))
        .pipe(size())
        .pipe(connect.reload());
});

gulp.task('lint', function() {
    return gulp.src('gulpfile.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(size());
});

// Clean
gulp.task('clean', function() {
    return gulp.src(['dist', 'output', '.sass-cache', 'app/assets/js', 'app/assets/css'], {read: false})
        .pipe(clean());
});

// Images
gulp.task('images', function() {
    return gulp.src('app/assets/images/**/*')
        .pipe(changed('dist/assets/images'))
        .pipe(cache(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(connect.reload())
        .pipe(gulp.dest('dist/assets/images'));
});

// Connect
gulp.task('connect', connect.server({
    root: ['app'],
    port: 1337,
    livereload: true,
    open: {
        browser: 'chrome'
    }
}));

gulp.task('watch', ['connect'], function() {

    // Watch files and run tasks if they change
    gulp.watch('gulpfile.js', ['lint']);
    gulp.watch('app/assets/coffeescript/**/*.coffee', ['coffee']);
    gulp.watch('app/*.html', ['w3cjs']);
    gulp.watch('app/assets/sass/**/*.scss', ['compass']);
    gulp.watch('app/assets/images/**/*', ['images']);
});

// The default task (called when you run `gulp`)
gulp.task('default', ['clean', 'lint', 'watch']);
// Build
gulp.task('build', ['coffee', 'images', 'compass', 'w3cjs']);