require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
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

},{"../../services/LocaleService":1,"../internals/ensureSingleRegistration":9}],3:[function(require,module,exports){
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

},{"../DBUIWebComponentBase/DBUIWebComponentBase":2,"../internals/ensureSingleRegistration":9}],4:[function(require,module,exports){
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

},{"../DBUIWebComponentBase/DBUIWebComponentBase":2,"../DBUIWebComponentDummy/DBUIWebComponentDummy":3,"../internals/ensureSingleRegistration":9}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDBUIWebComponentFormInputText;

var _DBUIWebComponentBase = require('../DBUIWebComponentBase/DBUIWebComponentBase');

var _DBUIWebComponentBase2 = _interopRequireDefault(_DBUIWebComponentBase);

var _ensureSingleRegistration = require('../internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

var _Focusable = require('../behaviours/Focusable');

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

      // onLocaleChange(locale) {
      //   // console.log('onLocaleChange', locale);
      // }

    }

    return Registerable((0, _Focusable2.default)(defineCommonStaticMethods(DBUIWebComponentFormInputText)));
  });
}

getDBUIWebComponentFormInputText.registrationName = registrationName;

},{"../DBUIWebComponentBase/DBUIWebComponentBase":2,"../behaviours/Focusable":7,"../internals/ensureSingleRegistration":9}],6:[function(require,module,exports){
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

},{"../internals/appendStyle":8}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{}],"dev-box-ui-webcomponents":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDBUIWebComponentFormInputText = exports.getDBUIWebComponentDummyParent = exports.getDBUIWebComponentDummy = exports.Focusable = exports.getDBUIWebComponentBase = exports.ensureSingleRegistration = exports.dbuiWebComponentsSetUp = exports.quickSetupAndLoad = exports.registrations = undefined;

var _DBUIWebComponentsSetup = require('./DBUIWebComponentsSetup/DBUIWebComponentsSetup');

var _DBUIWebComponentsSetup2 = _interopRequireDefault(_DBUIWebComponentsSetup);

var _ensureSingleRegistration = require('./internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

var _DBUIWebComponentBase = require('./DBUIWebComponentBase/DBUIWebComponentBase');

var _DBUIWebComponentBase2 = _interopRequireDefault(_DBUIWebComponentBase);

var _Focusable = require('./behaviours/Focusable');

var _Focusable2 = _interopRequireDefault(_Focusable);

var _DBUIWebComponentDummy = require('./DBUIWebComponentDummy/DBUIWebComponentDummy');

var _DBUIWebComponentDummy2 = _interopRequireDefault(_DBUIWebComponentDummy);

var _DBUIWebComponentDummyParent = require('./DBUIWebComponentDummyParent/DBUIWebComponentDummyParent');

var _DBUIWebComponentDummyParent2 = _interopRequireDefault(_DBUIWebComponentDummyParent);

var _DBUIWebComponentFormInputText = require('./DBUIWebComponentFormInputText/DBUIWebComponentFormInputText');

var _DBUIWebComponentFormInputText2 = _interopRequireDefault(_DBUIWebComponentFormInputText);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// behaviours


// internals
const registrations = {
  [_DBUIWebComponentDummy2.default.registrationName]: _DBUIWebComponentDummy2.default,
  [_DBUIWebComponentDummyParent2.default.registrationName]: _DBUIWebComponentDummyParent2.default,
  [_DBUIWebComponentFormInputText2.default.registrationName]: _DBUIWebComponentFormInputText2.default
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


// components

// helpers
function quickSetupAndLoad(win = window) {
  return function (components) {
    const ret = {};
    components.forEach(({ registrationName, componentStyle }) => {
      (0, _DBUIWebComponentsSetup2.default)(win).appendStyle(registrationName, componentStyle);
      const componentClass = registrations[registrationName](window);
      componentClass.registerSelf();
      ret[registrationName] = componentClass;
    });
    return ret;
  };
}

exports.registrations = registrations;
exports.quickSetupAndLoad = quickSetupAndLoad;
exports.dbuiWebComponentsSetUp = _DBUIWebComponentsSetup2.default;
exports.ensureSingleRegistration = _ensureSingleRegistration2.default;
exports.getDBUIWebComponentBase = _DBUIWebComponentBase2.default;
exports.Focusable = _Focusable2.default;
exports.getDBUIWebComponentDummy = _DBUIWebComponentDummy2.default;
exports.getDBUIWebComponentDummyParent = _DBUIWebComponentDummyParent2.default;
exports.getDBUIWebComponentFormInputText = _DBUIWebComponentFormInputText2.default;

},{"./DBUIWebComponentBase/DBUIWebComponentBase":2,"./DBUIWebComponentDummy/DBUIWebComponentDummy":3,"./DBUIWebComponentDummyParent/DBUIWebComponentDummyParent":4,"./DBUIWebComponentFormInputText/DBUIWebComponentFormInputText":5,"./DBUIWebComponentsSetup/DBUIWebComponentsSetup":6,"./behaviours/Focusable":7,"./internals/ensureSingleRegistration":9}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL3NlcnZpY2VzL0xvY2FsZVNlcnZpY2UuanMiLCJzcmMvbGliL3dlYmNvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudEJhc2UvREJVSVdlYkNvbXBvbmVudEJhc2UuanMiLCJzcmMvbGliL3dlYmNvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudER1bW15L0RCVUlXZWJDb21wb25lbnREdW1teS5qcyIsInNyYy9saWIvd2ViY29tcG9uZW50cy9EQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQvREJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50LmpzIiwic3JjL2xpYi93ZWJjb21wb25lbnRzL0RCVUlXZWJDb21wb25lbnRGb3JtSW5wdXRUZXh0L0RCVUlXZWJDb21wb25lbnRGb3JtSW5wdXRUZXh0LmpzIiwic3JjL2xpYi93ZWJjb21wb25lbnRzL0RCVUlXZWJDb21wb25lbnRzU2V0dXAvREJVSVdlYkNvbXBvbmVudHNTZXR1cC5qcyIsInNyYy9saWIvd2ViY29tcG9uZW50cy9iZWhhdmlvdXJzL0ZvY3VzYWJsZS5qcyIsInNyYy9saWIvd2ViY29tcG9uZW50cy9pbnRlcm5hbHMvYXBwZW5kU3R5bGUuanMiLCJzcmMvbGliL3dlYmNvbXBvbmVudHMvaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbi5qcyIsInNyYy9saWIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7QUNDQSxNQUFNLGdCQUFnQjtBQUNwQixPQUFLLEtBRGU7QUFFcEIsUUFBTTtBQUZjLENBQXRCOztBQUtBLE1BQU0sYUFBTixDQUFvQjtBQUNsQixnQkFBYztBQUNaLFNBQUssVUFBTCxHQUFrQixFQUFsQjtBQUNBLFNBQUssWUFBTCxHQUFvQixPQUFPLElBQVAsQ0FBWSxhQUFaLENBQXBCO0FBQ0EsU0FBSyxZQUFMLEdBQW9CLE9BQU8sUUFBUCxDQUFnQixlQUFw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LENBQTJCLE1BQU0sTUFBakMsRUFBeUM7QUFDdkMsU0FBTyxVQUFVLFVBQVYsRUFBc0I7QUFDM0IsVUFBTSxNQUFNLEVBQVo7QUFDQSxlQUFXLE9BQVgsQ0FBbUIsQ0FBQyxFQUFFLGdCQUFGLEVBQW9CLGNBQXBCLEVBQUQsS0FBMEM7QUFDM0QsNENBQXVCLEdBQXZCLEVBQTRCLFdBQTVCLENBQXdDLGdCQUF4QyxFQUEwRCxjQUExRDtBQUNBLFlBQU0saUJBQWlCLGNBQWMsZ0JBQWQsRUFBZ0MsTUFBaEMsQ0FBdkI7QUFDQSxxQkFBZSxZQUFmO0FBQ0EsVUFBSSxnQkFBSixJQUF3QixjQUF4QjtBQUNELEtBTEQ7QUFNQSxXQUFPLEdBQVA7QUFDRCxHQVREO0FBVUQ7O1FBR0MsYSxHQUFBLGE7UUFHQSxpQixHQUFBLGlCO1FBQ0Esc0I7UUFHQSx3QjtRQUNBLHVCO1FBR0EsUztRQUdBLHdCO1FBQ0EsOEI7UUFDQSxnQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcbmNvbnN0IGRlZmF1bHRMb2NhbGUgPSB7XG4gIGRpcjogJ2x0cicsXG4gIGxhbmc6ICdlbidcbn07XG5cbmNsYXNzIExvY2FsZVNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9jYWxsYmFja3MgPSBbXTtcbiAgICB0aGlzLl9sb2NhbGVBdHRycyA9IE9iamVjdC5rZXlzKGRlZmF1bHRMb2NhbGUpO1xuICAgIHRoaXMuX3Jvb3RFbGVtZW50ID0gd2luZG93LmRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICB0aGlzLl9sb2NhbGVBdHRycy5mb3JFYWNoKChhdHRyKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuX3Jvb3RFbGVtZW50LmdldEF0dHJpYnV0ZShhdHRyKSkge1xuICAgICAgICB0aGlzLl9yb290RWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0ciwgZGVmYXVsdExvY2FsZVthdHRyXSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5fbG9jYWxlID0gdGhpcy5fbG9jYWxlQXR0cnMucmVkdWNlKChhY2MsIGF0dHIpID0+IHtcbiAgICAgIGFjY1thdHRyXSA9IHRoaXMuX3Jvb3RFbGVtZW50LmdldEF0dHJpYnV0ZShhdHRyKTtcbiAgICAgIHJldHVybiBhY2M7XG4gICAgfSwge30pO1xuICAgIHRoaXMuX29ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy5faGFuZGxlTXV0YXRpb25zLmJpbmQodGhpcykpO1xuICAgIHRoaXMuX29ic2VydmVyLm9ic2VydmUodGhpcy5fcm9vdEVsZW1lbnQsIHtcbiAgICAgIGF0dHJpYnV0ZXM6IHRydWVcbiAgICB9KTtcbiAgfVxuXG4gIF9oYW5kbGVNdXRhdGlvbnMobXV0YXRpb25zKSB7XG4gICAgbXV0YXRpb25zLmZvckVhY2goKG11dGF0aW9uKSA9PiB7XG4gICAgICBjb25zdCBtdXRhdGlvbkF0dHJpYnV0ZU5hbWUgPSBtdXRhdGlvbi5hdHRyaWJ1dGVOYW1lO1xuICAgICAgaWYgKHRoaXMuX2xvY2FsZUF0dHJzLmluY2x1ZGVzKG11dGF0aW9uQXR0cmlidXRlTmFtZSkpIHtcbiAgICAgICAgdGhpcy5fbG9jYWxlID0ge1xuICAgICAgICAgIC4uLnRoaXMuX2xvY2FsZSxcbiAgICAgICAgICBbbXV0YXRpb25BdHRyaWJ1dGVOYW1lXTogdGhpcy5fcm9vdEVsZW1lbnQuZ2V0QXR0cmlidXRlKG11dGF0aW9uQXR0cmlidXRlTmFtZSlcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tzLmZvckVhY2goY2FsbGJhY2sgPT4gY2FsbGJhY2sodGhpcy5fbG9jYWxlKSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzZXQgbG9jYWxlKGxvY2FsZU9iaikge1xuICAgIE9iamVjdC5rZXlzKGxvY2FsZU9iaikuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICB0aGlzLl9yb290RWxlbWVudC5zZXRBdHRyaWJ1dGUoa2V5LCBsb2NhbGVPYmpba2V5XSk7XG4gICAgfSk7XG4gIH1cblxuICBnZXQgbG9jYWxlKCkge1xuICAgIHJldHVybiB0aGlzLl9sb2NhbGU7XG4gIH1cblxuICBvbkxvY2FsZUNoYW5nZShjYWxsYmFjaykge1xuICAgIHRoaXMuX2NhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcbiAgICBjYWxsYmFjayh0aGlzLmxvY2FsZSk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcy5maWx0ZXIoY2IgPT4gY2IgIT09IGNhbGxiYWNrKTtcbiAgICB9O1xuICB9XG59XG5cbmNvbnN0IGxvY2FsZVNlcnZpY2UgPSBuZXcgTG9jYWxlU2VydmljZSgpO1xuZXhwb3J0IGRlZmF1bHQgbG9jYWxlU2VydmljZTtcbiIsIlxuaW1wb3J0IExvY2FsZVNlcnZpY2UgZnJvbSAnLi4vLi4vc2VydmljZXMvTG9jYWxlU2VydmljZSc7XG5pbXBvcnQgZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uIGZyb20gJy4uL2ludGVybmFscy9lbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24nO1xuXG5jb25zdCByZWdpc3RyYXRpb25OYW1lID0gJ0RCVUlXZWJDb21wb25lbnRCYXNlJztcblxuZnVuY3Rpb24gZGVmaW5lQ29tbW9uQ1NTVmFycygpIHtcbiAgY29uc3QgY29tbW9uU3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICBjb21tb25TdHlsZS5pbm5lckhUTUwgPSBgXG4gIDpyb290IHtcbiAgICAtLWRidWktd2ViLWNvbXBvbmVudC1nbG9iYWwtYm9yZGVyLXJhZGl1czogNXB4O1xuICAgIC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtaGVpZ2h0OiAzMHB4O1xuICAgIC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtY29sb3I6ICMwMDA7XG4gICAgLS1kYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC1iYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICAtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWJvcmRlci1jb2xvcjogI2NjYztcbiAgICAtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWJvcmRlci1zdHlsZTogc29saWQ7XG4gICAgLS1kYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC1ib3JkZXItd2lkdGg6IDFweDtcbiAgfVxuICBgO1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdoZWFkJykuYXBwZW5kQ2hpbGQoY29tbW9uU3R5bGUpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXREQlVJV2ViQ29tcG9uZW50QmFzZSh3aW4pIHtcbiAgcmV0dXJuIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbih3aW4sIHJlZ2lzdHJhdGlvbk5hbWUsICgpID0+IHtcbiAgICBkZWZpbmVDb21tb25DU1NWYXJzKCk7XG5cbiAgICBjb25zdCB7IGRvY3VtZW50LCBIVE1MRWxlbWVudCwgY3VzdG9tRWxlbWVudHMgfSA9IHdpbjtcblxuICAgIGNsYXNzIERCVUlXZWJDb21wb25lbnRCYXNlIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuXG4gICAgICBzdGF0aWMgZ2V0IHJlZ2lzdHJhdGlvbk5hbWUoKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigncmVnaXN0cmF0aW9uTmFtZSBtdXN0IGJlIGRlZmluZWQgaW4gZGVyaXZlZCBjbGFzc2VzJyk7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgdGVtcGxhdGVJbm5lckhUTUwoKSB7XG4gICAgICAgIHJldHVybiAnPHN0eWxlPjwvc3R5bGU+PHNsb3Q+PC9zbG90Pic7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgZGVwZW5kZW5jaWVzKCkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgdXNlU2hhZG93KCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCBwcm9wZXJ0aWVzVG9VcGdyYWRlKCkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgcHJvcGVydGllc1RvRGVmaW5lKCkge1xuICAgICAgICByZXR1cm4ge307XG4gICAgICB9XG5cbiAgICAgIGdldCBpbnN0YW5jZVByb3BlcnRpZXNUb0RlZmluZSgpIHtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgfVxuXG4gICAgICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgY29uc3QgeyB1c2VTaGFkb3cgfSA9IHRoaXMuY29uc3RydWN0b3I7XG4gICAgICAgIGlmICh1c2VTaGFkb3cpIHtcbiAgICAgICAgICB0aGlzLmF0dGFjaFNoYWRvdyh7XG4gICAgICAgICAgICBtb2RlOiAnb3BlbicsXG4gICAgICAgICAgICAvLyBkZWxlZ2F0ZXNGb2N1czogdHJ1ZVxuICAgICAgICAgICAgLy8gTm90IHdvcmtpbmcgb24gSVBhZCBzbyB3ZSBkbyBhbiB3b3JrYXJvdW5kXG4gICAgICAgICAgICAvLyBieSBzZXR0aW5nIFwiZm9jdXNlZFwiIGF0dHJpYnV0ZSB3aGVuIG5lZWRlZC5cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9pc0Nvbm5lY3RlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9pbnNlcnRUZW1wbGF0ZSgpO1xuXG4gICAgICAgIHRoaXMuY29ubmVjdGVkQ2FsbGJhY2sgPSB0aGlzLmNvbm5lY3RlZENhbGxiYWNrLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuZGlzY29ubmVjdGVkQ2FsbGJhY2sgPSB0aGlzLmRpc2Nvbm5lY3RlZENhbGxiYWNrLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuX2hhbmRsZUxvY2FsZUNoYW5nZSA9IHRoaXMuX2hhbmRsZUxvY2FsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm9uTG9jYWxlQ2hhbmdlICYmICh0aGlzLm9uTG9jYWxlQ2hhbmdlID0gdGhpcy5vbkxvY2FsZUNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy51bnJlZ2lzdGVyTG9jYWxlQ2hhbmdlID0gbnVsbDtcblxuICAgICAgICAvLyBwcm92aWRlIHN1cHBvcnQgZm9yIHRyYWl0cyBpZiBhbnkgYXMgdGhleSBjYW50IG92ZXJyaWRlIGNvbnN0cnVjdG9yXG4gICAgICAgIHRoaXMuaW5pdCAmJiB0aGlzLmluaXQoLi4uYXJncyk7XG4gICAgICB9XG5cbiAgICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL3dlYi9mdW5kYW1lbnRhbHMvd2ViLWNvbXBvbmVudHMvYmVzdC1wcmFjdGljZXMjbGF6eS1wcm9wZXJ0aWVzXG4gICAgICAvLyBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS93ZWIvZnVuZGFtZW50YWxzL3dlYi1jb21wb25lbnRzL2V4YW1wbGVzL2hvd3RvLWNoZWNrYm94XG4gICAgICAvKiBlc2xpbnQgbm8tcHJvdG90eXBlLWJ1aWx0aW5zOiAwICovXG4gICAgICBfdXBncmFkZVByb3BlcnR5KHByb3ApIHtcbiAgICAgICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXNbcHJvcF07XG4gICAgICAgICAgZGVsZXRlIHRoaXNbcHJvcF07XG4gICAgICAgICAgdGhpc1twcm9wXSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIF9kZWZpbmVQcm9wZXJ0eShrZXksIHZhbHVlKSB7XG4gICAgICAgIGlmICghdGhpcy5oYXNBdHRyaWJ1dGUoa2V5KSkge1xuICAgICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKGtleSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgICB0aGlzLl9pc0Nvbm5lY3RlZCA9IHRydWU7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdiZWZvcmV1bmxvYWQnLCB0aGlzLmRpc2Nvbm5lY3RlZENhbGxiYWNrLCBmYWxzZSk7XG4gICAgICAgIHRoaXMudW5yZWdpc3RlckxvY2FsZUNoYW5nZSA9XG4gICAgICAgICAgTG9jYWxlU2VydmljZS5vbkxvY2FsZUNoYW5nZSh0aGlzLl9oYW5kbGVMb2NhbGVDaGFuZ2UpO1xuICAgICAgICBjb25zdCB7IHByb3BlcnRpZXNUb1VwZ3JhZGUsIHByb3BlcnRpZXNUb0RlZmluZSB9ID0gdGhpcy5jb25zdHJ1Y3RvcjtcbiAgICAgICAgY29uc3QgeyBpbnN0YW5jZVByb3BlcnRpZXNUb0RlZmluZSB9ID0gdGhpcztcbiAgICAgICAgY29uc3QgYWxsUHJvcGVydGllc1RvRGVmaW5lID0ge1xuICAgICAgICAgIC4uLnByb3BlcnRpZXNUb0RlZmluZSxcbiAgICAgICAgICAuLi5pbnN0YW5jZVByb3BlcnRpZXNUb0RlZmluZVxuICAgICAgICB9O1xuICAgICAgICBwcm9wZXJ0aWVzVG9VcGdyYWRlLmZvckVhY2goKHByb3BlcnR5KSA9PiB7XG4gICAgICAgICAgdGhpcy5fdXBncmFkZVByb3BlcnR5KHByb3BlcnR5KTtcbiAgICAgICAgfSk7XG4gICAgICAgIE9iamVjdC5rZXlzKGFsbFByb3BlcnRpZXNUb0RlZmluZSkuZm9yRWFjaCgocHJvcGVydHkpID0+IHtcbiAgICAgICAgICB0aGlzLl9kZWZpbmVQcm9wZXJ0eShwcm9wZXJ0eSwgYWxsUHJvcGVydGllc1RvRGVmaW5lW3Byb3BlcnR5XSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgICAgdGhpcy5faXNDb25uZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy51bnJlZ2lzdGVyTG9jYWxlQ2hhbmdlKCk7XG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdiZWZvcmV1bmxvYWQnLCB0aGlzLmRpc2Nvbm5lY3RlZENhbGxiYWNrLCBmYWxzZSk7XG4gICAgICB9XG5cbiAgICAgIGdldCBjaGlsZHJlblRyZWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLnVzZVNoYWRvdyA/IHRoaXMuc2hhZG93Um9vdCA6IHRoaXM7XG4gICAgICB9XG5cbiAgICAgIF9pbnNlcnRUZW1wbGF0ZSgpIHtcbiAgICAgICAgY29uc3QgeyB0ZW1wbGF0ZSB9ID0gdGhpcy5jb25zdHJ1Y3RvcjtcblxuICAgICAgICBpZiAodGVtcGxhdGUpIHtcbiAgICAgICAgICB0aGlzLmNoaWxkcmVuVHJlZS5hcHBlbmRDaGlsZCh0ZW1wbGF0ZS5jb250ZW50LmNsb25lTm9kZSh0cnVlKSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgX2hhbmRsZUxvY2FsZUNoYW5nZShsb2NhbGUpIHtcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2RpcicsIGxvY2FsZS5kaXIpO1xuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnbGFuZycsIGxvY2FsZS5sYW5nKTtcbiAgICAgICAgdGhpcy5vbkxvY2FsZUNoYW5nZSAmJiB0aGlzLm9uTG9jYWxlQ2hhbmdlKGxvY2FsZSk7XG4gICAgICB9XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzKGtsYXNzKSB7XG4gICAgICBjb25zdCB0ZW1wbGF0ZUlubmVySFRNTCA9IGtsYXNzLnRlbXBsYXRlSW5uZXJIVE1MO1xuICAgICAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAgICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gdGVtcGxhdGVJbm5lckhUTUw7XG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShrbGFzcywgJ3RlbXBsYXRlJywge1xuICAgICAgICBnZXQoKSB7IHJldHVybiB0ZW1wbGF0ZTsgfSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfSk7XG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShrbGFzcywgJ2NvbXBvbmVudFN0eWxlJywge1xuICAgICAgICBnZXQoKSB7XG4gICAgICAgICAgcmV0dXJuIGtsYXNzLnRlbXBsYXRlLmNvbnRlbnQucXVlcnlTZWxlY3Rvcignc3R5bGUnKS5pbm5lckhUTUw7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCh2YWx1ZSkge1xuICAgICAgICAgIGtsYXNzLnRlbXBsYXRlLmNvbnRlbnQucXVlcnlTZWxlY3Rvcignc3R5bGUnKS5pbm5lckhUTUwgPSB2YWx1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBrbGFzcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBSZWdpc3RlcmFibGUoa2xhc3MpIHtcbiAgICAgIGtsYXNzLnJlZ2lzdGVyU2VsZiA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgcmVnaXN0cmF0aW9uTmFtZSA9IGtsYXNzLnJlZ2lzdHJhdGlvbk5hbWU7XG4gICAgICAgIGNvbnN0IGRlcGVuZGVuY2llcyA9IGtsYXNzLmRlcGVuZGVuY2llcztcbiAgICAgICAgLy8gTWFrZSBzdXJlIG91ciBkZXBlbmRlbmNpZXMgYXJlIHJlZ2lzdGVyZWQgYmVmb3JlIHdlIHJlZ2lzdGVyIHNlbGZcbiAgICAgICAgZGVwZW5kZW5jaWVzLmZvckVhY2goKGRlcGVuZGVuY3kpID0+IGRlcGVuZGVuY3kucmVnaXN0ZXJTZWxmKCkpO1xuICAgICAgICAvLyBEb24ndCB0cnkgdG8gcmVnaXN0ZXIgc2VsZiBpZiBhbHJlYWR5IHJlZ2lzdGVyZWRcbiAgICAgICAgaWYgKGN1c3RvbUVsZW1lbnRzLmdldChyZWdpc3RyYXRpb25OYW1lKSkgcmV0dXJuIHJlZ2lzdHJhdGlvbk5hbWU7XG4gICAgICAgIC8vIEdpdmUgYSBjaGFuY2UgdG8gb3ZlcnJpZGUgd2ViLWNvbXBvbmVudCBzdHlsZSBpZiBwcm92aWRlZCBiZWZvcmUgYmVpbmcgcmVnaXN0ZXJlZC5cbiAgICAgICAgY29uc3QgY29tcG9uZW50U3R5bGUgPSAoKHdpbi5EQlVJV2ViQ29tcG9uZW50cyB8fCB7fSlbcmVnaXN0cmF0aW9uTmFtZV0gfHwge30pLmNvbXBvbmVudFN0eWxlO1xuICAgICAgICBpZiAoY29tcG9uZW50U3R5bGUpIHtcbiAgICAgICAgICBrbGFzcy5jb21wb25lbnRTdHlsZSArPSBjb21wb25lbnRTdHlsZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBEbyByZWdpc3RyYXRpb25cbiAgICAgICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKHJlZ2lzdHJhdGlvbk5hbWUsIGtsYXNzKTtcbiAgICAgICAgcmV0dXJuIHJlZ2lzdHJhdGlvbk5hbWU7XG4gICAgICB9O1xuXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoa2xhc3MsICdwcm90b3R5cGVDaGFpbkluZm8nLCB7XG4gICAgICAgIGdldCgpIHtcbiAgICAgICAgICBjb25zdCBjaGFpbiA9IFtrbGFzc107XG4gICAgICAgICAgbGV0IHBhcmVudFByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGtsYXNzKTtcbiAgICAgICAgICB3aGlsZSAocGFyZW50UHJvdG8gIT09IEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICBjaGFpbi5wdXNoKHBhcmVudFByb3RvKTtcbiAgICAgICAgICAgIHBhcmVudFByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHBhcmVudFByb3RvKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2hhaW4ucHVzaChwYXJlbnRQcm90byk7XG4gICAgICAgICAgcmV0dXJuIGNoYWluO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIGtsYXNzO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBEQlVJV2ViQ29tcG9uZW50QmFzZSxcbiAgICAgIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMsXG4gICAgICBSZWdpc3RlcmFibGVcbiAgICB9O1xuICB9KTtcbn1cbiIsIlxuaW1wb3J0IGdldERCVUlXZWJDb21wb25lbnRCYXNlIGZyb20gJy4uL0RCVUlXZWJDb21wb25lbnRCYXNlL0RCVUlXZWJDb21wb25lbnRCYXNlJztcbmltcG9ydCBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24gZnJvbSAnLi4vaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbic7XG5cbmNvbnN0IHJlZ2lzdHJhdGlvbk5hbWUgPSAnZGJ1aS13ZWItY29tcG9uZW50LWR1bW15JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0REJVSVdlYkNvbXBvbmVudER1bW15KHdpbikge1xuICByZXR1cm4gZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uKHdpbiwgcmVnaXN0cmF0aW9uTmFtZSwgKCkgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIERCVUlXZWJDb21wb25lbnRCYXNlLFxuICAgICAgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyxcbiAgICAgIFJlZ2lzdGVyYWJsZVxuICAgIH0gPSBnZXREQlVJV2ViQ29tcG9uZW50QmFzZSh3aW4pO1xuXG4gICAgY2xhc3MgREJVSVdlYkNvbXBvbmVudER1bW15IGV4dGVuZHMgREJVSVdlYkNvbXBvbmVudEJhc2Uge1xuXG4gICAgICBzdGF0aWMgZ2V0IHJlZ2lzdHJhdGlvbk5hbWUoKSB7XG4gICAgICAgIHJldHVybiByZWdpc3RyYXRpb25OYW1lO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlSW5uZXJIVE1MKCkge1xuICAgICAgICByZXR1cm4gYFxuICAgICAgICAgIDxzdHlsZT5cbiAgICAgICAgICA6aG9zdCB7XG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgIG1heC13aWR0aDogNDAwcHg7XG4gICAgICAgICAgICBoZWlnaHQ6IHZhcigtLWRidWktaW5wdXQtaGVpZ2h0LCA1MHB4KTtcbiAgICAgICAgICAgIGNvbG9yOiBtYXJvb247XG4gICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCBncmF5O1xuICAgICAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgOmhvc3QgYiwgOmhvc3QgZGl2W3gtaGFzLXNsb3RdIHNwYW5beC1zbG90LXdyYXBwZXJdIHtcbiAgICAgICAgICAgIHVuaWNvZGUtYmlkaTogYmlkaS1vdmVycmlkZTtcbiAgICAgICAgICAgIHRleHQtc2hhZG93OiB2YXIoLS1kdW1teS1iLXRleHQtc2hhZG93LCBub25lKTtcbiAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgOmhvc3QoW2Rpcj1ydGxdKSBiIHtcbiAgICAgICAgICAgIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICA6aG9zdChbZGlyPWx0cl0pIGIge1xuICAgICAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiBvdmVybGluZTtcbiAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgOmhvc3QoW2Rpcj1sdHJdKSAjY29udGFpbmVyID4gZGl2W2Rpcj1ydGxdLFxuICAgICAgICAgIDpob3N0KFtkaXI9cnRsXSkgI2NvbnRhaW5lciA+IGRpdltkaXI9bHRyXSB7XG4gICAgICAgICAgICBkaXNwbGF5OiBub25lO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICA6aG9zdCAjY29udGFpbmVyID4gZGl2W3gtaGFzLXNsb3RdIHtcbiAgICAgICAgICAgIG1hcmdpbi1sZWZ0OiAwcHg7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgICNjb250YWluZXIge1xuICAgICAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgZmxleC1mbG93OiByb3cgbm93cmFwO1xuICAgICAgICAgICAgYWxpZ24taXRlbXM6IHN0cmV0Y2g7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgICNjb250YWluZXIgPiBkaXYge1xuICAgICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgZ3JheTtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IHZhcigtLWR1bW15LWlubmVyLXNlY3Rpb25zLWJvcmRlci1yYWRpdXMsIDBweCk7XG4gICAgICAgICAgICBmbGV4OiAxIDAgMCU7XG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgbWFyZ2luOiA1cHg7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgICNjb250YWluZXIgPiBkaXYgPiBkaXYge1xuICAgICAgICAgICAgbWFyZ2luOiBhdXRvO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICA8L3N0eWxlPlxuICAgICAgICAgIFxuICAgICAgICAgIDxkaXYgaWQ9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgIDxkaXYgZGlyPVwibHRyXCI+XG4gICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGI+RHVtbXkgc2hhZG93PC9iPiBbTFRSXVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgXG4gICAgICAgICAgICA8ZGl2IHgtaGFzLXNsb3Q+XG4gICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPHNwYW4+Wzwvc3Bhbj48c3BhbiB4LXNsb3Qtd3JhcHBlcj48c2xvdD48L3Nsb3Q+PC9zcGFuPjxzcGFuPl08L3NwYW4+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIDxkaXYgZGlyPVwicnRsXCI+XG4gICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGI+RHVtbXkgc2hhZG93PC9iPiBbUlRMXVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuICAgICAgfVxuXG4gICAgICBvbkxvY2FsZUNoYW5nZShsb2NhbGUpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ29uTG9jYWxlQ2hhbmdlJywgbG9jYWxlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gUmVnaXN0ZXJhYmxlKFxuICAgICAgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyhcbiAgICAgICAgREJVSVdlYkNvbXBvbmVudER1bW15XG4gICAgICApXG4gICAgKTtcbiAgfSk7XG59XG5cbmdldERCVUlXZWJDb21wb25lbnREdW1teS5yZWdpc3RyYXRpb25OYW1lID0gcmVnaXN0cmF0aW9uTmFtZTtcblxuIiwiXG5cbmltcG9ydCBnZXREQlVJV2ViQ29tcG9uZW50QmFzZSBmcm9tICcuLi9EQlVJV2ViQ29tcG9uZW50QmFzZS9EQlVJV2ViQ29tcG9uZW50QmFzZSc7XG5pbXBvcnQgZ2V0REJVSVdlYkNvbXBvbmVudER1bW15IGZyb20gJy4uL0RCVUlXZWJDb21wb25lbnREdW1teS9EQlVJV2ViQ29tcG9uZW50RHVtbXknO1xuaW1wb3J0IGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbiBmcm9tICcuLi9pbnRlcm5hbHMvZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uJztcblxuY29uc3QgcmVnaXN0cmF0aW9uTmFtZSA9ICdkYnVpLXdlYi1jb21wb25lbnQtZHVtbXktcGFyZW50JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0REJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50KHdpbikge1xuICByZXR1cm4gZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uKHdpbiwgcmVnaXN0cmF0aW9uTmFtZSwgKCkgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIERCVUlXZWJDb21wb25lbnRCYXNlLFxuICAgICAgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyxcbiAgICAgIFJlZ2lzdGVyYWJsZVxuICAgIH0gPSBnZXREQlVJV2ViQ29tcG9uZW50QmFzZSh3aW4pO1xuICAgIGNvbnN0IERCVUlXZWJDb21wb25lbnREdW1teSA9IGdldERCVUlXZWJDb21wb25lbnREdW1teSh3aW4pO1xuXG4gICAgY2xhc3MgREJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50IGV4dGVuZHMgREJVSVdlYkNvbXBvbmVudEJhc2Uge1xuXG4gICAgICBzdGF0aWMgZ2V0IHJlZ2lzdHJhdGlvbk5hbWUoKSB7XG4gICAgICAgIHJldHVybiByZWdpc3RyYXRpb25OYW1lO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlSW5uZXJIVE1MKCkge1xuICAgICAgICByZXR1cm4gYFxuICAgICAgICAgIDxzdHlsZT5cbiAgICAgICAgICA6aG9zdCB7XG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgIG1heC13aWR0aDogNDAwcHg7XG4gICAgICAgICAgfVxuICAgICAgICAgIDwvc3R5bGU+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxiPkR1bW15IFBhcmVudCBzaGFkb3c8L2I+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxkYnVpLXdlYi1jb21wb25lbnQtZHVtbXk+PHNsb3Q+PC9zbG90PjwvZGJ1aS13ZWItY29tcG9uZW50LWR1bW15PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIGA7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgZGVwZW5kZW5jaWVzKCkge1xuICAgICAgICByZXR1cm4gW0RCVUlXZWJDb21wb25lbnREdW1teV07XG4gICAgICB9XG5cbiAgICB9XG5cbiAgICByZXR1cm4gUmVnaXN0ZXJhYmxlKFxuICAgICAgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyhcbiAgICAgICAgREJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50XG4gICAgICApXG4gICAgKTtcbiAgfSk7XG59XG5cbmdldERCVUlXZWJDb21wb25lbnREdW1teVBhcmVudC5yZWdpc3RyYXRpb25OYW1lID0gcmVnaXN0cmF0aW9uTmFtZTtcblxuIiwiXG5pbXBvcnQgZ2V0REJVSVdlYkNvbXBvbmVudEJhc2UgZnJvbSAnLi4vREJVSVdlYkNvbXBvbmVudEJhc2UvREJVSVdlYkNvbXBvbmVudEJhc2UnO1xuaW1wb3J0IGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbiBmcm9tICcuLi9pbnRlcm5hbHMvZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uJztcbmltcG9ydCBGb2N1c2FibGUgZnJvbSAnLi4vYmVoYXZpb3Vycy9Gb2N1c2FibGUnO1xuXG5jb25zdCByZWdpc3RyYXRpb25OYW1lID0gJ2RidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LXRleHQnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXREQlVJV2ViQ29tcG9uZW50Rm9ybUlucHV0VGV4dCh3aW4pIHtcbiAgcmV0dXJuIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbih3aW4sIHJlZ2lzdHJhdGlvbk5hbWUsICgpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBEQlVJV2ViQ29tcG9uZW50QmFzZSxcbiAgICAgIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMsXG4gICAgICBSZWdpc3RlcmFibGVcbiAgICB9ID0gZ2V0REJVSVdlYkNvbXBvbmVudEJhc2Uod2luKTtcblxuICAgIGNsYXNzIERCVUlXZWJDb21wb25lbnRGb3JtSW5wdXRUZXh0IGV4dGVuZHMgREJVSVdlYkNvbXBvbmVudEJhc2Uge1xuXG4gICAgICBzdGF0aWMgZ2V0IHJlZ2lzdHJhdGlvbk5hbWUoKSB7XG4gICAgICAgIHJldHVybiByZWdpc3RyYXRpb25OYW1lO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlSW5uZXJIVE1MKCkge1xuICAgICAgICByZXR1cm4gYFxuICAgICAgICAgIDxzdHlsZT5cbiAgICAgICAgICA6aG9zdCB7XG4gICAgICAgICAgICBhbGw6IGluaXRpYWw7IFxuICAgICAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgICAgICAvKmhlaWdodDogdmFyKC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtaGVpZ2h0KTsqL1xuICAgICAgICAgICAgLypsaW5lLWhlaWdodDogdmFyKC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtaGVpZ2h0KTsqL1xuICAgICAgICAgICAgaGVpZ2h0OiAzMDBweDtcbiAgICAgICAgICAgIHBhZGRpbmc6IDBweDtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMThweDtcbiAgICAgICAgICAgIGNvbG9yOiB2YXIoLS1kYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC1jb2xvcik7XG4gICAgICAgICAgICAvKmJhY2tncm91bmQtY29sb3I6IHZhcigtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWJhY2tncm91bmQtY29sb3IpOyovXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMTAwLCAwLCAwLjEpO1xuICAgICAgICAgICAgdW5pY29kZS1iaWRpOiBiaWRpLW92ZXJyaWRlO1xuICAgICAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAgICAgICAgIGJvcmRlcjogbm9uZTtcbiAgICAgICAgICAgIGJvcmRlci1ib3R0b206IHZhcigtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWJvcmRlci13aWR0aCkgdmFyKC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtYm9yZGVyLXN0eWxlKSB2YXIoLS1kYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC1ib3JkZXItY29sb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICA6aG9zdCBbdGFiaW5kZXhdIHtcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgaGVpZ2h0OiA1MHB4O1xuICAgICAgICAgICAgbGluZS1oZWlnaHQ6IDUwcHg7XG4gICAgICAgICAgICBib3JkZXI6IG5vbmU7XG4gICAgICAgICAgICBtYXJnaW46IDBweDtcbiAgICAgICAgICAgIHBhZGRpbmc6IDBweDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMHB4O1xuICAgICAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAgICAgICAgIHVuaWNvZGUtYmlkaTogYmlkaS1vdmVycmlkZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgOmhvc3QgW3RhYmluZGV4XTpmb2N1cyB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMCwgMCwgLjMpO1xuICAgICAgICAgICAgb3V0bGluZTogbm9uZTtcbiAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgOmhvc3QoW2ZvY3VzZWRdKSB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDI1NSwgMCwgLjMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICAvKjpob3N0KFtkaXNhYmxlZF0pIHsqL1xuICAgICAgICAgICAgLypiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIC4zKTsqL1xuICAgICAgICAgIC8qfSovXG4gICAgXG4gICAgICAgICAgOmhvc3QoW2hpZGRlbl0pIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgICAgICAgfVxuICAgIFxuICAgICAgICAgIDpob3N0KFtkaXI9cnRsXSkge1xuICAgICAgICAgIFxuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICA6aG9zdChbZGlyPWx0cl0pIHtcbiAgICAgICAgICBcbiAgICAgICAgICB9XG4gICAgICAgICAgPC9zdHlsZT5cbiAgICAgICAgICA8cD5EQlVJV2ViQ29tcG9uZW50Rm9ybUlucHV0VGV4dDwvcD5cbiAgICAgICAgICA8ZGl2IGNvbnRlbnRlZGl0YWJsZT1cInRydWVcIiB0YWJpbmRleD1cIjBcIj48L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNvbnRlbnRlZGl0YWJsZT1cInRydWVcIiB0YWJpbmRleD1cIjBcIj48L2Rpdj5cbiAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiB0YWJpbmRleD1cIjBcIiAvPlxuICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIHRhYmluZGV4PVwiMFwiIC8+XG4gICAgICAgIGA7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgcHJvcGVydGllc1RvRGVmaW5lKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHJvbGU6ICdmb3JtLWlucHV0J1xuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICAvLyBvbkxvY2FsZUNoYW5nZShsb2NhbGUpIHtcbiAgICAgIC8vICAgLy8gY29uc29sZS5sb2coJ29uTG9jYWxlQ2hhbmdlJywgbG9jYWxlKTtcbiAgICAgIC8vIH1cblxuICAgIH1cblxuICAgIHJldHVybiBSZWdpc3RlcmFibGUoXG4gICAgICBGb2N1c2FibGUoXG4gICAgICAgIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMoXG4gICAgICAgICAgREJVSVdlYkNvbXBvbmVudEZvcm1JbnB1dFRleHRcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG5cbiAgfSk7XG59XG5cbmdldERCVUlXZWJDb21wb25lbnRGb3JtSW5wdXRUZXh0LnJlZ2lzdHJhdGlvbk5hbWUgPSByZWdpc3RyYXRpb25OYW1lO1xuXG4iLCJpbXBvcnQgYXBwZW5kU3R5bGUgZnJvbSAnLi4vaW50ZXJuYWxzL2FwcGVuZFN0eWxlJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZGJ1aVdlYkNvbXBvbmVudHNTZXRVcCh3aW4pIHtcbiAgcmV0dXJuIHtcbiAgICBhcHBlbmRTdHlsZTogYXBwZW5kU3R5bGUod2luKVxuICB9O1xufVxuIiwiXG5jb25zdCByZWFkT25seVByb3BlcnRpZXMgPSBbJ2ZvY3VzZWQnXTtcblxuY29uc3QgRVJST1JfTUVTU0FHRVMgPSB7XG4gIGZvY3VzZWQ6IGAnZm9jdXNlZCcgcHJvcGVydHkgaXMgcmVhZC1vbmx5IGFzIGl0IGlzIGNvbnRyb2xsZWQgYnkgdGhlIGNvbXBvbmVudC5cbklmIHlvdSB3YW50IHRvIHNldCBmb2N1cyBwcm9ncmFtbWF0aWNhbGx5IGNhbGwgLmZvY3VzKCkgbWV0aG9kIG9uIGNvbXBvbmVudC5cbmBcbn07XG5cbi8qKlxuICogV2hlbiBhbiBpbm5lciBmb2N1c2FibGUgaXMgZm9jdXNlZCAoZXg6IHZpYSBjbGljaykgdGhlIGVudGlyZSBjb21wb25lbnQgZ2V0cyBmb2N1c2VkLlxuICogV2hlbiB0aGUgY29tcG9uZW50IGdldHMgZm9jdXNlZCAoZXg6IHZpYSB0YWIpIHRoZSBmaXJzdCBpbm5lciBmb2N1c2FibGUgZ2V0cyBmb2N1c2VkIHRvby5cbiAqIFdoZW4gdGhlIGNvbXBvbmVudCBnZXRzIGRpc2FibGVkIGl0IGdldHMgYmx1cnJlZCB0b28gYW5kIGFsbCBpbm5lciBmb2N1c2FibGVzIGdldCBkaXNhYmxlZCBhbmQgYmx1cnJlZC5cbiAqIFdoZW4gZGlzYWJsZWQgdGhlIGNvbXBvbmVudCBjYW5ub3QgYmUgZm9jdXNlZC5cbiAqIFdoZW4gZW5hYmxlZCB0aGUgY29tcG9uZW50IGNhbiBiZSBmb2N1c2VkLlxuICogQHBhcmFtIEtsYXNzXG4gKiBAcmV0dXJucyB7Rm9jdXNhYmxlfVxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEZvY3VzYWJsZShLbGFzcykge1xuXG4gIEtsYXNzLmNvbXBvbmVudFN0eWxlICs9IGBcbiAgOmhvc3QoW2Rpc2FibGVkXSkge1xuICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgb3BhY2l0eTogMC41O1xuICAgIFxuICAgIC13ZWJraXQtdG91Y2gtY2FsbG91dDogbm9uZTtcbiAgICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1xuICAgIC1raHRtbC11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAtbW96LXVzZXItc2VsZWN0OiBub25lO1xuICAgIC1tcy11c2VyLXNlbGVjdDogbm9uZTtcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgfVxuICBcbiAgOmhvc3QoW2Rpc2FibGVkXSkgKiB7XG4gICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gIH1cbiAgYDtcblxuICBjbGFzcyBGb2N1c2FibGUgZXh0ZW5kcyBLbGFzcyB7XG5cbiAgICBzdGF0aWMgZ2V0IG5hbWUoKSB7XG4gICAgICByZXR1cm4gc3VwZXIubmFtZTtcbiAgICB9XG5cbiAgICBnZXQgaW5zdGFuY2VQcm9wZXJ0aWVzVG9EZWZpbmUoKSB7XG4gICAgICBjb25zdCBpbmhlcml0ZWRJbnN0YW5jZVByb3BlcnRpZXNUb0RlZmluZSA9XG4gICAgICAgIHN1cGVyLmluc3RhbmNlUHJvcGVydGllc1RvRGVmaW5lIHx8IHt9O1xuICAgICAgY29uc3QgbmV3SW5zdGFuY2VQcm9wZXJ0aWVzVG9EZWZpbmUgPSB7fTtcbiAgICAgIGlmICghdGhpcy5kaXNhYmxlZCkge1xuICAgICAgICAvLyB0YWJpbmRleCBkZWZpbmVzIGZvY3VzYWJsZSBiZWhhdmlvdXJcbiAgICAgICAgbmV3SW5zdGFuY2VQcm9wZXJ0aWVzVG9EZWZpbmUudGFiaW5kZXggPSAwO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uaW5oZXJpdGVkSW5zdGFuY2VQcm9wZXJ0aWVzVG9EZWZpbmUsXG4gICAgICAgIC4uLm5ld0luc3RhbmNlUHJvcGVydGllc1RvRGVmaW5lXG4gICAgICB9O1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXQgcHJvcGVydGllc1RvVXBncmFkZSgpIHtcbiAgICAgIGNvbnN0IGluaGVyaXRlZFByb3BlcnRpZXNUb1VwZ3JhZGUgPSBzdXBlci5wcm9wZXJ0aWVzVG9VcGdyYWRlIHx8IFtdO1xuICAgICAgLy8gVGhlIHJlYXNvbiBmb3IgdXBncmFkaW5nICdmb2N1c2VkJyBpcyBvbmx5IHRvIHNob3cgYW4gd2FybmluZ1xuICAgICAgLy8gaWYgdGhlIGNvbnN1bWVyIG9mIHRoZSBjb21wb25lbnQgYXR0ZW1wdGVkIHRvIHNldCBmb2N1cyBwcm9wZXJ0eVxuICAgICAgLy8gd2hpY2ggaXMgcmVhZC1vbmx5LlxuICAgICAgcmV0dXJuIFsuLi5pbmhlcml0ZWRQcm9wZXJ0aWVzVG9VcGdyYWRlLCAnZm9jdXNlZCcsICdkaXNhYmxlZCddO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCkge1xuICAgICAgY29uc3QgaW5oZXJpdGVkT2JzZXJ2ZWRBdHRyaWJ1dGVzID0gc3VwZXIub2JzZXJ2ZWRBdHRyaWJ1dGVzIHx8IFtdO1xuICAgICAgcmV0dXJuIFsuLi5pbmhlcml0ZWRPYnNlcnZlZEF0dHJpYnV0ZXMsICdkaXNhYmxlZCddO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICAgIHN1cGVyKC4uLmFyZ3MpO1xuXG4gICAgICB0aGlzLl9jdXJyZW50SW5uZXJGb2N1c2VkID0gbnVsbDtcbiAgICAgIHRoaXMuX29uSW5uZXJGb2N1c2FibGVGb2N1c2VkID0gdGhpcy5fb25Jbm5lckZvY3VzYWJsZUZvY3VzZWQuYmluZCh0aGlzKTtcbiAgICAgIHRoaXMuX29uRm9jdXMgPSB0aGlzLl9vbkZvY3VzLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLl9vbkJsdXIgPSB0aGlzLl9vbkJsdXIuYmluZCh0aGlzKTtcbiAgICB9XG5cbiAgICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlKSB7XG4gICAgICBzdXBlci5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sgJiZcbiAgICAgICAgc3VwZXIuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSk7XG5cbiAgICAgIGNvbnN0IGhhc1ZhbHVlID0gbmV3VmFsdWUgIT09IG51bGw7XG4gICAgICBpZiAobmFtZSA9PT0gJ2Rpc2FibGVkJykge1xuICAgICAgICBoYXNWYWx1ZSA/IHRoaXMuX2FwcGx5RGlzYWJsZWRTaWRlRWZmZWN0cygpIDogdGhpcy5fYXBwbHlFbmFibGVkU2lkZUVmZmVjdHMoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgIHN1cGVyLmNvbm5lY3RlZENhbGxiYWNrICYmXG4gICAgICAgIHN1cGVyLmNvbm5lY3RlZENhbGxiYWNrKCk7XG5cbiAgICAgIHJlYWRPbmx5UHJvcGVydGllcy5mb3JFYWNoKChyZWFkT25seVByb3BlcnR5KSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmhhc0F0dHJpYnV0ZShyZWFkT25seVByb3BlcnR5KSkge1xuICAgICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKHJlYWRPbmx5UHJvcGVydHkpO1xuICAgICAgICAgIGNvbnNvbGUud2FybihFUlJPUl9NRVNTQUdFU1tyZWFkT25seVByb3BlcnR5XSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvLyB3aGVuIGNvbXBvbmVudCBmb2N1c2VkL2JsdXJyZWRcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCB0aGlzLl9vbkZvY3VzKTtcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMuX29uQmx1cik7XG5cbiAgICAgIHRoaXMuX2lubmVyRm9jdXNhYmxlcy5mb3JFYWNoKChmb2N1c2FibGUpID0+IHtcbiAgICAgICAgLy8gd2hlbiBpbm5lciBmb2N1c2FibGUgZm9jdXNlZFxuICAgICAgICBmb2N1c2FibGUuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCB0aGlzLl9vbklubmVyRm9jdXNhYmxlRm9jdXNlZCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgIHN1cGVyLmRpc2Nvbm5lY3RlZENhbGxiYWNrICYmXG4gICAgICAgIHN1cGVyLmRpc2Nvbm5lY3RlZENhbGxiYWNrKCk7XG5cbiAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignZm9jdXMnLCB0aGlzLl9vbkZvY3VzKTtcbiAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMuX29uQmx1cik7XG5cbiAgICAgIHRoaXMuX2lubmVyRm9jdXNhYmxlcy5mb3JFYWNoKChmb2N1c2FibGUpID0+IHtcbiAgICAgICAgZm9jdXNhYmxlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdGhpcy5fb25Jbm5lckZvY3VzYWJsZUZvY3VzZWQpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gcmVhZC1vbmx5XG4gICAgZ2V0IGZvY3VzZWQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5oYXNBdHRyaWJ1dGUoJ2ZvY3VzZWQnKTtcbiAgICB9XG5cbiAgICBzZXQgZm9jdXNlZChfKSB7XG4gICAgICBjb25zb2xlLndhcm4oRVJST1JfTUVTU0FHRVMuZm9jdXNlZCk7XG4gICAgfVxuXG4gICAgZ2V0IGRpc2FibGVkKCkge1xuICAgICAgcmV0dXJuIHRoaXMuaGFzQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgIH1cblxuICAgIHNldCBkaXNhYmxlZCh2YWx1ZSkge1xuICAgICAgY29uc3QgaGFzVmFsdWUgPSBCb29sZWFuKHZhbHVlKTtcbiAgICAgIGlmIChoYXNWYWx1ZSkge1xuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCAnJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgX2lubmVyRm9jdXNhYmxlcygpIHtcbiAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuVHJlZS5xdWVyeVNlbGVjdG9yQWxsKCdbdGFiaW5kZXhdJykgfHwgW107XG4gICAgfVxuXG4gICAgZ2V0IF9maXJzdElubmVyRm9jdXNhYmxlKCkge1xuICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW5UcmVlLnF1ZXJ5U2VsZWN0b3IoJ1t0YWJpbmRleF0nKTtcbiAgICB9XG5cbiAgICBfb25Jbm5lckZvY3VzYWJsZUZvY3VzZWQoZXZ0KSB7XG4gICAgICB0aGlzLl9jdXJyZW50SW5uZXJGb2N1c2VkID0gZXZ0LnRhcmdldDtcbiAgICB9XG5cbiAgICBfb25Gb2N1cygpIHtcbiAgICAgIGlmICh0aGlzLmRpc2FibGVkKSByZXR1cm47XG4gICAgICAvLyBPbmx5IGZvciBzdHlsaW5nIHB1cnBvc2UuXG4gICAgICAvLyBGb2N1c2VkIHByb3BlcnR5IGlzIGNvbnRyb2xsZWQgZnJvbSBpbnNpZGUuXG4gICAgICAvLyBBdHRlbXB0IHRvIHNldCB0aGlzIHByb3BlcnR5IGZyb20gb3V0c2lkZSB3aWxsIHRyaWdnZXIgYSB3YXJuaW5nXG4gICAgICAvLyBhbmQgd2lsbCBiZSBpZ25vcmVkXG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnZm9jdXNlZCcsICcnKTtcbiAgICAgIHRoaXMuX2FwcGx5Rm9jdXNTaWRlRWZmZWN0cygpO1xuICAgIH1cblxuICAgIF9vbkJsdXIoKSB7XG4gICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgnZm9jdXNlZCcpO1xuICAgICAgdGhpcy5fYXBwbHlCbHVyU2lkZUVmZmVjdHMoKTtcbiAgICB9XG5cbiAgICBfYXBwbHlGb2N1c1NpZGVFZmZlY3RzKCkge1xuICAgICAgaWYgKHRoaXMuX2N1cnJlbnRJbm5lckZvY3VzZWQpIHtcbiAgICAgICAgLy8gU29tZSBpbm5lciBjb21wb25lbnQgaXMgYWxyZWFkeSBmb2N1c2VkLlxuICAgICAgICAvLyBObyBuZWVkIHRvIHNldCBmb2N1cyBvbiBhbnl0aGluZy5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5fZm9jdXNGaXJzdElubmVyRm9jdXNhYmxlKCk7XG4gICAgfVxuXG4gICAgX2FwcGx5Qmx1clNpZGVFZmZlY3RzKCkge1xuICAgICAgaWYgKHRoaXMuX2N1cnJlbnRJbm5lckZvY3VzZWQpIHtcbiAgICAgICAgdGhpcy5fY3VycmVudElubmVyRm9jdXNlZC5ibHVyKCk7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRJbm5lckZvY3VzZWQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9mb2N1c0ZpcnN0SW5uZXJGb2N1c2FibGUoKSB7XG4gICAgICBjb25zdCBmaXJzdElubmVyRm9jdXNhYmxlID0gdGhpcy5fZmlyc3RJbm5lckZvY3VzYWJsZTtcbiAgICAgIGlmIChmaXJzdElubmVyRm9jdXNhYmxlKSB7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRJbm5lckZvY3VzZWQgPSBmaXJzdElubmVyRm9jdXNhYmxlO1xuICAgICAgICBmaXJzdElubmVyRm9jdXNhYmxlLmZvY3VzKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2FwcGx5RGlzYWJsZWRTaWRlRWZmZWN0cygpIHtcbiAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCd0YWJpbmRleCcpO1xuICAgICAgdGhpcy5faW5uZXJGb2N1c2FibGVzLmZvckVhY2goKGlubmVyRm9jdXNhYmxlKSA9PiB7XG4gICAgICAgIGlubmVyRm9jdXNhYmxlLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcbiAgICAgICAgaWYgKGlubmVyRm9jdXNhYmxlLmhhc0F0dHJpYnV0ZSgnY29udGVudGVkaXRhYmxlJykpIHtcbiAgICAgICAgICBpbm5lckZvY3VzYWJsZS5zZXRBdHRyaWJ1dGUoJ2NvbnRlbnRlZGl0YWJsZScsICdmYWxzZScpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlubmVyRm9jdXNhYmxlLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLmJsdXIoKTtcbiAgICB9XG5cbiAgICBfYXBwbHlFbmFibGVkU2lkZUVmZmVjdHMoKSB7XG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnMCcpO1xuICAgICAgdGhpcy5faW5uZXJGb2N1c2FibGVzLmZvckVhY2goKGlubmVyRm9jdXNhYmxlKSA9PiB7XG4gICAgICAgIGlubmVyRm9jdXNhYmxlLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnMCcpO1xuICAgICAgICBpZiAoaW5uZXJGb2N1c2FibGUuaGFzQXR0cmlidXRlKCdjb250ZW50ZWRpdGFibGUnKSkge1xuICAgICAgICAgIGlubmVyRm9jdXNhYmxlLnNldEF0dHJpYnV0ZSgnY29udGVudGVkaXRhYmxlJywgJ3RydWUnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpbm5lckZvY3VzYWJsZS5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gRm9jdXNhYmxlO1xufVxuIiwiLypcbkRCVUlXZWJDb21wb25lbnRCYXNlIChmcm9tIHdoaWNoIGFsbCB3ZWItY29tcG9uZW50cyBpbmhlcml0KVxud2lsbCByZWFkIGNvbXBvbmVudFN0eWxlIGZyb20gd2luLkRCVUlXZWJDb21wb25lbnRzXG53aGVuIGtsYXNzLnJlZ2lzdGVyU2VsZigpIGlzIGNhbGxlZCBnaXZpbmcgYSBjaGFuY2UgdG8gb3ZlcnJpZGUgZGVmYXVsdCB3ZWItY29tcG9uZW50IHN0eWxlXG5qdXN0IGJlZm9yZSBpdCBpcyByZWdpc3RlcmVkLlxuKi9cbmNvbnN0IGFwcGVuZFN0eWxlID0gKHdpbikgPT4gKHJlZ2lzdHJhdGlvbk5hbWUsIGNvbXBvbmVudFN0eWxlKSA9PiB7XG4gIGlmICghd2luLkRCVUlXZWJDb21wb25lbnRzKSB7XG4gICAgd2luLkRCVUlXZWJDb21wb25lbnRzID0ge307XG4gIH1cbiAgd2luLkRCVUlXZWJDb21wb25lbnRzID0ge1xuICAgIC4uLndpbi5EQlVJV2ViQ29tcG9uZW50cyxcbiAgICBbcmVnaXN0cmF0aW9uTmFtZV06IHtcbiAgICAgIC4uLndpbi5EQlVJV2ViQ29tcG9uZW50c1tyZWdpc3RyYXRpb25OYW1lXSxcbiAgICAgIGNvbXBvbmVudFN0eWxlXG4gICAgfVxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgYXBwZW5kU3R5bGU7XG4iLCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uKHdpbiwgbmFtZSwgY2FsbGJhY2spIHtcbiAgaWYgKCF3aW4uREJVSVdlYkNvbXBvbmVudHMpIHtcbiAgICB3aW4uREJVSVdlYkNvbXBvbmVudHMgPSB7IHJlZ2lzdHJhdGlvbnM6IHt9IH07XG4gIH0gZWxzZSBpZiAoIXdpbi5EQlVJV2ViQ29tcG9uZW50cy5yZWdpc3RyYXRpb25zKSB7XG4gICAgd2luLkRCVUlXZWJDb21wb25lbnRzLnJlZ2lzdHJhdGlvbnMgPSB7fTtcbiAgfVxuXG4gIGxldCByZWdpc3RyYXRpb24gPSB3aW4uREJVSVdlYkNvbXBvbmVudHMucmVnaXN0cmF0aW9uc1tuYW1lXTtcblxuICBpZiAocmVnaXN0cmF0aW9uKSByZXR1cm4gcmVnaXN0cmF0aW9uO1xuXG4gIHJlZ2lzdHJhdGlvbiA9IGNhbGxiYWNrKCk7XG4gIHdpbi5EQlVJV2ViQ29tcG9uZW50cy5yZWdpc3RyYXRpb25zW25hbWVdID0gcmVnaXN0cmF0aW9uO1xuXG4gIHJldHVybiB3aW4uREJVSVdlYkNvbXBvbmVudHMucmVnaXN0cmF0aW9uc1tuYW1lXTtcbn1cblxuIiwiXG4vLyBoZWxwZXJzXG5pbXBvcnQgZGJ1aVdlYkNvbXBvbmVudHNTZXRVcCBmcm9tICcuL0RCVUlXZWJDb21wb25lbnRzU2V0dXAvREJVSVdlYkNvbXBvbmVudHNTZXR1cCc7XG5cbi8vIGludGVybmFsc1xuaW1wb3J0IGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbiBmcm9tICcuL2ludGVybmFscy9lbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24nO1xuaW1wb3J0IGdldERCVUlXZWJDb21wb25lbnRCYXNlIGZyb20gJy4vREJVSVdlYkNvbXBvbmVudEJhc2UvREJVSVdlYkNvbXBvbmVudEJhc2UnO1xuXG4vLyBiZWhhdmlvdXJzXG5pbXBvcnQgRm9jdXNhYmxlIGZyb20gJy4vYmVoYXZpb3Vycy9Gb2N1c2FibGUnO1xuXG4vLyBjb21wb25lbnRzXG5pbXBvcnQgZ2V0REJVSVdlYkNvbXBvbmVudER1bW15IGZyb20gJy4vREJVSVdlYkNvbXBvbmVudER1bW15L0RCVUlXZWJDb21wb25lbnREdW1teSc7XG5pbXBvcnQgZ2V0REJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50IGZyb20gJy4vREJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50L0RCVUlXZWJDb21wb25lbnREdW1teVBhcmVudCc7XG5pbXBvcnQgZ2V0REJVSVdlYkNvbXBvbmVudEZvcm1JbnB1dFRleHQgZnJvbSAnLi9EQlVJV2ViQ29tcG9uZW50Rm9ybUlucHV0VGV4dC9EQlVJV2ViQ29tcG9uZW50Rm9ybUlucHV0VGV4dCc7XG5cbmNvbnN0IHJlZ2lzdHJhdGlvbnMgPSB7XG4gIFtnZXREQlVJV2ViQ29tcG9uZW50RHVtbXkucmVnaXN0cmF0aW9uTmFtZV06XG4gICAgZ2V0REJVSVdlYkNvbXBvbmVudER1bW15LFxuICBbZ2V0REJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50LnJlZ2lzdHJhdGlvbk5hbWVdOlxuICAgIGdldERCVUlXZWJDb21wb25lbnREdW1teVBhcmVudCxcbiAgW2dldERCVUlXZWJDb21wb25lbnRGb3JtSW5wdXRUZXh0LnJlZ2lzdHJhdGlvbk5hbWVdOlxuICAgIGdldERCVUlXZWJDb21wb25lbnRGb3JtSW5wdXRUZXh0LFxufTtcblxuLypcblVzaW5nIHRoaXMgZnVuY3Rpb24gaW1wbGllcyBlbnRpcmUgREJVSVdlYkNvbXBvbmVudHMgbGlicmFyeVxuaXMgYWxyZWFkeSBsb2FkZWQuXG5JdCBpcyB1c2VmdWwgZXNwZWNpYWxseSB3aGVuIHdvcmtpbmcgd2l0aCBkaXN0cmlidXRpb24gYnVpbGQuXG5JZiB5b3Ugd2FudCB0byBsb2FkIGp1c3Qgb25lIHdlYi1jb21wb25lbnQgb3IgYSBzdWJzZXQgb2Ygd2ViLWNvbXBvbmVudHNcbmxvYWQgdGhlbSBmcm9tIG5vZGVfbW9kdWxlcyBieSB0aGVpciBwYXRoXG5leDpcbmltcG9ydCBTb21lQ29tcG9uZW50TG9hZGVyIGZyb20gbm9kZV9tb2R1bGVzL2Rldi1ib3gtdWkvYnVpbGQvc3JjL2xpYi93ZWJjb21wb25lbnRzL1NvbWVDb21wb25lbnQ7XG4qL1xuZnVuY3Rpb24gcXVpY2tTZXR1cEFuZExvYWQod2luID0gd2luZG93KSB7XG4gIHJldHVybiBmdW5jdGlvbiAoY29tcG9uZW50cykge1xuICAgIGNvbnN0IHJldCA9IHt9O1xuICAgIGNvbXBvbmVudHMuZm9yRWFjaCgoeyByZWdpc3RyYXRpb25OYW1lLCBjb21wb25lbnRTdHlsZSB9KSA9PiB7XG4gICAgICBkYnVpV2ViQ29tcG9uZW50c1NldFVwKHdpbikuYXBwZW5kU3R5bGUocmVnaXN0cmF0aW9uTmFtZSwgY29tcG9uZW50U3R5bGUpO1xuICAgICAgY29uc3QgY29tcG9uZW50Q2xhc3MgPSByZWdpc3RyYXRpb25zW3JlZ2lzdHJhdGlvbk5hbWVdKHdpbmRvdyk7XG4gICAgICBjb21wb25lbnRDbGFzcy5yZWdpc3RlclNlbGYoKTtcbiAgICAgIHJldFtyZWdpc3RyYXRpb25OYW1lXSA9IGNvbXBvbmVudENsYXNzO1xuICAgIH0pO1xuICAgIHJldHVybiByZXQ7XG4gIH07XG59XG5cbmV4cG9ydCB7XG4gIHJlZ2lzdHJhdGlvbnMsXG5cbiAgLy8gaGVscGVyc1xuICBxdWlja1NldHVwQW5kTG9hZCxcbiAgZGJ1aVdlYkNvbXBvbmVudHNTZXRVcCxcblxuICAvLyBpbnRlcm5hbHNcbiAgZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uLFxuICBnZXREQlVJV2ViQ29tcG9uZW50QmFzZSxcblxuICAvLyBiZWhhdmlvdXJzXG4gIEZvY3VzYWJsZSxcblxuICAvLyBjb21wb25lbnRzXG4gIGdldERCVUlXZWJDb21wb25lbnREdW1teSxcbiAgZ2V0REJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50LFxuICBnZXREQlVJV2ViQ29tcG9uZW50Rm9ybUlucHV0VGV4dFxufTtcbiJdfQ==
