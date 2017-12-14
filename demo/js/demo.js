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

},{"./../services/I18nService":4,"./../services/LocaleService":5,"hoist-non-react-statics":1,"react":"react"}],4:[function(require,module,exports){
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

},{"./LocaleService":5}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{"../../services/LocaleService":5,"../internals/ensureSingleRegistration":11}],7:[function(require,module,exports){
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
        width: 400px;
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

},{"../DBUWebComponentBase/DBUWebComponentBase":6,"../internals/ensureSingleRegistration":11}],8:[function(require,module,exports){
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
      :host {display: inline-block;}
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

},{"../DBUWebComponentBase/DBUWebComponentBase":6,"../DBUWebComponentDummy/DBUWebComponentDummy":7,"../internals/ensureSingleRegistration":11}],9:[function(require,module,exports){
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

},{"../internals/appendStyle":10}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
(function (process){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

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
      { className: 'demo-wrapper' },
      _react2.default.createElement(
        'div',
        { className: 'demo-links' },
        _react2.default.createElement(
          'div',
          { className: 'locale-dir-switch' },
          _react2.default.createElement(
            'a',
            { href: '#', onClick: this.toggleAppDir },
            'Toggle Locale Dir'
          )
        ),
        links
      ),
      _react2.default.createElement(
        'div',
        { className: 'demo-area' },
        _react2.default.createElement(Screen, null)
      )
    );
  }
}

exports.default = App;

}).call(this,require('_process'))

},{"../src/lib/HOC/localeAware":3,"./screens":20,"_process":2,"prop-types":"prop-types","react":"react"}],13:[function(require,module,exports){
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

},{"../src/lib/webcomponents/DBUWebComponentDummy/DBUWebComponentDummy":7,"../src/lib/webcomponents/DBUWebComponentDummyParent/DBUWebComponentDummyParent":8,"../src/lib/webcomponents/DBUWebComponentsSetup/DBUWebComponentsSetup":9,"./app":12,"_process":2,"dev-box-ui":"dev-box-ui","prop-types":"prop-types","react":"react","react-dom":"react-dom"}],14:[function(require,module,exports){
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
      null,
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

},{"react":"react"}],15:[function(require,module,exports){
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
      null,
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

},{"dev-box-ui":"dev-box-ui","react":"react"}],16:[function(require,module,exports){
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
      null,
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

},{"dev-box-ui":"dev-box-ui","react":"react"}],17:[function(require,module,exports){
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
      null,
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

},{"dev-box-ui":"dev-box-ui","react":"react"}],18:[function(require,module,exports){
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
      null,
      _react2.default.createElement(_devBoxUi.Hello, null)
    );
  }
}

exports.default = HelloScreen;

}).call(this,require('_process'))

},{"_process":2,"dev-box-ui":"dev-box-ui","react":"react"}],19:[function(require,module,exports){
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
      null,
      _react2.default.createElement(_devBoxUi.List, { items: ['three', 'four'] }),
      _react2.default.createElement(_devBoxUi.List, { items: ['three', 'four'] })
    );
  }
}

exports.default = ListScreen;

},{"dev-box-ui":"dev-box-ui","react":"react"}],20:[function(require,module,exports){
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

},{"./DBUWebComponentDummyScreen":14,"./DraggableScreen":15,"./FormInputNumberScreen":16,"./FormInputScreen":17,"./HelloScreen":18,"./ListScreen":19}]},{},[13])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvaG9pc3Qtbm9uLXJlYWN0LXN0YXRpY3MvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwic3JjL2xpYi9IT0MvbG9jYWxlQXdhcmUuanMiLCJzcmMvbGliL3NlcnZpY2VzL0kxOG5TZXJ2aWNlLmpzIiwic3JjL2xpYi9zZXJ2aWNlcy9Mb2NhbGVTZXJ2aWNlLmpzIiwic3JjL2xpYi93ZWJjb21wb25lbnRzL0RCVVdlYkNvbXBvbmVudEJhc2UvREJVV2ViQ29tcG9uZW50QmFzZS5qcyIsInNyYy9saWIvd2ViY29tcG9uZW50cy9EQlVXZWJDb21wb25lbnREdW1teS9EQlVXZWJDb21wb25lbnREdW1teS5qcyIsInNyYy9saWIvd2ViY29tcG9uZW50cy9EQlVXZWJDb21wb25lbnREdW1teVBhcmVudC9EQlVXZWJDb21wb25lbnREdW1teVBhcmVudC5qcyIsInNyYy9saWIvd2ViY29tcG9uZW50cy9EQlVXZWJDb21wb25lbnRzU2V0dXAvREJVV2ViQ29tcG9uZW50c1NldHVwLmpzIiwic3JjL2xpYi93ZWJjb21wb25lbnRzL2ludGVybmFscy9hcHBlbmRTdHlsZS5qcyIsInNyYy9saWIvd2ViY29tcG9uZW50cy9pbnRlcm5hbHMvZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uLmpzIiwic3JjRGVtby9hcHAuanMiLCJzcmNEZW1vL2RlbW8uanMiLCJzcmNEZW1vL3NjcmVlbnMvREJVV2ViQ29tcG9uZW50RHVtbXlTY3JlZW4uanMiLCJzcmNEZW1vL3NjcmVlbnMvRHJhZ2dhYmxlU2NyZWVuLmpzIiwic3JjRGVtby9zY3JlZW5zL0Zvcm1JbnB1dE51bWJlclNjcmVlbi5qcyIsInNyY0RlbW8vc2NyZWVucy9Gb3JtSW5wdXRTY3JlZW4uanMiLCJzcmNEZW1vL3NjcmVlbnMvSGVsbG9TY3JlZW4uanMiLCJzcmNEZW1vL3NjcmVlbnMvTGlzdFNjcmVlbi5qcyIsInNyY0RlbW8vc2NyZWVucy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QURTO0FBRXRCLGNBQVksY0FGVTtBQUd0QixtQkFBaUIsb0JBSEs7QUFJdEIseUJBQXVCLDJCQUpEO0FBS3RCLGFBQVcsbUJBTFc7QUFNdEIsOEJBQTRCLGVBTk47QUFPdEIscUNBQW1DLHVCQVBiO0FBUXRCLDJDQUF5QztBQVJuQixDQUF4Qjs7UUFZRSxPLEdBQUEsTztRQUNBLGUsR0FBQSxlIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTUsIFlhaG9vISBJbmMuXG4gKiBDb3B5cmlnaHRzIGxpY2Vuc2VkIHVuZGVyIHRoZSBOZXcgQlNEIExpY2Vuc2UuIFNlZSB0aGUgYWNjb21wYW55aW5nIExJQ0VOU0UgZmlsZSBmb3IgdGVybXMuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIFJFQUNUX1NUQVRJQ1MgPSB7XG4gICAgY2hpbGRDb250ZXh0VHlwZXM6IHRydWUsXG4gICAgY29udGV4dFR5cGVzOiB0cnVlLFxuICAgIGRlZmF1bHRQcm9wczogdHJ1ZSxcbiAgICBkaXNwbGF5TmFtZTogdHJ1ZSxcbiAgICBnZXREZWZhdWx0UHJvcHM6IHRydWUsXG4gICAgbWl4aW5zOiB0cnVlLFxuICAgIHByb3BUeXBlczogdHJ1ZSxcbiAgICB0eXBlOiB0cnVlXG59O1xuXG52YXIgS05PV05fU1RBVElDUyA9IHtcbiAgbmFtZTogdHJ1ZSxcbiAgbGVuZ3RoOiB0cnVlLFxuICBwcm90b3R5cGU6IHRydWUsXG4gIGNhbGxlcjogdHJ1ZSxcbiAgY2FsbGVlOiB0cnVlLFxuICBhcmd1bWVudHM6IHRydWUsXG4gIGFyaXR5OiB0cnVlXG59O1xuXG52YXIgZGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG52YXIgZ2V0T3duUHJvcGVydHlOYW1lcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzO1xudmFyIGdldE93blByb3BlcnR5U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG52YXIgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbnZhciBnZXRQcm90b3R5cGVPZiA9IE9iamVjdC5nZXRQcm90b3R5cGVPZjtcbnZhciBvYmplY3RQcm90b3R5cGUgPSBnZXRQcm90b3R5cGVPZiAmJiBnZXRQcm90b3R5cGVPZihPYmplY3QpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGhvaXN0Tm9uUmVhY3RTdGF0aWNzKHRhcmdldENvbXBvbmVudCwgc291cmNlQ29tcG9uZW50LCBibGFja2xpc3QpIHtcbiAgICBpZiAodHlwZW9mIHNvdXJjZUNvbXBvbmVudCAhPT0gJ3N0cmluZycpIHsgLy8gZG9uJ3QgaG9pc3Qgb3ZlciBzdHJpbmcgKGh0bWwpIGNvbXBvbmVudHNcblxuICAgICAgICBpZiAob2JqZWN0UHJvdG90eXBlKSB7XG4gICAgICAgICAgICB2YXIgaW5oZXJpdGVkQ29tcG9uZW50ID0gZ2V0UHJvdG90eXBlT2Yoc291cmNlQ29tcG9uZW50KTtcbiAgICAgICAgICAgIGlmIChpbmhlcml0ZWRDb21wb25lbnQgJiYgaW5oZXJpdGVkQ29tcG9uZW50ICE9PSBvYmplY3RQcm90b3R5cGUpIHtcbiAgICAgICAgICAgICAgICBob2lzdE5vblJlYWN0U3RhdGljcyh0YXJnZXRDb21wb25lbnQsIGluaGVyaXRlZENvbXBvbmVudCwgYmxhY2tsaXN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBrZXlzID0gZ2V0T3duUHJvcGVydHlOYW1lcyhzb3VyY2VDb21wb25lbnQpO1xuXG4gICAgICAgIGlmIChnZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcbiAgICAgICAgICAgIGtleXMgPSBrZXlzLmNvbmNhdChnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoc291cmNlQ29tcG9uZW50KSk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuICAgICAgICAgICAgaWYgKCFSRUFDVF9TVEFUSUNTW2tleV0gJiYgIUtOT1dOX1NUQVRJQ1Nba2V5XSAmJiAoIWJsYWNrbGlzdCB8fCAhYmxhY2tsaXN0W2tleV0pKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRlc2NyaXB0b3IgPSBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc291cmNlQ29tcG9uZW50LCBrZXkpO1xuICAgICAgICAgICAgICAgIHRyeSB7IC8vIEF2b2lkIGZhaWx1cmVzIGZyb20gcmVhZC1vbmx5IHByb3BlcnRpZXNcbiAgICAgICAgICAgICAgICAgICAgZGVmaW5lUHJvcGVydHkodGFyZ2V0Q29tcG9uZW50LCBrZXksIGRlc2NyaXB0b3IpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGFyZ2V0Q29tcG9uZW50O1xuICAgIH1cblxuICAgIHJldHVybiB0YXJnZXRDb21wb25lbnQ7XG59O1xuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgaG9pc3ROb25SZWFjdFN0YXRpY3MgZnJvbSAnaG9pc3Qtbm9uLXJlYWN0LXN0YXRpY3MnO1xuaW1wb3J0IGxvY2FsZVNlcnZpY2UgZnJvbSAnLi8uLi9zZXJ2aWNlcy9Mb2NhbGVTZXJ2aWNlJztcbmltcG9ydCBpMThuU2VydmljZSBmcm9tICcuLy4uL3NlcnZpY2VzL0kxOG5TZXJ2aWNlJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbG9jYWxlQXdhcmUoQ29tcG9uZW50KSB7XG4gIGNsYXNzIExvY2FsZUF3YXJlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCkge1xuICAgICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xuICAgICAgdGhpcy5oYW5kbGVMb2NhbGVDaGFuZ2UgPSB0aGlzLmhhbmRsZUxvY2FsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy51bnJlZ2lzdGVyTG9jYWxlQ2hhbmdlID0gbnVsbDtcbiAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgIGxvY2FsZTogbG9jYWxlU2VydmljZS5sb2NhbGVcbiAgICAgIH07XG4gICAgICB0aGlzLl9tb3VudGVkID0gZmFsc2U7XG4gICAgICB0aGlzLl9jb21wb25lbnQgPSBudWxsO1xuICAgIH1cblxuICAgIGhhbmRsZUxvY2FsZUNoYW5nZShsb2NhbGUpIHtcbiAgICAgIHRoaXMuX21vdW50ZWQgJiYgdGhpcy5zdGF0ZS5sb2NhbGUgIT09IGxvY2FsZSAmJiB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgbG9jYWxlXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgIHRoaXMudW5yZWdpc3RlckxvY2FsZUNoYW5nZSA9IGxvY2FsZVNlcnZpY2Uub25Mb2NhbGVDaGFuZ2UodGhpcy5oYW5kbGVMb2NhbGVDaGFuZ2UpO1xuICAgICAgdGhpcy5fbW91bnRlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgICB0aGlzLl9tb3VudGVkID0gZmFsc2U7XG4gICAgICB0aGlzLnVucmVnaXN0ZXJMb2NhbGVDaGFuZ2UoKTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICBjb25zdCB7IGxvY2FsZSB9ID0gdGhpcy5zdGF0ZTtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxDb21wb25lbnQgeyAuLi50aGlzLnByb3BzIH1cbiAgICAgICAgICBsb2NhbGU9eyBsb2NhbGUgfVxuICAgICAgICAgIHRyYW5zbGF0aW9ucz17IGkxOG5TZXJ2aWNlLmN1cnJlbnRMYW5nVHJhbnNsYXRpb25zIH1cbiAgICAgICAgICByZWY9eyBjb21wID0+IHRoaXMuX2NvbXBvbmVudCA9IGNvbXAgfVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBMb2NhbGVBd2FyZS5kaXNwbGF5TmFtZSA9IGBMb2NhbGVBd2FyZSgke1xuICAgIENvbXBvbmVudC5kaXNwbGF5TmFtZSB8fFxuICAgIENvbXBvbmVudC5uYW1lIHx8XG4gICAgJ0NvbXBvbmVudCdcbiAgfSlgO1xuXG4gIHJldHVybiBob2lzdE5vblJlYWN0U3RhdGljcyhMb2NhbGVBd2FyZSwgQ29tcG9uZW50KTtcbn1cbiIsImltcG9ydCBsb2NhbGVTZXJ2aWNlIGZyb20gJy4vTG9jYWxlU2VydmljZSc7XG5cbmNvbnN0IGVtcHR5T2JqID0ge307XG5cbmNsYXNzIEkxOG5TZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgbG9jYWxlU2VydmljZS5vbkxvY2FsZUNoYW5nZSh0aGlzLl9oYW5kbGVMb2NhbGVDaGFuZ2UuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5fbG9jYWxlID0gbG9jYWxlU2VydmljZS5sb2NhbGU7XG4gICAgdGhpcy5fdHJhbnNsYXRpb25zID0ge307XG4gIH1cblxuICBfaGFuZGxlTG9jYWxlQ2hhbmdlKGxvY2FsZSkge1xuICAgIHRoaXMuX2xvY2FsZSA9IGxvY2FsZTtcbiAgfVxuXG4gIGNsZWFyVHJhbnNsYXRpb25zKGxhbmcpIHtcbiAgICBkZWxldGUgdGhpcy5fdHJhbnNsYXRpb25zW2xhbmddO1xuICB9XG5cbiAgcmVnaXN0ZXJUcmFuc2xhdGlvbnModHJhbnNsYXRpb25zKSB7XG4gICAgdGhpcy5fdHJhbnNsYXRpb25zID0gT2JqZWN0LmtleXModHJhbnNsYXRpb25zKS5yZWR1Y2UoKGFjYywgbGFuZykgPT4ge1xuICAgICAgYWNjW2xhbmddID0ge1xuICAgICAgICAuLi50aGlzLl90cmFuc2xhdGlvbnNbbGFuZ10sXG4gICAgICAgIC4uLnRyYW5zbGF0aW9uc1tsYW5nXVxuICAgICAgfTtcbiAgICAgIHJldHVybiBhY2M7XG4gICAgfSwgdGhpcy5fdHJhbnNsYXRpb25zKTtcbiAgfVxuXG4gIHRyYW5zbGF0ZShtc2cpIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50TGFuZ1RyYW5zbGF0aW9uc1ttc2ddO1xuICB9XG5cbiAgZ2V0IHRyYW5zbGF0aW9ucygpIHtcbiAgICByZXR1cm4gdGhpcy5fdHJhbnNsYXRpb25zO1xuICB9XG5cbiAgZ2V0IGN1cnJlbnRMYW5nVHJhbnNsYXRpb25zKCkge1xuICAgIHJldHVybiB0aGlzLl90cmFuc2xhdGlvbnNbdGhpcy5fbG9jYWxlLmxhbmddIHx8IGVtcHR5T2JqO1xuICB9XG59XG5cbmNvbnN0IGkxOG5TZXJ2aWNlID0gbmV3IEkxOG5TZXJ2aWNlKCk7XG5leHBvcnQgZGVmYXVsdCBpMThuU2VydmljZTtcbiIsIlxuY29uc3QgZGVmYXVsdExvY2FsZSA9IHtcbiAgZGlyOiAnbHRyJyxcbiAgbGFuZzogJ2VuJ1xufTtcblxuY2xhc3MgTG9jYWxlU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX2NhbGxiYWNrcyA9IFtdO1xuICAgIHRoaXMuX2xvY2FsZUF0dHJzID0gT2JqZWN0LmtleXMoZGVmYXVsdExvY2FsZSk7XG4gICAgdGhpcy5fcm9vdEVsZW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgIHRoaXMuX2xvY2FsZUF0dHJzLmZvckVhY2goKGF0dHIpID0+IHtcbiAgICAgIGlmICghdGhpcy5fcm9vdEVsZW1lbnQuZ2V0QXR0cmlidXRlKGF0dHIpKSB7XG4gICAgICAgIHRoaXMuX3Jvb3RFbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyLCBkZWZhdWx0TG9jYWxlW2F0dHJdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLl9sb2NhbGUgPSB0aGlzLl9sb2NhbGVBdHRycy5yZWR1Y2UoKGFjYywgYXR0cikgPT4ge1xuICAgICAgYWNjW2F0dHJdID0gdGhpcy5fcm9vdEVsZW1lbnQuZ2V0QXR0cmlidXRlKGF0dHIpO1xuICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCB7fSk7XG4gICAgdGhpcy5fb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcih0aGlzLl9oYW5kbGVNdXRhdGlvbnMuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5fb2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLl9yb290RWxlbWVudCwge1xuICAgICAgYXR0cmlidXRlczogdHJ1ZVxuICAgIH0pO1xuICB9XG5cbiAgX2hhbmRsZU11dGF0aW9ucyhtdXRhdGlvbnMpIHtcbiAgICBtdXRhdGlvbnMuZm9yRWFjaCgobXV0YXRpb24pID0+IHtcbiAgICAgIGNvbnN0IG11dGF0aW9uQXR0cmlidXRlTmFtZSA9IG11dGF0aW9uLmF0dHJpYnV0ZU5hbWU7XG4gICAgICBpZiAodGhpcy5fbG9jYWxlQXR0cnMuaW5jbHVkZXMobXV0YXRpb25BdHRyaWJ1dGVOYW1lKSkge1xuICAgICAgICB0aGlzLl9sb2NhbGUgPSB7XG4gICAgICAgICAgLi4udGhpcy5fbG9jYWxlLFxuICAgICAgICAgIFttdXRhdGlvbkF0dHJpYnV0ZU5hbWVdOiB0aGlzLl9yb290RWxlbWVudC5nZXRBdHRyaWJ1dGUobXV0YXRpb25BdHRyaWJ1dGVOYW1lKVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9jYWxsYmFja3MuZm9yRWFjaChjYWxsYmFjayA9PiBjYWxsYmFjayh0aGlzLl9sb2NhbGUpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHNldCBsb2NhbGUobG9jYWxlT2JqKSB7XG4gICAgT2JqZWN0LmtleXMobG9jYWxlT2JqKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIHRoaXMuX3Jvb3RFbGVtZW50LnNldEF0dHJpYnV0ZShrZXksIGxvY2FsZU9ialtrZXldKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldCBsb2NhbGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xvY2FsZTtcbiAgfVxuXG4gIG9uTG9jYWxlQ2hhbmdlKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuICAgIGNhbGxiYWNrKHRoaXMubG9jYWxlKTtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzLmZpbHRlcihjYiA9PiBjYiAhPT0gY2FsbGJhY2spO1xuICAgIH07XG4gIH1cbn1cblxuY29uc3QgbG9jYWxlU2VydmljZSA9IG5ldyBMb2NhbGVTZXJ2aWNlKCk7XG5leHBvcnQgZGVmYXVsdCBsb2NhbGVTZXJ2aWNlO1xuIiwiXG5pbXBvcnQgTG9jYWxlU2VydmljZSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9Mb2NhbGVTZXJ2aWNlJztcbmltcG9ydCBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24gZnJvbSAnLi4vaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbic7XG5cbmNvbnN0IHJlZ2lzdHJhdGlvbk5hbWUgPSAnREJVV2ViQ29tcG9uZW50QmFzZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldERCVVdlYkNvbXBvbmVudEJhc2Uod2luKSB7XG4gIHJldHVybiBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24od2luLCByZWdpc3RyYXRpb25OYW1lLCAoKSA9PiB7XG4gICAgY29uc3QgeyBkb2N1bWVudCwgSFRNTEVsZW1lbnQsIGN1c3RvbUVsZW1lbnRzIH0gPSB3aW47XG5cbiAgICBjb25zdCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gJzxzdHlsZT48L3N0eWxlPjxzbG90Pjwvc2xvdD4nO1xuXG4gICAgY2xhc3MgREJVV2ViQ29tcG9uZW50QmFzZSBleHRlbmRzIEhUTUxFbGVtZW50IHtcblxuICAgICAgc3RhdGljIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IGRlcGVuZGVuY2llcygpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IHVzZVNoYWRvdygpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICBjb25zdCB7IHVzZVNoYWRvdyB9ID0gdGhpcy5jb25zdHJ1Y3RvcjtcbiAgICAgICAgaWYgKHVzZVNoYWRvdykge1xuICAgICAgICAgIHRoaXMuYXR0YWNoU2hhZG93KHsgbW9kZTogJ29wZW4nIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2luc2VydFRlbXBsYXRlKCk7XG5cbiAgICAgICAgdGhpcy5jb25uZWN0ZWRDYWxsYmFjayA9IHRoaXMuY29ubmVjdGVkQ2FsbGJhY2suYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5kaXNjb25uZWN0ZWRDYWxsYmFjayA9IHRoaXMuZGlzY29ubmVjdGVkQ2FsbGJhY2suYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5faGFuZGxlTG9jYWxlQ2hhbmdlID0gdGhpcy5faGFuZGxlTG9jYWxlQ2hhbmdlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMub25Mb2NhbGVDaGFuZ2UgJiYgKHRoaXMub25Mb2NhbGVDaGFuZ2UgPSB0aGlzLm9uTG9jYWxlQ2hhbmdlLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLnVucmVnaXN0ZXJMb2NhbGVDaGFuZ2UgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2JlZm9yZXVubG9hZCcsIHRoaXMuZGlzY29ubmVjdGVkQ2FsbGJhY2ssIGZhbHNlKTtcblxuICAgICAgICB0aGlzLnVucmVnaXN0ZXJMb2NhbGVDaGFuZ2UgPVxuICAgICAgICAgIExvY2FsZVNlcnZpY2Uub25Mb2NhbGVDaGFuZ2UodGhpcy5faGFuZGxlTG9jYWxlQ2hhbmdlKTtcbiAgICAgIH1cblxuICAgICAgZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHRoaXMudW5yZWdpc3RlckxvY2FsZUNoYW5nZSgpO1xuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignYmVmb3JldW5sb2FkJywgdGhpcy5kaXNjb25uZWN0ZWRDYWxsYmFjaywgZmFsc2UpO1xuICAgICAgfVxuXG4gICAgICBnZXQgY2hpbGRyZW5UcmVlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci51c2VTaGFkb3cgPyB0aGlzLnNoYWRvd1Jvb3QgOiB0aGlzO1xuICAgICAgfVxuXG4gICAgICBfaW5zZXJ0VGVtcGxhdGUoKSB7XG4gICAgICAgIGNvbnN0IHsgdGVtcGxhdGUgfSA9IHRoaXMuY29uc3RydWN0b3I7XG5cbiAgICAgICAgaWYgKHRlbXBsYXRlKSB7XG4gICAgICAgICAgdGhpcy5jaGlsZHJlblRyZWUuYXBwZW5kQ2hpbGQodGVtcGxhdGUuY29udGVudC5jbG9uZU5vZGUodHJ1ZSkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIF9oYW5kbGVMb2NhbGVDaGFuZ2UobG9jYWxlKSB7XG4gICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdkaXInLCBsb2NhbGUuZGlyKTtcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2xhbmcnLCBsb2NhbGUubGFuZyk7XG4gICAgICAgIHRoaXMub25Mb2NhbGVDaGFuZ2UgJiYgdGhpcy5vbkxvY2FsZUNoYW5nZShsb2NhbGUpO1xuICAgICAgfVxuXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyhrbGFzcykge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGtsYXNzLCAnY29tcG9uZW50U3R5bGUnLCB7XG4gICAgICAgIGdldCgpIHtcbiAgICAgICAgICByZXR1cm4ga2xhc3MudGVtcGxhdGUuY29udGVudC5xdWVyeVNlbGVjdG9yKCdzdHlsZScpLmlubmVySFRNTDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0KHZhbHVlKSB7XG4gICAgICAgICAga2xhc3MudGVtcGxhdGUuY29udGVudC5xdWVyeVNlbGVjdG9yKCdzdHlsZScpLmlubmVySFRNTCA9IHZhbHVlO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH0pO1xuXG4gICAgICBrbGFzcy5yZWdpc3RlclNlbGYgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlZ2lzdHJhdGlvbk5hbWUgPSBrbGFzcy5yZWdpc3RyYXRpb25OYW1lO1xuICAgICAgICBjb25zdCBkZXBlbmRlbmNpZXMgPSBrbGFzcy5kZXBlbmRlbmNpZXM7XG4gICAgICAgIC8vIE1ha2Ugc3VyZSBvdXIgZGVwZW5kZW5jaWVzIGFyZSByZWdpc3RlcmVkIGJlZm9yZSB3ZSByZWdpc3RlciBzZWxmXG4gICAgICAgIGRlcGVuZGVuY2llcy5mb3JFYWNoKChkZXBlbmRlbmN5KSA9PiBkZXBlbmRlbmN5LnJlZ2lzdGVyU2VsZigpKTtcbiAgICAgICAgLy8gRG9uJ3QgdHJ5IHRvIHJlZ2lzdGVyIHNlbGYgaWYgYWxyZWFkeSByZWdpc3RlcmVkXG4gICAgICAgIGlmIChjdXN0b21FbGVtZW50cy5nZXQocmVnaXN0cmF0aW9uTmFtZSkpIHJldHVybiByZWdpc3RyYXRpb25OYW1lO1xuICAgICAgICAvLyBHaXZlIGEgY2hhbmNlIHRvIG92ZXJyaWRlIHdlYi1jb21wb25lbnQgc3R5bGUgaWYgcHJvdmlkZWQgYmVmb3JlIGJlaW5nIHJlZ2lzdGVyZWQuXG4gICAgICAgIGNvbnN0IGNvbXBvbmVudFN0eWxlID0gKCh3aW4uREJVV2ViQ29tcG9uZW50cyB8fCB7fSlbcmVnaXN0cmF0aW9uTmFtZV0gfHwge30pLmNvbXBvbmVudFN0eWxlO1xuICAgICAgICBpZiAoY29tcG9uZW50U3R5bGUpIHtcbiAgICAgICAgICBrbGFzcy5jb21wb25lbnRTdHlsZSArPSBjb21wb25lbnRTdHlsZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBEbyByZWdpc3RyYXRpb25cbiAgICAgICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKHJlZ2lzdHJhdGlvbk5hbWUsIGtsYXNzKTtcbiAgICAgICAgcmV0dXJuIHJlZ2lzdHJhdGlvbk5hbWU7XG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBEQlVXZWJDb21wb25lbnRCYXNlLFxuICAgICAgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kc1xuICAgIH07XG4gIH0pO1xufVxuIiwiXG5pbXBvcnQgZ2V0REJVV2ViQ29tcG9uZW50QmFzZSBmcm9tICcuLi9EQlVXZWJDb21wb25lbnRCYXNlL0RCVVdlYkNvbXBvbmVudEJhc2UnO1xuaW1wb3J0IGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbiBmcm9tICcuLi9pbnRlcm5hbHMvZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uJztcblxuY29uc3QgcmVnaXN0cmF0aW9uTmFtZSA9ICdkYnUtd2ViLWNvbXBvbmVudC1kdW1teSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldERCVVdlYkNvbXBvbmVudER1bW15KHdpbikge1xuICByZXR1cm4gZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uKHdpbiwgcmVnaXN0cmF0aW9uTmFtZSwgKCkgPT4ge1xuICAgIGNvbnN0IHsgREJVV2ViQ29tcG9uZW50QmFzZSwgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyB9ID0gZ2V0REJVV2ViQ29tcG9uZW50QmFzZSh3aW4pO1xuICAgIGNvbnN0IHsgZG9jdW1lbnQgfSA9IHdpbjtcblxuICAgIGNvbnN0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBgXG4gICAgICA8c3R5bGU+XG4gICAgICA6aG9zdCB7XG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgICAgd2lkdGg6IDQwMHB4O1xuICAgICAgICBoZWlnaHQ6IDUwcHg7XG4gICAgICAgIGNvbG9yOiBtYXJvb247XG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIGdyYXk7XG4gICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgICB9XG4gICAgICBcbiAgICAgIDpob3N0IGIsIDpob3N0IGRpdlt4LWhhcy1zbG90XSBzcGFuW3gtc2xvdC13cmFwcGVyXSB7XG4gICAgICAgIHVuaWNvZGUtYmlkaTogYmlkaS1vdmVycmlkZTtcbiAgICAgICAgdGV4dC1zaGFkb3c6IHZhcigtLWR1bW15LWItdGV4dC1zaGFkb3csIG5vbmUpO1xuICAgICAgfVxuXG4gICAgICA6aG9zdChbZGlyPXJ0bF0pIGIge1xuICAgICAgICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgOmhvc3QoW2Rpcj1sdHJdKSBiIHtcbiAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiBvdmVybGluZTtcbiAgICAgIH1cblxuICAgICAgOmhvc3QoW2Rpcj1sdHJdKSAjY29udGFpbmVyID4gZGl2W2Rpcj1ydGxdLFxuICAgICAgOmhvc3QoW2Rpcj1ydGxdKSAjY29udGFpbmVyID4gZGl2W2Rpcj1sdHJdIHtcbiAgICAgICAgZGlzcGxheTogbm9uZTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgOmhvc3QgI2NvbnRhaW5lciA+IGRpdlt4LWhhcy1zbG90XSB7XG4gICAgICAgIG1hcmdpbi1sZWZ0OiAwcHg7XG4gICAgICB9XG4gICAgICBcbiAgICAgICNjb250YWluZXIge1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWZsb3c6IHJvdyBub3dyYXA7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBzdHJldGNoO1xuICAgICAgfVxuICAgICAgXG4gICAgICAjY29udGFpbmVyID4gZGl2IHtcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgZ3JheTtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogdmFyKC0tZHVtbXktaW5uZXItc2VjdGlvbnMtYm9yZGVyLXJhZGl1cywgMHB4KTtcbiAgICAgICAgZmxleDogMSAwIDAlO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBtYXJnaW46IDVweDtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgI2NvbnRhaW5lciA+IGRpdiA+IGRpdiB7XG4gICAgICAgIG1hcmdpbjogYXV0bztcbiAgICAgIH1cbiAgICAgIFxuICAgICAgPC9zdHlsZT5cbiAgICAgIFxuICAgICAgPGRpdiBpZD1cImNvbnRhaW5lclwiPlxuICAgICAgICA8ZGl2IGRpcj1cImx0clwiPlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8Yj5EdW1teSBzaGFkb3c8L2I+IFtMVFJdXG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICBcbiAgICAgICAgPGRpdiB4LWhhcy1zbG90PlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8c3Bhbj5bPC9zcGFuPjxzcGFuIHgtc2xvdC13cmFwcGVyPjxzbG90Pjwvc2xvdD48L3NwYW4+PHNwYW4+XTwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIFxuICAgICAgICA8ZGl2IGRpcj1cInJ0bFwiPlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8Yj5EdW1teSBzaGFkb3c8L2I+IFtSVExdXG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgYDtcblxuICAgIGNsYXNzIERCVVdlYkNvbXBvbmVudER1bW15IGV4dGVuZHMgREJVV2ViQ29tcG9uZW50QmFzZSB7XG4gICAgICBzdGF0aWMgZ2V0IHJlZ2lzdHJhdGlvbk5hbWUoKSB7XG4gICAgICAgIHJldHVybiByZWdpc3RyYXRpb25OYW1lO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlKCkge1xuICAgICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgICB9XG5cbiAgICAgIG9uTG9jYWxlQ2hhbmdlKGxvY2FsZSkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnb25Mb2NhbGVDaGFuZ2UnLCBsb2NhbGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMoREJVV2ViQ29tcG9uZW50RHVtbXkpO1xuXG4gICAgcmV0dXJuIERCVVdlYkNvbXBvbmVudER1bW15O1xuICB9KTtcbn1cblxuZ2V0REJVV2ViQ29tcG9uZW50RHVtbXkucmVnaXN0cmF0aW9uTmFtZSA9IHJlZ2lzdHJhdGlvbk5hbWU7XG5cbiIsIlxuXG5pbXBvcnQgZ2V0REJVV2ViQ29tcG9uZW50QmFzZSBmcm9tICcuLi9EQlVXZWJDb21wb25lbnRCYXNlL0RCVVdlYkNvbXBvbmVudEJhc2UnO1xuaW1wb3J0IGdldERCVVdlYkNvbXBvbmVudER1bW15IGZyb20gJy4uL0RCVVdlYkNvbXBvbmVudER1bW15L0RCVVdlYkNvbXBvbmVudER1bW15JztcbmltcG9ydCBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24gZnJvbSAnLi4vaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbic7XG5cbmNvbnN0IHJlZ2lzdHJhdGlvbk5hbWUgPSAnZGJ1LXdlYi1jb21wb25lbnQtZHVtbXktcGFyZW50JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0REJVV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQod2luKSB7XG4gIHJldHVybiBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24od2luLCByZWdpc3RyYXRpb25OYW1lLCAoKSA9PiB7XG4gICAgY29uc3QgeyBEQlVXZWJDb21wb25lbnRCYXNlLCBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzIH0gPSBnZXREQlVXZWJDb21wb25lbnRCYXNlKHdpbik7XG4gICAgY29uc3QgREJVV2ViQ29tcG9uZW50RHVtbXkgPSBnZXREQlVXZWJDb21wb25lbnREdW1teSh3aW4pO1xuXG4gICAgY29uc3QgeyBkb2N1bWVudCB9ID0gd2luO1xuXG4gICAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IGBcbiAgICAgIDxzdHlsZT5cbiAgICAgIDpob3N0IHtkaXNwbGF5OiBpbmxpbmUtYmxvY2s7fVxuICAgICAgPC9zdHlsZT5cbiAgICAgIDxkaXY+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGI+RHVtbXkgUGFyZW50IHNoYWRvdzwvYj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGRidS13ZWItY29tcG9uZW50LWR1bW15PjxzbG90Pjwvc2xvdD48L2RidS13ZWItY29tcG9uZW50LWR1bW15PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIGA7XG5cbiAgICBjbGFzcyBEQlVXZWJDb21wb25lbnREdW1teVBhcmVudCBleHRlbmRzIERCVVdlYkNvbXBvbmVudEJhc2Uge1xuICAgICAgc3RhdGljIGdldCByZWdpc3RyYXRpb25OYW1lKCkge1xuICAgICAgICByZXR1cm4gcmVnaXN0cmF0aW9uTmFtZTtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IGRlcGVuZGVuY2llcygpIHtcbiAgICAgICAgcmV0dXJuIFtEQlVXZWJDb21wb25lbnREdW1teV07XG4gICAgICB9XG5cbiAgICB9XG5cbiAgICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzKERCVVdlYkNvbXBvbmVudER1bW15UGFyZW50KTtcblxuICAgIHJldHVybiBEQlVXZWJDb21wb25lbnREdW1teVBhcmVudDtcbiAgfSk7XG59XG5cbmdldERCVVdlYkNvbXBvbmVudER1bW15UGFyZW50LnJlZ2lzdHJhdGlvbk5hbWUgPSByZWdpc3RyYXRpb25OYW1lO1xuXG4iLCJpbXBvcnQgYXBwZW5kU3R5bGUgZnJvbSAnLi4vaW50ZXJuYWxzL2FwcGVuZFN0eWxlJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZGJ1V2ViQ29tcG9uZW50c1NldFVwKHdpbikge1xuICByZXR1cm4ge1xuICAgIGFwcGVuZFN0eWxlOiBhcHBlbmRTdHlsZSh3aW4pXG4gIH07XG59XG4iLCIvKlxuREJVV2ViQ29tcG9uZW50QmFzZSAoZnJvbSB3aGljaCBhbGwgd2ViLWNvbXBvbmVudHMgaW5oZXJpdClcbndpbGwgcmVhZCBjb21wb25lbnRTdHlsZSBmcm9tIHdpbi5EQlVXZWJDb21wb25lbnRzXG53aGVuIGtsYXNzLnJlZ2lzdGVyU2VsZigpIGlzIGNhbGxlZCBnaXZpbmcgYSBjaGFuY2UgdG8gb3ZlcnJpZGUgZGVmYXVsdCB3ZWItY29tcG9uZW50IHN0eWxlXG5qdXN0IGJlZm9yZSBpdCBpcyByZWdpc3RlcmVkLlxuKi9cbmNvbnN0IGFwcGVuZFN0eWxlID0gKHdpbikgPT4gKHJlZ2lzdHJhdGlvbk5hbWUsIGNvbXBvbmVudFN0eWxlKSA9PiB7XG4gIGlmICghd2luLkRCVVdlYkNvbXBvbmVudHMpIHtcbiAgICB3aW4uREJVV2ViQ29tcG9uZW50cyA9IHt9O1xuICB9XG4gIHdpbi5EQlVXZWJDb21wb25lbnRzID0ge1xuICAgIC4uLndpbi5EQlVXZWJDb21wb25lbnRzLFxuICAgIFtyZWdpc3RyYXRpb25OYW1lXToge1xuICAgICAgLi4ud2luLkRCVVdlYkNvbXBvbmVudHNbcmVnaXN0cmF0aW9uTmFtZV0sXG4gICAgICBjb21wb25lbnRTdHlsZVxuICAgIH1cbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFwcGVuZFN0eWxlO1xuIiwiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbih3aW4sIG5hbWUsIGNhbGxiYWNrKSB7XG4gIGlmICghd2luLkRCVVdlYkNvbXBvbmVudHMpIHtcbiAgICB3aW4uREJVV2ViQ29tcG9uZW50cyA9IHsgcmVnaXN0cmF0aW9uczoge30gfTtcbiAgfSBlbHNlIGlmICghd2luLkRCVVdlYkNvbXBvbmVudHMucmVnaXN0cmF0aW9ucykge1xuICAgIHdpbi5EQlVXZWJDb21wb25lbnRzLnJlZ2lzdHJhdGlvbnMgPSB7fTtcbiAgfVxuXG4gIGxldCByZWdpc3RyYXRpb24gPSB3aW4uREJVV2ViQ29tcG9uZW50cy5yZWdpc3RyYXRpb25zW25hbWVdO1xuXG4gIGlmIChyZWdpc3RyYXRpb24pIHJldHVybiByZWdpc3RyYXRpb247XG5cbiAgcmVnaXN0cmF0aW9uID0gY2FsbGJhY2soKTtcbiAgd2luLkRCVVdlYkNvbXBvbmVudHMucmVnaXN0cmF0aW9uc1tuYW1lXSA9IHJlZ2lzdHJhdGlvbjtcblxuICByZXR1cm4gd2luLkRCVVdlYkNvbXBvbmVudHMucmVnaXN0cmF0aW9uc1tuYW1lXTtcbn1cblxuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgeyBzY3JlZW5zLCBzY3JlZW5MaW5rTmFtZXMgfSBmcm9tICcuL3NjcmVlbnMnO1xuaW1wb3J0IGxvY2FsZUF3YXJlIGZyb20gJy4uL3NyYy9saWIvSE9DL2xvY2FsZUF3YXJlJztcblxubGV0IElGcmFtZVNjcmVlbiA9IGNsYXNzIElGcmFtZVNjcmVlbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuaWZyYW1lTm9kZSA9IG51bGw7XG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xuICAgIGNvbnN0IHsgbG9jYWxlOiB7IGRpciB9IH0gPSBuZXh0UHJvcHM7XG4gICAgdGhpcy5pZnJhbWVOb2RlLmNvbnRlbnRXaW5kb3cucG9zdE1lc3NhZ2UoYGNoYW5nZURpciAke2Rpcn1gLCAnKicpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGlzUHJvZCA9ICF3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuaW5jbHVkZXMoJy5kZXYuJyk7XG4gICAgY29uc3Qgd2luZG93TG9jYXRpb25IYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2gucmVwbGFjZSgnIycsICcnKTtcbiAgICByZXR1cm4gKFxuICAgICAgPGlmcmFtZVxuICAgICAgICByZWY9eyhub2RlKSA9PiB0aGlzLmlmcmFtZU5vZGUgPSBub2RlfVxuICAgICAgICBzcmM9e2BzcmNEZW1vL3NjcmVlbnMvJHt3aW5kb3dMb2NhdGlvbkhhc2h9P3Byb2R1Y3Rpb249JHtpc1Byb2QgPyAnMScgOiAnMCd9YH0gLz5cbiAgICApO1xuICB9XG59O1xuSUZyYW1lU2NyZWVuLnByb3BUeXBlcyA9IHtcbiAgbG9jYWxlOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgIGRpcjogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBsYW5nOiBQcm9wVHlwZXMuc3RyaW5nXG4gIH0pXG59O1xuSUZyYW1lU2NyZWVuID0gbG9jYWxlQXdhcmUoSUZyYW1lU2NyZWVuKTtcblxuY2xhc3MgQXBwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLCB0aGlzLm9uSGFzaENoYW5nZS5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIG9uSGFzaENoYW5nZSgpIHtcbiAgICB0aGlzLmZvcmNlVXBkYXRlKCk7XG4gIH1cblxuICB0b2dnbGVBcHBEaXIoZXZ0KSB7XG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgZG9jdW1lbnRFbGVtZW50ID0gd2luZG93LmRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICBjb25zdCBjdXJyZW50RGlyID0gZG9jdW1lbnRFbGVtZW50LmdldEF0dHJpYnV0ZSgnZGlyJyk7XG4gICAgY29uc3QgbmV4dERpciA9IGN1cnJlbnREaXIgPT09ICdsdHInID8gJ3J0bCcgOiAnbHRyJztcbiAgICBkb2N1bWVudEVsZW1lbnQuc2V0QXR0cmlidXRlKCdkaXInLCBuZXh0RGlyKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgLyogZXNsaW50IG5vLWNvbnNvbGU6IDAgKi9cbiAgICAgIC8vIGNvbnNvbGUubG9nKCdyZW5kZXJpbmcgQXBwIGNvbXBvbmVudCcpO1xuICAgIH1cbiAgICBjb25zdCBzY3JlZW5zS2V5cyA9IE9iamVjdC5rZXlzKHNjcmVlbnMpO1xuICAgIGNvbnN0IGxpbmtzID0gPHVsPlxuICAgICAge1xuICAgICAgICBzY3JlZW5zS2V5cy5tYXAoKHNjcmVlbiwgaWR4KSA9PiAoXG4gICAgICAgICAgPGxpIGtleT17aWR4fT5cbiAgICAgICAgICAgIDxhIGtleT17aWR4fSBocmVmPXtgIyR7c2NyZWVufWB9PntzY3JlZW5MaW5rTmFtZXNbc2NyZWVuXSB8fCBzY3JlZW59PC9hPlxuICAgICAgICAgIDwvbGk+XG4gICAgICAgICkpXG4gICAgICB9XG4gICAgPC91bD47XG5cbiAgICBjb25zdCB3aW5kb3dMb2NhdGlvbkhhc2ggPSAod2luZG93LmxvY2F0aW9uLmhhc2ggfHwgYCMke3NjcmVlbnNLZXlzWzBdfWApLnJlcGxhY2UoJyMnLCAnJyk7XG4gICAgY29uc3QgU2NyZWVuID0gd2luZG93TG9jYXRpb25IYXNoLmVuZHNXaXRoKCcuaHRtbCcpID8gSUZyYW1lU2NyZWVuIDogc2NyZWVuc1t3aW5kb3dMb2NhdGlvbkhhc2hdO1xuXG4gICAgaWYgKCFTY3JlZW4pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImRlbW8td3JhcHBlclwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRlbW8tbGlua3NcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImxvY2FsZS1kaXItc3dpdGNoXCI+XG4gICAgICAgICAgICA8YSBocmVmPVwiI1wiIG9uQ2xpY2s9e3RoaXMudG9nZ2xlQXBwRGlyfT5Ub2dnbGUgTG9jYWxlIERpcjwvYT5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICB7bGlua3N9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRlbW8tYXJlYVwiPlxuICAgICAgICAgIDxTY3JlZW4vPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQXBwO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7XG4gIC8vIG9uU2NyZWVuQ29uc29sZSxcbiAgbG9jYWxlQXdhcmVcbn0gZnJvbSAnZGV2LWJveC11aSc7XG5pbXBvcnQgQXBwIGZyb20gJy4vYXBwJztcblxuLy8gaW1wb3J0IGdldERCVVdlYkNvbXBvbmVudER1bW15IGZyb20gJy4uL2J1aWxkL3NyYy9saWIvd2ViY29tcG9uZW50cy9EQlVXZWJDb21wb25lbnREdW1teS9EQlVXZWJDb21wb25lbnREdW1teSc7XG4vLyBpbXBvcnQgZ2V0REJVV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQgZnJvbSAnLi4vYnVpbGQvc3JjL2xpYi93ZWJjb21wb25lbnRzL0RCVVdlYkNvbXBvbmVudER1bW15UGFyZW50L0RCVVdlYkNvbXBvbmVudER1bW15UGFyZW50JztcbmltcG9ydCBkYnVXZWJDb21wb25lbnRzU2V0VXAgZnJvbSAnLi4vc3JjL2xpYi93ZWJjb21wb25lbnRzL0RCVVdlYkNvbXBvbmVudHNTZXR1cC9EQlVXZWJDb21wb25lbnRzU2V0dXAnO1xuaW1wb3J0IGdldERCVVdlYkNvbXBvbmVudER1bW15IGZyb20gJy4uL3NyYy9saWIvd2ViY29tcG9uZW50cy9EQlVXZWJDb21wb25lbnREdW1teS9EQlVXZWJDb21wb25lbnREdW1teSc7XG5pbXBvcnQgZ2V0REJVV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQgZnJvbSAnLi4vc3JjL2xpYi93ZWJjb21wb25lbnRzL0RCVVdlYkNvbXBvbmVudER1bW15UGFyZW50L0RCVVdlYkNvbXBvbmVudER1bW15UGFyZW50JztcblxuZGJ1V2ViQ29tcG9uZW50c1NldFVwKHdpbmRvdykuYXBwZW5kU3R5bGUoJ2RidS13ZWItY29tcG9uZW50LWR1bW15JywgYFxuICBiIHtcbiAgICBjb2xvcjogZGVlcHNreWJsdWU7XG4gICAgZm9udC1zdHlsZTogb2JsaXF1ZTtcbiAgfVxuYCk7XG5cbmNvbnN0IERCVVdlYkNvbXBvbmVudER1bW15ID0gZ2V0REJVV2ViQ29tcG9uZW50RHVtbXkod2luZG93KTtcbmNvbnN0IERCVVdlYkNvbXBvbmVudER1bW15UGFyZW50ID0gZ2V0REJVV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQod2luZG93KTtcblxuXG5zZXRUaW1lb3V0KCgpID0+IHtcbiAgREJVV2ViQ29tcG9uZW50RHVtbXkucmVnaXN0ZXJTZWxmKCk7XG4gIERCVVdlYkNvbXBvbmVudER1bW15UGFyZW50LnJlZ2lzdGVyU2VsZigpO1xufSwgMjAwMCk7XG5cbmNvbnN0IGlmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpO1xuXG53aW5kb3cub25tZXNzYWdlID0gZnVuY3Rpb24gKG1zZykgeyBjb25zb2xlLmxvZygnbXNnIGZyb20gaWZyYW1lJywgbXNnKTsgfTtcbmlmcmFtZS5vbmxvYWQgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gIGNvbnN0IHRhcmdldCA9IGV2dC50YXJnZXQ7XG5cbiAgdGFyZ2V0LmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQud3JpdGUoYFxuICAgIDxodG1sPlxuICAgIDxib2R5PlxuICAgICAgPGRidS13ZWItY29tcG9uZW50LWR1bW15XG4gICAgICAgIHN0eWxlPVwiY29sb3I6IGJsdWVcIlxuICAgICAgPlxuICAgICAgICA8c3Bhbj5oZWxsbyB3b3JsZCAzPC9zcGFuPlxuICAgICAgPC9kYnUtd2ViLWNvbXBvbmVudC1kdW1teT5cbiAgICAgIDxkYnUtd2ViLWNvbXBvbmVudC1kdW1teS1wYXJlbnQ+PC9kYnUtd2ViLWNvbXBvbmVudC1kdW1teS1wYXJlbnQ+XG4gICAgPC9ib2R5PlxuICAgIDxzY3JpcHQ+XG4gICAgICB3aW5kb3cub25tZXNzYWdlID0gZnVuY3Rpb24gKG1zZykge1xuICAgICAgICBjb25zb2xlLmxvZygnbXNnIGZyb20gd2luZG93JywgbXNnKTtcbiAgICAgICAgd2luZG93LnRvcC5wb3N0TWVzc2FnZSgnd29ybGQnLCAnKicpO1xuICAgICAgfTtcbiAgICA8L3NjcmlwdD5cbiAgICA8L2h0bWw+XG4gIGApO1xuICB0YXJnZXQuY29udGVudFdpbmRvdy5wb3N0TWVzc2FnZSgnaGVsbG8nLCAnKicpO1xuXG4gIGRidVdlYkNvbXBvbmVudHNTZXRVcCh0YXJnZXQuY29udGVudFdpbmRvdykuYXBwZW5kU3R5bGUoJ2RidS13ZWItY29tcG9uZW50LWR1bW15JywgYFxuICAgIGIge1xuICAgICAgZm9udC1zdHlsZTogb2JsaXF1ZTtcbiAgICAgIG9wYWNpdHk6IDAuNTtcbiAgICB9XG4gIGApO1xuICBjb25zdCBEQlVXZWJDb21wb25lbnREdW1teTIgPSBnZXREQlVXZWJDb21wb25lbnREdW1teSh0YXJnZXQuY29udGVudFdpbmRvdyk7XG4gIGNvbnN0IERCVVdlYkNvbXBvbmVudER1bW15UGFyZW50MiA9IGdldERCVVdlYkNvbXBvbmVudER1bW15UGFyZW50KHRhcmdldC5jb250ZW50V2luZG93KTtcbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgREJVV2ViQ29tcG9uZW50RHVtbXkyLnJlZ2lzdGVyU2VsZigpO1xuICAgIERCVVdlYkNvbXBvbmVudER1bW15UGFyZW50Mi5yZWdpc3RlclNlbGYoKTtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgLy8gdGFyZ2V0LnJlbW92ZSgpO1xuICAgIH0sIDIwMDApO1xuICB9LCAyMDAwKTtcbn07XG5cbi8vIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcblxuXG4vLyBvblNjcmVlbkNvbnNvbGUoeyBvcHRpb25zOiB7IHNob3dMYXN0T25seTogZmFsc2UgfSB9KTtcblxubGV0IERlbW8gPSBjbGFzcyBEZW1vIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAvKiBlc2xpbnQgbm8tY29uc29sZTogMCAqL1xuICAgICAgLy8gY29uc29sZS5sb2coJ3JlbmRlcmluZyBEZW1vIGNvbXBvbmVudCcpO1xuICAgIH1cbiAgICBjb25zdCB7IGxvY2FsZTogeyBkaXIgfSB9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gKFxuICAgICAgPEFwcCAvPlxuICAgICk7XG4gIH1cbn07XG5cbkRlbW8ucHJvcFR5cGVzID0ge1xuICBsb2NhbGU6IFByb3BUeXBlcy5vYmplY3Rcbn07XG5cbkRlbW8gPSBsb2NhbGVBd2FyZShEZW1vKTtcblxuUmVhY3RET00ucmVuZGVyKChcbiAgPERlbW8vPlxuKSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RlbW8nKSk7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5jbGFzcyBEQlVXZWJDb21wb25lbnREdW1teVNjcmVlbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cblxuICAgICAgICA8ZGJ1LXdlYi1jb21wb25lbnQtZHVtbXlcbiAgICAgICAgICBzdHlsZT17eyBjb2xvcjogJ2JsdWUnIH19XG4gICAgICAgID5cbiAgICAgICAgICA8c3Bhbj5oZWxsbyAxPC9zcGFuPlxuICAgICAgICA8L2RidS13ZWItY29tcG9uZW50LWR1bW15PlxuXG4gICAgICAgIDxkYnUtd2ViLWNvbXBvbmVudC1kdW1teVxuICAgICAgICAgIHN0eWxlPXt7IGNvbG9yOiAnYmx1ZScgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxzcGFuPmhlbGxvIDI8L3NwYW4+XG4gICAgICAgIDwvZGJ1LXdlYi1jb21wb25lbnQtZHVtbXk+XG4gICAgICAgIDxkYnUtd2ViLWNvbXBvbmVudC1kdW1teS1wYXJlbnQ+aGVsbG8gMzwvZGJ1LXdlYi1jb21wb25lbnQtZHVtbXktcGFyZW50PlxuXG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IERCVVdlYkNvbXBvbmVudER1bW15U2NyZWVuO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7XG4gIERyYWdnYWJsZSwgRGlzYWJsZVNlbGVjdGlvblxufSBmcm9tICdkZXYtYm94LXVpJztcblxuY2xhc3MgVG9SZW5kZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgLy8gY29uc29sZS5sb2coJ1RvUmVuZGVyI3JlbmRlcicpO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIHN0eWxlPXt7IHdpZHRoOiAzMDAsIGhlaWdodDogMzAwIH19XG4gICAgICAgIG9uTW91c2VEb3duPXt0aGlzLnByb3BzLm9uTW91c2VEb3dufVxuICAgICAgICBvbk1vdXNlVXA9e3RoaXMucHJvcHMub25Nb3VzZVVwfVxuICAgICAgICBvbkNsaWNrPXt0aGlzLnByb3BzLm9uQ2xpY2t9XG4gICAgICAgIG9uVG91Y2hTdGFydD17dGhpcy5wcm9wcy5vblRvdWNoU3RhcnR9XG4gICAgICAgIG9uVG91Y2hFbmQ9e3RoaXMucHJvcHMub25Ub3VjaEVuZH1cbiAgICAgID5cbiAgICAgICAgPHA+ZHJhZ2dhYmxlIHAge3RoaXMucHJvcHMuY291bnRlcn0gPGEgaHJlZj1cImh0dHA6Ly9nb29nbGUuY29tXCIgdGFyZ2V0PVwiX2JsYW5rXCI+bGluazwvYT48L3A+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmNsYXNzIERyYWdnYWJsZVNjcmVlbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuaGFuZGxlTW91c2VEb3duID0gdGhpcy5oYW5kbGVNb3VzZURvd24uYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZVRvdWNoU3RhcnQgPSB0aGlzLmhhbmRsZVRvdWNoU3RhcnQuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZU1vdXNlVXAgPSB0aGlzLmhhbmRsZU1vdXNlVXAuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZVRvdWNoRW5kID0gdGhpcy5oYW5kbGVUb3VjaEVuZC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlQ2xpY2sgPSB0aGlzLmhhbmRsZUNsaWNrLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLmNvdW50ZXIgPSAxO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBkcmFnZ2FibGVDb250ZW50OiB0aGlzLmRyYWdnYWJsZUNvbnRlbnRcbiAgICB9O1xuICB9XG5cbiAgZ2V0IGRyYWdnYWJsZUNvbnRlbnQoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxUb1JlbmRlclxuICAgICAgICBvbk1vdXNlRG93bj17dGhpcy5oYW5kbGVNb3VzZURvd259XG4gICAgICAgIG9uTW91c2VVcD17dGhpcy5oYW5kbGVNb3VzZVVwfVxuICAgICAgICBvblRvdWNoU3RhcnQ9e3RoaXMuaGFuZGxlVG91Y2hTdGFydH1cbiAgICAgICAgb25Ub3VjaEVuZD17dGhpcy5oYW5kbGVUb3VjaEVuZH1cbiAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVDbGlja31cbiAgICAgICAgY291bnRlcj17dGhpcy5jb3VudGVyfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgaGFuZGxlTW91c2VEb3duKGV2dCkge1xuICAgIGNvbnNvbGUubG9nKCdEcmFnZ2FibGVTY3JlZW4jaGFuZGxlTW91c2VEb3duJyk7XG4gIH1cbiAgaGFuZGxlTW91c2VVcChldnQpIHtcbiAgICBjb25zb2xlLmxvZygnRHJhZ2dhYmxlU2NyZWVuI2hhbmRsZU1vdXNlVXAnKTtcbiAgfVxuICBoYW5kbGVUb3VjaFN0YXJ0KGV2dCkge1xuICAgIGNvbnNvbGUubG9nKCdEcmFnZ2FibGVTY3JlZW4jaGFuZGxlVG91Y2hTdGFydCcpO1xuICB9XG4gIGhhbmRsZVRvdWNoRW5kKGV2dCkge1xuICAgIGNvbnNvbGUubG9nKCdEcmFnZ2FibGVTY3JlZW4jaGFuZGxlVG91Y2hFbmQnKTtcbiAgfVxuICBoYW5kbGVDbGljayhldnQpIHtcbiAgICBjb25zb2xlLmxvZygnRHJhZ2dhYmxlU2NyZWVuI2hhbmRsZUNsaWNrJyk7XG4gICAgLy8gdGhpcy5jb3VudGVyID0gdGhpcy5jb3VudGVyICsgMTtcbiAgICAvLyB0aGlzLnNldFN0YXRlKHtcbiAgICAvLyAgIGRyYWdnYWJsZUNvbnRlbnQ6IHRoaXMuZHJhZ2dhYmxlQ29udGVudFxuICAgIC8vIH0pO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLmNvdW50ZXIgPSB0aGlzLmNvdW50ZXIgKyAxO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGRyYWdnYWJsZUNvbnRlbnQ6IHRoaXMuZHJhZ2dhYmxlQ29udGVudFxuICAgICAgfSk7XG4gICAgfSwgMzAwMCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxEcmFnZ2FibGUgc3R5bGU9e3sgYm9yZGVyOiAnMXB4IHNvbGlkIGJsdWUnLCB3aWR0aDogMjAwLCBoZWlnaHQ6IDIwMCwgb3ZlcmZsb3dYOiAnc2Nyb2xsJywgb3ZlcmZsb3dZOiAnc2Nyb2xsJyB9fT5cbiAgICAgICAgICB7dGhpcy5zdGF0ZS5kcmFnZ2FibGVDb250ZW50fVxuICAgICAgICA8L0RyYWdnYWJsZT5cbiAgICAgICAgPERpc2FibGVTZWxlY3Rpb24+XG4gICAgICAgICAgPHA+ZGlzYWJsZWQgc2VsZWN0aW9uPC9wPlxuICAgICAgICA8L0Rpc2FibGVTZWxlY3Rpb24+XG4gICAgICAgIHtBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMCB9KS5tYXAoKGVsLCBpKSA9PiA8cCBrZXk9e2l9PntpfSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS08L3A+KX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRHJhZ2dhYmxlU2NyZWVuO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7XG4gIEZvcm1JbnB1dE51bWJlclxufSBmcm9tICdkZXYtYm94LXVpJztcblxuXG5jbGFzcyBGb3JtSW5wdXROdW1iZXJTY3JlZW4gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgaW5wdXRWYWx1ZTogLTcuMDhcbiAgICB9O1xuICAgIHRoaXMuaGFuZGxlQ2hhbmdlID0gdGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGhhbmRsZUNoYW5nZShpbnB1dFZhbHVlKSB7XG4gICAgY29uc3QgdmFsdWVUb1NlbmRCYWNrID0gTnVtYmVyKGlucHV0VmFsdWUudG9QcmVjaXNpb24oMTYpKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGlucHV0VmFsdWU6IHZhbHVlVG9TZW5kQmFja1xuICAgIH0pO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8Rm9ybUlucHV0TnVtYmVyXG4gICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUuaW5wdXRWYWx1ZX1cbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9XG4gICAgICAgICAgZGVmYXVsdERlY1BvaW50PVwiLFwiXG4gICAgICAgICAgZGVmYXVsdFRob3VzYW5kc1NlcGFyYXRvcj1cIi5cIlxuICAgICAgICAvPlxuICAgICAgICA8Rm9ybUlucHV0TnVtYmVyXG4gICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUuaW5wdXRWYWx1ZX1cbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9XG4gICAgICAgIC8+XG4gICAgICAgIDxwPnt0aGlzLnN0YXRlLmlucHV0VmFsdWV9eydcXHUwMEEwJ308L3A+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEZvcm1JbnB1dE51bWJlclNjcmVlbjtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1xuICBGb3JtSW5wdXRcbn0gZnJvbSAnZGV2LWJveC11aSc7XG5cblxuY2xhc3MgRm9ybUlucHV0U2NyZWVuIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGlucHV0VmFsdWU6IDZcbiAgICB9O1xuICAgIHRoaXMuaGFuZGxlQ2hhbmdlID0gdGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGhhbmRsZUNoYW5nZShpbnB1dFZhbHVlKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpbnB1dFZhbHVlXG4gICAgfSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxGb3JtSW5wdXRcbiAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS5pbnB1dFZhbHVlfVxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX1cbiAgICAgICAgICBoYXNXYXJuaW5nPXtmYWxzZX1cbiAgICAgICAgICBoYXNFcnJvcj17ZmFsc2V9XG4gICAgICAgICAgZGlzYWJsZWQ9e2ZhbHNlfVxuICAgICAgICAvPlxuICAgICAgICA8cD57dGhpcy5zdGF0ZS5pbnB1dFZhbHVlfXsnXFx1MDBBMCd9PC9wPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBGb3JtSW5wdXRTY3JlZW47XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtcbiAgSGVsbG9cbn0gZnJvbSAnZGV2LWJveC11aSc7XG5cbmNsYXNzIEhlbGxvU2NyZWVuIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAvKiBlc2xpbnQgbm8tY29uc29sZTogMCAqL1xuICAgICAgLy8gY29uc29sZS5sb2coJ3JlbmRlcmluZyBIZWxsb1NjcmVlbiBjb21wb25lbnQnKTtcbiAgICB9XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxIZWxsbyAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBIZWxsb1NjcmVlbjtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1xuICBMaXN0XG59IGZyb20gJ2Rldi1ib3gtdWknO1xuXG5jbGFzcyBMaXN0U2NyZWVuIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8TGlzdCBpdGVtcz17Wyd0aHJlZScsICdmb3VyJ119Lz5cbiAgICAgICAgPExpc3QgaXRlbXM9e1sndGhyZWUnLCAnZm91ciddfS8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExpc3RTY3JlZW47XG4iLCJpbXBvcnQgSGVsbG9TY3JlZW4gZnJvbSAnLi9IZWxsb1NjcmVlbic7XG5pbXBvcnQgTGlzdFNjcmVlbiBmcm9tICcuL0xpc3RTY3JlZW4nO1xuaW1wb3J0IEZvcm1JbnB1dFNjcmVlbiBmcm9tICcuL0Zvcm1JbnB1dFNjcmVlbic7XG5pbXBvcnQgRm9ybUlucHV0TnVtYmVyU2NyZWVuIGZyb20gJy4vRm9ybUlucHV0TnVtYmVyU2NyZWVuJztcbmltcG9ydCBEcmFnZ2FibGUgZnJvbSAnLi9EcmFnZ2FibGVTY3JlZW4nO1xuaW1wb3J0IERCVVdlYkNvbXBvbmVudER1bW15U2NyZWVuIGZyb20gJy4vREJVV2ViQ29tcG9uZW50RHVtbXlTY3JlZW4nO1xuXG5cbmNvbnN0IHNjcmVlbnMgPSB7XG4gIEhlbGxvU2NyZWVuLFxuICBMaXN0U2NyZWVuLFxuICBGb3JtSW5wdXRTY3JlZW4sXG4gIEZvcm1JbnB1dE51bWJlclNjcmVlbixcbiAgRHJhZ2dhYmxlLFxuICBEQlVXZWJDb21wb25lbnREdW1teVNjcmVlbixcbiAgJ0RCVVdlYkNvbXBvbmVudER1bW15U2NyZWVuLmh0bWwnOiBudWxsLFxuICAnREJVV2ViQ29tcG9uZW50RHVtbXlQYXJlbnRTY3JlZW4uaHRtbCc6IG51bGxcbn07XG5cbmNvbnN0IHNjcmVlbkxpbmtOYW1lcyA9IHtcbiAgSGVsbG9TY3JlZW46ICdIZWxsbyAtIFJlYWN0JyxcbiAgTGlzdFNjcmVlbjogJ0xpc3QgLSBSZWFjdCcsXG4gIEZvcm1JbnB1dFNjcmVlbjogJ0Zvcm0gSW5wdXQgLSBSZWFjdCcsXG4gIEZvcm1JbnB1dE51bWJlclNjcmVlbjogJ0Zvcm0gSW5wdXQgTnVtYmVyIC0gUmVhY3QnLFxuICBEcmFnZ2FibGU6ICdEcmFnZ2FibGUgLSBSZWFjdCcsXG4gIERCVVdlYkNvbXBvbmVudER1bW15U2NyZWVuOiAnRHVtbXkgLSBSZWFjdCcsXG4gICdEQlVXZWJDb21wb25lbnREdW1teVNjcmVlbi5odG1sJzogJ0R1bW15IC0gV2ViIENvbXBvbmVudCcsXG4gICdEQlVXZWJDb21wb25lbnREdW1teVBhcmVudFNjcmVlbi5odG1sJzogJ0R1bW15IFBhcmVudCAtIFdlYiBDb21wb25lbnQnXG59O1xuXG5leHBvcnQge1xuICBzY3JlZW5zLFxuICBzY3JlZW5MaW5rTmFtZXNcbn07XG4iXX0=
