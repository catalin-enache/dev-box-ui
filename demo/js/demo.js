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
    --dbui-web-component-form-input-height: 50px;
    --dbui-web-component-form-input-color: #000;
    --dbui-web-component-form-input-background-color: #fff;
  }
  `;
  document.querySelector('head').appendChild(commonStyle);
}

function getDBUIWebComponentBase(win) {
  return (0, _ensureSingleRegistration2.default)(win, registrationName, () => {
    defineCommonCSSVars();
    const { document, HTMLElement, customElements } = win;

    const template = document.createElement('template');
    template.innerHTML = '<style></style><slot></slot>';

    class DBUIWebComponentBase extends HTMLElement {

      static get template() {
        return template;
      }

      static get dependencies() {
        return [];
      }

      static get useShadow() {
        return true;
      }

      constructor() {
        super();
        const { useShadow } = this.constructor;
        if (useShadow) {
          this.attachShadow({ mode: 'open' });
        }
        this._insertTemplate();

        this.connectedCallback = this.connectedCallback.bind(this);
        this.disconnectedCallback = this.disconnectedCallback.bind(this);
        this._handleLocaleChange = this._handleLocaleChange.bind(this);
        this.onLocaleChange && (this.onLocaleChange = this.onLocaleChange.bind(this));
        this.unregisterLocaleChange = null;
      }

      connectedCallback() {
        window.addEventListener('beforeunload', this.disconnectedCallback, false);

        this.unregisterLocaleChange = _LocaleService2.default.onLocaleChange(this._handleLocaleChange);
      }

      disconnectedCallback() {
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
      Object.defineProperty(klass, 'componentStyle', {
        get() {
          return klass.template.content.querySelector('style').innerHTML;
        },
        set(value) {
          klass.template.content.querySelector('style').innerHTML = value;
        },
        enumerable: true,
        configurable: true
      });

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
    }

    return {
      DBUIWebComponentBase,
      defineCommonStaticMethods
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
    const { DBUIWebComponentBase, defineCommonStaticMethods } = (0, _DBUIWebComponentBase2.default)(win);
    const { document } = win;

    const template = document.createElement('template');
    template.innerHTML = `
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

    class DBUIWebComponentDummy extends DBUIWebComponentBase {
      static get registrationName() {
        return registrationName;
      }

      static get template() {
        return template;
      }

      onLocaleChange(locale) {
        // console.log('onLocaleChange', locale);
      }
    }

    defineCommonStaticMethods(DBUIWebComponentDummy);

    return DBUIWebComponentDummy;
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
    const { DBUIWebComponentBase, defineCommonStaticMethods } = (0, _DBUIWebComponentBase2.default)(win);
    const DBUIWebComponentDummy = (0, _DBUIWebComponentDummy2.default)(win);

    const { document } = win;

    const template = document.createElement('template');
    template.innerHTML = `
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

    class DBUIWebComponentDummyParent extends DBUIWebComponentBase {
      static get registrationName() {
        return registrationName;
      }

      static get template() {
        return template;
      }

      static get dependencies() {
        return [DBUIWebComponentDummy];
      }

    }

    defineCommonStaticMethods(DBUIWebComponentDummyParent);

    return DBUIWebComponentDummyParent;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvaG9pc3Qtbm9uLXJlYWN0LXN0YXRpY3MvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LWljb24tYmFzZS9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVhY3QtaWNvbnMvbGliL2dvL21hcmstZ2l0aHViLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LWljb25zL2xpYi9nby90aHJlZS1iYXJzLmpzIiwic3JjL2xpYi9IT0MvbG9jYWxlQXdhcmUuanMiLCJzcmMvbGliL3NlcnZpY2VzL0kxOG5TZXJ2aWNlLmpzIiwic3JjL2xpYi9zZXJ2aWNlcy9Mb2NhbGVTZXJ2aWNlLmpzIiwic3JjL2xpYi93ZWJjb21wb25lbnRzL0RCVUlXZWJDb21wb25lbnRCYXNlL0RCVUlXZWJDb21wb25lbnRCYXNlLmpzIiwic3JjL2xpYi93ZWJjb21wb25lbnRzL0RCVUlXZWJDb21wb25lbnREdW1teS9EQlVJV2ViQ29tcG9uZW50RHVtbXkuanMiLCJzcmMvbGliL3dlYmNvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50L0RCVUlXZWJDb21wb25lbnREdW1teVBhcmVudC5qcyIsInNyYy9saWIvd2ViY29tcG9uZW50cy9EQlVJV2ViQ29tcG9uZW50c1NldHVwL0RCVUlXZWJDb21wb25lbnRzU2V0dXAuanMiLCJzcmMvbGliL3dlYmNvbXBvbmVudHMvaW50ZXJuYWxzL2FwcGVuZFN0eWxlLmpzIiwic3JjL2xpYi93ZWJjb21wb25lbnRzL2ludGVybmFscy9lbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24uanMiLCJzcmNEZW1vL2FwcC5qcyIsInNyY0RlbW8vZGVtby5qcyIsInNyY0RlbW8vaW50ZXJuYWxzL2FwcFV0aWxzLmpzIiwic3JjRGVtby9pbnRlcm5hbHMvY29uc3RhbnRzLmpzIiwic3JjRGVtby9pbnRlcm5hbHMvaUZyYW1lVXRpbHMvb25XaW5kb3dEZWZpbmVkSGVscGVycy5qcyIsInNyY0RlbW8vaW50ZXJuYWxzL3JlYWN0Q29tcG9uZW50cy9JRnJhbWVTY3JlZW4uanMiLCJzcmNEZW1vL2ludGVybmFscy9yZWFjdENvbXBvbmVudHMvUHJvcGVydGllc1RhYmxlLmpzIiwic3JjRGVtby9zY3JlZW5zL0RlYnVnL09uU2NyZWVuQ29uc29sZVNjcmVlbi5qcyIsInNyY0RlbW8vc2NyZWVucy9HZW5lcmFsL0xvYWRpbmdEZXZCb3hVSVdlYkNvbXBvbmVudHMuanMiLCJzcmNEZW1vL3NjcmVlbnMvUmVhY3RDb21wb25lbnRzL0RCVUlXZWJDb21wb25lbnREdW1teVNjcmVlbi5qcyIsInNyY0RlbW8vc2NyZWVucy9SZWFjdENvbXBvbmVudHMvRHJhZ2dhYmxlU2NyZWVuLmpzIiwic3JjRGVtby9zY3JlZW5zL1JlYWN0Q29tcG9uZW50cy9Gb3JtSW5wdXROdW1iZXJTY3JlZW4uanMiLCJzcmNEZW1vL3NjcmVlbnMvUmVhY3RDb21wb25lbnRzL0Zvcm1JbnB1dFNjcmVlbi5qcyIsInNyY0RlbW8vc2NyZWVucy9SZWFjdENvbXBvbmVudHMvSGVsbG9TY3JlZW4uanMiLCJzcmNEZW1vL3NjcmVlbnMvUmVhY3RDb21wb25lbnRzL0xpc3RTY3JlZW4uanMiLCJzcmNEZW1vL3NjcmVlbnMvU2VydmljZXMvTG9jYWxlU2VydmljZVNjcmVlbi5qcyIsInNyY0RlbW8vc2NyZWVucy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztrQkMxQndCLFc7O0FBTHhCOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFZSxTQUFTLFdBQVQsQ0FBcUIsU0FBckIsRUFBZ0M7QUFDN0MsUUFBTSxXQUFOLFNBQTBC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LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNSwgWWFob28hIEluYy5cbiAqIENvcHlyaWdodHMgbGljZW5zZWQgdW5kZXIgdGhlIE5ldyBCU0QgTGljZW5zZS4gU2VlIHRoZSBhY2NvbXBhbnlpbmcgTElDRU5TRSBmaWxlIGZvciB0ZXJtcy5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUkVBQ1RfU1RBVElDUyA9IHtcbiAgICBjaGlsZENvbnRleHRUeXBlczogdHJ1ZSxcbiAgICBjb250ZXh0VHlwZXM6IHRydWUsXG4gICAgZGVmYXVsdFByb3BzOiB0cnVlLFxuICAgIGRpc3BsYXlOYW1lOiB0cnVlLFxuICAgIGdldERlZmF1bHRQcm9wczogdHJ1ZSxcbiAgICBtaXhpbnM6IHRydWUsXG4gICAgcHJvcFR5cGVzOiB0cnVlLFxuICAgIHR5cGU6IHRydWVcbn07XG5cbnZhciBLTk9XTl9TVEFUSUNTID0ge1xuICBuYW1lOiB0cnVlLFxuICBsZW5ndGg6IHRydWUsXG4gIHByb3RvdHlwZTogdHJ1ZSxcbiAgY2FsbGVyOiB0cnVlLFxuICBjYWxsZWU6IHRydWUsXG4gIGFyZ3VtZW50czogdHJ1ZSxcbiAgYXJpdHk6IHRydWVcbn07XG5cbnZhciBkZWZpbmVQcm9wZXJ0eSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcbnZhciBnZXRPd25Qcm9wZXJ0eU5hbWVzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXM7XG52YXIgZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcbnZhciBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xudmFyIGdldFByb3RvdHlwZU9mID0gT2JqZWN0LmdldFByb3RvdHlwZU9mO1xudmFyIG9iamVjdFByb3RvdHlwZSA9IGdldFByb3RvdHlwZU9mICYmIGdldFByb3RvdHlwZU9mKE9iamVjdCk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaG9pc3ROb25SZWFjdFN0YXRpY3ModGFyZ2V0Q29tcG9uZW50LCBzb3VyY2VDb21wb25lbnQsIGJsYWNrbGlzdCkge1xuICAgIGlmICh0eXBlb2Ygc291cmNlQ29tcG9uZW50ICE9PSAnc3RyaW5nJykgeyAvLyBkb24ndCBob2lzdCBvdmVyIHN0cmluZyAoaHRtbCkgY29tcG9uZW50c1xuXG4gICAgICAgIGlmIChvYmplY3RQcm90b3R5cGUpIHtcbiAgICAgICAgICAgIHZhciBpbmhlcml0ZWRDb21wb25lbnQgPSBnZXRQcm90b3R5cGVPZihzb3VyY2VDb21wb25lbnQpO1xuICAgICAgICAgICAgaWYgKGluaGVyaXRlZENvbXBvbmVudCAmJiBpbmhlcml0ZWRDb21wb25lbnQgIT09IG9iamVjdFByb3RvdHlwZSkge1xuICAgICAgICAgICAgICAgIGhvaXN0Tm9uUmVhY3RTdGF0aWNzKHRhcmdldENvbXBvbmVudCwgaW5oZXJpdGVkQ29tcG9uZW50LCBibGFja2xpc3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGtleXMgPSBnZXRPd25Qcm9wZXJ0eU5hbWVzKHNvdXJjZUNvbXBvbmVudCk7XG5cbiAgICAgICAgaWYgKGdldE93blByb3BlcnR5U3ltYm9scykge1xuICAgICAgICAgICAga2V5cyA9IGtleXMuY29uY2F0KGdldE93blByb3BlcnR5U3ltYm9scyhzb3VyY2VDb21wb25lbnQpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgdmFyIGtleSA9IGtleXNbaV07XG4gICAgICAgICAgICBpZiAoIVJFQUNUX1NUQVRJQ1Nba2V5XSAmJiAhS05PV05fU1RBVElDU1trZXldICYmICghYmxhY2tsaXN0IHx8ICFibGFja2xpc3Rba2V5XSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGVzY3JpcHRvciA9IGdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2VDb21wb25lbnQsIGtleSk7XG4gICAgICAgICAgICAgICAgdHJ5IHsgLy8gQXZvaWQgZmFpbHVyZXMgZnJvbSByZWFkLW9ubHkgcHJvcGVydGllc1xuICAgICAgICAgICAgICAgICAgICBkZWZpbmVQcm9wZXJ0eSh0YXJnZXRDb21wb25lbnQsIGtleSwgZGVzY3JpcHRvcik7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0YXJnZXRDb21wb25lbnQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhcmdldENvbXBvbmVudDtcbn07XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfcHJvcFR5cGVzID0gcmVxdWlyZSgncHJvcC10eXBlcycpO1xuXG52YXIgX3Byb3BUeXBlczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wcm9wVHlwZXMpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMob2JqLCBrZXlzKSB7IHZhciB0YXJnZXQgPSB7fTsgZm9yICh2YXIgaSBpbiBvYmopIHsgaWYgKGtleXMuaW5kZXhPZihpKSA+PSAwKSBjb250aW51ZTsgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBpKSkgY29udGludWU7IHRhcmdldFtpXSA9IG9ialtpXTsgfSByZXR1cm4gdGFyZ2V0OyB9XG5cbnZhciBJY29uQmFzZSA9IGZ1bmN0aW9uIEljb25CYXNlKF9yZWYsIF9yZWYyKSB7XG4gIHZhciBjaGlsZHJlbiA9IF9yZWYuY2hpbGRyZW47XG4gIHZhciBjb2xvciA9IF9yZWYuY29sb3I7XG4gIHZhciBzaXplID0gX3JlZi5zaXplO1xuICB2YXIgc3R5bGUgPSBfcmVmLnN0eWxlO1xuICB2YXIgd2lkdGggPSBfcmVmLndpZHRoO1xuICB2YXIgaGVpZ2h0ID0gX3JlZi5oZWlnaHQ7XG5cbiAgdmFyIHByb3BzID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzKF9yZWYsIFsnY2hpbGRyZW4nLCAnY29sb3InLCAnc2l6ZScsICdzdHlsZScsICd3aWR0aCcsICdoZWlnaHQnXSk7XG5cbiAgdmFyIF9yZWYyJHJlYWN0SWNvbkJhc2UgPSBfcmVmMi5yZWFjdEljb25CYXNlO1xuICB2YXIgcmVhY3RJY29uQmFzZSA9IF9yZWYyJHJlYWN0SWNvbkJhc2UgPT09IHVuZGVmaW5lZCA/IHt9IDogX3JlZjIkcmVhY3RJY29uQmFzZTtcblxuICB2YXIgY29tcHV0ZWRTaXplID0gc2l6ZSB8fCByZWFjdEljb25CYXNlLnNpemUgfHwgJzFlbSc7XG4gIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudCgnc3ZnJywgX2V4dGVuZHMoe1xuICAgIGNoaWxkcmVuOiBjaGlsZHJlbixcbiAgICBmaWxsOiAnY3VycmVudENvbG9yJyxcbiAgICBwcmVzZXJ2ZUFzcGVjdFJhdGlvOiAneE1pZFlNaWQgbWVldCcsXG4gICAgaGVpZ2h0OiBoZWlnaHQgfHwgY29tcHV0ZWRTaXplLFxuICAgIHdpZHRoOiB3aWR0aCB8fCBjb21wdXRlZFNpemVcbiAgfSwgcmVhY3RJY29uQmFzZSwgcHJvcHMsIHtcbiAgICBzdHlsZTogX2V4dGVuZHMoe1xuICAgICAgdmVydGljYWxBbGlnbjogJ21pZGRsZScsXG4gICAgICBjb2xvcjogY29sb3IgfHwgcmVhY3RJY29uQmFzZS5jb2xvclxuICAgIH0sIHJlYWN0SWNvbkJhc2Uuc3R5bGUgfHwge30sIHN0eWxlKVxuICB9KSk7XG59O1xuXG5JY29uQmFzZS5wcm9wVHlwZXMgPSB7XG4gIGNvbG9yOiBfcHJvcFR5cGVzMi5kZWZhdWx0LnN0cmluZyxcbiAgc2l6ZTogX3Byb3BUeXBlczIuZGVmYXVsdC5vbmVPZlR5cGUoW19wcm9wVHlwZXMyLmRlZmF1bHQuc3RyaW5nLCBfcHJvcFR5cGVzMi5kZWZhdWx0Lm51bWJlcl0pLFxuICB3aWR0aDogX3Byb3BUeXBlczIuZGVmYXVsdC5vbmVPZlR5cGUoW19wcm9wVHlwZXMyLmRlZmF1bHQuc3RyaW5nLCBfcHJvcFR5cGVzMi5kZWZhdWx0Lm51bWJlcl0pLFxuICBoZWlnaHQ6IF9wcm9wVHlwZXMyLmRlZmF1bHQub25lT2ZUeXBlKFtfcHJvcFR5cGVzMi5kZWZhdWx0LnN0cmluZywgX3Byb3BUeXBlczIuZGVmYXVsdC5udW1iZXJdKSxcbiAgc3R5bGU6IF9wcm9wVHlwZXMyLmRlZmF1bHQub2JqZWN0XG59O1xuXG5JY29uQmFzZS5jb250ZXh0VHlwZXMgPSB7XG4gIHJlYWN0SWNvbkJhc2U6IF9wcm9wVHlwZXMyLmRlZmF1bHQuc2hhcGUoSWNvbkJhc2UucHJvcFR5cGVzKVxufTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gSWNvbkJhc2U7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxudmFyIF9yZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX3JlYWN0SWNvbkJhc2UgPSByZXF1aXJlKCdyZWFjdC1pY29uLWJhc2UnKTtcblxudmFyIF9yZWFjdEljb25CYXNlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0SWNvbkJhc2UpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgR29NYXJrR2l0aHViID0gZnVuY3Rpb24gR29NYXJrR2l0aHViKHByb3BzKSB7XG4gICAgcmV0dXJuIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICBfcmVhY3RJY29uQmFzZTIuZGVmYXVsdCxcbiAgICAgICAgX2V4dGVuZHMoeyB2aWV3Qm94OiAnMCAwIDQwIDQwJyB9LCBwcm9wcyksXG4gICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgJ2cnLFxuICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KCdwYXRoJywgeyBkOiAnbTIwIDBjLTExIDAtMjAgOS0yMCAyMCAwIDguOCA1LjcgMTYuMyAxMy43IDE5IDEgMC4yIDEuMy0wLjUgMS4zLTEgMC0wLjUgMC0yIDAtMy43LTUuNSAxLjItNi43LTIuNC02LjctMi40LTAuOS0yLjMtMi4yLTIuOS0yLjItMi45LTEuOS0xLjIgMC4xLTEuMiAwLjEtMS4yIDIgMC4xIDMuMSAyLjEgMy4xIDIuMSAxLjcgMyA0LjYgMi4xIDUuOCAxLjYgMC4yLTEuMyAwLjctMi4yIDEuMy0yLjctNC41LTAuNS05LjItMi4yLTkuMi05LjggMC0yLjIgMC44LTQgMi4xLTUuNC0wLjItMC41LTAuOS0yLjYgMC4yLTUuMyAwIDAgMS43LTAuNSA1LjUgMiAxLjYtMC40IDMuMy0wLjYgNS0wLjYgMS43IDAgMy40IDAuMiA1IDAuNyAzLjgtMi42IDUuNS0yLjEgNS41LTIuMSAxLjEgMi44IDAuNCA0LjggMC4yIDUuMyAxLjMgMS40IDIuMSAzLjIgMi4xIDUuNCAwIDcuNi00LjcgOS4zLTkuMiA5LjggMC43IDAuNiAxLjQgMS45IDEuNCAzLjcgMCAyLjcgMCA0LjkgMCA1LjUgMCAwLjYgMC4zIDEuMiAxLjMgMSA4LTIuNyAxMy43LTEwLjIgMTMuNy0xOSAwLTExLTktMjAtMjAtMjB6JyB9KVxuICAgICAgICApXG4gICAgKTtcbn07XG5cbmV4cG9ydHMuZGVmYXVsdCA9IEdvTWFya0dpdGh1Yjtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfcmVhY3RJY29uQmFzZSA9IHJlcXVpcmUoJ3JlYWN0LWljb24tYmFzZScpO1xuXG52YXIgX3JlYWN0SWNvbkJhc2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3RJY29uQmFzZSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBHb1RocmVlQmFycyA9IGZ1bmN0aW9uIEdvVGhyZWVCYXJzKHByb3BzKSB7XG4gICAgcmV0dXJuIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICBfcmVhY3RJY29uQmFzZTIuZGVmYXVsdCxcbiAgICAgICAgX2V4dGVuZHMoeyB2aWV3Qm94OiAnMCAwIDQwIDQwJyB9LCBwcm9wcyksXG4gICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgJ2cnLFxuICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KCdwYXRoJywgeyBkOiAnbTUgNy41djVoMzB2LTVoLTMweiBtMCAxNWgzMHYtNWgtMzB2NXogbTAgMTBoMzB2LTVoLTMwdjV6JyB9KVxuICAgICAgICApXG4gICAgKTtcbn07XG5cbmV4cG9ydHMuZGVmYXVsdCA9IEdvVGhyZWVCYXJzO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBob2lzdE5vblJlYWN0U3RhdGljcyBmcm9tICdob2lzdC1ub24tcmVhY3Qtc3RhdGljcyc7XG5pbXBvcnQgbG9jYWxlU2VydmljZSBmcm9tICcuLy4uL3NlcnZpY2VzL0xvY2FsZVNlcnZpY2UnO1xuaW1wb3J0IGkxOG5TZXJ2aWNlIGZyb20gJy4vLi4vc2VydmljZXMvSTE4blNlcnZpY2UnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBsb2NhbGVBd2FyZShDb21wb25lbnQpIHtcbiAgY2xhc3MgTG9jYWxlQXdhcmUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XG4gICAgICBzdXBlcihwcm9wcywgY29udGV4dCk7XG4gICAgICB0aGlzLmhhbmRsZUxvY2FsZUNoYW5nZSA9IHRoaXMuaGFuZGxlTG9jYWxlQ2hhbmdlLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLnVucmVnaXN0ZXJMb2NhbGVDaGFuZ2UgPSBudWxsO1xuICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgbG9jYWxlOiBsb2NhbGVTZXJ2aWNlLmxvY2FsZVxuICAgICAgfTtcbiAgICAgIHRoaXMuX21vdW50ZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMuX2NvbXBvbmVudCA9IG51bGw7XG4gICAgfVxuXG4gICAgaGFuZGxlTG9jYWxlQ2hhbmdlKGxvY2FsZSkge1xuICAgICAgdGhpcy5fbW91bnRlZCAmJiB0aGlzLnN0YXRlLmxvY2FsZSAhPT0gbG9jYWxlICYmIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBsb2NhbGVcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgdGhpcy51bnJlZ2lzdGVyTG9jYWxlQ2hhbmdlID0gbG9jYWxlU2VydmljZS5vbkxvY2FsZUNoYW5nZSh0aGlzLmhhbmRsZUxvY2FsZUNoYW5nZSk7XG4gICAgICB0aGlzLl9tb3VudGVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICAgIHRoaXMuX21vdW50ZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMudW5yZWdpc3RlckxvY2FsZUNoYW5nZSgpO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgIGNvbnN0IHsgbG9jYWxlIH0gPSB0aGlzLnN0YXRlO1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPENvbXBvbmVudCB7IC4uLnRoaXMucHJvcHMgfVxuICAgICAgICAgIGxvY2FsZT17IGxvY2FsZSB9XG4gICAgICAgICAgdHJhbnNsYXRpb25zPXsgaTE4blNlcnZpY2UuY3VycmVudExhbmdUcmFuc2xhdGlvbnMgfVxuICAgICAgICAgIHJlZj17IGNvbXAgPT4gdGhpcy5fY29tcG9uZW50ID0gY29tcCB9XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIExvY2FsZUF3YXJlLmRpc3BsYXlOYW1lID0gYExvY2FsZUF3YXJlKCR7XG4gICAgQ29tcG9uZW50LmRpc3BsYXlOYW1lIHx8XG4gICAgQ29tcG9uZW50Lm5hbWUgfHxcbiAgICAnQ29tcG9uZW50J1xuICB9KWA7XG5cbiAgcmV0dXJuIGhvaXN0Tm9uUmVhY3RTdGF0aWNzKExvY2FsZUF3YXJlLCBDb21wb25lbnQpO1xufVxuIiwiaW1wb3J0IGxvY2FsZVNlcnZpY2UgZnJvbSAnLi9Mb2NhbGVTZXJ2aWNlJztcblxuY29uc3QgZW1wdHlPYmogPSB7fTtcblxuY2xhc3MgSTE4blNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBsb2NhbGVTZXJ2aWNlLm9uTG9jYWxlQ2hhbmdlKHRoaXMuX2hhbmRsZUxvY2FsZUNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLl9sb2NhbGUgPSBsb2NhbGVTZXJ2aWNlLmxvY2FsZTtcbiAgICB0aGlzLl90cmFuc2xhdGlvbnMgPSB7fTtcbiAgfVxuXG4gIF9oYW5kbGVMb2NhbGVDaGFuZ2UobG9jYWxlKSB7XG4gICAgdGhpcy5fbG9jYWxlID0gbG9jYWxlO1xuICB9XG5cbiAgY2xlYXJUcmFuc2xhdGlvbnMobGFuZykge1xuICAgIGRlbGV0ZSB0aGlzLl90cmFuc2xhdGlvbnNbbGFuZ107XG4gIH1cblxuICByZWdpc3RlclRyYW5zbGF0aW9ucyh0cmFuc2xhdGlvbnMpIHtcbiAgICB0aGlzLl90cmFuc2xhdGlvbnMgPSBPYmplY3Qua2V5cyh0cmFuc2xhdGlvbnMpLnJlZHVjZSgoYWNjLCBsYW5nKSA9PiB7XG4gICAgICBhY2NbbGFuZ10gPSB7XG4gICAgICAgIC4uLnRoaXMuX3RyYW5zbGF0aW9uc1tsYW5nXSxcbiAgICAgICAgLi4udHJhbnNsYXRpb25zW2xhbmddXG4gICAgICB9O1xuICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCB0aGlzLl90cmFuc2xhdGlvbnMpO1xuICB9XG5cbiAgdHJhbnNsYXRlKG1zZykge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnRMYW5nVHJhbnNsYXRpb25zW21zZ107XG4gIH1cblxuICBnZXQgdHJhbnNsYXRpb25zKCkge1xuICAgIHJldHVybiB0aGlzLl90cmFuc2xhdGlvbnM7XG4gIH1cblxuICBnZXQgY3VycmVudExhbmdUcmFuc2xhdGlvbnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RyYW5zbGF0aW9uc1t0aGlzLl9sb2NhbGUubGFuZ10gfHwgZW1wdHlPYmo7XG4gIH1cbn1cblxuY29uc3QgaTE4blNlcnZpY2UgPSBuZXcgSTE4blNlcnZpY2UoKTtcbmV4cG9ydCBkZWZhdWx0IGkxOG5TZXJ2aWNlO1xuIiwiXG5jb25zdCBkZWZhdWx0TG9jYWxlID0ge1xuICBkaXI6ICdsdHInLFxuICBsYW5nOiAnZW4nXG59O1xuXG5jbGFzcyBMb2NhbGVTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fY2FsbGJhY2tzID0gW107XG4gICAgdGhpcy5fbG9jYWxlQXR0cnMgPSBPYmplY3Qua2V5cyhkZWZhdWx0TG9jYWxlKTtcbiAgICB0aGlzLl9yb290RWxlbWVudCA9IHdpbmRvdy5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgdGhpcy5fbG9jYWxlQXR0cnMuZm9yRWFjaCgoYXR0cikgPT4ge1xuICAgICAgaWYgKCF0aGlzLl9yb290RWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cikpIHtcbiAgICAgICAgdGhpcy5fcm9vdEVsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHIsIGRlZmF1bHRMb2NhbGVbYXR0cl0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuX2xvY2FsZSA9IHRoaXMuX2xvY2FsZUF0dHJzLnJlZHVjZSgoYWNjLCBhdHRyKSA9PiB7XG4gICAgICBhY2NbYXR0cl0gPSB0aGlzLl9yb290RWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cik7XG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHt9KTtcbiAgICB0aGlzLl9vYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMuX2hhbmRsZU11dGF0aW9ucy5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLl9vYnNlcnZlci5vYnNlcnZlKHRoaXMuX3Jvb3RFbGVtZW50LCB7XG4gICAgICBhdHRyaWJ1dGVzOiB0cnVlXG4gICAgfSk7XG4gIH1cblxuICBfaGFuZGxlTXV0YXRpb25zKG11dGF0aW9ucykge1xuICAgIG11dGF0aW9ucy5mb3JFYWNoKChtdXRhdGlvbikgPT4ge1xuICAgICAgY29uc3QgbXV0YXRpb25BdHRyaWJ1dGVOYW1lID0gbXV0YXRpb24uYXR0cmlidXRlTmFtZTtcbiAgICAgIGlmICh0aGlzLl9sb2NhbGVBdHRycy5pbmNsdWRlcyhtdXRhdGlvbkF0dHJpYnV0ZU5hbWUpKSB7XG4gICAgICAgIHRoaXMuX2xvY2FsZSA9IHtcbiAgICAgICAgICAuLi50aGlzLl9sb2NhbGUsXG4gICAgICAgICAgW211dGF0aW9uQXR0cmlidXRlTmFtZV06IHRoaXMuX3Jvb3RFbGVtZW50LmdldEF0dHJpYnV0ZShtdXRhdGlvbkF0dHJpYnV0ZU5hbWUpXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX2NhbGxiYWNrcy5mb3JFYWNoKGNhbGxiYWNrID0+IGNhbGxiYWNrKHRoaXMuX2xvY2FsZSkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc2V0IGxvY2FsZShsb2NhbGVPYmopIHtcbiAgICBPYmplY3Qua2V5cyhsb2NhbGVPYmopLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgdGhpcy5fcm9vdEVsZW1lbnQuc2V0QXR0cmlidXRlKGtleSwgbG9jYWxlT2JqW2tleV0pO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0IGxvY2FsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fbG9jYWxlO1xuICB9XG5cbiAgb25Mb2NhbGVDaGFuZ2UoY2FsbGJhY2spIHtcbiAgICB0aGlzLl9jYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG4gICAgY2FsbGJhY2sodGhpcy5sb2NhbGUpO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MuZmlsdGVyKGNiID0+IGNiICE9PSBjYWxsYmFjayk7XG4gICAgfTtcbiAgfVxufVxuXG5jb25zdCBsb2NhbGVTZXJ2aWNlID0gbmV3IExvY2FsZVNlcnZpY2UoKTtcbmV4cG9ydCBkZWZhdWx0IGxvY2FsZVNlcnZpY2U7XG4iLCJcbmltcG9ydCBMb2NhbGVTZXJ2aWNlIGZyb20gJy4uLy4uL3NlcnZpY2VzL0xvY2FsZVNlcnZpY2UnO1xuaW1wb3J0IGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbiBmcm9tICcuLi9pbnRlcm5hbHMvZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uJztcblxuY29uc3QgcmVnaXN0cmF0aW9uTmFtZSA9ICdEQlVJV2ViQ29tcG9uZW50QmFzZSc7XG5cbmZ1bmN0aW9uIGRlZmluZUNvbW1vbkNTU1ZhcnMoKSB7XG4gIGNvbnN0IGNvbW1vblN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgY29tbW9uU3R5bGUuaW5uZXJIVE1MID0gYFxuICA6cm9vdCB7XG4gICAgLS1kYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC1oZWlnaHQ6IDUwcHg7XG4gICAgLS1kYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC1jb2xvcjogIzAwMDtcbiAgICAtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWJhY2tncm91bmQtY29sb3I6ICNmZmY7XG4gIH1cbiAgYDtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaGVhZCcpLmFwcGVuZENoaWxkKGNvbW1vblN0eWxlKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0REJVSVdlYkNvbXBvbmVudEJhc2Uod2luKSB7XG4gIHJldHVybiBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24od2luLCByZWdpc3RyYXRpb25OYW1lLCAoKSA9PiB7XG4gICAgZGVmaW5lQ29tbW9uQ1NTVmFycygpO1xuICAgIGNvbnN0IHsgZG9jdW1lbnQsIEhUTUxFbGVtZW50LCBjdXN0b21FbGVtZW50cyB9ID0gd2luO1xuXG4gICAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9ICc8c3R5bGU+PC9zdHlsZT48c2xvdD48L3Nsb3Q+JztcblxuICAgIGNsYXNzIERCVUlXZWJDb21wb25lbnRCYXNlIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuXG4gICAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlKCkge1xuICAgICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgZGVwZW5kZW5jaWVzKCkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgdXNlU2hhZG93KCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIGNvbnN0IHsgdXNlU2hhZG93IH0gPSB0aGlzLmNvbnN0cnVjdG9yO1xuICAgICAgICBpZiAodXNlU2hhZG93KSB7XG4gICAgICAgICAgdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5faW5zZXJ0VGVtcGxhdGUoKTtcblxuICAgICAgICB0aGlzLmNvbm5lY3RlZENhbGxiYWNrID0gdGhpcy5jb25uZWN0ZWRDYWxsYmFjay5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmRpc2Nvbm5lY3RlZENhbGxiYWNrID0gdGhpcy5kaXNjb25uZWN0ZWRDYWxsYmFjay5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLl9oYW5kbGVMb2NhbGVDaGFuZ2UgPSB0aGlzLl9oYW5kbGVMb2NhbGVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vbkxvY2FsZUNoYW5nZSAmJiAodGhpcy5vbkxvY2FsZUNoYW5nZSA9IHRoaXMub25Mb2NhbGVDaGFuZ2UuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMudW5yZWdpc3RlckxvY2FsZUNoYW5nZSA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmVmb3JldW5sb2FkJywgdGhpcy5kaXNjb25uZWN0ZWRDYWxsYmFjaywgZmFsc2UpO1xuXG4gICAgICAgIHRoaXMudW5yZWdpc3RlckxvY2FsZUNoYW5nZSA9XG4gICAgICAgICAgTG9jYWxlU2VydmljZS5vbkxvY2FsZUNoYW5nZSh0aGlzLl9oYW5kbGVMb2NhbGVDaGFuZ2UpO1xuICAgICAgfVxuXG4gICAgICBkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgICAgdGhpcy51bnJlZ2lzdGVyTG9jYWxlQ2hhbmdlKCk7XG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdiZWZvcmV1bmxvYWQnLCB0aGlzLmRpc2Nvbm5lY3RlZENhbGxiYWNrLCBmYWxzZSk7XG4gICAgICB9XG5cbiAgICAgIGdldCBjaGlsZHJlblRyZWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLnVzZVNoYWRvdyA/IHRoaXMuc2hhZG93Um9vdCA6IHRoaXM7XG4gICAgICB9XG5cbiAgICAgIF9pbnNlcnRUZW1wbGF0ZSgpIHtcbiAgICAgICAgY29uc3QgeyB0ZW1wbGF0ZSB9ID0gdGhpcy5jb25zdHJ1Y3RvcjtcblxuICAgICAgICBpZiAodGVtcGxhdGUpIHtcbiAgICAgICAgICB0aGlzLmNoaWxkcmVuVHJlZS5hcHBlbmRDaGlsZCh0ZW1wbGF0ZS5jb250ZW50LmNsb25lTm9kZSh0cnVlKSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgX2hhbmRsZUxvY2FsZUNoYW5nZShsb2NhbGUpIHtcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2RpcicsIGxvY2FsZS5kaXIpO1xuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnbGFuZycsIGxvY2FsZS5sYW5nKTtcbiAgICAgICAgdGhpcy5vbkxvY2FsZUNoYW5nZSAmJiB0aGlzLm9uTG9jYWxlQ2hhbmdlKGxvY2FsZSk7XG4gICAgICB9XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzKGtsYXNzKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoa2xhc3MsICdjb21wb25lbnRTdHlsZScsIHtcbiAgICAgICAgZ2V0KCkge1xuICAgICAgICAgIHJldHVybiBrbGFzcy50ZW1wbGF0ZS5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ3N0eWxlJykuaW5uZXJIVE1MO1xuICAgICAgICB9LFxuICAgICAgICBzZXQodmFsdWUpIHtcbiAgICAgICAgICBrbGFzcy50ZW1wbGF0ZS5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ3N0eWxlJykuaW5uZXJIVE1MID0gdmFsdWU7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfSk7XG5cbiAgICAgIGtsYXNzLnJlZ2lzdGVyU2VsZiA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgcmVnaXN0cmF0aW9uTmFtZSA9IGtsYXNzLnJlZ2lzdHJhdGlvbk5hbWU7XG4gICAgICAgIGNvbnN0IGRlcGVuZGVuY2llcyA9IGtsYXNzLmRlcGVuZGVuY2llcztcbiAgICAgICAgLy8gTWFrZSBzdXJlIG91ciBkZXBlbmRlbmNpZXMgYXJlIHJlZ2lzdGVyZWQgYmVmb3JlIHdlIHJlZ2lzdGVyIHNlbGZcbiAgICAgICAgZGVwZW5kZW5jaWVzLmZvckVhY2goKGRlcGVuZGVuY3kpID0+IGRlcGVuZGVuY3kucmVnaXN0ZXJTZWxmKCkpO1xuICAgICAgICAvLyBEb24ndCB0cnkgdG8gcmVnaXN0ZXIgc2VsZiBpZiBhbHJlYWR5IHJlZ2lzdGVyZWRcbiAgICAgICAgaWYgKGN1c3RvbUVsZW1lbnRzLmdldChyZWdpc3RyYXRpb25OYW1lKSkgcmV0dXJuIHJlZ2lzdHJhdGlvbk5hbWU7XG4gICAgICAgIC8vIEdpdmUgYSBjaGFuY2UgdG8gb3ZlcnJpZGUgd2ViLWNvbXBvbmVudCBzdHlsZSBpZiBwcm92aWRlZCBiZWZvcmUgYmVpbmcgcmVnaXN0ZXJlZC5cbiAgICAgICAgY29uc3QgY29tcG9uZW50U3R5bGUgPSAoKHdpbi5EQlVJV2ViQ29tcG9uZW50cyB8fCB7fSlbcmVnaXN0cmF0aW9uTmFtZV0gfHwge30pLmNvbXBvbmVudFN0eWxlO1xuICAgICAgICBpZiAoY29tcG9uZW50U3R5bGUpIHtcbiAgICAgICAgICBrbGFzcy5jb21wb25lbnRTdHlsZSArPSBjb21wb25lbnRTdHlsZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBEbyByZWdpc3RyYXRpb25cbiAgICAgICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKHJlZ2lzdHJhdGlvbk5hbWUsIGtsYXNzKTtcbiAgICAgICAgcmV0dXJuIHJlZ2lzdHJhdGlvbk5hbWU7XG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBEQlVJV2ViQ29tcG9uZW50QmFzZSxcbiAgICAgIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHNcbiAgICB9O1xuICB9KTtcbn1cbiIsIlxuaW1wb3J0IGdldERCVUlXZWJDb21wb25lbnRCYXNlIGZyb20gJy4uL0RCVUlXZWJDb21wb25lbnRCYXNlL0RCVUlXZWJDb21wb25lbnRCYXNlJztcbmltcG9ydCBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24gZnJvbSAnLi4vaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbic7XG5cbmNvbnN0IHJlZ2lzdHJhdGlvbk5hbWUgPSAnZGJ1aS13ZWItY29tcG9uZW50LWR1bW15JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0REJVSVdlYkNvbXBvbmVudER1bW15KHdpbikge1xuICByZXR1cm4gZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uKHdpbiwgcmVnaXN0cmF0aW9uTmFtZSwgKCkgPT4ge1xuICAgIGNvbnN0IHsgREJVSVdlYkNvbXBvbmVudEJhc2UsIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMgfSA9IGdldERCVUlXZWJDb21wb25lbnRCYXNlKHdpbik7XG4gICAgY29uc3QgeyBkb2N1bWVudCB9ID0gd2luO1xuXG4gICAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IGBcbiAgICAgIDxzdHlsZT5cbiAgICAgIDpob3N0IHtcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgbWF4LXdpZHRoOiA0MDBweDtcbiAgICAgICAgaGVpZ2h0OiB2YXIoLS1kYnVpLWlucHV0LWhlaWdodCwgNTBweCk7XG4gICAgICAgIGNvbG9yOiBtYXJvb247XG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIGdyYXk7XG4gICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgICB9XG4gICAgICBcbiAgICAgIDpob3N0IGIsIDpob3N0IGRpdlt4LWhhcy1zbG90XSBzcGFuW3gtc2xvdC13cmFwcGVyXSB7XG4gICAgICAgIHVuaWNvZGUtYmlkaTogYmlkaS1vdmVycmlkZTtcbiAgICAgICAgdGV4dC1zaGFkb3c6IHZhcigtLWR1bW15LWItdGV4dC1zaGFkb3csIG5vbmUpO1xuICAgICAgfVxuXG4gICAgICA6aG9zdChbZGlyPXJ0bF0pIGIge1xuICAgICAgICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgOmhvc3QoW2Rpcj1sdHJdKSBiIHtcbiAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiBvdmVybGluZTtcbiAgICAgIH1cblxuICAgICAgOmhvc3QoW2Rpcj1sdHJdKSAjY29udGFpbmVyID4gZGl2W2Rpcj1ydGxdLFxuICAgICAgOmhvc3QoW2Rpcj1ydGxdKSAjY29udGFpbmVyID4gZGl2W2Rpcj1sdHJdIHtcbiAgICAgICAgZGlzcGxheTogbm9uZTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgOmhvc3QgI2NvbnRhaW5lciA+IGRpdlt4LWhhcy1zbG90XSB7XG4gICAgICAgIG1hcmdpbi1sZWZ0OiAwcHg7XG4gICAgICB9XG4gICAgICBcbiAgICAgICNjb250YWluZXIge1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWZsb3c6IHJvdyBub3dyYXA7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBzdHJldGNoO1xuICAgICAgfVxuICAgICAgXG4gICAgICAjY29udGFpbmVyID4gZGl2IHtcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgZ3JheTtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogdmFyKC0tZHVtbXktaW5uZXItc2VjdGlvbnMtYm9yZGVyLXJhZGl1cywgMHB4KTtcbiAgICAgICAgZmxleDogMSAwIDAlO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBtYXJnaW46IDVweDtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgI2NvbnRhaW5lciA+IGRpdiA+IGRpdiB7XG4gICAgICAgIG1hcmdpbjogYXV0bztcbiAgICAgIH1cbiAgICAgIFxuICAgICAgPC9zdHlsZT5cbiAgICAgIFxuICAgICAgPGRpdiBpZD1cImNvbnRhaW5lclwiPlxuICAgICAgICA8ZGl2IGRpcj1cImx0clwiPlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8Yj5EdW1teSBzaGFkb3c8L2I+IFtMVFJdXG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICBcbiAgICAgICAgPGRpdiB4LWhhcy1zbG90PlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8c3Bhbj5bPC9zcGFuPjxzcGFuIHgtc2xvdC13cmFwcGVyPjxzbG90Pjwvc2xvdD48L3NwYW4+PHNwYW4+XTwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIFxuICAgICAgICA8ZGl2IGRpcj1cInJ0bFwiPlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8Yj5EdW1teSBzaGFkb3c8L2I+IFtSVExdXG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgYDtcblxuICAgIGNsYXNzIERCVUlXZWJDb21wb25lbnREdW1teSBleHRlbmRzIERCVUlXZWJDb21wb25lbnRCYXNlIHtcbiAgICAgIHN0YXRpYyBnZXQgcmVnaXN0cmF0aW9uTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHJlZ2lzdHJhdGlvbk5hbWU7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgdGVtcGxhdGUoKSB7XG4gICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICAgIH1cblxuICAgICAgb25Mb2NhbGVDaGFuZ2UobG9jYWxlKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdvbkxvY2FsZUNoYW5nZScsIGxvY2FsZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyhEQlVJV2ViQ29tcG9uZW50RHVtbXkpO1xuXG4gICAgcmV0dXJuIERCVUlXZWJDb21wb25lbnREdW1teTtcbiAgfSk7XG59XG5cbmdldERCVUlXZWJDb21wb25lbnREdW1teS5yZWdpc3RyYXRpb25OYW1lID0gcmVnaXN0cmF0aW9uTmFtZTtcblxuIiwiXG5cbmltcG9ydCBnZXREQlVJV2ViQ29tcG9uZW50QmFzZSBmcm9tICcuLi9EQlVJV2ViQ29tcG9uZW50QmFzZS9EQlVJV2ViQ29tcG9uZW50QmFzZSc7XG5pbXBvcnQgZ2V0REJVSVdlYkNvbXBvbmVudER1bW15IGZyb20gJy4uL0RCVUlXZWJDb21wb25lbnREdW1teS9EQlVJV2ViQ29tcG9uZW50RHVtbXknO1xuaW1wb3J0IGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbiBmcm9tICcuLi9pbnRlcm5hbHMvZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uJztcblxuY29uc3QgcmVnaXN0cmF0aW9uTmFtZSA9ICdkYnVpLXdlYi1jb21wb25lbnQtZHVtbXktcGFyZW50JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0REJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50KHdpbikge1xuICByZXR1cm4gZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uKHdpbiwgcmVnaXN0cmF0aW9uTmFtZSwgKCkgPT4ge1xuICAgIGNvbnN0IHsgREJVSVdlYkNvbXBvbmVudEJhc2UsIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMgfSA9IGdldERCVUlXZWJDb21wb25lbnRCYXNlKHdpbik7XG4gICAgY29uc3QgREJVSVdlYkNvbXBvbmVudER1bW15ID0gZ2V0REJVSVdlYkNvbXBvbmVudER1bW15KHdpbik7XG5cbiAgICBjb25zdCB7IGRvY3VtZW50IH0gPSB3aW47XG5cbiAgICBjb25zdCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gYFxuICAgICAgPHN0eWxlPlxuICAgICAgOmhvc3Qge1xuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBtYXgtd2lkdGg6IDQwMHB4O1xuICAgICAgfVxuICAgICAgPC9zdHlsZT5cbiAgICAgIDxkaXY+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGI+RHVtbXkgUGFyZW50IHNoYWRvdzwvYj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGRidWktd2ViLWNvbXBvbmVudC1kdW1teT48c2xvdD48L3Nsb3Q+PC9kYnVpLXdlYi1jb21wb25lbnQtZHVtbXk+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgYDtcblxuICAgIGNsYXNzIERCVUlXZWJDb21wb25lbnREdW1teVBhcmVudCBleHRlbmRzIERCVUlXZWJDb21wb25lbnRCYXNlIHtcbiAgICAgIHN0YXRpYyBnZXQgcmVnaXN0cmF0aW9uTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHJlZ2lzdHJhdGlvbk5hbWU7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgdGVtcGxhdGUoKSB7XG4gICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCBkZXBlbmRlbmNpZXMoKSB7XG4gICAgICAgIHJldHVybiBbREJVSVdlYkNvbXBvbmVudER1bW15XTtcbiAgICAgIH1cblxuICAgIH1cblxuICAgIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMoREJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50KTtcblxuICAgIHJldHVybiBEQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQ7XG4gIH0pO1xufVxuXG5nZXREQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQucmVnaXN0cmF0aW9uTmFtZSA9IHJlZ2lzdHJhdGlvbk5hbWU7XG5cbiIsImltcG9ydCBhcHBlbmRTdHlsZSBmcm9tICcuLi9pbnRlcm5hbHMvYXBwZW5kU3R5bGUnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkYnVpV2ViQ29tcG9uZW50c1NldFVwKHdpbikge1xuICByZXR1cm4ge1xuICAgIGFwcGVuZFN0eWxlOiBhcHBlbmRTdHlsZSh3aW4pXG4gIH07XG59XG4iLCIvKlxuREJVSVdlYkNvbXBvbmVudEJhc2UgKGZyb20gd2hpY2ggYWxsIHdlYi1jb21wb25lbnRzIGluaGVyaXQpXG53aWxsIHJlYWQgY29tcG9uZW50U3R5bGUgZnJvbSB3aW4uREJVSVdlYkNvbXBvbmVudHNcbndoZW4ga2xhc3MucmVnaXN0ZXJTZWxmKCkgaXMgY2FsbGVkIGdpdmluZyBhIGNoYW5jZSB0byBvdmVycmlkZSBkZWZhdWx0IHdlYi1jb21wb25lbnQgc3R5bGVcbmp1c3QgYmVmb3JlIGl0IGlzIHJlZ2lzdGVyZWQuXG4qL1xuY29uc3QgYXBwZW5kU3R5bGUgPSAod2luKSA9PiAocmVnaXN0cmF0aW9uTmFtZSwgY29tcG9uZW50U3R5bGUpID0+IHtcbiAgaWYgKCF3aW4uREJVSVdlYkNvbXBvbmVudHMpIHtcbiAgICB3aW4uREJVSVdlYkNvbXBvbmVudHMgPSB7fTtcbiAgfVxuICB3aW4uREJVSVdlYkNvbXBvbmVudHMgPSB7XG4gICAgLi4ud2luLkRCVUlXZWJDb21wb25lbnRzLFxuICAgIFtyZWdpc3RyYXRpb25OYW1lXToge1xuICAgICAgLi4ud2luLkRCVUlXZWJDb21wb25lbnRzW3JlZ2lzdHJhdGlvbk5hbWVdLFxuICAgICAgY29tcG9uZW50U3R5bGVcbiAgICB9XG4gIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhcHBlbmRTdHlsZTtcbiIsIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24od2luLCBuYW1lLCBjYWxsYmFjaykge1xuICBpZiAoIXdpbi5EQlVJV2ViQ29tcG9uZW50cykge1xuICAgIHdpbi5EQlVJV2ViQ29tcG9uZW50cyA9IHsgcmVnaXN0cmF0aW9uczoge30gfTtcbiAgfSBlbHNlIGlmICghd2luLkRCVUlXZWJDb21wb25lbnRzLnJlZ2lzdHJhdGlvbnMpIHtcbiAgICB3aW4uREJVSVdlYkNvbXBvbmVudHMucmVnaXN0cmF0aW9ucyA9IHt9O1xuICB9XG5cbiAgbGV0IHJlZ2lzdHJhdGlvbiA9IHdpbi5EQlVJV2ViQ29tcG9uZW50cy5yZWdpc3RyYXRpb25zW25hbWVdO1xuXG4gIGlmIChyZWdpc3RyYXRpb24pIHJldHVybiByZWdpc3RyYXRpb247XG5cbiAgcmVnaXN0cmF0aW9uID0gY2FsbGJhY2soKTtcbiAgd2luLkRCVUlXZWJDb21wb25lbnRzLnJlZ2lzdHJhdGlvbnNbbmFtZV0gPSByZWdpc3RyYXRpb247XG5cbiAgcmV0dXJuIHdpbi5EQlVJV2ViQ29tcG9uZW50cy5yZWdpc3RyYXRpb25zW25hbWVdO1xufVxuXG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IEdvTWFya0dpdGh1YiBmcm9tICdyZWFjdC1pY29ucy9saWIvZ28vbWFyay1naXRodWInO1xuaW1wb3J0IEdvVGhyZWVCYXJzIGZyb20gJ3JlYWN0LWljb25zL2xpYi9nby90aHJlZS1iYXJzJztcbmltcG9ydCB7IHNjcmVlbnMsIHNjcmVlbkxpbmtzR2VuIH0gZnJvbSAnLi9zY3JlZW5zJztcbmltcG9ydCBJRnJhbWVTY3JlZW4gZnJvbSAnLi9pbnRlcm5hbHMvcmVhY3RDb21wb25lbnRzL0lGcmFtZVNjcmVlbic7XG5pbXBvcnQge1xuICB0b2dnbGVBcHBEaXJcbn0gZnJvbSAnLi9pbnRlcm5hbHMvYXBwVXRpbHMnO1xuXG5jbGFzcyBBcHAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsIHRoaXMub25IYXNoQ2hhbmdlLmJpbmQodGhpcykpO1xuICAgIC8vIHJlLXVzaW5nIHRoZSBoZWxwZXIgZGVmaW5lZCBmb3IgaUZyYW1lXG4gICAgd2luZG93Lm1ha2VUYWJzKCk7XG4gICAgd2luZG93LmhpZ2hsaWdodEJsb2NrcygpO1xuICB9XG5cbiAgb25IYXNoQ2hhbmdlKCkge1xuICAgIHRoaXMuZm9yY2VVcGRhdGUoKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICB3aW5kb3cubWFrZVRhYnMoKTtcbiAgICB3aW5kb3cuaGlnaGxpZ2h0QmxvY2tzKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIC8qIGVzbGludCBuby1jb25zb2xlOiAwICovXG4gICAgICAvLyBjb25zb2xlLmxvZygncmVuZGVyaW5nIEFwcCBjb21wb25lbnQnKTtcbiAgICB9XG5cbiAgICBjb25zdCBzY3JlZW5zS2V5cyA9IE9iamVjdC5rZXlzKHNjcmVlbnMpO1xuICAgIGNvbnN0IHdpbmRvd0xvY2F0aW9uSGFzaCA9ICh3aW5kb3cubG9jYXRpb24uaGFzaCB8fCBgIyR7c2NyZWVuc0tleXNbMF19YCkucmVwbGFjZSgnIycsICcnKTtcblxuICAgIGNvbnN0IGxpbmtzID0gc2NyZWVuTGlua3NHZW4ubWFwKChzZWN0aW9uLCBpZHgpID0+IHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYga2V5PXtpZHh9PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibGlua3Mtc2VjdGlvbi1ncm91cFwiPntzZWN0aW9uLnRpdGxlfTwvZGl2PlxuICAgICAgICAgIDx1bD5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgc2VjdGlvbi5saW5rcy5tYXAoKGxpbmssIGlkeCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzQWN0aXZlID0gbGluay5wYXRoID09PSB3aW5kb3dMb2NhdGlvbkhhc2ggPyAnYWN0aXZlJyA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgPGxpIGtleT17aWR4fSB4LWFjdGl2ZT17aXNBY3RpdmV9PlxuICAgICAgICAgICAgICAgICAgICA8YSBocmVmPXtgIyR7bGluay5wYXRofWB9PntsaW5rLnRpdGxlfTwvYT5cbiAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICA8L3VsPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBTY3JlZW4gPSB3aW5kb3dMb2NhdGlvbkhhc2guZW5kc1dpdGgoJy5odG1sJykgPyBJRnJhbWVTY3JlZW4gOiAoc2NyZWVuc1t3aW5kb3dMb2NhdGlvbkhhc2hdIHx8ICdkaXYnKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhZ2UtaGVhZGVyXCI+XG4gICAgICAgICAgPGgyPkRFViBCT1ggVUk8L2gyPjxhXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJoZWFkLWxpbmtcIlxuICAgICAgICAgICAgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9jYXRhbGluLWVuYWNoZS9kZXYtYm94LXVpXCJcbiAgICAgICAgICAgIHJlbD1cIm5vb3BlbmVyIG5vcmVmZXJyZXJcIlxuICAgICAgICAgICAgdGFyZ2V0PVwiX2JsYW5rXCI+PEdvTWFya0dpdGh1YiBzaXplPXsyNX0gLz48L2E+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRlbW8td3JhcHBlclwiPlxuICAgICAgICAgIDxsYWJlbCBpZD1cImxpbmtzLXRvZ2dsZS1sYWJlbFwiIGh0bWxGb3I9XCJsaW5rcy10b2dnbGVcIiBjbGFzc05hbWU9XCJoZWFkLWxpbmtcIj48R29UaHJlZUJhcnMgc2l6ZT17MjV9IC8+PC9sYWJlbD5cbiAgICAgICAgICA8aW5wdXQgaWQ9XCJsaW5rcy10b2dnbGVcIiB0eXBlPVwiY2hlY2tib3hcIiAvPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGVtby1saW5rc1wiIG9uQ2xpY2s9eygpID0+IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNsaW5rcy10b2dnbGUnKS5jaGVja2VkID0gZmFsc2V9PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJsb2NhbGUtZGlyLXN3aXRjaFwiPlxuICAgICAgICAgICAgICA8YSBocmVmPVwiI1wiIG9uQ2xpY2s9e3RvZ2dsZUFwcERpcn0+VE9HR0xFIExPQ0FMRSBESVI8L2E+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIHtsaW5rc31cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRlbW8tYXJlYVwiPlxuICAgICAgICAgICAgPFNjcmVlbi8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBcHA7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtcbiAgLy8gb25TY3JlZW5Db25zb2xlLFxuICBsb2NhbGVBd2FyZVxufSBmcm9tICdkZXYtYm94LXVpJztcbmltcG9ydCBBcHAgZnJvbSAnLi9hcHAnO1xuLy8gZGVmaW5lcyBzb21lIGhlbHBlcnMgb24gd2luZG93IChyZXVzaW5nIGNvZGUgbmVlZGVkIGluIGlGcmFtZXMpXG5pbXBvcnQgJy4vaW50ZXJuYWxzL2lGcmFtZVV0aWxzL29uV2luZG93RGVmaW5lZEhlbHBlcnMnO1xuXG4vLyBpbXBvcnQgZ2V0REJVSVdlYkNvbXBvbmVudER1bW15IGZyb20gJy4uL2J1aWxkL3NyYy9saWIvd2ViY29tcG9uZW50cy9EQlVJV2ViQ29tcG9uZW50RHVtbXkvREJVSVdlYkNvbXBvbmVudER1bW15Jztcbi8vIGltcG9ydCBnZXREQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQgZnJvbSAnLi4vYnVpbGQvc3JjL2xpYi93ZWJjb21wb25lbnRzL0RCVUlXZWJDb21wb25lbnREdW1teVBhcmVudC9EQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQnO1xuaW1wb3J0IGRidWlXZWJDb21wb25lbnRzU2V0VXAgZnJvbSAnLi4vc3JjL2xpYi93ZWJjb21wb25lbnRzL0RCVUlXZWJDb21wb25lbnRzU2V0dXAvREJVSVdlYkNvbXBvbmVudHNTZXR1cCc7XG5pbXBvcnQgZ2V0REJVSVdlYkNvbXBvbmVudER1bW15IGZyb20gJy4uL3NyYy9saWIvd2ViY29tcG9uZW50cy9EQlVJV2ViQ29tcG9uZW50RHVtbXkvREJVSVdlYkNvbXBvbmVudER1bW15JztcbmltcG9ydCBnZXREQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQgZnJvbSAnLi4vc3JjL2xpYi93ZWJjb21wb25lbnRzL0RCVUlXZWJDb21wb25lbnREdW1teVBhcmVudC9EQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQnO1xuXG5kYnVpV2ViQ29tcG9uZW50c1NldFVwKHdpbmRvdykuYXBwZW5kU3R5bGUoJ2RidWktd2ViLWNvbXBvbmVudC1kdW1teScsIGBcbiAgYiB7XG4gICAgY29sb3I6IGRlZXBza3libHVlO1xuICAgIGZvbnQtc3R5bGU6IG9ibGlxdWU7XG4gIH1cbmApO1xuXG5jb25zdCBEQlVJV2ViQ29tcG9uZW50RHVtbXkgPSBnZXREQlVJV2ViQ29tcG9uZW50RHVtbXkod2luZG93KTtcbmNvbnN0IERCVUlXZWJDb21wb25lbnREdW1teVBhcmVudCA9IGdldERCVUlXZWJDb21wb25lbnREdW1teVBhcmVudCh3aW5kb3cpO1xuXG5cbnNldFRpbWVvdXQoKCkgPT4ge1xuICBEQlVJV2ViQ29tcG9uZW50RHVtbXkucmVnaXN0ZXJTZWxmKCk7XG4gIERCVUlXZWJDb21wb25lbnREdW1teVBhcmVudC5yZWdpc3RlclNlbGYoKTtcbn0sIDIwMDApO1xuXG5jb25zdCBpZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcblxud2luZG93Lm9ubWVzc2FnZSA9IGZ1bmN0aW9uIChtc2cpIHsgY29uc29sZS5sb2coJ21zZyBmcm9tIGlmcmFtZScsIG1zZyk7IH07XG5pZnJhbWUub25sb2FkID0gZnVuY3Rpb24gKGV2dCkge1xuICBjb25zdCB0YXJnZXQgPSBldnQudGFyZ2V0O1xuXG4gIHRhcmdldC5jb250ZW50V2luZG93LmRvY3VtZW50LndyaXRlKGBcbiAgICA8aHRtbD5cbiAgICA8Ym9keT5cbiAgICAgIDxkYnVpLXdlYi1jb21wb25lbnQtZHVtbXlcbiAgICAgICAgc3R5bGU9XCJjb2xvcjogYmx1ZVwiXG4gICAgICA+XG4gICAgICAgIDxzcGFuPmhlbGxvIHdvcmxkIDM8L3NwYW4+XG4gICAgICA8L2RidWktd2ViLWNvbXBvbmVudC1kdW1teT5cbiAgICAgIDxkYnVpLXdlYi1jb21wb25lbnQtZHVtbXktcGFyZW50PjwvZGJ1aS13ZWItY29tcG9uZW50LWR1bW15LXBhcmVudD5cbiAgICA8L2JvZHk+XG4gICAgPHNjcmlwdD5cbiAgICAgIHdpbmRvdy5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdtc2cgZnJvbSB3aW5kb3cnLCBtc2cpO1xuICAgICAgICB3aW5kb3cudG9wLnBvc3RNZXNzYWdlKCd3b3JsZCcsICcqJyk7XG4gICAgICB9O1xuICAgIDwvc2NyaXB0PlxuICAgIDwvaHRtbD5cbiAgYCk7XG4gIHRhcmdldC5jb250ZW50V2luZG93LnBvc3RNZXNzYWdlKCdoZWxsbycsICcqJyk7XG5cbiAgZGJ1aVdlYkNvbXBvbmVudHNTZXRVcCh0YXJnZXQuY29udGVudFdpbmRvdykuYXBwZW5kU3R5bGUoJ2RidWktd2ViLWNvbXBvbmVudC1kdW1teScsIGBcbiAgICBiIHtcbiAgICAgIGZvbnQtc3R5bGU6IG9ibGlxdWU7XG4gICAgICBvcGFjaXR5OiAwLjU7XG4gICAgfVxuICBgKTtcbiAgY29uc3QgREJVSVdlYkNvbXBvbmVudER1bW15MiA9IGdldERCVUlXZWJDb21wb25lbnREdW1teSh0YXJnZXQuY29udGVudFdpbmRvdyk7XG4gIGNvbnN0IERCVUlXZWJDb21wb25lbnREdW1teVBhcmVudDIgPSBnZXREQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQodGFyZ2V0LmNvbnRlbnRXaW5kb3cpO1xuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBEQlVJV2ViQ29tcG9uZW50RHVtbXkyLnJlZ2lzdGVyU2VsZigpO1xuICAgIERCVUlXZWJDb21wb25lbnREdW1teVBhcmVudDIucmVnaXN0ZXJTZWxmKCk7XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIC8vIHRhcmdldC5yZW1vdmUoKTtcbiAgICB9LCAyMDAwKTtcbiAgfSwgMjAwMCk7XG59O1xuXG4vLyBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGlmcmFtZSk7XG5cblxuLy8gb25TY3JlZW5Db25zb2xlKHsgb3B0aW9uczogeyBzaG93TGFzdE9ubHk6IGZhbHNlIH0gfSk7XG5cbmxldCBEZW1vID0gY2xhc3MgRGVtbyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgLyogZXNsaW50IG5vLWNvbnNvbGU6IDAgKi9cbiAgICAgIC8vIGNvbnNvbGUubG9nKCdyZW5kZXJpbmcgRGVtbyBjb21wb25lbnQnKTtcbiAgICB9XG4gICAgY29uc3QgeyBsb2NhbGU6IHsgZGlyIH0gfSA9IHRoaXMucHJvcHM7XG4gICAgcmV0dXJuIChcbiAgICAgIDxBcHAgLz5cbiAgICApO1xuICB9XG59O1xuXG5EZW1vLnByb3BUeXBlcyA9IHtcbiAgbG9jYWxlOiBQcm9wVHlwZXMub2JqZWN0XG59O1xuXG5EZW1vID0gbG9jYWxlQXdhcmUoRGVtbyk7XG5cblJlYWN0RE9NLnJlbmRlcigoXG4gIDxEZW1vLz5cbiksIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZW1vJykpO1xuIiwiLyogIGVzbGludCBpbXBvcnQvcHJlZmVyLWRlZmF1bHQtZXhwb3J0OiAwICovXG5mdW5jdGlvbiB0b2dnbGVBcHBEaXIoZXZ0KSB7XG4gIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICBjb25zdCBkb2N1bWVudEVsZW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICBjb25zdCBjdXJyZW50RGlyID0gZG9jdW1lbnRFbGVtZW50LmdldEF0dHJpYnV0ZSgnZGlyJyk7XG4gIGNvbnN0IG5leHREaXIgPSBjdXJyZW50RGlyID09PSAnbHRyJyA/ICdydGwnIDogJ2x0cic7XG4gIGRvY3VtZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RpcicsIG5leHREaXIpO1xufVxuXG5leHBvcnQge1xuICB0b2dnbGVBcHBEaXJcbn07XG4iLCIvKiBlc2xpbnQgaW1wb3J0L3ByZWZlci1kZWZhdWx0LWV4cG9ydDogMCAqL1xuXG5leHBvcnQgY29uc3QgZGlzdHJpYnV0aW9uVVJMID1cbiAgJ2h0dHBzOi8vY2F0YWxpbi1lbmFjaGUuZ2l0aHViLmlvL2Rldi1ib3gtdWkvYnVpbGQvZGlzdC9qcy9kZXYtYm94LXVpLXdlYmNvbXBvbmVudHMuanMnO1xuIiwiXG53aW5kb3cuZ2VuZXJhdGVDb21wb25lbnRQcm9wZXJ0aWVzVGFibGUgPSBmdW5jdGlvbiAoZGF0YSwgc2VsZWN0b3IgPSAnLnByb3BlcnRpZXMnKSB7XG4gIGNvbnN0IHByb3BlcnRpZXNDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgY29uc3QgbmFtZXMgPSBPYmplY3Qua2V5cyhkYXRhKTtcbiAgY29uc3QgdGFibGUgPSBgXG48aDMgY2xhc3M9XCJzZWN0aW9uXCI+UHJvcGVydGllczwvaDM+XG48dGFibGU+XG48dGhlYWQ+XG4gIDx0aCBjbGFzcz1cInByb3AtbmFtZVwiPk5hbWU8L3RoPlxuICA8dGggY2xhc3M9XCJwcm9wLXR5cGVcIj5UeXBlPC90aD5cbiAgPHRoIGNsYXNzPVwicHJvcC1kZWZhdWx0XCI+RGVmYXVsdDwvdGg+XG4gIDx0aCBjbGFzcz1cInByb3AtZGVzY3JpcHRpb25cIj5EZXNjcmlwdGlvbjwvdGg+XG48L3RoZWFkPlxuPHRib2R5PiR7XG4gIG5hbWVzLm1hcCgobmFtZSkgPT4ge1xuICAgIHJldHVybiBgPHRyPlxuICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJwcm9wLW5hbWVcIj4ke25hbWV9PC90ZD5cbiAgICAgICAgICAgICAgPHRkIGNsYXNzPVwicHJvcC10eXBlXCI+JHtkYXRhW25hbWVdLnR5cGV9PC90ZD5cbiAgICAgICAgICAgICAgPHRkIGNsYXNzPVwicHJvcC1kZWZhdWx0XCI+PHByZT4ke2RhdGFbbmFtZV0uZGVmYXVsdH08L3ByZT48L3RkPlxuICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJwcm9wLWRlc2NyaXB0aW9uXCI+JHtkYXRhW25hbWVdLmRlc2NyaXB0aW9ufTwvdGQ+XG4gICAgICAgICAgICA8L3RyPmA7XG4gIH0pLmpvaW4oJycpXG59PC90Ym9keT5cbjwvdGFibGU+XG4gICAgYDtcblxuICBwcm9wZXJ0aWVzQ29udGFpbmVyLmlubmVySFRNTCA9IHRhYmxlO1xufTtcblxuLy8gZGVwZW5kcyBvbiAudGFicyBzdHlsZSBkZWZpbmVkIGluIGRlbW9TY3JlZW4uc2Nzc1xud2luZG93Lm1ha2VUYWJzID0gZnVuY3Rpb24gKCkge1xuICBsZXQgZ3JvcENvdW50ID0gMTtcbiAgbGV0IGlkQ291bnQgPSAxO1xuXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWJzJykuZm9yRWFjaCgodGFic0Jsb2NrKSA9PiB7XG4gICAgY29uc3QgZmlyc3RTZWN0aW9uID0gdGFic0Jsb2NrLnF1ZXJ5U2VsZWN0b3IoJ3NlY3Rpb24nKTtcblxuICAgIHRhYnNCbG9jay5xdWVyeVNlbGVjdG9yQWxsKCdzZWN0aW9uJykuZm9yRWFjaCgoc2VjdGlvbikgPT4ge1xuICAgICAgY29uc3Qgc2VjdGlvbk5hbWUgPSBzZWN0aW9uLmdldEF0dHJpYnV0ZSgneC1uYW1lJyk7XG4gICAgICBjb25zdCBpc0NoZWNrZWQgPSBzZWN0aW9uLmdldEF0dHJpYnV0ZSgneC1jaGVja2VkJyk7XG4gICAgICBjb25zdCBoaWdobGlnaHQgPSBzZWN0aW9uLmdldEF0dHJpYnV0ZSgneC1oaWdobGlnaHQnKTtcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBzZWN0aW9uLmlubmVySFRNTDtcblxuICAgICAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgY29uc3QgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuXG4gICAgICBzZWN0aW9uLmlkID0gYGNvbnRlbnQtJHtpZENvdW50fWA7XG4gICAgICBpZiAoaGlnaGxpZ2h0KSB7XG4gICAgICAgIHNlY3Rpb24uaW5uZXJIVE1MID0gYDxwcmU+PGNvZGUgY2xhc3M9XCIke2hpZ2hsaWdodH1cIj4ke1xuICAgICAgICAgIGNvbnRlbnRcbiAgICAgICAgfTwvY29kZT48L3ByZT5gO1xuICAgICAgfVxuXG4gICAgICBpbnB1dC50eXBlID0gJ3JhZGlvJztcbiAgICAgIGlucHV0Lm5hbWUgPSBgZ3JvdXAtJHtncm9wQ291bnR9YDtcbiAgICAgIGlucHV0LmlkID0gYHRhYi0ke2lkQ291bnR9YDtcbiAgICAgIGlmIChpc0NoZWNrZWQpIHtcbiAgICAgICAgaW5wdXQuY2hlY2tlZCA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGxhYmVsLmh0bWxGb3IgPSBpbnB1dC5pZDtcbiAgICAgIGxhYmVsLmlubmVyVGV4dCA9IHNlY3Rpb25OYW1lO1xuXG4gICAgICB0YWJzQmxvY2suaW5zZXJ0QmVmb3JlKGlucHV0LCBmaXJzdFNlY3Rpb24pO1xuICAgICAgdGFic0Jsb2NrLmluc2VydEJlZm9yZShsYWJlbCwgZmlyc3RTZWN0aW9uKTtcblxuICAgICAgaWRDb3VudCArPSAxO1xuICAgIH0pO1xuXG4gICAgZ3JvcENvdW50ICs9IDE7XG4gIH0pO1xufTtcblxud2luZG93LmhpZ2hsaWdodEJsb2NrcyA9IGZ1bmN0aW9uICgpIHtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgncHJlIGNvZGUuaHRtbCcpLmZvckVhY2goKGJsb2NrKSA9PiB7XG4gICAgLy8gaWYgbm90IGFscmVhZHkgZXNjYXBlZCAoaW4gd2hpY2ggY2FzZSBjb250YWlucyAnJmx0OycpIChSZWFjdCBzdHJpbmcgc2NlbmFyaW8pXG4gICAgaWYgKCFibG9jay5pbm5lckhUTUwuaW5jbHVkZXMoJyZsdDsnKSkge1xuICAgICAgYmxvY2suaW5uZXJIVE1MID1cbiAgICAgIGJsb2NrLmlubmVySFRNTFxuICAgICAgICAucmVwbGFjZSgvJi9nLCAnJmFtcDsnKVxuICAgICAgICAucmVwbGFjZSgvPC9nLCAnJmx0OycpXG4gICAgICAgIC5yZXBsYWNlKC8+L2csICcmZ3Q7JylcbiAgICAgICAgLnJlcGxhY2UoL1wiL2csICcmcXVvdDsnKVxuICAgICAgICAucmVwbGFjZSgvJy9nLCAnJiMwMzk7Jyk7XG4gICAgfVxuICB9KTtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgncHJlIGNvZGUnKS5mb3JFYWNoKChibG9jaykgPT4ge1xuICAgIHdpbmRvdy5obGpzICYmIHdpbmRvdy5obGpzLmhpZ2hsaWdodEJsb2NrKGJsb2NrKTtcbiAgfSk7XG59O1xuXG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBsb2NhbGVBd2FyZSBmcm9tICcuLi8uLi8uLi9zcmMvbGliL0hPQy9sb2NhbGVBd2FyZSc7XG5cbmxldCBJRnJhbWVTY3JlZW4gPSBjbGFzcyBJRnJhbWVTY3JlZW4gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLmlmcmFtZU5vZGUgPSBudWxsO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICBjb25zdCB7IGxvY2FsZTogeyBkaXIgfSB9ID0gbmV4dFByb3BzO1xuICAgIHRoaXMuaWZyYW1lTm9kZS5jb250ZW50V2luZG93LnBvc3RNZXNzYWdlKGBjaGFuZ2VEaXIgJHtkaXJ9YCwgJyonKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBpc1Byb2QgPSAhd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluY2x1ZGVzKCcuZGV2LicpO1xuICAgIGNvbnN0IHdpbmRvd0xvY2F0aW9uSGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnJlcGxhY2UoJyMnLCAnJyk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxpZnJhbWVcbiAgICAgICAgcmVmPXsobm9kZSkgPT4gdGhpcy5pZnJhbWVOb2RlID0gbm9kZX1cbiAgICAgICAgc3JjPXtgc3JjRGVtby9zY3JlZW5zLyR7d2luZG93TG9jYXRpb25IYXNofT9wcm9kdWN0aW9uPSR7aXNQcm9kID8gJzEnIDogJzAnfWB9IC8+XG4gICAgKTtcbiAgfVxufTtcbklGcmFtZVNjcmVlbi5wcm9wVHlwZXMgPSB7XG4gIGxvY2FsZTogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICBkaXI6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgbGFuZzogUHJvcFR5cGVzLnN0cmluZ1xuICB9KVxufTtcbklGcmFtZVNjcmVlbiA9IGxvY2FsZUF3YXJlKElGcmFtZVNjcmVlbik7XG5cbmV4cG9ydCBkZWZhdWx0IElGcmFtZVNjcmVlbjtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5jbGFzcyBQcm9wZXJ0aWVzVGFibGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAvLyByZS11c2luZyB0aGUgaGVscGVyIGRlZmluZWQgZm9yIGlGcmFtZVxuICAgIHdpbmRvdy5nZW5lcmF0ZUNvbXBvbmVudFByb3BlcnRpZXNUYWJsZSh0aGlzLnByb3BzLnByb3BlcnRpZXMpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cInByb3BlcnRpZXNcIiAvPjtcbiAgfVxufVxuXG5Qcm9wZXJ0aWVzVGFibGUucHJvcFR5cGVzID0ge1xuICBwcm9wZXJ0aWVzOiBQcm9wVHlwZXMub2JqZWN0XG59O1xuXG5leHBvcnQgZGVmYXVsdCBQcm9wZXJ0aWVzVGFibGU7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5jbGFzcyBPblNjcmVlbkNvbnNvbGVTY3JlZW4gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGVtby1zY3JlZW5cIj4geyAvKiBzdGFuZGFyZCB0ZW1wbGF0ZSByZXF1aXJlbWVudCAqLyB9XG4gICAgICAgIDxoMiBjbGFzc05hbWU9XCJ0aXRsZVwiPk9uIFNjcmVlbiBDb25zb2xlPC9oMj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgT25TY3JlZW5Db25zb2xlU2NyZWVuO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7XG4gIGRpc3RyaWJ1dGlvblVSTFxufSBmcm9tICcuLi8uLi9pbnRlcm5hbHMvY29uc3RhbnRzJztcblxuY2xhc3MgVXNpbmdEZXZCb3hVSSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJkZW1vLXNjcmVlblwiPiB7IC8qIHN0YW5kYXJkIHRlbXBsYXRlIHJlcXVpcmVtZW50ICovIH1cbiAgICAgICAgPGgyIGNsYXNzTmFtZT1cInRpdGxlXCI+TG9hZGluZyBEZXYgQm94IFVJIFdlYiBDb21wb25lbnRzPC9oMj5cbiAgICAgICAgPGgzIGNsYXNzTmFtZT1cInNlY3Rpb25cIj5Gcm9tIERpc3RyaWJ1dGlvbjwvaDM+XG4gICAgICAgIDxwcmU+PGNvZGUgY2xhc3NOYW1lPVwiaHRtbFwiPlxuICAgICAgICAgIHtgXG48IWRvY3R5cGUgaHRtbD5cbjxodG1sIGRpcj1cImx0clwiIGxhbmc9XCJlblwiPlxuPGhlYWQ+XG4gIDxtZXRhIGNoYXJzZXQ9XCJVVEYtOFwiPlxuICA8bWV0YSBuYW1lPVwidmlld3BvcnRcIiBjb250ZW50PVwid2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTEsIHNocmluay10by1maXQ9bm9cIj5cbiAgPHNjcmlwdCBzcmM9XCIke2Rpc3RyaWJ1dGlvblVSTH1cIj48L3NjcmlwdD5cbiAgPHNjcmlwdD5cbiAgICBjb25zdCB7XG4gICAgICBxdWlja1NldHVwQW5kTG9hZFxuICAgIH0gPSByZXF1aXJlKCdkZXYtYm94LXVpLXdlYmNvbXBvbmVudHMnKTtcbiAgICBjb25zdCB7XG4gICAgICAnZGJ1aS13ZWItY29tcG9uZW50LWR1bW15LXBhcmVudCc6IGRidWlXZWJDb21wb25lbnREdW1teVBhcmVudENsYXNzLFxuICAgIH0gPSBxdWlja1NldHVwQW5kTG9hZCh3aW5kb3cpKFtcbiAgICAgIHtcbiAgICAgICAgcmVnaXN0cmF0aW9uTmFtZTogJ2RidWktd2ViLWNvbXBvbmVudC1kdW1teScsXG4gICAgICAgIGNvbXBvbmVudFN0eWxlOiBcXGBcbiAgICAgICAgIGIge1xuICAgICAgICAgICBjb2xvcjogdmFyKC0tZHVtbXktYi1jb2xvciwgaW5oZXJpdCk7XG4gICAgICAgICAgIGJvcmRlci1yYWRpdXM6IHZhcigtLWR1bW15LWItYm9yZGVyLXJhZGl1cywgMHB4KTtcbiAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZHVtbXktYi1iZy1jb2xvciwgdHJhbnNwYXJlbnQpO1xuICAgICAgICAgfVxuICAgICAgICBcXGBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHJlZ2lzdHJhdGlvbk5hbWU6ICdkYnVpLXdlYi1jb21wb25lbnQtZHVtbXktcGFyZW50J1xuICAgICAgfVxuICAgIF0pO1xuICA8L3NjcmlwdD5cbjwvaGVhZD5cbjxib2R5PlxuPGRidWktd2ViLWNvbXBvbmVudC1kdW1teS1wYXJlbnQ+aGVsbG8gMTwvZGJ1aS13ZWItY29tcG9uZW50LWR1bW15LXBhcmVudD5cbjwvYm9keT5cbjwvaHRtbD5cblxuICAgICAgICAgIGB9XG4gICAgICAgIDwvY29kZT48L3ByZT5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVXNpbmdEZXZCb3hVSTtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmNsYXNzIERCVUlXZWJDb21wb25lbnREdW1teVNjcmVlbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJkZW1vLXNjcmVlblwiPnsgLyogc3RhbmRhcmQgdGVtcGxhdGUgcmVxdWlyZW1lbnQgKi8gfVxuXG4gICAgICAgIDxkYnVpLXdlYi1jb21wb25lbnQtZHVtbXlcbiAgICAgICAgICBzdHlsZT17eyBjb2xvcjogJ2JsdWUnIH19XG4gICAgICAgID5cbiAgICAgICAgICA8c3Bhbj5oZWxsbyAxPC9zcGFuPlxuICAgICAgICA8L2RidWktd2ViLWNvbXBvbmVudC1kdW1teT5cblxuICAgICAgICA8ZGJ1aS13ZWItY29tcG9uZW50LWR1bW15XG4gICAgICAgICAgc3R5bGU9e3sgY29sb3I6ICdibHVlJyB9fVxuICAgICAgICA+XG4gICAgICAgICAgPHNwYW4+aGVsbG8gMjwvc3Bhbj5cbiAgICAgICAgPC9kYnVpLXdlYi1jb21wb25lbnQtZHVtbXk+XG4gICAgICAgIDxkYnVpLXdlYi1jb21wb25lbnQtZHVtbXktcGFyZW50PmhlbGxvIDM8L2RidWktd2ViLWNvbXBvbmVudC1kdW1teS1wYXJlbnQ+XG5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgREJVSVdlYkNvbXBvbmVudER1bW15U2NyZWVuO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7XG4gIERyYWdnYWJsZSwgRGlzYWJsZVNlbGVjdGlvblxufSBmcm9tICdkZXYtYm94LXVpJztcbmltcG9ydCBQcm9wZXJ0aWVzVGFibGUgZnJvbSAnLi4vLi4vaW50ZXJuYWxzL3JlYWN0Q29tcG9uZW50cy9Qcm9wZXJ0aWVzVGFibGUnO1xuXG5jbGFzcyBUb1JlbmRlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICAvLyBjb25zb2xlLmxvZygnVG9SZW5kZXIjcmVuZGVyJyk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgc3R5bGU9e3sgd2lkdGg6IDMwMCwgaGVpZ2h0OiAzMDAgfX1cbiAgICAgICAgb25Nb3VzZURvd249e3RoaXMucHJvcHMub25Nb3VzZURvd259XG4gICAgICAgIG9uTW91c2VVcD17dGhpcy5wcm9wcy5vbk1vdXNlVXB9XG4gICAgICAgIG9uQ2xpY2s9e3RoaXMucHJvcHMub25DbGlja31cbiAgICAgICAgb25Ub3VjaFN0YXJ0PXt0aGlzLnByb3BzLm9uVG91Y2hTdGFydH1cbiAgICAgICAgb25Ub3VjaEVuZD17dGhpcy5wcm9wcy5vblRvdWNoRW5kfVxuICAgICAgPlxuICAgICAgICA8cD5kcmFnZ2FibGUgcCB7dGhpcy5wcm9wcy5jb3VudGVyfSA8YSBocmVmPVwiaHR0cDovL2dvb2dsZS5jb21cIiB0YXJnZXQ9XCJfYmxhbmtcIj5saW5rPC9hPjwvcD5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuY2xhc3MgRHJhZ2dhYmxlU2NyZWVuIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5oYW5kbGVNb3VzZURvd24gPSB0aGlzLmhhbmRsZU1vdXNlRG93bi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlVG91Y2hTdGFydCA9IHRoaXMuaGFuZGxlVG91Y2hTdGFydC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlTW91c2VVcCA9IHRoaXMuaGFuZGxlTW91c2VVcC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlVG91Y2hFbmQgPSB0aGlzLmhhbmRsZVRvdWNoRW5kLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVDbGljayA9IHRoaXMuaGFuZGxlQ2xpY2suYmluZCh0aGlzKTtcblxuICAgIHRoaXMuY291bnRlciA9IDE7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGRyYWdnYWJsZUNvbnRlbnQ6IHRoaXMuZHJhZ2dhYmxlQ29udGVudFxuICAgIH07XG4gIH1cblxuICBnZXQgZHJhZ2dhYmxlQ29udGVudCgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFRvUmVuZGVyXG4gICAgICAgIG9uTW91c2VEb3duPXt0aGlzLmhhbmRsZU1vdXNlRG93bn1cbiAgICAgICAgb25Nb3VzZVVwPXt0aGlzLmhhbmRsZU1vdXNlVXB9XG4gICAgICAgIG9uVG91Y2hTdGFydD17dGhpcy5oYW5kbGVUb3VjaFN0YXJ0fVxuICAgICAgICBvblRvdWNoRW5kPXt0aGlzLmhhbmRsZVRvdWNoRW5kfVxuICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrfVxuICAgICAgICBjb3VudGVyPXt0aGlzLmNvdW50ZXJ9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICBoYW5kbGVNb3VzZURvd24oZXZ0KSB7XG4gICAgY29uc29sZS5sb2coJ0RyYWdnYWJsZVNjcmVlbiNoYW5kbGVNb3VzZURvd24nKTtcbiAgfVxuICBoYW5kbGVNb3VzZVVwKGV2dCkge1xuICAgIGNvbnNvbGUubG9nKCdEcmFnZ2FibGVTY3JlZW4jaGFuZGxlTW91c2VVcCcpO1xuICB9XG4gIGhhbmRsZVRvdWNoU3RhcnQoZXZ0KSB7XG4gICAgY29uc29sZS5sb2coJ0RyYWdnYWJsZVNjcmVlbiNoYW5kbGVUb3VjaFN0YXJ0Jyk7XG4gIH1cbiAgaGFuZGxlVG91Y2hFbmQoZXZ0KSB7XG4gICAgY29uc29sZS5sb2coJ0RyYWdnYWJsZVNjcmVlbiNoYW5kbGVUb3VjaEVuZCcpO1xuICB9XG4gIGhhbmRsZUNsaWNrKGV2dCkge1xuICAgIGNvbnNvbGUubG9nKCdEcmFnZ2FibGVTY3JlZW4jaGFuZGxlQ2xpY2snKTtcbiAgICAvLyB0aGlzLmNvdW50ZXIgPSB0aGlzLmNvdW50ZXIgKyAxO1xuICAgIC8vIHRoaXMuc2V0U3RhdGUoe1xuICAgIC8vICAgZHJhZ2dhYmxlQ29udGVudDogdGhpcy5kcmFnZ2FibGVDb250ZW50XG4gICAgLy8gfSk7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLl9tb3VudGVkID0gdHJ1ZTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmICghdGhpcy5fbW91bnRlZCkgcmV0dXJuO1xuICAgICAgdGhpcy5jb3VudGVyID0gdGhpcy5jb3VudGVyICsgMTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBkcmFnZ2FibGVDb250ZW50OiB0aGlzLmRyYWdnYWJsZUNvbnRlbnRcbiAgICAgIH0pO1xuICAgIH0sIDMwMDApO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5fbW91bnRlZCA9IGZhbHNlO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImRlbW8tc2NyZWVuXCI+IHsgLyogc3RhbmRhcmQgdGVtcGxhdGUgcmVxdWlyZW1lbnQgKi8gfVxuXG4gICAgICAgIDxoMiBjbGFzc05hbWU9XCJ0aXRsZVwiPkRyYWdnYWJsZSBSZWFjdCB7dGhpcy5jb3VudGVyfTwvaDI+XG5cbiAgICAgICAgPGgzIGNsYXNzTmFtZT1cInNlY3Rpb25cIj5TdHVmZiBPbmU8L2gzPlxuXG4gICAgICAgIDxwPmJlZm9yZSB0YWJzPC9wPlxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGFic1wiPlxuICAgICAgICAgIDxzZWN0aW9uIHgtbmFtZT1cIlJFU1VMVFwiIHgtY2hlY2tlZD1cIjFcIj5cbiAgICAgICAgICAgIDxEcmFnZ2FibGUgc3R5bGU9e3sgYm9yZGVyOiAnMXB4IHNvbGlkIGJsdWUnLCB3aWR0aDogMjAwLCBoZWlnaHQ6IDIwMCwgb3ZlcmZsb3dYOiAnc2Nyb2xsJywgb3ZlcmZsb3dZOiAnc2Nyb2xsJyB9fT5cbiAgICAgICAgICAgICAge3RoaXMuc3RhdGUuZHJhZ2dhYmxlQ29udGVudH1cbiAgICAgICAgICAgIDwvRHJhZ2dhYmxlPlxuICAgICAgICAgICAgPERpc2FibGVTZWxlY3Rpb24+XG4gICAgICAgICAgICAgIDxwPmRpc2FibGVkIHNlbGVjdGlvbjwvcD5cbiAgICAgICAgICAgIDwvRGlzYWJsZVNlbGVjdGlvbj5cbiAgICAgICAgICAgIHtBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMCB9KS5tYXAoKGVsLCBpKSA9PiA8cCBrZXk9e2l9PntpfSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS08L3A+KX1cbiAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgICAgPHNlY3Rpb24geC1uYW1lPVwiSFRNTFwiIHgtaGlnaGxpZ2h0PVwiaHRtbFwiPntgXG48cD5kcmFnZ2FibGU8L3A+XG48c3Bhbj5yZWFjdDwvc3Bhbj5cbiAgICAgICAgICBgfVxuICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgICA8c2VjdGlvbiB4LW5hbWU9XCJDU1NcIiB4LWhpZ2hsaWdodD1cImNzc1wiPntgXG5ib2R5IHtcbiAgY29sb3I6IHJlZDtcbn1cbiAgICAgICAgICBgfVxuICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgICA8c2VjdGlvbiB4LW5hbWU9XCJKU1wiIHgtaGlnaGxpZ2h0PVwiamF2YXNjcmlwdFwiPntgXG5jbGFzcyBDYXIgZXh0ZW5kcyBTdXBlckNsYXNzIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIG9uSW5pdCgpIHtcbiAgICB0aGlzLmRvKCgpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKHByaW50KTtcbiAgICB9KTtcbiAgfVxufVxuICAgICAgICAgIGB9XG4gICAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8cD5iZXR3ZWVuIHRhYnM8L3A+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0YWJzXCI+XG4gICAgICAgICAgPHNlY3Rpb24geC1uYW1lPVwiQ1NTXCIgeC1oaWdobGlnaHQ9XCJjc3NcIj57YFxuYm9keSB7XG4gIGNvbG9yOiByZWQ7XG59XG4gICAgICAgICAgYH1cbiAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgICAgPHNlY3Rpb24geC1uYW1lPVwiSlNcIiB4LWhpZ2hsaWdodD1cImphdmFzY3JpcHRcIiB4LWNoZWNrZWQ9XCIxXCI+e2BcbmNsYXNzIENhciBleHRlbmRzIFN1cGVyQ2xhc3Mge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgb25Jbml0KCkge1xuICAgIHRoaXMuZG8oKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2cocHJpbnQpO1xuICAgIH0pO1xuICB9XG59XG4gICAgICAgICAgYH1cbiAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxQcm9wZXJ0aWVzVGFibGUgcHJvcGVydGllcz17e1xuICAgICAgICAgIHByb3BlcnR5T25lOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6ICd2YWx1ZSAxJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnZGVzY3JpcHRpb24gb25lJ1xuICAgIH0sXG4gICAgcHJvcGVydHlUd286IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgZGVmYXVsdDogJzUnLFxuICAgICAgZGVzY3JpcHRpb246ICdkZXNjcmlwdGlvbiB0d28nXG4gICAgfVxuICAgICAgICB9fSAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBEcmFnZ2FibGVTY3JlZW47XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtcbiAgRm9ybUlucHV0TnVtYmVyXG59IGZyb20gJ2Rldi1ib3gtdWknO1xuXG5cbmNsYXNzIEZvcm1JbnB1dE51bWJlclNjcmVlbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBpbnB1dFZhbHVlOiAtNy4wOFxuICAgIH07XG4gICAgdGhpcy5oYW5kbGVDaGFuZ2UgPSB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaGFuZGxlQ2hhbmdlKGlucHV0VmFsdWUpIHtcbiAgICBjb25zdCB2YWx1ZVRvU2VuZEJhY2sgPSBOdW1iZXIoaW5wdXRWYWx1ZS50b1ByZWNpc2lvbigxNikpO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaW5wdXRWYWx1ZTogdmFsdWVUb1NlbmRCYWNrXG4gICAgfSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGVtby1zY3JlZW5cIj4geyAvKiBzdGFuZGFyZCB0ZW1wbGF0ZSByZXF1aXJlbWVudCAqLyB9XG4gICAgICAgIDxwcmU+PGNvZGUgY2xhc3NOYW1lPVwiaHRtbFwiPlxuICAgICAgICAgIHtgXG4gICAgICAgICAgICA8cD5mb3JtIGlucHV0IG51bWJlcjwvcD5cbiAgICAgICAgICAgIDxzcGFuPnJlYWN0PC9zcGFuPlxuICAgICAgICAgIGB9XG4gICAgICAgIDwvY29kZT48L3ByZT5cbiAgICAgICAgPHByZT48Y29kZSBjbGFzc05hbWU9XCJqYXZhc2NyaXB0XCI+XG4gICAgICAgICAge2BcbiAgICAgICAgICAgIGNsYXNzIE1hY2hpbmUgZXh0ZW5kcyBTdXBlckNsYXNzIHtcbiAgICAgICAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIG9uSW5pdCgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRvKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHByaW50KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIGB9XG4gICAgICAgIDwvY29kZT48L3ByZT5cbiAgICAgICAgPHByZT48Y29kZSBjbGFzc05hbWU9XCJjc3NcIj5cbiAgICAgICAgICB7YFxuICAgICAgICAgICAgaHRtbFtkaXI9bHRyXSB7XG4gICAgICAgICAgICAgIGNvbG9yOiByZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgYH1cbiAgICAgICAgPC9jb2RlPjwvcHJlPlxuICAgICAgICA8Rm9ybUlucHV0TnVtYmVyXG4gICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUuaW5wdXRWYWx1ZX1cbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9XG4gICAgICAgICAgZGVmYXVsdERlY1BvaW50PVwiLFwiXG4gICAgICAgICAgZGVmYXVsdFRob3VzYW5kc1NlcGFyYXRvcj1cIi5cIlxuICAgICAgICAvPlxuICAgICAgICA8Rm9ybUlucHV0TnVtYmVyXG4gICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUuaW5wdXRWYWx1ZX1cbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9XG4gICAgICAgIC8+XG4gICAgICAgIDxwPnt0aGlzLnN0YXRlLmlucHV0VmFsdWV9eydcXHUwMEEwJ308L3A+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEZvcm1JbnB1dE51bWJlclNjcmVlbjtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1xuICBGb3JtSW5wdXRcbn0gZnJvbSAnZGV2LWJveC11aSc7XG5cblxuY2xhc3MgRm9ybUlucHV0U2NyZWVuIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGlucHV0VmFsdWU6IDZcbiAgICB9O1xuICAgIHRoaXMuaGFuZGxlQ2hhbmdlID0gdGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGhhbmRsZUNoYW5nZShpbnB1dFZhbHVlKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpbnB1dFZhbHVlXG4gICAgfSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGVtby1zY3JlZW5cIj4geyAvKiBzdGFuZGFyZCB0ZW1wbGF0ZSByZXF1aXJlbWVudCAqLyB9XG4gICAgICAgIDxGb3JtSW5wdXRcbiAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS5pbnB1dFZhbHVlfVxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX1cbiAgICAgICAgICBoYXNXYXJuaW5nPXtmYWxzZX1cbiAgICAgICAgICBoYXNFcnJvcj17ZmFsc2V9XG4gICAgICAgICAgZGlzYWJsZWQ9e2ZhbHNlfVxuICAgICAgICAvPlxuICAgICAgICA8cD57dGhpcy5zdGF0ZS5pbnB1dFZhbHVlfXsnXFx1MDBBMCd9PC9wPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBGb3JtSW5wdXRTY3JlZW47XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtcbiAgSGVsbG9cbn0gZnJvbSAnZGV2LWJveC11aSc7XG5cbmNsYXNzIEhlbGxvU2NyZWVuIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAvKiBlc2xpbnQgbm8tY29uc29sZTogMCAqL1xuICAgICAgLy8gY29uc29sZS5sb2coJ3JlbmRlcmluZyBIZWxsb1NjcmVlbiBjb21wb25lbnQnKTtcbiAgICB9XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGVtby1zY3JlZW5cIj4geyAvKiBzdGFuZGFyZCB0ZW1wbGF0ZSByZXF1aXJlbWVudCAqLyB9XG4gICAgICAgIDxIZWxsbyAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBIZWxsb1NjcmVlbjtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1xuICBMaXN0XG59IGZyb20gJ2Rldi1ib3gtdWknO1xuXG5jbGFzcyBMaXN0U2NyZWVuIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImRlbW8tc2NyZWVuXCI+IHsgLyogc3RhbmRhcmQgdGVtcGxhdGUgcmVxdWlyZW1lbnQgKi8gfVxuICAgICAgICA8TGlzdCBpdGVtcz17Wyd0aHJlZScsICdmb3VyJ119Lz5cbiAgICAgICAgPExpc3QgaXRlbXM9e1sndGhyZWUnLCAnZm91ciddfS8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExpc3RTY3JlZW47XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5jbGFzcyBMb2NhbGVTZXJ2aWNlU2NyZWVuIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImRlbW8tc2NyZWVuXCI+IHsgLyogc3RhbmRhcmQgdGVtcGxhdGUgcmVxdWlyZW1lbnQgKi8gfVxuICAgICAgICA8aDIgY2xhc3NOYW1lPVwidGl0bGVcIj5Mb2NhbGUgU2VydmljZTwvaDI+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExvY2FsZVNlcnZpY2VTY3JlZW47XG4iLCIvLyBHZW5lcmFsXG5pbXBvcnQgTG9hZGluZ0RldkJveFVJV2ViQ29tcG9uZW50cyBmcm9tICcuL0dlbmVyYWwvTG9hZGluZ0RldkJveFVJV2ViQ29tcG9uZW50cyc7XG5cbi8vIFNlcnZpY2VzXG5pbXBvcnQgTG9jYWxlU2VydmljZVNjcmVlbiBmcm9tICcuL1NlcnZpY2VzL0xvY2FsZVNlcnZpY2VTY3JlZW4nO1xuXG4vLyBSZWFjdCBDb21wb25lbnRzXG5pbXBvcnQgSGVsbG9TY3JlZW4gZnJvbSAnLi9SZWFjdENvbXBvbmVudHMvSGVsbG9TY3JlZW4nO1xuaW1wb3J0IExpc3RTY3JlZW4gZnJvbSAnLi9SZWFjdENvbXBvbmVudHMvTGlzdFNjcmVlbic7XG5pbXBvcnQgRm9ybUlucHV0U2NyZWVuIGZyb20gJy4vUmVhY3RDb21wb25lbnRzL0Zvcm1JbnB1dFNjcmVlbic7XG5pbXBvcnQgRm9ybUlucHV0TnVtYmVyU2NyZWVuIGZyb20gJy4vUmVhY3RDb21wb25lbnRzL0Zvcm1JbnB1dE51bWJlclNjcmVlbic7XG5pbXBvcnQgRHJhZ2dhYmxlU2NyZWVuIGZyb20gJy4vUmVhY3RDb21wb25lbnRzL0RyYWdnYWJsZVNjcmVlbic7XG5pbXBvcnQgREJVSVdlYkNvbXBvbmVudER1bW15U2NyZWVuIGZyb20gJy4vUmVhY3RDb21wb25lbnRzL0RCVUlXZWJDb21wb25lbnREdW1teVNjcmVlbic7XG5cbi8vIERlYnVnXG5pbXBvcnQgT25TY3JlZW5Db25zb2xlU2NyZWVuIGZyb20gJy4vRGVidWcvT25TY3JlZW5Db25zb2xlU2NyZWVuJztcblxuY29uc3Qgc2NyZWVucyA9IHtcbiAgLy8gR2VuZXJhbFxuICBMb2FkaW5nRGV2Qm94VUlXZWJDb21wb25lbnRzLFxuXG4gIC8vIFNlcnZpY2VzXG4gIExvY2FsZVNlcnZpY2VTY3JlZW4sXG5cbiAgLy8gQ29tcG9uZW50c1xuICBIZWxsb1NjcmVlbixcbiAgTGlzdFNjcmVlbixcbiAgRm9ybUlucHV0U2NyZWVuLFxuICBGb3JtSW5wdXROdW1iZXJTY3JlZW4sXG4gIERyYWdnYWJsZVNjcmVlbixcbiAgREJVSVdlYkNvbXBvbmVudER1bW15U2NyZWVuLFxuXG4gIC8vIERlYnVnXG4gIE9uU2NyZWVuQ29uc29sZVNjcmVlblxufTtcblxuLypcblRoZSByZWFsIHBhdGggbWF0dGVycyBvbmx5IGZvciAuaHRtbCBzY3JlZW5zIGFzIHRoZXkgYXJlIGxvYWRlZCBpbnRvIGFuIGlGcmFtZS5cblJlYWN0IHNjcmVlbnMgcGF0aCBuZWVkcyB0byBiZSB0aGUgc2FtZSBhcyBpbXBvcnRlZCByZWFjdCBjb21wb25lbnQuXG4qL1xuY29uc3Qgc2NyZWVuTGlua3NHZW4gPSBbXG4gIHtcbiAgICB0aXRsZTogJ0dlbmVyYWwnLFxuICAgIGxpbmtzOiBbXG4gICAgICB7IHBhdGg6ICdMb2FkaW5nRGV2Qm94VUlXZWJDb21wb25lbnRzJywgdGl0bGU6ICdMb2FkaW5nIFdlYiBDb21wb25lbnRzJyB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgdGl0bGU6ICdTZXJ2aWNlcycsXG4gICAgbGlua3M6IFtcbiAgICAgIHsgcGF0aDogJ0xvY2FsZVNlcnZpY2VTY3JlZW4nLCB0aXRsZTogJ0xvY2FsZScgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgIHRpdGxlOiAnV2ViIENvbXBvbmVudHMnLFxuICAgIGxpbmtzOiBbXG4gICAgICB7IHBhdGg6ICdXZWJDb21wb25lbnRzU2NyZWVucy9EQlVJV2ViQ29tcG9uZW50RHVtbXlTY3JlZW4uaHRtbCcsIHRpdGxlOiAnRHVtbXknIH0sXG4gICAgICB7IHBhdGg6ICdXZWJDb21wb25lbnRzU2NyZWVucy9EQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnRTY3JlZW4uaHRtbCcsIHRpdGxlOiAnRHVtbXkgUGFyZW50JyB9LFxuICAgICAgeyBwYXRoOiAnV2ViQ29tcG9uZW50c1NjcmVlbnMvREJVSVdlYkNvbXBvbmVudEZvcm1JbnB1dFRleHRTY3JlZW4uaHRtbCcsIHRpdGxlOiAnRm9ybSBJbnB1dCBUZXh0JyB9LFxuICAgIF1cbiAgfSxcbiAge1xuICAgIHRpdGxlOiAnUmVhY3QgQ29tcG9uZW50cycsXG4gICAgbGlua3M6IFtcbiAgICAgIHsgcGF0aDogJ0hlbGxvU2NyZWVuJywgdGl0bGU6ICdIZWxsbycgfSxcbiAgICAgIHsgcGF0aDogJ0xpc3RTY3JlZW4nLCB0aXRsZTogJ0xpc3QnIH0sXG4gICAgICB7IHBhdGg6ICdGb3JtSW5wdXRTY3JlZW4nLCB0aXRsZTogJ0Zvcm0gSW5wdXQnIH0sXG4gICAgICB7IHBhdGg6ICdGb3JtSW5wdXROdW1iZXJTY3JlZW4nLCB0aXRsZTogJ0Zvcm0gSW5wdXQgTnVtYmVyJyB9LFxuICAgICAgeyBwYXRoOiAnRHJhZ2dhYmxlU2NyZWVuJywgdGl0bGU6ICdEcmFnZ2FibGUnIH0sXG4gICAgICB7IHBhdGg6ICdEQlVJV2ViQ29tcG9uZW50RHVtbXlTY3JlZW4nLCB0aXRsZTogJ0R1bW15JyB9LFxuICAgIF1cbiAgfSxcbiAge1xuICAgIHRpdGxlOiAnRGVidWcnLFxuICAgIGxpbmtzOiBbXG4gICAgICB7IHBhdGg6ICdPblNjcmVlbkNvbnNvbGVTY3JlZW4nLCB0aXRsZTogJ09uIFNjcmVlbiBDb25zb2xlJyB9LFxuICAgIF1cbiAgfVxuXTtcblxuZXhwb3J0IHtcbiAgc2NyZWVucyxcbiAgc2NyZWVuTGlua3NHZW5cbn07XG4iXX0=
