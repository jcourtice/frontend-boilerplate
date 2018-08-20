var gulp = require('gulp');
var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');
var concat = require('gulp-concat');
var autoprefixer =  require('autoprefixer');
var plumber = require('gulp-plumber');
var sourceMaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var del = require('del');
var postcss = require('gulp-postcss');

// File paths
var destPath = 'web';
var scriptsPath = 'src/scripts/**/*.js';
var scssPath = 'src/scss/**/*.scss';
var imagesPath = 'src/images/**/*.{png,jpeg,jpg,svg,gif}';

// Image compression
var imagemin = require('gulp-imagemin');
var imageminPngquant = require('imagemin-pngquant');
var imageminJpegRecompress = require('imagemin-jpeg-recompress');

// Styles for SASS
gulp.task('sass', function () {
  console.log('Starting styles task.');
  return gulp.src('src/scss/styles.scss')
    .pipe(plumber(function (err) {
      console.log('Styles task error');
      console.log(err);
      this.emit('end');
    }))
    .pipe(sourceMaps.init())
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(postcss([autoprefixer({browsers: ['last 2 versions']})]))
    .pipe(sourceMaps.write())
    .pipe(gulp.dest(destPath))
    .pipe(livereload());
});

// Scripts
gulp.task('scripts', function () {
  console.log('Starting scripts task.');
  return gulp.src(scriptsPath)
    .pipe(plumber(function (err) {
      console.log('Scripts task error');
      console.log(err);
      this.emit('end');
    }))
    .pipe(sourceMaps.init())
    .pipe(uglify())
    .pipe(concat('scripts.js'))
    .pipe(sourceMaps.write())
    .pipe(gulp.dest(destPath))
    .pipe(livereload());
});

// Images
gulp.task('images', function () {
  return gulp.src(imagesPath)
    .pipe(imagemin([
      imagemin.gifsicle(),
      imagemin.jpegtran(),
      imagemin.optipng(),
      imagemin.svgo(),
      imageminPngquant(),
      imageminJpegRecompress()
    ]))
    .pipe(gulp.dest(destPath + '/images'))
});

// Watch
gulp.task('watch', ['default'], function () {
  console.log('Starting watch task.');
  require('./server.js');
  livereload.listen();
  gulp.watch(scriptsPath, ['scripts']);
  gulp.watch(scssPath, ['sass']);
});

// Clean
gulp.task('clean', function () {
  return del.sync([
    destPath
  ])
});

// Default
gulp.task('default', ['clean', 'images', 'sass', 'scripts'], function () {
  console.log('Starting default task.');
});