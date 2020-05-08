const { src, dest, watch, series, parallel } = require('gulp');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const prefix = require('autoprefixer');
const minify = require('cssnano');
const pug = require('gulp-pug');
const browserSync = require('browser-sync');
const rollup = require('gulp-rollup');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const prettier = require('gulp-prettier');
// const log = require('fancy-log'); - debug purposes only

let target = null;
if (process.env.COMPILE_FOR === 'user') {
  target = 'user';
} else {
  target = 'admin';
}

const paths = {
  server: `dist/${target}`,
  dest: {
    input: `src/${target}`,
    ouput: `dist/${target}`,
    styles: {
      input: `src/${target}/scss/main.scss`,
      output: `dist/${target}/css`,
    },
    pug: {
      input: `src/${target}/pug/pages/*.pug`,
      output: `dist/${target}/`,
      base: `src/${target}/pug/pages`,
    },
    scripts: {
      input: `src/${target}/js/**/*.js`,
      output: `dist/${target}/js`,
    },
  },
};

// BUILD PUG TO HTML
const buildPug = (inputPath, outputPath, basePage) => {
  const process = src(inputPath, { base: basePage })
    .pipe(pug({ pretty: true }))
    .pipe(
      rename({
        extname: '.html',
      })
    )
    .pipe(dest(outputPath));

  return process;
};

// STYLE/CSS RELATED BUILDS
const buildStyles = (inputPath, outputPath) => {
  const process = src(inputPath)
    .pipe(sass())
    .pipe(postcss([prefix()]))
    .pipe(prettier())
    .pipe(dest(outputPath));

  return process;
};

// JS RELATED BUILDS
const buildScripts = (inputPath, outputPath) => {
  const process = src(inputPath)
    .pipe(
      rollup({
        input: `./src/${target}/js/main.js`,
        output: { format: 'iife' },
      })
    )
    .pipe(
      babel({
        presets: ['@babel/preset-env'],
      })
    )
    .pipe(prettier())
    .pipe(dest(outputPath));

  return process;
};

// BROWSER RELATED CONTROLS
const startServer = done => {
  browserSync.init({
    server: {
      baseDir: paths.server,
    },
  });

  done();
};

// ALL COMPILATION WILL BE CONDUCTED HERE
const userCompile = done => {
  const watching = watch(paths.dest.input);

  watching.on('all', () => {
    buildStyles(paths.dest.styles.input, paths.dest.styles.output);
    buildPug(paths.dest.pug.input, paths.dest.pug.output, paths.dest.pug.base);
    buildScripts(paths.dest.scripts.input, paths.dest.scripts.output);

    browserSync.reload();
  });
  done();
};

// MINIFY CSS
const uglyStyle = done => {
  src(`${paths.dest.styles.output}/main.css`)
    .pipe(rename({ suffix: '.min' }))
    .pipe(
      postcss([
        minify({
          discardComments: {
            removeAll: true,
          },
        }),
      ])
    )
    .pipe(dest(paths.dest.styles.output));

  done();
};

// MINIFY JS
const uglyScript = done => {
  src(`${paths.dest.scripts.output}/main.js`)
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(dest(paths.dest.scripts.output));

  done();
};

// INITIALIZE SERVER AND BUILD CODES
exports.ugly = series(uglyStyle, uglyScript);

exports.default = parallel(startServer, userCompile);
