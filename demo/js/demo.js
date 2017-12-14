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
exports.default = getDBUWebComponentBase;

var _LocaleService = require('../../services/LocaleService');

var _LocaleService2 = _interopRequireDefault(_LocaleService);

var _ensureSingleRegistration = require('../internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const registrationName = 'DBUWebComponentBase';

function getDBUWebComponentBase(win) {
  return (0, _ensureSingleRegistration2.default)(win, registrationName, () => {
    const { document, HTMLElement, customElements } = win;

    const template = document.createElement('template');
    template.innerHTML = '<style></style><slot></slot>';

    class DBUWebComponentBase extends HTMLElement {

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
        const componentStyle = ((win.DBUWebComponents || {})[registrationName] || {}).componentStyle;
        if (componentStyle) {
          klass.componentStyle += componentStyle;
        }
        // Do registration
        customElements.define(registrationName, klass);
        return registrationName;
      };
    }

    return {
      DBUWebComponentBase,
      defineCommonStaticMethods
    };
  });
}

},{"../../services/LocaleService":8,"../internals/ensureSingleRegistration":14}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDBUWebComponentDummy;

var _DBUWebComponentBase = require('../DBUWebComponentBase/DBUWebComponentBase');

var _DBUWebComponentBase2 = _interopRequireDefault(_DBUWebComponentBase);

var _ensureSingleRegistration = require('../internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const registrationName = 'dbu-web-component-dummy';

function getDBUWebComponentDummy(win) {
  return (0, _ensureSingleRegistration2.default)(win, registrationName, () => {
    const { DBUWebComponentBase, defineCommonStaticMethods } = (0, _DBUWebComponentBase2.default)(win);
    const { document } = win;

    const template = document.createElement('template');
    template.innerHTML = `
      <style>
      :host {
        display: inline-block;
        width: 100%;
        max-width: 400px;
        height: 50px;
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

    class DBUWebComponentDummy extends DBUWebComponentBase {
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

    defineCommonStaticMethods(DBUWebComponentDummy);

    return DBUWebComponentDummy;
  });
}

getDBUWebComponentDummy.registrationName = registrationName;

},{"../DBUWebComponentBase/DBUWebComponentBase":9,"../internals/ensureSingleRegistration":14}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDBUWebComponentDummyParent;

var _DBUWebComponentBase = require('../DBUWebComponentBase/DBUWebComponentBase');

var _DBUWebComponentBase2 = _interopRequireDefault(_DBUWebComponentBase);

var _DBUWebComponentDummy = require('../DBUWebComponentDummy/DBUWebComponentDummy');

var _DBUWebComponentDummy2 = _interopRequireDefault(_DBUWebComponentDummy);

var _ensureSingleRegistration = require('../internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const registrationName = 'dbu-web-component-dummy-parent';

function getDBUWebComponentDummyParent(win) {
  return (0, _ensureSingleRegistration2.default)(win, registrationName, () => {
    const { DBUWebComponentBase, defineCommonStaticMethods } = (0, _DBUWebComponentBase2.default)(win);
    const DBUWebComponentDummy = (0, _DBUWebComponentDummy2.default)(win);

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
          <dbu-web-component-dummy><slot></slot></dbu-web-component-dummy>
        </div>
      </div>
    `;

    class DBUWebComponentDummyParent extends DBUWebComponentBase {
      static get registrationName() {
        return registrationName;
      }

      static get template() {
        return template;
      }

      static get dependencies() {
        return [DBUWebComponentDummy];
      }

    }

    defineCommonStaticMethods(DBUWebComponentDummyParent);

    return DBUWebComponentDummyParent;
  });
}

getDBUWebComponentDummyParent.registrationName = registrationName;

},{"../DBUWebComponentBase/DBUWebComponentBase":9,"../DBUWebComponentDummy/DBUWebComponentDummy":10,"../internals/ensureSingleRegistration":14}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = dbuWebComponentsSetUp;

var _appendStyle = require('../internals/appendStyle');

var _appendStyle2 = _interopRequireDefault(_appendStyle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function dbuWebComponentsSetUp(win) {
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
DBUWebComponentBase (from which all web-components inherit)
will read componentStyle from win.DBUWebComponents
when klass.registerSelf() is called giving a chance to override default web-component style
just before it is registered.
*/
const appendStyle = win => (registrationName, componentStyle) => {
  if (!win.DBUWebComponents) {
    win.DBUWebComponents = {};
  }
  win.DBUWebComponents = Object.assign({}, win.DBUWebComponents, {
    [registrationName]: Object.assign({}, win.DBUWebComponents[registrationName], {
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
  if (!win.DBUWebComponents) {
    win.DBUWebComponents = { registrations: {} };
  } else if (!win.DBUWebComponents.registrations) {
    win.DBUWebComponents.registrations = {};
  }

  let registration = win.DBUWebComponents.registrations[name];

  if (registration) return registration;

  registration = callback();
  win.DBUWebComponents.registrations[name] = registration;

  return win.DBUWebComponents.registrations[name];
}

},{}],15:[function(require,module,exports){
(function (process){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _markGithub = require('react-icons/lib/go/mark-github');

var _markGithub2 = _interopRequireDefault(_markGithub);

var _threeBars = require('react-icons/lib/go/three-bars');

var _threeBars2 = _interopRequireDefault(_threeBars);

var _screens = require('./screens');

var _localeAware = require('../src/lib/HOC/localeAware');

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

class App extends _react2.default.Component {
  componentDidMount() {
    window.addEventListener('hashchange', this.onHashChange.bind(this));
  }

  onHashChange() {
    this.forceUpdate();
  }

  toggleAppDir(evt) {
    evt.preventDefault();
    const documentElement = window.document.documentElement;
    const currentDir = documentElement.getAttribute('dir');
    const nextDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
    documentElement.setAttribute('dir', nextDir);
  }

  render() {
    if (process.env.NODE_ENV !== 'production') {
      /* eslint no-console: 0 */
      // console.log('rendering App component');
    }
    const screensKeys = Object.keys(_screens.screens);
    const links = _react2.default.createElement(
      'ul',
      null,
      screensKeys.map((screen, idx) => _react2.default.createElement(
        'li',
        { key: idx },
        _react2.default.createElement(
          'a',
          { key: idx, href: `#${screen}` },
          _screens.screenLinkNames[screen] || screen
        )
      ))
    );

    const windowLocationHash = (window.location.hash || `#${screensKeys[0]}`).replace('#', '');
    const Screen = windowLocationHash.endsWith('.html') ? IFrameScreen : _screens.screens[windowLocationHash];

    if (!Screen) {
      return null;
    }

    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'div',
        { className: 'page-header' },
        _react2.default.createElement(
          'h2',
          null,
          'Dev Box UI'
        ),
        _react2.default.createElement(
          'a',
          {
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
          { id: 'links-toggle-label', htmlFor: 'links-toggle' },
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
              { href: '#', onClick: this.toggleAppDir },
              'Toggle Locale Dir'
            )
          ),
          links,
          links,
          links,
          links,
          links,
          links,
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

},{"../src/lib/HOC/localeAware":6,"./screens":23,"_process":2,"prop-types":"prop-types","react":"react","react-icons/lib/go/mark-github":4,"react-icons/lib/go/three-bars":5}],16:[function(require,module,exports){
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

var _DBUWebComponentsSetup = require('../src/lib/webcomponents/DBUWebComponentsSetup/DBUWebComponentsSetup');

var _DBUWebComponentsSetup2 = _interopRequireDefault(_DBUWebComponentsSetup);

var _DBUWebComponentDummy = require('../src/lib/webcomponents/DBUWebComponentDummy/DBUWebComponentDummy');

var _DBUWebComponentDummy2 = _interopRequireDefault(_DBUWebComponentDummy);

var _DBUWebComponentDummyParent = require('../src/lib/webcomponents/DBUWebComponentDummyParent/DBUWebComponentDummyParent');

var _DBUWebComponentDummyParent2 = _interopRequireDefault(_DBUWebComponentDummyParent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _DBUWebComponentsSetup2.default)(window).appendStyle('dbu-web-component-dummy', `
  b {
    color: deepskyblue;
    font-style: oblique;
  }
`);

// import getDBUWebComponentDummy from '../build/src/lib/webcomponents/DBUWebComponentDummy/DBUWebComponentDummy';
// import getDBUWebComponentDummyParent from '../build/src/lib/webcomponents/DBUWebComponentDummyParent/DBUWebComponentDummyParent';


const DBUWebComponentDummy = (0, _DBUWebComponentDummy2.default)(window);
const DBUWebComponentDummyParent = (0, _DBUWebComponentDummyParent2.default)(window);

setTimeout(() => {
  DBUWebComponentDummy.registerSelf();
  DBUWebComponentDummyParent.registerSelf();
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
      <dbu-web-component-dummy
        style="color: blue"
      >
        <span>hello world 3</span>
      </dbu-web-component-dummy>
      <dbu-web-component-dummy-parent></dbu-web-component-dummy-parent>
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

  (0, _DBUWebComponentsSetup2.default)(target.contentWindow).appendStyle('dbu-web-component-dummy', `
    b {
      font-style: oblique;
      opacity: 0.5;
    }
  `);
  const DBUWebComponentDummy2 = (0, _DBUWebComponentDummy2.default)(target.contentWindow);
  const DBUWebComponentDummyParent2 = (0, _DBUWebComponentDummyParent2.default)(target.contentWindow);
  setTimeout(() => {
    DBUWebComponentDummy2.registerSelf();
    DBUWebComponentDummyParent2.registerSelf();

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

},{"../src/lib/webcomponents/DBUWebComponentDummy/DBUWebComponentDummy":10,"../src/lib/webcomponents/DBUWebComponentDummyParent/DBUWebComponentDummyParent":11,"../src/lib/webcomponents/DBUWebComponentsSetup/DBUWebComponentsSetup":12,"./app":15,"_process":2,"dev-box-ui":"dev-box-ui","prop-types":"prop-types","react":"react","react-dom":"react-dom"}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class DBUWebComponentDummyScreen extends _react2.default.Component {
  render() {
    return _react2.default.createElement(
      'div',
      { className: 'demo-screen' },
      _react2.default.createElement(
        'dbu-web-component-dummy',
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
        'dbu-web-component-dummy',
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
        'dbu-web-component-dummy-parent',
        null,
        'hello 3'
      )
    );
  }
}

exports.default = DBUWebComponentDummyScreen;

},{"react":"react"}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _devBoxUi = require('dev-box-ui');

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
    setTimeout(() => {
      this.counter = this.counter + 1;
      this.setState({
        draggableContent: this.draggableContent
      });
    }, 3000);
  }

  render() {
    return _react2.default.createElement(
      'div',
      { className: 'demo-screen' },
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
    );
  }
}

exports.default = DraggableScreen;

},{"dev-box-ui":"dev-box-ui","react":"react"}],19:[function(require,module,exports){
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

},{"dev-box-ui":"dev-box-ui","react":"react"}],20:[function(require,module,exports){
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

},{"dev-box-ui":"dev-box-ui","react":"react"}],21:[function(require,module,exports){
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
      _react2.default.createElement(_devBoxUi.Hello, null)
    );
  }
}

exports.default = HelloScreen;

}).call(this,require('_process'))

},{"_process":2,"dev-box-ui":"dev-box-ui","react":"react"}],22:[function(require,module,exports){
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
      _react2.default.createElement(_devBoxUi.List, { items: ['three', 'four'] }),
      _react2.default.createElement(_devBoxUi.List, { items: ['three', 'four'] })
    );
  }
}

exports.default = ListScreen;

},{"dev-box-ui":"dev-box-ui","react":"react"}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.screenLinkNames = exports.screens = undefined;

var _HelloScreen = require('./HelloScreen');

var _HelloScreen2 = _interopRequireDefault(_HelloScreen);

var _ListScreen = require('./ListScreen');

var _ListScreen2 = _interopRequireDefault(_ListScreen);

var _FormInputScreen = require('./FormInputScreen');

var _FormInputScreen2 = _interopRequireDefault(_FormInputScreen);

var _FormInputNumberScreen = require('./FormInputNumberScreen');

var _FormInputNumberScreen2 = _interopRequireDefault(_FormInputNumberScreen);

var _DraggableScreen = require('./DraggableScreen');

var _DraggableScreen2 = _interopRequireDefault(_DraggableScreen);

var _DBUWebComponentDummyScreen = require('./DBUWebComponentDummyScreen');

var _DBUWebComponentDummyScreen2 = _interopRequireDefault(_DBUWebComponentDummyScreen);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const screens = {
  HelloScreen: _HelloScreen2.default,
  ListScreen: _ListScreen2.default,
  FormInputScreen: _FormInputScreen2.default,
  FormInputNumberScreen: _FormInputNumberScreen2.default,
  Draggable: _DraggableScreen2.default,
  DBUWebComponentDummyScreen: _DBUWebComponentDummyScreen2.default,
  'DBUWebComponentDummyScreen.html': null,
  'DBUWebComponentDummyParentScreen.html': null
};

const screenLinkNames = {
  HelloScreen: 'Hello - React',
  ListScreen: 'List - React',
  FormInputScreen: 'Form Input - React',
  FormInputNumberScreen: 'Form Input Number - React',
  Draggable: 'Draggable - React',
  DBUWebComponentDummyScreen: 'Dummy - React',
  'DBUWebComponentDummyScreen.html': 'Dummy - Web Component',
  'DBUWebComponentDummyParentScreen.html': 'Dummy Parent - Web Component'
};

exports.screens = screens;
exports.screenLinkNames = screenLinkNames;

},{"./DBUWebComponentDummyScreen":17,"./DraggableScreen":18,"./FormInputNumberScreen":19,"./FormInputScreen":20,"./HelloScreen":21,"./ListScreen":22}]},{},[16])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvaG9pc3Qtbm9uLXJlYWN0LXN0YXRpY3MvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LWljb24tYmFzZS9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVhY3QtaWNvbnMvbGliL2dvL21hcmstZ2l0aHViLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LWljb25zL2xpYi9nby90aHJlZS1iYXJzLmpzIiwic3JjL2xpYi9IT0MvbG9jYWxlQXdhcmUuanMiLCJzcmMvbGliL3NlcnZpY2VzL0kxOG5TZXJ2aWNlLmpzIiwic3JjL2xpYi9zZXJ2aWNlcy9Mb2NhbGVTZXJ2aWNlLmpzIiwic3JjL2xpYi93ZWJjb21wb25lbnRzL0RCVVdlYkNvbXBvbmVudEJhc2UvREJVV2ViQ29tcG9uZW50QmFzZS5qcyIsInNyYy9saWIvd2ViY29tcG9uZW50cy9EQlVXZWJDb21wb25lbnREdW1teS9EQlVXZWJDb21wb25lbnREdW1teS5qcyIsInNyYy9saWIvd2ViY29tcG9uZW50cy9EQlVXZWJDb21wb25lbnREdW1teVBhcmVudC9EQlVXZWJDb21wb25lbnREdW1teVBhcmVudC5qcyIsInNyYy9saWIvd2ViY29tcG9uZW50cy9EQlVXZWJDb21wb25lbnRzU2V0dXAvREJVV2ViQ29tcG9uZW50c1NldHVwLmpzIiwic3JjL2xpYi93ZWJjb21wb25lbnRzL2ludGVybmFscy9hcHBlbmRTdHlsZS5qcyIsInNyYy9saWIvd2ViY29tcG9uZW50cy9pbnRlcm5hbHMvZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uLmpzIiwic3JjRGVtby9hcHAuanMiLCJzcmNEZW1vL2RlbW8uanMiLCJzcmNEZW1vL3NjcmVlbnMvREJVV2ViQ29tcG9uZW50RHVtbXlTY3JlZW4uanMiLCJzcmNEZW1vL3NjcmVlbnMvRHJhZ2dhYmxlU2NyZWVuLmpzIiwic3JjRGVtby9zY3JlZW5zL0Zvcm1JbnB1dE51bWJlclNjcmVlbi5qcyIsInNyY0RlbW8vc2NyZWVucy9Gb3JtSW5wdXRTY3JlZW4uanMiLCJzcmNEZW1vL3NjcmVlbnMvSGVsbG9TY3JlZW4uanMiLCJzcmNEZW1vL3NjcmVlbnMvTGlzdFNjcmVlbi5qcyIsInNyY0RlbW8vc2NyZWVucy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFD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O0FBQ0E7Ozs7QUFJQSxNQUFNLFVBQU4sU0FBeUIsZ0JBQU0sU0FBL0IsQ0FBeUM7QUFDdkMsV0FBUztBQUNQLFdBQ0U7QUFBQTtBQUFBLFFBQUssV0FBVSxhQUFmO0FBQ0Usc0RBQU0sT0FBTyxDQUFDLE9BQUQsRUFBVSxNQUFWLENBQWIsR0FERjtBQUVFLHNEQUFNLE9BQU8sQ0FBQyxPQUFELEVBQVUsTUFBVixDQUFiO0FBRkYsS0FERjtBQU1EO0FBUnNDOztrQkFXMUIsVTs7Ozs7Ozs7OztBQ2hCZjs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUdBLE1BQU0sVUFBVTtBQUNkLG9DQURjO0FBRWQsa0NBRmM7QUFHZCw0Q0FIYztBQUlkLHdEQUpjO0FBS2Qsc0NBTGM7QUFNZCxrRUFOYztBQU9kLHFDQUFtQyxJQVByQjtBQVFkLDJDQUF5QztBQVIzQixDQUFoQjs7QUFXQSxNQUFNLGtCQUFrQjtBQUN0QixlQUFhLGVBRFM7QUFFdEIsY0FBWSxjQUZVO0FBR3RCLG1CQUFpQixvQkFISztBQUl0Qix5QkFBdUIsMkJBSkQ7QUFLdEIsYUFBVyxtQkFMVztBQU10Qiw4QkFBNEIsZUFOTjtBQU90QixxQ0FBbUMsdUJBUGI7QUFRdEIsMkNBQXlDO0FBUm5CLENBQXhCOztRQVlFLE8sR0FBQSxPO1FBQ0EsZSxHQUFBLGUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNSwgWWFob28hIEluYy5cbiAqIENvcHlyaWdodHMgbGljZW5zZWQgdW5kZXIgdGhlIE5ldyBCU0QgTGljZW5zZS4gU2VlIHRoZSBhY2NvbXBhbnlpbmcgTElDRU5TRSBmaWxlIGZvciB0ZXJtcy5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUkVBQ1RfU1RBVElDUyA9IHtcbiAgICBjaGlsZENvbnRleHRUeXBlczogdHJ1ZSxcbiAgICBjb250ZXh0VHlwZXM6IHRydWUsXG4gICAgZGVmYXVsdFByb3BzOiB0cnVlLFxuICAgIGRpc3BsYXlOYW1lOiB0cnVlLFxuICAgIGdldERlZmF1bHRQcm9wczogdHJ1ZSxcbiAgICBtaXhpbnM6IHRydWUsXG4gICAgcHJvcFR5cGVzOiB0cnVlLFxuICAgIHR5cGU6IHRydWVcbn07XG5cbnZhciBLTk9XTl9TVEFUSUNTID0ge1xuICBuYW1lOiB0cnVlLFxuICBsZW5ndGg6IHRydWUsXG4gIHByb3RvdHlwZTogdHJ1ZSxcbiAgY2FsbGVyOiB0cnVlLFxuICBjYWxsZWU6IHRydWUsXG4gIGFyZ3VtZW50czogdHJ1ZSxcbiAgYXJpdHk6IHRydWVcbn07XG5cbnZhciBkZWZpbmVQcm9wZXJ0eSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcbnZhciBnZXRPd25Qcm9wZXJ0eU5hbWVzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXM7XG52YXIgZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcbnZhciBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xudmFyIGdldFByb3RvdHlwZU9mID0gT2JqZWN0LmdldFByb3RvdHlwZU9mO1xudmFyIG9iamVjdFByb3RvdHlwZSA9IGdldFByb3RvdHlwZU9mICYmIGdldFByb3RvdHlwZU9mKE9iamVjdCk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaG9pc3ROb25SZWFjdFN0YXRpY3ModGFyZ2V0Q29tcG9uZW50LCBzb3VyY2VDb21wb25lbnQsIGJsYWNrbGlzdCkge1xuICAgIGlmICh0eXBlb2Ygc291cmNlQ29tcG9uZW50ICE9PSAnc3RyaW5nJykgeyAvLyBkb24ndCBob2lzdCBvdmVyIHN0cmluZyAoaHRtbCkgY29tcG9uZW50c1xuXG4gICAgICAgIGlmIChvYmplY3RQcm90b3R5cGUpIHtcbiAgICAgICAgICAgIHZhciBpbmhlcml0ZWRDb21wb25lbnQgPSBnZXRQcm90b3R5cGVPZihzb3VyY2VDb21wb25lbnQpO1xuICAgICAgICAgICAgaWYgKGluaGVyaXRlZENvbXBvbmVudCAmJiBpbmhlcml0ZWRDb21wb25lbnQgIT09IG9iamVjdFByb3RvdHlwZSkge1xuICAgICAgICAgICAgICAgIGhvaXN0Tm9uUmVhY3RTdGF0aWNzKHRhcmdldENvbXBvbmVudCwgaW5oZXJpdGVkQ29tcG9uZW50LCBibGFja2xpc3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGtleXMgPSBnZXRPd25Qcm9wZXJ0eU5hbWVzKHNvdXJjZUNvbXBvbmVudCk7XG5cbiAgICAgICAgaWYgKGdldE93blByb3BlcnR5U3ltYm9scykge1xuICAgICAgICAgICAga2V5cyA9IGtleXMuY29uY2F0KGdldE93blByb3BlcnR5U3ltYm9scyhzb3VyY2VDb21wb25lbnQpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgdmFyIGtleSA9IGtleXNbaV07XG4gICAgICAgICAgICBpZiAoIVJFQUNUX1NUQVRJQ1Nba2V5XSAmJiAhS05PV05fU1RBVElDU1trZXldICYmICghYmxhY2tsaXN0IHx8ICFibGFja2xpc3Rba2V5XSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGVzY3JpcHRvciA9IGdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2VDb21wb25lbnQsIGtleSk7XG4gICAgICAgICAgICAgICAgdHJ5IHsgLy8gQXZvaWQgZmFpbHVyZXMgZnJvbSByZWFkLW9ubHkgcHJvcGVydGllc1xuICAgICAgICAgICAgICAgICAgICBkZWZpbmVQcm9wZXJ0eSh0YXJnZXRDb21wb25lbnQsIGtleSwgZGVzY3JpcHRvcik7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0YXJnZXRDb21wb25lbnQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhcmdldENvbXBvbmVudDtcbn07XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfcHJvcFR5cGVzID0gcmVxdWlyZSgncHJvcC10eXBlcycpO1xuXG52YXIgX3Byb3BUeXBlczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wcm9wVHlwZXMpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMob2JqLCBrZXlzKSB7IHZhciB0YXJnZXQgPSB7fTsgZm9yICh2YXIgaSBpbiBvYmopIHsgaWYgKGtleXMuaW5kZXhPZihpKSA+PSAwKSBjb250aW51ZTsgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBpKSkgY29udGludWU7IHRhcmdldFtpXSA9IG9ialtpXTsgfSByZXR1cm4gdGFyZ2V0OyB9XG5cbnZhciBJY29uQmFzZSA9IGZ1bmN0aW9uIEljb25CYXNlKF9yZWYsIF9yZWYyKSB7XG4gIHZhciBjaGlsZHJlbiA9IF9yZWYuY2hpbGRyZW47XG4gIHZhciBjb2xvciA9IF9yZWYuY29sb3I7XG4gIHZhciBzaXplID0gX3JlZi5zaXplO1xuICB2YXIgc3R5bGUgPSBfcmVmLnN0eWxlO1xuICB2YXIgd2lkdGggPSBfcmVmLndpZHRoO1xuICB2YXIgaGVpZ2h0ID0gX3JlZi5oZWlnaHQ7XG5cbiAgdmFyIHByb3BzID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzKF9yZWYsIFsnY2hpbGRyZW4nLCAnY29sb3InLCAnc2l6ZScsICdzdHlsZScsICd3aWR0aCcsICdoZWlnaHQnXSk7XG5cbiAgdmFyIF9yZWYyJHJlYWN0SWNvbkJhc2UgPSBfcmVmMi5yZWFjdEljb25CYXNlO1xuICB2YXIgcmVhY3RJY29uQmFzZSA9IF9yZWYyJHJlYWN0SWNvbkJhc2UgPT09IHVuZGVmaW5lZCA/IHt9IDogX3JlZjIkcmVhY3RJY29uQmFzZTtcblxuICB2YXIgY29tcHV0ZWRTaXplID0gc2l6ZSB8fCByZWFjdEljb25CYXNlLnNpemUgfHwgJzFlbSc7XG4gIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudCgnc3ZnJywgX2V4dGVuZHMoe1xuICAgIGNoaWxkcmVuOiBjaGlsZHJlbixcbiAgICBmaWxsOiAnY3VycmVudENvbG9yJyxcbiAgICBwcmVzZXJ2ZUFzcGVjdFJhdGlvOiAneE1pZFlNaWQgbWVldCcsXG4gICAgaGVpZ2h0OiBoZWlnaHQgfHwgY29tcHV0ZWRTaXplLFxuICAgIHdpZHRoOiB3aWR0aCB8fCBjb21wdXRlZFNpemVcbiAgfSwgcmVhY3RJY29uQmFzZSwgcHJvcHMsIHtcbiAgICBzdHlsZTogX2V4dGVuZHMoe1xuICAgICAgdmVydGljYWxBbGlnbjogJ21pZGRsZScsXG4gICAgICBjb2xvcjogY29sb3IgfHwgcmVhY3RJY29uQmFzZS5jb2xvclxuICAgIH0sIHJlYWN0SWNvbkJhc2Uuc3R5bGUgfHwge30sIHN0eWxlKVxuICB9KSk7XG59O1xuXG5JY29uQmFzZS5wcm9wVHlwZXMgPSB7XG4gIGNvbG9yOiBfcHJvcFR5cGVzMi5kZWZhdWx0LnN0cmluZyxcbiAgc2l6ZTogX3Byb3BUeXBlczIuZGVmYXVsdC5vbmVPZlR5cGUoW19wcm9wVHlwZXMyLmRlZmF1bHQuc3RyaW5nLCBfcHJvcFR5cGVzMi5kZWZhdWx0Lm51bWJlcl0pLFxuICB3aWR0aDogX3Byb3BUeXBlczIuZGVmYXVsdC5vbmVPZlR5cGUoW19wcm9wVHlwZXMyLmRlZmF1bHQuc3RyaW5nLCBfcHJvcFR5cGVzMi5kZWZhdWx0Lm51bWJlcl0pLFxuICBoZWlnaHQ6IF9wcm9wVHlwZXMyLmRlZmF1bHQub25lT2ZUeXBlKFtfcHJvcFR5cGVzMi5kZWZhdWx0LnN0cmluZywgX3Byb3BUeXBlczIuZGVmYXVsdC5udW1iZXJdKSxcbiAgc3R5bGU6IF9wcm9wVHlwZXMyLmRlZmF1bHQub2JqZWN0XG59O1xuXG5JY29uQmFzZS5jb250ZXh0VHlwZXMgPSB7XG4gIHJlYWN0SWNvbkJhc2U6IF9wcm9wVHlwZXMyLmRlZmF1bHQuc2hhcGUoSWNvbkJhc2UucHJvcFR5cGVzKVxufTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gSWNvbkJhc2U7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxudmFyIF9yZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX3JlYWN0SWNvbkJhc2UgPSByZXF1aXJlKCdyZWFjdC1pY29uLWJhc2UnKTtcblxudmFyIF9yZWFjdEljb25CYXNlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0SWNvbkJhc2UpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgR29NYXJrR2l0aHViID0gZnVuY3Rpb24gR29NYXJrR2l0aHViKHByb3BzKSB7XG4gICAgcmV0dXJuIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICBfcmVhY3RJY29uQmFzZTIuZGVmYXVsdCxcbiAgICAgICAgX2V4dGVuZHMoeyB2aWV3Qm94OiAnMCAwIDQwIDQwJyB9LCBwcm9wcyksXG4gICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgJ2cnLFxuICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KCdwYXRoJywgeyBkOiAnbTIwIDBjLTExIDAtMjAgOS0yMCAyMCAwIDguOCA1LjcgMTYuMyAxMy43IDE5IDEgMC4yIDEuMy0wLjUgMS4zLTEgMC0wLjUgMC0yIDAtMy43LTUuNSAxLjItNi43LTIuNC02LjctMi40LTAuOS0yLjMtMi4yLTIuOS0yLjItMi45LTEuOS0xLjIgMC4xLTEuMiAwLjEtMS4yIDIgMC4xIDMuMSAyLjEgMy4xIDIuMSAxLjcgMyA0LjYgMi4xIDUuOCAxLjYgMC4yLTEuMyAwLjctMi4yIDEuMy0yLjctNC41LTAuNS05LjItMi4yLTkuMi05LjggMC0yLjIgMC44LTQgMi4xLTUuNC0wLjItMC41LTAuOS0yLjYgMC4yLTUuMyAwIDAgMS43LTAuNSA1LjUgMiAxLjYtMC40IDMuMy0wLjYgNS0wLjYgMS43IDAgMy40IDAuMiA1IDAuNyAzLjgtMi42IDUuNS0yLjEgNS41LTIuMSAxLjEgMi44IDAuNCA0LjggMC4yIDUuMyAxLjMgMS40IDIuMSAzLjIgMi4xIDUuNCAwIDcuNi00LjcgOS4zLTkuMiA5LjggMC43IDAuNiAxLjQgMS45IDEuNCAzLjcgMCAyLjcgMCA0LjkgMCA1LjUgMCAwLjYgMC4zIDEuMiAxLjMgMSA4LTIuNyAxMy43LTEwLjIgMTMuNy0xOSAwLTExLTktMjAtMjAtMjB6JyB9KVxuICAgICAgICApXG4gICAgKTtcbn07XG5cbmV4cG9ydHMuZGVmYXVsdCA9IEdvTWFya0dpdGh1Yjtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfcmVhY3RJY29uQmFzZSA9IHJlcXVpcmUoJ3JlYWN0LWljb24tYmFzZScpO1xuXG52YXIgX3JlYWN0SWNvbkJhc2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3RJY29uQmFzZSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBHb1RocmVlQmFycyA9IGZ1bmN0aW9uIEdvVGhyZWVCYXJzKHByb3BzKSB7XG4gICAgcmV0dXJuIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICBfcmVhY3RJY29uQmFzZTIuZGVmYXVsdCxcbiAgICAgICAgX2V4dGVuZHMoeyB2aWV3Qm94OiAnMCAwIDQwIDQwJyB9LCBwcm9wcyksXG4gICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgJ2cnLFxuICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KCdwYXRoJywgeyBkOiAnbTUgNy41djVoMzB2LTVoLTMweiBtMCAxNWgzMHYtNWgtMzB2NXogbTAgMTBoMzB2LTVoLTMwdjV6JyB9KVxuICAgICAgICApXG4gICAgKTtcbn07XG5cbmV4cG9ydHMuZGVmYXVsdCA9IEdvVGhyZWVCYXJzO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBob2lzdE5vblJlYWN0U3RhdGljcyBmcm9tICdob2lzdC1ub24tcmVhY3Qtc3RhdGljcyc7XG5pbXBvcnQgbG9jYWxlU2VydmljZSBmcm9tICcuLy4uL3NlcnZpY2VzL0xvY2FsZVNlcnZpY2UnO1xuaW1wb3J0IGkxOG5TZXJ2aWNlIGZyb20gJy4vLi4vc2VydmljZXMvSTE4blNlcnZpY2UnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBsb2NhbGVBd2FyZShDb21wb25lbnQpIHtcbiAgY2xhc3MgTG9jYWxlQXdhcmUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XG4gICAgICBzdXBlcihwcm9wcywgY29udGV4dCk7XG4gICAgICB0aGlzLmhhbmRsZUxvY2FsZUNoYW5nZSA9IHRoaXMuaGFuZGxlTG9jYWxlQ2hhbmdlLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLnVucmVnaXN0ZXJMb2NhbGVDaGFuZ2UgPSBudWxsO1xuICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgbG9jYWxlOiBsb2NhbGVTZXJ2aWNlLmxvY2FsZVxuICAgICAgfTtcbiAgICAgIHRoaXMuX21vdW50ZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMuX2NvbXBvbmVudCA9IG51bGw7XG4gICAgfVxuXG4gICAgaGFuZGxlTG9jYWxlQ2hhbmdlKGxvY2FsZSkge1xuICAgICAgdGhpcy5fbW91bnRlZCAmJiB0aGlzLnN0YXRlLmxvY2FsZSAhPT0gbG9jYWxlICYmIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBsb2NhbGVcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgdGhpcy51bnJlZ2lzdGVyTG9jYWxlQ2hhbmdlID0gbG9jYWxlU2VydmljZS5vbkxvY2FsZUNoYW5nZSh0aGlzLmhhbmRsZUxvY2FsZUNoYW5nZSk7XG4gICAgICB0aGlzLl9tb3VudGVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICAgIHRoaXMuX21vdW50ZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMudW5yZWdpc3RlckxvY2FsZUNoYW5nZSgpO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgIGNvbnN0IHsgbG9jYWxlIH0gPSB0aGlzLnN0YXRlO1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPENvbXBvbmVudCB7IC4uLnRoaXMucHJvcHMgfVxuICAgICAgICAgIGxvY2FsZT17IGxvY2FsZSB9XG4gICAgICAgICAgdHJhbnNsYXRpb25zPXsgaTE4blNlcnZpY2UuY3VycmVudExhbmdUcmFuc2xhdGlvbnMgfVxuICAgICAgICAgIHJlZj17IGNvbXAgPT4gdGhpcy5fY29tcG9uZW50ID0gY29tcCB9XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIExvY2FsZUF3YXJlLmRpc3BsYXlOYW1lID0gYExvY2FsZUF3YXJlKCR7XG4gICAgQ29tcG9uZW50LmRpc3BsYXlOYW1lIHx8XG4gICAgQ29tcG9uZW50Lm5hbWUgfHxcbiAgICAnQ29tcG9uZW50J1xuICB9KWA7XG5cbiAgcmV0dXJuIGhvaXN0Tm9uUmVhY3RTdGF0aWNzKExvY2FsZUF3YXJlLCBDb21wb25lbnQpO1xufVxuIiwiaW1wb3J0IGxvY2FsZVNlcnZpY2UgZnJvbSAnLi9Mb2NhbGVTZXJ2aWNlJztcblxuY29uc3QgZW1wdHlPYmogPSB7fTtcblxuY2xhc3MgSTE4blNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBsb2NhbGVTZXJ2aWNlLm9uTG9jYWxlQ2hhbmdlKHRoaXMuX2hhbmRsZUxvY2FsZUNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLl9sb2NhbGUgPSBsb2NhbGVTZXJ2aWNlLmxvY2FsZTtcbiAgICB0aGlzLl90cmFuc2xhdGlvbnMgPSB7fTtcbiAgfVxuXG4gIF9oYW5kbGVMb2NhbGVDaGFuZ2UobG9jYWxlKSB7XG4gICAgdGhpcy5fbG9jYWxlID0gbG9jYWxlO1xuICB9XG5cbiAgY2xlYXJUcmFuc2xhdGlvbnMobGFuZykge1xuICAgIGRlbGV0ZSB0aGlzLl90cmFuc2xhdGlvbnNbbGFuZ107XG4gIH1cblxuICByZWdpc3RlclRyYW5zbGF0aW9ucyh0cmFuc2xhdGlvbnMpIHtcbiAgICB0aGlzLl90cmFuc2xhdGlvbnMgPSBPYmplY3Qua2V5cyh0cmFuc2xhdGlvbnMpLnJlZHVjZSgoYWNjLCBsYW5nKSA9PiB7XG4gICAgICBhY2NbbGFuZ10gPSB7XG4gICAgICAgIC4uLnRoaXMuX3RyYW5zbGF0aW9uc1tsYW5nXSxcbiAgICAgICAgLi4udHJhbnNsYXRpb25zW2xhbmddXG4gICAgICB9O1xuICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCB0aGlzLl90cmFuc2xhdGlvbnMpO1xuICB9XG5cbiAgdHJhbnNsYXRlKG1zZykge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnRMYW5nVHJhbnNsYXRpb25zW21zZ107XG4gIH1cblxuICBnZXQgdHJhbnNsYXRpb25zKCkge1xuICAgIHJldHVybiB0aGlzLl90cmFuc2xhdGlvbnM7XG4gIH1cblxuICBnZXQgY3VycmVudExhbmdUcmFuc2xhdGlvbnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RyYW5zbGF0aW9uc1t0aGlzLl9sb2NhbGUubGFuZ10gfHwgZW1wdHlPYmo7XG4gIH1cbn1cblxuY29uc3QgaTE4blNlcnZpY2UgPSBuZXcgSTE4blNlcnZpY2UoKTtcbmV4cG9ydCBkZWZhdWx0IGkxOG5TZXJ2aWNlO1xuIiwiXG5jb25zdCBkZWZhdWx0TG9jYWxlID0ge1xuICBkaXI6ICdsdHInLFxuICBsYW5nOiAnZW4nXG59O1xuXG5jbGFzcyBMb2NhbGVTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fY2FsbGJhY2tzID0gW107XG4gICAgdGhpcy5fbG9jYWxlQXR0cnMgPSBPYmplY3Qua2V5cyhkZWZhdWx0TG9jYWxlKTtcbiAgICB0aGlzLl9yb290RWxlbWVudCA9IHdpbmRvdy5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgdGhpcy5fbG9jYWxlQXR0cnMuZm9yRWFjaCgoYXR0cikgPT4ge1xuICAgICAgaWYgKCF0aGlzLl9yb290RWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cikpIHtcbiAgICAgICAgdGhpcy5fcm9vdEVsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHIsIGRlZmF1bHRMb2NhbGVbYXR0cl0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuX2xvY2FsZSA9IHRoaXMuX2xvY2FsZUF0dHJzLnJlZHVjZSgoYWNjLCBhdHRyKSA9PiB7XG4gICAgICBhY2NbYXR0cl0gPSB0aGlzLl9yb290RWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cik7XG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHt9KTtcbiAgICB0aGlzLl9vYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMuX2hhbmRsZU11dGF0aW9ucy5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLl9vYnNlcnZlci5vYnNlcnZlKHRoaXMuX3Jvb3RFbGVtZW50LCB7XG4gICAgICBhdHRyaWJ1dGVzOiB0cnVlXG4gICAgfSk7XG4gIH1cblxuICBfaGFuZGxlTXV0YXRpb25zKG11dGF0aW9ucykge1xuICAgIG11dGF0aW9ucy5mb3JFYWNoKChtdXRhdGlvbikgPT4ge1xuICAgICAgY29uc3QgbXV0YXRpb25BdHRyaWJ1dGVOYW1lID0gbXV0YXRpb24uYXR0cmlidXRlTmFtZTtcbiAgICAgIGlmICh0aGlzLl9sb2NhbGVBdHRycy5pbmNsdWRlcyhtdXRhdGlvbkF0dHJpYnV0ZU5hbWUpKSB7XG4gICAgICAgIHRoaXMuX2xvY2FsZSA9IHtcbiAgICAgICAgICAuLi50aGlzLl9sb2NhbGUsXG4gICAgICAgICAgW211dGF0aW9uQXR0cmlidXRlTmFtZV06IHRoaXMuX3Jvb3RFbGVtZW50LmdldEF0dHJpYnV0ZShtdXRhdGlvbkF0dHJpYnV0ZU5hbWUpXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX2NhbGxiYWNrcy5mb3JFYWNoKGNhbGxiYWNrID0+IGNhbGxiYWNrKHRoaXMuX2xvY2FsZSkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc2V0IGxvY2FsZShsb2NhbGVPYmopIHtcbiAgICBPYmplY3Qua2V5cyhsb2NhbGVPYmopLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgdGhpcy5fcm9vdEVsZW1lbnQuc2V0QXR0cmlidXRlKGtleSwgbG9jYWxlT2JqW2tleV0pO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0IGxvY2FsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fbG9jYWxlO1xuICB9XG5cbiAgb25Mb2NhbGVDaGFuZ2UoY2FsbGJhY2spIHtcbiAgICB0aGlzLl9jYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG4gICAgY2FsbGJhY2sodGhpcy5sb2NhbGUpO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MuZmlsdGVyKGNiID0+IGNiICE9PSBjYWxsYmFjayk7XG4gICAgfTtcbiAgfVxufVxuXG5jb25zdCBsb2NhbGVTZXJ2aWNlID0gbmV3IExvY2FsZVNlcnZpY2UoKTtcbmV4cG9ydCBkZWZhdWx0IGxvY2FsZVNlcnZpY2U7XG4iLCJcbmltcG9ydCBMb2NhbGVTZXJ2aWNlIGZyb20gJy4uLy4uL3NlcnZpY2VzL0xvY2FsZVNlcnZpY2UnO1xuaW1wb3J0IGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbiBmcm9tICcuLi9pbnRlcm5hbHMvZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uJztcblxuY29uc3QgcmVnaXN0cmF0aW9uTmFtZSA9ICdEQlVXZWJDb21wb25lbnRCYXNlJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0REJVV2ViQ29tcG9uZW50QmFzZSh3aW4pIHtcbiAgcmV0dXJuIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbih3aW4sIHJlZ2lzdHJhdGlvbk5hbWUsICgpID0+IHtcbiAgICBjb25zdCB7IGRvY3VtZW50LCBIVE1MRWxlbWVudCwgY3VzdG9tRWxlbWVudHMgfSA9IHdpbjtcblxuICAgIGNvbnN0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSAnPHN0eWxlPjwvc3R5bGU+PHNsb3Q+PC9zbG90Pic7XG5cbiAgICBjbGFzcyBEQlVXZWJDb21wb25lbnRCYXNlIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuXG4gICAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlKCkge1xuICAgICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgZGVwZW5kZW5jaWVzKCkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgdXNlU2hhZG93KCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIGNvbnN0IHsgdXNlU2hhZG93IH0gPSB0aGlzLmNvbnN0cnVjdG9yO1xuICAgICAgICBpZiAodXNlU2hhZG93KSB7XG4gICAgICAgICAgdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5faW5zZXJ0VGVtcGxhdGUoKTtcblxuICAgICAgICB0aGlzLmNvbm5lY3RlZENhbGxiYWNrID0gdGhpcy5jb25uZWN0ZWRDYWxsYmFjay5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmRpc2Nvbm5lY3RlZENhbGxiYWNrID0gdGhpcy5kaXNjb25uZWN0ZWRDYWxsYmFjay5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLl9oYW5kbGVMb2NhbGVDaGFuZ2UgPSB0aGlzLl9oYW5kbGVMb2NhbGVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vbkxvY2FsZUNoYW5nZSAmJiAodGhpcy5vbkxvY2FsZUNoYW5nZSA9IHRoaXMub25Mb2NhbGVDaGFuZ2UuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMudW5yZWdpc3RlckxvY2FsZUNoYW5nZSA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmVmb3JldW5sb2FkJywgdGhpcy5kaXNjb25uZWN0ZWRDYWxsYmFjaywgZmFsc2UpO1xuXG4gICAgICAgIHRoaXMudW5yZWdpc3RlckxvY2FsZUNoYW5nZSA9XG4gICAgICAgICAgTG9jYWxlU2VydmljZS5vbkxvY2FsZUNoYW5nZSh0aGlzLl9oYW5kbGVMb2NhbGVDaGFuZ2UpO1xuICAgICAgfVxuXG4gICAgICBkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgICAgdGhpcy51bnJlZ2lzdGVyTG9jYWxlQ2hhbmdlKCk7XG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdiZWZvcmV1bmxvYWQnLCB0aGlzLmRpc2Nvbm5lY3RlZENhbGxiYWNrLCBmYWxzZSk7XG4gICAgICB9XG5cbiAgICAgIGdldCBjaGlsZHJlblRyZWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLnVzZVNoYWRvdyA/IHRoaXMuc2hhZG93Um9vdCA6IHRoaXM7XG4gICAgICB9XG5cbiAgICAgIF9pbnNlcnRUZW1wbGF0ZSgpIHtcbiAgICAgICAgY29uc3QgeyB0ZW1wbGF0ZSB9ID0gdGhpcy5jb25zdHJ1Y3RvcjtcblxuICAgICAgICBpZiAodGVtcGxhdGUpIHtcbiAgICAgICAgICB0aGlzLmNoaWxkcmVuVHJlZS5hcHBlbmRDaGlsZCh0ZW1wbGF0ZS5jb250ZW50LmNsb25lTm9kZSh0cnVlKSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgX2hhbmRsZUxvY2FsZUNoYW5nZShsb2NhbGUpIHtcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2RpcicsIGxvY2FsZS5kaXIpO1xuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnbGFuZycsIGxvY2FsZS5sYW5nKTtcbiAgICAgICAgdGhpcy5vbkxvY2FsZUNoYW5nZSAmJiB0aGlzLm9uTG9jYWxlQ2hhbmdlKGxvY2FsZSk7XG4gICAgICB9XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzKGtsYXNzKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoa2xhc3MsICdjb21wb25lbnRTdHlsZScsIHtcbiAgICAgICAgZ2V0KCkge1xuICAgICAgICAgIHJldHVybiBrbGFzcy50ZW1wbGF0ZS5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ3N0eWxlJykuaW5uZXJIVE1MO1xuICAgICAgICB9LFxuICAgICAgICBzZXQodmFsdWUpIHtcbiAgICAgICAgICBrbGFzcy50ZW1wbGF0ZS5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ3N0eWxlJykuaW5uZXJIVE1MID0gdmFsdWU7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfSk7XG5cbiAgICAgIGtsYXNzLnJlZ2lzdGVyU2VsZiA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgcmVnaXN0cmF0aW9uTmFtZSA9IGtsYXNzLnJlZ2lzdHJhdGlvbk5hbWU7XG4gICAgICAgIGNvbnN0IGRlcGVuZGVuY2llcyA9IGtsYXNzLmRlcGVuZGVuY2llcztcbiAgICAgICAgLy8gTWFrZSBzdXJlIG91ciBkZXBlbmRlbmNpZXMgYXJlIHJlZ2lzdGVyZWQgYmVmb3JlIHdlIHJlZ2lzdGVyIHNlbGZcbiAgICAgICAgZGVwZW5kZW5jaWVzLmZvckVhY2goKGRlcGVuZGVuY3kpID0+IGRlcGVuZGVuY3kucmVnaXN0ZXJTZWxmKCkpO1xuICAgICAgICAvLyBEb24ndCB0cnkgdG8gcmVnaXN0ZXIgc2VsZiBpZiBhbHJlYWR5IHJlZ2lzdGVyZWRcbiAgICAgICAgaWYgKGN1c3RvbUVsZW1lbnRzLmdldChyZWdpc3RyYXRpb25OYW1lKSkgcmV0dXJuIHJlZ2lzdHJhdGlvbk5hbWU7XG4gICAgICAgIC8vIEdpdmUgYSBjaGFuY2UgdG8gb3ZlcnJpZGUgd2ViLWNvbXBvbmVudCBzdHlsZSBpZiBwcm92aWRlZCBiZWZvcmUgYmVpbmcgcmVnaXN0ZXJlZC5cbiAgICAgICAgY29uc3QgY29tcG9uZW50U3R5bGUgPSAoKHdpbi5EQlVXZWJDb21wb25lbnRzIHx8IHt9KVtyZWdpc3RyYXRpb25OYW1lXSB8fCB7fSkuY29tcG9uZW50U3R5bGU7XG4gICAgICAgIGlmIChjb21wb25lbnRTdHlsZSkge1xuICAgICAgICAgIGtsYXNzLmNvbXBvbmVudFN0eWxlICs9IGNvbXBvbmVudFN0eWxlO1xuICAgICAgICB9XG4gICAgICAgIC8vIERvIHJlZ2lzdHJhdGlvblxuICAgICAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUocmVnaXN0cmF0aW9uTmFtZSwga2xhc3MpO1xuICAgICAgICByZXR1cm4gcmVnaXN0cmF0aW9uTmFtZTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIERCVVdlYkNvbXBvbmVudEJhc2UsXG4gICAgICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzXG4gICAgfTtcbiAgfSk7XG59XG4iLCJcbmltcG9ydCBnZXREQlVXZWJDb21wb25lbnRCYXNlIGZyb20gJy4uL0RCVVdlYkNvbXBvbmVudEJhc2UvREJVV2ViQ29tcG9uZW50QmFzZSc7XG5pbXBvcnQgZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uIGZyb20gJy4uL2ludGVybmFscy9lbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24nO1xuXG5jb25zdCByZWdpc3RyYXRpb25OYW1lID0gJ2RidS13ZWItY29tcG9uZW50LWR1bW15JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0REJVV2ViQ29tcG9uZW50RHVtbXkod2luKSB7XG4gIHJldHVybiBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24od2luLCByZWdpc3RyYXRpb25OYW1lLCAoKSA9PiB7XG4gICAgY29uc3QgeyBEQlVXZWJDb21wb25lbnRCYXNlLCBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzIH0gPSBnZXREQlVXZWJDb21wb25lbnRCYXNlKHdpbik7XG4gICAgY29uc3QgeyBkb2N1bWVudCB9ID0gd2luO1xuXG4gICAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IGBcbiAgICAgIDxzdHlsZT5cbiAgICAgIDpob3N0IHtcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgbWF4LXdpZHRoOiA0MDBweDtcbiAgICAgICAgaGVpZ2h0OiA1MHB4O1xuICAgICAgICBjb2xvcjogbWFyb29uO1xuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCBncmF5O1xuICAgICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgICAgfVxuICAgICAgXG4gICAgICA6aG9zdCBiLCA6aG9zdCBkaXZbeC1oYXMtc2xvdF0gc3Bhblt4LXNsb3Qtd3JhcHBlcl0ge1xuICAgICAgICB1bmljb2RlLWJpZGk6IGJpZGktb3ZlcnJpZGU7XG4gICAgICAgIHRleHQtc2hhZG93OiB2YXIoLS1kdW1teS1iLXRleHQtc2hhZG93LCBub25lKTtcbiAgICAgIH1cblxuICAgICAgOmhvc3QoW2Rpcj1ydGxdKSBiIHtcbiAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XG4gICAgICB9XG4gICAgICBcbiAgICAgIDpob3N0KFtkaXI9bHRyXSkgYiB7XG4gICAgICAgIHRleHQtZGVjb3JhdGlvbjogb3ZlcmxpbmU7XG4gICAgICB9XG5cbiAgICAgIDpob3N0KFtkaXI9bHRyXSkgI2NvbnRhaW5lciA+IGRpdltkaXI9cnRsXSxcbiAgICAgIDpob3N0KFtkaXI9cnRsXSkgI2NvbnRhaW5lciA+IGRpdltkaXI9bHRyXSB7XG4gICAgICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgICB9XG4gICAgICBcbiAgICAgIDpob3N0ICNjb250YWluZXIgPiBkaXZbeC1oYXMtc2xvdF0ge1xuICAgICAgICBtYXJnaW4tbGVmdDogMHB4O1xuICAgICAgfVxuICAgICAgXG4gICAgICAjY29udGFpbmVyIHtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIGhlaWdodDogMTAwJTtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1mbG93OiByb3cgbm93cmFwO1xuICAgICAgICBhbGlnbi1pdGVtczogc3RyZXRjaDtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgI2NvbnRhaW5lciA+IGRpdiB7XG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIGdyYXk7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IHZhcigtLWR1bW15LWlubmVyLXNlY3Rpb25zLWJvcmRlci1yYWRpdXMsIDBweCk7XG4gICAgICAgIGZsZXg6IDEgMCAwJTtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgbWFyZ2luOiA1cHg7XG4gICAgICB9XG4gICAgICBcbiAgICAgICNjb250YWluZXIgPiBkaXYgPiBkaXYge1xuICAgICAgICBtYXJnaW46IGF1dG87XG4gICAgICB9XG4gICAgICBcbiAgICAgIDwvc3R5bGU+XG4gICAgICBcbiAgICAgIDxkaXYgaWQ9XCJjb250YWluZXJcIj5cbiAgICAgICAgPGRpdiBkaXI9XCJsdHJcIj5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGI+RHVtbXkgc2hhZG93PC9iPiBbTFRSXVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgXG4gICAgICAgIDxkaXYgeC1oYXMtc2xvdD5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPHNwYW4+Wzwvc3Bhbj48c3BhbiB4LXNsb3Qtd3JhcHBlcj48c2xvdD48L3Nsb3Q+PC9zcGFuPjxzcGFuPl08L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICBcbiAgICAgICAgPGRpdiBkaXI9XCJydGxcIj5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGI+RHVtbXkgc2hhZG93PC9iPiBbUlRMXVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIGA7XG5cbiAgICBjbGFzcyBEQlVXZWJDb21wb25lbnREdW1teSBleHRlbmRzIERCVVdlYkNvbXBvbmVudEJhc2Uge1xuICAgICAgc3RhdGljIGdldCByZWdpc3RyYXRpb25OYW1lKCkge1xuICAgICAgICByZXR1cm4gcmVnaXN0cmF0aW9uTmFtZTtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuICAgICAgfVxuXG4gICAgICBvbkxvY2FsZUNoYW5nZShsb2NhbGUpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ29uTG9jYWxlQ2hhbmdlJywgbG9jYWxlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzKERCVVdlYkNvbXBvbmVudER1bW15KTtcblxuICAgIHJldHVybiBEQlVXZWJDb21wb25lbnREdW1teTtcbiAgfSk7XG59XG5cbmdldERCVVdlYkNvbXBvbmVudER1bW15LnJlZ2lzdHJhdGlvbk5hbWUgPSByZWdpc3RyYXRpb25OYW1lO1xuXG4iLCJcblxuaW1wb3J0IGdldERCVVdlYkNvbXBvbmVudEJhc2UgZnJvbSAnLi4vREJVV2ViQ29tcG9uZW50QmFzZS9EQlVXZWJDb21wb25lbnRCYXNlJztcbmltcG9ydCBnZXREQlVXZWJDb21wb25lbnREdW1teSBmcm9tICcuLi9EQlVXZWJDb21wb25lbnREdW1teS9EQlVXZWJDb21wb25lbnREdW1teSc7XG5pbXBvcnQgZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uIGZyb20gJy4uL2ludGVybmFscy9lbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24nO1xuXG5jb25zdCByZWdpc3RyYXRpb25OYW1lID0gJ2RidS13ZWItY29tcG9uZW50LWR1bW15LXBhcmVudCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldERCVVdlYkNvbXBvbmVudER1bW15UGFyZW50KHdpbikge1xuICByZXR1cm4gZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uKHdpbiwgcmVnaXN0cmF0aW9uTmFtZSwgKCkgPT4ge1xuICAgIGNvbnN0IHsgREJVV2ViQ29tcG9uZW50QmFzZSwgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyB9ID0gZ2V0REJVV2ViQ29tcG9uZW50QmFzZSh3aW4pO1xuICAgIGNvbnN0IERCVVdlYkNvbXBvbmVudER1bW15ID0gZ2V0REJVV2ViQ29tcG9uZW50RHVtbXkod2luKTtcblxuICAgIGNvbnN0IHsgZG9jdW1lbnQgfSA9IHdpbjtcblxuICAgIGNvbnN0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBgXG4gICAgICA8c3R5bGU+XG4gICAgICA6aG9zdCB7XG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIG1heC13aWR0aDogNDAwcHg7XG4gICAgICB9XG4gICAgICA8L3N0eWxlPlxuICAgICAgPGRpdj5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8Yj5EdW1teSBQYXJlbnQgc2hhZG93PC9iPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8ZGJ1LXdlYi1jb21wb25lbnQtZHVtbXk+PHNsb3Q+PC9zbG90PjwvZGJ1LXdlYi1jb21wb25lbnQtZHVtbXk+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgYDtcblxuICAgIGNsYXNzIERCVVdlYkNvbXBvbmVudER1bW15UGFyZW50IGV4dGVuZHMgREJVV2ViQ29tcG9uZW50QmFzZSB7XG4gICAgICBzdGF0aWMgZ2V0IHJlZ2lzdHJhdGlvbk5hbWUoKSB7XG4gICAgICAgIHJldHVybiByZWdpc3RyYXRpb25OYW1lO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlKCkge1xuICAgICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgZGVwZW5kZW5jaWVzKCkge1xuICAgICAgICByZXR1cm4gW0RCVVdlYkNvbXBvbmVudER1bW15XTtcbiAgICAgIH1cblxuICAgIH1cblxuICAgIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMoREJVV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQpO1xuXG4gICAgcmV0dXJuIERCVVdlYkNvbXBvbmVudER1bW15UGFyZW50O1xuICB9KTtcbn1cblxuZ2V0REJVV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQucmVnaXN0cmF0aW9uTmFtZSA9IHJlZ2lzdHJhdGlvbk5hbWU7XG5cbiIsImltcG9ydCBhcHBlbmRTdHlsZSBmcm9tICcuLi9pbnRlcm5hbHMvYXBwZW5kU3R5bGUnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkYnVXZWJDb21wb25lbnRzU2V0VXAod2luKSB7XG4gIHJldHVybiB7XG4gICAgYXBwZW5kU3R5bGU6IGFwcGVuZFN0eWxlKHdpbilcbiAgfTtcbn1cbiIsIi8qXG5EQlVXZWJDb21wb25lbnRCYXNlIChmcm9tIHdoaWNoIGFsbCB3ZWItY29tcG9uZW50cyBpbmhlcml0KVxud2lsbCByZWFkIGNvbXBvbmVudFN0eWxlIGZyb20gd2luLkRCVVdlYkNvbXBvbmVudHNcbndoZW4ga2xhc3MucmVnaXN0ZXJTZWxmKCkgaXMgY2FsbGVkIGdpdmluZyBhIGNoYW5jZSB0byBvdmVycmlkZSBkZWZhdWx0IHdlYi1jb21wb25lbnQgc3R5bGVcbmp1c3QgYmVmb3JlIGl0IGlzIHJlZ2lzdGVyZWQuXG4qL1xuY29uc3QgYXBwZW5kU3R5bGUgPSAod2luKSA9PiAocmVnaXN0cmF0aW9uTmFtZSwgY29tcG9uZW50U3R5bGUpID0+IHtcbiAgaWYgKCF3aW4uREJVV2ViQ29tcG9uZW50cykge1xuICAgIHdpbi5EQlVXZWJDb21wb25lbnRzID0ge307XG4gIH1cbiAgd2luLkRCVVdlYkNvbXBvbmVudHMgPSB7XG4gICAgLi4ud2luLkRCVVdlYkNvbXBvbmVudHMsXG4gICAgW3JlZ2lzdHJhdGlvbk5hbWVdOiB7XG4gICAgICAuLi53aW4uREJVV2ViQ29tcG9uZW50c1tyZWdpc3RyYXRpb25OYW1lXSxcbiAgICAgIGNvbXBvbmVudFN0eWxlXG4gICAgfVxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgYXBwZW5kU3R5bGU7XG4iLCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uKHdpbiwgbmFtZSwgY2FsbGJhY2spIHtcbiAgaWYgKCF3aW4uREJVV2ViQ29tcG9uZW50cykge1xuICAgIHdpbi5EQlVXZWJDb21wb25lbnRzID0geyByZWdpc3RyYXRpb25zOiB7fSB9O1xuICB9IGVsc2UgaWYgKCF3aW4uREJVV2ViQ29tcG9uZW50cy5yZWdpc3RyYXRpb25zKSB7XG4gICAgd2luLkRCVVdlYkNvbXBvbmVudHMucmVnaXN0cmF0aW9ucyA9IHt9O1xuICB9XG5cbiAgbGV0IHJlZ2lzdHJhdGlvbiA9IHdpbi5EQlVXZWJDb21wb25lbnRzLnJlZ2lzdHJhdGlvbnNbbmFtZV07XG5cbiAgaWYgKHJlZ2lzdHJhdGlvbikgcmV0dXJuIHJlZ2lzdHJhdGlvbjtcblxuICByZWdpc3RyYXRpb24gPSBjYWxsYmFjaygpO1xuICB3aW4uREJVV2ViQ29tcG9uZW50cy5yZWdpc3RyYXRpb25zW25hbWVdID0gcmVnaXN0cmF0aW9uO1xuXG4gIHJldHVybiB3aW4uREJVV2ViQ29tcG9uZW50cy5yZWdpc3RyYXRpb25zW25hbWVdO1xufVxuXG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBHb01hcmtHaXRodWIgZnJvbSAncmVhY3QtaWNvbnMvbGliL2dvL21hcmstZ2l0aHViJztcbmltcG9ydCBHb1RocmVlQmFycyBmcm9tICdyZWFjdC1pY29ucy9saWIvZ28vdGhyZWUtYmFycyc7XG5pbXBvcnQgeyBzY3JlZW5zLCBzY3JlZW5MaW5rTmFtZXMgfSBmcm9tICcuL3NjcmVlbnMnO1xuaW1wb3J0IGxvY2FsZUF3YXJlIGZyb20gJy4uL3NyYy9saWIvSE9DL2xvY2FsZUF3YXJlJztcblxubGV0IElGcmFtZVNjcmVlbiA9IGNsYXNzIElGcmFtZVNjcmVlbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuaWZyYW1lTm9kZSA9IG51bGw7XG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xuICAgIGNvbnN0IHsgbG9jYWxlOiB7IGRpciB9IH0gPSBuZXh0UHJvcHM7XG4gICAgdGhpcy5pZnJhbWVOb2RlLmNvbnRlbnRXaW5kb3cucG9zdE1lc3NhZ2UoYGNoYW5nZURpciAke2Rpcn1gLCAnKicpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGlzUHJvZCA9ICF3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuaW5jbHVkZXMoJy5kZXYuJyk7XG4gICAgY29uc3Qgd2luZG93TG9jYXRpb25IYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2gucmVwbGFjZSgnIycsICcnKTtcbiAgICByZXR1cm4gKFxuICAgICAgPGlmcmFtZVxuICAgICAgICByZWY9eyhub2RlKSA9PiB0aGlzLmlmcmFtZU5vZGUgPSBub2RlfVxuICAgICAgICBzcmM9e2BzcmNEZW1vL3NjcmVlbnMvJHt3aW5kb3dMb2NhdGlvbkhhc2h9P3Byb2R1Y3Rpb249JHtpc1Byb2QgPyAnMScgOiAnMCd9YH0gLz5cbiAgICApO1xuICB9XG59O1xuSUZyYW1lU2NyZWVuLnByb3BUeXBlcyA9IHtcbiAgbG9jYWxlOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgIGRpcjogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBsYW5nOiBQcm9wVHlwZXMuc3RyaW5nXG4gIH0pXG59O1xuSUZyYW1lU2NyZWVuID0gbG9jYWxlQXdhcmUoSUZyYW1lU2NyZWVuKTtcblxuY2xhc3MgQXBwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLCB0aGlzLm9uSGFzaENoYW5nZS5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIG9uSGFzaENoYW5nZSgpIHtcbiAgICB0aGlzLmZvcmNlVXBkYXRlKCk7XG4gIH1cblxuICB0b2dnbGVBcHBEaXIoZXZ0KSB7XG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgZG9jdW1lbnRFbGVtZW50ID0gd2luZG93LmRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICBjb25zdCBjdXJyZW50RGlyID0gZG9jdW1lbnRFbGVtZW50LmdldEF0dHJpYnV0ZSgnZGlyJyk7XG4gICAgY29uc3QgbmV4dERpciA9IGN1cnJlbnREaXIgPT09ICdsdHInID8gJ3J0bCcgOiAnbHRyJztcbiAgICBkb2N1bWVudEVsZW1lbnQuc2V0QXR0cmlidXRlKCdkaXInLCBuZXh0RGlyKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgLyogZXNsaW50IG5vLWNvbnNvbGU6IDAgKi9cbiAgICAgIC8vIGNvbnNvbGUubG9nKCdyZW5kZXJpbmcgQXBwIGNvbXBvbmVudCcpO1xuICAgIH1cbiAgICBjb25zdCBzY3JlZW5zS2V5cyA9IE9iamVjdC5rZXlzKHNjcmVlbnMpO1xuICAgIGNvbnN0IGxpbmtzID0gPHVsPlxuICAgICAge1xuICAgICAgICBzY3JlZW5zS2V5cy5tYXAoKHNjcmVlbiwgaWR4KSA9PiAoXG4gICAgICAgICAgPGxpIGtleT17aWR4fT5cbiAgICAgICAgICAgIDxhIGtleT17aWR4fSBocmVmPXtgIyR7c2NyZWVufWB9PntzY3JlZW5MaW5rTmFtZXNbc2NyZWVuXSB8fCBzY3JlZW59PC9hPlxuICAgICAgICAgIDwvbGk+XG4gICAgICAgICkpXG4gICAgICB9XG4gICAgPC91bD47XG5cbiAgICBjb25zdCB3aW5kb3dMb2NhdGlvbkhhc2ggPSAod2luZG93LmxvY2F0aW9uLmhhc2ggfHwgYCMke3NjcmVlbnNLZXlzWzBdfWApLnJlcGxhY2UoJyMnLCAnJyk7XG4gICAgY29uc3QgU2NyZWVuID0gd2luZG93TG9jYXRpb25IYXNoLmVuZHNXaXRoKCcuaHRtbCcpID8gSUZyYW1lU2NyZWVuIDogc2NyZWVuc1t3aW5kb3dMb2NhdGlvbkhhc2hdO1xuXG4gICAgaWYgKCFTY3JlZW4pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhZ2UtaGVhZGVyXCI+XG4gICAgICAgICAgPGgyPkRldiBCb3ggVUk8L2gyPjxhXG4gICAgICAgICAgICBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL2NhdGFsaW4tZW5hY2hlL2Rldi1ib3gtdWlcIlxuICAgICAgICAgICAgcmVsPVwibm9vcGVuZXIgbm9yZWZlcnJlclwiXG4gICAgICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIj48R29NYXJrR2l0aHViIHNpemU9ezI1fSAvPjwvYT5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGVtby13cmFwcGVyXCI+XG4gICAgICAgICAgPGxhYmVsIGlkPVwibGlua3MtdG9nZ2xlLWxhYmVsXCIgaHRtbEZvcj1cImxpbmtzLXRvZ2dsZVwiPjxHb1RocmVlQmFycyBzaXplPXsyNX0gLz48L2xhYmVsPlxuICAgICAgICAgIDxpbnB1dCBpZD1cImxpbmtzLXRvZ2dsZVwiIHR5cGU9XCJjaGVja2JveFwiIC8+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkZW1vLWxpbmtzXCIgb25DbGljaz17KCkgPT4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2xpbmtzLXRvZ2dsZScpLmNoZWNrZWQgPSBmYWxzZX0+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImxvY2FsZS1kaXItc3dpdGNoXCI+XG4gICAgICAgICAgICAgIDxhIGhyZWY9XCIjXCIgb25DbGljaz17dGhpcy50b2dnbGVBcHBEaXJ9PlRvZ2dsZSBMb2NhbGUgRGlyPC9hPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICB7bGlua3N9XG4gICAgICAgICAgICB7bGlua3N9XG4gICAgICAgICAgICB7bGlua3N9XG4gICAgICAgICAgICB7bGlua3N9XG4gICAgICAgICAgICB7bGlua3N9XG4gICAgICAgICAgICB7bGlua3N9XG4gICAgICAgICAgICB7bGlua3N9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkZW1vLWFyZWFcIj5cbiAgICAgICAgICAgIDxTY3JlZW4vPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuXG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBcHA7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtcbiAgLy8gb25TY3JlZW5Db25zb2xlLFxuICBsb2NhbGVBd2FyZVxufSBmcm9tICdkZXYtYm94LXVpJztcbmltcG9ydCBBcHAgZnJvbSAnLi9hcHAnO1xuXG4vLyBpbXBvcnQgZ2V0REJVV2ViQ29tcG9uZW50RHVtbXkgZnJvbSAnLi4vYnVpbGQvc3JjL2xpYi93ZWJjb21wb25lbnRzL0RCVVdlYkNvbXBvbmVudER1bW15L0RCVVdlYkNvbXBvbmVudER1bW15Jztcbi8vIGltcG9ydCBnZXREQlVXZWJDb21wb25lbnREdW1teVBhcmVudCBmcm9tICcuLi9idWlsZC9zcmMvbGliL3dlYmNvbXBvbmVudHMvREJVV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQvREJVV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQnO1xuaW1wb3J0IGRidVdlYkNvbXBvbmVudHNTZXRVcCBmcm9tICcuLi9zcmMvbGliL3dlYmNvbXBvbmVudHMvREJVV2ViQ29tcG9uZW50c1NldHVwL0RCVVdlYkNvbXBvbmVudHNTZXR1cCc7XG5pbXBvcnQgZ2V0REJVV2ViQ29tcG9uZW50RHVtbXkgZnJvbSAnLi4vc3JjL2xpYi93ZWJjb21wb25lbnRzL0RCVVdlYkNvbXBvbmVudER1bW15L0RCVVdlYkNvbXBvbmVudER1bW15JztcbmltcG9ydCBnZXREQlVXZWJDb21wb25lbnREdW1teVBhcmVudCBmcm9tICcuLi9zcmMvbGliL3dlYmNvbXBvbmVudHMvREJVV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQvREJVV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQnO1xuXG5kYnVXZWJDb21wb25lbnRzU2V0VXAod2luZG93KS5hcHBlbmRTdHlsZSgnZGJ1LXdlYi1jb21wb25lbnQtZHVtbXknLCBgXG4gIGIge1xuICAgIGNvbG9yOiBkZWVwc2t5Ymx1ZTtcbiAgICBmb250LXN0eWxlOiBvYmxpcXVlO1xuICB9XG5gKTtcblxuY29uc3QgREJVV2ViQ29tcG9uZW50RHVtbXkgPSBnZXREQlVXZWJDb21wb25lbnREdW1teSh3aW5kb3cpO1xuY29uc3QgREJVV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQgPSBnZXREQlVXZWJDb21wb25lbnREdW1teVBhcmVudCh3aW5kb3cpO1xuXG5cbnNldFRpbWVvdXQoKCkgPT4ge1xuICBEQlVXZWJDb21wb25lbnREdW1teS5yZWdpc3RlclNlbGYoKTtcbiAgREJVV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQucmVnaXN0ZXJTZWxmKCk7XG59LCAyMDAwKTtcblxuY29uc3QgaWZyYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaWZyYW1lJyk7XG5cbndpbmRvdy5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAobXNnKSB7IGNvbnNvbGUubG9nKCdtc2cgZnJvbSBpZnJhbWUnLCBtc2cpOyB9O1xuaWZyYW1lLm9ubG9hZCA9IGZ1bmN0aW9uIChldnQpIHtcbiAgY29uc3QgdGFyZ2V0ID0gZXZ0LnRhcmdldDtcblxuICB0YXJnZXQuY29udGVudFdpbmRvdy5kb2N1bWVudC53cml0ZShgXG4gICAgPGh0bWw+XG4gICAgPGJvZHk+XG4gICAgICA8ZGJ1LXdlYi1jb21wb25lbnQtZHVtbXlcbiAgICAgICAgc3R5bGU9XCJjb2xvcjogYmx1ZVwiXG4gICAgICA+XG4gICAgICAgIDxzcGFuPmhlbGxvIHdvcmxkIDM8L3NwYW4+XG4gICAgICA8L2RidS13ZWItY29tcG9uZW50LWR1bW15PlxuICAgICAgPGRidS13ZWItY29tcG9uZW50LWR1bW15LXBhcmVudD48L2RidS13ZWItY29tcG9uZW50LWR1bW15LXBhcmVudD5cbiAgICA8L2JvZHk+XG4gICAgPHNjcmlwdD5cbiAgICAgIHdpbmRvdy5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdtc2cgZnJvbSB3aW5kb3cnLCBtc2cpO1xuICAgICAgICB3aW5kb3cudG9wLnBvc3RNZXNzYWdlKCd3b3JsZCcsICcqJyk7XG4gICAgICB9O1xuICAgIDwvc2NyaXB0PlxuICAgIDwvaHRtbD5cbiAgYCk7XG4gIHRhcmdldC5jb250ZW50V2luZG93LnBvc3RNZXNzYWdlKCdoZWxsbycsICcqJyk7XG5cbiAgZGJ1V2ViQ29tcG9uZW50c1NldFVwKHRhcmdldC5jb250ZW50V2luZG93KS5hcHBlbmRTdHlsZSgnZGJ1LXdlYi1jb21wb25lbnQtZHVtbXknLCBgXG4gICAgYiB7XG4gICAgICBmb250LXN0eWxlOiBvYmxpcXVlO1xuICAgICAgb3BhY2l0eTogMC41O1xuICAgIH1cbiAgYCk7XG4gIGNvbnN0IERCVVdlYkNvbXBvbmVudER1bW15MiA9IGdldERCVVdlYkNvbXBvbmVudER1bW15KHRhcmdldC5jb250ZW50V2luZG93KTtcbiAgY29uc3QgREJVV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQyID0gZ2V0REJVV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQodGFyZ2V0LmNvbnRlbnRXaW5kb3cpO1xuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBEQlVXZWJDb21wb25lbnREdW1teTIucmVnaXN0ZXJTZWxmKCk7XG4gICAgREJVV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQyLnJlZ2lzdGVyU2VsZigpO1xuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAvLyB0YXJnZXQucmVtb3ZlKCk7XG4gICAgfSwgMjAwMCk7XG4gIH0sIDIwMDApO1xufTtcblxuLy8gZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChpZnJhbWUpO1xuXG5cbi8vIG9uU2NyZWVuQ29uc29sZSh7IG9wdGlvbnM6IHsgc2hvd0xhc3RPbmx5OiBmYWxzZSB9IH0pO1xuXG5sZXQgRGVtbyA9IGNsYXNzIERlbW8gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIC8qIGVzbGludCBuby1jb25zb2xlOiAwICovXG4gICAgICAvLyBjb25zb2xlLmxvZygncmVuZGVyaW5nIERlbW8gY29tcG9uZW50Jyk7XG4gICAgfVxuICAgIGNvbnN0IHsgbG9jYWxlOiB7IGRpciB9IH0gPSB0aGlzLnByb3BzO1xuICAgIHJldHVybiAoXG4gICAgICA8QXBwIC8+XG4gICAgKTtcbiAgfVxufTtcblxuRGVtby5wcm9wVHlwZXMgPSB7XG4gIGxvY2FsZTogUHJvcFR5cGVzLm9iamVjdFxufTtcblxuRGVtbyA9IGxvY2FsZUF3YXJlKERlbW8pO1xuXG5SZWFjdERPTS5yZW5kZXIoKFxuICA8RGVtby8+XG4pLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVtbycpKTtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmNsYXNzIERCVVdlYkNvbXBvbmVudER1bW15U2NyZWVuIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImRlbW8tc2NyZWVuXCI+XG5cbiAgICAgICAgPGRidS13ZWItY29tcG9uZW50LWR1bW15XG4gICAgICAgICAgc3R5bGU9e3sgY29sb3I6ICdibHVlJyB9fVxuICAgICAgICA+XG4gICAgICAgICAgPHNwYW4+aGVsbG8gMTwvc3Bhbj5cbiAgICAgICAgPC9kYnUtd2ViLWNvbXBvbmVudC1kdW1teT5cblxuICAgICAgICA8ZGJ1LXdlYi1jb21wb25lbnQtZHVtbXlcbiAgICAgICAgICBzdHlsZT17eyBjb2xvcjogJ2JsdWUnIH19XG4gICAgICAgID5cbiAgICAgICAgICA8c3Bhbj5oZWxsbyAyPC9zcGFuPlxuICAgICAgICA8L2RidS13ZWItY29tcG9uZW50LWR1bW15PlxuICAgICAgICA8ZGJ1LXdlYi1jb21wb25lbnQtZHVtbXktcGFyZW50PmhlbGxvIDM8L2RidS13ZWItY29tcG9uZW50LWR1bW15LXBhcmVudD5cblxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBEQlVXZWJDb21wb25lbnREdW1teVNjcmVlbjtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1xuICBEcmFnZ2FibGUsIERpc2FibGVTZWxlY3Rpb25cbn0gZnJvbSAnZGV2LWJveC11aSc7XG5cbmNsYXNzIFRvUmVuZGVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIC8vIGNvbnNvbGUubG9nKCdUb1JlbmRlciNyZW5kZXInKTtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBzdHlsZT17eyB3aWR0aDogMzAwLCBoZWlnaHQ6IDMwMCB9fVxuICAgICAgICBvbk1vdXNlRG93bj17dGhpcy5wcm9wcy5vbk1vdXNlRG93bn1cbiAgICAgICAgb25Nb3VzZVVwPXt0aGlzLnByb3BzLm9uTW91c2VVcH1cbiAgICAgICAgb25DbGljaz17dGhpcy5wcm9wcy5vbkNsaWNrfVxuICAgICAgICBvblRvdWNoU3RhcnQ9e3RoaXMucHJvcHMub25Ub3VjaFN0YXJ0fVxuICAgICAgICBvblRvdWNoRW5kPXt0aGlzLnByb3BzLm9uVG91Y2hFbmR9XG4gICAgICA+XG4gICAgICAgIDxwPmRyYWdnYWJsZSBwIHt0aGlzLnByb3BzLmNvdW50ZXJ9IDxhIGhyZWY9XCJodHRwOi8vZ29vZ2xlLmNvbVwiIHRhcmdldD1cIl9ibGFua1wiPmxpbms8L2E+PC9wPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5jbGFzcyBEcmFnZ2FibGVTY3JlZW4gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLmhhbmRsZU1vdXNlRG93biA9IHRoaXMuaGFuZGxlTW91c2VEb3duLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVUb3VjaFN0YXJ0ID0gdGhpcy5oYW5kbGVUb3VjaFN0YXJ0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVNb3VzZVVwID0gdGhpcy5oYW5kbGVNb3VzZVVwLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVUb3VjaEVuZCA9IHRoaXMuaGFuZGxlVG91Y2hFbmQuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZUNsaWNrID0gdGhpcy5oYW5kbGVDbGljay5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5jb3VudGVyID0gMTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZHJhZ2dhYmxlQ29udGVudDogdGhpcy5kcmFnZ2FibGVDb250ZW50XG4gICAgfTtcbiAgfVxuXG4gIGdldCBkcmFnZ2FibGVDb250ZW50KCkge1xuICAgIHJldHVybiAoXG4gICAgICA8VG9SZW5kZXJcbiAgICAgICAgb25Nb3VzZURvd249e3RoaXMuaGFuZGxlTW91c2VEb3dufVxuICAgICAgICBvbk1vdXNlVXA9e3RoaXMuaGFuZGxlTW91c2VVcH1cbiAgICAgICAgb25Ub3VjaFN0YXJ0PXt0aGlzLmhhbmRsZVRvdWNoU3RhcnR9XG4gICAgICAgIG9uVG91Y2hFbmQ9e3RoaXMuaGFuZGxlVG91Y2hFbmR9XG4gICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9XG4gICAgICAgIGNvdW50ZXI9e3RoaXMuY291bnRlcn1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIGhhbmRsZU1vdXNlRG93bihldnQpIHtcbiAgICBjb25zb2xlLmxvZygnRHJhZ2dhYmxlU2NyZWVuI2hhbmRsZU1vdXNlRG93bicpO1xuICB9XG4gIGhhbmRsZU1vdXNlVXAoZXZ0KSB7XG4gICAgY29uc29sZS5sb2coJ0RyYWdnYWJsZVNjcmVlbiNoYW5kbGVNb3VzZVVwJyk7XG4gIH1cbiAgaGFuZGxlVG91Y2hTdGFydChldnQpIHtcbiAgICBjb25zb2xlLmxvZygnRHJhZ2dhYmxlU2NyZWVuI2hhbmRsZVRvdWNoU3RhcnQnKTtcbiAgfVxuICBoYW5kbGVUb3VjaEVuZChldnQpIHtcbiAgICBjb25zb2xlLmxvZygnRHJhZ2dhYmxlU2NyZWVuI2hhbmRsZVRvdWNoRW5kJyk7XG4gIH1cbiAgaGFuZGxlQ2xpY2soZXZ0KSB7XG4gICAgY29uc29sZS5sb2coJ0RyYWdnYWJsZVNjcmVlbiNoYW5kbGVDbGljaycpO1xuICAgIC8vIHRoaXMuY291bnRlciA9IHRoaXMuY291bnRlciArIDE7XG4gICAgLy8gdGhpcy5zZXRTdGF0ZSh7XG4gICAgLy8gICBkcmFnZ2FibGVDb250ZW50OiB0aGlzLmRyYWdnYWJsZUNvbnRlbnRcbiAgICAvLyB9KTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5jb3VudGVyID0gdGhpcy5jb3VudGVyICsgMTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBkcmFnZ2FibGVDb250ZW50OiB0aGlzLmRyYWdnYWJsZUNvbnRlbnRcbiAgICAgIH0pO1xuICAgIH0sIDMwMDApO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImRlbW8tc2NyZWVuXCI+XG4gICAgICAgIDxEcmFnZ2FibGUgc3R5bGU9e3sgYm9yZGVyOiAnMXB4IHNvbGlkIGJsdWUnLCB3aWR0aDogMjAwLCBoZWlnaHQ6IDIwMCwgb3ZlcmZsb3dYOiAnc2Nyb2xsJywgb3ZlcmZsb3dZOiAnc2Nyb2xsJyB9fT5cbiAgICAgICAgICB7dGhpcy5zdGF0ZS5kcmFnZ2FibGVDb250ZW50fVxuICAgICAgICA8L0RyYWdnYWJsZT5cbiAgICAgICAgPERpc2FibGVTZWxlY3Rpb24+XG4gICAgICAgICAgPHA+ZGlzYWJsZWQgc2VsZWN0aW9uPC9wPlxuICAgICAgICA8L0Rpc2FibGVTZWxlY3Rpb24+XG4gICAgICAgIHtBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMCB9KS5tYXAoKGVsLCBpKSA9PiA8cCBrZXk9e2l9PntpfSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS08L3A+KX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRHJhZ2dhYmxlU2NyZWVuO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7XG4gIEZvcm1JbnB1dE51bWJlclxufSBmcm9tICdkZXYtYm94LXVpJztcblxuXG5jbGFzcyBGb3JtSW5wdXROdW1iZXJTY3JlZW4gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgaW5wdXRWYWx1ZTogLTcuMDhcbiAgICB9O1xuICAgIHRoaXMuaGFuZGxlQ2hhbmdlID0gdGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGhhbmRsZUNoYW5nZShpbnB1dFZhbHVlKSB7XG4gICAgY29uc3QgdmFsdWVUb1NlbmRCYWNrID0gTnVtYmVyKGlucHV0VmFsdWUudG9QcmVjaXNpb24oMTYpKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGlucHV0VmFsdWU6IHZhbHVlVG9TZW5kQmFja1xuICAgIH0pO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImRlbW8tc2NyZWVuXCI+XG4gICAgICAgIDxGb3JtSW5wdXROdW1iZXJcbiAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS5pbnB1dFZhbHVlfVxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX1cbiAgICAgICAgICBkZWZhdWx0RGVjUG9pbnQ9XCIsXCJcbiAgICAgICAgICBkZWZhdWx0VGhvdXNhbmRzU2VwYXJhdG9yPVwiLlwiXG4gICAgICAgIC8+XG4gICAgICAgIDxGb3JtSW5wdXROdW1iZXJcbiAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS5pbnB1dFZhbHVlfVxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX1cbiAgICAgICAgLz5cbiAgICAgICAgPHA+e3RoaXMuc3RhdGUuaW5wdXRWYWx1ZX17J1xcdTAwQTAnfTwvcD5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRm9ybUlucHV0TnVtYmVyU2NyZWVuO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7XG4gIEZvcm1JbnB1dFxufSBmcm9tICdkZXYtYm94LXVpJztcblxuXG5jbGFzcyBGb3JtSW5wdXRTY3JlZW4gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgaW5wdXRWYWx1ZTogNlxuICAgIH07XG4gICAgdGhpcy5oYW5kbGVDaGFuZ2UgPSB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaGFuZGxlQ2hhbmdlKGlucHV0VmFsdWUpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGlucHV0VmFsdWVcbiAgICB9KTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJkZW1vLXNjcmVlblwiPlxuICAgICAgICA8Rm9ybUlucHV0XG4gICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUuaW5wdXRWYWx1ZX1cbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9XG4gICAgICAgICAgaGFzV2FybmluZz17ZmFsc2V9XG4gICAgICAgICAgaGFzRXJyb3I9e2ZhbHNlfVxuICAgICAgICAgIGRpc2FibGVkPXtmYWxzZX1cbiAgICAgICAgLz5cbiAgICAgICAgPHA+e3RoaXMuc3RhdGUuaW5wdXRWYWx1ZX17J1xcdTAwQTAnfTwvcD5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRm9ybUlucHV0U2NyZWVuO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7XG4gIEhlbGxvXG59IGZyb20gJ2Rldi1ib3gtdWknO1xuXG5jbGFzcyBIZWxsb1NjcmVlbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgLyogZXNsaW50IG5vLWNvbnNvbGU6IDAgKi9cbiAgICAgIC8vIGNvbnNvbGUubG9nKCdyZW5kZXJpbmcgSGVsbG9TY3JlZW4gY29tcG9uZW50Jyk7XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImRlbW8tc2NyZWVuXCI+XG4gICAgICAgIDxIZWxsbyAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBIZWxsb1NjcmVlbjtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1xuICBMaXN0XG59IGZyb20gJ2Rldi1ib3gtdWknO1xuXG5jbGFzcyBMaXN0U2NyZWVuIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImRlbW8tc2NyZWVuXCI+XG4gICAgICAgIDxMaXN0IGl0ZW1zPXtbJ3RocmVlJywgJ2ZvdXInXX0vPlxuICAgICAgICA8TGlzdCBpdGVtcz17Wyd0aHJlZScsICdmb3VyJ119Lz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTGlzdFNjcmVlbjtcbiIsImltcG9ydCBIZWxsb1NjcmVlbiBmcm9tICcuL0hlbGxvU2NyZWVuJztcbmltcG9ydCBMaXN0U2NyZWVuIGZyb20gJy4vTGlzdFNjcmVlbic7XG5pbXBvcnQgRm9ybUlucHV0U2NyZWVuIGZyb20gJy4vRm9ybUlucHV0U2NyZWVuJztcbmltcG9ydCBGb3JtSW5wdXROdW1iZXJTY3JlZW4gZnJvbSAnLi9Gb3JtSW5wdXROdW1iZXJTY3JlZW4nO1xuaW1wb3J0IERyYWdnYWJsZSBmcm9tICcuL0RyYWdnYWJsZVNjcmVlbic7XG5pbXBvcnQgREJVV2ViQ29tcG9uZW50RHVtbXlTY3JlZW4gZnJvbSAnLi9EQlVXZWJDb21wb25lbnREdW1teVNjcmVlbic7XG5cblxuY29uc3Qgc2NyZWVucyA9IHtcbiAgSGVsbG9TY3JlZW4sXG4gIExpc3RTY3JlZW4sXG4gIEZvcm1JbnB1dFNjcmVlbixcbiAgRm9ybUlucHV0TnVtYmVyU2NyZWVuLFxuICBEcmFnZ2FibGUsXG4gIERCVVdlYkNvbXBvbmVudER1bW15U2NyZWVuLFxuICAnREJVV2ViQ29tcG9uZW50RHVtbXlTY3JlZW4uaHRtbCc6IG51bGwsXG4gICdEQlVXZWJDb21wb25lbnREdW1teVBhcmVudFNjcmVlbi5odG1sJzogbnVsbFxufTtcblxuY29uc3Qgc2NyZWVuTGlua05hbWVzID0ge1xuICBIZWxsb1NjcmVlbjogJ0hlbGxvIC0gUmVhY3QnLFxuICBMaXN0U2NyZWVuOiAnTGlzdCAtIFJlYWN0JyxcbiAgRm9ybUlucHV0U2NyZWVuOiAnRm9ybSBJbnB1dCAtIFJlYWN0JyxcbiAgRm9ybUlucHV0TnVtYmVyU2NyZWVuOiAnRm9ybSBJbnB1dCBOdW1iZXIgLSBSZWFjdCcsXG4gIERyYWdnYWJsZTogJ0RyYWdnYWJsZSAtIFJlYWN0JyxcbiAgREJVV2ViQ29tcG9uZW50RHVtbXlTY3JlZW46ICdEdW1teSAtIFJlYWN0JyxcbiAgJ0RCVVdlYkNvbXBvbmVudER1bW15U2NyZWVuLmh0bWwnOiAnRHVtbXkgLSBXZWIgQ29tcG9uZW50JyxcbiAgJ0RCVVdlYkNvbXBvbmVudER1bW15UGFyZW50U2NyZWVuLmh0bWwnOiAnRHVtbXkgUGFyZW50IC0gV2ViIENvbXBvbmVudCdcbn07XG5cbmV4cG9ydCB7XG4gIHNjcmVlbnMsXG4gIHNjcmVlbkxpbmtOYW1lc1xufTtcbiJdfQ==
