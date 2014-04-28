module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-supervisor');
  grunt.loadNpmTasks('grunt-shell');

  // body...
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concurrent: {
      options: {
        logConcurrentOutput: true
      },
      development: {
        tasks: ['watch:app', 'supervisor']
      }
    },
    watch: {
      options: { atBegin: true },
      app: {
        files: ['./less/style.less', './app/scripts/**/*.js', './app/**/*.html'],
        tasks: ['uglify:app', 'less:app']
      }
    },
    uglify: {
      options: {
        mangle: false,
        compress: false,
        beautify: true
      },
      app: {
        files: {
          './assets/dist/script.js': './app/scripts/**/*.js'
        }
      }
    },
    less: {
      app: {
        files: {
          './assets/dist/style.css': './less/style.less'
        }
      }
    },
    supervisor: {
      target: {
        script: "app.js",
        options: {
          watch: ['routes', 'lib', 'app.js']
        }
      }
    }
  });

//    grunt.registerTask('default', ['less:development']);
  grunt.registerTask('default', ['concurrent:development']);
  grunt.registerTask('deploy', ['uglify:app', 'less:app']);
}