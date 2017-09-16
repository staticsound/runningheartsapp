{
  module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      concat: {
        build: {
          src: ['public/javascripts/**/*.js'],
          dest: 'src/<%= pkg.name %>.es6'
        },
        css: {
          src: ['public/stylesheets/**/*.css'],
          dest: 'src/<%= pkg.name %>.css'
        }
      },
      bower_concat: {
        build: {
          dest: {
            js: 'src/vendor.js',
            css: 'src/vendor.css'
          },
          dependencies: {
            'angular': 'jquery',
            'angular-material': 'angular'
          }
        }
      },
      browserify: {
        dist: {
          files: {
            // destination for transpiled js : source js
            'src/<%= pkg.name %>.js': 'src/<%= pkg.name %>.es6'
          },
          options: {
            transform: [
              ['babelify', {
                presets: 'es2015'
              }]
            ],
            browserifyOptions: {
              debug: true
            }
          }
        }
      },
      uglify: {
        build: {
          src: 'src/<%= pkg.name %>.js',
          dest: 'public/dist/<%= pkg.name %>.min.js'
        },
        vendor: {
          src: 'src/vendor.js',
          dest: 'public/dist/vendor.min.js'
        }
      },
      cssmin: {
        build: {
          files: {
            'public/dist/<%= pkg.name %>.min.css': ['src/<%= pkg.name %>.css'],
            'public/dist/vendor.min.css': ['src/vendor.css']
          }
        }
      },
      nodemon: {
        dev: {
          script: 'server.js',
          options: {
            ignore: ['src', 'public/javascripts', 'Gruntfile.js']
          }
        }
      },
      watch: {
        files: ['public/javascripts/**/*.js'],
        tasks: ['concat:build', 'browserify:dist', 'uglify:build']
      },
      concurrent: {
        dev: ['nodemon:dev', 'watch'],
        minify: ['uglify:build', 'uglify:vendor', 'cssmin:build'],
        options: {
          logConcurrentOutput: true
        }
      }
    });

    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-bower-concat');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    // Default task(s).
    grunt.registerTask('develop', ['concat:build', 'concat:css', 'bower_concat:build', 'browserify:dist',
      'concurrent:minify',
      'concurrent:dev'
    ]);

  };
}
