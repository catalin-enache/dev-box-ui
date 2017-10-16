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
  var width = _ref.width;
  var height = _ref.height;

  var props = _objectWithoutProperties(_ref, ['children', 'color', 'size', 'style', 'width', 'height']);

  var _ref2$reactIconBase = _ref2.reactIconBase;
  var reactIconBase = _ref2$reactIconBase === undefined ? {} : _ref2$reactIconBase;

  var computedSize = size || reactIconBase.size || '1em';
  return _react2.default.createElement('svg', _extends({
    children: children,
    fill: 'currentColor',
    preserveAspectRatio: 'xMidYMid meet',
    height: height || computedSize,
    width: width || computedSize
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
  width: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
  height: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
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

var _LocaleService = require('./../services/LocaleService');

var _LocaleService2 = _interopRequireDefault(_LocaleService);

var _I18nService = require('./../services/I18nService');

var _I18nService2 = _interopRequireDefault(_I18nService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function localeAware(Component) {
  class LocaleAware extends _react2.default.PureComponent {
    constructor(props, context) {
      super(props, context);
      this.handleLocaleChange = this.handleLocaleChange.bind(this);
      this.unregisterLocaleChange = null;
      this.state = {
        locale: _LocaleService2.default.locale
      };
      this._mounted = false;
      this._component = null;
    }

    handleLocaleChange(locale) {
      this._mounted && this.state.locale !== locale && this.setState({
        locale
      });
    }

    componentDidMount() {
      this.unregisterLocaleChange = _LocaleService2.default.onLocaleChange(this.handleLocaleChange);
      this._mounted = true;
    }

    componentWillUnmount() {
      this._mounted = false;
      this.unregisterLocaleChange();
    }

    render() {
      const { locale } = this.state;
      return _react2.default.createElement(Component, _extends({}, this.props, {
        locale: locale,
        translations: _I18nService2.default.currentLangTranslations,
        ref: comp => this._component = comp
      }));
    }
  }

  LocaleAware.displayName = `LocaleAware(${Component.displayName || Component.name || 'Component'})`;

  return (0, _hoistNonReactStatics2.default)(LocaleAware, Component);
}

},{"./../services/I18nService":10,"./../services/LocaleService":11,"hoist-non-react-statics":"hoist-non-react-statics","react":"react"}],5:[function(require,module,exports){
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

    class ThemeAware extends _react2.default.PureComponent {
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

},{"../theming/theming":18,"hoist-non-react-statics":"hoist-non-react-statics","react":"react","react-jss":"react-jss"}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _themeAware = require('../../HOC/themeAware');

var _themeAware2 = _interopRequireDefault(_themeAware);

var _localeAware = require('../../HOC/localeAware');

var _localeAware2 = _interopRequireDefault(_localeAware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const style = ({ vars }) => {
  return {
    hello: {
      color: vars.colors.primaryColor || 'orange'
    }
  };
};

class FormInputNumber extends _react2.default.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || 0
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(evt) {
    this.setState({
      value: evt.target.value
    });
  }

  render() {
    const { theme, classes, name } = this.props;
    console.log('FormInputNumber', { theme });
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement('input', { className: theme.common.formInput, name: name, type: 'text', value: this.state.value, onChange: this.handleChange })
    );
  }
}

FormInputNumber.propTypes = {
  value: _propTypes2.default.string,
  theme: _propTypes2.default.object,
  name: _propTypes2.default.string.isRequired,
  classes: _propTypes2.default.object
};

exports.default = (0, _themeAware2.default)({ style })((0, _localeAware2.default)(FormInputNumber));

},{"../../HOC/localeAware":4,"../../HOC/themeAware":5,"prop-types":"prop-types","react":"react"}],7:[function(require,module,exports){
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

var _localeAware = require('../../HOC/localeAware');

var _localeAware2 = _interopRequireDefault(_localeAware);

var _I18nService = require('./../../services/I18nService');

var _I18nService2 = _interopRequireDefault(_I18nService);

var _template = require('../../utils/template');

var _template2 = _interopRequireDefault(_template);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_I18nService2.default.registerTranslations({
  en: {
    'Hello': _template2.default`Hello ${'age'} ${'name'}`
  },
  sp: {
    'Hello': _template2.default`Hola ${'age'} ${'name'}`
  }
});

const listItems = ['one', 'two'];

const style = ({ vars }) => {
  return {
    hello: {
      color: vars.colors.primaryColor || 'orange'
    }
  };
};

class Hello extends _react2.default.PureComponent {
  render() {
    const { theme, translations } = this.props;
    if (process.env.NODE_ENV !== 'production') {
      /* eslint no-console: 0 */
      // console.log('rendering Hello component');
    }
    return _react2.default.createElement(
      'div',
      { className: this.props.classes.hello },
      translations.Hello({ age: 22, name: this.props.name || 'Nobody' }),
      _react2.default.createElement(_spinner2.default, { className: theme.animations.dbuAnimationSpin }),
      _react2.default.createElement(_List2.default, { items: listItems }),
      _react2.default.createElement(_List2.default, { items: listItems }),
      _react2.default.createElement(_World2.default, null),
      _react2.default.createElement(_World2.default, null)
    );
  }
}

Hello.propTypes = {
  translations: _propTypes2.default.object,
  theme: _propTypes2.default.object,
  name: _propTypes2.default.string.isRequired,
  classes: _propTypes2.default.object
};

exports.default = (0, _themeAware2.default)({ style })((0, _localeAware2.default)(Hello));

}).call(this,require('_process'))

},{"../../HOC/localeAware":4,"../../HOC/themeAware":5,"../../utils/template":20,"../List/List":8,"../World/World":9,"./../../services/I18nService":10,"_process":1,"prop-types":"prop-types","react":"react","react-icons/lib/fa/spinner":3}],8:[function(require,module,exports){
(function (process){
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

var _localeAware = require('../../HOC/localeAware');

var _localeAware2 = _interopRequireDefault(_localeAware);

var _I18nService = require('./../../services/I18nService');

var _I18nService2 = _interopRequireDefault(_I18nService);

var _LocaleService = require('./../../services/LocaleService');

var _LocaleService2 = _interopRequireDefault(_LocaleService);

var _template = require('../../utils/template');

var _template2 = _interopRequireDefault(_template);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_I18nService2.default.registerTranslations({
  en: {
    'list': _template2.default`list`
  },
  sp: {
    'list': _template2.default`lista`
  }
});

const style = ({ vars }) => {
  return {
    list: {
      // color: color(vars.colors.secondaryColor || 'orange').lighten(0.5).hex()
      color: vars.dir === 'ltr' ? 'green' : 'red'
    }
  };
};

class List extends _react2.default.PureComponent {
  render() {
    if (process.env.NODE_ENV !== 'production') {
      /* eslint no-console: 0 */
      // console.log('rendering List component');
    }
    return _react2.default.createElement(
      'div',
      null,
      this.props.translations.list(),
      _react2.default.createElement(
        'ul',
        { className: this.props.classes.list },
        this.props.items.map(item => _react2.default.createElement(
          'li',
          { key: item },
          item
        ))
      )
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

exports.default = (0, _themeAware2.default)({ style })((0, _localeAware2.default)(List));

}).call(this,require('_process'))

},{"../../HOC/localeAware":4,"../../HOC/themeAware":5,"../../utils/template":20,"./../../services/I18nService":10,"./../../services/LocaleService":11,"_process":1,"color":"color","prop-types":"prop-types","react":"react"}],9:[function(require,module,exports){
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
      color: vars.colors.primaryColor || 'orange'
    }
  };
};

class World extends _react2.default.PureComponent {
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

},{"../../HOC/themeAware":5,"../List/List":8,"_process":1,"prop-types":"prop-types","react":"react"}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _LocaleService = require('./LocaleService');

var _LocaleService2 = _interopRequireDefault(_LocaleService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const emptyObj = {};

class I18nService {
  constructor() {
    _LocaleService2.default.onLocaleChange(this._handleLocaleChange.bind(this));
    this._locale = _LocaleService2.default.locale;
    this._translations = {};
  }

  _handleLocaleChange(locale) {
    this._locale = locale;
  }

  clearTranslations(lang) {
    delete this._translations[lang];
  }

  registerTranslations(translations) {
    this._translations = Object.keys(translations).reduce((acc, lang) => {
      acc[lang] = Object.assign({}, this._translations[lang], translations[lang]);
      return acc;
    }, this._translations);
  }

  translate(msg) {
    return this.currentLangTranslations[msg];
  }

  get translations() {
    return this._translations;
  }

  get currentLangTranslations() {
    return this._translations[this._locale.lang] || emptyObj;
  }
}

const i18nService = new I18nService();
exports.default = i18nService;

},{"./LocaleService":11}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

const defaultLocale = {
  dir: 'ltr',
  lang: 'en'
};

class LocaleService {
  constructor() {
    this._callbacks = [];
    this._localeAttrs = Object.keys(defaultLocale);
    this._rootElement = window.document.documentElement;
    this._localeAttrs.forEach(attr => {
      if (!this._rootElement.getAttribute(attr)) {
        this._rootElement.setAttribute(attr, defaultLocale[attr]);
      }
    });
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

  set locale(localeObj) {
    Object.keys(localeObj).forEach(key => {
      this._rootElement.setAttribute(key, localeObj[key]);
    });
  }

  get locale() {
    return this._locale;
  }

  onLocaleChange(callback) {
    this._callbacks.push(callback);
    callback(this.locale);
    return () => {
      this._callbacks = this._callbacks.filter(cb => cb !== callback);
    };
  }
}

const localeService = new LocaleService();
exports.default = localeService;

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const commonAnimations = themeVars => {
  const { dir } = themeVars;
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

},{}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _grid = require('./grid/grid');

var _grid2 = _interopRequireDefault(_grid);

var _form = require('./form/form');

var _form2 = _interopRequireDefault(_form);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const commonClasses = themeVars => {
  return Object.assign({}, (0, _grid2.default)(themeVars), (0, _form2.default)(themeVars));
};

exports.default = commonClasses;

},{"./form/form":14,"./grid/grid":15}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = form;


const formInput = themeVars => {
  const {
    dimensions: {
      formInputHeight,
      formInputBorderTopWidth,
      formInputBorderRightWidth,
      formInputBorderBottomWidth,
      formInputBorderLeftWidth,
      formInputBorderTopLeftRadius,
      formInputBorderTopRightRadius,
      formInputBorderBottomLeftRadius,
      formInputBorderBottomRightRadius,
      formInputPaddingStartEnd,
      formInputFontSize
    },
    colors: {
      formInputColor,
      formInputBorderColor,
      formInputBackgroundColor
    }
  } = themeVars;
  return {
    width: '100%',
    height: formInputHeight,
    padding: `0px ${formInputPaddingStartEnd}px`,
    fontSize: formInputFontSize,
    boxSizing: 'border-box',
    color: formInputColor,
    backgroundColor: formInputBackgroundColor,
    borderTop: `${formInputBorderTopWidth}px solid ${formInputBorderColor}`,
    borderRight: `${formInputBorderRightWidth}px solid ${formInputBorderColor}`,
    borderLeft: `${formInputBorderLeftWidth}px solid ${formInputBorderColor}`,
    borderBottom: `${formInputBorderBottomWidth}px solid ${formInputBorderColor}`,
    borderTopLeftRadius: formInputBorderTopLeftRadius,
    borderTopRightRadius: formInputBorderTopRightRadius,
    borderBottomLeftRadius: formInputBorderBottomLeftRadius,
    borderBottomRightRadius: formInputBorderBottomRightRadius,
    '&:focus': {
      outline: 'none'
    }
  };
};

function form(themeVars) {
  return {
    formInput: formInput(themeVars)
  };
}

},{}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = grid;
function grid(themeVars) {
  const { dir, grid: { cols, breakpoints } } = themeVars;
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
}

},{}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactJss = require('react-jss');

var _commonAnimations = require('./commonAnimations');

var _commonAnimations2 = _interopRequireDefault(_commonAnimations);

var _commonClasses = require('./commonClasses');

var _commonClasses2 = _interopRequireDefault(_commonClasses);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const theme = themeVars => ['ltr', 'rtl'].reduce((acc, dir) => {
  const themeVarsDir = themeVars(dir);

  const commonAnimationsDir = _reactJss.jss.createStyleSheet((0, _commonAnimations2.default)(themeVarsDir), {
    meta: `commonAnimations_${dir}`
  }).attach();

  const commonClassesDir = _reactJss.jss.createStyleSheet((0, _commonClasses2.default)(themeVarsDir), {
    meta: `commonClasses_${dir}`
  }).attach();

  acc[dir] = {
    vars: themeVarsDir,
    animations: commonAnimationsDir.classes,
    common: commonClassesDir.classes
  };

  return acc;
}, {});

exports.default = theme;

},{"./commonAnimations":12,"./commonClasses":13,"react-jss":"react-jss"}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

const commonVars = dir => ({
  dir,
  colors: {
    primaryColor: 'green',
    secondaryColor: 'blue',
    formInputColor: 'black',
    formInputBorderColor: 'grey',
    formInputBackgroundColor: 'white'
  },
  dimensions: {
    formInputHeight: 26,
    formInputFontSize: 16,
    formInputPaddingStartEnd: 5,
    formInputBorderRadius: 0,
    formInputBorderTopWidth: 0,
    formInputBorderRightWidth: 0,
    formInputBorderBottomWidth: 1,
    formInputBorderLeftWidth: 0,
    formInputBorderTopLeftRadius: 0,
    formInputBorderTopRightRadius: 0,
    formInputBorderBottomLeftRadius: 0,
    formInputBorderBottomRightRadius: 0
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

},{}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.theming = exports.createTheming = undefined;

var _reactJss = require('react-jss');

const theming = (0, _reactJss.createTheming)('__DBU_THEMING__');

exports.createTheming = _reactJss.createTheming;
exports.theming = theming;

},{"react-jss":"react-jss"}],19:[function(require,module,exports){
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
const consoleOriginal = {};

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
    consoleOriginal[action] = console[action];
    console[action] = handler.bind(console, action);
  });
  window.addEventListener('error', evt => {
    // eslint no-console: 0
    console.error(`"${evt.message}" from ${evt.filename}:${evt.lineno}`);
    console.error(evt, evt.error.stack);
    // evt.preventDefault();
  });
  consoleLog('console captured');
  return function releaseConsole() {
    ['log', 'warn', 'error'].forEach(action => {
      console[action] = consoleOriginal[action];
    });
    consoleLog('console released');
  };
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

/**
onScreenConsole({
  buttonStyle = { position, width, height, top, start, background },
  consoleStyle = { width, height, background },
  options = { rtl: false, indent, showLastOnly }
})
*/
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
  const releaseConsole = captureConsole(console, options);

  return function release() {
    document.body.removeChild(button);
    releaseConsole();
  };
}

},{}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = template;
function template(strings, ...keys) {
  return (...values) => {
    const dict = values[values.length - 1] || {};
    const result = [strings[0]];
    keys.forEach((key, i) => {
      const value = Number.isInteger(key) ? values[key] : dict[key];
      result.push(value, strings[i + 1]);
    });
    return result.join('');
  };
}

},{}],"dev-box-ui":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormInputNumber = exports.List = exports.Hello = exports.createTheming = exports.theming = exports.theme = exports.themeVars = exports.themeAware = exports.localeAware = exports.i18nService = exports.localeService = exports.onScreenConsole = exports.template = undefined;

var _template = require('./utils/template');

var _template2 = _interopRequireDefault(_template);

var _onScreenConsole = require('./utils/onScreenConsole');

var _onScreenConsole2 = _interopRequireDefault(_onScreenConsole);

var _LocaleService = require('./services/LocaleService');

var _LocaleService2 = _interopRequireDefault(_LocaleService);

var _I18nService = require('./services/I18nService');

var _I18nService2 = _interopRequireDefault(_I18nService);

var _localeAware = require('./HOC/localeAware');

var _localeAware2 = _interopRequireDefault(_localeAware);

var _themeAware = require('./HOC/themeAware');

var _themeAware2 = _interopRequireDefault(_themeAware);

var _theme = require('./styles/theme');

var _theme2 = _interopRequireDefault(_theme);

var _themeVars = require('./styles/themeVars');

var _themeVars2 = _interopRequireDefault(_themeVars);

var _theming = require('./theming/theming');

var _Hello = require('./components/Hello/Hello');

var _Hello2 = _interopRequireDefault(_Hello);

var _List = require('./components/List/List');

var _List2 = _interopRequireDefault(_List);

var _FormInputNumber = require('./components/FormInputNumber/FormInputNumber');

var _FormInputNumber2 = _interopRequireDefault(_FormInputNumber);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Theming


// Theme


// HOC


// Services
// Utils
exports.template = _template2.default;
exports.onScreenConsole = _onScreenConsole2.default;
exports.localeService = _LocaleService2.default;
exports.i18nService = _I18nService2.default;
exports.localeAware = _localeAware2.default;
exports.themeAware = _themeAware2.default;
exports.themeVars = _themeVars2.default;
exports.theme = _theme2.default;
exports.theming = _theming.theming;
exports.createTheming = _theming.createTheming;
exports.Hello = _Hello2.default;
exports.List = _List2.default;
exports.FormInputNumber = _FormInputNumber2.default;

// Components

},{"./HOC/localeAware":4,"./HOC/themeAware":5,"./components/FormInputNumber/FormInputNumber":6,"./components/Hello/Hello":7,"./components/List/List":8,"./services/I18nService":10,"./services/LocaleService":11,"./styles/theme":16,"./styles/themeVars":17,"./theming/theming":18,"./utils/onScreenConsole":19,"./utils/template":20}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LWljb24tYmFzZS9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVhY3QtaWNvbnMvbGliL2ZhL3NwaW5uZXIuanMiLCJzcmMvbGliL0hPQy9sb2NhbGVBd2FyZS5qcyIsInNyYy9saWIvSE9DL3RoZW1lQXdhcmUuanMiLCJzcmMvbGliL2NvbXBvbmVudHMvRm9ybUlucHV0TnVtYmVyL0Zvcm1JbnB1dE51bWJlci5qcyIsInNyYy9saWIvY29tcG9uZW50cy9IZWxsby9IZWxsby5qcyIsInNyYy9saWIvY29tcG9uZW50cy9MaXN0L0xpc3QuanMiLCJzcmMvbGliL2NvbXBvbmVudHMvV29ybGQvV29ybGQuanMiLCJzcmMvbGliL3NlcnZpY2VzL0kxOG5TZXJ2aWNlLmpzIiwic3JjL2xpYi9zZXJ2aWNlcy9Mb2NhbGVTZXJ2aWNlLmpzIiwic3JjL2xpYi9zdHlsZXMvY29tbW9uQW5pbWF0aW9ucy5qcyIsInNyYy9saWIvc3R5bGVzL2NvbW1vbkNsYXNzZXMuanMiLCJzcmMvbGliL3N0eWxlcy9mb3JtL2Zvcm0uanMiLCJzcmMvbGliL3N0eWxlcy9ncmlkL2dyaWQuanMiLCJzcmMvbGliL3N0eWxlcy90aGVtZS5qcyIsInNyYy9saWIvc3R5bGVzL3RoZW1lVmFycy5qcyIsInNyYy9saWIvdGhlbWluZy90aGVtaW5nLmpzIiwic3JjL2xpYi91dGlscy9vblNjcmVlbkNvbnNvbGUuanMiLCJzcmMvbGliL3V0aWxzL3RlbXBsYXRlLmpzIiwic3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QU8sT0FBTyxPQUFPLE1BQVAsR0FBZ0IsQ0FBdkIsS0FBNkIsRUFBMUM7QUFDQSxVQUFNLFNBQVMsQ0FBQyxRQUFRLENBQVIsQ0FBRCxDQUFmO0FBQ0EsU0FBSyxPQUFMLENBQWEsQ0FBQyxHQUFELEVBQU0sQ0FBTixLQUFZO0FBQ3ZCLFlBQU0sUUFBUSxPQUFPLFNBQVAsQ0FBaUIsR0FBakIsSUFBd0IsT0FBTyxHQUFQLENBQXhCLEdBQXNDLEtBQUssR0FBTCxDQUFwRDtBQUNBLGFBQU8sSUFBUCxDQUFZLEtBQVosRUFBbUIsUUFBUSxJQUFJLENBQVosQ0FBbkI7QUFDRCxLQUhEO0FBSUEsV0FBTyxPQUFPLElBQVAsQ0FBWSxFQUFaLENBQVA7QUFDRCxHQVJEO0FBU0Q7Ozs7Ozs7Ozs7QUNWRDs7OztBQUNBOzs7O0FBR0E7Ozs7QUFDQTs7OztBQUdBOzs7O0FBQ0E7Ozs7QUFHQTs7OztBQUNBOzs7O0FBR0E7O0FBR0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFOQTs7O0FBSkE7OztBQUpBOzs7QUFKQTtBQUpBO1FBMkJFLFE7UUFDQSxlO1FBR0EsYTtRQUNBLFc7UUFHQSxXO1FBQ0EsVTtRQUdBLFM7UUFDQSxLO1FBR0EsTztRQUNBLGE7UUFHQSxLO1FBQ0EsSTtRQUNBLGU7O0FBOUJGIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9wcm9wVHlwZXMgPSByZXF1aXJlKCdwcm9wLXR5cGVzJyk7XG5cbnZhciBfcHJvcFR5cGVzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Byb3BUeXBlcyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9vYmplY3RXaXRob3V0UHJvcGVydGllcyhvYmosIGtleXMpIHsgdmFyIHRhcmdldCA9IHt9OyBmb3IgKHZhciBpIGluIG9iaikgeyBpZiAoa2V5cy5pbmRleE9mKGkpID49IDApIGNvbnRpbnVlOyBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGkpKSBjb250aW51ZTsgdGFyZ2V0W2ldID0gb2JqW2ldOyB9IHJldHVybiB0YXJnZXQ7IH1cblxudmFyIEljb25CYXNlID0gZnVuY3Rpb24gSWNvbkJhc2UoX3JlZiwgX3JlZjIpIHtcbiAgdmFyIGNoaWxkcmVuID0gX3JlZi5jaGlsZHJlbjtcbiAgdmFyIGNvbG9yID0gX3JlZi5jb2xvcjtcbiAgdmFyIHNpemUgPSBfcmVmLnNpemU7XG4gIHZhciBzdHlsZSA9IF9yZWYuc3R5bGU7XG4gIHZhciB3aWR0aCA9IF9yZWYud2lkdGg7XG4gIHZhciBoZWlnaHQgPSBfcmVmLmhlaWdodDtcblxuICB2YXIgcHJvcHMgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMoX3JlZiwgWydjaGlsZHJlbicsICdjb2xvcicsICdzaXplJywgJ3N0eWxlJywgJ3dpZHRoJywgJ2hlaWdodCddKTtcblxuICB2YXIgX3JlZjIkcmVhY3RJY29uQmFzZSA9IF9yZWYyLnJlYWN0SWNvbkJhc2U7XG4gIHZhciByZWFjdEljb25CYXNlID0gX3JlZjIkcmVhY3RJY29uQmFzZSA9PT0gdW5kZWZpbmVkID8ge30gOiBfcmVmMiRyZWFjdEljb25CYXNlO1xuXG4gIHZhciBjb21wdXRlZFNpemUgPSBzaXplIHx8IHJlYWN0SWNvbkJhc2Uuc2l6ZSB8fCAnMWVtJztcbiAgcmV0dXJuIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KCdzdmcnLCBfZXh0ZW5kcyh7XG4gICAgY2hpbGRyZW46IGNoaWxkcmVuLFxuICAgIGZpbGw6ICdjdXJyZW50Q29sb3InLFxuICAgIHByZXNlcnZlQXNwZWN0UmF0aW86ICd4TWlkWU1pZCBtZWV0JyxcbiAgICBoZWlnaHQ6IGhlaWdodCB8fCBjb21wdXRlZFNpemUsXG4gICAgd2lkdGg6IHdpZHRoIHx8IGNvbXB1dGVkU2l6ZVxuICB9LCByZWFjdEljb25CYXNlLCBwcm9wcywge1xuICAgIHN0eWxlOiBfZXh0ZW5kcyh7XG4gICAgICB2ZXJ0aWNhbEFsaWduOiAnbWlkZGxlJyxcbiAgICAgIGNvbG9yOiBjb2xvciB8fCByZWFjdEljb25CYXNlLmNvbG9yXG4gICAgfSwgcmVhY3RJY29uQmFzZS5zdHlsZSB8fCB7fSwgc3R5bGUpXG4gIH0pKTtcbn07XG5cbkljb25CYXNlLnByb3BUeXBlcyA9IHtcbiAgY29sb3I6IF9wcm9wVHlwZXMyLmRlZmF1bHQuc3RyaW5nLFxuICBzaXplOiBfcHJvcFR5cGVzMi5kZWZhdWx0Lm9uZU9mVHlwZShbX3Byb3BUeXBlczIuZGVmYXVsdC5zdHJpbmcsIF9wcm9wVHlwZXMyLmRlZmF1bHQubnVtYmVyXSksXG4gIHdpZHRoOiBfcHJvcFR5cGVzMi5kZWZhdWx0Lm9uZU9mVHlwZShbX3Byb3BUeXBlczIuZGVmYXVsdC5zdHJpbmcsIF9wcm9wVHlwZXMyLmRlZmF1bHQubnVtYmVyXSksXG4gIGhlaWdodDogX3Byb3BUeXBlczIuZGVmYXVsdC5vbmVPZlR5cGUoW19wcm9wVHlwZXMyLmRlZmF1bHQuc3RyaW5nLCBfcHJvcFR5cGVzMi5kZWZhdWx0Lm51bWJlcl0pLFxuICBzdHlsZTogX3Byb3BUeXBlczIuZGVmYXVsdC5vYmplY3Rcbn07XG5cbkljb25CYXNlLmNvbnRleHRUeXBlcyA9IHtcbiAgcmVhY3RJY29uQmFzZTogX3Byb3BUeXBlczIuZGVmYXVsdC5zaGFwZShJY29uQmFzZS5wcm9wVHlwZXMpXG59O1xuXG5leHBvcnRzLmRlZmF1bHQgPSBJY29uQmFzZTtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfcmVhY3RJY29uQmFzZSA9IHJlcXVpcmUoJ3JlYWN0LWljb24tYmFzZScpO1xuXG52YXIgX3JlYWN0SWNvbkJhc2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3RJY29uQmFzZSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBGYVNwaW5uZXIgPSBmdW5jdGlvbiBGYVNwaW5uZXIocHJvcHMpIHtcbiAgICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgIF9yZWFjdEljb25CYXNlMi5kZWZhdWx0LFxuICAgICAgICBfZXh0ZW5kcyh7IHZpZXdCb3g6ICcwIDAgNDAgNDAnIH0sIHByb3BzKSxcbiAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAnZycsXG4gICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoJ3BhdGgnLCB7IGQ6ICdtMTEuNyAzMS4xcTAgMS4yLTAuOCAydC0yIDAuOXEtMS4yIDAtMi0wLjl0LTAuOS0ycTAtMS4yIDAuOS0ydDItMC44IDIgMC44IDAuOCAyeiBtMTEuMiA0LjZxMCAxLjItMC45IDJ0LTIgMC45LTItMC45LTAuOS0yIDAuOS0yIDItMC44IDIgMC44IDAuOSAyeiBtLTE1LjgtMTUuN3EwIDEuMi0wLjggMnQtMiAwLjktMi0wLjktMC45LTIgMC45LTIgMi0wLjkgMiAwLjkgMC44IDJ6IG0yNi45IDExLjFxMCAxLjItMC45IDJ0LTIgMC45cS0xLjIgMC0yLTAuOXQtMC44LTIgMC44LTIgMi0wLjggMiAwLjggMC45IDJ6IG0tMjEuNS0yMi4ycTAgMS41LTEuMSAyLjV0LTIuNSAxLjEtMi41LTEuMS0xLjEtMi41IDEuMS0yLjUgMi41LTEuMSAyLjUgMS4xIDEuMSAyLjV6IG0yNi4xIDExLjFxMCAxLjItMC45IDJ0LTIgMC45LTItMC45LTAuOC0yIDAuOC0yIDItMC45IDIgMC45IDAuOSAyeiBtLTE0LjMtMTUuN3EwIDEuOC0xLjMgM3QtMyAxLjMtMy0xLjMtMS4zLTMgMS4zLTMuMSAzLTEuMiAzIDEuMyAxLjMgM3ogbTExLjggNC42cTAgMi4xLTEuNSAzLjV0LTMuNSAxLjVxLTIuMSAwLTMuNS0xLjV0LTEuNS0zLjVxMC0yLjEgMS41LTMuNXQzLjUtMS41cTIuMSAwIDMuNSAxLjV0MS41IDMuNXonIH0pXG4gICAgICAgIClcbiAgICApO1xufTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gRmFTcGlubmVyO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBob2lzdE5vblJlYWN0U3RhdGljcyBmcm9tICdob2lzdC1ub24tcmVhY3Qtc3RhdGljcyc7XG5pbXBvcnQgbG9jYWxlU2VydmljZSBmcm9tICcuLy4uL3NlcnZpY2VzL0xvY2FsZVNlcnZpY2UnO1xuaW1wb3J0IGkxOG5TZXJ2aWNlIGZyb20gJy4vLi4vc2VydmljZXMvSTE4blNlcnZpY2UnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBsb2NhbGVBd2FyZShDb21wb25lbnQpIHtcbiAgY2xhc3MgTG9jYWxlQXdhcmUgZXh0ZW5kcyBSZWFjdC5QdXJlQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCkge1xuICAgICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xuICAgICAgdGhpcy5oYW5kbGVMb2NhbGVDaGFuZ2UgPSB0aGlzLmhhbmRsZUxvY2FsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy51bnJlZ2lzdGVyTG9jYWxlQ2hhbmdlID0gbnVsbDtcbiAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgIGxvY2FsZTogbG9jYWxlU2VydmljZS5sb2NhbGVcbiAgICAgIH07XG4gICAgICB0aGlzLl9tb3VudGVkID0gZmFsc2U7XG4gICAgICB0aGlzLl9jb21wb25lbnQgPSBudWxsO1xuICAgIH1cblxuICAgIGhhbmRsZUxvY2FsZUNoYW5nZShsb2NhbGUpIHtcbiAgICAgIHRoaXMuX21vdW50ZWQgJiYgdGhpcy5zdGF0ZS5sb2NhbGUgIT09IGxvY2FsZSAmJiB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgbG9jYWxlXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgIHRoaXMudW5yZWdpc3RlckxvY2FsZUNoYW5nZSA9IGxvY2FsZVNlcnZpY2Uub25Mb2NhbGVDaGFuZ2UodGhpcy5oYW5kbGVMb2NhbGVDaGFuZ2UpO1xuICAgICAgdGhpcy5fbW91bnRlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgICB0aGlzLl9tb3VudGVkID0gZmFsc2U7XG4gICAgICB0aGlzLnVucmVnaXN0ZXJMb2NhbGVDaGFuZ2UoKTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICBjb25zdCB7IGxvY2FsZSB9ID0gdGhpcy5zdGF0ZTtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxDb21wb25lbnQgeyAuLi50aGlzLnByb3BzIH1cbiAgICAgICAgICBsb2NhbGU9eyBsb2NhbGUgfVxuICAgICAgICAgIHRyYW5zbGF0aW9ucz17IGkxOG5TZXJ2aWNlLmN1cnJlbnRMYW5nVHJhbnNsYXRpb25zIH1cbiAgICAgICAgICByZWY9eyBjb21wID0+IHRoaXMuX2NvbXBvbmVudCA9IGNvbXAgfVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBMb2NhbGVBd2FyZS5kaXNwbGF5TmFtZSA9IGBMb2NhbGVBd2FyZSgke1xuICAgIENvbXBvbmVudC5kaXNwbGF5TmFtZSB8fFxuICAgIENvbXBvbmVudC5uYW1lIHx8XG4gICAgJ0NvbXBvbmVudCdcbiAgfSlgO1xuXG4gIHJldHVybiBob2lzdE5vblJlYWN0U3RhdGljcyhMb2NhbGVBd2FyZSwgQ29tcG9uZW50KTtcbn1cbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgaW5qZWN0U2hlZXQgZnJvbSAncmVhY3QtanNzJztcbmltcG9ydCBob2lzdE5vblJlYWN0U3RhdGljcyBmcm9tICdob2lzdC1ub24tcmVhY3Qtc3RhdGljcyc7XG5pbXBvcnQgeyB0aGVtaW5nIH0gZnJvbSAnLi4vdGhlbWluZy90aGVtaW5nJztcblxuXG5jb25zdCB7IFRoZW1lUHJvdmlkZXIgfSA9IHRoZW1pbmc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRoZW1lQXdhcmUoeyB0aGVtZSwgc3R5bGUgfSkge1xuICByZXR1cm4gZnVuY3Rpb24gdGhlbWVBd2FyZUlubmVyKENvbXBvbmVudCkge1xuICAgIGNvbnN0IFRvUmVuZGVyID0gc3R5bGUgPyBpbmplY3RTaGVldChzdHlsZSwgeyB0aGVtaW5nIH0pKENvbXBvbmVudCkgOiBDb21wb25lbnQ7XG5cbiAgICBjbGFzcyBUaGVtZUF3YXJlIGV4dGVuZHMgUmVhY3QuUHVyZUNvbXBvbmVudCB7XG4gICAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgdGhlbWUgP1xuICAgICAgICAgICAgPFRoZW1lUHJvdmlkZXIgdGhlbWU9eyB0aGVtZSB9PlxuICAgICAgICAgICAgICA8VG9SZW5kZXIgeyAuLi50aGlzLnByb3BzIH0gLz5cbiAgICAgICAgICAgIDwvVGhlbWVQcm92aWRlcj4gOlxuICAgICAgICAgICAgPFRvUmVuZGVyIHsgLi4udGhpcy5wcm9wcyB9IC8+XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgVGhlbWVBd2FyZS5kaXNwbGF5TmFtZSA9IGBUaGVtZUF3YXJlKCR7XG4gICAgICBDb21wb25lbnQuZGlzcGxheU5hbWUgfHxcbiAgICAgIENvbXBvbmVudC5uYW1lIHx8XG4gICAgICAnQ29tcG9uZW50J1xuICAgIH0pYDtcblxuICAgIHJldHVybiBob2lzdE5vblJlYWN0U3RhdGljcyhUaGVtZUF3YXJlLCBDb21wb25lbnQpO1xuICB9O1xufVxuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgdGhlbWVBd2FyZSBmcm9tICcuLi8uLi9IT0MvdGhlbWVBd2FyZSc7XG5pbXBvcnQgbG9jYWxlQXdhcmUgZnJvbSAnLi4vLi4vSE9DL2xvY2FsZUF3YXJlJztcblxuY29uc3Qgc3R5bGUgPSAoeyB2YXJzIH0pID0+IHtcbiAgcmV0dXJuIHtcbiAgICBoZWxsbzoge1xuICAgICAgY29sb3I6IHZhcnMuY29sb3JzLnByaW1hcnlDb2xvciB8fCAnb3JhbmdlJ1xuICAgIH1cbiAgfTtcbn07XG5cbmNsYXNzIEZvcm1JbnB1dE51bWJlciBleHRlbmRzIFJlYWN0LlB1cmVDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgdmFsdWU6IHByb3BzLnZhbHVlIHx8IDBcbiAgICB9O1xuICAgIHRoaXMuaGFuZGxlQ2hhbmdlID0gdGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGhhbmRsZUNoYW5nZShldnQpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHZhbHVlOiBldnQudGFyZ2V0LnZhbHVlXG4gICAgfSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyB0aGVtZSwgY2xhc3NlcywgbmFtZSB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zb2xlLmxvZygnRm9ybUlucHV0TnVtYmVyJywgeyB0aGVtZSB9KTtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPGlucHV0IGNsYXNzTmFtZT17IHRoZW1lLmNvbW1vbi5mb3JtSW5wdXQgfSBuYW1lPXtuYW1lfSB0eXBlPVwidGV4dFwiIHZhbHVlPXt0aGlzLnN0YXRlLnZhbHVlfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9IC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbkZvcm1JbnB1dE51bWJlci5wcm9wVHlwZXMgPSB7XG4gIHZhbHVlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICB0aGVtZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgbmFtZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBjbGFzc2VzOiBQcm9wVHlwZXMub2JqZWN0XG59O1xuXG5leHBvcnQgZGVmYXVsdCB0aGVtZUF3YXJlKHsgc3R5bGUgfSkobG9jYWxlQXdhcmUoRm9ybUlucHV0TnVtYmVyKSk7XG5cbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IEZhU3Bpbm5lciBmcm9tICdyZWFjdC1pY29ucy9saWIvZmEvc3Bpbm5lcic7XG5pbXBvcnQgTGlzdCBmcm9tICcuLi9MaXN0L0xpc3QnO1xuaW1wb3J0IFdvcmxkIGZyb20gJy4uL1dvcmxkL1dvcmxkJztcbmltcG9ydCB0aGVtZUF3YXJlIGZyb20gJy4uLy4uL0hPQy90aGVtZUF3YXJlJztcbmltcG9ydCBsb2NhbGVBd2FyZSBmcm9tICcuLi8uLi9IT0MvbG9jYWxlQXdhcmUnO1xuaW1wb3J0IGkxOG5TZXJ2aWNlIGZyb20gJy4vLi4vLi4vc2VydmljZXMvSTE4blNlcnZpY2UnO1xuaW1wb3J0IHRlbXBsYXRlIGZyb20gJy4uLy4uL3V0aWxzL3RlbXBsYXRlJztcblxuaTE4blNlcnZpY2UucmVnaXN0ZXJUcmFuc2xhdGlvbnMoe1xuICBlbjoge1xuICAgICdIZWxsbyc6IHRlbXBsYXRlYEhlbGxvICR7J2FnZSd9ICR7J25hbWUnfWBcbiAgfSxcbiAgc3A6IHtcbiAgICAnSGVsbG8nOiB0ZW1wbGF0ZWBIb2xhICR7J2FnZSd9ICR7J25hbWUnfWBcbiAgfVxufSk7XG5cbmNvbnN0IGxpc3RJdGVtcyA9IFsnb25lJywgJ3R3byddO1xuXG5cbmNvbnN0IHN0eWxlID0gKHsgdmFycyB9KSA9PiB7XG4gIHJldHVybiB7XG4gICAgaGVsbG86IHtcbiAgICAgIGNvbG9yOiB2YXJzLmNvbG9ycy5wcmltYXJ5Q29sb3IgfHwgJ29yYW5nZSdcbiAgICB9XG4gIH07XG59O1xuXG5jbGFzcyBIZWxsbyBleHRlbmRzIFJlYWN0LlB1cmVDb21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyB0aGVtZSwgdHJhbnNsYXRpb25zIH0gPSB0aGlzLnByb3BzO1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAvKiBlc2xpbnQgbm8tY29uc29sZTogMCAqL1xuICAgICAgLy8gY29uc29sZS5sb2coJ3JlbmRlcmluZyBIZWxsbyBjb21wb25lbnQnKTtcbiAgICB9XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXsgdGhpcy5wcm9wcy5jbGFzc2VzLmhlbGxvIH0+XG4gICAgICAgIHt0cmFuc2xhdGlvbnMuSGVsbG8oeyBhZ2U6IDIyLCBuYW1lOiB0aGlzLnByb3BzLm5hbWUgfHwgJ05vYm9keScgfSl9XG4gICAgICAgIDxGYVNwaW5uZXIgY2xhc3NOYW1lPXsgdGhlbWUuYW5pbWF0aW9ucy5kYnVBbmltYXRpb25TcGluIH0vPlxuICAgICAgICA8TGlzdCBpdGVtcz17IGxpc3RJdGVtcyB9Lz5cbiAgICAgICAgPExpc3QgaXRlbXM9eyBsaXN0SXRlbXMgfS8+XG4gICAgICAgIDxXb3JsZCAvPlxuICAgICAgICA8V29ybGQgLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuSGVsbG8ucHJvcFR5cGVzID0ge1xuICB0cmFuc2xhdGlvbnM6IFByb3BUeXBlcy5vYmplY3QsXG4gIHRoZW1lOiBQcm9wVHlwZXMub2JqZWN0LFxuICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIGNsYXNzZXM6IFByb3BUeXBlcy5vYmplY3Rcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHRoZW1lQXdhcmUoeyBzdHlsZSB9KShsb2NhbGVBd2FyZShIZWxsbykpO1xuXG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBjb2xvciBmcm9tICdjb2xvcic7XG5pbXBvcnQgdGhlbWVBd2FyZSBmcm9tICcuLi8uLi9IT0MvdGhlbWVBd2FyZSc7XG5pbXBvcnQgbG9jYWxlQXdhcmUgZnJvbSAnLi4vLi4vSE9DL2xvY2FsZUF3YXJlJztcbmltcG9ydCBpMThuU2VydmljZSBmcm9tICcuLy4uLy4uL3NlcnZpY2VzL0kxOG5TZXJ2aWNlJztcbmltcG9ydCBsb2NhbGVTZXJ2aWNlIGZyb20gJy4vLi4vLi4vc2VydmljZXMvTG9jYWxlU2VydmljZSc7XG5pbXBvcnQgdGVtcGxhdGUgZnJvbSAnLi4vLi4vdXRpbHMvdGVtcGxhdGUnO1xuXG5pMThuU2VydmljZS5yZWdpc3RlclRyYW5zbGF0aW9ucyh7XG4gIGVuOiB7XG4gICAgJ2xpc3QnOiB0ZW1wbGF0ZWBsaXN0YFxuICB9LFxuICBzcDoge1xuICAgICdsaXN0JzogdGVtcGxhdGVgbGlzdGFgXG4gIH1cbn0pO1xuXG5jb25zdCBzdHlsZSA9ICh7IHZhcnMgfSkgPT4ge1xuICByZXR1cm4ge1xuICAgIGxpc3Q6IHtcbiAgICAgIC8vIGNvbG9yOiBjb2xvcih2YXJzLmNvbG9ycy5zZWNvbmRhcnlDb2xvciB8fCAnb3JhbmdlJykubGlnaHRlbigwLjUpLmhleCgpXG4gICAgICBjb2xvcjogdmFycy5kaXIgPT09ICdsdHInID8gJ2dyZWVuJyA6ICdyZWQnXG4gICAgfVxuICB9O1xufTtcblxuY2xhc3MgTGlzdCBleHRlbmRzIFJlYWN0LlB1cmVDb21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIC8qIGVzbGludCBuby1jb25zb2xlOiAwICovXG4gICAgICAvLyBjb25zb2xlLmxvZygncmVuZGVyaW5nIExpc3QgY29tcG9uZW50Jyk7XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICB7dGhpcy5wcm9wcy50cmFuc2xhdGlvbnMubGlzdCgpfVxuICAgICAgICA8dWwgY2xhc3NOYW1lPXt0aGlzLnByb3BzLmNsYXNzZXMubGlzdH0+XG4gICAgICAgICAge3RoaXMucHJvcHMuaXRlbXMubWFwKGl0ZW0gPT4gPGxpIGtleT17aXRlbX0+e2l0ZW19PC9saT4pfVxuICAgICAgICA8L3VsPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5MaXN0LmRlZmF1bHRQcm9wcyA9IHtcbiAgaXRlbXM6IFtdXG59O1xuXG5MaXN0LnByb3BUeXBlcyA9IHtcbiAgaXRlbXM6IFByb3BUeXBlcy5hcnJheSxcbiAgY2xhc3NlczogUHJvcFR5cGVzLm9iamVjdFxufTtcblxuZXhwb3J0IGRlZmF1bHQgdGhlbWVBd2FyZSh7IHN0eWxlIH0pKGxvY2FsZUF3YXJlKExpc3QpKTtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IExpc3QgZnJvbSAnLi4vTGlzdC9MaXN0JztcbmltcG9ydCB0aGVtZUF3YXJlIGZyb20gJy4uLy4uL0hPQy90aGVtZUF3YXJlJztcblxuY29uc3Qgc3R5bGUgPSAoeyB2YXJzIH0pID0+IHtcbiAgcmV0dXJuIHtcbiAgICB3b3JsZDoge1xuICAgICAgY29sb3I6IHZhcnMuY29sb3JzLnByaW1hcnlDb2xvciB8fCAnb3JhbmdlJ1xuICAgIH1cbiAgfTtcbn07XG5cbmNsYXNzIFdvcmxkIGV4dGVuZHMgUmVhY3QuUHVyZUNvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgLyogZXNsaW50IG5vLWNvbnNvbGU6IDAgKi9cbiAgICAgIC8vIGNvbnNvbGUubG9nKCdyZW5kZXJpbmcgSGVsbG8gY29tcG9uZW50Jyk7XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17dGhpcy5wcm9wcy5jbGFzc2VzLmhlbGxvfT5cbiAgICAgICAgV29ybGQgLS0tLS0tLS0tLS0tXG4gICAgICAgIDxMaXN0IGl0ZW1zPXtbJ2ZpdmUnLCAnc2l4J119Lz5cbiAgICAgICAgPExpc3QgaXRlbXM9e1snZml2ZScsICdzaXgnXX0vPlxuICAgICAgICAtLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuV29ybGQucHJvcFR5cGVzID0ge1xuICBjbGFzc2VzOiBQcm9wVHlwZXMub2JqZWN0XG59O1xuXG5leHBvcnQgZGVmYXVsdCB0aGVtZUF3YXJlKHsgc3R5bGUgfSkoV29ybGQpO1xuXG4iLCJpbXBvcnQgbG9jYWxlU2VydmljZSBmcm9tICcuL0xvY2FsZVNlcnZpY2UnO1xuXG5jb25zdCBlbXB0eU9iaiA9IHt9O1xuXG5jbGFzcyBJMThuU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGxvY2FsZVNlcnZpY2Uub25Mb2NhbGVDaGFuZ2UodGhpcy5faGFuZGxlTG9jYWxlQ2hhbmdlLmJpbmQodGhpcykpO1xuICAgIHRoaXMuX2xvY2FsZSA9IGxvY2FsZVNlcnZpY2UubG9jYWxlO1xuICAgIHRoaXMuX3RyYW5zbGF0aW9ucyA9IHt9O1xuICB9XG5cbiAgX2hhbmRsZUxvY2FsZUNoYW5nZShsb2NhbGUpIHtcbiAgICB0aGlzLl9sb2NhbGUgPSBsb2NhbGU7XG4gIH1cblxuICBjbGVhclRyYW5zbGF0aW9ucyhsYW5nKSB7XG4gICAgZGVsZXRlIHRoaXMuX3RyYW5zbGF0aW9uc1tsYW5nXTtcbiAgfVxuXG4gIHJlZ2lzdGVyVHJhbnNsYXRpb25zKHRyYW5zbGF0aW9ucykge1xuICAgIHRoaXMuX3RyYW5zbGF0aW9ucyA9IE9iamVjdC5rZXlzKHRyYW5zbGF0aW9ucykucmVkdWNlKChhY2MsIGxhbmcpID0+IHtcbiAgICAgIGFjY1tsYW5nXSA9IHtcbiAgICAgICAgLi4udGhpcy5fdHJhbnNsYXRpb25zW2xhbmddLFxuICAgICAgICAuLi50cmFuc2xhdGlvbnNbbGFuZ11cbiAgICAgIH07XG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHRoaXMuX3RyYW5zbGF0aW9ucyk7XG4gIH1cblxuICB0cmFuc2xhdGUobXNnKSB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudExhbmdUcmFuc2xhdGlvbnNbbXNnXTtcbiAgfVxuXG4gIGdldCB0cmFuc2xhdGlvbnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RyYW5zbGF0aW9ucztcbiAgfVxuXG4gIGdldCBjdXJyZW50TGFuZ1RyYW5zbGF0aW9ucygpIHtcbiAgICByZXR1cm4gdGhpcy5fdHJhbnNsYXRpb25zW3RoaXMuX2xvY2FsZS5sYW5nXSB8fCBlbXB0eU9iajtcbiAgfVxufVxuXG5jb25zdCBpMThuU2VydmljZSA9IG5ldyBJMThuU2VydmljZSgpO1xuZXhwb3J0IGRlZmF1bHQgaTE4blNlcnZpY2U7XG4iLCJcbmNvbnN0IGRlZmF1bHRMb2NhbGUgPSB7XG4gIGRpcjogJ2x0cicsXG4gIGxhbmc6ICdlbidcbn07XG5cbmNsYXNzIExvY2FsZVNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9jYWxsYmFja3MgPSBbXTtcbiAgICB0aGlzLl9sb2NhbGVBdHRycyA9IE9iamVjdC5rZXlzKGRlZmF1bHRMb2NhbGUpO1xuICAgIHRoaXMuX3Jvb3RFbGVtZW50ID0gd2luZG93LmRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICB0aGlzLl9sb2NhbGVBdHRycy5mb3JFYWNoKChhdHRyKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuX3Jvb3RFbGVtZW50LmdldEF0dHJpYnV0ZShhdHRyKSkge1xuICAgICAgICB0aGlzLl9yb290RWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0ciwgZGVmYXVsdExvY2FsZVthdHRyXSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5fbG9jYWxlID0gdGhpcy5fbG9jYWxlQXR0cnMucmVkdWNlKChhY2MsIGF0dHIpID0+IHtcbiAgICAgIGFjY1thdHRyXSA9IHRoaXMuX3Jvb3RFbGVtZW50LmdldEF0dHJpYnV0ZShhdHRyKTtcbiAgICAgIHJldHVybiBhY2M7XG4gICAgfSwge30pO1xuICAgIHRoaXMuX29ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy5faGFuZGxlTXV0YXRpb25zLmJpbmQodGhpcykpO1xuICAgIHRoaXMuX29ic2VydmVyLm9ic2VydmUodGhpcy5fcm9vdEVsZW1lbnQsIHtcbiAgICAgIGF0dHJpYnV0ZXM6IHRydWVcbiAgICB9KTtcbiAgfVxuXG4gIF9oYW5kbGVNdXRhdGlvbnMobXV0YXRpb25zKSB7XG4gICAgbXV0YXRpb25zLmZvckVhY2goKG11dGF0aW9uKSA9PiB7XG4gICAgICBjb25zdCBtdXRhdGlvbkF0dHJpYnV0ZU5hbWUgPSBtdXRhdGlvbi5hdHRyaWJ1dGVOYW1lO1xuICAgICAgaWYgKHRoaXMuX2xvY2FsZUF0dHJzLmluY2x1ZGVzKG11dGF0aW9uQXR0cmlidXRlTmFtZSkpIHtcbiAgICAgICAgdGhpcy5fbG9jYWxlID0ge1xuICAgICAgICAgIC4uLnRoaXMuX2xvY2FsZSxcbiAgICAgICAgICBbbXV0YXRpb25BdHRyaWJ1dGVOYW1lXTogdGhpcy5fcm9vdEVsZW1lbnQuZ2V0QXR0cmlidXRlKG11dGF0aW9uQXR0cmlidXRlTmFtZSlcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tzLmZvckVhY2goY2FsbGJhY2sgPT4gY2FsbGJhY2sodGhpcy5fbG9jYWxlKSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzZXQgbG9jYWxlKGxvY2FsZU9iaikge1xuICAgIE9iamVjdC5rZXlzKGxvY2FsZU9iaikuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICB0aGlzLl9yb290RWxlbWVudC5zZXRBdHRyaWJ1dGUoa2V5LCBsb2NhbGVPYmpba2V5XSk7XG4gICAgfSk7XG4gIH1cblxuICBnZXQgbG9jYWxlKCkge1xuICAgIHJldHVybiB0aGlzLl9sb2NhbGU7XG4gIH1cblxuICBvbkxvY2FsZUNoYW5nZShjYWxsYmFjaykge1xuICAgIHRoaXMuX2NhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcbiAgICBjYWxsYmFjayh0aGlzLmxvY2FsZSk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcy5maWx0ZXIoY2IgPT4gY2IgIT09IGNhbGxiYWNrKTtcbiAgICB9O1xuICB9XG59XG5cbmNvbnN0IGxvY2FsZVNlcnZpY2UgPSBuZXcgTG9jYWxlU2VydmljZSgpO1xuZXhwb3J0IGRlZmF1bHQgbG9jYWxlU2VydmljZTtcbiIsImNvbnN0IGNvbW1vbkFuaW1hdGlvbnMgPSAodGhlbWVWYXJzKSA9PiB7XG4gIGNvbnN0IHsgZGlyIH0gPSB0aGVtZVZhcnM7XG4gIHJldHVybiB7XG4gICAgW2BAa2V5ZnJhbWVzIGRidUFuaW1hdGlvblNwaW5fJHtkaXJ9YF06IHtcbiAgICAgICcwJSc6IHtcbiAgICAgICAgdHJhbnNmb3JtOiAncm90YXRlKDBkZWcpJ1xuICAgICAgfSxcbiAgICAgICcxMDAlJzoge1xuICAgICAgICB0cmFuc2Zvcm06IGRpciA9PT0gJ2x0cicgPyAncm90YXRlKDM1OWRlZyknIDogJ3JvdGF0ZSgtMzU5ZGVnKSdcbiAgICAgIH1cbiAgICB9LFxuICAgIGRidUFuaW1hdGlvblNwaW46IHtcbiAgICAgIGFuaW1hdGlvbjogYGRidUFuaW1hdGlvblNwaW5fJHtkaXJ9IDJzIGluZmluaXRlIGxpbmVhcmAsXG4gICAgICBhbmltYXRpb25OYW1lOiBgZGJ1QW5pbWF0aW9uU3Bpbl8ke2Rpcn1gLFxuICAgICAgYW5pbWF0aW9uRHVyYXRpb246ICcycycsXG4gICAgICBhbmltYXRpb25UaW1pbmdGdW5jdGlvbjogJ2xpbmVhcicsXG4gICAgICBhbmltYXRpb25EZWxheTogJ2luaXRpYWwnLFxuICAgICAgYW5pbWF0aW9uSXRlcmF0aW9uQ291bnQ6ICdpbmZpbml0ZScsXG4gICAgICBhbmltYXRpb25EaXJlY3Rpb246ICdpbml0aWFsJyxcbiAgICAgIGFuaW1hdGlvbkZpbGxNb2RlOiAnaW5pdGlhbCcsXG4gICAgICBhbmltYXRpb25QbGF5U3RhdGU6ICdpbml0aWFsJ1xuICAgIH1cbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbW1vbkFuaW1hdGlvbnM7XG4iLCJpbXBvcnQgZ3JpZCBmcm9tICcuL2dyaWQvZ3JpZCc7XG5pbXBvcnQgZm9ybSBmcm9tICcuL2Zvcm0vZm9ybSc7XG5cbmNvbnN0IGNvbW1vbkNsYXNzZXMgPSAodGhlbWVWYXJzKSA9PiB7XG4gIHJldHVybiB7XG4gICAgLi4uZ3JpZCh0aGVtZVZhcnMpLFxuICAgIC4uLmZvcm0odGhlbWVWYXJzKVxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY29tbW9uQ2xhc3NlcztcbiIsIlxuXG5jb25zdCBmb3JtSW5wdXQgPSAodGhlbWVWYXJzKSA9PiB7XG4gIGNvbnN0IHtcbiAgICBkaW1lbnNpb25zOiB7XG4gICAgICBmb3JtSW5wdXRIZWlnaHQsXG4gICAgICBmb3JtSW5wdXRCb3JkZXJUb3BXaWR0aCxcbiAgICAgIGZvcm1JbnB1dEJvcmRlclJpZ2h0V2lkdGgsXG4gICAgICBmb3JtSW5wdXRCb3JkZXJCb3R0b21XaWR0aCxcbiAgICAgIGZvcm1JbnB1dEJvcmRlckxlZnRXaWR0aCxcbiAgICAgIGZvcm1JbnB1dEJvcmRlclRvcExlZnRSYWRpdXMsXG4gICAgICBmb3JtSW5wdXRCb3JkZXJUb3BSaWdodFJhZGl1cyxcbiAgICAgIGZvcm1JbnB1dEJvcmRlckJvdHRvbUxlZnRSYWRpdXMsXG4gICAgICBmb3JtSW5wdXRCb3JkZXJCb3R0b21SaWdodFJhZGl1cyxcbiAgICAgIGZvcm1JbnB1dFBhZGRpbmdTdGFydEVuZCxcbiAgICAgIGZvcm1JbnB1dEZvbnRTaXplXG4gICAgfSxcbiAgICBjb2xvcnM6IHtcbiAgICAgIGZvcm1JbnB1dENvbG9yLFxuICAgICAgZm9ybUlucHV0Qm9yZGVyQ29sb3IsXG4gICAgICBmb3JtSW5wdXRCYWNrZ3JvdW5kQ29sb3JcbiAgICB9XG4gIH0gPSB0aGVtZVZhcnM7XG4gIHJldHVybiB7XG4gICAgd2lkdGg6ICcxMDAlJyxcbiAgICBoZWlnaHQ6IGZvcm1JbnB1dEhlaWdodCxcbiAgICBwYWRkaW5nOiBgMHB4ICR7Zm9ybUlucHV0UGFkZGluZ1N0YXJ0RW5kfXB4YCxcbiAgICBmb250U2l6ZTogZm9ybUlucHV0Rm9udFNpemUsXG4gICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXG4gICAgY29sb3I6IGZvcm1JbnB1dENvbG9yLFxuICAgIGJhY2tncm91bmRDb2xvcjogZm9ybUlucHV0QmFja2dyb3VuZENvbG9yLFxuICAgIGJvcmRlclRvcDogYCR7Zm9ybUlucHV0Qm9yZGVyVG9wV2lkdGh9cHggc29saWQgJHtmb3JtSW5wdXRCb3JkZXJDb2xvcn1gLFxuICAgIGJvcmRlclJpZ2h0OiBgJHtmb3JtSW5wdXRCb3JkZXJSaWdodFdpZHRofXB4IHNvbGlkICR7Zm9ybUlucHV0Qm9yZGVyQ29sb3J9YCxcbiAgICBib3JkZXJMZWZ0OiBgJHtmb3JtSW5wdXRCb3JkZXJMZWZ0V2lkdGh9cHggc29saWQgJHtmb3JtSW5wdXRCb3JkZXJDb2xvcn1gLFxuICAgIGJvcmRlckJvdHRvbTogYCR7Zm9ybUlucHV0Qm9yZGVyQm90dG9tV2lkdGh9cHggc29saWQgJHtmb3JtSW5wdXRCb3JkZXJDb2xvcn1gLFxuICAgIGJvcmRlclRvcExlZnRSYWRpdXM6IGZvcm1JbnB1dEJvcmRlclRvcExlZnRSYWRpdXMsXG4gICAgYm9yZGVyVG9wUmlnaHRSYWRpdXM6IGZvcm1JbnB1dEJvcmRlclRvcFJpZ2h0UmFkaXVzLFxuICAgIGJvcmRlckJvdHRvbUxlZnRSYWRpdXM6IGZvcm1JbnB1dEJvcmRlckJvdHRvbUxlZnRSYWRpdXMsXG4gICAgYm9yZGVyQm90dG9tUmlnaHRSYWRpdXM6IGZvcm1JbnB1dEJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzLFxuICAgICcmOmZvY3VzJzoge1xuICAgICAgb3V0bGluZTogJ25vbmUnXG4gICAgfVxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZm9ybSh0aGVtZVZhcnMpIHtcbiAgcmV0dXJuIHtcbiAgICBmb3JtSW5wdXQ6IGZvcm1JbnB1dCh0aGVtZVZhcnMpXG4gIH07XG59XG4iLCJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdyaWQodGhlbWVWYXJzKSB7XG4gIGNvbnN0IHsgZGlyLCBncmlkOiB7IGNvbHMsIGJyZWFrcG9pbnRzIH0gfSA9IHRoZW1lVmFycztcbiAgY29uc3Qgc3RhcnQgPSBkaXIgPT09ICdsdHInID8gJ2xlZnQnIDogJ3JpZ2h0JztcbiAgLyogIGVzbGludCBuby11bnVzZWQtdmFyczogMCAqL1xuICBjb25zdCBlbmQgPSBkaXIgPT09ICdsdHInID8gJ3JpZ2h0JyA6ICdsZWZ0JztcblxuICByZXR1cm4ge1xuICAgIGNsZWFyZml4OiB7XG4gICAgICB6b29tOiAxLFxuICAgICAgJyY6YmVmb3JlLCAmOmFmdGVyJzoge1xuICAgICAgICBjb250ZW50OiAnXCJcIicsXG4gICAgICAgIGRpc3BsYXk6ICd0YWJsZSdcbiAgICAgIH0sXG4gICAgICAnJjphZnRlcic6IHtcbiAgICAgICAgY2xlYXI6ICdib3RoJ1xuICAgICAgfVxuICAgIH0sXG4gICAgcm93OiB7XG4gICAgICBleHRlbmQ6ICdjbGVhcmZpeCdcbiAgICB9LFxuICAgIGNvbDoge1xuICAgICAgZmxvYXQ6IHN0YXJ0LFxuICAgICAgdGV4dEFsaWduOiBzdGFydCxcbiAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICB9LFxuICAgIC4uLk9iamVjdC5rZXlzKGJyZWFrcG9pbnRzKS5yZWR1Y2UoKGFjYywga2V5KSA9PiB7XG4gICAgICByZXR1cm4gQXJyYXkuZnJvbSh7IGxlbmd0aDogY29scyB9KVxuICAgICAgICAubWFwKChlbCwgaSkgPT4gaSArIDEpXG4gICAgICAgIC5yZWR1Y2UoKGFjYywgaSkgPT4ge1xuICAgICAgICAgIGFjY1tgJHtrZXl9JHtpfWBdID0ge1xuICAgICAgICAgICAgW2BAbWVkaWEgKG1pbi13aWR0aDogJHticmVha3BvaW50c1trZXldfSlgXToge1xuICAgICAgICAgICAgICB3aWR0aDogYCR7KGkgLyBjb2xzKSAqIDEwMH0lYFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfSwgYWNjKTtcbiAgICB9LCB7fSlcbiAgfTtcbn1cbiIsImltcG9ydCB7IGpzcyB9IGZyb20gJ3JlYWN0LWpzcyc7XG5pbXBvcnQgY29tbW9uQW5pbWF0aW9ucyBmcm9tICcuL2NvbW1vbkFuaW1hdGlvbnMnO1xuaW1wb3J0IGNvbW1vbkNsYXNzZXMgZnJvbSAnLi9jb21tb25DbGFzc2VzJztcblxuY29uc3QgdGhlbWUgPSAodGhlbWVWYXJzKSA9PiBbJ2x0cicsICdydGwnXS5yZWR1Y2UoKGFjYywgZGlyKSA9PiB7XG4gIGNvbnN0IHRoZW1lVmFyc0RpciA9IHRoZW1lVmFycyhkaXIpO1xuXG4gIGNvbnN0IGNvbW1vbkFuaW1hdGlvbnNEaXIgPSBqc3MuY3JlYXRlU3R5bGVTaGVldChcbiAgICBjb21tb25BbmltYXRpb25zKHRoZW1lVmFyc0RpciksIHtcbiAgICAgIG1ldGE6IGBjb21tb25BbmltYXRpb25zXyR7ZGlyfWBcbiAgICB9XG4gICkuYXR0YWNoKCk7XG5cbiAgY29uc3QgY29tbW9uQ2xhc3Nlc0RpciA9IGpzcy5jcmVhdGVTdHlsZVNoZWV0KFxuICAgIGNvbW1vbkNsYXNzZXModGhlbWVWYXJzRGlyKSwge1xuICAgICAgbWV0YTogYGNvbW1vbkNsYXNzZXNfJHtkaXJ9YFxuICAgIH1cbiAgKS5hdHRhY2goKTtcblxuICBhY2NbZGlyXSA9IHtcbiAgICB2YXJzOiB0aGVtZVZhcnNEaXIsXG4gICAgYW5pbWF0aW9uczogY29tbW9uQW5pbWF0aW9uc0Rpci5jbGFzc2VzLFxuICAgIGNvbW1vbjogY29tbW9uQ2xhc3Nlc0Rpci5jbGFzc2VzXG4gIH07XG5cbiAgcmV0dXJuIGFjYztcbn0sIHt9KTtcblxuZXhwb3J0IGRlZmF1bHQgdGhlbWU7XG5cbiIsIlxuY29uc3QgY29tbW9uVmFycyA9IGRpciA9PiAoe1xuICBkaXIsXG4gIGNvbG9yczoge1xuICAgIHByaW1hcnlDb2xvcjogJ2dyZWVuJyxcbiAgICBzZWNvbmRhcnlDb2xvcjogJ2JsdWUnLFxuICAgIGZvcm1JbnB1dENvbG9yOiAnYmxhY2snLFxuICAgIGZvcm1JbnB1dEJvcmRlckNvbG9yOiAnZ3JleScsXG4gICAgZm9ybUlucHV0QmFja2dyb3VuZENvbG9yOiAnd2hpdGUnXG4gIH0sXG4gIGRpbWVuc2lvbnM6IHtcbiAgICBmb3JtSW5wdXRIZWlnaHQ6IDI2LFxuICAgIGZvcm1JbnB1dEZvbnRTaXplOiAxNixcbiAgICBmb3JtSW5wdXRQYWRkaW5nU3RhcnRFbmQ6IDUsXG4gICAgZm9ybUlucHV0Qm9yZGVyUmFkaXVzOiAwLFxuICAgIGZvcm1JbnB1dEJvcmRlclRvcFdpZHRoOiAwLFxuICAgIGZvcm1JbnB1dEJvcmRlclJpZ2h0V2lkdGg6IDAsXG4gICAgZm9ybUlucHV0Qm9yZGVyQm90dG9tV2lkdGg6IDEsXG4gICAgZm9ybUlucHV0Qm9yZGVyTGVmdFdpZHRoOiAwLFxuICAgIGZvcm1JbnB1dEJvcmRlclRvcExlZnRSYWRpdXM6IDAsXG4gICAgZm9ybUlucHV0Qm9yZGVyVG9wUmlnaHRSYWRpdXM6IDAsXG4gICAgZm9ybUlucHV0Qm9yZGVyQm90dG9tTGVmdFJhZGl1czogMCxcbiAgICBmb3JtSW5wdXRCb3JkZXJCb3R0b21SaWdodFJhZGl1czogMCxcbiAgfSxcbiAgZ3JpZDoge1xuICAgIGJyZWFrcG9pbnRzOiB7XG4gICAgICB4czogJzFweCcsXG4gICAgICBzOiAnNTc2cHgnLFxuICAgICAgbTogJzc2OHB4JyxcbiAgICAgIGw6ICc5OTJweCcsXG4gICAgICB4bDogJzEyMDBweCdcbiAgICB9LFxuICAgIGNvbHM6IDEyXG4gIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBjb21tb25WYXJzO1xuIiwiaW1wb3J0IHsgY3JlYXRlVGhlbWluZyB9IGZyb20gJ3JlYWN0LWpzcyc7XG5cbmNvbnN0IHRoZW1pbmcgPSBjcmVhdGVUaGVtaW5nKCdfX0RCVV9USEVNSU5HX18nKTtcblxuZXhwb3J0IHtcbiAgY3JlYXRlVGhlbWluZyxcbiAgdGhlbWluZ1xufTtcbiIsIlxuY29uc3QgYnV0dG9uSGVpZ2h0ID0gJzI1cHgnO1xuY29uc3QgYnV0dG9uU3RhcnQgPSAnNXB4JztcbmNvbnN0IGJ1dHRvblRvcCA9ICc1cHgnO1xuXG5sZXQgY29uc29sZU1lc3NhZ2VzID0gW107XG5jb25zdCBjb25zb2xlTG9nID0gY29uc29sZS5sb2cuYmluZChjb25zb2xlKTtcbmNvbnN0IGNvbnNvbGVPcmlnaW5hbCA9IHt9O1xuXG5mdW5jdGlvbiBjYXB0dXJlQ29uc29sZShjb25zb2xlRWxtLCBvcHRpb25zKSB7XG4gIGNvbnN0IHsgaW5kZW50ID0gMiwgc2hvd0xhc3RPbmx5ID0gZmFsc2UgfSA9IG9wdGlvbnM7XG4gIGNvbnN0IGhhbmRsZXIgPSBmdW5jdGlvbiBoYW5kbGVyKGFjdGlvbiwgLi4uYXJncykge1xuICAgIGlmIChzaG93TGFzdE9ubHkpIHtcbiAgICAgIGNvbnNvbGVNZXNzYWdlcyA9IFt7IFthY3Rpb25dOiBhcmdzIH1dO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlTWVzc2FnZXMucHVzaCh7IFthY3Rpb25dOiBhcmdzIH0pO1xuICAgIH1cblxuICAgIGNvbnNvbGVFbG0uaW5uZXJIVE1MID0gY29uc29sZU1lc3NhZ2VzLm1hcCgoZW50cnkpID0+IHtcbiAgICAgIGNvbnN0IGFjdGlvbiA9IE9iamVjdC5rZXlzKGVudHJ5KVswXTtcbiAgICAgIGNvbnN0IHZhbHVlcyA9IGVudHJ5W2FjdGlvbl07XG4gICAgICBjb25zdCBtZXNzYWdlID0gdmFsdWVzLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIFt1bmRlZmluZWQsIG51bGxdLmluY2x1ZGVzKGl0ZW0pIHx8XG4gICAgICAgICAgWydudW1iZXInLCAnc3RyaW5nJywgJ2Z1bmN0aW9uJ10uaW5jbHVkZXModHlwZW9mIGl0ZW0pXG4gICAgICAgICkgP1xuICAgICAgICAgIGl0ZW0gOlxuICAgICAgICAgIFsnTWFwJywgJ1NldCddLmluY2x1ZGVzKGl0ZW0uY29uc3RydWN0b3IubmFtZSkgP1xuICAgICAgICAgICAgYCR7aXRlbS5jb25zdHJ1Y3Rvci5uYW1lfSAoJHtKU09OLnN0cmluZ2lmeShbLi4uaXRlbV0pfSlgIDpcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KGl0ZW0sIChrZXksIHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgIGlmICgodHlwZW9mIHZhbHVlKSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS50b1N0cmluZygpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgIH0sIGluZGVudCk7XG4gICAgICB9KS5qb2luKCcsICcpO1xuXG4gICAgICBjb25zdCBjb2xvciA9IHtcbiAgICAgICAgbG9nOiAnIzAwMCcsXG4gICAgICAgIHdhcm46ICdvcmFuZ2UnLFxuICAgICAgICBlcnJvcjogJ2RhcmtyZWQnXG4gICAgICB9W2FjdGlvbl07XG5cbiAgICAgIHJldHVybiBgPHByZSBzdHlsZT1cImNvbG9yOiAke2NvbG9yfVwiPiR7bWVzc2FnZX08L3ByZT5gO1xuICAgIH0pLmpvaW4oJ1xcbicpO1xuICB9O1xuICBbJ2xvZycsICd3YXJuJywgJ2Vycm9yJ10uZm9yRWFjaCgoYWN0aW9uKSA9PiB7XG4gICAgY29uc29sZU9yaWdpbmFsW2FjdGlvbl0gPSBjb25zb2xlW2FjdGlvbl07XG4gICAgY29uc29sZVthY3Rpb25dID0gaGFuZGxlci5iaW5kKGNvbnNvbGUsIGFjdGlvbik7XG4gIH0pO1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCAoZXZ0KSA9PiB7XG4gICAgLy8gZXNsaW50IG5vLWNvbnNvbGU6IDBcbiAgICBjb25zb2xlLmVycm9yKGBcIiR7ZXZ0Lm1lc3NhZ2V9XCIgZnJvbSAke2V2dC5maWxlbmFtZX06JHtldnQubGluZW5vfWApO1xuICAgIGNvbnNvbGUuZXJyb3IoZXZ0LCBldnQuZXJyb3Iuc3RhY2spO1xuICAgIC8vIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9KTtcbiAgY29uc29sZUxvZygnY29uc29sZSBjYXB0dXJlZCcpO1xuICByZXR1cm4gZnVuY3Rpb24gcmVsZWFzZUNvbnNvbGUoKSB7XG4gICAgWydsb2cnLCAnd2FybicsICdlcnJvciddLmZvckVhY2goKGFjdGlvbikgPT4ge1xuICAgICAgY29uc29sZVthY3Rpb25dID0gY29uc29sZU9yaWdpbmFsW2FjdGlvbl07XG4gICAgfSk7XG4gICAgY29uc29sZUxvZygnY29uc29sZSByZWxlYXNlZCcpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVDb25zb2xlKHtcbiAgb3B0aW9ucyxcbiAgY29uc29sZVN0eWxlOiB7XG4gICAgYnRuU3RhcnQgPSBidXR0b25TdGFydCwgYnRuSGVpZ2h0ID0gYnV0dG9uSGVpZ2h0LFxuICAgIHdpZHRoID0gYGNhbGMoMTAwdncgLSAke2J0blN0YXJ0fSAtIDMwcHgpYCwgaGVpZ2h0ID0gJzQwMHB4JyxcbiAgICBiYWNrZ3JvdW5kID0gJ3JnYmEoMCwgMCwgMCwgMC41KSdcbiAgfVxufSkge1xuICBjb25zdCB7IHJ0bCA9IGZhbHNlIH0gPSBvcHRpb25zO1xuICBjb25zdCBjb25zb2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbnNvbGUuaWQgPSAnREJVb25TY3JlZW5Db25zb2xlJztcbiAgY29uc29sZS5zdHlsZS5jc3NUZXh0ID0gYFxuICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIG1hcmdpbjogMHB4O1xuICAgIHBhZGRpbmc6IDVweDtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgb3ZlcmZsb3c6IGF1dG87XG4gICAgd2lkdGg6ICR7d2lkdGh9O1xuICAgIGhlaWdodDogJHtoZWlnaHR9O1xuICAgIHRvcDogJHtidG5IZWlnaHR9O1xuICAgICR7cnRsID8gJ3JpZ2h0JyA6ICdsZWZ0J306IDBweDtcbiAgICBiYWNrZ3JvdW5kOiAke2JhY2tncm91bmR9O1xuICAgIHotaW5kZXg6IDk5OTk7XG4gICAgLXdlYmtpdC1vdmVyZmxvdy1zY3JvbGxpbmc6IHRvdWNoXG4gICAgYDtcbiAgcmV0dXJuIGNvbnNvbGU7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUJ1dHRvbih7XG4gIG9wdGlvbnMsXG4gIGJ1dHRvblN0eWxlOiB7XG4gICAgcG9zaXRpb24gPSAnZml4ZWQnLFxuICAgIHdpZHRoID0gJzI1cHgnLCBoZWlnaHQgPSBidXR0b25IZWlnaHQsIHRvcCA9IGJ1dHRvblRvcCwgc3RhcnQgPSBidXR0b25TdGFydCxcbiAgICBiYWNrZ3JvdW5kID0gJ3JnYmEoMCwgMCwgMCwgMC41KSdcbiAgfVxufSkge1xuICBjb25zdCB7IHJ0bCA9IGZhbHNlIH0gPSBvcHRpb25zO1xuICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgYnV0dG9uLmlkID0gJ0RCVW9uU2NyZWVuQ29uc29sZVRvZ2dsZXInO1xuICBidXR0b24uc3R5bGUuY3NzVGV4dCA9IGBcbiAgICBwb3NpdGlvbjogJHtwb3NpdGlvbn07XG4gICAgd2lkdGg6ICR7d2lkdGh9O1xuICAgIGhlaWdodDogJHtoZWlnaHR9O1xuICAgIHRvcDogJHt0b3B9O1xuICAgICR7cnRsID8gJ3JpZ2h0JyA6ICdsZWZ0J306ICR7c3RhcnR9O1xuICAgIGJhY2tncm91bmQ6ICR7YmFja2dyb3VuZH07XG4gICAgei1pbmRleDogOTk5OTtcbiAgICBgO1xuICByZXR1cm4gYnV0dG9uO1xufVxuXG4vKipcbm9uU2NyZWVuQ29uc29sZSh7XG4gIGJ1dHRvblN0eWxlID0geyBwb3NpdGlvbiwgd2lkdGgsIGhlaWdodCwgdG9wLCBzdGFydCwgYmFja2dyb3VuZCB9LFxuICBjb25zb2xlU3R5bGUgPSB7IHdpZHRoLCBoZWlnaHQsIGJhY2tncm91bmQgfSxcbiAgb3B0aW9ucyA9IHsgcnRsOiBmYWxzZSwgaW5kZW50LCBzaG93TGFzdE9ubHkgfVxufSlcbiovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBvblNjcmVlbkNvbnNvbGUoe1xuICBidXR0b25TdHlsZSA9IHt9LFxuICBjb25zb2xlU3R5bGUgPSB7fSxcbiAgb3B0aW9ucyA9IHt9XG59ID0ge30pIHtcbiAgY29uc3QgYnV0dG9uID0gY3JlYXRlQnV0dG9uKHtcbiAgICBvcHRpb25zLFxuICAgIGJ1dHRvblN0eWxlXG4gIH0pO1xuICBjb25zdCBjb25zb2xlID0gY3JlYXRlQ29uc29sZSh7XG4gICAgY29uc29sZVN0eWxlOiB7XG4gICAgICAuLi5jb25zb2xlU3R5bGUsXG4gICAgICBidG5IZWlnaHQ6IGJ1dHRvblN0eWxlLmhlaWdodCxcbiAgICAgIGJ0blN0YXJ0OiBidXR0b25TdHlsZS5zdGFydFxuICAgIH0sXG4gICAgb3B0aW9uc1xuICB9KTtcblxuICBjb25zb2xlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICB9KTtcblxuICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgaWYgKCFidXR0b24uY29udGFpbnMoY29uc29sZSkpIHtcbiAgICAgIGJ1dHRvbi5hcHBlbmRDaGlsZChjb25zb2xlKTtcbiAgICAgIGNvbnNvbGUuc2Nyb2xsVG9wID0gY29uc29sZS5zY3JvbGxIZWlnaHQgLSBjb25zb2xlLmNsaWVudEhlaWdodDtcbiAgICB9IGVsc2Uge1xuICAgICAgYnV0dG9uLnJlbW92ZUNoaWxkKGNvbnNvbGUpO1xuICAgIH1cbiAgfSk7XG5cbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChidXR0b24pO1xuICBjb25zdCByZWxlYXNlQ29uc29sZSA9IGNhcHR1cmVDb25zb2xlKGNvbnNvbGUsIG9wdGlvbnMpO1xuXG4gIHJldHVybiBmdW5jdGlvbiByZWxlYXNlKCkge1xuICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoYnV0dG9uKTtcbiAgICByZWxlYXNlQ29uc29sZSgpO1xuICB9O1xufVxuIiwiXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0ZW1wbGF0ZShzdHJpbmdzLCAuLi5rZXlzKSB7XG4gIHJldHVybiAoKC4uLnZhbHVlcykgPT4ge1xuICAgIGNvbnN0IGRpY3QgPSB2YWx1ZXNbdmFsdWVzLmxlbmd0aCAtIDFdIHx8IHt9O1xuICAgIGNvbnN0IHJlc3VsdCA9IFtzdHJpbmdzWzBdXTtcbiAgICBrZXlzLmZvckVhY2goKGtleSwgaSkgPT4ge1xuICAgICAgY29uc3QgdmFsdWUgPSBOdW1iZXIuaXNJbnRlZ2VyKGtleSkgPyB2YWx1ZXNba2V5XSA6IGRpY3Rba2V5XTtcbiAgICAgIHJlc3VsdC5wdXNoKHZhbHVlLCBzdHJpbmdzW2kgKyAxXSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdC5qb2luKCcnKTtcbiAgfSk7XG59XG4iLCIvLyBVdGlsc1xuaW1wb3J0IHRlbXBsYXRlIGZyb20gJy4vdXRpbHMvdGVtcGxhdGUnO1xuaW1wb3J0IG9uU2NyZWVuQ29uc29sZSBmcm9tICcuL3V0aWxzL29uU2NyZWVuQ29uc29sZSc7XG5cbi8vIFNlcnZpY2VzXG5pbXBvcnQgbG9jYWxlU2VydmljZSBmcm9tICcuL3NlcnZpY2VzL0xvY2FsZVNlcnZpY2UnO1xuaW1wb3J0IGkxOG5TZXJ2aWNlIGZyb20gJy4vc2VydmljZXMvSTE4blNlcnZpY2UnO1xuXG4vLyBIT0NcbmltcG9ydCBsb2NhbGVBd2FyZSBmcm9tICcuL0hPQy9sb2NhbGVBd2FyZSc7XG5pbXBvcnQgdGhlbWVBd2FyZSBmcm9tICcuL0hPQy90aGVtZUF3YXJlJztcblxuLy8gVGhlbWVcbmltcG9ydCB0aGVtZSBmcm9tICcuL3N0eWxlcy90aGVtZSc7XG5pbXBvcnQgdGhlbWVWYXJzIGZyb20gJy4vc3R5bGVzL3RoZW1lVmFycyc7XG5cbi8vIFRoZW1pbmdcbmltcG9ydCB7IHRoZW1pbmcsIGNyZWF0ZVRoZW1pbmcgfSBmcm9tICcuL3RoZW1pbmcvdGhlbWluZyc7XG5cbi8vIENvbXBvbmVudHNcbmltcG9ydCBIZWxsbyBmcm9tICcuL2NvbXBvbmVudHMvSGVsbG8vSGVsbG8nO1xuaW1wb3J0IExpc3QgZnJvbSAnLi9jb21wb25lbnRzL0xpc3QvTGlzdCc7XG5pbXBvcnQgRm9ybUlucHV0TnVtYmVyIGZyb20gJy4vY29tcG9uZW50cy9Gb3JtSW5wdXROdW1iZXIvRm9ybUlucHV0TnVtYmVyJztcblxuXG5leHBvcnQge1xuICAvLyBVdGlsc1xuICB0ZW1wbGF0ZSxcbiAgb25TY3JlZW5Db25zb2xlLFxuXG4gIC8vIFNlcnZpY2VzXG4gIGxvY2FsZVNlcnZpY2UsXG4gIGkxOG5TZXJ2aWNlLFxuXG4gIC8vIEhPQ1xuICBsb2NhbGVBd2FyZSxcbiAgdGhlbWVBd2FyZSxcblxuICAvLyBUaGVtZVxuICB0aGVtZVZhcnMsXG4gIHRoZW1lLFxuXG4gIC8vIFRoZW1pbmdcbiAgdGhlbWluZyxcbiAgY3JlYXRlVGhlbWluZyxcblxuICAvLyBDb21wb25lbnRzXG4gIEhlbGxvLFxuICBMaXN0LFxuICBGb3JtSW5wdXROdW1iZXJcbn07XG4iXX0=
