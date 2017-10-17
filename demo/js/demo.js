(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
  Copyright (c) 2016 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				classes.push(classNames.apply(null, arg));
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		// register as 'classnames', consistent with npm package name
		define('classnames', [], function () {
			return classNames;
		});
	} else {
		window.classNames = classNames;
	}
}());

},{}],2:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],3:[function(require,module,exports){
(function (process){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _devBoxUi = require('dev-box-ui');

var _screens = require('./screens');

var _screens2 = _interopRequireDefault(_screens);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const style = ({ vars }) => {
  return {
    sectionLinks: {
      float: 'left'
    },
    sectionScreen: {
      float: 'left'
    }
  };
};

class App extends _react2.default.Component {
  componentDidMount() {
    window.addEventListener('hashchange', this.onHashChange.bind(this));
  }

  onHashChange() {
    this.forceUpdate();
  }

  render() {
    if (process.env.NODE_ENV !== 'production') {
      /* eslint no-console: 0 */
      // console.log('rendering App component');
    }
    const screensKeys = Object.keys(_screens2.default);
    const links = _react2.default.createElement(
      'ul',
      null,
      screensKeys.map((screen, idx) => _react2.default.createElement(
        'li',
        { key: idx },
        _react2.default.createElement(
          'a',
          { key: idx, href: `#${screen}` },
          screen
        )
      ))
    );
    const Screen = _screens2.default[(window.location.hash || `#${screensKeys[0]}`).replace('#', '')];
    const {
      classes: {
        sectionLinks, sectionScreen
      },
      theme: {
        common: {
          row, col, m3, m9, l6, xl3, xl9, xs3, xs9, s6
        }
      } } = this.props;

    if (!Screen) {
      return null;
    }

    return _react2.default.createElement(
      'div',
      { className: (0, _classnames2.default)({
          [row]: true
        }) },
      _react2.default.createElement(
        'div',
        { className: (0, _classnames2.default)({
            [col]: true,
            [m3]: true,
            [l6]: true,
            [xl9]: true,
            [xs9]: true,
            [s6]: true
          }) },
        links
      ),
      _react2.default.createElement(
        'div',
        { className: (0, _classnames2.default)({
            [col]: true,
            [m9]: true,
            [l6]: true,
            [xl3]: true,
            [xs3]: true,
            [s6]: true
          }) },
        _react2.default.createElement(Screen, null)
      )
    );
  }
}

App.propTypes = {
  classes: _propTypes2.default.object,
  theme: _propTypes2.default.object
};

exports.default = (0, _devBoxUi.themeAware)({ style })(App);

}).call(this,require('_process'))

},{"./screens":8,"_process":2,"classnames":1,"dev-box-ui":"dev-box-ui","prop-types":"prop-types","react":"react"}],4:[function(require,module,exports){
(function (process){
'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _devBoxUi = require('dev-box-ui');

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const currentTheme = (0, _devBoxUi.theme)(_devBoxUi.themeVars);

// onScreenConsole();

const { ThemeProvider } = _devBoxUi.theming;

let Demo = class Demo extends _react2.default.Component {
  render() {
    if (process.env.NODE_ENV !== 'production') {
      /* eslint no-console: 0 */
      // console.log('rendering Demo component');
    }
    const { locale: { dir } } = this.props;
    return _react2.default.createElement(
      ThemeProvider,
      { theme: currentTheme[dir] },
      _react2.default.createElement(_app2.default, null)
    );
  }
};

Demo.propTypes = {
  locale: _propTypes2.default.object
};

Demo = (0, _devBoxUi.localeAware)(Demo);

_reactDom2.default.render(_react2.default.createElement(Demo, null), document.getElementById('demo'));

}).call(this,require('_process'))

},{"./app":3,"_process":2,"dev-box-ui":"dev-box-ui","prop-types":"prop-types","react":"react","react-dom":"react-dom"}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _devBoxUi = require('dev-box-ui');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const style = ({ vars }) => {
  return {
    screen: {
      color: vars.colors.primaryTextColor || 'orange'
    },
    formInputNumber: {
      '&:focus': {
        color: 'red',
        boxShadow: '3px 3px 3px #888888'
      }
    }
  };
};

class FormInputNumberScreen extends _react2.default.Component {
  render() {
    const { theme, classes } = this.props;
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(_devBoxUi.FormInputNumber, { inputExtraClasses: [theme.common.withoutBorderBottomLeftRadius, classes.formInputNumber] })
    );
  }
}

exports.default = (0, _devBoxUi.themeAware)({ style })(FormInputNumberScreen);

},{"dev-box-ui":"dev-box-ui","react":"react"}],6:[function(require,module,exports){
(function (process){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _devBoxUi = require('dev-box-ui');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const style = ({ vars }) => {
  return {
    screen: {
      color: vars.colors.primaryTextColor || 'orange'
    }
  };
};

class HelloScreen extends _react2.default.Component {
  render() {
    if (process.env.NODE_ENV !== 'production') {
      /* eslint no-console: 0 */
      // console.log('rendering HelloScreen component');
    }
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(_devBoxUi.Hello, null)
    );
  }
}

exports.default = (0, _devBoxUi.themeAware)({ style })(HelloScreen);

}).call(this,require('_process'))

},{"_process":2,"dev-box-ui":"dev-box-ui","react":"react"}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _devBoxUi = require('dev-box-ui');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const style = ({ vars }) => {
  return {
    screen: {
      color: vars.colors.primaryTextColor || 'orange'
    }
  };
};

class ListScreen extends _react2.default.Component {
  render() {
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(_devBoxUi.List, { items: ['three', 'four'] }),
      _react2.default.createElement(_devBoxUi.List, { items: ['three', 'four'] })
    );
  }
}

exports.default = (0, _devBoxUi.themeAware)({ style })(ListScreen);

},{"dev-box-ui":"dev-box-ui","react":"react"}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _HelloScreen = require('./HelloScreen');

var _HelloScreen2 = _interopRequireDefault(_HelloScreen);

var _ListScreen = require('./ListScreen');

var _ListScreen2 = _interopRequireDefault(_ListScreen);

var _FormInputNumberScreen = require('./FormInputNumberScreen');

var _FormInputNumberScreen2 = _interopRequireDefault(_FormInputNumberScreen);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  HelloScreen: _HelloScreen2.default,
  ListScreen: _ListScreen2.default,
  FormInputNumberScreen: _FormInputNumberScreen2.default
};

},{"./FormInputNumberScreen":5,"./HelloScreen":6,"./ListScreen":7}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY2xhc3NuYW1lcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJzcmNEZW1vL2FwcC5qcyIsInNyY0RlbW8vZGVtby5qcyIsInNyY0RlbW8vc2NyZWVucy9Gb3JtSW5wdXROdW1iZXJTY3JlZW4uanMiLCJzcmNEZW1vL3NjcmVlbnMvSGVsbG9TY3JlZW4uanMiLCJzcmNEZW1vL3NjcmVlbnMvTGlzdFNjcmVlbi5qcyIsInNyY0RlbW8vc2NyZWVucy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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NUJmOzs7O0FBQ0E7Ozs7QUFLQSxNQUFNLFFBQVEsQ0FBQyxFQUFFLElBQUYsRUFBRCxLQUFjO0FBQzFCLFNBQU87QUFDTCxZQUFRO0FBQ04sYUFBTyxLQUFLLE1BQUwsQ0FBWSxnQkFBWixJQUFnQztBQURqQztBQURILEdBQVA7QUFLRCxDQU5EOztBQVFBLE1BQU0sVUFBTixTQUF5QixnQkFBTSxTQUEvQixDQUF5QztBQUN2QyxXQUFTO0FBQ1AsV0FDRTtBQUFBO0FBQUE7QUFDRSxzREFBTSxPQUFPLENBQUMsT0FBRCxFQUFVLE1BQVYsQ0FBYixHQURGO0FBRUUsc0RBQU0sT0FBTyxDQUFDLE9BQUQsRUFBVSxNQUFWLENBQWI7QUFGRixLQURGO0FBTUQ7QUFSc0M7O2tCQVcxQiwwQkFBVyxFQUFFLEtBQUYsRUFBWCxFQUFzQixVQUF0QixDOzs7Ozs7Ozs7QUN6QmY7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7a0JBRWU7QUFDYixvQ0FEYTtBQUViLGtDQUZhO0FBR2I7QUFIYSxDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIVxuICBDb3B5cmlnaHQgKGMpIDIwMTYgSmVkIFdhdHNvbi5cbiAgTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlIChNSVQpLCBzZWVcbiAgaHR0cDovL2plZHdhdHNvbi5naXRodWIuaW8vY2xhc3NuYW1lc1xuKi9cbi8qIGdsb2JhbCBkZWZpbmUgKi9cblxuKGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBoYXNPd24gPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuXHRmdW5jdGlvbiBjbGFzc05hbWVzICgpIHtcblx0XHR2YXIgY2xhc3NlcyA9IFtdO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBhcmcgPSBhcmd1bWVudHNbaV07XG5cdFx0XHRpZiAoIWFyZykgY29udGludWU7XG5cblx0XHRcdHZhciBhcmdUeXBlID0gdHlwZW9mIGFyZztcblxuXHRcdFx0aWYgKGFyZ1R5cGUgPT09ICdzdHJpbmcnIHx8IGFyZ1R5cGUgPT09ICdudW1iZXInKSB7XG5cdFx0XHRcdGNsYXNzZXMucHVzaChhcmcpO1xuXHRcdFx0fSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGFyZykpIHtcblx0XHRcdFx0Y2xhc3Nlcy5wdXNoKGNsYXNzTmFtZXMuYXBwbHkobnVsbCwgYXJnKSk7XG5cdFx0XHR9IGVsc2UgaWYgKGFyZ1R5cGUgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdGZvciAodmFyIGtleSBpbiBhcmcpIHtcblx0XHRcdFx0XHRpZiAoaGFzT3duLmNhbGwoYXJnLCBrZXkpICYmIGFyZ1trZXldKSB7XG5cdFx0XHRcdFx0XHRjbGFzc2VzLnB1c2goa2V5KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gY2xhc3Nlcy5qb2luKCcgJyk7XG5cdH1cblxuXHRpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGNsYXNzTmFtZXM7XG5cdH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCA9PT0gJ29iamVjdCcgJiYgZGVmaW5lLmFtZCkge1xuXHRcdC8vIHJlZ2lzdGVyIGFzICdjbGFzc25hbWVzJywgY29uc2lzdGVudCB3aXRoIG5wbSBwYWNrYWdlIG5hbWVcblx0XHRkZWZpbmUoJ2NsYXNzbmFtZXMnLCBbXSwgZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIGNsYXNzTmFtZXM7XG5cdFx0fSk7XG5cdH0gZWxzZSB7XG5cdFx0d2luZG93LmNsYXNzTmFtZXMgPSBjbGFzc05hbWVzO1xuXHR9XG59KCkpO1xuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IGNuIGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IHsgdGhlbWVBd2FyZSB9IGZyb20gJ2Rldi1ib3gtdWknO1xuaW1wb3J0IHNjcmVlbnMgZnJvbSAnLi9zY3JlZW5zJztcblxuY29uc3Qgc3R5bGUgPSAoeyB2YXJzIH0pID0+IHtcbiAgcmV0dXJuIHtcbiAgICBzZWN0aW9uTGlua3M6IHtcbiAgICAgIGZsb2F0OiAnbGVmdCdcbiAgICB9LFxuICAgIHNlY3Rpb25TY3JlZW46IHtcbiAgICAgIGZsb2F0OiAnbGVmdCdcbiAgICB9XG4gIH07XG59O1xuXG5jbGFzcyBBcHAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsIHRoaXMub25IYXNoQ2hhbmdlLmJpbmQodGhpcykpO1xuICB9XG5cbiAgb25IYXNoQ2hhbmdlKCkge1xuICAgIHRoaXMuZm9yY2VVcGRhdGUoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgLyogZXNsaW50IG5vLWNvbnNvbGU6IDAgKi9cbiAgICAgIC8vIGNvbnNvbGUubG9nKCdyZW5kZXJpbmcgQXBwIGNvbXBvbmVudCcpO1xuICAgIH1cbiAgICBjb25zdCBzY3JlZW5zS2V5cyA9IE9iamVjdC5rZXlzKHNjcmVlbnMpO1xuICAgIGNvbnN0IGxpbmtzID0gPHVsPlxuICAgICAge1xuICAgICAgICBzY3JlZW5zS2V5cy5tYXAoKHNjcmVlbiwgaWR4KSA9PiAoXG4gICAgICAgICAgPGxpIGtleT17aWR4fT5cbiAgICAgICAgICAgIDxhIGtleT17aWR4fSBocmVmPXtgIyR7c2NyZWVufWB9PntzY3JlZW59PC9hPlxuICAgICAgICAgIDwvbGk+XG4gICAgICAgICkpXG4gICAgICB9XG4gICAgPC91bD47XG4gICAgY29uc3QgU2NyZWVuID0gc2NyZWVuc1sod2luZG93LmxvY2F0aW9uLmhhc2ggfHwgYCMke3NjcmVlbnNLZXlzWzBdfWApLnJlcGxhY2UoJyMnLCAnJyldO1xuICAgIGNvbnN0IHtcbiAgICAgIGNsYXNzZXM6IHtcbiAgICAgICAgc2VjdGlvbkxpbmtzLCBzZWN0aW9uU2NyZWVuXG4gICAgICB9LFxuICAgICAgdGhlbWU6IHtcbiAgICAgICAgY29tbW9uOiB7XG4gICAgICAgICAgcm93LCBjb2wsIG0zLCBtOSwgbDYsIHhsMywgeGw5LCB4czMsIHhzOSwgczZcbiAgICAgICAgfVxuICAgICAgfSB9ID0gdGhpcy5wcm9wcztcblxuXG4gICAgaWYgKCFTY3JlZW4pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17Y24oe1xuICAgICAgICBbcm93XTogdHJ1ZVxuICAgICAgfSl9PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y24oe1xuICAgICAgICAgIFtjb2xdOiB0cnVlLFxuICAgICAgICAgIFttM106IHRydWUsXG4gICAgICAgICAgW2w2XTogdHJ1ZSxcbiAgICAgICAgICBbeGw5XTogdHJ1ZSxcbiAgICAgICAgICBbeHM5XTogdHJ1ZSxcbiAgICAgICAgICBbczZdOiB0cnVlLFxuICAgICAgICB9KX0+XG4gICAgICAgICAge2xpbmtzfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2NuKHtcbiAgICAgICAgICBbY29sXTogdHJ1ZSxcbiAgICAgICAgICBbbTldOiB0cnVlLFxuICAgICAgICAgIFtsNl06IHRydWUsXG4gICAgICAgICAgW3hsM106IHRydWUsXG4gICAgICAgICAgW3hzM106IHRydWUsXG4gICAgICAgICAgW3M2XTogdHJ1ZSxcbiAgICAgICAgfSl9PlxuICAgICAgICAgIDxTY3JlZW4vPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuQXBwLnByb3BUeXBlcyA9IHtcbiAgY2xhc3NlczogUHJvcFR5cGVzLm9iamVjdCxcbiAgdGhlbWU6IFByb3BUeXBlcy5vYmplY3Rcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHRoZW1lQXdhcmUoeyBzdHlsZSB9KShBcHApO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7XG4gIC8vIG9uU2NyZWVuQ29uc29sZSxcbiAgbG9jYWxlQXdhcmUsXG4gIHRoZW1pbmcsXG4gIHRoZW1lLFxuICB0aGVtZVZhcnNcbn0gZnJvbSAnZGV2LWJveC11aSc7XG5pbXBvcnQgQXBwIGZyb20gJy4vYXBwJztcblxuY29uc3QgY3VycmVudFRoZW1lID0gdGhlbWUodGhlbWVWYXJzKTtcblxuLy8gb25TY3JlZW5Db25zb2xlKCk7XG5cbmNvbnN0IHsgVGhlbWVQcm92aWRlciB9ID0gdGhlbWluZztcblxubGV0IERlbW8gPSBjbGFzcyBEZW1vIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAvKiBlc2xpbnQgbm8tY29uc29sZTogMCAqL1xuICAgICAgLy8gY29uc29sZS5sb2coJ3JlbmRlcmluZyBEZW1vIGNvbXBvbmVudCcpO1xuICAgIH1cbiAgICBjb25zdCB7IGxvY2FsZTogeyBkaXIgfSB9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gKFxuICAgICAgPFRoZW1lUHJvdmlkZXIgdGhlbWU9e2N1cnJlbnRUaGVtZVtkaXJdfT5cbiAgICAgICAgPEFwcCAvPlxuICAgICAgPC9UaGVtZVByb3ZpZGVyPlxuICAgICk7XG4gIH1cbn07XG5cbkRlbW8ucHJvcFR5cGVzID0ge1xuICBsb2NhbGU6IFByb3BUeXBlcy5vYmplY3Rcbn07XG5cbkRlbW8gPSBsb2NhbGVBd2FyZShEZW1vKTtcblxuUmVhY3RET00ucmVuZGVyKChcbiAgPERlbW8vPlxuKSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RlbW8nKSk7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtcbiAgRm9ybUlucHV0TnVtYmVyLFxuICB0aGVtZUF3YXJlXG59IGZyb20gJ2Rldi1ib3gtdWknO1xuXG5jb25zdCBzdHlsZSA9ICh7IHZhcnMgfSkgPT4ge1xuICByZXR1cm4ge1xuICAgIHNjcmVlbjoge1xuICAgICAgY29sb3I6IHZhcnMuY29sb3JzLnByaW1hcnlUZXh0Q29sb3IgfHwgJ29yYW5nZSdcbiAgICB9LFxuICAgIGZvcm1JbnB1dE51bWJlcjoge1xuICAgICAgJyY6Zm9jdXMnOiB7XG4gICAgICAgIGNvbG9yOiAncmVkJyxcbiAgICAgICAgYm94U2hhZG93OiAnM3B4IDNweCAzcHggIzg4ODg4OCdcbiAgICAgIH1cbiAgICB9XG4gIH07XG59O1xuXG5jbGFzcyBGb3JtSW5wdXROdW1iZXJTY3JlZW4gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyB0aGVtZSwgY2xhc3NlcyB9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPEZvcm1JbnB1dE51bWJlciBpbnB1dEV4dHJhQ2xhc3Nlcz17W1xuICAgICAgICAgIHRoZW1lLmNvbW1vbi53aXRob3V0Qm9yZGVyQm90dG9tTGVmdFJhZGl1cyxcbiAgICAgICAgICBjbGFzc2VzLmZvcm1JbnB1dE51bWJlclxuICAgICAgICBdfSAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCB0aGVtZUF3YXJlKHsgc3R5bGUgfSkoRm9ybUlucHV0TnVtYmVyU2NyZWVuKTtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1xuICBIZWxsbyxcbiAgdGhlbWVBd2FyZVxufSBmcm9tICdkZXYtYm94LXVpJztcblxuY29uc3Qgc3R5bGUgPSAoeyB2YXJzIH0pID0+IHtcbiAgcmV0dXJuIHtcbiAgICBzY3JlZW46IHtcbiAgICAgIGNvbG9yOiB2YXJzLmNvbG9ycy5wcmltYXJ5VGV4dENvbG9yIHx8ICdvcmFuZ2UnXG4gICAgfVxuICB9O1xufTtcblxuY2xhc3MgSGVsbG9TY3JlZW4gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIC8qIGVzbGludCBuby1jb25zb2xlOiAwICovXG4gICAgICAvLyBjb25zb2xlLmxvZygncmVuZGVyaW5nIEhlbGxvU2NyZWVuIGNvbXBvbmVudCcpO1xuICAgIH1cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPEhlbGxvLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgdGhlbWVBd2FyZSh7IHN0eWxlIH0pKEhlbGxvU2NyZWVuKTtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1xuICBMaXN0LFxuICB0aGVtZUF3YXJlXG59IGZyb20gJ2Rldi1ib3gtdWknO1xuXG5jb25zdCBzdHlsZSA9ICh7IHZhcnMgfSkgPT4ge1xuICByZXR1cm4ge1xuICAgIHNjcmVlbjoge1xuICAgICAgY29sb3I6IHZhcnMuY29sb3JzLnByaW1hcnlUZXh0Q29sb3IgfHwgJ29yYW5nZSdcbiAgICB9XG4gIH07XG59O1xuXG5jbGFzcyBMaXN0U2NyZWVuIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8TGlzdCBpdGVtcz17Wyd0aHJlZScsICdmb3VyJ119Lz5cbiAgICAgICAgPExpc3QgaXRlbXM9e1sndGhyZWUnLCAnZm91ciddfS8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHRoZW1lQXdhcmUoeyBzdHlsZSB9KShMaXN0U2NyZWVuKTtcbiIsImltcG9ydCBIZWxsb1NjcmVlbiBmcm9tICcuL0hlbGxvU2NyZWVuJztcbmltcG9ydCBMaXN0U2NyZWVuIGZyb20gJy4vTGlzdFNjcmVlbic7XG5pbXBvcnQgRm9ybUlucHV0TnVtYmVyU2NyZWVuIGZyb20gJy4vRm9ybUlucHV0TnVtYmVyU2NyZWVuJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBIZWxsb1NjcmVlbixcbiAgTGlzdFNjcmVlbixcbiAgRm9ybUlucHV0TnVtYmVyU2NyZWVuXG59O1xuIl19
