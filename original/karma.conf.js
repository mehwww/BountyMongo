// Karma configuration
// Generated on Sat Dec 21 2013 03:55:08 GMT+0800 (CST)

module.exports = function (config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: 'client),


    // frameworks to use
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'app/vendor/jquery/dist/jquery.js',
      'app/vendor/esprima/esprima.js',
      'app/vendor/underscore/underscore.js',
      'app/vendor/angular/angular.js',
      'app/vendor/angular-mocks/angular-mocks.js',
      'app/vendor/angular-bootstrap/ui-bootstrap.js',
      'app/vendor/angular-route/angular-route.js',
      'app/vendor/ace-builds/src-min-noconflict/ace.js',
      'app/vendor/angular-local-storage/angular-local-storage.js',
      'app/vendor/angular-ui-ace/ui-ace.js',
      'app/scripts/**/*.js',
      'app/partials/**/*.html',
      'test/unit/app/**/*.js'
    ],


    // list of files to exclude
    exclude: [

    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
    // - PhantomJS
    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
    browsers: ['Chrome'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
