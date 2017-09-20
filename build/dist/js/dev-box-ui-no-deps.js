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
  class LocaleAware extends _react2.default.Component {
    constructor(props, context) {
      super(props, context);
      this.handleLocaleChange = this.handleLocaleChange.bind(this);
      this.unregisterLocaleChange = null;
      this.state = {
        locale: _devBoxUi.localeService.locale
      };
    }

    handleLocaleChange(locale) {
      this.state.locale !== locale && this.setState({
        locale
      });
    }

    componentDidMount() {
      this.unregisterLocaleChange = _devBoxUi.localeService.onLocaleChange(this.handleLocaleChange);
    }

    componentWillUnmount() {
      this.unregisterLocaleChange();
    }

    render() {
      const { locale } = this.state;
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

},{"../theming/theming":14,"hoist-non-react-statics":"hoist-non-react-statics","react":"react","react-jss":"react-jss"}],6:[function(require,module,exports){
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

class LocaleService {
  constructor() {
    this._callbacks = [];
    this._localeAttrs = ['dir', 'lang'];
    this._rootElement = window.document.documentElement;
    this._locale = this._localeAttrs.reduce((acc, attr) => {
      acc[attr] = this._rootElement.getAttribute(attr);
      return acc;
    }, {});
    this._observer = new MutationObserver(this._handleMutations.bind(this));
    this._observer.observe(this._rootElement, {
      attributes: true
    });
  }

  _handleMutations(mutations) {
    mutations.forEach(mutation => {
      const mutationAttributeName = mutation.attributeName;
      if (this._localeAttrs.includes(mutationAttributeName)) {
        this._locale = Object.assign({}, this._locale, {
          [mutationAttributeName]: this._rootElement.getAttribute(mutationAttributeName)
        });
        this._callbacks.forEach(callback => callback(this._locale));
      }
    });
  }

  get locale() {
    return this._locale;
  }

  onLocaleChange(callback) {
    this._callbacks.push(callback);
    callback(this.locale);
    return function unregisterLocaleChange() {
      this._callbacks = this._callbacks.filter(cb => cb !== callback);
    };
  }
}

const localeService = new LocaleService();
exports.default = localeService;

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{"./commonAnimations":10,"./commonClasses":11,"./commonVars":12,"react-jss":"react-jss"}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.theming = exports.createTheming = undefined;

var _reactJss = require('react-jss');

const theming = (0, _reactJss.createTheming)('__DBU_THEMING__');

exports.createTheming = _reactJss.createTheming;
exports.theming = theming;

},{"react-jss":"react-jss"}],15:[function(require,module,exports){
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

},{}],"dev-box-ui":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.List = exports.Hello = exports.theming = exports.defaultTheme = exports.localeAware = exports.localeService = exports.onScreenConsole = undefined;

var _Hello = require('./components/Hello/Hello');

var _Hello2 = _interopRequireDefault(_Hello);

var _List = require('./components/List/List');

var _List2 = _interopRequireDefault(_List);

var _onScreenConsole = require('./utils/onScreenConsole');

var _onScreenConsole2 = _interopRequireDefault(_onScreenConsole);

var _LocaleService = require('./services/LocaleService');

var _LocaleService2 = _interopRequireDefault(_LocaleService);

var _theming = require('./theming/theming');

var _localeAware = require('./HOC/localeAware');

var _localeAware2 = _interopRequireDefault(_localeAware);

var _defaultTheme = require('./styles/defaultTheme');

var _defaultTheme2 = _interopRequireDefault(_defaultTheme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.onScreenConsole = _onScreenConsole2.default;
exports.localeService = _LocaleService2.default;
exports.localeAware = _localeAware2.default;
exports.defaultTheme = _defaultTheme2.default;
exports.theming = _theming.theming;
exports.Hello = _Hello2.default;
exports.List = _List2.default;

},{"./HOC/localeAware":4,"./components/Hello/Hello":6,"./components/List/List":7,"./services/LocaleService":9,"./styles/defaultTheme":13,"./theming/theming":14,"./utils/onScreenConsole":15}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LWljb24tYmFzZS9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVhY3QtaWNvbnMvbGliL2ZhL3NwaW5uZXIuanMiLCJzcmMvbGliL0hPQy9sb2NhbGVBd2FyZS5qcyIsInNyYy9saWIvSE9DL3RoZW1lQXdhcmUuanMiLCJzcmMvbGliL2NvbXBvbmVudHMvSGVsbG8vSGVsbG8uanMiLCJzcmMvbGliL2NvbXBvbmVudHMvTGlzdC9MaXN0LmpzIiwic3JjL2xpYi9jb21wb25lbnRzL1dvcmxkL1dvcmxkLmpzIiwic3JjL2xpYi9zZXJ2aWNlcy9Mb2NhbGVTZXJ2aWNlLmpzIiwic3JjL2xpYi9zdHlsZXMvY29tbW9uQW5pbWF0aW9ucy5qcyIsInNyYy9saWIvc3R5bGVzL2NvbW1vbkNsYXNzZXMuanMiLCJzcmMvbGliL3N0eWxlcy9jb21tb25WYXJzLmpzIiwic3JjL2xpYi9zdHlsZXMvZGVmYXVsdFRoZW1lLmpzIiwic3JjL2xpYi90aGVtaW5nL3RoZW1pbmcuanMiLCJzcmMvbGliL3V0aWxzL29uU2NyZWVuQ29uc29sZS5qcyIsInNyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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LCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfcHJvcFR5cGVzID0gcmVxdWlyZSgncHJvcC10eXBlcycpO1xuXG52YXIgX3Byb3BUeXBlczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wcm9wVHlwZXMpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMob2JqLCBrZXlzKSB7IHZhciB0YXJnZXQgPSB7fTsgZm9yICh2YXIgaSBpbiBvYmopIHsgaWYgKGtleXMuaW5kZXhPZihpKSA+PSAwKSBjb250aW51ZTsgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBpKSkgY29udGludWU7IHRhcmdldFtpXSA9IG9ialtpXTsgfSByZXR1cm4gdGFyZ2V0OyB9XG5cbnZhciBJY29uQmFzZSA9IGZ1bmN0aW9uIEljb25CYXNlKF9yZWYsIF9yZWYyKSB7XG4gIHZhciBjaGlsZHJlbiA9IF9yZWYuY2hpbGRyZW47XG4gIHZhciBjb2xvciA9IF9yZWYuY29sb3I7XG4gIHZhciBzaXplID0gX3JlZi5zaXplO1xuICB2YXIgc3R5bGUgPSBfcmVmLnN0eWxlO1xuXG4gIHZhciBwcm9wcyA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllcyhfcmVmLCBbJ2NoaWxkcmVuJywgJ2NvbG9yJywgJ3NpemUnLCAnc3R5bGUnXSk7XG5cbiAgdmFyIF9yZWYyJHJlYWN0SWNvbkJhc2UgPSBfcmVmMi5yZWFjdEljb25CYXNlO1xuICB2YXIgcmVhY3RJY29uQmFzZSA9IF9yZWYyJHJlYWN0SWNvbkJhc2UgPT09IHVuZGVmaW5lZCA/IHt9IDogX3JlZjIkcmVhY3RJY29uQmFzZTtcblxuICB2YXIgY29tcHV0ZWRTaXplID0gc2l6ZSB8fCByZWFjdEljb25CYXNlLnNpemUgfHwgJzFlbSc7XG4gIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudCgnc3ZnJywgX2V4dGVuZHMoe1xuICAgIGNoaWxkcmVuOiBjaGlsZHJlbixcbiAgICBmaWxsOiAnY3VycmVudENvbG9yJyxcbiAgICBwcmVzZXJ2ZUFzcGVjdFJhdGlvOiAneE1pZFlNaWQgbWVldCcsXG4gICAgaGVpZ2h0OiBjb21wdXRlZFNpemUsXG4gICAgd2lkdGg6IGNvbXB1dGVkU2l6ZVxuICB9LCByZWFjdEljb25CYXNlLCBwcm9wcywge1xuICAgIHN0eWxlOiBfZXh0ZW5kcyh7XG4gICAgICB2ZXJ0aWNhbEFsaWduOiAnbWlkZGxlJyxcbiAgICAgIGNvbG9yOiBjb2xvciB8fCByZWFjdEljb25CYXNlLmNvbG9yXG4gICAgfSwgcmVhY3RJY29uQmFzZS5zdHlsZSB8fCB7fSwgc3R5bGUpXG4gIH0pKTtcbn07XG5cbkljb25CYXNlLnByb3BUeXBlcyA9IHtcbiAgY29sb3I6IF9wcm9wVHlwZXMyLmRlZmF1bHQuc3RyaW5nLFxuICBzaXplOiBfcHJvcFR5cGVzMi5kZWZhdWx0Lm9uZU9mVHlwZShbX3Byb3BUeXBlczIuZGVmYXVsdC5zdHJpbmcsIF9wcm9wVHlwZXMyLmRlZmF1bHQubnVtYmVyXSksXG4gIHN0eWxlOiBfcHJvcFR5cGVzMi5kZWZhdWx0Lm9iamVjdFxufTtcblxuSWNvbkJhc2UuY29udGV4dFR5cGVzID0ge1xuICByZWFjdEljb25CYXNlOiBfcHJvcFR5cGVzMi5kZWZhdWx0LnNoYXBlKEljb25CYXNlLnByb3BUeXBlcylcbn07XG5cbmV4cG9ydHMuZGVmYXVsdCA9IEljb25CYXNlO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9yZWFjdEljb25CYXNlID0gcmVxdWlyZSgncmVhY3QtaWNvbi1iYXNlJyk7XG5cbnZhciBfcmVhY3RJY29uQmFzZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdEljb25CYXNlKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIEZhU3Bpbm5lciA9IGZ1bmN0aW9uIEZhU3Bpbm5lcihwcm9wcykge1xuICAgIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgX3JlYWN0SWNvbkJhc2UyLmRlZmF1bHQsXG4gICAgICAgIF9leHRlbmRzKHsgdmlld0JveDogJzAgMCA0MCA0MCcgfSwgcHJvcHMpLFxuICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICdnJyxcbiAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudCgncGF0aCcsIHsgZDogJ20xMS43IDMxLjFxMCAxLjItMC44IDJ0LTIgMC45cS0xLjIgMC0yLTAuOXQtMC45LTJxMC0xLjIgMC45LTJ0Mi0wLjggMiAwLjggMC44IDJ6IG0xMS4yIDQuNnEwIDEuMi0wLjkgMnQtMiAwLjktMi0wLjktMC45LTIgMC45LTIgMi0wLjggMiAwLjggMC45IDJ6IG0tMTUuOC0xNS43cTAgMS4yLTAuOCAydC0yIDAuOS0yLTAuOS0wLjktMiAwLjktMiAyLTAuOSAyIDAuOSAwLjggMnogbTI2LjkgMTEuMXEwIDEuMi0wLjkgMnQtMiAwLjlxLTEuMiAwLTItMC45dC0wLjgtMiAwLjgtMiAyLTAuOCAyIDAuOCAwLjkgMnogbS0yMS41LTIyLjJxMCAxLjUtMS4xIDIuNXQtMi41IDEuMS0yLjUtMS4xLTEuMS0yLjUgMS4xLTIuNSAyLjUtMS4xIDIuNSAxLjEgMS4xIDIuNXogbTI2LjEgMTEuMXEwIDEuMi0wLjkgMnQtMiAwLjktMi0wLjktMC44LTIgMC44LTIgMi0wLjkgMiAwLjkgMC45IDJ6IG0tMTQuMy0xNS43cTAgMS44LTEuMyAzdC0zIDEuMy0zLTEuMy0xLjMtMyAxLjMtMy4xIDMtMS4yIDMgMS4zIDEuMyAzeiBtMTEuOCA0LjZxMCAyLjEtMS41IDMuNXQtMy41IDEuNXEtMi4xIDAtMy41LTEuNXQtMS41LTMuNXEwLTIuMSAxLjUtMy41dDMuNS0xLjVxMi4xIDAgMy41IDEuNXQxLjUgMy41eicgfSlcbiAgICAgICAgKVxuICAgICk7XG59O1xuXG5leHBvcnRzLmRlZmF1bHQgPSBGYVNwaW5uZXI7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IGhvaXN0Tm9uUmVhY3RTdGF0aWNzIGZyb20gJ2hvaXN0LW5vbi1yZWFjdC1zdGF0aWNzJztcbmltcG9ydCB7XG4gIGxvY2FsZVNlcnZpY2Vcbn0gZnJvbSAnZGV2LWJveC11aSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvY2FsZUF3YXJlKENvbXBvbmVudCkge1xuICBjbGFzcyBMb2NhbGVBd2FyZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMsIGNvbnRleHQpIHtcbiAgICAgIHN1cGVyKHByb3BzLCBjb250ZXh0KTtcbiAgICAgIHRoaXMuaGFuZGxlTG9jYWxlQ2hhbmdlID0gdGhpcy5oYW5kbGVMb2NhbGVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgICAgIHRoaXMudW5yZWdpc3RlckxvY2FsZUNoYW5nZSA9IG51bGw7XG4gICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICBsb2NhbGU6IGxvY2FsZVNlcnZpY2UubG9jYWxlXG4gICAgICB9O1xuICAgIH1cblxuICAgIGhhbmRsZUxvY2FsZUNoYW5nZShsb2NhbGUpIHtcbiAgICAgIHRoaXMuc3RhdGUubG9jYWxlICE9PSBsb2NhbGUgJiYgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGxvY2FsZVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICB0aGlzLnVucmVnaXN0ZXJMb2NhbGVDaGFuZ2UgPSBsb2NhbGVTZXJ2aWNlLm9uTG9jYWxlQ2hhbmdlKHRoaXMuaGFuZGxlTG9jYWxlQ2hhbmdlKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICAgIHRoaXMudW5yZWdpc3RlckxvY2FsZUNoYW5nZSgpO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgIGNvbnN0IHsgbG9jYWxlIH0gPSB0aGlzLnN0YXRlO1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPENvbXBvbmVudCB7IC4uLnRoaXMucHJvcHMgfSBsb2NhbGU9eyBsb2NhbGUgfSAvPlxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBMb2NhbGVBd2FyZS5kaXNwbGF5TmFtZSA9IGBMb2NhbGVBd2FyZSgke1xuICAgIENvbXBvbmVudC5kaXNwbGF5TmFtZSB8fFxuICAgIENvbXBvbmVudC5uYW1lIHx8XG4gICAgJ0NvbXBvbmVudCdcbiAgfSlgO1xuXG4gIHJldHVybiBob2lzdE5vblJlYWN0U3RhdGljcyhMb2NhbGVBd2FyZSwgQ29tcG9uZW50KTtcbn1cbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgaW5qZWN0U2hlZXQgZnJvbSAncmVhY3QtanNzJztcbmltcG9ydCBob2lzdE5vblJlYWN0U3RhdGljcyBmcm9tICdob2lzdC1ub24tcmVhY3Qtc3RhdGljcyc7XG5pbXBvcnQgeyB0aGVtaW5nIH0gZnJvbSAnLi4vdGhlbWluZy90aGVtaW5nJztcblxuXG5jb25zdCB7IFRoZW1lUHJvdmlkZXIgfSA9IHRoZW1pbmc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRoZW1lQXdhcmUoeyB0aGVtZSwgc3R5bGUgfSkge1xuICByZXR1cm4gZnVuY3Rpb24gdGhlbWVBd2FyZUlubmVyKENvbXBvbmVudCkge1xuICAgIGNvbnN0IFRvUmVuZGVyID0gc3R5bGUgPyBpbmplY3RTaGVldChzdHlsZSwgeyB0aGVtaW5nIH0pKENvbXBvbmVudCkgOiBDb21wb25lbnQ7XG5cbiAgICBjbGFzcyBUaGVtZUF3YXJlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICB0aGVtZSA/XG4gICAgICAgICAgICA8VGhlbWVQcm92aWRlciB0aGVtZT17IHRoZW1lIH0+XG4gICAgICAgICAgICAgIDxUb1JlbmRlciB7IC4uLnRoaXMucHJvcHMgfSAvPlxuICAgICAgICAgICAgPC9UaGVtZVByb3ZpZGVyPiA6XG4gICAgICAgICAgICA8VG9SZW5kZXIgeyAuLi50aGlzLnByb3BzIH0gLz5cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBUaGVtZUF3YXJlLmRpc3BsYXlOYW1lID0gYFRoZW1lQXdhcmUoJHtcbiAgICAgIENvbXBvbmVudC5kaXNwbGF5TmFtZSB8fFxuICAgICAgQ29tcG9uZW50Lm5hbWUgfHxcbiAgICAgICdDb21wb25lbnQnXG4gICAgfSlgO1xuXG4gICAgcmV0dXJuIGhvaXN0Tm9uUmVhY3RTdGF0aWNzKFRoZW1lQXdhcmUsIENvbXBvbmVudCk7XG4gIH07XG59XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBGYVNwaW5uZXIgZnJvbSAncmVhY3QtaWNvbnMvbGliL2ZhL3NwaW5uZXInO1xuaW1wb3J0IExpc3QgZnJvbSAnLi4vTGlzdC9MaXN0JztcbmltcG9ydCBXb3JsZCBmcm9tICcuLi9Xb3JsZC9Xb3JsZCc7XG5pbXBvcnQgdGhlbWVBd2FyZSBmcm9tICcuLi8uLi9IT0MvdGhlbWVBd2FyZSc7XG5cblxuY29uc3Qgc3R5bGUgPSAoeyB2YXJzIH0pID0+IHtcbiAgcmV0dXJuIHtcbiAgICBoZWxsbzoge1xuICAgICAgY29sb3I6IHZhcnMuY29sb3JzLnByaW1hcnlUZXh0Q29sb3IgfHwgJ29yYW5nZSdcbiAgICB9XG4gIH07XG59O1xuXG5jbGFzcyBIZWxsbyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IHRoZW1lIH0gPSB0aGlzLnByb3BzO1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAvKiBlc2xpbnQgbm8tY29uc29sZTogMCAqL1xuICAgICAgLy8gY29uc29sZS5sb2coJ3JlbmRlcmluZyBIZWxsbyBjb21wb25lbnQnLCB0aGVtZSk7XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17IHRoaXMucHJvcHMuY2xhc3Nlcy5oZWxsbyB9PlxuICAgICAgICBIZWxsbyB7IHRoaXMucHJvcHMubmFtZSB8fCAnTm9ib2R5JyB9XG4gICAgICAgIDxGYVNwaW5uZXIgY2xhc3NOYW1lPXsgdGhlbWUuYW5pbWF0aW9ucy5kYnVBbmltYXRpb25TcGluIH0vPlxuICAgICAgICA8TGlzdCBpdGVtcz17IFsnb25lJywgJ3R3byddIH0vPlxuICAgICAgICA8TGlzdCBpdGVtcz17IFsnb25lJywgJ3R3byddIH0vPlxuICAgICAgICA8V29ybGQvPlxuICAgICAgICA8V29ybGQvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5IZWxsby5wcm9wVHlwZXMgPSB7XG4gIHRoZW1lOiBQcm9wVHlwZXMub2JqZWN0LFxuICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIGNsYXNzZXM6IFByb3BUeXBlcy5vYmplY3Rcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHRoZW1lQXdhcmUoeyBzdHlsZSB9KShIZWxsbyk7XG5cbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IGNvbG9yIGZyb20gJ2NvbG9yJztcbmltcG9ydCB0aGVtZUF3YXJlIGZyb20gJy4uLy4uL0hPQy90aGVtZUF3YXJlJztcblxuY29uc3Qgc3R5bGUgPSAoeyB2YXJzIH0pID0+IHtcbiAgcmV0dXJuIHtcbiAgICBsaXN0OiB7XG4gICAgICAvLyBjb2xvcjogY29sb3IodmFycy5jb2xvcnMuc2Vjb25kYXJ5VGV4dENvbG9yIHx8ICdvcmFuZ2UnKS5saWdodGVuKDAuNSkuaGV4KClcbiAgICAgIGNvbG9yOiB2YXJzLmRpciA9PT0gJ2x0cicgPyAnZ3JlZW4nIDogJ3JlZCdcbiAgICB9XG4gIH07XG59O1xuXG5jbGFzcyBMaXN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8dWwgY2xhc3NOYW1lPXt0aGlzLnByb3BzLmNsYXNzZXMubGlzdH0+XG4gICAgICAgIHt0aGlzLnByb3BzLml0ZW1zLm1hcChpdGVtID0+IDxsaSBrZXk9e2l0ZW19PntpdGVtfTwvbGk+KX1cbiAgICAgIDwvdWw+XG4gICAgKTtcbiAgfVxufVxuXG5MaXN0LmRlZmF1bHRQcm9wcyA9IHtcbiAgaXRlbXM6IFtdXG59O1xuXG5MaXN0LnByb3BUeXBlcyA9IHtcbiAgaXRlbXM6IFByb3BUeXBlcy5hcnJheSxcbiAgY2xhc3NlczogUHJvcFR5cGVzLm9iamVjdFxufTtcblxuZXhwb3J0IGRlZmF1bHQgdGhlbWVBd2FyZSh7IHN0eWxlIH0pKExpc3QpO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgTGlzdCBmcm9tICcuLi9MaXN0L0xpc3QnO1xuaW1wb3J0IHRoZW1lQXdhcmUgZnJvbSAnLi4vLi4vSE9DL3RoZW1lQXdhcmUnO1xuXG5jb25zdCBzdHlsZSA9ICh7IHZhcnMgfSkgPT4ge1xuICByZXR1cm4ge1xuICAgIHdvcmxkOiB7XG4gICAgICBjb2xvcjogdmFycy5jb2xvcnMucHJpbWFyeVRleHRDb2xvciB8fCAnb3JhbmdlJ1xuICAgIH1cbiAgfTtcbn07XG5cbmNsYXNzIFdvcmxkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAvKiBlc2xpbnQgbm8tY29uc29sZTogMCAqL1xuICAgICAgLy8gY29uc29sZS5sb2coJ3JlbmRlcmluZyBIZWxsbyBjb21wb25lbnQnKTtcbiAgICB9XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXt0aGlzLnByb3BzLmNsYXNzZXMuaGVsbG99PlxuICAgICAgICBXb3JsZCAtLS0tLS0tLS0tLS1cbiAgICAgICAgPExpc3QgaXRlbXM9e1snZml2ZScsICdzaXgnXX0vPlxuICAgICAgICA8TGlzdCBpdGVtcz17WydmaXZlJywgJ3NpeCddfS8+XG4gICAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5Xb3JsZC5wcm9wVHlwZXMgPSB7XG4gIGNsYXNzZXM6IFByb3BUeXBlcy5vYmplY3Rcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHRoZW1lQXdhcmUoeyBzdHlsZSB9KShXb3JsZCk7XG5cbiIsIlxuY2xhc3MgTG9jYWxlU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX2NhbGxiYWNrcyA9IFtdO1xuICAgIHRoaXMuX2xvY2FsZUF0dHJzID0gWydkaXInLCAnbGFuZyddO1xuICAgIHRoaXMuX3Jvb3RFbGVtZW50ID0gd2luZG93LmRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICB0aGlzLl9sb2NhbGUgPSB0aGlzLl9sb2NhbGVBdHRycy5yZWR1Y2UoKGFjYywgYXR0cikgPT4ge1xuICAgICAgYWNjW2F0dHJdID0gdGhpcy5fcm9vdEVsZW1lbnQuZ2V0QXR0cmlidXRlKGF0dHIpO1xuICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCB7fSk7XG4gICAgdGhpcy5fb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcih0aGlzLl9oYW5kbGVNdXRhdGlvbnMuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5fb2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLl9yb290RWxlbWVudCwge1xuICAgICAgYXR0cmlidXRlczogdHJ1ZVxuICAgIH0pO1xuICB9XG5cbiAgX2hhbmRsZU11dGF0aW9ucyhtdXRhdGlvbnMpIHtcbiAgICBtdXRhdGlvbnMuZm9yRWFjaCgobXV0YXRpb24pID0+IHtcbiAgICAgIGNvbnN0IG11dGF0aW9uQXR0cmlidXRlTmFtZSA9IG11dGF0aW9uLmF0dHJpYnV0ZU5hbWU7XG4gICAgICBpZiAodGhpcy5fbG9jYWxlQXR0cnMuaW5jbHVkZXMobXV0YXRpb25BdHRyaWJ1dGVOYW1lKSkge1xuICAgICAgICB0aGlzLl9sb2NhbGUgPSB7XG4gICAgICAgICAgLi4udGhpcy5fbG9jYWxlLFxuICAgICAgICAgIFttdXRhdGlvbkF0dHJpYnV0ZU5hbWVdOiB0aGlzLl9yb290RWxlbWVudC5nZXRBdHRyaWJ1dGUobXV0YXRpb25BdHRyaWJ1dGVOYW1lKVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9jYWxsYmFja3MuZm9yRWFjaChjYWxsYmFjayA9PiBjYWxsYmFjayh0aGlzLl9sb2NhbGUpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldCBsb2NhbGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xvY2FsZTtcbiAgfVxuXG4gIG9uTG9jYWxlQ2hhbmdlKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuICAgIGNhbGxiYWNrKHRoaXMubG9jYWxlKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gdW5yZWdpc3RlckxvY2FsZUNoYW5nZSgpIHtcbiAgICAgIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcy5maWx0ZXIoY2IgPT4gY2IgIT09IGNhbGxiYWNrKTtcbiAgICB9O1xuICB9XG59XG5cbmNvbnN0IGxvY2FsZVNlcnZpY2UgPSBuZXcgTG9jYWxlU2VydmljZSgpO1xuZXhwb3J0IGRlZmF1bHQgbG9jYWxlU2VydmljZTtcbiIsImNvbnN0IGNvbW1vbkFuaW1hdGlvbnMgPSAoY29tbW9uVmFycykgPT4ge1xuICBjb25zdCB7IGRpciB9ID0gY29tbW9uVmFycztcbiAgcmV0dXJuIHtcbiAgICBbYEBrZXlmcmFtZXMgZGJ1QW5pbWF0aW9uU3Bpbl8ke2Rpcn1gXToge1xuICAgICAgJzAlJzoge1xuICAgICAgICB0cmFuc2Zvcm06ICdyb3RhdGUoMGRlZyknXG4gICAgICB9LFxuICAgICAgJzEwMCUnOiB7XG4gICAgICAgIHRyYW5zZm9ybTogZGlyID09PSAnbHRyJyA/ICdyb3RhdGUoMzU5ZGVnKScgOiAncm90YXRlKC0zNTlkZWcpJ1xuICAgICAgfVxuICAgIH0sXG4gICAgZGJ1QW5pbWF0aW9uU3Bpbjoge1xuICAgICAgYW5pbWF0aW9uOiBgZGJ1QW5pbWF0aW9uU3Bpbl8ke2Rpcn0gMnMgaW5maW5pdGUgbGluZWFyYCxcbiAgICAgIGFuaW1hdGlvbk5hbWU6IGBkYnVBbmltYXRpb25TcGluXyR7ZGlyfWAsXG4gICAgICBhbmltYXRpb25EdXJhdGlvbjogJzJzJyxcbiAgICAgIGFuaW1hdGlvblRpbWluZ0Z1bmN0aW9uOiAnbGluZWFyJyxcbiAgICAgIGFuaW1hdGlvbkRlbGF5OiAnaW5pdGlhbCcsXG4gICAgICBhbmltYXRpb25JdGVyYXRpb25Db3VudDogJ2luZmluaXRlJyxcbiAgICAgIGFuaW1hdGlvbkRpcmVjdGlvbjogJ2luaXRpYWwnLFxuICAgICAgYW5pbWF0aW9uRmlsbE1vZGU6ICdpbml0aWFsJyxcbiAgICAgIGFuaW1hdGlvblBsYXlTdGF0ZTogJ2luaXRpYWwnXG4gICAgfVxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY29tbW9uQW5pbWF0aW9ucztcbiIsIlxuY29uc3QgY29tbW9uQ2xhc3NlcyA9IChjb21tb25WYXJzKSA9PiB7XG4gIGNvbnN0IHsgZGlyLCBncmlkOiB7IGNvbHMsIGJyZWFrcG9pbnRzIH0gfSA9IGNvbW1vblZhcnM7XG4gIGNvbnN0IHN0YXJ0ID0gZGlyID09PSAnbHRyJyA/ICdsZWZ0JyA6ICdyaWdodCc7XG4gIC8qICBlc2xpbnQgbm8tdW51c2VkLXZhcnM6IDAgKi9cbiAgY29uc3QgZW5kID0gZGlyID09PSAnbHRyJyA/ICdyaWdodCcgOiAnbGVmdCc7XG5cbiAgcmV0dXJuIHtcbiAgICBjbGVhcmZpeDoge1xuICAgICAgem9vbTogMSxcbiAgICAgICcmOmJlZm9yZSwgJjphZnRlcic6IHtcbiAgICAgICAgY29udGVudDogJ1wiXCInLFxuICAgICAgICBkaXNwbGF5OiAndGFibGUnXG4gICAgICB9LFxuICAgICAgJyY6YWZ0ZXInOiB7XG4gICAgICAgIGNsZWFyOiAnYm90aCdcbiAgICAgIH1cbiAgICB9LFxuICAgIHJvdzoge1xuICAgICAgZXh0ZW5kOiAnY2xlYXJmaXgnXG4gICAgfSxcbiAgICBjb2w6IHtcbiAgICAgIGZsb2F0OiBzdGFydCxcbiAgICAgIHRleHRBbGlnbjogc3RhcnQsXG4gICAgICB3aWR0aDogJzEwMCUnXG4gICAgfSxcbiAgICAuLi5PYmplY3Qua2V5cyhicmVha3BvaW50cykucmVkdWNlKChhY2MsIGtleSkgPT4ge1xuICAgICAgcmV0dXJuIEFycmF5LmZyb20oeyBsZW5ndGg6IGNvbHMgfSlcbiAgICAgICAgLm1hcCgoZWwsIGkpID0+IGkgKyAxKVxuICAgICAgICAucmVkdWNlKChhY2MsIGkpID0+IHtcbiAgICAgICAgICBhY2NbYCR7a2V5fSR7aX1gXSA9IHtcbiAgICAgICAgICAgIFtgQG1lZGlhIChtaW4td2lkdGg6ICR7YnJlYWtwb2ludHNba2V5XX0pYF06IHtcbiAgICAgICAgICAgICAgd2lkdGg6IGAkeyhpIC8gY29scykgKiAxMDB9JWBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0sIGFjYyk7XG4gICAgfSwge30pXG4gIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb21tb25DbGFzc2VzO1xuIiwiXG5jb25zdCBjb21tb25WYXJzID0gZGlyID0+ICh7XG4gIGRpcixcbiAgY29sb3JzOiB7XG4gICAgcHJpbWFyeVRleHRDb2xvcjogJ2dyZWVuJyxcbiAgICBzZWNvbmRhcnlUZXh0Q29sb3I6ICdibHVlJ1xuICB9LFxuICBncmlkOiB7XG4gICAgYnJlYWtwb2ludHM6IHtcbiAgICAgIHhzOiAnMXB4JyxcbiAgICAgIHM6ICc1NzZweCcsXG4gICAgICBtOiAnNzY4cHgnLFxuICAgICAgbDogJzk5MnB4JyxcbiAgICAgIHhsOiAnMTIwMHB4J1xuICAgIH0sXG4gICAgY29sczogMTJcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IGNvbW1vblZhcnM7XG4iLCJpbXBvcnQgeyBqc3MgfSBmcm9tICdyZWFjdC1qc3MnO1xuaW1wb3J0IGNvbW1vblZhcnMgZnJvbSAnLi9jb21tb25WYXJzJztcbmltcG9ydCBjb21tb25BbmltYXRpb25zIGZyb20gJy4vY29tbW9uQW5pbWF0aW9ucyc7XG5pbXBvcnQgY29tbW9uQ2xhc3NlcyBmcm9tICcuL2NvbW1vbkNsYXNzZXMnO1xuXG5jb25zdCBkZWZhdWx0VGhlbWUgPSBbJ2x0cicsICdydGwnXS5yZWR1Y2UoKGFjYywgZGlyKSA9PiB7XG4gIGNvbnN0IGNvbW1vblZhcnNEaXIgPSBjb21tb25WYXJzKGRpcik7XG5cbiAgY29uc3QgY29tbW9uQW5pbWF0aW9uc0RpciA9IGpzcy5jcmVhdGVTdHlsZVNoZWV0KFxuICAgIGNvbW1vbkFuaW1hdGlvbnMoY29tbW9uVmFyc0RpciksIHtcbiAgICAgIG1ldGE6IGBjb21tb25BbmltYXRpb25zXyR7ZGlyfWBcbiAgICB9XG4gICkuYXR0YWNoKCk7XG5cbiAgY29uc3QgY29tbW9uQ2xhc3Nlc0RpciA9IGpzcy5jcmVhdGVTdHlsZVNoZWV0KFxuICAgIGNvbW1vbkNsYXNzZXMoY29tbW9uVmFyc0RpciksIHtcbiAgICAgIG1ldGE6IGBjb21tb25DbGFzc2VzXyR7ZGlyfWBcbiAgICB9XG4gICkuYXR0YWNoKCk7XG5cbiAgYWNjW2Rpcl0gPSB7XG4gICAgdmFyczogY29tbW9uVmFyc0RpcixcbiAgICBhbmltYXRpb25zOiBjb21tb25BbmltYXRpb25zRGlyLmNsYXNzZXMsXG4gICAgY29tbW9uOiBjb21tb25DbGFzc2VzRGlyLmNsYXNzZXNcbiAgfTtcblxuICByZXR1cm4gYWNjO1xufSwge30pO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZhdWx0VGhlbWU7XG5cbiIsImltcG9ydCB7IGNyZWF0ZVRoZW1pbmcgfSBmcm9tICdyZWFjdC1qc3MnO1xuXG5jb25zdCB0aGVtaW5nID0gY3JlYXRlVGhlbWluZygnX19EQlVfVEhFTUlOR19fJyk7XG5cbmV4cG9ydCB7XG4gIGNyZWF0ZVRoZW1pbmcsXG4gIHRoZW1pbmdcbn07XG4iLCJcbmNvbnN0IGJ1dHRvbkhlaWdodCA9ICcyNXB4JztcbmNvbnN0IGJ1dHRvblN0YXJ0ID0gJzVweCc7XG5jb25zdCBidXR0b25Ub3AgPSAnNXB4JztcblxubGV0IGNvbnNvbGVNZXNzYWdlcyA9IFtdO1xuY29uc3QgY29uc29sZUxvZyA9IGNvbnNvbGUubG9nLmJpbmQoY29uc29sZSk7XG5cbmZ1bmN0aW9uIGNhcHR1cmVDb25zb2xlKGNvbnNvbGVFbG0sIG9wdGlvbnMpIHtcbiAgY29uc3QgeyBpbmRlbnQgPSAyLCBzaG93TGFzdE9ubHkgPSBmYWxzZSB9ID0gb3B0aW9ucztcbiAgY29uc3QgaGFuZGxlciA9IGZ1bmN0aW9uIGhhbmRsZXIoYWN0aW9uLCAuLi5hcmdzKSB7XG4gICAgaWYgKHNob3dMYXN0T25seSkge1xuICAgICAgY29uc29sZU1lc3NhZ2VzID0gW3sgW2FjdGlvbl06IGFyZ3MgfV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGVNZXNzYWdlcy5wdXNoKHsgW2FjdGlvbl06IGFyZ3MgfSk7XG4gICAgfVxuXG4gICAgY29uc29sZUVsbS5pbm5lckhUTUwgPSBjb25zb2xlTWVzc2FnZXMubWFwKChlbnRyeSkgPT4ge1xuICAgICAgY29uc3QgYWN0aW9uID0gT2JqZWN0LmtleXMoZW50cnkpWzBdO1xuICAgICAgY29uc3QgdmFsdWVzID0gZW50cnlbYWN0aW9uXTtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSB2YWx1ZXMubWFwKChpdGVtKSA9PiB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgW3VuZGVmaW5lZCwgbnVsbF0uaW5jbHVkZXMoaXRlbSkgfHxcbiAgICAgICAgICBbJ251bWJlcicsICdzdHJpbmcnLCAnZnVuY3Rpb24nXS5pbmNsdWRlcyh0eXBlb2YgaXRlbSlcbiAgICAgICAgKSA/XG4gICAgICAgICAgaXRlbSA6XG4gICAgICAgICAgWydNYXAnLCAnU2V0J10uaW5jbHVkZXMoaXRlbS5jb25zdHJ1Y3Rvci5uYW1lKSA/XG4gICAgICAgICAgICBgJHtpdGVtLmNvbnN0cnVjdG9yLm5hbWV9ICgke0pTT04uc3RyaW5naWZ5KFsuLi5pdGVtXSl9KWAgOlxuICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoaXRlbSwgKGtleSwgdmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgaWYgKCh0eXBlb2YgdmFsdWUpID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfSwgaW5kZW50KTtcbiAgICAgIH0pLmpvaW4oJywgJyk7XG5cbiAgICAgIGNvbnN0IGNvbG9yID0ge1xuICAgICAgICBsb2c6ICcjMDAwJyxcbiAgICAgICAgd2FybjogJ29yYW5nZScsXG4gICAgICAgIGVycm9yOiAnZGFya3JlZCdcbiAgICAgIH1bYWN0aW9uXTtcblxuICAgICAgcmV0dXJuIGA8cHJlIHN0eWxlPVwiY29sb3I6ICR7Y29sb3J9XCI+JHttZXNzYWdlfTwvcHJlPmA7XG4gICAgfSkuam9pbignXFxuJyk7XG4gIH07XG4gIFsnbG9nJywgJ3dhcm4nLCAnZXJyb3InXS5mb3JFYWNoKChhY3Rpb24pID0+IHtcbiAgICBjb25zb2xlW2FjdGlvbl0gPSBoYW5kbGVyLmJpbmQoY29uc29sZSwgYWN0aW9uKTtcbiAgfSk7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIChldnQpID0+IHtcbiAgICAvLyBlc2xpbnQgbm8tY29uc29sZTogMFxuICAgIGNvbnNvbGUuZXJyb3IoYFwiJHtldnQubWVzc2FnZX1cIiBmcm9tICR7ZXZ0LmZpbGVuYW1lfToke2V2dC5saW5lbm99YCk7XG4gICAgY29uc29sZS5lcnJvcihldnQsIGV2dC5lcnJvci5zdGFjayk7XG4gICAgLy8gZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gIH0pO1xuICBjb25zb2xlTG9nKCdjb25zb2xlIGNhcHR1cmVkJyk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNvbnNvbGUoe1xuICBvcHRpb25zLFxuICBjb25zb2xlU3R5bGU6IHtcbiAgICBidG5TdGFydCA9IGJ1dHRvblN0YXJ0LCBidG5IZWlnaHQgPSBidXR0b25IZWlnaHQsXG4gICAgd2lkdGggPSBgY2FsYygxMDB2dyAtICR7YnRuU3RhcnR9IC0gMzBweClgLCBoZWlnaHQgPSAnNDAwcHgnLFxuICAgIGJhY2tncm91bmQgPSAncmdiYSgwLCAwLCAwLCAwLjUpJ1xuICB9XG59KSB7XG4gIGNvbnN0IHsgcnRsID0gZmFsc2UgfSA9IG9wdGlvbnM7XG4gIGNvbnN0IGNvbnNvbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgY29uc29sZS5pZCA9ICdEQlVvblNjcmVlbkNvbnNvbGUnO1xuICBjb25zb2xlLnN0eWxlLmNzc1RleHQgPSBgXG4gICAgZGlzcGxheTogYmxvY2s7XG4gICAgbWFyZ2luOiAwcHg7XG4gICAgcGFkZGluZzogNXB4O1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICBvdmVyZmxvdzogYXV0bztcbiAgICB3aWR0aDogJHt3aWR0aH07XG4gICAgaGVpZ2h0OiAke2hlaWdodH07XG4gICAgdG9wOiAke2J0bkhlaWdodH07XG4gICAgJHtydGwgPyAncmlnaHQnIDogJ2xlZnQnfTogMHB4O1xuICAgIGJhY2tncm91bmQ6ICR7YmFja2dyb3VuZH07XG4gICAgei1pbmRleDogOTk5OTtcbiAgICAtd2Via2l0LW92ZXJmbG93LXNjcm9sbGluZzogdG91Y2hcbiAgICBgO1xuICByZXR1cm4gY29uc29sZTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlQnV0dG9uKHtcbiAgb3B0aW9ucyxcbiAgYnV0dG9uU3R5bGU6IHtcbiAgICBwb3NpdGlvbiA9ICdmaXhlZCcsXG4gICAgd2lkdGggPSAnMjVweCcsIGhlaWdodCA9IGJ1dHRvbkhlaWdodCwgdG9wID0gYnV0dG9uVG9wLCBzdGFydCA9IGJ1dHRvblN0YXJ0LFxuICAgIGJhY2tncm91bmQgPSAncmdiYSgwLCAwLCAwLCAwLjUpJ1xuICB9XG59KSB7XG4gIGNvbnN0IHsgcnRsID0gZmFsc2UgfSA9IG9wdGlvbnM7XG4gIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBidXR0b24uaWQgPSAnREJVb25TY3JlZW5Db25zb2xlVG9nZ2xlcic7XG4gIGJ1dHRvbi5zdHlsZS5jc3NUZXh0ID0gYFxuICAgIHBvc2l0aW9uOiAke3Bvc2l0aW9ufTtcbiAgICB3aWR0aDogJHt3aWR0aH07XG4gICAgaGVpZ2h0OiAke2hlaWdodH07XG4gICAgdG9wOiAke3RvcH07XG4gICAgJHtydGwgPyAncmlnaHQnIDogJ2xlZnQnfTogJHtzdGFydH07XG4gICAgYmFja2dyb3VuZDogJHtiYWNrZ3JvdW5kfTtcbiAgICB6LWluZGV4OiA5OTk5O1xuICAgIGA7XG4gIHJldHVybiBidXR0b247XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG9uU2NyZWVuQ29uc29sZSh7XG4gIGJ1dHRvblN0eWxlID0ge30sXG4gIGNvbnNvbGVTdHlsZSA9IHt9LFxuICBvcHRpb25zID0ge31cbn0gPSB7fSkge1xuICBjb25zdCBidXR0b24gPSBjcmVhdGVCdXR0b24oe1xuICAgIG9wdGlvbnMsXG4gICAgYnV0dG9uU3R5bGVcbiAgfSk7XG4gIGNvbnN0IGNvbnNvbGUgPSBjcmVhdGVDb25zb2xlKHtcbiAgICBjb25zb2xlU3R5bGU6IHtcbiAgICAgIC4uLmNvbnNvbGVTdHlsZSxcbiAgICAgIGJ0bkhlaWdodDogYnV0dG9uU3R5bGUuaGVpZ2h0LFxuICAgICAgYnRuU3RhcnQ6IGJ1dHRvblN0eWxlLnN0YXJ0XG4gICAgfSxcbiAgICBvcHRpb25zXG4gIH0pO1xuXG4gIGNvbnNvbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIH0pO1xuXG4gIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBpZiAoIWJ1dHRvbi5jb250YWlucyhjb25zb2xlKSkge1xuICAgICAgYnV0dG9uLmFwcGVuZENoaWxkKGNvbnNvbGUpO1xuICAgICAgY29uc29sZS5zY3JvbGxUb3AgPSBjb25zb2xlLnNjcm9sbEhlaWdodCAtIGNvbnNvbGUuY2xpZW50SGVpZ2h0O1xuICAgIH0gZWxzZSB7XG4gICAgICBidXR0b24ucmVtb3ZlQ2hpbGQoY29uc29sZSk7XG4gICAgfVxuICB9KTtcblxuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGJ1dHRvbik7XG4gIGNhcHR1cmVDb25zb2xlKGNvbnNvbGUsIG9wdGlvbnMpO1xufVxuIiwiaW1wb3J0IEhlbGxvIGZyb20gJy4vY29tcG9uZW50cy9IZWxsby9IZWxsbyc7XG5pbXBvcnQgTGlzdCBmcm9tICcuL2NvbXBvbmVudHMvTGlzdC9MaXN0JztcbmltcG9ydCBvblNjcmVlbkNvbnNvbGUgZnJvbSAnLi91dGlscy9vblNjcmVlbkNvbnNvbGUnO1xuaW1wb3J0IGxvY2FsZVNlcnZpY2UgZnJvbSAnLi9zZXJ2aWNlcy9Mb2NhbGVTZXJ2aWNlJztcbmltcG9ydCB7IHRoZW1pbmcgfSBmcm9tICcuL3RoZW1pbmcvdGhlbWluZyc7XG5pbXBvcnQgbG9jYWxlQXdhcmUgZnJvbSAnLi9IT0MvbG9jYWxlQXdhcmUnO1xuaW1wb3J0IGRlZmF1bHRUaGVtZSBmcm9tICcuL3N0eWxlcy9kZWZhdWx0VGhlbWUnO1xuXG5leHBvcnQge1xuICBvblNjcmVlbkNvbnNvbGUsXG4gIGxvY2FsZVNlcnZpY2UsXG4gIGxvY2FsZUF3YXJlLFxuICBkZWZhdWx0VGhlbWUsXG4gIHRoZW1pbmcsXG4gIEhlbGxvLFxuICBMaXN0XG59O1xuIl19
