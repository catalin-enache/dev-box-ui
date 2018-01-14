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
exports.default = dbuiWebComponentsSetUp;

var _appendStyle = require('../internals/appendStyle');

var _appendStyle2 = _interopRequireDefault(_appendStyle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function dbuiWebComponentsSetUp(win) {
  return {
    appendStyle: (0, _appendStyle2.default)(win)
  };
}

},{"../internals/appendStyle":9}],9:[function(require,module,exports){
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
Using this function implies entire DBUIWebComponents library
is already loaded.
It is useful especially when working with distribution build.
If you want to load just one web-component or a subset of web-components
load them from node_modules by their path
ex:
import SomeComponentLoader from node_modules/dev-box-ui/build/src/lib/webcomponents/SomeComponent;
*/


// Behaviours


// Internals
function quickSetupAndLoad(win = window) {
  return function (components) {
    const ret = {};
    components.forEach(({ registrationName, componentStyle }) => {
      (0, _dbuiWebComponentsSetup2.default)(win).appendStyle(registrationName, componentStyle);
      const componentClass = registrations[registrationName](window);
      componentClass.registerSelf();
      ret[registrationName] = componentClass;
    });
    return ret;
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

},{"./behaviours/Focusable":2,"./components/DBUIWebComponentBase/DBUIWebComponentBase":3,"./components/DBUIWebComponentDummy/DBUIWebComponentDummy":4,"./components/DBUIWebComponentDummyParent/DBUIWebComponentDummyParent":5,"./components/DBUIWebComponentFormInputText/DBUIWebComponentFormInputText":6,"./components/DBUIWebComponentIcon/DBUIWebComponentIcon":7,"./helpers/dbuiWebComponentsSetup":8,"./internals/ensureSingleRegistration":10,"./services/DBUII18nService":11,"./services/DBUILocaleService":12,"./utils/formatters":13,"./utils/onScreenConsole":14,"./utils/template":15,"./utils/traits":16}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwic3JjL2xpYi93ZWItY29tcG9uZW50cy9iZWhhdmlvdXJzL0ZvY3VzYWJsZS5qcyIsInNyYy9saWIvd2ViLWNvbXBvbmVudHMvY29tcG9uZW50cy9EQlVJV2ViQ29tcG9uZW50QmFzZS9EQlVJV2ViQ29tcG9uZW50QmFzZS5qcyIsInNyYy9saWIvd2ViLWNvbXBvbmVudHMvY29tcG9uZW50cy9EQlVJV2ViQ29tcG9uZW50RHVtbXkvREJVSVdlYkNvbXBvbmVudER1bW15LmpzIiwic3JjL2xpYi93ZWItY29tcG9uZW50cy9jb21wb25lbnRzL0RCVUlXZWJDb21wb25lbnREdW1teVBhcmVudC9EQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQuanMiLCJzcmMvbGliL3dlYi1jb21wb25lbnRzL2NvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudEZvcm1JbnB1dFRleHQvREJVSVdlYkNvbXBvbmVudEZvcm1JbnB1dFRleHQuanMiLCJzcmMvbGliL3dlYi1jb21wb25lbnRzL2NvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudEljb24vREJVSVdlYkNvbXBvbmVudEljb24uanMiLCJzcmMvbGliL3dlYi1jb21wb25lbnRzL2hlbHBlcnMvZGJ1aVdlYkNvbXBvbmVudHNTZXR1cC5qcyIsInNyYy9saWIvd2ViLWNvbXBvbmVudHMvaW50ZXJuYWxzL2FwcGVuZFN0eWxlLmpzIiwic3JjL2xpYi93ZWItY29tcG9uZW50cy9pbnRlcm5hbHMvZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uLmpzIiwic3JjL2xpYi93ZWItY29tcG9uZW50cy9zZXJ2aWNlcy9EQlVJSTE4blNlcnZpY2UuanMiLCJzcmMvbGliL3dlYi1jb21wb25lbnRzL3NlcnZpY2VzL0RCVUlMb2NhbGVTZXJ2aWNlLmpzIiwic3JjL2xpYi93ZWItY29tcG9uZW50cy91dGlscy9mb3JtYXR0ZXJzLmpzIiwic3JjL2xpYi93ZWItY29tcG9uZW50cy91dGlscy9vblNjcmVlbkNvbnNvbGUuanMiLCJzcmMvbGliL3dlYi1jb21wb25lbnRzL3V0aWxzL3RlbXBsYXRlLmpzIiwic3JjL2xpYi93ZWItY29tcG9uZW50cy91dGlscy90cmFpdHMuanMiLCJzcmMvbGliL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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Ozs7QUFDQTs7Ozs7O0FBSkE7OztBQU5BOzs7QUFKQTs7O0FBTkE7O0FBTkE7QUE0QkEsTUFBTSxnQkFBZ0I7QUFDcEIsR0FBQyxnQ0FBeUIsZ0JBQTFCLGtDQURvQjtBQUdwQixHQUFDLHNDQUErQixnQkFBaEMsd0NBSG9CO0FBS3BCLEdBQUMsd0NBQWlDLGdCQUFsQywwQ0FMb0I7QUFPcEIsR0FBQywrQkFBd0IsZ0JBQXpCO0FBUG9CLENBQXRCOztBQVdBOzs7Ozs7Ozs7OztBQTlCQTs7O0FBTkE7QUE2Q0EsU0FBUyxpQkFBVCxDQUEyQixNQUFNLE1BQWpDLEVBQXlDO0FBQ3ZDLFNBQU8sVUFBVSxVQUFWLEVBQXNCO0FBQzNCLFVBQU0sTUFBTSxFQUFaO0FBQ0EsZUFBVyxPQUFYLENBQW1CLENBQUMsRUFBRSxnQkFBRixFQUFvQixjQUFwQixFQUFELEtBQTBDO0FBQzNELDRDQUF1QixHQUF2QixFQUE0QixXQUE1QixDQUF3QyxnQkFBeEMsRUFBMEQsY0FBMUQ7QUFDQSxZQUFNLGlCQUFpQixjQUFjLGdCQUFkLEVBQWdDLE1BQWhDLENBQXZCO0FBQ0EscUJBQWUsWUFBZjtBQUNBLFVBQUksZ0JBQUosSUFBd0IsY0FBeEI7QUFDRCxLQUxEO0FBTUEsV0FBTyxHQUFQO0FBQ0QsR0FURDtBQVVEOztRQUdDLGEsR0FBQSxhO1FBR0EsaUIsR0FBQSxpQjtRQUNBLHNCO1FBR0Esd0I7UUFHQSx1QjtRQUdBLFM7UUFHQSxvQjtRQUNBLGtCO1FBR0EsVTtRQUNBLE07UUFDQSxRO1FBQ0EsZTtRQUdBLHdCO1FBQ0EsOEI7UUFDQSxnQztRQUNBLHVCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCJcbmNvbnN0IHJlYWRPbmx5UHJvcGVydGllcyA9IFsnZm9jdXNlZCddO1xuXG5jb25zdCBFUlJPUl9NRVNTQUdFUyA9IHtcbiAgZm9jdXNlZDogYCdmb2N1c2VkJyBwcm9wZXJ0eSBpcyByZWFkLW9ubHkgYXMgaXQgaXMgY29udHJvbGxlZCBieSB0aGUgY29tcG9uZW50LlxuSWYgeW91IHdhbnQgdG8gc2V0IGZvY3VzIHByb2dyYW1tYXRpY2FsbHkgY2FsbCAuZm9jdXMoKSBtZXRob2Qgb24gY29tcG9uZW50LlxuYFxufTtcblxuLyoqXG4gKiBXaGVuIGFuIGlubmVyIGZvY3VzYWJsZSBpcyBmb2N1c2VkIChleDogdmlhIGNsaWNrKSB0aGUgZW50aXJlIGNvbXBvbmVudCBnZXRzIGZvY3VzZWQuXG4gKiBXaGVuIHRoZSBjb21wb25lbnQgZ2V0cyBmb2N1c2VkIChleDogdmlhIHRhYikgdGhlIGZpcnN0IGlubmVyIGZvY3VzYWJsZSBnZXRzIGZvY3VzZWQgdG9vLlxuICogV2hlbiB0aGUgY29tcG9uZW50IGdldHMgZGlzYWJsZWQgaXQgZ2V0cyBibHVycmVkIHRvbyBhbmQgYWxsIGlubmVyIGZvY3VzYWJsZXMgZ2V0IGRpc2FibGVkIGFuZCBibHVycmVkLlxuICogV2hlbiBkaXNhYmxlZCB0aGUgY29tcG9uZW50IGNhbm5vdCBiZSBmb2N1c2VkLlxuICogV2hlbiBlbmFibGVkIHRoZSBjb21wb25lbnQgY2FuIGJlIGZvY3VzZWQuXG4gKiBAcGFyYW0gS2xhc3NcbiAqIEByZXR1cm5zIHtGb2N1c2FibGV9XG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRm9jdXNhYmxlKEtsYXNzKSB7XG5cbiAgS2xhc3MuY29tcG9uZW50U3R5bGUgKz0gYFxuICA6aG9zdChbZGlzYWJsZWRdKSB7XG4gICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICBvcGFjaXR5OiAwLjU7XG4gICAgXG4gICAgLXdlYmtpdC10b3VjaC1jYWxsb3V0OiBub25lO1xuICAgIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLWtodG1sLXVzZXItc2VsZWN0OiBub25lO1xuICAgIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLW1zLXVzZXItc2VsZWN0OiBub25lO1xuICAgIHVzZXItc2VsZWN0OiBub25lO1xuICB9XG4gIFxuICA6aG9zdChbZGlzYWJsZWRdKSAqIHtcbiAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgfVxuICBgO1xuXG4gIGNsYXNzIEZvY3VzYWJsZSBleHRlbmRzIEtsYXNzIHtcblxuICAgIHN0YXRpYyBnZXQgbmFtZSgpIHtcbiAgICAgIHJldHVybiBzdXBlci5uYW1lO1xuICAgIH1cblxuICAgIGdldCBpbnN0YW5jZVByb3BlcnRpZXNUb0RlZmluZSgpIHtcbiAgICAgIGNvbnN0IGluaGVyaXRlZEluc3RhbmNlUHJvcGVydGllc1RvRGVmaW5lID1cbiAgICAgICAgc3VwZXIuaW5zdGFuY2VQcm9wZXJ0aWVzVG9EZWZpbmUgfHwge307XG4gICAgICBjb25zdCBuZXdJbnN0YW5jZVByb3BlcnRpZXNUb0RlZmluZSA9IHt9O1xuICAgICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgIC8vIHRhYmluZGV4IGRlZmluZXMgZm9jdXNhYmxlIGJlaGF2aW91clxuICAgICAgICBuZXdJbnN0YW5jZVByb3BlcnRpZXNUb0RlZmluZS50YWJpbmRleCA9IDA7XG4gICAgICB9XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5pbmhlcml0ZWRJbnN0YW5jZVByb3BlcnRpZXNUb0RlZmluZSxcbiAgICAgICAgLi4ubmV3SW5zdGFuY2VQcm9wZXJ0aWVzVG9EZWZpbmVcbiAgICAgIH07XG4gICAgfVxuXG4gICAgc3RhdGljIGdldCBwcm9wZXJ0aWVzVG9VcGdyYWRlKCkge1xuICAgICAgY29uc3QgaW5oZXJpdGVkUHJvcGVydGllc1RvVXBncmFkZSA9IHN1cGVyLnByb3BlcnRpZXNUb1VwZ3JhZGUgfHwgW107XG4gICAgICAvLyBUaGUgcmVhc29uIGZvciB1cGdyYWRpbmcgJ2ZvY3VzZWQnIGlzIG9ubHkgdG8gc2hvdyBhbiB3YXJuaW5nXG4gICAgICAvLyBpZiB0aGUgY29uc3VtZXIgb2YgdGhlIGNvbXBvbmVudCBhdHRlbXB0ZWQgdG8gc2V0IGZvY3VzIHByb3BlcnR5XG4gICAgICAvLyB3aGljaCBpcyByZWFkLW9ubHkuXG4gICAgICByZXR1cm4gWy4uLmluaGVyaXRlZFByb3BlcnRpZXNUb1VwZ3JhZGUsICdmb2N1c2VkJywgJ2Rpc2FibGVkJ107XG4gICAgfVxuXG4gICAgc3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7XG4gICAgICBjb25zdCBpbmhlcml0ZWRPYnNlcnZlZEF0dHJpYnV0ZXMgPSBzdXBlci5vYnNlcnZlZEF0dHJpYnV0ZXMgfHwgW107XG4gICAgICByZXR1cm4gWy4uLmluaGVyaXRlZE9ic2VydmVkQXR0cmlidXRlcywgJ2Rpc2FibGVkJ107XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgICAgc3VwZXIoLi4uYXJncyk7XG5cbiAgICAgIHRoaXMuX2N1cnJlbnRJbm5lckZvY3VzZWQgPSBudWxsO1xuICAgICAgdGhpcy5fb25Jbm5lckZvY3VzYWJsZUZvY3VzZWQgPSB0aGlzLl9vbklubmVyRm9jdXNhYmxlRm9jdXNlZC5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5fb25Gb2N1cyA9IHRoaXMuX29uRm9jdXMuYmluZCh0aGlzKTtcbiAgICAgIHRoaXMuX29uQmx1ciA9IHRoaXMuX29uQmx1ci5iaW5kKHRoaXMpO1xuICAgIH1cblxuICAgIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpIHtcbiAgICAgIHN1cGVyLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayAmJlxuICAgICAgICBzdXBlci5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlKTtcblxuICAgICAgY29uc3QgaGFzVmFsdWUgPSBuZXdWYWx1ZSAhPT0gbnVsbDtcbiAgICAgIGlmIChuYW1lID09PSAnZGlzYWJsZWQnKSB7XG4gICAgICAgIGhhc1ZhbHVlID8gdGhpcy5fYXBwbHlEaXNhYmxlZFNpZGVFZmZlY3RzKCkgOiB0aGlzLl9hcHBseUVuYWJsZWRTaWRlRWZmZWN0cygpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgc3VwZXIuY29ubmVjdGVkQ2FsbGJhY2sgJiZcbiAgICAgICAgc3VwZXIuY29ubmVjdGVkQ2FsbGJhY2soKTtcblxuICAgICAgcmVhZE9ubHlQcm9wZXJ0aWVzLmZvckVhY2goKHJlYWRPbmx5UHJvcGVydHkpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaGFzQXR0cmlidXRlKHJlYWRPbmx5UHJvcGVydHkpKSB7XG4gICAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUocmVhZE9ubHlQcm9wZXJ0eSk7XG4gICAgICAgICAgY29uc29sZS53YXJuKEVSUk9SX01FU1NBR0VTW3JlYWRPbmx5UHJvcGVydHldKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8vIHdoZW4gY29tcG9uZW50IGZvY3VzZWQvYmx1cnJlZFxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIHRoaXMuX29uRm9jdXMpO1xuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgdGhpcy5fb25CbHVyKTtcblxuICAgICAgdGhpcy5faW5uZXJGb2N1c2FibGVzLmZvckVhY2goKGZvY3VzYWJsZSkgPT4ge1xuICAgICAgICAvLyB3aGVuIGlubmVyIGZvY3VzYWJsZSBmb2N1c2VkXG4gICAgICAgIGZvY3VzYWJsZS5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIHRoaXMuX29uSW5uZXJGb2N1c2FibGVGb2N1c2VkKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgc3VwZXIuZGlzY29ubmVjdGVkQ2FsbGJhY2sgJiZcbiAgICAgICAgc3VwZXIuZGlzY29ubmVjdGVkQ2FsbGJhY2soKTtcblxuICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKCdmb2N1cycsIHRoaXMuX29uRm9jdXMpO1xuICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKCdibHVyJywgdGhpcy5fb25CbHVyKTtcblxuICAgICAgdGhpcy5faW5uZXJGb2N1c2FibGVzLmZvckVhY2goKGZvY3VzYWJsZSkgPT4ge1xuICAgICAgICBmb2N1c2FibGUucmVtb3ZlRXZlbnRMaXN0ZW5lcignZm9jdXMnLCB0aGlzLl9vbklubmVyRm9jdXNhYmxlRm9jdXNlZCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyByZWFkLW9ubHlcbiAgICBnZXQgZm9jdXNlZCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmhhc0F0dHJpYnV0ZSgnZm9jdXNlZCcpO1xuICAgIH1cblxuICAgIHNldCBmb2N1c2VkKF8pIHtcbiAgICAgIGNvbnNvbGUud2FybihFUlJPUl9NRVNTQUdFUy5mb2N1c2VkKTtcbiAgICB9XG5cbiAgICBnZXQgZGlzYWJsZWQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5oYXNBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgfVxuXG4gICAgc2V0IGRpc2FibGVkKHZhbHVlKSB7XG4gICAgICBjb25zdCBoYXNWYWx1ZSA9IEJvb2xlYW4odmFsdWUpO1xuICAgICAgaWYgKGhhc1ZhbHVlKSB7XG4gICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICcnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGdldCBfaW5uZXJGb2N1c2FibGVzKCkge1xuICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW5UcmVlLnF1ZXJ5U2VsZWN0b3JBbGwoJ1t0YWJpbmRleF0nKSB8fCBbXTtcbiAgICB9XG5cbiAgICBnZXQgX2ZpcnN0SW5uZXJGb2N1c2FibGUoKSB7XG4gICAgICByZXR1cm4gdGhpcy5jaGlsZHJlblRyZWUucXVlcnlTZWxlY3RvcignW3RhYmluZGV4XScpO1xuICAgIH1cblxuICAgIF9vbklubmVyRm9jdXNhYmxlRm9jdXNlZChldnQpIHtcbiAgICAgIHRoaXMuX2N1cnJlbnRJbm5lckZvY3VzZWQgPSBldnQudGFyZ2V0O1xuICAgIH1cblxuICAgIF9vbkZvY3VzKCkge1xuICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHJldHVybjtcbiAgICAgIC8vIE9ubHkgZm9yIHN0eWxpbmcgcHVycG9zZS5cbiAgICAgIC8vIEZvY3VzZWQgcHJvcGVydHkgaXMgY29udHJvbGxlZCBmcm9tIGluc2lkZS5cbiAgICAgIC8vIEF0dGVtcHQgdG8gc2V0IHRoaXMgcHJvcGVydHkgZnJvbSBvdXRzaWRlIHdpbGwgdHJpZ2dlciBhIHdhcm5pbmdcbiAgICAgIC8vIGFuZCB3aWxsIGJlIGlnbm9yZWRcbiAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdmb2N1c2VkJywgJycpO1xuICAgICAgdGhpcy5fYXBwbHlGb2N1c1NpZGVFZmZlY3RzKCk7XG4gICAgfVxuXG4gICAgX29uQmx1cigpIHtcbiAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCdmb2N1c2VkJyk7XG4gICAgICB0aGlzLl9hcHBseUJsdXJTaWRlRWZmZWN0cygpO1xuICAgIH1cblxuICAgIF9hcHBseUZvY3VzU2lkZUVmZmVjdHMoKSB7XG4gICAgICBpZiAodGhpcy5fY3VycmVudElubmVyRm9jdXNlZCkge1xuICAgICAgICAvLyBTb21lIGlubmVyIGNvbXBvbmVudCBpcyBhbHJlYWR5IGZvY3VzZWQuXG4gICAgICAgIC8vIE5vIG5lZWQgdG8gc2V0IGZvY3VzIG9uIGFueXRoaW5nLlxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLl9mb2N1c0ZpcnN0SW5uZXJGb2N1c2FibGUoKTtcbiAgICB9XG5cbiAgICBfYXBwbHlCbHVyU2lkZUVmZmVjdHMoKSB7XG4gICAgICBpZiAodGhpcy5fY3VycmVudElubmVyRm9jdXNlZCkge1xuICAgICAgICB0aGlzLl9jdXJyZW50SW5uZXJGb2N1c2VkLmJsdXIoKTtcbiAgICAgICAgdGhpcy5fY3VycmVudElubmVyRm9jdXNlZCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2ZvY3VzRmlyc3RJbm5lckZvY3VzYWJsZSgpIHtcbiAgICAgIGNvbnN0IGZpcnN0SW5uZXJGb2N1c2FibGUgPSB0aGlzLl9maXJzdElubmVyRm9jdXNhYmxlO1xuICAgICAgaWYgKGZpcnN0SW5uZXJGb2N1c2FibGUpIHtcbiAgICAgICAgdGhpcy5fY3VycmVudElubmVyRm9jdXNlZCA9IGZpcnN0SW5uZXJGb2N1c2FibGU7XG4gICAgICAgIGZpcnN0SW5uZXJGb2N1c2FibGUuZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfYXBwbHlEaXNhYmxlZFNpZGVFZmZlY3RzKCkge1xuICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoJ3RhYmluZGV4Jyk7XG4gICAgICB0aGlzLl9pbm5lckZvY3VzYWJsZXMuZm9yRWFjaCgoaW5uZXJGb2N1c2FibGUpID0+IHtcbiAgICAgICAgaW5uZXJGb2N1c2FibGUuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xuICAgICAgICBpZiAoaW5uZXJGb2N1c2FibGUuaGFzQXR0cmlidXRlKCdjb250ZW50ZWRpdGFibGUnKSkge1xuICAgICAgICAgIGlubmVyRm9jdXNhYmxlLnNldEF0dHJpYnV0ZSgnY29udGVudGVkaXRhYmxlJywgJ2ZhbHNlJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaW5uZXJGb2N1c2FibGUuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMuYmx1cigpO1xuICAgIH1cblxuICAgIF9hcHBseUVuYWJsZWRTaWRlRWZmZWN0cygpIHtcbiAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICcwJyk7XG4gICAgICB0aGlzLl9pbm5lckZvY3VzYWJsZXMuZm9yRWFjaCgoaW5uZXJGb2N1c2FibGUpID0+IHtcbiAgICAgICAgaW5uZXJGb2N1c2FibGUuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICcwJyk7XG4gICAgICAgIGlmIChpbm5lckZvY3VzYWJsZS5oYXNBdHRyaWJ1dGUoJ2NvbnRlbnRlZGl0YWJsZScpKSB7XG4gICAgICAgICAgaW5uZXJGb2N1c2FibGUuc2V0QXR0cmlidXRlKCdjb250ZW50ZWRpdGFibGUnLCAndHJ1ZScpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlubmVyRm9jdXNhYmxlLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBGb2N1c2FibGU7XG59XG4iLCJcbmltcG9ydCBnZXREQlVJTG9jYWxlU2VydmljZSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9EQlVJTG9jYWxlU2VydmljZSc7XG5pbXBvcnQgZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uIGZyb20gJy4uLy4uL2ludGVybmFscy9lbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24nO1xuXG5jb25zdCByZWdpc3RyYXRpb25OYW1lID0gJ0RCVUlXZWJDb21wb25lbnRCYXNlJztcblxuZnVuY3Rpb24gZGVmaW5lQ29tbW9uQ1NTVmFycygpIHtcbiAgY29uc3QgY29tbW9uU3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICBjb21tb25TdHlsZS5pbm5lckhUTUwgPSBgXG4gIDpyb290IHtcbiAgICAtLWRidWktd2ViLWNvbXBvbmVudC1nbG9iYWwtYm9yZGVyLXJhZGl1czogNXB4O1xuICAgIC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtaGVpZ2h0OiAzMHB4O1xuICAgIC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtY29sb3I6ICMwMDA7XG4gICAgLS1kYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC1iYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICAtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWJvcmRlci1jb2xvcjogI2NjYztcbiAgICAtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWJvcmRlci1zdHlsZTogc29saWQ7XG4gICAgLS1kYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC1ib3JkZXItd2lkdGg6IDFweDtcbiAgfVxuICBgO1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdoZWFkJykuYXBwZW5kQ2hpbGQoY29tbW9uU3R5bGUpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXREQlVJV2ViQ29tcG9uZW50QmFzZSh3aW4pIHtcbiAgY29uc3QgTG9jYWxlU2VydmljZSA9IGdldERCVUlMb2NhbGVTZXJ2aWNlKHdpbik7XG5cbiAgcmV0dXJuIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbih3aW4sIHJlZ2lzdHJhdGlvbk5hbWUsICgpID0+IHtcbiAgICBkZWZpbmVDb21tb25DU1NWYXJzKCk7XG5cbiAgICBjb25zdCB7IGRvY3VtZW50LCBIVE1MRWxlbWVudCwgY3VzdG9tRWxlbWVudHMgfSA9IHdpbjtcblxuICAgIGNsYXNzIERCVUlXZWJDb21wb25lbnRCYXNlIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuXG4gICAgICBzdGF0aWMgZ2V0IHJlZ2lzdHJhdGlvbk5hbWUoKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigncmVnaXN0cmF0aW9uTmFtZSBtdXN0IGJlIGRlZmluZWQgaW4gZGVyaXZlZCBjbGFzc2VzJyk7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgdGVtcGxhdGVJbm5lckhUTUwoKSB7XG4gICAgICAgIHJldHVybiAnPHN0eWxlPjwvc3R5bGU+PHNsb3Q+PC9zbG90Pic7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgZGVwZW5kZW5jaWVzKCkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgdXNlU2hhZG93KCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCBwcm9wZXJ0aWVzVG9VcGdyYWRlKCkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgcHJvcGVydGllc1RvRGVmaW5lKCkge1xuICAgICAgICByZXR1cm4ge307XG4gICAgICB9XG5cbiAgICAgIGdldCBpbnN0YW5jZVByb3BlcnRpZXNUb0RlZmluZSgpIHtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgfVxuXG4gICAgICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgY29uc3QgeyB1c2VTaGFkb3cgfSA9IHRoaXMuY29uc3RydWN0b3I7XG4gICAgICAgIGlmICh1c2VTaGFkb3cpIHtcbiAgICAgICAgICB0aGlzLmF0dGFjaFNoYWRvdyh7XG4gICAgICAgICAgICBtb2RlOiAnb3BlbicsXG4gICAgICAgICAgICAvLyBkZWxlZ2F0ZXNGb2N1czogdHJ1ZVxuICAgICAgICAgICAgLy8gTm90IHdvcmtpbmcgb24gSVBhZCBzbyB3ZSBkbyBhbiB3b3JrYXJvdW5kXG4gICAgICAgICAgICAvLyBieSBzZXR0aW5nIFwiZm9jdXNlZFwiIGF0dHJpYnV0ZSB3aGVuIG5lZWRlZC5cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9pc0Nvbm5lY3RlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9pbnNlcnRUZW1wbGF0ZSgpO1xuXG4gICAgICAgIHRoaXMuY29ubmVjdGVkQ2FsbGJhY2sgPSB0aGlzLmNvbm5lY3RlZENhbGxiYWNrLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuZGlzY29ubmVjdGVkQ2FsbGJhY2sgPSB0aGlzLmRpc2Nvbm5lY3RlZENhbGxiYWNrLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuX2hhbmRsZUxvY2FsZUNoYW5nZSA9IHRoaXMuX2hhbmRsZUxvY2FsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm9uTG9jYWxlQ2hhbmdlICYmICh0aGlzLm9uTG9jYWxlQ2hhbmdlID0gdGhpcy5vbkxvY2FsZUNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy51bnJlZ2lzdGVyTG9jYWxlQ2hhbmdlID0gbnVsbDtcblxuICAgICAgICAvLyBwcm92aWRlIHN1cHBvcnQgZm9yIHRyYWl0cyBpZiBhbnkgYXMgdGhleSBjYW50IG92ZXJyaWRlIGNvbnN0cnVjdG9yXG4gICAgICAgIHRoaXMuaW5pdCAmJiB0aGlzLmluaXQoLi4uYXJncyk7XG4gICAgICB9XG5cbiAgICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL3dlYi9mdW5kYW1lbnRhbHMvd2ViLWNvbXBvbmVudHMvYmVzdC1wcmFjdGljZXMjbGF6eS1wcm9wZXJ0aWVzXG4gICAgICAvLyBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS93ZWIvZnVuZGFtZW50YWxzL3dlYi1jb21wb25lbnRzL2V4YW1wbGVzL2hvd3RvLWNoZWNrYm94XG4gICAgICAvKiBlc2xpbnQgbm8tcHJvdG90eXBlLWJ1aWx0aW5zOiAwICovXG4gICAgICBfdXBncmFkZVByb3BlcnR5KHByb3ApIHtcbiAgICAgICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXNbcHJvcF07XG4gICAgICAgICAgZGVsZXRlIHRoaXNbcHJvcF07XG4gICAgICAgICAgdGhpc1twcm9wXSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIF9kZWZpbmVQcm9wZXJ0eShrZXksIHZhbHVlKSB7XG4gICAgICAgIGlmICghdGhpcy5oYXNBdHRyaWJ1dGUoa2V5KSkge1xuICAgICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKGtleSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgICB0aGlzLl9pc0Nvbm5lY3RlZCA9IHRydWU7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdiZWZvcmV1bmxvYWQnLCB0aGlzLmRpc2Nvbm5lY3RlZENhbGxiYWNrLCBmYWxzZSk7XG4gICAgICAgIHRoaXMudW5yZWdpc3RlckxvY2FsZUNoYW5nZSA9XG4gICAgICAgICAgTG9jYWxlU2VydmljZS5vbkxvY2FsZUNoYW5nZSh0aGlzLl9oYW5kbGVMb2NhbGVDaGFuZ2UpO1xuICAgICAgICBjb25zdCB7IHByb3BlcnRpZXNUb1VwZ3JhZGUsIHByb3BlcnRpZXNUb0RlZmluZSB9ID0gdGhpcy5jb25zdHJ1Y3RvcjtcbiAgICAgICAgY29uc3QgeyBpbnN0YW5jZVByb3BlcnRpZXNUb0RlZmluZSB9ID0gdGhpcztcbiAgICAgICAgY29uc3QgYWxsUHJvcGVydGllc1RvRGVmaW5lID0ge1xuICAgICAgICAgIC4uLnByb3BlcnRpZXNUb0RlZmluZSxcbiAgICAgICAgICAuLi5pbnN0YW5jZVByb3BlcnRpZXNUb0RlZmluZVxuICAgICAgICB9O1xuICAgICAgICBwcm9wZXJ0aWVzVG9VcGdyYWRlLmZvckVhY2goKHByb3BlcnR5KSA9PiB7XG4gICAgICAgICAgdGhpcy5fdXBncmFkZVByb3BlcnR5KHByb3BlcnR5KTtcbiAgICAgICAgfSk7XG4gICAgICAgIE9iamVjdC5rZXlzKGFsbFByb3BlcnRpZXNUb0RlZmluZSkuZm9yRWFjaCgocHJvcGVydHkpID0+IHtcbiAgICAgICAgICB0aGlzLl9kZWZpbmVQcm9wZXJ0eShwcm9wZXJ0eSwgYWxsUHJvcGVydGllc1RvRGVmaW5lW3Byb3BlcnR5XSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgICAgdGhpcy5faXNDb25uZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy51bnJlZ2lzdGVyTG9jYWxlQ2hhbmdlKCk7XG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdiZWZvcmV1bmxvYWQnLCB0aGlzLmRpc2Nvbm5lY3RlZENhbGxiYWNrLCBmYWxzZSk7XG4gICAgICB9XG5cbiAgICAgIGdldCBjaGlsZHJlblRyZWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLnVzZVNoYWRvdyA/IHRoaXMuc2hhZG93Um9vdCA6IHRoaXM7XG4gICAgICB9XG5cbiAgICAgIF9pbnNlcnRUZW1wbGF0ZSgpIHtcbiAgICAgICAgY29uc3QgeyB0ZW1wbGF0ZSB9ID0gdGhpcy5jb25zdHJ1Y3RvcjtcblxuICAgICAgICBpZiAodGVtcGxhdGUpIHtcbiAgICAgICAgICB0aGlzLmNoaWxkcmVuVHJlZS5hcHBlbmRDaGlsZCh0ZW1wbGF0ZS5jb250ZW50LmNsb25lTm9kZSh0cnVlKSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgX2hhbmRsZUxvY2FsZUNoYW5nZShsb2NhbGUpIHtcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2RpcicsIGxvY2FsZS5kaXIpO1xuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnbGFuZycsIGxvY2FsZS5sYW5nKTtcbiAgICAgICAgdGhpcy5vbkxvY2FsZUNoYW5nZSAmJiB0aGlzLm9uTG9jYWxlQ2hhbmdlKGxvY2FsZSk7XG4gICAgICB9XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzKGtsYXNzKSB7XG4gICAgICBjb25zdCB0ZW1wbGF0ZUlubmVySFRNTCA9IGtsYXNzLnRlbXBsYXRlSW5uZXJIVE1MO1xuICAgICAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAgICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gdGVtcGxhdGVJbm5lckhUTUw7XG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShrbGFzcywgJ3RlbXBsYXRlJywge1xuICAgICAgICBnZXQoKSB7IHJldHVybiB0ZW1wbGF0ZTsgfSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfSk7XG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShrbGFzcywgJ2NvbXBvbmVudFN0eWxlJywge1xuICAgICAgICBnZXQoKSB7XG4gICAgICAgICAgcmV0dXJuIGtsYXNzLnRlbXBsYXRlLmNvbnRlbnQucXVlcnlTZWxlY3Rvcignc3R5bGUnKS5pbm5lckhUTUw7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCh2YWx1ZSkge1xuICAgICAgICAgIGtsYXNzLnRlbXBsYXRlLmNvbnRlbnQucXVlcnlTZWxlY3Rvcignc3R5bGUnKS5pbm5lckhUTUwgPSB2YWx1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBrbGFzcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBSZWdpc3RlcmFibGUoa2xhc3MpIHtcbiAgICAgIGtsYXNzLnJlZ2lzdGVyU2VsZiA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgcmVnaXN0cmF0aW9uTmFtZSA9IGtsYXNzLnJlZ2lzdHJhdGlvbk5hbWU7XG4gICAgICAgIGNvbnN0IGRlcGVuZGVuY2llcyA9IGtsYXNzLmRlcGVuZGVuY2llcztcbiAgICAgICAgLy8gTWFrZSBzdXJlIG91ciBkZXBlbmRlbmNpZXMgYXJlIHJlZ2lzdGVyZWQgYmVmb3JlIHdlIHJlZ2lzdGVyIHNlbGZcbiAgICAgICAgZGVwZW5kZW5jaWVzLmZvckVhY2goKGRlcGVuZGVuY3kpID0+IGRlcGVuZGVuY3kucmVnaXN0ZXJTZWxmKCkpO1xuICAgICAgICAvLyBEb24ndCB0cnkgdG8gcmVnaXN0ZXIgc2VsZiBpZiBhbHJlYWR5IHJlZ2lzdGVyZWRcbiAgICAgICAgaWYgKGN1c3RvbUVsZW1lbnRzLmdldChyZWdpc3RyYXRpb25OYW1lKSkgcmV0dXJuIHJlZ2lzdHJhdGlvbk5hbWU7XG4gICAgICAgIC8vIEdpdmUgYSBjaGFuY2UgdG8gb3ZlcnJpZGUgd2ViLWNvbXBvbmVudCBzdHlsZSBpZiBwcm92aWRlZCBiZWZvcmUgYmVpbmcgcmVnaXN0ZXJlZC5cbiAgICAgICAgY29uc3QgY29tcG9uZW50U3R5bGUgPSAoKHdpbi5EQlVJV2ViQ29tcG9uZW50cyB8fCB7fSlbcmVnaXN0cmF0aW9uTmFtZV0gfHwge30pLmNvbXBvbmVudFN0eWxlO1xuICAgICAgICBpZiAoY29tcG9uZW50U3R5bGUpIHtcbiAgICAgICAgICBrbGFzcy5jb21wb25lbnRTdHlsZSArPSBjb21wb25lbnRTdHlsZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBEbyByZWdpc3RyYXRpb25cbiAgICAgICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKHJlZ2lzdHJhdGlvbk5hbWUsIGtsYXNzKTtcbiAgICAgICAgcmV0dXJuIHJlZ2lzdHJhdGlvbk5hbWU7XG4gICAgICB9O1xuXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoa2xhc3MsICdwcm90b3R5cGVDaGFpbkluZm8nLCB7XG4gICAgICAgIGdldCgpIHtcbiAgICAgICAgICBjb25zdCBjaGFpbiA9IFtrbGFzc107XG4gICAgICAgICAgbGV0IHBhcmVudFByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGtsYXNzKTtcbiAgICAgICAgICB3aGlsZSAocGFyZW50UHJvdG8gIT09IEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICBjaGFpbi5wdXNoKHBhcmVudFByb3RvKTtcbiAgICAgICAgICAgIHBhcmVudFByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHBhcmVudFByb3RvKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2hhaW4ucHVzaChwYXJlbnRQcm90byk7XG4gICAgICAgICAgcmV0dXJuIGNoYWluO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIGtsYXNzO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBEQlVJV2ViQ29tcG9uZW50QmFzZSxcbiAgICAgIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMsXG4gICAgICBSZWdpc3RlcmFibGVcbiAgICB9O1xuICB9KTtcbn1cbiIsIlxuaW1wb3J0IGdldERCVUlXZWJDb21wb25lbnRCYXNlIGZyb20gJy4uL0RCVUlXZWJDb21wb25lbnRCYXNlL0RCVUlXZWJDb21wb25lbnRCYXNlJztcbmltcG9ydCBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24gZnJvbSAnLi4vLi4vaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbic7XG5cbmNvbnN0IHJlZ2lzdHJhdGlvbk5hbWUgPSAnZGJ1aS13ZWItY29tcG9uZW50LWR1bW15JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0REJVSVdlYkNvbXBvbmVudER1bW15KHdpbikge1xuICByZXR1cm4gZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uKHdpbiwgcmVnaXN0cmF0aW9uTmFtZSwgKCkgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIERCVUlXZWJDb21wb25lbnRCYXNlLFxuICAgICAgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyxcbiAgICAgIFJlZ2lzdGVyYWJsZVxuICAgIH0gPSBnZXREQlVJV2ViQ29tcG9uZW50QmFzZSh3aW4pO1xuXG4gICAgY2xhc3MgREJVSVdlYkNvbXBvbmVudER1bW15IGV4dGVuZHMgREJVSVdlYkNvbXBvbmVudEJhc2Uge1xuXG4gICAgICBzdGF0aWMgZ2V0IHJlZ2lzdHJhdGlvbk5hbWUoKSB7XG4gICAgICAgIHJldHVybiByZWdpc3RyYXRpb25OYW1lO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlSW5uZXJIVE1MKCkge1xuICAgICAgICByZXR1cm4gYFxuICAgICAgICAgIDxzdHlsZT5cbiAgICAgICAgICA6aG9zdCB7XG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgIG1heC13aWR0aDogNDAwcHg7XG4gICAgICAgICAgICBoZWlnaHQ6IHZhcigtLWRidWktaW5wdXQtaGVpZ2h0LCA1MHB4KTtcbiAgICAgICAgICAgIGNvbG9yOiBtYXJvb247XG4gICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCBncmF5O1xuICAgICAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgOmhvc3QgYiwgOmhvc3QgZGl2W3gtaGFzLXNsb3RdIHNwYW5beC1zbG90LXdyYXBwZXJdIHtcbiAgICAgICAgICAgIHVuaWNvZGUtYmlkaTogYmlkaS1vdmVycmlkZTtcbiAgICAgICAgICAgIHRleHQtc2hhZG93OiB2YXIoLS1kdW1teS1iLXRleHQtc2hhZG93LCBub25lKTtcbiAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgOmhvc3QoW2Rpcj1ydGxdKSBiIHtcbiAgICAgICAgICAgIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICA6aG9zdChbZGlyPWx0cl0pIGIge1xuICAgICAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiBvdmVybGluZTtcbiAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgOmhvc3QoW2Rpcj1sdHJdKSAjY29udGFpbmVyID4gZGl2W2Rpcj1ydGxdLFxuICAgICAgICAgIDpob3N0KFtkaXI9cnRsXSkgI2NvbnRhaW5lciA+IGRpdltkaXI9bHRyXSB7XG4gICAgICAgICAgICBkaXNwbGF5OiBub25lO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICA6aG9zdCAjY29udGFpbmVyID4gZGl2W3gtaGFzLXNsb3RdIHtcbiAgICAgICAgICAgIG1hcmdpbi1sZWZ0OiAwcHg7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgICNjb250YWluZXIge1xuICAgICAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgZmxleC1mbG93OiByb3cgbm93cmFwO1xuICAgICAgICAgICAgYWxpZ24taXRlbXM6IHN0cmV0Y2g7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgICNjb250YWluZXIgPiBkaXYge1xuICAgICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgZ3JheTtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IHZhcigtLWR1bW15LWlubmVyLXNlY3Rpb25zLWJvcmRlci1yYWRpdXMsIDBweCk7XG4gICAgICAgICAgICBmbGV4OiAxIDAgMCU7XG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgbWFyZ2luOiA1cHg7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgICNjb250YWluZXIgPiBkaXYgPiBkaXYge1xuICAgICAgICAgICAgbWFyZ2luOiBhdXRvO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICA8L3N0eWxlPlxuICAgICAgICAgIFxuICAgICAgICAgIDxkaXYgaWQ9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgIDxkaXYgZGlyPVwibHRyXCI+XG4gICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGI+RHVtbXkgc2hhZG93PC9iPiBbTFRSXVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgXG4gICAgICAgICAgICA8ZGl2IHgtaGFzLXNsb3Q+XG4gICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPHNwYW4+Wzwvc3Bhbj48c3BhbiB4LXNsb3Qtd3JhcHBlcj48c2xvdD48L3Nsb3Q+PC9zcGFuPjxzcGFuPl08L3NwYW4+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIDxkaXYgZGlyPVwicnRsXCI+XG4gICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGI+RHVtbXkgc2hhZG93PC9iPiBbUlRMXVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuICAgICAgfVxuXG4gICAgICBvbkxvY2FsZUNoYW5nZShsb2NhbGUpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ29uTG9jYWxlQ2hhbmdlJywgbG9jYWxlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gUmVnaXN0ZXJhYmxlKFxuICAgICAgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyhcbiAgICAgICAgREJVSVdlYkNvbXBvbmVudER1bW15XG4gICAgICApXG4gICAgKTtcbiAgfSk7XG59XG5cbmdldERCVUlXZWJDb21wb25lbnREdW1teS5yZWdpc3RyYXRpb25OYW1lID0gcmVnaXN0cmF0aW9uTmFtZTtcblxuIiwiXG5cbmltcG9ydCBnZXREQlVJV2ViQ29tcG9uZW50QmFzZSBmcm9tICcuLi9EQlVJV2ViQ29tcG9uZW50QmFzZS9EQlVJV2ViQ29tcG9uZW50QmFzZSc7XG5pbXBvcnQgZ2V0REJVSVdlYkNvbXBvbmVudER1bW15IGZyb20gJy4uL0RCVUlXZWJDb21wb25lbnREdW1teS9EQlVJV2ViQ29tcG9uZW50RHVtbXknO1xuaW1wb3J0IGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbiBmcm9tICcuLi8uLi9pbnRlcm5hbHMvZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uJztcblxuY29uc3QgcmVnaXN0cmF0aW9uTmFtZSA9ICdkYnVpLXdlYi1jb21wb25lbnQtZHVtbXktcGFyZW50JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0REJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50KHdpbikge1xuICByZXR1cm4gZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uKHdpbiwgcmVnaXN0cmF0aW9uTmFtZSwgKCkgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIERCVUlXZWJDb21wb25lbnRCYXNlLFxuICAgICAgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyxcbiAgICAgIFJlZ2lzdGVyYWJsZVxuICAgIH0gPSBnZXREQlVJV2ViQ29tcG9uZW50QmFzZSh3aW4pO1xuICAgIGNvbnN0IERCVUlXZWJDb21wb25lbnREdW1teSA9IGdldERCVUlXZWJDb21wb25lbnREdW1teSh3aW4pO1xuXG4gICAgY2xhc3MgREJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50IGV4dGVuZHMgREJVSVdlYkNvbXBvbmVudEJhc2Uge1xuXG4gICAgICBzdGF0aWMgZ2V0IHJlZ2lzdHJhdGlvbk5hbWUoKSB7XG4gICAgICAgIHJldHVybiByZWdpc3RyYXRpb25OYW1lO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlSW5uZXJIVE1MKCkge1xuICAgICAgICByZXR1cm4gYFxuICAgICAgICAgIDxzdHlsZT5cbiAgICAgICAgICA6aG9zdCB7XG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgIG1heC13aWR0aDogNDAwcHg7XG4gICAgICAgICAgfVxuICAgICAgICAgIDwvc3R5bGU+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxiPkR1bW15IFBhcmVudCBzaGFkb3c8L2I+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxkYnVpLXdlYi1jb21wb25lbnQtZHVtbXk+PHNsb3Q+PC9zbG90PjwvZGJ1aS13ZWItY29tcG9uZW50LWR1bW15PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIGA7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgZGVwZW5kZW5jaWVzKCkge1xuICAgICAgICByZXR1cm4gW0RCVUlXZWJDb21wb25lbnREdW1teV07XG4gICAgICB9XG5cbiAgICB9XG5cbiAgICByZXR1cm4gUmVnaXN0ZXJhYmxlKFxuICAgICAgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyhcbiAgICAgICAgREJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50XG4gICAgICApXG4gICAgKTtcbiAgfSk7XG59XG5cbmdldERCVUlXZWJDb21wb25lbnREdW1teVBhcmVudC5yZWdpc3RyYXRpb25OYW1lID0gcmVnaXN0cmF0aW9uTmFtZTtcblxuIiwiXG5pbXBvcnQgZ2V0REJVSVdlYkNvbXBvbmVudEJhc2UgZnJvbSAnLi4vREJVSVdlYkNvbXBvbmVudEJhc2UvREJVSVdlYkNvbXBvbmVudEJhc2UnO1xuaW1wb3J0IGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbiBmcm9tICcuLi8uLi9pbnRlcm5hbHMvZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uJztcbmltcG9ydCBGb2N1c2FibGUgZnJvbSAnLi4vLi4vYmVoYXZpb3Vycy9Gb2N1c2FibGUnO1xuXG5jb25zdCByZWdpc3RyYXRpb25OYW1lID0gJ2RidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LXRleHQnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXREQlVJV2ViQ29tcG9uZW50Rm9ybUlucHV0VGV4dCh3aW4pIHtcbiAgcmV0dXJuIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbih3aW4sIHJlZ2lzdHJhdGlvbk5hbWUsICgpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBEQlVJV2ViQ29tcG9uZW50QmFzZSxcbiAgICAgIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMsXG4gICAgICBSZWdpc3RlcmFibGVcbiAgICB9ID0gZ2V0REJVSVdlYkNvbXBvbmVudEJhc2Uod2luKTtcblxuICAgIGNsYXNzIERCVUlXZWJDb21wb25lbnRGb3JtSW5wdXRUZXh0IGV4dGVuZHMgREJVSVdlYkNvbXBvbmVudEJhc2Uge1xuXG4gICAgICBzdGF0aWMgZ2V0IHJlZ2lzdHJhdGlvbk5hbWUoKSB7XG4gICAgICAgIHJldHVybiByZWdpc3RyYXRpb25OYW1lO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlSW5uZXJIVE1MKCkge1xuICAgICAgICByZXR1cm4gYFxuICAgICAgICAgIDxzdHlsZT5cbiAgICAgICAgICA6aG9zdCB7XG4gICAgICAgICAgICBhbGw6IGluaXRpYWw7IFxuICAgICAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgICAgICAvKmhlaWdodDogdmFyKC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtaGVpZ2h0KTsqL1xuICAgICAgICAgICAgLypsaW5lLWhlaWdodDogdmFyKC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtaGVpZ2h0KTsqL1xuICAgICAgICAgICAgaGVpZ2h0OiAzMDBweDtcbiAgICAgICAgICAgIHBhZGRpbmc6IDBweDtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMThweDtcbiAgICAgICAgICAgIGNvbG9yOiB2YXIoLS1kYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC1jb2xvcik7XG4gICAgICAgICAgICAvKmJhY2tncm91bmQtY29sb3I6IHZhcigtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWJhY2tncm91bmQtY29sb3IpOyovXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMTAwLCAwLCAwLjEpO1xuICAgICAgICAgICAgdW5pY29kZS1iaWRpOiBiaWRpLW92ZXJyaWRlO1xuICAgICAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAgICAgICAgIGJvcmRlcjogbm9uZTtcbiAgICAgICAgICAgIGJvcmRlci1ib3R0b206IHZhcigtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWJvcmRlci13aWR0aCkgdmFyKC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtYm9yZGVyLXN0eWxlKSB2YXIoLS1kYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC1ib3JkZXItY29sb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICA6aG9zdCBbdGFiaW5kZXhdIHtcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgaGVpZ2h0OiA1MHB4O1xuICAgICAgICAgICAgbGluZS1oZWlnaHQ6IDUwcHg7XG4gICAgICAgICAgICBib3JkZXI6IG5vbmU7XG4gICAgICAgICAgICBtYXJnaW46IDBweDtcbiAgICAgICAgICAgIHBhZGRpbmc6IDBweDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMHB4O1xuICAgICAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAgICAgICAgIHVuaWNvZGUtYmlkaTogYmlkaS1vdmVycmlkZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgOmhvc3QgW3RhYmluZGV4XTpmb2N1cyB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMCwgMCwgLjMpO1xuICAgICAgICAgICAgb3V0bGluZTogbm9uZTtcbiAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgOmhvc3QoW2ZvY3VzZWRdKSB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDI1NSwgMCwgLjMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICAvKjpob3N0KFtkaXNhYmxlZF0pIHsqL1xuICAgICAgICAgICAgLypiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIC4zKTsqL1xuICAgICAgICAgIC8qfSovXG4gICAgXG4gICAgICAgICAgOmhvc3QoW2hpZGRlbl0pIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgICAgICAgfVxuICAgIFxuICAgICAgICAgIDpob3N0KFtkaXI9cnRsXSkge1xuICAgICAgICAgIFxuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICA6aG9zdChbZGlyPWx0cl0pIHtcbiAgICAgICAgICBcbiAgICAgICAgICB9XG4gICAgICAgICAgPC9zdHlsZT5cbiAgICAgICAgICA8cD5EQlVJV2ViQ29tcG9uZW50Rm9ybUlucHV0VGV4dDwvcD5cbiAgICAgICAgICA8ZGl2IGNvbnRlbnRlZGl0YWJsZT1cInRydWVcIiB0YWJpbmRleD1cIjBcIj48L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNvbnRlbnRlZGl0YWJsZT1cInRydWVcIiB0YWJpbmRleD1cIjBcIj48L2Rpdj5cbiAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiB0YWJpbmRleD1cIjBcIiAvPlxuICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIHRhYmluZGV4PVwiMFwiIC8+XG4gICAgICAgIGA7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgcHJvcGVydGllc1RvRGVmaW5lKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHJvbGU6ICdmb3JtLWlucHV0J1xuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBvbkxvY2FsZUNoYW5nZShsb2NhbGUpIHtcbiAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICAvKiBlc2xpbnQgbm8tY29uc29sZTogMCAqL1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdvbkxvY2FsZUNoYW5nZScsIGxvY2FsZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgIH1cblxuICAgIHJldHVybiBSZWdpc3RlcmFibGUoXG4gICAgICBGb2N1c2FibGUoXG4gICAgICAgIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMoXG4gICAgICAgICAgREJVSVdlYkNvbXBvbmVudEZvcm1JbnB1dFRleHRcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG5cbiAgfSk7XG59XG5cbmdldERCVUlXZWJDb21wb25lbnRGb3JtSW5wdXRUZXh0LnJlZ2lzdHJhdGlvbk5hbWUgPSByZWdpc3RyYXRpb25OYW1lO1xuXG4iLCJcbmltcG9ydCBnZXREQlVJV2ViQ29tcG9uZW50QmFzZSBmcm9tICcuLi9EQlVJV2ViQ29tcG9uZW50QmFzZS9EQlVJV2ViQ29tcG9uZW50QmFzZSc7XG5pbXBvcnQgZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uIGZyb20gJy4uLy4uL2ludGVybmFscy9lbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24nO1xuXG5jb25zdCByZWdpc3RyYXRpb25OYW1lID0gJ2RidWktd2ViLWNvbXBvbmVudC1pY29uJztcblxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2dvcmFuZ2FqaWMvcmVhY3QtaWNvbi1iYXNlL2Jsb2IvbWFzdGVyL2luZGV4LmpzXG4vLyBodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vZ29yYW5nYWppYy9yZWFjdC1pY29ucy9tYXN0ZXIvaWNvbnMvZ28vbWFyay1naXRodWIuc3ZnXG4vLyBodHRwczovL2dpdGh1Yi5jb20vZ29yYW5nYWppYy9yZWFjdC1pY29uc1xuLy8gaHR0cHM6Ly9naXRodWIuY29tL2dvcmFuZ2FqaWMvcmVhY3QtaWNvbnMvYmxvYi9tYXN0ZXIvZ28vbWFyay1naXRodWIuanNcbi8vIGh0dHBzOi8vZ29yYW5nYWppYy5naXRodWIuaW8vcmVhY3QtaWNvbnMvZ28uaHRtbFxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXREQlVJV2ViQ29tcG9uZW50SWNvbih3aW4pIHtcbiAgcmV0dXJuIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbih3aW4sIHJlZ2lzdHJhdGlvbk5hbWUsICgpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBEQlVJV2ViQ29tcG9uZW50QmFzZSxcbiAgICAgIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMsXG4gICAgICBSZWdpc3RlcmFibGVcbiAgICB9ID0gZ2V0REJVSVdlYkNvbXBvbmVudEJhc2Uod2luKTtcblxuICAgIGNsYXNzIERCVUlXZWJDb21wb25lbnRJY29uIGV4dGVuZHMgREJVSVdlYkNvbXBvbmVudEJhc2Uge1xuXG4gICAgICBzdGF0aWMgZ2V0IHJlZ2lzdHJhdGlvbk5hbWUoKSB7XG4gICAgICAgIHJldHVybiByZWdpc3RyYXRpb25OYW1lO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlSW5uZXJIVE1MKCkge1xuICAgICAgICByZXR1cm4gYFxuICAgICAgICAgIDxzdHlsZT5cbiAgICAgICAgICA6aG9zdCB7XG4gICAgICAgICAgICBhbGw6IGluaXRpYWw7XG4gICAgICAgICAgICBmb250LXNpemU6IGluaGVyaXQ7IFxuICAgICAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgICAgICAgd2lkdGg6IDFlbTtcbiAgICAgICAgICAgIGhlaWdodDogMWVtO1xuICAgICAgICAgICAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgICAgICAgICAgIGNvbG9yOiBpbmhlcml0O1xuICAgICAgICAgIH1cbiAgICAgICAgICA6aG9zdCBzdmcge1xuICAgICAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgICAgICAgd2lkdGg6IDFlbTtcbiAgICAgICAgICAgIGhlaWdodDogMWVtO1xuICAgICAgICAgICAgdmVydGljYWwtYWxpZ246IHRvcDtcbiAgICAgICAgICAgIGZpbGw6IGN1cnJlbnRDb2xvcjtcbiAgICAgICAgICB9XG4gICAgICAgICAgPC9zdHlsZT5cbiAgICAgICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgNDAgNDBcIiAgcHJlc2VydmVBc3BlY3RSYXRpbz1cInhNaWRZTWlkIG1lZXRcIiA+XG4gICAgICAgICAgICA8Zz48cGF0aCBkPVwiXCIvPjwvZz5cbiAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgYDtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCBwcm9wZXJ0aWVzVG9VcGdyYWRlKCkge1xuICAgICAgICBjb25zdCBpbmhlcml0ZWRQcm9wZXJ0aWVzVG9VcGdyYWRlID0gc3VwZXIucHJvcGVydGllc1RvVXBncmFkZSB8fCBbXTtcbiAgICAgICAgcmV0dXJuIFsuLi5pbmhlcml0ZWRQcm9wZXJ0aWVzVG9VcGdyYWRlLCAnc2hhcGUnXTtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7XG4gICAgICAgIGNvbnN0IGluaGVyaXRlZE9ic2VydmVkQXR0cmlidXRlcyA9IHN1cGVyLm9ic2VydmVkQXR0cmlidXRlcyB8fCBbXTtcbiAgICAgICAgcmV0dXJuIFsuLi5pbmhlcml0ZWRPYnNlcnZlZEF0dHJpYnV0ZXMsICdzaGFwZSddO1xuICAgICAgfVxuXG4gICAgICBnZXQgc2hhcGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZSgnc2hhcGUnKTtcbiAgICAgIH1cblxuICAgICAgc2V0IHNoYXBlKHZhbHVlKSB7XG4gICAgICAgIGNvbnN0IGhhc1ZhbHVlID0gIVt1bmRlZmluZWQsIG51bGxdLmluY2x1ZGVzKHZhbHVlKTtcbiAgICAgICAgY29uc3Qgc3RyaW5nVmFsdWUgPSBTdHJpbmcodmFsdWUpO1xuICAgICAgICBpZiAoaGFzVmFsdWUpIHtcbiAgICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnc2hhcGUnLCBzdHJpbmdWYWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoJ3NoYXBlJyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSkge1xuICAgICAgICBzdXBlci5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sgJiZcbiAgICAgICAgICBzdXBlci5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlKTtcblxuICAgICAgICBjb25zdCBoYXNWYWx1ZSA9ICFbdW5kZWZpbmVkLCBudWxsXS5pbmNsdWRlcyhuZXdWYWx1ZSk7XG4gICAgICAgIGlmIChuYW1lID09PSAnc2hhcGUnKSB7XG4gICAgICAgICAgaGFzVmFsdWUgPyB0aGlzLl9zZXRTaGFwZSgpIDogdGhpcy5fcmVtb3ZlU2hhcGUoKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBfc2V0U2hhcGUoKSB7XG4gICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLmNoaWxkcmVuVHJlZS5xdWVyeVNlbGVjdG9yKCdzdmcgZyBwYXRoJyk7XG4gICAgICAgIHBhdGguc2V0QXR0cmlidXRlKCdkJywgdGhpcy5zaGFwZSk7XG4gICAgICB9XG5cbiAgICAgIF9yZW1vdmVTaGFwZSgpIHtcbiAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMuY2hpbGRyZW5UcmVlLnF1ZXJ5U2VsZWN0b3IoJ3N2ZyBnIHBhdGgnKTtcbiAgICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoJ2QnLCAnJyk7XG4gICAgICB9XG5cbiAgICB9XG5cbiAgICByZXR1cm4gUmVnaXN0ZXJhYmxlKFxuICAgICAgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyhcbiAgICAgICAgREJVSVdlYkNvbXBvbmVudEljb25cbiAgICAgIClcbiAgICApO1xuXG4gIH0pO1xufVxuXG5nZXREQlVJV2ViQ29tcG9uZW50SWNvbi5yZWdpc3RyYXRpb25OYW1lID0gcmVnaXN0cmF0aW9uTmFtZTtcblxuIiwiaW1wb3J0IGFwcGVuZFN0eWxlIGZyb20gJy4uL2ludGVybmFscy9hcHBlbmRTdHlsZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRidWlXZWJDb21wb25lbnRzU2V0VXAod2luKSB7XG4gIHJldHVybiB7XG4gICAgYXBwZW5kU3R5bGU6IGFwcGVuZFN0eWxlKHdpbilcbiAgfTtcbn1cbiIsIi8qXG5EQlVJV2ViQ29tcG9uZW50QmFzZSAoZnJvbSB3aGljaCBhbGwgd2ViLWNvbXBvbmVudHMgaW5oZXJpdClcbndpbGwgcmVhZCBjb21wb25lbnRTdHlsZSBmcm9tIHdpbi5EQlVJV2ViQ29tcG9uZW50c1xud2hlbiBrbGFzcy5yZWdpc3RlclNlbGYoKSBpcyBjYWxsZWQgZ2l2aW5nIGEgY2hhbmNlIHRvIG92ZXJyaWRlIGRlZmF1bHQgd2ViLWNvbXBvbmVudCBzdHlsZVxuanVzdCBiZWZvcmUgaXQgaXMgcmVnaXN0ZXJlZC5cbiovXG5jb25zdCBhcHBlbmRTdHlsZSA9ICh3aW4pID0+IChyZWdpc3RyYXRpb25OYW1lLCBjb21wb25lbnRTdHlsZSkgPT4ge1xuICBpZiAoIXdpbi5EQlVJV2ViQ29tcG9uZW50cykge1xuICAgIHdpbi5EQlVJV2ViQ29tcG9uZW50cyA9IHt9O1xuICB9XG4gIHdpbi5EQlVJV2ViQ29tcG9uZW50cyA9IHtcbiAgICAuLi53aW4uREJVSVdlYkNvbXBvbmVudHMsXG4gICAgW3JlZ2lzdHJhdGlvbk5hbWVdOiB7XG4gICAgICAuLi53aW4uREJVSVdlYkNvbXBvbmVudHNbcmVnaXN0cmF0aW9uTmFtZV0sXG4gICAgICBjb21wb25lbnRTdHlsZVxuICAgIH1cbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFwcGVuZFN0eWxlO1xuIiwiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbih3aW4sIG5hbWUsIGNhbGxiYWNrKSB7XG4gIGlmICghd2luLkRCVUlXZWJDb21wb25lbnRzKSB7XG4gICAgd2luLkRCVUlXZWJDb21wb25lbnRzID0geyByZWdpc3RyYXRpb25zOiB7fSB9O1xuICB9IGVsc2UgaWYgKCF3aW4uREJVSVdlYkNvbXBvbmVudHMucmVnaXN0cmF0aW9ucykge1xuICAgIHdpbi5EQlVJV2ViQ29tcG9uZW50cy5yZWdpc3RyYXRpb25zID0ge307XG4gIH1cblxuICBsZXQgcmVnaXN0cmF0aW9uID0gd2luLkRCVUlXZWJDb21wb25lbnRzLnJlZ2lzdHJhdGlvbnNbbmFtZV07XG5cbiAgaWYgKHJlZ2lzdHJhdGlvbikgcmV0dXJuIHJlZ2lzdHJhdGlvbjtcblxuICByZWdpc3RyYXRpb24gPSBjYWxsYmFjaygpO1xuICB3aW4uREJVSVdlYkNvbXBvbmVudHMucmVnaXN0cmF0aW9uc1tuYW1lXSA9IHJlZ2lzdHJhdGlvbjtcblxuICByZXR1cm4gd2luLkRCVUlXZWJDb21wb25lbnRzLnJlZ2lzdHJhdGlvbnNbbmFtZV07XG59XG5cbiIsImltcG9ydCBnZXREQlVJbG9jYWxlU2VydmljZSBmcm9tICcuL0RCVUlMb2NhbGVTZXJ2aWNlJztcbmltcG9ydCBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24gZnJvbSAnLi4vaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbic7XG5cbmNvbnN0IGVtcHR5T2JqID0ge307XG5cbmNvbnN0IHJlZ2lzdHJhdGlvbk5hbWUgPSAnREJVSUkxOG5TZXJ2aWNlJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0REJVSUkxOG5TZXJ2aWNlKHdpbikge1xuICBjb25zdCBsb2NhbGVTZXJ2aWNlID0gZ2V0REJVSWxvY2FsZVNlcnZpY2Uod2luKTtcbiAgcmV0dXJuIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbih3aW4sIHJlZ2lzdHJhdGlvbk5hbWUsICgpID0+IHtcbiAgICBjbGFzcyBJMThuU2VydmljZSB7XG4gICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgbG9jYWxlU2VydmljZS5vbkxvY2FsZUNoYW5nZSh0aGlzLl9oYW5kbGVMb2NhbGVDaGFuZ2UuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuX2xvY2FsZSA9IGxvY2FsZVNlcnZpY2UubG9jYWxlO1xuICAgICAgICB0aGlzLl90cmFuc2xhdGlvbnMgPSB7fTtcbiAgICAgIH1cblxuICAgICAgX2hhbmRsZUxvY2FsZUNoYW5nZShsb2NhbGUpIHtcbiAgICAgICAgdGhpcy5fbG9jYWxlID0gbG9jYWxlO1xuICAgICAgfVxuXG4gICAgICBjbGVhclRyYW5zbGF0aW9ucyhsYW5nKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLl90cmFuc2xhdGlvbnNbbGFuZ107XG4gICAgICB9XG5cbiAgICAgIHJlZ2lzdGVyVHJhbnNsYXRpb25zKHRyYW5zbGF0aW9ucykge1xuICAgICAgICB0aGlzLl90cmFuc2xhdGlvbnMgPSBPYmplY3Qua2V5cyh0cmFuc2xhdGlvbnMpLnJlZHVjZSgoYWNjLCBsYW5nKSA9PiB7XG4gICAgICAgICAgYWNjW2xhbmddID0ge1xuICAgICAgICAgICAgLi4udGhpcy5fdHJhbnNsYXRpb25zW2xhbmddLFxuICAgICAgICAgICAgLi4udHJhbnNsYXRpb25zW2xhbmddXG4gICAgICAgICAgfTtcbiAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICB9LCB0aGlzLl90cmFuc2xhdGlvbnMpO1xuICAgICAgfVxuXG4gICAgICB0cmFuc2xhdGUobXNnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRMYW5nVHJhbnNsYXRpb25zW21zZ107XG4gICAgICB9XG5cbiAgICAgIGdldCB0cmFuc2xhdGlvbnMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90cmFuc2xhdGlvbnM7XG4gICAgICB9XG5cbiAgICAgIGdldCBjdXJyZW50TGFuZ1RyYW5zbGF0aW9ucygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zbGF0aW9uc1t0aGlzLl9sb2NhbGUubGFuZ10gfHwgZW1wdHlPYmo7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgaTE4blNlcnZpY2UgPSBuZXcgSTE4blNlcnZpY2UoKTtcbiAgICByZXR1cm4gaTE4blNlcnZpY2U7XG4gIH0pO1xufVxuIiwiXG5pbXBvcnQgZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uIGZyb20gJy4uL2ludGVybmFscy9lbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24nO1xuXG5jb25zdCBkZWZhdWx0TG9jYWxlID0ge1xuICBkaXI6ICdsdHInLFxuICBsYW5nOiAnZW4nXG59O1xuXG5jb25zdCByZWdpc3RyYXRpb25OYW1lID0gJ0RCVUlMb2NhbGVTZXJ2aWNlJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0REJVSUxvY2FsZVNlcnZpY2Uod2luKSB7XG4gIHJldHVybiBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24od2luLCByZWdpc3RyYXRpb25OYW1lLCAoKSA9PiB7XG4gICAgY2xhc3MgTG9jYWxlU2VydmljZSB7XG4gICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tzID0gW107XG4gICAgICAgIHRoaXMuX2xvY2FsZUF0dHJzID0gT2JqZWN0LmtleXMoZGVmYXVsdExvY2FsZSk7XG4gICAgICAgIHRoaXMuX3Jvb3RFbGVtZW50ID0gd2luZG93LmRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICAgICAgdGhpcy5fbG9jYWxlQXR0cnMuZm9yRWFjaCgoYXR0cikgPT4ge1xuICAgICAgICAgIGlmICghdGhpcy5fcm9vdEVsZW1lbnQuZ2V0QXR0cmlidXRlKGF0dHIpKSB7XG4gICAgICAgICAgICB0aGlzLl9yb290RWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0ciwgZGVmYXVsdExvY2FsZVthdHRyXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fbG9jYWxlID0gdGhpcy5fbG9jYWxlQXR0cnMucmVkdWNlKChhY2MsIGF0dHIpID0+IHtcbiAgICAgICAgICBhY2NbYXR0cl0gPSB0aGlzLl9yb290RWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cik7XG4gICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfSwge30pO1xuICAgICAgICB0aGlzLl9vYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMuX2hhbmRsZU11dGF0aW9ucy5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5fb2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLl9yb290RWxlbWVudCwge1xuICAgICAgICAgIGF0dHJpYnV0ZXM6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIF9oYW5kbGVNdXRhdGlvbnMobXV0YXRpb25zKSB7XG4gICAgICAgIG11dGF0aW9ucy5mb3JFYWNoKChtdXRhdGlvbikgPT4ge1xuICAgICAgICAgIGNvbnN0IG11dGF0aW9uQXR0cmlidXRlTmFtZSA9IG11dGF0aW9uLmF0dHJpYnV0ZU5hbWU7XG4gICAgICAgICAgaWYgKHRoaXMuX2xvY2FsZUF0dHJzLmluY2x1ZGVzKG11dGF0aW9uQXR0cmlidXRlTmFtZSkpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvY2FsZSA9IHtcbiAgICAgICAgICAgICAgLi4udGhpcy5fbG9jYWxlLFxuICAgICAgICAgICAgICBbbXV0YXRpb25BdHRyaWJ1dGVOYW1lXTogdGhpcy5fcm9vdEVsZW1lbnQuZ2V0QXR0cmlidXRlKG11dGF0aW9uQXR0cmlidXRlTmFtZSlcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFja3MuZm9yRWFjaChjYWxsYmFjayA9PiBjYWxsYmFjayh0aGlzLl9sb2NhbGUpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBzZXQgbG9jYWxlKGxvY2FsZU9iaikge1xuICAgICAgICBPYmplY3Qua2V5cyhsb2NhbGVPYmopLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgIHRoaXMuX3Jvb3RFbGVtZW50LnNldEF0dHJpYnV0ZShrZXksIGxvY2FsZU9ialtrZXldKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGdldCBsb2NhbGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sb2NhbGU7XG4gICAgICB9XG5cbiAgICAgIG9uTG9jYWxlQ2hhbmdlKGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuX2NhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgY2FsbGJhY2sodGhpcy5sb2NhbGUpO1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcy5maWx0ZXIoY2IgPT4gY2IgIT09IGNhbGxiYWNrKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBsb2NhbGVTZXJ2aWNlID0gbmV3IExvY2FsZVNlcnZpY2UoKTtcbiAgICByZXR1cm4gbG9jYWxlU2VydmljZTtcbiAgfSk7XG59XG4iLCIvKiBlc2xpbnQgcHJlZmVyLWNvbnN0OiAwICovXG5cbi8qKlxuICpcbiAqIEBwYXJhbSBvcHRpb25zIE9iamVjdFxuICogQHJldHVybnMgZnVuY3Rpb24oU3RyaW5nKTogU3RyaW5nXG4gKi9cbmNvbnN0IGZvcmNlRmxvYXQgPSAoeyBkZWNQb2ludCA9ICcuJyB9ID0ge30pID0+ICh2YWx1ZSkgPT4ge1xuICBjb25zdCBHTE9CQUxfREVDX1BPSU5UID0gbmV3IFJlZ0V4cChgXFxcXCR7ZGVjUG9pbnR9YCwgJ2cnKTtcbiAgY29uc3QgR0xPQkFMX05PTl9OVU1CRVJfT1JfREVDX1BPSU5UID0gbmV3IFJlZ0V4cChgW15cXFxcZCR7ZGVjUG9pbnR9XWAsICdnJyk7XG4gIGNvbnN0IE5VTUJFUl9ERUNfUE9JTlRfT1JfU0hPUlRDVVQgPSBuZXcgUmVnRXhwKGBbXFxcXGQke2RlY1BvaW50fUtrTW1dYCwgJycpO1xuICBjb25zdCBOVU1CRVJfT1JfU0lHTiA9IG5ldyBSZWdFeHAoJ1tcXFxcZCstXScsICcnKTtcbiAgY29uc3QgU0lHTiA9IG5ldyBSZWdFeHAoJ1srLV0nLCAnJyk7XG4gIGNvbnN0IFNIT1JUQ1VUID0gbmV3IFJlZ0V4cCgnW0trTW1dJywgJycpO1xuICBjb25zdCBTSE9SVENVVF9USE9VU0FORFMgPSBuZXcgUmVnRXhwKCdbS2tdJywgJycpO1xuXG4gIGxldCB2YWx1ZVRvVXNlID0gdmFsdWU7XG4gIGNvbnN0IGluZGV4T2ZQb2ludCA9IHZhbHVlVG9Vc2UuaW5kZXhPZihkZWNQb2ludCk7XG4gIGNvbnN0IGxhc3RJbmRleE9mUG9pbnQgPSB2YWx1ZVRvVXNlLmxhc3RJbmRleE9mKGRlY1BvaW50KTtcbiAgY29uc3QgaGFzTW9yZVRoYW5PbmVQb2ludCA9IGluZGV4T2ZQb2ludCAhPT0gbGFzdEluZGV4T2ZQb2ludDtcblxuICBpZiAoaGFzTW9yZVRoYW5PbmVQb2ludCkge1xuICAgIHZhbHVlVG9Vc2UgPSBgJHt2YWx1ZVRvVXNlLnJlcGxhY2UoR0xPQkFMX0RFQ19QT0lOVCwgJycpfSR7ZGVjUG9pbnR9YDtcbiAgfVxuXG4gIGxldCBmaXJzdENoYXIgPSB2YWx1ZVRvVXNlWzBdIHx8ICcnO1xuICBsZXQgbGFzdENoYXIgPSAodmFsdWVUb1VzZS5sZW5ndGggPiAxID8gdmFsdWVUb1VzZVt2YWx1ZVRvVXNlLmxlbmd0aCAtIDFdIDogJycpIHx8ICcnO1xuICBsZXQgbWlkZGxlQ2hhcnMgPSB2YWx1ZVRvVXNlLnN1YnN0cigxLCB2YWx1ZVRvVXNlLmxlbmd0aCAtIDIpIHx8ICcnO1xuXG4gIGlmICghZmlyc3RDaGFyLm1hdGNoKE5VTUJFUl9PUl9TSUdOKSkge1xuICAgIGZpcnN0Q2hhciA9ICcnO1xuICB9XG5cbiAgbWlkZGxlQ2hhcnMgPSBtaWRkbGVDaGFycy5yZXBsYWNlKEdMT0JBTF9OT05fTlVNQkVSX09SX0RFQ19QT0lOVCwgJycpO1xuXG4gIGlmICghbGFzdENoYXIubWF0Y2goTlVNQkVSX0RFQ19QT0lOVF9PUl9TSE9SVENVVCkpIHtcbiAgICBsYXN0Q2hhciA9ICcnO1xuICB9IGVsc2UgaWYgKGxhc3RDaGFyLm1hdGNoKFNIT1JUQ1VUKSkge1xuICAgIGlmIChtaWRkbGVDaGFycyA9PT0gZGVjUG9pbnQpIHtcbiAgICAgIG1pZGRsZUNoYXJzID0gJyc7XG4gICAgfSBlbHNlIGlmIChtaWRkbGVDaGFycyA9PT0gJycgJiYgZmlyc3RDaGFyLm1hdGNoKFNJR04pKSB7XG4gICAgICBsYXN0Q2hhciA9ICcnO1xuICAgIH1cbiAgfSBlbHNlIGlmIChsYXN0Q2hhciA9PT0gZGVjUG9pbnQgJiYgbWlkZGxlQ2hhcnMgPT09ICcnICYmIGZpcnN0Q2hhci5tYXRjaChTSUdOKSkge1xuICAgIGxhc3RDaGFyID0gJyc7XG4gIH1cblxuICB2YWx1ZVRvVXNlID0gW2ZpcnN0Q2hhciwgbWlkZGxlQ2hhcnMsIGxhc3RDaGFyXS5qb2luKCcnKTtcblxuICBpZiAobGFzdENoYXIubWF0Y2goU0hPUlRDVVQpKSB7XG4gICAgdmFsdWVUb1VzZSA9IChcbiAgICAgIE51bWJlcihgJHtmaXJzdENoYXJ9JHttaWRkbGVDaGFyc31gLnJlcGxhY2UoZGVjUG9pbnQsICcuJykpICpcbiAgICAgIChsYXN0Q2hhci5tYXRjaChTSE9SVENVVF9USE9VU0FORFMpID8gMTAwMCA6IDEwMDAwMDApXG4gICAgKS50b1N0cmluZygpLnJlcGxhY2UoJy4nLCBkZWNQb2ludCk7XG4gIH1cblxuICByZXR1cm4gdmFsdWVUb1VzZTtcbn07XG5cbi8qKlxuICpcbiAqIEBwYXJhbSBvcHRpb25zIE9iamVjdFxuICogQHJldHVybnMgZnVuY3Rpb24oU3RyaW5nKTogU3RyaW5nXG4gKi9cbmNvbnN0IG51bWJlckZvcm1hdHRlciA9ICh7IGRlY1BvaW50ID0gJy4nLCB0aG91c2FuZHNTZXBhcmF0b3IgPSAnLCcgfSA9IHt9KSA9PiB2YWx1ZSA9PiB7XG4gIHZhbHVlID0gdmFsdWUucmVwbGFjZSgnLicsIGRlY1BvaW50KTtcbiAgbGV0IGZpcnN0Q2hhciA9IHZhbHVlWzBdIHx8ICcnO1xuICBmaXJzdENoYXIgPSBbJysnLCAnLSddLmluY2x1ZGVzKGZpcnN0Q2hhcikgPyBmaXJzdENoYXIgOiAnJztcbiAgY29uc3QgaXNGbG9hdGluZ1BvaW50ID0gdmFsdWUuaW5kZXhPZihkZWNQb2ludCkgIT09IC0xO1xuICBsZXQgW2ludGVnZXJQYXJ0ID0gJycsIGRlY2ltYWxzID0gJyddID0gdmFsdWUuc3BsaXQoZGVjUG9pbnQpO1xuICBpbnRlZ2VyUGFydCA9IGludGVnZXJQYXJ0LnJlcGxhY2UoL1srLV0vZywgJycpO1xuICBpbnRlZ2VyUGFydCA9IGludGVnZXJQYXJ0LnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csIHRob3VzYW5kc1NlcGFyYXRvcik7XG4gIGNvbnN0IHJldCA9IGAke2ZpcnN0Q2hhcn0ke2ludGVnZXJQYXJ0fSR7aXNGbG9hdGluZ1BvaW50ID8gZGVjUG9pbnQgOiAnJ30ke2RlY2ltYWxzfWA7XG4gIHJldHVybiByZXQ7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGZvcmNlRmxvYXQsXG4gIG51bWJlckZvcm1hdHRlclxufTtcblxuIiwiLyogZXNsaW50IG5vLWNvbnNvbGU6IDAgKi9cblxuY29uc3QgYnV0dG9uSGVpZ2h0ID0gJzI1cHgnO1xuY29uc3QgYnV0dG9uU3RhcnQgPSAnNXB4JztcbmNvbnN0IGJ1dHRvblRvcCA9ICc1cHgnO1xuXG5sZXQgY29uc29sZU1lc3NhZ2VzID0gW107XG5jb25zdCBjb25zb2xlTG9nID0gY29uc29sZS5sb2cuYmluZChjb25zb2xlKTtcbmNvbnN0IGNvbnNvbGVPcmlnaW5hbCA9IHt9O1xuXG5mdW5jdGlvbiBjYXB0dXJlQ29uc29sZShjb25zb2xlRWxtLCBvcHRpb25zKSB7XG4gIGNvbnN0IHsgaW5kZW50ID0gMiwgc2hvd0xhc3RPbmx5ID0gZmFsc2UgfSA9IG9wdGlvbnM7XG4gIGNvbnN0IGhhbmRsZXIgPSBmdW5jdGlvbiBoYW5kbGVyKGFjdGlvbiwgLi4uYXJncykge1xuICAgIGlmIChzaG93TGFzdE9ubHkpIHtcbiAgICAgIGNvbnNvbGVNZXNzYWdlcyA9IFt7IFthY3Rpb25dOiBhcmdzIH1dO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlTWVzc2FnZXMucHVzaCh7IFthY3Rpb25dOiBhcmdzIH0pO1xuICAgIH1cblxuICAgIGNvbnNvbGVFbG0uaW5uZXJIVE1MID0gY29uc29sZU1lc3NhZ2VzLm1hcCgoZW50cnkpID0+IHtcbiAgICAgIGNvbnN0IGFjdGlvbiA9IE9iamVjdC5rZXlzKGVudHJ5KVswXTtcbiAgICAgIGNvbnN0IHZhbHVlcyA9IGVudHJ5W2FjdGlvbl07XG4gICAgICBjb25zdCBtZXNzYWdlID0gdmFsdWVzLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIFt1bmRlZmluZWQsIG51bGxdLmluY2x1ZGVzKGl0ZW0pIHx8XG4gICAgICAgICAgWydudW1iZXInLCAnc3RyaW5nJywgJ2Z1bmN0aW9uJ10uaW5jbHVkZXModHlwZW9mIGl0ZW0pXG4gICAgICAgICkgP1xuICAgICAgICAgIGl0ZW0gOlxuICAgICAgICAgIFsnTWFwJywgJ1NldCddLmluY2x1ZGVzKGl0ZW0uY29uc3RydWN0b3IubmFtZSkgP1xuICAgICAgICAgICAgYCR7aXRlbS5jb25zdHJ1Y3Rvci5uYW1lfSAoJHtKU09OLnN0cmluZ2lmeShbLi4uaXRlbV0pfSlgIDpcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KGl0ZW0sIChrZXksIHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgIGlmICgodHlwZW9mIHZhbHVlKSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS50b1N0cmluZygpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgIH0sIGluZGVudCk7XG4gICAgICB9KS5qb2luKCcsICcpO1xuXG4gICAgICBjb25zdCBjb2xvciA9IHtcbiAgICAgICAgbG9nOiAnIzAwMCcsXG4gICAgICAgIHdhcm46ICdvcmFuZ2UnLFxuICAgICAgICBlcnJvcjogJ2RhcmtyZWQnXG4gICAgICB9W2FjdGlvbl07XG5cbiAgICAgIHJldHVybiBgPHByZSBzdHlsZT1cImNvbG9yOiAke2NvbG9yfVwiPiR7bWVzc2FnZX08L3ByZT5gO1xuICAgIH0pLmpvaW4oJ1xcbicpO1xuICB9O1xuICBbJ2xvZycsICd3YXJuJywgJ2Vycm9yJ10uZm9yRWFjaCgoYWN0aW9uKSA9PiB7XG4gICAgY29uc29sZU9yaWdpbmFsW2FjdGlvbl0gPSBjb25zb2xlW2FjdGlvbl07XG4gICAgY29uc29sZVthY3Rpb25dID0gaGFuZGxlci5iaW5kKGNvbnNvbGUsIGFjdGlvbik7XG4gIH0pO1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCAoZXZ0KSA9PiB7XG4gICAgLy8gZXNsaW50IG5vLWNvbnNvbGU6IDBcbiAgICBjb25zb2xlLmVycm9yKGBcIiR7ZXZ0Lm1lc3NhZ2V9XCIgZnJvbSAke2V2dC5maWxlbmFtZX06JHtldnQubGluZW5vfWApO1xuICAgIGNvbnNvbGUuZXJyb3IoZXZ0LCBldnQuZXJyb3Iuc3RhY2spO1xuICAgIC8vIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9KTtcbiAgY29uc29sZUxvZygnY29uc29sZSBjYXB0dXJlZCcpO1xuICByZXR1cm4gZnVuY3Rpb24gcmVsZWFzZUNvbnNvbGUoKSB7XG4gICAgWydsb2cnLCAnd2FybicsICdlcnJvciddLmZvckVhY2goKGFjdGlvbikgPT4ge1xuICAgICAgY29uc29sZVthY3Rpb25dID0gY29uc29sZU9yaWdpbmFsW2FjdGlvbl07XG4gICAgfSk7XG4gICAgY29uc29sZUxvZygnY29uc29sZSByZWxlYXNlZCcpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVDb25zb2xlKHtcbiAgb3B0aW9ucyxcbiAgY29uc29sZVN0eWxlOiB7XG4gICAgYnRuU3RhcnQgPSBidXR0b25TdGFydCwgYnRuSGVpZ2h0ID0gYnV0dG9uSGVpZ2h0LFxuICAgIHdpZHRoID0gYGNhbGMoMTAwdncgLSAke2J0blN0YXJ0fSAtIDMwcHgpYCwgaGVpZ2h0ID0gJzQwMHB4JyxcbiAgICBiYWNrZ3JvdW5kID0gJ3JnYmEoMCwgMCwgMCwgMC41KSdcbiAgfVxufSkge1xuICBjb25zdCB7IHJ0bCA9IGZhbHNlIH0gPSBvcHRpb25zO1xuICBjb25zdCBjb25zb2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbnNvbGUuaWQgPSAnREJVSW9uU2NyZWVuQ29uc29sZSc7XG4gIGNvbnNvbGUuc3R5bGUuY3NzVGV4dCA9IGBcbiAgICBkaXNwbGF5OiBibG9jaztcbiAgICBtYXJnaW46IDBweDtcbiAgICBwYWRkaW5nOiA1cHg7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIG92ZXJmbG93OiBhdXRvO1xuICAgIHdpZHRoOiAke3dpZHRofTtcbiAgICBoZWlnaHQ6ICR7aGVpZ2h0fTtcbiAgICB0b3A6ICR7YnRuSGVpZ2h0fTtcbiAgICAke3J0bCA/ICdyaWdodCcgOiAnbGVmdCd9OiAwcHg7XG4gICAgYmFja2dyb3VuZDogJHtiYWNrZ3JvdW5kfTtcbiAgICB6LWluZGV4OiA5OTk5O1xuICAgIC13ZWJraXQtb3ZlcmZsb3ctc2Nyb2xsaW5nOiB0b3VjaFxuICAgIGA7XG4gIHJldHVybiBjb25zb2xlO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVCdXR0b24oe1xuICBvcHRpb25zLFxuICBidXR0b25TdHlsZToge1xuICAgIHBvc2l0aW9uID0gJ2ZpeGVkJyxcbiAgICB3aWR0aCA9ICcyNXB4JywgaGVpZ2h0ID0gYnV0dG9uSGVpZ2h0LCB0b3AgPSBidXR0b25Ub3AsIHN0YXJ0ID0gYnV0dG9uU3RhcnQsXG4gICAgYmFja2dyb3VuZCA9ICdyZ2JhKDAsIDAsIDAsIDAuNSknXG4gIH1cbn0pIHtcbiAgY29uc3QgeyBydGwgPSBmYWxzZSB9ID0gb3B0aW9ucztcbiAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGJ1dHRvbi5pZCA9ICdEQlVJb25TY3JlZW5Db25zb2xlVG9nZ2xlcic7XG4gIGJ1dHRvbi5zdHlsZS5jc3NUZXh0ID0gYFxuICAgIHBvc2l0aW9uOiAke3Bvc2l0aW9ufTtcbiAgICB3aWR0aDogJHt3aWR0aH07XG4gICAgaGVpZ2h0OiAke2hlaWdodH07XG4gICAgdG9wOiAke3RvcH07XG4gICAgJHtydGwgPyAncmlnaHQnIDogJ2xlZnQnfTogJHtzdGFydH07XG4gICAgYmFja2dyb3VuZDogJHtiYWNrZ3JvdW5kfTtcbiAgICB6LWluZGV4OiA5OTk5O1xuICAgIGA7XG4gIHJldHVybiBidXR0b247XG59XG5cbi8qKlxub25TY3JlZW5Db25zb2xlKHtcbiAgYnV0dG9uU3R5bGUgPSB7IHBvc2l0aW9uLCB3aWR0aCwgaGVpZ2h0LCB0b3AsIHN0YXJ0LCBiYWNrZ3JvdW5kIH0sXG4gIGNvbnNvbGVTdHlsZSA9IHsgd2lkdGgsIGhlaWdodCwgYmFja2dyb3VuZCB9LFxuICBvcHRpb25zID0geyBydGw6IGZhbHNlLCBpbmRlbnQsIHNob3dMYXN0T25seSB9XG59KVxuKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG9uU2NyZWVuQ29uc29sZSh7XG4gIGJ1dHRvblN0eWxlID0ge30sXG4gIGNvbnNvbGVTdHlsZSA9IHt9LFxuICBvcHRpb25zID0ge31cbn0gPSB7fSkge1xuICBjb25zdCBidXR0b24gPSBjcmVhdGVCdXR0b24oe1xuICAgIG9wdGlvbnMsXG4gICAgYnV0dG9uU3R5bGVcbiAgfSk7XG4gIGNvbnN0IGNvbnNvbGUgPSBjcmVhdGVDb25zb2xlKHtcbiAgICBjb25zb2xlU3R5bGU6IHtcbiAgICAgIC4uLmNvbnNvbGVTdHlsZSxcbiAgICAgIGJ0bkhlaWdodDogYnV0dG9uU3R5bGUuaGVpZ2h0LFxuICAgICAgYnRuU3RhcnQ6IGJ1dHRvblN0eWxlLnN0YXJ0XG4gICAgfSxcbiAgICBvcHRpb25zXG4gIH0pO1xuXG4gIGNvbnNvbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIH0pO1xuXG4gIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBpZiAoIWJ1dHRvbi5jb250YWlucyhjb25zb2xlKSkge1xuICAgICAgYnV0dG9uLmFwcGVuZENoaWxkKGNvbnNvbGUpO1xuICAgICAgY29uc29sZS5zY3JvbGxUb3AgPSBjb25zb2xlLnNjcm9sbEhlaWdodCAtIGNvbnNvbGUuY2xpZW50SGVpZ2h0O1xuICAgIH0gZWxzZSB7XG4gICAgICBidXR0b24ucmVtb3ZlQ2hpbGQoY29uc29sZSk7XG4gICAgfVxuICB9KTtcblxuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGJ1dHRvbik7XG4gIGNvbnN0IHJlbGVhc2VDb25zb2xlID0gY2FwdHVyZUNvbnNvbGUoY29uc29sZSwgb3B0aW9ucyk7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIHJlbGVhc2UoKSB7XG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChidXR0b24pO1xuICAgIHJlbGVhc2VDb25zb2xlKCk7XG4gIH07XG59XG4iLCJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRlbXBsYXRlKHN0cmluZ3MsIC4uLmtleXMpIHtcbiAgcmV0dXJuICgoLi4udmFsdWVzKSA9PiB7XG4gICAgY29uc3QgZGljdCA9IHZhbHVlc1t2YWx1ZXMubGVuZ3RoIC0gMV0gfHwge307XG4gICAgY29uc3QgcmVzdWx0ID0gW3N0cmluZ3NbMF1dO1xuICAgIGtleXMuZm9yRWFjaCgoa2V5LCBpKSA9PiB7XG4gICAgICBjb25zdCB2YWx1ZSA9IE51bWJlci5pc0ludGVnZXIoa2V5KSA/IHZhbHVlc1trZXldIDogZGljdFtrZXldO1xuICAgICAgcmVzdWx0LnB1c2godmFsdWUsIHN0cmluZ3NbaSArIDFdKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0LmpvaW4oJycpO1xuICB9KTtcbn1cbiIsIlxuLy8gaHR0cDovL3JhZ2Fud2FsZC5jb20vMjAxNS8xMi8zMS90aGlzLWlzLW5vdC1hbi1lc3NheS1hYm91dC10cmFpdHMtaW4tamF2YXNjcmlwdC5odG1sXG5cbi8qXG5cbmNsYXNzIEEge1xuICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgdGhpcy5pbml0KC4uLmFyZ3MpO1xuICB9XG59XG5cbmNsYXNzIEIgZXh0ZW5kcyBBIHtcbiAgaW5pdCh4KSB7XG4gICAgdGhpcy5feCA9IHg7XG4gIH1cbiAgZ2V0WCgpIHtcbiAgICByZXR1cm4gdGhpcy5feDtcbiAgfVxuICBzZXRYKHZhbHVlKSB7XG4gICAgdGhpcy5feCA9IHZhbHVlO1xuICB9XG4gIGdldCB4KCkge1xuICAgIHJldHVybiB0aGlzLl94O1xuICB9XG4gIHNldCB4KHZhbHVlKSB7XG4gICAgdGhpcy5feCA9IHZhbHVlO1xuICB9XG59XG5cbmZ1bmN0aW9uIHdpdGhEb3VibGVYKGtsYXNzKSB7XG4gIHJldHVybiBPdmVycmlkZU9yRGVmaW5lKHtcblxuICAgIC8vIG92ZXJyaWRlc1xuICAgIGluaXQob3JpZ2luYWxJbml0LCB4LCB5KSB7XG4gICAgICBvcmlnaW5hbEluaXQoeCk7XG4gICAgICB0aGlzLl95ID0geTtcbiAgICB9LFxuICAgIGdldFgob3JpZ2luYWxHZXRYKSB7XG4gICAgICByZXR1cm4gb3JpZ2luYWxHZXRYKCkgKiAyO1xuICAgIH0sXG4gICAgc2V0WChvcmlnaW5hbFNldFgsIHZhbHVlKSB7XG4gICAgICAvLyB0aGlzLl94ID0gdmFsdWUgKiAyO1xuICAgICAgb3JpZ2luYWxTZXRYKHZhbHVlICogMik7XG4gICAgfSxcbiAgICBnZXQgeCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl94ICogMjtcbiAgICB9LFxuICAgIHNldCB4KHZhbHVlKSB7XG4gICAgICB0aGlzLl94ID0gdmFsdWUgKiAyO1xuICAgIH0sXG5cbiAgICAvLyBuZXcgZGVmaW5pdGlvbnNcbiAgICBzZXQgeSh2YWx1ZSkge1xuICAgICAgdGhpcy5feSA9IHZhbHVlICogMjtcbiAgICB9LFxuICAgIGdldCB5KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3kgKiAyO1xuICAgIH0sXG4gICAgaGVsbG8oKSB7XG4gICAgICByZXR1cm4gYGhlbGxvICR7dGhpcy5feH0gYW5kICR7dGhpcy55fWA7XG4gICAgfVxuICB9KShrbGFzcyk7XG59XG5cbkIgPSB3aXRoRG91YmxlWChCKTtcblxuY29uc3QgYiA9IG5ldyBCKDIsIDUpO1xuY29uc29sZS5sb2coYi54KTsgLy8gNFxuY29uc29sZS5sb2coYi5nZXRYKCkpOyAvLyA0XG5cbmIuc2V0WCgzKTtcbi8vIGIueCA9IDM7XG5jb25zb2xlLmxvZyhiLngpOyAvLyAxMlxuY29uc29sZS5sb2coYi5nZXRYKCkpOyAvLyAxMlxuXG4vLyBuZXdcbmNvbnNvbGUubG9nKGIueSk7IC8vIDEwXG5iLnkgPSA5O1xuY29uc29sZS5sb2coYi5oZWxsbygpKTsgLy8gaGVsbG8gNiBhbmQgMzZcblxuKi9cblxuZnVuY3Rpb24gT3ZlcnJpZGVPckRlZmluZShiZWhhdmlvdXIpIHtcbiAgY29uc3QgaW5zdGFuY2VLZXlzID0gUmVmbGVjdC5vd25LZXlzKGJlaGF2aW91cik7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIGRlZmluZShrbGFzcykge1xuICAgIGluc3RhbmNlS2V5cy5mb3JFYWNoKChwcm9wZXJ0eSkgPT4ge1xuXG4gICAgICBjb25zdCBuZXdQcm9wZXJ0eURlc2NyaXB0b3IgPVxuICAgICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGJlaGF2aW91ciwgcHJvcGVydHkpO1xuICAgICAgY29uc3Qgb3JpZ2luYWxQcm9wZXJ0eURlc2NyaXB0b3IgPVxuICAgICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGtsYXNzLnByb3RvdHlwZSwgcHJvcGVydHkpO1xuXG4gICAgICBjb25zdCB7XG4gICAgICAgIHZhbHVlOiBuZXdWYWx1ZSxcbiAgICAgICAgZ2V0OiBuZXdHZXR0ZXIsXG4gICAgICAgIHNldDogbmV3U2V0dGVyXG4gICAgICB9ID0gbmV3UHJvcGVydHlEZXNjcmlwdG9yO1xuXG4gICAgICBpZiAoIW9yaWdpbmFsUHJvcGVydHlEZXNjcmlwdG9yKSB7XG4gICAgICAgIGlmIChuZXdWYWx1ZSkge1xuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShrbGFzcy5wcm90b3R5cGUsIHByb3BlcnR5LCB7XG4gICAgICAgICAgICB2YWx1ZTogbmV3VmFsdWUsXG4gICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShrbGFzcy5wcm90b3R5cGUsIHByb3BlcnR5LCB7XG4gICAgICAgICAgICBnZXQ6IG5ld0dldHRlcixcbiAgICAgICAgICAgIHNldDogbmV3U2V0dGVyLFxuICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHtcbiAgICAgICAgICB2YWx1ZTogb3JpZ2luYWxWYWx1ZSxcbiAgICAgICAgICB3cml0YWJsZTogb3JpZ2luYWxXcml0YWJsZSxcbiAgICAgICAgICBnZXQ6IG9yaWdpbmFsR2V0dGVyLFxuICAgICAgICAgIHNldDogb3JpZ2luYWxTZXR0ZXIsXG4gICAgICAgICAgZW51bWVyYWJsZTogb3JpZ2luYWxFbnVtZXJhYmxlLFxuICAgICAgICAgIGNvbmZpZ3VyYWJsZTogb3JpZ2luYWxDb25maWd1cmFibGVcbiAgICAgICAgfSA9IG9yaWdpbmFsUHJvcGVydHlEZXNjcmlwdG9yO1xuXG4gICAgICAgIGlmIChuZXdWYWx1ZSkge1xuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShrbGFzcy5wcm90b3R5cGUsIHByb3BlcnR5LCB7XG4gICAgICAgICAgICB2YWx1ZSguLi5hcmdzKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGJvdW5kZWRWYWx1ZSA9IG9yaWdpbmFsVmFsdWUuYmluZCh0aGlzKTtcbiAgICAgICAgICAgICAgcmV0dXJuIG5ld1ZhbHVlLmNhbGwodGhpcywgYm91bmRlZFZhbHVlLCAuLi5hcmdzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB3cml0YWJsZTogb3JpZ2luYWxXcml0YWJsZSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IG9yaWdpbmFsRW51bWVyYWJsZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogb3JpZ2luYWxDb25maWd1cmFibGUsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGtsYXNzLnByb3RvdHlwZSwgcHJvcGVydHksIHtcbiAgICAgICAgICAgIGdldDogbmV3R2V0dGVyIHx8IG9yaWdpbmFsR2V0dGVyLFxuICAgICAgICAgICAgc2V0OiBuZXdTZXR0ZXIgfHwgb3JpZ2luYWxTZXR0ZXIsXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiBvcmlnaW5hbEVudW1lcmFibGUsXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IG9yaWdpbmFsQ29uZmlndXJhYmxlLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGtsYXNzO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBPdmVycmlkZU9yRGVmaW5lO1xuIiwiXG4vLyBIZWxwZXJzXG5pbXBvcnQgZGJ1aVdlYkNvbXBvbmVudHNTZXRVcCBmcm9tICcuL2hlbHBlcnMvZGJ1aVdlYkNvbXBvbmVudHNTZXR1cCc7XG5cbi8vIEludGVybmFsc1xuaW1wb3J0IGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbiBmcm9tICcuL2ludGVybmFscy9lbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24nO1xuXG4vLyBDb21wb25lbnRCYXNlXG5pbXBvcnQgZ2V0REJVSVdlYkNvbXBvbmVudEJhc2UgZnJvbSAnLi9jb21wb25lbnRzL0RCVUlXZWJDb21wb25lbnRCYXNlL0RCVUlXZWJDb21wb25lbnRCYXNlJztcblxuLy8gQmVoYXZpb3Vyc1xuaW1wb3J0IEZvY3VzYWJsZSBmcm9tICcuL2JlaGF2aW91cnMvRm9jdXNhYmxlJztcblxuLy8gU2VydmljZXNcbmltcG9ydCBnZXREQlVJTG9jYWxlU2VydmljZSBmcm9tICcuL3NlcnZpY2VzL0RCVUlMb2NhbGVTZXJ2aWNlJztcbmltcG9ydCBnZXREQlVJSTE4blNlcnZpY2UgZnJvbSAnLi9zZXJ2aWNlcy9EQlVJSTE4blNlcnZpY2UnO1xuXG4vLyBVdGlsc1xuaW1wb3J0IGZvcm1hdHRlcnMgZnJvbSAnLi91dGlscy9mb3JtYXR0ZXJzJztcbmltcG9ydCB0cmFpdHMgZnJvbSAnLi91dGlscy90cmFpdHMnO1xuaW1wb3J0IHRlbXBsYXRlIGZyb20gJy4vdXRpbHMvdGVtcGxhdGUnO1xuaW1wb3J0IG9uU2NyZWVuQ29uc29sZSBmcm9tICcuL3V0aWxzL29uU2NyZWVuQ29uc29sZSc7XG5cbi8vIENvbXBvbmVudHNcbmltcG9ydCBnZXREQlVJV2ViQ29tcG9uZW50RHVtbXkgZnJvbSAnLi9jb21wb25lbnRzL0RCVUlXZWJDb21wb25lbnREdW1teS9EQlVJV2ViQ29tcG9uZW50RHVtbXknO1xuaW1wb3J0IGdldERCVUlXZWJDb21wb25lbnREdW1teVBhcmVudCBmcm9tICcuL2NvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50L0RCVUlXZWJDb21wb25lbnREdW1teVBhcmVudCc7XG5pbXBvcnQgZ2V0REJVSVdlYkNvbXBvbmVudEZvcm1JbnB1dFRleHQgZnJvbSAnLi9jb21wb25lbnRzL0RCVUlXZWJDb21wb25lbnRGb3JtSW5wdXRUZXh0L0RCVUlXZWJDb21wb25lbnRGb3JtSW5wdXRUZXh0JztcbmltcG9ydCBnZXREQlVJV2ViQ29tcG9uZW50SWNvbiBmcm9tICcuL2NvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudEljb24vREJVSVdlYkNvbXBvbmVudEljb24nO1xuXG5jb25zdCByZWdpc3RyYXRpb25zID0ge1xuICBbZ2V0REJVSVdlYkNvbXBvbmVudER1bW15LnJlZ2lzdHJhdGlvbk5hbWVdOlxuICAgIGdldERCVUlXZWJDb21wb25lbnREdW1teSxcbiAgW2dldERCVUlXZWJDb21wb25lbnREdW1teVBhcmVudC5yZWdpc3RyYXRpb25OYW1lXTpcbiAgICBnZXREQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQsXG4gIFtnZXREQlVJV2ViQ29tcG9uZW50Rm9ybUlucHV0VGV4dC5yZWdpc3RyYXRpb25OYW1lXTpcbiAgICBnZXREQlVJV2ViQ29tcG9uZW50Rm9ybUlucHV0VGV4dCxcbiAgW2dldERCVUlXZWJDb21wb25lbnRJY29uLnJlZ2lzdHJhdGlvbk5hbWVdOlxuICAgIGdldERCVUlXZWJDb21wb25lbnRJY29uXG59O1xuXG4vKlxuVXNpbmcgdGhpcyBmdW5jdGlvbiBpbXBsaWVzIGVudGlyZSBEQlVJV2ViQ29tcG9uZW50cyBsaWJyYXJ5XG5pcyBhbHJlYWR5IGxvYWRlZC5cbkl0IGlzIHVzZWZ1bCBlc3BlY2lhbGx5IHdoZW4gd29ya2luZyB3aXRoIGRpc3RyaWJ1dGlvbiBidWlsZC5cbklmIHlvdSB3YW50IHRvIGxvYWQganVzdCBvbmUgd2ViLWNvbXBvbmVudCBvciBhIHN1YnNldCBvZiB3ZWItY29tcG9uZW50c1xubG9hZCB0aGVtIGZyb20gbm9kZV9tb2R1bGVzIGJ5IHRoZWlyIHBhdGhcbmV4OlxuaW1wb3J0IFNvbWVDb21wb25lbnRMb2FkZXIgZnJvbSBub2RlX21vZHVsZXMvZGV2LWJveC11aS9idWlsZC9zcmMvbGliL3dlYmNvbXBvbmVudHMvU29tZUNvbXBvbmVudDtcbiovXG5mdW5jdGlvbiBxdWlja1NldHVwQW5kTG9hZCh3aW4gPSB3aW5kb3cpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChjb21wb25lbnRzKSB7XG4gICAgY29uc3QgcmV0ID0ge307XG4gICAgY29tcG9uZW50cy5mb3JFYWNoKCh7IHJlZ2lzdHJhdGlvbk5hbWUsIGNvbXBvbmVudFN0eWxlIH0pID0+IHtcbiAgICAgIGRidWlXZWJDb21wb25lbnRzU2V0VXAod2luKS5hcHBlbmRTdHlsZShyZWdpc3RyYXRpb25OYW1lLCBjb21wb25lbnRTdHlsZSk7XG4gICAgICBjb25zdCBjb21wb25lbnRDbGFzcyA9IHJlZ2lzdHJhdGlvbnNbcmVnaXN0cmF0aW9uTmFtZV0od2luZG93KTtcbiAgICAgIGNvbXBvbmVudENsYXNzLnJlZ2lzdGVyU2VsZigpO1xuICAgICAgcmV0W3JlZ2lzdHJhdGlvbk5hbWVdID0gY29tcG9uZW50Q2xhc3M7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJldDtcbiAgfTtcbn1cblxuZXhwb3J0IHtcbiAgcmVnaXN0cmF0aW9ucyxcblxuICAvLyBIZWxwZXJzXG4gIHF1aWNrU2V0dXBBbmRMb2FkLFxuICBkYnVpV2ViQ29tcG9uZW50c1NldFVwLFxuXG4gIC8vIEludGVybmFsc1xuICBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24sXG5cbiAgLy8gQ29tcG9uZW50QmFzZVxuICBnZXREQlVJV2ViQ29tcG9uZW50QmFzZSxcblxuICAvLyBCZWhhdmlvdXJzXG4gIEZvY3VzYWJsZSxcblxuICAvLyBTZXJ2aWNlc1xuICBnZXREQlVJTG9jYWxlU2VydmljZSxcbiAgZ2V0REJVSUkxOG5TZXJ2aWNlLFxuXG4gIC8vIFV0aWxzXG4gIGZvcm1hdHRlcnMsXG4gIHRyYWl0cyxcbiAgdGVtcGxhdGUsXG4gIG9uU2NyZWVuQ29uc29sZSxcblxuICAvLyBDb21wb25lbnRzXG4gIGdldERCVUlXZWJDb21wb25lbnREdW1teSxcbiAgZ2V0REJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50LFxuICBnZXREQlVJV2ViQ29tcG9uZW50Rm9ybUlucHV0VGV4dCxcbiAgZ2V0REJVSVdlYkNvbXBvbmVudEljb25cbn07XG4iXX0=
