require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var IconBase = function IconBase(_ref, _ref2) {
  var children = _ref.children;
  var color = _ref.color;
  var size = _ref.size;
  var style = _ref.style;

  var props = _objectWithoutProperties(_ref, ['children', 'color', 'size', 'style']);

  var _ref2$reactIconBase = _ref2.reactIconBase;
  var reactIconBase = _ref2$reactIconBase === undefined ? {} : _ref2$reactIconBase;

  var computedSize = size || reactIconBase.size || '1em';
  return _react2.default.createElement('svg', _extends({
    children: children,
    fill: 'currentColor',
    preserveAspectRatio: 'xMidYMid meet',
    height: computedSize,
    width: computedSize
  }, reactIconBase, props, {
    style: _extends({
      verticalAlign: 'middle',
      color: color || reactIconBase.color
    }, reactIconBase.style || {}, style)
  }));
};

IconBase.propTypes = {
  color: _propTypes2.default.string,
  size: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
  style: _propTypes2.default.object
};

IconBase.contextTypes = {
  reactIconBase: _propTypes2.default.shape(IconBase.propTypes)
};

exports.default = IconBase;
module.exports = exports['default'];
},{"prop-types":"prop-types","react":"react"}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactIconBase = require('react-icon-base');

var _reactIconBase2 = _interopRequireDefault(_reactIconBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FaSpinner = function FaSpinner(props) {
    return _react2.default.createElement(
        _reactIconBase2.default,
        _extends({ viewBox: '0 0 40 40' }, props),
        _react2.default.createElement(
            'g',
            null,
            _react2.default.createElement('path', { d: 'm11.7 31.1q0 1.2-0.8 2t-2 0.9q-1.2 0-2-0.9t-0.9-2q0-1.2 0.9-2t2-0.8 2 0.8 0.8 2z m11.2 4.6q0 1.2-0.9 2t-2 0.9-2-0.9-0.9-2 0.9-2 2-0.8 2 0.8 0.9 2z m-15.8-15.7q0 1.2-0.8 2t-2 0.9-2-0.9-0.9-2 0.9-2 2-0.9 2 0.9 0.8 2z m26.9 11.1q0 1.2-0.9 2t-2 0.9q-1.2 0-2-0.9t-0.8-2 0.8-2 2-0.8 2 0.8 0.9 2z m-21.5-22.2q0 1.5-1.1 2.5t-2.5 1.1-2.5-1.1-1.1-2.5 1.1-2.5 2.5-1.1 2.5 1.1 1.1 2.5z m26.1 11.1q0 1.2-0.9 2t-2 0.9-2-0.9-0.8-2 0.8-2 2-0.9 2 0.9 0.9 2z m-14.3-15.7q0 1.8-1.3 3t-3 1.3-3-1.3-1.3-3 1.3-3.1 3-1.2 3 1.3 1.3 3z m11.8 4.6q0 2.1-1.5 3.5t-3.5 1.5q-2.1 0-3.5-1.5t-1.5-3.5q0-2.1 1.5-3.5t3.5-1.5q2.1 0 3.5 1.5t1.5 3.5z' })
        )
    );
};

exports.default = FaSpinner;
module.exports = exports['default'];
},{"react":"react","react-icon-base":2}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = localeAware;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _devBoxUi = require('dev-box-ui');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function localeAware(Component) {
  class LocaleAware extends _react2.default.PureComponent {
    constructor(props, context) {
      super(props, context);
      this.handleLocaleChange = this.handleLocaleChange.bind(this);
      this.unregisterLocaleChange = null;
    }

    handleLocaleChange() {
      this.forceUpdate();
    }

    componentDidMount() {
      this.unregisterLocaleChange = (0, _devBoxUi.registerLocaleChange)(this.handleLocaleChange);
    }

    componentWillUnmount() {
      this.unregisterLocaleChange();
    }

    render() {
      const locale = _devBoxUi.registerLocaleChange.getCurrentLocale();
      return _react2.default.createElement(Component, _extends({}, this.props, { locale: locale }));
    }
  }

  LocaleAware.displayName = `LocaleAware(${Component.displayName || Component.name || 'Component'})`;

  return (0, _hoistNonReactStatics2.default)(LocaleAware, Component);
}

},{"dev-box-ui":"dev-box-ui","hoist-non-react-statics":"hoist-non-react-statics","react":"react"}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = themeAware;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactJss = require('react-jss');

var _reactJss2 = _interopRequireDefault(_reactJss);

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _theming = require('../theming/theming');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { ThemeProvider } = _theming.theming;

function themeAware({ theme, style }) {
  return function themeAwareInner(Component) {
    const ToRender = style ? (0, _reactJss2.default)(style, { theming: _theming.theming })(Component) : Component;

    class ThemeAware extends _react2.default.Component {
      render() {
        return theme ? _react2.default.createElement(
          ThemeProvider,
          { theme: theme },
          _react2.default.createElement(ToRender, this.props)
        ) : _react2.default.createElement(ToRender, this.props);
      }
    }

    ThemeAware.displayName = `ThemeAware(${Component.displayName || Component.name || 'Component'})`;

    return (0, _hoistNonReactStatics2.default)(ThemeAware, Component);
  };
}

},{"../theming/theming":13,"hoist-non-react-statics":"hoist-non-react-statics","react":"react","react-jss":"react-jss"}],6:[function(require,module,exports){
(function (process){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _spinner = require('react-icons/lib/fa/spinner');

var _spinner2 = _interopRequireDefault(_spinner);

var _List = require('../List/List');

var _List2 = _interopRequireDefault(_List);

var _World = require('../World/World');

var _World2 = _interopRequireDefault(_World);

var _themeAware = require('../../HOC/themeAware');

var _themeAware2 = _interopRequireDefault(_themeAware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const style = ({ vars }) => {
  return {
    hello: {
      color: vars.colors.primaryTextColor || 'orange'
    }
  };
};

class Hello extends _react2.default.Component {
  render() {
    const { theme } = this.props;
    if (process.env.NODE_ENV !== 'production') {
      /* eslint no-console: 0 */
      // console.log('rendering Hello component', theme);
    }
    return _react2.default.createElement(
      'div',
      { className: this.props.classes.hello },
      'Hello ',
      this.props.name || 'Nobody',
      _react2.default.createElement(_spinner2.default, { className: theme.animations.dbuAnimationSpin }),
      _react2.default.createElement(_List2.default, { items: ['one', 'two'] }),
      _react2.default.createElement(_List2.default, { items: ['one', 'two'] }),
      _react2.default.createElement(_World2.default, null),
      _react2.default.createElement(_World2.default, null)
    );
  }
}

Hello.propTypes = {
  theme: _propTypes2.default.object,
  name: _propTypes2.default.string.isRequired,
  classes: _propTypes2.default.object
};

exports.default = (0, _themeAware2.default)({ style })(Hello);

}).call(this,require('_process'))

},{"../../HOC/themeAware":5,"../List/List":7,"../World/World":8,"_process":1,"prop-types":"prop-types","react":"react","react-icons/lib/fa/spinner":3}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

var _themeAware = require('../../HOC/themeAware');

var _themeAware2 = _interopRequireDefault(_themeAware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const style = ({ vars }) => {
  return {
    list: {
      // color: color(vars.colors.secondaryTextColor || 'orange').lighten(0.5).hex()
      color: vars.dir === 'ltr' ? 'green' : 'red'
    }
  };
};

class List extends _react2.default.Component {
  render() {
    return _react2.default.createElement(
      'ul',
      { className: this.props.classes.list },
      this.props.items.map(item => _react2.default.createElement(
        'li',
        { key: item },
        item
      ))
    );
  }
}

List.defaultProps = {
  items: []
};

List.propTypes = {
  items: _propTypes2.default.array,
  classes: _propTypes2.default.object
};

exports.default = (0, _themeAware2.default)({ style })(List);

},{"../../HOC/themeAware":5,"color":"color","prop-types":"prop-types","react":"react"}],8:[function(require,module,exports){
(function (process){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _List = require('../List/List');

var _List2 = _interopRequireDefault(_List);

var _themeAware = require('../../HOC/themeAware');

var _themeAware2 = _interopRequireDefault(_themeAware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const style = ({ vars }) => {
  return {
    world: {
      color: vars.colors.primaryTextColor || 'orange'
    }
  };
};

class World extends _react2.default.Component {
  render() {
    if (process.env.NODE_ENV !== 'production') {
      /* eslint no-console: 0 */
      // console.log('rendering Hello component');
    }
    return _react2.default.createElement(
      'div',
      { className: this.props.classes.hello },
      'World ------------',
      _react2.default.createElement(_List2.default, { items: ['five', 'six'] }),
      _react2.default.createElement(_List2.default, { items: ['five', 'six'] }),
      '------------------'
    );
  }
}

World.propTypes = {
  classes: _propTypes2.default.object
};

exports.default = (0, _themeAware2.default)({ style })(World);

}).call(this,require('_process'))

},{"../../HOC/themeAware":5,"../List/List":7,"_process":1,"prop-types":"prop-types","react":"react"}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const commonAnimations = commonVars => {
  const { dir } = commonVars;
  return {
    [`@keyframes dbuAnimationSpin_${dir}`]: {
      '0%': {
        transform: 'rotate(0deg)'
      },
      '100%': {
        transform: dir === 'ltr' ? 'rotate(359deg)' : 'rotate(-359deg)'
      }
    },
    dbuAnimationSpin: {
      animation: `dbuAnimationSpin_${dir} 2s infinite linear`,
      animationName: `dbuAnimationSpin_${dir}`,
      animationDuration: '2s',
      animationTimingFunction: 'linear',
      animationDelay: 'initial',
      animationIterationCount: 'infinite',
      animationDirection: 'initial',
      animationFillMode: 'initial',
      animationPlayState: 'initial'
    }
  };
};

exports.default = commonAnimations;

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

const commonClasses = commonVars => {
  const { dir, grid: { cols, breakpoints } } = commonVars;
  const start = dir === 'ltr' ? 'left' : 'right';
  /*  eslint no-unused-vars: 0 */
  const end = dir === 'ltr' ? 'right' : 'left';

  return Object.assign({
    clearfix: {
      zoom: 1,
      '&:before, &:after': {
        content: '""',
        display: 'table'
      },
      '&:after': {
        clear: 'both'
      }
    },
    row: {
      extend: 'clearfix'
    },
    col: {
      float: start,
      textAlign: start,
      width: '100%'
    }
  }, Object.keys(breakpoints).reduce((acc, key) => {
    return Array.from({ length: cols }).map((el, i) => i + 1).reduce((acc, i) => {
      acc[`${key}${i}`] = {
        [`@media (min-width: ${breakpoints[key]})`]: {
          width: `${i / cols * 100}%`
        }
      };
      return acc;
    }, acc);
  }, {}));
};

exports.default = commonClasses;

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

const commonVars = dir => ({
  dir,
  colors: {
    primaryTextColor: 'green',
    secondaryTextColor: 'blue'
  },
  grid: {
    breakpoints: {
      xs: '1px',
      s: '576px',
      m: '768px',
      l: '992px',
      xl: '1200px'
    },
    cols: 12
  }
});

exports.default = commonVars;

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactJss = require('react-jss');

var _commonVars = require('./commonVars');

var _commonVars2 = _interopRequireDefault(_commonVars);

var _commonAnimations = require('./commonAnimations');

var _commonAnimations2 = _interopRequireDefault(_commonAnimations);

var _commonClasses = require('./commonClasses');

var _commonClasses2 = _interopRequireDefault(_commonClasses);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const defaultTheme = ['ltr', 'rtl'].reduce((acc, dir) => {
  const commonVarsDir = (0, _commonVars2.default)(dir);

  const commonAnimationsDir = _reactJss.jss.createStyleSheet((0, _commonAnimations2.default)(commonVarsDir), {
    meta: `commonAnimations_${dir}`
  }).attach();

  const commonClassesDir = _reactJss.jss.createStyleSheet((0, _commonClasses2.default)(commonVarsDir), {
    meta: `commonClasses_${dir}`
  }).attach();

  acc[dir] = {
    vars: commonVarsDir,
    animations: commonAnimationsDir.classes,
    common: commonClassesDir.classes
  };

  return acc;
}, {});

exports.default = defaultTheme;

},{"./commonAnimations":9,"./commonClasses":10,"./commonVars":11,"react-jss":"react-jss"}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.theming = exports.createTheming = undefined;

var _reactJss = require('react-jss');

const theming = (0, _reactJss.createTheming)('__DBU_THEMING__');

exports.createTheming = _reactJss.createTheming;
exports.theming = theming;

},{"react-jss":"react-jss"}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = onScreenConsole;

const buttonHeight = '25px';
const buttonStart = '5px';
const buttonTop = '5px';

let consoleMessages = [];
const consoleLog = console.log.bind(console);

function captureConsole(consoleElm, options) {
  const { indent = 2, showLastOnly = false } = options;
  const handler = function handler(action, ...args) {
    if (showLastOnly) {
      consoleMessages = [{ [action]: args }];
    } else {
      consoleMessages.push({ [action]: args });
    }

    consoleElm.innerHTML = consoleMessages.map(entry => {
      const action = Object.keys(entry)[0];
      const values = entry[action];
      const message = values.map(item => {
        return [undefined, null].includes(item) || ['number', 'string', 'function'].includes(typeof item) ? item : ['Map', 'Set'].includes(item.constructor.name) ? `${item.constructor.name} (${JSON.stringify([...item])})` : JSON.stringify(item, (key, value) => {
          if (typeof value === 'function') {
            return value.toString();
          }
          return value;
        }, indent);
      }).join(', ');

      const color = {
        log: '#000',
        warn: 'orange',
        error: 'darkred'
      }[action];

      return `<pre style="color: ${color}">${message}</pre>`;
    }).join('\n');
  };
  ['log', 'warn', 'error'].forEach(action => {
    console[action] = handler.bind(console, action);
  });
  window.addEventListener('error', evt => {
    // eslint no-console: 0
    console.error(`"${evt.message}" from ${evt.filename}:${evt.lineno}`);
    console.error(evt, evt.error.stack);
    // evt.preventDefault();
  });
  consoleLog('console captured');
}

function createConsole({
  options,
  consoleStyle: {
    btnStart = buttonStart, btnHeight = buttonHeight,
    width = `calc(100vw - ${btnStart} - 30px)`, height = '400px',
    background = 'rgba(0, 0, 0, 0.5)'
  }
}) {
  const { rtl = false } = options;
  const console = document.createElement('div');
  console.id = 'DBUonScreenConsole';
  console.style.cssText = `
    display: block;
    margin: 0px;
    padding: 5px;
    position: absolute;
    overflow: auto;
    width: ${width};
    height: ${height};
    top: ${btnHeight};
    ${rtl ? 'right' : 'left'}: 0px;
    background: ${background};
    z-index: 9999;
    -webkit-overflow-scrolling: touch
    `;
  return console;
}

function createButton({
  options,
  buttonStyle: {
    position = 'fixed',
    width = '25px', height = buttonHeight, top = buttonTop, start = buttonStart,
    background = 'rgba(0, 0, 0, 0.5)'
  }
}) {
  const { rtl = false } = options;
  const button = document.createElement('div');
  button.id = 'DBUonScreenConsoleToggler';
  button.style.cssText = `
    position: ${position};
    width: ${width};
    height: ${height};
    top: ${top};
    ${rtl ? 'right' : 'left'}: ${start};
    background: ${background};
    z-index: 9999;
    `;
  return button;
}

function onScreenConsole({
  buttonStyle = {},
  consoleStyle = {},
  options = {}
} = {}) {
  const button = createButton({
    options,
    buttonStyle
  });
  const console = createConsole({
    consoleStyle: Object.assign({}, consoleStyle, {
      btnHeight: buttonStyle.height,
      btnStart: buttonStyle.start
    }),
    options
  });

  console.addEventListener('click', e => {
    e.stopPropagation();
  });

  button.addEventListener('click', e => {
    e.stopPropagation();
    if (!button.contains(console)) {
      button.appendChild(console);
      console.scrollTop = console.scrollHeight - console.clientHeight;
    } else {
      button.removeChild(console);
    }
  });

  document.body.appendChild(button);
  captureConsole(console, options);
}

},{}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

let callbacks = [];

const localeAttrs = ['dir', 'lang'];

const rootElement = document.documentElement;

let locale = localeAttrs.reduce((acc, attr) => {
  acc[attr] = rootElement.getAttribute(attr);
  return acc;
}, {});

const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    const mutationAttributeName = mutation.attributeName;
    if (localeAttrs.includes(mutationAttributeName)) {
      locale = Object.assign({}, locale, {
        [mutationAttributeName]: rootElement.getAttribute(mutationAttributeName)
      });
      callbacks.forEach(callback => callback(locale));
    }
  });
});

observer.observe(rootElement, {
  attributes: true
});

// observer.disconnect();

function registerLocaleChange(callback) {
  callbacks.push(callback);
  callback(locale);
  return function unregisterLocaleChange() {
    callbacks = callbacks.filter(cb => cb !== callback);
  };
}
registerLocaleChange.getCurrentLocale = () => locale;

exports.default = registerLocaleChange;

},{}],"dev-box-ui":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.List = exports.Hello = exports.theming = exports.defaultTheme = exports.localeAware = exports.registerLocaleChange = exports.onScreenConsole = undefined;

var _Hello = require('./components/Hello/Hello');

var _Hello2 = _interopRequireDefault(_Hello);

var _List = require('./components/List/List');

var _List2 = _interopRequireDefault(_List);

var _onScreenConsole = require('./utils/onScreenConsole');

var _onScreenConsole2 = _interopRequireDefault(_onScreenConsole);

var _registerLocaleChange = require('./utils/registerLocaleChange');

var _registerLocaleChange2 = _interopRequireDefault(_registerLocaleChange);

var _theming = require('./theming/theming');

var _localeAware = require('./HOC/localeAware');

var _localeAware2 = _interopRequireDefault(_localeAware);

var _defaultTheme = require('./styles/defaultTheme');

var _defaultTheme2 = _interopRequireDefault(_defaultTheme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.onScreenConsole = _onScreenConsole2.default;
exports.registerLocaleChange = _registerLocaleChange2.default;
exports.localeAware = _localeAware2.default;
exports.defaultTheme = _defaultTheme2.default;
exports.theming = _theming.theming;
exports.Hello = _Hello2.default;
exports.List = _List2.default;

},{"./HOC/localeAware":4,"./components/Hello/Hello":6,"./components/List/List":7,"./styles/defaultTheme":12,"./theming/theming":13,"./utils/onScreenConsole":14,"./utils/registerLocaleChange":15}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LWljb24tYmFzZS9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVhY3QtaWNvbnMvbGliL2ZhL3NwaW5uZXIuanMiLCJzcmMvbGliL0hPQy9sb2NhbGVBd2FyZS5qcyIsInNyYy9saWIvSE9DL3RoZW1lQXdhcmUuanMiLCJzcmMvbGliL2NvbXBvbmVudHMvSGVsbG8vSGVsbG8uanMiLCJzcmMvbGliL2NvbXBvbmVudHMvTGlzdC9MaXN0LmpzIiwic3JjL2xpYi9jb21wb25lbnRzL1dvcmxkL1dvcmxkLmpzIiwic3JjL2xpYi9zdHlsZXMvY29tbW9uQW5pbWF0aW9ucy5qcyIsInNyYy9saWIvc3R5bGVzL2NvbW1vbkNsYXNzZXMuanMiLCJzcmMvbGliL3N0eWxlcy9jb21tb25WYXJzLmpzIiwic3JjL2xpYi9zdHlsZXMvZGVmYXVsdFRoZW1lLmpzIiwic3JjL2xpYi90aGVtaW5nL3RoZW1pbmcuanMiLCJzcmMvbGliL3V0aWxzL29uU2NyZWVuQ29uc29sZS5qcyIsInNyYy9saWIvdXRpbHMvcmVnaXN0ZXJMb2NhbGVDaGFuZ2UuanMiLCJzcmMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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VixDQUFrQixZQUFZLFNBQVMsTUFBVCxDQUE5QjtBQUNEO0FBQ0YsR0FURDtBQVVELENBWGdCLENBQWpCOztBQWFBLFNBQVMsT0FBVCxDQUFpQixXQUFqQixFQUE4QjtBQUM1QixjQUFZO0FBRGdCLENBQTlCOztBQUlBOztBQUVBLFNBQVMsb0JBQVQsQ0FBOEIsUUFBOUIsRUFBd0M7QUFDdEMsWUFBVSxJQUFWLENBQWUsUUFBZjtBQUNBLFdBQVMsTUFBVDtBQUNBLFNBQU8sU0FBUyxzQkFBVCxHQUFrQztBQUN2QyxnQkFBWSxVQUFVLE1BQVYsQ0FBaUIsTUFBTSxPQUFPLFFBQTlCLENBQVo7QUFDRCxHQUZEO0FBR0Q7QUFDRCxxQkFBcUIsZ0JBQXJCLEdBQXdDLE1BQU0sTUFBOUM7O2tCQUVlLG9COzs7Ozs7Ozs7O0FDeENmOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7Ozs7O1FBR0UsZTtRQUNBLG9CO1FBQ0EsVztRQUNBLFk7UUFDQSxPO1FBQ0EsSztRQUNBLEkiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxudmFyIF9yZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX3Byb3BUeXBlcyA9IHJlcXVpcmUoJ3Byb3AtdHlwZXMnKTtcblxudmFyIF9wcm9wVHlwZXMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcHJvcFR5cGVzKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzKG9iaiwga2V5cykgeyB2YXIgdGFyZ2V0ID0ge307IGZvciAodmFyIGkgaW4gb2JqKSB7IGlmIChrZXlzLmluZGV4T2YoaSkgPj0gMCkgY29udGludWU7IGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgaSkpIGNvbnRpbnVlOyB0YXJnZXRbaV0gPSBvYmpbaV07IH0gcmV0dXJuIHRhcmdldDsgfVxuXG52YXIgSWNvbkJhc2UgPSBmdW5jdGlvbiBJY29uQmFzZShfcmVmLCBfcmVmMikge1xuICB2YXIgY2hpbGRyZW4gPSBfcmVmLmNoaWxkcmVuO1xuICB2YXIgY29sb3IgPSBfcmVmLmNvbG9yO1xuICB2YXIgc2l6ZSA9IF9yZWYuc2l6ZTtcbiAgdmFyIHN0eWxlID0gX3JlZi5zdHlsZTtcblxuICB2YXIgcHJvcHMgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMoX3JlZiwgWydjaGlsZHJlbicsICdjb2xvcicsICdzaXplJywgJ3N0eWxlJ10pO1xuXG4gIHZhciBfcmVmMiRyZWFjdEljb25CYXNlID0gX3JlZjIucmVhY3RJY29uQmFzZTtcbiAgdmFyIHJlYWN0SWNvbkJhc2UgPSBfcmVmMiRyZWFjdEljb25CYXNlID09PSB1bmRlZmluZWQgPyB7fSA6IF9yZWYyJHJlYWN0SWNvbkJhc2U7XG5cbiAgdmFyIGNvbXB1dGVkU2l6ZSA9IHNpemUgfHwgcmVhY3RJY29uQmFzZS5zaXplIHx8ICcxZW0nO1xuICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoJ3N2ZycsIF9leHRlbmRzKHtcbiAgICBjaGlsZHJlbjogY2hpbGRyZW4sXG4gICAgZmlsbDogJ2N1cnJlbnRDb2xvcicsXG4gICAgcHJlc2VydmVBc3BlY3RSYXRpbzogJ3hNaWRZTWlkIG1lZXQnLFxuICAgIGhlaWdodDogY29tcHV0ZWRTaXplLFxuICAgIHdpZHRoOiBjb21wdXRlZFNpemVcbiAgfSwgcmVhY3RJY29uQmFzZSwgcHJvcHMsIHtcbiAgICBzdHlsZTogX2V4dGVuZHMoe1xuICAgICAgdmVydGljYWxBbGlnbjogJ21pZGRsZScsXG4gICAgICBjb2xvcjogY29sb3IgfHwgcmVhY3RJY29uQmFzZS5jb2xvclxuICAgIH0sIHJlYWN0SWNvbkJhc2Uuc3R5bGUgfHwge30sIHN0eWxlKVxuICB9KSk7XG59O1xuXG5JY29uQmFzZS5wcm9wVHlwZXMgPSB7XG4gIGNvbG9yOiBfcHJvcFR5cGVzMi5kZWZhdWx0LnN0cmluZyxcbiAgc2l6ZTogX3Byb3BUeXBlczIuZGVmYXVsdC5vbmVPZlR5cGUoW19wcm9wVHlwZXMyLmRlZmF1bHQuc3RyaW5nLCBfcHJvcFR5cGVzMi5kZWZhdWx0Lm51bWJlcl0pLFxuICBzdHlsZTogX3Byb3BUeXBlczIuZGVmYXVsdC5vYmplY3Rcbn07XG5cbkljb25CYXNlLmNvbnRleHRUeXBlcyA9IHtcbiAgcmVhY3RJY29uQmFzZTogX3Byb3BUeXBlczIuZGVmYXVsdC5zaGFwZShJY29uQmFzZS5wcm9wVHlwZXMpXG59O1xuXG5leHBvcnRzLmRlZmF1bHQgPSBJY29uQmFzZTtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfcmVhY3RJY29uQmFzZSA9IHJlcXVpcmUoJ3JlYWN0LWljb24tYmFzZScpO1xuXG52YXIgX3JlYWN0SWNvbkJhc2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3RJY29uQmFzZSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBGYVNwaW5uZXIgPSBmdW5jdGlvbiBGYVNwaW5uZXIocHJvcHMpIHtcbiAgICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgIF9yZWFjdEljb25CYXNlMi5kZWZhdWx0LFxuICAgICAgICBfZXh0ZW5kcyh7IHZpZXdCb3g6ICcwIDAgNDAgNDAnIH0sIHByb3BzKSxcbiAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAnZycsXG4gICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoJ3BhdGgnLCB7IGQ6ICdtMTEuNyAzMS4xcTAgMS4yLTAuOCAydC0yIDAuOXEtMS4yIDAtMi0wLjl0LTAuOS0ycTAtMS4yIDAuOS0ydDItMC44IDIgMC44IDAuOCAyeiBtMTEuMiA0LjZxMCAxLjItMC45IDJ0LTIgMC45LTItMC45LTAuOS0yIDAuOS0yIDItMC44IDIgMC44IDAuOSAyeiBtLTE1LjgtMTUuN3EwIDEuMi0wLjggMnQtMiAwLjktMi0wLjktMC45LTIgMC45LTIgMi0wLjkgMiAwLjkgMC44IDJ6IG0yNi45IDExLjFxMCAxLjItMC45IDJ0LTIgMC45cS0xLjIgMC0yLTAuOXQtMC44LTIgMC44LTIgMi0wLjggMiAwLjggMC45IDJ6IG0tMjEuNS0yMi4ycTAgMS41LTEuMSAyLjV0LTIuNSAxLjEtMi41LTEuMS0xLjEtMi41IDEuMS0yLjUgMi41LTEuMSAyLjUgMS4xIDEuMSAyLjV6IG0yNi4xIDExLjFxMCAxLjItMC45IDJ0LTIgMC45LTItMC45LTAuOC0yIDAuOC0yIDItMC45IDIgMC45IDAuOSAyeiBtLTE0LjMtMTUuN3EwIDEuOC0xLjMgM3QtMyAxLjMtMy0xLjMtMS4zLTMgMS4zLTMuMSAzLTEuMiAzIDEuMyAxLjMgM3ogbTExLjggNC42cTAgMi4xLTEuNSAzLjV0LTMuNSAxLjVxLTIuMSAwLTMuNS0xLjV0LTEuNS0zLjVxMC0yLjEgMS41LTMuNXQzLjUtMS41cTIuMSAwIDMuNSAxLjV0MS41IDMuNXonIH0pXG4gICAgICAgIClcbiAgICApO1xufTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gRmFTcGlubmVyO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBob2lzdE5vblJlYWN0U3RhdGljcyBmcm9tICdob2lzdC1ub24tcmVhY3Qtc3RhdGljcyc7XG5pbXBvcnQge1xuICByZWdpc3RlckxvY2FsZUNoYW5nZVxufSBmcm9tICdkZXYtYm94LXVpJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbG9jYWxlQXdhcmUoQ29tcG9uZW50KSB7XG4gIGNsYXNzIExvY2FsZUF3YXJlIGV4dGVuZHMgUmVhY3QuUHVyZUNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMsIGNvbnRleHQpIHtcbiAgICAgIHN1cGVyKHByb3BzLCBjb250ZXh0KTtcbiAgICAgIHRoaXMuaGFuZGxlTG9jYWxlQ2hhbmdlID0gdGhpcy5oYW5kbGVMb2NhbGVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgICAgIHRoaXMudW5yZWdpc3RlckxvY2FsZUNoYW5nZSA9IG51bGw7XG4gICAgfVxuXG4gICAgaGFuZGxlTG9jYWxlQ2hhbmdlKCkge1xuICAgICAgdGhpcy5mb3JjZVVwZGF0ZSgpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgdGhpcy51bnJlZ2lzdGVyTG9jYWxlQ2hhbmdlID0gcmVnaXN0ZXJMb2NhbGVDaGFuZ2UodGhpcy5oYW5kbGVMb2NhbGVDaGFuZ2UpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgICAgdGhpcy51bnJlZ2lzdGVyTG9jYWxlQ2hhbmdlKCk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgY29uc3QgbG9jYWxlID0gcmVnaXN0ZXJMb2NhbGVDaGFuZ2UuZ2V0Q3VycmVudExvY2FsZSgpO1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPENvbXBvbmVudCB7IC4uLnRoaXMucHJvcHMgfSBsb2NhbGU9e2xvY2FsZX0gLz5cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgTG9jYWxlQXdhcmUuZGlzcGxheU5hbWUgPSBgTG9jYWxlQXdhcmUoJHtcbiAgICBDb21wb25lbnQuZGlzcGxheU5hbWUgfHxcbiAgICBDb21wb25lbnQubmFtZSB8fFxuICAgICdDb21wb25lbnQnXG4gIH0pYDtcblxuICByZXR1cm4gaG9pc3ROb25SZWFjdFN0YXRpY3MoTG9jYWxlQXdhcmUsIENvbXBvbmVudCk7XG59XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IGluamVjdFNoZWV0IGZyb20gJ3JlYWN0LWpzcyc7XG5pbXBvcnQgaG9pc3ROb25SZWFjdFN0YXRpY3MgZnJvbSAnaG9pc3Qtbm9uLXJlYWN0LXN0YXRpY3MnO1xuaW1wb3J0IHsgdGhlbWluZyB9IGZyb20gJy4uL3RoZW1pbmcvdGhlbWluZyc7XG5cblxuY29uc3QgeyBUaGVtZVByb3ZpZGVyIH0gPSB0aGVtaW5nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0aGVtZUF3YXJlKHsgdGhlbWUsIHN0eWxlIH0pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHRoZW1lQXdhcmVJbm5lcihDb21wb25lbnQpIHtcbiAgICBjb25zdCBUb1JlbmRlciA9IHN0eWxlID8gaW5qZWN0U2hlZXQoc3R5bGUsIHsgdGhlbWluZyB9KShDb21wb25lbnQpIDogQ29tcG9uZW50O1xuXG4gICAgY2xhc3MgVGhlbWVBd2FyZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgdGhlbWUgP1xuICAgICAgICAgICAgPFRoZW1lUHJvdmlkZXIgdGhlbWU9eyB0aGVtZSB9PlxuICAgICAgICAgICAgICA8VG9SZW5kZXIgeyAuLi50aGlzLnByb3BzIH0gLz5cbiAgICAgICAgICAgIDwvVGhlbWVQcm92aWRlcj4gOlxuICAgICAgICAgICAgPFRvUmVuZGVyIHsgLi4udGhpcy5wcm9wcyB9IC8+XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgVGhlbWVBd2FyZS5kaXNwbGF5TmFtZSA9IGBUaGVtZUF3YXJlKCR7XG4gICAgICBDb21wb25lbnQuZGlzcGxheU5hbWUgfHxcbiAgICAgIENvbXBvbmVudC5uYW1lIHx8XG4gICAgICAnQ29tcG9uZW50J1xuICAgIH0pYDtcblxuICAgIHJldHVybiBob2lzdE5vblJlYWN0U3RhdGljcyhUaGVtZUF3YXJlLCBDb21wb25lbnQpO1xuICB9O1xufVxuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgRmFTcGlubmVyIGZyb20gJ3JlYWN0LWljb25zL2xpYi9mYS9zcGlubmVyJztcbmltcG9ydCBMaXN0IGZyb20gJy4uL0xpc3QvTGlzdCc7XG5pbXBvcnQgV29ybGQgZnJvbSAnLi4vV29ybGQvV29ybGQnO1xuaW1wb3J0IHRoZW1lQXdhcmUgZnJvbSAnLi4vLi4vSE9DL3RoZW1lQXdhcmUnO1xuXG5cbmNvbnN0IHN0eWxlID0gKHsgdmFycyB9KSA9PiB7XG4gIHJldHVybiB7XG4gICAgaGVsbG86IHtcbiAgICAgIGNvbG9yOiB2YXJzLmNvbG9ycy5wcmltYXJ5VGV4dENvbG9yIHx8ICdvcmFuZ2UnXG4gICAgfVxuICB9O1xufTtcblxuY2xhc3MgSGVsbG8gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyB0aGVtZSB9ID0gdGhpcy5wcm9wcztcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgLyogZXNsaW50IG5vLWNvbnNvbGU6IDAgKi9cbiAgICAgIC8vIGNvbnNvbGUubG9nKCdyZW5kZXJpbmcgSGVsbG8gY29tcG9uZW50JywgdGhlbWUpO1xuICAgIH1cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9eyB0aGlzLnByb3BzLmNsYXNzZXMuaGVsbG8gfT5cbiAgICAgICAgSGVsbG8geyB0aGlzLnByb3BzLm5hbWUgfHwgJ05vYm9keScgfVxuICAgICAgICA8RmFTcGlubmVyIGNsYXNzTmFtZT17IHRoZW1lLmFuaW1hdGlvbnMuZGJ1QW5pbWF0aW9uU3BpbiB9Lz5cbiAgICAgICAgPExpc3QgaXRlbXM9eyBbJ29uZScsICd0d28nXSB9Lz5cbiAgICAgICAgPExpc3QgaXRlbXM9eyBbJ29uZScsICd0d28nXSB9Lz5cbiAgICAgICAgPFdvcmxkLz5cbiAgICAgICAgPFdvcmxkLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuSGVsbG8ucHJvcFR5cGVzID0ge1xuICB0aGVtZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgbmFtZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBjbGFzc2VzOiBQcm9wVHlwZXMub2JqZWN0XG59O1xuXG5leHBvcnQgZGVmYXVsdCB0aGVtZUF3YXJlKHsgc3R5bGUgfSkoSGVsbG8pO1xuXG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBjb2xvciBmcm9tICdjb2xvcic7XG5pbXBvcnQgdGhlbWVBd2FyZSBmcm9tICcuLi8uLi9IT0MvdGhlbWVBd2FyZSc7XG5cbmNvbnN0IHN0eWxlID0gKHsgdmFycyB9KSA9PiB7XG4gIHJldHVybiB7XG4gICAgbGlzdDoge1xuICAgICAgLy8gY29sb3I6IGNvbG9yKHZhcnMuY29sb3JzLnNlY29uZGFyeVRleHRDb2xvciB8fCAnb3JhbmdlJykubGlnaHRlbigwLjUpLmhleCgpXG4gICAgICBjb2xvcjogdmFycy5kaXIgPT09ICdsdHInID8gJ2dyZWVuJyA6ICdyZWQnXG4gICAgfVxuICB9O1xufTtcblxuY2xhc3MgTGlzdCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPHVsIGNsYXNzTmFtZT17dGhpcy5wcm9wcy5jbGFzc2VzLmxpc3R9PlxuICAgICAgICB7dGhpcy5wcm9wcy5pdGVtcy5tYXAoaXRlbSA9PiA8bGkga2V5PXtpdGVtfT57aXRlbX08L2xpPil9XG4gICAgICA8L3VsPlxuICAgICk7XG4gIH1cbn1cblxuTGlzdC5kZWZhdWx0UHJvcHMgPSB7XG4gIGl0ZW1zOiBbXVxufTtcblxuTGlzdC5wcm9wVHlwZXMgPSB7XG4gIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXksXG4gIGNsYXNzZXM6IFByb3BUeXBlcy5vYmplY3Rcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHRoZW1lQXdhcmUoeyBzdHlsZSB9KShMaXN0KTtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IExpc3QgZnJvbSAnLi4vTGlzdC9MaXN0JztcbmltcG9ydCB0aGVtZUF3YXJlIGZyb20gJy4uLy4uL0hPQy90aGVtZUF3YXJlJztcblxuY29uc3Qgc3R5bGUgPSAoeyB2YXJzIH0pID0+IHtcbiAgcmV0dXJuIHtcbiAgICB3b3JsZDoge1xuICAgICAgY29sb3I6IHZhcnMuY29sb3JzLnByaW1hcnlUZXh0Q29sb3IgfHwgJ29yYW5nZSdcbiAgICB9XG4gIH07XG59O1xuXG5jbGFzcyBXb3JsZCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgLyogZXNsaW50IG5vLWNvbnNvbGU6IDAgKi9cbiAgICAgIC8vIGNvbnNvbGUubG9nKCdyZW5kZXJpbmcgSGVsbG8gY29tcG9uZW50Jyk7XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17dGhpcy5wcm9wcy5jbGFzc2VzLmhlbGxvfT5cbiAgICAgICAgV29ybGQgLS0tLS0tLS0tLS0tXG4gICAgICAgIDxMaXN0IGl0ZW1zPXtbJ2ZpdmUnLCAnc2l4J119Lz5cbiAgICAgICAgPExpc3QgaXRlbXM9e1snZml2ZScsICdzaXgnXX0vPlxuICAgICAgICAtLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuV29ybGQucHJvcFR5cGVzID0ge1xuICBjbGFzc2VzOiBQcm9wVHlwZXMub2JqZWN0XG59O1xuXG5leHBvcnQgZGVmYXVsdCB0aGVtZUF3YXJlKHsgc3R5bGUgfSkoV29ybGQpO1xuXG4iLCJjb25zdCBjb21tb25BbmltYXRpb25zID0gKGNvbW1vblZhcnMpID0+IHtcbiAgY29uc3QgeyBkaXIgfSA9IGNvbW1vblZhcnM7XG4gIHJldHVybiB7XG4gICAgW2BAa2V5ZnJhbWVzIGRidUFuaW1hdGlvblNwaW5fJHtkaXJ9YF06IHtcbiAgICAgICcwJSc6IHtcbiAgICAgICAgdHJhbnNmb3JtOiAncm90YXRlKDBkZWcpJ1xuICAgICAgfSxcbiAgICAgICcxMDAlJzoge1xuICAgICAgICB0cmFuc2Zvcm06IGRpciA9PT0gJ2x0cicgPyAncm90YXRlKDM1OWRlZyknIDogJ3JvdGF0ZSgtMzU5ZGVnKSdcbiAgICAgIH1cbiAgICB9LFxuICAgIGRidUFuaW1hdGlvblNwaW46IHtcbiAgICAgIGFuaW1hdGlvbjogYGRidUFuaW1hdGlvblNwaW5fJHtkaXJ9IDJzIGluZmluaXRlIGxpbmVhcmAsXG4gICAgICBhbmltYXRpb25OYW1lOiBgZGJ1QW5pbWF0aW9uU3Bpbl8ke2Rpcn1gLFxuICAgICAgYW5pbWF0aW9uRHVyYXRpb246ICcycycsXG4gICAgICBhbmltYXRpb25UaW1pbmdGdW5jdGlvbjogJ2xpbmVhcicsXG4gICAgICBhbmltYXRpb25EZWxheTogJ2luaXRpYWwnLFxuICAgICAgYW5pbWF0aW9uSXRlcmF0aW9uQ291bnQ6ICdpbmZpbml0ZScsXG4gICAgICBhbmltYXRpb25EaXJlY3Rpb246ICdpbml0aWFsJyxcbiAgICAgIGFuaW1hdGlvbkZpbGxNb2RlOiAnaW5pdGlhbCcsXG4gICAgICBhbmltYXRpb25QbGF5U3RhdGU6ICdpbml0aWFsJ1xuICAgIH1cbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbW1vbkFuaW1hdGlvbnM7XG4iLCJcbmNvbnN0IGNvbW1vbkNsYXNzZXMgPSAoY29tbW9uVmFycykgPT4ge1xuICBjb25zdCB7IGRpciwgZ3JpZDogeyBjb2xzLCBicmVha3BvaW50cyB9IH0gPSBjb21tb25WYXJzO1xuICBjb25zdCBzdGFydCA9IGRpciA9PT0gJ2x0cicgPyAnbGVmdCcgOiAncmlnaHQnO1xuICAvKiAgZXNsaW50IG5vLXVudXNlZC12YXJzOiAwICovXG4gIGNvbnN0IGVuZCA9IGRpciA9PT0gJ2x0cicgPyAncmlnaHQnIDogJ2xlZnQnO1xuXG4gIHJldHVybiB7XG4gICAgY2xlYXJmaXg6IHtcbiAgICAgIHpvb206IDEsXG4gICAgICAnJjpiZWZvcmUsICY6YWZ0ZXInOiB7XG4gICAgICAgIGNvbnRlbnQ6ICdcIlwiJyxcbiAgICAgICAgZGlzcGxheTogJ3RhYmxlJ1xuICAgICAgfSxcbiAgICAgICcmOmFmdGVyJzoge1xuICAgICAgICBjbGVhcjogJ2JvdGgnXG4gICAgICB9XG4gICAgfSxcbiAgICByb3c6IHtcbiAgICAgIGV4dGVuZDogJ2NsZWFyZml4J1xuICAgIH0sXG4gICAgY29sOiB7XG4gICAgICBmbG9hdDogc3RhcnQsXG4gICAgICB0ZXh0QWxpZ246IHN0YXJ0LFxuICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgIH0sXG4gICAgLi4uT2JqZWN0LmtleXMoYnJlYWtwb2ludHMpLnJlZHVjZSgoYWNjLCBrZXkpID0+IHtcbiAgICAgIHJldHVybiBBcnJheS5mcm9tKHsgbGVuZ3RoOiBjb2xzIH0pXG4gICAgICAgIC5tYXAoKGVsLCBpKSA9PiBpICsgMSlcbiAgICAgICAgLnJlZHVjZSgoYWNjLCBpKSA9PiB7XG4gICAgICAgICAgYWNjW2Ake2tleX0ke2l9YF0gPSB7XG4gICAgICAgICAgICBbYEBtZWRpYSAobWluLXdpZHRoOiAke2JyZWFrcG9pbnRzW2tleV19KWBdOiB7XG4gICAgICAgICAgICAgIHdpZHRoOiBgJHsoaSAvIGNvbHMpICogMTAwfSVgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICB9LCBhY2MpO1xuICAgIH0sIHt9KVxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY29tbW9uQ2xhc3NlcztcbiIsIlxuY29uc3QgY29tbW9uVmFycyA9IGRpciA9PiAoe1xuICBkaXIsXG4gIGNvbG9yczoge1xuICAgIHByaW1hcnlUZXh0Q29sb3I6ICdncmVlbicsXG4gICAgc2Vjb25kYXJ5VGV4dENvbG9yOiAnYmx1ZSdcbiAgfSxcbiAgZ3JpZDoge1xuICAgIGJyZWFrcG9pbnRzOiB7XG4gICAgICB4czogJzFweCcsXG4gICAgICBzOiAnNTc2cHgnLFxuICAgICAgbTogJzc2OHB4JyxcbiAgICAgIGw6ICc5OTJweCcsXG4gICAgICB4bDogJzEyMDBweCdcbiAgICB9LFxuICAgIGNvbHM6IDEyXG4gIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBjb21tb25WYXJzO1xuIiwiaW1wb3J0IHsganNzIH0gZnJvbSAncmVhY3QtanNzJztcbmltcG9ydCBjb21tb25WYXJzIGZyb20gJy4vY29tbW9uVmFycyc7XG5pbXBvcnQgY29tbW9uQW5pbWF0aW9ucyBmcm9tICcuL2NvbW1vbkFuaW1hdGlvbnMnO1xuaW1wb3J0IGNvbW1vbkNsYXNzZXMgZnJvbSAnLi9jb21tb25DbGFzc2VzJztcblxuY29uc3QgZGVmYXVsdFRoZW1lID0gWydsdHInLCAncnRsJ10ucmVkdWNlKChhY2MsIGRpcikgPT4ge1xuICBjb25zdCBjb21tb25WYXJzRGlyID0gY29tbW9uVmFycyhkaXIpO1xuXG4gIGNvbnN0IGNvbW1vbkFuaW1hdGlvbnNEaXIgPSBqc3MuY3JlYXRlU3R5bGVTaGVldChcbiAgICBjb21tb25BbmltYXRpb25zKGNvbW1vblZhcnNEaXIpLCB7XG4gICAgICBtZXRhOiBgY29tbW9uQW5pbWF0aW9uc18ke2Rpcn1gXG4gICAgfVxuICApLmF0dGFjaCgpO1xuXG4gIGNvbnN0IGNvbW1vbkNsYXNzZXNEaXIgPSBqc3MuY3JlYXRlU3R5bGVTaGVldChcbiAgICBjb21tb25DbGFzc2VzKGNvbW1vblZhcnNEaXIpLCB7XG4gICAgICBtZXRhOiBgY29tbW9uQ2xhc3Nlc18ke2Rpcn1gXG4gICAgfVxuICApLmF0dGFjaCgpO1xuXG4gIGFjY1tkaXJdID0ge1xuICAgIHZhcnM6IGNvbW1vblZhcnNEaXIsXG4gICAgYW5pbWF0aW9uczogY29tbW9uQW5pbWF0aW9uc0Rpci5jbGFzc2VzLFxuICAgIGNvbW1vbjogY29tbW9uQ2xhc3Nlc0Rpci5jbGFzc2VzXG4gIH07XG5cbiAgcmV0dXJuIGFjYztcbn0sIHt9KTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmYXVsdFRoZW1lO1xuXG4iLCJpbXBvcnQgeyBjcmVhdGVUaGVtaW5nIH0gZnJvbSAncmVhY3QtanNzJztcblxuY29uc3QgdGhlbWluZyA9IGNyZWF0ZVRoZW1pbmcoJ19fREJVX1RIRU1JTkdfXycpO1xuXG5leHBvcnQge1xuICBjcmVhdGVUaGVtaW5nLFxuICB0aGVtaW5nXG59O1xuIiwiXG5jb25zdCBidXR0b25IZWlnaHQgPSAnMjVweCc7XG5jb25zdCBidXR0b25TdGFydCA9ICc1cHgnO1xuY29uc3QgYnV0dG9uVG9wID0gJzVweCc7XG5cbmxldCBjb25zb2xlTWVzc2FnZXMgPSBbXTtcbmNvbnN0IGNvbnNvbGVMb2cgPSBjb25zb2xlLmxvZy5iaW5kKGNvbnNvbGUpO1xuXG5mdW5jdGlvbiBjYXB0dXJlQ29uc29sZShjb25zb2xlRWxtLCBvcHRpb25zKSB7XG4gIGNvbnN0IHsgaW5kZW50ID0gMiwgc2hvd0xhc3RPbmx5ID0gZmFsc2UgfSA9IG9wdGlvbnM7XG4gIGNvbnN0IGhhbmRsZXIgPSBmdW5jdGlvbiBoYW5kbGVyKGFjdGlvbiwgLi4uYXJncykge1xuICAgIGlmIChzaG93TGFzdE9ubHkpIHtcbiAgICAgIGNvbnNvbGVNZXNzYWdlcyA9IFt7IFthY3Rpb25dOiBhcmdzIH1dO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlTWVzc2FnZXMucHVzaCh7IFthY3Rpb25dOiBhcmdzIH0pO1xuICAgIH1cblxuICAgIGNvbnNvbGVFbG0uaW5uZXJIVE1MID0gY29uc29sZU1lc3NhZ2VzLm1hcCgoZW50cnkpID0+IHtcbiAgICAgIGNvbnN0IGFjdGlvbiA9IE9iamVjdC5rZXlzKGVudHJ5KVswXTtcbiAgICAgIGNvbnN0IHZhbHVlcyA9IGVudHJ5W2FjdGlvbl07XG4gICAgICBjb25zdCBtZXNzYWdlID0gdmFsdWVzLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIFt1bmRlZmluZWQsIG51bGxdLmluY2x1ZGVzKGl0ZW0pIHx8XG4gICAgICAgICAgWydudW1iZXInLCAnc3RyaW5nJywgJ2Z1bmN0aW9uJ10uaW5jbHVkZXModHlwZW9mIGl0ZW0pXG4gICAgICAgICkgP1xuICAgICAgICAgIGl0ZW0gOlxuICAgICAgICAgIFsnTWFwJywgJ1NldCddLmluY2x1ZGVzKGl0ZW0uY29uc3RydWN0b3IubmFtZSkgP1xuICAgICAgICAgICAgYCR7aXRlbS5jb25zdHJ1Y3Rvci5uYW1lfSAoJHtKU09OLnN0cmluZ2lmeShbLi4uaXRlbV0pfSlgIDpcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KGl0ZW0sIChrZXksIHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgIGlmICgodHlwZW9mIHZhbHVlKSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS50b1N0cmluZygpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgIH0sIGluZGVudCk7XG4gICAgICB9KS5qb2luKCcsICcpO1xuXG4gICAgICBjb25zdCBjb2xvciA9IHtcbiAgICAgICAgbG9nOiAnIzAwMCcsXG4gICAgICAgIHdhcm46ICdvcmFuZ2UnLFxuICAgICAgICBlcnJvcjogJ2RhcmtyZWQnXG4gICAgICB9W2FjdGlvbl07XG5cbiAgICAgIHJldHVybiBgPHByZSBzdHlsZT1cImNvbG9yOiAke2NvbG9yfVwiPiR7bWVzc2FnZX08L3ByZT5gO1xuICAgIH0pLmpvaW4oJ1xcbicpO1xuICB9O1xuICBbJ2xvZycsICd3YXJuJywgJ2Vycm9yJ10uZm9yRWFjaCgoYWN0aW9uKSA9PiB7XG4gICAgY29uc29sZVthY3Rpb25dID0gaGFuZGxlci5iaW5kKGNvbnNvbGUsIGFjdGlvbik7XG4gIH0pO1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCAoZXZ0KSA9PiB7XG4gICAgLy8gZXNsaW50IG5vLWNvbnNvbGU6IDBcbiAgICBjb25zb2xlLmVycm9yKGBcIiR7ZXZ0Lm1lc3NhZ2V9XCIgZnJvbSAke2V2dC5maWxlbmFtZX06JHtldnQubGluZW5vfWApO1xuICAgIGNvbnNvbGUuZXJyb3IoZXZ0LCBldnQuZXJyb3Iuc3RhY2spO1xuICAgIC8vIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9KTtcbiAgY29uc29sZUxvZygnY29uc29sZSBjYXB0dXJlZCcpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVDb25zb2xlKHtcbiAgb3B0aW9ucyxcbiAgY29uc29sZVN0eWxlOiB7XG4gICAgYnRuU3RhcnQgPSBidXR0b25TdGFydCwgYnRuSGVpZ2h0ID0gYnV0dG9uSGVpZ2h0LFxuICAgIHdpZHRoID0gYGNhbGMoMTAwdncgLSAke2J0blN0YXJ0fSAtIDMwcHgpYCwgaGVpZ2h0ID0gJzQwMHB4JyxcbiAgICBiYWNrZ3JvdW5kID0gJ3JnYmEoMCwgMCwgMCwgMC41KSdcbiAgfVxufSkge1xuICBjb25zdCB7IHJ0bCA9IGZhbHNlIH0gPSBvcHRpb25zO1xuICBjb25zdCBjb25zb2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbnNvbGUuaWQgPSAnREJVb25TY3JlZW5Db25zb2xlJztcbiAgY29uc29sZS5zdHlsZS5jc3NUZXh0ID0gYFxuICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIG1hcmdpbjogMHB4O1xuICAgIHBhZGRpbmc6IDVweDtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgb3ZlcmZsb3c6IGF1dG87XG4gICAgd2lkdGg6ICR7d2lkdGh9O1xuICAgIGhlaWdodDogJHtoZWlnaHR9O1xuICAgIHRvcDogJHtidG5IZWlnaHR9O1xuICAgICR7cnRsID8gJ3JpZ2h0JyA6ICdsZWZ0J306IDBweDtcbiAgICBiYWNrZ3JvdW5kOiAke2JhY2tncm91bmR9O1xuICAgIHotaW5kZXg6IDk5OTk7XG4gICAgLXdlYmtpdC1vdmVyZmxvdy1zY3JvbGxpbmc6IHRvdWNoXG4gICAgYDtcbiAgcmV0dXJuIGNvbnNvbGU7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUJ1dHRvbih7XG4gIG9wdGlvbnMsXG4gIGJ1dHRvblN0eWxlOiB7XG4gICAgcG9zaXRpb24gPSAnZml4ZWQnLFxuICAgIHdpZHRoID0gJzI1cHgnLCBoZWlnaHQgPSBidXR0b25IZWlnaHQsIHRvcCA9IGJ1dHRvblRvcCwgc3RhcnQgPSBidXR0b25TdGFydCxcbiAgICBiYWNrZ3JvdW5kID0gJ3JnYmEoMCwgMCwgMCwgMC41KSdcbiAgfVxufSkge1xuICBjb25zdCB7IHJ0bCA9IGZhbHNlIH0gPSBvcHRpb25zO1xuICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgYnV0dG9uLmlkID0gJ0RCVW9uU2NyZWVuQ29uc29sZVRvZ2dsZXInO1xuICBidXR0b24uc3R5bGUuY3NzVGV4dCA9IGBcbiAgICBwb3NpdGlvbjogJHtwb3NpdGlvbn07XG4gICAgd2lkdGg6ICR7d2lkdGh9O1xuICAgIGhlaWdodDogJHtoZWlnaHR9O1xuICAgIHRvcDogJHt0b3B9O1xuICAgICR7cnRsID8gJ3JpZ2h0JyA6ICdsZWZ0J306ICR7c3RhcnR9O1xuICAgIGJhY2tncm91bmQ6ICR7YmFja2dyb3VuZH07XG4gICAgei1pbmRleDogOTk5OTtcbiAgICBgO1xuICByZXR1cm4gYnV0dG9uO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBvblNjcmVlbkNvbnNvbGUoe1xuICBidXR0b25TdHlsZSA9IHt9LFxuICBjb25zb2xlU3R5bGUgPSB7fSxcbiAgb3B0aW9ucyA9IHt9XG59ID0ge30pIHtcbiAgY29uc3QgYnV0dG9uID0gY3JlYXRlQnV0dG9uKHtcbiAgICBvcHRpb25zLFxuICAgIGJ1dHRvblN0eWxlXG4gIH0pO1xuICBjb25zdCBjb25zb2xlID0gY3JlYXRlQ29uc29sZSh7XG4gICAgY29uc29sZVN0eWxlOiB7XG4gICAgICAuLi5jb25zb2xlU3R5bGUsXG4gICAgICBidG5IZWlnaHQ6IGJ1dHRvblN0eWxlLmhlaWdodCxcbiAgICAgIGJ0blN0YXJ0OiBidXR0b25TdHlsZS5zdGFydFxuICAgIH0sXG4gICAgb3B0aW9uc1xuICB9KTtcblxuICBjb25zb2xlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICB9KTtcblxuICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgaWYgKCFidXR0b24uY29udGFpbnMoY29uc29sZSkpIHtcbiAgICAgIGJ1dHRvbi5hcHBlbmRDaGlsZChjb25zb2xlKTtcbiAgICAgIGNvbnNvbGUuc2Nyb2xsVG9wID0gY29uc29sZS5zY3JvbGxIZWlnaHQgLSBjb25zb2xlLmNsaWVudEhlaWdodDtcbiAgICB9IGVsc2Uge1xuICAgICAgYnV0dG9uLnJlbW92ZUNoaWxkKGNvbnNvbGUpO1xuICAgIH1cbiAgfSk7XG5cbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChidXR0b24pO1xuICBjYXB0dXJlQ29uc29sZShjb25zb2xlLCBvcHRpb25zKTtcbn1cbiIsIlxubGV0IGNhbGxiYWNrcyA9IFtdO1xuXG5jb25zdCBsb2NhbGVBdHRycyA9IFsnZGlyJywgJ2xhbmcnXTtcblxuY29uc3Qgcm9vdEVsZW1lbnQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG5cbmxldCBsb2NhbGUgPSBsb2NhbGVBdHRycy5yZWR1Y2UoKGFjYywgYXR0cikgPT4ge1xuICBhY2NbYXR0cl0gPSByb290RWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cik7XG4gIHJldHVybiBhY2M7XG59LCB7fSk7XG5cbmNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKG11dGF0aW9ucykgPT4ge1xuICBtdXRhdGlvbnMuZm9yRWFjaCgobXV0YXRpb24pID0+IHtcbiAgICBjb25zdCBtdXRhdGlvbkF0dHJpYnV0ZU5hbWUgPSBtdXRhdGlvbi5hdHRyaWJ1dGVOYW1lO1xuICAgIGlmIChsb2NhbGVBdHRycy5pbmNsdWRlcyhtdXRhdGlvbkF0dHJpYnV0ZU5hbWUpKSB7XG4gICAgICBsb2NhbGUgPSB7XG4gICAgICAgIC4uLmxvY2FsZSxcbiAgICAgICAgW211dGF0aW9uQXR0cmlidXRlTmFtZV06IHJvb3RFbGVtZW50LmdldEF0dHJpYnV0ZShtdXRhdGlvbkF0dHJpYnV0ZU5hbWUpXG4gICAgICB9O1xuICAgICAgY2FsbGJhY2tzLmZvckVhY2goY2FsbGJhY2sgPT4gY2FsbGJhY2sobG9jYWxlKSk7XG4gICAgfVxuICB9KTtcbn0pO1xuXG5vYnNlcnZlci5vYnNlcnZlKHJvb3RFbGVtZW50LCB7XG4gIGF0dHJpYnV0ZXM6IHRydWVcbn0pO1xuXG4vLyBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyTG9jYWxlQ2hhbmdlKGNhbGxiYWNrKSB7XG4gIGNhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcbiAgY2FsbGJhY2sobG9jYWxlKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVucmVnaXN0ZXJMb2NhbGVDaGFuZ2UoKSB7XG4gICAgY2FsbGJhY2tzID0gY2FsbGJhY2tzLmZpbHRlcihjYiA9PiBjYiAhPT0gY2FsbGJhY2spO1xuICB9O1xufVxucmVnaXN0ZXJMb2NhbGVDaGFuZ2UuZ2V0Q3VycmVudExvY2FsZSA9ICgpID0+IGxvY2FsZTtcblxuZXhwb3J0IGRlZmF1bHQgcmVnaXN0ZXJMb2NhbGVDaGFuZ2U7XG4iLCJpbXBvcnQgSGVsbG8gZnJvbSAnLi9jb21wb25lbnRzL0hlbGxvL0hlbGxvJztcbmltcG9ydCBMaXN0IGZyb20gJy4vY29tcG9uZW50cy9MaXN0L0xpc3QnO1xuaW1wb3J0IG9uU2NyZWVuQ29uc29sZSBmcm9tICcuL3V0aWxzL29uU2NyZWVuQ29uc29sZSc7XG5pbXBvcnQgcmVnaXN0ZXJMb2NhbGVDaGFuZ2UgZnJvbSAnLi91dGlscy9yZWdpc3RlckxvY2FsZUNoYW5nZSc7XG5pbXBvcnQgeyB0aGVtaW5nIH0gZnJvbSAnLi90aGVtaW5nL3RoZW1pbmcnO1xuaW1wb3J0IGxvY2FsZUF3YXJlIGZyb20gJy4vSE9DL2xvY2FsZUF3YXJlJztcbmltcG9ydCBkZWZhdWx0VGhlbWUgZnJvbSAnLi9zdHlsZXMvZGVmYXVsdFRoZW1lJztcblxuZXhwb3J0IHtcbiAgb25TY3JlZW5Db25zb2xlLFxuICByZWdpc3RlckxvY2FsZUNoYW5nZSxcbiAgbG9jYWxlQXdhcmUsXG4gIGRlZmF1bHRUaGVtZSxcbiAgdGhlbWluZyxcbiAgSGVsbG8sXG4gIExpc3Rcbn07XG4iXX0=
