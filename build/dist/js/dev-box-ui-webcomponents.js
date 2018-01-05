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

      static get propertiesToUpgrade() {
        return [];
      }

      static get propertiesToDefine() {
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
        propertiesToUpgrade.forEach(property => {
          this._upgradeProperty(property);
        });
        Object.keys(propertiesToDefine).forEach(property => {
          this._defineProperty(property, propertiesToDefine[property]);
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
    const { document } = win;

    const template = document.createElement('template');
    template.innerHTML = `
      <style>
      :host {
        all: initial; 
        display: inline-block;
        width: 100%;
        /*height: var(--dbui-web-component-form-input-height);*/
        /*line-height: var(--dbui-web-component-form-input-height);*/
        height: 200px;
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
      <div contenteditable="true" tabindex="0"></div>
      <div contenteditable="true" tabindex="0"></div>
      <input type="text" tabindex="0" />
      <input type="text" tabindex="0" />
    `;

    class DBUIWebComponentFormInputText extends DBUIWebComponentBase {
      static get registrationName() {
        return registrationName;
      }

      static get template() {
        return template;
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
    /* cursor: not-allowed; */
    /*pointer-events: none;*/
    opacity: 0.5;
  }
  /*
  :host([disabled]):before {
    content: '';
    position: absolute;
    width: 100%; height: 100%;
    top: 0; left: 0;
  }
  */
  `;

  class Focusable extends Klass {

    // TODO: element looks like focused if user sets focused html property at creation
    // even after clicking outside element

    static get propertiesToDefine() {
      const inheritedPropertiesToDefine = super.propertiesToDefine || {};
      return Object.assign({}, inheritedPropertiesToDefine, {
        // tabindex defines focusable behaviour
        tabindex: 0
      });
    }

    static get propertiesToUpgrade() {
      const inheritedPropertiesToUpgrade = super.propertiesToUpgrade || [];
      return [...inheritedPropertiesToUpgrade, 'focused', 'disabled'];
    }

    static get observedAttributes() {
      const inheritedObservedAttributes = super.observedAttributes || [];
      return [...inheritedObservedAttributes, 'focused', 'disabled'];
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
      if (name === 'focused') {
        // The browser might decide to not apply focus without user interaction.
        // ex: on IPad
        hasValue ? this._applyFocusSideEffects() : this._applyBlurSideEffects();
      }
    }

    connectedCallback() {
      super.connectedCallback && super.connectedCallback();

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

    // keep getters and setters generic
    // (so we can put them in base class), do not add custom logic
    get focused() {
      return this.hasAttribute('focused');
    }

    set focused(value) {
      const hasValue = Boolean(value);
      if (hasValue) {
        this.setAttribute('focused', '');
      } else {
        this.removeAttribute('focused');
      }
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
      console.log('_onFocus', this.id);
      if (!this.focused) {
        this.focused = true;
      }
    }

    _onBlur() {
      if (this.focused) {
        this.focused = false;
      }
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
  }

  Focusable.originalName = Klass.name;
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
exports.getDBUIWebComponentFormInputText = exports.getDBUIWebComponentDummyParent = exports.getDBUIWebComponentDummy = exports.dbuiWebComponentsSetUp = exports.quickSetupAndLoad = exports.registrations = undefined;

var _DBUIWebComponentsSetup = require('./DBUIWebComponentsSetup/DBUIWebComponentsSetup');

var _DBUIWebComponentsSetup2 = _interopRequireDefault(_DBUIWebComponentsSetup);

var _DBUIWebComponentDummy = require('./DBUIWebComponentDummy/DBUIWebComponentDummy');

var _DBUIWebComponentDummy2 = _interopRequireDefault(_DBUIWebComponentDummy);

var _DBUIWebComponentDummyParent = require('./DBUIWebComponentDummyParent/DBUIWebComponentDummyParent');

var _DBUIWebComponentDummyParent2 = _interopRequireDefault(_DBUIWebComponentDummyParent);

var _DBUIWebComponentFormInputText = require('./DBUIWebComponentFormInputText/DBUIWebComponentFormInputText');

var _DBUIWebComponentFormInputText2 = _interopRequireDefault(_DBUIWebComponentFormInputText);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
exports.getDBUIWebComponentDummy = _DBUIWebComponentDummy2.default;
exports.getDBUIWebComponentDummyParent = _DBUIWebComponentDummyParent2.default;
exports.getDBUIWebComponentFormInputText = _DBUIWebComponentFormInputText2.default;

},{"./DBUIWebComponentDummy/DBUIWebComponentDummy":3,"./DBUIWebComponentDummyParent/DBUIWebComponentDummyParent":4,"./DBUIWebComponentFormInputText/DBUIWebComponentFormInputText":5,"./DBUIWebComponentsSetup/DBUIWebComponentsSetup":6}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL3NlcnZpY2VzL0xvY2FsZVNlcnZpY2UuanMiLCJzcmMvbGliL3dlYmNvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudEJhc2UvREJVSVdlYkNvbXBvbmVudEJhc2UuanMiLCJzcmMvbGliL3dlYmNvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudER1bW15L0RCVUlXZWJDb21wb25lbnREdW1teS5qcyIsInNyYy9saWIvd2ViY29tcG9uZW50cy9EQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQvREJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50LmpzIiwic3JjL2xpYi93ZWJjb21wb25lbnRzL0RCVUlXZWJDb21wb25lbnRGb3JtSW5wdXRUZXh0L0RCVUlXZWJDb21wb25lbnRGb3JtSW5wdXRUZXh0LmpzIiwic3JjL2xpYi93ZWJjb21wb25lbnRzL0RCVUlXZWJDb21wb25lbnRzU2V0dXAvREJVSVdlYkNvbXBvbmVudHNTZXR1cC5qcyIsInNyYy9saWIvd2ViY29tcG9uZW50cy9iZWhhdmlvdXJzL0ZvY3VzYWJsZS5qcyIsInNyYy9saWIvd2ViY29tcG9uZW50cy9pbnRlcm5hbHMvYXBwZW5kU3R5bGUuanMiLCJzcmMvbGliL3dlYmNvbXBvbmVudHMvaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbi5qcyIsInNyYy9saWIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7QUNDQSxNQUFNLGdCQUFnQjtBQUNwQixPQUFLLEtBRGU7QUFFcEIsUUFBTTtBQUZjLENBQXRCOztBQUtBLE1BQU0sYUFBTixDQUFvQjtBQUNsQixnQkFBYztBQUNaLFNBQUssVUFBTCxHQUFrQixFQUFsQjtBQUNBLFNBQUssWUFBTCxHQUFvQixPQUFPLElBQVAsQ0FBWSxhQUFaLENBQXBCO0FBQ0EsU0FBSyxZQUFMLEdBQW9CLE9BQU8sUUFBUCxDQUFnQixlQUFw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QUFPLEdBQVA7QUFDRCxHQVREO0FBVUQ7O1FBR0MsYSxHQUFBLGE7UUFDQSxpQixHQUFBLGlCO1FBQ0Esc0I7UUFDQSx3QjtRQUNBLDhCO1FBQ0EsZ0MiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG5jb25zdCBkZWZhdWx0TG9jYWxlID0ge1xuICBkaXI6ICdsdHInLFxuICBsYW5nOiAnZW4nXG59O1xuXG5jbGFzcyBMb2NhbGVTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fY2FsbGJhY2tzID0gW107XG4gICAgdGhpcy5fbG9jYWxlQXR0cnMgPSBPYmplY3Qua2V5cyhkZWZhdWx0TG9jYWxlKTtcbiAgICB0aGlzLl9yb290RWxlbWVudCA9IHdpbmRvdy5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgdGhpcy5fbG9jYWxlQXR0cnMuZm9yRWFjaCgoYXR0cikgPT4ge1xuICAgICAgaWYgKCF0aGlzLl9yb290RWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cikpIHtcbiAgICAgICAgdGhpcy5fcm9vdEVsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHIsIGRlZmF1bHRMb2NhbGVbYXR0cl0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuX2xvY2FsZSA9IHRoaXMuX2xvY2FsZUF0dHJzLnJlZHVjZSgoYWNjLCBhdHRyKSA9PiB7XG4gICAgICBhY2NbYXR0cl0gPSB0aGlzLl9yb290RWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cik7XG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHt9KTtcbiAgICB0aGlzLl9vYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMuX2hhbmRsZU11dGF0aW9ucy5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLl9vYnNlcnZlci5vYnNlcnZlKHRoaXMuX3Jvb3RFbGVtZW50LCB7XG4gICAgICBhdHRyaWJ1dGVzOiB0cnVlXG4gICAgfSk7XG4gIH1cblxuICBfaGFuZGxlTXV0YXRpb25zKG11dGF0aW9ucykge1xuICAgIG11dGF0aW9ucy5mb3JFYWNoKChtdXRhdGlvbikgPT4ge1xuICAgICAgY29uc3QgbXV0YXRpb25BdHRyaWJ1dGVOYW1lID0gbXV0YXRpb24uYXR0cmlidXRlTmFtZTtcbiAgICAgIGlmICh0aGlzLl9sb2NhbGVBdHRycy5pbmNsdWRlcyhtdXRhdGlvbkF0dHJpYnV0ZU5hbWUpKSB7XG4gICAgICAgIHRoaXMuX2xvY2FsZSA9IHtcbiAgICAgICAgICAuLi50aGlzLl9sb2NhbGUsXG4gICAgICAgICAgW211dGF0aW9uQXR0cmlidXRlTmFtZV06IHRoaXMuX3Jvb3RFbGVtZW50LmdldEF0dHJpYnV0ZShtdXRhdGlvbkF0dHJpYnV0ZU5hbWUpXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX2NhbGxiYWNrcy5mb3JFYWNoKGNhbGxiYWNrID0+IGNhbGxiYWNrKHRoaXMuX2xvY2FsZSkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc2V0IGxvY2FsZShsb2NhbGVPYmopIHtcbiAgICBPYmplY3Qua2V5cyhsb2NhbGVPYmopLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgdGhpcy5fcm9vdEVsZW1lbnQuc2V0QXR0cmlidXRlKGtleSwgbG9jYWxlT2JqW2tleV0pO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0IGxvY2FsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fbG9jYWxlO1xuICB9XG5cbiAgb25Mb2NhbGVDaGFuZ2UoY2FsbGJhY2spIHtcbiAgICB0aGlzLl9jYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG4gICAgY2FsbGJhY2sodGhpcy5sb2NhbGUpO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MuZmlsdGVyKGNiID0+IGNiICE9PSBjYWxsYmFjayk7XG4gICAgfTtcbiAgfVxufVxuXG5jb25zdCBsb2NhbGVTZXJ2aWNlID0gbmV3IExvY2FsZVNlcnZpY2UoKTtcbmV4cG9ydCBkZWZhdWx0IGxvY2FsZVNlcnZpY2U7XG4iLCJcbmltcG9ydCBMb2NhbGVTZXJ2aWNlIGZyb20gJy4uLy4uL3NlcnZpY2VzL0xvY2FsZVNlcnZpY2UnO1xuaW1wb3J0IGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbiBmcm9tICcuLi9pbnRlcm5hbHMvZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uJztcblxuY29uc3QgcmVnaXN0cmF0aW9uTmFtZSA9ICdEQlVJV2ViQ29tcG9uZW50QmFzZSc7XG5cbmZ1bmN0aW9uIGRlZmluZUNvbW1vbkNTU1ZhcnMoKSB7XG4gIGNvbnN0IGNvbW1vblN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgY29tbW9uU3R5bGUuaW5uZXJIVE1MID0gYFxuICA6cm9vdCB7XG4gICAgLS1kYnVpLXdlYi1jb21wb25lbnQtZ2xvYmFsLWJvcmRlci1yYWRpdXM6IDVweDtcbiAgICAtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWhlaWdodDogMzBweDtcbiAgICAtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWNvbG9yOiAjMDAwO1xuICAgIC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gICAgLS1kYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC1ib3JkZXItY29sb3I6ICNjY2M7XG4gICAgLS1kYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC1ib3JkZXItc3R5bGU6IHNvbGlkO1xuICAgIC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtYm9yZGVyLXdpZHRoOiAxcHg7XG4gIH1cbiAgYDtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaGVhZCcpLmFwcGVuZENoaWxkKGNvbW1vblN0eWxlKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0REJVSVdlYkNvbXBvbmVudEJhc2Uod2luKSB7XG4gIHJldHVybiBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24od2luLCByZWdpc3RyYXRpb25OYW1lLCAoKSA9PiB7XG4gICAgZGVmaW5lQ29tbW9uQ1NTVmFycygpO1xuICAgIGNvbnN0IHsgZG9jdW1lbnQsIEhUTUxFbGVtZW50LCBjdXN0b21FbGVtZW50cyB9ID0gd2luO1xuXG4gICAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9ICc8c3R5bGU+PC9zdHlsZT48c2xvdD48L3Nsb3Q+JztcblxuICAgIGNsYXNzIERCVUlXZWJDb21wb25lbnRCYXNlIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuXG4gICAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlKCkge1xuICAgICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgZGVwZW5kZW5jaWVzKCkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgdXNlU2hhZG93KCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCBwcm9wZXJ0aWVzVG9VcGdyYWRlKCkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgcHJvcGVydGllc1RvRGVmaW5lKCkge1xuICAgICAgICByZXR1cm4ge307XG4gICAgICB9XG5cbiAgICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICBjb25zdCB7IHVzZVNoYWRvdyB9ID0gdGhpcy5jb25zdHJ1Y3RvcjtcbiAgICAgICAgaWYgKHVzZVNoYWRvdykge1xuICAgICAgICAgIHRoaXMuYXR0YWNoU2hhZG93KHtcbiAgICAgICAgICAgIG1vZGU6ICdvcGVuJyxcbiAgICAgICAgICAgIC8vIGRlbGVnYXRlc0ZvY3VzOiB0cnVlXG4gICAgICAgICAgICAvLyBOb3Qgd29ya2luZyBvbiBJUGFkIHNvIHdlIGRvIGFuIHdvcmthcm91bmRcbiAgICAgICAgICAgIC8vIGJ5IHNldHRpbmcgXCJmb2N1c2VkXCIgYXR0cmlidXRlIHdoZW4gbmVlZGVkLlxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2lzQ29ubmVjdGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2luc2VydFRlbXBsYXRlKCk7XG5cbiAgICAgICAgdGhpcy5jb25uZWN0ZWRDYWxsYmFjayA9IHRoaXMuY29ubmVjdGVkQ2FsbGJhY2suYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5kaXNjb25uZWN0ZWRDYWxsYmFjayA9IHRoaXMuZGlzY29ubmVjdGVkQ2FsbGJhY2suYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5faGFuZGxlTG9jYWxlQ2hhbmdlID0gdGhpcy5faGFuZGxlTG9jYWxlQ2hhbmdlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMub25Mb2NhbGVDaGFuZ2UgJiYgKHRoaXMub25Mb2NhbGVDaGFuZ2UgPSB0aGlzLm9uTG9jYWxlQ2hhbmdlLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLnVucmVnaXN0ZXJMb2NhbGVDaGFuZ2UgPSBudWxsO1xuXG4gICAgICAgIC8vIHByb3ZpZGUgc3VwcG9ydCBmb3IgdHJhaXRzIGlmIGFueSBhcyB0aGV5IGNhbnQgb3ZlcnJpZGUgY29uc3RydWN0b3JcbiAgICAgICAgdGhpcy5pbml0ICYmIHRoaXMuaW5pdCguLi5hcmdzKTtcbiAgICAgIH1cblxuICAgICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vd2ViL2Z1bmRhbWVudGFscy93ZWItY29tcG9uZW50cy9iZXN0LXByYWN0aWNlcyNsYXp5LXByb3BlcnRpZXNcbiAgICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL3dlYi9mdW5kYW1lbnRhbHMvd2ViLWNvbXBvbmVudHMvZXhhbXBsZXMvaG93dG8tY2hlY2tib3hcbiAgICAgIC8qIGVzbGludCBuby1wcm90b3R5cGUtYnVpbHRpbnM6IDAgKi9cbiAgICAgIF91cGdyYWRlUHJvcGVydHkocHJvcCkge1xuICAgICAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICAgIGNvbnN0IHZhbHVlID0gdGhpc1twcm9wXTtcbiAgICAgICAgICBkZWxldGUgdGhpc1twcm9wXTtcbiAgICAgICAgICB0aGlzW3Byb3BdID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgX2RlZmluZVByb3BlcnR5KGtleSwgdmFsdWUpIHtcbiAgICAgICAgaWYgKCF0aGlzLmhhc0F0dHJpYnV0ZShrZXkpKSB7XG4gICAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoa2V5LCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHRoaXMuX2lzQ29ubmVjdGVkID0gdHJ1ZTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2JlZm9yZXVubG9hZCcsIHRoaXMuZGlzY29ubmVjdGVkQ2FsbGJhY2ssIGZhbHNlKTtcbiAgICAgICAgdGhpcy51bnJlZ2lzdGVyTG9jYWxlQ2hhbmdlID1cbiAgICAgICAgICBMb2NhbGVTZXJ2aWNlLm9uTG9jYWxlQ2hhbmdlKHRoaXMuX2hhbmRsZUxvY2FsZUNoYW5nZSk7XG4gICAgICAgIGNvbnN0IHsgcHJvcGVydGllc1RvVXBncmFkZSwgcHJvcGVydGllc1RvRGVmaW5lIH0gPSB0aGlzLmNvbnN0cnVjdG9yO1xuICAgICAgICBwcm9wZXJ0aWVzVG9VcGdyYWRlLmZvckVhY2goKHByb3BlcnR5KSA9PiB7XG4gICAgICAgICAgdGhpcy5fdXBncmFkZVByb3BlcnR5KHByb3BlcnR5KTtcbiAgICAgICAgfSk7XG4gICAgICAgIE9iamVjdC5rZXlzKHByb3BlcnRpZXNUb0RlZmluZSkuZm9yRWFjaCgocHJvcGVydHkpID0+IHtcbiAgICAgICAgICB0aGlzLl9kZWZpbmVQcm9wZXJ0eShwcm9wZXJ0eSwgcHJvcGVydGllc1RvRGVmaW5lW3Byb3BlcnR5XSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgICAgdGhpcy5faXNDb25uZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy51bnJlZ2lzdGVyTG9jYWxlQ2hhbmdlKCk7XG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdiZWZvcmV1bmxvYWQnLCB0aGlzLmRpc2Nvbm5lY3RlZENhbGxiYWNrLCBmYWxzZSk7XG4gICAgICB9XG5cbiAgICAgIGdldCBjaGlsZHJlblRyZWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLnVzZVNoYWRvdyA/IHRoaXMuc2hhZG93Um9vdCA6IHRoaXM7XG4gICAgICB9XG5cbiAgICAgIF9pbnNlcnRUZW1wbGF0ZSgpIHtcbiAgICAgICAgY29uc3QgeyB0ZW1wbGF0ZSB9ID0gdGhpcy5jb25zdHJ1Y3RvcjtcblxuICAgICAgICBpZiAodGVtcGxhdGUpIHtcbiAgICAgICAgICB0aGlzLmNoaWxkcmVuVHJlZS5hcHBlbmRDaGlsZCh0ZW1wbGF0ZS5jb250ZW50LmNsb25lTm9kZSh0cnVlKSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgX2hhbmRsZUxvY2FsZUNoYW5nZShsb2NhbGUpIHtcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2RpcicsIGxvY2FsZS5kaXIpO1xuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnbGFuZycsIGxvY2FsZS5sYW5nKTtcbiAgICAgICAgdGhpcy5vbkxvY2FsZUNoYW5nZSAmJiB0aGlzLm9uTG9jYWxlQ2hhbmdlKGxvY2FsZSk7XG4gICAgICB9XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzKGtsYXNzKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoa2xhc3MsICdjb21wb25lbnRTdHlsZScsIHtcbiAgICAgICAgZ2V0KCkge1xuICAgICAgICAgIHJldHVybiBrbGFzcy50ZW1wbGF0ZS5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ3N0eWxlJykuaW5uZXJIVE1MO1xuICAgICAgICB9LFxuICAgICAgICBzZXQodmFsdWUpIHtcbiAgICAgICAgICBrbGFzcy50ZW1wbGF0ZS5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ3N0eWxlJykuaW5uZXJIVE1MID0gdmFsdWU7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4ga2xhc3M7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gUmVnaXN0ZXJhYmxlKGtsYXNzKSB7XG4gICAgICBrbGFzcy5yZWdpc3RlclNlbGYgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlZ2lzdHJhdGlvbk5hbWUgPSBrbGFzcy5yZWdpc3RyYXRpb25OYW1lO1xuICAgICAgICBjb25zdCBkZXBlbmRlbmNpZXMgPSBrbGFzcy5kZXBlbmRlbmNpZXM7XG4gICAgICAgIC8vIE1ha2Ugc3VyZSBvdXIgZGVwZW5kZW5jaWVzIGFyZSByZWdpc3RlcmVkIGJlZm9yZSB3ZSByZWdpc3RlciBzZWxmXG4gICAgICAgIGRlcGVuZGVuY2llcy5mb3JFYWNoKChkZXBlbmRlbmN5KSA9PiBkZXBlbmRlbmN5LnJlZ2lzdGVyU2VsZigpKTtcbiAgICAgICAgLy8gRG9uJ3QgdHJ5IHRvIHJlZ2lzdGVyIHNlbGYgaWYgYWxyZWFkeSByZWdpc3RlcmVkXG4gICAgICAgIGlmIChjdXN0b21FbGVtZW50cy5nZXQocmVnaXN0cmF0aW9uTmFtZSkpIHJldHVybiByZWdpc3RyYXRpb25OYW1lO1xuICAgICAgICAvLyBHaXZlIGEgY2hhbmNlIHRvIG92ZXJyaWRlIHdlYi1jb21wb25lbnQgc3R5bGUgaWYgcHJvdmlkZWQgYmVmb3JlIGJlaW5nIHJlZ2lzdGVyZWQuXG4gICAgICAgIGNvbnN0IGNvbXBvbmVudFN0eWxlID0gKCh3aW4uREJVSVdlYkNvbXBvbmVudHMgfHwge30pW3JlZ2lzdHJhdGlvbk5hbWVdIHx8IHt9KS5jb21wb25lbnRTdHlsZTtcbiAgICAgICAgaWYgKGNvbXBvbmVudFN0eWxlKSB7XG4gICAgICAgICAga2xhc3MuY29tcG9uZW50U3R5bGUgKz0gY29tcG9uZW50U3R5bGU7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRG8gcmVnaXN0cmF0aW9uXG4gICAgICAgIGN1c3RvbUVsZW1lbnRzLmRlZmluZShyZWdpc3RyYXRpb25OYW1lLCBrbGFzcyk7XG4gICAgICAgIHJldHVybiByZWdpc3RyYXRpb25OYW1lO1xuICAgICAgfTtcbiAgICAgIHJldHVybiBrbGFzcztcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgREJVSVdlYkNvbXBvbmVudEJhc2UsXG4gICAgICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzLFxuICAgICAgUmVnaXN0ZXJhYmxlXG4gICAgfTtcbiAgfSk7XG59XG4iLCJcbmltcG9ydCBnZXREQlVJV2ViQ29tcG9uZW50QmFzZSBmcm9tICcuLi9EQlVJV2ViQ29tcG9uZW50QmFzZS9EQlVJV2ViQ29tcG9uZW50QmFzZSc7XG5pbXBvcnQgZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uIGZyb20gJy4uL2ludGVybmFscy9lbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24nO1xuXG5jb25zdCByZWdpc3RyYXRpb25OYW1lID0gJ2RidWktd2ViLWNvbXBvbmVudC1kdW1teSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldERCVUlXZWJDb21wb25lbnREdW1teSh3aW4pIHtcbiAgcmV0dXJuIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbih3aW4sIHJlZ2lzdHJhdGlvbk5hbWUsICgpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBEQlVJV2ViQ29tcG9uZW50QmFzZSxcbiAgICAgIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMsXG4gICAgICBSZWdpc3RlcmFibGVcbiAgICB9ID0gZ2V0REJVSVdlYkNvbXBvbmVudEJhc2Uod2luKTtcbiAgICBjb25zdCB7IGRvY3VtZW50IH0gPSB3aW47XG5cbiAgICBjb25zdCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gYFxuICAgICAgPHN0eWxlPlxuICAgICAgOmhvc3Qge1xuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBtYXgtd2lkdGg6IDQwMHB4O1xuICAgICAgICBoZWlnaHQ6IHZhcigtLWRidWktaW5wdXQtaGVpZ2h0LCA1MHB4KTtcbiAgICAgICAgY29sb3I6IG1hcm9vbjtcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgZ3JheTtcbiAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgOmhvc3QgYiwgOmhvc3QgZGl2W3gtaGFzLXNsb3RdIHNwYW5beC1zbG90LXdyYXBwZXJdIHtcbiAgICAgICAgdW5pY29kZS1iaWRpOiBiaWRpLW92ZXJyaWRlO1xuICAgICAgICB0ZXh0LXNoYWRvdzogdmFyKC0tZHVtbXktYi10ZXh0LXNoYWRvdywgbm9uZSk7XG4gICAgICB9XG5cbiAgICAgIDpob3N0KFtkaXI9cnRsXSkgYiB7XG4gICAgICAgIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xuICAgICAgfVxuICAgICAgXG4gICAgICA6aG9zdChbZGlyPWx0cl0pIGIge1xuICAgICAgICB0ZXh0LWRlY29yYXRpb246IG92ZXJsaW5lO1xuICAgICAgfVxuXG4gICAgICA6aG9zdChbZGlyPWx0cl0pICNjb250YWluZXIgPiBkaXZbZGlyPXJ0bF0sXG4gICAgICA6aG9zdChbZGlyPXJ0bF0pICNjb250YWluZXIgPiBkaXZbZGlyPWx0cl0ge1xuICAgICAgICBkaXNwbGF5OiBub25lO1xuICAgICAgfVxuICAgICAgXG4gICAgICA6aG9zdCAjY29udGFpbmVyID4gZGl2W3gtaGFzLXNsb3RdIHtcbiAgICAgICAgbWFyZ2luLWxlZnQ6IDBweDtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgI2NvbnRhaW5lciB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZmxvdzogcm93IG5vd3JhcDtcbiAgICAgICAgYWxpZ24taXRlbXM6IHN0cmV0Y2g7XG4gICAgICB9XG4gICAgICBcbiAgICAgICNjb250YWluZXIgPiBkaXYge1xuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCBncmF5O1xuICAgICAgICBib3JkZXItcmFkaXVzOiB2YXIoLS1kdW1teS1pbm5lci1zZWN0aW9ucy1ib3JkZXItcmFkaXVzLCAwcHgpO1xuICAgICAgICBmbGV4OiAxIDAgMCU7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIG1hcmdpbjogNXB4O1xuICAgICAgfVxuICAgICAgXG4gICAgICAjY29udGFpbmVyID4gZGl2ID4gZGl2IHtcbiAgICAgICAgbWFyZ2luOiBhdXRvO1xuICAgICAgfVxuICAgICAgXG4gICAgICA8L3N0eWxlPlxuICAgICAgXG4gICAgICA8ZGl2IGlkPVwiY29udGFpbmVyXCI+XG4gICAgICAgIDxkaXYgZGlyPVwibHRyXCI+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxiPkR1bW15IHNoYWRvdzwvYj4gW0xUUl1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIFxuICAgICAgICA8ZGl2IHgtaGFzLXNsb3Q+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxzcGFuPls8L3NwYW4+PHNwYW4geC1zbG90LXdyYXBwZXI+PHNsb3Q+PC9zbG90Pjwvc3Bhbj48c3Bhbj5dPC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgXG4gICAgICAgIDxkaXYgZGlyPVwicnRsXCI+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxiPkR1bW15IHNoYWRvdzwvYj4gW1JUTF1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICBgO1xuXG4gICAgY2xhc3MgREJVSVdlYkNvbXBvbmVudER1bW15IGV4dGVuZHMgREJVSVdlYkNvbXBvbmVudEJhc2Uge1xuICAgICAgc3RhdGljIGdldCByZWdpc3RyYXRpb25OYW1lKCkge1xuICAgICAgICByZXR1cm4gcmVnaXN0cmF0aW9uTmFtZTtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuICAgICAgfVxuXG4gICAgICBvbkxvY2FsZUNoYW5nZShsb2NhbGUpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ29uTG9jYWxlQ2hhbmdlJywgbG9jYWxlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gUmVnaXN0ZXJhYmxlKFxuICAgICAgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyhcbiAgICAgICAgREJVSVdlYkNvbXBvbmVudER1bW15XG4gICAgICApXG4gICAgKTtcbiAgfSk7XG59XG5cbmdldERCVUlXZWJDb21wb25lbnREdW1teS5yZWdpc3RyYXRpb25OYW1lID0gcmVnaXN0cmF0aW9uTmFtZTtcblxuIiwiXG5cbmltcG9ydCBnZXREQlVJV2ViQ29tcG9uZW50QmFzZSBmcm9tICcuLi9EQlVJV2ViQ29tcG9uZW50QmFzZS9EQlVJV2ViQ29tcG9uZW50QmFzZSc7XG5pbXBvcnQgZ2V0REJVSVdlYkNvbXBvbmVudER1bW15IGZyb20gJy4uL0RCVUlXZWJDb21wb25lbnREdW1teS9EQlVJV2ViQ29tcG9uZW50RHVtbXknO1xuaW1wb3J0IGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbiBmcm9tICcuLi9pbnRlcm5hbHMvZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uJztcblxuY29uc3QgcmVnaXN0cmF0aW9uTmFtZSA9ICdkYnVpLXdlYi1jb21wb25lbnQtZHVtbXktcGFyZW50JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0REJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50KHdpbikge1xuICByZXR1cm4gZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uKHdpbiwgcmVnaXN0cmF0aW9uTmFtZSwgKCkgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIERCVUlXZWJDb21wb25lbnRCYXNlLFxuICAgICAgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyxcbiAgICAgIFJlZ2lzdGVyYWJsZVxuICAgIH0gPSBnZXREQlVJV2ViQ29tcG9uZW50QmFzZSh3aW4pO1xuICAgIGNvbnN0IERCVUlXZWJDb21wb25lbnREdW1teSA9IGdldERCVUlXZWJDb21wb25lbnREdW1teSh3aW4pO1xuXG4gICAgY29uc3QgeyBkb2N1bWVudCB9ID0gd2luO1xuXG4gICAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IGBcbiAgICAgIDxzdHlsZT5cbiAgICAgIDpob3N0IHtcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgbWF4LXdpZHRoOiA0MDBweDtcbiAgICAgIH1cbiAgICAgIDwvc3R5bGU+XG4gICAgICA8ZGl2PlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxiPkR1bW15IFBhcmVudCBzaGFkb3c8L2I+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxkYnVpLXdlYi1jb21wb25lbnQtZHVtbXk+PHNsb3Q+PC9zbG90PjwvZGJ1aS13ZWItY29tcG9uZW50LWR1bW15PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIGA7XG5cbiAgICBjbGFzcyBEQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQgZXh0ZW5kcyBEQlVJV2ViQ29tcG9uZW50QmFzZSB7XG4gICAgICBzdGF0aWMgZ2V0IHJlZ2lzdHJhdGlvbk5hbWUoKSB7XG4gICAgICAgIHJldHVybiByZWdpc3RyYXRpb25OYW1lO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlKCkge1xuICAgICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgZGVwZW5kZW5jaWVzKCkge1xuICAgICAgICByZXR1cm4gW0RCVUlXZWJDb21wb25lbnREdW1teV07XG4gICAgICB9XG5cbiAgICB9XG5cbiAgICByZXR1cm4gUmVnaXN0ZXJhYmxlKFxuICAgICAgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyhcbiAgICAgICAgREJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50XG4gICAgICApXG4gICAgKTtcbiAgfSk7XG59XG5cbmdldERCVUlXZWJDb21wb25lbnREdW1teVBhcmVudC5yZWdpc3RyYXRpb25OYW1lID0gcmVnaXN0cmF0aW9uTmFtZTtcblxuIiwiXG5pbXBvcnQgZ2V0REJVSVdlYkNvbXBvbmVudEJhc2UgZnJvbSAnLi4vREJVSVdlYkNvbXBvbmVudEJhc2UvREJVSVdlYkNvbXBvbmVudEJhc2UnO1xuaW1wb3J0IGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbiBmcm9tICcuLi9pbnRlcm5hbHMvZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uJztcbmltcG9ydCBGb2N1c2FibGUgZnJvbSAnLi4vYmVoYXZpb3Vycy9Gb2N1c2FibGUnO1xuXG5jb25zdCByZWdpc3RyYXRpb25OYW1lID0gJ2RidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LXRleHQnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXREQlVJV2ViQ29tcG9uZW50Rm9ybUlucHV0VGV4dCh3aW4pIHtcbiAgcmV0dXJuIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbih3aW4sIHJlZ2lzdHJhdGlvbk5hbWUsICgpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBEQlVJV2ViQ29tcG9uZW50QmFzZSxcbiAgICAgIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMsXG4gICAgICBSZWdpc3RlcmFibGVcbiAgICB9ID0gZ2V0REJVSVdlYkNvbXBvbmVudEJhc2Uod2luKTtcbiAgICBjb25zdCB7IGRvY3VtZW50IH0gPSB3aW47XG5cbiAgICBjb25zdCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gYFxuICAgICAgPHN0eWxlPlxuICAgICAgOmhvc3Qge1xuICAgICAgICBhbGw6IGluaXRpYWw7IFxuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAvKmhlaWdodDogdmFyKC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtaGVpZ2h0KTsqL1xuICAgICAgICAvKmxpbmUtaGVpZ2h0OiB2YXIoLS1kYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC1oZWlnaHQpOyovXG4gICAgICAgIGhlaWdodDogMjAwcHg7XG4gICAgICAgIHBhZGRpbmc6IDBweDtcbiAgICAgICAgZm9udC1zaXplOiAxOHB4O1xuICAgICAgICBjb2xvcjogdmFyKC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtY29sb3IpO1xuICAgICAgICAvKmJhY2tncm91bmQtY29sb3I6IHZhcigtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWJhY2tncm91bmQtY29sb3IpOyovXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAxMDAsIDAsIDAuMSk7XG4gICAgICAgIHVuaWNvZGUtYmlkaTogYmlkaS1vdmVycmlkZTtcbiAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAgICAgYm9yZGVyOiBub25lO1xuICAgICAgICBib3JkZXItYm90dG9tOiB2YXIoLS1kYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC1ib3JkZXItd2lkdGgpIHZhcigtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWJvcmRlci1zdHlsZSkgdmFyKC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtYm9yZGVyLWNvbG9yKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgOmhvc3QgW3RhYmluZGV4XSB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBoZWlnaHQ6IDUwcHg7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiA1MHB4O1xuICAgICAgICBib3JkZXI6IG5vbmU7XG4gICAgICAgIG1hcmdpbjogMHB4O1xuICAgICAgICBwYWRkaW5nOiAwcHg7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICAgICAgICBib3JkZXItcmFkaXVzOiAwcHg7XG4gICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgICAgIHVuaWNvZGUtYmlkaTogYmlkaS1vdmVycmlkZTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgOmhvc3QgW3RhYmluZGV4XTpmb2N1cyB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAwLCAwLCAuMyk7XG4gICAgICAgIG91dGxpbmU6IG5vbmU7XG4gICAgICB9XG5cbiAgICAgIDpob3N0KFtmb2N1c2VkXSkge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDI1NSwgMCwgLjMpO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvKjpob3N0KFtkaXNhYmxlZF0pIHsqL1xuICAgICAgICAvKmJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgLjMpOyovXG4gICAgICAvKn0qL1xuXG4gICAgICA6aG9zdChbaGlkZGVuXSkge1xuICAgICAgICBkaXNwbGF5OiBub25lO1xuICAgICAgfVxuXG4gICAgICA6aG9zdChbZGlyPXJ0bF0pIHtcbiAgICAgIFxuICAgICAgfVxuICAgICAgXG4gICAgICA6aG9zdChbZGlyPWx0cl0pIHtcbiAgICAgIFxuICAgICAgfVxuICAgICAgPC9zdHlsZT5cbiAgICAgIDxkaXYgY29udGVudGVkaXRhYmxlPVwidHJ1ZVwiIHRhYmluZGV4PVwiMFwiPjwvZGl2PlxuICAgICAgPGRpdiBjb250ZW50ZWRpdGFibGU9XCJ0cnVlXCIgdGFiaW5kZXg9XCIwXCI+PC9kaXY+XG4gICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiB0YWJpbmRleD1cIjBcIiAvPlxuICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgdGFiaW5kZXg9XCIwXCIgLz5cbiAgICBgO1xuXG4gICAgY2xhc3MgREJVSVdlYkNvbXBvbmVudEZvcm1JbnB1dFRleHQgZXh0ZW5kcyBEQlVJV2ViQ29tcG9uZW50QmFzZSB7XG4gICAgICBzdGF0aWMgZ2V0IHJlZ2lzdHJhdGlvbk5hbWUoKSB7XG4gICAgICAgIHJldHVybiByZWdpc3RyYXRpb25OYW1lO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlKCkge1xuICAgICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgcHJvcGVydGllc1RvRGVmaW5lKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHJvbGU6ICdmb3JtLWlucHV0J1xuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICAvLyBvbkxvY2FsZUNoYW5nZShsb2NhbGUpIHtcbiAgICAgIC8vICAgLy8gY29uc29sZS5sb2coJ29uTG9jYWxlQ2hhbmdlJywgbG9jYWxlKTtcbiAgICAgIC8vIH1cblxuICAgIH1cblxuICAgIHJldHVybiBSZWdpc3RlcmFibGUoXG4gICAgICBGb2N1c2FibGUoXG4gICAgICAgIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMoXG4gICAgICAgICAgREJVSVdlYkNvbXBvbmVudEZvcm1JbnB1dFRleHRcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG5cbiAgfSk7XG59XG5cbmdldERCVUlXZWJDb21wb25lbnRGb3JtSW5wdXRUZXh0LnJlZ2lzdHJhdGlvbk5hbWUgPSByZWdpc3RyYXRpb25OYW1lO1xuXG4iLCJpbXBvcnQgYXBwZW5kU3R5bGUgZnJvbSAnLi4vaW50ZXJuYWxzL2FwcGVuZFN0eWxlJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZGJ1aVdlYkNvbXBvbmVudHNTZXRVcCh3aW4pIHtcbiAgcmV0dXJuIHtcbiAgICBhcHBlbmRTdHlsZTogYXBwZW5kU3R5bGUod2luKVxuICB9O1xufVxuIiwiXG4vKipcbiAqIFdoZW4gYW4gaW5uZXIgZm9jdXNhYmxlIGlzIGZvY3VzZWQgKGV4OiB2aWEgY2xpY2spIHRoZSBlbnRpcmUgY29tcG9uZW50IGdldHMgZm9jdXNlZC5cbiAqIFdoZW4gdGhlIGNvbXBvbmVudCBnZXRzIGZvY3VzZWQgKGV4OiB2aWEgdGFiKSB0aGUgZmlyc3QgaW5uZXIgZm9jdXNhYmxlIGdldHMgZm9jdXNlZCB0b28uXG4gKiBXaGVuIHRoZSBjb21wb25lbnQgZ2V0cyBkaXNhYmxlZCBpdCBnZXRzIGJsdXJyZWQgdG9vIGFuZCBhbGwgaW5uZXIgZm9jdXNhYmxlcyBnZXQgZGlzYWJsZWQgYW5kIGJsdXJyZWQuXG4gKiBXaGVuIGRpc2FibGVkIHRoZSBjb21wb25lbnQgY2Fubm90IGJlIGZvY3VzZWQuXG4gKiBXaGVuIGVuYWJsZWQgdGhlIGNvbXBvbmVudCBjYW4gYmUgZm9jdXNlZC5cbiAqIEBwYXJhbSBLbGFzc1xuICogQHJldHVybnMge0ZvY3VzYWJsZX1cbiAqIEBjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBGb2N1c2FibGUoS2xhc3MpIHtcblxuICBLbGFzcy5jb21wb25lbnRTdHlsZSArPSBgXG4gIDpob3N0KFtkaXNhYmxlZF0pIHtcbiAgICAvKiBjdXJzb3I6IG5vdC1hbGxvd2VkOyAqL1xuICAgIC8qcG9pbnRlci1ldmVudHM6IG5vbmU7Ki9cbiAgICBvcGFjaXR5OiAwLjU7XG4gIH1cbiAgLypcbiAgOmhvc3QoW2Rpc2FibGVkXSk6YmVmb3JlIHtcbiAgICBjb250ZW50OiAnJztcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgd2lkdGg6IDEwMCU7IGhlaWdodDogMTAwJTtcbiAgICB0b3A6IDA7IGxlZnQ6IDA7XG4gIH1cbiAgKi9cbiAgYDtcblxuICBjbGFzcyBGb2N1c2FibGUgZXh0ZW5kcyBLbGFzcyB7XG5cbiAgICAvLyBUT0RPOiBlbGVtZW50IGxvb2tzIGxpa2UgZm9jdXNlZCBpZiB1c2VyIHNldHMgZm9jdXNlZCBodG1sIHByb3BlcnR5IGF0IGNyZWF0aW9uXG4gICAgLy8gZXZlbiBhZnRlciBjbGlja2luZyBvdXRzaWRlIGVsZW1lbnRcblxuICAgIHN0YXRpYyBnZXQgcHJvcGVydGllc1RvRGVmaW5lKCkge1xuICAgICAgY29uc3QgaW5oZXJpdGVkUHJvcGVydGllc1RvRGVmaW5lID0gc3VwZXIucHJvcGVydGllc1RvRGVmaW5lIHx8IHt9O1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uaW5oZXJpdGVkUHJvcGVydGllc1RvRGVmaW5lLFxuICAgICAgICAvLyB0YWJpbmRleCBkZWZpbmVzIGZvY3VzYWJsZSBiZWhhdmlvdXJcbiAgICAgICAgdGFiaW5kZXg6IDBcbiAgICAgIH07XG4gICAgfVxuXG4gICAgc3RhdGljIGdldCBwcm9wZXJ0aWVzVG9VcGdyYWRlKCkge1xuICAgICAgY29uc3QgaW5oZXJpdGVkUHJvcGVydGllc1RvVXBncmFkZSA9IHN1cGVyLnByb3BlcnRpZXNUb1VwZ3JhZGUgfHwgW107XG4gICAgICByZXR1cm4gWy4uLmluaGVyaXRlZFByb3BlcnRpZXNUb1VwZ3JhZGUsICdmb2N1c2VkJywgJ2Rpc2FibGVkJ107XG4gICAgfVxuXG4gICAgc3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7XG4gICAgICBjb25zdCBpbmhlcml0ZWRPYnNlcnZlZEF0dHJpYnV0ZXMgPSBzdXBlci5vYnNlcnZlZEF0dHJpYnV0ZXMgfHwgW107XG4gICAgICByZXR1cm4gWy4uLmluaGVyaXRlZE9ic2VydmVkQXR0cmlidXRlcywgJ2ZvY3VzZWQnLCAnZGlzYWJsZWQnXTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgICBzdXBlciguLi5hcmdzKTtcblxuICAgICAgdGhpcy5fY3VycmVudElubmVyRm9jdXNlZCA9IG51bGw7XG4gICAgICB0aGlzLl9vbklubmVyRm9jdXNhYmxlRm9jdXNlZCA9IHRoaXMuX29uSW5uZXJGb2N1c2FibGVGb2N1c2VkLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLl9vbkZvY3VzID0gdGhpcy5fb25Gb2N1cy5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5fb25CbHVyID0gdGhpcy5fb25CbHVyLmJpbmQodGhpcyk7XG4gICAgfVxuXG4gICAgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSkge1xuICAgICAgc3VwZXIuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrICYmXG4gICAgICAgIHN1cGVyLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpO1xuXG4gICAgICBjb25zdCBoYXNWYWx1ZSA9IG5ld1ZhbHVlICE9PSBudWxsO1xuICAgICAgaWYgKG5hbWUgPT09ICdmb2N1c2VkJykge1xuICAgICAgICAvLyBUaGUgYnJvd3NlciBtaWdodCBkZWNpZGUgdG8gbm90IGFwcGx5IGZvY3VzIHdpdGhvdXQgdXNlciBpbnRlcmFjdGlvbi5cbiAgICAgICAgLy8gZXg6IG9uIElQYWRcbiAgICAgICAgaGFzVmFsdWUgPyB0aGlzLl9hcHBseUZvY3VzU2lkZUVmZmVjdHMoKSA6IHRoaXMuX2FwcGx5Qmx1clNpZGVFZmZlY3RzKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICBzdXBlci5jb25uZWN0ZWRDYWxsYmFjayAmJlxuICAgICAgICBzdXBlci5jb25uZWN0ZWRDYWxsYmFjaygpO1xuXG4gICAgICAvLyB3aGVuIGNvbXBvbmVudCBmb2N1c2VkL2JsdXJyZWRcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCB0aGlzLl9vbkZvY3VzKTtcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMuX29uQmx1cik7XG5cbiAgICAgIHRoaXMuX2lubmVyRm9jdXNhYmxlcy5mb3JFYWNoKChmb2N1c2FibGUpID0+IHtcbiAgICAgICAgLy8gd2hlbiBpbm5lciBmb2N1c2FibGUgZm9jdXNlZFxuICAgICAgICBmb2N1c2FibGUuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCB0aGlzLl9vbklubmVyRm9jdXNhYmxlRm9jdXNlZCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgIHN1cGVyLmRpc2Nvbm5lY3RlZENhbGxiYWNrICYmXG4gICAgICAgIHN1cGVyLmRpc2Nvbm5lY3RlZENhbGxiYWNrKCk7XG5cbiAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignZm9jdXMnLCB0aGlzLl9vbkZvY3VzKTtcbiAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMuX29uQmx1cik7XG5cbiAgICAgIHRoaXMuX2lubmVyRm9jdXNhYmxlcy5mb3JFYWNoKChmb2N1c2FibGUpID0+IHtcbiAgICAgICAgZm9jdXNhYmxlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdGhpcy5fb25Jbm5lckZvY3VzYWJsZUZvY3VzZWQpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8ga2VlcCBnZXR0ZXJzIGFuZCBzZXR0ZXJzIGdlbmVyaWNcbiAgICAvLyAoc28gd2UgY2FuIHB1dCB0aGVtIGluIGJhc2UgY2xhc3MpLCBkbyBub3QgYWRkIGN1c3RvbSBsb2dpY1xuICAgIGdldCBmb2N1c2VkKCkge1xuICAgICAgcmV0dXJuIHRoaXMuaGFzQXR0cmlidXRlKCdmb2N1c2VkJyk7XG4gICAgfVxuXG4gICAgc2V0IGZvY3VzZWQodmFsdWUpIHtcbiAgICAgIGNvbnN0IGhhc1ZhbHVlID0gQm9vbGVhbih2YWx1ZSk7XG4gICAgICBpZiAoaGFzVmFsdWUpIHtcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2ZvY3VzZWQnLCAnJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgnZm9jdXNlZCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGdldCBkaXNhYmxlZCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmhhc0F0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgICB9XG5cbiAgICBzZXQgZGlzYWJsZWQodmFsdWUpIHtcbiAgICAgIGNvbnN0IGhhc1ZhbHVlID0gQm9vbGVhbih2YWx1ZSk7XG4gICAgICBpZiAoaGFzVmFsdWUpIHtcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJycpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IF9pbm5lckZvY3VzYWJsZXMoKSB7XG4gICAgICByZXR1cm4gdGhpcy5jaGlsZHJlblRyZWUucXVlcnlTZWxlY3RvckFsbCgnW3RhYmluZGV4XScpIHx8IFtdO1xuICAgIH1cblxuICAgIGdldCBfZmlyc3RJbm5lckZvY3VzYWJsZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuVHJlZS5xdWVyeVNlbGVjdG9yKCdbdGFiaW5kZXhdJyk7XG4gICAgfVxuXG4gICAgX29uSW5uZXJGb2N1c2FibGVGb2N1c2VkKGV2dCkge1xuICAgICAgdGhpcy5fY3VycmVudElubmVyRm9jdXNlZCA9IGV2dC50YXJnZXQ7XG4gICAgfVxuXG4gICAgX29uRm9jdXMoKSB7XG4gICAgICBjb25zb2xlLmxvZygnX29uRm9jdXMnLCB0aGlzLmlkKTtcbiAgICAgIGlmICghdGhpcy5mb2N1c2VkKSB7XG4gICAgICAgIHRoaXMuZm9jdXNlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uQmx1cigpIHtcbiAgICAgIGlmICh0aGlzLmZvY3VzZWQpIHtcbiAgICAgICAgdGhpcy5mb2N1c2VkID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2FwcGx5Rm9jdXNTaWRlRWZmZWN0cygpIHtcbiAgICAgIGlmICh0aGlzLl9jdXJyZW50SW5uZXJGb2N1c2VkKSB7XG4gICAgICAgIC8vIFNvbWUgaW5uZXIgY29tcG9uZW50IGlzIGFscmVhZHkgZm9jdXNlZC5cbiAgICAgICAgLy8gTm8gbmVlZCB0byBzZXQgZm9jdXMgb24gYW55dGhpbmcuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2ZvY3VzRmlyc3RJbm5lckZvY3VzYWJsZSgpO1xuICAgIH1cblxuICAgIF9hcHBseUJsdXJTaWRlRWZmZWN0cygpIHtcbiAgICAgIGlmICh0aGlzLl9jdXJyZW50SW5uZXJGb2N1c2VkKSB7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRJbm5lckZvY3VzZWQuYmx1cigpO1xuICAgICAgICB0aGlzLl9jdXJyZW50SW5uZXJGb2N1c2VkID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfZm9jdXNGaXJzdElubmVyRm9jdXNhYmxlKCkge1xuICAgICAgY29uc3QgZmlyc3RJbm5lckZvY3VzYWJsZSA9IHRoaXMuX2ZpcnN0SW5uZXJGb2N1c2FibGU7XG4gICAgICBpZiAoZmlyc3RJbm5lckZvY3VzYWJsZSkge1xuICAgICAgICB0aGlzLl9jdXJyZW50SW5uZXJGb2N1c2VkID0gZmlyc3RJbm5lckZvY3VzYWJsZTtcbiAgICAgICAgZmlyc3RJbm5lckZvY3VzYWJsZS5mb2N1cygpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIEZvY3VzYWJsZS5vcmlnaW5hbE5hbWUgPSBLbGFzcy5uYW1lO1xuICByZXR1cm4gRm9jdXNhYmxlO1xufVxuIiwiLypcbkRCVUlXZWJDb21wb25lbnRCYXNlIChmcm9tIHdoaWNoIGFsbCB3ZWItY29tcG9uZW50cyBpbmhlcml0KVxud2lsbCByZWFkIGNvbXBvbmVudFN0eWxlIGZyb20gd2luLkRCVUlXZWJDb21wb25lbnRzXG53aGVuIGtsYXNzLnJlZ2lzdGVyU2VsZigpIGlzIGNhbGxlZCBnaXZpbmcgYSBjaGFuY2UgdG8gb3ZlcnJpZGUgZGVmYXVsdCB3ZWItY29tcG9uZW50IHN0eWxlXG5qdXN0IGJlZm9yZSBpdCBpcyByZWdpc3RlcmVkLlxuKi9cbmNvbnN0IGFwcGVuZFN0eWxlID0gKHdpbikgPT4gKHJlZ2lzdHJhdGlvbk5hbWUsIGNvbXBvbmVudFN0eWxlKSA9PiB7XG4gIGlmICghd2luLkRCVUlXZWJDb21wb25lbnRzKSB7XG4gICAgd2luLkRCVUlXZWJDb21wb25lbnRzID0ge307XG4gIH1cbiAgd2luLkRCVUlXZWJDb21wb25lbnRzID0ge1xuICAgIC4uLndpbi5EQlVJV2ViQ29tcG9uZW50cyxcbiAgICBbcmVnaXN0cmF0aW9uTmFtZV06IHtcbiAgICAgIC4uLndpbi5EQlVJV2ViQ29tcG9uZW50c1tyZWdpc3RyYXRpb25OYW1lXSxcbiAgICAgIGNvbXBvbmVudFN0eWxlXG4gICAgfVxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgYXBwZW5kU3R5bGU7XG4iLCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uKHdpbiwgbmFtZSwgY2FsbGJhY2spIHtcbiAgaWYgKCF3aW4uREJVSVdlYkNvbXBvbmVudHMpIHtcbiAgICB3aW4uREJVSVdlYkNvbXBvbmVudHMgPSB7IHJlZ2lzdHJhdGlvbnM6IHt9IH07XG4gIH0gZWxzZSBpZiAoIXdpbi5EQlVJV2ViQ29tcG9uZW50cy5yZWdpc3RyYXRpb25zKSB7XG4gICAgd2luLkRCVUlXZWJDb21wb25lbnRzLnJlZ2lzdHJhdGlvbnMgPSB7fTtcbiAgfVxuXG4gIGxldCByZWdpc3RyYXRpb24gPSB3aW4uREJVSVdlYkNvbXBvbmVudHMucmVnaXN0cmF0aW9uc1tuYW1lXTtcblxuICBpZiAocmVnaXN0cmF0aW9uKSByZXR1cm4gcmVnaXN0cmF0aW9uO1xuXG4gIHJlZ2lzdHJhdGlvbiA9IGNhbGxiYWNrKCk7XG4gIHdpbi5EQlVJV2ViQ29tcG9uZW50cy5yZWdpc3RyYXRpb25zW25hbWVdID0gcmVnaXN0cmF0aW9uO1xuXG4gIHJldHVybiB3aW4uREJVSVdlYkNvbXBvbmVudHMucmVnaXN0cmF0aW9uc1tuYW1lXTtcbn1cblxuIiwiXG5pbXBvcnQgZGJ1aVdlYkNvbXBvbmVudHNTZXRVcCBmcm9tICcuL0RCVUlXZWJDb21wb25lbnRzU2V0dXAvREJVSVdlYkNvbXBvbmVudHNTZXR1cCc7XG5pbXBvcnQgZ2V0REJVSVdlYkNvbXBvbmVudER1bW15IGZyb20gJy4vREJVSVdlYkNvbXBvbmVudER1bW15L0RCVUlXZWJDb21wb25lbnREdW1teSc7XG5pbXBvcnQgZ2V0REJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50IGZyb20gJy4vREJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50L0RCVUlXZWJDb21wb25lbnREdW1teVBhcmVudCc7XG5pbXBvcnQgZ2V0REJVSVdlYkNvbXBvbmVudEZvcm1JbnB1dFRleHQgZnJvbSAnLi9EQlVJV2ViQ29tcG9uZW50Rm9ybUlucHV0VGV4dC9EQlVJV2ViQ29tcG9uZW50Rm9ybUlucHV0VGV4dCc7XG5cbmNvbnN0IHJlZ2lzdHJhdGlvbnMgPSB7XG4gIFtnZXREQlVJV2ViQ29tcG9uZW50RHVtbXkucmVnaXN0cmF0aW9uTmFtZV06XG4gICAgZ2V0REJVSVdlYkNvbXBvbmVudER1bW15LFxuICBbZ2V0REJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50LnJlZ2lzdHJhdGlvbk5hbWVdOlxuICAgIGdldERCVUlXZWJDb21wb25lbnREdW1teVBhcmVudCxcbiAgW2dldERCVUlXZWJDb21wb25lbnRGb3JtSW5wdXRUZXh0LnJlZ2lzdHJhdGlvbk5hbWVdOlxuICAgIGdldERCVUlXZWJDb21wb25lbnRGb3JtSW5wdXRUZXh0LFxufTtcblxuLypcblVzaW5nIHRoaXMgZnVuY3Rpb24gaW1wbGllcyBlbnRpcmUgREJVSVdlYkNvbXBvbmVudHMgbGlicmFyeVxuaXMgYWxyZWFkeSBsb2FkZWQuXG5JdCBpcyB1c2VmdWwgZXNwZWNpYWxseSB3aGVuIHdvcmtpbmcgd2l0aCBkaXN0cmlidXRpb24gYnVpbGQuXG5JZiB5b3Ugd2FudCB0byBsb2FkIGp1c3Qgb25lIHdlYi1jb21wb25lbnQgb3IgYSBzdWJzZXQgb2Ygd2ViLWNvbXBvbmVudHNcbmxvYWQgdGhlbSBmcm9tIG5vZGVfbW9kdWxlcyBieSB0aGVpciBwYXRoXG5leDpcbmltcG9ydCBTb21lQ29tcG9uZW50TG9hZGVyIGZyb20gbm9kZV9tb2R1bGVzL2Rldi1ib3gtdWkvYnVpbGQvc3JjL2xpYi93ZWJjb21wb25lbnRzL1NvbWVDb21wb25lbnQ7XG4qL1xuZnVuY3Rpb24gcXVpY2tTZXR1cEFuZExvYWQod2luID0gd2luZG93KSB7XG4gIHJldHVybiBmdW5jdGlvbiAoY29tcG9uZW50cykge1xuICAgIGNvbnN0IHJldCA9IHt9O1xuICAgIGNvbXBvbmVudHMuZm9yRWFjaCgoeyByZWdpc3RyYXRpb25OYW1lLCBjb21wb25lbnRTdHlsZSB9KSA9PiB7XG4gICAgICBkYnVpV2ViQ29tcG9uZW50c1NldFVwKHdpbikuYXBwZW5kU3R5bGUocmVnaXN0cmF0aW9uTmFtZSwgY29tcG9uZW50U3R5bGUpO1xuICAgICAgY29uc3QgY29tcG9uZW50Q2xhc3MgPSByZWdpc3RyYXRpb25zW3JlZ2lzdHJhdGlvbk5hbWVdKHdpbmRvdyk7XG4gICAgICBjb21wb25lbnRDbGFzcy5yZWdpc3RlclNlbGYoKTtcbiAgICAgIHJldFtyZWdpc3RyYXRpb25OYW1lXSA9IGNvbXBvbmVudENsYXNzO1xuICAgIH0pO1xuICAgIHJldHVybiByZXQ7XG4gIH07XG59XG5cbmV4cG9ydCB7XG4gIHJlZ2lzdHJhdGlvbnMsXG4gIHF1aWNrU2V0dXBBbmRMb2FkLFxuICBkYnVpV2ViQ29tcG9uZW50c1NldFVwLFxuICBnZXREQlVJV2ViQ29tcG9uZW50RHVtbXksXG4gIGdldERCVUlXZWJDb21wb25lbnREdW1teVBhcmVudCxcbiAgZ2V0REJVSVdlYkNvbXBvbmVudEZvcm1JbnB1dFRleHRcbn07XG4iXX0=
