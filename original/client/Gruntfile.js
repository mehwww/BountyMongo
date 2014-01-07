module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');

    // body...
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            option: {
                atBegin: true,
                spawn: false
            },
            development:{
                files:['./app/assets/less/*.less','./app/scripts/**/*.js'],
                tasks: ['concat:development','less:development']
            }
//            less: {
//                files: './app/assets/less/*.less',
//                tasks: ['less:development']
//            },
//            concat: {
//                files: './app/scripts/**/*.js',
//                tasks: ['concat:development']
//            }
        },
        concat: {
            development: {
                src: './app/scripts/**/*.js',
                dest: './app/dist/script.js'
            }
        },
        less: {
            development: {
                files: {
                    './app/dist/style.css': 'app/assets/less/style.less'
                }
            }
        }
    });

    grunt.registerTask('default', ['less:development']);
    grunt.registerTask('watcher', ['watch:development']);
}