(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

var defineProperty = Object.defineProperty;
var getOwnPropertyNames = Object.getOwnPropertyNames;
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var getPrototypeOf = Object.getPrototypeOf;
var objectPrototype = getPrototypeOf && getPrototypeOf(Object);

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
                var descriptor = getOwnPropertyDescriptor(sourceComponent, key);
                try { // Avoid failures from read-only properties
                    defineProperty(targetComponent, key, descriptor);
                } catch (e) {}
            }
        }

        return targetComponent;
    }

    return targetComponent;
};

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
},{"prop-types":"prop-types","react":"react"}],4:[function(require,module,exports){
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

var GoMarkGithub = function GoMarkGithub(props) {
    return _react2.default.createElement(
        _reactIconBase2.default,
        _extends({ viewBox: '0 0 40 40' }, props),
        _react2.default.createElement(
            'g',
            null,
            _react2.default.createElement('path', { d: 'm20 0c-11 0-20 9-20 20 0 8.8 5.7 16.3 13.7 19 1 0.2 1.3-0.5 1.3-1 0-0.5 0-2 0-3.7-5.5 1.2-6.7-2.4-6.7-2.4-0.9-2.3-2.2-2.9-2.2-2.9-1.9-1.2 0.1-1.2 0.1-1.2 2 0.1 3.1 2.1 3.1 2.1 1.7 3 4.6 2.1 5.8 1.6 0.2-1.3 0.7-2.2 1.3-2.7-4.5-0.5-9.2-2.2-9.2-9.8 0-2.2 0.8-4 2.1-5.4-0.2-0.5-0.9-2.6 0.2-5.3 0 0 1.7-0.5 5.5 2 1.6-0.4 3.3-0.6 5-0.6 1.7 0 3.4 0.2 5 0.7 3.8-2.6 5.5-2.1 5.5-2.1 1.1 2.8 0.4 4.8 0.2 5.3 1.3 1.4 2.1 3.2 2.1 5.4 0 7.6-4.7 9.3-9.2 9.8 0.7 0.6 1.4 1.9 1.4 3.7 0 2.7 0 4.9 0 5.5 0 0.6 0.3 1.2 1.3 1 8-2.7 13.7-10.2 13.7-19 0-11-9-20-20-20z' })
        )
    );
};

exports.default = GoMarkGithub;
module.exports = exports['default'];
},{"react":"react","react-icon-base":3}],5:[function(require,module,exports){
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

var GoThreeBars = function GoThreeBars(props) {
    return _react2.default.createElement(
        _reactIconBase2.default,
        _extends({ viewBox: '0 0 40 40' }, props),
        _react2.default.createElement(
            'g',
            null,
            _react2.default.createElement('path', { d: 'm5 7.5v5h30v-5h-30z m0 15h30v-5h-30v5z m0 10h30v-5h-30v5z' })
        )
    );
};

exports.default = GoThreeBars;
module.exports = exports['default'];
},{"react":"react","react-icon-base":3}],6:[function(require,module,exports){
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
  class LocaleAware extends _react2.default.Component {
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

},{"./../services/I18nService":7,"./../services/LocaleService":8,"hoist-non-react-statics":1,"react":"react"}],7:[function(require,module,exports){
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

},{"./LocaleService":8}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDBUIWebComponentBase;

var _LocaleService = require('../../services/LocaleService');

var _LocaleService2 = _interopRequireDefault(_LocaleService);

var _ensureSingleRegistration = require('../internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const registrationName = 'DBUIWebComponentBase';

function defineCommonCSSVars() {
  const commonStyle = document.createElement('style');
  commonStyle.innerHTML = `
  :root {
    --dbui-web-component-global-border-radius: 5px;
    --dbui-web-component-form-input-height: 30px;
    --dbui-web-component-form-input-color: #000;
    --dbui-web-component-form-input-background-color: transparent;
    --dbui-web-component-form-input-border-color: #ccc;
    --dbui-web-component-form-input-border-style: solid;
    --dbui-web-component-form-input-border-width: 1px;
  }
  `;
  document.querySelector('head').appendChild(commonStyle);
}

function getDBUIWebComponentBase(win) {
  return (0, _ensureSingleRegistration2.default)(win, registrationName, () => {
    defineCommonCSSVars();

    const { document, HTMLElement, customElements } = win;

    class DBUIWebComponentBase extends HTMLElement {

      static get registrationName() {
        throw new Error('registrationName must be defined in derived classes');
      }

      static get templateInnerHTML() {
        return '<style></style><slot></slot>';
      }

      static get dependencies() {
        return [];
      }

      static get useShadow() {
        return true;
      }

      static get propertiesToUpgrade() {
        return [];
      }

      static get propertiesToDefine() {
        return {};
      }

      get instancePropertiesToDefine() {
        return {};
      }

      constructor(...args) {
        super();

        const { useShadow } = this.constructor;
        if (useShadow) {
          this.attachShadow({
            mode: 'open'
            // delegatesFocus: true
            // Not working on IPad so we do an workaround
            // by setting "focused" attribute when needed.
          });
        }
        this._isConnected = false;
        this._insertTemplate();

        this.connectedCallback = this.connectedCallback.bind(this);
        this.disconnectedCallback = this.disconnectedCallback.bind(this);
        this._handleLocaleChange = this._handleLocaleChange.bind(this);
        this.onLocaleChange && (this.onLocaleChange = this.onLocaleChange.bind(this));
        this.unregisterLocaleChange = null;

        // provide support for traits if any as they cant override constructor
        this.init && this.init(...args);
      }

      // https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
      // https://developers.google.com/web/fundamentals/web-components/examples/howto-checkbox
      /* eslint no-prototype-builtins: 0 */
      _upgradeProperty(prop) {
        if (this.hasOwnProperty(prop)) {
          const value = this[prop];
          delete this[prop];
          this[prop] = value;
        }
      }

      _defineProperty(key, value) {
        if (!this.hasAttribute(key)) {
          this.setAttribute(key, value);
        }
      }

      connectedCallback() {
        this._isConnected = true;
        window.addEventListener('beforeunload', this.disconnectedCallback, false);
        this.unregisterLocaleChange = _LocaleService2.default.onLocaleChange(this._handleLocaleChange);
        const { propertiesToUpgrade, propertiesToDefine } = this.constructor;
        const { instancePropertiesToDefine } = this;
        const allPropertiesToDefine = Object.assign({}, propertiesToDefine, instancePropertiesToDefine);
        propertiesToUpgrade.forEach(property => {
          this._upgradeProperty(property);
        });
        Object.keys(allPropertiesToDefine).forEach(property => {
          this._defineProperty(property, allPropertiesToDefine[property]);
        });
      }

      disconnectedCallback() {
        this._isConnected = false;
        this.unregisterLocaleChange();
        window.removeEventListener('beforeunload', this.disconnectedCallback, false);
      }

      get childrenTree() {
        return this.constructor.useShadow ? this.shadowRoot : this;
      }

      _insertTemplate() {
        const { template } = this.constructor;

        if (template) {
          this.childrenTree.appendChild(template.content.cloneNode(true));
        }
      }

      _handleLocaleChange(locale) {
        this.setAttribute('dir', locale.dir);
        this.setAttribute('lang', locale.lang);
        this.onLocaleChange && this.onLocaleChange(locale);
      }

    }

    function defineCommonStaticMethods(klass) {
      const templateInnerHTML = klass.templateInnerHTML;
      const template = document.createElement('template');
      template.innerHTML = templateInnerHTML;

      Object.defineProperty(klass, 'template', {
        get() {
          return template;
        },
        enumerable: false,
        configurable: true
      });

      Object.defineProperty(klass, 'componentStyle', {
        get() {
          return klass.template.content.querySelector('style').innerHTML;
        },
        set(value) {
          klass.template.content.querySelector('style').innerHTML = value;
        },
        enumerable: false,
        configurable: true
      });

      return klass;
    }

    function Registerable(klass) {
      klass.registerSelf = () => {
        const registrationName = klass.registrationName;
        const dependencies = klass.dependencies;
        // Make sure our dependencies are registered before we register self
        dependencies.forEach(dependency => dependency.registerSelf());
        // Don't try to register self if already registered
        if (customElements.get(registrationName)) return registrationName;
        // Give a chance to override web-component style if provided before being registered.
        const componentStyle = ((win.DBUIWebComponents || {})[registrationName] || {}).componentStyle;
        if (componentStyle) {
          klass.componentStyle += componentStyle;
        }
        // Do registration
        customElements.define(registrationName, klass);
        return registrationName;
      };

      Object.defineProperty(klass, 'prototypeChainInfo', {
        get() {
          const chain = [klass];
          let parentProto = Object.getPrototypeOf(klass);
          while (parentProto !== HTMLElement) {
            chain.push(parentProto);
            parentProto = Object.getPrototypeOf(parentProto);
          }
          chain.push(parentProto);
          return chain;
        },
        enumerable: false,
        configurable: true
      });

      return klass;
    }

    return {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    };
  });
}

},{"../../services/LocaleService":8,"../internals/ensureSingleRegistration":14}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDBUIWebComponentDummy;

var _DBUIWebComponentBase = require('../DBUIWebComponentBase/DBUIWebComponentBase');

var _DBUIWebComponentBase2 = _interopRequireDefault(_DBUIWebComponentBase);

var _ensureSingleRegistration = require('../internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const registrationName = 'dbui-web-component-dummy';

function getDBUIWebComponentDummy(win) {
  return (0, _ensureSingleRegistration2.default)(win, registrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = (0, _DBUIWebComponentBase2.default)(win);

    class DBUIWebComponentDummy extends DBUIWebComponentBase {

      static get registrationName() {
        return registrationName;
      }

      static get templateInnerHTML() {
        return `
          <style>
          :host {
            display: inline-block;
            width: 100%;
            max-width: 400px;
            height: var(--dbui-input-height, 50px);
            color: maroon;
            border: 1px solid gray;
            box-sizing: border-box;
          }
          
          :host b, :host div[x-has-slot] span[x-slot-wrapper] {
            unicode-bidi: bidi-override;
            text-shadow: var(--dummy-b-text-shadow, none);
          }
    
          :host([dir=rtl]) b {
            text-decoration: underline;
          }
          
          :host([dir=ltr]) b {
            text-decoration: overline;
          }
    
          :host([dir=ltr]) #container > div[dir=rtl],
          :host([dir=rtl]) #container > div[dir=ltr] {
            display: none;
          }
          
          :host #container > div[x-has-slot] {
            margin-left: 0px;
          }
          
          #container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-flow: row nowrap;
            align-items: stretch;
          }
          
          #container > div {
            border: 1px solid gray;
            border-radius: var(--dummy-inner-sections-border-radius, 0px);
            flex: 1 0 0%;
            display: flex;
            margin: 5px;
          }
          
          #container > div > div {
            margin: auto;
          }
          
          </style>
          
          <div id="container">
            <div dir="ltr">
              <div>
                <b>Dummy shadow</b> [LTR]
              </div>
            </div>
            
            <div x-has-slot>
              <div>
                <span>[</span><span x-slot-wrapper><slot></slot></span><span>]</span>
              </div>
            </div>
            
            <div dir="rtl">
              <div>
                <b>Dummy shadow</b> [RTL]
              </div>
            </div>
          </div>
        `;
      }

      onLocaleChange(locale) {
        // console.log('onLocaleChange', locale);
      }
    }

    return Registerable(defineCommonStaticMethods(DBUIWebComponentDummy));
  });
}

getDBUIWebComponentDummy.registrationName = registrationName;

},{"../DBUIWebComponentBase/DBUIWebComponentBase":9,"../internals/ensureSingleRegistration":14}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDBUIWebComponentDummyParent;

var _DBUIWebComponentBase = require('../DBUIWebComponentBase/DBUIWebComponentBase');

var _DBUIWebComponentBase2 = _interopRequireDefault(_DBUIWebComponentBase);

var _DBUIWebComponentDummy = require('../DBUIWebComponentDummy/DBUIWebComponentDummy');

var _DBUIWebComponentDummy2 = _interopRequireDefault(_DBUIWebComponentDummy);

var _ensureSingleRegistration = require('../internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const registrationName = 'dbui-web-component-dummy-parent';

function getDBUIWebComponentDummyParent(win) {
  return (0, _ensureSingleRegistration2.default)(win, registrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = (0, _DBUIWebComponentBase2.default)(win);
    const DBUIWebComponentDummy = (0, _DBUIWebComponentDummy2.default)(win);

    class DBUIWebComponentDummyParent extends DBUIWebComponentBase {

      static get registrationName() {
        return registrationName;
      }

      static get templateInnerHTML() {
        return `
          <style>
          :host {
            display: inline-block;
            width: 100%;
            max-width: 400px;
          }
          </style>
          <div>
            <div>
              <b>Dummy Parent shadow</b>
            </div>
            <div>
              <dbui-web-component-dummy><slot></slot></dbui-web-component-dummy>
            </div>
          </div>
        `;
      }

      static get dependencies() {
        return [DBUIWebComponentDummy];
      }

    }

    return Registerable(defineCommonStaticMethods(DBUIWebComponentDummyParent));
  });
}

getDBUIWebComponentDummyParent.registrationName = registrationName;

},{"../DBUIWebComponentBase/DBUIWebComponentBase":9,"../DBUIWebComponentDummy/DBUIWebComponentDummy":10,"../internals/ensureSingleRegistration":14}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = dbuiWebComponentsSetUp;

var _appendStyle = require('../internals/appendStyle');

var _appendStyle2 = _interopRequireDefault(_appendStyle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function dbuiWebComponentsSetUp(win) {
  return {
    appendStyle: (0, _appendStyle2.default)(win)
  };
}

},{"../internals/appendStyle":13}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/*
DBUIWebComponentBase (from which all web-components inherit)
will read componentStyle from win.DBUIWebComponents
when klass.registerSelf() is called giving a chance to override default web-component style
just before it is registered.
*/
const appendStyle = win => (registrationName, componentStyle) => {
  if (!win.DBUIWebComponents) {
    win.DBUIWebComponents = {};
  }
  win.DBUIWebComponents = Object.assign({}, win.DBUIWebComponents, {
    [registrationName]: Object.assign({}, win.DBUIWebComponents[registrationName], {
      componentStyle
    })
  });
};

exports.default = appendStyle;

},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ensureSingleRegistration;
function ensureSingleRegistration(win, name, callback) {
  if (!win.DBUIWebComponents) {
    win.DBUIWebComponents = { registrations: {} };
  } else if (!win.DBUIWebComponents.registrations) {
    win.DBUIWebComponents.registrations = {};
  }

  let registration = win.DBUIWebComponents.registrations[name];

  if (registration) return registration;

  registration = callback();
  win.DBUIWebComponents.registrations[name] = registration;

  return win.DBUIWebComponents.registrations[name];
}

},{}],15:[function(require,module,exports){
(function (process){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _markGithub = require('react-icons/lib/go/mark-github');

var _markGithub2 = _interopRequireDefault(_markGithub);

var _threeBars = require('react-icons/lib/go/three-bars');

var _threeBars2 = _interopRequireDefault(_threeBars);

var _screens = require('./screens');

var _IFrameScreen = require('./internals/reactComponents/IFrameScreen');

var _IFrameScreen2 = _interopRequireDefault(_IFrameScreen);

var _appUtils = require('./internals/appUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class App extends _react2.default.Component {
  componentDidMount() {
    window.addEventListener('hashchange', this.onHashChange.bind(this));
    // re-using the helper defined for iFrame
    window.makeTabs();
    window.highlightBlocks();
  }

  onHashChange() {
    this.forceUpdate();
  }

  componentDidUpdate() {
    window.makeTabs();
    window.highlightBlocks();
  }

  render() {
    if (process.env.NODE_ENV !== 'production') {
      /* eslint no-console: 0 */
      // console.log('rendering App component');
    }

    const screensKeys = Object.keys(_screens.screens);
    const windowLocationHash = (window.location.hash || `#${screensKeys[0]}`).replace('#', '');

    const links = _screens.screenLinksGen.map((section, idx) => {
      return _react2.default.createElement(
        'div',
        { key: idx },
        _react2.default.createElement(
          'div',
          { className: 'links-section-group' },
          section.title
        ),
        _react2.default.createElement(
          'ul',
          null,
          section.links.map((link, idx) => {
            const isActive = link.path === windowLocationHash ? 'active' : undefined;
            return _react2.default.createElement(
              'li',
              { key: idx, 'x-active': isActive },
              _react2.default.createElement(
                'a',
                { href: `#${link.path}` },
                link.title
              )
            );
          })
        )
      );
    });

    const Screen = windowLocationHash.endsWith('.html') ? _IFrameScreen2.default : _screens.screens[windowLocationHash] || 'div';

    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'div',
        { className: 'page-header' },
        _react2.default.createElement(
          'h2',
          null,
          'DEV BOX UI'
        ),
        _react2.default.createElement(
          'a',
          {
            className: 'head-link',
            href: 'https://github.com/catalin-enache/dev-box-ui',
            rel: 'noopener noreferrer',
            target: '_blank' },
          _react2.default.createElement(_markGithub2.default, { size: 25 })
        )
      ),
      _react2.default.createElement(
        'div',
        { className: 'demo-wrapper' },
        _react2.default.createElement(
          'label',
          { id: 'links-toggle-label', htmlFor: 'links-toggle', className: 'head-link' },
          _react2.default.createElement(_threeBars2.default, { size: 25 })
        ),
        _react2.default.createElement('input', { id: 'links-toggle', type: 'checkbox' }),
        _react2.default.createElement(
          'div',
          { className: 'demo-links', onClick: () => document.querySelector('#links-toggle').checked = false },
          _react2.default.createElement(
            'div',
            { className: 'locale-dir-switch' },
            _react2.default.createElement(
              'a',
              { href: '#', onClick: _appUtils.toggleAppDir },
              'TOGGLE LOCALE DIR'
            )
          ),
          links
        ),
        _react2.default.createElement(
          'div',
          { className: 'demo-area' },
          _react2.default.createElement(Screen, null)
        )
      )
    );
  }
}

exports.default = App;

}).call(this,require('_process'))

},{"./internals/appUtils":17,"./internals/reactComponents/IFrameScreen":20,"./screens":31,"_process":2,"react":"react","react-icons/lib/go/mark-github":4,"react-icons/lib/go/three-bars":5}],16:[function(require,module,exports){
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

require('./internals/iFrameUtils/onWindowDefinedHelpers');

var _DBUIWebComponentsSetup = require('../src/lib/webcomponents/DBUIWebComponentsSetup/DBUIWebComponentsSetup');

var _DBUIWebComponentsSetup2 = _interopRequireDefault(_DBUIWebComponentsSetup);

var _DBUIWebComponentDummy = require('../src/lib/webcomponents/DBUIWebComponentDummy/DBUIWebComponentDummy');

var _DBUIWebComponentDummy2 = _interopRequireDefault(_DBUIWebComponentDummy);

var _DBUIWebComponentDummyParent = require('../src/lib/webcomponents/DBUIWebComponentDummyParent/DBUIWebComponentDummyParent');

var _DBUIWebComponentDummyParent2 = _interopRequireDefault(_DBUIWebComponentDummyParent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// defines some helpers on window (reusing code needed in iFrames)
(0, _DBUIWebComponentsSetup2.default)(window).appendStyle('dbui-web-component-dummy', `
  b {
    color: deepskyblue;
    font-style: oblique;
  }
`);

// import getDBUIWebComponentDummy from '../build/src/lib/webcomponents/DBUIWebComponentDummy/DBUIWebComponentDummy';
// import getDBUIWebComponentDummyParent from '../build/src/lib/webcomponents/DBUIWebComponentDummyParent/DBUIWebComponentDummyParent';


const DBUIWebComponentDummy = (0, _DBUIWebComponentDummy2.default)(window);
const DBUIWebComponentDummyParent = (0, _DBUIWebComponentDummyParent2.default)(window);

setTimeout(() => {
  DBUIWebComponentDummy.registerSelf();
  DBUIWebComponentDummyParent.registerSelf();
}, 2000);

const iframe = document.createElement('iframe');

window.onmessage = function (msg) {
  console.log('msg from iframe', msg);
};
iframe.onload = function (evt) {
  const target = evt.target;

  target.contentWindow.document.write(`
    <html>
    <body>
      <dbui-web-component-dummy
        style="color: blue"
      >
        <span>hello world 3</span>
      </dbui-web-component-dummy>
      <dbui-web-component-dummy-parent></dbui-web-component-dummy-parent>
    </body>
    <script>
      window.onmessage = function (msg) {
        console.log('msg from window', msg);
        window.top.postMessage('world', '*');
      };
    </script>
    </html>
  `);
  target.contentWindow.postMessage('hello', '*');

  (0, _DBUIWebComponentsSetup2.default)(target.contentWindow).appendStyle('dbui-web-component-dummy', `
    b {
      font-style: oblique;
      opacity: 0.5;
    }
  `);
  const DBUIWebComponentDummy2 = (0, _DBUIWebComponentDummy2.default)(target.contentWindow);
  const DBUIWebComponentDummyParent2 = (0, _DBUIWebComponentDummyParent2.default)(target.contentWindow);
  setTimeout(() => {
    DBUIWebComponentDummy2.registerSelf();
    DBUIWebComponentDummyParent2.registerSelf();

    setTimeout(() => {
      // target.remove();
    }, 2000);
  }, 2000);
};

// document.body.appendChild(iframe);


// onScreenConsole({ options: { showLastOnly: false } });

let Demo = class Demo extends _react2.default.Component {
  render() {
    if (process.env.NODE_ENV !== 'production') {
      /* eslint no-console: 0 */
      // console.log('rendering Demo component');
    }
    const { locale: { dir } } = this.props;
    return _react2.default.createElement(_app2.default, null);
  }
};

Demo.propTypes = {
  locale: _propTypes2.default.object
};

Demo = (0, _devBoxUi.localeAware)(Demo);

_reactDom2.default.render(_react2.default.createElement(Demo, null), document.getElementById('demo'));

}).call(this,require('_process'))

},{"../src/lib/webcomponents/DBUIWebComponentDummy/DBUIWebComponentDummy":10,"../src/lib/webcomponents/DBUIWebComponentDummyParent/DBUIWebComponentDummyParent":11,"../src/lib/webcomponents/DBUIWebComponentsSetup/DBUIWebComponentsSetup":12,"./app":15,"./internals/iFrameUtils/onWindowDefinedHelpers":19,"_process":2,"dev-box-ui":"dev-box-ui","prop-types":"prop-types","react":"react","react-dom":"react-dom"}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/*  eslint import/prefer-default-export: 0 */
function toggleAppDir(evt) {
  evt.preventDefault();
  const documentElement = window.document.documentElement;
  const currentDir = documentElement.getAttribute('dir');
  const nextDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
  documentElement.setAttribute('dir', nextDir);
}

exports.toggleAppDir = toggleAppDir;

},{}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/* eslint import/prefer-default-export: 0 */

const distributionURL = exports.distributionURL = 'https://catalin-enache.github.io/dev-box-ui/build/dist/js/dev-box-ui-webcomponents.js';

},{}],19:[function(require,module,exports){
'use strict';

window.generateComponentPropertiesTable = function (data, selector = '.properties') {
  const propertiesContainer = document.querySelector(selector);
  const names = Object.keys(data);
  const table = `
<h3 class="section">Properties</h3>
<table>
<thead>
  <th class="prop-name">Name</th>
  <th class="prop-type">Type</th>
  <th class="prop-default">Default</th>
  <th class="prop-description">Description</th>
</thead>
<tbody>${names.map(name => {
    return `<tr>
              <td class="prop-name">${name}</td>
              <td class="prop-type">${data[name].type}</td>
              <td class="prop-default"><pre>${data[name].default}</pre></td>
              <td class="prop-description">${data[name].description}</td>
            </tr>`;
  }).join('')}</tbody>
</table>
    `;

  propertiesContainer.innerHTML = table;
};

// depends on .tabs style defined in demoScreen.scss
window.makeTabs = function () {
  let gropCount = 1;
  let idCount = 1;

  document.querySelectorAll('.tabs').forEach(tabsBlock => {
    const firstSection = tabsBlock.querySelector('section');

    tabsBlock.querySelectorAll('section').forEach(section => {
      const sectionName = section.getAttribute('x-name');
      const isChecked = section.getAttribute('x-checked');
      const highlight = section.getAttribute('x-highlight');
      const content = section.innerHTML;

      const input = document.createElement('input');
      const label = document.createElement('label');

      section.id = `content-${idCount}`;
      if (highlight) {
        section.innerHTML = `<pre><code class="${highlight}">${content}</code></pre>`;
      }

      input.type = 'radio';
      input.name = `group-${gropCount}`;
      input.id = `tab-${idCount}`;
      if (isChecked) {
        input.checked = true;
      }

      label.htmlFor = input.id;
      label.innerText = sectionName;

      tabsBlock.insertBefore(input, firstSection);
      tabsBlock.insertBefore(label, firstSection);

      idCount += 1;
    });

    gropCount += 1;
  });
};

window.highlightBlocks = function () {
  document.querySelectorAll('pre code.html').forEach(block => {
    // if not already escaped (in which case contains '&lt;') (React string scenario)
    if (!block.innerHTML.includes('&lt;')) {
      block.innerHTML = block.innerHTML.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    }
  });
  document.querySelectorAll('pre code').forEach(block => {
    window.hljs && window.hljs.highlightBlock(block);
  });
};

},{}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _localeAware = require('../../../src/lib/HOC/localeAware');

var _localeAware2 = _interopRequireDefault(_localeAware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let IFrameScreen = class IFrameScreen extends _react2.default.Component {
  constructor(props) {
    super(props);
    this.iframeNode = null;
  }

  componentWillReceiveProps(nextProps) {
    const { locale: { dir } } = nextProps;
    this.iframeNode.contentWindow.postMessage(`changeDir ${dir}`, '*');
  }

  render() {
    const isProd = !window.location.pathname.includes('.dev.');
    const windowLocationHash = window.location.hash.replace('#', '');
    return _react2.default.createElement('iframe', {
      ref: node => this.iframeNode = node,
      src: `srcDemo/screens/${windowLocationHash}?production=${isProd ? '1' : '0'}` });
  }
};
IFrameScreen.propTypes = {
  locale: _propTypes2.default.shape({
    dir: _propTypes2.default.string,
    lang: _propTypes2.default.string
  })
};
IFrameScreen = (0, _localeAware2.default)(IFrameScreen);

exports.default = IFrameScreen;

},{"../../../src/lib/HOC/localeAware":6,"prop-types":"prop-types","react":"react"}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class PropertiesTable extends _react2.default.Component {
  componentDidMount() {
    // re-using the helper defined for iFrame
    window.generateComponentPropertiesTable(this.props.properties);
  }

  render() {
    return _react2.default.createElement('div', { className: 'properties' });
  }
}

PropertiesTable.propTypes = {
  properties: _propTypes2.default.object
};

exports.default = PropertiesTable;

},{"prop-types":"prop-types","react":"react"}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class OnScreenConsoleScreen extends _react2.default.Component {
  render() {
    return _react2.default.createElement(
      "div",
      { className: "demo-screen" },
      " ",
      _react2.default.createElement(
        "h2",
        { className: "title" },
        "On Screen Console"
      )
    );
  }
}

exports.default = OnScreenConsoleScreen;

},{"react":"react"}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _constants = require('../../internals/constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class UsingDevBoxUI extends _react2.default.Component {
  render() {
    return _react2.default.createElement(
      'div',
      { className: 'demo-screen' },
      ' ',
      _react2.default.createElement(
        'h2',
        { className: 'title' },
        'Loading Dev Box UI Web Components'
      ),
      _react2.default.createElement(
        'h3',
        { className: 'section' },
        'From Distribution'
      ),
      _react2.default.createElement(
        'pre',
        null,
        _react2.default.createElement(
          'code',
          { className: 'html' },
          `
<!doctype html>
<html dir="ltr" lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <script src="${_constants.distributionURL}"></script>
  <script>
    const {
      quickSetupAndLoad
    } = require('dev-box-ui-webcomponents');
    const {
      'dbui-web-component-dummy-parent': dbuiWebComponentDummyParentClass,
    } = quickSetupAndLoad(window)([
      {
        registrationName: 'dbui-web-component-dummy',
        componentStyle: \`
         b {
           color: var(--dummy-b-color, inherit);
           border-radius: var(--dummy-b-border-radius, 0px);
           background-color: var(--dummy-b-bg-color, transparent);
         }
        \`
      },
      {
        registrationName: 'dbui-web-component-dummy-parent'
      }
    ]);
  </script>
</head>
<body>
<dbui-web-component-dummy-parent>hello 1</dbui-web-component-dummy-parent>
</body>
</html>

          `
        )
      )
    );
  }
}

exports.default = UsingDevBoxUI;

},{"../../internals/constants":18,"react":"react"}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class DBUIWebComponentDummyScreen extends _react2.default.Component {
  render() {
    return _react2.default.createElement(
      'div',
      { className: 'demo-screen' },
      _react2.default.createElement(
        'dbui-web-component-dummy',
        {
          style: { color: 'blue' }
        },
        _react2.default.createElement(
          'span',
          null,
          'hello 1'
        )
      ),
      _react2.default.createElement(
        'dbui-web-component-dummy',
        {
          style: { color: 'blue' }
        },
        _react2.default.createElement(
          'span',
          null,
          'hello 2'
        )
      ),
      _react2.default.createElement(
        'dbui-web-component-dummy-parent',
        null,
        'hello 3'
      )
    );
  }
}

exports.default = DBUIWebComponentDummyScreen;

},{"react":"react"}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _devBoxUi = require('dev-box-ui');

var _PropertiesTable = require('../../internals/reactComponents/PropertiesTable');

var _PropertiesTable2 = _interopRequireDefault(_PropertiesTable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ToRender extends _react2.default.Component {
  render() {
    // console.log('ToRender#render');
    return _react2.default.createElement(
      'div',
      {
        style: { width: 300, height: 300 },
        onMouseDown: this.props.onMouseDown,
        onMouseUp: this.props.onMouseUp,
        onClick: this.props.onClick,
        onTouchStart: this.props.onTouchStart,
        onTouchEnd: this.props.onTouchEnd
      },
      _react2.default.createElement(
        'p',
        null,
        'draggable p ',
        this.props.counter,
        ' ',
        _react2.default.createElement(
          'a',
          { href: 'http://google.com', target: '_blank' },
          'link'
        )
      )
    );
  }
}

class DraggableScreen extends _react2.default.Component {
  constructor(props) {
    super(props);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.counter = 1;
    this.state = {
      draggableContent: this.draggableContent
    };
  }

  get draggableContent() {
    return _react2.default.createElement(ToRender, {
      onMouseDown: this.handleMouseDown,
      onMouseUp: this.handleMouseUp,
      onTouchStart: this.handleTouchStart,
      onTouchEnd: this.handleTouchEnd,
      onClick: this.handleClick,
      counter: this.counter
    });
  }

  handleMouseDown(evt) {
    console.log('DraggableScreen#handleMouseDown');
  }
  handleMouseUp(evt) {
    console.log('DraggableScreen#handleMouseUp');
  }
  handleTouchStart(evt) {
    console.log('DraggableScreen#handleTouchStart');
  }
  handleTouchEnd(evt) {
    console.log('DraggableScreen#handleTouchEnd');
  }
  handleClick(evt) {
    console.log('DraggableScreen#handleClick');
    // this.counter = this.counter + 1;
    // this.setState({
    //   draggableContent: this.draggableContent
    // });
  }

  componentDidMount() {
    this._mounted = true;
    setTimeout(() => {
      if (!this._mounted) return;
      this.counter = this.counter + 1;
      this.setState({
        draggableContent: this.draggableContent
      });
    }, 3000);
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  render() {
    return _react2.default.createElement(
      'div',
      { className: 'demo-screen' },
      ' ',
      _react2.default.createElement(
        'h2',
        { className: 'title' },
        'Draggable React ',
        this.counter
      ),
      _react2.default.createElement(
        'h3',
        { className: 'section' },
        'Stuff One'
      ),
      _react2.default.createElement(
        'p',
        null,
        'before tabs'
      ),
      _react2.default.createElement(
        'div',
        { className: 'tabs' },
        _react2.default.createElement(
          'section',
          { 'x-name': 'RESULT', 'x-checked': '1' },
          _react2.default.createElement(
            _devBoxUi.Draggable,
            { style: { border: '1px solid blue', width: 200, height: 200, overflowX: 'scroll', overflowY: 'scroll' } },
            this.state.draggableContent
          ),
          _react2.default.createElement(
            _devBoxUi.DisableSelection,
            null,
            _react2.default.createElement(
              'p',
              null,
              'disabled selection'
            )
          ),
          Array.from({ length: 10 }).map((el, i) => _react2.default.createElement(
            'p',
            { key: i },
            i,
            ' ---------------------------------'
          ))
        ),
        _react2.default.createElement(
          'section',
          { 'x-name': 'HTML', 'x-highlight': 'html' },
          `
<p>draggable</p>
<span>react</span>
          `
        ),
        _react2.default.createElement(
          'section',
          { 'x-name': 'CSS', 'x-highlight': 'css' },
          `
body {
  color: red;
}
          `
        ),
        _react2.default.createElement(
          'section',
          { 'x-name': 'JS', 'x-highlight': 'javascript' },
          `
class Car extends SuperClass {
  constructor() {
    super();
  }

  onInit() {
    this.do(() => {
      console.log(print);
    });
  }
}
          `
        )
      ),
      _react2.default.createElement(
        'p',
        null,
        'between tabs'
      ),
      _react2.default.createElement(
        'div',
        { className: 'tabs' },
        _react2.default.createElement(
          'section',
          { 'x-name': 'CSS', 'x-highlight': 'css' },
          `
body {
  color: red;
}
          `
        ),
        _react2.default.createElement(
          'section',
          { 'x-name': 'JS', 'x-highlight': 'javascript', 'x-checked': '1' },
          `
class Car extends SuperClass {
  constructor() {
    super();
  }

  onInit() {
    this.do(() => {
      console.log(print);
    });
  }
}
          `
        )
      ),
      _react2.default.createElement(_PropertiesTable2.default, { properties: {
          propertyOne: {
            type: 'string',
            default: 'value 1',
            description: 'description one'
          },
          propertyTwo: {
            type: 'number',
            default: '5',
            description: 'description two'
          }
        } })
    );
  }
}

exports.default = DraggableScreen;

},{"../../internals/reactComponents/PropertiesTable":21,"dev-box-ui":"dev-box-ui","react":"react"}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _devBoxUi = require('dev-box-ui');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class FormInputNumberScreen extends _react2.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: -7.08
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(inputValue) {
    const valueToSendBack = Number(inputValue.toPrecision(16));
    this.setState({
      inputValue: valueToSendBack
    });
  }

  render() {
    return _react2.default.createElement(
      'div',
      { className: 'demo-screen' },
      ' ',
      _react2.default.createElement(
        'pre',
        null,
        _react2.default.createElement(
          'code',
          { className: 'html' },
          `
            <p>form input number</p>
            <span>react</span>
          `
        )
      ),
      _react2.default.createElement(
        'pre',
        null,
        _react2.default.createElement(
          'code',
          { className: 'javascript' },
          `
            class Machine extends SuperClass {
              constructor() {
                super();
              }

              onInit() {
                this.do(() => {
                  console.log(print);
                });
              }
            }
          `
        )
      ),
      _react2.default.createElement(
        'pre',
        null,
        _react2.default.createElement(
          'code',
          { className: 'css' },
          `
            html[dir=ltr] {
              color: red;
            }
          `
        )
      ),
      _react2.default.createElement(_devBoxUi.FormInputNumber, {
        value: this.state.inputValue,
        onChange: this.handleChange,
        defaultDecPoint: ',',
        defaultThousandsSeparator: '.'
      }),
      _react2.default.createElement(_devBoxUi.FormInputNumber, {
        value: this.state.inputValue,
        onChange: this.handleChange
      }),
      _react2.default.createElement(
        'p',
        null,
        this.state.inputValue,
        '\u00A0'
      )
    );
  }
}

exports.default = FormInputNumberScreen;

},{"dev-box-ui":"dev-box-ui","react":"react"}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _devBoxUi = require('dev-box-ui');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class FormInputScreen extends _react2.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: 6
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(inputValue) {
    this.setState({
      inputValue
    });
  }

  render() {
    return _react2.default.createElement(
      'div',
      { className: 'demo-screen' },
      ' ',
      _react2.default.createElement(_devBoxUi.FormInput, {
        value: this.state.inputValue,
        onChange: this.handleChange,
        hasWarning: false,
        hasError: false,
        disabled: false
      }),
      _react2.default.createElement(
        'p',
        null,
        this.state.inputValue,
        '\u00A0'
      )
    );
  }
}

exports.default = FormInputScreen;

},{"dev-box-ui":"dev-box-ui","react":"react"}],28:[function(require,module,exports){
(function (process){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _devBoxUi = require('dev-box-ui');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class HelloScreen extends _react2.default.Component {
  render() {
    if (process.env.NODE_ENV !== 'production') {
      /* eslint no-console: 0 */
      // console.log('rendering HelloScreen component');
    }
    return _react2.default.createElement(
      'div',
      { className: 'demo-screen' },
      ' ',
      _react2.default.createElement(_devBoxUi.Hello, null)
    );
  }
}

exports.default = HelloScreen;

}).call(this,require('_process'))

},{"_process":2,"dev-box-ui":"dev-box-ui","react":"react"}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _devBoxUi = require('dev-box-ui');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ListScreen extends _react2.default.Component {
  render() {
    return _react2.default.createElement(
      'div',
      { className: 'demo-screen' },
      ' ',
      _react2.default.createElement(_devBoxUi.List, { items: ['three', 'four'] }),
      _react2.default.createElement(_devBoxUi.List, { items: ['three', 'four'] })
    );
  }
}

exports.default = ListScreen;

},{"dev-box-ui":"dev-box-ui","react":"react"}],30:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class LocaleServiceScreen extends _react2.default.Component {
  render() {
    return _react2.default.createElement(
      "div",
      { className: "demo-screen" },
      " ",
      _react2.default.createElement(
        "h2",
        { className: "title" },
        "Locale Service"
      )
    );
  }
}

exports.default = LocaleServiceScreen;

},{"react":"react"}],31:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.screenLinksGen = exports.screens = undefined;

var _LoadingDevBoxUIWebComponents = require('./General/LoadingDevBoxUIWebComponents');

var _LoadingDevBoxUIWebComponents2 = _interopRequireDefault(_LoadingDevBoxUIWebComponents);

var _LocaleServiceScreen = require('./Services/LocaleServiceScreen');

var _LocaleServiceScreen2 = _interopRequireDefault(_LocaleServiceScreen);

var _HelloScreen = require('./ReactComponents/HelloScreen');

var _HelloScreen2 = _interopRequireDefault(_HelloScreen);

var _ListScreen = require('./ReactComponents/ListScreen');

var _ListScreen2 = _interopRequireDefault(_ListScreen);

var _FormInputScreen = require('./ReactComponents/FormInputScreen');

var _FormInputScreen2 = _interopRequireDefault(_FormInputScreen);

var _FormInputNumberScreen = require('./ReactComponents/FormInputNumberScreen');

var _FormInputNumberScreen2 = _interopRequireDefault(_FormInputNumberScreen);

var _DraggableScreen = require('./ReactComponents/DraggableScreen');

var _DraggableScreen2 = _interopRequireDefault(_DraggableScreen);

var _DBUIWebComponentDummyScreen = require('./ReactComponents/DBUIWebComponentDummyScreen');

var _DBUIWebComponentDummyScreen2 = _interopRequireDefault(_DBUIWebComponentDummyScreen);

var _OnScreenConsoleScreen = require('./Debug/OnScreenConsoleScreen');

var _OnScreenConsoleScreen2 = _interopRequireDefault(_OnScreenConsoleScreen);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Services
const screens = {
  // General
  LoadingDevBoxUIWebComponents: _LoadingDevBoxUIWebComponents2.default,

  // Services
  LocaleServiceScreen: _LocaleServiceScreen2.default,

  // Components
  HelloScreen: _HelloScreen2.default,
  ListScreen: _ListScreen2.default,
  FormInputScreen: _FormInputScreen2.default,
  FormInputNumberScreen: _FormInputNumberScreen2.default,
  DraggableScreen: _DraggableScreen2.default,
  DBUIWebComponentDummyScreen: _DBUIWebComponentDummyScreen2.default,

  // Debug
  OnScreenConsoleScreen: _OnScreenConsoleScreen2.default
};

/*
The real path matters only for .html screens as they are loaded into an iFrame.
React screens path needs to be the same as imported react component.
*/


// Debug


// React Components
// General
const screenLinksGen = [{
  title: 'General',
  links: [{ path: 'LoadingDevBoxUIWebComponents', title: 'Loading Web Components' }]
}, {
  title: 'Services',
  links: [{ path: 'LocaleServiceScreen', title: 'Locale' }]
}, {
  title: 'Web Components',
  links: [{ path: 'WebComponentsScreens/DBUIWebComponentDummyScreen.html', title: 'Dummy' }, { path: 'WebComponentsScreens/DBUIWebComponentDummyParentScreen.html', title: 'Dummy Parent' }, { path: 'WebComponentsScreens/DBUIWebComponentFormInputTextScreen.html', title: 'Form Input Text' }]
}, {
  title: 'React Components',
  links: [{ path: 'HelloScreen', title: 'Hello' }, { path: 'ListScreen', title: 'List' }, { path: 'FormInputScreen', title: 'Form Input' }, { path: 'FormInputNumberScreen', title: 'Form Input Number' }, { path: 'DraggableScreen', title: 'Draggable' }, { path: 'DBUIWebComponentDummyScreen', title: 'Dummy' }]
}, {
  title: 'Debug',
  links: [{ path: 'OnScreenConsoleScreen', title: 'On Screen Console' }]
}];

exports.screens = screens;
exports.screenLinksGen = screenLinksGen;

},{"./Debug/OnScreenConsoleScreen":22,"./General/LoadingDevBoxUIWebComponents":23,"./ReactComponents/DBUIWebComponentDummyScreen":24,"./ReactComponents/DraggableScreen":25,"./ReactComponents/FormInputNumberScreen":26,"./ReactComponents/FormInputScreen":27,"./ReactComponents/HelloScreen":28,"./ReactComponents/ListScreen":29,"./Services/LocaleServiceScreen":30}]},{},[16])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvaG9pc3Qtbm9uLXJlYWN0LXN0YXRpY3MvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LWljb24tYmFzZS9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVhY3QtaWNvbnMvbGliL2dvL21hcmstZ2l0aHViLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LWljb25zL2xpYi9nby90aHJlZS1iYXJzLmpzIiwic3JjL2xpYi9IT0MvbG9jYWxlQXdhcmUuanMiLCJzcmMvbGliL3NlcnZpY2VzL0kxOG5TZXJ2aWNlLmpzIiwic3JjL2xpYi9zZXJ2aWNlcy9Mb2NhbGVTZXJ2aWNlLmpzIiwic3JjL2xpYi93ZWJjb21wb25lbnRzL0RCVUlXZWJDb21wb25lbnRCYXNlL0RCVUlXZWJDb21wb25lbnRCYXNlLmpzIiwic3JjL2xpYi93ZWJjb21wb25lbnRzL0RCVUlXZWJDb21wb25lbnREdW1teS9EQlVJV2ViQ29tcG9uZW50RHVtbXkuanMiLCJzcmMvbGliL3dlYmNvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50L0RCVUlXZWJDb21wb25lbnREdW1teVBhcmVudC5qcyIsInNyYy9saWIvd2ViY29tcG9uZW50cy9EQlVJV2ViQ29tcG9uZW50c1NldHVwL0RCVUlXZWJDb21wb25lbnRzU2V0dXAuanMiLCJzcmMvbGliL3dlYmNvbXBvbmVudHMvaW50ZXJuYWxzL2FwcGVuZFN0eWxlLmpzIiwic3JjL2xpYi93ZWJjb21wb25lbnRzL2ludGVybmFscy9lbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24uanMiLCJzcmNEZW1vL2FwcC5qcyIsInNyY0RlbW8vZGVtby5qcyIsInNyY0RlbW8vaW50ZXJuYWxzL2FwcFV0aWxzLmpzIiwic3JjRGVtby9pbnRlcm5hbHMvY29uc3RhbnRzLmpzIiwic3JjRGVtby9pbnRlcm5hbHMvaUZyYW1lVXRpbHMvb25XaW5kb3dEZWZpbmVkSGVscGVycy5qcyIsInNyY0RlbW8vaW50ZXJuYWxzL3JlYWN0Q29tcG9uZW50cy9JRnJhbWVTY3JlZW4uanMiLCJzcmNEZW1vL2ludGVybmFscy9yZWFjdENvbXBvbmVudHMvUHJvcGVydGllc1RhYmxlLmpzIiwic3JjRGVtby9zY3JlZW5zL0RlYnVnL09uU2NyZWVuQ29uc29sZVNjcmVlbi5qcyIsInNyY0RlbW8vc2NyZWVucy9HZW5lcmFsL0xvYWRpbmdEZXZCb3hVSVdlYkNvbXBvbmVudHMuanMiLCJzcmNEZW1vL3NjcmVlbnMvUmVhY3RDb21wb25lbnRzL0RCVUlXZWJDb21wb25lbnREdW1teVNjcmVlbi5qcyIsInNyY0RlbW8vc2NyZWVucy9SZWFjdENvbXBvbmVudHMvRHJhZ2dhYmxlU2NyZWVuLmpzIiwic3JjRGVtby9zY3JlZW5zL1JlYWN0Q29tcG9uZW50cy9Gb3JtSW5wdXROdW1iZXJTY3JlZW4uanMiLCJzcmNEZW1vL3NjcmVlbnMvUmVhY3RDb21wb25lbnRzL0Zvcm1JbnB1dFNjcmVlbi5qcyIsInNyY0RlbW8vc2NyZWVucy9SZWFjdENvbXBvbmVudHMvSGVsbG9TY3JlZW4uanMiLCJzcmNEZW1vL3NjcmVlbnMvUmVhY3RDb21wb25lbnRzL0xpc3RTY3JlZW4uanMiLCJzcmNEZW1vL3NjcmVlbnMvU2VydmljZXMvTG9jYWxlU2VydmljZVNjcmVlbi5qcyIsInNyY0RlbW8vc2NyZWVucy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztrQkMxQndCLFc7O0FBTHhCOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFZSxTQUFTLFdBQVQsQ0FBcUIsU0FBckIsRUFBZ0M7QUFDN0MsUUFBTSxXQUFOLFNBQTBC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LCtEQUFSLEVBQXlFLE9BQU8saUJBQWhGLEVBSEs7QUFGVCxDQWJxQixFQXFCckI7QUFDRSxTQUFPLGtCQURUO0FBRUUsU0FBTyxDQUNMLEVBQUUsTUFBTSxhQUFSLEVBQXVCLE9BQU8sT0FBOUIsRUFESyxFQUVMLEVBQUUsTUFBTSxZQUFSLEVBQXNCLE9BQU8sTUFBN0IsRUFGSyxFQUdMLEVBQUUsTUFBTSxpQkFBUixFQUEyQixPQUFPLFlBQWxDLEVBSEssRUFJTCxFQUFFLE1BQU0sdUJBQVIsRUFBaUMsT0FBTyxtQkFBeEMsRUFKSyxFQUtMLEVBQUUsTUFBTSxpQkFBUixFQUEyQixPQUFPLFdBQWxDLEVBTEssRUFNTCxFQUFFLE1BQU0sNkJBQVIsRUFBdUMsT0FBTyxPQUE5QyxFQU5LO0FBRlQsQ0FyQnFCLEVBZ0NyQjtBQUNFLFNBQU8sT0FEVDtBQUVFLFNBQU8sQ0FDTCxFQUFFLE1BQU0sdUJBQVIsRUFBaUMsT0FBTyxtQkFBeEMsRUFESztBQUZULENBaENxQixDQUF2Qjs7UUF5Q0UsTyxHQUFBLE87UUFDQSxjLEdBQUEsYyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIENvcHlyaWdodCAyMDE1LCBZYWhvbyEgSW5jLlxuICogQ29weXJpZ2h0cyBsaWNlbnNlZCB1bmRlciB0aGUgTmV3IEJTRCBMaWNlbnNlLiBTZWUgdGhlIGFjY29tcGFueWluZyBMSUNFTlNFIGZpbGUgZm9yIHRlcm1zLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBSRUFDVF9TVEFUSUNTID0ge1xuICAgIGNoaWxkQ29udGV4dFR5cGVzOiB0cnVlLFxuICAgIGNvbnRleHRUeXBlczogdHJ1ZSxcbiAgICBkZWZhdWx0UHJvcHM6IHRydWUsXG4gICAgZGlzcGxheU5hbWU6IHRydWUsXG4gICAgZ2V0RGVmYXVsdFByb3BzOiB0cnVlLFxuICAgIG1peGluczogdHJ1ZSxcbiAgICBwcm9wVHlwZXM6IHRydWUsXG4gICAgdHlwZTogdHJ1ZVxufTtcblxudmFyIEtOT1dOX1NUQVRJQ1MgPSB7XG4gIG5hbWU6IHRydWUsXG4gIGxlbmd0aDogdHJ1ZSxcbiAgcHJvdG90eXBlOiB0cnVlLFxuICBjYWxsZXI6IHRydWUsXG4gIGNhbGxlZTogdHJ1ZSxcbiAgYXJndW1lbnRzOiB0cnVlLFxuICBhcml0eTogdHJ1ZVxufTtcblxudmFyIGRlZmluZVByb3BlcnR5ID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xudmFyIGdldE93blByb3BlcnR5TmFtZXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcztcbnZhciBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xudmFyIGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG52YXIgZ2V0UHJvdG90eXBlT2YgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Y7XG52YXIgb2JqZWN0UHJvdG90eXBlID0gZ2V0UHJvdG90eXBlT2YgJiYgZ2V0UHJvdG90eXBlT2YoT2JqZWN0KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBob2lzdE5vblJlYWN0U3RhdGljcyh0YXJnZXRDb21wb25lbnQsIHNvdXJjZUNvbXBvbmVudCwgYmxhY2tsaXN0KSB7XG4gICAgaWYgKHR5cGVvZiBzb3VyY2VDb21wb25lbnQgIT09ICdzdHJpbmcnKSB7IC8vIGRvbid0IGhvaXN0IG92ZXIgc3RyaW5nIChodG1sKSBjb21wb25lbnRzXG5cbiAgICAgICAgaWYgKG9iamVjdFByb3RvdHlwZSkge1xuICAgICAgICAgICAgdmFyIGluaGVyaXRlZENvbXBvbmVudCA9IGdldFByb3RvdHlwZU9mKHNvdXJjZUNvbXBvbmVudCk7XG4gICAgICAgICAgICBpZiAoaW5oZXJpdGVkQ29tcG9uZW50ICYmIGluaGVyaXRlZENvbXBvbmVudCAhPT0gb2JqZWN0UHJvdG90eXBlKSB7XG4gICAgICAgICAgICAgICAgaG9pc3ROb25SZWFjdFN0YXRpY3ModGFyZ2V0Q29tcG9uZW50LCBpbmhlcml0ZWRDb21wb25lbnQsIGJsYWNrbGlzdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIga2V5cyA9IGdldE93blByb3BlcnR5TmFtZXMoc291cmNlQ29tcG9uZW50KTtcblxuICAgICAgICBpZiAoZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG4gICAgICAgICAgICBrZXlzID0ga2V5cy5jb25jYXQoZ2V0T3duUHJvcGVydHlTeW1ib2xzKHNvdXJjZUNvbXBvbmVudCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICB2YXIga2V5ID0ga2V5c1tpXTtcbiAgICAgICAgICAgIGlmICghUkVBQ1RfU1RBVElDU1trZXldICYmICFLTk9XTl9TVEFUSUNTW2tleV0gJiYgKCFibGFja2xpc3QgfHwgIWJsYWNrbGlzdFtrZXldKSkge1xuICAgICAgICAgICAgICAgIHZhciBkZXNjcmlwdG9yID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZUNvbXBvbmVudCwga2V5KTtcbiAgICAgICAgICAgICAgICB0cnkgeyAvLyBBdm9pZCBmYWlsdXJlcyBmcm9tIHJlYWQtb25seSBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgICAgIGRlZmluZVByb3BlcnR5KHRhcmdldENvbXBvbmVudCwga2V5LCBkZXNjcmlwdG9yKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRhcmdldENvbXBvbmVudDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGFyZ2V0Q29tcG9uZW50O1xufTtcbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9wcm9wVHlwZXMgPSByZXF1aXJlKCdwcm9wLXR5cGVzJyk7XG5cbnZhciBfcHJvcFR5cGVzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Byb3BUeXBlcyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9vYmplY3RXaXRob3V0UHJvcGVydGllcyhvYmosIGtleXMpIHsgdmFyIHRhcmdldCA9IHt9OyBmb3IgKHZhciBpIGluIG9iaikgeyBpZiAoa2V5cy5pbmRleE9mKGkpID49IDApIGNvbnRpbnVlOyBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGkpKSBjb250aW51ZTsgdGFyZ2V0W2ldID0gb2JqW2ldOyB9IHJldHVybiB0YXJnZXQ7IH1cblxudmFyIEljb25CYXNlID0gZnVuY3Rpb24gSWNvbkJhc2UoX3JlZiwgX3JlZjIpIHtcbiAgdmFyIGNoaWxkcmVuID0gX3JlZi5jaGlsZHJlbjtcbiAgdmFyIGNvbG9yID0gX3JlZi5jb2xvcjtcbiAgdmFyIHNpemUgPSBfcmVmLnNpemU7XG4gIHZhciBzdHlsZSA9IF9yZWYuc3R5bGU7XG4gIHZhciB3aWR0aCA9IF9yZWYud2lkdGg7XG4gIHZhciBoZWlnaHQgPSBfcmVmLmhlaWdodDtcblxuICB2YXIgcHJvcHMgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMoX3JlZiwgWydjaGlsZHJlbicsICdjb2xvcicsICdzaXplJywgJ3N0eWxlJywgJ3dpZHRoJywgJ2hlaWdodCddKTtcblxuICB2YXIgX3JlZjIkcmVhY3RJY29uQmFzZSA9IF9yZWYyLnJlYWN0SWNvbkJhc2U7XG4gIHZhciByZWFjdEljb25CYXNlID0gX3JlZjIkcmVhY3RJY29uQmFzZSA9PT0gdW5kZWZpbmVkID8ge30gOiBfcmVmMiRyZWFjdEljb25CYXNlO1xuXG4gIHZhciBjb21wdXRlZFNpemUgPSBzaXplIHx8IHJlYWN0SWNvbkJhc2Uuc2l6ZSB8fCAnMWVtJztcbiAgcmV0dXJuIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KCdzdmcnLCBfZXh0ZW5kcyh7XG4gICAgY2hpbGRyZW46IGNoaWxkcmVuLFxuICAgIGZpbGw6ICdjdXJyZW50Q29sb3InLFxuICAgIHByZXNlcnZlQXNwZWN0UmF0aW86ICd4TWlkWU1pZCBtZWV0JyxcbiAgICBoZWlnaHQ6IGhlaWdodCB8fCBjb21wdXRlZFNpemUsXG4gICAgd2lkdGg6IHdpZHRoIHx8IGNvbXB1dGVkU2l6ZVxuICB9LCByZWFjdEljb25CYXNlLCBwcm9wcywge1xuICAgIHN0eWxlOiBfZXh0ZW5kcyh7XG4gICAgICB2ZXJ0aWNhbEFsaWduOiAnbWlkZGxlJyxcbiAgICAgIGNvbG9yOiBjb2xvciB8fCByZWFjdEljb25CYXNlLmNvbG9yXG4gICAgfSwgcmVhY3RJY29uQmFzZS5zdHlsZSB8fCB7fSwgc3R5bGUpXG4gIH0pKTtcbn07XG5cbkljb25CYXNlLnByb3BUeXBlcyA9IHtcbiAgY29sb3I6IF9wcm9wVHlwZXMyLmRlZmF1bHQuc3RyaW5nLFxuICBzaXplOiBfcHJvcFR5cGVzMi5kZWZhdWx0Lm9uZU9mVHlwZShbX3Byb3BUeXBlczIuZGVmYXVsdC5zdHJpbmcsIF9wcm9wVHlwZXMyLmRlZmF1bHQubnVtYmVyXSksXG4gIHdpZHRoOiBfcHJvcFR5cGVzMi5kZWZhdWx0Lm9uZU9mVHlwZShbX3Byb3BUeXBlczIuZGVmYXVsdC5zdHJpbmcsIF9wcm9wVHlwZXMyLmRlZmF1bHQubnVtYmVyXSksXG4gIGhlaWdodDogX3Byb3BUeXBlczIuZGVmYXVsdC5vbmVPZlR5cGUoW19wcm9wVHlwZXMyLmRlZmF1bHQuc3RyaW5nLCBfcHJvcFR5cGVzMi5kZWZhdWx0Lm51bWJlcl0pLFxuICBzdHlsZTogX3Byb3BUeXBlczIuZGVmYXVsdC5vYmplY3Rcbn07XG5cbkljb25CYXNlLmNvbnRleHRUeXBlcyA9IHtcbiAgcmVhY3RJY29uQmFzZTogX3Byb3BUeXBlczIuZGVmYXVsdC5zaGFwZShJY29uQmFzZS5wcm9wVHlwZXMpXG59O1xuXG5leHBvcnRzLmRlZmF1bHQgPSBJY29uQmFzZTtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfcmVhY3RJY29uQmFzZSA9IHJlcXVpcmUoJ3JlYWN0LWljb24tYmFzZScpO1xuXG52YXIgX3JlYWN0SWNvbkJhc2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3RJY29uQmFzZSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBHb01hcmtHaXRodWIgPSBmdW5jdGlvbiBHb01hcmtHaXRodWIocHJvcHMpIHtcbiAgICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgIF9yZWFjdEljb25CYXNlMi5kZWZhdWx0LFxuICAgICAgICBfZXh0ZW5kcyh7IHZpZXdCb3g6ICcwIDAgNDAgNDAnIH0sIHByb3BzKSxcbiAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAnZycsXG4gICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoJ3BhdGgnLCB7IGQ6ICdtMjAgMGMtMTEgMC0yMCA5LTIwIDIwIDAgOC44IDUuNyAxNi4zIDEzLjcgMTkgMSAwLjIgMS4zLTAuNSAxLjMtMSAwLTAuNSAwLTIgMC0zLjctNS41IDEuMi02LjctMi40LTYuNy0yLjQtMC45LTIuMy0yLjItMi45LTIuMi0yLjktMS45LTEuMiAwLjEtMS4yIDAuMS0xLjIgMiAwLjEgMy4xIDIuMSAzLjEgMi4xIDEuNyAzIDQuNiAyLjEgNS44IDEuNiAwLjItMS4zIDAuNy0yLjIgMS4zLTIuNy00LjUtMC41LTkuMi0yLjItOS4yLTkuOCAwLTIuMiAwLjgtNCAyLjEtNS40LTAuMi0wLjUtMC45LTIuNiAwLjItNS4zIDAgMCAxLjctMC41IDUuNSAyIDEuNi0wLjQgMy4zLTAuNiA1LTAuNiAxLjcgMCAzLjQgMC4yIDUgMC43IDMuOC0yLjYgNS41LTIuMSA1LjUtMi4xIDEuMSAyLjggMC40IDQuOCAwLjIgNS4zIDEuMyAxLjQgMi4xIDMuMiAyLjEgNS40IDAgNy42LTQuNyA5LjMtOS4yIDkuOCAwLjcgMC42IDEuNCAxLjkgMS40IDMuNyAwIDIuNyAwIDQuOSAwIDUuNSAwIDAuNiAwLjMgMS4yIDEuMyAxIDgtMi43IDEzLjctMTAuMiAxMy43LTE5IDAtMTEtOS0yMC0yMC0yMHonIH0pXG4gICAgICAgIClcbiAgICApO1xufTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gR29NYXJrR2l0aHViO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9yZWFjdEljb25CYXNlID0gcmVxdWlyZSgncmVhY3QtaWNvbi1iYXNlJyk7XG5cbnZhciBfcmVhY3RJY29uQmFzZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdEljb25CYXNlKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIEdvVGhyZWVCYXJzID0gZnVuY3Rpb24gR29UaHJlZUJhcnMocHJvcHMpIHtcbiAgICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgIF9yZWFjdEljb25CYXNlMi5kZWZhdWx0LFxuICAgICAgICBfZXh0ZW5kcyh7IHZpZXdCb3g6ICcwIDAgNDAgNDAnIH0sIHByb3BzKSxcbiAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAnZycsXG4gICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoJ3BhdGgnLCB7IGQ6ICdtNSA3LjV2NWgzMHYtNWgtMzB6IG0wIDE1aDMwdi01aC0zMHY1eiBtMCAxMGgzMHYtNWgtMzB2NXonIH0pXG4gICAgICAgIClcbiAgICApO1xufTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gR29UaHJlZUJhcnM7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IGhvaXN0Tm9uUmVhY3RTdGF0aWNzIGZyb20gJ2hvaXN0LW5vbi1yZWFjdC1zdGF0aWNzJztcbmltcG9ydCBsb2NhbGVTZXJ2aWNlIGZyb20gJy4vLi4vc2VydmljZXMvTG9jYWxlU2VydmljZSc7XG5pbXBvcnQgaTE4blNlcnZpY2UgZnJvbSAnLi8uLi9zZXJ2aWNlcy9JMThuU2VydmljZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvY2FsZUF3YXJlKENvbXBvbmVudCkge1xuICBjbGFzcyBMb2NhbGVBd2FyZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMsIGNvbnRleHQpIHtcbiAgICAgIHN1cGVyKHByb3BzLCBjb250ZXh0KTtcbiAgICAgIHRoaXMuaGFuZGxlTG9jYWxlQ2hhbmdlID0gdGhpcy5oYW5kbGVMb2NhbGVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgICAgIHRoaXMudW5yZWdpc3RlckxvY2FsZUNoYW5nZSA9IG51bGw7XG4gICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICBsb2NhbGU6IGxvY2FsZVNlcnZpY2UubG9jYWxlXG4gICAgICB9O1xuICAgICAgdGhpcy5fbW91bnRlZCA9IGZhbHNlO1xuICAgICAgdGhpcy5fY29tcG9uZW50ID0gbnVsbDtcbiAgICB9XG5cbiAgICBoYW5kbGVMb2NhbGVDaGFuZ2UobG9jYWxlKSB7XG4gICAgICB0aGlzLl9tb3VudGVkICYmIHRoaXMuc3RhdGUubG9jYWxlICE9PSBsb2NhbGUgJiYgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGxvY2FsZVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICB0aGlzLnVucmVnaXN0ZXJMb2NhbGVDaGFuZ2UgPSBsb2NhbGVTZXJ2aWNlLm9uTG9jYWxlQ2hhbmdlKHRoaXMuaGFuZGxlTG9jYWxlQ2hhbmdlKTtcbiAgICAgIHRoaXMuX21vdW50ZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgICAgdGhpcy5fbW91bnRlZCA9IGZhbHNlO1xuICAgICAgdGhpcy51bnJlZ2lzdGVyTG9jYWxlQ2hhbmdlKCk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgY29uc3QgeyBsb2NhbGUgfSA9IHRoaXMuc3RhdGU7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8Q29tcG9uZW50IHsgLi4udGhpcy5wcm9wcyB9XG4gICAgICAgICAgbG9jYWxlPXsgbG9jYWxlIH1cbiAgICAgICAgICB0cmFuc2xhdGlvbnM9eyBpMThuU2VydmljZS5jdXJyZW50TGFuZ1RyYW5zbGF0aW9ucyB9XG4gICAgICAgICAgcmVmPXsgY29tcCA9PiB0aGlzLl9jb21wb25lbnQgPSBjb21wIH1cbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgTG9jYWxlQXdhcmUuZGlzcGxheU5hbWUgPSBgTG9jYWxlQXdhcmUoJHtcbiAgICBDb21wb25lbnQuZGlzcGxheU5hbWUgfHxcbiAgICBDb21wb25lbnQubmFtZSB8fFxuICAgICdDb21wb25lbnQnXG4gIH0pYDtcblxuICByZXR1cm4gaG9pc3ROb25SZWFjdFN0YXRpY3MoTG9jYWxlQXdhcmUsIENvbXBvbmVudCk7XG59XG4iLCJpbXBvcnQgbG9jYWxlU2VydmljZSBmcm9tICcuL0xvY2FsZVNlcnZpY2UnO1xuXG5jb25zdCBlbXB0eU9iaiA9IHt9O1xuXG5jbGFzcyBJMThuU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGxvY2FsZVNlcnZpY2Uub25Mb2NhbGVDaGFuZ2UodGhpcy5faGFuZGxlTG9jYWxlQ2hhbmdlLmJpbmQodGhpcykpO1xuICAgIHRoaXMuX2xvY2FsZSA9IGxvY2FsZVNlcnZpY2UubG9jYWxlO1xuICAgIHRoaXMuX3RyYW5zbGF0aW9ucyA9IHt9O1xuICB9XG5cbiAgX2hhbmRsZUxvY2FsZUNoYW5nZShsb2NhbGUpIHtcbiAgICB0aGlzLl9sb2NhbGUgPSBsb2NhbGU7XG4gIH1cblxuICBjbGVhclRyYW5zbGF0aW9ucyhsYW5nKSB7XG4gICAgZGVsZXRlIHRoaXMuX3RyYW5zbGF0aW9uc1tsYW5nXTtcbiAgfVxuXG4gIHJlZ2lzdGVyVHJhbnNsYXRpb25zKHRyYW5zbGF0aW9ucykge1xuICAgIHRoaXMuX3RyYW5zbGF0aW9ucyA9IE9iamVjdC5rZXlzKHRyYW5zbGF0aW9ucykucmVkdWNlKChhY2MsIGxhbmcpID0+IHtcbiAgICAgIGFjY1tsYW5nXSA9IHtcbiAgICAgICAgLi4udGhpcy5fdHJhbnNsYXRpb25zW2xhbmddLFxuICAgICAgICAuLi50cmFuc2xhdGlvbnNbbGFuZ11cbiAgICAgIH07XG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHRoaXMuX3RyYW5zbGF0aW9ucyk7XG4gIH1cblxuICB0cmFuc2xhdGUobXNnKSB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudExhbmdUcmFuc2xhdGlvbnNbbXNnXTtcbiAgfVxuXG4gIGdldCB0cmFuc2xhdGlvbnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RyYW5zbGF0aW9ucztcbiAgfVxuXG4gIGdldCBjdXJyZW50TGFuZ1RyYW5zbGF0aW9ucygpIHtcbiAgICByZXR1cm4gdGhpcy5fdHJhbnNsYXRpb25zW3RoaXMuX2xvY2FsZS5sYW5nXSB8fCBlbXB0eU9iajtcbiAgfVxufVxuXG5jb25zdCBpMThuU2VydmljZSA9IG5ldyBJMThuU2VydmljZSgpO1xuZXhwb3J0IGRlZmF1bHQgaTE4blNlcnZpY2U7XG4iLCJcbmNvbnN0IGRlZmF1bHRMb2NhbGUgPSB7XG4gIGRpcjogJ2x0cicsXG4gIGxhbmc6ICdlbidcbn07XG5cbmNsYXNzIExvY2FsZVNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9jYWxsYmFja3MgPSBbXTtcbiAgICB0aGlzLl9sb2NhbGVBdHRycyA9IE9iamVjdC5rZXlzKGRlZmF1bHRMb2NhbGUpO1xuICAgIHRoaXMuX3Jvb3RFbGVtZW50ID0gd2luZG93LmRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICB0aGlzLl9sb2NhbGVBdHRycy5mb3JFYWNoKChhdHRyKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuX3Jvb3RFbGVtZW50LmdldEF0dHJpYnV0ZShhdHRyKSkge1xuICAgICAgICB0aGlzLl9yb290RWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0ciwgZGVmYXVsdExvY2FsZVthdHRyXSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5fbG9jYWxlID0gdGhpcy5fbG9jYWxlQXR0cnMucmVkdWNlKChhY2MsIGF0dHIpID0+IHtcbiAgICAgIGFjY1thdHRyXSA9IHRoaXMuX3Jvb3RFbGVtZW50LmdldEF0dHJpYnV0ZShhdHRyKTtcbiAgICAgIHJldHVybiBhY2M7XG4gICAgfSwge30pO1xuICAgIHRoaXMuX29ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy5faGFuZGxlTXV0YXRpb25zLmJpbmQodGhpcykpO1xuICAgIHRoaXMuX29ic2VydmVyLm9ic2VydmUodGhpcy5fcm9vdEVsZW1lbnQsIHtcbiAgICAgIGF0dHJpYnV0ZXM6IHRydWVcbiAgICB9KTtcbiAgfVxuXG4gIF9oYW5kbGVNdXRhdGlvbnMobXV0YXRpb25zKSB7XG4gICAgbXV0YXRpb25zLmZvckVhY2goKG11dGF0aW9uKSA9PiB7XG4gICAgICBjb25zdCBtdXRhdGlvbkF0dHJpYnV0ZU5hbWUgPSBtdXRhdGlvbi5hdHRyaWJ1dGVOYW1lO1xuICAgICAgaWYgKHRoaXMuX2xvY2FsZUF0dHJzLmluY2x1ZGVzKG11dGF0aW9uQXR0cmlidXRlTmFtZSkpIHtcbiAgICAgICAgdGhpcy5fbG9jYWxlID0ge1xuICAgICAgICAgIC4uLnRoaXMuX2xvY2FsZSxcbiAgICAgICAgICBbbXV0YXRpb25BdHRyaWJ1dGVOYW1lXTogdGhpcy5fcm9vdEVsZW1lbnQuZ2V0QXR0cmlidXRlKG11dGF0aW9uQXR0cmlidXRlTmFtZSlcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tzLmZvckVhY2goY2FsbGJhY2sgPT4gY2FsbGJhY2sodGhpcy5fbG9jYWxlKSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzZXQgbG9jYWxlKGxvY2FsZU9iaikge1xuICAgIE9iamVjdC5rZXlzKGxvY2FsZU9iaikuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICB0aGlzLl9yb290RWxlbWVudC5zZXRBdHRyaWJ1dGUoa2V5LCBsb2NhbGVPYmpba2V5XSk7XG4gICAgfSk7XG4gIH1cblxuICBnZXQgbG9jYWxlKCkge1xuICAgIHJldHVybiB0aGlzLl9sb2NhbGU7XG4gIH1cblxuICBvbkxvY2FsZUNoYW5nZShjYWxsYmFjaykge1xuICAgIHRoaXMuX2NhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcbiAgICBjYWxsYmFjayh0aGlzLmxvY2FsZSk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcy5maWx0ZXIoY2IgPT4gY2IgIT09IGNhbGxiYWNrKTtcbiAgICB9O1xuICB9XG59XG5cbmNvbnN0IGxvY2FsZVNlcnZpY2UgPSBuZXcgTG9jYWxlU2VydmljZSgpO1xuZXhwb3J0IGRlZmF1bHQgbG9jYWxlU2VydmljZTtcbiIsIlxuaW1wb3J0IExvY2FsZVNlcnZpY2UgZnJvbSAnLi4vLi4vc2VydmljZXMvTG9jYWxlU2VydmljZSc7XG5pbXBvcnQgZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uIGZyb20gJy4uL2ludGVybmFscy9lbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24nO1xuXG5jb25zdCByZWdpc3RyYXRpb25OYW1lID0gJ0RCVUlXZWJDb21wb25lbnRCYXNlJztcblxuZnVuY3Rpb24gZGVmaW5lQ29tbW9uQ1NTVmFycygpIHtcbiAgY29uc3QgY29tbW9uU3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICBjb21tb25TdHlsZS5pbm5lckhUTUwgPSBgXG4gIDpyb290IHtcbiAgICAtLWRidWktd2ViLWNvbXBvbmVudC1nbG9iYWwtYm9yZGVyLXJhZGl1czogNXB4O1xuICAgIC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtaGVpZ2h0OiAzMHB4O1xuICAgIC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtY29sb3I6ICMwMDA7XG4gICAgLS1kYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC1iYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICAtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWJvcmRlci1jb2xvcjogI2NjYztcbiAgICAtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWJvcmRlci1zdHlsZTogc29saWQ7XG4gICAgLS1kYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC1ib3JkZXItd2lkdGg6IDFweDtcbiAgfVxuICBgO1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdoZWFkJykuYXBwZW5kQ2hpbGQoY29tbW9uU3R5bGUpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXREQlVJV2ViQ29tcG9uZW50QmFzZSh3aW4pIHtcbiAgcmV0dXJuIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbih3aW4sIHJlZ2lzdHJhdGlvbk5hbWUsICgpID0+IHtcbiAgICBkZWZpbmVDb21tb25DU1NWYXJzKCk7XG5cbiAgICBjb25zdCB7IGRvY3VtZW50LCBIVE1MRWxlbWVudCwgY3VzdG9tRWxlbWVudHMgfSA9IHdpbjtcblxuICAgIGNsYXNzIERCVUlXZWJDb21wb25lbnRCYXNlIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuXG4gICAgICBzdGF0aWMgZ2V0IHJlZ2lzdHJhdGlvbk5hbWUoKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigncmVnaXN0cmF0aW9uTmFtZSBtdXN0IGJlIGRlZmluZWQgaW4gZGVyaXZlZCBjbGFzc2VzJyk7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgdGVtcGxhdGVJbm5lckhUTUwoKSB7XG4gICAgICAgIHJldHVybiAnPHN0eWxlPjwvc3R5bGU+PHNsb3Q+PC9zbG90Pic7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgZGVwZW5kZW5jaWVzKCkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgdXNlU2hhZG93KCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCBwcm9wZXJ0aWVzVG9VcGdyYWRlKCkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgcHJvcGVydGllc1RvRGVmaW5lKCkge1xuICAgICAgICByZXR1cm4ge307XG4gICAgICB9XG5cbiAgICAgIGdldCBpbnN0YW5jZVByb3BlcnRpZXNUb0RlZmluZSgpIHtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgfVxuXG4gICAgICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgY29uc3QgeyB1c2VTaGFkb3cgfSA9IHRoaXMuY29uc3RydWN0b3I7XG4gICAgICAgIGlmICh1c2VTaGFkb3cpIHtcbiAgICAgICAgICB0aGlzLmF0dGFjaFNoYWRvdyh7XG4gICAgICAgICAgICBtb2RlOiAnb3BlbicsXG4gICAgICAgICAgICAvLyBkZWxlZ2F0ZXNGb2N1czogdHJ1ZVxuICAgICAgICAgICAgLy8gTm90IHdvcmtpbmcgb24gSVBhZCBzbyB3ZSBkbyBhbiB3b3JrYXJvdW5kXG4gICAgICAgICAgICAvLyBieSBzZXR0aW5nIFwiZm9jdXNlZFwiIGF0dHJpYnV0ZSB3aGVuIG5lZWRlZC5cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9pc0Nvbm5lY3RlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9pbnNlcnRUZW1wbGF0ZSgpO1xuXG4gICAgICAgIHRoaXMuY29ubmVjdGVkQ2FsbGJhY2sgPSB0aGlzLmNvbm5lY3RlZENhbGxiYWNrLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuZGlzY29ubmVjdGVkQ2FsbGJhY2sgPSB0aGlzLmRpc2Nvbm5lY3RlZENhbGxiYWNrLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuX2hhbmRsZUxvY2FsZUNoYW5nZSA9IHRoaXMuX2hhbmRsZUxvY2FsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm9uTG9jYWxlQ2hhbmdlICYmICh0aGlzLm9uTG9jYWxlQ2hhbmdlID0gdGhpcy5vbkxvY2FsZUNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy51bnJlZ2lzdGVyTG9jYWxlQ2hhbmdlID0gbnVsbDtcblxuICAgICAgICAvLyBwcm92aWRlIHN1cHBvcnQgZm9yIHRyYWl0cyBpZiBhbnkgYXMgdGhleSBjYW50IG92ZXJyaWRlIGNvbnN0cnVjdG9yXG4gICAgICAgIHRoaXMuaW5pdCAmJiB0aGlzLmluaXQoLi4uYXJncyk7XG4gICAgICB9XG5cbiAgICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL3dlYi9mdW5kYW1lbnRhbHMvd2ViLWNvbXBvbmVudHMvYmVzdC1wcmFjdGljZXMjbGF6eS1wcm9wZXJ0aWVzXG4gICAgICAvLyBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS93ZWIvZnVuZGFtZW50YWxzL3dlYi1jb21wb25lbnRzL2V4YW1wbGVzL2hvd3RvLWNoZWNrYm94XG4gICAgICAvKiBlc2xpbnQgbm8tcHJvdG90eXBlLWJ1aWx0aW5zOiAwICovXG4gICAgICBfdXBncmFkZVByb3BlcnR5KHByb3ApIHtcbiAgICAgICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXNbcHJvcF07XG4gICAgICAgICAgZGVsZXRlIHRoaXNbcHJvcF07XG4gICAgICAgICAgdGhpc1twcm9wXSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIF9kZWZpbmVQcm9wZXJ0eShrZXksIHZhbHVlKSB7XG4gICAgICAgIGlmICghdGhpcy5oYXNBdHRyaWJ1dGUoa2V5KSkge1xuICAgICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKGtleSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgICB0aGlzLl9pc0Nvbm5lY3RlZCA9IHRydWU7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdiZWZvcmV1bmxvYWQnLCB0aGlzLmRpc2Nvbm5lY3RlZENhbGxiYWNrLCBmYWxzZSk7XG4gICAgICAgIHRoaXMudW5yZWdpc3RlckxvY2FsZUNoYW5nZSA9XG4gICAgICAgICAgTG9jYWxlU2VydmljZS5vbkxvY2FsZUNoYW5nZSh0aGlzLl9oYW5kbGVMb2NhbGVDaGFuZ2UpO1xuICAgICAgICBjb25zdCB7IHByb3BlcnRpZXNUb1VwZ3JhZGUsIHByb3BlcnRpZXNUb0RlZmluZSB9ID0gdGhpcy5jb25zdHJ1Y3RvcjtcbiAgICAgICAgY29uc3QgeyBpbnN0YW5jZVByb3BlcnRpZXNUb0RlZmluZSB9ID0gdGhpcztcbiAgICAgICAgY29uc3QgYWxsUHJvcGVydGllc1RvRGVmaW5lID0ge1xuICAgICAgICAgIC4uLnByb3BlcnRpZXNUb0RlZmluZSxcbiAgICAgICAgICAuLi5pbnN0YW5jZVByb3BlcnRpZXNUb0RlZmluZVxuICAgICAgICB9O1xuICAgICAgICBwcm9wZXJ0aWVzVG9VcGdyYWRlLmZvckVhY2goKHByb3BlcnR5KSA9PiB7XG4gICAgICAgICAgdGhpcy5fdXBncmFkZVByb3BlcnR5KHByb3BlcnR5KTtcbiAgICAgICAgfSk7XG4gICAgICAgIE9iamVjdC5rZXlzKGFsbFByb3BlcnRpZXNUb0RlZmluZSkuZm9yRWFjaCgocHJvcGVydHkpID0+IHtcbiAgICAgICAgICB0aGlzLl9kZWZpbmVQcm9wZXJ0eShwcm9wZXJ0eSwgYWxsUHJvcGVydGllc1RvRGVmaW5lW3Byb3BlcnR5XSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgICAgdGhpcy5faXNDb25uZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy51bnJlZ2lzdGVyTG9jYWxlQ2hhbmdlKCk7XG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdiZWZvcmV1bmxvYWQnLCB0aGlzLmRpc2Nvbm5lY3RlZENhbGxiYWNrLCBmYWxzZSk7XG4gICAgICB9XG5cbiAgICAgIGdldCBjaGlsZHJlblRyZWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLnVzZVNoYWRvdyA/IHRoaXMuc2hhZG93Um9vdCA6IHRoaXM7XG4gICAgICB9XG5cbiAgICAgIF9pbnNlcnRUZW1wbGF0ZSgpIHtcbiAgICAgICAgY29uc3QgeyB0ZW1wbGF0ZSB9ID0gdGhpcy5jb25zdHJ1Y3RvcjtcblxuICAgICAgICBpZiAodGVtcGxhdGUpIHtcbiAgICAgICAgICB0aGlzLmNoaWxkcmVuVHJlZS5hcHBlbmRDaGlsZCh0ZW1wbGF0ZS5jb250ZW50LmNsb25lTm9kZSh0cnVlKSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgX2hhbmRsZUxvY2FsZUNoYW5nZShsb2NhbGUpIHtcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2RpcicsIGxvY2FsZS5kaXIpO1xuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnbGFuZycsIGxvY2FsZS5sYW5nKTtcbiAgICAgICAgdGhpcy5vbkxvY2FsZUNoYW5nZSAmJiB0aGlzLm9uTG9jYWxlQ2hhbmdlKGxvY2FsZSk7XG4gICAgICB9XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzKGtsYXNzKSB7XG4gICAgICBjb25zdCB0ZW1wbGF0ZUlubmVySFRNTCA9IGtsYXNzLnRlbXBsYXRlSW5uZXJIVE1MO1xuICAgICAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAgICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gdGVtcGxhdGVJbm5lckhUTUw7XG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShrbGFzcywgJ3RlbXBsYXRlJywge1xuICAgICAgICBnZXQoKSB7IHJldHVybiB0ZW1wbGF0ZTsgfSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfSk7XG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShrbGFzcywgJ2NvbXBvbmVudFN0eWxlJywge1xuICAgICAgICBnZXQoKSB7XG4gICAgICAgICAgcmV0dXJuIGtsYXNzLnRlbXBsYXRlLmNvbnRlbnQucXVlcnlTZWxlY3Rvcignc3R5bGUnKS5pbm5lckhUTUw7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCh2YWx1ZSkge1xuICAgICAgICAgIGtsYXNzLnRlbXBsYXRlLmNvbnRlbnQucXVlcnlTZWxlY3Rvcignc3R5bGUnKS5pbm5lckhUTUwgPSB2YWx1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBrbGFzcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBSZWdpc3RlcmFibGUoa2xhc3MpIHtcbiAgICAgIGtsYXNzLnJlZ2lzdGVyU2VsZiA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgcmVnaXN0cmF0aW9uTmFtZSA9IGtsYXNzLnJlZ2lzdHJhdGlvbk5hbWU7XG4gICAgICAgIGNvbnN0IGRlcGVuZGVuY2llcyA9IGtsYXNzLmRlcGVuZGVuY2llcztcbiAgICAgICAgLy8gTWFrZSBzdXJlIG91ciBkZXBlbmRlbmNpZXMgYXJlIHJlZ2lzdGVyZWQgYmVmb3JlIHdlIHJlZ2lzdGVyIHNlbGZcbiAgICAgICAgZGVwZW5kZW5jaWVzLmZvckVhY2goKGRlcGVuZGVuY3kpID0+IGRlcGVuZGVuY3kucmVnaXN0ZXJTZWxmKCkpO1xuICAgICAgICAvLyBEb24ndCB0cnkgdG8gcmVnaXN0ZXIgc2VsZiBpZiBhbHJlYWR5IHJlZ2lzdGVyZWRcbiAgICAgICAgaWYgKGN1c3RvbUVsZW1lbnRzLmdldChyZWdpc3RyYXRpb25OYW1lKSkgcmV0dXJuIHJlZ2lzdHJhdGlvbk5hbWU7XG4gICAgICAgIC8vIEdpdmUgYSBjaGFuY2UgdG8gb3ZlcnJpZGUgd2ViLWNvbXBvbmVudCBzdHlsZSBpZiBwcm92aWRlZCBiZWZvcmUgYmVpbmcgcmVnaXN0ZXJlZC5cbiAgICAgICAgY29uc3QgY29tcG9uZW50U3R5bGUgPSAoKHdpbi5EQlVJV2ViQ29tcG9uZW50cyB8fCB7fSlbcmVnaXN0cmF0aW9uTmFtZV0gfHwge30pLmNvbXBvbmVudFN0eWxlO1xuICAgICAgICBpZiAoY29tcG9uZW50U3R5bGUpIHtcbiAgICAgICAgICBrbGFzcy5jb21wb25lbnRTdHlsZSArPSBjb21wb25lbnRTdHlsZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBEbyByZWdpc3RyYXRpb25cbiAgICAgICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKHJlZ2lzdHJhdGlvbk5hbWUsIGtsYXNzKTtcbiAgICAgICAgcmV0dXJuIHJlZ2lzdHJhdGlvbk5hbWU7XG4gICAgICB9O1xuXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoa2xhc3MsICdwcm90b3R5cGVDaGFpbkluZm8nLCB7XG4gICAgICAgIGdldCgpIHtcbiAgICAgICAgICBjb25zdCBjaGFpbiA9IFtrbGFzc107XG4gICAgICAgICAgbGV0IHBhcmVudFByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGtsYXNzKTtcbiAgICAgICAgICB3aGlsZSAocGFyZW50UHJvdG8gIT09IEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICBjaGFpbi5wdXNoKHBhcmVudFByb3RvKTtcbiAgICAgICAgICAgIHBhcmVudFByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHBhcmVudFByb3RvKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2hhaW4ucHVzaChwYXJlbnRQcm90byk7XG4gICAgICAgICAgcmV0dXJuIGNoYWluO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIGtsYXNzO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBEQlVJV2ViQ29tcG9uZW50QmFzZSxcbiAgICAgIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMsXG4gICAgICBSZWdpc3RlcmFibGVcbiAgICB9O1xuICB9KTtcbn1cbiIsIlxuaW1wb3J0IGdldERCVUlXZWJDb21wb25lbnRCYXNlIGZyb20gJy4uL0RCVUlXZWJDb21wb25lbnRCYXNlL0RCVUlXZWJDb21wb25lbnRCYXNlJztcbmltcG9ydCBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24gZnJvbSAnLi4vaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbic7XG5cbmNvbnN0IHJlZ2lzdHJhdGlvbk5hbWUgPSAnZGJ1aS13ZWItY29tcG9uZW50LWR1bW15JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0REJVSVdlYkNvbXBvbmVudER1bW15KHdpbikge1xuICByZXR1cm4gZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uKHdpbiwgcmVnaXN0cmF0aW9uTmFtZSwgKCkgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIERCVUlXZWJDb21wb25lbnRCYXNlLFxuICAgICAgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyxcbiAgICAgIFJlZ2lzdGVyYWJsZVxuICAgIH0gPSBnZXREQlVJV2ViQ29tcG9uZW50QmFzZSh3aW4pO1xuXG4gICAgY2xhc3MgREJVSVdlYkNvbXBvbmVudER1bW15IGV4dGVuZHMgREJVSVdlYkNvbXBvbmVudEJhc2Uge1xuXG4gICAgICBzdGF0aWMgZ2V0IHJlZ2lzdHJhdGlvbk5hbWUoKSB7XG4gICAgICAgIHJldHVybiByZWdpc3RyYXRpb25OYW1lO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlSW5uZXJIVE1MKCkge1xuICAgICAgICByZXR1cm4gYFxuICAgICAgICAgIDxzdHlsZT5cbiAgICAgICAgICA6aG9zdCB7XG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgIG1heC13aWR0aDogNDAwcHg7XG4gICAgICAgICAgICBoZWlnaHQ6IHZhcigtLWRidWktaW5wdXQtaGVpZ2h0LCA1MHB4KTtcbiAgICAgICAgICAgIGNvbG9yOiBtYXJvb247XG4gICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCBncmF5O1xuICAgICAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgOmhvc3QgYiwgOmhvc3QgZGl2W3gtaGFzLXNsb3RdIHNwYW5beC1zbG90LXdyYXBwZXJdIHtcbiAgICAgICAgICAgIHVuaWNvZGUtYmlkaTogYmlkaS1vdmVycmlkZTtcbiAgICAgICAgICAgIHRleHQtc2hhZG93OiB2YXIoLS1kdW1teS1iLXRleHQtc2hhZG93LCBub25lKTtcbiAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgOmhvc3QoW2Rpcj1ydGxdKSBiIHtcbiAgICAgICAgICAgIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICA6aG9zdChbZGlyPWx0cl0pIGIge1xuICAgICAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiBvdmVybGluZTtcbiAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgOmhvc3QoW2Rpcj1sdHJdKSAjY29udGFpbmVyID4gZGl2W2Rpcj1ydGxdLFxuICAgICAgICAgIDpob3N0KFtkaXI9cnRsXSkgI2NvbnRhaW5lciA+IGRpdltkaXI9bHRyXSB7XG4gICAgICAgICAgICBkaXNwbGF5OiBub25lO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICA6aG9zdCAjY29udGFpbmVyID4gZGl2W3gtaGFzLXNsb3RdIHtcbiAgICAgICAgICAgIG1hcmdpbi1sZWZ0OiAwcHg7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgICNjb250YWluZXIge1xuICAgICAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgZmxleC1mbG93OiByb3cgbm93cmFwO1xuICAgICAgICAgICAgYWxpZ24taXRlbXM6IHN0cmV0Y2g7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgICNjb250YWluZXIgPiBkaXYge1xuICAgICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgZ3JheTtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IHZhcigtLWR1bW15LWlubmVyLXNlY3Rpb25zLWJvcmRlci1yYWRpdXMsIDBweCk7XG4gICAgICAgICAgICBmbGV4OiAxIDAgMCU7XG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgbWFyZ2luOiA1cHg7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgICNjb250YWluZXIgPiBkaXYgPiBkaXYge1xuICAgICAgICAgICAgbWFyZ2luOiBhdXRvO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICA8L3N0eWxlPlxuICAgICAgICAgIFxuICAgICAgICAgIDxkaXYgaWQ9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgIDxkaXYgZGlyPVwibHRyXCI+XG4gICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGI+RHVtbXkgc2hhZG93PC9iPiBbTFRSXVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgXG4gICAgICAgICAgICA8ZGl2IHgtaGFzLXNsb3Q+XG4gICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPHNwYW4+Wzwvc3Bhbj48c3BhbiB4LXNsb3Qtd3JhcHBlcj48c2xvdD48L3Nsb3Q+PC9zcGFuPjxzcGFuPl08L3NwYW4+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIDxkaXYgZGlyPVwicnRsXCI+XG4gICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGI+RHVtbXkgc2hhZG93PC9iPiBbUlRMXVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuICAgICAgfVxuXG4gICAgICBvbkxvY2FsZUNoYW5nZShsb2NhbGUpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ29uTG9jYWxlQ2hhbmdlJywgbG9jYWxlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gUmVnaXN0ZXJhYmxlKFxuICAgICAgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyhcbiAgICAgICAgREJVSVdlYkNvbXBvbmVudER1bW15XG4gICAgICApXG4gICAgKTtcbiAgfSk7XG59XG5cbmdldERCVUlXZWJDb21wb25lbnREdW1teS5yZWdpc3RyYXRpb25OYW1lID0gcmVnaXN0cmF0aW9uTmFtZTtcblxuIiwiXG5cbmltcG9ydCBnZXREQlVJV2ViQ29tcG9uZW50QmFzZSBmcm9tICcuLi9EQlVJV2ViQ29tcG9uZW50QmFzZS9EQlVJV2ViQ29tcG9uZW50QmFzZSc7XG5pbXBvcnQgZ2V0REJVSVdlYkNvbXBvbmVudER1bW15IGZyb20gJy4uL0RCVUlXZWJDb21wb25lbnREdW1teS9EQlVJV2ViQ29tcG9uZW50RHVtbXknO1xuaW1wb3J0IGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbiBmcm9tICcuLi9pbnRlcm5hbHMvZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uJztcblxuY29uc3QgcmVnaXN0cmF0aW9uTmFtZSA9ICdkYnVpLXdlYi1jb21wb25lbnQtZHVtbXktcGFyZW50JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0REJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50KHdpbikge1xuICByZXR1cm4gZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uKHdpbiwgcmVnaXN0cmF0aW9uTmFtZSwgKCkgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIERCVUlXZWJDb21wb25lbnRCYXNlLFxuICAgICAgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyxcbiAgICAgIFJlZ2lzdGVyYWJsZVxuICAgIH0gPSBnZXREQlVJV2ViQ29tcG9uZW50QmFzZSh3aW4pO1xuICAgIGNvbnN0IERCVUlXZWJDb21wb25lbnREdW1teSA9IGdldERCVUlXZWJDb21wb25lbnREdW1teSh3aW4pO1xuXG4gICAgY2xhc3MgREJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50IGV4dGVuZHMgREJVSVdlYkNvbXBvbmVudEJhc2Uge1xuXG4gICAgICBzdGF0aWMgZ2V0IHJlZ2lzdHJhdGlvbk5hbWUoKSB7XG4gICAgICAgIHJldHVybiByZWdpc3RyYXRpb25OYW1lO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlSW5uZXJIVE1MKCkge1xuICAgICAgICByZXR1cm4gYFxuICAgICAgICAgIDxzdHlsZT5cbiAgICAgICAgICA6aG9zdCB7XG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgIG1heC13aWR0aDogNDAwcHg7XG4gICAgICAgICAgfVxuICAgICAgICAgIDwvc3R5bGU+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxiPkR1bW15IFBhcmVudCBzaGFkb3c8L2I+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxkYnVpLXdlYi1jb21wb25lbnQtZHVtbXk+PHNsb3Q+PC9zbG90PjwvZGJ1aS13ZWItY29tcG9uZW50LWR1bW15PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIGA7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgZGVwZW5kZW5jaWVzKCkge1xuICAgICAgICByZXR1cm4gW0RCVUlXZWJDb21wb25lbnREdW1teV07XG4gICAgICB9XG5cbiAgICB9XG5cbiAgICByZXR1cm4gUmVnaXN0ZXJhYmxlKFxuICAgICAgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyhcbiAgICAgICAgREJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50XG4gICAgICApXG4gICAgKTtcbiAgfSk7XG59XG5cbmdldERCVUlXZWJDb21wb25lbnREdW1teVBhcmVudC5yZWdpc3RyYXRpb25OYW1lID0gcmVnaXN0cmF0aW9uTmFtZTtcblxuIiwiaW1wb3J0IGFwcGVuZFN0eWxlIGZyb20gJy4uL2ludGVybmFscy9hcHBlbmRTdHlsZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRidWlXZWJDb21wb25lbnRzU2V0VXAod2luKSB7XG4gIHJldHVybiB7XG4gICAgYXBwZW5kU3R5bGU6IGFwcGVuZFN0eWxlKHdpbilcbiAgfTtcbn1cbiIsIi8qXG5EQlVJV2ViQ29tcG9uZW50QmFzZSAoZnJvbSB3aGljaCBhbGwgd2ViLWNvbXBvbmVudHMgaW5oZXJpdClcbndpbGwgcmVhZCBjb21wb25lbnRTdHlsZSBmcm9tIHdpbi5EQlVJV2ViQ29tcG9uZW50c1xud2hlbiBrbGFzcy5yZWdpc3RlclNlbGYoKSBpcyBjYWxsZWQgZ2l2aW5nIGEgY2hhbmNlIHRvIG92ZXJyaWRlIGRlZmF1bHQgd2ViLWNvbXBvbmVudCBzdHlsZVxuanVzdCBiZWZvcmUgaXQgaXMgcmVnaXN0ZXJlZC5cbiovXG5jb25zdCBhcHBlbmRTdHlsZSA9ICh3aW4pID0+IChyZWdpc3RyYXRpb25OYW1lLCBjb21wb25lbnRTdHlsZSkgPT4ge1xuICBpZiAoIXdpbi5EQlVJV2ViQ29tcG9uZW50cykge1xuICAgIHdpbi5EQlVJV2ViQ29tcG9uZW50cyA9IHt9O1xuICB9XG4gIHdpbi5EQlVJV2ViQ29tcG9uZW50cyA9IHtcbiAgICAuLi53aW4uREJVSVdlYkNvbXBvbmVudHMsXG4gICAgW3JlZ2lzdHJhdGlvbk5hbWVdOiB7XG4gICAgICAuLi53aW4uREJVSVdlYkNvbXBvbmVudHNbcmVnaXN0cmF0aW9uTmFtZV0sXG4gICAgICBjb21wb25lbnRTdHlsZVxuICAgIH1cbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFwcGVuZFN0eWxlO1xuIiwiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbih3aW4sIG5hbWUsIGNhbGxiYWNrKSB7XG4gIGlmICghd2luLkRCVUlXZWJDb21wb25lbnRzKSB7XG4gICAgd2luLkRCVUlXZWJDb21wb25lbnRzID0geyByZWdpc3RyYXRpb25zOiB7fSB9O1xuICB9IGVsc2UgaWYgKCF3aW4uREJVSVdlYkNvbXBvbmVudHMucmVnaXN0cmF0aW9ucykge1xuICAgIHdpbi5EQlVJV2ViQ29tcG9uZW50cy5yZWdpc3RyYXRpb25zID0ge307XG4gIH1cblxuICBsZXQgcmVnaXN0cmF0aW9uID0gd2luLkRCVUlXZWJDb21wb25lbnRzLnJlZ2lzdHJhdGlvbnNbbmFtZV07XG5cbiAgaWYgKHJlZ2lzdHJhdGlvbikgcmV0dXJuIHJlZ2lzdHJhdGlvbjtcblxuICByZWdpc3RyYXRpb24gPSBjYWxsYmFjaygpO1xuICB3aW4uREJVSVdlYkNvbXBvbmVudHMucmVnaXN0cmF0aW9uc1tuYW1lXSA9IHJlZ2lzdHJhdGlvbjtcblxuICByZXR1cm4gd2luLkRCVUlXZWJDb21wb25lbnRzLnJlZ2lzdHJhdGlvbnNbbmFtZV07XG59XG5cbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgR29NYXJrR2l0aHViIGZyb20gJ3JlYWN0LWljb25zL2xpYi9nby9tYXJrLWdpdGh1Yic7XG5pbXBvcnQgR29UaHJlZUJhcnMgZnJvbSAncmVhY3QtaWNvbnMvbGliL2dvL3RocmVlLWJhcnMnO1xuaW1wb3J0IHsgc2NyZWVucywgc2NyZWVuTGlua3NHZW4gfSBmcm9tICcuL3NjcmVlbnMnO1xuaW1wb3J0IElGcmFtZVNjcmVlbiBmcm9tICcuL2ludGVybmFscy9yZWFjdENvbXBvbmVudHMvSUZyYW1lU2NyZWVuJztcbmltcG9ydCB7XG4gIHRvZ2dsZUFwcERpclxufSBmcm9tICcuL2ludGVybmFscy9hcHBVdGlscyc7XG5cbmNsYXNzIEFwcCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdoYXNoY2hhbmdlJywgdGhpcy5vbkhhc2hDaGFuZ2UuYmluZCh0aGlzKSk7XG4gICAgLy8gcmUtdXNpbmcgdGhlIGhlbHBlciBkZWZpbmVkIGZvciBpRnJhbWVcbiAgICB3aW5kb3cubWFrZVRhYnMoKTtcbiAgICB3aW5kb3cuaGlnaGxpZ2h0QmxvY2tzKCk7XG4gIH1cblxuICBvbkhhc2hDaGFuZ2UoKSB7XG4gICAgdGhpcy5mb3JjZVVwZGF0ZSgpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKCkge1xuICAgIHdpbmRvdy5tYWtlVGFicygpO1xuICAgIHdpbmRvdy5oaWdobGlnaHRCbG9ja3MoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgLyogZXNsaW50IG5vLWNvbnNvbGU6IDAgKi9cbiAgICAgIC8vIGNvbnNvbGUubG9nKCdyZW5kZXJpbmcgQXBwIGNvbXBvbmVudCcpO1xuICAgIH1cblxuICAgIGNvbnN0IHNjcmVlbnNLZXlzID0gT2JqZWN0LmtleXMoc2NyZWVucyk7XG4gICAgY29uc3Qgd2luZG93TG9jYXRpb25IYXNoID0gKHdpbmRvdy5sb2NhdGlvbi5oYXNoIHx8IGAjJHtzY3JlZW5zS2V5c1swXX1gKS5yZXBsYWNlKCcjJywgJycpO1xuXG4gICAgY29uc3QgbGlua3MgPSBzY3JlZW5MaW5rc0dlbi5tYXAoKHNlY3Rpb24sIGlkeCkgPT4ge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBrZXk9e2lkeH0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJsaW5rcy1zZWN0aW9uLWdyb3VwXCI+e3NlY3Rpb24udGl0bGV9PC9kaXY+XG4gICAgICAgICAgPHVsPlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBzZWN0aW9uLmxpbmtzLm1hcCgobGluaywgaWR4KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaXNBY3RpdmUgPSBsaW5rLnBhdGggPT09IHdpbmRvd0xvY2F0aW9uSGFzaCA/ICdhY3RpdmUnIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICA8bGkga2V5PXtpZHh9IHgtYWN0aXZlPXtpc0FjdGl2ZX0+XG4gICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9e2AjJHtsaW5rLnBhdGh9YH0+e2xpbmsudGl0bGV9PC9hPlxuICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIDwvdWw+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IFNjcmVlbiA9IHdpbmRvd0xvY2F0aW9uSGFzaC5lbmRzV2l0aCgnLmh0bWwnKSA/IElGcmFtZVNjcmVlbiA6IChzY3JlZW5zW3dpbmRvd0xvY2F0aW9uSGFzaF0gfHwgJ2RpdicpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFnZS1oZWFkZXJcIj5cbiAgICAgICAgICA8aDI+REVWIEJPWCBVSTwvaDI+PGFcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImhlYWQtbGlua1wiXG4gICAgICAgICAgICBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL2NhdGFsaW4tZW5hY2hlL2Rldi1ib3gtdWlcIlxuICAgICAgICAgICAgcmVsPVwibm9vcGVuZXIgbm9yZWZlcnJlclwiXG4gICAgICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIj48R29NYXJrR2l0aHViIHNpemU9ezI1fSAvPjwvYT5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGVtby13cmFwcGVyXCI+XG4gICAgICAgICAgPGxhYmVsIGlkPVwibGlua3MtdG9nZ2xlLWxhYmVsXCIgaHRtbEZvcj1cImxpbmtzLXRvZ2dsZVwiIGNsYXNzTmFtZT1cImhlYWQtbGlua1wiPjxHb1RocmVlQmFycyBzaXplPXsyNX0gLz48L2xhYmVsPlxuICAgICAgICAgIDxpbnB1dCBpZD1cImxpbmtzLXRvZ2dsZVwiIHR5cGU9XCJjaGVja2JveFwiIC8+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkZW1vLWxpbmtzXCIgb25DbGljaz17KCkgPT4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2xpbmtzLXRvZ2dsZScpLmNoZWNrZWQgPSBmYWxzZX0+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImxvY2FsZS1kaXItc3dpdGNoXCI+XG4gICAgICAgICAgICAgIDxhIGhyZWY9XCIjXCIgb25DbGljaz17dG9nZ2xlQXBwRGlyfT5UT0dHTEUgTE9DQUxFIERJUjwvYT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAge2xpbmtzfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGVtby1hcmVhXCI+XG4gICAgICAgICAgICA8U2NyZWVuLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFwcDtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge1xuICAvLyBvblNjcmVlbkNvbnNvbGUsXG4gIGxvY2FsZUF3YXJlXG59IGZyb20gJ2Rldi1ib3gtdWknO1xuaW1wb3J0IEFwcCBmcm9tICcuL2FwcCc7XG4vLyBkZWZpbmVzIHNvbWUgaGVscGVycyBvbiB3aW5kb3cgKHJldXNpbmcgY29kZSBuZWVkZWQgaW4gaUZyYW1lcylcbmltcG9ydCAnLi9pbnRlcm5hbHMvaUZyYW1lVXRpbHMvb25XaW5kb3dEZWZpbmVkSGVscGVycyc7XG5cbi8vIGltcG9ydCBnZXREQlVJV2ViQ29tcG9uZW50RHVtbXkgZnJvbSAnLi4vYnVpbGQvc3JjL2xpYi93ZWJjb21wb25lbnRzL0RCVUlXZWJDb21wb25lbnREdW1teS9EQlVJV2ViQ29tcG9uZW50RHVtbXknO1xuLy8gaW1wb3J0IGdldERCVUlXZWJDb21wb25lbnREdW1teVBhcmVudCBmcm9tICcuLi9idWlsZC9zcmMvbGliL3dlYmNvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50L0RCVUlXZWJDb21wb25lbnREdW1teVBhcmVudCc7XG5pbXBvcnQgZGJ1aVdlYkNvbXBvbmVudHNTZXRVcCBmcm9tICcuLi9zcmMvbGliL3dlYmNvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudHNTZXR1cC9EQlVJV2ViQ29tcG9uZW50c1NldHVwJztcbmltcG9ydCBnZXREQlVJV2ViQ29tcG9uZW50RHVtbXkgZnJvbSAnLi4vc3JjL2xpYi93ZWJjb21wb25lbnRzL0RCVUlXZWJDb21wb25lbnREdW1teS9EQlVJV2ViQ29tcG9uZW50RHVtbXknO1xuaW1wb3J0IGdldERCVUlXZWJDb21wb25lbnREdW1teVBhcmVudCBmcm9tICcuLi9zcmMvbGliL3dlYmNvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50L0RCVUlXZWJDb21wb25lbnREdW1teVBhcmVudCc7XG5cbmRidWlXZWJDb21wb25lbnRzU2V0VXAod2luZG93KS5hcHBlbmRTdHlsZSgnZGJ1aS13ZWItY29tcG9uZW50LWR1bW15JywgYFxuICBiIHtcbiAgICBjb2xvcjogZGVlcHNreWJsdWU7XG4gICAgZm9udC1zdHlsZTogb2JsaXF1ZTtcbiAgfVxuYCk7XG5cbmNvbnN0IERCVUlXZWJDb21wb25lbnREdW1teSA9IGdldERCVUlXZWJDb21wb25lbnREdW1teSh3aW5kb3cpO1xuY29uc3QgREJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50ID0gZ2V0REJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50KHdpbmRvdyk7XG5cblxuc2V0VGltZW91dCgoKSA9PiB7XG4gIERCVUlXZWJDb21wb25lbnREdW1teS5yZWdpc3RlclNlbGYoKTtcbiAgREJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50LnJlZ2lzdGVyU2VsZigpO1xufSwgMjAwMCk7XG5cbmNvbnN0IGlmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpO1xuXG53aW5kb3cub25tZXNzYWdlID0gZnVuY3Rpb24gKG1zZykgeyBjb25zb2xlLmxvZygnbXNnIGZyb20gaWZyYW1lJywgbXNnKTsgfTtcbmlmcmFtZS5vbmxvYWQgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gIGNvbnN0IHRhcmdldCA9IGV2dC50YXJnZXQ7XG5cbiAgdGFyZ2V0LmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQud3JpdGUoYFxuICAgIDxodG1sPlxuICAgIDxib2R5PlxuICAgICAgPGRidWktd2ViLWNvbXBvbmVudC1kdW1teVxuICAgICAgICBzdHlsZT1cImNvbG9yOiBibHVlXCJcbiAgICAgID5cbiAgICAgICAgPHNwYW4+aGVsbG8gd29ybGQgMzwvc3Bhbj5cbiAgICAgIDwvZGJ1aS13ZWItY29tcG9uZW50LWR1bW15PlxuICAgICAgPGRidWktd2ViLWNvbXBvbmVudC1kdW1teS1wYXJlbnQ+PC9kYnVpLXdlYi1jb21wb25lbnQtZHVtbXktcGFyZW50PlxuICAgIDwvYm9keT5cbiAgICA8c2NyaXB0PlxuICAgICAgd2luZG93Lm9ubWVzc2FnZSA9IGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ21zZyBmcm9tIHdpbmRvdycsIG1zZyk7XG4gICAgICAgIHdpbmRvdy50b3AucG9zdE1lc3NhZ2UoJ3dvcmxkJywgJyonKTtcbiAgICAgIH07XG4gICAgPC9zY3JpcHQ+XG4gICAgPC9odG1sPlxuICBgKTtcbiAgdGFyZ2V0LmNvbnRlbnRXaW5kb3cucG9zdE1lc3NhZ2UoJ2hlbGxvJywgJyonKTtcblxuICBkYnVpV2ViQ29tcG9uZW50c1NldFVwKHRhcmdldC5jb250ZW50V2luZG93KS5hcHBlbmRTdHlsZSgnZGJ1aS13ZWItY29tcG9uZW50LWR1bW15JywgYFxuICAgIGIge1xuICAgICAgZm9udC1zdHlsZTogb2JsaXF1ZTtcbiAgICAgIG9wYWNpdHk6IDAuNTtcbiAgICB9XG4gIGApO1xuICBjb25zdCBEQlVJV2ViQ29tcG9uZW50RHVtbXkyID0gZ2V0REJVSVdlYkNvbXBvbmVudER1bW15KHRhcmdldC5jb250ZW50V2luZG93KTtcbiAgY29uc3QgREJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50MiA9IGdldERCVUlXZWJDb21wb25lbnREdW1teVBhcmVudCh0YXJnZXQuY29udGVudFdpbmRvdyk7XG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIERCVUlXZWJDb21wb25lbnREdW1teTIucmVnaXN0ZXJTZWxmKCk7XG4gICAgREJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50Mi5yZWdpc3RlclNlbGYoKTtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgLy8gdGFyZ2V0LnJlbW92ZSgpO1xuICAgIH0sIDIwMDApO1xuICB9LCAyMDAwKTtcbn07XG5cbi8vIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcblxuXG4vLyBvblNjcmVlbkNvbnNvbGUoeyBvcHRpb25zOiB7IHNob3dMYXN0T25seTogZmFsc2UgfSB9KTtcblxubGV0IERlbW8gPSBjbGFzcyBEZW1vIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAvKiBlc2xpbnQgbm8tY29uc29sZTogMCAqL1xuICAgICAgLy8gY29uc29sZS5sb2coJ3JlbmRlcmluZyBEZW1vIGNvbXBvbmVudCcpO1xuICAgIH1cbiAgICBjb25zdCB7IGxvY2FsZTogeyBkaXIgfSB9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gKFxuICAgICAgPEFwcCAvPlxuICAgICk7XG4gIH1cbn07XG5cbkRlbW8ucHJvcFR5cGVzID0ge1xuICBsb2NhbGU6IFByb3BUeXBlcy5vYmplY3Rcbn07XG5cbkRlbW8gPSBsb2NhbGVBd2FyZShEZW1vKTtcblxuUmVhY3RET00ucmVuZGVyKChcbiAgPERlbW8vPlxuKSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RlbW8nKSk7XG4iLCIvKiAgZXNsaW50IGltcG9ydC9wcmVmZXItZGVmYXVsdC1leHBvcnQ6IDAgKi9cbmZ1bmN0aW9uIHRvZ2dsZUFwcERpcihldnQpIHtcbiAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gIGNvbnN0IGRvY3VtZW50RWxlbWVudCA9IHdpbmRvdy5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gIGNvbnN0IGN1cnJlbnREaXIgPSBkb2N1bWVudEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkaXInKTtcbiAgY29uc3QgbmV4dERpciA9IGN1cnJlbnREaXIgPT09ICdsdHInID8gJ3J0bCcgOiAnbHRyJztcbiAgZG9jdW1lbnRFbGVtZW50LnNldEF0dHJpYnV0ZSgnZGlyJywgbmV4dERpcik7XG59XG5cbmV4cG9ydCB7XG4gIHRvZ2dsZUFwcERpclxufTtcbiIsIi8qIGVzbGludCBpbXBvcnQvcHJlZmVyLWRlZmF1bHQtZXhwb3J0OiAwICovXG5cbmV4cG9ydCBjb25zdCBkaXN0cmlidXRpb25VUkwgPVxuICAnaHR0cHM6Ly9jYXRhbGluLWVuYWNoZS5naXRodWIuaW8vZGV2LWJveC11aS9idWlsZC9kaXN0L2pzL2Rldi1ib3gtdWktd2ViY29tcG9uZW50cy5qcyc7XG4iLCJcbndpbmRvdy5nZW5lcmF0ZUNvbXBvbmVudFByb3BlcnRpZXNUYWJsZSA9IGZ1bmN0aW9uIChkYXRhLCBzZWxlY3RvciA9ICcucHJvcGVydGllcycpIHtcbiAgY29uc3QgcHJvcGVydGllc0NvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICBjb25zdCBuYW1lcyA9IE9iamVjdC5rZXlzKGRhdGEpO1xuICBjb25zdCB0YWJsZSA9IGBcbjxoMyBjbGFzcz1cInNlY3Rpb25cIj5Qcm9wZXJ0aWVzPC9oMz5cbjx0YWJsZT5cbjx0aGVhZD5cbiAgPHRoIGNsYXNzPVwicHJvcC1uYW1lXCI+TmFtZTwvdGg+XG4gIDx0aCBjbGFzcz1cInByb3AtdHlwZVwiPlR5cGU8L3RoPlxuICA8dGggY2xhc3M9XCJwcm9wLWRlZmF1bHRcIj5EZWZhdWx0PC90aD5cbiAgPHRoIGNsYXNzPVwicHJvcC1kZXNjcmlwdGlvblwiPkRlc2NyaXB0aW9uPC90aD5cbjwvdGhlYWQ+XG48dGJvZHk+JHtcbiAgbmFtZXMubWFwKChuYW1lKSA9PiB7XG4gICAgcmV0dXJuIGA8dHI+XG4gICAgICAgICAgICAgIDx0ZCBjbGFzcz1cInByb3AtbmFtZVwiPiR7bmFtZX08L3RkPlxuICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJwcm9wLXR5cGVcIj4ke2RhdGFbbmFtZV0udHlwZX08L3RkPlxuICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJwcm9wLWRlZmF1bHRcIj48cHJlPiR7ZGF0YVtuYW1lXS5kZWZhdWx0fTwvcHJlPjwvdGQ+XG4gICAgICAgICAgICAgIDx0ZCBjbGFzcz1cInByb3AtZGVzY3JpcHRpb25cIj4ke2RhdGFbbmFtZV0uZGVzY3JpcHRpb259PC90ZD5cbiAgICAgICAgICAgIDwvdHI+YDtcbiAgfSkuam9pbignJylcbn08L3Rib2R5PlxuPC90YWJsZT5cbiAgICBgO1xuXG4gIHByb3BlcnRpZXNDb250YWluZXIuaW5uZXJIVE1MID0gdGFibGU7XG59O1xuXG4vLyBkZXBlbmRzIG9uIC50YWJzIHN0eWxlIGRlZmluZWQgaW4gZGVtb1NjcmVlbi5zY3NzXG53aW5kb3cubWFrZVRhYnMgPSBmdW5jdGlvbiAoKSB7XG4gIGxldCBncm9wQ291bnQgPSAxO1xuICBsZXQgaWRDb3VudCA9IDE7XG5cbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYnMnKS5mb3JFYWNoKCh0YWJzQmxvY2spID0+IHtcbiAgICBjb25zdCBmaXJzdFNlY3Rpb24gPSB0YWJzQmxvY2sucXVlcnlTZWxlY3Rvcignc2VjdGlvbicpO1xuXG4gICAgdGFic0Jsb2NrLnF1ZXJ5U2VsZWN0b3JBbGwoJ3NlY3Rpb24nKS5mb3JFYWNoKChzZWN0aW9uKSA9PiB7XG4gICAgICBjb25zdCBzZWN0aW9uTmFtZSA9IHNlY3Rpb24uZ2V0QXR0cmlidXRlKCd4LW5hbWUnKTtcbiAgICAgIGNvbnN0IGlzQ2hlY2tlZCA9IHNlY3Rpb24uZ2V0QXR0cmlidXRlKCd4LWNoZWNrZWQnKTtcbiAgICAgIGNvbnN0IGhpZ2hsaWdodCA9IHNlY3Rpb24uZ2V0QXR0cmlidXRlKCd4LWhpZ2hsaWdodCcpO1xuICAgICAgY29uc3QgY29udGVudCA9IHNlY3Rpb24uaW5uZXJIVE1MO1xuXG4gICAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG5cbiAgICAgIHNlY3Rpb24uaWQgPSBgY29udGVudC0ke2lkQ291bnR9YDtcbiAgICAgIGlmIChoaWdobGlnaHQpIHtcbiAgICAgICAgc2VjdGlvbi5pbm5lckhUTUwgPSBgPHByZT48Y29kZSBjbGFzcz1cIiR7aGlnaGxpZ2h0fVwiPiR7XG4gICAgICAgICAgY29udGVudFxuICAgICAgICB9PC9jb2RlPjwvcHJlPmA7XG4gICAgICB9XG5cbiAgICAgIGlucHV0LnR5cGUgPSAncmFkaW8nO1xuICAgICAgaW5wdXQubmFtZSA9IGBncm91cC0ke2dyb3BDb3VudH1gO1xuICAgICAgaW5wdXQuaWQgPSBgdGFiLSR7aWRDb3VudH1gO1xuICAgICAgaWYgKGlzQ2hlY2tlZCkge1xuICAgICAgICBpbnB1dC5jaGVja2VkID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgbGFiZWwuaHRtbEZvciA9IGlucHV0LmlkO1xuICAgICAgbGFiZWwuaW5uZXJUZXh0ID0gc2VjdGlvbk5hbWU7XG5cbiAgICAgIHRhYnNCbG9jay5pbnNlcnRCZWZvcmUoaW5wdXQsIGZpcnN0U2VjdGlvbik7XG4gICAgICB0YWJzQmxvY2suaW5zZXJ0QmVmb3JlKGxhYmVsLCBmaXJzdFNlY3Rpb24pO1xuXG4gICAgICBpZENvdW50ICs9IDE7XG4gICAgfSk7XG5cbiAgICBncm9wQ291bnQgKz0gMTtcbiAgfSk7XG59O1xuXG53aW5kb3cuaGlnaGxpZ2h0QmxvY2tzID0gZnVuY3Rpb24gKCkge1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdwcmUgY29kZS5odG1sJykuZm9yRWFjaCgoYmxvY2spID0+IHtcbiAgICAvLyBpZiBub3QgYWxyZWFkeSBlc2NhcGVkIChpbiB3aGljaCBjYXNlIGNvbnRhaW5zICcmbHQ7JykgKFJlYWN0IHN0cmluZyBzY2VuYXJpbylcbiAgICBpZiAoIWJsb2NrLmlubmVySFRNTC5pbmNsdWRlcygnJmx0OycpKSB7XG4gICAgICBibG9jay5pbm5lckhUTUwgPVxuICAgICAgYmxvY2suaW5uZXJIVE1MXG4gICAgICAgIC5yZXBsYWNlKC8mL2csICcmYW1wOycpXG4gICAgICAgIC5yZXBsYWNlKC88L2csICcmbHQ7JylcbiAgICAgICAgLnJlcGxhY2UoLz4vZywgJyZndDsnKVxuICAgICAgICAucmVwbGFjZSgvXCIvZywgJyZxdW90OycpXG4gICAgICAgIC5yZXBsYWNlKC8nL2csICcmIzAzOTsnKTtcbiAgICB9XG4gIH0pO1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdwcmUgY29kZScpLmZvckVhY2goKGJsb2NrKSA9PiB7XG4gICAgd2luZG93LmhsanMgJiYgd2luZG93LmhsanMuaGlnaGxpZ2h0QmxvY2soYmxvY2spO1xuICB9KTtcbn07XG5cbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IGxvY2FsZUF3YXJlIGZyb20gJy4uLy4uLy4uL3NyYy9saWIvSE9DL2xvY2FsZUF3YXJlJztcblxubGV0IElGcmFtZVNjcmVlbiA9IGNsYXNzIElGcmFtZVNjcmVlbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuaWZyYW1lTm9kZSA9IG51bGw7XG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xuICAgIGNvbnN0IHsgbG9jYWxlOiB7IGRpciB9IH0gPSBuZXh0UHJvcHM7XG4gICAgdGhpcy5pZnJhbWVOb2RlLmNvbnRlbnRXaW5kb3cucG9zdE1lc3NhZ2UoYGNoYW5nZURpciAke2Rpcn1gLCAnKicpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGlzUHJvZCA9ICF3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuaW5jbHVkZXMoJy5kZXYuJyk7XG4gICAgY29uc3Qgd2luZG93TG9jYXRpb25IYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2gucmVwbGFjZSgnIycsICcnKTtcbiAgICByZXR1cm4gKFxuICAgICAgPGlmcmFtZVxuICAgICAgICByZWY9eyhub2RlKSA9PiB0aGlzLmlmcmFtZU5vZGUgPSBub2RlfVxuICAgICAgICBzcmM9e2BzcmNEZW1vL3NjcmVlbnMvJHt3aW5kb3dMb2NhdGlvbkhhc2h9P3Byb2R1Y3Rpb249JHtpc1Byb2QgPyAnMScgOiAnMCd9YH0gLz5cbiAgICApO1xuICB9XG59O1xuSUZyYW1lU2NyZWVuLnByb3BUeXBlcyA9IHtcbiAgbG9jYWxlOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgIGRpcjogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBsYW5nOiBQcm9wVHlwZXMuc3RyaW5nXG4gIH0pXG59O1xuSUZyYW1lU2NyZWVuID0gbG9jYWxlQXdhcmUoSUZyYW1lU2NyZWVuKTtcblxuZXhwb3J0IGRlZmF1bHQgSUZyYW1lU2NyZWVuO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmNsYXNzIFByb3BlcnRpZXNUYWJsZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIC8vIHJlLXVzaW5nIHRoZSBoZWxwZXIgZGVmaW5lZCBmb3IgaUZyYW1lXG4gICAgd2luZG93LmdlbmVyYXRlQ29tcG9uZW50UHJvcGVydGllc1RhYmxlKHRoaXMucHJvcHMucHJvcGVydGllcyk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwicHJvcGVydGllc1wiIC8+O1xuICB9XG59XG5cblByb3BlcnRpZXNUYWJsZS5wcm9wVHlwZXMgPSB7XG4gIHByb3BlcnRpZXM6IFByb3BUeXBlcy5vYmplY3Rcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFByb3BlcnRpZXNUYWJsZTtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmNsYXNzIE9uU2NyZWVuQ29uc29sZVNjcmVlbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJkZW1vLXNjcmVlblwiPiB7IC8qIHN0YW5kYXJkIHRlbXBsYXRlIHJlcXVpcmVtZW50ICovIH1cbiAgICAgICAgPGgyIGNsYXNzTmFtZT1cInRpdGxlXCI+T24gU2NyZWVuIENvbnNvbGU8L2gyPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBPblNjcmVlbkNvbnNvbGVTY3JlZW47XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtcbiAgZGlzdHJpYnV0aW9uVVJMXG59IGZyb20gJy4uLy4uL2ludGVybmFscy9jb25zdGFudHMnO1xuXG5jbGFzcyBVc2luZ0RldkJveFVJIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImRlbW8tc2NyZWVuXCI+IHsgLyogc3RhbmRhcmQgdGVtcGxhdGUgcmVxdWlyZW1lbnQgKi8gfVxuICAgICAgICA8aDIgY2xhc3NOYW1lPVwidGl0bGVcIj5Mb2FkaW5nIERldiBCb3ggVUkgV2ViIENvbXBvbmVudHM8L2gyPlxuICAgICAgICA8aDMgY2xhc3NOYW1lPVwic2VjdGlvblwiPkZyb20gRGlzdHJpYnV0aW9uPC9oMz5cbiAgICAgICAgPHByZT48Y29kZSBjbGFzc05hbWU9XCJodG1sXCI+XG4gICAgICAgICAge2BcbjwhZG9jdHlwZSBodG1sPlxuPGh0bWwgZGlyPVwibHRyXCIgbGFuZz1cImVuXCI+XG48aGVhZD5cbiAgPG1ldGEgY2hhcnNldD1cIlVURi04XCI+XG4gIDxtZXRhIG5hbWU9XCJ2aWV3cG9ydFwiIGNvbnRlbnQ9XCJ3aWR0aD1kZXZpY2Utd2lkdGgsIGluaXRpYWwtc2NhbGU9MSwgc2hyaW5rLXRvLWZpdD1ub1wiPlxuICA8c2NyaXB0IHNyYz1cIiR7ZGlzdHJpYnV0aW9uVVJMfVwiPjwvc2NyaXB0PlxuICA8c2NyaXB0PlxuICAgIGNvbnN0IHtcbiAgICAgIHF1aWNrU2V0dXBBbmRMb2FkXG4gICAgfSA9IHJlcXVpcmUoJ2Rldi1ib3gtdWktd2ViY29tcG9uZW50cycpO1xuICAgIGNvbnN0IHtcbiAgICAgICdkYnVpLXdlYi1jb21wb25lbnQtZHVtbXktcGFyZW50JzogZGJ1aVdlYkNvbXBvbmVudER1bW15UGFyZW50Q2xhc3MsXG4gICAgfSA9IHF1aWNrU2V0dXBBbmRMb2FkKHdpbmRvdykoW1xuICAgICAge1xuICAgICAgICByZWdpc3RyYXRpb25OYW1lOiAnZGJ1aS13ZWItY29tcG9uZW50LWR1bW15JyxcbiAgICAgICAgY29tcG9uZW50U3R5bGU6IFxcYFxuICAgICAgICAgYiB7XG4gICAgICAgICAgIGNvbG9yOiB2YXIoLS1kdW1teS1iLWNvbG9yLCBpbmhlcml0KTtcbiAgICAgICAgICAgYm9yZGVyLXJhZGl1czogdmFyKC0tZHVtbXktYi1ib3JkZXItcmFkaXVzLCAwcHgpO1xuICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1kdW1teS1iLWJnLWNvbG9yLCB0cmFuc3BhcmVudCk7XG4gICAgICAgICB9XG4gICAgICAgIFxcYFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgcmVnaXN0cmF0aW9uTmFtZTogJ2RidWktd2ViLWNvbXBvbmVudC1kdW1teS1wYXJlbnQnXG4gICAgICB9XG4gICAgXSk7XG4gIDwvc2NyaXB0PlxuPC9oZWFkPlxuPGJvZHk+XG48ZGJ1aS13ZWItY29tcG9uZW50LWR1bW15LXBhcmVudD5oZWxsbyAxPC9kYnVpLXdlYi1jb21wb25lbnQtZHVtbXktcGFyZW50PlxuPC9ib2R5PlxuPC9odG1sPlxuXG4gICAgICAgICAgYH1cbiAgICAgICAgPC9jb2RlPjwvcHJlPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBVc2luZ0RldkJveFVJO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuY2xhc3MgREJVSVdlYkNvbXBvbmVudER1bW15U2NyZWVuIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImRlbW8tc2NyZWVuXCI+eyAvKiBzdGFuZGFyZCB0ZW1wbGF0ZSByZXF1aXJlbWVudCAqLyB9XG5cbiAgICAgICAgPGRidWktd2ViLWNvbXBvbmVudC1kdW1teVxuICAgICAgICAgIHN0eWxlPXt7IGNvbG9yOiAnYmx1ZScgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxzcGFuPmhlbGxvIDE8L3NwYW4+XG4gICAgICAgIDwvZGJ1aS13ZWItY29tcG9uZW50LWR1bW15PlxuXG4gICAgICAgIDxkYnVpLXdlYi1jb21wb25lbnQtZHVtbXlcbiAgICAgICAgICBzdHlsZT17eyBjb2xvcjogJ2JsdWUnIH19XG4gICAgICAgID5cbiAgICAgICAgICA8c3Bhbj5oZWxsbyAyPC9zcGFuPlxuICAgICAgICA8L2RidWktd2ViLWNvbXBvbmVudC1kdW1teT5cbiAgICAgICAgPGRidWktd2ViLWNvbXBvbmVudC1kdW1teS1wYXJlbnQ+aGVsbG8gMzwvZGJ1aS13ZWItY29tcG9uZW50LWR1bW15LXBhcmVudD5cblxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBEQlVJV2ViQ29tcG9uZW50RHVtbXlTY3JlZW47XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtcbiAgRHJhZ2dhYmxlLCBEaXNhYmxlU2VsZWN0aW9uXG59IGZyb20gJ2Rldi1ib3gtdWknO1xuaW1wb3J0IFByb3BlcnRpZXNUYWJsZSBmcm9tICcuLi8uLi9pbnRlcm5hbHMvcmVhY3RDb21wb25lbnRzL1Byb3BlcnRpZXNUYWJsZSc7XG5cbmNsYXNzIFRvUmVuZGVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIC8vIGNvbnNvbGUubG9nKCdUb1JlbmRlciNyZW5kZXInKTtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBzdHlsZT17eyB3aWR0aDogMzAwLCBoZWlnaHQ6IDMwMCB9fVxuICAgICAgICBvbk1vdXNlRG93bj17dGhpcy5wcm9wcy5vbk1vdXNlRG93bn1cbiAgICAgICAgb25Nb3VzZVVwPXt0aGlzLnByb3BzLm9uTW91c2VVcH1cbiAgICAgICAgb25DbGljaz17dGhpcy5wcm9wcy5vbkNsaWNrfVxuICAgICAgICBvblRvdWNoU3RhcnQ9e3RoaXMucHJvcHMub25Ub3VjaFN0YXJ0fVxuICAgICAgICBvblRvdWNoRW5kPXt0aGlzLnByb3BzLm9uVG91Y2hFbmR9XG4gICAgICA+XG4gICAgICAgIDxwPmRyYWdnYWJsZSBwIHt0aGlzLnByb3BzLmNvdW50ZXJ9IDxhIGhyZWY9XCJodHRwOi8vZ29vZ2xlLmNvbVwiIHRhcmdldD1cIl9ibGFua1wiPmxpbms8L2E+PC9wPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5jbGFzcyBEcmFnZ2FibGVTY3JlZW4gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLmhhbmRsZU1vdXNlRG93biA9IHRoaXMuaGFuZGxlTW91c2VEb3duLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVUb3VjaFN0YXJ0ID0gdGhpcy5oYW5kbGVUb3VjaFN0YXJ0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVNb3VzZVVwID0gdGhpcy5oYW5kbGVNb3VzZVVwLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVUb3VjaEVuZCA9IHRoaXMuaGFuZGxlVG91Y2hFbmQuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZUNsaWNrID0gdGhpcy5oYW5kbGVDbGljay5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5jb3VudGVyID0gMTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZHJhZ2dhYmxlQ29udGVudDogdGhpcy5kcmFnZ2FibGVDb250ZW50XG4gICAgfTtcbiAgfVxuXG4gIGdldCBkcmFnZ2FibGVDb250ZW50KCkge1xuICAgIHJldHVybiAoXG4gICAgICA8VG9SZW5kZXJcbiAgICAgICAgb25Nb3VzZURvd249e3RoaXMuaGFuZGxlTW91c2VEb3dufVxuICAgICAgICBvbk1vdXNlVXA9e3RoaXMuaGFuZGxlTW91c2VVcH1cbiAgICAgICAgb25Ub3VjaFN0YXJ0PXt0aGlzLmhhbmRsZVRvdWNoU3RhcnR9XG4gICAgICAgIG9uVG91Y2hFbmQ9e3RoaXMuaGFuZGxlVG91Y2hFbmR9XG4gICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9XG4gICAgICAgIGNvdW50ZXI9e3RoaXMuY291bnRlcn1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIGhhbmRsZU1vdXNlRG93bihldnQpIHtcbiAgICBjb25zb2xlLmxvZygnRHJhZ2dhYmxlU2NyZWVuI2hhbmRsZU1vdXNlRG93bicpO1xuICB9XG4gIGhhbmRsZU1vdXNlVXAoZXZ0KSB7XG4gICAgY29uc29sZS5sb2coJ0RyYWdnYWJsZVNjcmVlbiNoYW5kbGVNb3VzZVVwJyk7XG4gIH1cbiAgaGFuZGxlVG91Y2hTdGFydChldnQpIHtcbiAgICBjb25zb2xlLmxvZygnRHJhZ2dhYmxlU2NyZWVuI2hhbmRsZVRvdWNoU3RhcnQnKTtcbiAgfVxuICBoYW5kbGVUb3VjaEVuZChldnQpIHtcbiAgICBjb25zb2xlLmxvZygnRHJhZ2dhYmxlU2NyZWVuI2hhbmRsZVRvdWNoRW5kJyk7XG4gIH1cbiAgaGFuZGxlQ2xpY2soZXZ0KSB7XG4gICAgY29uc29sZS5sb2coJ0RyYWdnYWJsZVNjcmVlbiNoYW5kbGVDbGljaycpO1xuICAgIC8vIHRoaXMuY291bnRlciA9IHRoaXMuY291bnRlciArIDE7XG4gICAgLy8gdGhpcy5zZXRTdGF0ZSh7XG4gICAgLy8gICBkcmFnZ2FibGVDb250ZW50OiB0aGlzLmRyYWdnYWJsZUNvbnRlbnRcbiAgICAvLyB9KTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuX21vdW50ZWQgPSB0cnVlO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLl9tb3VudGVkKSByZXR1cm47XG4gICAgICB0aGlzLmNvdW50ZXIgPSB0aGlzLmNvdW50ZXIgKyAxO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGRyYWdnYWJsZUNvbnRlbnQ6IHRoaXMuZHJhZ2dhYmxlQ29udGVudFxuICAgICAgfSk7XG4gICAgfSwgMzAwMCk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLl9tb3VudGVkID0gZmFsc2U7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGVtby1zY3JlZW5cIj4geyAvKiBzdGFuZGFyZCB0ZW1wbGF0ZSByZXF1aXJlbWVudCAqLyB9XG5cbiAgICAgICAgPGgyIGNsYXNzTmFtZT1cInRpdGxlXCI+RHJhZ2dhYmxlIFJlYWN0IHt0aGlzLmNvdW50ZXJ9PC9oMj5cblxuICAgICAgICA8aDMgY2xhc3NOYW1lPVwic2VjdGlvblwiPlN0dWZmIE9uZTwvaDM+XG5cbiAgICAgICAgPHA+YmVmb3JlIHRhYnM8L3A+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0YWJzXCI+XG4gICAgICAgICAgPHNlY3Rpb24geC1uYW1lPVwiUkVTVUxUXCIgeC1jaGVja2VkPVwiMVwiPlxuICAgICAgICAgICAgPERyYWdnYWJsZSBzdHlsZT17eyBib3JkZXI6ICcxcHggc29saWQgYmx1ZScsIHdpZHRoOiAyMDAsIGhlaWdodDogMjAwLCBvdmVyZmxvd1g6ICdzY3JvbGwnLCBvdmVyZmxvd1k6ICdzY3JvbGwnIH19PlxuICAgICAgICAgICAgICB7dGhpcy5zdGF0ZS5kcmFnZ2FibGVDb250ZW50fVxuICAgICAgICAgICAgPC9EcmFnZ2FibGU+XG4gICAgICAgICAgICA8RGlzYWJsZVNlbGVjdGlvbj5cbiAgICAgICAgICAgICAgPHA+ZGlzYWJsZWQgc2VsZWN0aW9uPC9wPlxuICAgICAgICAgICAgPC9EaXNhYmxlU2VsZWN0aW9uPlxuICAgICAgICAgICAge0FycmF5LmZyb20oeyBsZW5ndGg6IDEwIH0pLm1hcCgoZWwsIGkpID0+IDxwIGtleT17aX0+e2l9IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLTwvcD4pfVxuICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgICA8c2VjdGlvbiB4LW5hbWU9XCJIVE1MXCIgeC1oaWdobGlnaHQ9XCJodG1sXCI+e2BcbjxwPmRyYWdnYWJsZTwvcD5cbjxzcGFuPnJlYWN0PC9zcGFuPlxuICAgICAgICAgIGB9XG4gICAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgICAgIDxzZWN0aW9uIHgtbmFtZT1cIkNTU1wiIHgtaGlnaGxpZ2h0PVwiY3NzXCI+e2BcbmJvZHkge1xuICBjb2xvcjogcmVkO1xufVxuICAgICAgICAgIGB9XG4gICAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgICAgIDxzZWN0aW9uIHgtbmFtZT1cIkpTXCIgeC1oaWdobGlnaHQ9XCJqYXZhc2NyaXB0XCI+e2BcbmNsYXNzIENhciBleHRlbmRzIFN1cGVyQ2xhc3Mge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgb25Jbml0KCkge1xuICAgIHRoaXMuZG8oKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2cocHJpbnQpO1xuICAgIH0pO1xuICB9XG59XG4gICAgICAgICAgYH1cbiAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxwPmJldHdlZW4gdGFiczwvcD5cblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRhYnNcIj5cbiAgICAgICAgICA8c2VjdGlvbiB4LW5hbWU9XCJDU1NcIiB4LWhpZ2hsaWdodD1cImNzc1wiPntgXG5ib2R5IHtcbiAgY29sb3I6IHJlZDtcbn1cbiAgICAgICAgICBgfVxuICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgICA8c2VjdGlvbiB4LW5hbWU9XCJKU1wiIHgtaGlnaGxpZ2h0PVwiamF2YXNjcmlwdFwiIHgtY2hlY2tlZD1cIjFcIj57YFxuY2xhc3MgQ2FyIGV4dGVuZHMgU3VwZXJDbGFzcyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBvbkluaXQoKSB7XG4gICAgdGhpcy5kbygoKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhwcmludCk7XG4gICAgfSk7XG4gIH1cbn1cbiAgICAgICAgICBgfVxuICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPFByb3BlcnRpZXNUYWJsZSBwcm9wZXJ0aWVzPXt7XG4gICAgICAgICAgcHJvcGVydHlPbmU6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogJ3ZhbHVlIDEnLFxuICAgICAgZGVzY3JpcHRpb246ICdkZXNjcmlwdGlvbiBvbmUnXG4gICAgfSxcbiAgICBwcm9wZXJ0eVR3bzoge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBkZWZhdWx0OiAnNScsXG4gICAgICBkZXNjcmlwdGlvbjogJ2Rlc2NyaXB0aW9uIHR3bydcbiAgICB9XG4gICAgICAgIH19IC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IERyYWdnYWJsZVNjcmVlbjtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1xuICBGb3JtSW5wdXROdW1iZXJcbn0gZnJvbSAnZGV2LWJveC11aSc7XG5cblxuY2xhc3MgRm9ybUlucHV0TnVtYmVyU2NyZWVuIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGlucHV0VmFsdWU6IC03LjA4XG4gICAgfTtcbiAgICB0aGlzLmhhbmRsZUNoYW5nZSA9IHRoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyk7XG4gIH1cblxuICBoYW5kbGVDaGFuZ2UoaW5wdXRWYWx1ZSkge1xuICAgIGNvbnN0IHZhbHVlVG9TZW5kQmFjayA9IE51bWJlcihpbnB1dFZhbHVlLnRvUHJlY2lzaW9uKDE2KSk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpbnB1dFZhbHVlOiB2YWx1ZVRvU2VuZEJhY2tcbiAgICB9KTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJkZW1vLXNjcmVlblwiPiB7IC8qIHN0YW5kYXJkIHRlbXBsYXRlIHJlcXVpcmVtZW50ICovIH1cbiAgICAgICAgPHByZT48Y29kZSBjbGFzc05hbWU9XCJodG1sXCI+XG4gICAgICAgICAge2BcbiAgICAgICAgICAgIDxwPmZvcm0gaW5wdXQgbnVtYmVyPC9wPlxuICAgICAgICAgICAgPHNwYW4+cmVhY3Q8L3NwYW4+XG4gICAgICAgICAgYH1cbiAgICAgICAgPC9jb2RlPjwvcHJlPlxuICAgICAgICA8cHJlPjxjb2RlIGNsYXNzTmFtZT1cImphdmFzY3JpcHRcIj5cbiAgICAgICAgICB7YFxuICAgICAgICAgICAgY2xhc3MgTWFjaGluZSBleHRlbmRzIFN1cGVyQ2xhc3Mge1xuICAgICAgICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgICAgICBzdXBlcigpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgb25Jbml0KCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZG8oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocHJpbnQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgYH1cbiAgICAgICAgPC9jb2RlPjwvcHJlPlxuICAgICAgICA8cHJlPjxjb2RlIGNsYXNzTmFtZT1cImNzc1wiPlxuICAgICAgICAgIHtgXG4gICAgICAgICAgICBodG1sW2Rpcj1sdHJdIHtcbiAgICAgICAgICAgICAgY29sb3I6IHJlZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBgfVxuICAgICAgICA8L2NvZGU+PC9wcmU+XG4gICAgICAgIDxGb3JtSW5wdXROdW1iZXJcbiAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS5pbnB1dFZhbHVlfVxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX1cbiAgICAgICAgICBkZWZhdWx0RGVjUG9pbnQ9XCIsXCJcbiAgICAgICAgICBkZWZhdWx0VGhvdXNhbmRzU2VwYXJhdG9yPVwiLlwiXG4gICAgICAgIC8+XG4gICAgICAgIDxGb3JtSW5wdXROdW1iZXJcbiAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS5pbnB1dFZhbHVlfVxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX1cbiAgICAgICAgLz5cbiAgICAgICAgPHA+e3RoaXMuc3RhdGUuaW5wdXRWYWx1ZX17J1xcdTAwQTAnfTwvcD5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRm9ybUlucHV0TnVtYmVyU2NyZWVuO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7XG4gIEZvcm1JbnB1dFxufSBmcm9tICdkZXYtYm94LXVpJztcblxuXG5jbGFzcyBGb3JtSW5wdXRTY3JlZW4gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgaW5wdXRWYWx1ZTogNlxuICAgIH07XG4gICAgdGhpcy5oYW5kbGVDaGFuZ2UgPSB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaGFuZGxlQ2hhbmdlKGlucHV0VmFsdWUpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGlucHV0VmFsdWVcbiAgICB9KTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJkZW1vLXNjcmVlblwiPiB7IC8qIHN0YW5kYXJkIHRlbXBsYXRlIHJlcXVpcmVtZW50ICovIH1cbiAgICAgICAgPEZvcm1JbnB1dFxuICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLmlucHV0VmFsdWV9XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfVxuICAgICAgICAgIGhhc1dhcm5pbmc9e2ZhbHNlfVxuICAgICAgICAgIGhhc0Vycm9yPXtmYWxzZX1cbiAgICAgICAgICBkaXNhYmxlZD17ZmFsc2V9XG4gICAgICAgIC8+XG4gICAgICAgIDxwPnt0aGlzLnN0YXRlLmlucHV0VmFsdWV9eydcXHUwMEEwJ308L3A+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEZvcm1JbnB1dFNjcmVlbjtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1xuICBIZWxsb1xufSBmcm9tICdkZXYtYm94LXVpJztcblxuY2xhc3MgSGVsbG9TY3JlZW4gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIC8qIGVzbGludCBuby1jb25zb2xlOiAwICovXG4gICAgICAvLyBjb25zb2xlLmxvZygncmVuZGVyaW5nIEhlbGxvU2NyZWVuIGNvbXBvbmVudCcpO1xuICAgIH1cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJkZW1vLXNjcmVlblwiPiB7IC8qIHN0YW5kYXJkIHRlbXBsYXRlIHJlcXVpcmVtZW50ICovIH1cbiAgICAgICAgPEhlbGxvIC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEhlbGxvU2NyZWVuO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7XG4gIExpc3Rcbn0gZnJvbSAnZGV2LWJveC11aSc7XG5cbmNsYXNzIExpc3RTY3JlZW4gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGVtby1zY3JlZW5cIj4geyAvKiBzdGFuZGFyZCB0ZW1wbGF0ZSByZXF1aXJlbWVudCAqLyB9XG4gICAgICAgIDxMaXN0IGl0ZW1zPXtbJ3RocmVlJywgJ2ZvdXInXX0vPlxuICAgICAgICA8TGlzdCBpdGVtcz17Wyd0aHJlZScsICdmb3VyJ119Lz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTGlzdFNjcmVlbjtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmNsYXNzIExvY2FsZVNlcnZpY2VTY3JlZW4gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGVtby1zY3JlZW5cIj4geyAvKiBzdGFuZGFyZCB0ZW1wbGF0ZSByZXF1aXJlbWVudCAqLyB9XG4gICAgICAgIDxoMiBjbGFzc05hbWU9XCJ0aXRsZVwiPkxvY2FsZSBTZXJ2aWNlPC9oMj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTG9jYWxlU2VydmljZVNjcmVlbjtcbiIsIi8vIEdlbmVyYWxcbmltcG9ydCBMb2FkaW5nRGV2Qm94VUlXZWJDb21wb25lbnRzIGZyb20gJy4vR2VuZXJhbC9Mb2FkaW5nRGV2Qm94VUlXZWJDb21wb25lbnRzJztcblxuLy8gU2VydmljZXNcbmltcG9ydCBMb2NhbGVTZXJ2aWNlU2NyZWVuIGZyb20gJy4vU2VydmljZXMvTG9jYWxlU2VydmljZVNjcmVlbic7XG5cbi8vIFJlYWN0IENvbXBvbmVudHNcbmltcG9ydCBIZWxsb1NjcmVlbiBmcm9tICcuL1JlYWN0Q29tcG9uZW50cy9IZWxsb1NjcmVlbic7XG5pbXBvcnQgTGlzdFNjcmVlbiBmcm9tICcuL1JlYWN0Q29tcG9uZW50cy9MaXN0U2NyZWVuJztcbmltcG9ydCBGb3JtSW5wdXRTY3JlZW4gZnJvbSAnLi9SZWFjdENvbXBvbmVudHMvRm9ybUlucHV0U2NyZWVuJztcbmltcG9ydCBGb3JtSW5wdXROdW1iZXJTY3JlZW4gZnJvbSAnLi9SZWFjdENvbXBvbmVudHMvRm9ybUlucHV0TnVtYmVyU2NyZWVuJztcbmltcG9ydCBEcmFnZ2FibGVTY3JlZW4gZnJvbSAnLi9SZWFjdENvbXBvbmVudHMvRHJhZ2dhYmxlU2NyZWVuJztcbmltcG9ydCBEQlVJV2ViQ29tcG9uZW50RHVtbXlTY3JlZW4gZnJvbSAnLi9SZWFjdENvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudER1bW15U2NyZWVuJztcblxuLy8gRGVidWdcbmltcG9ydCBPblNjcmVlbkNvbnNvbGVTY3JlZW4gZnJvbSAnLi9EZWJ1Zy9PblNjcmVlbkNvbnNvbGVTY3JlZW4nO1xuXG5jb25zdCBzY3JlZW5zID0ge1xuICAvLyBHZW5lcmFsXG4gIExvYWRpbmdEZXZCb3hVSVdlYkNvbXBvbmVudHMsXG5cbiAgLy8gU2VydmljZXNcbiAgTG9jYWxlU2VydmljZVNjcmVlbixcblxuICAvLyBDb21wb25lbnRzXG4gIEhlbGxvU2NyZWVuLFxuICBMaXN0U2NyZWVuLFxuICBGb3JtSW5wdXRTY3JlZW4sXG4gIEZvcm1JbnB1dE51bWJlclNjcmVlbixcbiAgRHJhZ2dhYmxlU2NyZWVuLFxuICBEQlVJV2ViQ29tcG9uZW50RHVtbXlTY3JlZW4sXG5cbiAgLy8gRGVidWdcbiAgT25TY3JlZW5Db25zb2xlU2NyZWVuXG59O1xuXG4vKlxuVGhlIHJlYWwgcGF0aCBtYXR0ZXJzIG9ubHkgZm9yIC5odG1sIHNjcmVlbnMgYXMgdGhleSBhcmUgbG9hZGVkIGludG8gYW4gaUZyYW1lLlxuUmVhY3Qgc2NyZWVucyBwYXRoIG5lZWRzIHRvIGJlIHRoZSBzYW1lIGFzIGltcG9ydGVkIHJlYWN0IGNvbXBvbmVudC5cbiovXG5jb25zdCBzY3JlZW5MaW5rc0dlbiA9IFtcbiAge1xuICAgIHRpdGxlOiAnR2VuZXJhbCcsXG4gICAgbGlua3M6IFtcbiAgICAgIHsgcGF0aDogJ0xvYWRpbmdEZXZCb3hVSVdlYkNvbXBvbmVudHMnLCB0aXRsZTogJ0xvYWRpbmcgV2ViIENvbXBvbmVudHMnIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICB0aXRsZTogJ1NlcnZpY2VzJyxcbiAgICBsaW5rczogW1xuICAgICAgeyBwYXRoOiAnTG9jYWxlU2VydmljZVNjcmVlbicsIHRpdGxlOiAnTG9jYWxlJyB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgdGl0bGU6ICdXZWIgQ29tcG9uZW50cycsXG4gICAgbGlua3M6IFtcbiAgICAgIHsgcGF0aDogJ1dlYkNvbXBvbmVudHNTY3JlZW5zL0RCVUlXZWJDb21wb25lbnREdW1teVNjcmVlbi5odG1sJywgdGl0bGU6ICdEdW1teScgfSxcbiAgICAgIHsgcGF0aDogJ1dlYkNvbXBvbmVudHNTY3JlZW5zL0RCVUlXZWJDb21wb25lbnREdW1teVBhcmVudFNjcmVlbi5odG1sJywgdGl0bGU6ICdEdW1teSBQYXJlbnQnIH0sXG4gICAgICB7IHBhdGg6ICdXZWJDb21wb25lbnRzU2NyZWVucy9EQlVJV2ViQ29tcG9uZW50Rm9ybUlucHV0VGV4dFNjcmVlbi5odG1sJywgdGl0bGU6ICdGb3JtIElucHV0IFRleHQnIH0sXG4gICAgXVxuICB9LFxuICB7XG4gICAgdGl0bGU6ICdSZWFjdCBDb21wb25lbnRzJyxcbiAgICBsaW5rczogW1xuICAgICAgeyBwYXRoOiAnSGVsbG9TY3JlZW4nLCB0aXRsZTogJ0hlbGxvJyB9LFxuICAgICAgeyBwYXRoOiAnTGlzdFNjcmVlbicsIHRpdGxlOiAnTGlzdCcgfSxcbiAgICAgIHsgcGF0aDogJ0Zvcm1JbnB1dFNjcmVlbicsIHRpdGxlOiAnRm9ybSBJbnB1dCcgfSxcbiAgICAgIHsgcGF0aDogJ0Zvcm1JbnB1dE51bWJlclNjcmVlbicsIHRpdGxlOiAnRm9ybSBJbnB1dCBOdW1iZXInIH0sXG4gICAgICB7IHBhdGg6ICdEcmFnZ2FibGVTY3JlZW4nLCB0aXRsZTogJ0RyYWdnYWJsZScgfSxcbiAgICAgIHsgcGF0aDogJ0RCVUlXZWJDb21wb25lbnREdW1teVNjcmVlbicsIHRpdGxlOiAnRHVtbXknIH0sXG4gICAgXVxuICB9LFxuICB7XG4gICAgdGl0bGU6ICdEZWJ1ZycsXG4gICAgbGlua3M6IFtcbiAgICAgIHsgcGF0aDogJ09uU2NyZWVuQ29uc29sZVNjcmVlbicsIHRpdGxlOiAnT24gU2NyZWVuIENvbnNvbGUnIH0sXG4gICAgXVxuICB9XG5dO1xuXG5leHBvcnQge1xuICBzY3JlZW5zLFxuICBzY3JlZW5MaW5rc0dlblxufTtcbiJdfQ==
