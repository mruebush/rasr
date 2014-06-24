/*jshint camelcase: false*/

module.exports = function (grunt) {
  'use strict';
  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  grunt.initConfig({
    yeoman: {
      app: 'public'
    },
    watch: {
      coffee: {
        files: ['<%= yeoman.app %>/**/*.coffee'],
        tasks: ['newer:coffee']
      },
      compass: {
        files: ['<%= yeoman.app %>/compass/{,*/}*.{scss,sass}'],
        tasks: ['compass:server']
      }
    },
    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        sassDir: '<%= yeoman.app %>/compass',
        cssDir: '<%= yeoman.app %>/styles',
        fontsDir: '<%= yeoman.app %>/styles/fonts',
        importPath: '<%= yeoman.app %>/bower_components',
        httpImagesPath: '/images',
        httpFontsPath: '/styles/fonts',
        relativeAssets: false,
        assetCacheBuster: false,
        raw: 'Sass::Script::Number.precision = 10\n'
      },
      server: {
        options: {
          debugInfo: true
        }
      }
    },
    coffee: {
      dist: {
        files: [{
          // rather than compiling multiple files here you should
          // require them into your main .coffee file
          expand: true,
          cwd: '<%= yeoman.app %>/scripts',
          src: ['app.coffee', '**/*.coffee'],
          dest: '<%= yeoman.app %>/js',
          ext: '.js'
        }]
      }
    }
  });

  grunt.registerTask('build', [
    'coffee',
    'compass'
  ]);
};