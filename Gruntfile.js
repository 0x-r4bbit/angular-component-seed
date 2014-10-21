module.exports = function (grunt) {
  'use strict';

  require('load-grunt-tasks')(grunt);
  var _ = require('lodash');

  var karmaConfig = function(configFile, customOptions) {
    var options = { configFile: configFile, keepalive: true };
    var travisOptions = process.env.TRAVIS && { browsers: ['Firefox'], reporters: 'dots' };
    return _.extend(options, customOptions, travisOptions);
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('bower.json'),
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    watch: {
      scripts: {
        files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
        tasks: ['jshint', 'karma:unit']
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        eqeqeq: true,
        globals: {
          angular: true
        }
      }
    },
    concat: {
      js: {
        src: ['src/**/*.js'],
        dest: 'dist/angular-component-<%= pkg.version %>.js'
      },
      css: {
        src: ['src/**/*.css'],
        dest: 'dist/angular-component-<%= pkg.version %>.css'
      }
    },
    uglify: {
      src: {
        files: {
          'dist/angular-component-<%= pkg.version %>.min.js': '<%= concat.js.dest %>'
        }
      }
    },
    karma: {
      unit: {
        options: karmaConfig('karma.conf.js', {
          singleRun: true
        })
      },
      server: {
        options: karmaConfig('karma.conf.js', {
          singleRun: false
        })
      }
    },
    changelog: {
      options: {
        dest: 'CHANGELOG.md'
      }
    },
    ngmin: {
      src: {
        src: '<%= concat.js.dest %>',
        dest: '<%= concat.js.dest %>'
      }
    },
    cssmin: {
      css: {
        src: '<%= concat.css.dest %>',
        dest: 'dist/angular-component-<%= pkg.version %>.min.css'
      }
    },
    clean: ['dist/*']
  });

  grunt.registerTask('default', ['jshint', 'karma:unit']);
  grunt.registerTask('test', ['karma:unit']);
  grunt.registerTask('test-server', ['karma:server']);
  grunt.registerTask('build', ['clean', 'jshint', 'karma:unit', 'concat', 'ngmin', 'cssmin', 'uglify']);
};