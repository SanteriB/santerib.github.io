"use strict";

// Load plugins
const autoprefixer = require("autoprefixer");
const gulp = require("gulp");
const stylus = require("gulp-stylus");

// CSS task
function css() {
  return gulp
    .src("./src/styl/**/*.styl")
    .pipe(stylus({ outputStyle: "expanded" }))
    .pipe(gulp.dest("./dist/css/"))
    .pipe(gulp.dest("./dist/css/"));
}

// Transpile, concatenate and minify scripts
function scripts() {
  return (
    gulp
      .src(["./src/js/**/*"])
      .pipe(gulp.dest("./dist/js/"))
  );
}

// Watch files
function watchFiles() {
  gulp.watch("./src/styl/**/*", css);
  gulp.watch("./src/js/**/*", gulp.series(scripts));
}

// define complex tasks
const js = gulp.series(scripts);
const build = gulp.series(gulp.parallel(css, js));
const watch = gulp.parallel(watchFiles);

// export tasks
exports.css = css;
exports.js = js;
exports.watch = watch;