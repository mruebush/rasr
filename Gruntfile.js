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
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= yeoman.app %>/js/**/*.js'
          ]
        }]
      }
    },
    watch: {
      coffee: {
        files: ['<%= yeoman.app %>/**/*.coffee'],
        tasks: ['clean:dist', 'newer:coffee']
      },
      compass: {
        files: ['<%= yeoman.app %>/compass/{,*/}*.{scss,sass}'],
        tasks: ['compass:server']
      },
      copy: {
        files: ['<%= yeoman.app %>/scripts/**/templates/*.html'],
        tasks: ['copy']
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
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>/scripts/core/templates',
          dest: '<%= yeoman.app %>/js/core/templates',
          src: '**'
        },
        {
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>/scripts/game/templates',
          dest: '<%= yeoman.app %>/js/game/templates',
          src: '**'
        },
        {
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>/scripts/edit/templates',
          dest: '<%= yeoman.app %>/js/edit/templates',
          src: '**'
        }]
      }
    },
    concat: {
      dist: {
        files: {
          'public/js/concat.js' : [
            'public/js/**/*.js'
          ]
        }
      }
    },
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'public/js',
          src: 'concat.js',
          dest: 'public/js'
        }]
      }
    },
    uglify: {
      dist: {
        files: {
          'public/js/rasr.min.js': [
            'public/js/concat.js'
          ]
        }
      }
    }

  });

  grunt.registerTask('build',[
    'clean:dist',
    'coffee',
    'concat',
    'ngmin',
    'uglify'
  ]);

  // grunt.registerTask('build', [
  //   'clean:dist',
  //   'coffee',
  //   'compass'
  // ]);
};