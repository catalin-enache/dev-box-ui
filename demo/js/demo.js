(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function createBroadcast (initialState) {
  var listeners = {};
  var id = 0;
  var _state = initialState;

  var getState = function () { return _state; };

  var setState = function (state) {
    _state = state;
    Object.keys(listeners).forEach(function (id) { return listeners[id](_state); });
  };

  var subscribe = function (listener) {
    var currentId = id;
    listeners[currentId] = listener;
    id += 1;
    return function unsubscribe () {
      delete listeners[currentId];
    }
  };

  return { getState: getState, setState: setState, subscribe: subscribe }
}

module.exports = createBroadcast;

},{}],2:[function(require,module,exports){
/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
'use strict';

var REACT_STATICS = {
    childContextTypes: true,
    contextTypes: true,
    defaultProps: true,
    displayName: true,
    getDefaultProps: true,
    mixins: true,
    propTypes: true,
    type: true
};

var KNOWN_STATICS = {
  name: true,
  length: true,
  prototype: true,
  caller: true,
  callee: true,
  arguments: true,
  arity: true
};

var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;
var getPrototypeOf = Object.getPrototypeOf;
var objectPrototype = getPrototypeOf && getPrototypeOf(Object);
var getOwnPropertyNames = Object.getOwnPropertyNames;

module.exports = function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
    if (typeof sourceComponent !== 'string') { // don't hoist over string (html) components

        if (objectPrototype) {
            var inheritedComponent = getPrototypeOf(sourceComponent);
            if (inheritedComponent && inheritedComponent !== objectPrototype) {
                hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
            }
        }

        var keys = getOwnPropertyNames(sourceComponent);

        if (getOwnPropertySymbols) {
            keys = keys.concat(getOwnPropertySymbols(sourceComponent));
        }

        for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            if (!REACT_STATICS[key] && !KNOWN_STATICS[key] && (!blacklist || !blacklist[key])) {
                // Only hoist enumerables and non-enumerable functions
                if(propIsEnumerable.call(sourceComponent, key) || typeof sourceComponent[key] === 'function') {
                    try { // Avoid failures from read-only properties
                        targetComponent[key] = sourceComponent[key];
                    } catch (e) {}
                }
            }
        }

        return targetComponent;
    }

    return targetComponent;
};

},{}],3:[function(require,module,exports){
module.exports = isFunction

var toString = Object.prototype.toString

function isFunction (fn) {
  var string = toString.call(fn)
  return string === '[object Function]' ||
    (typeof fn === 'function' && string !== '[object RegExp]') ||
    (typeof window !== 'undefined' &&
     // IE8 and below
     (fn === window.setTimeout ||
      fn === window.alert ||
      fn === window.confirm ||
      fn === window.prompt))
};

},{}],4:[function(require,module,exports){
/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

var isObject = require('isobject');

function isObjectObject(o) {
  return isObject(o) === true
    && Object.prototype.toString.call(o) === '[object Object]';
}

module.exports = function isPlainObject(o) {
  var ctor,prot;

  if (isObjectObject(o) === false) return false;

  // If has modified constructor
  ctor = o.constructor;
  if (typeof ctor !== 'function') return false;

  // If has modified prototype
  prot = ctor.prototype;
  if (isObjectObject(prot) === false) return false;

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
};

},{"isobject":5}],5:[function(require,module,exports){
/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

module.exports = function isObject(val) {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
};

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = '__THEMING__';
},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createThemeListener;

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _channel = require('./channel');

var _channel2 = _interopRequireDefault(_channel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function createThemeListener() {
  var CHANNEL = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _channel2.default;

  var contextTypes = _defineProperty({}, CHANNEL, _propTypes2.default.object.isRequired);

  function initial(context) {
    if (!context[CHANNEL]) {
      throw new Error('[' + this.displayName + '] Please use ThemeProvider to be able to use WithTheme');
    }

    return context[CHANNEL].getState();
  }

  function subscribe(context, cb) {
    if (context[CHANNEL]) {
      return context[CHANNEL].subscribe(cb);
    }
  }

  return {
    contextTypes: contextTypes,
    initial: initial,
    subscribe: subscribe
  };
}
},{"./channel":6,"prop-types":"prop-types"}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = createThemeProvider;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _isFunction = require('is-function');

var _isFunction2 = _interopRequireDefault(_isFunction);

var _isPlainObject = require('is-plain-object');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _channel = require('./channel');

var _channel2 = _interopRequireDefault(_channel);

var _brcast = require('brcast');

var _brcast2 = _interopRequireDefault(_brcast);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Provide a theme to an entire react component tree via context
 * and event listeners (have to do both context
 * and event emitter as pure components block context updates)
 */

function createThemeProvider() {
  var _class, _temp2;

  var CHANNEL = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _channel2.default;

  return _temp2 = _class = function (_React$Component) {
    _inherits(ThemeProvider, _React$Component);

    function ThemeProvider() {
      var _ref;

      var _temp, _this, _ret;

      _classCallCheck(this, ThemeProvider);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ThemeProvider.__proto__ || Object.getPrototypeOf(ThemeProvider)).call.apply(_ref, [this].concat(args))), _this), _this.broadcast = (0, _brcast2.default)(_this.getTheme()), _this.setOuterTheme = function (theme) {
        _this.outerTheme = theme;
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(ThemeProvider, [{
      key: 'getTheme',


      // Get the theme from the props, supporting both (outerTheme) => {} as well as object notation
      value: function getTheme(passedTheme) {
        var theme = passedTheme || this.props.theme;
        if ((0, _isFunction2.default)(theme)) {
          var mergedTheme = theme(this.outerTheme);
          if (!(0, _isPlainObject2.default)(mergedTheme)) {
            throw new Error('[ThemeProvider] Please return an object from your theme function, i.e. theme={() => ({})}!');
          }
          return mergedTheme;
        }
        if (!(0, _isPlainObject2.default)(theme)) {
          throw new Error('[ThemeProvider] Please make your theme prop a plain object');
        }

        if (!this.outerTheme) {
          return theme;
        }

        return _extends({}, this.outerTheme, theme);
      }
    }, {
      key: 'getChildContext',
      value: function getChildContext() {
        return _defineProperty({}, CHANNEL, this.broadcast);
      }
    }, {
      key: 'componentDidMount',
      value: function componentDidMount() {
        // create a new subscription for keeping track of outer theme, if present
        if (this.context[CHANNEL]) {
          this.unsubscribe = this.context[CHANNEL].subscribe(this.setOuterTheme);
        }
      }

      // set broadcast state by merging outer theme with own

    }, {
      key: 'componentWillMount',
      value: function componentWillMount() {
        if (this.context[CHANNEL]) {
          this.setOuterTheme(this.context[CHANNEL].getState());
          this.broadcast.setState(this.getTheme());
        }
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        if (this.props.theme !== nextProps.theme) {
          this.broadcast.setState(this.getTheme(nextProps.theme));
        }
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        if (typeof this.unsubscribe === 'function') {
          this.unsubscribe();
        }
      }
    }, {
      key: 'render',
      value: function render() {
        if (!this.props.children) {
          return null;
        }
        return _react2.default.Children.only(this.props.children);
      }
    }]);

    return ThemeProvider;
  }(_react2.default.Component), _class.propTypes = {
    children: _propTypes2.default.element,
    theme: _propTypes2.default.oneOfType([_propTypes2.default.shape({}), _propTypes2.default.func]).isRequired
  }, _class.childContextTypes = _defineProperty({}, CHANNEL, _propTypes2.default.object.isRequired), _class.contextTypes = _defineProperty({}, CHANNEL, _propTypes2.default.object), _temp2;
}
},{"./channel":6,"brcast":1,"is-function":3,"is-plain-object":4,"prop-types":"prop-types","react":"react"}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = createWithTheme;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _channel = require('./channel');

var _channel2 = _interopRequireDefault(_channel);

var _createThemeListener = require('./create-theme-listener');

var _createThemeListener2 = _interopRequireDefault(_createThemeListener);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var getDisplayName = function getDisplayName(Component) {
  return Component.displayName || Component.name || 'Component';
};

function createWithTheme() {
  var CHANNEL = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _channel2.default;

  var themeListener = (0, _createThemeListener2.default)(CHANNEL);
  return function (Component) {
    var _class, _temp;

    return _temp = _class = function (_React$Component) {
      _inherits(WithTheme, _React$Component);

      function WithTheme(props, context) {
        _classCallCheck(this, WithTheme);

        var _this = _possibleConstructorReturn(this, (WithTheme.__proto__ || Object.getPrototypeOf(WithTheme)).call(this, props, context));

        _this.state = { theme: themeListener.initial(context) };
        _this.setTheme = function (theme) {
          return _this.setState({ theme: theme });
        };
        return _this;
      }

      _createClass(WithTheme, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
          this.unsubscribe = themeListener.subscribe(this.context, this.setTheme);
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          if (typeof this.unsubscribe === 'function') {
            this.unsubscribe();
          }
        }
      }, {
        key: 'render',
        value: function render() {
          var theme = this.state.theme;


          return _react2.default.createElement(Component, _extends({ theme: theme }, this.props));
        }
      }]);

      return WithTheme;
    }(_react2.default.Component), _class.displayName = 'WithTheme(' + getDisplayName(Component) + ')', _class.contextTypes = themeListener.contextTypes, _temp;
  };
}
},{"./channel":6,"./create-theme-listener":7,"react":"react"}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.themeListener = exports.ThemeProvider = exports.withTheme = exports.channel = undefined;
exports.createTheming = createTheming;

var _createThemeProvider = require('./create-theme-provider');

var _createThemeProvider2 = _interopRequireDefault(_createThemeProvider);

var _createWithTheme = require('./create-with-theme');

var _createWithTheme2 = _interopRequireDefault(_createWithTheme);

var _createThemeListener = require('./create-theme-listener');

var _createThemeListener2 = _interopRequireDefault(_createThemeListener);

var _channel = require('./channel');

var _channel2 = _interopRequireDefault(_channel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var channel = exports.channel = _channel2.default;
var withTheme = exports.withTheme = (0, _createWithTheme2.default)();
var ThemeProvider = exports.ThemeProvider = (0, _createThemeProvider2.default)();
var themeListener = exports.themeListener = (0, _createThemeListener2.default)();
function createTheming() {
  var customChannel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _channel2.default;

  return {
    channel: customChannel,
    withTheme: (0, _createWithTheme2.default)(customChannel),
    ThemeProvider: (0, _createThemeProvider2.default)(customChannel),
    themeListener: (0, _createThemeListener2.default)(customChannel)
  };
}

exports.default = {
  channel: _channel2.default,
  withTheme: withTheme,
  ThemeProvider: ThemeProvider,
  themeListener: themeListener,
  createTheming: createTheming
};
},{"./channel":6,"./create-theme-listener":7,"./create-theme-provider":8,"./create-with-theme":9}],11:[function(require,module,exports){
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

},{"../theming/theming":12,"hoist-non-react-statics":2,"react":"react","react-jss":"react-jss"}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.theming = exports.createTheming = undefined;

var _theming = require('theming');

const theming = (0, _theming.createTheming)('__DBU_THEMING__');

exports.createTheming = _theming.createTheming;
exports.theming = theming;

},{"theming":10}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _themeAware = require('../src/lib/HOC/themeAware');

var _themeAware2 = _interopRequireDefault(_themeAware);

var _screens = require('./screens');

var _screens2 = _interopRequireDefault(_screens);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const style = ({ vars }) => {
  return {
    sectionLinks: {
      color: vars.colors.primaryTextColor || 'orange'
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
    const screensKeys = Object.keys(_screens2.default);
    const links = screensKeys.map((screen, idx) => _react2.default.createElement(
      'a',
      { key: idx, href: `#${screen}` },
      screen
    ));
    const Screen = _screens2.default[(window.location.hash || `#${screensKeys[0]}`).replace('#', '')];

    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'div',
        null,
        links
      ),
      _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(Screen, null)
      )
    );
  }
}

exports.default = (0, _themeAware2.default)({ style })(App);

},{"../src/lib/HOC/themeAware":11,"./screens":17,"react":"react"}],14:[function(require,module,exports){
'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _devBoxUi = require('dev-box-ui');

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _devBoxUi.onScreenConsole)({ buttonStyle: {}, consoleStyle: {}, options: { rtl: false } });
for (let i = 0; i < 100; i += 1) {
  console.log('foo', 'bar', 5, null, undefined, new Map([[2, 7]]), new Set([4, 5]), [8, 9, 10], function () {
    console.log('bla');
  }, { a: { b: { c: [1, function () {
          console.log('inline');
        }] } } });
}
console.warn('warning');
console.error('error');

const { ThemeProvider } = _devBoxUi.theming;

const customTheme = {
  vars: {
    colors: {
      primaryTextColor: 'brown',
      secondaryTextColor: 'green'
    }
  },
  animations: _devBoxUi.defaultTheme.animations
};

class Demo extends _react2.default.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      theme: _devBoxUi.defaultTheme
    };
  }

  componentDidMount() {
    // setInterval(() => {
    //   this.setState({
    //     theme: this.state.theme === defaultTheme ?
    //       customTheme :
    //       defaultTheme
    //   });
    // }, 1000);
  }

  render() {
    return _react2.default.createElement(
      ThemeProvider,
      { theme: this.state.theme },
      _react2.default.createElement(_app2.default, null)
    );
  }
}

_reactDom2.default.render(_react2.default.createElement(Demo, null), document.getElementById('demo'));

},{"./app":13,"dev-box-ui":"dev-box-ui","react":"react","react-dom":"react-dom"}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _devBoxUi = require('dev-box-ui');

var _themeAware = require('../../src/lib/HOC/themeAware');

var _themeAware2 = _interopRequireDefault(_themeAware);

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
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(_devBoxUi.Hello, null),
      _react2.default.createElement(_devBoxUi.Hello, null),
      _react2.default.createElement(_devBoxUi.Hello, null)
    );
  }
}

exports.default = (0, _themeAware2.default)({ style })(HelloScreen);

},{"../../src/lib/HOC/themeAware":11,"dev-box-ui":"dev-box-ui","react":"react"}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _devBoxUi = require('dev-box-ui');

var _themeAware = require('../../src/lib/HOC/themeAware');

var _themeAware2 = _interopRequireDefault(_themeAware);

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

exports.default = (0, _themeAware2.default)({ style })(ListScreen);

},{"../../src/lib/HOC/themeAware":11,"dev-box-ui":"dev-box-ui","react":"react"}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _HelloScreen = require('./HelloScreen');

var _HelloScreen2 = _interopRequireDefault(_HelloScreen);

var _ListScreen = require('./ListScreen');

var _ListScreen2 = _interopRequireDefault(_ListScreen);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  HelloScreen: _HelloScreen2.default,
  ListScreen: _ListScreen2.default
};

},{"./HelloScreen":15,"./ListScreen":16}]},{},[14])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJjYXN0L2Rpc3QvYnJjYXN0LmNqcy5qcyIsIm5vZGVfbW9kdWxlcy9ob2lzdC1ub24tcmVhY3Qtc3RhdGljcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9pcy1mdW5jdGlvbi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9pcy1wbGFpbi1vYmplY3QvaW5kZXguanMiLCJub2RlX21vZHVsZXMvaXMtcGxhaW4tb2JqZWN0L25vZGVfbW9kdWxlcy9pc29iamVjdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy90aGVtaW5nL2Rpc3QvY2pzL2NoYW5uZWwuanMiLCJub2RlX21vZHVsZXMvdGhlbWluZy9kaXN0L2Nqcy9jcmVhdGUtdGhlbWUtbGlzdGVuZXIuanMiLCJub2RlX21vZHVsZXMvdGhlbWluZy9kaXN0L2Nqcy9jcmVhdGUtdGhlbWUtcHJvdmlkZXIuanMiLCJub2RlX21vZHVsZXMvdGhlbWluZy9kaXN0L2Nqcy9jcmVhdGUtd2l0aC10aGVtZS5qcyIsIm5vZGVfbW9kdWxlcy90aGVtaW5nL2Rpc3QvY2pzL2luZGV4LmpzIiwic3JjL2xpYi9IT0MvdGhlbWVBd2FyZS5qcyIsInNyYy9saWIvdGhlbWluZy90aGVtaW5nLmpzIiwic3JjRGVtby9hcHAuanMiLCJzcmNEZW1vL2RlbW8uanMiLCJzcmNEZW1vL3NjcmVlbnMvSGVsbG9TY3JlZW4uanMiLCJzcmNEZW1vL3NjcmVlbnMvTGlzdFNjcmVlbi5qcyIsInNyY0RlbW8vc2NyZWVucy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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TSxTQUEvQixDQUF5QztBQUN2QyxXQUFTO0FBQ1AsV0FDRTtBQUFBO0FBQUE7QUFDRSxzREFBTSxPQUFPLENBQUMsT0FBRCxFQUFVLE1BQVYsQ0FBYixHQURGO0FBRUUsc0RBQU0sT0FBTyxDQUFDLE9BQUQsRUFBVSxNQUFWLENBQWI7QUFGRixLQURGO0FBTUQ7QUFSc0M7O2tCQVcxQiwwQkFBVyxFQUFFLEtBQUYsRUFBWCxFQUFzQixVQUF0QixDOzs7Ozs7Ozs7QUN6QmY7Ozs7QUFDQTs7Ozs7O2tCQUVlO0FBQ2Isb0NBRGE7QUFFYjtBQUZhLEMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZnVuY3Rpb24gY3JlYXRlQnJvYWRjYXN0IChpbml0aWFsU3RhdGUpIHtcbiAgdmFyIGxpc3RlbmVycyA9IHt9O1xuICB2YXIgaWQgPSAwO1xuICB2YXIgX3N0YXRlID0gaW5pdGlhbFN0YXRlO1xuXG4gIHZhciBnZXRTdGF0ZSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIF9zdGF0ZTsgfTtcblxuICB2YXIgc2V0U3RhdGUgPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICBfc3RhdGUgPSBzdGF0ZTtcbiAgICBPYmplY3Qua2V5cyhsaXN0ZW5lcnMpLmZvckVhY2goZnVuY3Rpb24gKGlkKSB7IHJldHVybiBsaXN0ZW5lcnNbaWRdKF9zdGF0ZSk7IH0pO1xuICB9O1xuXG4gIHZhciBzdWJzY3JpYmUgPSBmdW5jdGlvbiAobGlzdGVuZXIpIHtcbiAgICB2YXIgY3VycmVudElkID0gaWQ7XG4gICAgbGlzdGVuZXJzW2N1cnJlbnRJZF0gPSBsaXN0ZW5lcjtcbiAgICBpZCArPSAxO1xuICAgIHJldHVybiBmdW5jdGlvbiB1bnN1YnNjcmliZSAoKSB7XG4gICAgICBkZWxldGUgbGlzdGVuZXJzW2N1cnJlbnRJZF07XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiB7IGdldFN0YXRlOiBnZXRTdGF0ZSwgc2V0U3RhdGU6IHNldFN0YXRlLCBzdWJzY3JpYmU6IHN1YnNjcmliZSB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQnJvYWRjYXN0O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNSwgWWFob28hIEluYy5cbiAqIENvcHlyaWdodHMgbGljZW5zZWQgdW5kZXIgdGhlIE5ldyBCU0QgTGljZW5zZS4gU2VlIHRoZSBhY2NvbXBhbnlpbmcgTElDRU5TRSBmaWxlIGZvciB0ZXJtcy5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUkVBQ1RfU1RBVElDUyA9IHtcbiAgICBjaGlsZENvbnRleHRUeXBlczogdHJ1ZSxcbiAgICBjb250ZXh0VHlwZXM6IHRydWUsXG4gICAgZGVmYXVsdFByb3BzOiB0cnVlLFxuICAgIGRpc3BsYXlOYW1lOiB0cnVlLFxuICAgIGdldERlZmF1bHRQcm9wczogdHJ1ZSxcbiAgICBtaXhpbnM6IHRydWUsXG4gICAgcHJvcFR5cGVzOiB0cnVlLFxuICAgIHR5cGU6IHRydWVcbn07XG5cbnZhciBLTk9XTl9TVEFUSUNTID0ge1xuICBuYW1lOiB0cnVlLFxuICBsZW5ndGg6IHRydWUsXG4gIHByb3RvdHlwZTogdHJ1ZSxcbiAgY2FsbGVyOiB0cnVlLFxuICBjYWxsZWU6IHRydWUsXG4gIGFyZ3VtZW50czogdHJ1ZSxcbiAgYXJpdHk6IHRydWVcbn07XG5cbnZhciBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBwcm9wSXNFbnVtZXJhYmxlID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcbnZhciBnZXRQcm90b3R5cGVPZiA9IE9iamVjdC5nZXRQcm90b3R5cGVPZjtcbnZhciBvYmplY3RQcm90b3R5cGUgPSBnZXRQcm90b3R5cGVPZiAmJiBnZXRQcm90b3R5cGVPZihPYmplY3QpO1xudmFyIGdldE93blByb3BlcnR5TmFtZXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBob2lzdE5vblJlYWN0U3RhdGljcyh0YXJnZXRDb21wb25lbnQsIHNvdXJjZUNvbXBvbmVudCwgYmxhY2tsaXN0KSB7XG4gICAgaWYgKHR5cGVvZiBzb3VyY2VDb21wb25lbnQgIT09ICdzdHJpbmcnKSB7IC8vIGRvbid0IGhvaXN0IG92ZXIgc3RyaW5nIChodG1sKSBjb21wb25lbnRzXG5cbiAgICAgICAgaWYgKG9iamVjdFByb3RvdHlwZSkge1xuICAgICAgICAgICAgdmFyIGluaGVyaXRlZENvbXBvbmVudCA9IGdldFByb3RvdHlwZU9mKHNvdXJjZUNvbXBvbmVudCk7XG4gICAgICAgICAgICBpZiAoaW5oZXJpdGVkQ29tcG9uZW50ICYmIGluaGVyaXRlZENvbXBvbmVudCAhPT0gb2JqZWN0UHJvdG90eXBlKSB7XG4gICAgICAgICAgICAgICAgaG9pc3ROb25SZWFjdFN0YXRpY3ModGFyZ2V0Q29tcG9uZW50LCBpbmhlcml0ZWRDb21wb25lbnQsIGJsYWNrbGlzdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIga2V5cyA9IGdldE93blByb3BlcnR5TmFtZXMoc291cmNlQ29tcG9uZW50KTtcblxuICAgICAgICBpZiAoZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG4gICAgICAgICAgICBrZXlzID0ga2V5cy5jb25jYXQoZ2V0T3duUHJvcGVydHlTeW1ib2xzKHNvdXJjZUNvbXBvbmVudCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICB2YXIga2V5ID0ga2V5c1tpXTtcbiAgICAgICAgICAgIGlmICghUkVBQ1RfU1RBVElDU1trZXldICYmICFLTk9XTl9TVEFUSUNTW2tleV0gJiYgKCFibGFja2xpc3QgfHwgIWJsYWNrbGlzdFtrZXldKSkge1xuICAgICAgICAgICAgICAgIC8vIE9ubHkgaG9pc3QgZW51bWVyYWJsZXMgYW5kIG5vbi1lbnVtZXJhYmxlIGZ1bmN0aW9uc1xuICAgICAgICAgICAgICAgIGlmKHByb3BJc0VudW1lcmFibGUuY2FsbChzb3VyY2VDb21wb25lbnQsIGtleSkgfHwgdHlwZW9mIHNvdXJjZUNvbXBvbmVudFtrZXldID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7IC8vIEF2b2lkIGZhaWx1cmVzIGZyb20gcmVhZC1vbmx5IHByb3BlcnRpZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldENvbXBvbmVudFtrZXldID0gc291cmNlQ29tcG9uZW50W2tleV07XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRhcmdldENvbXBvbmVudDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGFyZ2V0Q29tcG9uZW50O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gaXNGdW5jdGlvblxuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nXG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24gKGZuKSB7XG4gIHZhciBzdHJpbmcgPSB0b1N0cmluZy5jYWxsKGZuKVxuICByZXR1cm4gc3RyaW5nID09PSAnW29iamVjdCBGdW5jdGlvbl0nIHx8XG4gICAgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJyAmJiBzdHJpbmcgIT09ICdbb2JqZWN0IFJlZ0V4cF0nKSB8fFxuICAgICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAvLyBJRTggYW5kIGJlbG93XG4gICAgIChmbiA9PT0gd2luZG93LnNldFRpbWVvdXQgfHxcbiAgICAgIGZuID09PSB3aW5kb3cuYWxlcnQgfHxcbiAgICAgIGZuID09PSB3aW5kb3cuY29uZmlybSB8fFxuICAgICAgZm4gPT09IHdpbmRvdy5wcm9tcHQpKVxufTtcbiIsIi8qIVxuICogaXMtcGxhaW4tb2JqZWN0IDxodHRwczovL2dpdGh1Yi5jb20vam9uc2NobGlua2VydC9pcy1wbGFpbi1vYmplY3Q+XG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LTIwMTcsIEpvbiBTY2hsaW5rZXJ0LlxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnaXNvYmplY3QnKTtcblxuZnVuY3Rpb24gaXNPYmplY3RPYmplY3Qobykge1xuICByZXR1cm4gaXNPYmplY3QobykgPT09IHRydWVcbiAgICAmJiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobykgPT09ICdbb2JqZWN0IE9iamVjdF0nO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzUGxhaW5PYmplY3Qobykge1xuICB2YXIgY3Rvcixwcm90O1xuXG4gIGlmIChpc09iamVjdE9iamVjdChvKSA9PT0gZmFsc2UpIHJldHVybiBmYWxzZTtcblxuICAvLyBJZiBoYXMgbW9kaWZpZWQgY29uc3RydWN0b3JcbiAgY3RvciA9IG8uY29uc3RydWN0b3I7XG4gIGlmICh0eXBlb2YgY3RvciAhPT0gJ2Z1bmN0aW9uJykgcmV0dXJuIGZhbHNlO1xuXG4gIC8vIElmIGhhcyBtb2RpZmllZCBwcm90b3R5cGVcbiAgcHJvdCA9IGN0b3IucHJvdG90eXBlO1xuICBpZiAoaXNPYmplY3RPYmplY3QocHJvdCkgPT09IGZhbHNlKSByZXR1cm4gZmFsc2U7XG5cbiAgLy8gSWYgY29uc3RydWN0b3IgZG9lcyBub3QgaGF2ZSBhbiBPYmplY3Qtc3BlY2lmaWMgbWV0aG9kXG4gIGlmIChwcm90Lmhhc093blByb3BlcnR5KCdpc1Byb3RvdHlwZU9mJykgPT09IGZhbHNlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gTW9zdCBsaWtlbHkgYSBwbGFpbiBPYmplY3RcbiAgcmV0dXJuIHRydWU7XG59O1xuIiwiLyohXG4gKiBpc29iamVjdCA8aHR0cHM6Ly9naXRodWIuY29tL2pvbnNjaGxpbmtlcnQvaXNvYmplY3Q+XG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LTIwMTcsIEpvbiBTY2hsaW5rZXJ0LlxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc09iamVjdCh2YWwpIHtcbiAgcmV0dXJuIHZhbCAhPSBudWxsICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnICYmIEFycmF5LmlzQXJyYXkodmFsKSA9PT0gZmFsc2U7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gJ19fVEhFTUlOR19fJzsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSBjcmVhdGVUaGVtZUxpc3RlbmVyO1xuXG52YXIgX3Byb3BUeXBlcyA9IHJlcXVpcmUoJ3Byb3AtdHlwZXMnKTtcblxudmFyIF9wcm9wVHlwZXMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcHJvcFR5cGVzKTtcblxudmFyIF9jaGFubmVsID0gcmVxdWlyZSgnLi9jaGFubmVsJyk7XG5cbnZhciBfY2hhbm5lbDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jaGFubmVsKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cblxuZnVuY3Rpb24gY3JlYXRlVGhlbWVMaXN0ZW5lcigpIHtcbiAgdmFyIENIQU5ORUwgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IF9jaGFubmVsMi5kZWZhdWx0O1xuXG4gIHZhciBjb250ZXh0VHlwZXMgPSBfZGVmaW5lUHJvcGVydHkoe30sIENIQU5ORUwsIF9wcm9wVHlwZXMyLmRlZmF1bHQub2JqZWN0LmlzUmVxdWlyZWQpO1xuXG4gIGZ1bmN0aW9uIGluaXRpYWwoY29udGV4dCkge1xuICAgIGlmICghY29udGV4dFtDSEFOTkVMXSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdbJyArIHRoaXMuZGlzcGxheU5hbWUgKyAnXSBQbGVhc2UgdXNlIFRoZW1lUHJvdmlkZXIgdG8gYmUgYWJsZSB0byB1c2UgV2l0aFRoZW1lJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbnRleHRbQ0hBTk5FTF0uZ2V0U3RhdGUoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHN1YnNjcmliZShjb250ZXh0LCBjYikge1xuICAgIGlmIChjb250ZXh0W0NIQU5ORUxdKSB7XG4gICAgICByZXR1cm4gY29udGV4dFtDSEFOTkVMXS5zdWJzY3JpYmUoY2IpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgY29udGV4dFR5cGVzOiBjb250ZXh0VHlwZXMsXG4gICAgaW5pdGlhbDogaW5pdGlhbCxcbiAgICBzdWJzY3JpYmU6IHN1YnNjcmliZVxuICB9O1xufSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxudmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gY3JlYXRlVGhlbWVQcm92aWRlcjtcblxudmFyIF9yZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX3Byb3BUeXBlcyA9IHJlcXVpcmUoJ3Byb3AtdHlwZXMnKTtcblxudmFyIF9wcm9wVHlwZXMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcHJvcFR5cGVzKTtcblxudmFyIF9pc0Z1bmN0aW9uID0gcmVxdWlyZSgnaXMtZnVuY3Rpb24nKTtcblxudmFyIF9pc0Z1bmN0aW9uMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2lzRnVuY3Rpb24pO1xuXG52YXIgX2lzUGxhaW5PYmplY3QgPSByZXF1aXJlKCdpcy1wbGFpbi1vYmplY3QnKTtcblxudmFyIF9pc1BsYWluT2JqZWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2lzUGxhaW5PYmplY3QpO1xuXG52YXIgX2NoYW5uZWwgPSByZXF1aXJlKCcuL2NoYW5uZWwnKTtcblxudmFyIF9jaGFubmVsMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NoYW5uZWwpO1xuXG52YXIgX2JyY2FzdCA9IHJlcXVpcmUoJ2JyY2FzdCcpO1xuXG52YXIgX2JyY2FzdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9icmNhc3QpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7IGlmICghc2VsZikgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIGNhbGwgJiYgKHR5cGVvZiBjYWxsID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpID8gY2FsbCA6IHNlbGY7IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcykgOiBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzOyB9XG5cbi8qKlxuICogUHJvdmlkZSBhIHRoZW1lIHRvIGFuIGVudGlyZSByZWFjdCBjb21wb25lbnQgdHJlZSB2aWEgY29udGV4dFxuICogYW5kIGV2ZW50IGxpc3RlbmVycyAoaGF2ZSB0byBkbyBib3RoIGNvbnRleHRcbiAqIGFuZCBldmVudCBlbWl0dGVyIGFzIHB1cmUgY29tcG9uZW50cyBibG9jayBjb250ZXh0IHVwZGF0ZXMpXG4gKi9cblxuZnVuY3Rpb24gY3JlYXRlVGhlbWVQcm92aWRlcigpIHtcbiAgdmFyIF9jbGFzcywgX3RlbXAyO1xuXG4gIHZhciBDSEFOTkVMID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBfY2hhbm5lbDIuZGVmYXVsdDtcblxuICByZXR1cm4gX3RlbXAyID0gX2NsYXNzID0gZnVuY3Rpb24gKF9SZWFjdCRDb21wb25lbnQpIHtcbiAgICBfaW5oZXJpdHMoVGhlbWVQcm92aWRlciwgX1JlYWN0JENvbXBvbmVudCk7XG5cbiAgICBmdW5jdGlvbiBUaGVtZVByb3ZpZGVyKCkge1xuICAgICAgdmFyIF9yZWY7XG5cbiAgICAgIHZhciBfdGVtcCwgX3RoaXMsIF9yZXQ7XG5cbiAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBUaGVtZVByb3ZpZGVyKTtcblxuICAgICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgICAgYXJnc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIF9yZXQgPSAoX3RlbXAgPSAoX3RoaXMgPSBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCAoX3JlZiA9IFRoZW1lUHJvdmlkZXIuX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihUaGVtZVByb3ZpZGVyKSkuY2FsbC5hcHBseShfcmVmLCBbdGhpc10uY29uY2F0KGFyZ3MpKSksIF90aGlzKSwgX3RoaXMuYnJvYWRjYXN0ID0gKDAsIF9icmNhc3QyLmRlZmF1bHQpKF90aGlzLmdldFRoZW1lKCkpLCBfdGhpcy5zZXRPdXRlclRoZW1lID0gZnVuY3Rpb24gKHRoZW1lKSB7XG4gICAgICAgIF90aGlzLm91dGVyVGhlbWUgPSB0aGVtZTtcbiAgICAgIH0sIF90ZW1wKSwgX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oX3RoaXMsIF9yZXQpO1xuICAgIH1cblxuICAgIF9jcmVhdGVDbGFzcyhUaGVtZVByb3ZpZGVyLCBbe1xuICAgICAga2V5OiAnZ2V0VGhlbWUnLFxuXG5cbiAgICAgIC8vIEdldCB0aGUgdGhlbWUgZnJvbSB0aGUgcHJvcHMsIHN1cHBvcnRpbmcgYm90aCAob3V0ZXJUaGVtZSkgPT4ge30gYXMgd2VsbCBhcyBvYmplY3Qgbm90YXRpb25cbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRUaGVtZShwYXNzZWRUaGVtZSkge1xuICAgICAgICB2YXIgdGhlbWUgPSBwYXNzZWRUaGVtZSB8fCB0aGlzLnByb3BzLnRoZW1lO1xuICAgICAgICBpZiAoKDAsIF9pc0Z1bmN0aW9uMi5kZWZhdWx0KSh0aGVtZSkpIHtcbiAgICAgICAgICB2YXIgbWVyZ2VkVGhlbWUgPSB0aGVtZSh0aGlzLm91dGVyVGhlbWUpO1xuICAgICAgICAgIGlmICghKDAsIF9pc1BsYWluT2JqZWN0Mi5kZWZhdWx0KShtZXJnZWRUaGVtZSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignW1RoZW1lUHJvdmlkZXJdIFBsZWFzZSByZXR1cm4gYW4gb2JqZWN0IGZyb20geW91ciB0aGVtZSBmdW5jdGlvbiwgaS5lLiB0aGVtZT17KCkgPT4gKHt9KX0hJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBtZXJnZWRUaGVtZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoISgwLCBfaXNQbGFpbk9iamVjdDIuZGVmYXVsdCkodGhlbWUpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdbVGhlbWVQcm92aWRlcl0gUGxlYXNlIG1ha2UgeW91ciB0aGVtZSBwcm9wIGEgcGxhaW4gb2JqZWN0Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMub3V0ZXJUaGVtZSkge1xuICAgICAgICAgIHJldHVybiB0aGVtZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBfZXh0ZW5kcyh7fSwgdGhpcy5vdXRlclRoZW1lLCB0aGVtZSk7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiAnZ2V0Q2hpbGRDb250ZXh0JyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRDaGlsZENvbnRleHQoKSB7XG4gICAgICAgIHJldHVybiBfZGVmaW5lUHJvcGVydHkoe30sIENIQU5ORUwsIHRoaXMuYnJvYWRjYXN0KTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdjb21wb25lbnREaWRNb3VudCcsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIC8vIGNyZWF0ZSBhIG5ldyBzdWJzY3JpcHRpb24gZm9yIGtlZXBpbmcgdHJhY2sgb2Ygb3V0ZXIgdGhlbWUsIGlmIHByZXNlbnRcbiAgICAgICAgaWYgKHRoaXMuY29udGV4dFtDSEFOTkVMXSkge1xuICAgICAgICAgIHRoaXMudW5zdWJzY3JpYmUgPSB0aGlzLmNvbnRleHRbQ0hBTk5FTF0uc3Vic2NyaWJlKHRoaXMuc2V0T3V0ZXJUaGVtZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gc2V0IGJyb2FkY2FzdCBzdGF0ZSBieSBtZXJnaW5nIG91dGVyIHRoZW1lIHdpdGggb3duXG5cbiAgICB9LCB7XG4gICAgICBrZXk6ICdjb21wb25lbnRXaWxsTW91bnQnLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcbiAgICAgICAgaWYgKHRoaXMuY29udGV4dFtDSEFOTkVMXSkge1xuICAgICAgICAgIHRoaXMuc2V0T3V0ZXJUaGVtZSh0aGlzLmNvbnRleHRbQ0hBTk5FTF0uZ2V0U3RhdGUoKSk7XG4gICAgICAgICAgdGhpcy5icm9hZGNhc3Quc2V0U3RhdGUodGhpcy5nZXRUaGVtZSgpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ2NvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMnLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG4gICAgICAgIGlmICh0aGlzLnByb3BzLnRoZW1lICE9PSBuZXh0UHJvcHMudGhlbWUpIHtcbiAgICAgICAgICB0aGlzLmJyb2FkY2FzdC5zZXRTdGF0ZSh0aGlzLmdldFRoZW1lKG5leHRQcm9wcy50aGVtZSkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiAnY29tcG9uZW50V2lsbFVubW91bnQnLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMudW5zdWJzY3JpYmUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdyZW5kZXInLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgICAgaWYgKCF0aGlzLnByb3BzLmNoaWxkcmVuKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF9yZWFjdDIuZGVmYXVsdC5DaGlsZHJlbi5vbmx5KHRoaXMucHJvcHMuY2hpbGRyZW4pO1xuICAgICAgfVxuICAgIH1dKTtcblxuICAgIHJldHVybiBUaGVtZVByb3ZpZGVyO1xuICB9KF9yZWFjdDIuZGVmYXVsdC5Db21wb25lbnQpLCBfY2xhc3MucHJvcFR5cGVzID0ge1xuICAgIGNoaWxkcmVuOiBfcHJvcFR5cGVzMi5kZWZhdWx0LmVsZW1lbnQsXG4gICAgdGhlbWU6IF9wcm9wVHlwZXMyLmRlZmF1bHQub25lT2ZUeXBlKFtfcHJvcFR5cGVzMi5kZWZhdWx0LnNoYXBlKHt9KSwgX3Byb3BUeXBlczIuZGVmYXVsdC5mdW5jXSkuaXNSZXF1aXJlZFxuICB9LCBfY2xhc3MuY2hpbGRDb250ZXh0VHlwZXMgPSBfZGVmaW5lUHJvcGVydHkoe30sIENIQU5ORUwsIF9wcm9wVHlwZXMyLmRlZmF1bHQub2JqZWN0LmlzUmVxdWlyZWQpLCBfY2xhc3MuY29udGV4dFR5cGVzID0gX2RlZmluZVByb3BlcnR5KHt9LCBDSEFOTkVMLCBfcHJvcFR5cGVzMi5kZWZhdWx0Lm9iamVjdCksIF90ZW1wMjtcbn0iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGNyZWF0ZVdpdGhUaGVtZTtcblxudmFyIF9yZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX2NoYW5uZWwgPSByZXF1aXJlKCcuL2NoYW5uZWwnKTtcblxudmFyIF9jaGFubmVsMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NoYW5uZWwpO1xuXG52YXIgX2NyZWF0ZVRoZW1lTGlzdGVuZXIgPSByZXF1aXJlKCcuL2NyZWF0ZS10aGVtZS1saXN0ZW5lcicpO1xuXG52YXIgX2NyZWF0ZVRoZW1lTGlzdGVuZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY3JlYXRlVGhlbWVMaXN0ZW5lcik7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHNlbGYsIGNhbGwpIHsgaWYgKCFzZWxmKSB7IHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTsgfSByZXR1cm4gY2FsbCAmJiAodHlwZW9mIGNhbGwgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikgPyBjYWxsIDogc2VsZjsgfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCBcIiArIHR5cGVvZiBzdXBlckNsYXNzKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCBlbnVtZXJhYmxlOiBmYWxzZSwgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LnNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7IH1cblxudmFyIGdldERpc3BsYXlOYW1lID0gZnVuY3Rpb24gZ2V0RGlzcGxheU5hbWUoQ29tcG9uZW50KSB7XG4gIHJldHVybiBDb21wb25lbnQuZGlzcGxheU5hbWUgfHwgQ29tcG9uZW50Lm5hbWUgfHwgJ0NvbXBvbmVudCc7XG59O1xuXG5mdW5jdGlvbiBjcmVhdGVXaXRoVGhlbWUoKSB7XG4gIHZhciBDSEFOTkVMID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBfY2hhbm5lbDIuZGVmYXVsdDtcblxuICB2YXIgdGhlbWVMaXN0ZW5lciA9ICgwLCBfY3JlYXRlVGhlbWVMaXN0ZW5lcjIuZGVmYXVsdCkoQ0hBTk5FTCk7XG4gIHJldHVybiBmdW5jdGlvbiAoQ29tcG9uZW50KSB7XG4gICAgdmFyIF9jbGFzcywgX3RlbXA7XG5cbiAgICByZXR1cm4gX3RlbXAgPSBfY2xhc3MgPSBmdW5jdGlvbiAoX1JlYWN0JENvbXBvbmVudCkge1xuICAgICAgX2luaGVyaXRzKFdpdGhUaGVtZSwgX1JlYWN0JENvbXBvbmVudCk7XG5cbiAgICAgIGZ1bmN0aW9uIFdpdGhUaGVtZShwcm9wcywgY29udGV4dCkge1xuICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgV2l0aFRoZW1lKTtcblxuICAgICAgICB2YXIgX3RoaXMgPSBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCAoV2l0aFRoZW1lLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoV2l0aFRoZW1lKSkuY2FsbCh0aGlzLCBwcm9wcywgY29udGV4dCkpO1xuXG4gICAgICAgIF90aGlzLnN0YXRlID0geyB0aGVtZTogdGhlbWVMaXN0ZW5lci5pbml0aWFsKGNvbnRleHQpIH07XG4gICAgICAgIF90aGlzLnNldFRoZW1lID0gZnVuY3Rpb24gKHRoZW1lKSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLnNldFN0YXRlKHsgdGhlbWU6IHRoZW1lIH0pO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgICB9XG5cbiAgICAgIF9jcmVhdGVDbGFzcyhXaXRoVGhlbWUsIFt7XG4gICAgICAgIGtleTogJ2NvbXBvbmVudERpZE1vdW50JyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICAgIHRoaXMudW5zdWJzY3JpYmUgPSB0aGVtZUxpc3RlbmVyLnN1YnNjcmliZSh0aGlzLmNvbnRleHQsIHRoaXMuc2V0VGhlbWUpO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ2NvbXBvbmVudFdpbGxVbm1vdW50JyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy51bnN1YnNjcmliZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdyZW5kZXInLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgICAgIHZhciB0aGVtZSA9IHRoaXMuc3RhdGUudGhlbWU7XG5cblxuICAgICAgICAgIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChDb21wb25lbnQsIF9leHRlbmRzKHsgdGhlbWU6IHRoZW1lIH0sIHRoaXMucHJvcHMpKTtcbiAgICAgICAgfVxuICAgICAgfV0pO1xuXG4gICAgICByZXR1cm4gV2l0aFRoZW1lO1xuICAgIH0oX3JlYWN0Mi5kZWZhdWx0LkNvbXBvbmVudCksIF9jbGFzcy5kaXNwbGF5TmFtZSA9ICdXaXRoVGhlbWUoJyArIGdldERpc3BsYXlOYW1lKENvbXBvbmVudCkgKyAnKScsIF9jbGFzcy5jb250ZXh0VHlwZXMgPSB0aGVtZUxpc3RlbmVyLmNvbnRleHRUeXBlcywgX3RlbXA7XG4gIH07XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy50aGVtZUxpc3RlbmVyID0gZXhwb3J0cy5UaGVtZVByb3ZpZGVyID0gZXhwb3J0cy53aXRoVGhlbWUgPSBleHBvcnRzLmNoYW5uZWwgPSB1bmRlZmluZWQ7XG5leHBvcnRzLmNyZWF0ZVRoZW1pbmcgPSBjcmVhdGVUaGVtaW5nO1xuXG52YXIgX2NyZWF0ZVRoZW1lUHJvdmlkZXIgPSByZXF1aXJlKCcuL2NyZWF0ZS10aGVtZS1wcm92aWRlcicpO1xuXG52YXIgX2NyZWF0ZVRoZW1lUHJvdmlkZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY3JlYXRlVGhlbWVQcm92aWRlcik7XG5cbnZhciBfY3JlYXRlV2l0aFRoZW1lID0gcmVxdWlyZSgnLi9jcmVhdGUtd2l0aC10aGVtZScpO1xuXG52YXIgX2NyZWF0ZVdpdGhUaGVtZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jcmVhdGVXaXRoVGhlbWUpO1xuXG52YXIgX2NyZWF0ZVRoZW1lTGlzdGVuZXIgPSByZXF1aXJlKCcuL2NyZWF0ZS10aGVtZS1saXN0ZW5lcicpO1xuXG52YXIgX2NyZWF0ZVRoZW1lTGlzdGVuZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY3JlYXRlVGhlbWVMaXN0ZW5lcik7XG5cbnZhciBfY2hhbm5lbCA9IHJlcXVpcmUoJy4vY2hhbm5lbCcpO1xuXG52YXIgX2NoYW5uZWwyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY2hhbm5lbCk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBjaGFubmVsID0gZXhwb3J0cy5jaGFubmVsID0gX2NoYW5uZWwyLmRlZmF1bHQ7XG52YXIgd2l0aFRoZW1lID0gZXhwb3J0cy53aXRoVGhlbWUgPSAoMCwgX2NyZWF0ZVdpdGhUaGVtZTIuZGVmYXVsdCkoKTtcbnZhciBUaGVtZVByb3ZpZGVyID0gZXhwb3J0cy5UaGVtZVByb3ZpZGVyID0gKDAsIF9jcmVhdGVUaGVtZVByb3ZpZGVyMi5kZWZhdWx0KSgpO1xudmFyIHRoZW1lTGlzdGVuZXIgPSBleHBvcnRzLnRoZW1lTGlzdGVuZXIgPSAoMCwgX2NyZWF0ZVRoZW1lTGlzdGVuZXIyLmRlZmF1bHQpKCk7XG5mdW5jdGlvbiBjcmVhdGVUaGVtaW5nKCkge1xuICB2YXIgY3VzdG9tQ2hhbm5lbCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogX2NoYW5uZWwyLmRlZmF1bHQ7XG5cbiAgcmV0dXJuIHtcbiAgICBjaGFubmVsOiBjdXN0b21DaGFubmVsLFxuICAgIHdpdGhUaGVtZTogKDAsIF9jcmVhdGVXaXRoVGhlbWUyLmRlZmF1bHQpKGN1c3RvbUNoYW5uZWwpLFxuICAgIFRoZW1lUHJvdmlkZXI6ICgwLCBfY3JlYXRlVGhlbWVQcm92aWRlcjIuZGVmYXVsdCkoY3VzdG9tQ2hhbm5lbCksXG4gICAgdGhlbWVMaXN0ZW5lcjogKDAsIF9jcmVhdGVUaGVtZUxpc3RlbmVyMi5kZWZhdWx0KShjdXN0b21DaGFubmVsKVxuICB9O1xufVxuXG5leHBvcnRzLmRlZmF1bHQgPSB7XG4gIGNoYW5uZWw6IF9jaGFubmVsMi5kZWZhdWx0LFxuICB3aXRoVGhlbWU6IHdpdGhUaGVtZSxcbiAgVGhlbWVQcm92aWRlcjogVGhlbWVQcm92aWRlcixcbiAgdGhlbWVMaXN0ZW5lcjogdGhlbWVMaXN0ZW5lcixcbiAgY3JlYXRlVGhlbWluZzogY3JlYXRlVGhlbWluZ1xufTsiLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IGluamVjdFNoZWV0IGZyb20gJ3JlYWN0LWpzcyc7XG5pbXBvcnQgaG9pc3ROb25SZWFjdFN0YXRpY3MgZnJvbSAnaG9pc3Qtbm9uLXJlYWN0LXN0YXRpY3MnO1xuaW1wb3J0IHsgdGhlbWluZyB9IGZyb20gJy4uL3RoZW1pbmcvdGhlbWluZyc7XG5cblxuY29uc3QgeyBUaGVtZVByb3ZpZGVyIH0gPSB0aGVtaW5nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0aGVtZUF3YXJlKHsgdGhlbWUsIHN0eWxlIH0pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHRoZW1lQXdhcmVJbm5lcihDb21wb25lbnQpIHtcbiAgICBjb25zdCBUb1JlbmRlciA9IHN0eWxlID8gaW5qZWN0U2hlZXQoc3R5bGUsIHsgdGhlbWluZyB9KShDb21wb25lbnQpIDogQ29tcG9uZW50O1xuXG4gICAgY2xhc3MgVGhlbWVBd2FyZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgdGhlbWUgP1xuICAgICAgICAgICAgPFRoZW1lUHJvdmlkZXIgdGhlbWU9eyB0aGVtZSB9PlxuICAgICAgICAgICAgICA8VG9SZW5kZXIgeyAuLi50aGlzLnByb3BzIH0gLz5cbiAgICAgICAgICAgIDwvVGhlbWVQcm92aWRlcj4gOlxuICAgICAgICAgICAgPFRvUmVuZGVyIHsgLi4udGhpcy5wcm9wcyB9IC8+XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgVGhlbWVBd2FyZS5kaXNwbGF5TmFtZSA9IGBUaGVtZUF3YXJlKCR7XG4gICAgICBDb21wb25lbnQuZGlzcGxheU5hbWUgfHxcbiAgICAgIENvbXBvbmVudC5uYW1lIHx8XG4gICAgICAnQ29tcG9uZW50J1xuICAgIH0pYDtcblxuICAgIHJldHVybiBob2lzdE5vblJlYWN0U3RhdGljcyhUaGVtZUF3YXJlLCBDb21wb25lbnQpO1xuICB9O1xufVxuIiwiaW1wb3J0IHsgY3JlYXRlVGhlbWluZyB9IGZyb20gJ3RoZW1pbmcnO1xuXG5jb25zdCB0aGVtaW5nID0gY3JlYXRlVGhlbWluZygnX19EQlVfVEhFTUlOR19fJyk7XG5cbmV4cG9ydCB7XG4gIGNyZWF0ZVRoZW1pbmcsXG4gIHRoZW1pbmdcbn07XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHRoZW1lQXdhcmUgZnJvbSAnLi4vc3JjL2xpYi9IT0MvdGhlbWVBd2FyZSc7XG5pbXBvcnQgc2NyZWVucyBmcm9tICcuL3NjcmVlbnMnO1xuXG5jb25zdCBzdHlsZSA9ICh7IHZhcnMgfSkgPT4ge1xuICByZXR1cm4ge1xuICAgIHNlY3Rpb25MaW5rczoge1xuICAgICAgY29sb3I6IHZhcnMuY29sb3JzLnByaW1hcnlUZXh0Q29sb3IgfHwgJ29yYW5nZSdcbiAgICB9XG4gIH07XG59O1xuXG5jbGFzcyBBcHAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsIHRoaXMub25IYXNoQ2hhbmdlLmJpbmQodGhpcykpO1xuICB9XG5cbiAgb25IYXNoQ2hhbmdlKCkge1xuICAgIHRoaXMuZm9yY2VVcGRhdGUoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBzY3JlZW5zS2V5cyA9IE9iamVjdC5rZXlzKHNjcmVlbnMpO1xuICAgIGNvbnN0IGxpbmtzID0gc2NyZWVuc0tleXNcbiAgICAgIC5tYXAoKHNjcmVlbiwgaWR4KSA9PiA8YSBrZXk9e2lkeH0gaHJlZj17YCMke3NjcmVlbn1gfT57c2NyZWVufTwvYT4pO1xuICAgIGNvbnN0IFNjcmVlbiA9IHNjcmVlbnNbKHdpbmRvdy5sb2NhdGlvbi5oYXNoIHx8IGAjJHtzY3JlZW5zS2V5c1swXX1gKS5yZXBsYWNlKCcjJywgJycpXTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIHtsaW5rc31cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPFNjcmVlbi8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCB0aGVtZUF3YXJlKHsgc3R5bGUgfSkoQXBwKTtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCB7XG4gIG9uU2NyZWVuQ29uc29sZSxcbiAgdGhlbWluZyxcbiAgZGVmYXVsdFRoZW1lXG59IGZyb20gJ2Rldi1ib3gtdWknO1xuaW1wb3J0IEFwcCBmcm9tICcuL2FwcCc7XG5cbm9uU2NyZWVuQ29uc29sZSh7IGJ1dHRvblN0eWxlOiB7IH0sIGNvbnNvbGVTdHlsZTogeyB9LCBvcHRpb25zOiB7IHJ0bDogZmFsc2UgfSB9KTtcbmZvciAobGV0IGkgPSAwOyBpIDwgMTAwOyBpICs9IDEpIHtcbiAgY29uc29sZS5sb2coJ2ZvbycsICdiYXInLCA1LCBudWxsLCB1bmRlZmluZWQsIG5ldyBNYXAoW1syLCA3XV0pLCBuZXcgU2V0KFs0LCA1XSksIFs4LDksMTBdLCAgZnVuY3Rpb24oKXtjb25zb2xlLmxvZygnYmxhJyl9LCB7IGE6IHsgYjogeyBjOiBbMSwgZnVuY3Rpb24oKXtjb25zb2xlLmxvZygnaW5saW5lJyl9XSB9IH0gfSk7XG59XG5jb25zb2xlLndhcm4oJ3dhcm5pbmcnKTtcbmNvbnNvbGUuZXJyb3IoJ2Vycm9yJyk7XG5cbmNvbnN0IHsgVGhlbWVQcm92aWRlciB9ID0gdGhlbWluZztcblxuY29uc3QgY3VzdG9tVGhlbWUgPSB7XG4gIHZhcnM6IHtcbiAgICBjb2xvcnM6IHtcbiAgICAgIHByaW1hcnlUZXh0Q29sb3I6ICdicm93bicsXG4gICAgICBzZWNvbmRhcnlUZXh0Q29sb3I6ICdncmVlbicsXG4gICAgfVxuICB9LFxuICBhbmltYXRpb25zOiBkZWZhdWx0VGhlbWUuYW5pbWF0aW9uc1xufTtcblxuY2xhc3MgRGVtbyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XG4gICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICB0aGVtZTogZGVmYXVsdFRoZW1lXG4gICAgfTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIC8vIHNldEludGVydmFsKCgpID0+IHtcbiAgICAvLyAgIHRoaXMuc2V0U3RhdGUoe1xuICAgIC8vICAgICB0aGVtZTogdGhpcy5zdGF0ZS50aGVtZSA9PT0gZGVmYXVsdFRoZW1lID9cbiAgICAvLyAgICAgICBjdXN0b21UaGVtZSA6XG4gICAgLy8gICAgICAgZGVmYXVsdFRoZW1lXG4gICAgLy8gICB9KTtcbiAgICAvLyB9LCAxMDAwKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFRoZW1lUHJvdmlkZXIgdGhlbWU9e3RoaXMuc3RhdGUudGhlbWV9PlxuICAgICAgICA8QXBwIC8+XG4gICAgICA8L1RoZW1lUHJvdmlkZXI+XG4gICAgKTtcbiAgfVxufVxuXG5SZWFjdERPTS5yZW5kZXIoKFxuICA8RGVtby8+XG4pLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVtbycpKTtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1xuICBIZWxsb1xufSBmcm9tICdkZXYtYm94LXVpJztcbmltcG9ydCB0aGVtZUF3YXJlIGZyb20gJy4uLy4uL3NyYy9saWIvSE9DL3RoZW1lQXdhcmUnO1xuXG5jb25zdCBzdHlsZSA9ICh7IHZhcnMgfSkgPT4ge1xuICByZXR1cm4ge1xuICAgIHNjcmVlbjoge1xuICAgICAgY29sb3I6IHZhcnMuY29sb3JzLnByaW1hcnlUZXh0Q29sb3IgfHwgJ29yYW5nZSdcbiAgICB9XG4gIH07XG59O1xuXG5jbGFzcyBIZWxsb1NjcmVlbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPEhlbGxvLz5cbiAgICAgICAgPEhlbGxvLz5cbiAgICAgICAgPEhlbGxvLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgdGhlbWVBd2FyZSh7IHN0eWxlIH0pKEhlbGxvU2NyZWVuKTtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1xuICBMaXN0XG59IGZyb20gJ2Rldi1ib3gtdWknO1xuaW1wb3J0IHRoZW1lQXdhcmUgZnJvbSAnLi4vLi4vc3JjL2xpYi9IT0MvdGhlbWVBd2FyZSc7XG5cbmNvbnN0IHN0eWxlID0gKHsgdmFycyB9KSA9PiB7XG4gIHJldHVybiB7XG4gICAgc2NyZWVuOiB7XG4gICAgICBjb2xvcjogdmFycy5jb2xvcnMucHJpbWFyeVRleHRDb2xvciB8fCAnb3JhbmdlJ1xuICAgIH1cbiAgfTtcbn07XG5cbmNsYXNzIExpc3RTY3JlZW4gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxMaXN0IGl0ZW1zPXtbJ3RocmVlJywgJ2ZvdXInXX0vPlxuICAgICAgICA8TGlzdCBpdGVtcz17Wyd0aHJlZScsICdmb3VyJ119Lz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgdGhlbWVBd2FyZSh7IHN0eWxlIH0pKExpc3RTY3JlZW4pO1xuIiwiaW1wb3J0IEhlbGxvU2NyZWVuIGZyb20gJy4vSGVsbG9TY3JlZW4nO1xuaW1wb3J0IExpc3RTY3JlZW4gZnJvbSAnLi9MaXN0U2NyZWVuJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBIZWxsb1NjcmVlbixcbiAgTGlzdFNjcmVlblxufTtcbiJdfQ==
