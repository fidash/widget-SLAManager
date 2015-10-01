 module.exports = function(config) {
    "use strict";

    config.set({
      frameworks: ['jasmine', 'fixture'],
    
      singleRun: true,

      browsers: ['Firefox', 'Chrome'],

      files: [

        // Source code
        'src/js/SLAManager.js',

        // Spec files
        'src/test/js/*Spec.js'
      ],

      preprocessors: {
        'src/js/**/*.js': ['coverage']
      },

      exclude: [
        'src/js/main.js'
      ],

      plugins: [
        'karma-jasmine',
        'karma-firefox-launcher',
        'karma-chrome-launcher',
        'karma-phantomjs-launcher',
        'karma-fixture',
        'karma-junit-reporter',
        'karma-coverage'
      ],

      reporters: ['progress', 'junit', 'coverage'],

      junitReporter: {
        outputDir: 'build/test-reports'
      },

      coverageReporter: {
        reporters: [ 
          {
            type : 'html',
            dir : 'build/coverage/',
            subdir: 'html'
          },
          {
            type: 'cobertura',
            dir: 'build/coverage',
            subdir: 'xml'
          },
          {
            type: 'json',
            dir: 'build/coverage',
            subdir: 'json'
          },
          {
            type: 'text-summary'
          }
        ]
      }
    });
  };