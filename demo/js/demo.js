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
    --dbui-input-height: 55px;
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

},{"./internals/appUtils":17,"./internals/reactComponents/IFrameScreen":19,"./screens":30,"_process":2,"react":"react","react-icons/lib/go/mark-github":4,"react-icons/lib/go/three-bars":5}],16:[function(require,module,exports){
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

},{"../src/lib/webcomponents/DBUIWebComponentDummy/DBUIWebComponentDummy":10,"../src/lib/webcomponents/DBUIWebComponentDummyParent/DBUIWebComponentDummyParent":11,"../src/lib/webcomponents/DBUIWebComponentsSetup/DBUIWebComponentsSetup":12,"./app":15,"./internals/iFrameUtils/onWindowDefinedHelpers":18,"_process":2,"dev-box-ui":"dev-box-ui","prop-types":"prop-types","react":"react","react-dom":"react-dom"}],17:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
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

},{"../../../src/lib/HOC/localeAware":6,"prop-types":"prop-types","react":"react"}],20:[function(require,module,exports){
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

},{"prop-types":"prop-types","react":"react"}],21:[function(require,module,exports){
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

},{"react":"react"}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class UsingDevBoxUI extends _react2.default.Component {
  render() {
    return _react2.default.createElement(
      "div",
      { className: "demo-screen" },
      " ",
      _react2.default.createElement(
        "h2",
        { className: "title" },
        "Using Dev Box UI"
      )
    );
  }
}

exports.default = UsingDevBoxUI;

},{"react":"react"}],23:[function(require,module,exports){
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

},{"react":"react"}],24:[function(require,module,exports){
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

},{"../../internals/reactComponents/PropertiesTable":20,"dev-box-ui":"dev-box-ui","react":"react"}],25:[function(require,module,exports){
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

},{"dev-box-ui":"dev-box-ui","react":"react"}],26:[function(require,module,exports){
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

},{"dev-box-ui":"dev-box-ui","react":"react"}],27:[function(require,module,exports){
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

},{"_process":2,"dev-box-ui":"dev-box-ui","react":"react"}],28:[function(require,module,exports){
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

},{"dev-box-ui":"dev-box-ui","react":"react"}],29:[function(require,module,exports){
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

},{"react":"react"}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.screenLinksGen = exports.screens = undefined;

var _UsingDevBoxUIScreen = require('./General/UsingDevBoxUIScreen');

var _UsingDevBoxUIScreen2 = _interopRequireDefault(_UsingDevBoxUIScreen);

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
  UsingDevBoxUIScreen: _UsingDevBoxUIScreen2.default,

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
  links: [{ path: 'UsingDevBoxUIScreen', title: 'Using Dev Box UI' }]
}, {
  title: 'Services',
  links: [{ path: 'LocaleServiceScreen', title: 'Locale' }]
}, {
  title: 'Web Components',
  links: [{ path: 'WebComponentsScreens/DBUIWebComponentDummyScreen.html', title: 'Dummy' }, { path: 'WebComponentsScreens/DBUIWebComponentDummyParentScreen.html', title: 'Dummy Parent' }]
}, {
  title: 'React Components',
  links: [{ path: 'HelloScreen', title: 'Hello' }, { path: 'ListScreen', title: 'List' }, { path: 'FormInputScreen', title: 'Form Input' }, { path: 'FormInputNumberScreen', title: 'Form Input Number' }, { path: 'DraggableScreen', title: 'Draggable' }, { path: 'DBUIWebComponentDummyScreen', title: 'Dummy' }]
}, {
  title: 'Debug',
  links: [{ path: 'OnScreenConsoleScreen', title: 'On Screen Console' }]
}];

exports.screens = screens;
exports.screenLinksGen = screenLinksGen;

},{"./Debug/OnScreenConsoleScreen":21,"./General/UsingDevBoxUIScreen":22,"./ReactComponents/DBUIWebComponentDummyScreen":23,"./ReactComponents/DraggableScreen":24,"./ReactComponents/FormInputNumberScreen":25,"./ReactComponents/FormInputScreen":26,"./ReactComponents/HelloScreen":27,"./ReactComponents/ListScreen":28,"./Services/LocaleServiceScreen":29}]},{},[16])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvaG9pc3Qtbm9uLXJlYWN0LXN0YXRpY3MvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LWljb24tYmFzZS9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVhY3QtaWNvbnMvbGliL2dvL21hcmstZ2l0aHViLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LWljb25zL2xpYi9nby90aHJlZS1iYXJzLmpzIiwic3JjL2xpYi9IT0MvbG9jYWxlQXdhcmUuanMiLCJzcmMvbGliL3NlcnZpY2VzL0kxOG5TZXJ2aWNlLmpzIiwic3JjL2xpYi9zZXJ2aWNlcy9Mb2NhbGVTZXJ2aWNlLmpzIiwic3JjL2xpYi93ZWJjb21wb25lbnRzL0RCVUlXZWJDb21wb25lbnRCYXNlL0RCVUlXZWJDb21wb25lbnRCYXNlLmpzIiwic3JjL2xpYi93ZWJjb21wb25lbnRzL0RCVUlXZWJDb21wb25lbnREdW1teS9EQlVJV2ViQ29tcG9uZW50RHVtbXkuanMiLCJzcmMvbGliL3dlYmNvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50L0RCVUlXZWJDb21wb25lbnREdW1teVBhcmVudC5qcyIsInNyYy9saWIvd2ViY29tcG9uZW50cy9EQlVJV2ViQ29tcG9uZW50c1NldHVwL0RCVUlXZWJDb21wb25lbnRzU2V0dXAuanMiLCJzcmMvbGliL3dlYmNvbXBvbmVudHMvaW50ZXJuYWxzL2FwcGVuZFN0eWxlLmpzIiwic3JjL2xpYi93ZWJjb21wb25lbnRzL2ludGVybmFscy9lbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24uanMiLCJzcmNEZW1vL2FwcC5qcyIsInNyY0RlbW8vZGVtby5qcyIsInNyY0RlbW8vaW50ZXJuYWxzL2FwcFV0aWxzLmpzIiwic3JjRGVtby9pbnRlcm5hbHMvaUZyYW1lVXRpbHMvb25XaW5kb3dEZWZpbmVkSGVscGVycy5qcyIsInNyY0RlbW8vaW50ZXJuYWxzL3JlYWN0Q29tcG9uZW50cy9JRnJhbWVTY3JlZW4uanMiLCJzcmNEZW1vL2ludGVybmFscy9yZWFjdENvbXBvbmVudHMvUHJvcGVydGllc1RhYmxlLmpzIiwic3JjRGVtby9zY3JlZW5zL0RlYnVnL09uU2NyZWVuQ29uc29sZVNjcmVlbi5qcyIsInNyY0RlbW8vc2NyZWVucy9HZW5lcmFsL1VzaW5nRGV2Qm94VUlTY3JlZW4uanMiLCJzcmNEZW1vL3NjcmVlbnMvUmVhY3RDb21wb25lbnRzL0RCVUlXZWJDb21wb25lbnREdW1teVNjcmVlbi5qcyIsInNyY0RlbW8vc2NyZWVucy9SZWFjdENvbXBvbmVudHMvRHJhZ2dhYmxlU2NyZWVuLmpzIiwic3JjRGVtby9zY3JlZW5zL1JlYWN0Q29tcG9uZW50cy9Gb3JtSW5wdXROdW1iZXJTY3JlZW4uanMiLCJzcmNEZW1vL3NjcmVlbnMvUmVhY3RDb21wb25lbnRzL0Zvcm1JbnB1dFNjcmVlbi5qcyIsInNyY0RlbW8vc2NyZWVucy9SZWFjdENvbXBvbmVudHMvSGVsbG9TY3JlZW4uanMiLCJzcmNEZW1vL3NjcmVlbnMvUmVhY3RDb21wb25lbnRzL0xpc3RTY3JlZW4uanMiLCJzcmNEZW1vL3NjcmVlbnMvU2VydmljZXMvTG9jYWxlU2VydmljZVNjcmVlbi5qcyIsInNyY0RlbW8vc2NyZWVucy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztrQkMxQndCLFc7O0FBTHhCOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFZSxTQUFTLFdBQVQsQ0FBcUIsU0FBckIsRUFBZ0M7QUFDN0MsUUFBTSxXQUFOLFNBQTBCLGdCQUFNLFNBQWhDLENBQTBDO0FBQ3hDLGdCQUFZLEtBQVosRUFBbUIs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LEVBQStCLE9BQU8sUUFBdEMsRUFESztBQUZULENBUHFCLEVBYXJCO0FBQ0UsU0FBTyxnQkFEVDtBQUVFLFNBQU8sQ0FDTCxFQUFFLE1BQU0sdURBQVIsRUFBaUUsT0FBTyxPQUF4RSxFQURLLEVBRUwsRUFBRSxNQUFNLDZEQUFSLEVBQXVFLE9BQU8sY0FBOUUsRUFGSztBQUZULENBYnFCLEVBb0JyQjtBQUNFLFNBQU8sa0JBRFQ7QUFFRSxTQUFPLENBQ0wsRUFBRSxNQUFNLGFBQVIsRUFBdUIsT0FBTyxPQUE5QixFQURLLEVBRUwsRUFBRSxNQUFNLFlBQVIsRUFBc0IsT0FBTyxNQUE3QixFQUZLLEVBR0wsRUFBRSxNQUFNLGlCQUFSLEVBQTJCLE9BQU8sWUFBbEMsRUFISyxFQUlMLEVBQUUsTUFBTSx1QkFBUixFQUFpQyxPQUFPLG1CQUF4QyxFQUpLLEVBS0wsRUFBRSxNQUFNLGlCQUFSLEVBQTJCLE9BQU8sV0FBbEMsRUFMSyxFQU1MLEVBQUUsTUFBTSw2QkFBUixFQUF1QyxPQUFPLE9BQTlDLEVBTks7QUFGVCxDQXBCcUIsRUErQnJCO0FBQ0UsU0FBTyxPQURUO0FBRUUsU0FBTyxDQUNMLEVBQUUsTUFBTSx1QkFBUixFQUFpQyxPQUFPLG1CQUF4QyxFQURLO0FBRlQsQ0EvQnFCLENBQXZCOztRQXdDRSxPLEdBQUEsTztRQUNBLGMsR0FBQSxjIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTUsIFlhaG9vISBJbmMuXG4gKiBDb3B5cmlnaHRzIGxpY2Vuc2VkIHVuZGVyIHRoZSBOZXcgQlNEIExpY2Vuc2UuIFNlZSB0aGUgYWNjb21wYW55aW5nIExJQ0VOU0UgZmlsZSBmb3IgdGVybXMuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIFJFQUNUX1NUQVRJQ1MgPSB7XG4gICAgY2hpbGRDb250ZXh0VHlwZXM6IHRydWUsXG4gICAgY29udGV4dFR5cGVzOiB0cnVlLFxuICAgIGRlZmF1bHRQcm9wczogdHJ1ZSxcbiAgICBkaXNwbGF5TmFtZTogdHJ1ZSxcbiAgICBnZXREZWZhdWx0UHJvcHM6IHRydWUsXG4gICAgbWl4aW5zOiB0cnVlLFxuICAgIHByb3BUeXBlczogdHJ1ZSxcbiAgICB0eXBlOiB0cnVlXG59O1xuXG52YXIgS05PV05fU1RBVElDUyA9IHtcbiAgbmFtZTogdHJ1ZSxcbiAgbGVuZ3RoOiB0cnVlLFxuICBwcm90b3R5cGU6IHRydWUsXG4gIGNhbGxlcjogdHJ1ZSxcbiAgY2FsbGVlOiB0cnVlLFxuICBhcmd1bWVudHM6IHRydWUsXG4gIGFyaXR5OiB0cnVlXG59O1xuXG52YXIgZGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG52YXIgZ2V0T3duUHJvcGVydHlOYW1lcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzO1xudmFyIGdldE93blByb3BlcnR5U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG52YXIgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbnZhciBnZXRQcm90b3R5cGVPZiA9IE9iamVjdC5nZXRQcm90b3R5cGVPZjtcbnZhciBvYmplY3RQcm90b3R5cGUgPSBnZXRQcm90b3R5cGVPZiAmJiBnZXRQcm90b3R5cGVPZihPYmplY3QpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGhvaXN0Tm9uUmVhY3RTdGF0aWNzKHRhcmdldENvbXBvbmVudCwgc291cmNlQ29tcG9uZW50LCBibGFja2xpc3QpIHtcbiAgICBpZiAodHlwZW9mIHNvdXJjZUNvbXBvbmVudCAhPT0gJ3N0cmluZycpIHsgLy8gZG9uJ3QgaG9pc3Qgb3ZlciBzdHJpbmcgKGh0bWwpIGNvbXBvbmVudHNcblxuICAgICAgICBpZiAob2JqZWN0UHJvdG90eXBlKSB7XG4gICAgICAgICAgICB2YXIgaW5oZXJpdGVkQ29tcG9uZW50ID0gZ2V0UHJvdG90eXBlT2Yoc291cmNlQ29tcG9uZW50KTtcbiAgICAgICAgICAgIGlmIChpbmhlcml0ZWRDb21wb25lbnQgJiYgaW5oZXJpdGVkQ29tcG9uZW50ICE9PSBvYmplY3RQcm90b3R5cGUpIHtcbiAgICAgICAgICAgICAgICBob2lzdE5vblJlYWN0U3RhdGljcyh0YXJnZXRDb21wb25lbnQsIGluaGVyaXRlZENvbXBvbmVudCwgYmxhY2tsaXN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBrZXlzID0gZ2V0T3duUHJvcGVydHlOYW1lcyhzb3VyY2VDb21wb25lbnQpO1xuXG4gICAgICAgIGlmIChnZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcbiAgICAgICAgICAgIGtleXMgPSBrZXlzLmNvbmNhdChnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoc291cmNlQ29tcG9uZW50KSk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuICAgICAgICAgICAgaWYgKCFSRUFDVF9TVEFUSUNTW2tleV0gJiYgIUtOT1dOX1NUQVRJQ1Nba2V5XSAmJiAoIWJsYWNrbGlzdCB8fCAhYmxhY2tsaXN0W2tleV0pKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRlc2NyaXB0b3IgPSBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc291cmNlQ29tcG9uZW50LCBrZXkpO1xuICAgICAgICAgICAgICAgIHRyeSB7IC8vIEF2b2lkIGZhaWx1cmVzIGZyb20gcmVhZC1vbmx5IHByb3BlcnRpZXNcbiAgICAgICAgICAgICAgICAgICAgZGVmaW5lUHJvcGVydHkodGFyZ2V0Q29tcG9uZW50LCBrZXksIGRlc2NyaXB0b3IpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGFyZ2V0Q29tcG9uZW50O1xuICAgIH1cblxuICAgIHJldHVybiB0YXJnZXRDb21wb25lbnQ7XG59O1xuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxudmFyIF9yZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX3Byb3BUeXBlcyA9IHJlcXVpcmUoJ3Byb3AtdHlwZXMnKTtcblxudmFyIF9wcm9wVHlwZXMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcHJvcFR5cGVzKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzKG9iaiwga2V5cykgeyB2YXIgdGFyZ2V0ID0ge307IGZvciAodmFyIGkgaW4gb2JqKSB7IGlmIChrZXlzLmluZGV4T2YoaSkgPj0gMCkgY29udGludWU7IGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgaSkpIGNvbnRpbnVlOyB0YXJnZXRbaV0gPSBvYmpbaV07IH0gcmV0dXJuIHRhcmdldDsgfVxuXG52YXIgSWNvbkJhc2UgPSBmdW5jdGlvbiBJY29uQmFzZShfcmVmLCBfcmVmMikge1xuICB2YXIgY2hpbGRyZW4gPSBfcmVmLmNoaWxkcmVuO1xuICB2YXIgY29sb3IgPSBfcmVmLmNvbG9yO1xuICB2YXIgc2l6ZSA9IF9yZWYuc2l6ZTtcbiAgdmFyIHN0eWxlID0gX3JlZi5zdHlsZTtcbiAgdmFyIHdpZHRoID0gX3JlZi53aWR0aDtcbiAgdmFyIGhlaWdodCA9IF9yZWYuaGVpZ2h0O1xuXG4gIHZhciBwcm9wcyA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllcyhfcmVmLCBbJ2NoaWxkcmVuJywgJ2NvbG9yJywgJ3NpemUnLCAnc3R5bGUnLCAnd2lkdGgnLCAnaGVpZ2h0J10pO1xuXG4gIHZhciBfcmVmMiRyZWFjdEljb25CYXNlID0gX3JlZjIucmVhY3RJY29uQmFzZTtcbiAgdmFyIHJlYWN0SWNvbkJhc2UgPSBfcmVmMiRyZWFjdEljb25CYXNlID09PSB1bmRlZmluZWQgPyB7fSA6IF9yZWYyJHJlYWN0SWNvbkJhc2U7XG5cbiAgdmFyIGNvbXB1dGVkU2l6ZSA9IHNpemUgfHwgcmVhY3RJY29uQmFzZS5zaXplIHx8ICcxZW0nO1xuICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoJ3N2ZycsIF9leHRlbmRzKHtcbiAgICBjaGlsZHJlbjogY2hpbGRyZW4sXG4gICAgZmlsbDogJ2N1cnJlbnRDb2xvcicsXG4gICAgcHJlc2VydmVBc3BlY3RSYXRpbzogJ3hNaWRZTWlkIG1lZXQnLFxuICAgIGhlaWdodDogaGVpZ2h0IHx8IGNvbXB1dGVkU2l6ZSxcbiAgICB3aWR0aDogd2lkdGggfHwgY29tcHV0ZWRTaXplXG4gIH0sIHJlYWN0SWNvbkJhc2UsIHByb3BzLCB7XG4gICAgc3R5bGU6IF9leHRlbmRzKHtcbiAgICAgIHZlcnRpY2FsQWxpZ246ICdtaWRkbGUnLFxuICAgICAgY29sb3I6IGNvbG9yIHx8IHJlYWN0SWNvbkJhc2UuY29sb3JcbiAgICB9LCByZWFjdEljb25CYXNlLnN0eWxlIHx8IHt9LCBzdHlsZSlcbiAgfSkpO1xufTtcblxuSWNvbkJhc2UucHJvcFR5cGVzID0ge1xuICBjb2xvcjogX3Byb3BUeXBlczIuZGVmYXVsdC5zdHJpbmcsXG4gIHNpemU6IF9wcm9wVHlwZXMyLmRlZmF1bHQub25lT2ZUeXBlKFtfcHJvcFR5cGVzMi5kZWZhdWx0LnN0cmluZywgX3Byb3BUeXBlczIuZGVmYXVsdC5udW1iZXJdKSxcbiAgd2lkdGg6IF9wcm9wVHlwZXMyLmRlZmF1bHQub25lT2ZUeXBlKFtfcHJvcFR5cGVzMi5kZWZhdWx0LnN0cmluZywgX3Byb3BUeXBlczIuZGVmYXVsdC5udW1iZXJdKSxcbiAgaGVpZ2h0OiBfcHJvcFR5cGVzMi5kZWZhdWx0Lm9uZU9mVHlwZShbX3Byb3BUeXBlczIuZGVmYXVsdC5zdHJpbmcsIF9wcm9wVHlwZXMyLmRlZmF1bHQubnVtYmVyXSksXG4gIHN0eWxlOiBfcHJvcFR5cGVzMi5kZWZhdWx0Lm9iamVjdFxufTtcblxuSWNvbkJhc2UuY29udGV4dFR5cGVzID0ge1xuICByZWFjdEljb25CYXNlOiBfcHJvcFR5cGVzMi5kZWZhdWx0LnNoYXBlKEljb25CYXNlLnByb3BUeXBlcylcbn07XG5cbmV4cG9ydHMuZGVmYXVsdCA9IEljb25CYXNlO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9yZWFjdEljb25CYXNlID0gcmVxdWlyZSgncmVhY3QtaWNvbi1iYXNlJyk7XG5cbnZhciBfcmVhY3RJY29uQmFzZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdEljb25CYXNlKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIEdvTWFya0dpdGh1YiA9IGZ1bmN0aW9uIEdvTWFya0dpdGh1Yihwcm9wcykge1xuICAgIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgX3JlYWN0SWNvbkJhc2UyLmRlZmF1bHQsXG4gICAgICAgIF9leHRlbmRzKHsgdmlld0JveDogJzAgMCA0MCA0MCcgfSwgcHJvcHMpLFxuICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICdnJyxcbiAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudCgncGF0aCcsIHsgZDogJ20yMCAwYy0xMSAwLTIwIDktMjAgMjAgMCA4LjggNS43IDE2LjMgMTMuNyAxOSAxIDAuMiAxLjMtMC41IDEuMy0xIDAtMC41IDAtMiAwLTMuNy01LjUgMS4yLTYuNy0yLjQtNi43LTIuNC0wLjktMi4zLTIuMi0yLjktMi4yLTIuOS0xLjktMS4yIDAuMS0xLjIgMC4xLTEuMiAyIDAuMSAzLjEgMi4xIDMuMSAyLjEgMS43IDMgNC42IDIuMSA1LjggMS42IDAuMi0xLjMgMC43LTIuMiAxLjMtMi43LTQuNS0wLjUtOS4yLTIuMi05LjItOS44IDAtMi4yIDAuOC00IDIuMS01LjQtMC4yLTAuNS0wLjktMi42IDAuMi01LjMgMCAwIDEuNy0wLjUgNS41IDIgMS42LTAuNCAzLjMtMC42IDUtMC42IDEuNyAwIDMuNCAwLjIgNSAwLjcgMy44LTIuNiA1LjUtMi4xIDUuNS0yLjEgMS4xIDIuOCAwLjQgNC44IDAuMiA1LjMgMS4zIDEuNCAyLjEgMy4yIDIuMSA1LjQgMCA3LjYtNC43IDkuMy05LjIgOS44IDAuNyAwLjYgMS40IDEuOSAxLjQgMy43IDAgMi43IDAgNC45IDAgNS41IDAgMC42IDAuMyAxLjIgMS4zIDEgOC0yLjcgMTMuNy0xMC4yIDEzLjctMTkgMC0xMS05LTIwLTIwLTIweicgfSlcbiAgICAgICAgKVxuICAgICk7XG59O1xuXG5leHBvcnRzLmRlZmF1bHQgPSBHb01hcmtHaXRodWI7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxudmFyIF9yZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX3JlYWN0SWNvbkJhc2UgPSByZXF1aXJlKCdyZWFjdC1pY29uLWJhc2UnKTtcblxudmFyIF9yZWFjdEljb25CYXNlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0SWNvbkJhc2UpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgR29UaHJlZUJhcnMgPSBmdW5jdGlvbiBHb1RocmVlQmFycyhwcm9wcykge1xuICAgIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgX3JlYWN0SWNvbkJhc2UyLmRlZmF1bHQsXG4gICAgICAgIF9leHRlbmRzKHsgdmlld0JveDogJzAgMCA0MCA0MCcgfSwgcHJvcHMpLFxuICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICdnJyxcbiAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudCgncGF0aCcsIHsgZDogJ201IDcuNXY1aDMwdi01aC0zMHogbTAgMTVoMzB2LTVoLTMwdjV6IG0wIDEwaDMwdi01aC0zMHY1eicgfSlcbiAgICAgICAgKVxuICAgICk7XG59O1xuXG5leHBvcnRzLmRlZmF1bHQgPSBHb1RocmVlQmFycztcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgaG9pc3ROb25SZWFjdFN0YXRpY3MgZnJvbSAnaG9pc3Qtbm9uLXJlYWN0LXN0YXRpY3MnO1xuaW1wb3J0IGxvY2FsZVNlcnZpY2UgZnJvbSAnLi8uLi9zZXJ2aWNlcy9Mb2NhbGVTZXJ2aWNlJztcbmltcG9ydCBpMThuU2VydmljZSBmcm9tICcuLy4uL3NlcnZpY2VzL0kxOG5TZXJ2aWNlJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbG9jYWxlQXdhcmUoQ29tcG9uZW50KSB7XG4gIGNsYXNzIExvY2FsZUF3YXJlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCkge1xuICAgICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xuICAgICAgdGhpcy5oYW5kbGVMb2NhbGVDaGFuZ2UgPSB0aGlzLmhhbmRsZUxvY2FsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy51bnJlZ2lzdGVyTG9jYWxlQ2hhbmdlID0gbnVsbDtcbiAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgIGxvY2FsZTogbG9jYWxlU2VydmljZS5sb2NhbGVcbiAgICAgIH07XG4gICAgICB0aGlzLl9tb3VudGVkID0gZmFsc2U7XG4gICAgICB0aGlzLl9jb21wb25lbnQgPSBudWxsO1xuICAgIH1cblxuICAgIGhhbmRsZUxvY2FsZUNoYW5nZShsb2NhbGUpIHtcbiAgICAgIHRoaXMuX21vdW50ZWQgJiYgdGhpcy5zdGF0ZS5sb2NhbGUgIT09IGxvY2FsZSAmJiB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgbG9jYWxlXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgIHRoaXMudW5yZWdpc3RlckxvY2FsZUNoYW5nZSA9IGxvY2FsZVNlcnZpY2Uub25Mb2NhbGVDaGFuZ2UodGhpcy5oYW5kbGVMb2NhbGVDaGFuZ2UpO1xuICAgICAgdGhpcy5fbW91bnRlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgICB0aGlzLl9tb3VudGVkID0gZmFsc2U7XG4gICAgICB0aGlzLnVucmVnaXN0ZXJMb2NhbGVDaGFuZ2UoKTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICBjb25zdCB7IGxvY2FsZSB9ID0gdGhpcy5zdGF0ZTtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxDb21wb25lbnQgeyAuLi50aGlzLnByb3BzIH1cbiAgICAgICAgICBsb2NhbGU9eyBsb2NhbGUgfVxuICAgICAgICAgIHRyYW5zbGF0aW9ucz17IGkxOG5TZXJ2aWNlLmN1cnJlbnRMYW5nVHJhbnNsYXRpb25zIH1cbiAgICAgICAgICByZWY9eyBjb21wID0+IHRoaXMuX2NvbXBvbmVudCA9IGNvbXAgfVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBMb2NhbGVBd2FyZS5kaXNwbGF5TmFtZSA9IGBMb2NhbGVBd2FyZSgke1xuICAgIENvbXBvbmVudC5kaXNwbGF5TmFtZSB8fFxuICAgIENvbXBvbmVudC5uYW1lIHx8XG4gICAgJ0NvbXBvbmVudCdcbiAgfSlgO1xuXG4gIHJldHVybiBob2lzdE5vblJlYWN0U3RhdGljcyhMb2NhbGVBd2FyZSwgQ29tcG9uZW50KTtcbn1cbiIsImltcG9ydCBsb2NhbGVTZXJ2aWNlIGZyb20gJy4vTG9jYWxlU2VydmljZSc7XG5cbmNvbnN0IGVtcHR5T2JqID0ge307XG5cbmNsYXNzIEkxOG5TZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgbG9jYWxlU2VydmljZS5vbkxvY2FsZUNoYW5nZSh0aGlzLl9oYW5kbGVMb2NhbGVDaGFuZ2UuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5fbG9jYWxlID0gbG9jYWxlU2VydmljZS5sb2NhbGU7XG4gICAgdGhpcy5fdHJhbnNsYXRpb25zID0ge307XG4gIH1cblxuICBfaGFuZGxlTG9jYWxlQ2hhbmdlKGxvY2FsZSkge1xuICAgIHRoaXMuX2xvY2FsZSA9IGxvY2FsZTtcbiAgfVxuXG4gIGNsZWFyVHJhbnNsYXRpb25zKGxhbmcpIHtcbiAgICBkZWxldGUgdGhpcy5fdHJhbnNsYXRpb25zW2xhbmddO1xuICB9XG5cbiAgcmVnaXN0ZXJUcmFuc2xhdGlvbnModHJhbnNsYXRpb25zKSB7XG4gICAgdGhpcy5fdHJhbnNsYXRpb25zID0gT2JqZWN0LmtleXModHJhbnNsYXRpb25zKS5yZWR1Y2UoKGFjYywgbGFuZykgPT4ge1xuICAgICAgYWNjW2xhbmddID0ge1xuICAgICAgICAuLi50aGlzLl90cmFuc2xhdGlvbnNbbGFuZ10sXG4gICAgICAgIC4uLnRyYW5zbGF0aW9uc1tsYW5nXVxuICAgICAgfTtcbiAgICAgIHJldHVybiBhY2M7XG4gICAgfSwgdGhpcy5fdHJhbnNsYXRpb25zKTtcbiAgfVxuXG4gIHRyYW5zbGF0ZShtc2cpIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50TGFuZ1RyYW5zbGF0aW9uc1ttc2ddO1xuICB9XG5cbiAgZ2V0IHRyYW5zbGF0aW9ucygpIHtcbiAgICByZXR1cm4gdGhpcy5fdHJhbnNsYXRpb25zO1xuICB9XG5cbiAgZ2V0IGN1cnJlbnRMYW5nVHJhbnNsYXRpb25zKCkge1xuICAgIHJldHVybiB0aGlzLl90cmFuc2xhdGlvbnNbdGhpcy5fbG9jYWxlLmxhbmddIHx8IGVtcHR5T2JqO1xuICB9XG59XG5cbmNvbnN0IGkxOG5TZXJ2aWNlID0gbmV3IEkxOG5TZXJ2aWNlKCk7XG5leHBvcnQgZGVmYXVsdCBpMThuU2VydmljZTtcbiIsIlxuY29uc3QgZGVmYXVsdExvY2FsZSA9IHtcbiAgZGlyOiAnbHRyJyxcbiAgbGFuZzogJ2VuJ1xufTtcblxuY2xhc3MgTG9jYWxlU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX2NhbGxiYWNrcyA9IFtdO1xuICAgIHRoaXMuX2xvY2FsZUF0dHJzID0gT2JqZWN0LmtleXMoZGVmYXVsdExvY2FsZSk7XG4gICAgdGhpcy5fcm9vdEVsZW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgIHRoaXMuX2xvY2FsZUF0dHJzLmZvckVhY2goKGF0dHIpID0+IHtcbiAgICAgIGlmICghdGhpcy5fcm9vdEVsZW1lbnQuZ2V0QXR0cmlidXRlKGF0dHIpKSB7XG4gICAgICAgIHRoaXMuX3Jvb3RFbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyLCBkZWZhdWx0TG9jYWxlW2F0dHJdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLl9sb2NhbGUgPSB0aGlzLl9sb2NhbGVBdHRycy5yZWR1Y2UoKGFjYywgYXR0cikgPT4ge1xuICAgICAgYWNjW2F0dHJdID0gdGhpcy5fcm9vdEVsZW1lbnQuZ2V0QXR0cmlidXRlKGF0dHIpO1xuICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCB7fSk7XG4gICAgdGhpcy5fb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcih0aGlzLl9oYW5kbGVNdXRhdGlvbnMuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5fb2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLl9yb290RWxlbWVudCwge1xuICAgICAgYXR0cmlidXRlczogdHJ1ZVxuICAgIH0pO1xuICB9XG5cbiAgX2hhbmRsZU11dGF0aW9ucyhtdXRhdGlvbnMpIHtcbiAgICBtdXRhdGlvbnMuZm9yRWFjaCgobXV0YXRpb24pID0+IHtcbiAgICAgIGNvbnN0IG11dGF0aW9uQXR0cmlidXRlTmFtZSA9IG11dGF0aW9uLmF0dHJpYnV0ZU5hbWU7XG4gICAgICBpZiAodGhpcy5fbG9jYWxlQXR0cnMuaW5jbHVkZXMobXV0YXRpb25BdHRyaWJ1dGVOYW1lKSkge1xuICAgICAgICB0aGlzLl9sb2NhbGUgPSB7XG4gICAgICAgICAgLi4udGhpcy5fbG9jYWxlLFxuICAgICAgICAgIFttdXRhdGlvbkF0dHJpYnV0ZU5hbWVdOiB0aGlzLl9yb290RWxlbWVudC5nZXRBdHRyaWJ1dGUobXV0YXRpb25BdHRyaWJ1dGVOYW1lKVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9jYWxsYmFja3MuZm9yRWFjaChjYWxsYmFjayA9PiBjYWxsYmFjayh0aGlzLl9sb2NhbGUpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHNldCBsb2NhbGUobG9jYWxlT2JqKSB7XG4gICAgT2JqZWN0LmtleXMobG9jYWxlT2JqKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIHRoaXMuX3Jvb3RFbGVtZW50LnNldEF0dHJpYnV0ZShrZXksIGxvY2FsZU9ialtrZXldKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldCBsb2NhbGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xvY2FsZTtcbiAgfVxuXG4gIG9uTG9jYWxlQ2hhbmdlKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuICAgIGNhbGxiYWNrKHRoaXMubG9jYWxlKTtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzLmZpbHRlcihjYiA9PiBjYiAhPT0gY2FsbGJhY2spO1xuICAgIH07XG4gIH1cbn1cblxuY29uc3QgbG9jYWxlU2VydmljZSA9IG5ldyBMb2NhbGVTZXJ2aWNlKCk7XG5leHBvcnQgZGVmYXVsdCBsb2NhbGVTZXJ2aWNlO1xuIiwiXG5pbXBvcnQgTG9jYWxlU2VydmljZSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9Mb2NhbGVTZXJ2aWNlJztcbmltcG9ydCBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24gZnJvbSAnLi4vaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbic7XG5cbmNvbnN0IHJlZ2lzdHJhdGlvbk5hbWUgPSAnREJVSVdlYkNvbXBvbmVudEJhc2UnO1xuXG5mdW5jdGlvbiBkZWZpbmVDb21tb25DU1NWYXJzKCkge1xuICBjb25zdCBjb21tb25TdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gIGNvbW1vblN0eWxlLmlubmVySFRNTCA9IGBcbiAgOnJvb3Qge1xuICAgIC0tZGJ1aS1pbnB1dC1oZWlnaHQ6IDU1cHg7XG4gIH1cbiAgYDtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaGVhZCcpLmFwcGVuZENoaWxkKGNvbW1vblN0eWxlKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0REJVSVdlYkNvbXBvbmVudEJhc2Uod2luKSB7XG4gIHJldHVybiBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24od2luLCByZWdpc3RyYXRpb25OYW1lLCAoKSA9PiB7XG4gICAgZGVmaW5lQ29tbW9uQ1NTVmFycygpO1xuICAgIGNvbnN0IHsgZG9jdW1lbnQsIEhUTUxFbGVtZW50LCBjdXN0b21FbGVtZW50cyB9ID0gd2luO1xuXG4gICAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9ICc8c3R5bGU+PC9zdHlsZT48c2xvdD48L3Nsb3Q+JztcblxuICAgIGNsYXNzIERCVUlXZWJDb21wb25lbnRCYXNlIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuXG4gICAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlKCkge1xuICAgICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgZGVwZW5kZW5jaWVzKCkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgdXNlU2hhZG93KCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIGNvbnN0IHsgdXNlU2hhZG93IH0gPSB0aGlzLmNvbnN0cnVjdG9yO1xuICAgICAgICBpZiAodXNlU2hhZG93KSB7XG4gICAgICAgICAgdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5faW5zZXJ0VGVtcGxhdGUoKTtcblxuICAgICAgICB0aGlzLmNvbm5lY3RlZENhbGxiYWNrID0gdGhpcy5jb25uZWN0ZWRDYWxsYmFjay5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmRpc2Nvbm5lY3RlZENhbGxiYWNrID0gdGhpcy5kaXNjb25uZWN0ZWRDYWxsYmFjay5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLl9oYW5kbGVMb2NhbGVDaGFuZ2UgPSB0aGlzLl9oYW5kbGVMb2NhbGVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vbkxvY2FsZUNoYW5nZSAmJiAodGhpcy5vbkxvY2FsZUNoYW5nZSA9IHRoaXMub25Mb2NhbGVDaGFuZ2UuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMudW5yZWdpc3RlckxvY2FsZUNoYW5nZSA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmVmb3JldW5sb2FkJywgdGhpcy5kaXNjb25uZWN0ZWRDYWxsYmFjaywgZmFsc2UpO1xuXG4gICAgICAgIHRoaXMudW5yZWdpc3RlckxvY2FsZUNoYW5nZSA9XG4gICAgICAgICAgTG9jYWxlU2VydmljZS5vbkxvY2FsZUNoYW5nZSh0aGlzLl9oYW5kbGVMb2NhbGVDaGFuZ2UpO1xuICAgICAgfVxuXG4gICAgICBkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgICAgdGhpcy51bnJlZ2lzdGVyTG9jYWxlQ2hhbmdlKCk7XG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdiZWZvcmV1bmxvYWQnLCB0aGlzLmRpc2Nvbm5lY3RlZENhbGxiYWNrLCBmYWxzZSk7XG4gICAgICB9XG5cbiAgICAgIGdldCBjaGlsZHJlblRyZWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLnVzZVNoYWRvdyA/IHRoaXMuc2hhZG93Um9vdCA6IHRoaXM7XG4gICAgICB9XG5cbiAgICAgIF9pbnNlcnRUZW1wbGF0ZSgpIHtcbiAgICAgICAgY29uc3QgeyB0ZW1wbGF0ZSB9ID0gdGhpcy5jb25zdHJ1Y3RvcjtcblxuICAgICAgICBpZiAodGVtcGxhdGUpIHtcbiAgICAgICAgICB0aGlzLmNoaWxkcmVuVHJlZS5hcHBlbmRDaGlsZCh0ZW1wbGF0ZS5jb250ZW50LmNsb25lTm9kZSh0cnVlKSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgX2hhbmRsZUxvY2FsZUNoYW5nZShsb2NhbGUpIHtcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2RpcicsIGxvY2FsZS5kaXIpO1xuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnbGFuZycsIGxvY2FsZS5sYW5nKTtcbiAgICAgICAgdGhpcy5vbkxvY2FsZUNoYW5nZSAmJiB0aGlzLm9uTG9jYWxlQ2hhbmdlKGxvY2FsZSk7XG4gICAgICB9XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzKGtsYXNzKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoa2xhc3MsICdjb21wb25lbnRTdHlsZScsIHtcbiAgICAgICAgZ2V0KCkge1xuICAgICAgICAgIHJldHVybiBrbGFzcy50ZW1wbGF0ZS5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ3N0eWxlJykuaW5uZXJIVE1MO1xuICAgICAgICB9LFxuICAgICAgICBzZXQodmFsdWUpIHtcbiAgICAgICAgICBrbGFzcy50ZW1wbGF0ZS5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ3N0eWxlJykuaW5uZXJIVE1MID0gdmFsdWU7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfSk7XG5cbiAgICAgIGtsYXNzLnJlZ2lzdGVyU2VsZiA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgcmVnaXN0cmF0aW9uTmFtZSA9IGtsYXNzLnJlZ2lzdHJhdGlvbk5hbWU7XG4gICAgICAgIGNvbnN0IGRlcGVuZGVuY2llcyA9IGtsYXNzLmRlcGVuZGVuY2llcztcbiAgICAgICAgLy8gTWFrZSBzdXJlIG91ciBkZXBlbmRlbmNpZXMgYXJlIHJlZ2lzdGVyZWQgYmVmb3JlIHdlIHJlZ2lzdGVyIHNlbGZcbiAgICAgICAgZGVwZW5kZW5jaWVzLmZvckVhY2goKGRlcGVuZGVuY3kpID0+IGRlcGVuZGVuY3kucmVnaXN0ZXJTZWxmKCkpO1xuICAgICAgICAvLyBEb24ndCB0cnkgdG8gcmVnaXN0ZXIgc2VsZiBpZiBhbHJlYWR5IHJlZ2lzdGVyZWRcbiAgICAgICAgaWYgKGN1c3RvbUVsZW1lbnRzLmdldChyZWdpc3RyYXRpb25OYW1lKSkgcmV0dXJuIHJlZ2lzdHJhdGlvbk5hbWU7XG4gICAgICAgIC8vIEdpdmUgYSBjaGFuY2UgdG8gb3ZlcnJpZGUgd2ViLWNvbXBvbmVudCBzdHlsZSBpZiBwcm92aWRlZCBiZWZvcmUgYmVpbmcgcmVnaXN0ZXJlZC5cbiAgICAgICAgY29uc3QgY29tcG9uZW50U3R5bGUgPSAoKHdpbi5EQlVJV2ViQ29tcG9uZW50cyB8fCB7fSlbcmVnaXN0cmF0aW9uTmFtZV0gfHwge30pLmNvbXBvbmVudFN0eWxlO1xuICAgICAgICBpZiAoY29tcG9uZW50U3R5bGUpIHtcbiAgICAgICAgICBrbGFzcy5jb21wb25lbnRTdHlsZSArPSBjb21wb25lbnRTdHlsZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBEbyByZWdpc3RyYXRpb25cbiAgICAgICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKHJlZ2lzdHJhdGlvbk5hbWUsIGtsYXNzKTtcbiAgICAgICAgcmV0dXJuIHJlZ2lzdHJhdGlvbk5hbWU7XG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBEQlVJV2ViQ29tcG9uZW50QmFzZSxcbiAgICAgIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHNcbiAgICB9O1xuICB9KTtcbn1cbiIsIlxuaW1wb3J0IGdldERCVUlXZWJDb21wb25lbnRCYXNlIGZyb20gJy4uL0RCVUlXZWJDb21wb25lbnRCYXNlL0RCVUlXZWJDb21wb25lbnRCYXNlJztcbmltcG9ydCBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24gZnJvbSAnLi4vaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbic7XG5cbmNvbnN0IHJlZ2lzdHJhdGlvbk5hbWUgPSAnZGJ1aS13ZWItY29tcG9uZW50LWR1bW15JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0REJVSVdlYkNvbXBvbmVudER1bW15KHdpbikge1xuICByZXR1cm4gZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uKHdpbiwgcmVnaXN0cmF0aW9uTmFtZSwgKCkgPT4ge1xuICAgIGNvbnN0IHsgREJVSVdlYkNvbXBvbmVudEJhc2UsIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMgfSA9IGdldERCVUlXZWJDb21wb25lbnRCYXNlKHdpbik7XG4gICAgY29uc3QgeyBkb2N1bWVudCB9ID0gd2luO1xuXG4gICAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IGBcbiAgICAgIDxzdHlsZT5cbiAgICAgIDpob3N0IHtcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgbWF4LXdpZHRoOiA0MDBweDtcbiAgICAgICAgaGVpZ2h0OiB2YXIoLS1kYnVpLWlucHV0LWhlaWdodCwgNTBweCk7XG4gICAgICAgIGNvbG9yOiBtYXJvb247XG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIGdyYXk7XG4gICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgICB9XG4gICAgICBcbiAgICAgIDpob3N0IGIsIDpob3N0IGRpdlt4LWhhcy1zbG90XSBzcGFuW3gtc2xvdC13cmFwcGVyXSB7XG4gICAgICAgIHVuaWNvZGUtYmlkaTogYmlkaS1vdmVycmlkZTtcbiAgICAgICAgdGV4dC1zaGFkb3c6IHZhcigtLWR1bW15LWItdGV4dC1zaGFkb3csIG5vbmUpO1xuICAgICAgfVxuXG4gICAgICA6aG9zdChbZGlyPXJ0bF0pIGIge1xuICAgICAgICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgOmhvc3QoW2Rpcj1sdHJdKSBiIHtcbiAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiBvdmVybGluZTtcbiAgICAgIH1cblxuICAgICAgOmhvc3QoW2Rpcj1sdHJdKSAjY29udGFpbmVyID4gZGl2W2Rpcj1ydGxdLFxuICAgICAgOmhvc3QoW2Rpcj1ydGxdKSAjY29udGFpbmVyID4gZGl2W2Rpcj1sdHJdIHtcbiAgICAgICAgZGlzcGxheTogbm9uZTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgOmhvc3QgI2NvbnRhaW5lciA+IGRpdlt4LWhhcy1zbG90XSB7XG4gICAgICAgIG1hcmdpbi1sZWZ0OiAwcHg7XG4gICAgICB9XG4gICAgICBcbiAgICAgICNjb250YWluZXIge1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWZsb3c6IHJvdyBub3dyYXA7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBzdHJldGNoO1xuICAgICAgfVxuICAgICAgXG4gICAgICAjY29udGFpbmVyID4gZGl2IHtcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgZ3JheTtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogdmFyKC0tZHVtbXktaW5uZXItc2VjdGlvbnMtYm9yZGVyLXJhZGl1cywgMHB4KTtcbiAgICAgICAgZmxleDogMSAwIDAlO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBtYXJnaW46IDVweDtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgI2NvbnRhaW5lciA+IGRpdiA+IGRpdiB7XG4gICAgICAgIG1hcmdpbjogYXV0bztcbiAgICAgIH1cbiAgICAgIFxuICAgICAgPC9zdHlsZT5cbiAgICAgIFxuICAgICAgPGRpdiBpZD1cImNvbnRhaW5lclwiPlxuICAgICAgICA8ZGl2IGRpcj1cImx0clwiPlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8Yj5EdW1teSBzaGFkb3c8L2I+IFtMVFJdXG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICBcbiAgICAgICAgPGRpdiB4LWhhcy1zbG90PlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8c3Bhbj5bPC9zcGFuPjxzcGFuIHgtc2xvdC13cmFwcGVyPjxzbG90Pjwvc2xvdD48L3NwYW4+PHNwYW4+XTwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIFxuICAgICAgICA8ZGl2IGRpcj1cInJ0bFwiPlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8Yj5EdW1teSBzaGFkb3c8L2I+IFtSVExdXG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgYDtcblxuICAgIGNsYXNzIERCVUlXZWJDb21wb25lbnREdW1teSBleHRlbmRzIERCVUlXZWJDb21wb25lbnRCYXNlIHtcbiAgICAgIHN0YXRpYyBnZXQgcmVnaXN0cmF0aW9uTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHJlZ2lzdHJhdGlvbk5hbWU7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgdGVtcGxhdGUoKSB7XG4gICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICAgIH1cblxuICAgICAgb25Mb2NhbGVDaGFuZ2UobG9jYWxlKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdvbkxvY2FsZUNoYW5nZScsIGxvY2FsZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyhEQlVJV2ViQ29tcG9uZW50RHVtbXkpO1xuXG4gICAgcmV0dXJuIERCVUlXZWJDb21wb25lbnREdW1teTtcbiAgfSk7XG59XG5cbmdldERCVUlXZWJDb21wb25lbnREdW1teS5yZWdpc3RyYXRpb25OYW1lID0gcmVnaXN0cmF0aW9uTmFtZTtcblxuIiwiXG5cbmltcG9ydCBnZXREQlVJV2ViQ29tcG9uZW50QmFzZSBmcm9tICcuLi9EQlVJV2ViQ29tcG9uZW50QmFzZS9EQlVJV2ViQ29tcG9uZW50QmFzZSc7XG5pbXBvcnQgZ2V0REJVSVdlYkNvbXBvbmVudER1bW15IGZyb20gJy4uL0RCVUlXZWJDb21wb25lbnREdW1teS9EQlVJV2ViQ29tcG9uZW50RHVtbXknO1xuaW1wb3J0IGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbiBmcm9tICcuLi9pbnRlcm5hbHMvZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uJztcblxuY29uc3QgcmVnaXN0cmF0aW9uTmFtZSA9ICdkYnVpLXdlYi1jb21wb25lbnQtZHVtbXktcGFyZW50JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0REJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50KHdpbikge1xuICByZXR1cm4gZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uKHdpbiwgcmVnaXN0cmF0aW9uTmFtZSwgKCkgPT4ge1xuICAgIGNvbnN0IHsgREJVSVdlYkNvbXBvbmVudEJhc2UsIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMgfSA9IGdldERCVUlXZWJDb21wb25lbnRCYXNlKHdpbik7XG4gICAgY29uc3QgREJVSVdlYkNvbXBvbmVudER1bW15ID0gZ2V0REJVSVdlYkNvbXBvbmVudER1bW15KHdpbik7XG5cbiAgICBjb25zdCB7IGRvY3VtZW50IH0gPSB3aW47XG5cbiAgICBjb25zdCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gYFxuICAgICAgPHN0eWxlPlxuICAgICAgOmhvc3Qge1xuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBtYXgtd2lkdGg6IDQwMHB4O1xuICAgICAgfVxuICAgICAgPC9zdHlsZT5cbiAgICAgIDxkaXY+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGI+RHVtbXkgUGFyZW50IHNoYWRvdzwvYj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGRidWktd2ViLWNvbXBvbmVudC1kdW1teT48c2xvdD48L3Nsb3Q+PC9kYnVpLXdlYi1jb21wb25lbnQtZHVtbXk+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgYDtcblxuICAgIGNsYXNzIERCVUlXZWJDb21wb25lbnREdW1teVBhcmVudCBleHRlbmRzIERCVUlXZWJDb21wb25lbnRCYXNlIHtcbiAgICAgIHN0YXRpYyBnZXQgcmVnaXN0cmF0aW9uTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHJlZ2lzdHJhdGlvbk5hbWU7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgdGVtcGxhdGUoKSB7XG4gICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCBkZXBlbmRlbmNpZXMoKSB7XG4gICAgICAgIHJldHVybiBbREJVSVdlYkNvbXBvbmVudER1bW15XTtcbiAgICAgIH1cblxuICAgIH1cblxuICAgIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMoREJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50KTtcblxuICAgIHJldHVybiBEQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQ7XG4gIH0pO1xufVxuXG5nZXREQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQucmVnaXN0cmF0aW9uTmFtZSA9IHJlZ2lzdHJhdGlvbk5hbWU7XG5cbiIsImltcG9ydCBhcHBlbmRTdHlsZSBmcm9tICcuLi9pbnRlcm5hbHMvYXBwZW5kU3R5bGUnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkYnVpV2ViQ29tcG9uZW50c1NldFVwKHdpbikge1xuICByZXR1cm4ge1xuICAgIGFwcGVuZFN0eWxlOiBhcHBlbmRTdHlsZSh3aW4pXG4gIH07XG59XG4iLCIvKlxuREJVSVdlYkNvbXBvbmVudEJhc2UgKGZyb20gd2hpY2ggYWxsIHdlYi1jb21wb25lbnRzIGluaGVyaXQpXG53aWxsIHJlYWQgY29tcG9uZW50U3R5bGUgZnJvbSB3aW4uREJVSVdlYkNvbXBvbmVudHNcbndoZW4ga2xhc3MucmVnaXN0ZXJTZWxmKCkgaXMgY2FsbGVkIGdpdmluZyBhIGNoYW5jZSB0byBvdmVycmlkZSBkZWZhdWx0IHdlYi1jb21wb25lbnQgc3R5bGVcbmp1c3QgYmVmb3JlIGl0IGlzIHJlZ2lzdGVyZWQuXG4qL1xuY29uc3QgYXBwZW5kU3R5bGUgPSAod2luKSA9PiAocmVnaXN0cmF0aW9uTmFtZSwgY29tcG9uZW50U3R5bGUpID0+IHtcbiAgaWYgKCF3aW4uREJVSVdlYkNvbXBvbmVudHMpIHtcbiAgICB3aW4uREJVSVdlYkNvbXBvbmVudHMgPSB7fTtcbiAgfVxuICB3aW4uREJVSVdlYkNvbXBvbmVudHMgPSB7XG4gICAgLi4ud2luLkRCVUlXZWJDb21wb25lbnRzLFxuICAgIFtyZWdpc3RyYXRpb25OYW1lXToge1xuICAgICAgLi4ud2luLkRCVUlXZWJDb21wb25lbnRzW3JlZ2lzdHJhdGlvbk5hbWVdLFxuICAgICAgY29tcG9uZW50U3R5bGVcbiAgICB9XG4gIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhcHBlbmRTdHlsZTtcbiIsIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24od2luLCBuYW1lLCBjYWxsYmFjaykge1xuICBpZiAoIXdpbi5EQlVJV2ViQ29tcG9uZW50cykge1xuICAgIHdpbi5EQlVJV2ViQ29tcG9uZW50cyA9IHsgcmVnaXN0cmF0aW9uczoge30gfTtcbiAgfSBlbHNlIGlmICghd2luLkRCVUlXZWJDb21wb25lbnRzLnJlZ2lzdHJhdGlvbnMpIHtcbiAgICB3aW4uREJVSVdlYkNvbXBvbmVudHMucmVnaXN0cmF0aW9ucyA9IHt9O1xuICB9XG5cbiAgbGV0IHJlZ2lzdHJhdGlvbiA9IHdpbi5EQlVJV2ViQ29tcG9uZW50cy5yZWdpc3RyYXRpb25zW25hbWVdO1xuXG4gIGlmIChyZWdpc3RyYXRpb24pIHJldHVybiByZWdpc3RyYXRpb247XG5cbiAgcmVnaXN0cmF0aW9uID0gY2FsbGJhY2soKTtcbiAgd2luLkRCVUlXZWJDb21wb25lbnRzLnJlZ2lzdHJhdGlvbnNbbmFtZV0gPSByZWdpc3RyYXRpb247XG5cbiAgcmV0dXJuIHdpbi5EQlVJV2ViQ29tcG9uZW50cy5yZWdpc3RyYXRpb25zW25hbWVdO1xufVxuXG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IEdvTWFya0dpdGh1YiBmcm9tICdyZWFjdC1pY29ucy9saWIvZ28vbWFyay1naXRodWInO1xuaW1wb3J0IEdvVGhyZWVCYXJzIGZyb20gJ3JlYWN0LWljb25zL2xpYi9nby90aHJlZS1iYXJzJztcbmltcG9ydCB7IHNjcmVlbnMsIHNjcmVlbkxpbmtzR2VuIH0gZnJvbSAnLi9zY3JlZW5zJztcbmltcG9ydCBJRnJhbWVTY3JlZW4gZnJvbSAnLi9pbnRlcm5hbHMvcmVhY3RDb21wb25lbnRzL0lGcmFtZVNjcmVlbic7XG5pbXBvcnQge1xuICB0b2dnbGVBcHBEaXJcbn0gZnJvbSAnLi9pbnRlcm5hbHMvYXBwVXRpbHMnO1xuXG5jbGFzcyBBcHAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsIHRoaXMub25IYXNoQ2hhbmdlLmJpbmQodGhpcykpO1xuICAgIC8vIHJlLXVzaW5nIHRoZSBoZWxwZXIgZGVmaW5lZCBmb3IgaUZyYW1lXG4gICAgd2luZG93Lm1ha2VUYWJzKCk7XG4gICAgd2luZG93LmhpZ2hsaWdodEJsb2NrcygpO1xuICB9XG5cbiAgb25IYXNoQ2hhbmdlKCkge1xuICAgIHRoaXMuZm9yY2VVcGRhdGUoKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICB3aW5kb3cubWFrZVRhYnMoKTtcbiAgICB3aW5kb3cuaGlnaGxpZ2h0QmxvY2tzKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIC8qIGVzbGludCBuby1jb25zb2xlOiAwICovXG4gICAgICAvLyBjb25zb2xlLmxvZygncmVuZGVyaW5nIEFwcCBjb21wb25lbnQnKTtcbiAgICB9XG5cbiAgICBjb25zdCBzY3JlZW5zS2V5cyA9IE9iamVjdC5rZXlzKHNjcmVlbnMpO1xuICAgIGNvbnN0IHdpbmRvd0xvY2F0aW9uSGFzaCA9ICh3aW5kb3cubG9jYXRpb24uaGFzaCB8fCBgIyR7c2NyZWVuc0tleXNbMF19YCkucmVwbGFjZSgnIycsICcnKTtcblxuICAgIGNvbnN0IGxpbmtzID0gc2NyZWVuTGlua3NHZW4ubWFwKChzZWN0aW9uLCBpZHgpID0+IHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYga2V5PXtpZHh9PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibGlua3Mtc2VjdGlvbi1ncm91cFwiPntzZWN0aW9uLnRpdGxlfTwvZGl2PlxuICAgICAgICAgIDx1bD5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgc2VjdGlvbi5saW5rcy5tYXAoKGxpbmssIGlkeCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzQWN0aXZlID0gbGluay5wYXRoID09PSB3aW5kb3dMb2NhdGlvbkhhc2ggPyAnYWN0aXZlJyA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgPGxpIGtleT17aWR4fSB4LWFjdGl2ZT17aXNBY3RpdmV9PlxuICAgICAgICAgICAgICAgICAgICA8YSBocmVmPXtgIyR7bGluay5wYXRofWB9PntsaW5rLnRpdGxlfTwvYT5cbiAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICA8L3VsPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBTY3JlZW4gPSB3aW5kb3dMb2NhdGlvbkhhc2guZW5kc1dpdGgoJy5odG1sJykgPyBJRnJhbWVTY3JlZW4gOiAoc2NyZWVuc1t3aW5kb3dMb2NhdGlvbkhhc2hdIHx8ICdkaXYnKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhZ2UtaGVhZGVyXCI+XG4gICAgICAgICAgPGgyPkRFViBCT1ggVUk8L2gyPjxhXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJoZWFkLWxpbmtcIlxuICAgICAgICAgICAgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9jYXRhbGluLWVuYWNoZS9kZXYtYm94LXVpXCJcbiAgICAgICAgICAgIHJlbD1cIm5vb3BlbmVyIG5vcmVmZXJyZXJcIlxuICAgICAgICAgICAgdGFyZ2V0PVwiX2JsYW5rXCI+PEdvTWFya0dpdGh1YiBzaXplPXsyNX0gLz48L2E+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRlbW8td3JhcHBlclwiPlxuICAgICAgICAgIDxsYWJlbCBpZD1cImxpbmtzLXRvZ2dsZS1sYWJlbFwiIGh0bWxGb3I9XCJsaW5rcy10b2dnbGVcIiBjbGFzc05hbWU9XCJoZWFkLWxpbmtcIj48R29UaHJlZUJhcnMgc2l6ZT17MjV9IC8+PC9sYWJlbD5cbiAgICAgICAgICA8aW5wdXQgaWQ9XCJsaW5rcy10b2dnbGVcIiB0eXBlPVwiY2hlY2tib3hcIiAvPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGVtby1saW5rc1wiIG9uQ2xpY2s9eygpID0+IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNsaW5rcy10b2dnbGUnKS5jaGVja2VkID0gZmFsc2V9PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJsb2NhbGUtZGlyLXN3aXRjaFwiPlxuICAgICAgICAgICAgICA8YSBocmVmPVwiI1wiIG9uQ2xpY2s9e3RvZ2dsZUFwcERpcn0+VE9HR0xFIExPQ0FMRSBESVI8L2E+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIHtsaW5rc31cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRlbW8tYXJlYVwiPlxuICAgICAgICAgICAgPFNjcmVlbi8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBcHA7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtcbiAgLy8gb25TY3JlZW5Db25zb2xlLFxuICBsb2NhbGVBd2FyZVxufSBmcm9tICdkZXYtYm94LXVpJztcbmltcG9ydCBBcHAgZnJvbSAnLi9hcHAnO1xuLy8gZGVmaW5lcyBzb21lIGhlbHBlcnMgb24gd2luZG93IChyZXVzaW5nIGNvZGUgbmVlZGVkIGluIGlGcmFtZXMpXG5pbXBvcnQgJy4vaW50ZXJuYWxzL2lGcmFtZVV0aWxzL29uV2luZG93RGVmaW5lZEhlbHBlcnMnO1xuXG4vLyBpbXBvcnQgZ2V0REJVSVdlYkNvbXBvbmVudER1bW15IGZyb20gJy4uL2J1aWxkL3NyYy9saWIvd2ViY29tcG9uZW50cy9EQlVJV2ViQ29tcG9uZW50RHVtbXkvREJVSVdlYkNvbXBvbmVudER1bW15Jztcbi8vIGltcG9ydCBnZXREQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQgZnJvbSAnLi4vYnVpbGQvc3JjL2xpYi93ZWJjb21wb25lbnRzL0RCVUlXZWJDb21wb25lbnREdW1teVBhcmVudC9EQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQnO1xuaW1wb3J0IGRidWlXZWJDb21wb25lbnRzU2V0VXAgZnJvbSAnLi4vc3JjL2xpYi93ZWJjb21wb25lbnRzL0RCVUlXZWJDb21wb25lbnRzU2V0dXAvREJVSVdlYkNvbXBvbmVudHNTZXR1cCc7XG5pbXBvcnQgZ2V0REJVSVdlYkNvbXBvbmVudER1bW15IGZyb20gJy4uL3NyYy9saWIvd2ViY29tcG9uZW50cy9EQlVJV2ViQ29tcG9uZW50RHVtbXkvREJVSVdlYkNvbXBvbmVudER1bW15JztcbmltcG9ydCBnZXREQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQgZnJvbSAnLi4vc3JjL2xpYi93ZWJjb21wb25lbnRzL0RCVUlXZWJDb21wb25lbnREdW1teVBhcmVudC9EQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQnO1xuXG5kYnVpV2ViQ29tcG9uZW50c1NldFVwKHdpbmRvdykuYXBwZW5kU3R5bGUoJ2RidWktd2ViLWNvbXBvbmVudC1kdW1teScsIGBcbiAgYiB7XG4gICAgY29sb3I6IGRlZXBza3libHVlO1xuICAgIGZvbnQtc3R5bGU6IG9ibGlxdWU7XG4gIH1cbmApO1xuXG5jb25zdCBEQlVJV2ViQ29tcG9uZW50RHVtbXkgPSBnZXREQlVJV2ViQ29tcG9uZW50RHVtbXkod2luZG93KTtcbmNvbnN0IERCVUlXZWJDb21wb25lbnREdW1teVBhcmVudCA9IGdldERCVUlXZWJDb21wb25lbnREdW1teVBhcmVudCh3aW5kb3cpO1xuXG5cbnNldFRpbWVvdXQoKCkgPT4ge1xuICBEQlVJV2ViQ29tcG9uZW50RHVtbXkucmVnaXN0ZXJTZWxmKCk7XG4gIERCVUlXZWJDb21wb25lbnREdW1teVBhcmVudC5yZWdpc3RlclNlbGYoKTtcbn0sIDIwMDApO1xuXG5jb25zdCBpZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcblxud2luZG93Lm9ubWVzc2FnZSA9IGZ1bmN0aW9uIChtc2cpIHsgY29uc29sZS5sb2coJ21zZyBmcm9tIGlmcmFtZScsIG1zZyk7IH07XG5pZnJhbWUub25sb2FkID0gZnVuY3Rpb24gKGV2dCkge1xuICBjb25zdCB0YXJnZXQgPSBldnQudGFyZ2V0O1xuXG4gIHRhcmdldC5jb250ZW50V2luZG93LmRvY3VtZW50LndyaXRlKGBcbiAgICA8aHRtbD5cbiAgICA8Ym9keT5cbiAgICAgIDxkYnVpLXdlYi1jb21wb25lbnQtZHVtbXlcbiAgICAgICAgc3R5bGU9XCJjb2xvcjogYmx1ZVwiXG4gICAgICA+XG4gICAgICAgIDxzcGFuPmhlbGxvIHdvcmxkIDM8L3NwYW4+XG4gICAgICA8L2RidWktd2ViLWNvbXBvbmVudC1kdW1teT5cbiAgICAgIDxkYnVpLXdlYi1jb21wb25lbnQtZHVtbXktcGFyZW50PjwvZGJ1aS13ZWItY29tcG9uZW50LWR1bW15LXBhcmVudD5cbiAgICA8L2JvZHk+XG4gICAgPHNjcmlwdD5cbiAgICAgIHdpbmRvdy5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdtc2cgZnJvbSB3aW5kb3cnLCBtc2cpO1xuICAgICAgICB3aW5kb3cudG9wLnBvc3RNZXNzYWdlKCd3b3JsZCcsICcqJyk7XG4gICAgICB9O1xuICAgIDwvc2NyaXB0PlxuICAgIDwvaHRtbD5cbiAgYCk7XG4gIHRhcmdldC5jb250ZW50V2luZG93LnBvc3RNZXNzYWdlKCdoZWxsbycsICcqJyk7XG5cbiAgZGJ1aVdlYkNvbXBvbmVudHNTZXRVcCh0YXJnZXQuY29udGVudFdpbmRvdykuYXBwZW5kU3R5bGUoJ2RidWktd2ViLWNvbXBvbmVudC1kdW1teScsIGBcbiAgICBiIHtcbiAgICAgIGZvbnQtc3R5bGU6IG9ibGlxdWU7XG4gICAgICBvcGFjaXR5OiAwLjU7XG4gICAgfVxuICBgKTtcbiAgY29uc3QgREJVSVdlYkNvbXBvbmVudER1bW15MiA9IGdldERCVUlXZWJDb21wb25lbnREdW1teSh0YXJnZXQuY29udGVudFdpbmRvdyk7XG4gIGNvbnN0IERCVUlXZWJDb21wb25lbnREdW1teVBhcmVudDIgPSBnZXREQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQodGFyZ2V0LmNvbnRlbnRXaW5kb3cpO1xuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBEQlVJV2ViQ29tcG9uZW50RHVtbXkyLnJlZ2lzdGVyU2VsZigpO1xuICAgIERCVUlXZWJDb21wb25lbnREdW1teVBhcmVudDIucmVnaXN0ZXJTZWxmKCk7XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIC8vIHRhcmdldC5yZW1vdmUoKTtcbiAgICB9LCAyMDAwKTtcbiAgfSwgMjAwMCk7XG59O1xuXG4vLyBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGlmcmFtZSk7XG5cblxuLy8gb25TY3JlZW5Db25zb2xlKHsgb3B0aW9uczogeyBzaG93TGFzdE9ubHk6IGZhbHNlIH0gfSk7XG5cbmxldCBEZW1vID0gY2xhc3MgRGVtbyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgLyogZXNsaW50IG5vLWNvbnNvbGU6IDAgKi9cbiAgICAgIC8vIGNvbnNvbGUubG9nKCdyZW5kZXJpbmcgRGVtbyBjb21wb25lbnQnKTtcbiAgICB9XG4gICAgY29uc3QgeyBsb2NhbGU6IHsgZGlyIH0gfSA9IHRoaXMucHJvcHM7XG4gICAgcmV0dXJuIChcbiAgICAgIDxBcHAgLz5cbiAgICApO1xuICB9XG59O1xuXG5EZW1vLnByb3BUeXBlcyA9IHtcbiAgbG9jYWxlOiBQcm9wVHlwZXMub2JqZWN0XG59O1xuXG5EZW1vID0gbG9jYWxlQXdhcmUoRGVtbyk7XG5cblJlYWN0RE9NLnJlbmRlcigoXG4gIDxEZW1vLz5cbiksIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZW1vJykpO1xuIiwiLyogIGVzbGludCBpbXBvcnQvcHJlZmVyLWRlZmF1bHQtZXhwb3J0OiAwICovXG5mdW5jdGlvbiB0b2dnbGVBcHBEaXIoZXZ0KSB7XG4gIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICBjb25zdCBkb2N1bWVudEVsZW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICBjb25zdCBjdXJyZW50RGlyID0gZG9jdW1lbnRFbGVtZW50LmdldEF0dHJpYnV0ZSgnZGlyJyk7XG4gIGNvbnN0IG5leHREaXIgPSBjdXJyZW50RGlyID09PSAnbHRyJyA/ICdydGwnIDogJ2x0cic7XG4gIGRvY3VtZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RpcicsIG5leHREaXIpO1xufVxuXG5leHBvcnQge1xuICB0b2dnbGVBcHBEaXJcbn07XG4iLCJcbndpbmRvdy5nZW5lcmF0ZUNvbXBvbmVudFByb3BlcnRpZXNUYWJsZSA9IGZ1bmN0aW9uIChkYXRhLCBzZWxlY3RvciA9ICcucHJvcGVydGllcycpIHtcbiAgY29uc3QgcHJvcGVydGllc0NvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICBjb25zdCBuYW1lcyA9IE9iamVjdC5rZXlzKGRhdGEpO1xuICBjb25zdCB0YWJsZSA9IGBcbjxoMyBjbGFzcz1cInNlY3Rpb25cIj5Qcm9wZXJ0aWVzPC9oMz5cbjx0YWJsZT5cbjx0aGVhZD5cbiAgPHRoIGNsYXNzPVwicHJvcC1uYW1lXCI+TmFtZTwvdGg+XG4gIDx0aCBjbGFzcz1cInByb3AtdHlwZVwiPlR5cGU8L3RoPlxuICA8dGggY2xhc3M9XCJwcm9wLWRlZmF1bHRcIj5EZWZhdWx0PC90aD5cbiAgPHRoIGNsYXNzPVwicHJvcC1kZXNjcmlwdGlvblwiPkRlc2NyaXB0aW9uPC90aD5cbjwvdGhlYWQ+XG48dGJvZHk+JHtcbiAgbmFtZXMubWFwKChuYW1lKSA9PiB7XG4gICAgcmV0dXJuIGA8dHI+XG4gICAgICAgICAgICAgIDx0ZCBjbGFzcz1cInByb3AtbmFtZVwiPiR7bmFtZX08L3RkPlxuICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJwcm9wLXR5cGVcIj4ke2RhdGFbbmFtZV0udHlwZX08L3RkPlxuICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJwcm9wLWRlZmF1bHRcIj48cHJlPiR7ZGF0YVtuYW1lXS5kZWZhdWx0fTwvcHJlPjwvdGQ+XG4gICAgICAgICAgICAgIDx0ZCBjbGFzcz1cInByb3AtZGVzY3JpcHRpb25cIj4ke2RhdGFbbmFtZV0uZGVzY3JpcHRpb259PC90ZD5cbiAgICAgICAgICAgIDwvdHI+YDtcbiAgfSkuam9pbignJylcbn08L3Rib2R5PlxuPC90YWJsZT5cbiAgICBgO1xuXG4gIHByb3BlcnRpZXNDb250YWluZXIuaW5uZXJIVE1MID0gdGFibGU7XG59O1xuXG4vLyBkZXBlbmRzIG9uIC50YWJzIHN0eWxlIGRlZmluZWQgaW4gZGVtb1NjcmVlbi5zY3NzXG53aW5kb3cubWFrZVRhYnMgPSBmdW5jdGlvbiAoKSB7XG4gIGxldCBncm9wQ291bnQgPSAxO1xuICBsZXQgaWRDb3VudCA9IDE7XG5cbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYnMnKS5mb3JFYWNoKCh0YWJzQmxvY2spID0+IHtcbiAgICBjb25zdCBmaXJzdFNlY3Rpb24gPSB0YWJzQmxvY2sucXVlcnlTZWxlY3Rvcignc2VjdGlvbicpO1xuXG4gICAgdGFic0Jsb2NrLnF1ZXJ5U2VsZWN0b3JBbGwoJ3NlY3Rpb24nKS5mb3JFYWNoKChzZWN0aW9uKSA9PiB7XG4gICAgICBjb25zdCBzZWN0aW9uTmFtZSA9IHNlY3Rpb24uZ2V0QXR0cmlidXRlKCd4LW5hbWUnKTtcbiAgICAgIGNvbnN0IGlzQ2hlY2tlZCA9IHNlY3Rpb24uZ2V0QXR0cmlidXRlKCd4LWNoZWNrZWQnKTtcbiAgICAgIGNvbnN0IGhpZ2hsaWdodCA9IHNlY3Rpb24uZ2V0QXR0cmlidXRlKCd4LWhpZ2hsaWdodCcpO1xuICAgICAgY29uc3QgY29udGVudCA9IHNlY3Rpb24uaW5uZXJIVE1MO1xuXG4gICAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG5cbiAgICAgIHNlY3Rpb24uaWQgPSBgY29udGVudC0ke2lkQ291bnR9YDtcbiAgICAgIGlmIChoaWdobGlnaHQpIHtcbiAgICAgICAgc2VjdGlvbi5pbm5lckhUTUwgPSBgPHByZT48Y29kZSBjbGFzcz1cIiR7aGlnaGxpZ2h0fVwiPiR7XG4gICAgICAgICAgY29udGVudFxuICAgICAgICB9PC9jb2RlPjwvcHJlPmA7XG4gICAgICB9XG5cbiAgICAgIGlucHV0LnR5cGUgPSAncmFkaW8nO1xuICAgICAgaW5wdXQubmFtZSA9IGBncm91cC0ke2dyb3BDb3VudH1gO1xuICAgICAgaW5wdXQuaWQgPSBgdGFiLSR7aWRDb3VudH1gO1xuICAgICAgaWYgKGlzQ2hlY2tlZCkge1xuICAgICAgICBpbnB1dC5jaGVja2VkID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgbGFiZWwuaHRtbEZvciA9IGlucHV0LmlkO1xuICAgICAgbGFiZWwuaW5uZXJUZXh0ID0gc2VjdGlvbk5hbWU7XG5cbiAgICAgIHRhYnNCbG9jay5pbnNlcnRCZWZvcmUoaW5wdXQsIGZpcnN0U2VjdGlvbik7XG4gICAgICB0YWJzQmxvY2suaW5zZXJ0QmVmb3JlKGxhYmVsLCBmaXJzdFNlY3Rpb24pO1xuXG4gICAgICBpZENvdW50ICs9IDE7XG4gICAgfSk7XG5cbiAgICBncm9wQ291bnQgKz0gMTtcbiAgfSk7XG59O1xuXG53aW5kb3cuaGlnaGxpZ2h0QmxvY2tzID0gZnVuY3Rpb24gKCkge1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdwcmUgY29kZS5odG1sJykuZm9yRWFjaCgoYmxvY2spID0+IHtcbiAgICAvLyBpZiBub3QgYWxyZWFkeSBlc2NhcGVkIChpbiB3aGljaCBjYXNlIGNvbnRhaW5zICcmbHQ7JykgKFJlYWN0IHN0cmluZyBzY2VuYXJpbylcbiAgICBpZiAoIWJsb2NrLmlubmVySFRNTC5pbmNsdWRlcygnJmx0OycpKSB7XG4gICAgICBibG9jay5pbm5lckhUTUwgPVxuICAgICAgYmxvY2suaW5uZXJIVE1MXG4gICAgICAgIC5yZXBsYWNlKC8mL2csICcmYW1wOycpXG4gICAgICAgIC5yZXBsYWNlKC88L2csICcmbHQ7JylcbiAgICAgICAgLnJlcGxhY2UoLz4vZywgJyZndDsnKVxuICAgICAgICAucmVwbGFjZSgvXCIvZywgJyZxdW90OycpXG4gICAgICAgIC5yZXBsYWNlKC8nL2csICcmIzAzOTsnKTtcbiAgICB9XG4gIH0pO1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdwcmUgY29kZScpLmZvckVhY2goKGJsb2NrKSA9PiB7XG4gICAgd2luZG93LmhsanMgJiYgd2luZG93LmhsanMuaGlnaGxpZ2h0QmxvY2soYmxvY2spO1xuICB9KTtcbn07XG5cbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IGxvY2FsZUF3YXJlIGZyb20gJy4uLy4uLy4uL3NyYy9saWIvSE9DL2xvY2FsZUF3YXJlJztcblxubGV0IElGcmFtZVNjcmVlbiA9IGNsYXNzIElGcmFtZVNjcmVlbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuaWZyYW1lTm9kZSA9IG51bGw7XG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xuICAgIGNvbnN0IHsgbG9jYWxlOiB7IGRpciB9IH0gPSBuZXh0UHJvcHM7XG4gICAgdGhpcy5pZnJhbWVOb2RlLmNvbnRlbnRXaW5kb3cucG9zdE1lc3NhZ2UoYGNoYW5nZURpciAke2Rpcn1gLCAnKicpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGlzUHJvZCA9ICF3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuaW5jbHVkZXMoJy5kZXYuJyk7XG4gICAgY29uc3Qgd2luZG93TG9jYXRpb25IYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2gucmVwbGFjZSgnIycsICcnKTtcbiAgICByZXR1cm4gKFxuICAgICAgPGlmcmFtZVxuICAgICAgICByZWY9eyhub2RlKSA9PiB0aGlzLmlmcmFtZU5vZGUgPSBub2RlfVxuICAgICAgICBzcmM9e2BzcmNEZW1vL3NjcmVlbnMvJHt3aW5kb3dMb2NhdGlvbkhhc2h9P3Byb2R1Y3Rpb249JHtpc1Byb2QgPyAnMScgOiAnMCd9YH0gLz5cbiAgICApO1xuICB9XG59O1xuSUZyYW1lU2NyZWVuLnByb3BUeXBlcyA9IHtcbiAgbG9jYWxlOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgIGRpcjogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBsYW5nOiBQcm9wVHlwZXMuc3RyaW5nXG4gIH0pXG59O1xuSUZyYW1lU2NyZWVuID0gbG9jYWxlQXdhcmUoSUZyYW1lU2NyZWVuKTtcblxuZXhwb3J0IGRlZmF1bHQgSUZyYW1lU2NyZWVuO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmNsYXNzIFByb3BlcnRpZXNUYWJsZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIC8vIHJlLXVzaW5nIHRoZSBoZWxwZXIgZGVmaW5lZCBmb3IgaUZyYW1lXG4gICAgd2luZG93LmdlbmVyYXRlQ29tcG9uZW50UHJvcGVydGllc1RhYmxlKHRoaXMucHJvcHMucHJvcGVydGllcyk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwicHJvcGVydGllc1wiIC8+O1xuICB9XG59XG5cblByb3BlcnRpZXNUYWJsZS5wcm9wVHlwZXMgPSB7XG4gIHByb3BlcnRpZXM6IFByb3BUeXBlcy5vYmplY3Rcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFByb3BlcnRpZXNUYWJsZTtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmNsYXNzIE9uU2NyZWVuQ29uc29sZVNjcmVlbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJkZW1vLXNjcmVlblwiPiB7IC8qIHN0YW5kYXJkIHRlbXBsYXRlIHJlcXVpcmVtZW50ICovIH1cbiAgICAgICAgPGgyIGNsYXNzTmFtZT1cInRpdGxlXCI+T24gU2NyZWVuIENvbnNvbGU8L2gyPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBPblNjcmVlbkNvbnNvbGVTY3JlZW47XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5jbGFzcyBVc2luZ0RldkJveFVJIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImRlbW8tc2NyZWVuXCI+IHsgLyogc3RhbmRhcmQgdGVtcGxhdGUgcmVxdWlyZW1lbnQgKi8gfVxuICAgICAgICA8aDIgY2xhc3NOYW1lPVwidGl0bGVcIj5Vc2luZyBEZXYgQm94IFVJPC9oMj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVXNpbmdEZXZCb3hVSTtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmNsYXNzIERCVUlXZWJDb21wb25lbnREdW1teVNjcmVlbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJkZW1vLXNjcmVlblwiPnsgLyogc3RhbmRhcmQgdGVtcGxhdGUgcmVxdWlyZW1lbnQgKi8gfVxuXG4gICAgICAgIDxkYnVpLXdlYi1jb21wb25lbnQtZHVtbXlcbiAgICAgICAgICBzdHlsZT17eyBjb2xvcjogJ2JsdWUnIH19XG4gICAgICAgID5cbiAgICAgICAgICA8c3Bhbj5oZWxsbyAxPC9zcGFuPlxuICAgICAgICA8L2RidWktd2ViLWNvbXBvbmVudC1kdW1teT5cblxuICAgICAgICA8ZGJ1aS13ZWItY29tcG9uZW50LWR1bW15XG4gICAgICAgICAgc3R5bGU9e3sgY29sb3I6ICdibHVlJyB9fVxuICAgICAgICA+XG4gICAgICAgICAgPHNwYW4+aGVsbG8gMjwvc3Bhbj5cbiAgICAgICAgPC9kYnVpLXdlYi1jb21wb25lbnQtZHVtbXk+XG4gICAgICAgIDxkYnVpLXdlYi1jb21wb25lbnQtZHVtbXktcGFyZW50PmhlbGxvIDM8L2RidWktd2ViLWNvbXBvbmVudC1kdW1teS1wYXJlbnQ+XG5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgREJVSVdlYkNvbXBvbmVudER1bW15U2NyZWVuO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7XG4gIERyYWdnYWJsZSwgRGlzYWJsZVNlbGVjdGlvblxufSBmcm9tICdkZXYtYm94LXVpJztcbmltcG9ydCBQcm9wZXJ0aWVzVGFibGUgZnJvbSAnLi4vLi4vaW50ZXJuYWxzL3JlYWN0Q29tcG9uZW50cy9Qcm9wZXJ0aWVzVGFibGUnO1xuXG5jbGFzcyBUb1JlbmRlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICAvLyBjb25zb2xlLmxvZygnVG9SZW5kZXIjcmVuZGVyJyk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgc3R5bGU9e3sgd2lkdGg6IDMwMCwgaGVpZ2h0OiAzMDAgfX1cbiAgICAgICAgb25Nb3VzZURvd249e3RoaXMucHJvcHMub25Nb3VzZURvd259XG4gICAgICAgIG9uTW91c2VVcD17dGhpcy5wcm9wcy5vbk1vdXNlVXB9XG4gICAgICAgIG9uQ2xpY2s9e3RoaXMucHJvcHMub25DbGlja31cbiAgICAgICAgb25Ub3VjaFN0YXJ0PXt0aGlzLnByb3BzLm9uVG91Y2hTdGFydH1cbiAgICAgICAgb25Ub3VjaEVuZD17dGhpcy5wcm9wcy5vblRvdWNoRW5kfVxuICAgICAgPlxuICAgICAgICA8cD5kcmFnZ2FibGUgcCB7dGhpcy5wcm9wcy5jb3VudGVyfSA8YSBocmVmPVwiaHR0cDovL2dvb2dsZS5jb21cIiB0YXJnZXQ9XCJfYmxhbmtcIj5saW5rPC9hPjwvcD5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuY2xhc3MgRHJhZ2dhYmxlU2NyZWVuIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5oYW5kbGVNb3VzZURvd24gPSB0aGlzLmhhbmRsZU1vdXNlRG93bi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlVG91Y2hTdGFydCA9IHRoaXMuaGFuZGxlVG91Y2hTdGFydC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlTW91c2VVcCA9IHRoaXMuaGFuZGxlTW91c2VVcC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlVG91Y2hFbmQgPSB0aGlzLmhhbmRsZVRvdWNoRW5kLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVDbGljayA9IHRoaXMuaGFuZGxlQ2xpY2suYmluZCh0aGlzKTtcblxuICAgIHRoaXMuY291bnRlciA9IDE7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGRyYWdnYWJsZUNvbnRlbnQ6IHRoaXMuZHJhZ2dhYmxlQ29udGVudFxuICAgIH07XG4gIH1cblxuICBnZXQgZHJhZ2dhYmxlQ29udGVudCgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFRvUmVuZGVyXG4gICAgICAgIG9uTW91c2VEb3duPXt0aGlzLmhhbmRsZU1vdXNlRG93bn1cbiAgICAgICAgb25Nb3VzZVVwPXt0aGlzLmhhbmRsZU1vdXNlVXB9XG4gICAgICAgIG9uVG91Y2hTdGFydD17dGhpcy5oYW5kbGVUb3VjaFN0YXJ0fVxuICAgICAgICBvblRvdWNoRW5kPXt0aGlzLmhhbmRsZVRvdWNoRW5kfVxuICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrfVxuICAgICAgICBjb3VudGVyPXt0aGlzLmNvdW50ZXJ9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICBoYW5kbGVNb3VzZURvd24oZXZ0KSB7XG4gICAgY29uc29sZS5sb2coJ0RyYWdnYWJsZVNjcmVlbiNoYW5kbGVNb3VzZURvd24nKTtcbiAgfVxuICBoYW5kbGVNb3VzZVVwKGV2dCkge1xuICAgIGNvbnNvbGUubG9nKCdEcmFnZ2FibGVTY3JlZW4jaGFuZGxlTW91c2VVcCcpO1xuICB9XG4gIGhhbmRsZVRvdWNoU3RhcnQoZXZ0KSB7XG4gICAgY29uc29sZS5sb2coJ0RyYWdnYWJsZVNjcmVlbiNoYW5kbGVUb3VjaFN0YXJ0Jyk7XG4gIH1cbiAgaGFuZGxlVG91Y2hFbmQoZXZ0KSB7XG4gICAgY29uc29sZS5sb2coJ0RyYWdnYWJsZVNjcmVlbiNoYW5kbGVUb3VjaEVuZCcpO1xuICB9XG4gIGhhbmRsZUNsaWNrKGV2dCkge1xuICAgIGNvbnNvbGUubG9nKCdEcmFnZ2FibGVTY3JlZW4jaGFuZGxlQ2xpY2snKTtcbiAgICAvLyB0aGlzLmNvdW50ZXIgPSB0aGlzLmNvdW50ZXIgKyAxO1xuICAgIC8vIHRoaXMuc2V0U3RhdGUoe1xuICAgIC8vICAgZHJhZ2dhYmxlQ29udGVudDogdGhpcy5kcmFnZ2FibGVDb250ZW50XG4gICAgLy8gfSk7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLl9tb3VudGVkID0gdHJ1ZTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmICghdGhpcy5fbW91bnRlZCkgcmV0dXJuO1xuICAgICAgdGhpcy5jb3VudGVyID0gdGhpcy5jb3VudGVyICsgMTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBkcmFnZ2FibGVDb250ZW50OiB0aGlzLmRyYWdnYWJsZUNvbnRlbnRcbiAgICAgIH0pO1xuICAgIH0sIDMwMDApO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5fbW91bnRlZCA9IGZhbHNlO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImRlbW8tc2NyZWVuXCI+IHsgLyogc3RhbmRhcmQgdGVtcGxhdGUgcmVxdWlyZW1lbnQgKi8gfVxuXG4gICAgICAgIDxoMiBjbGFzc05hbWU9XCJ0aXRsZVwiPkRyYWdnYWJsZSBSZWFjdCB7dGhpcy5jb3VudGVyfTwvaDI+XG5cbiAgICAgICAgPGgzIGNsYXNzTmFtZT1cInNlY3Rpb25cIj5TdHVmZiBPbmU8L2gzPlxuXG4gICAgICAgIDxwPmJlZm9yZSB0YWJzPC9wPlxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGFic1wiPlxuICAgICAgICAgIDxzZWN0aW9uIHgtbmFtZT1cIlJFU1VMVFwiIHgtY2hlY2tlZD1cIjFcIj5cbiAgICAgICAgICAgIDxEcmFnZ2FibGUgc3R5bGU9e3sgYm9yZGVyOiAnMXB4IHNvbGlkIGJsdWUnLCB3aWR0aDogMjAwLCBoZWlnaHQ6IDIwMCwgb3ZlcmZsb3dYOiAnc2Nyb2xsJywgb3ZlcmZsb3dZOiAnc2Nyb2xsJyB9fT5cbiAgICAgICAgICAgICAge3RoaXMuc3RhdGUuZHJhZ2dhYmxlQ29udGVudH1cbiAgICAgICAgICAgIDwvRHJhZ2dhYmxlPlxuICAgICAgICAgICAgPERpc2FibGVTZWxlY3Rpb24+XG4gICAgICAgICAgICAgIDxwPmRpc2FibGVkIHNlbGVjdGlvbjwvcD5cbiAgICAgICAgICAgIDwvRGlzYWJsZVNlbGVjdGlvbj5cbiAgICAgICAgICAgIHtBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMCB9KS5tYXAoKGVsLCBpKSA9PiA8cCBrZXk9e2l9PntpfSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS08L3A+KX1cbiAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgICAgPHNlY3Rpb24geC1uYW1lPVwiSFRNTFwiIHgtaGlnaGxpZ2h0PVwiaHRtbFwiPntgXG48cD5kcmFnZ2FibGU8L3A+XG48c3Bhbj5yZWFjdDwvc3Bhbj5cbiAgICAgICAgICBgfVxuICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgICA8c2VjdGlvbiB4LW5hbWU9XCJDU1NcIiB4LWhpZ2hsaWdodD1cImNzc1wiPntgXG5ib2R5IHtcbiAgY29sb3I6IHJlZDtcbn1cbiAgICAgICAgICBgfVxuICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgICA8c2VjdGlvbiB4LW5hbWU9XCJKU1wiIHgtaGlnaGxpZ2h0PVwiamF2YXNjcmlwdFwiPntgXG5jbGFzcyBDYXIgZXh0ZW5kcyBTdXBlckNsYXNzIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIG9uSW5pdCgpIHtcbiAgICB0aGlzLmRvKCgpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKHByaW50KTtcbiAgICB9KTtcbiAgfVxufVxuICAgICAgICAgIGB9XG4gICAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8cD5iZXR3ZWVuIHRhYnM8L3A+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0YWJzXCI+XG4gICAgICAgICAgPHNlY3Rpb24geC1uYW1lPVwiQ1NTXCIgeC1oaWdobGlnaHQ9XCJjc3NcIj57YFxuYm9keSB7XG4gIGNvbG9yOiByZWQ7XG59XG4gICAgICAgICAgYH1cbiAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgICAgPHNlY3Rpb24geC1uYW1lPVwiSlNcIiB4LWhpZ2hsaWdodD1cImphdmFzY3JpcHRcIiB4LWNoZWNrZWQ9XCIxXCI+e2BcbmNsYXNzIENhciBleHRlbmRzIFN1cGVyQ2xhc3Mge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgb25Jbml0KCkge1xuICAgIHRoaXMuZG8oKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2cocHJpbnQpO1xuICAgIH0pO1xuICB9XG59XG4gICAgICAgICAgYH1cbiAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxQcm9wZXJ0aWVzVGFibGUgcHJvcGVydGllcz17e1xuICAgICAgICAgIHByb3BlcnR5T25lOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6ICd2YWx1ZSAxJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnZGVzY3JpcHRpb24gb25lJ1xuICAgIH0sXG4gICAgcHJvcGVydHlUd286IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgZGVmYXVsdDogJzUnLFxuICAgICAgZGVzY3JpcHRpb246ICdkZXNjcmlwdGlvbiB0d28nXG4gICAgfVxuICAgICAgICB9fSAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBEcmFnZ2FibGVTY3JlZW47XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtcbiAgRm9ybUlucHV0TnVtYmVyXG59IGZyb20gJ2Rldi1ib3gtdWknO1xuXG5cbmNsYXNzIEZvcm1JbnB1dE51bWJlclNjcmVlbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBpbnB1dFZhbHVlOiAtNy4wOFxuICAgIH07XG4gICAgdGhpcy5oYW5kbGVDaGFuZ2UgPSB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaGFuZGxlQ2hhbmdlKGlucHV0VmFsdWUpIHtcbiAgICBjb25zdCB2YWx1ZVRvU2VuZEJhY2sgPSBOdW1iZXIoaW5wdXRWYWx1ZS50b1ByZWNpc2lvbigxNikpO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaW5wdXRWYWx1ZTogdmFsdWVUb1NlbmRCYWNrXG4gICAgfSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGVtby1zY3JlZW5cIj4geyAvKiBzdGFuZGFyZCB0ZW1wbGF0ZSByZXF1aXJlbWVudCAqLyB9XG4gICAgICAgIDxwcmU+PGNvZGUgY2xhc3NOYW1lPVwiaHRtbFwiPlxuICAgICAgICAgIHtgXG4gICAgICAgICAgICA8cD5mb3JtIGlucHV0IG51bWJlcjwvcD5cbiAgICAgICAgICAgIDxzcGFuPnJlYWN0PC9zcGFuPlxuICAgICAgICAgIGB9XG4gICAgICAgIDwvY29kZT48L3ByZT5cbiAgICAgICAgPHByZT48Y29kZSBjbGFzc05hbWU9XCJqYXZhc2NyaXB0XCI+XG4gICAgICAgICAge2BcbiAgICAgICAgICAgIGNsYXNzIE1hY2hpbmUgZXh0ZW5kcyBTdXBlckNsYXNzIHtcbiAgICAgICAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIG9uSW5pdCgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRvKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHByaW50KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIGB9XG4gICAgICAgIDwvY29kZT48L3ByZT5cbiAgICAgICAgPHByZT48Y29kZSBjbGFzc05hbWU9XCJjc3NcIj5cbiAgICAgICAgICB7YFxuICAgICAgICAgICAgaHRtbFtkaXI9bHRyXSB7XG4gICAgICAgICAgICAgIGNvbG9yOiByZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgYH1cbiAgICAgICAgPC9jb2RlPjwvcHJlPlxuICAgICAgICA8Rm9ybUlucHV0TnVtYmVyXG4gICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUuaW5wdXRWYWx1ZX1cbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9XG4gICAgICAgICAgZGVmYXVsdERlY1BvaW50PVwiLFwiXG4gICAgICAgICAgZGVmYXVsdFRob3VzYW5kc1NlcGFyYXRvcj1cIi5cIlxuICAgICAgICAvPlxuICAgICAgICA8Rm9ybUlucHV0TnVtYmVyXG4gICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUuaW5wdXRWYWx1ZX1cbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9XG4gICAgICAgIC8+XG4gICAgICAgIDxwPnt0aGlzLnN0YXRlLmlucHV0VmFsdWV9eydcXHUwMEEwJ308L3A+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEZvcm1JbnB1dE51bWJlclNjcmVlbjtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1xuICBGb3JtSW5wdXRcbn0gZnJvbSAnZGV2LWJveC11aSc7XG5cblxuY2xhc3MgRm9ybUlucHV0U2NyZWVuIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGlucHV0VmFsdWU6IDZcbiAgICB9O1xuICAgIHRoaXMuaGFuZGxlQ2hhbmdlID0gdGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGhhbmRsZUNoYW5nZShpbnB1dFZhbHVlKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpbnB1dFZhbHVlXG4gICAgfSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGVtby1zY3JlZW5cIj4geyAvKiBzdGFuZGFyZCB0ZW1wbGF0ZSByZXF1aXJlbWVudCAqLyB9XG4gICAgICAgIDxGb3JtSW5wdXRcbiAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS5pbnB1dFZhbHVlfVxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX1cbiAgICAgICAgICBoYXNXYXJuaW5nPXtmYWxzZX1cbiAgICAgICAgICBoYXNFcnJvcj17ZmFsc2V9XG4gICAgICAgICAgZGlzYWJsZWQ9e2ZhbHNlfVxuICAgICAgICAvPlxuICAgICAgICA8cD57dGhpcy5zdGF0ZS5pbnB1dFZhbHVlfXsnXFx1MDBBMCd9PC9wPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBGb3JtSW5wdXRTY3JlZW47XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtcbiAgSGVsbG9cbn0gZnJvbSAnZGV2LWJveC11aSc7XG5cbmNsYXNzIEhlbGxvU2NyZWVuIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAvKiBlc2xpbnQgbm8tY29uc29sZTogMCAqL1xuICAgICAgLy8gY29uc29sZS5sb2coJ3JlbmRlcmluZyBIZWxsb1NjcmVlbiBjb21wb25lbnQnKTtcbiAgICB9XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGVtby1zY3JlZW5cIj4geyAvKiBzdGFuZGFyZCB0ZW1wbGF0ZSByZXF1aXJlbWVudCAqLyB9XG4gICAgICAgIDxIZWxsbyAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBIZWxsb1NjcmVlbjtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1xuICBMaXN0XG59IGZyb20gJ2Rldi1ib3gtdWknO1xuXG5jbGFzcyBMaXN0U2NyZWVuIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImRlbW8tc2NyZWVuXCI+IHsgLyogc3RhbmRhcmQgdGVtcGxhdGUgcmVxdWlyZW1lbnQgKi8gfVxuICAgICAgICA8TGlzdCBpdGVtcz17Wyd0aHJlZScsICdmb3VyJ119Lz5cbiAgICAgICAgPExpc3QgaXRlbXM9e1sndGhyZWUnLCAnZm91ciddfS8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExpc3RTY3JlZW47XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5jbGFzcyBMb2NhbGVTZXJ2aWNlU2NyZWVuIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImRlbW8tc2NyZWVuXCI+IHsgLyogc3RhbmRhcmQgdGVtcGxhdGUgcmVxdWlyZW1lbnQgKi8gfVxuICAgICAgICA8aDIgY2xhc3NOYW1lPVwidGl0bGVcIj5Mb2NhbGUgU2VydmljZTwvaDI+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExvY2FsZVNlcnZpY2VTY3JlZW47XG4iLCIvLyBHZW5lcmFsXG5pbXBvcnQgVXNpbmdEZXZCb3hVSVNjcmVlbiBmcm9tICcuL0dlbmVyYWwvVXNpbmdEZXZCb3hVSVNjcmVlbic7XG5cbi8vIFNlcnZpY2VzXG5pbXBvcnQgTG9jYWxlU2VydmljZVNjcmVlbiBmcm9tICcuL1NlcnZpY2VzL0xvY2FsZVNlcnZpY2VTY3JlZW4nO1xuXG4vLyBSZWFjdCBDb21wb25lbnRzXG5pbXBvcnQgSGVsbG9TY3JlZW4gZnJvbSAnLi9SZWFjdENvbXBvbmVudHMvSGVsbG9TY3JlZW4nO1xuaW1wb3J0IExpc3RTY3JlZW4gZnJvbSAnLi9SZWFjdENvbXBvbmVudHMvTGlzdFNjcmVlbic7XG5pbXBvcnQgRm9ybUlucHV0U2NyZWVuIGZyb20gJy4vUmVhY3RDb21wb25lbnRzL0Zvcm1JbnB1dFNjcmVlbic7XG5pbXBvcnQgRm9ybUlucHV0TnVtYmVyU2NyZWVuIGZyb20gJy4vUmVhY3RDb21wb25lbnRzL0Zvcm1JbnB1dE51bWJlclNjcmVlbic7XG5pbXBvcnQgRHJhZ2dhYmxlU2NyZWVuIGZyb20gJy4vUmVhY3RDb21wb25lbnRzL0RyYWdnYWJsZVNjcmVlbic7XG5pbXBvcnQgREJVSVdlYkNvbXBvbmVudER1bW15U2NyZWVuIGZyb20gJy4vUmVhY3RDb21wb25lbnRzL0RCVUlXZWJDb21wb25lbnREdW1teVNjcmVlbic7XG5cbi8vIERlYnVnXG5pbXBvcnQgT25TY3JlZW5Db25zb2xlU2NyZWVuIGZyb20gJy4vRGVidWcvT25TY3JlZW5Db25zb2xlU2NyZWVuJztcblxuY29uc3Qgc2NyZWVucyA9IHtcbiAgLy8gR2VuZXJhbFxuICBVc2luZ0RldkJveFVJU2NyZWVuLFxuXG4gIC8vIFNlcnZpY2VzXG4gIExvY2FsZVNlcnZpY2VTY3JlZW4sXG5cbiAgLy8gQ29tcG9uZW50c1xuICBIZWxsb1NjcmVlbixcbiAgTGlzdFNjcmVlbixcbiAgRm9ybUlucHV0U2NyZWVuLFxuICBGb3JtSW5wdXROdW1iZXJTY3JlZW4sXG4gIERyYWdnYWJsZVNjcmVlbixcbiAgREJVSVdlYkNvbXBvbmVudER1bW15U2NyZWVuLFxuXG4gIC8vIERlYnVnXG4gIE9uU2NyZWVuQ29uc29sZVNjcmVlblxufTtcblxuLypcblRoZSByZWFsIHBhdGggbWF0dGVycyBvbmx5IGZvciAuaHRtbCBzY3JlZW5zIGFzIHRoZXkgYXJlIGxvYWRlZCBpbnRvIGFuIGlGcmFtZS5cblJlYWN0IHNjcmVlbnMgcGF0aCBuZWVkcyB0byBiZSB0aGUgc2FtZSBhcyBpbXBvcnRlZCByZWFjdCBjb21wb25lbnQuXG4qL1xuY29uc3Qgc2NyZWVuTGlua3NHZW4gPSBbXG4gIHtcbiAgICB0aXRsZTogJ0dlbmVyYWwnLFxuICAgIGxpbmtzOiBbXG4gICAgICB7IHBhdGg6ICdVc2luZ0RldkJveFVJU2NyZWVuJywgdGl0bGU6ICdVc2luZyBEZXYgQm94IFVJJyB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgdGl0bGU6ICdTZXJ2aWNlcycsXG4gICAgbGlua3M6IFtcbiAgICAgIHsgcGF0aDogJ0xvY2FsZVNlcnZpY2VTY3JlZW4nLCB0aXRsZTogJ0xvY2FsZScgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgIHRpdGxlOiAnV2ViIENvbXBvbmVudHMnLFxuICAgIGxpbmtzOiBbXG4gICAgICB7IHBhdGg6ICdXZWJDb21wb25lbnRzU2NyZWVucy9EQlVJV2ViQ29tcG9uZW50RHVtbXlTY3JlZW4uaHRtbCcsIHRpdGxlOiAnRHVtbXknIH0sXG4gICAgICB7IHBhdGg6ICdXZWJDb21wb25lbnRzU2NyZWVucy9EQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnRTY3JlZW4uaHRtbCcsIHRpdGxlOiAnRHVtbXkgUGFyZW50JyB9LFxuICAgIF1cbiAgfSxcbiAge1xuICAgIHRpdGxlOiAnUmVhY3QgQ29tcG9uZW50cycsXG4gICAgbGlua3M6IFtcbiAgICAgIHsgcGF0aDogJ0hlbGxvU2NyZWVuJywgdGl0bGU6ICdIZWxsbycgfSxcbiAgICAgIHsgcGF0aDogJ0xpc3RTY3JlZW4nLCB0aXRsZTogJ0xpc3QnIH0sXG4gICAgICB7IHBhdGg6ICdGb3JtSW5wdXRTY3JlZW4nLCB0aXRsZTogJ0Zvcm0gSW5wdXQnIH0sXG4gICAgICB7IHBhdGg6ICdGb3JtSW5wdXROdW1iZXJTY3JlZW4nLCB0aXRsZTogJ0Zvcm0gSW5wdXQgTnVtYmVyJyB9LFxuICAgICAgeyBwYXRoOiAnRHJhZ2dhYmxlU2NyZWVuJywgdGl0bGU6ICdEcmFnZ2FibGUnIH0sXG4gICAgICB7IHBhdGg6ICdEQlVJV2ViQ29tcG9uZW50RHVtbXlTY3JlZW4nLCB0aXRsZTogJ0R1bW15JyB9LFxuICAgIF1cbiAgfSxcbiAge1xuICAgIHRpdGxlOiAnRGVidWcnLFxuICAgIGxpbmtzOiBbXG4gICAgICB7IHBhdGg6ICdPblNjcmVlbkNvbnNvbGVTY3JlZW4nLCB0aXRsZTogJ09uIFNjcmVlbiBDb25zb2xlJyB9LFxuICAgIF1cbiAgfVxuXTtcblxuZXhwb3J0IHtcbiAgc2NyZWVucyxcbiAgc2NyZWVuTGlua3NHZW5cbn07XG4iXX0=
