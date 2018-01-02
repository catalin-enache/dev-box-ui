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

      console.log(klass.propertiesToDefine);

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
          // tabindex defines focusable behaviour
          tabindex: 0,
          role: 'form-input'
        };
      }

      constructor() {
        super();

        this._currentFocused = null;
        this._onFocusableFocused = this._onFocusableFocused.bind(this);
        this._onFocus = this._onFocus.bind(this);
        this._onBlur = this._onBlur.bind(this);
      }

      _onFocusableFocused(evt) {
        console.log('_onFocusableFocused');
        this._currentFocused = evt.target;
      }

      _onFocus() {
        console.log('_onFocus', this);
        if (!this.focused) {
          this.focused = true;
        }
        // this._applyFocusSideEffects();
      }

      _onBlur() {
        console.log('_onBlur', this);
        if (this.focused) {
          this.focused = false;
        }
        // this._applyBlurSideEffects();
      }

      _applyFocusSideEffects() {
        console.log('_applyFocusSideEffects');
        if (this._currentFocused) {
          // Some inner component is already focused.
          // No need to set focus on anything.
          return;
        }
        this._focusFirstFocusable();
      }

      _applyBlurSideEffects() {
        console.log('_applyBlurSideEffects');
        if (this._currentFocused) {
          this._currentFocused.blur();
          this._currentFocused = null;
        }
      }

      _focusFirstFocusable() {
        const focusable = this.childrenTree.querySelector('[tabindex]');
        console.log('_focusFirstFocusable', focusable);
        if (focusable) {
          // this._currentFocused = focusable;
          focusable.focus();
        }
      }

      static get observedAttributes() {
        return ['focused'];
      }

      attributeChangedCallback(name, oldValue, newValue) {
        console.log('attributeChangedCallback', { name, oldValue, newValue });
        const hasValue = newValue !== null;
        if (name === 'focused') {
          hasValue ? this._applyFocusSideEffects() : this._applyBlurSideEffects();
        }
      }

      get focused() {
        return this.hasAttribute('focused');
      }

      // keep this generic (so we can put it in base class), do not add custom logic
      set focused(value) {
        console.log('set focused', value);
        const hasValue = Boolean(value);
        if (hasValue) {
          this.setAttribute('focused', '');
        } else {
          this.removeAttribute('focused');
        }
      }

      // onLocaleChange(locale) {
      //   // console.log('onLocaleChange', locale);
      // }

      connectedCallback() {
        super.connectedCallback();

        this.addEventListener('focus', this._onFocus);
        this.addEventListener('blur', this._onBlur);

        const focusables = this.childrenTree.querySelectorAll('[tabindex]');
        focusables.forEach(focusable => {
          focusable.addEventListener('focus', this._onFocusableFocused);
        });

        // if (this.focused) {
        //   this._focusFirstFocusable();
        // }
      }

      disconnectedCallback() {
        super.disconnectedCallback();

        this.removeEventListener('focus', this._onFocus);
        this.removeEventListener('blur', this._onBlur);

        const focusables = this.childrenTree.querySelectorAll('[tabindex]');
        focusables.forEach(focusable => {
          focusable.removeEventListener('focus', this._onFocusableFocused);
        });
      }
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
function Focusable(Klass) {
  class Focusable extends Klass {
    static get propertiesToDefine() {
      const inheritedPropertiesToDefine = super.propertiesToDefine;
      return Object.assign({}, inheritedPropertiesToDefine, {
        someNewProperty: 'xxx'
      });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL3NlcnZpY2VzL0xvY2FsZVNlcnZpY2UuanMiLCJzcmMvbGliL3dlYmNvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudEJhc2UvREJVSVdlYkNvbXBvbmVudEJhc2UuanMiLCJzcmMvbGliL3dlYmNvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudER1bW15L0RCVUlXZWJDb21wb25lbnREdW1teS5qcyIsInNyYy9saWIvd2ViY29tcG9uZW50cy9EQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQvREJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50LmpzIiwic3JjL2xpYi93ZWJjb21wb25lbnRzL0RCVUlXZWJDb21wb25lbnRGb3JtSW5wdXRUZXh0L0RCVUlXZWJDb21wb25lbnRGb3JtSW5wdXRUZXh0LmpzIiwic3JjL2xpYi93ZWJjb21wb25lbnRzL0RCVUlXZWJDb21wb25lbnRzU2V0dXAvREJVSVdlYkNvbXBvbmVudHNTZXR1cC5qcyIsInNyYy9saWIvd2ViY29tcG9uZW50cy9iZWhhdmlvdXJzL0ZvY3VzYWJsZS5qcyIsInNyYy9saWIvd2ViY29tcG9uZW50cy9pbnRlcm5hbHMvYXBwZW5kU3R5bGUuanMiLCJzcmMvbGliL3dlYmNvbXBvbmVudHMvaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbi5qcyIsInNyYy9saWIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7QUNDQSxNQUFNLGdCQUFnQjtBQUNwQixPQUFLLEtBRGU7QUFFcEIsUUFBTTtBQUZjLENBQXRCOztBQUtBLE1BQU0sYUFBTixDQUFvQjtBQUNsQixnQkFBYztBQUNaLFNBQUssVUFBTCxHQUFrQixFQUFsQjtBQUNBLFNBQUssWUFBTCxHQUFvQixPQUFPLElBQVAsQ0FBWSxhQUFaLENBQXBCO0FBQ0EsU0FBSyxZQUFMLEdBQW9CLE9BQU8sUUFBUCxDQUFnQixlQUFw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SG9CO0FBS3BCLEdBQUMsd0NBQWlDLGdCQUFsQztBQUxvQixDQUF0Qjs7QUFTQTs7Ozs7Ozs7O0FBU0EsU0FBUyxpQkFBVCxDQUEyQixNQUFNLE1BQWpDLEVBQXlDO0FBQ3ZDLFNBQU8sVUFBVSxVQUFWLEVBQXNCO0FBQzNCLFVBQU0sTUFBTSxFQUFaO0FBQ0EsZUFBVyxPQUFYLENBQW1CLENBQUMsRUFBRSxnQkFBRixFQUFvQixjQUFwQixFQUFELEtBQTBDO0FBQzNELDRDQUF1QixHQUF2QixFQUE0QixXQUE1QixDQUF3QyxnQkFBeEMsRUFBMEQsY0FBMUQ7QUFDQSxZQUFNLGlCQUFpQixjQUFjLGdCQUFkLEVBQWdDLE1BQWhDLENBQXZCO0FBQ0EscUJBQWUsWUFBZjtBQUNBLFVBQUksZ0JBQUosSUFBd0IsY0FBeEI7QUFDRCxLQUxEO0FBTUEsV0FBTyxHQUFQO0FBQ0QsR0FURDtBQVVEOztRQUdDLGEsR0FBQSxhO1FBQ0EsaUIsR0FBQSxpQjtRQUNBLHNCO1FBQ0Esd0I7UUFDQSw4QjtRQUNBLGdDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxuY29uc3QgZGVmYXVsdExvY2FsZSA9IHtcbiAgZGlyOiAnbHRyJyxcbiAgbGFuZzogJ2VuJ1xufTtcblxuY2xhc3MgTG9jYWxlU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX2NhbGxiYWNrcyA9IFtdO1xuICAgIHRoaXMuX2xvY2FsZUF0dHJzID0gT2JqZWN0LmtleXMoZGVmYXVsdExvY2FsZSk7XG4gICAgdGhpcy5fcm9vdEVsZW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgIHRoaXMuX2xvY2FsZUF0dHJzLmZvckVhY2goKGF0dHIpID0+IHtcbiAgICAgIGlmICghdGhpcy5fcm9vdEVsZW1lbnQuZ2V0QXR0cmlidXRlKGF0dHIpKSB7XG4gICAgICAgIHRoaXMuX3Jvb3RFbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyLCBkZWZhdWx0TG9jYWxlW2F0dHJdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLl9sb2NhbGUgPSB0aGlzLl9sb2NhbGVBdHRycy5yZWR1Y2UoKGFjYywgYXR0cikgPT4ge1xuICAgICAgYWNjW2F0dHJdID0gdGhpcy5fcm9vdEVsZW1lbnQuZ2V0QXR0cmlidXRlKGF0dHIpO1xuICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCB7fSk7XG4gICAgdGhpcy5fb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcih0aGlzLl9oYW5kbGVNdXRhdGlvbnMuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5fb2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLl9yb290RWxlbWVudCwge1xuICAgICAgYXR0cmlidXRlczogdHJ1ZVxuICAgIH0pO1xuICB9XG5cbiAgX2hhbmRsZU11dGF0aW9ucyhtdXRhdGlvbnMpIHtcbiAgICBtdXRhdGlvbnMuZm9yRWFjaCgobXV0YXRpb24pID0+IHtcbiAgICAgIGNvbnN0IG11dGF0aW9uQXR0cmlidXRlTmFtZSA9IG11dGF0aW9uLmF0dHJpYnV0ZU5hbWU7XG4gICAgICBpZiAodGhpcy5fbG9jYWxlQXR0cnMuaW5jbHVkZXMobXV0YXRpb25BdHRyaWJ1dGVOYW1lKSkge1xuICAgICAgICB0aGlzLl9sb2NhbGUgPSB7XG4gICAgICAgICAgLi4udGhpcy5fbG9jYWxlLFxuICAgICAgICAgIFttdXRhdGlvbkF0dHJpYnV0ZU5hbWVdOiB0aGlzLl9yb290RWxlbWVudC5nZXRBdHRyaWJ1dGUobXV0YXRpb25BdHRyaWJ1dGVOYW1lKVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9jYWxsYmFja3MuZm9yRWFjaChjYWxsYmFjayA9PiBjYWxsYmFjayh0aGlzLl9sb2NhbGUpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHNldCBsb2NhbGUobG9jYWxlT2JqKSB7XG4gICAgT2JqZWN0LmtleXMobG9jYWxlT2JqKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIHRoaXMuX3Jvb3RFbGVtZW50LnNldEF0dHJpYnV0ZShrZXksIGxvY2FsZU9ialtrZXldKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldCBsb2NhbGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xvY2FsZTtcbiAgfVxuXG4gIG9uTG9jYWxlQ2hhbmdlKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuICAgIGNhbGxiYWNrKHRoaXMubG9jYWxlKTtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzLmZpbHRlcihjYiA9PiBjYiAhPT0gY2FsbGJhY2spO1xuICAgIH07XG4gIH1cbn1cblxuY29uc3QgbG9jYWxlU2VydmljZSA9IG5ldyBMb2NhbGVTZXJ2aWNlKCk7XG5leHBvcnQgZGVmYXVsdCBsb2NhbGVTZXJ2aWNlO1xuIiwiXG5pbXBvcnQgTG9jYWxlU2VydmljZSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9Mb2NhbGVTZXJ2aWNlJztcbmltcG9ydCBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24gZnJvbSAnLi4vaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbic7XG5cbmNvbnN0IHJlZ2lzdHJhdGlvbk5hbWUgPSAnREJVSVdlYkNvbXBvbmVudEJhc2UnO1xuXG5mdW5jdGlvbiBkZWZpbmVDb21tb25DU1NWYXJzKCkge1xuICBjb25zdCBjb21tb25TdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gIGNvbW1vblN0eWxlLmlubmVySFRNTCA9IGBcbiAgOnJvb3Qge1xuICAgIC0tZGJ1aS13ZWItY29tcG9uZW50LWdsb2JhbC1ib3JkZXItcmFkaXVzOiA1cHg7XG4gICAgLS1kYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC1oZWlnaHQ6IDMwcHg7XG4gICAgLS1kYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC1jb2xvcjogIzAwMDtcbiAgICAtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICAgIC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtYm9yZGVyLWNvbG9yOiAjY2NjO1xuICAgIC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtYm9yZGVyLXN0eWxlOiBzb2xpZDtcbiAgICAtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWJvcmRlci13aWR0aDogMXB4O1xuICB9XG4gIGA7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2hlYWQnKS5hcHBlbmRDaGlsZChjb21tb25TdHlsZSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldERCVUlXZWJDb21wb25lbnRCYXNlKHdpbikge1xuICByZXR1cm4gZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uKHdpbiwgcmVnaXN0cmF0aW9uTmFtZSwgKCkgPT4ge1xuICAgIGRlZmluZUNvbW1vbkNTU1ZhcnMoKTtcbiAgICBjb25zdCB7IGRvY3VtZW50LCBIVE1MRWxlbWVudCwgY3VzdG9tRWxlbWVudHMgfSA9IHdpbjtcblxuICAgIGNvbnN0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSAnPHN0eWxlPjwvc3R5bGU+PHNsb3Q+PC9zbG90Pic7XG5cbiAgICBjbGFzcyBEQlVJV2ViQ29tcG9uZW50QmFzZSBleHRlbmRzIEhUTUxFbGVtZW50IHtcblxuICAgICAgc3RhdGljIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IGRlcGVuZGVuY2llcygpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IHVzZVNoYWRvdygpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgcHJvcGVydGllc1RvVXBncmFkZSgpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IHByb3BlcnRpZXNUb0RlZmluZSgpIHtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgfVxuXG4gICAgICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgY29uc3QgeyB1c2VTaGFkb3cgfSA9IHRoaXMuY29uc3RydWN0b3I7XG4gICAgICAgIGlmICh1c2VTaGFkb3cpIHtcbiAgICAgICAgICB0aGlzLmF0dGFjaFNoYWRvdyh7XG4gICAgICAgICAgICBtb2RlOiAnb3BlbicsXG4gICAgICAgICAgICAvLyBkZWxlZ2F0ZXNGb2N1czogdHJ1ZVxuICAgICAgICAgICAgLy8gTm90IHdvcmtpbmcgb24gSVBhZCBzbyB3ZSBkbyBhbiB3b3JrYXJvdW5kXG4gICAgICAgICAgICAvLyBieSBzZXR0aW5nIFwiZm9jdXNlZFwiIGF0dHJpYnV0ZSB3aGVuIG5lZWRlZC5cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9pc0Nvbm5lY3RlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9pbnNlcnRUZW1wbGF0ZSgpO1xuXG4gICAgICAgIHRoaXMuY29ubmVjdGVkQ2FsbGJhY2sgPSB0aGlzLmNvbm5lY3RlZENhbGxiYWNrLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuZGlzY29ubmVjdGVkQ2FsbGJhY2sgPSB0aGlzLmRpc2Nvbm5lY3RlZENhbGxiYWNrLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuX2hhbmRsZUxvY2FsZUNoYW5nZSA9IHRoaXMuX2hhbmRsZUxvY2FsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm9uTG9jYWxlQ2hhbmdlICYmICh0aGlzLm9uTG9jYWxlQ2hhbmdlID0gdGhpcy5vbkxvY2FsZUNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy51bnJlZ2lzdGVyTG9jYWxlQ2hhbmdlID0gbnVsbDtcblxuICAgICAgICB0aGlzLmluaXQgJiYgdGhpcy5pbml0KC4uLmFyZ3MpO1xuICAgICAgfVxuXG4gICAgICAvLyBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS93ZWIvZnVuZGFtZW50YWxzL3dlYi1jb21wb25lbnRzL2Jlc3QtcHJhY3RpY2VzI2xhenktcHJvcGVydGllc1xuICAgICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vd2ViL2Z1bmRhbWVudGFscy93ZWItY29tcG9uZW50cy9leGFtcGxlcy9ob3d0by1jaGVja2JveFxuICAgICAgLyogZXNsaW50IG5vLXByb3RvdHlwZS1idWlsdGluczogMCAqL1xuICAgICAgX3VwZ3JhZGVQcm9wZXJ0eShwcm9wKSB7XG4gICAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzW3Byb3BdO1xuICAgICAgICAgIGRlbGV0ZSB0aGlzW3Byb3BdO1xuICAgICAgICAgIHRoaXNbcHJvcF0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBfZGVmaW5lUHJvcGVydHkoa2V5LCB2YWx1ZSkge1xuICAgICAgICBpZiAoIXRoaXMuaGFzQXR0cmlidXRlKGtleSkpIHtcbiAgICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgICAgdGhpcy5faXNDb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmVmb3JldW5sb2FkJywgdGhpcy5kaXNjb25uZWN0ZWRDYWxsYmFjaywgZmFsc2UpO1xuICAgICAgICB0aGlzLnVucmVnaXN0ZXJMb2NhbGVDaGFuZ2UgPVxuICAgICAgICAgIExvY2FsZVNlcnZpY2Uub25Mb2NhbGVDaGFuZ2UodGhpcy5faGFuZGxlTG9jYWxlQ2hhbmdlKTtcbiAgICAgICAgY29uc3QgeyBwcm9wZXJ0aWVzVG9VcGdyYWRlLCBwcm9wZXJ0aWVzVG9EZWZpbmUgfSA9IHRoaXMuY29uc3RydWN0b3I7XG4gICAgICAgIHByb3BlcnRpZXNUb1VwZ3JhZGUuZm9yRWFjaCgocHJvcGVydHkpID0+IHtcbiAgICAgICAgICB0aGlzLl91cGdyYWRlUHJvcGVydHkocHJvcGVydHkpO1xuICAgICAgICB9KTtcbiAgICAgICAgT2JqZWN0LmtleXMocHJvcGVydGllc1RvRGVmaW5lKS5mb3JFYWNoKChwcm9wZXJ0eSkgPT4ge1xuICAgICAgICAgIHRoaXMuX2RlZmluZVByb3BlcnR5KHByb3BlcnR5LCBwcm9wZXJ0aWVzVG9EZWZpbmVbcHJvcGVydHldKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgICB0aGlzLl9pc0Nvbm5lY3RlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnVucmVnaXN0ZXJMb2NhbGVDaGFuZ2UoKTtcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2JlZm9yZXVubG9hZCcsIHRoaXMuZGlzY29ubmVjdGVkQ2FsbGJhY2ssIGZhbHNlKTtcbiAgICAgIH1cblxuICAgICAgZ2V0IGNoaWxkcmVuVHJlZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IudXNlU2hhZG93ID8gdGhpcy5zaGFkb3dSb290IDogdGhpcztcbiAgICAgIH1cblxuICAgICAgX2luc2VydFRlbXBsYXRlKCkge1xuICAgICAgICBjb25zdCB7IHRlbXBsYXRlIH0gPSB0aGlzLmNvbnN0cnVjdG9yO1xuXG4gICAgICAgIGlmICh0ZW1wbGF0ZSkge1xuICAgICAgICAgIHRoaXMuY2hpbGRyZW5UcmVlLmFwcGVuZENoaWxkKHRlbXBsYXRlLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBfaGFuZGxlTG9jYWxlQ2hhbmdlKGxvY2FsZSkge1xuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnZGlyJywgbG9jYWxlLmRpcik7XG4gICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdsYW5nJywgbG9jYWxlLmxhbmcpO1xuICAgICAgICB0aGlzLm9uTG9jYWxlQ2hhbmdlICYmIHRoaXMub25Mb2NhbGVDaGFuZ2UobG9jYWxlKTtcbiAgICAgIH1cblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMoa2xhc3MpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShrbGFzcywgJ2NvbXBvbmVudFN0eWxlJywge1xuICAgICAgICBnZXQoKSB7XG4gICAgICAgICAgcmV0dXJuIGtsYXNzLnRlbXBsYXRlLmNvbnRlbnQucXVlcnlTZWxlY3Rvcignc3R5bGUnKS5pbm5lckhUTUw7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCh2YWx1ZSkge1xuICAgICAgICAgIGtsYXNzLnRlbXBsYXRlLmNvbnRlbnQucXVlcnlTZWxlY3Rvcignc3R5bGUnKS5pbm5lckhUTUwgPSB2YWx1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfSk7XG5cbiAgICAgIGNvbnNvbGUubG9nKGtsYXNzLnByb3BlcnRpZXNUb0RlZmluZSlcblxuICAgICAga2xhc3MucmVnaXN0ZXJTZWxmID0gKCkgPT4ge1xuICAgICAgICBjb25zdCByZWdpc3RyYXRpb25OYW1lID0ga2xhc3MucmVnaXN0cmF0aW9uTmFtZTtcbiAgICAgICAgY29uc3QgZGVwZW5kZW5jaWVzID0ga2xhc3MuZGVwZW5kZW5jaWVzO1xuICAgICAgICAvLyBNYWtlIHN1cmUgb3VyIGRlcGVuZGVuY2llcyBhcmUgcmVnaXN0ZXJlZCBiZWZvcmUgd2UgcmVnaXN0ZXIgc2VsZlxuICAgICAgICBkZXBlbmRlbmNpZXMuZm9yRWFjaCgoZGVwZW5kZW5jeSkgPT4gZGVwZW5kZW5jeS5yZWdpc3RlclNlbGYoKSk7XG4gICAgICAgIC8vIERvbid0IHRyeSB0byByZWdpc3RlciBzZWxmIGlmIGFscmVhZHkgcmVnaXN0ZXJlZFxuICAgICAgICBpZiAoY3VzdG9tRWxlbWVudHMuZ2V0KHJlZ2lzdHJhdGlvbk5hbWUpKSByZXR1cm4gcmVnaXN0cmF0aW9uTmFtZTtcbiAgICAgICAgLy8gR2l2ZSBhIGNoYW5jZSB0byBvdmVycmlkZSB3ZWItY29tcG9uZW50IHN0eWxlIGlmIHByb3ZpZGVkIGJlZm9yZSBiZWluZyByZWdpc3RlcmVkLlxuICAgICAgICBjb25zdCBjb21wb25lbnRTdHlsZSA9ICgod2luLkRCVUlXZWJDb21wb25lbnRzIHx8IHt9KVtyZWdpc3RyYXRpb25OYW1lXSB8fCB7fSkuY29tcG9uZW50U3R5bGU7XG4gICAgICAgIGlmIChjb21wb25lbnRTdHlsZSkge1xuICAgICAgICAgIGtsYXNzLmNvbXBvbmVudFN0eWxlICs9IGNvbXBvbmVudFN0eWxlO1xuICAgICAgICB9XG4gICAgICAgIC8vIERvIHJlZ2lzdHJhdGlvblxuICAgICAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUocmVnaXN0cmF0aW9uTmFtZSwga2xhc3MpO1xuICAgICAgICByZXR1cm4gcmVnaXN0cmF0aW9uTmFtZTtcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBrbGFzcztcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgREJVSVdlYkNvbXBvbmVudEJhc2UsXG4gICAgICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzXG4gICAgfTtcbiAgfSk7XG59XG4iLCJcbmltcG9ydCBnZXREQlVJV2ViQ29tcG9uZW50QmFzZSBmcm9tICcuLi9EQlVJV2ViQ29tcG9uZW50QmFzZS9EQlVJV2ViQ29tcG9uZW50QmFzZSc7XG5pbXBvcnQgZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uIGZyb20gJy4uL2ludGVybmFscy9lbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24nO1xuXG5jb25zdCByZWdpc3RyYXRpb25OYW1lID0gJ2RidWktd2ViLWNvbXBvbmVudC1kdW1teSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldERCVUlXZWJDb21wb25lbnREdW1teSh3aW4pIHtcbiAgcmV0dXJuIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbih3aW4sIHJlZ2lzdHJhdGlvbk5hbWUsICgpID0+IHtcbiAgICBjb25zdCB7IERCVUlXZWJDb21wb25lbnRCYXNlLCBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzIH0gPSBnZXREQlVJV2ViQ29tcG9uZW50QmFzZSh3aW4pO1xuICAgIGNvbnN0IHsgZG9jdW1lbnQgfSA9IHdpbjtcblxuICAgIGNvbnN0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBgXG4gICAgICA8c3R5bGU+XG4gICAgICA6aG9zdCB7XG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIG1heC13aWR0aDogNDAwcHg7XG4gICAgICAgIGhlaWdodDogdmFyKC0tZGJ1aS1pbnB1dC1oZWlnaHQsIDUwcHgpO1xuICAgICAgICBjb2xvcjogbWFyb29uO1xuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCBncmF5O1xuICAgICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgICAgfVxuICAgICAgXG4gICAgICA6aG9zdCBiLCA6aG9zdCBkaXZbeC1oYXMtc2xvdF0gc3Bhblt4LXNsb3Qtd3JhcHBlcl0ge1xuICAgICAgICB1bmljb2RlLWJpZGk6IGJpZGktb3ZlcnJpZGU7XG4gICAgICAgIHRleHQtc2hhZG93OiB2YXIoLS1kdW1teS1iLXRleHQtc2hhZG93LCBub25lKTtcbiAgICAgIH1cblxuICAgICAgOmhvc3QoW2Rpcj1ydGxdKSBiIHtcbiAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XG4gICAgICB9XG4gICAgICBcbiAgICAgIDpob3N0KFtkaXI9bHRyXSkgYiB7XG4gICAgICAgIHRleHQtZGVjb3JhdGlvbjogb3ZlcmxpbmU7XG4gICAgICB9XG5cbiAgICAgIDpob3N0KFtkaXI9bHRyXSkgI2NvbnRhaW5lciA+IGRpdltkaXI9cnRsXSxcbiAgICAgIDpob3N0KFtkaXI9cnRsXSkgI2NvbnRhaW5lciA+IGRpdltkaXI9bHRyXSB7XG4gICAgICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgICB9XG4gICAgICBcbiAgICAgIDpob3N0ICNjb250YWluZXIgPiBkaXZbeC1oYXMtc2xvdF0ge1xuICAgICAgICBtYXJnaW4tbGVmdDogMHB4O1xuICAgICAgfVxuICAgICAgXG4gICAgICAjY29udGFpbmVyIHtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIGhlaWdodDogMTAwJTtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1mbG93OiByb3cgbm93cmFwO1xuICAgICAgICBhbGlnbi1pdGVtczogc3RyZXRjaDtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgI2NvbnRhaW5lciA+IGRpdiB7XG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIGdyYXk7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IHZhcigtLWR1bW15LWlubmVyLXNlY3Rpb25zLWJvcmRlci1yYWRpdXMsIDBweCk7XG4gICAgICAgIGZsZXg6IDEgMCAwJTtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgbWFyZ2luOiA1cHg7XG4gICAgICB9XG4gICAgICBcbiAgICAgICNjb250YWluZXIgPiBkaXYgPiBkaXYge1xuICAgICAgICBtYXJnaW46IGF1dG87XG4gICAgICB9XG4gICAgICBcbiAgICAgIDwvc3R5bGU+XG4gICAgICBcbiAgICAgIDxkaXYgaWQ9XCJjb250YWluZXJcIj5cbiAgICAgICAgPGRpdiBkaXI9XCJsdHJcIj5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGI+RHVtbXkgc2hhZG93PC9iPiBbTFRSXVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgXG4gICAgICAgIDxkaXYgeC1oYXMtc2xvdD5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPHNwYW4+Wzwvc3Bhbj48c3BhbiB4LXNsb3Qtd3JhcHBlcj48c2xvdD48L3Nsb3Q+PC9zcGFuPjxzcGFuPl08L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICBcbiAgICAgICAgPGRpdiBkaXI9XCJydGxcIj5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGI+RHVtbXkgc2hhZG93PC9iPiBbUlRMXVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIGA7XG5cbiAgICBjbGFzcyBEQlVJV2ViQ29tcG9uZW50RHVtbXkgZXh0ZW5kcyBEQlVJV2ViQ29tcG9uZW50QmFzZSB7XG4gICAgICBzdGF0aWMgZ2V0IHJlZ2lzdHJhdGlvbk5hbWUoKSB7XG4gICAgICAgIHJldHVybiByZWdpc3RyYXRpb25OYW1lO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlKCkge1xuICAgICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgICB9XG5cbiAgICAgIG9uTG9jYWxlQ2hhbmdlKGxvY2FsZSkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnb25Mb2NhbGVDaGFuZ2UnLCBsb2NhbGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMoREJVSVdlYkNvbXBvbmVudER1bW15KTtcblxuICAgIHJldHVybiBEQlVJV2ViQ29tcG9uZW50RHVtbXk7XG4gIH0pO1xufVxuXG5nZXREQlVJV2ViQ29tcG9uZW50RHVtbXkucmVnaXN0cmF0aW9uTmFtZSA9IHJlZ2lzdHJhdGlvbk5hbWU7XG5cbiIsIlxuXG5pbXBvcnQgZ2V0REJVSVdlYkNvbXBvbmVudEJhc2UgZnJvbSAnLi4vREJVSVdlYkNvbXBvbmVudEJhc2UvREJVSVdlYkNvbXBvbmVudEJhc2UnO1xuaW1wb3J0IGdldERCVUlXZWJDb21wb25lbnREdW1teSBmcm9tICcuLi9EQlVJV2ViQ29tcG9uZW50RHVtbXkvREJVSVdlYkNvbXBvbmVudER1bW15JztcbmltcG9ydCBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24gZnJvbSAnLi4vaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbic7XG5cbmNvbnN0IHJlZ2lzdHJhdGlvbk5hbWUgPSAnZGJ1aS13ZWItY29tcG9uZW50LWR1bW15LXBhcmVudCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldERCVUlXZWJDb21wb25lbnREdW1teVBhcmVudCh3aW4pIHtcbiAgcmV0dXJuIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbih3aW4sIHJlZ2lzdHJhdGlvbk5hbWUsICgpID0+IHtcbiAgICBjb25zdCB7IERCVUlXZWJDb21wb25lbnRCYXNlLCBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzIH0gPSBnZXREQlVJV2ViQ29tcG9uZW50QmFzZSh3aW4pO1xuICAgIGNvbnN0IERCVUlXZWJDb21wb25lbnREdW1teSA9IGdldERCVUlXZWJDb21wb25lbnREdW1teSh3aW4pO1xuXG4gICAgY29uc3QgeyBkb2N1bWVudCB9ID0gd2luO1xuXG4gICAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IGBcbiAgICAgIDxzdHlsZT5cbiAgICAgIDpob3N0IHtcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgbWF4LXdpZHRoOiA0MDBweDtcbiAgICAgIH1cbiAgICAgIDwvc3R5bGU+XG4gICAgICA8ZGl2PlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxiPkR1bW15IFBhcmVudCBzaGFkb3c8L2I+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxkYnVpLXdlYi1jb21wb25lbnQtZHVtbXk+PHNsb3Q+PC9zbG90PjwvZGJ1aS13ZWItY29tcG9uZW50LWR1bW15PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIGA7XG5cbiAgICBjbGFzcyBEQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQgZXh0ZW5kcyBEQlVJV2ViQ29tcG9uZW50QmFzZSB7XG4gICAgICBzdGF0aWMgZ2V0IHJlZ2lzdHJhdGlvbk5hbWUoKSB7XG4gICAgICAgIHJldHVybiByZWdpc3RyYXRpb25OYW1lO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlKCkge1xuICAgICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgZGVwZW5kZW5jaWVzKCkge1xuICAgICAgICByZXR1cm4gW0RCVUlXZWJDb21wb25lbnREdW1teV07XG4gICAgICB9XG5cbiAgICB9XG5cbiAgICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzKERCVUlXZWJDb21wb25lbnREdW1teVBhcmVudCk7XG5cbiAgICByZXR1cm4gREJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50O1xuICB9KTtcbn1cblxuZ2V0REJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50LnJlZ2lzdHJhdGlvbk5hbWUgPSByZWdpc3RyYXRpb25OYW1lO1xuXG4iLCJcbmltcG9ydCBnZXREQlVJV2ViQ29tcG9uZW50QmFzZSBmcm9tICcuLi9EQlVJV2ViQ29tcG9uZW50QmFzZS9EQlVJV2ViQ29tcG9uZW50QmFzZSc7XG5pbXBvcnQgZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uIGZyb20gJy4uL2ludGVybmFscy9lbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24nO1xuaW1wb3J0IEZvY3VzYWJsZSBmcm9tICcuLi9iZWhhdmlvdXJzL0ZvY3VzYWJsZSc7XG5cbmNvbnN0IHJlZ2lzdHJhdGlvbk5hbWUgPSAnZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtdGV4dCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldERCVUlXZWJDb21wb25lbnRGb3JtSW5wdXRUZXh0KHdpbikge1xuICByZXR1cm4gZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uKHdpbiwgcmVnaXN0cmF0aW9uTmFtZSwgKCkgPT4ge1xuICAgIGNvbnN0IHsgREJVSVdlYkNvbXBvbmVudEJhc2UsIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMgfSA9IGdldERCVUlXZWJDb21wb25lbnRCYXNlKHdpbik7XG4gICAgY29uc3QgeyBkb2N1bWVudCB9ID0gd2luO1xuXG4gICAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IGBcbiAgICAgIDxzdHlsZT5cbiAgICAgIDpob3N0IHtcbiAgICAgICAgYWxsOiBpbml0aWFsOyBcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgLypoZWlnaHQ6IHZhcigtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWhlaWdodCk7Ki9cbiAgICAgICAgLypsaW5lLWhlaWdodDogdmFyKC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtaGVpZ2h0KTsqL1xuICAgICAgICBoZWlnaHQ6IDIwMHB4O1xuICAgICAgICBwYWRkaW5nOiAwcHg7XG4gICAgICAgIGZvbnQtc2l6ZTogMThweDtcbiAgICAgICAgY29sb3I6IHZhcigtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWNvbG9yKTtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtYmFja2dyb3VuZC1jb2xvcik7XG4gICAgICAgIHVuaWNvZGUtYmlkaTogYmlkaS1vdmVycmlkZTtcbiAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAgICAgYm9yZGVyOiBub25lO1xuICAgICAgICBib3JkZXItYm90dG9tOiB2YXIoLS1kYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC1ib3JkZXItd2lkdGgpIHZhcigtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWJvcmRlci1zdHlsZSkgdmFyKC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtYm9yZGVyLWNvbG9yKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgOmhvc3QgW3RhYmluZGV4XSB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBoZWlnaHQ6IDUwcHg7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiA1MHB4O1xuICAgICAgICBib3JkZXI6IG5vbmU7XG4gICAgICAgIG1hcmdpbjogMHB4O1xuICAgICAgICBwYWRkaW5nOiAwcHg7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICAgICAgfVxuICAgICAgXG4gICAgICA6aG9zdCBbdGFiaW5kZXhdOmZvY3VzIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDAsIDAsIC4zKTtcbiAgICAgICAgb3V0bGluZTogbm9uZTtcbiAgICAgIH1cblxuICAgICAgOmhvc3QoW2ZvY3VzZWRdKSB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMjU1LCAwLCAuMyk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIDpob3N0KFtkaXNhYmxlZF0pIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAuMyk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIDpob3N0KFtoaWRkZW5dKSB7XG4gICAgICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgICB9XG5cbiAgICAgIDpob3N0KFtkaXI9cnRsXSkge1xuICAgICAgXG4gICAgICB9XG4gICAgICBcbiAgICAgIDpob3N0KFtkaXI9bHRyXSkge1xuICAgICAgXG4gICAgICB9XG4gICAgICA8L3N0eWxlPlxuICAgICAgPGRpdiBjb250ZW50ZWRpdGFibGU9XCJ0cnVlXCIgdGFiaW5kZXg9XCIwXCI+PC9kaXY+XG4gICAgICA8ZGl2IGNvbnRlbnRlZGl0YWJsZT1cInRydWVcIiB0YWJpbmRleD1cIjBcIj48L2Rpdj5cbiAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIHRhYmluZGV4PVwiMFwiIC8+XG4gICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiB0YWJpbmRleD1cIjBcIiAvPlxuICAgIGA7XG5cbiAgICBjbGFzcyBEQlVJV2ViQ29tcG9uZW50Rm9ybUlucHV0VGV4dCBleHRlbmRzIERCVUlXZWJDb21wb25lbnRCYXNlIHtcbiAgICAgIHN0YXRpYyBnZXQgcmVnaXN0cmF0aW9uTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHJlZ2lzdHJhdGlvbk5hbWU7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgdGVtcGxhdGUoKSB7XG4gICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCBwcm9wZXJ0aWVzVG9EZWZpbmUoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLy8gdGFiaW5kZXggZGVmaW5lcyBmb2N1c2FibGUgYmVoYXZpb3VyXG4gICAgICAgICAgdGFiaW5kZXg6IDAsXG4gICAgICAgICAgcm9sZTogJ2Zvcm0taW5wdXQnXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMuX2N1cnJlbnRGb2N1c2VkID0gbnVsbDtcbiAgICAgICAgdGhpcy5fb25Gb2N1c2FibGVGb2N1c2VkID0gdGhpcy5fb25Gb2N1c2FibGVGb2N1c2VkLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuX29uRm9jdXMgPSB0aGlzLl9vbkZvY3VzLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuX29uQmx1ciA9IHRoaXMuX29uQmx1ci5iaW5kKHRoaXMpO1xuICAgICAgfVxuXG4gICAgICBfb25Gb2N1c2FibGVGb2N1c2VkKGV2dCkge1xuICAgICAgICBjb25zb2xlLmxvZygnX29uRm9jdXNhYmxlRm9jdXNlZCcpO1xuICAgICAgICB0aGlzLl9jdXJyZW50Rm9jdXNlZCA9IGV2dC50YXJnZXQ7XG4gICAgICB9XG5cbiAgICAgIF9vbkZvY3VzKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnX29uRm9jdXMnLCB0aGlzKTtcbiAgICAgICAgaWYgKCF0aGlzLmZvY3VzZWQpIHtcbiAgICAgICAgICB0aGlzLmZvY3VzZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIC8vIHRoaXMuX2FwcGx5Rm9jdXNTaWRlRWZmZWN0cygpO1xuICAgICAgfVxuXG4gICAgICBfb25CbHVyKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnX29uQmx1cicsIHRoaXMpO1xuICAgICAgICBpZiAodGhpcy5mb2N1c2VkKSB7XG4gICAgICAgICAgdGhpcy5mb2N1c2VkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgLy8gdGhpcy5fYXBwbHlCbHVyU2lkZUVmZmVjdHMoKTtcbiAgICAgIH1cblxuICAgICAgX2FwcGx5Rm9jdXNTaWRlRWZmZWN0cygpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ19hcHBseUZvY3VzU2lkZUVmZmVjdHMnKTtcbiAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnRGb2N1c2VkKSB7XG4gICAgICAgICAgLy8gU29tZSBpbm5lciBjb21wb25lbnQgaXMgYWxyZWFkeSBmb2N1c2VkLlxuICAgICAgICAgIC8vIE5vIG5lZWQgdG8gc2V0IGZvY3VzIG9uIGFueXRoaW5nLlxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9mb2N1c0ZpcnN0Rm9jdXNhYmxlKCk7XG4gICAgICB9XG5cbiAgICAgIF9hcHBseUJsdXJTaWRlRWZmZWN0cygpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ19hcHBseUJsdXJTaWRlRWZmZWN0cycpO1xuICAgICAgICBpZiAodGhpcy5fY3VycmVudEZvY3VzZWQpIHtcbiAgICAgICAgICB0aGlzLl9jdXJyZW50Rm9jdXNlZC5ibHVyKCk7XG4gICAgICAgICAgdGhpcy5fY3VycmVudEZvY3VzZWQgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIF9mb2N1c0ZpcnN0Rm9jdXNhYmxlKCkge1xuICAgICAgICBjb25zdCBmb2N1c2FibGUgPSB0aGlzLmNoaWxkcmVuVHJlZS5xdWVyeVNlbGVjdG9yKCdbdGFiaW5kZXhdJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdfZm9jdXNGaXJzdEZvY3VzYWJsZScsIGZvY3VzYWJsZSlcbiAgICAgICAgaWYgKGZvY3VzYWJsZSkge1xuICAgICAgICAgIC8vIHRoaXMuX2N1cnJlbnRGb2N1c2VkID0gZm9jdXNhYmxlO1xuICAgICAgICAgIGZvY3VzYWJsZS5mb2N1cygpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCkge1xuICAgICAgICByZXR1cm4gWydmb2N1c2VkJ107XG4gICAgICB9XG5cbiAgICAgIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2F0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjaycsIHtuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWV9KVxuICAgICAgICBjb25zdCBoYXNWYWx1ZSA9IG5ld1ZhbHVlICE9PSBudWxsO1xuICAgICAgICBpZiAobmFtZSA9PT0gJ2ZvY3VzZWQnKSB7XG4gICAgICAgICAgaGFzVmFsdWUgPyB0aGlzLl9hcHBseUZvY3VzU2lkZUVmZmVjdHMoKSA6IHRoaXMuX2FwcGx5Qmx1clNpZGVFZmZlY3RzKCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZ2V0IGZvY3VzZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhhc0F0dHJpYnV0ZSgnZm9jdXNlZCcpO1xuICAgICAgfVxuXG4gICAgICAvLyBrZWVwIHRoaXMgZ2VuZXJpYyAoc28gd2UgY2FuIHB1dCBpdCBpbiBiYXNlIGNsYXNzKSwgZG8gbm90IGFkZCBjdXN0b20gbG9naWNcbiAgICAgIHNldCBmb2N1c2VkKHZhbHVlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzZXQgZm9jdXNlZCcsIHZhbHVlKTtcbiAgICAgICAgY29uc3QgaGFzVmFsdWUgPSBCb29sZWFuKHZhbHVlKTtcbiAgICAgICAgaWYgKGhhc1ZhbHVlKSB7XG4gICAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2ZvY3VzZWQnLCAnJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoJ2ZvY3VzZWQnKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBvbkxvY2FsZUNoYW5nZShsb2NhbGUpIHtcbiAgICAgIC8vICAgLy8gY29uc29sZS5sb2coJ29uTG9jYWxlQ2hhbmdlJywgbG9jYWxlKTtcbiAgICAgIC8vIH1cblxuICAgICAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHN1cGVyLmNvbm5lY3RlZENhbGxiYWNrKCk7XG5cbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIHRoaXMuX29uRm9jdXMpO1xuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCB0aGlzLl9vbkJsdXIpO1xuXG4gICAgICAgIGNvbnN0IGZvY3VzYWJsZXMgPSB0aGlzLmNoaWxkcmVuVHJlZS5xdWVyeVNlbGVjdG9yQWxsKCdbdGFiaW5kZXhdJyk7XG4gICAgICAgIGZvY3VzYWJsZXMuZm9yRWFjaCgoZm9jdXNhYmxlKSA9PiB7XG4gICAgICAgICAgZm9jdXNhYmxlLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdGhpcy5fb25Gb2N1c2FibGVGb2N1c2VkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gaWYgKHRoaXMuZm9jdXNlZCkge1xuICAgICAgICAvLyAgIHRoaXMuX2ZvY3VzRmlyc3RGb2N1c2FibGUoKTtcbiAgICAgICAgLy8gfVxuICAgICAgfVxuXG4gICAgICBkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgICAgc3VwZXIuZGlzY29ubmVjdGVkQ2FsbGJhY2soKTtcblxuICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdGhpcy5fb25Gb2N1cyk7XG4gICAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMuX29uQmx1cik7XG5cbiAgICAgICAgY29uc3QgZm9jdXNhYmxlcyA9IHRoaXMuY2hpbGRyZW5UcmVlLnF1ZXJ5U2VsZWN0b3JBbGwoJ1t0YWJpbmRleF0nKTtcbiAgICAgICAgZm9jdXNhYmxlcy5mb3JFYWNoKChmb2N1c2FibGUpID0+IHtcbiAgICAgICAgICBmb2N1c2FibGUucmVtb3ZlRXZlbnRMaXN0ZW5lcignZm9jdXMnLCB0aGlzLl9vbkZvY3VzYWJsZUZvY3VzZWQpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyhGb2N1c2FibGUoREJVSVdlYkNvbXBvbmVudEZvcm1JbnB1dFRleHQpKTtcblxuICB9KTtcbn1cblxuZ2V0REJVSVdlYkNvbXBvbmVudEZvcm1JbnB1dFRleHQucmVnaXN0cmF0aW9uTmFtZSA9IHJlZ2lzdHJhdGlvbk5hbWU7XG5cbiIsImltcG9ydCBhcHBlbmRTdHlsZSBmcm9tICcuLi9pbnRlcm5hbHMvYXBwZW5kU3R5bGUnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkYnVpV2ViQ29tcG9uZW50c1NldFVwKHdpbikge1xuICByZXR1cm4ge1xuICAgIGFwcGVuZFN0eWxlOiBhcHBlbmRTdHlsZSh3aW4pXG4gIH07XG59XG4iLCJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEZvY3VzYWJsZShLbGFzcykge1xuICBjbGFzcyBGb2N1c2FibGUgZXh0ZW5kcyBLbGFzcyB7XG4gICAgc3RhdGljIGdldCBwcm9wZXJ0aWVzVG9EZWZpbmUoKSB7XG4gICAgICBjb25zdCBpbmhlcml0ZWRQcm9wZXJ0aWVzVG9EZWZpbmUgPSBzdXBlci5wcm9wZXJ0aWVzVG9EZWZpbmU7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5pbmhlcml0ZWRQcm9wZXJ0aWVzVG9EZWZpbmUsXG4gICAgICAgIHNvbWVOZXdQcm9wZXJ0eTogJ3h4eCdcbiAgICAgIH07XG4gICAgfVxuICB9XG4gIEZvY3VzYWJsZS5vcmlnaW5hbE5hbWUgPSBLbGFzcy5uYW1lO1xuICByZXR1cm4gRm9jdXNhYmxlO1xufVxuIiwiLypcbkRCVUlXZWJDb21wb25lbnRCYXNlIChmcm9tIHdoaWNoIGFsbCB3ZWItY29tcG9uZW50cyBpbmhlcml0KVxud2lsbCByZWFkIGNvbXBvbmVudFN0eWxlIGZyb20gd2luLkRCVUlXZWJDb21wb25lbnRzXG53aGVuIGtsYXNzLnJlZ2lzdGVyU2VsZigpIGlzIGNhbGxlZCBnaXZpbmcgYSBjaGFuY2UgdG8gb3ZlcnJpZGUgZGVmYXVsdCB3ZWItY29tcG9uZW50IHN0eWxlXG5qdXN0IGJlZm9yZSBpdCBpcyByZWdpc3RlcmVkLlxuKi9cbmNvbnN0IGFwcGVuZFN0eWxlID0gKHdpbikgPT4gKHJlZ2lzdHJhdGlvbk5hbWUsIGNvbXBvbmVudFN0eWxlKSA9PiB7XG4gIGlmICghd2luLkRCVUlXZWJDb21wb25lbnRzKSB7XG4gICAgd2luLkRCVUlXZWJDb21wb25lbnRzID0ge307XG4gIH1cbiAgd2luLkRCVUlXZWJDb21wb25lbnRzID0ge1xuICAgIC4uLndpbi5EQlVJV2ViQ29tcG9uZW50cyxcbiAgICBbcmVnaXN0cmF0aW9uTmFtZV06IHtcbiAgICAgIC4uLndpbi5EQlVJV2ViQ29tcG9uZW50c1tyZWdpc3RyYXRpb25OYW1lXSxcbiAgICAgIGNvbXBvbmVudFN0eWxlXG4gICAgfVxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgYXBwZW5kU3R5bGU7XG4iLCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uKHdpbiwgbmFtZSwgY2FsbGJhY2spIHtcbiAgaWYgKCF3aW4uREJVSVdlYkNvbXBvbmVudHMpIHtcbiAgICB3aW4uREJVSVdlYkNvbXBvbmVudHMgPSB7IHJlZ2lzdHJhdGlvbnM6IHt9IH07XG4gIH0gZWxzZSBpZiAoIXdpbi5EQlVJV2ViQ29tcG9uZW50cy5yZWdpc3RyYXRpb25zKSB7XG4gICAgd2luLkRCVUlXZWJDb21wb25lbnRzLnJlZ2lzdHJhdGlvbnMgPSB7fTtcbiAgfVxuXG4gIGxldCByZWdpc3RyYXRpb24gPSB3aW4uREJVSVdlYkNvbXBvbmVudHMucmVnaXN0cmF0aW9uc1tuYW1lXTtcblxuICBpZiAocmVnaXN0cmF0aW9uKSByZXR1cm4gcmVnaXN0cmF0aW9uO1xuXG4gIHJlZ2lzdHJhdGlvbiA9IGNhbGxiYWNrKCk7XG4gIHdpbi5EQlVJV2ViQ29tcG9uZW50cy5yZWdpc3RyYXRpb25zW25hbWVdID0gcmVnaXN0cmF0aW9uO1xuXG4gIHJldHVybiB3aW4uREJVSVdlYkNvbXBvbmVudHMucmVnaXN0cmF0aW9uc1tuYW1lXTtcbn1cblxuIiwiXG5pbXBvcnQgZGJ1aVdlYkNvbXBvbmVudHNTZXRVcCBmcm9tICcuL0RCVUlXZWJDb21wb25lbnRzU2V0dXAvREJVSVdlYkNvbXBvbmVudHNTZXR1cCc7XG5pbXBvcnQgZ2V0REJVSVdlYkNvbXBvbmVudER1bW15IGZyb20gJy4vREJVSVdlYkNvbXBvbmVudER1bW15L0RCVUlXZWJDb21wb25lbnREdW1teSc7XG5pbXBvcnQgZ2V0REJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50IGZyb20gJy4vREJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50L0RCVUlXZWJDb21wb25lbnREdW1teVBhcmVudCc7XG5pbXBvcnQgZ2V0REJVSVdlYkNvbXBvbmVudEZvcm1JbnB1dFRleHQgZnJvbSAnLi9EQlVJV2ViQ29tcG9uZW50Rm9ybUlucHV0VGV4dC9EQlVJV2ViQ29tcG9uZW50Rm9ybUlucHV0VGV4dCc7XG5cbmNvbnN0IHJlZ2lzdHJhdGlvbnMgPSB7XG4gIFtnZXREQlVJV2ViQ29tcG9uZW50RHVtbXkucmVnaXN0cmF0aW9uTmFtZV06XG4gICAgZ2V0REJVSVdlYkNvbXBvbmVudER1bW15LFxuICBbZ2V0REJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50LnJlZ2lzdHJhdGlvbk5hbWVdOlxuICAgIGdldERCVUlXZWJDb21wb25lbnREdW1teVBhcmVudCxcbiAgW2dldERCVUlXZWJDb21wb25lbnRGb3JtSW5wdXRUZXh0LnJlZ2lzdHJhdGlvbk5hbWVdOlxuICAgIGdldERCVUlXZWJDb21wb25lbnRGb3JtSW5wdXRUZXh0LFxufTtcblxuLypcblVzaW5nIHRoaXMgZnVuY3Rpb24gaW1wbGllcyBlbnRpcmUgREJVSVdlYkNvbXBvbmVudHMgbGlicmFyeVxuaXMgYWxyZWFkeSBsb2FkZWQuXG5JdCBpcyB1c2VmdWwgZXNwZWNpYWxseSB3aGVuIHdvcmtpbmcgd2l0aCBkaXN0cmlidXRpb24gYnVpbGQuXG5JZiB5b3Ugd2FudCB0byBsb2FkIGp1c3Qgb25lIHdlYi1jb21wb25lbnQgb3IgYSBzdWJzZXQgb2Ygd2ViLWNvbXBvbmVudHNcbmxvYWQgdGhlbSBmcm9tIG5vZGVfbW9kdWxlcyBieSB0aGVpciBwYXRoXG5leDpcbmltcG9ydCBTb21lQ29tcG9uZW50TG9hZGVyIGZyb20gbm9kZV9tb2R1bGVzL2Rldi1ib3gtdWkvYnVpbGQvc3JjL2xpYi93ZWJjb21wb25lbnRzL1NvbWVDb21wb25lbnQ7XG4qL1xuZnVuY3Rpb24gcXVpY2tTZXR1cEFuZExvYWQod2luID0gd2luZG93KSB7XG4gIHJldHVybiBmdW5jdGlvbiAoY29tcG9uZW50cykge1xuICAgIGNvbnN0IHJldCA9IHt9O1xuICAgIGNvbXBvbmVudHMuZm9yRWFjaCgoeyByZWdpc3RyYXRpb25OYW1lLCBjb21wb25lbnRTdHlsZSB9KSA9PiB7XG4gICAgICBkYnVpV2ViQ29tcG9uZW50c1NldFVwKHdpbikuYXBwZW5kU3R5bGUocmVnaXN0cmF0aW9uTmFtZSwgY29tcG9uZW50U3R5bGUpO1xuICAgICAgY29uc3QgY29tcG9uZW50Q2xhc3MgPSByZWdpc3RyYXRpb25zW3JlZ2lzdHJhdGlvbk5hbWVdKHdpbmRvdyk7XG4gICAgICBjb21wb25lbnRDbGFzcy5yZWdpc3RlclNlbGYoKTtcbiAgICAgIHJldFtyZWdpc3RyYXRpb25OYW1lXSA9IGNvbXBvbmVudENsYXNzO1xuICAgIH0pO1xuICAgIHJldHVybiByZXQ7XG4gIH07XG59XG5cbmV4cG9ydCB7XG4gIHJlZ2lzdHJhdGlvbnMsXG4gIHF1aWNrU2V0dXBBbmRMb2FkLFxuICBkYnVpV2ViQ29tcG9uZW50c1NldFVwLFxuICBnZXREQlVJV2ViQ29tcG9uZW50RHVtbXksXG4gIGdldERCVUlXZWJDb21wb25lbnREdW1teVBhcmVudCxcbiAgZ2V0REJVSVdlYkNvbXBvbmVudEZvcm1JbnB1dFRleHRcbn07XG4iXX0=
