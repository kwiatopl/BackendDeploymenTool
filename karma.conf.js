// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
<<<<<<< HEAD
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
=======
    frameworks: ['jasmine', '@angular/cli'],
>>>>>>> 0c2a2adb8bd934ddd6bac1e78c93cb3e55c7eda6
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
<<<<<<< HEAD
      require('@angular-devkit/build-angular/plugins/karma')
=======
      require('@angular/cli/plugins/karma')
>>>>>>> 0c2a2adb8bd934ddd6bac1e78c93cb3e55c7eda6
    ],
    client:{
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
<<<<<<< HEAD
      dir: require('path').join(__dirname, 'coverage'), reports: [ 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true
    },
    
=======
      reports: [ 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true
    },
    angularCli: {
      environment: 'dev'
    },
>>>>>>> 0c2a2adb8bd934ddd6bac1e78c93cb3e55c7eda6
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  });
};
