var fs = require('fs');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var babel = require('babel-core');
var rollup = require('rollup');
var commonjs = require('rollup-plugin-commonjs');
var nodeResolve = require('rollup-plugin-node-resolve');

gulp.task('build-loose', function() {
  return rollup.rollup({
    entry: 'index.js',
  }).then(function (bundle) {
    var result = bundle.generate({
      format: 'cjs',
      //moduleName: 'jFactory',
    });
    var res = babel.transform(result.code, {
      "presets": [
        'stage-0',
        "es2015-loose",
      ],
      "plugins": [
        "transform-runtime"
      ]
    });
    try {
      fs.mkdirSync('./.build');
    } catch(e) {}
    fs.writeFileSync('./.build/jFactory-loose.js', res.code );
    return rollup.rollup({
      entry: './.build/jFactory-loose.js',
      plugins: [
        nodeResolve({}),
        commonjs({
          include: ['node_modules/**', './.build/**'],  // Default: undefined
        })
      ]
    }).then(function(bundle){
      bundle.write({
        dest: './dist/jFactory-loose.js',
        format: 'umd',
        moduleName: 'jFactory',
      });
    });
  });
});

gulp.task('build-normal', function() {
  return rollup.rollup({
    entry: 'index.js',
  }).then(function (bundle) {
    var result = bundle.generate({
      format: 'cjs',
    });
    var res = babel.transform(result.code, {
      "presets": [
        'stage-0',
        "es2015-loose",
      ]
    });
    try {
      fs.mkdirSync('./.build');
    } catch(e) {}
    fs.writeFileSync('./.build/jFactory.js', res.code );
    return rollup.rollup({
      entry: './.build/jFactory.js',
      plugins: [
        nodeResolve({}),
        commonjs({
          include: ['node_modules/**', './.build/**'],  // Default: undefined
        })
      ]
    }).then(function(bundle){
      bundle.write({
        dest: './dist/jFactory.js',
        format: 'umd',
        moduleName: 'jFactory',
      });
    });
  });
});

gulp.task('jsmin', ['build-normal', 'build-loose'], function () {
    gulp.src('dist/{jFactory,jFactory-loose}.js')
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/'));
});

gulp.task('build', ['jsmin']);
