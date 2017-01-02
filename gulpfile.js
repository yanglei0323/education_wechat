var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var px2rem = require('gulp-px2rem-plugin');
var jshint = require('gulp-jshint');

var paths = {
  // sass: ['./scss/**/*.scss']
  sass: ['./www/css/scss/**/*.scss'],
  controllerJs: ['./www/js/controller/**/*.js'],
  serviceJs: ['./www/js/service/**/*.js']
};

gulp.task('default', ['sass', 'buildController', 'buildService']);

// 处理sass文件
gulp.task('sass', function (done) {
  gulp.src('./www/css/scss/ionic.app.scss')
      .pipe(plumber({errorHandler: notify.onError('Error: <%= error %>')}))
      .pipe(sass())
      .pipe(px2rem({'width_design': 375,'valid_num': 4,'pieces': 10}))
      // .pipe(minifyCss())
      // .pipe(rename({ extname: '.min.css' }))
      .pipe(gulp.dest('./www/css/'))
      .on('end', done);
});

// 处理controller文件
gulp.task('buildController', function () {
  return gulp.src('./www/js/controller/**/*.js')
      .pipe(jshint())
      .pipe(plumber())
      // .pipe(uglify())
      .pipe(concat('controllers.js'))
      .pipe(gulp.dest('./www/js'));
});
// 构建service文件
gulp.task('buildService', function () {
  return gulp.src('./www/js/service/**/*.js')
      .pipe(jshint())
      .pipe(plumber())
      // .pipe(uglify())
      .pipe(concat('services.js'))
      .pipe(gulp.dest('./www/js'));
});
// 监听任务
gulp.task('watch', ['sass', 'buildController', 'buildService'], function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.controllerJs, ['buildController']);
  gulp.watch(paths.serviceJs, ['buildService']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
