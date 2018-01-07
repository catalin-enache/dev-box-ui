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

var _DBUILocaleService = require('./../../web-components/services/DBUILocaleService');

var _DBUILocaleService2 = _interopRequireDefault(_DBUILocaleService);

var _DBUII18nService = require('./../../web-components/services/DBUII18nService');

var _DBUII18nService2 = _interopRequireDefault(_DBUII18nService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const localeService = (0, _DBUILocaleService2.default)(window);
const i18nService = (0, _DBUII18nService2.default)(window);

function localeAware(Component) {
  class LocaleAware extends _react2.default.Component {
    constructor(props, context) {
      super(props, context);
      this.handleLocaleChange = this.handleLocaleChange.bind(this);
      this.unregisterLocaleChange = null;
      this.state = {
        locale: localeService.locale
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
      this.unregisterLocaleChange = localeService.onLocaleChange(this.handleLocaleChange);
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
        translations: i18nService.currentLangTranslations,
        ref: comp => this._component = comp
      }));
    }
  }

  LocaleAware.displayName = `LocaleAware(${Component.displayName || Component.name || 'Component'})`;

  return (0, _hoistNonReactStatics2.default)(LocaleAware, Component);
}

},{"./../../web-components/services/DBUII18nService":13,"./../../web-components/services/DBUILocaleService":14,"hoist-non-react-statics":1,"react":"react"}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDBUIWebComponentBase;

var _DBUILocaleService = require('../../services/DBUILocaleService');

var _DBUILocaleService2 = _interopRequireDefault(_DBUILocaleService);

var _ensureSingleRegistration = require('../../internals/ensureSingleRegistration');

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
  const LocaleService = (0, _DBUILocaleService2.default)(win);

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
        this.unregisterLocaleChange = LocaleService.onLocaleChange(this._handleLocaleChange);
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

},{"../../internals/ensureSingleRegistration":12,"../../services/DBUILocaleService":14}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDBUIWebComponentDummy;

var _DBUIWebComponentBase = require('../DBUIWebComponentBase/DBUIWebComponentBase');

var _DBUIWebComponentBase2 = _interopRequireDefault(_DBUIWebComponentBase);

var _ensureSingleRegistration = require('../../internals/ensureSingleRegistration');

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

},{"../../internals/ensureSingleRegistration":12,"../DBUIWebComponentBase/DBUIWebComponentBase":7}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDBUIWebComponentDummyParent;

var _DBUIWebComponentBase = require('../DBUIWebComponentBase/DBUIWebComponentBase');

var _DBUIWebComponentBase2 = _interopRequireDefault(_DBUIWebComponentBase);

var _DBUIWebComponentDummy = require('../DBUIWebComponentDummy/DBUIWebComponentDummy');

var _DBUIWebComponentDummy2 = _interopRequireDefault(_DBUIWebComponentDummy);

var _ensureSingleRegistration = require('../../internals/ensureSingleRegistration');

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

},{"../../internals/ensureSingleRegistration":12,"../DBUIWebComponentBase/DBUIWebComponentBase":7,"../DBUIWebComponentDummy/DBUIWebComponentDummy":8}],10:[function(require,module,exports){
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

},{"../internals/appendStyle":11}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDBUII18nService;

var _DBUILocaleService = require('./DBUILocaleService');

var _DBUILocaleService2 = _interopRequireDefault(_DBUILocaleService);

var _ensureSingleRegistration = require('../internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const emptyObj = {};

const registrationName = 'DBUII18nService';

function getDBUII18nService(win) {
  const localeService = (0, _DBUILocaleService2.default)(win);
  return (0, _ensureSingleRegistration2.default)(win, registrationName, () => {
    class I18nService {
      constructor() {
        localeService.onLocaleChange(this._handleLocaleChange.bind(this));
        this._locale = localeService.locale;
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
    return i18nService;
  });
}

},{"../internals/ensureSingleRegistration":12,"./DBUILocaleService":14}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDBUILocaleService;

var _ensureSingleRegistration = require('../internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const defaultLocale = {
  dir: 'ltr',
  lang: 'en'
};

const registrationName = 'DBUILocaleService';

function getDBUILocaleService(win) {
  return (0, _ensureSingleRegistration2.default)(win, registrationName, () => {
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
    return localeService;
  });
}

},{"../internals/ensureSingleRegistration":12}],15:[function(require,module,exports){
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

require('dev-box-ui-web-components');

var _devBoxUiReactComponents = require('dev-box-ui-react-components');

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

require('./internals/iFrameUtils/onWindowDefinedHelpers');

var _dbuiWebComponentsSetup = require('../src/lib/web-components/helpers/dbuiWebComponentsSetup');

var _dbuiWebComponentsSetup2 = _interopRequireDefault(_dbuiWebComponentsSetup);

var _DBUIWebComponentDummy = require('../src/lib/web-components/components/DBUIWebComponentDummy/DBUIWebComponentDummy');

var _DBUIWebComponentDummy2 = _interopRequireDefault(_DBUIWebComponentDummy);

var _DBUIWebComponentDummyParent = require('../src/lib/web-components/components/DBUIWebComponentDummyParent/DBUIWebComponentDummyParent');

var _DBUIWebComponentDummyParent2 = _interopRequireDefault(_DBUIWebComponentDummyParent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// defines some helpers on window (reusing code needed in iFrames)
(0, _dbuiWebComponentsSetup2.default)(window).appendStyle('dbui-web-component-dummy', `
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

  (0, _dbuiWebComponentsSetup2.default)(target.contentWindow).appendStyle('dbui-web-component-dummy', `
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

Demo = (0, _devBoxUiReactComponents.localeAware)(Demo);

_reactDom2.default.render(_react2.default.createElement(Demo, null), document.getElementById('demo'));

}).call(this,require('_process'))

},{"../src/lib/web-components/components/DBUIWebComponentDummy/DBUIWebComponentDummy":8,"../src/lib/web-components/components/DBUIWebComponentDummyParent/DBUIWebComponentDummyParent":9,"../src/lib/web-components/helpers/dbuiWebComponentsSetup":10,"./app":15,"./internals/iFrameUtils/onWindowDefinedHelpers":19,"_process":2,"dev-box-ui-react-components":"dev-box-ui-react-components","dev-box-ui-web-components":"dev-box-ui-web-components","prop-types":"prop-types","react":"react","react-dom":"react-dom"}],17:[function(require,module,exports){
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

var _localeAware = require('../../../src/lib/react-components/behaviours/localeAware');

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

},{"../../../src/lib/react-components/behaviours/localeAware":6,"prop-types":"prop-types","react":"react"}],21:[function(require,module,exports){
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

var _devBoxUiReactComponents = require('dev-box-ui-react-components');

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
            _devBoxUiReactComponents.Draggable,
            { style: { border: '1px solid blue', width: 200, height: 200, overflowX: 'scroll', overflowY: 'scroll' } },
            this.state.draggableContent
          ),
          _react2.default.createElement(
            _devBoxUiReactComponents.DisableSelection,
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

},{"../../internals/reactComponents/PropertiesTable":21,"dev-box-ui-react-components":"dev-box-ui-react-components","react":"react"}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _devBoxUiReactComponents = require('dev-box-ui-react-components');

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
      _react2.default.createElement(_devBoxUiReactComponents.FormInputNumber, {
        value: this.state.inputValue,
        onChange: this.handleChange,
        defaultDecPoint: ',',
        defaultThousandsSeparator: '.'
      }),
      _react2.default.createElement(_devBoxUiReactComponents.FormInputNumber, {
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

},{"dev-box-ui-react-components":"dev-box-ui-react-components","react":"react"}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _devBoxUiReactComponents = require('dev-box-ui-react-components');

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
      _react2.default.createElement(_devBoxUiReactComponents.FormInput, {
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

},{"dev-box-ui-react-components":"dev-box-ui-react-components","react":"react"}],28:[function(require,module,exports){
(function (process){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _devBoxUiReactComponents = require('dev-box-ui-react-components');

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
      _react2.default.createElement(_devBoxUiReactComponents.Hello, null)
    );
  }
}

exports.default = HelloScreen;

}).call(this,require('_process'))

},{"_process":2,"dev-box-ui-react-components":"dev-box-ui-react-components","react":"react"}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _devBoxUiReactComponents = require('dev-box-ui-react-components');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ListScreen extends _react2.default.Component {
  render() {
    return _react2.default.createElement(
      'div',
      { className: 'demo-screen' },
      ' ',
      _react2.default.createElement(_devBoxUiReactComponents.List, { items: ['three', 'four'] }),
      _react2.default.createElement(_devBoxUiReactComponents.List, { items: ['three', 'four'] })
    );
  }
}

exports.default = ListScreen;

},{"dev-box-ui-react-components":"dev-box-ui-react-components","react":"react"}],30:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvaG9pc3Qtbm9uLXJlYWN0LXN0YXRpY3MvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LWljb24tYmFzZS9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVhY3QtaWNvbnMvbGliL2dvL21hcmstZ2l0aHViLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LWljb25zL2xpYi9nby90aHJlZS1iYXJzLmpzIiwic3JjL2xpYi9yZWFjdC1jb21wb25lbnRzL2JlaGF2aW91cnMvbG9jYWxlQXdhcmUuanMiLCJzcmMvbGliL3dlYi1jb21wb25lbnRzL2NvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudEJhc2UvREJVSVdlYkNvbXBvbmVudEJhc2UuanMiLCJzcmMvbGliL3dlYi1jb21wb25lbnRzL2NvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudER1bW15L0RCVUlXZWJDb21wb25lbnREdW1teS5qcyIsInNyYy9saWIvd2ViLWNvbXBvbmVudHMvY29tcG9uZW50cy9EQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQvREJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50LmpzIiwic3JjL2xpYi93ZWItY29tcG9uZW50cy9oZWxwZXJzL2RidWlXZWJDb21wb25lbnRzU2V0dXAuanMiLCJzcmMvbGliL3dlYi1jb21wb25lbnRzL2ludGVybmFscy9hcHBlbmRTdHlsZS5qcyIsInNyYy9saWIvd2ViLWNvbXBvbmVudHMvaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbi5qcyIsInNyYy9saWIvd2ViLWNvbXBvbmVudHMvc2VydmljZXMvREJVSUkxOG5TZXJ2aWNlLmpzIiwic3JjL2xpYi93ZWItY29tcG9uZW50cy9zZXJ2aWNlcy9EQlVJTG9jYWxlU2VydmljZS5qcyIsInNyY0RlbW8vYXBwLmpzIiwic3JjRGVtby9kZW1vLmpzIiwic3JjRGVtby9pbnRlcm5hbHMvYXBwVXRpbHMuanMiLCJzcmNEZW1vL2ludGVybmFscy9jb25zdGFudHMuanMiLCJzcmNEZW1vL2ludGVybmFscy9pRnJhbWVVdGlscy9vbldpbmRvd0RlZmluZWRIZWxwZXJzLmpzIiwic3JjRGVtby9pbnRlcm5hbHMvcmVhY3RDb21wb25lbnRzL0lGcmFtZVNjcmVlbi5qcyIsInNyY0RlbW8vaW50ZXJuYWxzL3JlYWN0Q29tcG9uZW50cy9Qcm9wZXJ0aWVzVGFibGUuanMiLCJzcmNEZW1vL3NjcmVlbnMvRGVidWcvT25TY3JlZW5Db25zb2xlU2NyZWVuLmpzIiwic3JjRGVtby9zY3JlZW5zL0dlbmVyYWwvTG9hZGluZ0RldkJveFVJV2ViQ29tcG9uZW50cy5qcyIsInNyY0RlbW8vc2NyZWVucy9SZWFjdENvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudER1bW15U2NyZWVuLmpzIiwic3JjRGVtby9zY3JlZW5zL1JlYWN0Q29tcG9uZW50cy9EcmFnZ2FibGVTY3JlZW4uanMiLCJzcmNEZW1vL3NjcmVlbnMvUmVhY3RDb21wb25lbnRzL0Zvcm1JbnB1dE51bWJlclNjcmVlbi5qcyIsInNyY0RlbW8vc2NyZWVucy9SZWFjdENvbXBvbmVudHMvRm9ybUlucHV0U2NyZWVuLmpzIiwic3JjRGVtby9zY3JlZW5zL1JlYWN0Q29tcG9uZW50cy9IZWxsb1NjcmVlbi5qcyIsInNyY0RlbW8vc2NyZWVucy9SZWFjdENvbXBvbmVudHMvTGlzdFNjcmVlbi5qcyIsInNyY0RlbW8vc2NyZWVucy9TZXJ2aWNlcy9Mb2NhbGVTZXJ2aWNlU2NyZWVuLmpzIiwic3JjRGVtby9zY3JlZW5zL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O2tCQ3ZCd0IsVzs7QUFS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Q3JCO0FBQ0UsU0FBTyxPQURUO0FBRUUsU0FBTyxDQUNMLEVBQUUsTUFBTSx1QkFBUixFQUFpQyxPQUFPLG1CQUF4QyxFQURLO0FBRlQsQ0FoQ3FCLENBQXZCOztRQXlDRSxPLEdBQUEsTztRQUNBLGMsR0FBQSxjIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTUsIFlhaG9vISBJbmMuXG4gKiBDb3B5cmlnaHRzIGxpY2Vuc2VkIHVuZGVyIHRoZSBOZXcgQlNEIExpY2Vuc2UuIFNlZSB0aGUgYWNjb21wYW55aW5nIExJQ0VOU0UgZmlsZSBmb3IgdGVybXMuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIFJFQUNUX1NUQVRJQ1MgPSB7XG4gICAgY2hpbGRDb250ZXh0VHlwZXM6IHRydWUsXG4gICAgY29udGV4dFR5cGVzOiB0cnVlLFxuICAgIGRlZmF1bHRQcm9wczogdHJ1ZSxcbiAgICBkaXNwbGF5TmFtZTogdHJ1ZSxcbiAgICBnZXREZWZhdWx0UHJvcHM6IHRydWUsXG4gICAgbWl4aW5zOiB0cnVlLFxuICAgIHByb3BUeXBlczogdHJ1ZSxcbiAgICB0eXBlOiB0cnVlXG59O1xuXG52YXIgS05PV05fU1RBVElDUyA9IHtcbiAgbmFtZTogdHJ1ZSxcbiAgbGVuZ3RoOiB0cnVlLFxuICBwcm90b3R5cGU6IHRydWUsXG4gIGNhbGxlcjogdHJ1ZSxcbiAgY2FsbGVlOiB0cnVlLFxuICBhcmd1bWVudHM6IHRydWUsXG4gIGFyaXR5OiB0cnVlXG59O1xuXG52YXIgZGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG52YXIgZ2V0T3duUHJvcGVydHlOYW1lcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzO1xudmFyIGdldE93blByb3BlcnR5U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG52YXIgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbnZhciBnZXRQcm90b3R5cGVPZiA9IE9iamVjdC5nZXRQcm90b3R5cGVPZjtcbnZhciBvYmplY3RQcm90b3R5cGUgPSBnZXRQcm90b3R5cGVPZiAmJiBnZXRQcm90b3R5cGVPZihPYmplY3QpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGhvaXN0Tm9uUmVhY3RTdGF0aWNzKHRhcmdldENvbXBvbmVudCwgc291cmNlQ29tcG9uZW50LCBibGFja2xpc3QpIHtcbiAgICBpZiAodHlwZW9mIHNvdXJjZUNvbXBvbmVudCAhPT0gJ3N0cmluZycpIHsgLy8gZG9uJ3QgaG9pc3Qgb3ZlciBzdHJpbmcgKGh0bWwpIGNvbXBvbmVudHNcblxuICAgICAgICBpZiAob2JqZWN0UHJvdG90eXBlKSB7XG4gICAgICAgICAgICB2YXIgaW5oZXJpdGVkQ29tcG9uZW50ID0gZ2V0UHJvdG90eXBlT2Yoc291cmNlQ29tcG9uZW50KTtcbiAgICAgICAgICAgIGlmIChpbmhlcml0ZWRDb21wb25lbnQgJiYgaW5oZXJpdGVkQ29tcG9uZW50ICE9PSBvYmplY3RQcm90b3R5cGUpIHtcbiAgICAgICAgICAgICAgICBob2lzdE5vblJlYWN0U3RhdGljcyh0YXJnZXRDb21wb25lbnQsIGluaGVyaXRlZENvbXBvbmVudCwgYmxhY2tsaXN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBrZXlzID0gZ2V0T3duUHJvcGVydHlOYW1lcyhzb3VyY2VDb21wb25lbnQpO1xuXG4gICAgICAgIGlmIChnZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcbiAgICAgICAgICAgIGtleXMgPSBrZXlzLmNvbmNhdChnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoc291cmNlQ29tcG9uZW50KSk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuICAgICAgICAgICAgaWYgKCFSRUFDVF9TVEFUSUNTW2tleV0gJiYgIUtOT1dOX1NUQVRJQ1Nba2V5XSAmJiAoIWJsYWNrbGlzdCB8fCAhYmxhY2tsaXN0W2tleV0pKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRlc2NyaXB0b3IgPSBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc291cmNlQ29tcG9uZW50LCBrZXkpO1xuICAgICAgICAgICAgICAgIHRyeSB7IC8vIEF2b2lkIGZhaWx1cmVzIGZyb20gcmVhZC1vbmx5IHByb3BlcnRpZXNcbiAgICAgICAgICAgICAgICAgICAgZGVmaW5lUHJvcGVydHkodGFyZ2V0Q29tcG9uZW50LCBrZXksIGRlc2NyaXB0b3IpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGFyZ2V0Q29tcG9uZW50O1xuICAgIH1cblxuICAgIHJldHVybiB0YXJnZXRDb21wb25lbnQ7XG59O1xuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxudmFyIF9yZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX3Byb3BUeXBlcyA9IHJlcXVpcmUoJ3Byb3AtdHlwZXMnKTtcblxudmFyIF9wcm9wVHlwZXMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcHJvcFR5cGVzKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzKG9iaiwga2V5cykgeyB2YXIgdGFyZ2V0ID0ge307IGZvciAodmFyIGkgaW4gb2JqKSB7IGlmIChrZXlzLmluZGV4T2YoaSkgPj0gMCkgY29udGludWU7IGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgaSkpIGNvbnRpbnVlOyB0YXJnZXRbaV0gPSBvYmpbaV07IH0gcmV0dXJuIHRhcmdldDsgfVxuXG52YXIgSWNvbkJhc2UgPSBmdW5jdGlvbiBJY29uQmFzZShfcmVmLCBfcmVmMikge1xuICB2YXIgY2hpbGRyZW4gPSBfcmVmLmNoaWxkcmVuO1xuICB2YXIgY29sb3IgPSBfcmVmLmNvbG9yO1xuICB2YXIgc2l6ZSA9IF9yZWYuc2l6ZTtcbiAgdmFyIHN0eWxlID0gX3JlZi5zdHlsZTtcbiAgdmFyIHdpZHRoID0gX3JlZi53aWR0aDtcbiAgdmFyIGhlaWdodCA9IF9yZWYuaGVpZ2h0O1xuXG4gIHZhciBwcm9wcyA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllcyhfcmVmLCBbJ2NoaWxkcmVuJywgJ2NvbG9yJywgJ3NpemUnLCAnc3R5bGUnLCAnd2lkdGgnLCAnaGVpZ2h0J10pO1xuXG4gIHZhciBfcmVmMiRyZWFjdEljb25CYXNlID0gX3JlZjIucmVhY3RJY29uQmFzZTtcbiAgdmFyIHJlYWN0SWNvbkJhc2UgPSBfcmVmMiRyZWFjdEljb25CYXNlID09PSB1bmRlZmluZWQgPyB7fSA6IF9yZWYyJHJlYWN0SWNvbkJhc2U7XG5cbiAgdmFyIGNvbXB1dGVkU2l6ZSA9IHNpemUgfHwgcmVhY3RJY29uQmFzZS5zaXplIHx8ICcxZW0nO1xuICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoJ3N2ZycsIF9leHRlbmRzKHtcbiAgICBjaGlsZHJlbjogY2hpbGRyZW4sXG4gICAgZmlsbDogJ2N1cnJlbnRDb2xvcicsXG4gICAgcHJlc2VydmVBc3BlY3RSYXRpbzogJ3hNaWRZTWlkIG1lZXQnLFxuICAgIGhlaWdodDogaGVpZ2h0IHx8IGNvbXB1dGVkU2l6ZSxcbiAgICB3aWR0aDogd2lkdGggfHwgY29tcHV0ZWRTaXplXG4gIH0sIHJlYWN0SWNvbkJhc2UsIHByb3BzLCB7XG4gICAgc3R5bGU6IF9leHRlbmRzKHtcbiAgICAgIHZlcnRpY2FsQWxpZ246ICdtaWRkbGUnLFxuICAgICAgY29sb3I6IGNvbG9yIHx8IHJlYWN0SWNvbkJhc2UuY29sb3JcbiAgICB9LCByZWFjdEljb25CYXNlLnN0eWxlIHx8IHt9LCBzdHlsZSlcbiAgfSkpO1xufTtcblxuSWNvbkJhc2UucHJvcFR5cGVzID0ge1xuICBjb2xvcjogX3Byb3BUeXBlczIuZGVmYXVsdC5zdHJpbmcsXG4gIHNpemU6IF9wcm9wVHlwZXMyLmRlZmF1bHQub25lT2ZUeXBlKFtfcHJvcFR5cGVzMi5kZWZhdWx0LnN0cmluZywgX3Byb3BUeXBlczIuZGVmYXVsdC5udW1iZXJdKSxcbiAgd2lkdGg6IF9wcm9wVHlwZXMyLmRlZmF1bHQub25lT2ZUeXBlKFtfcHJvcFR5cGVzMi5kZWZhdWx0LnN0cmluZywgX3Byb3BUeXBlczIuZGVmYXVsdC5udW1iZXJdKSxcbiAgaGVpZ2h0OiBfcHJvcFR5cGVzMi5kZWZhdWx0Lm9uZU9mVHlwZShbX3Byb3BUeXBlczIuZGVmYXVsdC5zdHJpbmcsIF9wcm9wVHlwZXMyLmRlZmF1bHQubnVtYmVyXSksXG4gIHN0eWxlOiBfcHJvcFR5cGVzMi5kZWZhdWx0Lm9iamVjdFxufTtcblxuSWNvbkJhc2UuY29udGV4dFR5cGVzID0ge1xuICByZWFjdEljb25CYXNlOiBfcHJvcFR5cGVzMi5kZWZhdWx0LnNoYXBlKEljb25CYXNlLnByb3BUeXBlcylcbn07XG5cbmV4cG9ydHMuZGVmYXVsdCA9IEljb25CYXNlO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9yZWFjdEljb25CYXNlID0gcmVxdWlyZSgncmVhY3QtaWNvbi1iYXNlJyk7XG5cbnZhciBfcmVhY3RJY29uQmFzZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdEljb25CYXNlKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIEdvTWFya0dpdGh1YiA9IGZ1bmN0aW9uIEdvTWFya0dpdGh1Yihwcm9wcykge1xuICAgIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgX3JlYWN0SWNvbkJhc2UyLmRlZmF1bHQsXG4gICAgICAgIF9leHRlbmRzKHsgdmlld0JveDogJzAgMCA0MCA0MCcgfSwgcHJvcHMpLFxuICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICdnJyxcbiAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudCgncGF0aCcsIHsgZDogJ20yMCAwYy0xMSAwLTIwIDktMjAgMjAgMCA4LjggNS43IDE2LjMgMTMuNyAxOSAxIDAuMiAxLjMtMC41IDEuMy0xIDAtMC41IDAtMiAwLTMuNy01LjUgMS4yLTYuNy0yLjQtNi43LTIuNC0wLjktMi4zLTIuMi0yLjktMi4yLTIuOS0xLjktMS4yIDAuMS0xLjIgMC4xLTEuMiAyIDAuMSAzLjEgMi4xIDMuMSAyLjEgMS43IDMgNC42IDIuMSA1LjggMS42IDAuMi0xLjMgMC43LTIuMiAxLjMtMi43LTQuNS0wLjUtOS4yLTIuMi05LjItOS44IDAtMi4yIDAuOC00IDIuMS01LjQtMC4yLTAuNS0wLjktMi42IDAuMi01LjMgMCAwIDEuNy0wLjUgNS41IDIgMS42LTAuNCAzLjMtMC42IDUtMC42IDEuNyAwIDMuNCAwLjIgNSAwLjcgMy44LTIuNiA1LjUtMi4xIDUuNS0yLjEgMS4xIDIuOCAwLjQgNC44IDAuMiA1LjMgMS4zIDEuNCAyLjEgMy4yIDIuMSA1LjQgMCA3LjYtNC43IDkuMy05LjIgOS44IDAuNyAwLjYgMS40IDEuOSAxLjQgMy43IDAgMi43IDAgNC45IDAgNS41IDAgMC42IDAuMyAxLjIgMS4zIDEgOC0yLjcgMTMuNy0xMC4yIDEzLjctMTkgMC0xMS05LTIwLTIwLTIweicgfSlcbiAgICAgICAgKVxuICAgICk7XG59O1xuXG5leHBvcnRzLmRlZmF1bHQgPSBHb01hcmtHaXRodWI7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxudmFyIF9yZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX3JlYWN0SWNvbkJhc2UgPSByZXF1aXJlKCdyZWFjdC1pY29uLWJhc2UnKTtcblxudmFyIF9yZWFjdEljb25CYXNlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0SWNvbkJhc2UpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgR29UaHJlZUJhcnMgPSBmdW5jdGlvbiBHb1RocmVlQmFycyhwcm9wcykge1xuICAgIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgX3JlYWN0SWNvbkJhc2UyLmRlZmF1bHQsXG4gICAgICAgIF9leHRlbmRzKHsgdmlld0JveDogJzAgMCA0MCA0MCcgfSwgcHJvcHMpLFxuICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICdnJyxcbiAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudCgncGF0aCcsIHsgZDogJ201IDcuNXY1aDMwdi01aC0zMHogbTAgMTVoMzB2LTVoLTMwdjV6IG0wIDEwaDMwdi01aC0zMHY1eicgfSlcbiAgICAgICAgKVxuICAgICk7XG59O1xuXG5leHBvcnRzLmRlZmF1bHQgPSBHb1RocmVlQmFycztcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgaG9pc3ROb25SZWFjdFN0YXRpY3MgZnJvbSAnaG9pc3Qtbm9uLXJlYWN0LXN0YXRpY3MnO1xuaW1wb3J0IGdldERCVUlMb2NhbGVTZXJ2aWNlIGZyb20gJy4vLi4vLi4vd2ViLWNvbXBvbmVudHMvc2VydmljZXMvREJVSUxvY2FsZVNlcnZpY2UnO1xuaW1wb3J0IGdldERCVUlJMThuU2VydmljZSBmcm9tICcuLy4uLy4uL3dlYi1jb21wb25lbnRzL3NlcnZpY2VzL0RCVUlJMThuU2VydmljZSc7XG5cbmNvbnN0IGxvY2FsZVNlcnZpY2UgPSBnZXREQlVJTG9jYWxlU2VydmljZSh3aW5kb3cpO1xuY29uc3QgaTE4blNlcnZpY2UgPSBnZXREQlVJSTE4blNlcnZpY2Uod2luZG93KTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbG9jYWxlQXdhcmUoQ29tcG9uZW50KSB7XG4gIGNsYXNzIExvY2FsZUF3YXJlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCkge1xuICAgICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xuICAgICAgdGhpcy5oYW5kbGVMb2NhbGVDaGFuZ2UgPSB0aGlzLmhhbmRsZUxvY2FsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy51bnJlZ2lzdGVyTG9jYWxlQ2hhbmdlID0gbnVsbDtcbiAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgIGxvY2FsZTogbG9jYWxlU2VydmljZS5sb2NhbGVcbiAgICAgIH07XG4gICAgICB0aGlzLl9tb3VudGVkID0gZmFsc2U7XG4gICAgICB0aGlzLl9jb21wb25lbnQgPSBudWxsO1xuICAgIH1cblxuICAgIGhhbmRsZUxvY2FsZUNoYW5nZShsb2NhbGUpIHtcbiAgICAgIHRoaXMuX21vdW50ZWQgJiYgdGhpcy5zdGF0ZS5sb2NhbGUgIT09IGxvY2FsZSAmJiB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgbG9jYWxlXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgIHRoaXMudW5yZWdpc3RlckxvY2FsZUNoYW5nZSA9IGxvY2FsZVNlcnZpY2Uub25Mb2NhbGVDaGFuZ2UodGhpcy5oYW5kbGVMb2NhbGVDaGFuZ2UpO1xuICAgICAgdGhpcy5fbW91bnRlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgICB0aGlzLl9tb3VudGVkID0gZmFsc2U7XG4gICAgICB0aGlzLnVucmVnaXN0ZXJMb2NhbGVDaGFuZ2UoKTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICBjb25zdCB7IGxvY2FsZSB9ID0gdGhpcy5zdGF0ZTtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxDb21wb25lbnQgeyAuLi50aGlzLnByb3BzIH1cbiAgICAgICAgICBsb2NhbGU9eyBsb2NhbGUgfVxuICAgICAgICAgIHRyYW5zbGF0aW9ucz17IGkxOG5TZXJ2aWNlLmN1cnJlbnRMYW5nVHJhbnNsYXRpb25zIH1cbiAgICAgICAgICByZWY9eyBjb21wID0+IHRoaXMuX2NvbXBvbmVudCA9IGNvbXAgfVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBMb2NhbGVBd2FyZS5kaXNwbGF5TmFtZSA9IGBMb2NhbGVBd2FyZSgke1xuICAgIENvbXBvbmVudC5kaXNwbGF5TmFtZSB8fFxuICAgIENvbXBvbmVudC5uYW1lIHx8XG4gICAgJ0NvbXBvbmVudCdcbiAgfSlgO1xuXG4gIHJldHVybiBob2lzdE5vblJlYWN0U3RhdGljcyhMb2NhbGVBd2FyZSwgQ29tcG9uZW50KTtcbn1cbiIsIlxuaW1wb3J0IGdldERCVUlMb2NhbGVTZXJ2aWNlIGZyb20gJy4uLy4uL3NlcnZpY2VzL0RCVUlMb2NhbGVTZXJ2aWNlJztcbmltcG9ydCBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24gZnJvbSAnLi4vLi4vaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbic7XG5cbmNvbnN0IHJlZ2lzdHJhdGlvbk5hbWUgPSAnREJVSVdlYkNvbXBvbmVudEJhc2UnO1xuXG5mdW5jdGlvbiBkZWZpbmVDb21tb25DU1NWYXJzKCkge1xuICBjb25zdCBjb21tb25TdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gIGNvbW1vblN0eWxlLmlubmVySFRNTCA9IGBcbiAgOnJvb3Qge1xuICAgIC0tZGJ1aS13ZWItY29tcG9uZW50LWdsb2JhbC1ib3JkZXItcmFkaXVzOiA1cHg7XG4gICAgLS1kYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC1oZWlnaHQ6IDMwcHg7XG4gICAgLS1kYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC1jb2xvcjogIzAwMDtcbiAgICAtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICAgIC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtYm9yZGVyLWNvbG9yOiAjY2NjO1xuICAgIC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtYm9yZGVyLXN0eWxlOiBzb2xpZDtcbiAgICAtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWJvcmRlci13aWR0aDogMXB4O1xuICB9XG4gIGA7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2hlYWQnKS5hcHBlbmRDaGlsZChjb21tb25TdHlsZSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldERCVUlXZWJDb21wb25lbnRCYXNlKHdpbikge1xuICBjb25zdCBMb2NhbGVTZXJ2aWNlID0gZ2V0REJVSUxvY2FsZVNlcnZpY2Uod2luKTtcblxuICByZXR1cm4gZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uKHdpbiwgcmVnaXN0cmF0aW9uTmFtZSwgKCkgPT4ge1xuICAgIGRlZmluZUNvbW1vbkNTU1ZhcnMoKTtcblxuICAgIGNvbnN0IHsgZG9jdW1lbnQsIEhUTUxFbGVtZW50LCBjdXN0b21FbGVtZW50cyB9ID0gd2luO1xuXG4gICAgY2xhc3MgREJVSVdlYkNvbXBvbmVudEJhc2UgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG5cbiAgICAgIHN0YXRpYyBnZXQgcmVnaXN0cmF0aW9uTmFtZSgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdyZWdpc3RyYXRpb25OYW1lIG11c3QgYmUgZGVmaW5lZCBpbiBkZXJpdmVkIGNsYXNzZXMnKTtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCB0ZW1wbGF0ZUlubmVySFRNTCgpIHtcbiAgICAgICAgcmV0dXJuICc8c3R5bGU+PC9zdHlsZT48c2xvdD48L3Nsb3Q+JztcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCBkZXBlbmRlbmNpZXMoKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCB1c2VTaGFkb3coKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IHByb3BlcnRpZXNUb1VwZ3JhZGUoKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCBwcm9wZXJ0aWVzVG9EZWZpbmUoKSB7XG4gICAgICAgIHJldHVybiB7fTtcbiAgICAgIH1cblxuICAgICAgZ2V0IGluc3RhbmNlUHJvcGVydGllc1RvRGVmaW5lKCkge1xuICAgICAgICByZXR1cm4ge307XG4gICAgICB9XG5cbiAgICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICBjb25zdCB7IHVzZVNoYWRvdyB9ID0gdGhpcy5jb25zdHJ1Y3RvcjtcbiAgICAgICAgaWYgKHVzZVNoYWRvdykge1xuICAgICAgICAgIHRoaXMuYXR0YWNoU2hhZG93KHtcbiAgICAgICAgICAgIG1vZGU6ICdvcGVuJyxcbiAgICAgICAgICAgIC8vIGRlbGVnYXRlc0ZvY3VzOiB0cnVlXG4gICAgICAgICAgICAvLyBOb3Qgd29ya2luZyBvbiBJUGFkIHNvIHdlIGRvIGFuIHdvcmthcm91bmRcbiAgICAgICAgICAgIC8vIGJ5IHNldHRpbmcgXCJmb2N1c2VkXCIgYXR0cmlidXRlIHdoZW4gbmVlZGVkLlxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2lzQ29ubmVjdGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2luc2VydFRlbXBsYXRlKCk7XG5cbiAgICAgICAgdGhpcy5jb25uZWN0ZWRDYWxsYmFjayA9IHRoaXMuY29ubmVjdGVkQ2FsbGJhY2suYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5kaXNjb25uZWN0ZWRDYWxsYmFjayA9IHRoaXMuZGlzY29ubmVjdGVkQ2FsbGJhY2suYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5faGFuZGxlTG9jYWxlQ2hhbmdlID0gdGhpcy5faGFuZGxlTG9jYWxlQ2hhbmdlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMub25Mb2NhbGVDaGFuZ2UgJiYgKHRoaXMub25Mb2NhbGVDaGFuZ2UgPSB0aGlzLm9uTG9jYWxlQ2hhbmdlLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLnVucmVnaXN0ZXJMb2NhbGVDaGFuZ2UgPSBudWxsO1xuXG4gICAgICAgIC8vIHByb3ZpZGUgc3VwcG9ydCBmb3IgdHJhaXRzIGlmIGFueSBhcyB0aGV5IGNhbnQgb3ZlcnJpZGUgY29uc3RydWN0b3JcbiAgICAgICAgdGhpcy5pbml0ICYmIHRoaXMuaW5pdCguLi5hcmdzKTtcbiAgICAgIH1cblxuICAgICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vd2ViL2Z1bmRhbWVudGFscy93ZWItY29tcG9uZW50cy9iZXN0LXByYWN0aWNlcyNsYXp5LXByb3BlcnRpZXNcbiAgICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL3dlYi9mdW5kYW1lbnRhbHMvd2ViLWNvbXBvbmVudHMvZXhhbXBsZXMvaG93dG8tY2hlY2tib3hcbiAgICAgIC8qIGVzbGludCBuby1wcm90b3R5cGUtYnVpbHRpbnM6IDAgKi9cbiAgICAgIF91cGdyYWRlUHJvcGVydHkocHJvcCkge1xuICAgICAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICAgIGNvbnN0IHZhbHVlID0gdGhpc1twcm9wXTtcbiAgICAgICAgICBkZWxldGUgdGhpc1twcm9wXTtcbiAgICAgICAgICB0aGlzW3Byb3BdID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgX2RlZmluZVByb3BlcnR5KGtleSwgdmFsdWUpIHtcbiAgICAgICAgaWYgKCF0aGlzLmhhc0F0dHJpYnV0ZShrZXkpKSB7XG4gICAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoa2V5LCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHRoaXMuX2lzQ29ubmVjdGVkID0gdHJ1ZTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2JlZm9yZXVubG9hZCcsIHRoaXMuZGlzY29ubmVjdGVkQ2FsbGJhY2ssIGZhbHNlKTtcbiAgICAgICAgdGhpcy51bnJlZ2lzdGVyTG9jYWxlQ2hhbmdlID1cbiAgICAgICAgICBMb2NhbGVTZXJ2aWNlLm9uTG9jYWxlQ2hhbmdlKHRoaXMuX2hhbmRsZUxvY2FsZUNoYW5nZSk7XG4gICAgICAgIGNvbnN0IHsgcHJvcGVydGllc1RvVXBncmFkZSwgcHJvcGVydGllc1RvRGVmaW5lIH0gPSB0aGlzLmNvbnN0cnVjdG9yO1xuICAgICAgICBjb25zdCB7IGluc3RhbmNlUHJvcGVydGllc1RvRGVmaW5lIH0gPSB0aGlzO1xuICAgICAgICBjb25zdCBhbGxQcm9wZXJ0aWVzVG9EZWZpbmUgPSB7XG4gICAgICAgICAgLi4ucHJvcGVydGllc1RvRGVmaW5lLFxuICAgICAgICAgIC4uLmluc3RhbmNlUHJvcGVydGllc1RvRGVmaW5lXG4gICAgICAgIH07XG4gICAgICAgIHByb3BlcnRpZXNUb1VwZ3JhZGUuZm9yRWFjaCgocHJvcGVydHkpID0+IHtcbiAgICAgICAgICB0aGlzLl91cGdyYWRlUHJvcGVydHkocHJvcGVydHkpO1xuICAgICAgICB9KTtcbiAgICAgICAgT2JqZWN0LmtleXMoYWxsUHJvcGVydGllc1RvRGVmaW5lKS5mb3JFYWNoKChwcm9wZXJ0eSkgPT4ge1xuICAgICAgICAgIHRoaXMuX2RlZmluZVByb3BlcnR5KHByb3BlcnR5LCBhbGxQcm9wZXJ0aWVzVG9EZWZpbmVbcHJvcGVydHldKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgICB0aGlzLl9pc0Nvbm5lY3RlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnVucmVnaXN0ZXJMb2NhbGVDaGFuZ2UoKTtcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2JlZm9yZXVubG9hZCcsIHRoaXMuZGlzY29ubmVjdGVkQ2FsbGJhY2ssIGZhbHNlKTtcbiAgICAgIH1cblxuICAgICAgZ2V0IGNoaWxkcmVuVHJlZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IudXNlU2hhZG93ID8gdGhpcy5zaGFkb3dSb290IDogdGhpcztcbiAgICAgIH1cblxuICAgICAgX2luc2VydFRlbXBsYXRlKCkge1xuICAgICAgICBjb25zdCB7IHRlbXBsYXRlIH0gPSB0aGlzLmNvbnN0cnVjdG9yO1xuXG4gICAgICAgIGlmICh0ZW1wbGF0ZSkge1xuICAgICAgICAgIHRoaXMuY2hpbGRyZW5UcmVlLmFwcGVuZENoaWxkKHRlbXBsYXRlLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBfaGFuZGxlTG9jYWxlQ2hhbmdlKGxvY2FsZSkge1xuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnZGlyJywgbG9jYWxlLmRpcik7XG4gICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdsYW5nJywgbG9jYWxlLmxhbmcpO1xuICAgICAgICB0aGlzLm9uTG9jYWxlQ2hhbmdlICYmIHRoaXMub25Mb2NhbGVDaGFuZ2UobG9jYWxlKTtcbiAgICAgIH1cblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMoa2xhc3MpIHtcbiAgICAgIGNvbnN0IHRlbXBsYXRlSW5uZXJIVE1MID0ga2xhc3MudGVtcGxhdGVJbm5lckhUTUw7XG4gICAgICBjb25zdCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gICAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSB0ZW1wbGF0ZUlubmVySFRNTDtcblxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGtsYXNzLCAndGVtcGxhdGUnLCB7XG4gICAgICAgIGdldCgpIHsgcmV0dXJuIHRlbXBsYXRlOyB9LFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9KTtcblxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGtsYXNzLCAnY29tcG9uZW50U3R5bGUnLCB7XG4gICAgICAgIGdldCgpIHtcbiAgICAgICAgICByZXR1cm4ga2xhc3MudGVtcGxhdGUuY29udGVudC5xdWVyeVNlbGVjdG9yKCdzdHlsZScpLmlubmVySFRNTDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0KHZhbHVlKSB7XG4gICAgICAgICAga2xhc3MudGVtcGxhdGUuY29udGVudC5xdWVyeVNlbGVjdG9yKCdzdHlsZScpLmlubmVySFRNTCA9IHZhbHVlO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIGtsYXNzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIFJlZ2lzdGVyYWJsZShrbGFzcykge1xuICAgICAga2xhc3MucmVnaXN0ZXJTZWxmID0gKCkgPT4ge1xuICAgICAgICBjb25zdCByZWdpc3RyYXRpb25OYW1lID0ga2xhc3MucmVnaXN0cmF0aW9uTmFtZTtcbiAgICAgICAgY29uc3QgZGVwZW5kZW5jaWVzID0ga2xhc3MuZGVwZW5kZW5jaWVzO1xuICAgICAgICAvLyBNYWtlIHN1cmUgb3VyIGRlcGVuZGVuY2llcyBhcmUgcmVnaXN0ZXJlZCBiZWZvcmUgd2UgcmVnaXN0ZXIgc2VsZlxuICAgICAgICBkZXBlbmRlbmNpZXMuZm9yRWFjaCgoZGVwZW5kZW5jeSkgPT4gZGVwZW5kZW5jeS5yZWdpc3RlclNlbGYoKSk7XG4gICAgICAgIC8vIERvbid0IHRyeSB0byByZWdpc3RlciBzZWxmIGlmIGFscmVhZHkgcmVnaXN0ZXJlZFxuICAgICAgICBpZiAoY3VzdG9tRWxlbWVudHMuZ2V0KHJlZ2lzdHJhdGlvbk5hbWUpKSByZXR1cm4gcmVnaXN0cmF0aW9uTmFtZTtcbiAgICAgICAgLy8gR2l2ZSBhIGNoYW5jZSB0byBvdmVycmlkZSB3ZWItY29tcG9uZW50IHN0eWxlIGlmIHByb3ZpZGVkIGJlZm9yZSBiZWluZyByZWdpc3RlcmVkLlxuICAgICAgICBjb25zdCBjb21wb25lbnRTdHlsZSA9ICgod2luLkRCVUlXZWJDb21wb25lbnRzIHx8IHt9KVtyZWdpc3RyYXRpb25OYW1lXSB8fCB7fSkuY29tcG9uZW50U3R5bGU7XG4gICAgICAgIGlmIChjb21wb25lbnRTdHlsZSkge1xuICAgICAgICAgIGtsYXNzLmNvbXBvbmVudFN0eWxlICs9IGNvbXBvbmVudFN0eWxlO1xuICAgICAgICB9XG4gICAgICAgIC8vIERvIHJlZ2lzdHJhdGlvblxuICAgICAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUocmVnaXN0cmF0aW9uTmFtZSwga2xhc3MpO1xuICAgICAgICByZXR1cm4gcmVnaXN0cmF0aW9uTmFtZTtcbiAgICAgIH07XG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShrbGFzcywgJ3Byb3RvdHlwZUNoYWluSW5mbycsIHtcbiAgICAgICAgZ2V0KCkge1xuICAgICAgICAgIGNvbnN0IGNoYWluID0gW2tsYXNzXTtcbiAgICAgICAgICBsZXQgcGFyZW50UHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yoa2xhc3MpO1xuICAgICAgICAgIHdoaWxlIChwYXJlbnRQcm90byAhPT0gSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgIGNoYWluLnB1c2gocGFyZW50UHJvdG8pO1xuICAgICAgICAgICAgcGFyZW50UHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YocGFyZW50UHJvdG8pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjaGFpbi5wdXNoKHBhcmVudFByb3RvKTtcbiAgICAgICAgICByZXR1cm4gY2hhaW47XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4ga2xhc3M7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIERCVUlXZWJDb21wb25lbnRCYXNlLFxuICAgICAgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyxcbiAgICAgIFJlZ2lzdGVyYWJsZVxuICAgIH07XG4gIH0pO1xufVxuIiwiXG5pbXBvcnQgZ2V0REJVSVdlYkNvbXBvbmVudEJhc2UgZnJvbSAnLi4vREJVSVdlYkNvbXBvbmVudEJhc2UvREJVSVdlYkNvbXBvbmVudEJhc2UnO1xuaW1wb3J0IGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbiBmcm9tICcuLi8uLi9pbnRlcm5hbHMvZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uJztcblxuY29uc3QgcmVnaXN0cmF0aW9uTmFtZSA9ICdkYnVpLXdlYi1jb21wb25lbnQtZHVtbXknO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXREQlVJV2ViQ29tcG9uZW50RHVtbXkod2luKSB7XG4gIHJldHVybiBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24od2luLCByZWdpc3RyYXRpb25OYW1lLCAoKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgREJVSVdlYkNvbXBvbmVudEJhc2UsXG4gICAgICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzLFxuICAgICAgUmVnaXN0ZXJhYmxlXG4gICAgfSA9IGdldERCVUlXZWJDb21wb25lbnRCYXNlKHdpbik7XG5cbiAgICBjbGFzcyBEQlVJV2ViQ29tcG9uZW50RHVtbXkgZXh0ZW5kcyBEQlVJV2ViQ29tcG9uZW50QmFzZSB7XG5cbiAgICAgIHN0YXRpYyBnZXQgcmVnaXN0cmF0aW9uTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHJlZ2lzdHJhdGlvbk5hbWU7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgdGVtcGxhdGVJbm5lckhUTUwoKSB7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgICAgPHN0eWxlPlxuICAgICAgICAgIDpob3N0IHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgbWF4LXdpZHRoOiA0MDBweDtcbiAgICAgICAgICAgIGhlaWdodDogdmFyKC0tZGJ1aS1pbnB1dC1oZWlnaHQsIDUwcHgpO1xuICAgICAgICAgICAgY29sb3I6IG1hcm9vbjtcbiAgICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIGdyYXk7XG4gICAgICAgICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICA6aG9zdCBiLCA6aG9zdCBkaXZbeC1oYXMtc2xvdF0gc3Bhblt4LXNsb3Qtd3JhcHBlcl0ge1xuICAgICAgICAgICAgdW5pY29kZS1iaWRpOiBiaWRpLW92ZXJyaWRlO1xuICAgICAgICAgICAgdGV4dC1zaGFkb3c6IHZhcigtLWR1bW15LWItdGV4dC1zaGFkb3csIG5vbmUpO1xuICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICA6aG9zdChbZGlyPXJ0bF0pIGIge1xuICAgICAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIDpob3N0KFtkaXI9bHRyXSkgYiB7XG4gICAgICAgICAgICB0ZXh0LWRlY29yYXRpb246IG92ZXJsaW5lO1xuICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICA6aG9zdChbZGlyPWx0cl0pICNjb250YWluZXIgPiBkaXZbZGlyPXJ0bF0sXG4gICAgICAgICAgOmhvc3QoW2Rpcj1ydGxdKSAjY29udGFpbmVyID4gZGl2W2Rpcj1sdHJdIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIDpob3N0ICNjb250YWluZXIgPiBkaXZbeC1oYXMtc2xvdF0ge1xuICAgICAgICAgICAgbWFyZ2luLWxlZnQ6IDBweDtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgI2NvbnRhaW5lciB7XG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgIGhlaWdodDogMTAwJTtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBmbGV4LWZsb3c6IHJvdyBub3dyYXA7XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogc3RyZXRjaDtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgI2NvbnRhaW5lciA+IGRpdiB7XG4gICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCBncmF5O1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogdmFyKC0tZHVtbXktaW5uZXItc2VjdGlvbnMtYm9yZGVyLXJhZGl1cywgMHB4KTtcbiAgICAgICAgICAgIGZsZXg6IDEgMCAwJTtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBtYXJnaW46IDVweDtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgI2NvbnRhaW5lciA+IGRpdiA+IGRpdiB7XG4gICAgICAgICAgICBtYXJnaW46IGF1dG87XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIDwvc3R5bGU+XG4gICAgICAgICAgXG4gICAgICAgICAgPGRpdiBpZD1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgPGRpdiBkaXI9XCJsdHJcIj5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8Yj5EdW1teSBzaGFkb3c8L2I+IFtMVFJdXG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIDxkaXYgeC1oYXMtc2xvdD5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8c3Bhbj5bPC9zcGFuPjxzcGFuIHgtc2xvdC13cmFwcGVyPjxzbG90Pjwvc2xvdD48L3NwYW4+PHNwYW4+XTwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgPGRpdiBkaXI9XCJydGxcIj5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8Yj5EdW1teSBzaGFkb3c8L2I+IFtSVExdXG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIGA7XG4gICAgICB9XG5cbiAgICAgIG9uTG9jYWxlQ2hhbmdlKGxvY2FsZSkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnb25Mb2NhbGVDaGFuZ2UnLCBsb2NhbGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBSZWdpc3RlcmFibGUoXG4gICAgICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzKFxuICAgICAgICBEQlVJV2ViQ29tcG9uZW50RHVtbXlcbiAgICAgIClcbiAgICApO1xuICB9KTtcbn1cblxuZ2V0REJVSVdlYkNvbXBvbmVudER1bW15LnJlZ2lzdHJhdGlvbk5hbWUgPSByZWdpc3RyYXRpb25OYW1lO1xuXG4iLCJcblxuaW1wb3J0IGdldERCVUlXZWJDb21wb25lbnRCYXNlIGZyb20gJy4uL0RCVUlXZWJDb21wb25lbnRCYXNlL0RCVUlXZWJDb21wb25lbnRCYXNlJztcbmltcG9ydCBnZXREQlVJV2ViQ29tcG9uZW50RHVtbXkgZnJvbSAnLi4vREJVSVdlYkNvbXBvbmVudER1bW15L0RCVUlXZWJDb21wb25lbnREdW1teSc7XG5pbXBvcnQgZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uIGZyb20gJy4uLy4uL2ludGVybmFscy9lbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24nO1xuXG5jb25zdCByZWdpc3RyYXRpb25OYW1lID0gJ2RidWktd2ViLWNvbXBvbmVudC1kdW1teS1wYXJlbnQnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXREQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQod2luKSB7XG4gIHJldHVybiBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24od2luLCByZWdpc3RyYXRpb25OYW1lLCAoKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgREJVSVdlYkNvbXBvbmVudEJhc2UsXG4gICAgICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzLFxuICAgICAgUmVnaXN0ZXJhYmxlXG4gICAgfSA9IGdldERCVUlXZWJDb21wb25lbnRCYXNlKHdpbik7XG4gICAgY29uc3QgREJVSVdlYkNvbXBvbmVudER1bW15ID0gZ2V0REJVSVdlYkNvbXBvbmVudER1bW15KHdpbik7XG5cbiAgICBjbGFzcyBEQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQgZXh0ZW5kcyBEQlVJV2ViQ29tcG9uZW50QmFzZSB7XG5cbiAgICAgIHN0YXRpYyBnZXQgcmVnaXN0cmF0aW9uTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHJlZ2lzdHJhdGlvbk5hbWU7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgdGVtcGxhdGVJbm5lckhUTUwoKSB7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgICAgPHN0eWxlPlxuICAgICAgICAgIDpob3N0IHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgbWF4LXdpZHRoOiA0MDBweDtcbiAgICAgICAgICB9XG4gICAgICAgICAgPC9zdHlsZT5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPGI+RHVtbXkgUGFyZW50IHNoYWRvdzwvYj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPGRidWktd2ViLWNvbXBvbmVudC1kdW1teT48c2xvdD48L3Nsb3Q+PC9kYnVpLXdlYi1jb21wb25lbnQtZHVtbXk+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCBkZXBlbmRlbmNpZXMoKSB7XG4gICAgICAgIHJldHVybiBbREJVSVdlYkNvbXBvbmVudER1bW15XTtcbiAgICAgIH1cblxuICAgIH1cblxuICAgIHJldHVybiBSZWdpc3RlcmFibGUoXG4gICAgICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzKFxuICAgICAgICBEQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnRcbiAgICAgIClcbiAgICApO1xuICB9KTtcbn1cblxuZ2V0REJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50LnJlZ2lzdHJhdGlvbk5hbWUgPSByZWdpc3RyYXRpb25OYW1lO1xuXG4iLCJpbXBvcnQgYXBwZW5kU3R5bGUgZnJvbSAnLi4vaW50ZXJuYWxzL2FwcGVuZFN0eWxlJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZGJ1aVdlYkNvbXBvbmVudHNTZXRVcCh3aW4pIHtcbiAgcmV0dXJuIHtcbiAgICBhcHBlbmRTdHlsZTogYXBwZW5kU3R5bGUod2luKVxuICB9O1xufVxuIiwiLypcbkRCVUlXZWJDb21wb25lbnRCYXNlIChmcm9tIHdoaWNoIGFsbCB3ZWItY29tcG9uZW50cyBpbmhlcml0KVxud2lsbCByZWFkIGNvbXBvbmVudFN0eWxlIGZyb20gd2luLkRCVUlXZWJDb21wb25lbnRzXG53aGVuIGtsYXNzLnJlZ2lzdGVyU2VsZigpIGlzIGNhbGxlZCBnaXZpbmcgYSBjaGFuY2UgdG8gb3ZlcnJpZGUgZGVmYXVsdCB3ZWItY29tcG9uZW50IHN0eWxlXG5qdXN0IGJlZm9yZSBpdCBpcyByZWdpc3RlcmVkLlxuKi9cbmNvbnN0IGFwcGVuZFN0eWxlID0gKHdpbikgPT4gKHJlZ2lzdHJhdGlvbk5hbWUsIGNvbXBvbmVudFN0eWxlKSA9PiB7XG4gIGlmICghd2luLkRCVUlXZWJDb21wb25lbnRzKSB7XG4gICAgd2luLkRCVUlXZWJDb21wb25lbnRzID0ge307XG4gIH1cbiAgd2luLkRCVUlXZWJDb21wb25lbnRzID0ge1xuICAgIC4uLndpbi5EQlVJV2ViQ29tcG9uZW50cyxcbiAgICBbcmVnaXN0cmF0aW9uTmFtZV06IHtcbiAgICAgIC4uLndpbi5EQlVJV2ViQ29tcG9uZW50c1tyZWdpc3RyYXRpb25OYW1lXSxcbiAgICAgIGNvbXBvbmVudFN0eWxlXG4gICAgfVxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgYXBwZW5kU3R5bGU7XG4iLCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uKHdpbiwgbmFtZSwgY2FsbGJhY2spIHtcbiAgaWYgKCF3aW4uREJVSVdlYkNvbXBvbmVudHMpIHtcbiAgICB3aW4uREJVSVdlYkNvbXBvbmVudHMgPSB7IHJlZ2lzdHJhdGlvbnM6IHt9IH07XG4gIH0gZWxzZSBpZiAoIXdpbi5EQlVJV2ViQ29tcG9uZW50cy5yZWdpc3RyYXRpb25zKSB7XG4gICAgd2luLkRCVUlXZWJDb21wb25lbnRzLnJlZ2lzdHJhdGlvbnMgPSB7fTtcbiAgfVxuXG4gIGxldCByZWdpc3RyYXRpb24gPSB3aW4uREJVSVdlYkNvbXBvbmVudHMucmVnaXN0cmF0aW9uc1tuYW1lXTtcblxuICBpZiAocmVnaXN0cmF0aW9uKSByZXR1cm4gcmVnaXN0cmF0aW9uO1xuXG4gIHJlZ2lzdHJhdGlvbiA9IGNhbGxiYWNrKCk7XG4gIHdpbi5EQlVJV2ViQ29tcG9uZW50cy5yZWdpc3RyYXRpb25zW25hbWVdID0gcmVnaXN0cmF0aW9uO1xuXG4gIHJldHVybiB3aW4uREJVSVdlYkNvbXBvbmVudHMucmVnaXN0cmF0aW9uc1tuYW1lXTtcbn1cblxuIiwiaW1wb3J0IGdldERCVUlsb2NhbGVTZXJ2aWNlIGZyb20gJy4vREJVSUxvY2FsZVNlcnZpY2UnO1xuaW1wb3J0IGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbiBmcm9tICcuLi9pbnRlcm5hbHMvZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uJztcblxuY29uc3QgZW1wdHlPYmogPSB7fTtcblxuY29uc3QgcmVnaXN0cmF0aW9uTmFtZSA9ICdEQlVJSTE4blNlcnZpY2UnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXREQlVJSTE4blNlcnZpY2Uod2luKSB7XG4gIGNvbnN0IGxvY2FsZVNlcnZpY2UgPSBnZXREQlVJbG9jYWxlU2VydmljZSh3aW4pO1xuICByZXR1cm4gZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uKHdpbiwgcmVnaXN0cmF0aW9uTmFtZSwgKCkgPT4ge1xuICAgIGNsYXNzIEkxOG5TZXJ2aWNlIHtcbiAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBsb2NhbGVTZXJ2aWNlLm9uTG9jYWxlQ2hhbmdlKHRoaXMuX2hhbmRsZUxvY2FsZUNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5fbG9jYWxlID0gbG9jYWxlU2VydmljZS5sb2NhbGU7XG4gICAgICAgIHRoaXMuX3RyYW5zbGF0aW9ucyA9IHt9O1xuICAgICAgfVxuXG4gICAgICBfaGFuZGxlTG9jYWxlQ2hhbmdlKGxvY2FsZSkge1xuICAgICAgICB0aGlzLl9sb2NhbGUgPSBsb2NhbGU7XG4gICAgICB9XG5cbiAgICAgIGNsZWFyVHJhbnNsYXRpb25zKGxhbmcpIHtcbiAgICAgICAgZGVsZXRlIHRoaXMuX3RyYW5zbGF0aW9uc1tsYW5nXTtcbiAgICAgIH1cblxuICAgICAgcmVnaXN0ZXJUcmFuc2xhdGlvbnModHJhbnNsYXRpb25zKSB7XG4gICAgICAgIHRoaXMuX3RyYW5zbGF0aW9ucyA9IE9iamVjdC5rZXlzKHRyYW5zbGF0aW9ucykucmVkdWNlKChhY2MsIGxhbmcpID0+IHtcbiAgICAgICAgICBhY2NbbGFuZ10gPSB7XG4gICAgICAgICAgICAuLi50aGlzLl90cmFuc2xhdGlvbnNbbGFuZ10sXG4gICAgICAgICAgICAuLi50cmFuc2xhdGlvbnNbbGFuZ11cbiAgICAgICAgICB9O1xuICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0sIHRoaXMuX3RyYW5zbGF0aW9ucyk7XG4gICAgICB9XG5cbiAgICAgIHRyYW5zbGF0ZShtc2cpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudExhbmdUcmFuc2xhdGlvbnNbbXNnXTtcbiAgICAgIH1cblxuICAgICAgZ2V0IHRyYW5zbGF0aW9ucygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zbGF0aW9ucztcbiAgICAgIH1cblxuICAgICAgZ2V0IGN1cnJlbnRMYW5nVHJhbnNsYXRpb25zKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdHJhbnNsYXRpb25zW3RoaXMuX2xvY2FsZS5sYW5nXSB8fCBlbXB0eU9iajtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBpMThuU2VydmljZSA9IG5ldyBJMThuU2VydmljZSgpO1xuICAgIHJldHVybiBpMThuU2VydmljZTtcbiAgfSk7XG59XG4iLCJcbmltcG9ydCBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24gZnJvbSAnLi4vaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbic7XG5cbmNvbnN0IGRlZmF1bHRMb2NhbGUgPSB7XG4gIGRpcjogJ2x0cicsXG4gIGxhbmc6ICdlbidcbn07XG5cbmNvbnN0IHJlZ2lzdHJhdGlvbk5hbWUgPSAnREJVSUxvY2FsZVNlcnZpY2UnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXREQlVJTG9jYWxlU2VydmljZSh3aW4pIHtcbiAgcmV0dXJuIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbih3aW4sIHJlZ2lzdHJhdGlvbk5hbWUsICgpID0+IHtcbiAgICBjbGFzcyBMb2NhbGVTZXJ2aWNlIHtcbiAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLl9jYWxsYmFja3MgPSBbXTtcbiAgICAgICAgdGhpcy5fbG9jYWxlQXR0cnMgPSBPYmplY3Qua2V5cyhkZWZhdWx0TG9jYWxlKTtcbiAgICAgICAgdGhpcy5fcm9vdEVsZW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgICAgICB0aGlzLl9sb2NhbGVBdHRycy5mb3JFYWNoKChhdHRyKSA9PiB7XG4gICAgICAgICAgaWYgKCF0aGlzLl9yb290RWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cikpIHtcbiAgICAgICAgICAgIHRoaXMuX3Jvb3RFbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyLCBkZWZhdWx0TG9jYWxlW2F0dHJdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9sb2NhbGUgPSB0aGlzLl9sb2NhbGVBdHRycy5yZWR1Y2UoKGFjYywgYXR0cikgPT4ge1xuICAgICAgICAgIGFjY1thdHRyXSA9IHRoaXMuX3Jvb3RFbGVtZW50LmdldEF0dHJpYnV0ZShhdHRyKTtcbiAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICB9LCB7fSk7XG4gICAgICAgIHRoaXMuX29ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy5faGFuZGxlTXV0YXRpb25zLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLl9vYnNlcnZlci5vYnNlcnZlKHRoaXMuX3Jvb3RFbGVtZW50LCB7XG4gICAgICAgICAgYXR0cmlidXRlczogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgX2hhbmRsZU11dGF0aW9ucyhtdXRhdGlvbnMpIHtcbiAgICAgICAgbXV0YXRpb25zLmZvckVhY2goKG11dGF0aW9uKSA9PiB7XG4gICAgICAgICAgY29uc3QgbXV0YXRpb25BdHRyaWJ1dGVOYW1lID0gbXV0YXRpb24uYXR0cmlidXRlTmFtZTtcbiAgICAgICAgICBpZiAodGhpcy5fbG9jYWxlQXR0cnMuaW5jbHVkZXMobXV0YXRpb25BdHRyaWJ1dGVOYW1lKSkge1xuICAgICAgICAgICAgdGhpcy5fbG9jYWxlID0ge1xuICAgICAgICAgICAgICAuLi50aGlzLl9sb2NhbGUsXG4gICAgICAgICAgICAgIFttdXRhdGlvbkF0dHJpYnV0ZU5hbWVdOiB0aGlzLl9yb290RWxlbWVudC5nZXRBdHRyaWJ1dGUobXV0YXRpb25BdHRyaWJ1dGVOYW1lKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrcy5mb3JFYWNoKGNhbGxiYWNrID0+IGNhbGxiYWNrKHRoaXMuX2xvY2FsZSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHNldCBsb2NhbGUobG9jYWxlT2JqKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKGxvY2FsZU9iaikuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgdGhpcy5fcm9vdEVsZW1lbnQuc2V0QXR0cmlidXRlKGtleSwgbG9jYWxlT2JqW2tleV0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZ2V0IGxvY2FsZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvY2FsZTtcbiAgICAgIH1cblxuICAgICAgb25Mb2NhbGVDaGFuZ2UoY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuICAgICAgICBjYWxsYmFjayh0aGlzLmxvY2FsZSk7XG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzLmZpbHRlcihjYiA9PiBjYiAhPT0gY2FsbGJhY2spO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGxvY2FsZVNlcnZpY2UgPSBuZXcgTG9jYWxlU2VydmljZSgpO1xuICAgIHJldHVybiBsb2NhbGVTZXJ2aWNlO1xuICB9KTtcbn1cbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgR29NYXJrR2l0aHViIGZyb20gJ3JlYWN0LWljb25zL2xpYi9nby9tYXJrLWdpdGh1Yic7XG5pbXBvcnQgR29UaHJlZUJhcnMgZnJvbSAncmVhY3QtaWNvbnMvbGliL2dvL3RocmVlLWJhcnMnO1xuaW1wb3J0IHsgc2NyZWVucywgc2NyZWVuTGlua3NHZW4gfSBmcm9tICcuL3NjcmVlbnMnO1xuaW1wb3J0IElGcmFtZVNjcmVlbiBmcm9tICcuL2ludGVybmFscy9yZWFjdENvbXBvbmVudHMvSUZyYW1lU2NyZWVuJztcbmltcG9ydCB7XG4gIHRvZ2dsZUFwcERpclxufSBmcm9tICcuL2ludGVybmFscy9hcHBVdGlscyc7XG5cbmNsYXNzIEFwcCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdoYXNoY2hhbmdlJywgdGhpcy5vbkhhc2hDaGFuZ2UuYmluZCh0aGlzKSk7XG4gICAgLy8gcmUtdXNpbmcgdGhlIGhlbHBlciBkZWZpbmVkIGZvciBpRnJhbWVcbiAgICB3aW5kb3cubWFrZVRhYnMoKTtcbiAgICB3aW5kb3cuaGlnaGxpZ2h0QmxvY2tzKCk7XG4gIH1cblxuICBvbkhhc2hDaGFuZ2UoKSB7XG4gICAgdGhpcy5mb3JjZVVwZGF0ZSgpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKCkge1xuICAgIHdpbmRvdy5tYWtlVGFicygpO1xuICAgIHdpbmRvdy5oaWdobGlnaHRCbG9ja3MoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgLyogZXNsaW50IG5vLWNvbnNvbGU6IDAgKi9cbiAgICAgIC8vIGNvbnNvbGUubG9nKCdyZW5kZXJpbmcgQXBwIGNvbXBvbmVudCcpO1xuICAgIH1cblxuICAgIGNvbnN0IHNjcmVlbnNLZXlzID0gT2JqZWN0LmtleXMoc2NyZWVucyk7XG4gICAgY29uc3Qgd2luZG93TG9jYXRpb25IYXNoID0gKHdpbmRvdy5sb2NhdGlvbi5oYXNoIHx8IGAjJHtzY3JlZW5zS2V5c1swXX1gKS5yZXBsYWNlKCcjJywgJycpO1xuXG4gICAgY29uc3QgbGlua3MgPSBzY3JlZW5MaW5rc0dlbi5tYXAoKHNlY3Rpb24sIGlkeCkgPT4ge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBrZXk9e2lkeH0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJsaW5rcy1zZWN0aW9uLWdyb3VwXCI+e3NlY3Rpb24udGl0bGV9PC9kaXY+XG4gICAgICAgICAgPHVsPlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBzZWN0aW9uLmxpbmtzLm1hcCgobGluaywgaWR4KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaXNBY3RpdmUgPSBsaW5rLnBhdGggPT09IHdpbmRvd0xvY2F0aW9uSGFzaCA/ICdhY3RpdmUnIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICA8bGkga2V5PXtpZHh9IHgtYWN0aXZlPXtpc0FjdGl2ZX0+XG4gICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9e2AjJHtsaW5rLnBhdGh9YH0+e2xpbmsudGl0bGV9PC9hPlxuICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIDwvdWw+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IFNjcmVlbiA9IHdpbmRvd0xvY2F0aW9uSGFzaC5lbmRzV2l0aCgnLmh0bWwnKSA/IElGcmFtZVNjcmVlbiA6IChzY3JlZW5zW3dpbmRvd0xvY2F0aW9uSGFzaF0gfHwgJ2RpdicpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFnZS1oZWFkZXJcIj5cbiAgICAgICAgICA8aDI+REVWIEJPWCBVSTwvaDI+PGFcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImhlYWQtbGlua1wiXG4gICAgICAgICAgICBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL2NhdGFsaW4tZW5hY2hlL2Rldi1ib3gtdWlcIlxuICAgICAgICAgICAgcmVsPVwibm9vcGVuZXIgbm9yZWZlcnJlclwiXG4gICAgICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIj48R29NYXJrR2l0aHViIHNpemU9ezI1fSAvPjwvYT5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGVtby13cmFwcGVyXCI+XG4gICAgICAgICAgPGxhYmVsIGlkPVwibGlua3MtdG9nZ2xlLWxhYmVsXCIgaHRtbEZvcj1cImxpbmtzLXRvZ2dsZVwiIGNsYXNzTmFtZT1cImhlYWQtbGlua1wiPjxHb1RocmVlQmFycyBzaXplPXsyNX0gLz48L2xhYmVsPlxuICAgICAgICAgIDxpbnB1dCBpZD1cImxpbmtzLXRvZ2dsZVwiIHR5cGU9XCJjaGVja2JveFwiIC8+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkZW1vLWxpbmtzXCIgb25DbGljaz17KCkgPT4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2xpbmtzLXRvZ2dsZScpLmNoZWNrZWQgPSBmYWxzZX0+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImxvY2FsZS1kaXItc3dpdGNoXCI+XG4gICAgICAgICAgICAgIDxhIGhyZWY9XCIjXCIgb25DbGljaz17dG9nZ2xlQXBwRGlyfT5UT0dHTEUgTE9DQUxFIERJUjwvYT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAge2xpbmtzfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGVtby1hcmVhXCI+XG4gICAgICAgICAgICA8U2NyZWVuLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFwcDtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge1xuLy8gb25TY3JlZW5Db25zb2xlLFxufSBmcm9tICdkZXYtYm94LXVpLXdlYi1jb21wb25lbnRzJztcbmltcG9ydCB7XG4gIGxvY2FsZUF3YXJlXG59IGZyb20gJ2Rldi1ib3gtdWktcmVhY3QtY29tcG9uZW50cyc7XG5pbXBvcnQgQXBwIGZyb20gJy4vYXBwJztcbi8vIGRlZmluZXMgc29tZSBoZWxwZXJzIG9uIHdpbmRvdyAocmV1c2luZyBjb2RlIG5lZWRlZCBpbiBpRnJhbWVzKVxuaW1wb3J0ICcuL2ludGVybmFscy9pRnJhbWVVdGlscy9vbldpbmRvd0RlZmluZWRIZWxwZXJzJztcblxuLy8gaW1wb3J0IGdldERCVUlXZWJDb21wb25lbnREdW1teSBmcm9tICcuLi9idWlsZC9zcmMvbGliL3dlYmNvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudER1bW15L0RCVUlXZWJDb21wb25lbnREdW1teSc7XG4vLyBpbXBvcnQgZ2V0REJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50IGZyb20gJy4uL2J1aWxkL3NyYy9saWIvd2ViY29tcG9uZW50cy9EQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQvREJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50JztcbmltcG9ydCBkYnVpV2ViQ29tcG9uZW50c1NldFVwIGZyb20gJy4uL3NyYy9saWIvd2ViLWNvbXBvbmVudHMvaGVscGVycy9kYnVpV2ViQ29tcG9uZW50c1NldHVwJztcbmltcG9ydCBnZXREQlVJV2ViQ29tcG9uZW50RHVtbXkgZnJvbSAnLi4vc3JjL2xpYi93ZWItY29tcG9uZW50cy9jb21wb25lbnRzL0RCVUlXZWJDb21wb25lbnREdW1teS9EQlVJV2ViQ29tcG9uZW50RHVtbXknO1xuaW1wb3J0IGdldERCVUlXZWJDb21wb25lbnREdW1teVBhcmVudCBmcm9tICcuLi9zcmMvbGliL3dlYi1jb21wb25lbnRzL2NvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50L0RCVUlXZWJDb21wb25lbnREdW1teVBhcmVudCc7XG5cbmRidWlXZWJDb21wb25lbnRzU2V0VXAod2luZG93KS5hcHBlbmRTdHlsZSgnZGJ1aS13ZWItY29tcG9uZW50LWR1bW15JywgYFxuICBiIHtcbiAgICBjb2xvcjogZGVlcHNreWJsdWU7XG4gICAgZm9udC1zdHlsZTogb2JsaXF1ZTtcbiAgfVxuYCk7XG5cbmNvbnN0IERCVUlXZWJDb21wb25lbnREdW1teSA9IGdldERCVUlXZWJDb21wb25lbnREdW1teSh3aW5kb3cpO1xuY29uc3QgREJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50ID0gZ2V0REJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50KHdpbmRvdyk7XG5cblxuc2V0VGltZW91dCgoKSA9PiB7XG4gIERCVUlXZWJDb21wb25lbnREdW1teS5yZWdpc3RlclNlbGYoKTtcbiAgREJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50LnJlZ2lzdGVyU2VsZigpO1xufSwgMjAwMCk7XG5cbmNvbnN0IGlmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpO1xuXG53aW5kb3cub25tZXNzYWdlID0gZnVuY3Rpb24gKG1zZykgeyBjb25zb2xlLmxvZygnbXNnIGZyb20gaWZyYW1lJywgbXNnKTsgfTtcbmlmcmFtZS5vbmxvYWQgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gIGNvbnN0IHRhcmdldCA9IGV2dC50YXJnZXQ7XG5cbiAgdGFyZ2V0LmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQud3JpdGUoYFxuICAgIDxodG1sPlxuICAgIDxib2R5PlxuICAgICAgPGRidWktd2ViLWNvbXBvbmVudC1kdW1teVxuICAgICAgICBzdHlsZT1cImNvbG9yOiBibHVlXCJcbiAgICAgID5cbiAgICAgICAgPHNwYW4+aGVsbG8gd29ybGQgMzwvc3Bhbj5cbiAgICAgIDwvZGJ1aS13ZWItY29tcG9uZW50LWR1bW15PlxuICAgICAgPGRidWktd2ViLWNvbXBvbmVudC1kdW1teS1wYXJlbnQ+PC9kYnVpLXdlYi1jb21wb25lbnQtZHVtbXktcGFyZW50PlxuICAgIDwvYm9keT5cbiAgICA8c2NyaXB0PlxuICAgICAgd2luZG93Lm9ubWVzc2FnZSA9IGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ21zZyBmcm9tIHdpbmRvdycsIG1zZyk7XG4gICAgICAgIHdpbmRvdy50b3AucG9zdE1lc3NhZ2UoJ3dvcmxkJywgJyonKTtcbiAgICAgIH07XG4gICAgPC9zY3JpcHQ+XG4gICAgPC9odG1sPlxuICBgKTtcbiAgdGFyZ2V0LmNvbnRlbnRXaW5kb3cucG9zdE1lc3NhZ2UoJ2hlbGxvJywgJyonKTtcblxuICBkYnVpV2ViQ29tcG9uZW50c1NldFVwKHRhcmdldC5jb250ZW50V2luZG93KS5hcHBlbmRTdHlsZSgnZGJ1aS13ZWItY29tcG9uZW50LWR1bW15JywgYFxuICAgIGIge1xuICAgICAgZm9udC1zdHlsZTogb2JsaXF1ZTtcbiAgICAgIG9wYWNpdHk6IDAuNTtcbiAgICB9XG4gIGApO1xuICBjb25zdCBEQlVJV2ViQ29tcG9uZW50RHVtbXkyID0gZ2V0REJVSVdlYkNvbXBvbmVudER1bW15KHRhcmdldC5jb250ZW50V2luZG93KTtcbiAgY29uc3QgREJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50MiA9IGdldERCVUlXZWJDb21wb25lbnREdW1teVBhcmVudCh0YXJnZXQuY29udGVudFdpbmRvdyk7XG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIERCVUlXZWJDb21wb25lbnREdW1teTIucmVnaXN0ZXJTZWxmKCk7XG4gICAgREJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50Mi5yZWdpc3RlclNlbGYoKTtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgLy8gdGFyZ2V0LnJlbW92ZSgpO1xuICAgIH0sIDIwMDApO1xuICB9LCAyMDAwKTtcbn07XG5cbi8vIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcblxuXG4vLyBvblNjcmVlbkNvbnNvbGUoeyBvcHRpb25zOiB7IHNob3dMYXN0T25seTogZmFsc2UgfSB9KTtcblxubGV0IERlbW8gPSBjbGFzcyBEZW1vIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAvKiBlc2xpbnQgbm8tY29uc29sZTogMCAqL1xuICAgICAgLy8gY29uc29sZS5sb2coJ3JlbmRlcmluZyBEZW1vIGNvbXBvbmVudCcpO1xuICAgIH1cbiAgICBjb25zdCB7IGxvY2FsZTogeyBkaXIgfSB9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gKFxuICAgICAgPEFwcCAvPlxuICAgICk7XG4gIH1cbn07XG5cbkRlbW8ucHJvcFR5cGVzID0ge1xuICBsb2NhbGU6IFByb3BUeXBlcy5vYmplY3Rcbn07XG5cbkRlbW8gPSBsb2NhbGVBd2FyZShEZW1vKTtcblxuUmVhY3RET00ucmVuZGVyKChcbiAgPERlbW8vPlxuKSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RlbW8nKSk7XG4iLCIvKiAgZXNsaW50IGltcG9ydC9wcmVmZXItZGVmYXVsdC1leHBvcnQ6IDAgKi9cbmZ1bmN0aW9uIHRvZ2dsZUFwcERpcihldnQpIHtcbiAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gIGNvbnN0IGRvY3VtZW50RWxlbWVudCA9IHdpbmRvdy5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gIGNvbnN0IGN1cnJlbnREaXIgPSBkb2N1bWVudEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkaXInKTtcbiAgY29uc3QgbmV4dERpciA9IGN1cnJlbnREaXIgPT09ICdsdHInID8gJ3J0bCcgOiAnbHRyJztcbiAgZG9jdW1lbnRFbGVtZW50LnNldEF0dHJpYnV0ZSgnZGlyJywgbmV4dERpcik7XG59XG5cbmV4cG9ydCB7XG4gIHRvZ2dsZUFwcERpclxufTtcbiIsIi8qIGVzbGludCBpbXBvcnQvcHJlZmVyLWRlZmF1bHQtZXhwb3J0OiAwICovXG5cbmV4cG9ydCBjb25zdCBkaXN0cmlidXRpb25VUkwgPVxuICAnaHR0cHM6Ly9jYXRhbGluLWVuYWNoZS5naXRodWIuaW8vZGV2LWJveC11aS9idWlsZC9kaXN0L2pzL2Rldi1ib3gtdWktd2ViY29tcG9uZW50cy5qcyc7XG4iLCJcbndpbmRvdy5nZW5lcmF0ZUNvbXBvbmVudFByb3BlcnRpZXNUYWJsZSA9IGZ1bmN0aW9uIChkYXRhLCBzZWxlY3RvciA9ICcucHJvcGVydGllcycpIHtcbiAgY29uc3QgcHJvcGVydGllc0NvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICBjb25zdCBuYW1lcyA9IE9iamVjdC5rZXlzKGRhdGEpO1xuICBjb25zdCB0YWJsZSA9IGBcbjxoMyBjbGFzcz1cInNlY3Rpb25cIj5Qcm9wZXJ0aWVzPC9oMz5cbjx0YWJsZT5cbjx0aGVhZD5cbiAgPHRoIGNsYXNzPVwicHJvcC1uYW1lXCI+TmFtZTwvdGg+XG4gIDx0aCBjbGFzcz1cInByb3AtdHlwZVwiPlR5cGU8L3RoPlxuICA8dGggY2xhc3M9XCJwcm9wLWRlZmF1bHRcIj5EZWZhdWx0PC90aD5cbiAgPHRoIGNsYXNzPVwicHJvcC1kZXNjcmlwdGlvblwiPkRlc2NyaXB0aW9uPC90aD5cbjwvdGhlYWQ+XG48dGJvZHk+JHtcbiAgbmFtZXMubWFwKChuYW1lKSA9PiB7XG4gICAgcmV0dXJuIGA8dHI+XG4gICAgICAgICAgICAgIDx0ZCBjbGFzcz1cInByb3AtbmFtZVwiPiR7bmFtZX08L3RkPlxuICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJwcm9wLXR5cGVcIj4ke2RhdGFbbmFtZV0udHlwZX08L3RkPlxuICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJwcm9wLWRlZmF1bHRcIj48cHJlPiR7ZGF0YVtuYW1lXS5kZWZhdWx0fTwvcHJlPjwvdGQ+XG4gICAgICAgICAgICAgIDx0ZCBjbGFzcz1cInByb3AtZGVzY3JpcHRpb25cIj4ke2RhdGFbbmFtZV0uZGVzY3JpcHRpb259PC90ZD5cbiAgICAgICAgICAgIDwvdHI+YDtcbiAgfSkuam9pbignJylcbn08L3Rib2R5PlxuPC90YWJsZT5cbiAgICBgO1xuXG4gIHByb3BlcnRpZXNDb250YWluZXIuaW5uZXJIVE1MID0gdGFibGU7XG59O1xuXG4vLyBkZXBlbmRzIG9uIC50YWJzIHN0eWxlIGRlZmluZWQgaW4gZGVtb1NjcmVlbi5zY3NzXG53aW5kb3cubWFrZVRhYnMgPSBmdW5jdGlvbiAoKSB7XG4gIGxldCBncm9wQ291bnQgPSAxO1xuICBsZXQgaWRDb3VudCA9IDE7XG5cbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYnMnKS5mb3JFYWNoKCh0YWJzQmxvY2spID0+IHtcbiAgICBjb25zdCBmaXJzdFNlY3Rpb24gPSB0YWJzQmxvY2sucXVlcnlTZWxlY3Rvcignc2VjdGlvbicpO1xuXG4gICAgdGFic0Jsb2NrLnF1ZXJ5U2VsZWN0b3JBbGwoJ3NlY3Rpb24nKS5mb3JFYWNoKChzZWN0aW9uKSA9PiB7XG4gICAgICBjb25zdCBzZWN0aW9uTmFtZSA9IHNlY3Rpb24uZ2V0QXR0cmlidXRlKCd4LW5hbWUnKTtcbiAgICAgIGNvbnN0IGlzQ2hlY2tlZCA9IHNlY3Rpb24uZ2V0QXR0cmlidXRlKCd4LWNoZWNrZWQnKTtcbiAgICAgIGNvbnN0IGhpZ2hsaWdodCA9IHNlY3Rpb24uZ2V0QXR0cmlidXRlKCd4LWhpZ2hsaWdodCcpO1xuICAgICAgY29uc3QgY29udGVudCA9IHNlY3Rpb24uaW5uZXJIVE1MO1xuXG4gICAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG5cbiAgICAgIHNlY3Rpb24uaWQgPSBgY29udGVudC0ke2lkQ291bnR9YDtcbiAgICAgIGlmIChoaWdobGlnaHQpIHtcbiAgICAgICAgc2VjdGlvbi5pbm5lckhUTUwgPSBgPHByZT48Y29kZSBjbGFzcz1cIiR7aGlnaGxpZ2h0fVwiPiR7XG4gICAgICAgICAgY29udGVudFxuICAgICAgICB9PC9jb2RlPjwvcHJlPmA7XG4gICAgICB9XG5cbiAgICAgIGlucHV0LnR5cGUgPSAncmFkaW8nO1xuICAgICAgaW5wdXQubmFtZSA9IGBncm91cC0ke2dyb3BDb3VudH1gO1xuICAgICAgaW5wdXQuaWQgPSBgdGFiLSR7aWRDb3VudH1gO1xuICAgICAgaWYgKGlzQ2hlY2tlZCkge1xuICAgICAgICBpbnB1dC5jaGVja2VkID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgbGFiZWwuaHRtbEZvciA9IGlucHV0LmlkO1xuICAgICAgbGFiZWwuaW5uZXJUZXh0ID0gc2VjdGlvbk5hbWU7XG5cbiAgICAgIHRhYnNCbG9jay5pbnNlcnRCZWZvcmUoaW5wdXQsIGZpcnN0U2VjdGlvbik7XG4gICAgICB0YWJzQmxvY2suaW5zZXJ0QmVmb3JlKGxhYmVsLCBmaXJzdFNlY3Rpb24pO1xuXG4gICAgICBpZENvdW50ICs9IDE7XG4gICAgfSk7XG5cbiAgICBncm9wQ291bnQgKz0gMTtcbiAgfSk7XG59O1xuXG53aW5kb3cuaGlnaGxpZ2h0QmxvY2tzID0gZnVuY3Rpb24gKCkge1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdwcmUgY29kZS5odG1sJykuZm9yRWFjaCgoYmxvY2spID0+IHtcbiAgICAvLyBpZiBub3QgYWxyZWFkeSBlc2NhcGVkIChpbiB3aGljaCBjYXNlIGNvbnRhaW5zICcmbHQ7JykgKFJlYWN0IHN0cmluZyBzY2VuYXJpbylcbiAgICBpZiAoIWJsb2NrLmlubmVySFRNTC5pbmNsdWRlcygnJmx0OycpKSB7XG4gICAgICBibG9jay5pbm5lckhUTUwgPVxuICAgICAgYmxvY2suaW5uZXJIVE1MXG4gICAgICAgIC5yZXBsYWNlKC8mL2csICcmYW1wOycpXG4gICAgICAgIC5yZXBsYWNlKC88L2csICcmbHQ7JylcbiAgICAgICAgLnJlcGxhY2UoLz4vZywgJyZndDsnKVxuICAgICAgICAucmVwbGFjZSgvXCIvZywgJyZxdW90OycpXG4gICAgICAgIC5yZXBsYWNlKC8nL2csICcmIzAzOTsnKTtcbiAgICB9XG4gIH0pO1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdwcmUgY29kZScpLmZvckVhY2goKGJsb2NrKSA9PiB7XG4gICAgd2luZG93LmhsanMgJiYgd2luZG93LmhsanMuaGlnaGxpZ2h0QmxvY2soYmxvY2spO1xuICB9KTtcbn07XG5cbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IGxvY2FsZUF3YXJlIGZyb20gJy4uLy4uLy4uL3NyYy9saWIvcmVhY3QtY29tcG9uZW50cy9iZWhhdmlvdXJzL2xvY2FsZUF3YXJlJztcblxubGV0IElGcmFtZVNjcmVlbiA9IGNsYXNzIElGcmFtZVNjcmVlbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuaWZyYW1lTm9kZSA9IG51bGw7XG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xuICAgIGNvbnN0IHsgbG9jYWxlOiB7IGRpciB9IH0gPSBuZXh0UHJvcHM7XG4gICAgdGhpcy5pZnJhbWVOb2RlLmNvbnRlbnRXaW5kb3cucG9zdE1lc3NhZ2UoYGNoYW5nZURpciAke2Rpcn1gLCAnKicpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGlzUHJvZCA9ICF3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuaW5jbHVkZXMoJy5kZXYuJyk7XG4gICAgY29uc3Qgd2luZG93TG9jYXRpb25IYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2gucmVwbGFjZSgnIycsICcnKTtcbiAgICByZXR1cm4gKFxuICAgICAgPGlmcmFtZVxuICAgICAgICByZWY9eyhub2RlKSA9PiB0aGlzLmlmcmFtZU5vZGUgPSBub2RlfVxuICAgICAgICBzcmM9e2BzcmNEZW1vL3NjcmVlbnMvJHt3aW5kb3dMb2NhdGlvbkhhc2h9P3Byb2R1Y3Rpb249JHtpc1Byb2QgPyAnMScgOiAnMCd9YH0gLz5cbiAgICApO1xuICB9XG59O1xuSUZyYW1lU2NyZWVuLnByb3BUeXBlcyA9IHtcbiAgbG9jYWxlOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgIGRpcjogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBsYW5nOiBQcm9wVHlwZXMuc3RyaW5nXG4gIH0pXG59O1xuSUZyYW1lU2NyZWVuID0gbG9jYWxlQXdhcmUoSUZyYW1lU2NyZWVuKTtcblxuZXhwb3J0IGRlZmF1bHQgSUZyYW1lU2NyZWVuO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmNsYXNzIFByb3BlcnRpZXNUYWJsZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIC8vIHJlLXVzaW5nIHRoZSBoZWxwZXIgZGVmaW5lZCBmb3IgaUZyYW1lXG4gICAgd2luZG93LmdlbmVyYXRlQ29tcG9uZW50UHJvcGVydGllc1RhYmxlKHRoaXMucHJvcHMucHJvcGVydGllcyk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwicHJvcGVydGllc1wiIC8+O1xuICB9XG59XG5cblByb3BlcnRpZXNUYWJsZS5wcm9wVHlwZXMgPSB7XG4gIHByb3BlcnRpZXM6IFByb3BUeXBlcy5vYmplY3Rcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFByb3BlcnRpZXNUYWJsZTtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmNsYXNzIE9uU2NyZWVuQ29uc29sZVNjcmVlbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJkZW1vLXNjcmVlblwiPiB7IC8qIHN0YW5kYXJkIHRlbXBsYXRlIHJlcXVpcmVtZW50ICovIH1cbiAgICAgICAgPGgyIGNsYXNzTmFtZT1cInRpdGxlXCI+T24gU2NyZWVuIENvbnNvbGU8L2gyPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBPblNjcmVlbkNvbnNvbGVTY3JlZW47XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtcbiAgZGlzdHJpYnV0aW9uVVJMXG59IGZyb20gJy4uLy4uL2ludGVybmFscy9jb25zdGFudHMnO1xuXG5jbGFzcyBVc2luZ0RldkJveFVJIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImRlbW8tc2NyZWVuXCI+IHsgLyogc3RhbmRhcmQgdGVtcGxhdGUgcmVxdWlyZW1lbnQgKi8gfVxuICAgICAgICA8aDIgY2xhc3NOYW1lPVwidGl0bGVcIj5Mb2FkaW5nIERldiBCb3ggVUkgV2ViIENvbXBvbmVudHM8L2gyPlxuICAgICAgICA8aDMgY2xhc3NOYW1lPVwic2VjdGlvblwiPkZyb20gRGlzdHJpYnV0aW9uPC9oMz5cbiAgICAgICAgPHByZT48Y29kZSBjbGFzc05hbWU9XCJodG1sXCI+XG4gICAgICAgICAge2BcbjwhZG9jdHlwZSBodG1sPlxuPGh0bWwgZGlyPVwibHRyXCIgbGFuZz1cImVuXCI+XG48aGVhZD5cbiAgPG1ldGEgY2hhcnNldD1cIlVURi04XCI+XG4gIDxtZXRhIG5hbWU9XCJ2aWV3cG9ydFwiIGNvbnRlbnQ9XCJ3aWR0aD1kZXZpY2Utd2lkdGgsIGluaXRpYWwtc2NhbGU9MSwgc2hyaW5rLXRvLWZpdD1ub1wiPlxuICA8c2NyaXB0IHNyYz1cIiR7ZGlzdHJpYnV0aW9uVVJMfVwiPjwvc2NyaXB0PlxuICA8c2NyaXB0PlxuICAgIGNvbnN0IHtcbiAgICAgIHF1aWNrU2V0dXBBbmRMb2FkXG4gICAgfSA9IHJlcXVpcmUoJ2Rldi1ib3gtdWktd2ViY29tcG9uZW50cycpO1xuICAgIGNvbnN0IHtcbiAgICAgICdkYnVpLXdlYi1jb21wb25lbnQtZHVtbXktcGFyZW50JzogZGJ1aVdlYkNvbXBvbmVudER1bW15UGFyZW50Q2xhc3MsXG4gICAgfSA9IHF1aWNrU2V0dXBBbmRMb2FkKHdpbmRvdykoW1xuICAgICAge1xuICAgICAgICByZWdpc3RyYXRpb25OYW1lOiAnZGJ1aS13ZWItY29tcG9uZW50LWR1bW15JyxcbiAgICAgICAgY29tcG9uZW50U3R5bGU6IFxcYFxuICAgICAgICAgYiB7XG4gICAgICAgICAgIGNvbG9yOiB2YXIoLS1kdW1teS1iLWNvbG9yLCBpbmhlcml0KTtcbiAgICAgICAgICAgYm9yZGVyLXJhZGl1czogdmFyKC0tZHVtbXktYi1ib3JkZXItcmFkaXVzLCAwcHgpO1xuICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1kdW1teS1iLWJnLWNvbG9yLCB0cmFuc3BhcmVudCk7XG4gICAgICAgICB9XG4gICAgICAgIFxcYFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgcmVnaXN0cmF0aW9uTmFtZTogJ2RidWktd2ViLWNvbXBvbmVudC1kdW1teS1wYXJlbnQnXG4gICAgICB9XG4gICAgXSk7XG4gIDwvc2NyaXB0PlxuPC9oZWFkPlxuPGJvZHk+XG48ZGJ1aS13ZWItY29tcG9uZW50LWR1bW15LXBhcmVudD5oZWxsbyAxPC9kYnVpLXdlYi1jb21wb25lbnQtZHVtbXktcGFyZW50PlxuPC9ib2R5PlxuPC9odG1sPlxuXG4gICAgICAgICAgYH1cbiAgICAgICAgPC9jb2RlPjwvcHJlPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBVc2luZ0RldkJveFVJO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuY2xhc3MgREJVSVdlYkNvbXBvbmVudER1bW15U2NyZWVuIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImRlbW8tc2NyZWVuXCI+eyAvKiBzdGFuZGFyZCB0ZW1wbGF0ZSByZXF1aXJlbWVudCAqLyB9XG5cbiAgICAgICAgPGRidWktd2ViLWNvbXBvbmVudC1kdW1teVxuICAgICAgICAgIHN0eWxlPXt7IGNvbG9yOiAnYmx1ZScgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxzcGFuPmhlbGxvIDE8L3NwYW4+XG4gICAgICAgIDwvZGJ1aS13ZWItY29tcG9uZW50LWR1bW15PlxuXG4gICAgICAgIDxkYnVpLXdlYi1jb21wb25lbnQtZHVtbXlcbiAgICAgICAgICBzdHlsZT17eyBjb2xvcjogJ2JsdWUnIH19XG4gICAgICAgID5cbiAgICAgICAgICA8c3Bhbj5oZWxsbyAyPC9zcGFuPlxuICAgICAgICA8L2RidWktd2ViLWNvbXBvbmVudC1kdW1teT5cbiAgICAgICAgPGRidWktd2ViLWNvbXBvbmVudC1kdW1teS1wYXJlbnQ+aGVsbG8gMzwvZGJ1aS13ZWItY29tcG9uZW50LWR1bW15LXBhcmVudD5cblxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBEQlVJV2ViQ29tcG9uZW50RHVtbXlTY3JlZW47XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtcbiAgRHJhZ2dhYmxlLCBEaXNhYmxlU2VsZWN0aW9uXG59IGZyb20gJ2Rldi1ib3gtdWktcmVhY3QtY29tcG9uZW50cyc7XG5pbXBvcnQgUHJvcGVydGllc1RhYmxlIGZyb20gJy4uLy4uL2ludGVybmFscy9yZWFjdENvbXBvbmVudHMvUHJvcGVydGllc1RhYmxlJztcblxuY2xhc3MgVG9SZW5kZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgLy8gY29uc29sZS5sb2coJ1RvUmVuZGVyI3JlbmRlcicpO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIHN0eWxlPXt7IHdpZHRoOiAzMDAsIGhlaWdodDogMzAwIH19XG4gICAgICAgIG9uTW91c2VEb3duPXt0aGlzLnByb3BzLm9uTW91c2VEb3dufVxuICAgICAgICBvbk1vdXNlVXA9e3RoaXMucHJvcHMub25Nb3VzZVVwfVxuICAgICAgICBvbkNsaWNrPXt0aGlzLnByb3BzLm9uQ2xpY2t9XG4gICAgICAgIG9uVG91Y2hTdGFydD17dGhpcy5wcm9wcy5vblRvdWNoU3RhcnR9XG4gICAgICAgIG9uVG91Y2hFbmQ9e3RoaXMucHJvcHMub25Ub3VjaEVuZH1cbiAgICAgID5cbiAgICAgICAgPHA+ZHJhZ2dhYmxlIHAge3RoaXMucHJvcHMuY291bnRlcn0gPGEgaHJlZj1cImh0dHA6Ly9nb29nbGUuY29tXCIgdGFyZ2V0PVwiX2JsYW5rXCI+bGluazwvYT48L3A+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmNsYXNzIERyYWdnYWJsZVNjcmVlbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuaGFuZGxlTW91c2VEb3duID0gdGhpcy5oYW5kbGVNb3VzZURvd24uYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZVRvdWNoU3RhcnQgPSB0aGlzLmhhbmRsZVRvdWNoU3RhcnQuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZU1vdXNlVXAgPSB0aGlzLmhhbmRsZU1vdXNlVXAuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZVRvdWNoRW5kID0gdGhpcy5oYW5kbGVUb3VjaEVuZC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlQ2xpY2sgPSB0aGlzLmhhbmRsZUNsaWNrLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLmNvdW50ZXIgPSAxO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBkcmFnZ2FibGVDb250ZW50OiB0aGlzLmRyYWdnYWJsZUNvbnRlbnRcbiAgICB9O1xuICB9XG5cbiAgZ2V0IGRyYWdnYWJsZUNvbnRlbnQoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxUb1JlbmRlclxuICAgICAgICBvbk1vdXNlRG93bj17dGhpcy5oYW5kbGVNb3VzZURvd259XG4gICAgICAgIG9uTW91c2VVcD17dGhpcy5oYW5kbGVNb3VzZVVwfVxuICAgICAgICBvblRvdWNoU3RhcnQ9e3RoaXMuaGFuZGxlVG91Y2hTdGFydH1cbiAgICAgICAgb25Ub3VjaEVuZD17dGhpcy5oYW5kbGVUb3VjaEVuZH1cbiAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVDbGlja31cbiAgICAgICAgY291bnRlcj17dGhpcy5jb3VudGVyfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgaGFuZGxlTW91c2VEb3duKGV2dCkge1xuICAgIGNvbnNvbGUubG9nKCdEcmFnZ2FibGVTY3JlZW4jaGFuZGxlTW91c2VEb3duJyk7XG4gIH1cbiAgaGFuZGxlTW91c2VVcChldnQpIHtcbiAgICBjb25zb2xlLmxvZygnRHJhZ2dhYmxlU2NyZWVuI2hhbmRsZU1vdXNlVXAnKTtcbiAgfVxuICBoYW5kbGVUb3VjaFN0YXJ0KGV2dCkge1xuICAgIGNvbnNvbGUubG9nKCdEcmFnZ2FibGVTY3JlZW4jaGFuZGxlVG91Y2hTdGFydCcpO1xuICB9XG4gIGhhbmRsZVRvdWNoRW5kKGV2dCkge1xuICAgIGNvbnNvbGUubG9nKCdEcmFnZ2FibGVTY3JlZW4jaGFuZGxlVG91Y2hFbmQnKTtcbiAgfVxuICBoYW5kbGVDbGljayhldnQpIHtcbiAgICBjb25zb2xlLmxvZygnRHJhZ2dhYmxlU2NyZWVuI2hhbmRsZUNsaWNrJyk7XG4gICAgLy8gdGhpcy5jb3VudGVyID0gdGhpcy5jb3VudGVyICsgMTtcbiAgICAvLyB0aGlzLnNldFN0YXRlKHtcbiAgICAvLyAgIGRyYWdnYWJsZUNvbnRlbnQ6IHRoaXMuZHJhZ2dhYmxlQ29udGVudFxuICAgIC8vIH0pO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5fbW91bnRlZCA9IHRydWU7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuX21vdW50ZWQpIHJldHVybjtcbiAgICAgIHRoaXMuY291bnRlciA9IHRoaXMuY291bnRlciArIDE7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgZHJhZ2dhYmxlQ29udGVudDogdGhpcy5kcmFnZ2FibGVDb250ZW50XG4gICAgICB9KTtcbiAgICB9LCAzMDAwKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMuX21vdW50ZWQgPSBmYWxzZTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJkZW1vLXNjcmVlblwiPiB7IC8qIHN0YW5kYXJkIHRlbXBsYXRlIHJlcXVpcmVtZW50ICovIH1cblxuICAgICAgICA8aDIgY2xhc3NOYW1lPVwidGl0bGVcIj5EcmFnZ2FibGUgUmVhY3Qge3RoaXMuY291bnRlcn08L2gyPlxuXG4gICAgICAgIDxoMyBjbGFzc05hbWU9XCJzZWN0aW9uXCI+U3R1ZmYgT25lPC9oMz5cblxuICAgICAgICA8cD5iZWZvcmUgdGFiczwvcD5cblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRhYnNcIj5cbiAgICAgICAgICA8c2VjdGlvbiB4LW5hbWU9XCJSRVNVTFRcIiB4LWNoZWNrZWQ9XCIxXCI+XG4gICAgICAgICAgICA8RHJhZ2dhYmxlIHN0eWxlPXt7IGJvcmRlcjogJzFweCBzb2xpZCBibHVlJywgd2lkdGg6IDIwMCwgaGVpZ2h0OiAyMDAsIG92ZXJmbG93WDogJ3Njcm9sbCcsIG92ZXJmbG93WTogJ3Njcm9sbCcgfX0+XG4gICAgICAgICAgICAgIHt0aGlzLnN0YXRlLmRyYWdnYWJsZUNvbnRlbnR9XG4gICAgICAgICAgICA8L0RyYWdnYWJsZT5cbiAgICAgICAgICAgIDxEaXNhYmxlU2VsZWN0aW9uPlxuICAgICAgICAgICAgICA8cD5kaXNhYmxlZCBzZWxlY3Rpb248L3A+XG4gICAgICAgICAgICA8L0Rpc2FibGVTZWxlY3Rpb24+XG4gICAgICAgICAgICB7QXJyYXkuZnJvbSh7IGxlbmd0aDogMTAgfSkubWFwKChlbCwgaSkgPT4gPHAga2V5PXtpfT57aX0gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tPC9wPil9XG4gICAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgICAgIDxzZWN0aW9uIHgtbmFtZT1cIkhUTUxcIiB4LWhpZ2hsaWdodD1cImh0bWxcIj57YFxuPHA+ZHJhZ2dhYmxlPC9wPlxuPHNwYW4+cmVhY3Q8L3NwYW4+XG4gICAgICAgICAgYH1cbiAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgICAgPHNlY3Rpb24geC1uYW1lPVwiQ1NTXCIgeC1oaWdobGlnaHQ9XCJjc3NcIj57YFxuYm9keSB7XG4gIGNvbG9yOiByZWQ7XG59XG4gICAgICAgICAgYH1cbiAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgICAgPHNlY3Rpb24geC1uYW1lPVwiSlNcIiB4LWhpZ2hsaWdodD1cImphdmFzY3JpcHRcIj57YFxuY2xhc3MgQ2FyIGV4dGVuZHMgU3VwZXJDbGFzcyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBvbkluaXQoKSB7XG4gICAgdGhpcy5kbygoKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhwcmludCk7XG4gICAgfSk7XG4gIH1cbn1cbiAgICAgICAgICBgfVxuICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPHA+YmV0d2VlbiB0YWJzPC9wPlxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGFic1wiPlxuICAgICAgICAgIDxzZWN0aW9uIHgtbmFtZT1cIkNTU1wiIHgtaGlnaGxpZ2h0PVwiY3NzXCI+e2BcbmJvZHkge1xuICBjb2xvcjogcmVkO1xufVxuICAgICAgICAgIGB9XG4gICAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgICAgIDxzZWN0aW9uIHgtbmFtZT1cIkpTXCIgeC1oaWdobGlnaHQ9XCJqYXZhc2NyaXB0XCIgeC1jaGVja2VkPVwiMVwiPntgXG5jbGFzcyBDYXIgZXh0ZW5kcyBTdXBlckNsYXNzIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIG9uSW5pdCgpIHtcbiAgICB0aGlzLmRvKCgpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKHByaW50KTtcbiAgICB9KTtcbiAgfVxufVxuICAgICAgICAgIGB9XG4gICAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8UHJvcGVydGllc1RhYmxlIHByb3BlcnRpZXM9e3tcbiAgICAgICAgICBwcm9wZXJ0eU9uZToge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiAndmFsdWUgMScsXG4gICAgICBkZXNjcmlwdGlvbjogJ2Rlc2NyaXB0aW9uIG9uZSdcbiAgICB9LFxuICAgIHByb3BlcnR5VHdvOiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6ICc1JyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnZGVzY3JpcHRpb24gdHdvJ1xuICAgIH1cbiAgICAgICAgfX0gLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRHJhZ2dhYmxlU2NyZWVuO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7XG4gIEZvcm1JbnB1dE51bWJlclxufSBmcm9tICdkZXYtYm94LXVpLXJlYWN0LWNvbXBvbmVudHMnO1xuXG5cbmNsYXNzIEZvcm1JbnB1dE51bWJlclNjcmVlbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBpbnB1dFZhbHVlOiAtNy4wOFxuICAgIH07XG4gICAgdGhpcy5oYW5kbGVDaGFuZ2UgPSB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaGFuZGxlQ2hhbmdlKGlucHV0VmFsdWUpIHtcbiAgICBjb25zdCB2YWx1ZVRvU2VuZEJhY2sgPSBOdW1iZXIoaW5wdXRWYWx1ZS50b1ByZWNpc2lvbigxNikpO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaW5wdXRWYWx1ZTogdmFsdWVUb1NlbmRCYWNrXG4gICAgfSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGVtby1zY3JlZW5cIj4geyAvKiBzdGFuZGFyZCB0ZW1wbGF0ZSByZXF1aXJlbWVudCAqLyB9XG4gICAgICAgIDxwcmU+PGNvZGUgY2xhc3NOYW1lPVwiaHRtbFwiPlxuICAgICAgICAgIHtgXG4gICAgICAgICAgICA8cD5mb3JtIGlucHV0IG51bWJlcjwvcD5cbiAgICAgICAgICAgIDxzcGFuPnJlYWN0PC9zcGFuPlxuICAgICAgICAgIGB9XG4gICAgICAgIDwvY29kZT48L3ByZT5cbiAgICAgICAgPHByZT48Y29kZSBjbGFzc05hbWU9XCJqYXZhc2NyaXB0XCI+XG4gICAgICAgICAge2BcbiAgICAgICAgICAgIGNsYXNzIE1hY2hpbmUgZXh0ZW5kcyBTdXBlckNsYXNzIHtcbiAgICAgICAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIG9uSW5pdCgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRvKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHByaW50KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIGB9XG4gICAgICAgIDwvY29kZT48L3ByZT5cbiAgICAgICAgPHByZT48Y29kZSBjbGFzc05hbWU9XCJjc3NcIj5cbiAgICAgICAgICB7YFxuICAgICAgICAgICAgaHRtbFtkaXI9bHRyXSB7XG4gICAgICAgICAgICAgIGNvbG9yOiByZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgYH1cbiAgICAgICAgPC9jb2RlPjwvcHJlPlxuICAgICAgICA8Rm9ybUlucHV0TnVtYmVyXG4gICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUuaW5wdXRWYWx1ZX1cbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9XG4gICAgICAgICAgZGVmYXVsdERlY1BvaW50PVwiLFwiXG4gICAgICAgICAgZGVmYXVsdFRob3VzYW5kc1NlcGFyYXRvcj1cIi5cIlxuICAgICAgICAvPlxuICAgICAgICA8Rm9ybUlucHV0TnVtYmVyXG4gICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUuaW5wdXRWYWx1ZX1cbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9XG4gICAgICAgIC8+XG4gICAgICAgIDxwPnt0aGlzLnN0YXRlLmlucHV0VmFsdWV9eydcXHUwMEEwJ308L3A+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEZvcm1JbnB1dE51bWJlclNjcmVlbjtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1xuICBGb3JtSW5wdXRcbn0gZnJvbSAnZGV2LWJveC11aS1yZWFjdC1jb21wb25lbnRzJztcblxuXG5jbGFzcyBGb3JtSW5wdXRTY3JlZW4gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgaW5wdXRWYWx1ZTogNlxuICAgIH07XG4gICAgdGhpcy5oYW5kbGVDaGFuZ2UgPSB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaGFuZGxlQ2hhbmdlKGlucHV0VmFsdWUpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGlucHV0VmFsdWVcbiAgICB9KTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJkZW1vLXNjcmVlblwiPiB7IC8qIHN0YW5kYXJkIHRlbXBsYXRlIHJlcXVpcmVtZW50ICovIH1cbiAgICAgICAgPEZvcm1JbnB1dFxuICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLmlucHV0VmFsdWV9XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfVxuICAgICAgICAgIGhhc1dhcm5pbmc9e2ZhbHNlfVxuICAgICAgICAgIGhhc0Vycm9yPXtmYWxzZX1cbiAgICAgICAgICBkaXNhYmxlZD17ZmFsc2V9XG4gICAgICAgIC8+XG4gICAgICAgIDxwPnt0aGlzLnN0YXRlLmlucHV0VmFsdWV9eydcXHUwMEEwJ308L3A+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEZvcm1JbnB1dFNjcmVlbjtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1xuICBIZWxsb1xufSBmcm9tICdkZXYtYm94LXVpLXJlYWN0LWNvbXBvbmVudHMnO1xuXG5jbGFzcyBIZWxsb1NjcmVlbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgLyogZXNsaW50IG5vLWNvbnNvbGU6IDAgKi9cbiAgICAgIC8vIGNvbnNvbGUubG9nKCdyZW5kZXJpbmcgSGVsbG9TY3JlZW4gY29tcG9uZW50Jyk7XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImRlbW8tc2NyZWVuXCI+IHsgLyogc3RhbmRhcmQgdGVtcGxhdGUgcmVxdWlyZW1lbnQgKi8gfVxuICAgICAgICA8SGVsbG8gLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgSGVsbG9TY3JlZW47XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtcbiAgTGlzdFxufSBmcm9tICdkZXYtYm94LXVpLXJlYWN0LWNvbXBvbmVudHMnO1xuXG5jbGFzcyBMaXN0U2NyZWVuIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImRlbW8tc2NyZWVuXCI+IHsgLyogc3RhbmRhcmQgdGVtcGxhdGUgcmVxdWlyZW1lbnQgKi8gfVxuICAgICAgICA8TGlzdCBpdGVtcz17Wyd0aHJlZScsICdmb3VyJ119Lz5cbiAgICAgICAgPExpc3QgaXRlbXM9e1sndGhyZWUnLCAnZm91ciddfS8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExpc3RTY3JlZW47XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5jbGFzcyBMb2NhbGVTZXJ2aWNlU2NyZWVuIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImRlbW8tc2NyZWVuXCI+IHsgLyogc3RhbmRhcmQgdGVtcGxhdGUgcmVxdWlyZW1lbnQgKi8gfVxuICAgICAgICA8aDIgY2xhc3NOYW1lPVwidGl0bGVcIj5Mb2NhbGUgU2VydmljZTwvaDI+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExvY2FsZVNlcnZpY2VTY3JlZW47XG4iLCIvLyBHZW5lcmFsXG5pbXBvcnQgTG9hZGluZ0RldkJveFVJV2ViQ29tcG9uZW50cyBmcm9tICcuL0dlbmVyYWwvTG9hZGluZ0RldkJveFVJV2ViQ29tcG9uZW50cyc7XG5cbi8vIFNlcnZpY2VzXG5pbXBvcnQgTG9jYWxlU2VydmljZVNjcmVlbiBmcm9tICcuL1NlcnZpY2VzL0xvY2FsZVNlcnZpY2VTY3JlZW4nO1xuXG4vLyBSZWFjdCBDb21wb25lbnRzXG5pbXBvcnQgSGVsbG9TY3JlZW4gZnJvbSAnLi9SZWFjdENvbXBvbmVudHMvSGVsbG9TY3JlZW4nO1xuaW1wb3J0IExpc3RTY3JlZW4gZnJvbSAnLi9SZWFjdENvbXBvbmVudHMvTGlzdFNjcmVlbic7XG5pbXBvcnQgRm9ybUlucHV0U2NyZWVuIGZyb20gJy4vUmVhY3RDb21wb25lbnRzL0Zvcm1JbnB1dFNjcmVlbic7XG5pbXBvcnQgRm9ybUlucHV0TnVtYmVyU2NyZWVuIGZyb20gJy4vUmVhY3RDb21wb25lbnRzL0Zvcm1JbnB1dE51bWJlclNjcmVlbic7XG5pbXBvcnQgRHJhZ2dhYmxlU2NyZWVuIGZyb20gJy4vUmVhY3RDb21wb25lbnRzL0RyYWdnYWJsZVNjcmVlbic7XG5pbXBvcnQgREJVSVdlYkNvbXBvbmVudER1bW15U2NyZWVuIGZyb20gJy4vUmVhY3RDb21wb25lbnRzL0RCVUlXZWJDb21wb25lbnREdW1teVNjcmVlbic7XG5cbi8vIERlYnVnXG5pbXBvcnQgT25TY3JlZW5Db25zb2xlU2NyZWVuIGZyb20gJy4vRGVidWcvT25TY3JlZW5Db25zb2xlU2NyZWVuJztcblxuY29uc3Qgc2NyZWVucyA9IHtcbiAgLy8gR2VuZXJhbFxuICBMb2FkaW5nRGV2Qm94VUlXZWJDb21wb25lbnRzLFxuXG4gIC8vIFNlcnZpY2VzXG4gIExvY2FsZVNlcnZpY2VTY3JlZW4sXG5cbiAgLy8gQ29tcG9uZW50c1xuICBIZWxsb1NjcmVlbixcbiAgTGlzdFNjcmVlbixcbiAgRm9ybUlucHV0U2NyZWVuLFxuICBGb3JtSW5wdXROdW1iZXJTY3JlZW4sXG4gIERyYWdnYWJsZVNjcmVlbixcbiAgREJVSVdlYkNvbXBvbmVudER1bW15U2NyZWVuLFxuXG4gIC8vIERlYnVnXG4gIE9uU2NyZWVuQ29uc29sZVNjcmVlblxufTtcblxuLypcblRoZSByZWFsIHBhdGggbWF0dGVycyBvbmx5IGZvciAuaHRtbCBzY3JlZW5zIGFzIHRoZXkgYXJlIGxvYWRlZCBpbnRvIGFuIGlGcmFtZS5cblJlYWN0IHNjcmVlbnMgcGF0aCBuZWVkcyB0byBiZSB0aGUgc2FtZSBhcyBpbXBvcnRlZCByZWFjdCBjb21wb25lbnQuXG4qL1xuY29uc3Qgc2NyZWVuTGlua3NHZW4gPSBbXG4gIHtcbiAgICB0aXRsZTogJ0dlbmVyYWwnLFxuICAgIGxpbmtzOiBbXG4gICAgICB7IHBhdGg6ICdMb2FkaW5nRGV2Qm94VUlXZWJDb21wb25lbnRzJywgdGl0bGU6ICdMb2FkaW5nIFdlYiBDb21wb25lbnRzJyB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgdGl0bGU6ICdTZXJ2aWNlcycsXG4gICAgbGlua3M6IFtcbiAgICAgIHsgcGF0aDogJ0xvY2FsZVNlcnZpY2VTY3JlZW4nLCB0aXRsZTogJ0xvY2FsZScgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgIHRpdGxlOiAnV2ViIENvbXBvbmVudHMnLFxuICAgIGxpbmtzOiBbXG4gICAgICB7IHBhdGg6ICdXZWJDb21wb25lbnRzU2NyZWVucy9EQlVJV2ViQ29tcG9uZW50RHVtbXlTY3JlZW4uaHRtbCcsIHRpdGxlOiAnRHVtbXknIH0sXG4gICAgICB7IHBhdGg6ICdXZWJDb21wb25lbnRzU2NyZWVucy9EQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnRTY3JlZW4uaHRtbCcsIHRpdGxlOiAnRHVtbXkgUGFyZW50JyB9LFxuICAgICAgeyBwYXRoOiAnV2ViQ29tcG9uZW50c1NjcmVlbnMvREJVSVdlYkNvbXBvbmVudEZvcm1JbnB1dFRleHRTY3JlZW4uaHRtbCcsIHRpdGxlOiAnRm9ybSBJbnB1dCBUZXh0JyB9LFxuICAgIF1cbiAgfSxcbiAge1xuICAgIHRpdGxlOiAnUmVhY3QgQ29tcG9uZW50cycsXG4gICAgbGlua3M6IFtcbiAgICAgIHsgcGF0aDogJ0hlbGxvU2NyZWVuJywgdGl0bGU6ICdIZWxsbycgfSxcbiAgICAgIHsgcGF0aDogJ0xpc3RTY3JlZW4nLCB0aXRsZTogJ0xpc3QnIH0sXG4gICAgICB7IHBhdGg6ICdGb3JtSW5wdXRTY3JlZW4nLCB0aXRsZTogJ0Zvcm0gSW5wdXQnIH0sXG4gICAgICB7IHBhdGg6ICdGb3JtSW5wdXROdW1iZXJTY3JlZW4nLCB0aXRsZTogJ0Zvcm0gSW5wdXQgTnVtYmVyJyB9LFxuICAgICAgeyBwYXRoOiAnRHJhZ2dhYmxlU2NyZWVuJywgdGl0bGU6ICdEcmFnZ2FibGUnIH0sXG4gICAgICB7IHBhdGg6ICdEQlVJV2ViQ29tcG9uZW50RHVtbXlTY3JlZW4nLCB0aXRsZTogJ0R1bW15JyB9LFxuICAgIF1cbiAgfSxcbiAge1xuICAgIHRpdGxlOiAnRGVidWcnLFxuICAgIGxpbmtzOiBbXG4gICAgICB7IHBhdGg6ICdPblNjcmVlbkNvbnNvbGVTY3JlZW4nLCB0aXRsZTogJ09uIFNjcmVlbiBDb25zb2xlJyB9LFxuICAgIF1cbiAgfVxuXTtcblxuZXhwb3J0IHtcbiAgc2NyZWVucyxcbiAgc2NyZWVuTGlua3NHZW5cbn07XG4iXX0=
