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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwic3JjL2xpYi93ZWItY29tcG9uZW50cy9iZWhhdmlvdXJzL0ZvY3VzYWJsZS5qcyIsInNyYy9saWIvd2ViLWNvbXBvbmVudHMvY29tcG9uZW50cy9EQlVJV2ViQ29tcG9uZW50QmFzZS9EQlVJV2ViQ29tcG9uZW50QmFzZS5qcyIsInNyYy9saWIvd2ViLWNvbXBvbmVudHMvY29tcG9uZW50cy9EQlVJV2ViQ29tcG9uZW50RHVtbXkvREJVSVdlYkNvbXBvbmVudER1bW15LmpzIiwic3JjL2xpYi93ZWItY29tcG9uZW50cy9jb21wb25lbnRzL0RCVUlXZWJDb21wb25lbnREdW1teVBhcmVudC9EQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQuanMiLCJzcmMvbGliL3dlYi1jb21wb25lbnRzL2NvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudEZvcm1JbnB1dFRleHQvREJVSVdlYkNvbXBvbmVudEZvcm1JbnB1dFRleHQuanMiLCJzcmMvbGliL3dlYi1jb21wb25lbnRzL2NvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudEljb24vREJVSVdlYkNvbXBvbmVudEljb24uanMiLCJzcmMvbGliL3dlYi1jb21wb25lbnRzL2hlbHBlcnMvZGJ1aVdlYkNvbXBvbmVudHNTZXR1cC5qcyIsInNyYy9saWIvd2ViLWNvbXBvbmVudHMvaW50ZXJuYWxzL2FwcGVuZFN0eWxlcy5qcyIsInNyYy9saWIvd2ViLWNvbXBvbmVudHMvaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbi5qcyIsInNyYy9saWIvd2ViLWNvbXBvbmVudHMvc2VydmljZXMvREJVSUkxOG5TZXJ2aWNlLmpzIiwic3JjL2xpYi93ZWItY29tcG9uZW50cy9zZXJ2aWNlcy9EQlVJTG9jYWxlU2VydmljZS5qcyIsInNyYy9saWIvd2ViLWNvbXBvbmVudHMvdXRpbHMvZm9ybWF0dGVycy5qcyIsInNyYy9saWIvd2ViLWNvbXBvbmVudHMvdXRpbHMvb25TY3JlZW5Db25zb2xlLmpzIiwic3JjL2xpYi93ZWItY29tcG9uZW50cy91dGlscy90ZW1wbGF0ZS5qcyIsInNyYy9saWIvd2ViLWNvbXBvbmVudHMvdXRpbHMvdHJhaXRzLmpzIiwic3JjL2xpYi9zcmMvbGliL3dlYi1jb21wb25lbnRzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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Q0EsOEI7UUFDQSxnQztRQUNBLHVCOztBQUdGOztBQUVBLElBQUksUUFBUSxZQUFaOztBQUVBLElBQUksUUFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUE3QixFQUEyQztBQUN6QyxVQUFRLFNBQVI7QUFDRDs7QUFFRCxRQUFRLEdBQVIsQ0FBYSxrQ0FBaUMsS0FBTSxTQUFwRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiXG5jb25zdCByZWFkT25seVByb3BlcnRpZXMgPSBbJ2ZvY3VzZWQnXTtcblxuY29uc3QgRVJST1JfTUVTU0FHRVMgPSB7XG4gIGZvY3VzZWQ6IGAnZm9jdXNlZCcgcHJvcGVydHkgaXMgcmVhZC1vbmx5IGFzIGl0IGlzIGNvbnRyb2xsZWQgYnkgdGhlIGNvbXBvbmVudC5cbklmIHlvdSB3YW50IHRvIHNldCBmb2N1cyBwcm9ncmFtbWF0aWNhbGx5IGNhbGwgLmZvY3VzKCkgbWV0aG9kIG9uIGNvbXBvbmVudC5cbmBcbn07XG5cbi8qKlxuICogV2hlbiBhbiBpbm5lciBmb2N1c2FibGUgaXMgZm9jdXNlZCAoZXg6IHZpYSBjbGljaykgdGhlIGVudGlyZSBjb21wb25lbnQgZ2V0cyBmb2N1c2VkLlxuICogV2hlbiB0aGUgY29tcG9uZW50IGdldHMgZm9jdXNlZCAoZXg6IHZpYSB0YWIpIHRoZSBmaXJzdCBpbm5lciBmb2N1c2FibGUgZ2V0cyBmb2N1c2VkIHRvby5cbiAqIFdoZW4gdGhlIGNvbXBvbmVudCBnZXRzIGRpc2FibGVkIGl0IGdldHMgYmx1cnJlZCB0b28gYW5kIGFsbCBpbm5lciBmb2N1c2FibGVzIGdldCBkaXNhYmxlZCBhbmQgYmx1cnJlZC5cbiAqIFdoZW4gZGlzYWJsZWQgdGhlIGNvbXBvbmVudCBjYW5ub3QgYmUgZm9jdXNlZC5cbiAqIFdoZW4gZW5hYmxlZCB0aGUgY29tcG9uZW50IGNhbiBiZSBmb2N1c2VkLlxuICogQHBhcmFtIEtsYXNzXG4gKiBAcmV0dXJucyB7Rm9jdXNhYmxlfVxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEZvY3VzYWJsZShLbGFzcykge1xuXG4gIEtsYXNzLmNvbXBvbmVudFN0eWxlICs9IGBcbiAgOmhvc3QoW2Rpc2FibGVkXSkge1xuICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgb3BhY2l0eTogMC41O1xuICAgIFxuICAgIC13ZWJraXQtdG91Y2gtY2FsbG91dDogbm9uZTtcbiAgICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1xuICAgIC1raHRtbC11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAtbW96LXVzZXItc2VsZWN0OiBub25lO1xuICAgIC1tcy11c2VyLXNlbGVjdDogbm9uZTtcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgfVxuICBcbiAgOmhvc3QoW2Rpc2FibGVkXSkgKiB7XG4gICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gIH1cbiAgYDtcblxuICBjbGFzcyBGb2N1c2FibGUgZXh0ZW5kcyBLbGFzcyB7XG5cbiAgICBzdGF0aWMgZ2V0IG5hbWUoKSB7XG4gICAgICByZXR1cm4gc3VwZXIubmFtZTtcbiAgICB9XG5cbiAgICBnZXQgaW5zdGFuY2VQcm9wZXJ0aWVzVG9EZWZpbmUoKSB7XG4gICAgICBjb25zdCBpbmhlcml0ZWRJbnN0YW5jZVByb3BlcnRpZXNUb0RlZmluZSA9XG4gICAgICAgIHN1cGVyLmluc3RhbmNlUHJvcGVydGllc1RvRGVmaW5lIHx8IHt9O1xuICAgICAgY29uc3QgbmV3SW5zdGFuY2VQcm9wZXJ0aWVzVG9EZWZpbmUgPSB7fTtcbiAgICAgIGlmICghdGhpcy5kaXNhYmxlZCkge1xuICAgICAgICAvLyB0YWJpbmRleCBkZWZpbmVzIGZvY3VzYWJsZSBiZWhhdmlvdXJcbiAgICAgICAgbmV3SW5zdGFuY2VQcm9wZXJ0aWVzVG9EZWZpbmUudGFiaW5kZXggPSAwO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uaW5oZXJpdGVkSW5zdGFuY2VQcm9wZXJ0aWVzVG9EZWZpbmUsXG4gICAgICAgIC4uLm5ld0luc3RhbmNlUHJvcGVydGllc1RvRGVmaW5lXG4gICAgICB9O1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXQgcHJvcGVydGllc1RvVXBncmFkZSgpIHtcbiAgICAgIGNvbnN0IGluaGVyaXRlZFByb3BlcnRpZXNUb1VwZ3JhZGUgPSBzdXBlci5wcm9wZXJ0aWVzVG9VcGdyYWRlIHx8IFtdO1xuICAgICAgLy8gVGhlIHJlYXNvbiBmb3IgdXBncmFkaW5nICdmb2N1c2VkJyBpcyBvbmx5IHRvIHNob3cgYW4gd2FybmluZ1xuICAgICAgLy8gaWYgdGhlIGNvbnN1bWVyIG9mIHRoZSBjb21wb25lbnQgYXR0ZW1wdGVkIHRvIHNldCBmb2N1cyBwcm9wZXJ0eVxuICAgICAgLy8gd2hpY2ggaXMgcmVhZC1vbmx5LlxuICAgICAgcmV0dXJuIFsuLi5pbmhlcml0ZWRQcm9wZXJ0aWVzVG9VcGdyYWRlLCAnZm9jdXNlZCcsICdkaXNhYmxlZCddO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCkge1xuICAgICAgY29uc3QgaW5oZXJpdGVkT2JzZXJ2ZWRBdHRyaWJ1dGVzID0gc3VwZXIub2JzZXJ2ZWRBdHRyaWJ1dGVzIHx8IFtdO1xuICAgICAgcmV0dXJuIFsuLi5pbmhlcml0ZWRPYnNlcnZlZEF0dHJpYnV0ZXMsICdkaXNhYmxlZCddO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICAgIHN1cGVyKC4uLmFyZ3MpO1xuXG4gICAgICB0aGlzLl9jdXJyZW50SW5uZXJGb2N1c2VkID0gbnVsbDtcbiAgICAgIHRoaXMuX29uSW5uZXJGb2N1c2FibGVGb2N1c2VkID0gdGhpcy5fb25Jbm5lckZvY3VzYWJsZUZvY3VzZWQuYmluZCh0aGlzKTtcbiAgICAgIHRoaXMuX29uRm9jdXMgPSB0aGlzLl9vbkZvY3VzLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLl9vbkJsdXIgPSB0aGlzLl9vbkJsdXIuYmluZCh0aGlzKTtcbiAgICB9XG5cbiAgICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlKSB7XG4gICAgICBzdXBlci5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sgJiZcbiAgICAgICAgc3VwZXIuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSk7XG5cbiAgICAgIGNvbnN0IGhhc1ZhbHVlID0gbmV3VmFsdWUgIT09IG51bGw7XG4gICAgICBpZiAobmFtZSA9PT0gJ2Rpc2FibGVkJykge1xuICAgICAgICBoYXNWYWx1ZSA/IHRoaXMuX2FwcGx5RGlzYWJsZWRTaWRlRWZmZWN0cygpIDogdGhpcy5fYXBwbHlFbmFibGVkU2lkZUVmZmVjdHMoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgIHN1cGVyLmNvbm5lY3RlZENhbGxiYWNrICYmXG4gICAgICAgIHN1cGVyLmNvbm5lY3RlZENhbGxiYWNrKCk7XG5cbiAgICAgIHJlYWRPbmx5UHJvcGVydGllcy5mb3JFYWNoKChyZWFkT25seVByb3BlcnR5KSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmhhc0F0dHJpYnV0ZShyZWFkT25seVByb3BlcnR5KSkge1xuICAgICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKHJlYWRPbmx5UHJvcGVydHkpO1xuICAgICAgICAgIGNvbnNvbGUud2FybihFUlJPUl9NRVNTQUdFU1tyZWFkT25seVByb3BlcnR5XSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvLyB3aGVuIGNvbXBvbmVudCBmb2N1c2VkL2JsdXJyZWRcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCB0aGlzLl9vbkZvY3VzKTtcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMuX29uQmx1cik7XG5cbiAgICAgIHRoaXMuX2lubmVyRm9jdXNhYmxlcy5mb3JFYWNoKChmb2N1c2FibGUpID0+IHtcbiAgICAgICAgLy8gd2hlbiBpbm5lciBmb2N1c2FibGUgZm9jdXNlZFxuICAgICAgICBmb2N1c2FibGUuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCB0aGlzLl9vbklubmVyRm9jdXNhYmxlRm9jdXNlZCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgIHN1cGVyLmRpc2Nvbm5lY3RlZENhbGxiYWNrICYmXG4gICAgICAgIHN1cGVyLmRpc2Nvbm5lY3RlZENhbGxiYWNrKCk7XG5cbiAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignZm9jdXMnLCB0aGlzLl9vbkZvY3VzKTtcbiAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMuX29uQmx1cik7XG5cbiAgICAgIHRoaXMuX2lubmVyRm9jdXNhYmxlcy5mb3JFYWNoKChmb2N1c2FibGUpID0+IHtcbiAgICAgICAgZm9jdXNhYmxlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdGhpcy5fb25Jbm5lckZvY3VzYWJsZUZvY3VzZWQpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gcmVhZC1vbmx5XG4gICAgZ2V0IGZvY3VzZWQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5oYXNBdHRyaWJ1dGUoJ2ZvY3VzZWQnKTtcbiAgICB9XG5cbiAgICBzZXQgZm9jdXNlZChfKSB7XG4gICAgICBjb25zb2xlLndhcm4oRVJST1JfTUVTU0FHRVMuZm9jdXNlZCk7XG4gICAgfVxuXG4gICAgZ2V0IGRpc2FibGVkKCkge1xuICAgICAgcmV0dXJuIHRoaXMuaGFzQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgIH1cblxuICAgIHNldCBkaXNhYmxlZCh2YWx1ZSkge1xuICAgICAgY29uc3QgaGFzVmFsdWUgPSBCb29sZWFuKHZhbHVlKTtcbiAgICAgIGlmIChoYXNWYWx1ZSkge1xuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCAnJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgX2lubmVyRm9jdXNhYmxlcygpIHtcbiAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuVHJlZS5xdWVyeVNlbGVjdG9yQWxsKCdbdGFiaW5kZXhdJykgfHwgW107XG4gICAgfVxuXG4gICAgZ2V0IF9maXJzdElubmVyRm9jdXNhYmxlKCkge1xuICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW5UcmVlLnF1ZXJ5U2VsZWN0b3IoJ1t0YWJpbmRleF0nKTtcbiAgICB9XG5cbiAgICBfb25Jbm5lckZvY3VzYWJsZUZvY3VzZWQoZXZ0KSB7XG4gICAgICB0aGlzLl9jdXJyZW50SW5uZXJGb2N1c2VkID0gZXZ0LnRhcmdldDtcbiAgICB9XG5cbiAgICBfb25Gb2N1cygpIHtcbiAgICAgIGlmICh0aGlzLmRpc2FibGVkKSByZXR1cm47XG4gICAgICAvLyBPbmx5IGZvciBzdHlsaW5nIHB1cnBvc2UuXG4gICAgICAvLyBGb2N1c2VkIHByb3BlcnR5IGlzIGNvbnRyb2xsZWQgZnJvbSBpbnNpZGUuXG4gICAgICAvLyBBdHRlbXB0IHRvIHNldCB0aGlzIHByb3BlcnR5IGZyb20gb3V0c2lkZSB3aWxsIHRyaWdnZXIgYSB3YXJuaW5nXG4gICAgICAvLyBhbmQgd2lsbCBiZSBpZ25vcmVkXG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnZm9jdXNlZCcsICcnKTtcbiAgICAgIHRoaXMuX2FwcGx5Rm9jdXNTaWRlRWZmZWN0cygpO1xuICAgIH1cblxuICAgIF9vbkJsdXIoKSB7XG4gICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgnZm9jdXNlZCcpO1xuICAgICAgdGhpcy5fYXBwbHlCbHVyU2lkZUVmZmVjdHMoKTtcbiAgICB9XG5cbiAgICBfYXBwbHlGb2N1c1NpZGVFZmZlY3RzKCkge1xuICAgICAgaWYgKHRoaXMuX2N1cnJlbnRJbm5lckZvY3VzZWQpIHtcbiAgICAgICAgLy8gU29tZSBpbm5lciBjb21wb25lbnQgaXMgYWxyZWFkeSBmb2N1c2VkLlxuICAgICAgICAvLyBObyBuZWVkIHRvIHNldCBmb2N1cyBvbiBhbnl0aGluZy5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5fZm9jdXNGaXJzdElubmVyRm9jdXNhYmxlKCk7XG4gICAgfVxuXG4gICAgX2FwcGx5Qmx1clNpZGVFZmZlY3RzKCkge1xuICAgICAgaWYgKHRoaXMuX2N1cnJlbnRJbm5lckZvY3VzZWQpIHtcbiAgICAgICAgdGhpcy5fY3VycmVudElubmVyRm9jdXNlZC5ibHVyKCk7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRJbm5lckZvY3VzZWQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9mb2N1c0ZpcnN0SW5uZXJGb2N1c2FibGUoKSB7XG4gICAgICBjb25zdCBmaXJzdElubmVyRm9jdXNhYmxlID0gdGhpcy5fZmlyc3RJbm5lckZvY3VzYWJsZTtcbiAgICAgIGlmIChmaXJzdElubmVyRm9jdXNhYmxlKSB7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRJbm5lckZvY3VzZWQgPSBmaXJzdElubmVyRm9jdXNhYmxlO1xuICAgICAgICBmaXJzdElubmVyRm9jdXNhYmxlLmZvY3VzKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2FwcGx5RGlzYWJsZWRTaWRlRWZmZWN0cygpIHtcbiAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCd0YWJpbmRleCcpO1xuICAgICAgdGhpcy5faW5uZXJGb2N1c2FibGVzLmZvckVhY2goKGlubmVyRm9jdXNhYmxlKSA9PiB7XG4gICAgICAgIGlubmVyRm9jdXNhYmxlLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcbiAgICAgICAgaWYgKGlubmVyRm9jdXNhYmxlLmhhc0F0dHJpYnV0ZSgnY29udGVudGVkaXRhYmxlJykpIHtcbiAgICAgICAgICBpbm5lckZvY3VzYWJsZS5zZXRBdHRyaWJ1dGUoJ2NvbnRlbnRlZGl0YWJsZScsICdmYWxzZScpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlubmVyRm9jdXNhYmxlLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLmJsdXIoKTtcbiAgICB9XG5cbiAgICBfYXBwbHlFbmFibGVkU2lkZUVmZmVjdHMoKSB7XG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnMCcpO1xuICAgICAgdGhpcy5faW5uZXJGb2N1c2FibGVzLmZvckVhY2goKGlubmVyRm9jdXNhYmxlKSA9PiB7XG4gICAgICAgIGlubmVyRm9jdXNhYmxlLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnMCcpO1xuICAgICAgICBpZiAoaW5uZXJGb2N1c2FibGUuaGFzQXR0cmlidXRlKCdjb250ZW50ZWRpdGFibGUnKSkge1xuICAgICAgICAgIGlubmVyRm9jdXNhYmxlLnNldEF0dHJpYnV0ZSgnY29udGVudGVkaXRhYmxlJywgJ3RydWUnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpbm5lckZvY3VzYWJsZS5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gRm9jdXNhYmxlO1xufVxuIiwiXG5pbXBvcnQgZ2V0REJVSUxvY2FsZVNlcnZpY2UgZnJvbSAnLi4vLi4vc2VydmljZXMvREJVSUxvY2FsZVNlcnZpY2UnO1xuaW1wb3J0IGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbiBmcm9tICcuLi8uLi9pbnRlcm5hbHMvZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uJztcblxuY29uc3QgcmVnaXN0cmF0aW9uTmFtZSA9ICdEQlVJV2ViQ29tcG9uZW50QmFzZSc7XG5cbmZ1bmN0aW9uIGRlZmluZUNvbW1vbkNTU1ZhcnMoKSB7XG4gIGNvbnN0IGNvbW1vblN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgY29tbW9uU3R5bGUuaW5uZXJIVE1MID0gYFxuICA6cm9vdCB7XG4gICAgLS1kYnVpLXdlYi1jb21wb25lbnQtZ2xvYmFsLWJvcmRlci1yYWRpdXM6IDVweDtcbiAgICAtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWhlaWdodDogMzBweDtcbiAgICAtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWNvbG9yOiAjMDAwO1xuICAgIC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gICAgLS1kYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC1ib3JkZXItY29sb3I6ICNjY2M7XG4gICAgLS1kYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC1ib3JkZXItc3R5bGU6IHNvbGlkO1xuICAgIC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtYm9yZGVyLXdpZHRoOiAxcHg7XG4gIH1cbiAgYDtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaGVhZCcpLmFwcGVuZENoaWxkKGNvbW1vblN0eWxlKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0REJVSVdlYkNvbXBvbmVudEJhc2Uod2luKSB7XG4gIGNvbnN0IExvY2FsZVNlcnZpY2UgPSBnZXREQlVJTG9jYWxlU2VydmljZSh3aW4pO1xuXG4gIHJldHVybiBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24od2luLCByZWdpc3RyYXRpb25OYW1lLCAoKSA9PiB7XG4gICAgZGVmaW5lQ29tbW9uQ1NTVmFycygpO1xuXG4gICAgY29uc3QgeyBkb2N1bWVudCwgSFRNTEVsZW1lbnQsIGN1c3RvbUVsZW1lbnRzIH0gPSB3aW47XG5cbiAgICBjbGFzcyBEQlVJV2ViQ29tcG9uZW50QmFzZSBleHRlbmRzIEhUTUxFbGVtZW50IHtcblxuICAgICAgc3RhdGljIGdldCByZWdpc3RyYXRpb25OYW1lKCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3JlZ2lzdHJhdGlvbk5hbWUgbXVzdCBiZSBkZWZpbmVkIGluIGRlcml2ZWQgY2xhc3NlcycpO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlSW5uZXJIVE1MKCkge1xuICAgICAgICByZXR1cm4gJzxzdHlsZT48L3N0eWxlPjxzbG90Pjwvc2xvdD4nO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IGRlcGVuZGVuY2llcygpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IHVzZVNoYWRvdygpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgcHJvcGVydGllc1RvVXBncmFkZSgpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IHByb3BlcnRpZXNUb0RlZmluZSgpIHtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgfVxuXG4gICAgICBnZXQgaW5zdGFuY2VQcm9wZXJ0aWVzVG9EZWZpbmUoKSB7XG4gICAgICAgIHJldHVybiB7fTtcbiAgICAgIH1cblxuICAgICAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIGNvbnN0IHsgdXNlU2hhZG93IH0gPSB0aGlzLmNvbnN0cnVjdG9yO1xuICAgICAgICBpZiAodXNlU2hhZG93KSB7XG4gICAgICAgICAgdGhpcy5hdHRhY2hTaGFkb3coe1xuICAgICAgICAgICAgbW9kZTogJ29wZW4nLFxuICAgICAgICAgICAgLy8gZGVsZWdhdGVzRm9jdXM6IHRydWVcbiAgICAgICAgICAgIC8vIE5vdCB3b3JraW5nIG9uIElQYWQgc28gd2UgZG8gYW4gd29ya2Fyb3VuZFxuICAgICAgICAgICAgLy8gYnkgc2V0dGluZyBcImZvY3VzZWRcIiBhdHRyaWJ1dGUgd2hlbiBuZWVkZWQuXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5faXNDb25uZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5faW5zZXJ0VGVtcGxhdGUoKTtcblxuICAgICAgICB0aGlzLmNvbm5lY3RlZENhbGxiYWNrID0gdGhpcy5jb25uZWN0ZWRDYWxsYmFjay5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmRpc2Nvbm5lY3RlZENhbGxiYWNrID0gdGhpcy5kaXNjb25uZWN0ZWRDYWxsYmFjay5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLl9oYW5kbGVMb2NhbGVDaGFuZ2UgPSB0aGlzLl9oYW5kbGVMb2NhbGVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vbkxvY2FsZUNoYW5nZSAmJiAodGhpcy5vbkxvY2FsZUNoYW5nZSA9IHRoaXMub25Mb2NhbGVDaGFuZ2UuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMudW5yZWdpc3RlckxvY2FsZUNoYW5nZSA9IG51bGw7XG5cbiAgICAgICAgLy8gcHJvdmlkZSBzdXBwb3J0IGZvciB0cmFpdHMgaWYgYW55IGFzIHRoZXkgY2FudCBvdmVycmlkZSBjb25zdHJ1Y3RvclxuICAgICAgICB0aGlzLmluaXQgJiYgdGhpcy5pbml0KC4uLmFyZ3MpO1xuICAgICAgfVxuXG4gICAgICAvLyBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS93ZWIvZnVuZGFtZW50YWxzL3dlYi1jb21wb25lbnRzL2Jlc3QtcHJhY3RpY2VzI2xhenktcHJvcGVydGllc1xuICAgICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vd2ViL2Z1bmRhbWVudGFscy93ZWItY29tcG9uZW50cy9leGFtcGxlcy9ob3d0by1jaGVja2JveFxuICAgICAgLyogZXNsaW50IG5vLXByb3RvdHlwZS1idWlsdGluczogMCAqL1xuICAgICAgX3VwZ3JhZGVQcm9wZXJ0eShwcm9wKSB7XG4gICAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzW3Byb3BdO1xuICAgICAgICAgIGRlbGV0ZSB0aGlzW3Byb3BdO1xuICAgICAgICAgIHRoaXNbcHJvcF0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBfZGVmaW5lUHJvcGVydHkoa2V5LCB2YWx1ZSkge1xuICAgICAgICBpZiAoIXRoaXMuaGFzQXR0cmlidXRlKGtleSkpIHtcbiAgICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgICAgdGhpcy5faXNDb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmVmb3JldW5sb2FkJywgdGhpcy5kaXNjb25uZWN0ZWRDYWxsYmFjaywgZmFsc2UpO1xuICAgICAgICB0aGlzLnVucmVnaXN0ZXJMb2NhbGVDaGFuZ2UgPVxuICAgICAgICAgIExvY2FsZVNlcnZpY2Uub25Mb2NhbGVDaGFuZ2UodGhpcy5faGFuZGxlTG9jYWxlQ2hhbmdlKTtcbiAgICAgICAgY29uc3QgeyBwcm9wZXJ0aWVzVG9VcGdyYWRlLCBwcm9wZXJ0aWVzVG9EZWZpbmUgfSA9IHRoaXMuY29uc3RydWN0b3I7XG4gICAgICAgIGNvbnN0IHsgaW5zdGFuY2VQcm9wZXJ0aWVzVG9EZWZpbmUgfSA9IHRoaXM7XG4gICAgICAgIGNvbnN0IGFsbFByb3BlcnRpZXNUb0RlZmluZSA9IHtcbiAgICAgICAgICAuLi5wcm9wZXJ0aWVzVG9EZWZpbmUsXG4gICAgICAgICAgLi4uaW5zdGFuY2VQcm9wZXJ0aWVzVG9EZWZpbmVcbiAgICAgICAgfTtcbiAgICAgICAgcHJvcGVydGllc1RvVXBncmFkZS5mb3JFYWNoKChwcm9wZXJ0eSkgPT4ge1xuICAgICAgICAgIHRoaXMuX3VwZ3JhZGVQcm9wZXJ0eShwcm9wZXJ0eSk7XG4gICAgICAgIH0pO1xuICAgICAgICBPYmplY3Qua2V5cyhhbGxQcm9wZXJ0aWVzVG9EZWZpbmUpLmZvckVhY2goKHByb3BlcnR5KSA9PiB7XG4gICAgICAgICAgdGhpcy5fZGVmaW5lUHJvcGVydHkocHJvcGVydHksIGFsbFByb3BlcnRpZXNUb0RlZmluZVtwcm9wZXJ0eV0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHRoaXMuX2lzQ29ubmVjdGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMudW5yZWdpc3RlckxvY2FsZUNoYW5nZSgpO1xuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignYmVmb3JldW5sb2FkJywgdGhpcy5kaXNjb25uZWN0ZWRDYWxsYmFjaywgZmFsc2UpO1xuICAgICAgfVxuXG4gICAgICBnZXQgY2hpbGRyZW5UcmVlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci51c2VTaGFkb3cgPyB0aGlzLnNoYWRvd1Jvb3QgOiB0aGlzO1xuICAgICAgfVxuXG4gICAgICBfaW5zZXJ0VGVtcGxhdGUoKSB7XG4gICAgICAgIGNvbnN0IHsgdGVtcGxhdGUgfSA9IHRoaXMuY29uc3RydWN0b3I7XG5cbiAgICAgICAgaWYgKHRlbXBsYXRlKSB7XG4gICAgICAgICAgdGhpcy5jaGlsZHJlblRyZWUuYXBwZW5kQ2hpbGQodGVtcGxhdGUuY29udGVudC5jbG9uZU5vZGUodHJ1ZSkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIF9oYW5kbGVMb2NhbGVDaGFuZ2UobG9jYWxlKSB7XG4gICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdkaXInLCBsb2NhbGUuZGlyKTtcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2xhbmcnLCBsb2NhbGUubGFuZyk7XG4gICAgICAgIHRoaXMub25Mb2NhbGVDaGFuZ2UgJiYgdGhpcy5vbkxvY2FsZUNoYW5nZShsb2NhbGUpO1xuICAgICAgfVxuXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyhrbGFzcykge1xuICAgICAgY29uc3QgdGVtcGxhdGVJbm5lckhUTUwgPSBrbGFzcy50ZW1wbGF0ZUlubmVySFRNTDtcbiAgICAgIGNvbnN0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IHRlbXBsYXRlSW5uZXJIVE1MO1xuXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoa2xhc3MsICd0ZW1wbGF0ZScsIHtcbiAgICAgICAgZ2V0KCkgeyByZXR1cm4gdGVtcGxhdGU7IH0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH0pO1xuXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoa2xhc3MsICdjb21wb25lbnRTdHlsZScsIHtcbiAgICAgICAgZ2V0KCkge1xuICAgICAgICAgIHJldHVybiBrbGFzcy50ZW1wbGF0ZS5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ3N0eWxlJykuaW5uZXJIVE1MO1xuICAgICAgICB9LFxuICAgICAgICBzZXQodmFsdWUpIHtcbiAgICAgICAgICBrbGFzcy50ZW1wbGF0ZS5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ3N0eWxlJykuaW5uZXJIVE1MID0gdmFsdWU7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4ga2xhc3M7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gUmVnaXN0ZXJhYmxlKGtsYXNzKSB7XG4gICAgICBrbGFzcy5yZWdpc3RlclNlbGYgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlZ2lzdHJhdGlvbk5hbWUgPSBrbGFzcy5yZWdpc3RyYXRpb25OYW1lO1xuICAgICAgICBjb25zdCBkZXBlbmRlbmNpZXMgPSBrbGFzcy5kZXBlbmRlbmNpZXM7XG4gICAgICAgIC8vIE1ha2Ugc3VyZSBvdXIgZGVwZW5kZW5jaWVzIGFyZSByZWdpc3RlcmVkIGJlZm9yZSB3ZSByZWdpc3RlciBzZWxmXG4gICAgICAgIGRlcGVuZGVuY2llcy5mb3JFYWNoKChkZXBlbmRlbmN5KSA9PiBkZXBlbmRlbmN5LnJlZ2lzdGVyU2VsZigpKTtcbiAgICAgICAgLy8gRG9uJ3QgdHJ5IHRvIHJlZ2lzdGVyIHNlbGYgaWYgYWxyZWFkeSByZWdpc3RlcmVkXG4gICAgICAgIGlmIChjdXN0b21FbGVtZW50cy5nZXQocmVnaXN0cmF0aW9uTmFtZSkpIHJldHVybiByZWdpc3RyYXRpb25OYW1lO1xuICAgICAgICAvLyBHaXZlIGEgY2hhbmNlIHRvIG92ZXJyaWRlIHdlYi1jb21wb25lbnQgc3R5bGUgaWYgcHJvdmlkZWQgYmVmb3JlIGJlaW5nIHJlZ2lzdGVyZWQuXG4gICAgICAgIGNvbnN0IGNvbXBvbmVudFN0eWxlID0gKCh3aW4uREJVSVdlYkNvbXBvbmVudHMgfHwge30pW3JlZ2lzdHJhdGlvbk5hbWVdIHx8IHt9KS5jb21wb25lbnRTdHlsZTtcbiAgICAgICAgaWYgKGNvbXBvbmVudFN0eWxlKSB7XG4gICAgICAgICAga2xhc3MuY29tcG9uZW50U3R5bGUgKz0gJ1xcblxcbi8qID09PT0gb3ZlcnJpZGVzID09PT0gKi9cXG5cXG4nO1xuICAgICAgICAgIGtsYXNzLmNvbXBvbmVudFN0eWxlICs9IGNvbXBvbmVudFN0eWxlO1xuICAgICAgICB9XG4gICAgICAgIC8vIERvIHJlZ2lzdHJhdGlvblxuICAgICAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUocmVnaXN0cmF0aW9uTmFtZSwga2xhc3MpO1xuICAgICAgICByZXR1cm4gcmVnaXN0cmF0aW9uTmFtZTtcbiAgICAgIH07XG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShrbGFzcywgJ3Byb3RvdHlwZUNoYWluSW5mbycsIHtcbiAgICAgICAgZ2V0KCkge1xuICAgICAgICAgIGNvbnN0IGNoYWluID0gW2tsYXNzXTtcbiAgICAgICAgICBsZXQgcGFyZW50UHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yoa2xhc3MpO1xuICAgICAgICAgIHdoaWxlIChwYXJlbnRQcm90byAhPT0gSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgIGNoYWluLnB1c2gocGFyZW50UHJvdG8pO1xuICAgICAgICAgICAgcGFyZW50UHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YocGFyZW50UHJvdG8pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjaGFpbi5wdXNoKHBhcmVudFByb3RvKTtcbiAgICAgICAgICByZXR1cm4gY2hhaW47XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4ga2xhc3M7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIERCVUlXZWJDb21wb25lbnRCYXNlLFxuICAgICAgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyxcbiAgICAgIFJlZ2lzdGVyYWJsZVxuICAgIH07XG4gIH0pO1xufVxuIiwiXG5pbXBvcnQgZ2V0REJVSVdlYkNvbXBvbmVudEJhc2UgZnJvbSAnLi4vREJVSVdlYkNvbXBvbmVudEJhc2UvREJVSVdlYkNvbXBvbmVudEJhc2UnO1xuaW1wb3J0IGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbiBmcm9tICcuLi8uLi9pbnRlcm5hbHMvZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uJztcblxuY29uc3QgcmVnaXN0cmF0aW9uTmFtZSA9ICdkYnVpLXdlYi1jb21wb25lbnQtZHVtbXknO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXREQlVJV2ViQ29tcG9uZW50RHVtbXkod2luKSB7XG4gIHJldHVybiBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24od2luLCByZWdpc3RyYXRpb25OYW1lLCAoKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgREJVSVdlYkNvbXBvbmVudEJhc2UsXG4gICAgICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzLFxuICAgICAgUmVnaXN0ZXJhYmxlXG4gICAgfSA9IGdldERCVUlXZWJDb21wb25lbnRCYXNlKHdpbik7XG5cbiAgICBjbGFzcyBEQlVJV2ViQ29tcG9uZW50RHVtbXkgZXh0ZW5kcyBEQlVJV2ViQ29tcG9uZW50QmFzZSB7XG5cbiAgICAgIHN0YXRpYyBnZXQgcmVnaXN0cmF0aW9uTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHJlZ2lzdHJhdGlvbk5hbWU7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgdGVtcGxhdGVJbm5lckhUTUwoKSB7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgICAgPHN0eWxlPlxuICAgICAgICAgIDpob3N0IHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgbWF4LXdpZHRoOiA0MDBweDtcbiAgICAgICAgICAgIGhlaWdodDogdmFyKC0tZGJ1aS1pbnB1dC1oZWlnaHQsIDUwcHgpO1xuICAgICAgICAgICAgY29sb3I6IG1hcm9vbjtcbiAgICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIGdyYXk7XG4gICAgICAgICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICA6aG9zdCBiLCA6aG9zdCBkaXZbeC1oYXMtc2xvdF0gc3Bhblt4LXNsb3Qtd3JhcHBlcl0ge1xuICAgICAgICAgICAgdW5pY29kZS1iaWRpOiBiaWRpLW92ZXJyaWRlO1xuICAgICAgICAgICAgdGV4dC1zaGFkb3c6IHZhcigtLWR1bW15LWItdGV4dC1zaGFkb3csIG5vbmUpO1xuICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICA6aG9zdChbZGlyPXJ0bF0pIGIge1xuICAgICAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIDpob3N0KFtkaXI9bHRyXSkgYiB7XG4gICAgICAgICAgICB0ZXh0LWRlY29yYXRpb246IG92ZXJsaW5lO1xuICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICA6aG9zdChbZGlyPWx0cl0pICNjb250YWluZXIgPiBkaXZbZGlyPXJ0bF0sXG4gICAgICAgICAgOmhvc3QoW2Rpcj1ydGxdKSAjY29udGFpbmVyID4gZGl2W2Rpcj1sdHJdIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIDpob3N0ICNjb250YWluZXIgPiBkaXZbeC1oYXMtc2xvdF0ge1xuICAgICAgICAgICAgbWFyZ2luLWxlZnQ6IDBweDtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgI2NvbnRhaW5lciB7XG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgIGhlaWdodDogMTAwJTtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBmbGV4LWZsb3c6IHJvdyBub3dyYXA7XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogc3RyZXRjaDtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgI2NvbnRhaW5lciA+IGRpdiB7XG4gICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCBncmF5O1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogdmFyKC0tZHVtbXktaW5uZXItc2VjdGlvbnMtYm9yZGVyLXJhZGl1cywgMHB4KTtcbiAgICAgICAgICAgIGZsZXg6IDEgMCAwJTtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBtYXJnaW46IDVweDtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgI2NvbnRhaW5lciA+IGRpdiA+IGRpdiB7XG4gICAgICAgICAgICBtYXJnaW46IGF1dG87XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIDwvc3R5bGU+XG4gICAgICAgICAgXG4gICAgICAgICAgPGRpdiBpZD1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgPGRpdiBkaXI9XCJsdHJcIj5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8Yj5EdW1teSBzaGFkb3c8L2I+IFtMVFJdXG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIDxkaXYgeC1oYXMtc2xvdD5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8c3Bhbj5bPC9zcGFuPjxzcGFuIHgtc2xvdC13cmFwcGVyPjxzbG90Pjwvc2xvdD48L3NwYW4+PHNwYW4+XTwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgPGRpdiBkaXI9XCJydGxcIj5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8Yj5EdW1teSBzaGFkb3c8L2I+IFtSVExdXG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIGA7XG4gICAgICB9XG5cbiAgICAgIG9uTG9jYWxlQ2hhbmdlKGxvY2FsZSkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnb25Mb2NhbGVDaGFuZ2UnLCBsb2NhbGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBSZWdpc3RlcmFibGUoXG4gICAgICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzKFxuICAgICAgICBEQlVJV2ViQ29tcG9uZW50RHVtbXlcbiAgICAgIClcbiAgICApO1xuICB9KTtcbn1cblxuZ2V0REJVSVdlYkNvbXBvbmVudER1bW15LnJlZ2lzdHJhdGlvbk5hbWUgPSByZWdpc3RyYXRpb25OYW1lO1xuXG4iLCJcblxuaW1wb3J0IGdldERCVUlXZWJDb21wb25lbnRCYXNlIGZyb20gJy4uL0RCVUlXZWJDb21wb25lbnRCYXNlL0RCVUlXZWJDb21wb25lbnRCYXNlJztcbmltcG9ydCBnZXREQlVJV2ViQ29tcG9uZW50RHVtbXkgZnJvbSAnLi4vREJVSVdlYkNvbXBvbmVudER1bW15L0RCVUlXZWJDb21wb25lbnREdW1teSc7XG5pbXBvcnQgZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uIGZyb20gJy4uLy4uL2ludGVybmFscy9lbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24nO1xuXG5jb25zdCByZWdpc3RyYXRpb25OYW1lID0gJ2RidWktd2ViLWNvbXBvbmVudC1kdW1teS1wYXJlbnQnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXREQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQod2luKSB7XG4gIHJldHVybiBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24od2luLCByZWdpc3RyYXRpb25OYW1lLCAoKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgREJVSVdlYkNvbXBvbmVudEJhc2UsXG4gICAgICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzLFxuICAgICAgUmVnaXN0ZXJhYmxlXG4gICAgfSA9IGdldERCVUlXZWJDb21wb25lbnRCYXNlKHdpbik7XG4gICAgY29uc3QgREJVSVdlYkNvbXBvbmVudER1bW15ID0gZ2V0REJVSVdlYkNvbXBvbmVudER1bW15KHdpbik7XG5cbiAgICBjbGFzcyBEQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQgZXh0ZW5kcyBEQlVJV2ViQ29tcG9uZW50QmFzZSB7XG5cbiAgICAgIHN0YXRpYyBnZXQgcmVnaXN0cmF0aW9uTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHJlZ2lzdHJhdGlvbk5hbWU7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgdGVtcGxhdGVJbm5lckhUTUwoKSB7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgICAgPHN0eWxlPlxuICAgICAgICAgIDpob3N0IHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgbWF4LXdpZHRoOiA0MDBweDtcbiAgICAgICAgICB9XG4gICAgICAgICAgPC9zdHlsZT5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPGI+RHVtbXkgUGFyZW50IHNoYWRvdzwvYj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPGRidWktd2ViLWNvbXBvbmVudC1kdW1teT48c2xvdD48L3Nsb3Q+PC9kYnVpLXdlYi1jb21wb25lbnQtZHVtbXk+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCBkZXBlbmRlbmNpZXMoKSB7XG4gICAgICAgIHJldHVybiBbREJVSVdlYkNvbXBvbmVudER1bW15XTtcbiAgICAgIH1cblxuICAgIH1cblxuICAgIHJldHVybiBSZWdpc3RlcmFibGUoXG4gICAgICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzKFxuICAgICAgICBEQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnRcbiAgICAgIClcbiAgICApO1xuICB9KTtcbn1cblxuZ2V0REJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50LnJlZ2lzdHJhdGlvbk5hbWUgPSByZWdpc3RyYXRpb25OYW1lO1xuXG4iLCJcbmltcG9ydCBnZXREQlVJV2ViQ29tcG9uZW50QmFzZSBmcm9tICcuLi9EQlVJV2ViQ29tcG9uZW50QmFzZS9EQlVJV2ViQ29tcG9uZW50QmFzZSc7XG5pbXBvcnQgZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uIGZyb20gJy4uLy4uL2ludGVybmFscy9lbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24nO1xuaW1wb3J0IEZvY3VzYWJsZSBmcm9tICcuLi8uLi9iZWhhdmlvdXJzL0ZvY3VzYWJsZSc7XG5cbmNvbnN0IHJlZ2lzdHJhdGlvbk5hbWUgPSAnZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtdGV4dCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldERCVUlXZWJDb21wb25lbnRGb3JtSW5wdXRUZXh0KHdpbikge1xuICByZXR1cm4gZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uKHdpbiwgcmVnaXN0cmF0aW9uTmFtZSwgKCkgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIERCVUlXZWJDb21wb25lbnRCYXNlLFxuICAgICAgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyxcbiAgICAgIFJlZ2lzdGVyYWJsZVxuICAgIH0gPSBnZXREQlVJV2ViQ29tcG9uZW50QmFzZSh3aW4pO1xuXG4gICAgY2xhc3MgREJVSVdlYkNvbXBvbmVudEZvcm1JbnB1dFRleHQgZXh0ZW5kcyBEQlVJV2ViQ29tcG9uZW50QmFzZSB7XG5cbiAgICAgIHN0YXRpYyBnZXQgcmVnaXN0cmF0aW9uTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHJlZ2lzdHJhdGlvbk5hbWU7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgdGVtcGxhdGVJbm5lckhUTUwoKSB7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgICAgPHN0eWxlPlxuICAgICAgICAgIDpob3N0IHtcbiAgICAgICAgICAgIGFsbDogaW5pdGlhbDsgXG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgIC8qaGVpZ2h0OiB2YXIoLS1kYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC1oZWlnaHQpOyovXG4gICAgICAgICAgICAvKmxpbmUtaGVpZ2h0OiB2YXIoLS1kYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC1oZWlnaHQpOyovXG4gICAgICAgICAgICBoZWlnaHQ6IDMwMHB4O1xuICAgICAgICAgICAgcGFkZGluZzogMHB4O1xuICAgICAgICAgICAgZm9udC1zaXplOiAxOHB4O1xuICAgICAgICAgICAgY29sb3I6IHZhcigtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWNvbG9yKTtcbiAgICAgICAgICAgIC8qYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtYmFja2dyb3VuZC1jb2xvcik7Ki9cbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAxMDAsIDAsIDAuMSk7XG4gICAgICAgICAgICB1bmljb2RlLWJpZGk6IGJpZGktb3ZlcnJpZGU7XG4gICAgICAgICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgICAgICAgICAgYm9yZGVyOiBub25lO1xuICAgICAgICAgICAgYm9yZGVyLWJvdHRvbTogdmFyKC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtYm9yZGVyLXdpZHRoKSB2YXIoLS1kYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC1ib3JkZXItc3R5bGUpIHZhcigtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWJvcmRlci1jb2xvcik7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIDpob3N0IFt0YWJpbmRleF0ge1xuICAgICAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgICAgICBoZWlnaHQ6IDUwcHg7XG4gICAgICAgICAgICBsaW5lLWhlaWdodDogNTBweDtcbiAgICAgICAgICAgIGJvcmRlcjogbm9uZTtcbiAgICAgICAgICAgIG1hcmdpbjogMHB4O1xuICAgICAgICAgICAgcGFkZGluZzogMHB4O1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiAwcHg7XG4gICAgICAgICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgICAgICAgICAgdW5pY29kZS1iaWRpOiBiaWRpLW92ZXJyaWRlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICA6aG9zdCBbdGFiaW5kZXhdOmZvY3VzIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAwLCAwLCAuMyk7XG4gICAgICAgICAgICBvdXRsaW5lOiBub25lO1xuICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICA6aG9zdChbZm9jdXNlZF0pIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMjU1LCAwLCAuMyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIC8qOmhvc3QoW2Rpc2FibGVkXSkgeyovXG4gICAgICAgICAgICAvKmJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgLjMpOyovXG4gICAgICAgICAgLyp9Ki9cbiAgICBcbiAgICAgICAgICA6aG9zdChbaGlkZGVuXSkge1xuICAgICAgICAgICAgZGlzcGxheTogbm9uZTtcbiAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgOmhvc3QoW2Rpcj1ydGxdKSB7XG4gICAgICAgICAgXG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIDpob3N0KFtkaXI9bHRyXSkge1xuICAgICAgICAgIFxuICAgICAgICAgIH1cbiAgICAgICAgICA8L3N0eWxlPlxuICAgICAgICAgIDxwPkRCVUlXZWJDb21wb25lbnRGb3JtSW5wdXRUZXh0PC9wPlxuICAgICAgICAgIDxkaXYgY29udGVudGVkaXRhYmxlPVwidHJ1ZVwiIHRhYmluZGV4PVwiMFwiPjwvZGl2PlxuICAgICAgICAgIDxkaXYgY29udGVudGVkaXRhYmxlPVwidHJ1ZVwiIHRhYmluZGV4PVwiMFwiPjwvZGl2PlxuICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIHRhYmluZGV4PVwiMFwiIC8+XG4gICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgdGFiaW5kZXg9XCIwXCIgLz5cbiAgICAgICAgYDtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCBwcm9wZXJ0aWVzVG9EZWZpbmUoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgcm9sZTogJ2Zvcm0taW5wdXQnXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIG9uTG9jYWxlQ2hhbmdlKGxvY2FsZSkge1xuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgIC8qIGVzbGludCBuby1jb25zb2xlOiAwICovXG4gICAgICAgICAgY29uc29sZS5sb2coJ29uTG9jYWxlQ2hhbmdlJywgbG9jYWxlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgfVxuXG4gICAgcmV0dXJuIFJlZ2lzdGVyYWJsZShcbiAgICAgIEZvY3VzYWJsZShcbiAgICAgICAgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyhcbiAgICAgICAgICBEQlVJV2ViQ29tcG9uZW50Rm9ybUlucHV0VGV4dFxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcblxuICB9KTtcbn1cblxuZ2V0REJVSVdlYkNvbXBvbmVudEZvcm1JbnB1dFRleHQucmVnaXN0cmF0aW9uTmFtZSA9IHJlZ2lzdHJhdGlvbk5hbWU7XG5cbiIsIlxuaW1wb3J0IGdldERCVUlXZWJDb21wb25lbnRCYXNlIGZyb20gJy4uL0RCVUlXZWJDb21wb25lbnRCYXNlL0RCVUlXZWJDb21wb25lbnRCYXNlJztcbmltcG9ydCBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24gZnJvbSAnLi4vLi4vaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbic7XG5cbmNvbnN0IHJlZ2lzdHJhdGlvbk5hbWUgPSAnZGJ1aS13ZWItY29tcG9uZW50LWljb24nO1xuXG4vLyBodHRwczovL2dpdGh1Yi5jb20vZ29yYW5nYWppYy9yZWFjdC1pY29uLWJhc2UvYmxvYi9tYXN0ZXIvaW5kZXguanNcbi8vIGh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9nb3JhbmdhamljL3JlYWN0LWljb25zL21hc3Rlci9pY29ucy9nby9tYXJrLWdpdGh1Yi5zdmdcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9nb3JhbmdhamljL3JlYWN0LWljb25zXG4vLyBodHRwczovL2dpdGh1Yi5jb20vZ29yYW5nYWppYy9yZWFjdC1pY29ucy9ibG9iL21hc3Rlci9nby9tYXJrLWdpdGh1Yi5qc1xuLy8gaHR0cHM6Ly9nb3JhbmdhamljLmdpdGh1Yi5pby9yZWFjdC1pY29ucy9nby5odG1sXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldERCVUlXZWJDb21wb25lbnRJY29uKHdpbikge1xuICByZXR1cm4gZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uKHdpbiwgcmVnaXN0cmF0aW9uTmFtZSwgKCkgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIERCVUlXZWJDb21wb25lbnRCYXNlLFxuICAgICAgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyxcbiAgICAgIFJlZ2lzdGVyYWJsZVxuICAgIH0gPSBnZXREQlVJV2ViQ29tcG9uZW50QmFzZSh3aW4pO1xuXG4gICAgY2xhc3MgREJVSVdlYkNvbXBvbmVudEljb24gZXh0ZW5kcyBEQlVJV2ViQ29tcG9uZW50QmFzZSB7XG5cbiAgICAgIHN0YXRpYyBnZXQgcmVnaXN0cmF0aW9uTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHJlZ2lzdHJhdGlvbk5hbWU7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgdGVtcGxhdGVJbm5lckhUTUwoKSB7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgICAgPHN0eWxlPlxuICAgICAgICAgIDpob3N0IHtcbiAgICAgICAgICAgIGFsbDogaW5pdGlhbDtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogaW5oZXJpdDsgXG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICAgICAgICB3aWR0aDogMWVtO1xuICAgICAgICAgICAgaGVpZ2h0OiAxZW07XG4gICAgICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuICAgICAgICAgICAgY29sb3I6IGluaGVyaXQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIDpob3N0IHN2ZyB7XG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICAgICAgICB3aWR0aDogMWVtO1xuICAgICAgICAgICAgaGVpZ2h0OiAxZW07XG4gICAgICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogdG9wO1xuICAgICAgICAgICAgZmlsbDogY3VycmVudENvbG9yO1xuICAgICAgICAgIH1cbiAgICAgICAgICA8L3N0eWxlPlxuICAgICAgICAgIDxzdmcgdmlld0JveD1cIjAgMCA0MCA0MFwiICBwcmVzZXJ2ZUFzcGVjdFJhdGlvPVwieE1pZFlNaWQgbWVldFwiID5cbiAgICAgICAgICAgIDxnPjxwYXRoIGQ9XCJcIi8+PC9nPlxuICAgICAgICAgIDwvc3ZnPlxuICAgICAgICBgO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IHByb3BlcnRpZXNUb1VwZ3JhZGUoKSB7XG4gICAgICAgIGNvbnN0IGluaGVyaXRlZFByb3BlcnRpZXNUb1VwZ3JhZGUgPSBzdXBlci5wcm9wZXJ0aWVzVG9VcGdyYWRlIHx8IFtdO1xuICAgICAgICByZXR1cm4gWy4uLmluaGVyaXRlZFByb3BlcnRpZXNUb1VwZ3JhZGUsICdzaGFwZSddO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IG9ic2VydmVkQXR0cmlidXRlcygpIHtcbiAgICAgICAgY29uc3QgaW5oZXJpdGVkT2JzZXJ2ZWRBdHRyaWJ1dGVzID0gc3VwZXIub2JzZXJ2ZWRBdHRyaWJ1dGVzIHx8IFtdO1xuICAgICAgICByZXR1cm4gWy4uLmluaGVyaXRlZE9ic2VydmVkQXR0cmlidXRlcywgJ3NoYXBlJ107XG4gICAgICB9XG5cbiAgICAgIGdldCBzaGFwZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKCdzaGFwZScpO1xuICAgICAgfVxuXG4gICAgICBzZXQgc2hhcGUodmFsdWUpIHtcbiAgICAgICAgY29uc3QgaGFzVmFsdWUgPSAhW3VuZGVmaW5lZCwgbnVsbF0uaW5jbHVkZXModmFsdWUpO1xuICAgICAgICBjb25zdCBzdHJpbmdWYWx1ZSA9IFN0cmluZyh2YWx1ZSk7XG4gICAgICAgIGlmIChoYXNWYWx1ZSkge1xuICAgICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdzaGFwZScsIHN0cmluZ1ZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgnc2hhcGUnKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlKSB7XG4gICAgICAgIHN1cGVyLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayAmJlxuICAgICAgICAgIHN1cGVyLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpO1xuXG4gICAgICAgIGNvbnN0IGhhc1ZhbHVlID0gIVt1bmRlZmluZWQsIG51bGxdLmluY2x1ZGVzKG5ld1ZhbHVlKTtcbiAgICAgICAgaWYgKG5hbWUgPT09ICdzaGFwZScpIHtcbiAgICAgICAgICBoYXNWYWx1ZSA/IHRoaXMuX3NldFNoYXBlKCkgOiB0aGlzLl9yZW1vdmVTaGFwZSgpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIF9zZXRTaGFwZSgpIHtcbiAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMuY2hpbGRyZW5UcmVlLnF1ZXJ5U2VsZWN0b3IoJ3N2ZyBnIHBhdGgnKTtcbiAgICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoJ2QnLCB0aGlzLnNoYXBlKTtcbiAgICAgIH1cblxuICAgICAgX3JlbW92ZVNoYXBlKCkge1xuICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5jaGlsZHJlblRyZWUucXVlcnlTZWxlY3Rvcignc3ZnIGcgcGF0aCcpO1xuICAgICAgICBwYXRoLnNldEF0dHJpYnV0ZSgnZCcsICcnKTtcbiAgICAgIH1cblxuICAgIH1cblxuICAgIHJldHVybiBSZWdpc3RlcmFibGUoXG4gICAgICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzKFxuICAgICAgICBEQlVJV2ViQ29tcG9uZW50SWNvblxuICAgICAgKVxuICAgICk7XG5cbiAgfSk7XG59XG5cbmdldERCVUlXZWJDb21wb25lbnRJY29uLnJlZ2lzdHJhdGlvbk5hbWUgPSByZWdpc3RyYXRpb25OYW1lO1xuXG4iLCJpbXBvcnQgYXBwZW5kU3R5bGVzIGZyb20gJy4uL2ludGVybmFscy9hcHBlbmRTdHlsZXMnO1xuXG4vKipcbiogQHBhcmFtIGNvbXBvbmVudHMgQXJyYXk8T2JqZWN0PiBbe1xuKiAgcmVnaXN0cmF0aW9uTmFtZSxcbiogIGNvbXBvbmVudFN0eWxlLFxuKiAgLi4uXG4qIH1dXG4qIEByZXR1cm5zIGNvbXBvbmVudHMgQXJyYXk8T2JqZWN0PlxuKi9cbmNvbnN0IGRidWlXZWJDb21wb25lbnRzU2V0VXAgPSAod2luKSA9PiAoY29tcG9uZW50cykgPT4ge1xuICByZXR1cm4gYXBwZW5kU3R5bGVzKHdpbikoY29tcG9uZW50cyk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBkYnVpV2ViQ29tcG9uZW50c1NldFVwO1xuIiwiLypcbkRCVUlXZWJDb21wb25lbnRCYXNlIChmcm9tIHdoaWNoIGFsbCB3ZWItY29tcG9uZW50cyBpbmhlcml0KVxud2lsbCByZWFkIGNvbXBvbmVudFN0eWxlIGZyb20gd2luLkRCVUlXZWJDb21wb25lbnRzXG53aGVuIGtsYXNzLnJlZ2lzdGVyU2VsZigpIGlzIGNhbGxlZCBnaXZpbmcgYSBjaGFuY2UgdG8gb3ZlcnJpZGUgZGVmYXVsdCB3ZWItY29tcG9uZW50IHN0eWxlXG5qdXN0IGJlZm9yZSBpdCBpcyByZWdpc3RlcmVkLlxuKi9cbmNvbnN0IGFwcGVuZFN0eWxlID0gKHdpbikgPT4gKHJlZ2lzdHJhdGlvbk5hbWUsIGNvbXBvbmVudFN0eWxlKSA9PiB7XG4gIGlmICghd2luLkRCVUlXZWJDb21wb25lbnRzKSB7XG4gICAgd2luLkRCVUlXZWJDb21wb25lbnRzID0ge307XG4gIH1cbiAgd2luLkRCVUlXZWJDb21wb25lbnRzID0ge1xuICAgIC4uLndpbi5EQlVJV2ViQ29tcG9uZW50cyxcbiAgICBbcmVnaXN0cmF0aW9uTmFtZV06IHtcbiAgICAgIC4uLndpbi5EQlVJV2ViQ29tcG9uZW50c1tyZWdpc3RyYXRpb25OYW1lXSxcbiAgICAgIGNvbXBvbmVudFN0eWxlXG4gICAgfVxuICB9O1xufTtcblxuY29uc3QgYXBwZW5kU3R5bGVzID0gKHdpbikgPT4gKGNvbXBvbmVudHMpID0+IHtcbiAgY29tcG9uZW50cy5mb3JFYWNoKCh7IHJlZ2lzdHJhdGlvbk5hbWUsIGNvbXBvbmVudFN0eWxlIH0pID0+IHtcbiAgICBhcHBlbmRTdHlsZSh3aW4pKHJlZ2lzdHJhdGlvbk5hbWUsIGNvbXBvbmVudFN0eWxlKTtcbiAgfSk7XG4gIHJldHVybiBjb21wb25lbnRzO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgYXBwZW5kU3R5bGVzO1xuIiwiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbih3aW4sIG5hbWUsIGNhbGxiYWNrKSB7XG4gIGlmICghd2luLkRCVUlXZWJDb21wb25lbnRzKSB7XG4gICAgd2luLkRCVUlXZWJDb21wb25lbnRzID0geyByZWdpc3RyYXRpb25zOiB7fSB9O1xuICB9IGVsc2UgaWYgKCF3aW4uREJVSVdlYkNvbXBvbmVudHMucmVnaXN0cmF0aW9ucykge1xuICAgIHdpbi5EQlVJV2ViQ29tcG9uZW50cy5yZWdpc3RyYXRpb25zID0ge307XG4gIH1cblxuICBsZXQgcmVnaXN0cmF0aW9uID0gd2luLkRCVUlXZWJDb21wb25lbnRzLnJlZ2lzdHJhdGlvbnNbbmFtZV07XG5cbiAgaWYgKHJlZ2lzdHJhdGlvbikgcmV0dXJuIHJlZ2lzdHJhdGlvbjtcblxuICByZWdpc3RyYXRpb24gPSBjYWxsYmFjaygpO1xuICB3aW4uREJVSVdlYkNvbXBvbmVudHMucmVnaXN0cmF0aW9uc1tuYW1lXSA9IHJlZ2lzdHJhdGlvbjtcblxuICByZXR1cm4gd2luLkRCVUlXZWJDb21wb25lbnRzLnJlZ2lzdHJhdGlvbnNbbmFtZV07XG59XG5cbiIsImltcG9ydCBnZXREQlVJbG9jYWxlU2VydmljZSBmcm9tICcuL0RCVUlMb2NhbGVTZXJ2aWNlJztcbmltcG9ydCBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24gZnJvbSAnLi4vaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbic7XG5cbmNvbnN0IGVtcHR5T2JqID0ge307XG5cbmNvbnN0IHJlZ2lzdHJhdGlvbk5hbWUgPSAnREJVSUkxOG5TZXJ2aWNlJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0REJVSUkxOG5TZXJ2aWNlKHdpbikge1xuICBjb25zdCBsb2NhbGVTZXJ2aWNlID0gZ2V0REJVSWxvY2FsZVNlcnZpY2Uod2luKTtcbiAgcmV0dXJuIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbih3aW4sIHJlZ2lzdHJhdGlvbk5hbWUsICgpID0+IHtcbiAgICBjbGFzcyBJMThuU2VydmljZSB7XG4gICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgbG9jYWxlU2VydmljZS5vbkxvY2FsZUNoYW5nZSh0aGlzLl9oYW5kbGVMb2NhbGVDaGFuZ2UuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuX2xvY2FsZSA9IGxvY2FsZVNlcnZpY2UubG9jYWxlO1xuICAgICAgICB0aGlzLl90cmFuc2xhdGlvbnMgPSB7fTtcbiAgICAgIH1cblxuICAgICAgX2hhbmRsZUxvY2FsZUNoYW5nZShsb2NhbGUpIHtcbiAgICAgICAgdGhpcy5fbG9jYWxlID0gbG9jYWxlO1xuICAgICAgfVxuXG4gICAgICBjbGVhclRyYW5zbGF0aW9ucyhsYW5nKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLl90cmFuc2xhdGlvbnNbbGFuZ107XG4gICAgICB9XG5cbiAgICAgIHJlZ2lzdGVyVHJhbnNsYXRpb25zKHRyYW5zbGF0aW9ucykge1xuICAgICAgICB0aGlzLl90cmFuc2xhdGlvbnMgPSBPYmplY3Qua2V5cyh0cmFuc2xhdGlvbnMpLnJlZHVjZSgoYWNjLCBsYW5nKSA9PiB7XG4gICAgICAgICAgYWNjW2xhbmddID0ge1xuICAgICAgICAgICAgLi4udGhpcy5fdHJhbnNsYXRpb25zW2xhbmddLFxuICAgICAgICAgICAgLi4udHJhbnNsYXRpb25zW2xhbmddXG4gICAgICAgICAgfTtcbiAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICB9LCB0aGlzLl90cmFuc2xhdGlvbnMpO1xuICAgICAgfVxuXG4gICAgICB0cmFuc2xhdGUobXNnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRMYW5nVHJhbnNsYXRpb25zW21zZ107XG4gICAgICB9XG5cbiAgICAgIGdldCB0cmFuc2xhdGlvbnMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90cmFuc2xhdGlvbnM7XG4gICAgICB9XG5cbiAgICAgIGdldCBjdXJyZW50TGFuZ1RyYW5zbGF0aW9ucygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zbGF0aW9uc1t0aGlzLl9sb2NhbGUubGFuZ10gfHwgZW1wdHlPYmo7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgaTE4blNlcnZpY2UgPSBuZXcgSTE4blNlcnZpY2UoKTtcbiAgICByZXR1cm4gaTE4blNlcnZpY2U7XG4gIH0pO1xufVxuIiwiXG5pbXBvcnQgZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uIGZyb20gJy4uL2ludGVybmFscy9lbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24nO1xuXG5jb25zdCBkZWZhdWx0TG9jYWxlID0ge1xuICBkaXI6ICdsdHInLFxuICBsYW5nOiAnZW4nXG59O1xuXG5jb25zdCByZWdpc3RyYXRpb25OYW1lID0gJ0RCVUlMb2NhbGVTZXJ2aWNlJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0REJVSUxvY2FsZVNlcnZpY2Uod2luKSB7XG4gIHJldHVybiBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24od2luLCByZWdpc3RyYXRpb25OYW1lLCAoKSA9PiB7XG4gICAgY2xhc3MgTG9jYWxlU2VydmljZSB7XG4gICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tzID0gW107XG4gICAgICAgIHRoaXMuX2xvY2FsZUF0dHJzID0gT2JqZWN0LmtleXMoZGVmYXVsdExvY2FsZSk7XG4gICAgICAgIHRoaXMuX3Jvb3RFbGVtZW50ID0gd2luZG93LmRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICAgICAgdGhpcy5fbG9jYWxlQXR0cnMuZm9yRWFjaCgoYXR0cikgPT4ge1xuICAgICAgICAgIGlmICghdGhpcy5fcm9vdEVsZW1lbnQuZ2V0QXR0cmlidXRlKGF0dHIpKSB7XG4gICAgICAgICAgICB0aGlzLl9yb290RWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0ciwgZGVmYXVsdExvY2FsZVthdHRyXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fbG9jYWxlID0gdGhpcy5fbG9jYWxlQXR0cnMucmVkdWNlKChhY2MsIGF0dHIpID0+IHtcbiAgICAgICAgICBhY2NbYXR0cl0gPSB0aGlzLl9yb290RWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cik7XG4gICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfSwge30pO1xuICAgICAgICB0aGlzLl9vYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMuX2hhbmRsZU11dGF0aW9ucy5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5fb2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLl9yb290RWxlbWVudCwge1xuICAgICAgICAgIGF0dHJpYnV0ZXM6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIF9oYW5kbGVNdXRhdGlvbnMobXV0YXRpb25zKSB7XG4gICAgICAgIG11dGF0aW9ucy5mb3JFYWNoKChtdXRhdGlvbikgPT4ge1xuICAgICAgICAgIGNvbnN0IG11dGF0aW9uQXR0cmlidXRlTmFtZSA9IG11dGF0aW9uLmF0dHJpYnV0ZU5hbWU7XG4gICAgICAgICAgaWYgKHRoaXMuX2xvY2FsZUF0dHJzLmluY2x1ZGVzKG11dGF0aW9uQXR0cmlidXRlTmFtZSkpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvY2FsZSA9IHtcbiAgICAgICAgICAgICAgLi4udGhpcy5fbG9jYWxlLFxuICAgICAgICAgICAgICBbbXV0YXRpb25BdHRyaWJ1dGVOYW1lXTogdGhpcy5fcm9vdEVsZW1lbnQuZ2V0QXR0cmlidXRlKG11dGF0aW9uQXR0cmlidXRlTmFtZSlcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFja3MuZm9yRWFjaChjYWxsYmFjayA9PiBjYWxsYmFjayh0aGlzLl9sb2NhbGUpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBzZXQgbG9jYWxlKGxvY2FsZU9iaikge1xuICAgICAgICBPYmplY3Qua2V5cyhsb2NhbGVPYmopLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgIHRoaXMuX3Jvb3RFbGVtZW50LnNldEF0dHJpYnV0ZShrZXksIGxvY2FsZU9ialtrZXldKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGdldCBsb2NhbGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sb2NhbGU7XG4gICAgICB9XG5cbiAgICAgIG9uTG9jYWxlQ2hhbmdlKGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuX2NhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgY2FsbGJhY2sodGhpcy5sb2NhbGUpO1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcy5maWx0ZXIoY2IgPT4gY2IgIT09IGNhbGxiYWNrKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBsb2NhbGVTZXJ2aWNlID0gbmV3IExvY2FsZVNlcnZpY2UoKTtcbiAgICByZXR1cm4gbG9jYWxlU2VydmljZTtcbiAgfSk7XG59XG4iLCIvKiBlc2xpbnQgcHJlZmVyLWNvbnN0OiAwICovXG5cbi8qKlxuICpcbiAqIEBwYXJhbSBvcHRpb25zIE9iamVjdFxuICogQHJldHVybnMgZnVuY3Rpb24oU3RyaW5nKTogU3RyaW5nXG4gKi9cbmNvbnN0IGZvcmNlRmxvYXQgPSAoeyBkZWNQb2ludCA9ICcuJyB9ID0ge30pID0+ICh2YWx1ZSkgPT4ge1xuICBjb25zdCBHTE9CQUxfREVDX1BPSU5UID0gbmV3IFJlZ0V4cChgXFxcXCR7ZGVjUG9pbnR9YCwgJ2cnKTtcbiAgY29uc3QgR0xPQkFMX05PTl9OVU1CRVJfT1JfREVDX1BPSU5UID0gbmV3IFJlZ0V4cChgW15cXFxcZCR7ZGVjUG9pbnR9XWAsICdnJyk7XG4gIGNvbnN0IE5VTUJFUl9ERUNfUE9JTlRfT1JfU0hPUlRDVVQgPSBuZXcgUmVnRXhwKGBbXFxcXGQke2RlY1BvaW50fUtrTW1dYCwgJycpO1xuICBjb25zdCBOVU1CRVJfT1JfU0lHTiA9IG5ldyBSZWdFeHAoJ1tcXFxcZCstXScsICcnKTtcbiAgY29uc3QgU0lHTiA9IG5ldyBSZWdFeHAoJ1srLV0nLCAnJyk7XG4gIGNvbnN0IFNIT1JUQ1VUID0gbmV3IFJlZ0V4cCgnW0trTW1dJywgJycpO1xuICBjb25zdCBTSE9SVENVVF9USE9VU0FORFMgPSBuZXcgUmVnRXhwKCdbS2tdJywgJycpO1xuXG4gIGxldCB2YWx1ZVRvVXNlID0gdmFsdWU7XG4gIGNvbnN0IGluZGV4T2ZQb2ludCA9IHZhbHVlVG9Vc2UuaW5kZXhPZihkZWNQb2ludCk7XG4gIGNvbnN0IGxhc3RJbmRleE9mUG9pbnQgPSB2YWx1ZVRvVXNlLmxhc3RJbmRleE9mKGRlY1BvaW50KTtcbiAgY29uc3QgaGFzTW9yZVRoYW5PbmVQb2ludCA9IGluZGV4T2ZQb2ludCAhPT0gbGFzdEluZGV4T2ZQb2ludDtcblxuICBpZiAoaGFzTW9yZVRoYW5PbmVQb2ludCkge1xuICAgIHZhbHVlVG9Vc2UgPSBgJHt2YWx1ZVRvVXNlLnJlcGxhY2UoR0xPQkFMX0RFQ19QT0lOVCwgJycpfSR7ZGVjUG9pbnR9YDtcbiAgfVxuXG4gIGxldCBmaXJzdENoYXIgPSB2YWx1ZVRvVXNlWzBdIHx8ICcnO1xuICBsZXQgbGFzdENoYXIgPSAodmFsdWVUb1VzZS5sZW5ndGggPiAxID8gdmFsdWVUb1VzZVt2YWx1ZVRvVXNlLmxlbmd0aCAtIDFdIDogJycpIHx8ICcnO1xuICBsZXQgbWlkZGxlQ2hhcnMgPSB2YWx1ZVRvVXNlLnN1YnN0cigxLCB2YWx1ZVRvVXNlLmxlbmd0aCAtIDIpIHx8ICcnO1xuXG4gIGlmICghZmlyc3RDaGFyLm1hdGNoKE5VTUJFUl9PUl9TSUdOKSkge1xuICAgIGZpcnN0Q2hhciA9ICcnO1xuICB9XG5cbiAgbWlkZGxlQ2hhcnMgPSBtaWRkbGVDaGFycy5yZXBsYWNlKEdMT0JBTF9OT05fTlVNQkVSX09SX0RFQ19QT0lOVCwgJycpO1xuXG4gIGlmICghbGFzdENoYXIubWF0Y2goTlVNQkVSX0RFQ19QT0lOVF9PUl9TSE9SVENVVCkpIHtcbiAgICBsYXN0Q2hhciA9ICcnO1xuICB9IGVsc2UgaWYgKGxhc3RDaGFyLm1hdGNoKFNIT1JUQ1VUKSkge1xuICAgIGlmIChtaWRkbGVDaGFycyA9PT0gZGVjUG9pbnQpIHtcbiAgICAgIG1pZGRsZUNoYXJzID0gJyc7XG4gICAgfSBlbHNlIGlmIChtaWRkbGVDaGFycyA9PT0gJycgJiYgZmlyc3RDaGFyLm1hdGNoKFNJR04pKSB7XG4gICAgICBsYXN0Q2hhciA9ICcnO1xuICAgIH1cbiAgfSBlbHNlIGlmIChsYXN0Q2hhciA9PT0gZGVjUG9pbnQgJiYgbWlkZGxlQ2hhcnMgPT09ICcnICYmIGZpcnN0Q2hhci5tYXRjaChTSUdOKSkge1xuICAgIGxhc3RDaGFyID0gJyc7XG4gIH1cblxuICB2YWx1ZVRvVXNlID0gW2ZpcnN0Q2hhciwgbWlkZGxlQ2hhcnMsIGxhc3RDaGFyXS5qb2luKCcnKTtcblxuICBpZiAobGFzdENoYXIubWF0Y2goU0hPUlRDVVQpKSB7XG4gICAgdmFsdWVUb1VzZSA9IChcbiAgICAgIE51bWJlcihgJHtmaXJzdENoYXJ9JHttaWRkbGVDaGFyc31gLnJlcGxhY2UoZGVjUG9pbnQsICcuJykpICpcbiAgICAgIChsYXN0Q2hhci5tYXRjaChTSE9SVENVVF9USE9VU0FORFMpID8gMTAwMCA6IDEwMDAwMDApXG4gICAgKS50b1N0cmluZygpLnJlcGxhY2UoJy4nLCBkZWNQb2ludCk7XG4gIH1cblxuICByZXR1cm4gdmFsdWVUb1VzZTtcbn07XG5cbi8qKlxuICpcbiAqIEBwYXJhbSBvcHRpb25zIE9iamVjdFxuICogQHJldHVybnMgZnVuY3Rpb24oU3RyaW5nKTogU3RyaW5nXG4gKi9cbmNvbnN0IG51bWJlckZvcm1hdHRlciA9ICh7IGRlY1BvaW50ID0gJy4nLCB0aG91c2FuZHNTZXBhcmF0b3IgPSAnLCcgfSA9IHt9KSA9PiB2YWx1ZSA9PiB7XG4gIHZhbHVlID0gdmFsdWUucmVwbGFjZSgnLicsIGRlY1BvaW50KTtcbiAgbGV0IGZpcnN0Q2hhciA9IHZhbHVlWzBdIHx8ICcnO1xuICBmaXJzdENoYXIgPSBbJysnLCAnLSddLmluY2x1ZGVzKGZpcnN0Q2hhcikgPyBmaXJzdENoYXIgOiAnJztcbiAgY29uc3QgaXNGbG9hdGluZ1BvaW50ID0gdmFsdWUuaW5kZXhPZihkZWNQb2ludCkgIT09IC0xO1xuICBsZXQgW2ludGVnZXJQYXJ0ID0gJycsIGRlY2ltYWxzID0gJyddID0gdmFsdWUuc3BsaXQoZGVjUG9pbnQpO1xuICBpbnRlZ2VyUGFydCA9IGludGVnZXJQYXJ0LnJlcGxhY2UoL1srLV0vZywgJycpO1xuICBpbnRlZ2VyUGFydCA9IGludGVnZXJQYXJ0LnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csIHRob3VzYW5kc1NlcGFyYXRvcik7XG4gIGNvbnN0IHJldCA9IGAke2ZpcnN0Q2hhcn0ke2ludGVnZXJQYXJ0fSR7aXNGbG9hdGluZ1BvaW50ID8gZGVjUG9pbnQgOiAnJ30ke2RlY2ltYWxzfWA7XG4gIHJldHVybiByZXQ7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGZvcmNlRmxvYXQsXG4gIG51bWJlckZvcm1hdHRlclxufTtcblxuIiwiLyogZXNsaW50IG5vLWNvbnNvbGU6IDAgKi9cblxuY29uc3QgYnV0dG9uSGVpZ2h0ID0gJzI1cHgnO1xuY29uc3QgYnV0dG9uU3RhcnQgPSAnNXB4JztcbmNvbnN0IGJ1dHRvblRvcCA9ICc1cHgnO1xuXG5sZXQgY29uc29sZU1lc3NhZ2VzID0gW107XG5jb25zdCBjb25zb2xlTG9nID0gY29uc29sZS5sb2cuYmluZChjb25zb2xlKTtcbmNvbnN0IGNvbnNvbGVPcmlnaW5hbCA9IHt9O1xuXG5mdW5jdGlvbiBjYXB0dXJlQ29uc29sZShjb25zb2xlRWxtLCBvcHRpb25zKSB7XG4gIGNvbnN0IHsgaW5kZW50ID0gMiwgc2hvd0xhc3RPbmx5ID0gZmFsc2UgfSA9IG9wdGlvbnM7XG4gIGNvbnN0IGhhbmRsZXIgPSBmdW5jdGlvbiBoYW5kbGVyKGFjdGlvbiwgLi4uYXJncykge1xuICAgIGlmIChzaG93TGFzdE9ubHkpIHtcbiAgICAgIGNvbnNvbGVNZXNzYWdlcyA9IFt7IFthY3Rpb25dOiBhcmdzIH1dO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlTWVzc2FnZXMucHVzaCh7IFthY3Rpb25dOiBhcmdzIH0pO1xuICAgIH1cblxuICAgIGNvbnNvbGVFbG0uaW5uZXJIVE1MID0gY29uc29sZU1lc3NhZ2VzLm1hcCgoZW50cnkpID0+IHtcbiAgICAgIGNvbnN0IGFjdGlvbiA9IE9iamVjdC5rZXlzKGVudHJ5KVswXTtcbiAgICAgIGNvbnN0IHZhbHVlcyA9IGVudHJ5W2FjdGlvbl07XG4gICAgICBjb25zdCBtZXNzYWdlID0gdmFsdWVzLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIFt1bmRlZmluZWQsIG51bGxdLmluY2x1ZGVzKGl0ZW0pIHx8XG4gICAgICAgICAgWydudW1iZXInLCAnc3RyaW5nJywgJ2Z1bmN0aW9uJ10uaW5jbHVkZXModHlwZW9mIGl0ZW0pXG4gICAgICAgICkgP1xuICAgICAgICAgIGl0ZW0gOlxuICAgICAgICAgIFsnTWFwJywgJ1NldCddLmluY2x1ZGVzKGl0ZW0uY29uc3RydWN0b3IubmFtZSkgP1xuICAgICAgICAgICAgYCR7aXRlbS5jb25zdHJ1Y3Rvci5uYW1lfSAoJHtKU09OLnN0cmluZ2lmeShbLi4uaXRlbV0pfSlgIDpcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KGl0ZW0sIChrZXksIHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgIGlmICgodHlwZW9mIHZhbHVlKSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS50b1N0cmluZygpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgIH0sIGluZGVudCk7XG4gICAgICB9KS5qb2luKCcsICcpO1xuXG4gICAgICBjb25zdCBjb2xvciA9IHtcbiAgICAgICAgbG9nOiAnIzAwMCcsXG4gICAgICAgIHdhcm46ICdvcmFuZ2UnLFxuICAgICAgICBlcnJvcjogJ2RhcmtyZWQnXG4gICAgICB9W2FjdGlvbl07XG5cbiAgICAgIHJldHVybiBgPHByZSBzdHlsZT1cImNvbG9yOiAke2NvbG9yfVwiPiR7bWVzc2FnZX08L3ByZT5gO1xuICAgIH0pLmpvaW4oJ1xcbicpO1xuICB9O1xuICBbJ2xvZycsICd3YXJuJywgJ2Vycm9yJ10uZm9yRWFjaCgoYWN0aW9uKSA9PiB7XG4gICAgY29uc29sZU9yaWdpbmFsW2FjdGlvbl0gPSBjb25zb2xlW2FjdGlvbl07XG4gICAgY29uc29sZVthY3Rpb25dID0gaGFuZGxlci5iaW5kKGNvbnNvbGUsIGFjdGlvbik7XG4gIH0pO1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCAoZXZ0KSA9PiB7XG4gICAgLy8gZXNsaW50IG5vLWNvbnNvbGU6IDBcbiAgICBjb25zb2xlLmVycm9yKGBcIiR7ZXZ0Lm1lc3NhZ2V9XCIgZnJvbSAke2V2dC5maWxlbmFtZX06JHtldnQubGluZW5vfWApO1xuICAgIGNvbnNvbGUuZXJyb3IoZXZ0LCBldnQuZXJyb3Iuc3RhY2spO1xuICAgIC8vIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9KTtcbiAgY29uc29sZUxvZygnY29uc29sZSBjYXB0dXJlZCcpO1xuICByZXR1cm4gZnVuY3Rpb24gcmVsZWFzZUNvbnNvbGUoKSB7XG4gICAgWydsb2cnLCAnd2FybicsICdlcnJvciddLmZvckVhY2goKGFjdGlvbikgPT4ge1xuICAgICAgY29uc29sZVthY3Rpb25dID0gY29uc29sZU9yaWdpbmFsW2FjdGlvbl07XG4gICAgfSk7XG4gICAgY29uc29sZUxvZygnY29uc29sZSByZWxlYXNlZCcpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVDb25zb2xlKHtcbiAgb3B0aW9ucyxcbiAgY29uc29sZVN0eWxlOiB7XG4gICAgYnRuU3RhcnQgPSBidXR0b25TdGFydCwgYnRuSGVpZ2h0ID0gYnV0dG9uSGVpZ2h0LFxuICAgIHdpZHRoID0gYGNhbGMoMTAwdncgLSAke2J0blN0YXJ0fSAtIDMwcHgpYCwgaGVpZ2h0ID0gJzQwMHB4JyxcbiAgICBiYWNrZ3JvdW5kID0gJ3JnYmEoMCwgMCwgMCwgMC41KSdcbiAgfVxufSkge1xuICBjb25zdCB7IHJ0bCA9IGZhbHNlIH0gPSBvcHRpb25zO1xuICBjb25zdCBjb25zb2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbnNvbGUuaWQgPSAnREJVSW9uU2NyZWVuQ29uc29sZSc7XG4gIGNvbnNvbGUuc3R5bGUuY3NzVGV4dCA9IGBcbiAgICBkaXNwbGF5OiBibG9jaztcbiAgICBtYXJnaW46IDBweDtcbiAgICBwYWRkaW5nOiA1cHg7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIG92ZXJmbG93OiBhdXRvO1xuICAgIHdpZHRoOiAke3dpZHRofTtcbiAgICBoZWlnaHQ6ICR7aGVpZ2h0fTtcbiAgICB0b3A6ICR7YnRuSGVpZ2h0fTtcbiAgICAke3J0bCA/ICdyaWdodCcgOiAnbGVmdCd9OiAwcHg7XG4gICAgYmFja2dyb3VuZDogJHtiYWNrZ3JvdW5kfTtcbiAgICB6LWluZGV4OiA5OTk5O1xuICAgIC13ZWJraXQtb3ZlcmZsb3ctc2Nyb2xsaW5nOiB0b3VjaFxuICAgIGA7XG4gIHJldHVybiBjb25zb2xlO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVCdXR0b24oe1xuICBvcHRpb25zLFxuICBidXR0b25TdHlsZToge1xuICAgIHBvc2l0aW9uID0gJ2ZpeGVkJyxcbiAgICB3aWR0aCA9ICcyNXB4JywgaGVpZ2h0ID0gYnV0dG9uSGVpZ2h0LCB0b3AgPSBidXR0b25Ub3AsIHN0YXJ0ID0gYnV0dG9uU3RhcnQsXG4gICAgYmFja2dyb3VuZCA9ICdyZ2JhKDAsIDAsIDAsIDAuNSknXG4gIH1cbn0pIHtcbiAgY29uc3QgeyBydGwgPSBmYWxzZSB9ID0gb3B0aW9ucztcbiAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGJ1dHRvbi5pZCA9ICdEQlVJb25TY3JlZW5Db25zb2xlVG9nZ2xlcic7XG4gIGJ1dHRvbi5zdHlsZS5jc3NUZXh0ID0gYFxuICAgIHBvc2l0aW9uOiAke3Bvc2l0aW9ufTtcbiAgICB3aWR0aDogJHt3aWR0aH07XG4gICAgaGVpZ2h0OiAke2hlaWdodH07XG4gICAgdG9wOiAke3RvcH07XG4gICAgJHtydGwgPyAncmlnaHQnIDogJ2xlZnQnfTogJHtzdGFydH07XG4gICAgYmFja2dyb3VuZDogJHtiYWNrZ3JvdW5kfTtcbiAgICB6LWluZGV4OiA5OTk5O1xuICAgIGA7XG4gIHJldHVybiBidXR0b247XG59XG5cbi8qKlxub25TY3JlZW5Db25zb2xlKHtcbiAgYnV0dG9uU3R5bGUgPSB7IHBvc2l0aW9uLCB3aWR0aCwgaGVpZ2h0LCB0b3AsIHN0YXJ0LCBiYWNrZ3JvdW5kIH0sXG4gIGNvbnNvbGVTdHlsZSA9IHsgd2lkdGgsIGhlaWdodCwgYmFja2dyb3VuZCB9LFxuICBvcHRpb25zID0geyBydGw6IGZhbHNlLCBpbmRlbnQsIHNob3dMYXN0T25seSB9XG59KVxuKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG9uU2NyZWVuQ29uc29sZSh7XG4gIGJ1dHRvblN0eWxlID0ge30sXG4gIGNvbnNvbGVTdHlsZSA9IHt9LFxuICBvcHRpb25zID0ge31cbn0gPSB7fSkge1xuICBjb25zdCBidXR0b24gPSBjcmVhdGVCdXR0b24oe1xuICAgIG9wdGlvbnMsXG4gICAgYnV0dG9uU3R5bGVcbiAgfSk7XG4gIGNvbnN0IGNvbnNvbGUgPSBjcmVhdGVDb25zb2xlKHtcbiAgICBjb25zb2xlU3R5bGU6IHtcbiAgICAgIC4uLmNvbnNvbGVTdHlsZSxcbiAgICAgIGJ0bkhlaWdodDogYnV0dG9uU3R5bGUuaGVpZ2h0LFxuICAgICAgYnRuU3RhcnQ6IGJ1dHRvblN0eWxlLnN0YXJ0XG4gICAgfSxcbiAgICBvcHRpb25zXG4gIH0pO1xuXG4gIGNvbnNvbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIH0pO1xuXG4gIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBpZiAoIWJ1dHRvbi5jb250YWlucyhjb25zb2xlKSkge1xuICAgICAgYnV0dG9uLmFwcGVuZENoaWxkKGNvbnNvbGUpO1xuICAgICAgY29uc29sZS5zY3JvbGxUb3AgPSBjb25zb2xlLnNjcm9sbEhlaWdodCAtIGNvbnNvbGUuY2xpZW50SGVpZ2h0O1xuICAgIH0gZWxzZSB7XG4gICAgICBidXR0b24ucmVtb3ZlQ2hpbGQoY29uc29sZSk7XG4gICAgfVxuICB9KTtcblxuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGJ1dHRvbik7XG4gIGNvbnN0IHJlbGVhc2VDb25zb2xlID0gY2FwdHVyZUNvbnNvbGUoY29uc29sZSwgb3B0aW9ucyk7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIHJlbGVhc2UoKSB7XG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChidXR0b24pO1xuICAgIHJlbGVhc2VDb25zb2xlKCk7XG4gIH07XG59XG4iLCJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRlbXBsYXRlKHN0cmluZ3MsIC4uLmtleXMpIHtcbiAgcmV0dXJuICgoLi4udmFsdWVzKSA9PiB7XG4gICAgY29uc3QgZGljdCA9IHZhbHVlc1t2YWx1ZXMubGVuZ3RoIC0gMV0gfHwge307XG4gICAgY29uc3QgcmVzdWx0ID0gW3N0cmluZ3NbMF1dO1xuICAgIGtleXMuZm9yRWFjaCgoa2V5LCBpKSA9PiB7XG4gICAgICBjb25zdCB2YWx1ZSA9IE51bWJlci5pc0ludGVnZXIoa2V5KSA/IHZhbHVlc1trZXldIDogZGljdFtrZXldO1xuICAgICAgcmVzdWx0LnB1c2godmFsdWUsIHN0cmluZ3NbaSArIDFdKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0LmpvaW4oJycpO1xuICB9KTtcbn1cbiIsIlxuLy8gaHR0cDovL3JhZ2Fud2FsZC5jb20vMjAxNS8xMi8zMS90aGlzLWlzLW5vdC1hbi1lc3NheS1hYm91dC10cmFpdHMtaW4tamF2YXNjcmlwdC5odG1sXG5cbi8qXG5cbmNsYXNzIEEge1xuICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgdGhpcy5pbml0KC4uLmFyZ3MpO1xuICB9XG59XG5cbmNsYXNzIEIgZXh0ZW5kcyBBIHtcbiAgaW5pdCh4KSB7XG4gICAgdGhpcy5feCA9IHg7XG4gIH1cbiAgZ2V0WCgpIHtcbiAgICByZXR1cm4gdGhpcy5feDtcbiAgfVxuICBzZXRYKHZhbHVlKSB7XG4gICAgdGhpcy5feCA9IHZhbHVlO1xuICB9XG4gIGdldCB4KCkge1xuICAgIHJldHVybiB0aGlzLl94O1xuICB9XG4gIHNldCB4KHZhbHVlKSB7XG4gICAgdGhpcy5feCA9IHZhbHVlO1xuICB9XG59XG5cbmZ1bmN0aW9uIHdpdGhEb3VibGVYKGtsYXNzKSB7XG4gIHJldHVybiBPdmVycmlkZU9yRGVmaW5lKHtcblxuICAgIC8vIG92ZXJyaWRlc1xuICAgIGluaXQob3JpZ2luYWxJbml0LCB4LCB5KSB7XG4gICAgICBvcmlnaW5hbEluaXQoeCk7XG4gICAgICB0aGlzLl95ID0geTtcbiAgICB9LFxuICAgIGdldFgob3JpZ2luYWxHZXRYKSB7XG4gICAgICByZXR1cm4gb3JpZ2luYWxHZXRYKCkgKiAyO1xuICAgIH0sXG4gICAgc2V0WChvcmlnaW5hbFNldFgsIHZhbHVlKSB7XG4gICAgICAvLyB0aGlzLl94ID0gdmFsdWUgKiAyO1xuICAgICAgb3JpZ2luYWxTZXRYKHZhbHVlICogMik7XG4gICAgfSxcbiAgICBnZXQgeCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl94ICogMjtcbiAgICB9LFxuICAgIHNldCB4KHZhbHVlKSB7XG4gICAgICB0aGlzLl94ID0gdmFsdWUgKiAyO1xuICAgIH0sXG5cbiAgICAvLyBuZXcgZGVmaW5pdGlvbnNcbiAgICBzZXQgeSh2YWx1ZSkge1xuICAgICAgdGhpcy5feSA9IHZhbHVlICogMjtcbiAgICB9LFxuICAgIGdldCB5KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3kgKiAyO1xuICAgIH0sXG4gICAgaGVsbG8oKSB7XG4gICAgICByZXR1cm4gYGhlbGxvICR7dGhpcy5feH0gYW5kICR7dGhpcy55fWA7XG4gICAgfVxuICB9KShrbGFzcyk7XG59XG5cbkIgPSB3aXRoRG91YmxlWChCKTtcblxuY29uc3QgYiA9IG5ldyBCKDIsIDUpO1xuY29uc29sZS5sb2coYi54KTsgLy8gNFxuY29uc29sZS5sb2coYi5nZXRYKCkpOyAvLyA0XG5cbmIuc2V0WCgzKTtcbi8vIGIueCA9IDM7XG5jb25zb2xlLmxvZyhiLngpOyAvLyAxMlxuY29uc29sZS5sb2coYi5nZXRYKCkpOyAvLyAxMlxuXG4vLyBuZXdcbmNvbnNvbGUubG9nKGIueSk7IC8vIDEwXG5iLnkgPSA5O1xuY29uc29sZS5sb2coYi5oZWxsbygpKTsgLy8gaGVsbG8gNiBhbmQgMzZcblxuKi9cblxuZnVuY3Rpb24gT3ZlcnJpZGVPckRlZmluZShiZWhhdmlvdXIpIHtcbiAgY29uc3QgaW5zdGFuY2VLZXlzID0gUmVmbGVjdC5vd25LZXlzKGJlaGF2aW91cik7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIGRlZmluZShrbGFzcykge1xuICAgIGluc3RhbmNlS2V5cy5mb3JFYWNoKChwcm9wZXJ0eSkgPT4ge1xuXG4gICAgICBjb25zdCBuZXdQcm9wZXJ0eURlc2NyaXB0b3IgPVxuICAgICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGJlaGF2aW91ciwgcHJvcGVydHkpO1xuICAgICAgY29uc3Qgb3JpZ2luYWxQcm9wZXJ0eURlc2NyaXB0b3IgPVxuICAgICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGtsYXNzLnByb3RvdHlwZSwgcHJvcGVydHkpO1xuXG4gICAgICBjb25zdCB7XG4gICAgICAgIHZhbHVlOiBuZXdWYWx1ZSxcbiAgICAgICAgZ2V0OiBuZXdHZXR0ZXIsXG4gICAgICAgIHNldDogbmV3U2V0dGVyXG4gICAgICB9ID0gbmV3UHJvcGVydHlEZXNjcmlwdG9yO1xuXG4gICAgICBpZiAoIW9yaWdpbmFsUHJvcGVydHlEZXNjcmlwdG9yKSB7XG4gICAgICAgIGlmIChuZXdWYWx1ZSkge1xuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShrbGFzcy5wcm90b3R5cGUsIHByb3BlcnR5LCB7XG4gICAgICAgICAgICB2YWx1ZTogbmV3VmFsdWUsXG4gICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShrbGFzcy5wcm90b3R5cGUsIHByb3BlcnR5LCB7XG4gICAgICAgICAgICBnZXQ6IG5ld0dldHRlcixcbiAgICAgICAgICAgIHNldDogbmV3U2V0dGVyLFxuICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHtcbiAgICAgICAgICB2YWx1ZTogb3JpZ2luYWxWYWx1ZSxcbiAgICAgICAgICB3cml0YWJsZTogb3JpZ2luYWxXcml0YWJsZSxcbiAgICAgICAgICBnZXQ6IG9yaWdpbmFsR2V0dGVyLFxuICAgICAgICAgIHNldDogb3JpZ2luYWxTZXR0ZXIsXG4gICAgICAgICAgZW51bWVyYWJsZTogb3JpZ2luYWxFbnVtZXJhYmxlLFxuICAgICAgICAgIGNvbmZpZ3VyYWJsZTogb3JpZ2luYWxDb25maWd1cmFibGVcbiAgICAgICAgfSA9IG9yaWdpbmFsUHJvcGVydHlEZXNjcmlwdG9yO1xuXG4gICAgICAgIGlmIChuZXdWYWx1ZSkge1xuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShrbGFzcy5wcm90b3R5cGUsIHByb3BlcnR5LCB7XG4gICAgICAgICAgICB2YWx1ZSguLi5hcmdzKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGJvdW5kZWRWYWx1ZSA9IG9yaWdpbmFsVmFsdWUuYmluZCh0aGlzKTtcbiAgICAgICAgICAgICAgcmV0dXJuIG5ld1ZhbHVlLmNhbGwodGhpcywgYm91bmRlZFZhbHVlLCAuLi5hcmdzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB3cml0YWJsZTogb3JpZ2luYWxXcml0YWJsZSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IG9yaWdpbmFsRW51bWVyYWJsZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogb3JpZ2luYWxDb25maWd1cmFibGUsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGtsYXNzLnByb3RvdHlwZSwgcHJvcGVydHksIHtcbiAgICAgICAgICAgIGdldDogbmV3R2V0dGVyIHx8IG9yaWdpbmFsR2V0dGVyLFxuICAgICAgICAgICAgc2V0OiBuZXdTZXR0ZXIgfHwgb3JpZ2luYWxTZXR0ZXIsXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiBvcmlnaW5hbEVudW1lcmFibGUsXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IG9yaWdpbmFsQ29uZmlndXJhYmxlLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGtsYXNzO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBPdmVycmlkZU9yRGVmaW5lO1xuIiwiXG4vLyBIZWxwZXJzXG5pbXBvcnQgZGJ1aVdlYkNvbXBvbmVudHNTZXRVcCBmcm9tICcuL2hlbHBlcnMvZGJ1aVdlYkNvbXBvbmVudHNTZXR1cCc7XG5cbi8vIEludGVybmFsc1xuaW1wb3J0IGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbiBmcm9tICcuL2ludGVybmFscy9lbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24nO1xuXG4vLyBDb21wb25lbnRCYXNlXG5pbXBvcnQgZ2V0REJVSVdlYkNvbXBvbmVudEJhc2UgZnJvbSAnLi9jb21wb25lbnRzL0RCVUlXZWJDb21wb25lbnRCYXNlL0RCVUlXZWJDb21wb25lbnRCYXNlJztcblxuLy8gQmVoYXZpb3Vyc1xuaW1wb3J0IEZvY3VzYWJsZSBmcm9tICcuL2JlaGF2aW91cnMvRm9jdXNhYmxlJztcblxuLy8gU2VydmljZXNcbmltcG9ydCBnZXREQlVJTG9jYWxlU2VydmljZSBmcm9tICcuL3NlcnZpY2VzL0RCVUlMb2NhbGVTZXJ2aWNlJztcbmltcG9ydCBnZXREQlVJSTE4blNlcnZpY2UgZnJvbSAnLi9zZXJ2aWNlcy9EQlVJSTE4blNlcnZpY2UnO1xuXG4vLyBVdGlsc1xuaW1wb3J0IGZvcm1hdHRlcnMgZnJvbSAnLi91dGlscy9mb3JtYXR0ZXJzJztcbmltcG9ydCB0cmFpdHMgZnJvbSAnLi91dGlscy90cmFpdHMnO1xuaW1wb3J0IHRlbXBsYXRlIGZyb20gJy4vdXRpbHMvdGVtcGxhdGUnO1xuaW1wb3J0IG9uU2NyZWVuQ29uc29sZSBmcm9tICcuL3V0aWxzL29uU2NyZWVuQ29uc29sZSc7XG5cbi8vIENvbXBvbmVudHNcbmltcG9ydCBnZXREQlVJV2ViQ29tcG9uZW50RHVtbXkgZnJvbSAnLi9jb21wb25lbnRzL0RCVUlXZWJDb21wb25lbnREdW1teS9EQlVJV2ViQ29tcG9uZW50RHVtbXknO1xuaW1wb3J0IGdldERCVUlXZWJDb21wb25lbnREdW1teVBhcmVudCBmcm9tICcuL2NvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50L0RCVUlXZWJDb21wb25lbnREdW1teVBhcmVudCc7XG5pbXBvcnQgZ2V0REJVSVdlYkNvbXBvbmVudEZvcm1JbnB1dFRleHQgZnJvbSAnLi9jb21wb25lbnRzL0RCVUlXZWJDb21wb25lbnRGb3JtSW5wdXRUZXh0L0RCVUlXZWJDb21wb25lbnRGb3JtSW5wdXRUZXh0JztcbmltcG9ydCBnZXREQlVJV2ViQ29tcG9uZW50SWNvbiBmcm9tICcuL2NvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudEljb24vREJVSVdlYkNvbXBvbmVudEljb24nO1xuXG5jb25zdCByZWdpc3RyYXRpb25zID0ge1xuICBbZ2V0REJVSVdlYkNvbXBvbmVudER1bW15LnJlZ2lzdHJhdGlvbk5hbWVdOlxuICAgIGdldERCVUlXZWJDb21wb25lbnREdW1teSxcbiAgW2dldERCVUlXZWJDb21wb25lbnREdW1teVBhcmVudC5yZWdpc3RyYXRpb25OYW1lXTpcbiAgICBnZXREQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQsXG4gIFtnZXREQlVJV2ViQ29tcG9uZW50Rm9ybUlucHV0VGV4dC5yZWdpc3RyYXRpb25OYW1lXTpcbiAgICBnZXREQlVJV2ViQ29tcG9uZW50Rm9ybUlucHV0VGV4dCxcbiAgW2dldERCVUlXZWJDb21wb25lbnRJY29uLnJlZ2lzdHJhdGlvbk5hbWVdOlxuICAgIGdldERCVUlXZWJDb21wb25lbnRJY29uXG59O1xuXG4vKlxuVGhpcyBoZWxwZXIgZnVuY3Rpb24gaXMganVzdCBmb3IgY29udmVuaWVuY2UuXG5Vc2luZyBpdCBpbXBsaWVzIHRoYXQgZW50aXJlIERCVUlXZWJDb21wb25lbnRzIGxpYnJhcnkgaXMgYWxyZWFkeSBsb2FkZWQuXG5JdCBpcyB1c2VmdWwgZXNwZWNpYWxseSB3aGVuIHdvcmtpbmcgd2l0aCBkaXN0cmlidXRpb24gYnVpbGQuXG5JZiBvbmUgd2FudHMgdG8gbG9hZCBqdXN0IG9uZSB3ZWItY29tcG9uZW50IG9yIGEgc3Vic2V0IG9mIHdlYi1jb21wb25lbnRzXG50aGV5IHNob3VsZCBiZSBsb2FkZWQgZnJvbSBub2RlX21vZHVsZXMvZGV2LWJveC11aS93ZWItY29tcG9uZW50cyBieSB0aGVpciBwYXRoXG5leDpcbmltcG9ydCBTb21lQ29tcG9uZW50TG9hZGVyIGZyb20gbm9kZV9tb2R1bGVzL2Rldi1ib3gtdWkvd2ViLWNvbXBvbmVudHMvcGF0aC90by9Tb21lQ29tcG9uZW50O1xuKi9cbmZ1bmN0aW9uIHF1aWNrU2V0dXBBbmRMb2FkKHdpbiA9IHdpbmRvdykge1xuICAvKipcbiAgICogQHBhcmFtIGNvbXBvbmVudHMgT2JqZWN0IHtcbiAgICogIHJlZ2lzdHJhdGlvbk5hbWUsXG4gICAqICBjb21wb25lbnRTdHlsZVxuICAgKiB9XG4gICAqIEByZXR1cm4gT2JqZWN0IHsgPHJlZ2lzdHJhdGlvbk5hbWU+LCA8Y29tcG9uZW50Q2xhc3M+IH1cbiAgICovXG4gIHJldHVybiBmdW5jdGlvbiAoY29tcG9uZW50cykge1xuICAgIHJldHVybiBkYnVpV2ViQ29tcG9uZW50c1NldFVwKHdpbikoY29tcG9uZW50cylcbiAgICAgIC5yZWR1Y2UoKGFjYywgeyByZWdpc3RyYXRpb25OYW1lIH0pID0+IHtcbiAgICAgICAgY29uc3QgY29tcG9uZW50Q2xhc3MgPSByZWdpc3RyYXRpb25zW3JlZ2lzdHJhdGlvbk5hbWVdKHdpbmRvdyk7XG4gICAgICAgIGNvbXBvbmVudENsYXNzLnJlZ2lzdGVyU2VsZigpO1xuICAgICAgICBhY2NbcmVnaXN0cmF0aW9uTmFtZV0gPSBjb21wb25lbnRDbGFzcztcbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgIH0sIHt9KTtcbiAgfTtcbn1cblxuZXhwb3J0IHtcbiAgcmVnaXN0cmF0aW9ucyxcblxuICAvLyBIZWxwZXJzXG4gIHF1aWNrU2V0dXBBbmRMb2FkLFxuICBkYnVpV2ViQ29tcG9uZW50c1NldFVwLFxuXG4gIC8vIEludGVybmFsc1xuICBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24sXG5cbiAgLy8gQ29tcG9uZW50QmFzZVxuICBnZXREQlVJV2ViQ29tcG9uZW50QmFzZSxcblxuICAvLyBCZWhhdmlvdXJzXG4gIEZvY3VzYWJsZSxcblxuICAvLyBTZXJ2aWNlc1xuICBnZXREQlVJTG9jYWxlU2VydmljZSxcbiAgZ2V0REJVSUkxOG5TZXJ2aWNlLFxuXG4gIC8vIFV0aWxzXG4gIGZvcm1hdHRlcnMsXG4gIHRyYWl0cyxcbiAgdGVtcGxhdGUsXG4gIG9uU2NyZWVuQ29uc29sZSxcblxuICAvLyBDb21wb25lbnRzXG4gIGdldERCVUlXZWJDb21wb25lbnREdW1teSxcbiAgZ2V0REJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50LFxuICBnZXREQlVJV2ViQ29tcG9uZW50Rm9ybUlucHV0VGV4dCxcbiAgZ2V0REJVSVdlYkNvbXBvbmVudEljb25cbn07XG5cbi8qIGVzbGludCBuby1jb25zb2xlOiAwICovXG5cbmxldCBidWlsZCA9ICdwcm9kdWN0aW9uJztcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgYnVpbGQgPSAnZGV2ZWxvcCc7XG59XG5cbmNvbnNvbGUubG9nKGBVc2luZyBEQlVJV2ViQ29tcG9uZW50c0Rpc3RMaWIgJHtidWlsZH0gYnVpbGQuYCk7XG5cbiJdfQ==
