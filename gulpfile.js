const gulp = require("gulp");
const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");
const rename = require("gulp-rename");
const livereload = require("gulp-livereload");
const zip = require("gulp-zip");

// Paths
const paths = {
  css: {
    src: "assets/css/src/**/*.css",
    dest: "assets/css/",
    built: "assets/built/",
  },
  js: {
    src: "assets/js/**/*.js",
    dest: "assets/built/",
  },
  watch: {
    css: "assets/css/src/**/*.css",
    js: "assets/js/**/*.js",
    hbs: ["./**/*.hbs", "./partials/**/*.hbs"],
  },
  zip: {
    src: [
      "**",
      "!node_modules",
      "!node_modules/**",
      "!.git",
      "!.git/**",
      "!.DS_Store",
      "!gulpfile.js",
      "!assets/css/src",
      "!assets/css/src/**",
      "!.cursor",
      "!.cursor/**",
      "!.roo",
      "!.roo/**",
      "!tasks",
      "!tasks/**",
      "!scripts",
      "!scripts/**",
      "!ghost-local",
      "!ghost-local/**",
      "!*.log",
      "!.taskmasterconfig",
      "!.windsurfrules",
      "!.roomodes",
    ],
    dest: "dist/",
  },
};

// CSS task - Process Tailwind CSS
function css() {
  return gulp
    .src(paths.css.src)
    .pipe(sourcemaps.init())
    .pipe(postcss())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.css.dest))
    .pipe(gulp.dest(paths.css.built))
    .pipe(livereload());
}

// JavaScript task - Copy JS files to built directory
function js() {
  return gulp
    .src(paths.js.src)
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.js.dest))
    .pipe(livereload());
}

// Watch task
function watch() {
  livereload.listen();
  gulp.watch(paths.watch.css, css);
  gulp.watch(paths.watch.js, js);
  gulp.watch(paths.watch.hbs).on("change", livereload.changed);
}

// Build task for production
const build = gulp.parallel(css, js);

// Zip task for theme distribution
function zipTheme() {
  const targetDir = "dist/";
  const themeName = require("./package.json").name;
  const filename = themeName + ".zip";

  return gulp.src(paths.zip.src).pipe(zip(filename)).pipe(gulp.dest(targetDir));
}

// Lint task (placeholder for future linting setup)
function lint(cb) {
  console.log("Linting task - to be implemented with ESLint/Stylelint");
  cb();
}

// Development task
const dev = gulp.series(gulp.parallel(css, js), watch);

// Default task
const defaultTask = gulp.series(css, js);

// Export tasks
exports.css = css;
exports.js = js;
exports.watch = watch;
exports.dev = dev;
exports.build = build;
exports.zip = gulp.series(build, zipTheme);
exports.lint = lint;
exports.default = defaultTask;
