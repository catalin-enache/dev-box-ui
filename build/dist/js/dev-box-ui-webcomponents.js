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
          console.log(`upgrading property ${prop} for ${this.getAttribute('name')}`);
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
      defineCommonStaticMethods
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
    const { DBUIWebComponentBase, defineCommonStaticMethods } = (0, _DBUIWebComponentBase2.default)(win);
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
        background-color: var(--dbui-web-component-form-input-background-color);
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
      }
      
      :host [tabindex]:focus {
        background-color: rgba(255, 0, 0, .3);
        outline: none;
      }

      :host([focused]) {
        background-color: rgba(0, 255, 0, .3);
      }
      
      :host([disabled]) {
        background-color: rgba(0, 0, 0, .3);
      }
      
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

    return defineCommonStaticMethods((0, _Focusable2.default)(DBUIWebComponentFormInputText));
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
  class Focusable extends Klass {

    // TODO: play with _upgradeProperty

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

    get focused() {
      return this.hasAttribute('focused');
    }

    // keep this generic (so we can put it in base class), do not add custom logic
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

    // keep this generic (so we can put it in base class), do not add custom logic
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL3NlcnZpY2VzL0xvY2FsZVNlcnZpY2UuanMiLCJzcmMvbGliL3dlYmNvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudEJhc2UvREJVSVdlYkNvbXBvbmVudEJhc2UuanMiLCJzcmMvbGliL3dlYmNvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudER1bW15L0RCVUlXZWJDb21wb25lbnREdW1teS5qcyIsInNyYy9saWIvd2ViY29tcG9uZW50cy9EQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQvREJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50LmpzIiwic3JjL2xpYi93ZWJjb21wb25lbnRzL0RCVUlXZWJDb21wb25lbnRGb3JtSW5wdXRUZXh0L0RCVUlXZWJDb21wb25lbnRGb3JtSW5wdXRUZXh0LmpzIiwic3JjL2xpYi93ZWJjb21wb25lbnRzL0RCVUlXZWJDb21wb25lbnRzU2V0dXAvREJVSVdlYkNvbXBvbmVudHNTZXR1cC5qcyIsInNyYy9saWIvd2ViY29tcG9uZW50cy9iZWhhdmlvdXJzL0ZvY3VzYWJsZS5qcyIsInNyYy9saWIvd2ViY29tcG9uZW50cy9pbnRlcm5hbHMvYXBwZW5kU3R5bGUuanMiLCJzcmMvbGliL3dlYmNvbXBvbmVudHMvaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbi5qcyIsInNyYy9saWIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7QUNDQSxNQUFNLGdCQUFnQjtBQUNwQixPQUFLLEtBRGU7QUFFcEIsUUFBTTtBQUZjLENBQXRCOztBQUtBLE1BQU0sYUFBTixDQUFvQjtBQUNsQixnQkFBYztBQUNaLFNBQUssVUFBTCxHQUFrQixFQUFsQjtBQUNBLFNBQUssWUFBTCxHQUFvQixPQUFPLElBQVAsQ0FBWSxhQUFaLENBQXBCO0FBQ0EsU0FBSyxZQUFMLEdBQW9CLE9BQU8sUUFBUCxDQUFnQixlQUFw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ZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxuY29uc3QgZGVmYXVsdExvY2FsZSA9IHtcbiAgZGlyOiAnbHRyJyxcbiAgbGFuZzogJ2VuJ1xufTtcblxuY2xhc3MgTG9jYWxlU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX2NhbGxiYWNrcyA9IFtdO1xuICAgIHRoaXMuX2xvY2FsZUF0dHJzID0gT2JqZWN0LmtleXMoZGVmYXVsdExvY2FsZSk7XG4gICAgdGhpcy5fcm9vdEVsZW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgIHRoaXMuX2xvY2FsZUF0dHJzLmZvckVhY2goKGF0dHIpID0+IHtcbiAgICAgIGlmICghdGhpcy5fcm9vdEVsZW1lbnQuZ2V0QXR0cmlidXRlKGF0dHIpKSB7XG4gICAgICAgIHRoaXMuX3Jvb3RFbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyLCBkZWZhdWx0TG9jYWxlW2F0dHJdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLl9sb2NhbGUgPSB0aGlzLl9sb2NhbGVBdHRycy5yZWR1Y2UoKGFjYywgYXR0cikgPT4ge1xuICAgICAgYWNjW2F0dHJdID0gdGhpcy5fcm9vdEVsZW1lbnQuZ2V0QXR0cmlidXRlKGF0dHIpO1xuICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCB7fSk7XG4gICAgdGhpcy5fb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcih0aGlzLl9oYW5kbGVNdXRhdGlvbnMuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5fb2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLl9yb290RWxlbWVudCwge1xuICAgICAgYXR0cmlidXRlczogdHJ1ZVxuICAgIH0pO1xuICB9XG5cbiAgX2hhbmRsZU11dGF0aW9ucyhtdXRhdGlvbnMpIHtcbiAgICBtdXRhdGlvbnMuZm9yRWFjaCgobXV0YXRpb24pID0+IHtcbiAgICAgIGNvbnN0IG11dGF0aW9uQXR0cmlidXRlTmFtZSA9IG11dGF0aW9uLmF0dHJpYnV0ZU5hbWU7XG4gICAgICBpZiAodGhpcy5fbG9jYWxlQXR0cnMuaW5jbHVkZXMobXV0YXRpb25BdHRyaWJ1dGVOYW1lKSkge1xuICAgICAgICB0aGlzLl9sb2NhbGUgPSB7XG4gICAgICAgICAgLi4udGhpcy5fbG9jYWxlLFxuICAgICAgICAgIFttdXRhdGlvbkF0dHJpYnV0ZU5hbWVdOiB0aGlzLl9yb290RWxlbWVudC5nZXRBdHRyaWJ1dGUobXV0YXRpb25BdHRyaWJ1dGVOYW1lKVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9jYWxsYmFja3MuZm9yRWFjaChjYWxsYmFjayA9PiBjYWxsYmFjayh0aGlzLl9sb2NhbGUpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHNldCBsb2NhbGUobG9jYWxlT2JqKSB7XG4gICAgT2JqZWN0LmtleXMobG9jYWxlT2JqKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIHRoaXMuX3Jvb3RFbGVtZW50LnNldEF0dHJpYnV0ZShrZXksIGxvY2FsZU9ialtrZXldKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldCBsb2NhbGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xvY2FsZTtcbiAgfVxuXG4gIG9uTG9jYWxlQ2hhbmdlKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuICAgIGNhbGxiYWNrKHRoaXMubG9jYWxlKTtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzLmZpbHRlcihjYiA9PiBjYiAhPT0gY2FsbGJhY2spO1xuICAgIH07XG4gIH1cbn1cblxuY29uc3QgbG9jYWxlU2VydmljZSA9IG5ldyBMb2NhbGVTZXJ2aWNlKCk7XG5leHBvcnQgZGVmYXVsdCBsb2NhbGVTZXJ2aWNlO1xuIiwiXG5pbXBvcnQgTG9jYWxlU2VydmljZSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9Mb2NhbGVTZXJ2aWNlJztcbmltcG9ydCBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24gZnJvbSAnLi4vaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbic7XG5cbmNvbnN0IHJlZ2lzdHJhdGlvbk5hbWUgPSAnREJVSVdlYkNvbXBvbmVudEJhc2UnO1xuXG5mdW5jdGlvbiBkZWZpbmVDb21tb25DU1NWYXJzKCkge1xuICBjb25zdCBjb21tb25TdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gIGNvbW1vblN0eWxlLmlubmVySFRNTCA9IGBcbiAgOnJvb3Qge1xuICAgIC0tZGJ1aS13ZWItY29tcG9uZW50LWdsb2JhbC1ib3JkZXItcmFkaXVzOiA1cHg7XG4gICAgLS1kYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC1oZWlnaHQ6IDMwcHg7XG4gICAgLS1kYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC1jb2xvcjogIzAwMDtcbiAgICAtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICAgIC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtYm9yZGVyLWNvbG9yOiAjY2NjO1xuICAgIC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtYm9yZGVyLXN0eWxlOiBzb2xpZDtcbiAgICAtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWJvcmRlci13aWR0aDogMXB4O1xuICB9XG4gIGA7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2hlYWQnKS5hcHBlbmRDaGlsZChjb21tb25TdHlsZSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldERCVUlXZWJDb21wb25lbnRCYXNlKHdpbikge1xuICByZXR1cm4gZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uKHdpbiwgcmVnaXN0cmF0aW9uTmFtZSwgKCkgPT4ge1xuICAgIGRlZmluZUNvbW1vbkNTU1ZhcnMoKTtcbiAgICBjb25zdCB7IGRvY3VtZW50LCBIVE1MRWxlbWVudCwgY3VzdG9tRWxlbWVudHMgfSA9IHdpbjtcblxuICAgIGNvbnN0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSAnPHN0eWxlPjwvc3R5bGU+PHNsb3Q+PC9zbG90Pic7XG5cbiAgICBjbGFzcyBEQlVJV2ViQ29tcG9uZW50QmFzZSBleHRlbmRzIEhUTUxFbGVtZW50IHtcblxuICAgICAgc3RhdGljIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IGRlcGVuZGVuY2llcygpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IHVzZVNoYWRvdygpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgcHJvcGVydGllc1RvVXBncmFkZSgpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IHByb3BlcnRpZXNUb0RlZmluZSgpIHtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgfVxuXG4gICAgICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgY29uc3QgeyB1c2VTaGFkb3cgfSA9IHRoaXMuY29uc3RydWN0b3I7XG4gICAgICAgIGlmICh1c2VTaGFkb3cpIHtcbiAgICAgICAgICB0aGlzLmF0dGFjaFNoYWRvdyh7XG4gICAgICAgICAgICBtb2RlOiAnb3BlbicsXG4gICAgICAgICAgICAvLyBkZWxlZ2F0ZXNGb2N1czogdHJ1ZVxuICAgICAgICAgICAgLy8gTm90IHdvcmtpbmcgb24gSVBhZCBzbyB3ZSBkbyBhbiB3b3JrYXJvdW5kXG4gICAgICAgICAgICAvLyBieSBzZXR0aW5nIFwiZm9jdXNlZFwiIGF0dHJpYnV0ZSB3aGVuIG5lZWRlZC5cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9pc0Nvbm5lY3RlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9pbnNlcnRUZW1wbGF0ZSgpO1xuXG4gICAgICAgIHRoaXMuY29ubmVjdGVkQ2FsbGJhY2sgPSB0aGlzLmNvbm5lY3RlZENhbGxiYWNrLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuZGlzY29ubmVjdGVkQ2FsbGJhY2sgPSB0aGlzLmRpc2Nvbm5lY3RlZENhbGxiYWNrLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuX2hhbmRsZUxvY2FsZUNoYW5nZSA9IHRoaXMuX2hhbmRsZUxvY2FsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm9uTG9jYWxlQ2hhbmdlICYmICh0aGlzLm9uTG9jYWxlQ2hhbmdlID0gdGhpcy5vbkxvY2FsZUNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy51bnJlZ2lzdGVyTG9jYWxlQ2hhbmdlID0gbnVsbDtcblxuICAgICAgICAvLyBwcm92aWRlIHN1cHBvcnQgZm9yIHRyYWl0cyBpZiBhbnkgYXMgdGhleSBjYW50IG92ZXJyaWRlIGNvbnN0cnVjdG9yXG4gICAgICAgIHRoaXMuaW5pdCAmJiB0aGlzLmluaXQoLi4uYXJncyk7XG4gICAgICB9XG5cbiAgICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL3dlYi9mdW5kYW1lbnRhbHMvd2ViLWNvbXBvbmVudHMvYmVzdC1wcmFjdGljZXMjbGF6eS1wcm9wZXJ0aWVzXG4gICAgICAvLyBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS93ZWIvZnVuZGFtZW50YWxzL3dlYi1jb21wb25lbnRzL2V4YW1wbGVzL2hvd3RvLWNoZWNrYm94XG4gICAgICAvKiBlc2xpbnQgbm8tcHJvdG90eXBlLWJ1aWx0aW5zOiAwICovXG4gICAgICBfdXBncmFkZVByb3BlcnR5KHByb3ApIHtcbiAgICAgICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhgdXBncmFkaW5nIHByb3BlcnR5ICR7cHJvcH0gZm9yICR7dGhpcy5nZXRBdHRyaWJ1dGUoJ25hbWUnKX1gKTtcbiAgICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXNbcHJvcF07XG4gICAgICAgICAgZGVsZXRlIHRoaXNbcHJvcF07XG4gICAgICAgICAgdGhpc1twcm9wXSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIF9kZWZpbmVQcm9wZXJ0eShrZXksIHZhbHVlKSB7XG4gICAgICAgIGlmICghdGhpcy5oYXNBdHRyaWJ1dGUoa2V5KSkge1xuICAgICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKGtleSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgICB0aGlzLl9pc0Nvbm5lY3RlZCA9IHRydWU7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdiZWZvcmV1bmxvYWQnLCB0aGlzLmRpc2Nvbm5lY3RlZENhbGxiYWNrLCBmYWxzZSk7XG4gICAgICAgIHRoaXMudW5yZWdpc3RlckxvY2FsZUNoYW5nZSA9XG4gICAgICAgICAgTG9jYWxlU2VydmljZS5vbkxvY2FsZUNoYW5nZSh0aGlzLl9oYW5kbGVMb2NhbGVDaGFuZ2UpO1xuICAgICAgICBjb25zdCB7IHByb3BlcnRpZXNUb1VwZ3JhZGUsIHByb3BlcnRpZXNUb0RlZmluZSB9ID0gdGhpcy5jb25zdHJ1Y3RvcjtcbiAgICAgICAgcHJvcGVydGllc1RvVXBncmFkZS5mb3JFYWNoKChwcm9wZXJ0eSkgPT4ge1xuICAgICAgICAgIHRoaXMuX3VwZ3JhZGVQcm9wZXJ0eShwcm9wZXJ0eSk7XG4gICAgICAgIH0pO1xuICAgICAgICBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzVG9EZWZpbmUpLmZvckVhY2goKHByb3BlcnR5KSA9PiB7XG4gICAgICAgICAgdGhpcy5fZGVmaW5lUHJvcGVydHkocHJvcGVydHksIHByb3BlcnRpZXNUb0RlZmluZVtwcm9wZXJ0eV0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHRoaXMuX2lzQ29ubmVjdGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMudW5yZWdpc3RlckxvY2FsZUNoYW5nZSgpO1xuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignYmVmb3JldW5sb2FkJywgdGhpcy5kaXNjb25uZWN0ZWRDYWxsYmFjaywgZmFsc2UpO1xuICAgICAgfVxuXG4gICAgICBnZXQgY2hpbGRyZW5UcmVlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci51c2VTaGFkb3cgPyB0aGlzLnNoYWRvd1Jvb3QgOiB0aGlzO1xuICAgICAgfVxuXG4gICAgICBfaW5zZXJ0VGVtcGxhdGUoKSB7XG4gICAgICAgIGNvbnN0IHsgdGVtcGxhdGUgfSA9IHRoaXMuY29uc3RydWN0b3I7XG5cbiAgICAgICAgaWYgKHRlbXBsYXRlKSB7XG4gICAgICAgICAgdGhpcy5jaGlsZHJlblRyZWUuYXBwZW5kQ2hpbGQodGVtcGxhdGUuY29udGVudC5jbG9uZU5vZGUodHJ1ZSkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIF9oYW5kbGVMb2NhbGVDaGFuZ2UobG9jYWxlKSB7XG4gICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdkaXInLCBsb2NhbGUuZGlyKTtcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2xhbmcnLCBsb2NhbGUubGFuZyk7XG4gICAgICAgIHRoaXMub25Mb2NhbGVDaGFuZ2UgJiYgdGhpcy5vbkxvY2FsZUNoYW5nZShsb2NhbGUpO1xuICAgICAgfVxuXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyhrbGFzcykge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGtsYXNzLCAnY29tcG9uZW50U3R5bGUnLCB7XG4gICAgICAgIGdldCgpIHtcbiAgICAgICAgICByZXR1cm4ga2xhc3MudGVtcGxhdGUuY29udGVudC5xdWVyeVNlbGVjdG9yKCdzdHlsZScpLmlubmVySFRNTDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0KHZhbHVlKSB7XG4gICAgICAgICAga2xhc3MudGVtcGxhdGUuY29udGVudC5xdWVyeVNlbGVjdG9yKCdzdHlsZScpLmlubmVySFRNTCA9IHZhbHVlO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9KTtcblxuICAgICAga2xhc3MucmVnaXN0ZXJTZWxmID0gKCkgPT4ge1xuICAgICAgICBjb25zdCByZWdpc3RyYXRpb25OYW1lID0ga2xhc3MucmVnaXN0cmF0aW9uTmFtZTtcbiAgICAgICAgY29uc3QgZGVwZW5kZW5jaWVzID0ga2xhc3MuZGVwZW5kZW5jaWVzO1xuICAgICAgICAvLyBNYWtlIHN1cmUgb3VyIGRlcGVuZGVuY2llcyBhcmUgcmVnaXN0ZXJlZCBiZWZvcmUgd2UgcmVnaXN0ZXIgc2VsZlxuICAgICAgICBkZXBlbmRlbmNpZXMuZm9yRWFjaCgoZGVwZW5kZW5jeSkgPT4gZGVwZW5kZW5jeS5yZWdpc3RlclNlbGYoKSk7XG4gICAgICAgIC8vIERvbid0IHRyeSB0byByZWdpc3RlciBzZWxmIGlmIGFscmVhZHkgcmVnaXN0ZXJlZFxuICAgICAgICBpZiAoY3VzdG9tRWxlbWVudHMuZ2V0KHJlZ2lzdHJhdGlvbk5hbWUpKSByZXR1cm4gcmVnaXN0cmF0aW9uTmFtZTtcbiAgICAgICAgLy8gR2l2ZSBhIGNoYW5jZSB0byBvdmVycmlkZSB3ZWItY29tcG9uZW50IHN0eWxlIGlmIHByb3ZpZGVkIGJlZm9yZSBiZWluZyByZWdpc3RlcmVkLlxuICAgICAgICBjb25zdCBjb21wb25lbnRTdHlsZSA9ICgod2luLkRCVUlXZWJDb21wb25lbnRzIHx8IHt9KVtyZWdpc3RyYXRpb25OYW1lXSB8fCB7fSkuY29tcG9uZW50U3R5bGU7XG4gICAgICAgIGlmIChjb21wb25lbnRTdHlsZSkge1xuICAgICAgICAgIGtsYXNzLmNvbXBvbmVudFN0eWxlICs9IGNvbXBvbmVudFN0eWxlO1xuICAgICAgICB9XG4gICAgICAgIC8vIERvIHJlZ2lzdHJhdGlvblxuICAgICAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUocmVnaXN0cmF0aW9uTmFtZSwga2xhc3MpO1xuICAgICAgICByZXR1cm4gcmVnaXN0cmF0aW9uTmFtZTtcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBrbGFzcztcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgREJVSVdlYkNvbXBvbmVudEJhc2UsXG4gICAgICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzXG4gICAgfTtcbiAgfSk7XG59XG4iLCJcbmltcG9ydCBnZXREQlVJV2ViQ29tcG9uZW50QmFzZSBmcm9tICcuLi9EQlVJV2ViQ29tcG9uZW50QmFzZS9EQlVJV2ViQ29tcG9uZW50QmFzZSc7XG5pbXBvcnQgZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uIGZyb20gJy4uL2ludGVybmFscy9lbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24nO1xuXG5jb25zdCByZWdpc3RyYXRpb25OYW1lID0gJ2RidWktd2ViLWNvbXBvbmVudC1kdW1teSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldERCVUlXZWJDb21wb25lbnREdW1teSh3aW4pIHtcbiAgcmV0dXJuIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbih3aW4sIHJlZ2lzdHJhdGlvbk5hbWUsICgpID0+IHtcbiAgICBjb25zdCB7IERCVUlXZWJDb21wb25lbnRCYXNlLCBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzIH0gPSBnZXREQlVJV2ViQ29tcG9uZW50QmFzZSh3aW4pO1xuICAgIGNvbnN0IHsgZG9jdW1lbnQgfSA9IHdpbjtcblxuICAgIGNvbnN0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBgXG4gICAgICA8c3R5bGU+XG4gICAgICA6aG9zdCB7XG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIG1heC13aWR0aDogNDAwcHg7XG4gICAgICAgIGhlaWdodDogdmFyKC0tZGJ1aS1pbnB1dC1oZWlnaHQsIDUwcHgpO1xuICAgICAgICBjb2xvcjogbWFyb29uO1xuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCBncmF5O1xuICAgICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgICAgfVxuICAgICAgXG4gICAgICA6aG9zdCBiLCA6aG9zdCBkaXZbeC1oYXMtc2xvdF0gc3Bhblt4LXNsb3Qtd3JhcHBlcl0ge1xuICAgICAgICB1bmljb2RlLWJpZGk6IGJpZGktb3ZlcnJpZGU7XG4gICAgICAgIHRleHQtc2hhZG93OiB2YXIoLS1kdW1teS1iLXRleHQtc2hhZG93LCBub25lKTtcbiAgICAgIH1cblxuICAgICAgOmhvc3QoW2Rpcj1ydGxdKSBiIHtcbiAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XG4gICAgICB9XG4gICAgICBcbiAgICAgIDpob3N0KFtkaXI9bHRyXSkgYiB7XG4gICAgICAgIHRleHQtZGVjb3JhdGlvbjogb3ZlcmxpbmU7XG4gICAgICB9XG5cbiAgICAgIDpob3N0KFtkaXI9bHRyXSkgI2NvbnRhaW5lciA+IGRpdltkaXI9cnRsXSxcbiAgICAgIDpob3N0KFtkaXI9cnRsXSkgI2NvbnRhaW5lciA+IGRpdltkaXI9bHRyXSB7XG4gICAgICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgICB9XG4gICAgICBcbiAgICAgIDpob3N0ICNjb250YWluZXIgPiBkaXZbeC1oYXMtc2xvdF0ge1xuICAgICAgICBtYXJnaW4tbGVmdDogMHB4O1xuICAgICAgfVxuICAgICAgXG4gICAgICAjY29udGFpbmVyIHtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIGhlaWdodDogMTAwJTtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1mbG93OiByb3cgbm93cmFwO1xuICAgICAgICBhbGlnbi1pdGVtczogc3RyZXRjaDtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgI2NvbnRhaW5lciA+IGRpdiB7XG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIGdyYXk7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IHZhcigtLWR1bW15LWlubmVyLXNlY3Rpb25zLWJvcmRlci1yYWRpdXMsIDBweCk7XG4gICAgICAgIGZsZXg6IDEgMCAwJTtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgbWFyZ2luOiA1cHg7XG4gICAgICB9XG4gICAgICBcbiAgICAgICNjb250YWluZXIgPiBkaXYgPiBkaXYge1xuICAgICAgICBtYXJnaW46IGF1dG87XG4gICAgICB9XG4gICAgICBcbiAgICAgIDwvc3R5bGU+XG4gICAgICBcbiAgICAgIDxkaXYgaWQ9XCJjb250YWluZXJcIj5cbiAgICAgICAgPGRpdiBkaXI9XCJsdHJcIj5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGI+RHVtbXkgc2hhZG93PC9iPiBbTFRSXVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgXG4gICAgICAgIDxkaXYgeC1oYXMtc2xvdD5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPHNwYW4+Wzwvc3Bhbj48c3BhbiB4LXNsb3Qtd3JhcHBlcj48c2xvdD48L3Nsb3Q+PC9zcGFuPjxzcGFuPl08L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICBcbiAgICAgICAgPGRpdiBkaXI9XCJydGxcIj5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGI+RHVtbXkgc2hhZG93PC9iPiBbUlRMXVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIGA7XG5cbiAgICBjbGFzcyBEQlVJV2ViQ29tcG9uZW50RHVtbXkgZXh0ZW5kcyBEQlVJV2ViQ29tcG9uZW50QmFzZSB7XG4gICAgICBzdGF0aWMgZ2V0IHJlZ2lzdHJhdGlvbk5hbWUoKSB7XG4gICAgICAgIHJldHVybiByZWdpc3RyYXRpb25OYW1lO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlKCkge1xuICAgICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgICB9XG5cbiAgICAgIG9uTG9jYWxlQ2hhbmdlKGxvY2FsZSkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnb25Mb2NhbGVDaGFuZ2UnLCBsb2NhbGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMoREJVSVdlYkNvbXBvbmVudER1bW15KTtcblxuICAgIHJldHVybiBEQlVJV2ViQ29tcG9uZW50RHVtbXk7XG4gIH0pO1xufVxuXG5nZXREQlVJV2ViQ29tcG9uZW50RHVtbXkucmVnaXN0cmF0aW9uTmFtZSA9IHJlZ2lzdHJhdGlvbk5hbWU7XG5cbiIsIlxuXG5pbXBvcnQgZ2V0REJVSVdlYkNvbXBvbmVudEJhc2UgZnJvbSAnLi4vREJVSVdlYkNvbXBvbmVudEJhc2UvREJVSVdlYkNvbXBvbmVudEJhc2UnO1xuaW1wb3J0IGdldERCVUlXZWJDb21wb25lbnREdW1teSBmcm9tICcuLi9EQlVJV2ViQ29tcG9uZW50RHVtbXkvREJVSVdlYkNvbXBvbmVudER1bW15JztcbmltcG9ydCBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24gZnJvbSAnLi4vaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbic7XG5cbmNvbnN0IHJlZ2lzdHJhdGlvbk5hbWUgPSAnZGJ1aS13ZWItY29tcG9uZW50LWR1bW15LXBhcmVudCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldERCVUlXZWJDb21wb25lbnREdW1teVBhcmVudCh3aW4pIHtcbiAgcmV0dXJuIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbih3aW4sIHJlZ2lzdHJhdGlvbk5hbWUsICgpID0+IHtcbiAgICBjb25zdCB7IERCVUlXZWJDb21wb25lbnRCYXNlLCBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzIH0gPSBnZXREQlVJV2ViQ29tcG9uZW50QmFzZSh3aW4pO1xuICAgIGNvbnN0IERCVUlXZWJDb21wb25lbnREdW1teSA9IGdldERCVUlXZWJDb21wb25lbnREdW1teSh3aW4pO1xuXG4gICAgY29uc3QgeyBkb2N1bWVudCB9ID0gd2luO1xuXG4gICAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IGBcbiAgICAgIDxzdHlsZT5cbiAgICAgIDpob3N0IHtcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgbWF4LXdpZHRoOiA0MDBweDtcbiAgICAgIH1cbiAgICAgIDwvc3R5bGU+XG4gICAgICA8ZGl2PlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxiPkR1bW15IFBhcmVudCBzaGFkb3c8L2I+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxkYnVpLXdlYi1jb21wb25lbnQtZHVtbXk+PHNsb3Q+PC9zbG90PjwvZGJ1aS13ZWItY29tcG9uZW50LWR1bW15PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIGA7XG5cbiAgICBjbGFzcyBEQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQgZXh0ZW5kcyBEQlVJV2ViQ29tcG9uZW50QmFzZSB7XG4gICAgICBzdGF0aWMgZ2V0IHJlZ2lzdHJhdGlvbk5hbWUoKSB7XG4gICAgICAgIHJldHVybiByZWdpc3RyYXRpb25OYW1lO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlKCkge1xuICAgICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgZGVwZW5kZW5jaWVzKCkge1xuICAgICAgICByZXR1cm4gW0RCVUlXZWJDb21wb25lbnREdW1teV07XG4gICAgICB9XG5cbiAgICB9XG5cbiAgICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzKERCVUlXZWJDb21wb25lbnREdW1teVBhcmVudCk7XG5cbiAgICByZXR1cm4gREJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50O1xuICB9KTtcbn1cblxuZ2V0REJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50LnJlZ2lzdHJhdGlvbk5hbWUgPSByZWdpc3RyYXRpb25OYW1lO1xuXG4iLCJcbmltcG9ydCBnZXREQlVJV2ViQ29tcG9uZW50QmFzZSBmcm9tICcuLi9EQlVJV2ViQ29tcG9uZW50QmFzZS9EQlVJV2ViQ29tcG9uZW50QmFzZSc7XG5pbXBvcnQgZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uIGZyb20gJy4uL2ludGVybmFscy9lbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24nO1xuaW1wb3J0IEZvY3VzYWJsZSBmcm9tICcuLi9iZWhhdmlvdXJzL0ZvY3VzYWJsZSc7XG5cbmNvbnN0IHJlZ2lzdHJhdGlvbk5hbWUgPSAnZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtdGV4dCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldERCVUlXZWJDb21wb25lbnRGb3JtSW5wdXRUZXh0KHdpbikge1xuICByZXR1cm4gZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uKHdpbiwgcmVnaXN0cmF0aW9uTmFtZSwgKCkgPT4ge1xuICAgIGNvbnN0IHsgREJVSVdlYkNvbXBvbmVudEJhc2UsIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMgfSA9IGdldERCVUlXZWJDb21wb25lbnRCYXNlKHdpbik7XG4gICAgY29uc3QgeyBkb2N1bWVudCB9ID0gd2luO1xuXG4gICAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IGBcbiAgICAgIDxzdHlsZT5cbiAgICAgIDpob3N0IHtcbiAgICAgICAgYWxsOiBpbml0aWFsOyBcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgLypoZWlnaHQ6IHZhcigtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWhlaWdodCk7Ki9cbiAgICAgICAgLypsaW5lLWhlaWdodDogdmFyKC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtaGVpZ2h0KTsqL1xuICAgICAgICBoZWlnaHQ6IDIwMHB4O1xuICAgICAgICBwYWRkaW5nOiAwcHg7XG4gICAgICAgIGZvbnQtc2l6ZTogMThweDtcbiAgICAgICAgY29sb3I6IHZhcigtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWNvbG9yKTtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtYmFja2dyb3VuZC1jb2xvcik7XG4gICAgICAgIHVuaWNvZGUtYmlkaTogYmlkaS1vdmVycmlkZTtcbiAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAgICAgYm9yZGVyOiBub25lO1xuICAgICAgICBib3JkZXItYm90dG9tOiB2YXIoLS1kYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC1ib3JkZXItd2lkdGgpIHZhcigtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWJvcmRlci1zdHlsZSkgdmFyKC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtYm9yZGVyLWNvbG9yKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgOmhvc3QgW3RhYmluZGV4XSB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBoZWlnaHQ6IDUwcHg7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiA1MHB4O1xuICAgICAgICBib3JkZXI6IG5vbmU7XG4gICAgICAgIG1hcmdpbjogMHB4O1xuICAgICAgICBwYWRkaW5nOiAwcHg7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICAgICAgICBib3JkZXItcmFkaXVzOiAwcHg7XG4gICAgICB9XG4gICAgICBcbiAgICAgIDpob3N0IFt0YWJpbmRleF06Zm9jdXMge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMCwgMCwgLjMpO1xuICAgICAgICBvdXRsaW5lOiBub25lO1xuICAgICAgfVxuXG4gICAgICA6aG9zdChbZm9jdXNlZF0pIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAyNTUsIDAsIC4zKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgOmhvc3QoW2Rpc2FibGVkXSkge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIC4zKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgOmhvc3QoW2hpZGRlbl0pIHtcbiAgICAgICAgZGlzcGxheTogbm9uZTtcbiAgICAgIH1cblxuICAgICAgOmhvc3QoW2Rpcj1ydGxdKSB7XG4gICAgICBcbiAgICAgIH1cbiAgICAgIFxuICAgICAgOmhvc3QoW2Rpcj1sdHJdKSB7XG4gICAgICBcbiAgICAgIH1cbiAgICAgIDwvc3R5bGU+XG4gICAgICA8ZGl2IGNvbnRlbnRlZGl0YWJsZT1cInRydWVcIiB0YWJpbmRleD1cIjBcIj48L2Rpdj5cbiAgICAgIDxkaXYgY29udGVudGVkaXRhYmxlPVwidHJ1ZVwiIHRhYmluZGV4PVwiMFwiPjwvZGl2PlxuICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgdGFiaW5kZXg9XCIwXCIgLz5cbiAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIHRhYmluZGV4PVwiMFwiIC8+XG4gICAgYDtcblxuICAgIGNsYXNzIERCVUlXZWJDb21wb25lbnRGb3JtSW5wdXRUZXh0IGV4dGVuZHMgREJVSVdlYkNvbXBvbmVudEJhc2Uge1xuICAgICAgc3RhdGljIGdldCByZWdpc3RyYXRpb25OYW1lKCkge1xuICAgICAgICByZXR1cm4gcmVnaXN0cmF0aW9uTmFtZTtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IHByb3BlcnRpZXNUb0RlZmluZSgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICByb2xlOiAnZm9ybS1pbnB1dCdcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgLy8gb25Mb2NhbGVDaGFuZ2UobG9jYWxlKSB7XG4gICAgICAvLyAgIC8vIGNvbnNvbGUubG9nKCdvbkxvY2FsZUNoYW5nZScsIGxvY2FsZSk7XG4gICAgICAvLyB9XG5cbiAgICB9XG5cbiAgICByZXR1cm4gZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyhcbiAgICAgIEZvY3VzYWJsZShcbiAgICAgICAgREJVSVdlYkNvbXBvbmVudEZvcm1JbnB1dFRleHRcbiAgICAgIClcbiAgICApO1xuXG4gIH0pO1xufVxuXG5nZXREQlVJV2ViQ29tcG9uZW50Rm9ybUlucHV0VGV4dC5yZWdpc3RyYXRpb25OYW1lID0gcmVnaXN0cmF0aW9uTmFtZTtcblxuIiwiaW1wb3J0IGFwcGVuZFN0eWxlIGZyb20gJy4uL2ludGVybmFscy9hcHBlbmRTdHlsZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRidWlXZWJDb21wb25lbnRzU2V0VXAod2luKSB7XG4gIHJldHVybiB7XG4gICAgYXBwZW5kU3R5bGU6IGFwcGVuZFN0eWxlKHdpbilcbiAgfTtcbn1cbiIsIlxuLyoqXG4gKiBXaGVuIGFuIGlubmVyIGZvY3VzYWJsZSBpcyBmb2N1c2VkIChleDogdmlhIGNsaWNrKSB0aGUgZW50aXJlIGNvbXBvbmVudCBnZXRzIGZvY3VzZWQuXG4gKiBXaGVuIHRoZSBjb21wb25lbnQgZ2V0cyBmb2N1c2VkIChleDogdmlhIHRhYikgdGhlIGZpcnN0IGlubmVyIGZvY3VzYWJsZSBnZXRzIGZvY3VzZWQgdG9vLlxuICogV2hlbiB0aGUgY29tcG9uZW50IGdldHMgZGlzYWJsZWQgaXQgZ2V0cyBibHVycmVkIHRvbyBhbmQgYWxsIGlubmVyIGZvY3VzYWJsZXMgZ2V0IGRpc2FibGVkIGFuZCBibHVycmVkLlxuICogV2hlbiBkaXNhYmxlZCB0aGUgY29tcG9uZW50IGNhbm5vdCBiZSBmb2N1c2VkLlxuICogV2hlbiBlbmFibGVkIHRoZSBjb21wb25lbnQgY2FuIGJlIGZvY3VzZWQuXG4gKiBAcGFyYW0gS2xhc3NcbiAqIEByZXR1cm5zIHtGb2N1c2FibGV9XG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRm9jdXNhYmxlKEtsYXNzKSB7XG4gIGNsYXNzIEZvY3VzYWJsZSBleHRlbmRzIEtsYXNzIHtcblxuICAgIC8vIFRPRE86IHBsYXkgd2l0aCBfdXBncmFkZVByb3BlcnR5XG5cbiAgICBzdGF0aWMgZ2V0IHByb3BlcnRpZXNUb0RlZmluZSgpIHtcbiAgICAgIGNvbnN0IGluaGVyaXRlZFByb3BlcnRpZXNUb0RlZmluZSA9IHN1cGVyLnByb3BlcnRpZXNUb0RlZmluZSB8fCB7fTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLmluaGVyaXRlZFByb3BlcnRpZXNUb0RlZmluZSxcbiAgICAgICAgLy8gdGFiaW5kZXggZGVmaW5lcyBmb2N1c2FibGUgYmVoYXZpb3VyXG4gICAgICAgIHRhYmluZGV4OiAwXG4gICAgICB9O1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXQgcHJvcGVydGllc1RvVXBncmFkZSgpIHtcbiAgICAgIGNvbnN0IGluaGVyaXRlZFByb3BlcnRpZXNUb1VwZ3JhZGUgPSBzdXBlci5wcm9wZXJ0aWVzVG9VcGdyYWRlIHx8IFtdO1xuICAgICAgcmV0dXJuIFsuLi5pbmhlcml0ZWRQcm9wZXJ0aWVzVG9VcGdyYWRlLCAnZm9jdXNlZCcsICdkaXNhYmxlZCddO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCkge1xuICAgICAgY29uc3QgaW5oZXJpdGVkT2JzZXJ2ZWRBdHRyaWJ1dGVzID0gc3VwZXIub2JzZXJ2ZWRBdHRyaWJ1dGVzIHx8IFtdO1xuICAgICAgcmV0dXJuIFsuLi5pbmhlcml0ZWRPYnNlcnZlZEF0dHJpYnV0ZXMsICdmb2N1c2VkJywgJ2Rpc2FibGVkJ107XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgICAgc3VwZXIoLi4uYXJncyk7XG5cbiAgICAgIHRoaXMuX2N1cnJlbnRJbm5lckZvY3VzZWQgPSBudWxsO1xuICAgICAgdGhpcy5fb25Jbm5lckZvY3VzYWJsZUZvY3VzZWQgPSB0aGlzLl9vbklubmVyRm9jdXNhYmxlRm9jdXNlZC5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5fb25Gb2N1cyA9IHRoaXMuX29uRm9jdXMuYmluZCh0aGlzKTtcbiAgICAgIHRoaXMuX29uQmx1ciA9IHRoaXMuX29uQmx1ci5iaW5kKHRoaXMpO1xuICAgIH1cblxuICAgIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpIHtcbiAgICAgIHN1cGVyLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayAmJlxuICAgICAgICBzdXBlci5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlKTtcblxuICAgICAgY29uc3QgaGFzVmFsdWUgPSBuZXdWYWx1ZSAhPT0gbnVsbDtcbiAgICAgIGlmIChuYW1lID09PSAnZm9jdXNlZCcpIHtcbiAgICAgICAgLy8gVGhlIGJyb3dzZXIgbWlnaHQgZGVjaWRlIHRvIG5vdCBhcHBseSBmb2N1cyB3aXRob3V0IHVzZXIgaW50ZXJhY3Rpb24uXG4gICAgICAgIC8vIGV4OiBvbiBJUGFkXG4gICAgICAgIGhhc1ZhbHVlID8gdGhpcy5fYXBwbHlGb2N1c1NpZGVFZmZlY3RzKCkgOiB0aGlzLl9hcHBseUJsdXJTaWRlRWZmZWN0cygpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgc3VwZXIuY29ubmVjdGVkQ2FsbGJhY2sgJiZcbiAgICAgICAgc3VwZXIuY29ubmVjdGVkQ2FsbGJhY2soKTtcblxuICAgICAgLy8gd2hlbiBjb21wb25lbnQgZm9jdXNlZC9ibHVycmVkXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdGhpcy5fb25Gb2N1cyk7XG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCB0aGlzLl9vbkJsdXIpO1xuXG4gICAgICB0aGlzLl9pbm5lckZvY3VzYWJsZXMuZm9yRWFjaCgoZm9jdXNhYmxlKSA9PiB7XG4gICAgICAgIC8vIHdoZW4gaW5uZXIgZm9jdXNhYmxlIGZvY3VzZWRcbiAgICAgICAgZm9jdXNhYmxlLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdGhpcy5fb25Jbm5lckZvY3VzYWJsZUZvY3VzZWQpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICBzdXBlci5kaXNjb25uZWN0ZWRDYWxsYmFjayAmJlxuICAgICAgICBzdXBlci5kaXNjb25uZWN0ZWRDYWxsYmFjaygpO1xuXG4gICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdGhpcy5fb25Gb2N1cyk7XG4gICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2JsdXInLCB0aGlzLl9vbkJsdXIpO1xuXG4gICAgICB0aGlzLl9pbm5lckZvY3VzYWJsZXMuZm9yRWFjaCgoZm9jdXNhYmxlKSA9PiB7XG4gICAgICAgIGZvY3VzYWJsZS5yZW1vdmVFdmVudExpc3RlbmVyKCdmb2N1cycsIHRoaXMuX29uSW5uZXJGb2N1c2FibGVGb2N1c2VkKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldCBmb2N1c2VkKCkge1xuICAgICAgcmV0dXJuIHRoaXMuaGFzQXR0cmlidXRlKCdmb2N1c2VkJyk7XG4gICAgfVxuXG4gICAgLy8ga2VlcCB0aGlzIGdlbmVyaWMgKHNvIHdlIGNhbiBwdXQgaXQgaW4gYmFzZSBjbGFzcyksIGRvIG5vdCBhZGQgY3VzdG9tIGxvZ2ljXG4gICAgc2V0IGZvY3VzZWQodmFsdWUpIHtcbiAgICAgIGNvbnN0IGhhc1ZhbHVlID0gQm9vbGVhbih2YWx1ZSk7XG4gICAgICBpZiAoaGFzVmFsdWUpIHtcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2ZvY3VzZWQnLCAnJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgnZm9jdXNlZCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGdldCBkaXNhYmxlZCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmhhc0F0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgICB9XG5cbiAgICAvLyBrZWVwIHRoaXMgZ2VuZXJpYyAoc28gd2UgY2FuIHB1dCBpdCBpbiBiYXNlIGNsYXNzKSwgZG8gbm90IGFkZCBjdXN0b20gbG9naWNcbiAgICBzZXQgZGlzYWJsZWQodmFsdWUpIHtcbiAgICAgIGNvbnN0IGhhc1ZhbHVlID0gQm9vbGVhbih2YWx1ZSk7XG4gICAgICBpZiAoaGFzVmFsdWUpIHtcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJycpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IF9pbm5lckZvY3VzYWJsZXMoKSB7XG4gICAgICByZXR1cm4gdGhpcy5jaGlsZHJlblRyZWUucXVlcnlTZWxlY3RvckFsbCgnW3RhYmluZGV4XScpIHx8IFtdO1xuICAgIH1cblxuICAgIGdldCBfZmlyc3RJbm5lckZvY3VzYWJsZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuVHJlZS5xdWVyeVNlbGVjdG9yKCdbdGFiaW5kZXhdJyk7XG4gICAgfVxuXG4gICAgX29uSW5uZXJGb2N1c2FibGVGb2N1c2VkKGV2dCkge1xuICAgICAgdGhpcy5fY3VycmVudElubmVyRm9jdXNlZCA9IGV2dC50YXJnZXQ7XG4gICAgfVxuXG4gICAgX29uRm9jdXMoKSB7XG4gICAgICBpZiAoIXRoaXMuZm9jdXNlZCkge1xuICAgICAgICB0aGlzLmZvY3VzZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9vbkJsdXIoKSB7XG4gICAgICBpZiAodGhpcy5mb2N1c2VkKSB7XG4gICAgICAgIHRoaXMuZm9jdXNlZCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9hcHBseUZvY3VzU2lkZUVmZmVjdHMoKSB7XG4gICAgICBpZiAodGhpcy5fY3VycmVudElubmVyRm9jdXNlZCkge1xuICAgICAgICAvLyBTb21lIGlubmVyIGNvbXBvbmVudCBpcyBhbHJlYWR5IGZvY3VzZWQuXG4gICAgICAgIC8vIE5vIG5lZWQgdG8gc2V0IGZvY3VzIG9uIGFueXRoaW5nLlxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLl9mb2N1c0ZpcnN0SW5uZXJGb2N1c2FibGUoKTtcbiAgICB9XG5cbiAgICBfYXBwbHlCbHVyU2lkZUVmZmVjdHMoKSB7XG4gICAgICBpZiAodGhpcy5fY3VycmVudElubmVyRm9jdXNlZCkge1xuICAgICAgICB0aGlzLl9jdXJyZW50SW5uZXJGb2N1c2VkLmJsdXIoKTtcbiAgICAgICAgdGhpcy5fY3VycmVudElubmVyRm9jdXNlZCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2ZvY3VzRmlyc3RJbm5lckZvY3VzYWJsZSgpIHtcbiAgICAgIGNvbnN0IGZpcnN0SW5uZXJGb2N1c2FibGUgPSB0aGlzLl9maXJzdElubmVyRm9jdXNhYmxlO1xuICAgICAgaWYgKGZpcnN0SW5uZXJGb2N1c2FibGUpIHtcbiAgICAgICAgdGhpcy5fY3VycmVudElubmVyRm9jdXNlZCA9IGZpcnN0SW5uZXJGb2N1c2FibGU7XG4gICAgICAgIGZpcnN0SW5uZXJGb2N1c2FibGUuZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBGb2N1c2FibGUub3JpZ2luYWxOYW1lID0gS2xhc3MubmFtZTtcbiAgcmV0dXJuIEZvY3VzYWJsZTtcbn1cbiIsIi8qXG5EQlVJV2ViQ29tcG9uZW50QmFzZSAoZnJvbSB3aGljaCBhbGwgd2ViLWNvbXBvbmVudHMgaW5oZXJpdClcbndpbGwgcmVhZCBjb21wb25lbnRTdHlsZSBmcm9tIHdpbi5EQlVJV2ViQ29tcG9uZW50c1xud2hlbiBrbGFzcy5yZWdpc3RlclNlbGYoKSBpcyBjYWxsZWQgZ2l2aW5nIGEgY2hhbmNlIHRvIG92ZXJyaWRlIGRlZmF1bHQgd2ViLWNvbXBvbmVudCBzdHlsZVxuanVzdCBiZWZvcmUgaXQgaXMgcmVnaXN0ZXJlZC5cbiovXG5jb25zdCBhcHBlbmRTdHlsZSA9ICh3aW4pID0+IChyZWdpc3RyYXRpb25OYW1lLCBjb21wb25lbnRTdHlsZSkgPT4ge1xuICBpZiAoIXdpbi5EQlVJV2ViQ29tcG9uZW50cykge1xuICAgIHdpbi5EQlVJV2ViQ29tcG9uZW50cyA9IHt9O1xuICB9XG4gIHdpbi5EQlVJV2ViQ29tcG9uZW50cyA9IHtcbiAgICAuLi53aW4uREJVSVdlYkNvbXBvbmVudHMsXG4gICAgW3JlZ2lzdHJhdGlvbk5hbWVdOiB7XG4gICAgICAuLi53aW4uREJVSVdlYkNvbXBvbmVudHNbcmVnaXN0cmF0aW9uTmFtZV0sXG4gICAgICBjb21wb25lbnRTdHlsZVxuICAgIH1cbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFwcGVuZFN0eWxlO1xuIiwiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbih3aW4sIG5hbWUsIGNhbGxiYWNrKSB7XG4gIGlmICghd2luLkRCVUlXZWJDb21wb25lbnRzKSB7XG4gICAgd2luLkRCVUlXZWJDb21wb25lbnRzID0geyByZWdpc3RyYXRpb25zOiB7fSB9O1xuICB9IGVsc2UgaWYgKCF3aW4uREJVSVdlYkNvbXBvbmVudHMucmVnaXN0cmF0aW9ucykge1xuICAgIHdpbi5EQlVJV2ViQ29tcG9uZW50cy5yZWdpc3RyYXRpb25zID0ge307XG4gIH1cblxuICBsZXQgcmVnaXN0cmF0aW9uID0gd2luLkRCVUlXZWJDb21wb25lbnRzLnJlZ2lzdHJhdGlvbnNbbmFtZV07XG5cbiAgaWYgKHJlZ2lzdHJhdGlvbikgcmV0dXJuIHJlZ2lzdHJhdGlvbjtcblxuICByZWdpc3RyYXRpb24gPSBjYWxsYmFjaygpO1xuICB3aW4uREJVSVdlYkNvbXBvbmVudHMucmVnaXN0cmF0aW9uc1tuYW1lXSA9IHJlZ2lzdHJhdGlvbjtcblxuICByZXR1cm4gd2luLkRCVUlXZWJDb21wb25lbnRzLnJlZ2lzdHJhdGlvbnNbbmFtZV07XG59XG5cbiIsIlxuaW1wb3J0IGRidWlXZWJDb21wb25lbnRzU2V0VXAgZnJvbSAnLi9EQlVJV2ViQ29tcG9uZW50c1NldHVwL0RCVUlXZWJDb21wb25lbnRzU2V0dXAnO1xuaW1wb3J0IGdldERCVUlXZWJDb21wb25lbnREdW1teSBmcm9tICcuL0RCVUlXZWJDb21wb25lbnREdW1teS9EQlVJV2ViQ29tcG9uZW50RHVtbXknO1xuaW1wb3J0IGdldERCVUlXZWJDb21wb25lbnREdW1teVBhcmVudCBmcm9tICcuL0RCVUlXZWJDb21wb25lbnREdW1teVBhcmVudC9EQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQnO1xuaW1wb3J0IGdldERCVUlXZWJDb21wb25lbnRGb3JtSW5wdXRUZXh0IGZyb20gJy4vREJVSVdlYkNvbXBvbmVudEZvcm1JbnB1dFRleHQvREJVSVdlYkNvbXBvbmVudEZvcm1JbnB1dFRleHQnO1xuXG5jb25zdCByZWdpc3RyYXRpb25zID0ge1xuICBbZ2V0REJVSVdlYkNvbXBvbmVudER1bW15LnJlZ2lzdHJhdGlvbk5hbWVdOlxuICAgIGdldERCVUlXZWJDb21wb25lbnREdW1teSxcbiAgW2dldERCVUlXZWJDb21wb25lbnREdW1teVBhcmVudC5yZWdpc3RyYXRpb25OYW1lXTpcbiAgICBnZXREQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQsXG4gIFtnZXREQlVJV2ViQ29tcG9uZW50Rm9ybUlucHV0VGV4dC5yZWdpc3RyYXRpb25OYW1lXTpcbiAgICBnZXREQlVJV2ViQ29tcG9uZW50Rm9ybUlucHV0VGV4dCxcbn07XG5cbi8qXG5Vc2luZyB0aGlzIGZ1bmN0aW9uIGltcGxpZXMgZW50aXJlIERCVUlXZWJDb21wb25lbnRzIGxpYnJhcnlcbmlzIGFscmVhZHkgbG9hZGVkLlxuSXQgaXMgdXNlZnVsIGVzcGVjaWFsbHkgd2hlbiB3b3JraW5nIHdpdGggZGlzdHJpYnV0aW9uIGJ1aWxkLlxuSWYgeW91IHdhbnQgdG8gbG9hZCBqdXN0IG9uZSB3ZWItY29tcG9uZW50IG9yIGEgc3Vic2V0IG9mIHdlYi1jb21wb25lbnRzXG5sb2FkIHRoZW0gZnJvbSBub2RlX21vZHVsZXMgYnkgdGhlaXIgcGF0aFxuZXg6XG5pbXBvcnQgU29tZUNvbXBvbmVudExvYWRlciBmcm9tIG5vZGVfbW9kdWxlcy9kZXYtYm94LXVpL2J1aWxkL3NyYy9saWIvd2ViY29tcG9uZW50cy9Tb21lQ29tcG9uZW50O1xuKi9cbmZ1bmN0aW9uIHF1aWNrU2V0dXBBbmRMb2FkKHdpbiA9IHdpbmRvdykge1xuICByZXR1cm4gZnVuY3Rpb24gKGNvbXBvbmVudHMpIHtcbiAgICBjb25zdCByZXQgPSB7fTtcbiAgICBjb21wb25lbnRzLmZvckVhY2goKHsgcmVnaXN0cmF0aW9uTmFtZSwgY29tcG9uZW50U3R5bGUgfSkgPT4ge1xuICAgICAgZGJ1aVdlYkNvbXBvbmVudHNTZXRVcCh3aW4pLmFwcGVuZFN0eWxlKHJlZ2lzdHJhdGlvbk5hbWUsIGNvbXBvbmVudFN0eWxlKTtcbiAgICAgIGNvbnN0IGNvbXBvbmVudENsYXNzID0gcmVnaXN0cmF0aW9uc1tyZWdpc3RyYXRpb25OYW1lXSh3aW5kb3cpO1xuICAgICAgY29tcG9uZW50Q2xhc3MucmVnaXN0ZXJTZWxmKCk7XG4gICAgICByZXRbcmVnaXN0cmF0aW9uTmFtZV0gPSBjb21wb25lbnRDbGFzcztcbiAgICB9KTtcbiAgICByZXR1cm4gcmV0O1xuICB9O1xufVxuXG5leHBvcnQge1xuICByZWdpc3RyYXRpb25zLFxuICBxdWlja1NldHVwQW5kTG9hZCxcbiAgZGJ1aVdlYkNvbXBvbmVudHNTZXRVcCxcbiAgZ2V0REJVSVdlYkNvbXBvbmVudER1bW15LFxuICBnZXREQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQsXG4gIGdldERCVUlXZWJDb21wb25lbnRGb3JtSW5wdXRUZXh0XG59O1xuIl19
