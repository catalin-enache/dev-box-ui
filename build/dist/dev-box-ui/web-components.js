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
exports.default = Focusable;

const readOnlyProperties = ['focused'];

const ERROR_MESSAGES = {
  focused: `'focused' property is read-only as it is controlled by the component.
If you want to set focus programmatically call .focus() method on component.
`
};

/**
 * When an inner focusable is focused (ex: via click) the entire component gets focused.
 * When the component gets focused (ex: via tab) the first inner focusable gets focused too.
 * When the component gets disabled it gets blurred too and all inner focusables get disabled and blurred.
 * When disabled the component cannot be focused.
 * When enabled the component can be focused.
 * @param Klass
 * @returns {Focusable}
 * @constructor
 */
function Focusable(Klass) {

  Klass.componentStyle += `
  :host([disabled]) {
    cursor: not-allowed;
    opacity: 0.5;
    
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  
  :host([disabled]) * {
    pointer-events: none;
  }
  `;

  class Focusable extends Klass {

    static get name() {
      return super.name;
    }

    get instancePropertiesToDefine() {
      const inheritedInstancePropertiesToDefine = super.instancePropertiesToDefine || {};
      const newInstancePropertiesToDefine = {};
      if (!this.disabled) {
        // tabindex defines focusable behaviour
        newInstancePropertiesToDefine.tabindex = 0;
      }
      return Object.assign({}, inheritedInstancePropertiesToDefine, newInstancePropertiesToDefine);
    }

    static get propertiesToUpgrade() {
      const inheritedPropertiesToUpgrade = super.propertiesToUpgrade || [];
      // The reason for upgrading 'focused' is only to show an warning
      // if the consumer of the component attempted to set focus property
      // which is read-only.
      return [...inheritedPropertiesToUpgrade, 'focused', 'disabled'];
    }

    static get observedAttributes() {
      const inheritedObservedAttributes = super.observedAttributes || [];
      return [...inheritedObservedAttributes, 'disabled'];
    }

    constructor(...args) {
      super(...args);

      this._currentInnerFocused = null;
      this._onInnerFocusableFocused = this._onInnerFocusableFocused.bind(this);
      this._onFocus = this._onFocus.bind(this);
      this._onBlur = this._onBlur.bind(this);
    }

    attributeChangedCallback(name, oldValue, newValue) {
      super.attributeChangedCallback && super.attributeChangedCallback(name, oldValue, newValue);

      const hasValue = newValue !== null;
      if (name === 'disabled') {
        hasValue ? this._applyDisabledSideEffects() : this._applyEnabledSideEffects();
      }
    }

    connectedCallback() {
      super.connectedCallback && super.connectedCallback();

      readOnlyProperties.forEach(readOnlyProperty => {
        if (this.hasAttribute(readOnlyProperty)) {
          this.removeAttribute(readOnlyProperty);
          console.warn(ERROR_MESSAGES[readOnlyProperty]);
        }
      });

      // when component focused/blurred
      this.addEventListener('focus', this._onFocus);
      this.addEventListener('blur', this._onBlur);

      this._innerFocusables.forEach(focusable => {
        // when inner focusable focused
        focusable.addEventListener('focus', this._onInnerFocusableFocused);
      });
    }

    disconnectedCallback() {
      super.disconnectedCallback && super.disconnectedCallback();

      this.removeEventListener('focus', this._onFocus);
      this.removeEventListener('blur', this._onBlur);

      this._innerFocusables.forEach(focusable => {
        focusable.removeEventListener('focus', this._onInnerFocusableFocused);
      });
    }

    // read-only
    get focused() {
      return this.hasAttribute('focused');
    }

    set focused(_) {
      console.warn(ERROR_MESSAGES.focused);
    }

    get disabled() {
      return this.hasAttribute('disabled');
    }

    set disabled(value) {
      const hasValue = Boolean(value);
      if (hasValue) {
        this.setAttribute('disabled', '');
      } else {
        this.removeAttribute('disabled');
      }
    }

    get _innerFocusables() {
      return this.childrenTree.querySelectorAll('[tabindex]') || [];
    }

    get _firstInnerFocusable() {
      return this.childrenTree.querySelector('[tabindex]');
    }

    _onInnerFocusableFocused(evt) {
      this._currentInnerFocused = evt.target;
    }

    _onFocus() {
      if (this.disabled) return;
      // Only for styling purpose.
      // Focused property is controlled from inside.
      // Attempt to set this property from outside will trigger a warning
      // and will be ignored
      this.setAttribute('focused', '');
      this._applyFocusSideEffects();
    }

    _onBlur() {
      this.removeAttribute('focused');
      this._applyBlurSideEffects();
    }

    _applyFocusSideEffects() {
      if (this._currentInnerFocused) {
        // Some inner component is already focused.
        // No need to set focus on anything.
        return;
      }
      this._focusFirstInnerFocusable();
    }

    _applyBlurSideEffects() {
      if (this._currentInnerFocused) {
        this._currentInnerFocused.blur();
        this._currentInnerFocused = null;
      }
    }

    _focusFirstInnerFocusable() {
      const firstInnerFocusable = this._firstInnerFocusable;
      if (firstInnerFocusable) {
        this._currentInnerFocused = firstInnerFocusable;
        firstInnerFocusable.focus();
      }
    }

    _applyDisabledSideEffects() {
      this.removeAttribute('tabindex');
      this._innerFocusables.forEach(innerFocusable => {
        innerFocusable.setAttribute('tabindex', '-1');
        if (innerFocusable.hasAttribute('contenteditable')) {
          innerFocusable.setAttribute('contenteditable', 'false');
        } else {
          innerFocusable.disabled = true;
        }
      });
      this.blur();
    }

    _applyEnabledSideEffects() {
      this.setAttribute('tabindex', '0');
      this._innerFocusables.forEach(innerFocusable => {
        innerFocusable.setAttribute('tabindex', '0');
        if (innerFocusable.hasAttribute('contenteditable')) {
          innerFocusable.setAttribute('contenteditable', 'true');
        } else {
          innerFocusable.disabled = false;
        }
      });
    }
  }

  return Focusable;
}

},{}],3:[function(require,module,exports){
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
          klass.componentStyle += '\n\n/* ==== overrides ==== */\n\n';
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

},{"../../internals/ensureSingleRegistration":10,"../../services/DBUILocaleService":12}],4:[function(require,module,exports){
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

},{"../../internals/ensureSingleRegistration":10,"../DBUIWebComponentBase/DBUIWebComponentBase":3}],5:[function(require,module,exports){
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

},{"../../internals/ensureSingleRegistration":10,"../DBUIWebComponentBase/DBUIWebComponentBase":3,"../DBUIWebComponentDummy/DBUIWebComponentDummy":4}],6:[function(require,module,exports){
(function (process){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDBUIWebComponentFormInputText;

var _DBUIWebComponentBase = require('../DBUIWebComponentBase/DBUIWebComponentBase');

var _DBUIWebComponentBase2 = _interopRequireDefault(_DBUIWebComponentBase);

var _ensureSingleRegistration = require('../../internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

var _Focusable = require('../../behaviours/Focusable');

var _Focusable2 = _interopRequireDefault(_Focusable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const registrationName = 'dbui-web-component-form-input-text';

function getDBUIWebComponentFormInputText(win) {
  return (0, _ensureSingleRegistration2.default)(win, registrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = (0, _DBUIWebComponentBase2.default)(win);

    class DBUIWebComponentFormInputText extends DBUIWebComponentBase {

      static get registrationName() {
        return registrationName;
      }

      static get templateInnerHTML() {
        return `
          <style>
          :host {
            all: initial; 
            display: inline-block;
            width: 100%;
            /*height: var(--dbui-web-component-form-input-height);*/
            /*line-height: var(--dbui-web-component-form-input-height);*/
            height: 300px;
            padding: 0px;
            font-size: 18px;
            color: var(--dbui-web-component-form-input-color);
            /*background-color: var(--dbui-web-component-form-input-background-color);*/
            background-color: rgba(255, 100, 0, 0.1);
            unicode-bidi: bidi-override;
            box-sizing: border-box;
            border: none;
            border-bottom: var(--dbui-web-component-form-input-border-width) var(--dbui-web-component-form-input-border-style) var(--dbui-web-component-form-input-border-color);
          }
          
          :host [tabindex] {
            width: 100%;
            height: 50px;
            line-height: 50px;
            border: none;
            margin: 0px;
            padding: 0px;
            background-color: transparent;
            border-radius: 0px;
            box-sizing: border-box;
            unicode-bidi: bidi-override;
          }
          
          :host [tabindex]:focus {
            background-color: rgba(255, 0, 0, .3);
            outline: none;
          }
    
          :host([focused]) {
            background-color: rgba(0, 255, 0, .3);
          }
          
          /*:host([disabled]) {*/
            /*background-color: rgba(0, 0, 0, .3);*/
          /*}*/
    
          :host([hidden]) {
            display: none;
          }
    
          :host([dir=rtl]) {
          
          }
          
          :host([dir=ltr]) {
          
          }
          </style>
          <p>DBUIWebComponentFormInputText</p>
          <div contenteditable="true" tabindex="0"></div>
          <div contenteditable="true" tabindex="0"></div>
          <input type="text" tabindex="0" />
          <input type="text" tabindex="0" />
        `;
      }

      static get propertiesToDefine() {
        return {
          role: 'form-input'
        };
      }

      onLocaleChange(locale) {
        if (process.env.NODE_ENV !== 'production') {
          /* eslint no-console: 0 */
          console.log('onLocaleChange', locale);
        }
      }

    }

    return Registerable((0, _Focusable2.default)(defineCommonStaticMethods(DBUIWebComponentFormInputText)));
  });
}

getDBUIWebComponentFormInputText.registrationName = registrationName;

}).call(this,require('_process'))

},{"../../behaviours/Focusable":2,"../../internals/ensureSingleRegistration":10,"../DBUIWebComponentBase/DBUIWebComponentBase":3,"_process":1}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDBUIWebComponentIcon;

var _DBUIWebComponentBase = require('../DBUIWebComponentBase/DBUIWebComponentBase');

var _DBUIWebComponentBase2 = _interopRequireDefault(_DBUIWebComponentBase);

var _ensureSingleRegistration = require('../../internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const registrationName = 'dbui-web-component-icon';

// https://github.com/gorangajic/react-icon-base/blob/master/index.js
// https://raw.githubusercontent.com/gorangajic/react-icons/master/icons/go/mark-github.svg
// https://github.com/gorangajic/react-icons
// https://github.com/gorangajic/react-icons/blob/master/go/mark-github.js
// https://gorangajic.github.io/react-icons/go.html

function getDBUIWebComponentIcon(win) {
  return (0, _ensureSingleRegistration2.default)(win, registrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = (0, _DBUIWebComponentBase2.default)(win);

    class DBUIWebComponentIcon extends DBUIWebComponentBase {

      static get registrationName() {
        return registrationName;
      }

      static get templateInnerHTML() {
        return `
          <style>
          :host {
            all: initial;
            font-size: inherit; 
            display: inline-block;
            width: 1em;
            height: 1em;
            vertical-align: middle;
            color: inherit;
          }
          :host svg {
            display: inline-block;
            width: 1em;
            height: 1em;
            vertical-align: top;
            fill: currentColor;
          }
          </style>
          <svg viewBox="0 0 40 40"  preserveAspectRatio="xMidYMid meet" >
            <g><path d=""/></g>
          </svg>
        `;
      }

      static get propertiesToUpgrade() {
        const inheritedPropertiesToUpgrade = super.propertiesToUpgrade || [];
        return [...inheritedPropertiesToUpgrade, 'shape'];
      }

      static get observedAttributes() {
        const inheritedObservedAttributes = super.observedAttributes || [];
        return [...inheritedObservedAttributes, 'shape'];
      }

      get shape() {
        return this.getAttribute('shape');
      }

      set shape(value) {
        const hasValue = ![undefined, null].includes(value);
        const stringValue = String(value);
        if (hasValue) {
          this.setAttribute('shape', stringValue);
        } else {
          this.removeAttribute('shape');
        }
      }

      attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback && super.attributeChangedCallback(name, oldValue, newValue);

        const hasValue = ![undefined, null].includes(newValue);
        if (name === 'shape') {
          hasValue ? this._setShape() : this._removeShape();
        }
      }

      _setShape() {
        const path = this.childrenTree.querySelector('svg g path');
        path.setAttribute('d', this.shape);
      }

      _removeShape() {
        const path = this.childrenTree.querySelector('svg g path');
        path.setAttribute('d', '');
      }

    }

    return Registerable(defineCommonStaticMethods(DBUIWebComponentIcon));
  });
}

getDBUIWebComponentIcon.registrationName = registrationName;

},{"../../internals/ensureSingleRegistration":10,"../DBUIWebComponentBase/DBUIWebComponentBase":3}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _appendStyles = require('../internals/appendStyles');

var _appendStyles2 = _interopRequireDefault(_appendStyles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* @param components Array<Object> [{
*  registrationName,
*  componentStyle,
*  ...
* }]
* @returns components Array<Object>
*/
const dbuiWebComponentsSetUp = win => components => {
  return (0, _appendStyles2.default)(win)(components);
};

exports.default = dbuiWebComponentsSetUp;

},{"../internals/appendStyles":9}],9:[function(require,module,exports){
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

const appendStyles = win => components => {
  components.forEach(({ registrationName, componentStyle }) => {
    appendStyle(win)(registrationName, componentStyle);
  });
  return components;
};

exports.default = appendStyles;

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{"../internals/ensureSingleRegistration":10,"./DBUILocaleService":12}],12:[function(require,module,exports){
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
        this._rootElement = win.document.documentElement;
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

},{"../internals/ensureSingleRegistration":10}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/* eslint prefer-const: 0 */

/**
 *
 * @param options Object
 * @returns function(String): String
 */
const forceFloat = ({ decPoint = '.' } = {}) => value => {
  const GLOBAL_DEC_POINT = new RegExp(`\\${decPoint}`, 'g');
  const GLOBAL_NON_NUMBER_OR_DEC_POINT = new RegExp(`[^\\d${decPoint}]`, 'g');
  const NUMBER_DEC_POINT_OR_SHORTCUT = new RegExp(`[\\d${decPoint}KkMm]`, '');
  const NUMBER_OR_SIGN = new RegExp('[\\d+-]', '');
  const SIGN = new RegExp('[+-]', '');
  const SHORTCUT = new RegExp('[KkMm]', '');
  const SHORTCUT_THOUSANDS = new RegExp('[Kk]', '');

  let valueToUse = value;
  const indexOfPoint = valueToUse.indexOf(decPoint);
  const lastIndexOfPoint = valueToUse.lastIndexOf(decPoint);
  const hasMoreThanOnePoint = indexOfPoint !== lastIndexOfPoint;

  if (hasMoreThanOnePoint) {
    valueToUse = `${valueToUse.replace(GLOBAL_DEC_POINT, '')}${decPoint}`;
  }

  let firstChar = valueToUse[0] || '';
  let lastChar = (valueToUse.length > 1 ? valueToUse[valueToUse.length - 1] : '') || '';
  let middleChars = valueToUse.substr(1, valueToUse.length - 2) || '';

  if (!firstChar.match(NUMBER_OR_SIGN)) {
    firstChar = '';
  }

  middleChars = middleChars.replace(GLOBAL_NON_NUMBER_OR_DEC_POINT, '');

  if (!lastChar.match(NUMBER_DEC_POINT_OR_SHORTCUT)) {
    lastChar = '';
  } else if (lastChar.match(SHORTCUT)) {
    if (middleChars === decPoint) {
      middleChars = '';
    } else if (middleChars === '' && firstChar.match(SIGN)) {
      lastChar = '';
    }
  } else if (lastChar === decPoint && middleChars === '' && firstChar.match(SIGN)) {
    lastChar = '';
  }

  valueToUse = [firstChar, middleChars, lastChar].join('');

  if (lastChar.match(SHORTCUT)) {
    valueToUse = (Number(`${firstChar}${middleChars}`.replace(decPoint, '.')) * (lastChar.match(SHORTCUT_THOUSANDS) ? 1000 : 1000000)).toString().replace('.', decPoint);
  }

  return valueToUse;
};

/**
 *
 * @param options Object
 * @returns function(String): String
 */
const numberFormatter = ({ decPoint = '.', thousandsSeparator = ',' } = {}) => value => {
  value = value.replace('.', decPoint);
  let firstChar = value[0] || '';
  firstChar = ['+', '-'].includes(firstChar) ? firstChar : '';
  const isFloatingPoint = value.indexOf(decPoint) !== -1;
  let [integerPart = '', decimals = ''] = value.split(decPoint);
  integerPart = integerPart.replace(/[+-]/g, '');
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
  const ret = `${firstChar}${integerPart}${isFloatingPoint ? decPoint : ''}${decimals}`;
  return ret;
};

exports.default = {
  forceFloat,
  numberFormatter
};

},{}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = onScreenConsole;
/* eslint no-console: 0 */

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
  console.id = 'DBUIonScreenConsole';
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
  button.id = 'DBUIonScreenConsoleToggler';
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

},{}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

// http://raganwald.com/2015/12/31/this-is-not-an-essay-about-traits-in-javascript.html

/*

class A {
  constructor(...args) {
    this.init(...args);
  }
}

class B extends A {
  init(x) {
    this._x = x;
  }
  getX() {
    return this._x;
  }
  setX(value) {
    this._x = value;
  }
  get x() {
    return this._x;
  }
  set x(value) {
    this._x = value;
  }
}

function withDoubleX(klass) {
  return OverrideOrDefine({

    // overrides
    init(originalInit, x, y) {
      originalInit(x);
      this._y = y;
    },
    getX(originalGetX) {
      return originalGetX() * 2;
    },
    setX(originalSetX, value) {
      // this._x = value * 2;
      originalSetX(value * 2);
    },
    get x() {
      return this._x * 2;
    },
    set x(value) {
      this._x = value * 2;
    },

    // new definitions
    set y(value) {
      this._y = value * 2;
    },
    get y() {
      return this._y * 2;
    },
    hello() {
      return `hello ${this._x} and ${this.y}`;
    }
  })(klass);
}

B = withDoubleX(B);

const b = new B(2, 5);
console.log(b.x); // 4
console.log(b.getX()); // 4

b.setX(3);
// b.x = 3;
console.log(b.x); // 12
console.log(b.getX()); // 12

// new
console.log(b.y); // 10
b.y = 9;
console.log(b.hello()); // hello 6 and 36

*/

function OverrideOrDefine(behaviour) {
  const instanceKeys = Reflect.ownKeys(behaviour);

  return function define(klass) {
    instanceKeys.forEach(property => {

      const newPropertyDescriptor = Object.getOwnPropertyDescriptor(behaviour, property);
      const originalPropertyDescriptor = Object.getOwnPropertyDescriptor(klass.prototype, property);

      const {
        value: newValue,
        get: newGetter,
        set: newSetter
      } = newPropertyDescriptor;

      if (!originalPropertyDescriptor) {
        if (newValue) {
          Object.defineProperty(klass.prototype, property, {
            value: newValue,
            writable: true,
            enumerable: false,
            configurable: true
          });
        } else {
          Object.defineProperty(klass.prototype, property, {
            get: newGetter,
            set: newSetter,
            enumerable: false,
            configurable: true
          });
        }
      } else {
        const {
          value: originalValue,
          writable: originalWritable,
          get: originalGetter,
          set: originalSetter,
          enumerable: originalEnumerable,
          configurable: originalConfigurable
        } = originalPropertyDescriptor;

        if (newValue) {
          Object.defineProperty(klass.prototype, property, {
            value(...args) {
              const boundedValue = originalValue.bind(this);
              return newValue.call(this, boundedValue, ...args);
            },
            writable: originalWritable,
            enumerable: originalEnumerable,
            configurable: originalConfigurable
          });
        } else {
          Object.defineProperty(klass.prototype, property, {
            get: newGetter || originalGetter,
            set: newSetter || originalSetter,
            enumerable: originalEnumerable,
            configurable: originalConfigurable
          });
        }
      }
    });
    return klass;
  };
}

exports.default = OverrideOrDefine;

},{}],"dev-box-ui-web-components":[function(require,module,exports){
(function (process){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDBUIWebComponentIcon = exports.getDBUIWebComponentFormInputText = exports.getDBUIWebComponentDummyParent = exports.getDBUIWebComponentDummy = exports.onScreenConsole = exports.template = exports.traits = exports.formatters = exports.getDBUII18nService = exports.getDBUILocaleService = exports.Focusable = exports.getDBUIWebComponentBase = exports.ensureSingleRegistration = exports.dbuiWebComponentsSetUp = exports.quickSetupAndLoad = exports.registrations = undefined;

var _dbuiWebComponentsSetup = require('./helpers/dbuiWebComponentsSetup');

var _dbuiWebComponentsSetup2 = _interopRequireDefault(_dbuiWebComponentsSetup);

var _ensureSingleRegistration = require('./internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

var _DBUIWebComponentBase = require('./components/DBUIWebComponentBase/DBUIWebComponentBase');

var _DBUIWebComponentBase2 = _interopRequireDefault(_DBUIWebComponentBase);

var _Focusable = require('./behaviours/Focusable');

var _Focusable2 = _interopRequireDefault(_Focusable);

var _DBUILocaleService = require('./services/DBUILocaleService');

var _DBUILocaleService2 = _interopRequireDefault(_DBUILocaleService);

var _DBUII18nService = require('./services/DBUII18nService');

var _DBUII18nService2 = _interopRequireDefault(_DBUII18nService);

var _formatters = require('./utils/formatters');

var _formatters2 = _interopRequireDefault(_formatters);

var _traits = require('./utils/traits');

var _traits2 = _interopRequireDefault(_traits);

var _template = require('./utils/template');

var _template2 = _interopRequireDefault(_template);

var _onScreenConsole = require('./utils/onScreenConsole');

var _onScreenConsole2 = _interopRequireDefault(_onScreenConsole);

var _DBUIWebComponentDummy = require('./components/DBUIWebComponentDummy/DBUIWebComponentDummy');

var _DBUIWebComponentDummy2 = _interopRequireDefault(_DBUIWebComponentDummy);

var _DBUIWebComponentDummyParent = require('./components/DBUIWebComponentDummyParent/DBUIWebComponentDummyParent');

var _DBUIWebComponentDummyParent2 = _interopRequireDefault(_DBUIWebComponentDummyParent);

var _DBUIWebComponentFormInputText = require('./components/DBUIWebComponentFormInputText/DBUIWebComponentFormInputText');

var _DBUIWebComponentFormInputText2 = _interopRequireDefault(_DBUIWebComponentFormInputText);

var _DBUIWebComponentIcon = require('./components/DBUIWebComponentIcon/DBUIWebComponentIcon');

var _DBUIWebComponentIcon2 = _interopRequireDefault(_DBUIWebComponentIcon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Components


// Utils


// Services


// ComponentBase

// Helpers
const registrations = {
  [_DBUIWebComponentDummy2.default.registrationName]: _DBUIWebComponentDummy2.default,
  [_DBUIWebComponentDummyParent2.default.registrationName]: _DBUIWebComponentDummyParent2.default,
  [_DBUIWebComponentFormInputText2.default.registrationName]: _DBUIWebComponentFormInputText2.default,
  [_DBUIWebComponentIcon2.default.registrationName]: _DBUIWebComponentIcon2.default
};

/*
This helper function is just for convenience.
Using it implies that entire DBUIWebComponents library is already loaded.
It is useful especially when working with distribution build.
If one wants to load just one web-component or a subset of web-components
they should be loaded from node_modules/dev-box-ui/web-components by their path
ex:
import SomeComponentLoader from node_modules/dev-box-ui/web-components/path/to/SomeComponent;
*/


// Behaviours


// Internals
function quickSetupAndLoad(win = window) {
  /**
   * @param components Object {
   *  registrationName,
   *  componentStyle
   * }
   * @return Object { <registrationName>, <componentClass> }
   */
  return function (components) {
    return (0, _dbuiWebComponentsSetup2.default)(win)(components).reduce((acc, { registrationName }) => {
      const componentClass = registrations[registrationName](window);
      componentClass.registerSelf();
      acc[registrationName] = componentClass;
      return acc;
    }, {});
  };
}

exports.registrations = registrations;
exports.quickSetupAndLoad = quickSetupAndLoad;
exports.dbuiWebComponentsSetUp = _dbuiWebComponentsSetup2.default;
exports.ensureSingleRegistration = _ensureSingleRegistration2.default;
exports.getDBUIWebComponentBase = _DBUIWebComponentBase2.default;
exports.Focusable = _Focusable2.default;
exports.getDBUILocaleService = _DBUILocaleService2.default;
exports.getDBUII18nService = _DBUII18nService2.default;
exports.formatters = _formatters2.default;
exports.traits = _traits2.default;
exports.template = _template2.default;
exports.onScreenConsole = _onScreenConsole2.default;
exports.getDBUIWebComponentDummy = _DBUIWebComponentDummy2.default;
exports.getDBUIWebComponentDummyParent = _DBUIWebComponentDummyParent2.default;
exports.getDBUIWebComponentFormInputText = _DBUIWebComponentFormInputText2.default;
exports.getDBUIWebComponentIcon = _DBUIWebComponentIcon2.default;

/* eslint no-console: 0 */

let build = 'production';

if (process.env.NODE_ENV !== 'production') {
  build = 'develop';
}

console.log(`Using DBUIWebComponentsDistLib ${build} build.`);

}).call(this,require('_process'))

},{"./behaviours/Focusable":2,"./components/DBUIWebComponentBase/DBUIWebComponentBase":3,"./components/DBUIWebComponentDummy/DBUIWebComponentDummy":4,"./components/DBUIWebComponentDummyParent/DBUIWebComponentDummyParent":5,"./components/DBUIWebComponentFormInputText/DBUIWebComponentFormInputText":6,"./components/DBUIWebComponentIcon/DBUIWebComponentIcon":7,"./helpers/dbuiWebComponentsSetup":8,"./internals/ensureSingleRegistration":10,"./services/DBUII18nService":11,"./services/DBUILocaleService":12,"./utils/formatters":13,"./utils/onScreenConsole":14,"./utils/template":15,"./utils/traits":16,"_process":1}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwic3JjL2xpYi93ZWItY29tcG9uZW50cy9iZWhhdmlvdXJzL0ZvY3VzYWJsZS5qcyIsInNyYy9saWIvd2ViLWNvbXBvbmVudHMvY29tcG9uZW50cy9EQlVJV2ViQ29tcG9uZW50QmFzZS9EQlVJV2ViQ29tcG9uZW50QmFzZS5qcyIsInNyYy9saWIvd2ViLWNvbXBvbmVudHMvY29tcG9uZW50cy9EQlVJV2ViQ29tcG9uZW50RHVtbXkvREJVSVdlYkNvbXBvbmVudER1bW15LmpzIiwic3JjL2xpYi93ZWItY29tcG9uZW50cy9jb21wb25lbnRzL0RCVUlXZWJDb21wb25lbnREdW1teVBhcmVudC9EQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQuanMiLCJzcmMvbGliL3dlYi1jb21wb25lbnRzL2NvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudEZvcm1JbnB1dFRleHQvREJVSVdlYkNvbXBvbmVudEZvcm1JbnB1dFRleHQuanMiLCJzcmMvbGliL3dlYi1jb21wb25lbnRzL2NvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudEljb24vREJVSVdlYkNvbXBvbmVudEljb24uanMiLCJzcmMvbGliL3dlYi1jb21wb25lbnRzL2hlbHBlcnMvZGJ1aVdlYkNvbXBvbmVudHNTZXR1cC5qcyIsInNyYy9saWIvd2ViLWNvbXBvbmVudHMvaW50ZXJuYWxzL2FwcGVuZFN0eWxlcy5qcyIsInNyYy9saWIvd2ViLWNvbXBvbmVudHMvaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbi5qcyIsInNyYy9saWIvd2ViLWNvbXBvbmVudHMvc2VydmljZXMvREJVSUkxOG5TZXJ2aWNlLmpzIiwic3JjL2xpYi93ZWItY29tcG9uZW50cy9zZXJ2aWNlcy9EQlVJTG9jYWxlU2VydmljZS5qcyIsInNyYy9saWIvd2ViLWNvbXBvbmVudHMvdXRpbHMvZm9ybWF0dGVycy5qcyIsInNyYy9saWIvd2ViLWNvbXBvbmVudHMvdXRpbHMvb25TY3JlZW5Db25zb2xlLmpzIiwic3JjL2xpYi93ZWItY29tcG9uZW50cy91dGlscy90ZW1wbGF0ZS5qcyIsInNyYy9saWIvd2ViLWNvbXBvbmVudHMvdXRpbHMvdHJhaXRzLmpzIiwic3JjL2xpYi9zcmMvbGliL3dlYi1jb21wb25lbnRzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QSw4QjtRQUNBLGdDO1FBQ0EsdUI7O0FBR0Y7O0FBRUEsSUFBSSxRQUFRLFlBQVo7O0FBRUEsSUFBSSxRQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLFlBQTdCLEVBQTJDO0FBQ3pDLFVBQVEsU0FBUjtBQUNEOztBQUVELFFBQVEsR0FBUixDQUFhLGtDQUFpQyxLQUFNLFNBQXBEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCJcbmNvbnN0IHJlYWRPbmx5UHJvcGVydGllcyA9IFsnZm9jdXNlZCddO1xuXG5jb25zdCBFUlJPUl9NRVNTQUdFUyA9IHtcbiAgZm9jdXNlZDogYCdmb2N1c2VkJyBwcm9wZXJ0eSBpcyByZWFkLW9ubHkgYXMgaXQgaXMgY29udHJvbGxlZCBieSB0aGUgY29tcG9uZW50LlxuSWYgeW91IHdhbnQgdG8gc2V0IGZvY3VzIHByb2dyYW1tYXRpY2FsbHkgY2FsbCAuZm9jdXMoKSBtZXRob2Qgb24gY29tcG9uZW50LlxuYFxufTtcblxuLyoqXG4gKiBXaGVuIGFuIGlubmVyIGZvY3VzYWJsZSBpcyBmb2N1c2VkIChleDogdmlhIGNsaWNrKSB0aGUgZW50aXJlIGNvbXBvbmVudCBnZXRzIGZvY3VzZWQuXG4gKiBXaGVuIHRoZSBjb21wb25lbnQgZ2V0cyBmb2N1c2VkIChleDogdmlhIHRhYikgdGhlIGZpcnN0IGlubmVyIGZvY3VzYWJsZSBnZXRzIGZvY3VzZWQgdG9vLlxuICogV2hlbiB0aGUgY29tcG9uZW50IGdldHMgZGlzYWJsZWQgaXQgZ2V0cyBibHVycmVkIHRvbyBhbmQgYWxsIGlubmVyIGZvY3VzYWJsZXMgZ2V0IGRpc2FibGVkIGFuZCBibHVycmVkLlxuICogV2hlbiBkaXNhYmxlZCB0aGUgY29tcG9uZW50IGNhbm5vdCBiZSBmb2N1c2VkLlxuICogV2hlbiBlbmFibGVkIHRoZSBjb21wb25lbnQgY2FuIGJlIGZvY3VzZWQuXG4gKiBAcGFyYW0gS2xhc3NcbiAqIEByZXR1cm5zIHtGb2N1c2FibGV9XG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRm9jdXNhYmxlKEtsYXNzKSB7XG5cbiAgS2xhc3MuY29tcG9uZW50U3R5bGUgKz0gYFxuICA6aG9zdChbZGlzYWJsZWRdKSB7XG4gICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICBvcGFjaXR5OiAwLjU7XG4gICAgXG4gICAgLXdlYmtpdC10b3VjaC1jYWxsb3V0OiBub25lO1xuICAgIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLWtodG1sLXVzZXItc2VsZWN0OiBub25lO1xuICAgIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLW1zLXVzZXItc2VsZWN0OiBub25lO1xuICAgIHVzZXItc2VsZWN0OiBub25lO1xuICB9XG4gIFxuICA6aG9zdChbZGlzYWJsZWRdKSAqIHtcbiAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgfVxuICBgO1xuXG4gIGNsYXNzIEZvY3VzYWJsZSBleHRlbmRzIEtsYXNzIHtcblxuICAgIHN0YXRpYyBnZXQgbmFtZSgpIHtcbiAgICAgIHJldHVybiBzdXBlci5uYW1lO1xuICAgIH1cblxuICAgIGdldCBpbnN0YW5jZVByb3BlcnRpZXNUb0RlZmluZSgpIHtcbiAgICAgIGNvbnN0IGluaGVyaXRlZEluc3RhbmNlUHJvcGVydGllc1RvRGVmaW5lID1cbiAgICAgICAgc3VwZXIuaW5zdGFuY2VQcm9wZXJ0aWVzVG9EZWZpbmUgfHwge307XG4gICAgICBjb25zdCBuZXdJbnN0YW5jZVByb3BlcnRpZXNUb0RlZmluZSA9IHt9O1xuICAgICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgIC8vIHRhYmluZGV4IGRlZmluZXMgZm9jdXNhYmxlIGJlaGF2aW91clxuICAgICAgICBuZXdJbnN0YW5jZVByb3BlcnRpZXNUb0RlZmluZS50YWJpbmRleCA9IDA7XG4gICAgICB9XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5pbmhlcml0ZWRJbnN0YW5jZVByb3BlcnRpZXNUb0RlZmluZSxcbiAgICAgICAgLi4ubmV3SW5zdGFuY2VQcm9wZXJ0aWVzVG9EZWZpbmVcbiAgICAgIH07XG4gICAgfVxuXG4gICAgc3RhdGljIGdldCBwcm9wZXJ0aWVzVG9VcGdyYWRlKCkge1xuICAgICAgY29uc3QgaW5oZXJpdGVkUHJvcGVydGllc1RvVXBncmFkZSA9IHN1cGVyLnByb3BlcnRpZXNUb1VwZ3JhZGUgfHwgW107XG4gICAgICAvLyBUaGUgcmVhc29uIGZvciB1cGdyYWRpbmcgJ2ZvY3VzZWQnIGlzIG9ubHkgdG8gc2hvdyBhbiB3YXJuaW5nXG4gICAgICAvLyBpZiB0aGUgY29uc3VtZXIgb2YgdGhlIGNvbXBvbmVudCBhdHRlbXB0ZWQgdG8gc2V0IGZvY3VzIHByb3BlcnR5XG4gICAgICAvLyB3aGljaCBpcyByZWFkLW9ubHkuXG4gICAgICByZXR1cm4gWy4uLmluaGVyaXRlZFByb3BlcnRpZXNUb1VwZ3JhZGUsICdmb2N1c2VkJywgJ2Rpc2FibGVkJ107XG4gICAgfVxuXG4gICAgc3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7XG4gICAgICBjb25zdCBpbmhlcml0ZWRPYnNlcnZlZEF0dHJpYnV0ZXMgPSBzdXBlci5vYnNlcnZlZEF0dHJpYnV0ZXMgfHwgW107XG4gICAgICByZXR1cm4gWy4uLmluaGVyaXRlZE9ic2VydmVkQXR0cmlidXRlcywgJ2Rpc2FibGVkJ107XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgICAgc3VwZXIoLi4uYXJncyk7XG5cbiAgICAgIHRoaXMuX2N1cnJlbnRJbm5lckZvY3VzZWQgPSBudWxsO1xuICAgICAgdGhpcy5fb25Jbm5lckZvY3VzYWJsZUZvY3VzZWQgPSB0aGlzLl9vbklubmVyRm9jdXNhYmxlRm9jdXNlZC5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5fb25Gb2N1cyA9IHRoaXMuX29uRm9jdXMuYmluZCh0aGlzKTtcbiAgICAgIHRoaXMuX29uQmx1ciA9IHRoaXMuX29uQmx1ci5iaW5kKHRoaXMpO1xuICAgIH1cblxuICAgIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpIHtcbiAgICAgIHN1cGVyLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayAmJlxuICAgICAgICBzdXBlci5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlKTtcblxuICAgICAgY29uc3QgaGFzVmFsdWUgPSBuZXdWYWx1ZSAhPT0gbnVsbDtcbiAgICAgIGlmIChuYW1lID09PSAnZGlzYWJsZWQnKSB7XG4gICAgICAgIGhhc1ZhbHVlID8gdGhpcy5fYXBwbHlEaXNhYmxlZFNpZGVFZmZlY3RzKCkgOiB0aGlzLl9hcHBseUVuYWJsZWRTaWRlRWZmZWN0cygpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgc3VwZXIuY29ubmVjdGVkQ2FsbGJhY2sgJiZcbiAgICAgICAgc3VwZXIuY29ubmVjdGVkQ2FsbGJhY2soKTtcblxuICAgICAgcmVhZE9ubHlQcm9wZXJ0aWVzLmZvckVhY2goKHJlYWRPbmx5UHJvcGVydHkpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaGFzQXR0cmlidXRlKHJlYWRPbmx5UHJvcGVydHkpKSB7XG4gICAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUocmVhZE9ubHlQcm9wZXJ0eSk7XG4gICAgICAgICAgY29uc29sZS53YXJuKEVSUk9SX01FU1NBR0VTW3JlYWRPbmx5UHJvcGVydHldKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8vIHdoZW4gY29tcG9uZW50IGZvY3VzZWQvYmx1cnJlZFxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIHRoaXMuX29uRm9jdXMpO1xuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgdGhpcy5fb25CbHVyKTtcblxuICAgICAgdGhpcy5faW5uZXJGb2N1c2FibGVzLmZvckVhY2goKGZvY3VzYWJsZSkgPT4ge1xuICAgICAgICAvLyB3aGVuIGlubmVyIGZvY3VzYWJsZSBmb2N1c2VkXG4gICAgICAgIGZvY3VzYWJsZS5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIHRoaXMuX29uSW5uZXJGb2N1c2FibGVGb2N1c2VkKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgc3VwZXIuZGlzY29ubmVjdGVkQ2FsbGJhY2sgJiZcbiAgICAgICAgc3VwZXIuZGlzY29ubmVjdGVkQ2FsbGJhY2soKTtcblxuICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKCdmb2N1cycsIHRoaXMuX29uRm9jdXMpO1xuICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKCdibHVyJywgdGhpcy5fb25CbHVyKTtcblxuICAgICAgdGhpcy5faW5uZXJGb2N1c2FibGVzLmZvckVhY2goKGZvY3VzYWJsZSkgPT4ge1xuICAgICAgICBmb2N1c2FibGUucmVtb3ZlRXZlbnRMaXN0ZW5lcignZm9jdXMnLCB0aGlzLl9vbklubmVyRm9jdXNhYmxlRm9jdXNlZCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyByZWFkLW9ubHlcbiAgICBnZXQgZm9jdXNlZCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmhhc0F0dHJpYnV0ZSgnZm9jdXNlZCcpO1xuICAgIH1cblxuICAgIHNldCBmb2N1c2VkKF8pIHtcbiAgICAgIGNvbnNvbGUud2FybihFUlJPUl9NRVNTQUdFUy5mb2N1c2VkKTtcbiAgICB9XG5cbiAgICBnZXQgZGlzYWJsZWQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5oYXNBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgfVxuXG4gICAgc2V0IGRpc2FibGVkKHZhbHVlKSB7XG4gICAgICBjb25zdCBoYXNWYWx1ZSA9IEJvb2xlYW4odmFsdWUpO1xuICAgICAgaWYgKGhhc1ZhbHVlKSB7XG4gICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICcnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGdldCBfaW5uZXJGb2N1c2FibGVzKCkge1xuICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW5UcmVlLnF1ZXJ5U2VsZWN0b3JBbGwoJ1t0YWJpbmRleF0nKSB8fCBbXTtcbiAgICB9XG5cbiAgICBnZXQgX2ZpcnN0SW5uZXJGb2N1c2FibGUoKSB7XG4gICAgICByZXR1cm4gdGhpcy5jaGlsZHJlblRyZWUucXVlcnlTZWxlY3RvcignW3RhYmluZGV4XScpO1xuICAgIH1cblxuICAgIF9vbklubmVyRm9jdXNhYmxlRm9jdXNlZChldnQpIHtcbiAgICAgIHRoaXMuX2N1cnJlbnRJbm5lckZvY3VzZWQgPSBldnQudGFyZ2V0O1xuICAgIH1cblxuICAgIF9vbkZvY3VzKCkge1xuICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHJldHVybjtcbiAgICAgIC8vIE9ubHkgZm9yIHN0eWxpbmcgcHVycG9zZS5cbiAgICAgIC8vIEZvY3VzZWQgcHJvcGVydHkgaXMgY29udHJvbGxlZCBmcm9tIGluc2lkZS5cbiAgICAgIC8vIEF0dGVtcHQgdG8gc2V0IHRoaXMgcHJvcGVydHkgZnJvbSBvdXRzaWRlIHdpbGwgdHJpZ2dlciBhIHdhcm5pbmdcbiAgICAgIC8vIGFuZCB3aWxsIGJlIGlnbm9yZWRcbiAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdmb2N1c2VkJywgJycpO1xuICAgICAgdGhpcy5fYXBwbHlGb2N1c1NpZGVFZmZlY3RzKCk7XG4gICAgfVxuXG4gICAgX29uQmx1cigpIHtcbiAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCdmb2N1c2VkJyk7XG4gICAgICB0aGlzLl9hcHBseUJsdXJTaWRlRWZmZWN0cygpO1xuICAgIH1cblxuICAgIF9hcHBseUZvY3VzU2lkZUVmZmVjdHMoKSB7XG4gICAgICBpZiAodGhpcy5fY3VycmVudElubmVyRm9jdXNlZCkge1xuICAgICAgICAvLyBTb21lIGlubmVyIGNvbXBvbmVudCBpcyBhbHJlYWR5IGZvY3VzZWQuXG4gICAgICAgIC8vIE5vIG5lZWQgdG8gc2V0IGZvY3VzIG9uIGFueXRoaW5nLlxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLl9mb2N1c0ZpcnN0SW5uZXJGb2N1c2FibGUoKTtcbiAgICB9XG5cbiAgICBfYXBwbHlCbHVyU2lkZUVmZmVjdHMoKSB7XG4gICAgICBpZiAodGhpcy5fY3VycmVudElubmVyRm9jdXNlZCkge1xuICAgICAgICB0aGlzLl9jdXJyZW50SW5uZXJGb2N1c2VkLmJsdXIoKTtcbiAgICAgICAgdGhpcy5fY3VycmVudElubmVyRm9jdXNlZCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2ZvY3VzRmlyc3RJbm5lckZvY3VzYWJsZSgpIHtcbiAgICAgIGNvbnN0IGZpcnN0SW5uZXJGb2N1c2FibGUgPSB0aGlzLl9maXJzdElubmVyRm9jdXNhYmxlO1xuICAgICAgaWYgKGZpcnN0SW5uZXJGb2N1c2FibGUpIHtcbiAgICAgICAgdGhpcy5fY3VycmVudElubmVyRm9jdXNlZCA9IGZpcnN0SW5uZXJGb2N1c2FibGU7XG4gICAgICAgIGZpcnN0SW5uZXJGb2N1c2FibGUuZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfYXBwbHlEaXNhYmxlZFNpZGVFZmZlY3RzKCkge1xuICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoJ3RhYmluZGV4Jyk7XG4gICAgICB0aGlzLl9pbm5lckZvY3VzYWJsZXMuZm9yRWFjaCgoaW5uZXJGb2N1c2FibGUpID0+IHtcbiAgICAgICAgaW5uZXJGb2N1c2FibGUuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xuICAgICAgICBpZiAoaW5uZXJGb2N1c2FibGUuaGFzQXR0cmlidXRlKCdjb250ZW50ZWRpdGFibGUnKSkge1xuICAgICAgICAgIGlubmVyRm9jdXNhYmxlLnNldEF0dHJpYnV0ZSgnY29udGVudGVkaXRhYmxlJywgJ2ZhbHNlJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaW5uZXJGb2N1c2FibGUuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMuYmx1cigpO1xuICAgIH1cblxuICAgIF9hcHBseUVuYWJsZWRTaWRlRWZmZWN0cygpIHtcbiAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICcwJyk7XG4gICAgICB0aGlzLl9pbm5lckZvY3VzYWJsZXMuZm9yRWFjaCgoaW5uZXJGb2N1c2FibGUpID0+IHtcbiAgICAgICAgaW5uZXJGb2N1c2FibGUuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICcwJyk7XG4gICAgICAgIGlmIChpbm5lckZvY3VzYWJsZS5oYXNBdHRyaWJ1dGUoJ2NvbnRlbnRlZGl0YWJsZScpKSB7XG4gICAgICAgICAgaW5uZXJGb2N1c2FibGUuc2V0QXR0cmlidXRlKCdjb250ZW50ZWRpdGFibGUnLCAndHJ1ZScpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlubmVyRm9jdXNhYmxlLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBGb2N1c2FibGU7XG59XG4iLCJcbmltcG9ydCBnZXREQlVJTG9jYWxlU2VydmljZSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9EQlVJTG9jYWxlU2VydmljZSc7XG5pbXBvcnQgZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uIGZyb20gJy4uLy4uL2ludGVybmFscy9lbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24nO1xuXG5jb25zdCByZWdpc3RyYXRpb25OYW1lID0gJ0RCVUlXZWJDb21wb25lbnRCYXNlJztcblxuZnVuY3Rpb24gZGVmaW5lQ29tbW9uQ1NTVmFycygpIHtcbiAgY29uc3QgY29tbW9uU3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICBjb21tb25TdHlsZS5pbm5lckhUTUwgPSBgXG4gIDpyb290IHtcbiAgICAtLWRidWktd2ViLWNvbXBvbmVudC1nbG9iYWwtYm9yZGVyLXJhZGl1czogNXB4O1xuICAgIC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtaGVpZ2h0OiAzMHB4O1xuICAgIC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtY29sb3I6ICMwMDA7XG4gICAgLS1kYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC1iYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICAtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWJvcmRlci1jb2xvcjogI2NjYztcbiAgICAtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWJvcmRlci1zdHlsZTogc29saWQ7XG4gICAgLS1kYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC1ib3JkZXItd2lkdGg6IDFweDtcbiAgfVxuICBgO1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdoZWFkJykuYXBwZW5kQ2hpbGQoY29tbW9uU3R5bGUpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXREQlVJV2ViQ29tcG9uZW50QmFzZSh3aW4pIHtcbiAgY29uc3QgTG9jYWxlU2VydmljZSA9IGdldERCVUlMb2NhbGVTZXJ2aWNlKHdpbik7XG5cbiAgcmV0dXJuIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbih3aW4sIHJlZ2lzdHJhdGlvbk5hbWUsICgpID0+IHtcbiAgICBkZWZpbmVDb21tb25DU1NWYXJzKCk7XG5cbiAgICBjb25zdCB7IGRvY3VtZW50LCBIVE1MRWxlbWVudCwgY3VzdG9tRWxlbWVudHMgfSA9IHdpbjtcblxuICAgIGNsYXNzIERCVUlXZWJDb21wb25lbnRCYXNlIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuXG4gICAgICBzdGF0aWMgZ2V0IHJlZ2lzdHJhdGlvbk5hbWUoKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigncmVnaXN0cmF0aW9uTmFtZSBtdXN0IGJlIGRlZmluZWQgaW4gZGVyaXZlZCBjbGFzc2VzJyk7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgdGVtcGxhdGVJbm5lckhUTUwoKSB7XG4gICAgICAgIHJldHVybiAnPHN0eWxlPjwvc3R5bGU+PHNsb3Q+PC9zbG90Pic7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgZGVwZW5kZW5jaWVzKCkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgdXNlU2hhZG93KCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCBwcm9wZXJ0aWVzVG9VcGdyYWRlKCkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgcHJvcGVydGllc1RvRGVmaW5lKCkge1xuICAgICAgICByZXR1cm4ge307XG4gICAgICB9XG5cbiAgICAgIGdldCBpbnN0YW5jZVByb3BlcnRpZXNUb0RlZmluZSgpIHtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgfVxuXG4gICAgICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgY29uc3QgeyB1c2VTaGFkb3cgfSA9IHRoaXMuY29uc3RydWN0b3I7XG4gICAgICAgIGlmICh1c2VTaGFkb3cpIHtcbiAgICAgICAgICB0aGlzLmF0dGFjaFNoYWRvdyh7XG4gICAgICAgICAgICBtb2RlOiAnb3BlbicsXG4gICAgICAgICAgICAvLyBkZWxlZ2F0ZXNGb2N1czogdHJ1ZVxuICAgICAgICAgICAgLy8gTm90IHdvcmtpbmcgb24gSVBhZCBzbyB3ZSBkbyBhbiB3b3JrYXJvdW5kXG4gICAgICAgICAgICAvLyBieSBzZXR0aW5nIFwiZm9jdXNlZFwiIGF0dHJpYnV0ZSB3aGVuIG5lZWRlZC5cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9pc0Nvbm5lY3RlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9pbnNlcnRUZW1wbGF0ZSgpO1xuXG4gICAgICAgIHRoaXMuY29ubmVjdGVkQ2FsbGJhY2sgPSB0aGlzLmNvbm5lY3RlZENhbGxiYWNrLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuZGlzY29ubmVjdGVkQ2FsbGJhY2sgPSB0aGlzLmRpc2Nvbm5lY3RlZENhbGxiYWNrLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuX2hhbmRsZUxvY2FsZUNoYW5nZSA9IHRoaXMuX2hhbmRsZUxvY2FsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm9uTG9jYWxlQ2hhbmdlICYmICh0aGlzLm9uTG9jYWxlQ2hhbmdlID0gdGhpcy5vbkxvY2FsZUNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy51bnJlZ2lzdGVyTG9jYWxlQ2hhbmdlID0gbnVsbDtcblxuICAgICAgICAvLyBwcm92aWRlIHN1cHBvcnQgZm9yIHRyYWl0cyBpZiBhbnkgYXMgdGhleSBjYW50IG92ZXJyaWRlIGNvbnN0cnVjdG9yXG4gICAgICAgIHRoaXMuaW5pdCAmJiB0aGlzLmluaXQoLi4uYXJncyk7XG4gICAgICB9XG5cbiAgICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL3dlYi9mdW5kYW1lbnRhbHMvd2ViLWNvbXBvbmVudHMvYmVzdC1wcmFjdGljZXMjbGF6eS1wcm9wZXJ0aWVzXG4gICAgICAvLyBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS93ZWIvZnVuZGFtZW50YWxzL3dlYi1jb21wb25lbnRzL2V4YW1wbGVzL2hvd3RvLWNoZWNrYm94XG4gICAgICAvKiBlc2xpbnQgbm8tcHJvdG90eXBlLWJ1aWx0aW5zOiAwICovXG4gICAgICBfdXBncmFkZVByb3BlcnR5KHByb3ApIHtcbiAgICAgICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXNbcHJvcF07XG4gICAgICAgICAgZGVsZXRlIHRoaXNbcHJvcF07XG4gICAgICAgICAgdGhpc1twcm9wXSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIF9kZWZpbmVQcm9wZXJ0eShrZXksIHZhbHVlKSB7XG4gICAgICAgIGlmICghdGhpcy5oYXNBdHRyaWJ1dGUoa2V5KSkge1xuICAgICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKGtleSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgICB0aGlzLl9pc0Nvbm5lY3RlZCA9IHRydWU7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdiZWZvcmV1bmxvYWQnLCB0aGlzLmRpc2Nvbm5lY3RlZENhbGxiYWNrLCBmYWxzZSk7XG4gICAgICAgIHRoaXMudW5yZWdpc3RlckxvY2FsZUNoYW5nZSA9XG4gICAgICAgICAgTG9jYWxlU2VydmljZS5vbkxvY2FsZUNoYW5nZSh0aGlzLl9oYW5kbGVMb2NhbGVDaGFuZ2UpO1xuICAgICAgICBjb25zdCB7IHByb3BlcnRpZXNUb1VwZ3JhZGUsIHByb3BlcnRpZXNUb0RlZmluZSB9ID0gdGhpcy5jb25zdHJ1Y3RvcjtcbiAgICAgICAgY29uc3QgeyBpbnN0YW5jZVByb3BlcnRpZXNUb0RlZmluZSB9ID0gdGhpcztcbiAgICAgICAgY29uc3QgYWxsUHJvcGVydGllc1RvRGVmaW5lID0ge1xuICAgICAgICAgIC4uLnByb3BlcnRpZXNUb0RlZmluZSxcbiAgICAgICAgICAuLi5pbnN0YW5jZVByb3BlcnRpZXNUb0RlZmluZVxuICAgICAgICB9O1xuICAgICAgICBwcm9wZXJ0aWVzVG9VcGdyYWRlLmZvckVhY2goKHByb3BlcnR5KSA9PiB7XG4gICAgICAgICAgdGhpcy5fdXBncmFkZVByb3BlcnR5KHByb3BlcnR5KTtcbiAgICAgICAgfSk7XG4gICAgICAgIE9iamVjdC5rZXlzKGFsbFByb3BlcnRpZXNUb0RlZmluZSkuZm9yRWFjaCgocHJvcGVydHkpID0+IHtcbiAgICAgICAgICB0aGlzLl9kZWZpbmVQcm9wZXJ0eShwcm9wZXJ0eSwgYWxsUHJvcGVydGllc1RvRGVmaW5lW3Byb3BlcnR5XSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgICAgdGhpcy5faXNDb25uZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy51bnJlZ2lzdGVyTG9jYWxlQ2hhbmdlKCk7XG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdiZWZvcmV1bmxvYWQnLCB0aGlzLmRpc2Nvbm5lY3RlZENhbGxiYWNrLCBmYWxzZSk7XG4gICAgICB9XG5cbiAgICAgIGdldCBjaGlsZHJlblRyZWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLnVzZVNoYWRvdyA/IHRoaXMuc2hhZG93Um9vdCA6IHRoaXM7XG4gICAgICB9XG5cbiAgICAgIF9pbnNlcnRUZW1wbGF0ZSgpIHtcbiAgICAgICAgY29uc3QgeyB0ZW1wbGF0ZSB9ID0gdGhpcy5jb25zdHJ1Y3RvcjtcblxuICAgICAgICBpZiAodGVtcGxhdGUpIHtcbiAgICAgICAgICB0aGlzLmNoaWxkcmVuVHJlZS5hcHBlbmRDaGlsZCh0ZW1wbGF0ZS5jb250ZW50LmNsb25lTm9kZSh0cnVlKSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgX2hhbmRsZUxvY2FsZUNoYW5nZShsb2NhbGUpIHtcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2RpcicsIGxvY2FsZS5kaXIpO1xuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnbGFuZycsIGxvY2FsZS5sYW5nKTtcbiAgICAgICAgdGhpcy5vbkxvY2FsZUNoYW5nZSAmJiB0aGlzLm9uTG9jYWxlQ2hhbmdlKGxvY2FsZSk7XG4gICAgICB9XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzKGtsYXNzKSB7XG4gICAgICBjb25zdCB0ZW1wbGF0ZUlubmVySFRNTCA9IGtsYXNzLnRlbXBsYXRlSW5uZXJIVE1MO1xuICAgICAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAgICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gdGVtcGxhdGVJbm5lckhUTUw7XG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShrbGFzcywgJ3RlbXBsYXRlJywge1xuICAgICAgICBnZXQoKSB7IHJldHVybiB0ZW1wbGF0ZTsgfSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfSk7XG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShrbGFzcywgJ2NvbXBvbmVudFN0eWxlJywge1xuICAgICAgICBnZXQoKSB7XG4gICAgICAgICAgcmV0dXJuIGtsYXNzLnRlbXBsYXRlLmNvbnRlbnQucXVlcnlTZWxlY3Rvcignc3R5bGUnKS5pbm5lckhUTUw7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCh2YWx1ZSkge1xuICAgICAgICAgIGtsYXNzLnRlbXBsYXRlLmNvbnRlbnQucXVlcnlTZWxlY3Rvcignc3R5bGUnKS5pbm5lckhUTUwgPSB2YWx1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBrbGFzcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBSZWdpc3RlcmFibGUoa2xhc3MpIHtcbiAgICAgIGtsYXNzLnJlZ2lzdGVyU2VsZiA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgcmVnaXN0cmF0aW9uTmFtZSA9IGtsYXNzLnJlZ2lzdHJhdGlvbk5hbWU7XG4gICAgICAgIGNvbnN0IGRlcGVuZGVuY2llcyA9IGtsYXNzLmRlcGVuZGVuY2llcztcbiAgICAgICAgLy8gTWFrZSBzdXJlIG91ciBkZXBlbmRlbmNpZXMgYXJlIHJlZ2lzdGVyZWQgYmVmb3JlIHdlIHJlZ2lzdGVyIHNlbGZcbiAgICAgICAgZGVwZW5kZW5jaWVzLmZvckVhY2goKGRlcGVuZGVuY3kpID0+IGRlcGVuZGVuY3kucmVnaXN0ZXJTZWxmKCkpO1xuICAgICAgICAvLyBEb24ndCB0cnkgdG8gcmVnaXN0ZXIgc2VsZiBpZiBhbHJlYWR5IHJlZ2lzdGVyZWRcbiAgICAgICAgaWYgKGN1c3RvbUVsZW1lbnRzLmdldChyZWdpc3RyYXRpb25OYW1lKSkgcmV0dXJuIHJlZ2lzdHJhdGlvbk5hbWU7XG4gICAgICAgIC8vIEdpdmUgYSBjaGFuY2UgdG8gb3ZlcnJpZGUgd2ViLWNvbXBvbmVudCBzdHlsZSBpZiBwcm92aWRlZCBiZWZvcmUgYmVpbmcgcmVnaXN0ZXJlZC5cbiAgICAgICAgY29uc3QgY29tcG9uZW50U3R5bGUgPSAoKHdpbi5EQlVJV2ViQ29tcG9uZW50cyB8fCB7fSlbcmVnaXN0cmF0aW9uTmFtZV0gfHwge30pLmNvbXBvbmVudFN0eWxlO1xuICAgICAgICBpZiAoY29tcG9uZW50U3R5bGUpIHtcbiAgICAgICAgICBrbGFzcy5jb21wb25lbnRTdHlsZSArPSAnXFxuXFxuLyogPT09PSBvdmVycmlkZXMgPT09PSAqL1xcblxcbic7XG4gICAgICAgICAga2xhc3MuY29tcG9uZW50U3R5bGUgKz0gY29tcG9uZW50U3R5bGU7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRG8gcmVnaXN0cmF0aW9uXG4gICAgICAgIGN1c3RvbUVsZW1lbnRzLmRlZmluZShyZWdpc3RyYXRpb25OYW1lLCBrbGFzcyk7XG4gICAgICAgIHJldHVybiByZWdpc3RyYXRpb25OYW1lO1xuICAgICAgfTtcblxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGtsYXNzLCAncHJvdG90eXBlQ2hhaW5JbmZvJywge1xuICAgICAgICBnZXQoKSB7XG4gICAgICAgICAgY29uc3QgY2hhaW4gPSBba2xhc3NdO1xuICAgICAgICAgIGxldCBwYXJlbnRQcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihrbGFzcyk7XG4gICAgICAgICAgd2hpbGUgKHBhcmVudFByb3RvICE9PSBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgY2hhaW4ucHVzaChwYXJlbnRQcm90byk7XG4gICAgICAgICAgICBwYXJlbnRQcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihwYXJlbnRQcm90byk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNoYWluLnB1c2gocGFyZW50UHJvdG8pO1xuICAgICAgICAgIHJldHVybiBjaGFpbjtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBrbGFzcztcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgREJVSVdlYkNvbXBvbmVudEJhc2UsXG4gICAgICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzLFxuICAgICAgUmVnaXN0ZXJhYmxlXG4gICAgfTtcbiAgfSk7XG59XG4iLCJcbmltcG9ydCBnZXREQlVJV2ViQ29tcG9uZW50QmFzZSBmcm9tICcuLi9EQlVJV2ViQ29tcG9uZW50QmFzZS9EQlVJV2ViQ29tcG9uZW50QmFzZSc7XG5pbXBvcnQgZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uIGZyb20gJy4uLy4uL2ludGVybmFscy9lbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24nO1xuXG5jb25zdCByZWdpc3RyYXRpb25OYW1lID0gJ2RidWktd2ViLWNvbXBvbmVudC1kdW1teSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldERCVUlXZWJDb21wb25lbnREdW1teSh3aW4pIHtcbiAgcmV0dXJuIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbih3aW4sIHJlZ2lzdHJhdGlvbk5hbWUsICgpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBEQlVJV2ViQ29tcG9uZW50QmFzZSxcbiAgICAgIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMsXG4gICAgICBSZWdpc3RlcmFibGVcbiAgICB9ID0gZ2V0REJVSVdlYkNvbXBvbmVudEJhc2Uod2luKTtcblxuICAgIGNsYXNzIERCVUlXZWJDb21wb25lbnREdW1teSBleHRlbmRzIERCVUlXZWJDb21wb25lbnRCYXNlIHtcblxuICAgICAgc3RhdGljIGdldCByZWdpc3RyYXRpb25OYW1lKCkge1xuICAgICAgICByZXR1cm4gcmVnaXN0cmF0aW9uTmFtZTtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCB0ZW1wbGF0ZUlubmVySFRNTCgpIHtcbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgICA8c3R5bGU+XG4gICAgICAgICAgOmhvc3Qge1xuICAgICAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgICAgICBtYXgtd2lkdGg6IDQwMHB4O1xuICAgICAgICAgICAgaGVpZ2h0OiB2YXIoLS1kYnVpLWlucHV0LWhlaWdodCwgNTBweCk7XG4gICAgICAgICAgICBjb2xvcjogbWFyb29uO1xuICAgICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgZ3JheTtcbiAgICAgICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIDpob3N0IGIsIDpob3N0IGRpdlt4LWhhcy1zbG90XSBzcGFuW3gtc2xvdC13cmFwcGVyXSB7XG4gICAgICAgICAgICB1bmljb2RlLWJpZGk6IGJpZGktb3ZlcnJpZGU7XG4gICAgICAgICAgICB0ZXh0LXNoYWRvdzogdmFyKC0tZHVtbXktYi10ZXh0LXNoYWRvdywgbm9uZSk7XG4gICAgICAgICAgfVxuICAgIFxuICAgICAgICAgIDpob3N0KFtkaXI9cnRsXSkgYiB7XG4gICAgICAgICAgICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgOmhvc3QoW2Rpcj1sdHJdKSBiIHtcbiAgICAgICAgICAgIHRleHQtZGVjb3JhdGlvbjogb3ZlcmxpbmU7XG4gICAgICAgICAgfVxuICAgIFxuICAgICAgICAgIDpob3N0KFtkaXI9bHRyXSkgI2NvbnRhaW5lciA+IGRpdltkaXI9cnRsXSxcbiAgICAgICAgICA6aG9zdChbZGlyPXJ0bF0pICNjb250YWluZXIgPiBkaXZbZGlyPWx0cl0ge1xuICAgICAgICAgICAgZGlzcGxheTogbm9uZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgOmhvc3QgI2NvbnRhaW5lciA+IGRpdlt4LWhhcy1zbG90XSB7XG4gICAgICAgICAgICBtYXJnaW4tbGVmdDogMHB4O1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICAjY29udGFpbmVyIHtcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgIGZsZXgtZmxvdzogcm93IG5vd3JhcDtcbiAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBzdHJldGNoO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICAjY29udGFpbmVyID4gZGl2IHtcbiAgICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIGdyYXk7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiB2YXIoLS1kdW1teS1pbm5lci1zZWN0aW9ucy1ib3JkZXItcmFkaXVzLCAwcHgpO1xuICAgICAgICAgICAgZmxleDogMSAwIDAlO1xuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgIG1hcmdpbjogNXB4O1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICAjY29udGFpbmVyID4gZGl2ID4gZGl2IHtcbiAgICAgICAgICAgIG1hcmdpbjogYXV0bztcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgPC9zdHlsZT5cbiAgICAgICAgICBcbiAgICAgICAgICA8ZGl2IGlkPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgICA8ZGl2IGRpcj1cImx0clwiPlxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxiPkR1bW15IHNoYWRvdzwvYj4gW0xUUl1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgPGRpdiB4LWhhcy1zbG90PlxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxzcGFuPls8L3NwYW4+PHNwYW4geC1zbG90LXdyYXBwZXI+PHNsb3Q+PC9zbG90Pjwvc3Bhbj48c3Bhbj5dPC9zcGFuPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgXG4gICAgICAgICAgICA8ZGl2IGRpcj1cInJ0bFwiPlxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxiPkR1bW15IHNoYWRvdzwvYj4gW1JUTF1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcbiAgICAgIH1cblxuICAgICAgb25Mb2NhbGVDaGFuZ2UobG9jYWxlKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdvbkxvY2FsZUNoYW5nZScsIGxvY2FsZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFJlZ2lzdGVyYWJsZShcbiAgICAgIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMoXG4gICAgICAgIERCVUlXZWJDb21wb25lbnREdW1teVxuICAgICAgKVxuICAgICk7XG4gIH0pO1xufVxuXG5nZXREQlVJV2ViQ29tcG9uZW50RHVtbXkucmVnaXN0cmF0aW9uTmFtZSA9IHJlZ2lzdHJhdGlvbk5hbWU7XG5cbiIsIlxuXG5pbXBvcnQgZ2V0REJVSVdlYkNvbXBvbmVudEJhc2UgZnJvbSAnLi4vREJVSVdlYkNvbXBvbmVudEJhc2UvREJVSVdlYkNvbXBvbmVudEJhc2UnO1xuaW1wb3J0IGdldERCVUlXZWJDb21wb25lbnREdW1teSBmcm9tICcuLi9EQlVJV2ViQ29tcG9uZW50RHVtbXkvREJVSVdlYkNvbXBvbmVudER1bW15JztcbmltcG9ydCBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24gZnJvbSAnLi4vLi4vaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbic7XG5cbmNvbnN0IHJlZ2lzdHJhdGlvbk5hbWUgPSAnZGJ1aS13ZWItY29tcG9uZW50LWR1bW15LXBhcmVudCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldERCVUlXZWJDb21wb25lbnREdW1teVBhcmVudCh3aW4pIHtcbiAgcmV0dXJuIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbih3aW4sIHJlZ2lzdHJhdGlvbk5hbWUsICgpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBEQlVJV2ViQ29tcG9uZW50QmFzZSxcbiAgICAgIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMsXG4gICAgICBSZWdpc3RlcmFibGVcbiAgICB9ID0gZ2V0REJVSVdlYkNvbXBvbmVudEJhc2Uod2luKTtcbiAgICBjb25zdCBEQlVJV2ViQ29tcG9uZW50RHVtbXkgPSBnZXREQlVJV2ViQ29tcG9uZW50RHVtbXkod2luKTtcblxuICAgIGNsYXNzIERCVUlXZWJDb21wb25lbnREdW1teVBhcmVudCBleHRlbmRzIERCVUlXZWJDb21wb25lbnRCYXNlIHtcblxuICAgICAgc3RhdGljIGdldCByZWdpc3RyYXRpb25OYW1lKCkge1xuICAgICAgICByZXR1cm4gcmVnaXN0cmF0aW9uTmFtZTtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCB0ZW1wbGF0ZUlubmVySFRNTCgpIHtcbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgICA8c3R5bGU+XG4gICAgICAgICAgOmhvc3Qge1xuICAgICAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgICAgICBtYXgtd2lkdGg6IDQwMHB4O1xuICAgICAgICAgIH1cbiAgICAgICAgICA8L3N0eWxlPlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8Yj5EdW1teSBQYXJlbnQgc2hhZG93PC9iPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8ZGJ1aS13ZWItY29tcG9uZW50LWR1bW15PjxzbG90Pjwvc2xvdD48L2RidWktd2ViLWNvbXBvbmVudC1kdW1teT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IGRlcGVuZGVuY2llcygpIHtcbiAgICAgICAgcmV0dXJuIFtEQlVJV2ViQ29tcG9uZW50RHVtbXldO1xuICAgICAgfVxuXG4gICAgfVxuXG4gICAgcmV0dXJuIFJlZ2lzdGVyYWJsZShcbiAgICAgIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMoXG4gICAgICAgIERCVUlXZWJDb21wb25lbnREdW1teVBhcmVudFxuICAgICAgKVxuICAgICk7XG4gIH0pO1xufVxuXG5nZXREQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQucmVnaXN0cmF0aW9uTmFtZSA9IHJlZ2lzdHJhdGlvbk5hbWU7XG5cbiIsIlxuaW1wb3J0IGdldERCVUlXZWJDb21wb25lbnRCYXNlIGZyb20gJy4uL0RCVUlXZWJDb21wb25lbnRCYXNlL0RCVUlXZWJDb21wb25lbnRCYXNlJztcbmltcG9ydCBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24gZnJvbSAnLi4vLi4vaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbic7XG5pbXBvcnQgRm9jdXNhYmxlIGZyb20gJy4uLy4uL2JlaGF2aW91cnMvRm9jdXNhYmxlJztcblxuY29uc3QgcmVnaXN0cmF0aW9uTmFtZSA9ICdkYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC10ZXh0JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0REJVSVdlYkNvbXBvbmVudEZvcm1JbnB1dFRleHQod2luKSB7XG4gIHJldHVybiBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24od2luLCByZWdpc3RyYXRpb25OYW1lLCAoKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgREJVSVdlYkNvbXBvbmVudEJhc2UsXG4gICAgICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzLFxuICAgICAgUmVnaXN0ZXJhYmxlXG4gICAgfSA9IGdldERCVUlXZWJDb21wb25lbnRCYXNlKHdpbik7XG5cbiAgICBjbGFzcyBEQlVJV2ViQ29tcG9uZW50Rm9ybUlucHV0VGV4dCBleHRlbmRzIERCVUlXZWJDb21wb25lbnRCYXNlIHtcblxuICAgICAgc3RhdGljIGdldCByZWdpc3RyYXRpb25OYW1lKCkge1xuICAgICAgICByZXR1cm4gcmVnaXN0cmF0aW9uTmFtZTtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCB0ZW1wbGF0ZUlubmVySFRNTCgpIHtcbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgICA8c3R5bGU+XG4gICAgICAgICAgOmhvc3Qge1xuICAgICAgICAgICAgYWxsOiBpbml0aWFsOyBcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgLypoZWlnaHQ6IHZhcigtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWhlaWdodCk7Ki9cbiAgICAgICAgICAgIC8qbGluZS1oZWlnaHQ6IHZhcigtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWhlaWdodCk7Ki9cbiAgICAgICAgICAgIGhlaWdodDogMzAwcHg7XG4gICAgICAgICAgICBwYWRkaW5nOiAwcHg7XG4gICAgICAgICAgICBmb250LXNpemU6IDE4cHg7XG4gICAgICAgICAgICBjb2xvcjogdmFyKC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtY29sb3IpO1xuICAgICAgICAgICAgLypiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1kYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC1iYWNrZ3JvdW5kLWNvbG9yKTsqL1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDEwMCwgMCwgMC4xKTtcbiAgICAgICAgICAgIHVuaWNvZGUtYmlkaTogYmlkaS1vdmVycmlkZTtcbiAgICAgICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgICAgICAgICBib3JkZXI6IG5vbmU7XG4gICAgICAgICAgICBib3JkZXItYm90dG9tOiB2YXIoLS1kYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC1ib3JkZXItd2lkdGgpIHZhcigtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWJvcmRlci1zdHlsZSkgdmFyKC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtYm9yZGVyLWNvbG9yKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgOmhvc3QgW3RhYmluZGV4XSB7XG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgIGhlaWdodDogNTBweDtcbiAgICAgICAgICAgIGxpbmUtaGVpZ2h0OiA1MHB4O1xuICAgICAgICAgICAgYm9yZGVyOiBub25lO1xuICAgICAgICAgICAgbWFyZ2luOiAwcHg7XG4gICAgICAgICAgICBwYWRkaW5nOiAwcHg7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDBweDtcbiAgICAgICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgICAgICAgICB1bmljb2RlLWJpZGk6IGJpZGktb3ZlcnJpZGU7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIDpob3N0IFt0YWJpbmRleF06Zm9jdXMge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDAsIDAsIC4zKTtcbiAgICAgICAgICAgIG91dGxpbmU6IG5vbmU7XG4gICAgICAgICAgfVxuICAgIFxuICAgICAgICAgIDpob3N0KFtmb2N1c2VkXSkge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAyNTUsIDAsIC4zKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgLyo6aG9zdChbZGlzYWJsZWRdKSB7Ki9cbiAgICAgICAgICAgIC8qYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAuMyk7Ki9cbiAgICAgICAgICAvKn0qL1xuICAgIFxuICAgICAgICAgIDpob3N0KFtoaWRkZW5dKSB7XG4gICAgICAgICAgICBkaXNwbGF5OiBub25lO1xuICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICA6aG9zdChbZGlyPXJ0bF0pIHtcbiAgICAgICAgICBcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgOmhvc3QoW2Rpcj1sdHJdKSB7XG4gICAgICAgICAgXG4gICAgICAgICAgfVxuICAgICAgICAgIDwvc3R5bGU+XG4gICAgICAgICAgPHA+REJVSVdlYkNvbXBvbmVudEZvcm1JbnB1dFRleHQ8L3A+XG4gICAgICAgICAgPGRpdiBjb250ZW50ZWRpdGFibGU9XCJ0cnVlXCIgdGFiaW5kZXg9XCIwXCI+PC9kaXY+XG4gICAgICAgICAgPGRpdiBjb250ZW50ZWRpdGFibGU9XCJ0cnVlXCIgdGFiaW5kZXg9XCIwXCI+PC9kaXY+XG4gICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgdGFiaW5kZXg9XCIwXCIgLz5cbiAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiB0YWJpbmRleD1cIjBcIiAvPlxuICAgICAgICBgO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IHByb3BlcnRpZXNUb0RlZmluZSgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICByb2xlOiAnZm9ybS1pbnB1dCdcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgb25Mb2NhbGVDaGFuZ2UobG9jYWxlKSB7XG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgLyogZXNsaW50IG5vLWNvbnNvbGU6IDAgKi9cbiAgICAgICAgICBjb25zb2xlLmxvZygnb25Mb2NhbGVDaGFuZ2UnLCBsb2NhbGUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICB9XG5cbiAgICByZXR1cm4gUmVnaXN0ZXJhYmxlKFxuICAgICAgRm9jdXNhYmxlKFxuICAgICAgICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzKFxuICAgICAgICAgIERCVUlXZWJDb21wb25lbnRGb3JtSW5wdXRUZXh0XG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuXG4gIH0pO1xufVxuXG5nZXREQlVJV2ViQ29tcG9uZW50Rm9ybUlucHV0VGV4dC5yZWdpc3RyYXRpb25OYW1lID0gcmVnaXN0cmF0aW9uTmFtZTtcblxuIiwiXG5pbXBvcnQgZ2V0REJVSVdlYkNvbXBvbmVudEJhc2UgZnJvbSAnLi4vREJVSVdlYkNvbXBvbmVudEJhc2UvREJVSVdlYkNvbXBvbmVudEJhc2UnO1xuaW1wb3J0IGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbiBmcm9tICcuLi8uLi9pbnRlcm5hbHMvZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uJztcblxuY29uc3QgcmVnaXN0cmF0aW9uTmFtZSA9ICdkYnVpLXdlYi1jb21wb25lbnQtaWNvbic7XG5cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9nb3JhbmdhamljL3JlYWN0LWljb24tYmFzZS9ibG9iL21hc3Rlci9pbmRleC5qc1xuLy8gaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2dvcmFuZ2FqaWMvcmVhY3QtaWNvbnMvbWFzdGVyL2ljb25zL2dvL21hcmstZ2l0aHViLnN2Z1xuLy8gaHR0cHM6Ly9naXRodWIuY29tL2dvcmFuZ2FqaWMvcmVhY3QtaWNvbnNcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9nb3JhbmdhamljL3JlYWN0LWljb25zL2Jsb2IvbWFzdGVyL2dvL21hcmstZ2l0aHViLmpzXG4vLyBodHRwczovL2dvcmFuZ2FqaWMuZ2l0aHViLmlvL3JlYWN0LWljb25zL2dvLmh0bWxcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0REJVSVdlYkNvbXBvbmVudEljb24od2luKSB7XG4gIHJldHVybiBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24od2luLCByZWdpc3RyYXRpb25OYW1lLCAoKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgREJVSVdlYkNvbXBvbmVudEJhc2UsXG4gICAgICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzLFxuICAgICAgUmVnaXN0ZXJhYmxlXG4gICAgfSA9IGdldERCVUlXZWJDb21wb25lbnRCYXNlKHdpbik7XG5cbiAgICBjbGFzcyBEQlVJV2ViQ29tcG9uZW50SWNvbiBleHRlbmRzIERCVUlXZWJDb21wb25lbnRCYXNlIHtcblxuICAgICAgc3RhdGljIGdldCByZWdpc3RyYXRpb25OYW1lKCkge1xuICAgICAgICByZXR1cm4gcmVnaXN0cmF0aW9uTmFtZTtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCB0ZW1wbGF0ZUlubmVySFRNTCgpIHtcbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgICA8c3R5bGU+XG4gICAgICAgICAgOmhvc3Qge1xuICAgICAgICAgICAgYWxsOiBpbml0aWFsO1xuICAgICAgICAgICAgZm9udC1zaXplOiBpbmhlcml0OyBcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgICAgICAgIHdpZHRoOiAxZW07XG4gICAgICAgICAgICBoZWlnaHQ6IDFlbTtcbiAgICAgICAgICAgIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG4gICAgICAgICAgICBjb2xvcjogaW5oZXJpdDtcbiAgICAgICAgICB9XG4gICAgICAgICAgOmhvc3Qgc3ZnIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgICAgICAgIHdpZHRoOiAxZW07XG4gICAgICAgICAgICBoZWlnaHQ6IDFlbTtcbiAgICAgICAgICAgIHZlcnRpY2FsLWFsaWduOiB0b3A7XG4gICAgICAgICAgICBmaWxsOiBjdXJyZW50Q29sb3I7XG4gICAgICAgICAgfVxuICAgICAgICAgIDwvc3R5bGU+XG4gICAgICAgICAgPHN2ZyB2aWV3Qm94PVwiMCAwIDQwIDQwXCIgIHByZXNlcnZlQXNwZWN0UmF0aW89XCJ4TWlkWU1pZCBtZWV0XCIgPlxuICAgICAgICAgICAgPGc+PHBhdGggZD1cIlwiLz48L2c+XG4gICAgICAgICAgPC9zdmc+XG4gICAgICAgIGA7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgcHJvcGVydGllc1RvVXBncmFkZSgpIHtcbiAgICAgICAgY29uc3QgaW5oZXJpdGVkUHJvcGVydGllc1RvVXBncmFkZSA9IHN1cGVyLnByb3BlcnRpZXNUb1VwZ3JhZGUgfHwgW107XG4gICAgICAgIHJldHVybiBbLi4uaW5oZXJpdGVkUHJvcGVydGllc1RvVXBncmFkZSwgJ3NoYXBlJ107XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCkge1xuICAgICAgICBjb25zdCBpbmhlcml0ZWRPYnNlcnZlZEF0dHJpYnV0ZXMgPSBzdXBlci5vYnNlcnZlZEF0dHJpYnV0ZXMgfHwgW107XG4gICAgICAgIHJldHVybiBbLi4uaW5oZXJpdGVkT2JzZXJ2ZWRBdHRyaWJ1dGVzLCAnc2hhcGUnXTtcbiAgICAgIH1cblxuICAgICAgZ2V0IHNoYXBlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoJ3NoYXBlJyk7XG4gICAgICB9XG5cbiAgICAgIHNldCBzaGFwZSh2YWx1ZSkge1xuICAgICAgICBjb25zdCBoYXNWYWx1ZSA9ICFbdW5kZWZpbmVkLCBudWxsXS5pbmNsdWRlcyh2YWx1ZSk7XG4gICAgICAgIGNvbnN0IHN0cmluZ1ZhbHVlID0gU3RyaW5nKHZhbHVlKTtcbiAgICAgICAgaWYgKGhhc1ZhbHVlKSB7XG4gICAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ3NoYXBlJywgc3RyaW5nVmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCdzaGFwZScpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpIHtcbiAgICAgICAgc3VwZXIuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrICYmXG4gICAgICAgICAgc3VwZXIuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSk7XG5cbiAgICAgICAgY29uc3QgaGFzVmFsdWUgPSAhW3VuZGVmaW5lZCwgbnVsbF0uaW5jbHVkZXMobmV3VmFsdWUpO1xuICAgICAgICBpZiAobmFtZSA9PT0gJ3NoYXBlJykge1xuICAgICAgICAgIGhhc1ZhbHVlID8gdGhpcy5fc2V0U2hhcGUoKSA6IHRoaXMuX3JlbW92ZVNoYXBlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgX3NldFNoYXBlKCkge1xuICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5jaGlsZHJlblRyZWUucXVlcnlTZWxlY3Rvcignc3ZnIGcgcGF0aCcpO1xuICAgICAgICBwYXRoLnNldEF0dHJpYnV0ZSgnZCcsIHRoaXMuc2hhcGUpO1xuICAgICAgfVxuXG4gICAgICBfcmVtb3ZlU2hhcGUoKSB7XG4gICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLmNoaWxkcmVuVHJlZS5xdWVyeVNlbGVjdG9yKCdzdmcgZyBwYXRoJyk7XG4gICAgICAgIHBhdGguc2V0QXR0cmlidXRlKCdkJywgJycpO1xuICAgICAgfVxuXG4gICAgfVxuXG4gICAgcmV0dXJuIFJlZ2lzdGVyYWJsZShcbiAgICAgIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMoXG4gICAgICAgIERCVUlXZWJDb21wb25lbnRJY29uXG4gICAgICApXG4gICAgKTtcblxuICB9KTtcbn1cblxuZ2V0REJVSVdlYkNvbXBvbmVudEljb24ucmVnaXN0cmF0aW9uTmFtZSA9IHJlZ2lzdHJhdGlvbk5hbWU7XG5cbiIsImltcG9ydCBhcHBlbmRTdHlsZXMgZnJvbSAnLi4vaW50ZXJuYWxzL2FwcGVuZFN0eWxlcyc7XG5cbi8qKlxuKiBAcGFyYW0gY29tcG9uZW50cyBBcnJheTxPYmplY3Q+IFt7XG4qICByZWdpc3RyYXRpb25OYW1lLFxuKiAgY29tcG9uZW50U3R5bGUsXG4qICAuLi5cbiogfV1cbiogQHJldHVybnMgY29tcG9uZW50cyBBcnJheTxPYmplY3Q+XG4qL1xuY29uc3QgZGJ1aVdlYkNvbXBvbmVudHNTZXRVcCA9ICh3aW4pID0+IChjb21wb25lbnRzKSA9PiB7XG4gIHJldHVybiBhcHBlbmRTdHlsZXMod2luKShjb21wb25lbnRzKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGRidWlXZWJDb21wb25lbnRzU2V0VXA7XG4iLCIvKlxuREJVSVdlYkNvbXBvbmVudEJhc2UgKGZyb20gd2hpY2ggYWxsIHdlYi1jb21wb25lbnRzIGluaGVyaXQpXG53aWxsIHJlYWQgY29tcG9uZW50U3R5bGUgZnJvbSB3aW4uREJVSVdlYkNvbXBvbmVudHNcbndoZW4ga2xhc3MucmVnaXN0ZXJTZWxmKCkgaXMgY2FsbGVkIGdpdmluZyBhIGNoYW5jZSB0byBvdmVycmlkZSBkZWZhdWx0IHdlYi1jb21wb25lbnQgc3R5bGVcbmp1c3QgYmVmb3JlIGl0IGlzIHJlZ2lzdGVyZWQuXG4qL1xuY29uc3QgYXBwZW5kU3R5bGUgPSAod2luKSA9PiAocmVnaXN0cmF0aW9uTmFtZSwgY29tcG9uZW50U3R5bGUpID0+IHtcbiAgaWYgKCF3aW4uREJVSVdlYkNvbXBvbmVudHMpIHtcbiAgICB3aW4uREJVSVdlYkNvbXBvbmVudHMgPSB7fTtcbiAgfVxuICB3aW4uREJVSVdlYkNvbXBvbmVudHMgPSB7XG4gICAgLi4ud2luLkRCVUlXZWJDb21wb25lbnRzLFxuICAgIFtyZWdpc3RyYXRpb25OYW1lXToge1xuICAgICAgLi4ud2luLkRCVUlXZWJDb21wb25lbnRzW3JlZ2lzdHJhdGlvbk5hbWVdLFxuICAgICAgY29tcG9uZW50U3R5bGVcbiAgICB9XG4gIH07XG59O1xuXG5jb25zdCBhcHBlbmRTdHlsZXMgPSAod2luKSA9PiAoY29tcG9uZW50cykgPT4ge1xuICBjb21wb25lbnRzLmZvckVhY2goKHsgcmVnaXN0cmF0aW9uTmFtZSwgY29tcG9uZW50U3R5bGUgfSkgPT4ge1xuICAgIGFwcGVuZFN0eWxlKHdpbikocmVnaXN0cmF0aW9uTmFtZSwgY29tcG9uZW50U3R5bGUpO1xuICB9KTtcbiAgcmV0dXJuIGNvbXBvbmVudHM7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhcHBlbmRTdHlsZXM7XG4iLCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uKHdpbiwgbmFtZSwgY2FsbGJhY2spIHtcbiAgaWYgKCF3aW4uREJVSVdlYkNvbXBvbmVudHMpIHtcbiAgICB3aW4uREJVSVdlYkNvbXBvbmVudHMgPSB7IHJlZ2lzdHJhdGlvbnM6IHt9IH07XG4gIH0gZWxzZSBpZiAoIXdpbi5EQlVJV2ViQ29tcG9uZW50cy5yZWdpc3RyYXRpb25zKSB7XG4gICAgd2luLkRCVUlXZWJDb21wb25lbnRzLnJlZ2lzdHJhdGlvbnMgPSB7fTtcbiAgfVxuXG4gIGxldCByZWdpc3RyYXRpb24gPSB3aW4uREJVSVdlYkNvbXBvbmVudHMucmVnaXN0cmF0aW9uc1tuYW1lXTtcblxuICBpZiAocmVnaXN0cmF0aW9uKSByZXR1cm4gcmVnaXN0cmF0aW9uO1xuXG4gIHJlZ2lzdHJhdGlvbiA9IGNhbGxiYWNrKCk7XG4gIHdpbi5EQlVJV2ViQ29tcG9uZW50cy5yZWdpc3RyYXRpb25zW25hbWVdID0gcmVnaXN0cmF0aW9uO1xuXG4gIHJldHVybiB3aW4uREJVSVdlYkNvbXBvbmVudHMucmVnaXN0cmF0aW9uc1tuYW1lXTtcbn1cblxuIiwiaW1wb3J0IGdldERCVUlsb2NhbGVTZXJ2aWNlIGZyb20gJy4vREJVSUxvY2FsZVNlcnZpY2UnO1xuaW1wb3J0IGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbiBmcm9tICcuLi9pbnRlcm5hbHMvZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uJztcblxuY29uc3QgZW1wdHlPYmogPSB7fTtcblxuY29uc3QgcmVnaXN0cmF0aW9uTmFtZSA9ICdEQlVJSTE4blNlcnZpY2UnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXREQlVJSTE4blNlcnZpY2Uod2luKSB7XG4gIGNvbnN0IGxvY2FsZVNlcnZpY2UgPSBnZXREQlVJbG9jYWxlU2VydmljZSh3aW4pO1xuICByZXR1cm4gZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uKHdpbiwgcmVnaXN0cmF0aW9uTmFtZSwgKCkgPT4ge1xuICAgIGNsYXNzIEkxOG5TZXJ2aWNlIHtcbiAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBsb2NhbGVTZXJ2aWNlLm9uTG9jYWxlQ2hhbmdlKHRoaXMuX2hhbmRsZUxvY2FsZUNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5fbG9jYWxlID0gbG9jYWxlU2VydmljZS5sb2NhbGU7XG4gICAgICAgIHRoaXMuX3RyYW5zbGF0aW9ucyA9IHt9O1xuICAgICAgfVxuXG4gICAgICBfaGFuZGxlTG9jYWxlQ2hhbmdlKGxvY2FsZSkge1xuICAgICAgICB0aGlzLl9sb2NhbGUgPSBsb2NhbGU7XG4gICAgICB9XG5cbiAgICAgIGNsZWFyVHJhbnNsYXRpb25zKGxhbmcpIHtcbiAgICAgICAgZGVsZXRlIHRoaXMuX3RyYW5zbGF0aW9uc1tsYW5nXTtcbiAgICAgIH1cblxuICAgICAgcmVnaXN0ZXJUcmFuc2xhdGlvbnModHJhbnNsYXRpb25zKSB7XG4gICAgICAgIHRoaXMuX3RyYW5zbGF0aW9ucyA9IE9iamVjdC5rZXlzKHRyYW5zbGF0aW9ucykucmVkdWNlKChhY2MsIGxhbmcpID0+IHtcbiAgICAgICAgICBhY2NbbGFuZ10gPSB7XG4gICAgICAgICAgICAuLi50aGlzLl90cmFuc2xhdGlvbnNbbGFuZ10sXG4gICAgICAgICAgICAuLi50cmFuc2xhdGlvbnNbbGFuZ11cbiAgICAgICAgICB9O1xuICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0sIHRoaXMuX3RyYW5zbGF0aW9ucyk7XG4gICAgICB9XG5cbiAgICAgIHRyYW5zbGF0ZShtc2cpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudExhbmdUcmFuc2xhdGlvbnNbbXNnXTtcbiAgICAgIH1cblxuICAgICAgZ2V0IHRyYW5zbGF0aW9ucygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zbGF0aW9ucztcbiAgICAgIH1cblxuICAgICAgZ2V0IGN1cnJlbnRMYW5nVHJhbnNsYXRpb25zKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdHJhbnNsYXRpb25zW3RoaXMuX2xvY2FsZS5sYW5nXSB8fCBlbXB0eU9iajtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBpMThuU2VydmljZSA9IG5ldyBJMThuU2VydmljZSgpO1xuICAgIHJldHVybiBpMThuU2VydmljZTtcbiAgfSk7XG59XG4iLCJcbmltcG9ydCBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24gZnJvbSAnLi4vaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbic7XG5cbmNvbnN0IGRlZmF1bHRMb2NhbGUgPSB7XG4gIGRpcjogJ2x0cicsXG4gIGxhbmc6ICdlbidcbn07XG5cbmNvbnN0IHJlZ2lzdHJhdGlvbk5hbWUgPSAnREJVSUxvY2FsZVNlcnZpY2UnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXREQlVJTG9jYWxlU2VydmljZSh3aW4pIHtcbiAgcmV0dXJuIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbih3aW4sIHJlZ2lzdHJhdGlvbk5hbWUsICgpID0+IHtcbiAgICBjbGFzcyBMb2NhbGVTZXJ2aWNlIHtcbiAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLl9jYWxsYmFja3MgPSBbXTtcbiAgICAgICAgdGhpcy5fbG9jYWxlQXR0cnMgPSBPYmplY3Qua2V5cyhkZWZhdWx0TG9jYWxlKTtcbiAgICAgICAgdGhpcy5fcm9vdEVsZW1lbnQgPSB3aW4uZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgICAgICB0aGlzLl9sb2NhbGVBdHRycy5mb3JFYWNoKChhdHRyKSA9PiB7XG4gICAgICAgICAgaWYgKCF0aGlzLl9yb290RWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cikpIHtcbiAgICAgICAgICAgIHRoaXMuX3Jvb3RFbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyLCBkZWZhdWx0TG9jYWxlW2F0dHJdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9sb2NhbGUgPSB0aGlzLl9sb2NhbGVBdHRycy5yZWR1Y2UoKGFjYywgYXR0cikgPT4ge1xuICAgICAgICAgIGFjY1thdHRyXSA9IHRoaXMuX3Jvb3RFbGVtZW50LmdldEF0dHJpYnV0ZShhdHRyKTtcbiAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICB9LCB7fSk7XG4gICAgICAgIHRoaXMuX29ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy5faGFuZGxlTXV0YXRpb25zLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLl9vYnNlcnZlci5vYnNlcnZlKHRoaXMuX3Jvb3RFbGVtZW50LCB7XG4gICAgICAgICAgYXR0cmlidXRlczogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgX2hhbmRsZU11dGF0aW9ucyhtdXRhdGlvbnMpIHtcbiAgICAgICAgbXV0YXRpb25zLmZvckVhY2goKG11dGF0aW9uKSA9PiB7XG4gICAgICAgICAgY29uc3QgbXV0YXRpb25BdHRyaWJ1dGVOYW1lID0gbXV0YXRpb24uYXR0cmlidXRlTmFtZTtcbiAgICAgICAgICBpZiAodGhpcy5fbG9jYWxlQXR0cnMuaW5jbHVkZXMobXV0YXRpb25BdHRyaWJ1dGVOYW1lKSkge1xuICAgICAgICAgICAgdGhpcy5fbG9jYWxlID0ge1xuICAgICAgICAgICAgICAuLi50aGlzLl9sb2NhbGUsXG4gICAgICAgICAgICAgIFttdXRhdGlvbkF0dHJpYnV0ZU5hbWVdOiB0aGlzLl9yb290RWxlbWVudC5nZXRBdHRyaWJ1dGUobXV0YXRpb25BdHRyaWJ1dGVOYW1lKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrcy5mb3JFYWNoKGNhbGxiYWNrID0+IGNhbGxiYWNrKHRoaXMuX2xvY2FsZSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHNldCBsb2NhbGUobG9jYWxlT2JqKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKGxvY2FsZU9iaikuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgdGhpcy5fcm9vdEVsZW1lbnQuc2V0QXR0cmlidXRlKGtleSwgbG9jYWxlT2JqW2tleV0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZ2V0IGxvY2FsZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvY2FsZTtcbiAgICAgIH1cblxuICAgICAgb25Mb2NhbGVDaGFuZ2UoY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuICAgICAgICBjYWxsYmFjayh0aGlzLmxvY2FsZSk7XG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzLmZpbHRlcihjYiA9PiBjYiAhPT0gY2FsbGJhY2spO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGxvY2FsZVNlcnZpY2UgPSBuZXcgTG9jYWxlU2VydmljZSgpO1xuICAgIHJldHVybiBsb2NhbGVTZXJ2aWNlO1xuICB9KTtcbn1cbiIsIi8qIGVzbGludCBwcmVmZXItY29uc3Q6IDAgKi9cblxuLyoqXG4gKlxuICogQHBhcmFtIG9wdGlvbnMgT2JqZWN0XG4gKiBAcmV0dXJucyBmdW5jdGlvbihTdHJpbmcpOiBTdHJpbmdcbiAqL1xuY29uc3QgZm9yY2VGbG9hdCA9ICh7IGRlY1BvaW50ID0gJy4nIH0gPSB7fSkgPT4gKHZhbHVlKSA9PiB7XG4gIGNvbnN0IEdMT0JBTF9ERUNfUE9JTlQgPSBuZXcgUmVnRXhwKGBcXFxcJHtkZWNQb2ludH1gLCAnZycpO1xuICBjb25zdCBHTE9CQUxfTk9OX05VTUJFUl9PUl9ERUNfUE9JTlQgPSBuZXcgUmVnRXhwKGBbXlxcXFxkJHtkZWNQb2ludH1dYCwgJ2cnKTtcbiAgY29uc3QgTlVNQkVSX0RFQ19QT0lOVF9PUl9TSE9SVENVVCA9IG5ldyBSZWdFeHAoYFtcXFxcZCR7ZGVjUG9pbnR9S2tNbV1gLCAnJyk7XG4gIGNvbnN0IE5VTUJFUl9PUl9TSUdOID0gbmV3IFJlZ0V4cCgnW1xcXFxkKy1dJywgJycpO1xuICBjb25zdCBTSUdOID0gbmV3IFJlZ0V4cCgnWystXScsICcnKTtcbiAgY29uc3QgU0hPUlRDVVQgPSBuZXcgUmVnRXhwKCdbS2tNbV0nLCAnJyk7XG4gIGNvbnN0IFNIT1JUQ1VUX1RIT1VTQU5EUyA9IG5ldyBSZWdFeHAoJ1tLa10nLCAnJyk7XG5cbiAgbGV0IHZhbHVlVG9Vc2UgPSB2YWx1ZTtcbiAgY29uc3QgaW5kZXhPZlBvaW50ID0gdmFsdWVUb1VzZS5pbmRleE9mKGRlY1BvaW50KTtcbiAgY29uc3QgbGFzdEluZGV4T2ZQb2ludCA9IHZhbHVlVG9Vc2UubGFzdEluZGV4T2YoZGVjUG9pbnQpO1xuICBjb25zdCBoYXNNb3JlVGhhbk9uZVBvaW50ID0gaW5kZXhPZlBvaW50ICE9PSBsYXN0SW5kZXhPZlBvaW50O1xuXG4gIGlmIChoYXNNb3JlVGhhbk9uZVBvaW50KSB7XG4gICAgdmFsdWVUb1VzZSA9IGAke3ZhbHVlVG9Vc2UucmVwbGFjZShHTE9CQUxfREVDX1BPSU5ULCAnJyl9JHtkZWNQb2ludH1gO1xuICB9XG5cbiAgbGV0IGZpcnN0Q2hhciA9IHZhbHVlVG9Vc2VbMF0gfHwgJyc7XG4gIGxldCBsYXN0Q2hhciA9ICh2YWx1ZVRvVXNlLmxlbmd0aCA+IDEgPyB2YWx1ZVRvVXNlW3ZhbHVlVG9Vc2UubGVuZ3RoIC0gMV0gOiAnJykgfHwgJyc7XG4gIGxldCBtaWRkbGVDaGFycyA9IHZhbHVlVG9Vc2Uuc3Vic3RyKDEsIHZhbHVlVG9Vc2UubGVuZ3RoIC0gMikgfHwgJyc7XG5cbiAgaWYgKCFmaXJzdENoYXIubWF0Y2goTlVNQkVSX09SX1NJR04pKSB7XG4gICAgZmlyc3RDaGFyID0gJyc7XG4gIH1cblxuICBtaWRkbGVDaGFycyA9IG1pZGRsZUNoYXJzLnJlcGxhY2UoR0xPQkFMX05PTl9OVU1CRVJfT1JfREVDX1BPSU5ULCAnJyk7XG5cbiAgaWYgKCFsYXN0Q2hhci5tYXRjaChOVU1CRVJfREVDX1BPSU5UX09SX1NIT1JUQ1VUKSkge1xuICAgIGxhc3RDaGFyID0gJyc7XG4gIH0gZWxzZSBpZiAobGFzdENoYXIubWF0Y2goU0hPUlRDVVQpKSB7XG4gICAgaWYgKG1pZGRsZUNoYXJzID09PSBkZWNQb2ludCkge1xuICAgICAgbWlkZGxlQ2hhcnMgPSAnJztcbiAgICB9IGVsc2UgaWYgKG1pZGRsZUNoYXJzID09PSAnJyAmJiBmaXJzdENoYXIubWF0Y2goU0lHTikpIHtcbiAgICAgIGxhc3RDaGFyID0gJyc7XG4gICAgfVxuICB9IGVsc2UgaWYgKGxhc3RDaGFyID09PSBkZWNQb2ludCAmJiBtaWRkbGVDaGFycyA9PT0gJycgJiYgZmlyc3RDaGFyLm1hdGNoKFNJR04pKSB7XG4gICAgbGFzdENoYXIgPSAnJztcbiAgfVxuXG4gIHZhbHVlVG9Vc2UgPSBbZmlyc3RDaGFyLCBtaWRkbGVDaGFycywgbGFzdENoYXJdLmpvaW4oJycpO1xuXG4gIGlmIChsYXN0Q2hhci5tYXRjaChTSE9SVENVVCkpIHtcbiAgICB2YWx1ZVRvVXNlID0gKFxuICAgICAgTnVtYmVyKGAke2ZpcnN0Q2hhcn0ke21pZGRsZUNoYXJzfWAucmVwbGFjZShkZWNQb2ludCwgJy4nKSkgKlxuICAgICAgKGxhc3RDaGFyLm1hdGNoKFNIT1JUQ1VUX1RIT1VTQU5EUykgPyAxMDAwIDogMTAwMDAwMClcbiAgICApLnRvU3RyaW5nKCkucmVwbGFjZSgnLicsIGRlY1BvaW50KTtcbiAgfVxuXG4gIHJldHVybiB2YWx1ZVRvVXNlO1xufTtcblxuLyoqXG4gKlxuICogQHBhcmFtIG9wdGlvbnMgT2JqZWN0XG4gKiBAcmV0dXJucyBmdW5jdGlvbihTdHJpbmcpOiBTdHJpbmdcbiAqL1xuY29uc3QgbnVtYmVyRm9ybWF0dGVyID0gKHsgZGVjUG9pbnQgPSAnLicsIHRob3VzYW5kc1NlcGFyYXRvciA9ICcsJyB9ID0ge30pID0+IHZhbHVlID0+IHtcbiAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKCcuJywgZGVjUG9pbnQpO1xuICBsZXQgZmlyc3RDaGFyID0gdmFsdWVbMF0gfHwgJyc7XG4gIGZpcnN0Q2hhciA9IFsnKycsICctJ10uaW5jbHVkZXMoZmlyc3RDaGFyKSA/IGZpcnN0Q2hhciA6ICcnO1xuICBjb25zdCBpc0Zsb2F0aW5nUG9pbnQgPSB2YWx1ZS5pbmRleE9mKGRlY1BvaW50KSAhPT0gLTE7XG4gIGxldCBbaW50ZWdlclBhcnQgPSAnJywgZGVjaW1hbHMgPSAnJ10gPSB2YWx1ZS5zcGxpdChkZWNQb2ludCk7XG4gIGludGVnZXJQYXJ0ID0gaW50ZWdlclBhcnQucmVwbGFjZSgvWystXS9nLCAnJyk7XG4gIGludGVnZXJQYXJ0ID0gaW50ZWdlclBhcnQucmVwbGFjZSgvXFxCKD89KFxcZHszfSkrKD8hXFxkKSkvZywgdGhvdXNhbmRzU2VwYXJhdG9yKTtcbiAgY29uc3QgcmV0ID0gYCR7Zmlyc3RDaGFyfSR7aW50ZWdlclBhcnR9JHtpc0Zsb2F0aW5nUG9pbnQgPyBkZWNQb2ludCA6ICcnfSR7ZGVjaW1hbHN9YDtcbiAgcmV0dXJuIHJldDtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZm9yY2VGbG9hdCxcbiAgbnVtYmVyRm9ybWF0dGVyXG59O1xuXG4iLCIvKiBlc2xpbnQgbm8tY29uc29sZTogMCAqL1xuXG5jb25zdCBidXR0b25IZWlnaHQgPSAnMjVweCc7XG5jb25zdCBidXR0b25TdGFydCA9ICc1cHgnO1xuY29uc3QgYnV0dG9uVG9wID0gJzVweCc7XG5cbmxldCBjb25zb2xlTWVzc2FnZXMgPSBbXTtcbmNvbnN0IGNvbnNvbGVMb2cgPSBjb25zb2xlLmxvZy5iaW5kKGNvbnNvbGUpO1xuY29uc3QgY29uc29sZU9yaWdpbmFsID0ge307XG5cbmZ1bmN0aW9uIGNhcHR1cmVDb25zb2xlKGNvbnNvbGVFbG0sIG9wdGlvbnMpIHtcbiAgY29uc3QgeyBpbmRlbnQgPSAyLCBzaG93TGFzdE9ubHkgPSBmYWxzZSB9ID0gb3B0aW9ucztcbiAgY29uc3QgaGFuZGxlciA9IGZ1bmN0aW9uIGhhbmRsZXIoYWN0aW9uLCAuLi5hcmdzKSB7XG4gICAgaWYgKHNob3dMYXN0T25seSkge1xuICAgICAgY29uc29sZU1lc3NhZ2VzID0gW3sgW2FjdGlvbl06IGFyZ3MgfV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGVNZXNzYWdlcy5wdXNoKHsgW2FjdGlvbl06IGFyZ3MgfSk7XG4gICAgfVxuXG4gICAgY29uc29sZUVsbS5pbm5lckhUTUwgPSBjb25zb2xlTWVzc2FnZXMubWFwKChlbnRyeSkgPT4ge1xuICAgICAgY29uc3QgYWN0aW9uID0gT2JqZWN0LmtleXMoZW50cnkpWzBdO1xuICAgICAgY29uc3QgdmFsdWVzID0gZW50cnlbYWN0aW9uXTtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSB2YWx1ZXMubWFwKChpdGVtKSA9PiB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgW3VuZGVmaW5lZCwgbnVsbF0uaW5jbHVkZXMoaXRlbSkgfHxcbiAgICAgICAgICBbJ251bWJlcicsICdzdHJpbmcnLCAnZnVuY3Rpb24nXS5pbmNsdWRlcyh0eXBlb2YgaXRlbSlcbiAgICAgICAgKSA/XG4gICAgICAgICAgaXRlbSA6XG4gICAgICAgICAgWydNYXAnLCAnU2V0J10uaW5jbHVkZXMoaXRlbS5jb25zdHJ1Y3Rvci5uYW1lKSA/XG4gICAgICAgICAgICBgJHtpdGVtLmNvbnN0cnVjdG9yLm5hbWV9ICgke0pTT04uc3RyaW5naWZ5KFsuLi5pdGVtXSl9KWAgOlxuICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoaXRlbSwgKGtleSwgdmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgaWYgKCh0eXBlb2YgdmFsdWUpID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfSwgaW5kZW50KTtcbiAgICAgIH0pLmpvaW4oJywgJyk7XG5cbiAgICAgIGNvbnN0IGNvbG9yID0ge1xuICAgICAgICBsb2c6ICcjMDAwJyxcbiAgICAgICAgd2FybjogJ29yYW5nZScsXG4gICAgICAgIGVycm9yOiAnZGFya3JlZCdcbiAgICAgIH1bYWN0aW9uXTtcblxuICAgICAgcmV0dXJuIGA8cHJlIHN0eWxlPVwiY29sb3I6ICR7Y29sb3J9XCI+JHttZXNzYWdlfTwvcHJlPmA7XG4gICAgfSkuam9pbignXFxuJyk7XG4gIH07XG4gIFsnbG9nJywgJ3dhcm4nLCAnZXJyb3InXS5mb3JFYWNoKChhY3Rpb24pID0+IHtcbiAgICBjb25zb2xlT3JpZ2luYWxbYWN0aW9uXSA9IGNvbnNvbGVbYWN0aW9uXTtcbiAgICBjb25zb2xlW2FjdGlvbl0gPSBoYW5kbGVyLmJpbmQoY29uc29sZSwgYWN0aW9uKTtcbiAgfSk7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIChldnQpID0+IHtcbiAgICAvLyBlc2xpbnQgbm8tY29uc29sZTogMFxuICAgIGNvbnNvbGUuZXJyb3IoYFwiJHtldnQubWVzc2FnZX1cIiBmcm9tICR7ZXZ0LmZpbGVuYW1lfToke2V2dC5saW5lbm99YCk7XG4gICAgY29uc29sZS5lcnJvcihldnQsIGV2dC5lcnJvci5zdGFjayk7XG4gICAgLy8gZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gIH0pO1xuICBjb25zb2xlTG9nKCdjb25zb2xlIGNhcHR1cmVkJyk7XG4gIHJldHVybiBmdW5jdGlvbiByZWxlYXNlQ29uc29sZSgpIHtcbiAgICBbJ2xvZycsICd3YXJuJywgJ2Vycm9yJ10uZm9yRWFjaCgoYWN0aW9uKSA9PiB7XG4gICAgICBjb25zb2xlW2FjdGlvbl0gPSBjb25zb2xlT3JpZ2luYWxbYWN0aW9uXTtcbiAgICB9KTtcbiAgICBjb25zb2xlTG9nKCdjb25zb2xlIHJlbGVhc2VkJyk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNvbnNvbGUoe1xuICBvcHRpb25zLFxuICBjb25zb2xlU3R5bGU6IHtcbiAgICBidG5TdGFydCA9IGJ1dHRvblN0YXJ0LCBidG5IZWlnaHQgPSBidXR0b25IZWlnaHQsXG4gICAgd2lkdGggPSBgY2FsYygxMDB2dyAtICR7YnRuU3RhcnR9IC0gMzBweClgLCBoZWlnaHQgPSAnNDAwcHgnLFxuICAgIGJhY2tncm91bmQgPSAncmdiYSgwLCAwLCAwLCAwLjUpJ1xuICB9XG59KSB7XG4gIGNvbnN0IHsgcnRsID0gZmFsc2UgfSA9IG9wdGlvbnM7XG4gIGNvbnN0IGNvbnNvbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgY29uc29sZS5pZCA9ICdEQlVJb25TY3JlZW5Db25zb2xlJztcbiAgY29uc29sZS5zdHlsZS5jc3NUZXh0ID0gYFxuICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIG1hcmdpbjogMHB4O1xuICAgIHBhZGRpbmc6IDVweDtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgb3ZlcmZsb3c6IGF1dG87XG4gICAgd2lkdGg6ICR7d2lkdGh9O1xuICAgIGhlaWdodDogJHtoZWlnaHR9O1xuICAgIHRvcDogJHtidG5IZWlnaHR9O1xuICAgICR7cnRsID8gJ3JpZ2h0JyA6ICdsZWZ0J306IDBweDtcbiAgICBiYWNrZ3JvdW5kOiAke2JhY2tncm91bmR9O1xuICAgIHotaW5kZXg6IDk5OTk7XG4gICAgLXdlYmtpdC1vdmVyZmxvdy1zY3JvbGxpbmc6IHRvdWNoXG4gICAgYDtcbiAgcmV0dXJuIGNvbnNvbGU7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUJ1dHRvbih7XG4gIG9wdGlvbnMsXG4gIGJ1dHRvblN0eWxlOiB7XG4gICAgcG9zaXRpb24gPSAnZml4ZWQnLFxuICAgIHdpZHRoID0gJzI1cHgnLCBoZWlnaHQgPSBidXR0b25IZWlnaHQsIHRvcCA9IGJ1dHRvblRvcCwgc3RhcnQgPSBidXR0b25TdGFydCxcbiAgICBiYWNrZ3JvdW5kID0gJ3JnYmEoMCwgMCwgMCwgMC41KSdcbiAgfVxufSkge1xuICBjb25zdCB7IHJ0bCA9IGZhbHNlIH0gPSBvcHRpb25zO1xuICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgYnV0dG9uLmlkID0gJ0RCVUlvblNjcmVlbkNvbnNvbGVUb2dnbGVyJztcbiAgYnV0dG9uLnN0eWxlLmNzc1RleHQgPSBgXG4gICAgcG9zaXRpb246ICR7cG9zaXRpb259O1xuICAgIHdpZHRoOiAke3dpZHRofTtcbiAgICBoZWlnaHQ6ICR7aGVpZ2h0fTtcbiAgICB0b3A6ICR7dG9wfTtcbiAgICAke3J0bCA/ICdyaWdodCcgOiAnbGVmdCd9OiAke3N0YXJ0fTtcbiAgICBiYWNrZ3JvdW5kOiAke2JhY2tncm91bmR9O1xuICAgIHotaW5kZXg6IDk5OTk7XG4gICAgYDtcbiAgcmV0dXJuIGJ1dHRvbjtcbn1cblxuLyoqXG5vblNjcmVlbkNvbnNvbGUoe1xuICBidXR0b25TdHlsZSA9IHsgcG9zaXRpb24sIHdpZHRoLCBoZWlnaHQsIHRvcCwgc3RhcnQsIGJhY2tncm91bmQgfSxcbiAgY29uc29sZVN0eWxlID0geyB3aWR0aCwgaGVpZ2h0LCBiYWNrZ3JvdW5kIH0sXG4gIG9wdGlvbnMgPSB7IHJ0bDogZmFsc2UsIGluZGVudCwgc2hvd0xhc3RPbmx5IH1cbn0pXG4qL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gb25TY3JlZW5Db25zb2xlKHtcbiAgYnV0dG9uU3R5bGUgPSB7fSxcbiAgY29uc29sZVN0eWxlID0ge30sXG4gIG9wdGlvbnMgPSB7fVxufSA9IHt9KSB7XG4gIGNvbnN0IGJ1dHRvbiA9IGNyZWF0ZUJ1dHRvbih7XG4gICAgb3B0aW9ucyxcbiAgICBidXR0b25TdHlsZVxuICB9KTtcbiAgY29uc3QgY29uc29sZSA9IGNyZWF0ZUNvbnNvbGUoe1xuICAgIGNvbnNvbGVTdHlsZToge1xuICAgICAgLi4uY29uc29sZVN0eWxlLFxuICAgICAgYnRuSGVpZ2h0OiBidXR0b25TdHlsZS5oZWlnaHQsXG4gICAgICBidG5TdGFydDogYnV0dG9uU3R5bGUuc3RhcnRcbiAgICB9LFxuICAgIG9wdGlvbnNcbiAgfSk7XG5cbiAgY29uc29sZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgfSk7XG5cbiAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGlmICghYnV0dG9uLmNvbnRhaW5zKGNvbnNvbGUpKSB7XG4gICAgICBidXR0b24uYXBwZW5kQ2hpbGQoY29uc29sZSk7XG4gICAgICBjb25zb2xlLnNjcm9sbFRvcCA9IGNvbnNvbGUuc2Nyb2xsSGVpZ2h0IC0gY29uc29sZS5jbGllbnRIZWlnaHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJ1dHRvbi5yZW1vdmVDaGlsZChjb25zb2xlKTtcbiAgICB9XG4gIH0pO1xuXG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcbiAgY29uc3QgcmVsZWFzZUNvbnNvbGUgPSBjYXB0dXJlQ29uc29sZShjb25zb2xlLCBvcHRpb25zKTtcblxuICByZXR1cm4gZnVuY3Rpb24gcmVsZWFzZSgpIHtcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGJ1dHRvbik7XG4gICAgcmVsZWFzZUNvbnNvbGUoKTtcbiAgfTtcbn1cbiIsIlxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdGVtcGxhdGUoc3RyaW5ncywgLi4ua2V5cykge1xuICByZXR1cm4gKCguLi52YWx1ZXMpID0+IHtcbiAgICBjb25zdCBkaWN0ID0gdmFsdWVzW3ZhbHVlcy5sZW5ndGggLSAxXSB8fCB7fTtcbiAgICBjb25zdCByZXN1bHQgPSBbc3RyaW5nc1swXV07XG4gICAga2V5cy5mb3JFYWNoKChrZXksIGkpID0+IHtcbiAgICAgIGNvbnN0IHZhbHVlID0gTnVtYmVyLmlzSW50ZWdlcihrZXkpID8gdmFsdWVzW2tleV0gOiBkaWN0W2tleV07XG4gICAgICByZXN1bHQucHVzaCh2YWx1ZSwgc3RyaW5nc1tpICsgMV0pO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQuam9pbignJyk7XG4gIH0pO1xufVxuIiwiXG4vLyBodHRwOi8vcmFnYW53YWxkLmNvbS8yMDE1LzEyLzMxL3RoaXMtaXMtbm90LWFuLWVzc2F5LWFib3V0LXRyYWl0cy1pbi1qYXZhc2NyaXB0Lmh0bWxcblxuLypcblxuY2xhc3MgQSB7XG4gIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICB0aGlzLmluaXQoLi4uYXJncyk7XG4gIH1cbn1cblxuY2xhc3MgQiBleHRlbmRzIEEge1xuICBpbml0KHgpIHtcbiAgICB0aGlzLl94ID0geDtcbiAgfVxuICBnZXRYKCkge1xuICAgIHJldHVybiB0aGlzLl94O1xuICB9XG4gIHNldFgodmFsdWUpIHtcbiAgICB0aGlzLl94ID0gdmFsdWU7XG4gIH1cbiAgZ2V0IHgoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3g7XG4gIH1cbiAgc2V0IHgodmFsdWUpIHtcbiAgICB0aGlzLl94ID0gdmFsdWU7XG4gIH1cbn1cblxuZnVuY3Rpb24gd2l0aERvdWJsZVgoa2xhc3MpIHtcbiAgcmV0dXJuIE92ZXJyaWRlT3JEZWZpbmUoe1xuXG4gICAgLy8gb3ZlcnJpZGVzXG4gICAgaW5pdChvcmlnaW5hbEluaXQsIHgsIHkpIHtcbiAgICAgIG9yaWdpbmFsSW5pdCh4KTtcbiAgICAgIHRoaXMuX3kgPSB5O1xuICAgIH0sXG4gICAgZ2V0WChvcmlnaW5hbEdldFgpIHtcbiAgICAgIHJldHVybiBvcmlnaW5hbEdldFgoKSAqIDI7XG4gICAgfSxcbiAgICBzZXRYKG9yaWdpbmFsU2V0WCwgdmFsdWUpIHtcbiAgICAgIC8vIHRoaXMuX3ggPSB2YWx1ZSAqIDI7XG4gICAgICBvcmlnaW5hbFNldFgodmFsdWUgKiAyKTtcbiAgICB9LFxuICAgIGdldCB4KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3ggKiAyO1xuICAgIH0sXG4gICAgc2V0IHgodmFsdWUpIHtcbiAgICAgIHRoaXMuX3ggPSB2YWx1ZSAqIDI7XG4gICAgfSxcblxuICAgIC8vIG5ldyBkZWZpbml0aW9uc1xuICAgIHNldCB5KHZhbHVlKSB7XG4gICAgICB0aGlzLl95ID0gdmFsdWUgKiAyO1xuICAgIH0sXG4gICAgZ2V0IHkoKSB7XG4gICAgICByZXR1cm4gdGhpcy5feSAqIDI7XG4gICAgfSxcbiAgICBoZWxsbygpIHtcbiAgICAgIHJldHVybiBgaGVsbG8gJHt0aGlzLl94fSBhbmQgJHt0aGlzLnl9YDtcbiAgICB9XG4gIH0pKGtsYXNzKTtcbn1cblxuQiA9IHdpdGhEb3VibGVYKEIpO1xuXG5jb25zdCBiID0gbmV3IEIoMiwgNSk7XG5jb25zb2xlLmxvZyhiLngpOyAvLyA0XG5jb25zb2xlLmxvZyhiLmdldFgoKSk7IC8vIDRcblxuYi5zZXRYKDMpO1xuLy8gYi54ID0gMztcbmNvbnNvbGUubG9nKGIueCk7IC8vIDEyXG5jb25zb2xlLmxvZyhiLmdldFgoKSk7IC8vIDEyXG5cbi8vIG5ld1xuY29uc29sZS5sb2coYi55KTsgLy8gMTBcbmIueSA9IDk7XG5jb25zb2xlLmxvZyhiLmhlbGxvKCkpOyAvLyBoZWxsbyA2IGFuZCAzNlxuXG4qL1xuXG5mdW5jdGlvbiBPdmVycmlkZU9yRGVmaW5lKGJlaGF2aW91cikge1xuICBjb25zdCBpbnN0YW5jZUtleXMgPSBSZWZsZWN0Lm93bktleXMoYmVoYXZpb3VyKTtcblxuICByZXR1cm4gZnVuY3Rpb24gZGVmaW5lKGtsYXNzKSB7XG4gICAgaW5zdGFuY2VLZXlzLmZvckVhY2goKHByb3BlcnR5KSA9PiB7XG5cbiAgICAgIGNvbnN0IG5ld1Byb3BlcnR5RGVzY3JpcHRvciA9XG4gICAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoYmVoYXZpb3VyLCBwcm9wZXJ0eSk7XG4gICAgICBjb25zdCBvcmlnaW5hbFByb3BlcnR5RGVzY3JpcHRvciA9XG4gICAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioa2xhc3MucHJvdG90eXBlLCBwcm9wZXJ0eSk7XG5cbiAgICAgIGNvbnN0IHtcbiAgICAgICAgdmFsdWU6IG5ld1ZhbHVlLFxuICAgICAgICBnZXQ6IG5ld0dldHRlcixcbiAgICAgICAgc2V0OiBuZXdTZXR0ZXJcbiAgICAgIH0gPSBuZXdQcm9wZXJ0eURlc2NyaXB0b3I7XG5cbiAgICAgIGlmICghb3JpZ2luYWxQcm9wZXJ0eURlc2NyaXB0b3IpIHtcbiAgICAgICAgaWYgKG5ld1ZhbHVlKSB7XG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGtsYXNzLnByb3RvdHlwZSwgcHJvcGVydHksIHtcbiAgICAgICAgICAgIHZhbHVlOiBuZXdWYWx1ZSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGtsYXNzLnByb3RvdHlwZSwgcHJvcGVydHksIHtcbiAgICAgICAgICAgIGdldDogbmV3R2V0dGVyLFxuICAgICAgICAgICAgc2V0OiBuZXdTZXR0ZXIsXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3Qge1xuICAgICAgICAgIHZhbHVlOiBvcmlnaW5hbFZhbHVlLFxuICAgICAgICAgIHdyaXRhYmxlOiBvcmlnaW5hbFdyaXRhYmxlLFxuICAgICAgICAgIGdldDogb3JpZ2luYWxHZXR0ZXIsXG4gICAgICAgICAgc2V0OiBvcmlnaW5hbFNldHRlcixcbiAgICAgICAgICBlbnVtZXJhYmxlOiBvcmlnaW5hbEVudW1lcmFibGUsXG4gICAgICAgICAgY29uZmlndXJhYmxlOiBvcmlnaW5hbENvbmZpZ3VyYWJsZVxuICAgICAgICB9ID0gb3JpZ2luYWxQcm9wZXJ0eURlc2NyaXB0b3I7XG5cbiAgICAgICAgaWYgKG5ld1ZhbHVlKSB7XG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGtsYXNzLnByb3RvdHlwZSwgcHJvcGVydHksIHtcbiAgICAgICAgICAgIHZhbHVlKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgICAgY29uc3QgYm91bmRlZFZhbHVlID0gb3JpZ2luYWxWYWx1ZS5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgICByZXR1cm4gbmV3VmFsdWUuY2FsbCh0aGlzLCBib3VuZGVkVmFsdWUsIC4uLmFyZ3MpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiBvcmlnaW5hbFdyaXRhYmxlLFxuICAgICAgICAgICAgZW51bWVyYWJsZTogb3JpZ2luYWxFbnVtZXJhYmxlLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiBvcmlnaW5hbENvbmZpZ3VyYWJsZSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoa2xhc3MucHJvdG90eXBlLCBwcm9wZXJ0eSwge1xuICAgICAgICAgICAgZ2V0OiBuZXdHZXR0ZXIgfHwgb3JpZ2luYWxHZXR0ZXIsXG4gICAgICAgICAgICBzZXQ6IG5ld1NldHRlciB8fCBvcmlnaW5hbFNldHRlcixcbiAgICAgICAgICAgIGVudW1lcmFibGU6IG9yaWdpbmFsRW51bWVyYWJsZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogb3JpZ2luYWxDb25maWd1cmFibGUsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4ga2xhc3M7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IE92ZXJyaWRlT3JEZWZpbmU7XG4iLCJcbi8vIEhlbHBlcnNcbmltcG9ydCBkYnVpV2ViQ29tcG9uZW50c1NldFVwIGZyb20gJy4vaGVscGVycy9kYnVpV2ViQ29tcG9uZW50c1NldHVwJztcblxuLy8gSW50ZXJuYWxzXG5pbXBvcnQgZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uIGZyb20gJy4vaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbic7XG5cbi8vIENvbXBvbmVudEJhc2VcbmltcG9ydCBnZXREQlVJV2ViQ29tcG9uZW50QmFzZSBmcm9tICcuL2NvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudEJhc2UvREJVSVdlYkNvbXBvbmVudEJhc2UnO1xuXG4vLyBCZWhhdmlvdXJzXG5pbXBvcnQgRm9jdXNhYmxlIGZyb20gJy4vYmVoYXZpb3Vycy9Gb2N1c2FibGUnO1xuXG4vLyBTZXJ2aWNlc1xuaW1wb3J0IGdldERCVUlMb2NhbGVTZXJ2aWNlIGZyb20gJy4vc2VydmljZXMvREJVSUxvY2FsZVNlcnZpY2UnO1xuaW1wb3J0IGdldERCVUlJMThuU2VydmljZSBmcm9tICcuL3NlcnZpY2VzL0RCVUlJMThuU2VydmljZSc7XG5cbi8vIFV0aWxzXG5pbXBvcnQgZm9ybWF0dGVycyBmcm9tICcuL3V0aWxzL2Zvcm1hdHRlcnMnO1xuaW1wb3J0IHRyYWl0cyBmcm9tICcuL3V0aWxzL3RyYWl0cyc7XG5pbXBvcnQgdGVtcGxhdGUgZnJvbSAnLi91dGlscy90ZW1wbGF0ZSc7XG5pbXBvcnQgb25TY3JlZW5Db25zb2xlIGZyb20gJy4vdXRpbHMvb25TY3JlZW5Db25zb2xlJztcblxuLy8gQ29tcG9uZW50c1xuaW1wb3J0IGdldERCVUlXZWJDb21wb25lbnREdW1teSBmcm9tICcuL2NvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudER1bW15L0RCVUlXZWJDb21wb25lbnREdW1teSc7XG5pbXBvcnQgZ2V0REJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50IGZyb20gJy4vY29tcG9uZW50cy9EQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQvREJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50JztcbmltcG9ydCBnZXREQlVJV2ViQ29tcG9uZW50Rm9ybUlucHV0VGV4dCBmcm9tICcuL2NvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudEZvcm1JbnB1dFRleHQvREJVSVdlYkNvbXBvbmVudEZvcm1JbnB1dFRleHQnO1xuaW1wb3J0IGdldERCVUlXZWJDb21wb25lbnRJY29uIGZyb20gJy4vY29tcG9uZW50cy9EQlVJV2ViQ29tcG9uZW50SWNvbi9EQlVJV2ViQ29tcG9uZW50SWNvbic7XG5cbmNvbnN0IHJlZ2lzdHJhdGlvbnMgPSB7XG4gIFtnZXREQlVJV2ViQ29tcG9uZW50RHVtbXkucmVnaXN0cmF0aW9uTmFtZV06XG4gICAgZ2V0REJVSVdlYkNvbXBvbmVudER1bW15LFxuICBbZ2V0REJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50LnJlZ2lzdHJhdGlvbk5hbWVdOlxuICAgIGdldERCVUlXZWJDb21wb25lbnREdW1teVBhcmVudCxcbiAgW2dldERCVUlXZWJDb21wb25lbnRGb3JtSW5wdXRUZXh0LnJlZ2lzdHJhdGlvbk5hbWVdOlxuICAgIGdldERCVUlXZWJDb21wb25lbnRGb3JtSW5wdXRUZXh0LFxuICBbZ2V0REJVSVdlYkNvbXBvbmVudEljb24ucmVnaXN0cmF0aW9uTmFtZV06XG4gICAgZ2V0REJVSVdlYkNvbXBvbmVudEljb25cbn07XG5cbi8qXG5UaGlzIGhlbHBlciBmdW5jdGlvbiBpcyBqdXN0IGZvciBjb252ZW5pZW5jZS5cblVzaW5nIGl0IGltcGxpZXMgdGhhdCBlbnRpcmUgREJVSVdlYkNvbXBvbmVudHMgbGlicmFyeSBpcyBhbHJlYWR5IGxvYWRlZC5cbkl0IGlzIHVzZWZ1bCBlc3BlY2lhbGx5IHdoZW4gd29ya2luZyB3aXRoIGRpc3RyaWJ1dGlvbiBidWlsZC5cbklmIG9uZSB3YW50cyB0byBsb2FkIGp1c3Qgb25lIHdlYi1jb21wb25lbnQgb3IgYSBzdWJzZXQgb2Ygd2ViLWNvbXBvbmVudHNcbnRoZXkgc2hvdWxkIGJlIGxvYWRlZCBmcm9tIG5vZGVfbW9kdWxlcy9kZXYtYm94LXVpL3dlYi1jb21wb25lbnRzIGJ5IHRoZWlyIHBhdGhcbmV4OlxuaW1wb3J0IFNvbWVDb21wb25lbnRMb2FkZXIgZnJvbSBub2RlX21vZHVsZXMvZGV2LWJveC11aS93ZWItY29tcG9uZW50cy9wYXRoL3RvL1NvbWVDb21wb25lbnQ7XG4qL1xuZnVuY3Rpb24gcXVpY2tTZXR1cEFuZExvYWQod2luID0gd2luZG93KSB7XG4gIC8qKlxuICAgKiBAcGFyYW0gY29tcG9uZW50cyBPYmplY3Qge1xuICAgKiAgcmVnaXN0cmF0aW9uTmFtZSxcbiAgICogIGNvbXBvbmVudFN0eWxlXG4gICAqIH1cbiAgICogQHJldHVybiBPYmplY3QgeyA8cmVnaXN0cmF0aW9uTmFtZT4sIDxjb21wb25lbnRDbGFzcz4gfVxuICAgKi9cbiAgcmV0dXJuIGZ1bmN0aW9uIChjb21wb25lbnRzKSB7XG4gICAgcmV0dXJuIGRidWlXZWJDb21wb25lbnRzU2V0VXAod2luKShjb21wb25lbnRzKVxuICAgICAgLnJlZHVjZSgoYWNjLCB7IHJlZ2lzdHJhdGlvbk5hbWUgfSkgPT4ge1xuICAgICAgICBjb25zdCBjb21wb25lbnRDbGFzcyA9IHJlZ2lzdHJhdGlvbnNbcmVnaXN0cmF0aW9uTmFtZV0od2luZG93KTtcbiAgICAgICAgY29tcG9uZW50Q2xhc3MucmVnaXN0ZXJTZWxmKCk7XG4gICAgICAgIGFjY1tyZWdpc3RyYXRpb25OYW1lXSA9IGNvbXBvbmVudENsYXNzO1xuICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgfSwge30pO1xuICB9O1xufVxuXG5leHBvcnQge1xuICByZWdpc3RyYXRpb25zLFxuXG4gIC8vIEhlbHBlcnNcbiAgcXVpY2tTZXR1cEFuZExvYWQsXG4gIGRidWlXZWJDb21wb25lbnRzU2V0VXAsXG5cbiAgLy8gSW50ZXJuYWxzXG4gIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbixcblxuICAvLyBDb21wb25lbnRCYXNlXG4gIGdldERCVUlXZWJDb21wb25lbnRCYXNlLFxuXG4gIC8vIEJlaGF2aW91cnNcbiAgRm9jdXNhYmxlLFxuXG4gIC8vIFNlcnZpY2VzXG4gIGdldERCVUlMb2NhbGVTZXJ2aWNlLFxuICBnZXREQlVJSTE4blNlcnZpY2UsXG5cbiAgLy8gVXRpbHNcbiAgZm9ybWF0dGVycyxcbiAgdHJhaXRzLFxuICB0ZW1wbGF0ZSxcbiAgb25TY3JlZW5Db25zb2xlLFxuXG4gIC8vIENvbXBvbmVudHNcbiAgZ2V0REJVSVdlYkNvbXBvbmVudER1bW15LFxuICBnZXREQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQsXG4gIGdldERCVUlXZWJDb21wb25lbnRGb3JtSW5wdXRUZXh0LFxuICBnZXREQlVJV2ViQ29tcG9uZW50SWNvblxufTtcblxuLyogZXNsaW50IG5vLWNvbnNvbGU6IDAgKi9cblxubGV0IGJ1aWxkID0gJ3Byb2R1Y3Rpb24nO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICBidWlsZCA9ICdkZXZlbG9wJztcbn1cblxuY29uc29sZS5sb2coYFVzaW5nIERCVUlXZWJDb21wb25lbnRzRGlzdExpYiAke2J1aWxkfSBidWlsZC5gKTtcblxuIl19
