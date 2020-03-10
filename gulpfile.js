"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var less = require("gulp-less");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var svgstore = require('gulp-svgstore');
var svgmin = require('gulp-svgmin');
var path = require('path');
var inject = require('gulp-inject');
const webp = require('gulp-webp');
const del = require("del");
const fileinclude = require('gulp-file-include');
const imagemin = require('gulp-imagemin');
var csso = require('gulp-csso');
var uglify = require('gulp-uglify');

gulp.task('clean', function () {
  return del('./dist/**/*');
});

gulp.task("jsmin", function () {
  return gulp.src('source/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest("build/js"));
});

gulp.task('js', function () {
  gulp.src("source/json/*.*")
    .pipe(gulp.dest("build/js"))

  return gulp.src("source/js/*.*")
    .pipe(gulp.dest("build/js"))
});

gulp.task("files", function () {
  // gulp.src("source/favicon.ico")
  //   .pipe(gulp.dest("build/img"))

  gulp.src("source/img/*.*")
    // .pipe(imagemin())
    .pipe(gulp.dest("build/img"))

  gulp.src("source/fonts/*.*")
    .pipe(gulp.dest("build/fonts"))

  return gulp.src("source/*.html")
    .pipe(gulp.dest("build"))
});

gulp.task('webp', () => {
  gulp.src('source/img/*.jpg')
    .pipe(webp())
    .pipe(gulp.dest('build/img'));

  return gulp.src('source/img/*.png')
    .pipe(webp())
    .pipe(gulp.dest('build/img'))
});

gulp.task("css", function () {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("source/css"))
    .pipe(csso())
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/less/**/*.less", gulp.series("clean", "files", "js", "css", "html"));
  gulp.watch("source/*.html", gulp.series("clean", "files", "css", "js", "html"));
  gulp.watch("source/js/*.js", gulp.series("js"));
  gulp.watch("source/*.html").on("change", server.reload);
});

gulp.task('html', function () {
  var svgs = gulp
    .src('source/img/*.svg')
    .pipe(svgstore({ inlineSvg: true }));

  function fileContents(filePath, file) {
    return file.contents.toString();
  }

  return gulp
    .src('source/*.html')
    .pipe(inject(svgs, { transform: fileContents }))
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('build'));
});

gulp.task("start", gulp.series("files", "css", "html", "js", "server"));
gulp.task("build", gulp.series("clean", "files", "webp", "css", "jsmin", "html"));
