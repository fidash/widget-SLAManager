/*!
 *   Copyright 2014-2015 CoNWeT Lab., Universidad Politecnica de Madrid
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */


module.exports = function (grunt) {

    'use strict';

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        isDev: grunt.option('target') === 'release' ? '' : '-dev',

        copy: {
            main: {
                files: [
                    {expand: true, cwd: 'src/js', src: '*', dest: 'build/src/js'},
                    {expand: true, src: ['**/*', '!test/**'], dest: 'build/wgt', cwd: 'src'},
                    {expand: true, src: ['jquery.min.map', 'jquery.min.js'], dest: 'build/wgt/lib/js', cwd: 'node_modules/jquery/dist'},
                    {expand: true, src: ['bootstrap.min.css', 'bootstrap.css.map', 'bootstrap-theme.min.css', 'bootstrap-theme.css.map'], dest: 'build/wgt/lib/css', cwd: 'node_modules/bootstrap/dist/css'},
                    {expand: true, src: ['bootstrap.min.js'], dest: 'build/wgt/lib/js', cwd: 'node_modules/bootstrap/dist/js'},
                    {expand: true, src: ['*'], dest: 'build/wgt/lib/fonts', cwd: 'node_modules/bootstrap/dist/fonts'},
                    {expand: true, src: ['css/jquery.dataTables.min.css', 'js/jquery.dataTables.min.js', 'images/*'], dest: 'build/wgt/lib', cwd: 'node_modules/datatables/media'},
                    {expand: true, src: ['css/font-awesome.min.css', 'fonts/*'], dest: 'build/wgt/lib', cwd: 'node_modules/font-awesome'}
                ]
            }
        },

        strip_code: {
            multiple_files: {
                src: ['build/src/js/**/*.js']
            }
        },

        compress: {
            widget: {
                options: {
                  archive: 'build/<%= pkg.vendor %>_<%= pkg.name %>_<%= pkg.version %><%= isDev %>.wgt',
                  mode: 'zip',
                  level: 9,
                  pretty: true
                },
                files: [
                    {expand: true, src: ['**/*'], cwd: 'build/wgt'}
                ]
            }
        },
        clean: {
            build: {
                src: ['build']
            },
            temp: {
                src: ['build/src']
            }
        },

        replace: {
            version: {
                overwrite: true,
                src: ['src/config.xml'],
                replacements: [{
                    from: /version=\"[0-9]+\.[0-9]+\.[0-9]+(-dev)?\"/g,
                    to: 'version="<%= pkg.version %>"'
                }]
            }
        },

        jscs: {
            src: 'src/js/**/*',
            options: {
                config: ".jscsrc"
            }
        },

        jshint: {
            options: {
                jshintrc: true
            },
            all: {
                files: {
                    src: ['src/js/**/*.js']
                }
            },
            grunt: {
                options: {
                    jshintrc: '.jshintrc-node'
                },
                files: {
                    src: ['Gruntfile.js']
                }
            },
            test: {
                options: {
                    jshintrc: '.jshintrc-jasmine'
                },
                files: {
                    src: ['src/test/**/*.js', '!src/test/fixtures/']
                }
            }
        },

        karma: {
          headless: {
            configFile: 'karma.conf.js',
            options: {
              browsers: ['PhantomJS']
            }
          },

          all: {
            configFile: 'karma.conf.js'
          },

          debug: {
            configFile: 'karma.conf.js',
            options: {
              preprocessors: [],
              singleRun: false
            }
          }
        },

    });

    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks("grunt-jscs");
    grunt.loadNpmTasks('grunt-strip-code');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('test', [
        'jshint:grunt',
        'jshint',
        'jscs',
        'karma:headless'
    ]);

    grunt.registerTask('default', [
        'test',
        'clean:temp',
        'copy:main',
        'strip_code',
        'replace:version',
        'compress:widget'
    ]);

};
