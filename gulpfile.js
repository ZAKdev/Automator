var gulp = require("gulp"),
    watch = require("gulp-watch"),
    stylus = require('gulp-stylus'),
    nib    = require('nib'),
    jshint = require('gulp-jshint'),
    imagemin = require('gulp-imagemin'),
    connect = require("gulp-connect"),
    webshot = require('webshot'),
    prompt = require('prompt');

gulp.task('connect', function() {
  connect.server({
    root: './',
    livereload: true,
    port: 8000
  });
});

gulp.task('html', function () {
  gulp.src('creatives/**/*.html')
    .pipe(connect.reload());
});

gulp.task('lint', function() {
  return gulp.src('creatives/**/*.js')
    .pipe(connect.reload())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('stylus', function () {
    return gulp.src('creatives/**/*.styl')
        .pipe(stylus({
            compress: false,
            use: nib()
        }))
       .pipe(gulp.dest('creatives'))
       .pipe(connect.reload());
});

gulp.task('imagemin', function () {
    gulp.src(['creatives/**/*.png', 'creatives/**/*.jpg', 'creatives/**/*.gif', 'creatives/**/*.jpeg'])
        .pipe(imagemin())
        .pipe(gulp.dest('creatives'))
});

gulp.task('watch', function() {
    gulp.watch(['creatives/**/*.html'], ['html']);
    gulp.watch(['creatives/**/*.css'], ['html']);
    gulp.watch('creatives/**/*.styl', ['stylus']);
    gulp.watch('creatives/**/*.js', ['lint']);
});

gulp.task('promt', function(){
    prompt.start();
    prompt.get(['url'], function (err, result) {
        var options = {
            screenSize: {
              width: 320,
              height: 568
            },
            userAgent: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us)'
              + ' AppleWebKit/531.21.20 (KHTML, like Gecko) Mobile/7B298g'
        }
        webshot(result.url, 'screenshots/mobile.png', options, function(err) {
            // screenshot now saved to google.png
        });
    });
});

gulp.task('start', ['connect', 'watch']);
gulp.task('compress', ['imagemin']);
gulp.task('shot', ['promt']);