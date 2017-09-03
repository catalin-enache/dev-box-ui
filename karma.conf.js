module.exports = function (config) {
  config.set({
    frameworks: ['browserify', 'mocha', 'chai'],
    preprocessors: {
      'src/**/*.spec.js': ['browserify']
    },
    files: ['src/**/*.spec.js'],
    reporters: ['mocha'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO, // LOG_DEBUG LOG_INFO
    browsers: ['mobile', 'desktop'],
    // browsers: ['Chrome', 'Safari'],
    // browsers: ['ChromeHeadless'],
    customLaunchers: {
      mobile: {
        base: 'Chrome',
        flags: ['--window-size=320,600']
      },
      desktop: {
        base: 'Chrome',
        flags: ['--window-size=1280,1080']
      }
    },
    autoWatch: false,
    singleRun: false,
    concurrency: Infinity,
    client: {
      // clearContext: true,
      mocha: {
        reporter: 'html', // change Karma's debug.html to the mocha web reporter
        checkLeaks: true,
        timeout: 2000
      }
    },
    browserify: {
      debug: true
    }
  });
};
