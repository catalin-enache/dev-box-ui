module.exports = function (config) {
  config.set({
    frameworks: ['browserify', 'mocha', 'chai'],
    preprocessors: {
      // 'src/**/*.spec.js': ['browserify']
      'test/tests.js': ['browserify']
    },
    // files: ['src/**/*.spec.js'],
    files: ['test/tests.js'],
    reporters: ['mocha', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO, // LOG_DEBUG LOG_INFO
    browsers: ['Chrome'],
    // browsers: ['mobile', 'desktop'],
    // browsers: ['Chrome', 'Safari'],
    // browsers: ['ChromesHeadless'],
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
    autoWatch: true,
    singleRun: false,
    concurrency: Infinity,
    coverageReporter: {
      dir: 'coverage',
      reporters: [
        { type: 'text' },
        { type: 'json', subdir: 'json', file: 'coverage.json' },
        { type: 'html', subdir: 'html' }
      ],
    },
    client: {
      // clearContext: true,
      mocha: {
        reporter: 'html', // change Karma's debug.html to the mocha web reporter
        checkLeaks: true,
        ignoreLeaks: false,
        timeout: 2000,
        // accepted global leaks defined here to prevent mocha global leaks error showing on iPad
        // https://stackoverflow.com/questions/8360318/global-leak-errors-in-mocha/10040921
        globals: [
          'getPasswordFormElement_',
          'addSubmitButtonTouchEndHandler_',
          'fillPasswordFormWithData_',
          'getCanonicalActionForForm_',
          'hasPasswordField_',
          'getSameOriginFrames_',
          'getPasswordFormDataList_',
          'onSubmitButtonTouchEnd_',
          'findInputByFieldIdentifier_',
          'getFormInputElements_',
          'viewport',
          'end_all_frames_injected',
          '*browserify*'
        ]
      }
    },
    browserify: {
      debug: true,
      transform: [
        'babelify'
      ]
    },
  });
};
