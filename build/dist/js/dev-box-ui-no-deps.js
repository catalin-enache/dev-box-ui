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

const commonClasses = commonVars => {
  return Object.assign({}, (0, _grid2.default)(commonVars), (0, _form2.default)(commonVars));
};

exports.default = commonClasses;

},{"./form/form":14,"./grid/grid":15}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = form;


const formInput = commonVars => {
  const {
    dimensions: {
      formInputHeight,
      formInputBorderWidth,
      formInputPaddingStartEnd,
      formInputFontSize
    },
    colors: {
      formInputColor,
      formInputBorderColor,
      formInputBackgroundColor
    }
  } = commonVars;
  return {
    width: '100%',
    height: formInputHeight,
    padding: `0px ${formInputPaddingStartEnd}px`,
    fontSize: formInputFontSize,
    boxSizing: 'border-box',
    color: formInputColor,
    backgroundColor: formInputBackgroundColor,
    borderTop: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    borderBottom: `${formInputBorderWidth}px solid ${formInputBorderColor}`,
    '&:focus': {
      outline: 'none'
    }
  };
};

function form(commonVars) {
  return {
    formInput: formInput(commonVars)
  };
}

},{}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = grid;
function grid(commonVars) {
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
    formInputBorderWidth: 1
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LWljb24tYmFzZS9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVhY3QtaWNvbnMvbGliL2ZhL3NwaW5uZXIuanMiLCJzcmMvbGliL0hPQy9sb2NhbGVBd2FyZS5qcyIsInNyYy9saWIvSE9DL3RoZW1lQXdhcmUuanMiLCJzcmMvbGliL2NvbXBvbmVudHMvRm9ybUlucHV0TnVtYmVyL0Zvcm1JbnB1dE51bWJlci5qcyIsInNyYy9saWIvY29tcG9uZW50cy9IZWxsby9IZWxsby5qcyIsInNyYy9saWIvY29tcG9uZW50cy9MaXN0L0xpc3QuanMiLCJzcmMvbGliL2NvbXBvbmVudHMvV29ybGQvV29ybGQuanMiLCJzcmMvbGliL3NlcnZpY2VzL0kxOG5TZXJ2aWNlLmpzIiwic3JjL2xpYi9zZXJ2aWNlcy9Mb2NhbGVTZXJ2aWNlLmpzIiwic3JjL2xpYi9zdHlsZXMvY29tbW9uQW5pbWF0aW9ucy5qcyIsInNyYy9saWIvc3R5bGVzL2NvbW1vbkNsYXNzZXMuanMiLCJzcmMvbGliL3N0eWxlcy9mb3JtL2Zvcm0uanMiLCJzcmMvbGliL3N0eWxlcy9ncmlkL2dyaWQuanMiLCJzcmMvbGliL3N0eWxlcy90aGVtZS5qcyIsInNyYy9saWIvc3R5bGVzL3RoZW1lVmFycy5qcyIsInNyYy9saWIvdGhlbWluZy90aGVtaW5nLmpzIiwic3JjL2xpYi91dGlscy9vblNjcmVlbkNvbnNvbGUuanMiLCJzcmMvbGliL3V0aWxzL3RlbXBsYXRlLmpzIiwic3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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Q0E7Ozs7QUFHQTs7OztBQUNBOzs7O0FBSUE7Ozs7QUFDQTs7OztBQUlBOztBQUdBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBTkE7OztBQUxBOzs7QUFMQTs7O0FBSkE7QUFKQTtRQTRCRSxRO1FBQ0EsZTtRQUdBLGE7UUFDQSxXO1FBR0EsVztRQUNBLFU7UUFHQSxTO1FBQ0EsSztRQUdBLE87UUFDQSxhO1FBR0EsSztRQUNBLEk7UUFDQSxlOztBQTdCRiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfcHJvcFR5cGVzID0gcmVxdWlyZSgncHJvcC10eXBlcycpO1xuXG52YXIgX3Byb3BUeXBlczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wcm9wVHlwZXMpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMob2JqLCBrZXlzKSB7IHZhciB0YXJnZXQgPSB7fTsgZm9yICh2YXIgaSBpbiBvYmopIHsgaWYgKGtleXMuaW5kZXhPZihpKSA+PSAwKSBjb250aW51ZTsgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBpKSkgY29udGludWU7IHRhcmdldFtpXSA9IG9ialtpXTsgfSByZXR1cm4gdGFyZ2V0OyB9XG5cbnZhciBJY29uQmFzZSA9IGZ1bmN0aW9uIEljb25CYXNlKF9yZWYsIF9yZWYyKSB7XG4gIHZhciBjaGlsZHJlbiA9IF9yZWYuY2hpbGRyZW47XG4gIHZhciBjb2xvciA9IF9yZWYuY29sb3I7XG4gIHZhciBzaXplID0gX3JlZi5zaXplO1xuICB2YXIgc3R5bGUgPSBfcmVmLnN0eWxlO1xuICB2YXIgd2lkdGggPSBfcmVmLndpZHRoO1xuICB2YXIgaGVpZ2h0ID0gX3JlZi5oZWlnaHQ7XG5cbiAgdmFyIHByb3BzID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzKF9yZWYsIFsnY2hpbGRyZW4nLCAnY29sb3InLCAnc2l6ZScsICdzdHlsZScsICd3aWR0aCcsICdoZWlnaHQnXSk7XG5cbiAgdmFyIF9yZWYyJHJlYWN0SWNvbkJhc2UgPSBfcmVmMi5yZWFjdEljb25CYXNlO1xuICB2YXIgcmVhY3RJY29uQmFzZSA9IF9yZWYyJHJlYWN0SWNvbkJhc2UgPT09IHVuZGVmaW5lZCA/IHt9IDogX3JlZjIkcmVhY3RJY29uQmFzZTtcblxuICB2YXIgY29tcHV0ZWRTaXplID0gc2l6ZSB8fCByZWFjdEljb25CYXNlLnNpemUgfHwgJzFlbSc7XG4gIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudCgnc3ZnJywgX2V4dGVuZHMoe1xuICAgIGNoaWxkcmVuOiBjaGlsZHJlbixcbiAgICBmaWxsOiAnY3VycmVudENvbG9yJyxcbiAgICBwcmVzZXJ2ZUFzcGVjdFJhdGlvOiAneE1pZFlNaWQgbWVldCcsXG4gICAgaGVpZ2h0OiBoZWlnaHQgfHwgY29tcHV0ZWRTaXplLFxuICAgIHdpZHRoOiB3aWR0aCB8fCBjb21wdXRlZFNpemVcbiAgfSwgcmVhY3RJY29uQmFzZSwgcHJvcHMsIHtcbiAgICBzdHlsZTogX2V4dGVuZHMoe1xuICAgICAgdmVydGljYWxBbGlnbjogJ21pZGRsZScsXG4gICAgICBjb2xvcjogY29sb3IgfHwgcmVhY3RJY29uQmFzZS5jb2xvclxuICAgIH0sIHJlYWN0SWNvbkJhc2Uuc3R5bGUgfHwge30sIHN0eWxlKVxuICB9KSk7XG59O1xuXG5JY29uQmFzZS5wcm9wVHlwZXMgPSB7XG4gIGNvbG9yOiBfcHJvcFR5cGVzMi5kZWZhdWx0LnN0cmluZyxcbiAgc2l6ZTogX3Byb3BUeXBlczIuZGVmYXVsdC5vbmVPZlR5cGUoW19wcm9wVHlwZXMyLmRlZmF1bHQuc3RyaW5nLCBfcHJvcFR5cGVzMi5kZWZhdWx0Lm51bWJlcl0pLFxuICB3aWR0aDogX3Byb3BUeXBlczIuZGVmYXVsdC5vbmVPZlR5cGUoW19wcm9wVHlwZXMyLmRlZmF1bHQuc3RyaW5nLCBfcHJvcFR5cGVzMi5kZWZhdWx0Lm51bWJlcl0pLFxuICBoZWlnaHQ6IF9wcm9wVHlwZXMyLmRlZmF1bHQub25lT2ZUeXBlKFtfcHJvcFR5cGVzMi5kZWZhdWx0LnN0cmluZywgX3Byb3BUeXBlczIuZGVmYXVsdC5udW1iZXJdKSxcbiAgc3R5bGU6IF9wcm9wVHlwZXMyLmRlZmF1bHQub2JqZWN0XG59O1xuXG5JY29uQmFzZS5jb250ZXh0VHlwZXMgPSB7XG4gIHJlYWN0SWNvbkJhc2U6IF9wcm9wVHlwZXMyLmRlZmF1bHQuc2hhcGUoSWNvbkJhc2UucHJvcFR5cGVzKVxufTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gSWNvbkJhc2U7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxudmFyIF9yZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX3JlYWN0SWNvbkJhc2UgPSByZXF1aXJlKCdyZWFjdC1pY29uLWJhc2UnKTtcblxudmFyIF9yZWFjdEljb25CYXNlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0SWNvbkJhc2UpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgRmFTcGlubmVyID0gZnVuY3Rpb24gRmFTcGlubmVyKHByb3BzKSB7XG4gICAgcmV0dXJuIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICBfcmVhY3RJY29uQmFzZTIuZGVmYXVsdCxcbiAgICAgICAgX2V4dGVuZHMoeyB2aWV3Qm94OiAnMCAwIDQwIDQwJyB9LCBwcm9wcyksXG4gICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgJ2cnLFxuICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KCdwYXRoJywgeyBkOiAnbTExLjcgMzEuMXEwIDEuMi0wLjggMnQtMiAwLjlxLTEuMiAwLTItMC45dC0wLjktMnEwLTEuMiAwLjktMnQyLTAuOCAyIDAuOCAwLjggMnogbTExLjIgNC42cTAgMS4yLTAuOSAydC0yIDAuOS0yLTAuOS0wLjktMiAwLjktMiAyLTAuOCAyIDAuOCAwLjkgMnogbS0xNS44LTE1LjdxMCAxLjItMC44IDJ0LTIgMC45LTItMC45LTAuOS0yIDAuOS0yIDItMC45IDIgMC45IDAuOCAyeiBtMjYuOSAxMS4xcTAgMS4yLTAuOSAydC0yIDAuOXEtMS4yIDAtMi0wLjl0LTAuOC0yIDAuOC0yIDItMC44IDIgMC44IDAuOSAyeiBtLTIxLjUtMjIuMnEwIDEuNS0xLjEgMi41dC0yLjUgMS4xLTIuNS0xLjEtMS4xLTIuNSAxLjEtMi41IDIuNS0xLjEgMi41IDEuMSAxLjEgMi41eiBtMjYuMSAxMS4xcTAgMS4yLTAuOSAydC0yIDAuOS0yLTAuOS0wLjgtMiAwLjgtMiAyLTAuOSAyIDAuOSAwLjkgMnogbS0xNC4zLTE1LjdxMCAxLjgtMS4zIDN0LTMgMS4zLTMtMS4zLTEuMy0zIDEuMy0zLjEgMy0xLjIgMyAxLjMgMS4zIDN6IG0xMS44IDQuNnEwIDIuMS0xLjUgMy41dC0zLjUgMS41cS0yLjEgMC0zLjUtMS41dC0xLjUtMy41cTAtMi4xIDEuNS0zLjV0My41LTEuNXEyLjEgMCAzLjUgMS41dDEuNSAzLjV6JyB9KVxuICAgICAgICApXG4gICAgKTtcbn07XG5cbmV4cG9ydHMuZGVmYXVsdCA9IEZhU3Bpbm5lcjtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgaG9pc3ROb25SZWFjdFN0YXRpY3MgZnJvbSAnaG9pc3Qtbm9uLXJlYWN0LXN0YXRpY3MnO1xuaW1wb3J0IGxvY2FsZVNlcnZpY2UgZnJvbSAnLi8uLi9zZXJ2aWNlcy9Mb2NhbGVTZXJ2aWNlJztcbmltcG9ydCBpMThuU2VydmljZSBmcm9tICcuLy4uL3NlcnZpY2VzL0kxOG5TZXJ2aWNlJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbG9jYWxlQXdhcmUoQ29tcG9uZW50KSB7XG4gIGNsYXNzIExvY2FsZUF3YXJlIGV4dGVuZHMgUmVhY3QuUHVyZUNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMsIGNvbnRleHQpIHtcbiAgICAgIHN1cGVyKHByb3BzLCBjb250ZXh0KTtcbiAgICAgIHRoaXMuaGFuZGxlTG9jYWxlQ2hhbmdlID0gdGhpcy5oYW5kbGVMb2NhbGVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgICAgIHRoaXMudW5yZWdpc3RlckxvY2FsZUNoYW5nZSA9IG51bGw7XG4gICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICBsb2NhbGU6IGxvY2FsZVNlcnZpY2UubG9jYWxlXG4gICAgICB9O1xuICAgICAgdGhpcy5fbW91bnRlZCA9IGZhbHNlO1xuICAgICAgdGhpcy5fY29tcG9uZW50ID0gbnVsbDtcbiAgICB9XG5cbiAgICBoYW5kbGVMb2NhbGVDaGFuZ2UobG9jYWxlKSB7XG4gICAgICB0aGlzLl9tb3VudGVkICYmIHRoaXMuc3RhdGUubG9jYWxlICE9PSBsb2NhbGUgJiYgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGxvY2FsZVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICB0aGlzLnVucmVnaXN0ZXJMb2NhbGVDaGFuZ2UgPSBsb2NhbGVTZXJ2aWNlLm9uTG9jYWxlQ2hhbmdlKHRoaXMuaGFuZGxlTG9jYWxlQ2hhbmdlKTtcbiAgICAgIHRoaXMuX21vdW50ZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgICAgdGhpcy5fbW91bnRlZCA9IGZhbHNlO1xuICAgICAgdGhpcy51bnJlZ2lzdGVyTG9jYWxlQ2hhbmdlKCk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgY29uc3QgeyBsb2NhbGUgfSA9IHRoaXMuc3RhdGU7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8Q29tcG9uZW50IHsgLi4udGhpcy5wcm9wcyB9XG4gICAgICAgICAgbG9jYWxlPXsgbG9jYWxlIH1cbiAgICAgICAgICB0cmFuc2xhdGlvbnM9eyBpMThuU2VydmljZS5jdXJyZW50TGFuZ1RyYW5zbGF0aW9ucyB9XG4gICAgICAgICAgcmVmPXsgY29tcCA9PiB0aGlzLl9jb21wb25lbnQgPSBjb21wIH1cbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgTG9jYWxlQXdhcmUuZGlzcGxheU5hbWUgPSBgTG9jYWxlQXdhcmUoJHtcbiAgICBDb21wb25lbnQuZGlzcGxheU5hbWUgfHxcbiAgICBDb21wb25lbnQubmFtZSB8fFxuICAgICdDb21wb25lbnQnXG4gIH0pYDtcblxuICByZXR1cm4gaG9pc3ROb25SZWFjdFN0YXRpY3MoTG9jYWxlQXdhcmUsIENvbXBvbmVudCk7XG59XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IGluamVjdFNoZWV0IGZyb20gJ3JlYWN0LWpzcyc7XG5pbXBvcnQgaG9pc3ROb25SZWFjdFN0YXRpY3MgZnJvbSAnaG9pc3Qtbm9uLXJlYWN0LXN0YXRpY3MnO1xuaW1wb3J0IHsgdGhlbWluZyB9IGZyb20gJy4uL3RoZW1pbmcvdGhlbWluZyc7XG5cblxuY29uc3QgeyBUaGVtZVByb3ZpZGVyIH0gPSB0aGVtaW5nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0aGVtZUF3YXJlKHsgdGhlbWUsIHN0eWxlIH0pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHRoZW1lQXdhcmVJbm5lcihDb21wb25lbnQpIHtcbiAgICBjb25zdCBUb1JlbmRlciA9IHN0eWxlID8gaW5qZWN0U2hlZXQoc3R5bGUsIHsgdGhlbWluZyB9KShDb21wb25lbnQpIDogQ29tcG9uZW50O1xuXG4gICAgY2xhc3MgVGhlbWVBd2FyZSBleHRlbmRzIFJlYWN0LlB1cmVDb21wb25lbnQge1xuICAgICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIHRoZW1lID9cbiAgICAgICAgICAgIDxUaGVtZVByb3ZpZGVyIHRoZW1lPXsgdGhlbWUgfT5cbiAgICAgICAgICAgICAgPFRvUmVuZGVyIHsgLi4udGhpcy5wcm9wcyB9IC8+XG4gICAgICAgICAgICA8L1RoZW1lUHJvdmlkZXI+IDpcbiAgICAgICAgICAgIDxUb1JlbmRlciB7IC4uLnRoaXMucHJvcHMgfSAvPlxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIFRoZW1lQXdhcmUuZGlzcGxheU5hbWUgPSBgVGhlbWVBd2FyZSgke1xuICAgICAgQ29tcG9uZW50LmRpc3BsYXlOYW1lIHx8XG4gICAgICBDb21wb25lbnQubmFtZSB8fFxuICAgICAgJ0NvbXBvbmVudCdcbiAgICB9KWA7XG5cbiAgICByZXR1cm4gaG9pc3ROb25SZWFjdFN0YXRpY3MoVGhlbWVBd2FyZSwgQ29tcG9uZW50KTtcbiAgfTtcbn1cbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHRoZW1lQXdhcmUgZnJvbSAnLi4vLi4vSE9DL3RoZW1lQXdhcmUnO1xuaW1wb3J0IGxvY2FsZUF3YXJlIGZyb20gJy4uLy4uL0hPQy9sb2NhbGVBd2FyZSc7XG5cbmNvbnN0IHN0eWxlID0gKHsgdmFycyB9KSA9PiB7XG4gIHJldHVybiB7XG4gICAgaGVsbG86IHtcbiAgICAgIGNvbG9yOiB2YXJzLmNvbG9ycy5wcmltYXJ5Q29sb3IgfHwgJ29yYW5nZSdcbiAgICB9XG4gIH07XG59O1xuXG5jbGFzcyBGb3JtSW5wdXROdW1iZXIgZXh0ZW5kcyBSZWFjdC5QdXJlQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHZhbHVlOiBwcm9wcy52YWx1ZSB8fCAwXG4gICAgfTtcbiAgICB0aGlzLmhhbmRsZUNoYW5nZSA9IHRoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyk7XG4gIH1cblxuICBoYW5kbGVDaGFuZ2UoZXZ0KSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB2YWx1ZTogZXZ0LnRhcmdldC52YWx1ZVxuICAgIH0pO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgdGhlbWUsIGNsYXNzZXMsIG5hbWUgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc29sZS5sb2coJ0Zvcm1JbnB1dE51bWJlcicsIHsgdGhlbWUgfSk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxpbnB1dCBjbGFzc05hbWU9eyB0aGVtZS5jb21tb24uZm9ybUlucHV0IH0gbmFtZT17bmFtZX0gdHlwZT1cInRleHRcIiB2YWx1ZT17dGhpcy5zdGF0ZS52YWx1ZX0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfSAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5Gb3JtSW5wdXROdW1iZXIucHJvcFR5cGVzID0ge1xuICB2YWx1ZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgdGhlbWU6IFByb3BUeXBlcy5vYmplY3QsXG4gIG5hbWU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgY2xhc3NlczogUHJvcFR5cGVzLm9iamVjdFxufTtcblxuZXhwb3J0IGRlZmF1bHQgdGhlbWVBd2FyZSh7IHN0eWxlIH0pKGxvY2FsZUF3YXJlKEZvcm1JbnB1dE51bWJlcikpO1xuXG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBGYVNwaW5uZXIgZnJvbSAncmVhY3QtaWNvbnMvbGliL2ZhL3NwaW5uZXInO1xuaW1wb3J0IExpc3QgZnJvbSAnLi4vTGlzdC9MaXN0JztcbmltcG9ydCBXb3JsZCBmcm9tICcuLi9Xb3JsZC9Xb3JsZCc7XG5pbXBvcnQgdGhlbWVBd2FyZSBmcm9tICcuLi8uLi9IT0MvdGhlbWVBd2FyZSc7XG5pbXBvcnQgbG9jYWxlQXdhcmUgZnJvbSAnLi4vLi4vSE9DL2xvY2FsZUF3YXJlJztcbmltcG9ydCBpMThuU2VydmljZSBmcm9tICcuLy4uLy4uL3NlcnZpY2VzL0kxOG5TZXJ2aWNlJztcbmltcG9ydCB0ZW1wbGF0ZSBmcm9tICcuLi8uLi91dGlscy90ZW1wbGF0ZSc7XG5cbmkxOG5TZXJ2aWNlLnJlZ2lzdGVyVHJhbnNsYXRpb25zKHtcbiAgZW46IHtcbiAgICAnSGVsbG8nOiB0ZW1wbGF0ZWBIZWxsbyAkeydhZ2UnfSAkeyduYW1lJ31gXG4gIH0sXG4gIHNwOiB7XG4gICAgJ0hlbGxvJzogdGVtcGxhdGVgSG9sYSAkeydhZ2UnfSAkeyduYW1lJ31gXG4gIH1cbn0pO1xuXG5jb25zdCBsaXN0SXRlbXMgPSBbJ29uZScsICd0d28nXTtcblxuXG5jb25zdCBzdHlsZSA9ICh7IHZhcnMgfSkgPT4ge1xuICByZXR1cm4ge1xuICAgIGhlbGxvOiB7XG4gICAgICBjb2xvcjogdmFycy5jb2xvcnMucHJpbWFyeUNvbG9yIHx8ICdvcmFuZ2UnXG4gICAgfVxuICB9O1xufTtcblxuY2xhc3MgSGVsbG8gZXh0ZW5kcyBSZWFjdC5QdXJlQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgdGhlbWUsIHRyYW5zbGF0aW9ucyB9ID0gdGhpcy5wcm9wcztcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgLyogZXNsaW50IG5vLWNvbnNvbGU6IDAgKi9cbiAgICAgIC8vIGNvbnNvbGUubG9nKCdyZW5kZXJpbmcgSGVsbG8gY29tcG9uZW50Jyk7XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17IHRoaXMucHJvcHMuY2xhc3Nlcy5oZWxsbyB9PlxuICAgICAgICB7dHJhbnNsYXRpb25zLkhlbGxvKHsgYWdlOiAyMiwgbmFtZTogdGhpcy5wcm9wcy5uYW1lIHx8ICdOb2JvZHknIH0pfVxuICAgICAgICA8RmFTcGlubmVyIGNsYXNzTmFtZT17IHRoZW1lLmFuaW1hdGlvbnMuZGJ1QW5pbWF0aW9uU3BpbiB9Lz5cbiAgICAgICAgPExpc3QgaXRlbXM9eyBsaXN0SXRlbXMgfS8+XG4gICAgICAgIDxMaXN0IGl0ZW1zPXsgbGlzdEl0ZW1zIH0vPlxuICAgICAgICA8V29ybGQgLz5cbiAgICAgICAgPFdvcmxkIC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbkhlbGxvLnByb3BUeXBlcyA9IHtcbiAgdHJhbnNsYXRpb25zOiBQcm9wVHlwZXMub2JqZWN0LFxuICB0aGVtZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgbmFtZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBjbGFzc2VzOiBQcm9wVHlwZXMub2JqZWN0XG59O1xuXG5leHBvcnQgZGVmYXVsdCB0aGVtZUF3YXJlKHsgc3R5bGUgfSkobG9jYWxlQXdhcmUoSGVsbG8pKTtcblxuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgY29sb3IgZnJvbSAnY29sb3InO1xuaW1wb3J0IHRoZW1lQXdhcmUgZnJvbSAnLi4vLi4vSE9DL3RoZW1lQXdhcmUnO1xuaW1wb3J0IGxvY2FsZUF3YXJlIGZyb20gJy4uLy4uL0hPQy9sb2NhbGVBd2FyZSc7XG5pbXBvcnQgaTE4blNlcnZpY2UgZnJvbSAnLi8uLi8uLi9zZXJ2aWNlcy9JMThuU2VydmljZSc7XG5pbXBvcnQgbG9jYWxlU2VydmljZSBmcm9tICcuLy4uLy4uL3NlcnZpY2VzL0xvY2FsZVNlcnZpY2UnO1xuaW1wb3J0IHRlbXBsYXRlIGZyb20gJy4uLy4uL3V0aWxzL3RlbXBsYXRlJztcblxuaTE4blNlcnZpY2UucmVnaXN0ZXJUcmFuc2xhdGlvbnMoe1xuICBlbjoge1xuICAgICdsaXN0JzogdGVtcGxhdGVgbGlzdGBcbiAgfSxcbiAgc3A6IHtcbiAgICAnbGlzdCc6IHRlbXBsYXRlYGxpc3RhYFxuICB9XG59KTtcblxuY29uc3Qgc3R5bGUgPSAoeyB2YXJzIH0pID0+IHtcbiAgcmV0dXJuIHtcbiAgICBsaXN0OiB7XG4gICAgICAvLyBjb2xvcjogY29sb3IodmFycy5jb2xvcnMuc2Vjb25kYXJ5Q29sb3IgfHwgJ29yYW5nZScpLmxpZ2h0ZW4oMC41KS5oZXgoKVxuICAgICAgY29sb3I6IHZhcnMuZGlyID09PSAnbHRyJyA/ICdncmVlbicgOiAncmVkJ1xuICAgIH1cbiAgfTtcbn07XG5cbmNsYXNzIExpc3QgZXh0ZW5kcyBSZWFjdC5QdXJlQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAvKiBlc2xpbnQgbm8tY29uc29sZTogMCAqL1xuICAgICAgLy8gY29uc29sZS5sb2coJ3JlbmRlcmluZyBMaXN0IGNvbXBvbmVudCcpO1xuICAgIH1cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAge3RoaXMucHJvcHMudHJhbnNsYXRpb25zLmxpc3QoKX1cbiAgICAgICAgPHVsIGNsYXNzTmFtZT17dGhpcy5wcm9wcy5jbGFzc2VzLmxpc3R9PlxuICAgICAgICAgIHt0aGlzLnByb3BzLml0ZW1zLm1hcChpdGVtID0+IDxsaSBrZXk9e2l0ZW19PntpdGVtfTwvbGk+KX1cbiAgICAgICAgPC91bD5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuTGlzdC5kZWZhdWx0UHJvcHMgPSB7XG4gIGl0ZW1zOiBbXVxufTtcblxuTGlzdC5wcm9wVHlwZXMgPSB7XG4gIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXksXG4gIGNsYXNzZXM6IFByb3BUeXBlcy5vYmplY3Rcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHRoZW1lQXdhcmUoeyBzdHlsZSB9KShsb2NhbGVBd2FyZShMaXN0KSk7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBMaXN0IGZyb20gJy4uL0xpc3QvTGlzdCc7XG5pbXBvcnQgdGhlbWVBd2FyZSBmcm9tICcuLi8uLi9IT0MvdGhlbWVBd2FyZSc7XG5cbmNvbnN0IHN0eWxlID0gKHsgdmFycyB9KSA9PiB7XG4gIHJldHVybiB7XG4gICAgd29ybGQ6IHtcbiAgICAgIGNvbG9yOiB2YXJzLmNvbG9ycy5wcmltYXJ5Q29sb3IgfHwgJ29yYW5nZSdcbiAgICB9XG4gIH07XG59O1xuXG5jbGFzcyBXb3JsZCBleHRlbmRzIFJlYWN0LlB1cmVDb21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIC8qIGVzbGludCBuby1jb25zb2xlOiAwICovXG4gICAgICAvLyBjb25zb2xlLmxvZygncmVuZGVyaW5nIEhlbGxvIGNvbXBvbmVudCcpO1xuICAgIH1cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e3RoaXMucHJvcHMuY2xhc3Nlcy5oZWxsb30+XG4gICAgICAgIFdvcmxkIC0tLS0tLS0tLS0tLVxuICAgICAgICA8TGlzdCBpdGVtcz17WydmaXZlJywgJ3NpeCddfS8+XG4gICAgICAgIDxMaXN0IGl0ZW1zPXtbJ2ZpdmUnLCAnc2l4J119Lz5cbiAgICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbldvcmxkLnByb3BUeXBlcyA9IHtcbiAgY2xhc3NlczogUHJvcFR5cGVzLm9iamVjdFxufTtcblxuZXhwb3J0IGRlZmF1bHQgdGhlbWVBd2FyZSh7IHN0eWxlIH0pKFdvcmxkKTtcblxuIiwiaW1wb3J0IGxvY2FsZVNlcnZpY2UgZnJvbSAnLi9Mb2NhbGVTZXJ2aWNlJztcblxuY29uc3QgZW1wdHlPYmogPSB7fTtcblxuY2xhc3MgSTE4blNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBsb2NhbGVTZXJ2aWNlLm9uTG9jYWxlQ2hhbmdlKHRoaXMuX2hhbmRsZUxvY2FsZUNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLl9sb2NhbGUgPSBsb2NhbGVTZXJ2aWNlLmxvY2FsZTtcbiAgICB0aGlzLl90cmFuc2xhdGlvbnMgPSB7fTtcbiAgfVxuXG4gIF9oYW5kbGVMb2NhbGVDaGFuZ2UobG9jYWxlKSB7XG4gICAgdGhpcy5fbG9jYWxlID0gbG9jYWxlO1xuICB9XG5cbiAgY2xlYXJUcmFuc2xhdGlvbnMobGFuZykge1xuICAgIGRlbGV0ZSB0aGlzLl90cmFuc2xhdGlvbnNbbGFuZ107XG4gIH1cblxuICByZWdpc3RlclRyYW5zbGF0aW9ucyh0cmFuc2xhdGlvbnMpIHtcbiAgICB0aGlzLl90cmFuc2xhdGlvbnMgPSBPYmplY3Qua2V5cyh0cmFuc2xhdGlvbnMpLnJlZHVjZSgoYWNjLCBsYW5nKSA9PiB7XG4gICAgICBhY2NbbGFuZ10gPSB7XG4gICAgICAgIC4uLnRoaXMuX3RyYW5zbGF0aW9uc1tsYW5nXSxcbiAgICAgICAgLi4udHJhbnNsYXRpb25zW2xhbmddXG4gICAgICB9O1xuICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCB0aGlzLl90cmFuc2xhdGlvbnMpO1xuICB9XG5cbiAgdHJhbnNsYXRlKG1zZykge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnRMYW5nVHJhbnNsYXRpb25zW21zZ107XG4gIH1cblxuICBnZXQgdHJhbnNsYXRpb25zKCkge1xuICAgIHJldHVybiB0aGlzLl90cmFuc2xhdGlvbnM7XG4gIH1cblxuICBnZXQgY3VycmVudExhbmdUcmFuc2xhdGlvbnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RyYW5zbGF0aW9uc1t0aGlzLl9sb2NhbGUubGFuZ10gfHwgZW1wdHlPYmo7XG4gIH1cbn1cblxuY29uc3QgaTE4blNlcnZpY2UgPSBuZXcgSTE4blNlcnZpY2UoKTtcbmV4cG9ydCBkZWZhdWx0IGkxOG5TZXJ2aWNlO1xuIiwiXG5jb25zdCBkZWZhdWx0TG9jYWxlID0ge1xuICBkaXI6ICdsdHInLFxuICBsYW5nOiAnZW4nXG59O1xuXG5jbGFzcyBMb2NhbGVTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fY2FsbGJhY2tzID0gW107XG4gICAgdGhpcy5fbG9jYWxlQXR0cnMgPSBPYmplY3Qua2V5cyhkZWZhdWx0TG9jYWxlKTtcbiAgICB0aGlzLl9yb290RWxlbWVudCA9IHdpbmRvdy5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgdGhpcy5fbG9jYWxlQXR0cnMuZm9yRWFjaCgoYXR0cikgPT4ge1xuICAgICAgaWYgKCF0aGlzLl9yb290RWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cikpIHtcbiAgICAgICAgdGhpcy5fcm9vdEVsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHIsIGRlZmF1bHRMb2NhbGVbYXR0cl0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuX2xvY2FsZSA9IHRoaXMuX2xvY2FsZUF0dHJzLnJlZHVjZSgoYWNjLCBhdHRyKSA9PiB7XG4gICAgICBhY2NbYXR0cl0gPSB0aGlzLl9yb290RWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cik7XG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHt9KTtcbiAgICB0aGlzLl9vYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMuX2hhbmRsZU11dGF0aW9ucy5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLl9vYnNlcnZlci5vYnNlcnZlKHRoaXMuX3Jvb3RFbGVtZW50LCB7XG4gICAgICBhdHRyaWJ1dGVzOiB0cnVlXG4gICAgfSk7XG4gIH1cblxuICBfaGFuZGxlTXV0YXRpb25zKG11dGF0aW9ucykge1xuICAgIG11dGF0aW9ucy5mb3JFYWNoKChtdXRhdGlvbikgPT4ge1xuICAgICAgY29uc3QgbXV0YXRpb25BdHRyaWJ1dGVOYW1lID0gbXV0YXRpb24uYXR0cmlidXRlTmFtZTtcbiAgICAgIGlmICh0aGlzLl9sb2NhbGVBdHRycy5pbmNsdWRlcyhtdXRhdGlvbkF0dHJpYnV0ZU5hbWUpKSB7XG4gICAgICAgIHRoaXMuX2xvY2FsZSA9IHtcbiAgICAgICAgICAuLi50aGlzLl9sb2NhbGUsXG4gICAgICAgICAgW211dGF0aW9uQXR0cmlidXRlTmFtZV06IHRoaXMuX3Jvb3RFbGVtZW50LmdldEF0dHJpYnV0ZShtdXRhdGlvbkF0dHJpYnV0ZU5hbWUpXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX2NhbGxiYWNrcy5mb3JFYWNoKGNhbGxiYWNrID0+IGNhbGxiYWNrKHRoaXMuX2xvY2FsZSkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc2V0IGxvY2FsZShsb2NhbGVPYmopIHtcbiAgICBPYmplY3Qua2V5cyhsb2NhbGVPYmopLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgdGhpcy5fcm9vdEVsZW1lbnQuc2V0QXR0cmlidXRlKGtleSwgbG9jYWxlT2JqW2tleV0pO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0IGxvY2FsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fbG9jYWxlO1xuICB9XG5cbiAgb25Mb2NhbGVDaGFuZ2UoY2FsbGJhY2spIHtcbiAgICB0aGlzLl9jYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG4gICAgY2FsbGJhY2sodGhpcy5sb2NhbGUpO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MuZmlsdGVyKGNiID0+IGNiICE9PSBjYWxsYmFjayk7XG4gICAgfTtcbiAgfVxufVxuXG5jb25zdCBsb2NhbGVTZXJ2aWNlID0gbmV3IExvY2FsZVNlcnZpY2UoKTtcbmV4cG9ydCBkZWZhdWx0IGxvY2FsZVNlcnZpY2U7XG4iLCJjb25zdCBjb21tb25BbmltYXRpb25zID0gKGNvbW1vblZhcnMpID0+IHtcbiAgY29uc3QgeyBkaXIgfSA9IGNvbW1vblZhcnM7XG4gIHJldHVybiB7XG4gICAgW2BAa2V5ZnJhbWVzIGRidUFuaW1hdGlvblNwaW5fJHtkaXJ9YF06IHtcbiAgICAgICcwJSc6IHtcbiAgICAgICAgdHJhbnNmb3JtOiAncm90YXRlKDBkZWcpJ1xuICAgICAgfSxcbiAgICAgICcxMDAlJzoge1xuICAgICAgICB0cmFuc2Zvcm06IGRpciA9PT0gJ2x0cicgPyAncm90YXRlKDM1OWRlZyknIDogJ3JvdGF0ZSgtMzU5ZGVnKSdcbiAgICAgIH1cbiAgICB9LFxuICAgIGRidUFuaW1hdGlvblNwaW46IHtcbiAgICAgIGFuaW1hdGlvbjogYGRidUFuaW1hdGlvblNwaW5fJHtkaXJ9IDJzIGluZmluaXRlIGxpbmVhcmAsXG4gICAgICBhbmltYXRpb25OYW1lOiBgZGJ1QW5pbWF0aW9uU3Bpbl8ke2Rpcn1gLFxuICAgICAgYW5pbWF0aW9uRHVyYXRpb246ICcycycsXG4gICAgICBhbmltYXRpb25UaW1pbmdGdW5jdGlvbjogJ2xpbmVhcicsXG4gICAgICBhbmltYXRpb25EZWxheTogJ2luaXRpYWwnLFxuICAgICAgYW5pbWF0aW9uSXRlcmF0aW9uQ291bnQ6ICdpbmZpbml0ZScsXG4gICAgICBhbmltYXRpb25EaXJlY3Rpb246ICdpbml0aWFsJyxcbiAgICAgIGFuaW1hdGlvbkZpbGxNb2RlOiAnaW5pdGlhbCcsXG4gICAgICBhbmltYXRpb25QbGF5U3RhdGU6ICdpbml0aWFsJ1xuICAgIH1cbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbW1vbkFuaW1hdGlvbnM7XG4iLCJpbXBvcnQgZ3JpZCBmcm9tICcuL2dyaWQvZ3JpZCc7XG5pbXBvcnQgZm9ybSBmcm9tICcuL2Zvcm0vZm9ybSc7XG5cbmNvbnN0IGNvbW1vbkNsYXNzZXMgPSAoY29tbW9uVmFycykgPT4ge1xuICByZXR1cm4ge1xuICAgIC4uLmdyaWQoY29tbW9uVmFycyksXG4gICAgLi4uZm9ybShjb21tb25WYXJzKVxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY29tbW9uQ2xhc3NlcztcbiIsIlxuXG5jb25zdCBmb3JtSW5wdXQgPSAoY29tbW9uVmFycykgPT4ge1xuICBjb25zdCB7XG4gICAgZGltZW5zaW9uczoge1xuICAgICAgZm9ybUlucHV0SGVpZ2h0LFxuICAgICAgZm9ybUlucHV0Qm9yZGVyV2lkdGgsXG4gICAgICBmb3JtSW5wdXRQYWRkaW5nU3RhcnRFbmQsXG4gICAgICBmb3JtSW5wdXRGb250U2l6ZVxuICAgIH0sXG4gICAgY29sb3JzOiB7XG4gICAgICBmb3JtSW5wdXRDb2xvcixcbiAgICAgIGZvcm1JbnB1dEJvcmRlckNvbG9yLFxuICAgICAgZm9ybUlucHV0QmFja2dyb3VuZENvbG9yXG4gICAgfVxuICB9ID0gY29tbW9uVmFycztcbiAgcmV0dXJuIHtcbiAgICB3aWR0aDogJzEwMCUnLFxuICAgIGhlaWdodDogZm9ybUlucHV0SGVpZ2h0LFxuICAgIHBhZGRpbmc6IGAwcHggJHtmb3JtSW5wdXRQYWRkaW5nU3RhcnRFbmR9cHhgLFxuICAgIGZvbnRTaXplOiBmb3JtSW5wdXRGb250U2l6ZSxcbiAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcbiAgICBjb2xvcjogZm9ybUlucHV0Q29sb3IsXG4gICAgYmFja2dyb3VuZENvbG9yOiBmb3JtSW5wdXRCYWNrZ3JvdW5kQ29sb3IsXG4gICAgYm9yZGVyVG9wOiAnbm9uZScsXG4gICAgYm9yZGVyTGVmdDogJ25vbmUnLFxuICAgIGJvcmRlclJpZ2h0OiAnbm9uZScsXG4gICAgYm9yZGVyQm90dG9tOiBgJHtmb3JtSW5wdXRCb3JkZXJXaWR0aH1weCBzb2xpZCAke2Zvcm1JbnB1dEJvcmRlckNvbG9yfWAsXG4gICAgJyY6Zm9jdXMnOiB7XG4gICAgICBvdXRsaW5lOiAnbm9uZSdcbiAgICB9XG4gIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBmb3JtKGNvbW1vblZhcnMpIHtcbiAgcmV0dXJuIHtcbiAgICBmb3JtSW5wdXQ6IGZvcm1JbnB1dChjb21tb25WYXJzKVxuICB9O1xufVxuIiwiXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBncmlkKGNvbW1vblZhcnMpIHtcbiAgY29uc3QgeyBkaXIsIGdyaWQ6IHsgY29scywgYnJlYWtwb2ludHMgfSB9ID0gY29tbW9uVmFycztcbiAgY29uc3Qgc3RhcnQgPSBkaXIgPT09ICdsdHInID8gJ2xlZnQnIDogJ3JpZ2h0JztcbiAgLyogIGVzbGludCBuby11bnVzZWQtdmFyczogMCAqL1xuICBjb25zdCBlbmQgPSBkaXIgPT09ICdsdHInID8gJ3JpZ2h0JyA6ICdsZWZ0JztcblxuICByZXR1cm4ge1xuICAgIGNsZWFyZml4OiB7XG4gICAgICB6b29tOiAxLFxuICAgICAgJyY6YmVmb3JlLCAmOmFmdGVyJzoge1xuICAgICAgICBjb250ZW50OiAnXCJcIicsXG4gICAgICAgIGRpc3BsYXk6ICd0YWJsZSdcbiAgICAgIH0sXG4gICAgICAnJjphZnRlcic6IHtcbiAgICAgICAgY2xlYXI6ICdib3RoJ1xuICAgICAgfVxuICAgIH0sXG4gICAgcm93OiB7XG4gICAgICBleHRlbmQ6ICdjbGVhcmZpeCdcbiAgICB9LFxuICAgIGNvbDoge1xuICAgICAgZmxvYXQ6IHN0YXJ0LFxuICAgICAgdGV4dEFsaWduOiBzdGFydCxcbiAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICB9LFxuICAgIC4uLk9iamVjdC5rZXlzKGJyZWFrcG9pbnRzKS5yZWR1Y2UoKGFjYywga2V5KSA9PiB7XG4gICAgICByZXR1cm4gQXJyYXkuZnJvbSh7IGxlbmd0aDogY29scyB9KVxuICAgICAgICAubWFwKChlbCwgaSkgPT4gaSArIDEpXG4gICAgICAgIC5yZWR1Y2UoKGFjYywgaSkgPT4ge1xuICAgICAgICAgIGFjY1tgJHtrZXl9JHtpfWBdID0ge1xuICAgICAgICAgICAgW2BAbWVkaWEgKG1pbi13aWR0aDogJHticmVha3BvaW50c1trZXldfSlgXToge1xuICAgICAgICAgICAgICB3aWR0aDogYCR7KGkgLyBjb2xzKSAqIDEwMH0lYFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfSwgYWNjKTtcbiAgICB9LCB7fSlcbiAgfTtcbn1cbiIsImltcG9ydCB7IGpzcyB9IGZyb20gJ3JlYWN0LWpzcyc7XG5pbXBvcnQgY29tbW9uQW5pbWF0aW9ucyBmcm9tICcuL2NvbW1vbkFuaW1hdGlvbnMnO1xuaW1wb3J0IGNvbW1vbkNsYXNzZXMgZnJvbSAnLi9jb21tb25DbGFzc2VzJztcblxuY29uc3QgdGhlbWUgPSAodGhlbWVWYXJzKSA9PiBbJ2x0cicsICdydGwnXS5yZWR1Y2UoKGFjYywgZGlyKSA9PiB7XG4gIGNvbnN0IHRoZW1lVmFyc0RpciA9IHRoZW1lVmFycyhkaXIpO1xuXG4gIGNvbnN0IGNvbW1vbkFuaW1hdGlvbnNEaXIgPSBqc3MuY3JlYXRlU3R5bGVTaGVldChcbiAgICBjb21tb25BbmltYXRpb25zKHRoZW1lVmFyc0RpciksIHtcbiAgICAgIG1ldGE6IGBjb21tb25BbmltYXRpb25zXyR7ZGlyfWBcbiAgICB9XG4gICkuYXR0YWNoKCk7XG5cbiAgY29uc3QgY29tbW9uQ2xhc3Nlc0RpciA9IGpzcy5jcmVhdGVTdHlsZVNoZWV0KFxuICAgIGNvbW1vbkNsYXNzZXModGhlbWVWYXJzRGlyKSwge1xuICAgICAgbWV0YTogYGNvbW1vbkNsYXNzZXNfJHtkaXJ9YFxuICAgIH1cbiAgKS5hdHRhY2goKTtcblxuICBhY2NbZGlyXSA9IHtcbiAgICB2YXJzOiB0aGVtZVZhcnNEaXIsXG4gICAgYW5pbWF0aW9uczogY29tbW9uQW5pbWF0aW9uc0Rpci5jbGFzc2VzLFxuICAgIGNvbW1vbjogY29tbW9uQ2xhc3Nlc0Rpci5jbGFzc2VzXG4gIH07XG5cbiAgcmV0dXJuIGFjYztcbn0sIHt9KTtcblxuZXhwb3J0IGRlZmF1bHQgdGhlbWU7XG5cbiIsIlxuY29uc3QgY29tbW9uVmFycyA9IGRpciA9PiAoe1xuICBkaXIsXG4gIGNvbG9yczoge1xuICAgIHByaW1hcnlDb2xvcjogJ2dyZWVuJyxcbiAgICBzZWNvbmRhcnlDb2xvcjogJ2JsdWUnLFxuICAgIGZvcm1JbnB1dENvbG9yOiAnYmxhY2snLFxuICAgIGZvcm1JbnB1dEJvcmRlckNvbG9yOiAnZ3JleScsXG4gICAgZm9ybUlucHV0QmFja2dyb3VuZENvbG9yOiAnd2hpdGUnXG4gIH0sXG4gIGRpbWVuc2lvbnM6IHtcbiAgICBmb3JtSW5wdXRIZWlnaHQ6IDI2LFxuICAgIGZvcm1JbnB1dEZvbnRTaXplOiAxNixcbiAgICBmb3JtSW5wdXRQYWRkaW5nU3RhcnRFbmQ6IDUsXG4gICAgZm9ybUlucHV0Qm9yZGVyUmFkaXVzOiAwLFxuICAgIGZvcm1JbnB1dEJvcmRlcldpZHRoOiAxXG4gIH0sXG4gIGdyaWQ6IHtcbiAgICBicmVha3BvaW50czoge1xuICAgICAgeHM6ICcxcHgnLFxuICAgICAgczogJzU3NnB4JyxcbiAgICAgIG06ICc3NjhweCcsXG4gICAgICBsOiAnOTkycHgnLFxuICAgICAgeGw6ICcxMjAwcHgnXG4gICAgfSxcbiAgICBjb2xzOiAxMlxuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgY29tbW9uVmFycztcbiIsImltcG9ydCB7IGNyZWF0ZVRoZW1pbmcgfSBmcm9tICdyZWFjdC1qc3MnO1xuXG5jb25zdCB0aGVtaW5nID0gY3JlYXRlVGhlbWluZygnX19EQlVfVEhFTUlOR19fJyk7XG5cbmV4cG9ydCB7XG4gIGNyZWF0ZVRoZW1pbmcsXG4gIHRoZW1pbmdcbn07XG4iLCJcbmNvbnN0IGJ1dHRvbkhlaWdodCA9ICcyNXB4JztcbmNvbnN0IGJ1dHRvblN0YXJ0ID0gJzVweCc7XG5jb25zdCBidXR0b25Ub3AgPSAnNXB4JztcblxubGV0IGNvbnNvbGVNZXNzYWdlcyA9IFtdO1xuY29uc3QgY29uc29sZUxvZyA9IGNvbnNvbGUubG9nLmJpbmQoY29uc29sZSk7XG5jb25zdCBjb25zb2xlT3JpZ2luYWwgPSB7fTtcblxuZnVuY3Rpb24gY2FwdHVyZUNvbnNvbGUoY29uc29sZUVsbSwgb3B0aW9ucykge1xuICBjb25zdCB7IGluZGVudCA9IDIsIHNob3dMYXN0T25seSA9IGZhbHNlIH0gPSBvcHRpb25zO1xuICBjb25zdCBoYW5kbGVyID0gZnVuY3Rpb24gaGFuZGxlcihhY3Rpb24sIC4uLmFyZ3MpIHtcbiAgICBpZiAoc2hvd0xhc3RPbmx5KSB7XG4gICAgICBjb25zb2xlTWVzc2FnZXMgPSBbeyBbYWN0aW9uXTogYXJncyB9XTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZU1lc3NhZ2VzLnB1c2goeyBbYWN0aW9uXTogYXJncyB9KTtcbiAgICB9XG5cbiAgICBjb25zb2xlRWxtLmlubmVySFRNTCA9IGNvbnNvbGVNZXNzYWdlcy5tYXAoKGVudHJ5KSA9PiB7XG4gICAgICBjb25zdCBhY3Rpb24gPSBPYmplY3Qua2V5cyhlbnRyeSlbMF07XG4gICAgICBjb25zdCB2YWx1ZXMgPSBlbnRyeVthY3Rpb25dO1xuICAgICAgY29uc3QgbWVzc2FnZSA9IHZhbHVlcy5tYXAoKGl0ZW0pID0+IHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICBbdW5kZWZpbmVkLCBudWxsXS5pbmNsdWRlcyhpdGVtKSB8fFxuICAgICAgICAgIFsnbnVtYmVyJywgJ3N0cmluZycsICdmdW5jdGlvbiddLmluY2x1ZGVzKHR5cGVvZiBpdGVtKVxuICAgICAgICApID9cbiAgICAgICAgICBpdGVtIDpcbiAgICAgICAgICBbJ01hcCcsICdTZXQnXS5pbmNsdWRlcyhpdGVtLmNvbnN0cnVjdG9yLm5hbWUpID9cbiAgICAgICAgICAgIGAke2l0ZW0uY29uc3RydWN0b3IubmFtZX0gKCR7SlNPTi5zdHJpbmdpZnkoWy4uLml0ZW1dKX0pYCA6XG4gICAgICAgICAgICBKU09OLnN0cmluZ2lmeShpdGVtLCAoa2V5LCB2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICBpZiAoKHR5cGVvZiB2YWx1ZSkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9LCBpbmRlbnQpO1xuICAgICAgfSkuam9pbignLCAnKTtcblxuICAgICAgY29uc3QgY29sb3IgPSB7XG4gICAgICAgIGxvZzogJyMwMDAnLFxuICAgICAgICB3YXJuOiAnb3JhbmdlJyxcbiAgICAgICAgZXJyb3I6ICdkYXJrcmVkJ1xuICAgICAgfVthY3Rpb25dO1xuXG4gICAgICByZXR1cm4gYDxwcmUgc3R5bGU9XCJjb2xvcjogJHtjb2xvcn1cIj4ke21lc3NhZ2V9PC9wcmU+YDtcbiAgICB9KS5qb2luKCdcXG4nKTtcbiAgfTtcbiAgWydsb2cnLCAnd2FybicsICdlcnJvciddLmZvckVhY2goKGFjdGlvbikgPT4ge1xuICAgIGNvbnNvbGVPcmlnaW5hbFthY3Rpb25dID0gY29uc29sZVthY3Rpb25dO1xuICAgIGNvbnNvbGVbYWN0aW9uXSA9IGhhbmRsZXIuYmluZChjb25zb2xlLCBhY3Rpb24pO1xuICB9KTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgKGV2dCkgPT4ge1xuICAgIC8vIGVzbGludCBuby1jb25zb2xlOiAwXG4gICAgY29uc29sZS5lcnJvcihgXCIke2V2dC5tZXNzYWdlfVwiIGZyb20gJHtldnQuZmlsZW5hbWV9OiR7ZXZ0LmxpbmVub31gKTtcbiAgICBjb25zb2xlLmVycm9yKGV2dCwgZXZ0LmVycm9yLnN0YWNrKTtcbiAgICAvLyBldnQucHJldmVudERlZmF1bHQoKTtcbiAgfSk7XG4gIGNvbnNvbGVMb2coJ2NvbnNvbGUgY2FwdHVyZWQnKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHJlbGVhc2VDb25zb2xlKCkge1xuICAgIFsnbG9nJywgJ3dhcm4nLCAnZXJyb3InXS5mb3JFYWNoKChhY3Rpb24pID0+IHtcbiAgICAgIGNvbnNvbGVbYWN0aW9uXSA9IGNvbnNvbGVPcmlnaW5hbFthY3Rpb25dO1xuICAgIH0pO1xuICAgIGNvbnNvbGVMb2coJ2NvbnNvbGUgcmVsZWFzZWQnKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlQ29uc29sZSh7XG4gIG9wdGlvbnMsXG4gIGNvbnNvbGVTdHlsZToge1xuICAgIGJ0blN0YXJ0ID0gYnV0dG9uU3RhcnQsIGJ0bkhlaWdodCA9IGJ1dHRvbkhlaWdodCxcbiAgICB3aWR0aCA9IGBjYWxjKDEwMHZ3IC0gJHtidG5TdGFydH0gLSAzMHB4KWAsIGhlaWdodCA9ICc0MDBweCcsXG4gICAgYmFja2dyb3VuZCA9ICdyZ2JhKDAsIDAsIDAsIDAuNSknXG4gIH1cbn0pIHtcbiAgY29uc3QgeyBydGwgPSBmYWxzZSB9ID0gb3B0aW9ucztcbiAgY29uc3QgY29uc29sZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBjb25zb2xlLmlkID0gJ0RCVW9uU2NyZWVuQ29uc29sZSc7XG4gIGNvbnNvbGUuc3R5bGUuY3NzVGV4dCA9IGBcbiAgICBkaXNwbGF5OiBibG9jaztcbiAgICBtYXJnaW46IDBweDtcbiAgICBwYWRkaW5nOiA1cHg7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIG92ZXJmbG93OiBhdXRvO1xuICAgIHdpZHRoOiAke3dpZHRofTtcbiAgICBoZWlnaHQ6ICR7aGVpZ2h0fTtcbiAgICB0b3A6ICR7YnRuSGVpZ2h0fTtcbiAgICAke3J0bCA/ICdyaWdodCcgOiAnbGVmdCd9OiAwcHg7XG4gICAgYmFja2dyb3VuZDogJHtiYWNrZ3JvdW5kfTtcbiAgICB6LWluZGV4OiA5OTk5O1xuICAgIC13ZWJraXQtb3ZlcmZsb3ctc2Nyb2xsaW5nOiB0b3VjaFxuICAgIGA7XG4gIHJldHVybiBjb25zb2xlO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVCdXR0b24oe1xuICBvcHRpb25zLFxuICBidXR0b25TdHlsZToge1xuICAgIHBvc2l0aW9uID0gJ2ZpeGVkJyxcbiAgICB3aWR0aCA9ICcyNXB4JywgaGVpZ2h0ID0gYnV0dG9uSGVpZ2h0LCB0b3AgPSBidXR0b25Ub3AsIHN0YXJ0ID0gYnV0dG9uU3RhcnQsXG4gICAgYmFja2dyb3VuZCA9ICdyZ2JhKDAsIDAsIDAsIDAuNSknXG4gIH1cbn0pIHtcbiAgY29uc3QgeyBydGwgPSBmYWxzZSB9ID0gb3B0aW9ucztcbiAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGJ1dHRvbi5pZCA9ICdEQlVvblNjcmVlbkNvbnNvbGVUb2dnbGVyJztcbiAgYnV0dG9uLnN0eWxlLmNzc1RleHQgPSBgXG4gICAgcG9zaXRpb246ICR7cG9zaXRpb259O1xuICAgIHdpZHRoOiAke3dpZHRofTtcbiAgICBoZWlnaHQ6ICR7aGVpZ2h0fTtcbiAgICB0b3A6ICR7dG9wfTtcbiAgICAke3J0bCA/ICdyaWdodCcgOiAnbGVmdCd9OiAke3N0YXJ0fTtcbiAgICBiYWNrZ3JvdW5kOiAke2JhY2tncm91bmR9O1xuICAgIHotaW5kZXg6IDk5OTk7XG4gICAgYDtcbiAgcmV0dXJuIGJ1dHRvbjtcbn1cblxuLyoqXG5vblNjcmVlbkNvbnNvbGUoe1xuICBidXR0b25TdHlsZSA9IHsgcG9zaXRpb24sIHdpZHRoLCBoZWlnaHQsIHRvcCwgc3RhcnQsIGJhY2tncm91bmQgfSxcbiAgY29uc29sZVN0eWxlID0geyB3aWR0aCwgaGVpZ2h0LCBiYWNrZ3JvdW5kIH0sXG4gIG9wdGlvbnMgPSB7IHJ0bDogZmFsc2UsIGluZGVudCwgc2hvd0xhc3RPbmx5IH1cbn0pXG4qL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gb25TY3JlZW5Db25zb2xlKHtcbiAgYnV0dG9uU3R5bGUgPSB7fSxcbiAgY29uc29sZVN0eWxlID0ge30sXG4gIG9wdGlvbnMgPSB7fVxufSA9IHt9KSB7XG4gIGNvbnN0IGJ1dHRvbiA9IGNyZWF0ZUJ1dHRvbih7XG4gICAgb3B0aW9ucyxcbiAgICBidXR0b25TdHlsZVxuICB9KTtcbiAgY29uc3QgY29uc29sZSA9IGNyZWF0ZUNvbnNvbGUoe1xuICAgIGNvbnNvbGVTdHlsZToge1xuICAgICAgLi4uY29uc29sZVN0eWxlLFxuICAgICAgYnRuSGVpZ2h0OiBidXR0b25TdHlsZS5oZWlnaHQsXG4gICAgICBidG5TdGFydDogYnV0dG9uU3R5bGUuc3RhcnRcbiAgICB9LFxuICAgIG9wdGlvbnNcbiAgfSk7XG5cbiAgY29uc29sZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgfSk7XG5cbiAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGlmICghYnV0dG9uLmNvbnRhaW5zKGNvbnNvbGUpKSB7XG4gICAgICBidXR0b24uYXBwZW5kQ2hpbGQoY29uc29sZSk7XG4gICAgICBjb25zb2xlLnNjcm9sbFRvcCA9IGNvbnNvbGUuc2Nyb2xsSGVpZ2h0IC0gY29uc29sZS5jbGllbnRIZWlnaHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJ1dHRvbi5yZW1vdmVDaGlsZChjb25zb2xlKTtcbiAgICB9XG4gIH0pO1xuXG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcbiAgY29uc3QgcmVsZWFzZUNvbnNvbGUgPSBjYXB0dXJlQ29uc29sZShjb25zb2xlLCBvcHRpb25zKTtcblxuICByZXR1cm4gZnVuY3Rpb24gcmVsZWFzZSgpIHtcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGJ1dHRvbik7XG4gICAgcmVsZWFzZUNvbnNvbGUoKTtcbiAgfTtcbn1cbiIsIlxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdGVtcGxhdGUoc3RyaW5ncywgLi4ua2V5cykge1xuICByZXR1cm4gKCguLi52YWx1ZXMpID0+IHtcbiAgICBjb25zdCBkaWN0ID0gdmFsdWVzW3ZhbHVlcy5sZW5ndGggLSAxXSB8fCB7fTtcbiAgICBjb25zdCByZXN1bHQgPSBbc3RyaW5nc1swXV07XG4gICAga2V5cy5mb3JFYWNoKChrZXksIGkpID0+IHtcbiAgICAgIGNvbnN0IHZhbHVlID0gTnVtYmVyLmlzSW50ZWdlcihrZXkpID8gdmFsdWVzW2tleV0gOiBkaWN0W2tleV07XG4gICAgICByZXN1bHQucHVzaCh2YWx1ZSwgc3RyaW5nc1tpICsgMV0pO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQuam9pbignJyk7XG4gIH0pO1xufVxuIiwiLy8gVXRpbHNcbmltcG9ydCB0ZW1wbGF0ZSBmcm9tICcuL3V0aWxzL3RlbXBsYXRlJztcbmltcG9ydCBvblNjcmVlbkNvbnNvbGUgZnJvbSAnLi91dGlscy9vblNjcmVlbkNvbnNvbGUnO1xuXG4vLyBTZXJ2aWNlc1xuaW1wb3J0IGxvY2FsZVNlcnZpY2UgZnJvbSAnLi9zZXJ2aWNlcy9Mb2NhbGVTZXJ2aWNlJztcbmltcG9ydCBpMThuU2VydmljZSBmcm9tICcuL3NlcnZpY2VzL0kxOG5TZXJ2aWNlJztcblxuLy8gSE9DXG5pbXBvcnQgbG9jYWxlQXdhcmUgZnJvbSAnLi9IT0MvbG9jYWxlQXdhcmUnO1xuaW1wb3J0IHRoZW1lQXdhcmUgZnJvbSAnLi9IT0MvdGhlbWVBd2FyZSc7XG5cblxuLy8gVGhlbWVcbmltcG9ydCB0aGVtZSBmcm9tICcuL3N0eWxlcy90aGVtZSc7XG5pbXBvcnQgdGhlbWVWYXJzIGZyb20gJy4vc3R5bGVzL3RoZW1lVmFycyc7XG5cblxuLy8gVGhlbWluZ1xuaW1wb3J0IHsgdGhlbWluZywgY3JlYXRlVGhlbWluZyB9IGZyb20gJy4vdGhlbWluZy90aGVtaW5nJztcblxuLy8gQ29tcG9uZW50c1xuaW1wb3J0IEhlbGxvIGZyb20gJy4vY29tcG9uZW50cy9IZWxsby9IZWxsbyc7XG5pbXBvcnQgTGlzdCBmcm9tICcuL2NvbXBvbmVudHMvTGlzdC9MaXN0JztcbmltcG9ydCBGb3JtSW5wdXROdW1iZXIgZnJvbSAnLi9jb21wb25lbnRzL0Zvcm1JbnB1dE51bWJlci9Gb3JtSW5wdXROdW1iZXInO1xuXG5leHBvcnQge1xuICAvLyBVdGlsc1xuICB0ZW1wbGF0ZSxcbiAgb25TY3JlZW5Db25zb2xlLFxuXG4gIC8vIFNlcnZpY2VzXG4gIGxvY2FsZVNlcnZpY2UsXG4gIGkxOG5TZXJ2aWNlLFxuXG4gIC8vIEhPQ1xuICBsb2NhbGVBd2FyZSxcbiAgdGhlbWVBd2FyZSxcblxuICAvLyBUaGVtZVxuICB0aGVtZVZhcnMsXG4gIHRoZW1lLFxuXG4gIC8vIFRoZW1pbmdcbiAgdGhlbWluZyxcbiAgY3JlYXRlVGhlbWluZyxcblxuICAvLyBDb21wb25lbnRzXG4gIEhlbGxvLFxuICBMaXN0LFxuICBGb3JtSW5wdXROdW1iZXJcbn07XG4iXX0=
