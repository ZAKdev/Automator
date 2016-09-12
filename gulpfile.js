var gulp = require("gulp"),
    watch = require("gulp-watch"),
    stylus = require('gulp-stylus'),
    nib    = require('nib'),
    jshint = require('gulp-jshint'),
    imagemin = require('gulp-imagemin'),
    connect = require("gulp-connect"),
    webshot = require('webshot'),
    config = require("./config.json");

gulp.task('connect', function() {
  connect.server({
    root: './',
    livereload: true,
    port: 8000
  });
});

gulp.task('html', function () {
  gulp.src(config.path+'/*.html')
    .pipe(connect.reload());
});

gulp.task('lint', function() {
  return gulp.src(config.path+'/js/*.js')
    .pipe(connect.reload())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('stylus', function () {
    return gulp.src(config.creative+'/assets/styl/*.styl')
        .pipe(stylus({
            compress: false,
            use: nib()
        }))
       .pipe(gulp.dest(config.creative+'/assets/css'))
       .pipe(connect.reload());
});

gulp.task('imagemin', function () {
    gulp.src([config.creative+'/assets/img/*.png', config.creative+'/assets/img/*.jpg', config.creative+'/assets/img/*.gif', config.creative+'/assets/img/*.jpeg'])
        .pipe(imagemin())
        .pipe(gulp.dest(config.creative+'/assets/img'))
});

gulp.task('watch', function() {
    gulp.watch(config.path+'/*.html', ['html']);
    gulp.watch(config.creative+'/assets/css/*.css', ['html']);
    gulp.watch(config.creative+'/assets/styl/*.styl', ['stylus']);
    gulp.watch(config.path+'/js/*.js', ['lint', 'html']);
});

gulp.task('screenshoot', function(){
    var options = {
        screenSize: {
          width: 320
        },
        renderDelay: "2000",
        quality: "90",
        userAgent: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us)'
          + ' AppleWebKit/531.21.20 (KHTML, like Gecko) Mobile/7B298g'
    };
    webshot(config.url, 'screenshots/'+config.name+'.png', options, function(err) {

    });
});

gulp.task('newcreative', function(){
    gulp.src('creatives/_template/assets/**/*', {base:"./creatives/_template/"})
    .pipe(gulp.dest(config.creative))

    gulp.src('creatives/_template/index.html')
    .pipe(gulp.dest(config.path))

    gulp.src('creatives/_template/main.js')
    .pipe(gulp.dest(config.path+'/js'))
});

gulp.task('start', ['connect', 'watch']);
gulp.task('compress', ['imagemin']);
gulp.task('shoot', ['screenshoot']);
gulp.task('new', ['newcreative']);