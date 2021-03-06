module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-node-webkit-builder');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // body...
  grunt.initConfig({
    watch: {
      options: {
        atBegin: true,
        spawn: false
      },
      development: {
//        files: ['./index.html'],
        files: ['./**/*','!./node_modules/**/*'],
        tasks: ['nodewebkit'],
        options: {
          livereload: true
        }
      }
    },
    nodewebkit: {
      options: {
        build_dir: '../webkitbuilds', // Where the build version of my node-webkit app is saved
        mac: true, // We want to build it for mac
        win: true, // We want to build it for win
        linux32: false, // We don't need linux32
        linux64: false // We don't need linux64
      },
      src: ['./**/*'] // Your node-wekit app
    }
  })

  grunt.registerTask('default', ['watch:development']);
//  grunt.registerTask('default', ['nodewebkit']);
}