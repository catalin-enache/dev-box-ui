require=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ensureSingleRegistration;

/**
 *
 * @param win Window
 * @param name String
 * @param callback Function
 * @return *
 */
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

},{}],4:[function(require,module,exports){
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

},{"../internals/ensureSingleRegistration":3,"./DBUILocaleService":5}],5:[function(require,module,exports){
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
        this._rootElement = win.document.querySelector('[x-dbui-locale-root]') || win.document.documentElement;
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

},{"../internals/ensureSingleRegistration":3}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = template;
/**
 * const t = template`${0} ${1} ${'two'} ${'three'}`;
 * const tr = t('a', 'b', { two: 'c', three: 'd' });
 * expect(tr).to.equal('a b c d');
 * @param strings
 * @param keys
 * @return {function(...[*])}
 */
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

},{}],9:[function(require,module,exports){
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
// TODO:test this
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

},{}],10:[function(require,module,exports){
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

  // https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-within

  class Focusable extends Klass {

    static get name() {
      return super.name;
    }

    static get propertiesToUpgrade() {
      // The reason for upgrading 'focused' is only to show an warning
      // if the consumer of the component attempted to set focus property
      // which is read-only.
      return [...super.propertiesToUpgrade, 'focused', 'disabled'];
    }

    static get observedAttributes() {
      return [...super.observedAttributes, 'disabled'];
    }

    constructor(...args) {
      super(...args);

      this._currentInnerFocused = null;
      this._sideEffectsAppliedFor = null;
      this._onInnerFocusableFocused = this._onInnerFocusableFocused.bind(this);
      this._onFocus = this._onFocus.bind(this);
      this._onBlur = this._onBlur.bind(this);
      this._onTap = this._onTap.bind(this);
    }

    attributeChangedCallback(name, oldValue, newValue) {
      super.attributeChangedCallback(name, oldValue, newValue);

      const hasValue = newValue !== null;
      if (name === 'disabled') {
        hasValue ? this._applyDisabledSideEffects() : this._applyEnabledSideEffects();
      }
    }

    connectedCallback() {
      super.connectedCallback();

      readOnlyProperties.forEach(readOnlyProperty => {
        if (this.hasAttribute(readOnlyProperty)) {
          this.removeAttribute(readOnlyProperty);
          console.warn(ERROR_MESSAGES[readOnlyProperty]);
        }
      });

      if (this.disabled) {
        this._applyDisabledSideEffects();
      } else {
        this._applyEnabledSideEffects();
      }

      // when component focused/blurred
      this.addEventListener('focus', this._onFocus);
      this.addEventListener('blur', this._onBlur);
      this.ownerDocument.addEventListener('mousedown', this._onTap);
      this.ownerDocument.addEventListener('touchstart', this._onTap);

      this._innerFocusables.forEach(focusable => {
        // when inner focusable focused
        focusable.addEventListener('focus', this._onInnerFocusableFocused);
      });
    }

    disconnectedCallback() {
      super.disconnectedCallback();

      this.removeEventListener('focus', this._onFocus);
      this.removeEventListener('blur', this._onBlur);
      this.ownerDocument.removeEventListener('mousedown', this._onTap);
      this.ownerDocument.removeEventListener('touchstart', this._onTap);

      this._innerFocusables.forEach(focusable => {
        focusable.removeEventListener('focus', this._onInnerFocusableFocused);
      });
    }

    /**
     * Read only.
     * @return Boolean
     */
    get focused() {
      return this.hasAttribute('focused');
    }

    set focused(_) {
      console.warn(ERROR_MESSAGES.focused);
    }

    /**
     *
     * @return Boolean
     */
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

    /**
     *
     * @return Array<HTMLElement>
     * @private
     */
    get _innerFocusables() {
      return this.shadowRoot.querySelectorAll('[tabindex]') || [];
    }

    /**
     *
     * @return HTMLElement || null
     * @private
     */
    get _firstInnerFocusable() {
      return this.shadowRoot.querySelector('[tabindex]');
    }

    /**
     *
     * @param evt Event (mousedown/touchstart)
     * @private
     */
    _onTap(evt) {
      if (evt.target !== this) {
        this.blur();
      }
    }

    /**
     *
     * @param evt Event (FocusEvent)
     * @private
     */
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
      if (this._sideEffectsAppliedFor === 'disabled') return;
      this._lastTabIndexValue = this.getAttribute('tabindex');
      this.removeAttribute('tabindex');
      this._innerFocusables.forEach(innerFocusable => {
        innerFocusable.setAttribute('tabindex', '-1');
        innerFocusable.setAttribute('disabled', 'disabled');
        if (innerFocusable.hasAttribute('contenteditable')) {
          innerFocusable.setAttribute('contenteditable', 'false');
        }
      });
      this.blur();
      this._sideEffectsAppliedFor = 'disabled';
    }

    _applyEnabledSideEffects() {
      if (this._sideEffectsAppliedFor === 'enabled') return;
      !this.getAttribute('tabindex') && this.setAttribute('tabindex', this._lastTabIndexValue || 0);
      this._innerFocusables.forEach(innerFocusable => {
        innerFocusable.setAttribute('tabindex', '0');
        innerFocusable.removeAttribute('disabled');
        if (innerFocusable.hasAttribute('contenteditable')) {
          innerFocusable.setAttribute('contenteditable', 'true');
        }
      });
      this._sideEffectsAppliedFor = 'enabled';
    }
  }

  return Focusable;
}

},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const DBUICommonCssVars = `
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

exports.default = DBUICommonCssVars;

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDBUIWebComponentCore;

var _ensureSingleRegistration = require('../../../internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

var _DBUICommonCssVars = require('./DBUICommonCssVars');

var _DBUICommonCssVars2 = _interopRequireDefault(_DBUICommonCssVars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const registrationName = 'DBUIWebComponentBase';

function defineCommonCSSVars(win) {
  const { document } = win;
  const commonStyle = document.createElement('style');
  commonStyle.setAttribute('dbui-common-css-vars', '');
  commonStyle.innerHTML = _DBUICommonCssVars2.default;
  document.querySelector('head').appendChild(commonStyle);
}

/*
Accessing parents and children:
If parent is accessed in connectedCallback it exists (if it should exist), however,
the parent might not be itself connected yet.
If children are accessed in connectedCallback they might not be complete yet at that time.
*/

// https://www.kirupa.com/html5/handling_events_for_many_elements.htm
/**
 *
 * @param win Window
 * @return {
 *   DBUIWebComponentBase,
 *   defineCommonStaticMethods,
 *   Registerable
 * }
 */
function getDBUIWebComponentCore(win) {
  return (0, _ensureSingleRegistration2.default)(win, registrationName, () => {
    defineCommonCSSVars(win);

    const { document, HTMLElement, customElements } = win;

    class DBUIWebComponentBase extends HTMLElement {

      /**
       *
       * @return String
       */
      static get registrationName() {
        throw new Error('registrationName must be defined in derived classes');
      }

      /**
       *
       * @return String HTML
       */
      static get templateInnerHTML() {
        return '<style></style><slot></slot>';
      }

      /**
       *
       * @return Array<DBUIWebComponent>
       */
      static get dependencies() {
        return [];
      }

      /**
       *
       * @return Array<String>
       */
      static get propertiesToUpgrade() {
        return [];
      }

      /**
       *
       * @return Object { String, String }
       */
      static get attributesToDefine() {
        return { 'dbui-web-component': '' };
      }

      /**
       *
       * @return Array<String>
       */
      static get observedAttributes() {
        // web components standard API
        return ['dir', 'lang', 'sync-locale-with'];
      }

      /**
       *
       * @return Boolean
       */
      get isMounted() {
        return this._isMounted;
      }

      /**
       *
       * @return Boolean
       */
      get isDisconnected() {
        // We need isDisconnected info when DOM tree is constructed
        // - after constructor() and before connectedCallback() -
        // when closestDbuiParent should not return null.
        return this._isDisconnected;
      }

      constructor(...args) {
        super();

        this.attachShadow({
          mode: 'open'
          // delegatesFocus: true
          // Not working on IPad so we do an workaround
          // by setting "focused" attribute when needed.
        });

        this._propagatingContext = false;
        this._providingContext = {};
        this._lastReceivedContext = {};
        this._closestDbuiParent = null;
        this._closestDbuiChildren = [];
        this._isMounted = false;
        this._isDisconnected = false;
        this._localeObserver = null;
        this._insertTemplate();

        this.connectedCallback = this.connectedCallback.bind(this);
        this.disconnectedCallback = this.disconnectedCallback.bind(this);
        this.attributeChangedCallback = this.attributeChangedCallback.bind(this);
        this.adoptedCallback = this.adoptedCallback.bind(this);

        // provide support for traits if any as they can't override constructor
        this.init && this.init(...args);
      }

      // ============================ [Locale] >> =============================================

      /**
       *
       * @return HTMLElement
       * @private
       */
      get _localeTarget() {
        const target = document.querySelector(this.getAttribute('sync-locale-with'));
        const defaultTarget = document.querySelector('html');
        return target || defaultTarget;
      }

      /**
       *
       * @return Object { dir, lang }
       * @private
       */
      get _targetedLocale() {
        // Return locale from target
        const target = this._localeTarget;
        return {
          dir: target.getAttribute('dir') || 'ltr',
          lang: target.getAttribute('lang') || 'en'
        };
      }

      _resetProvidedLocale() {
        // Called onDisconnectedCallback.
        //
        // dbuiDir/Lang dbui-dir/lang can be set
        // as a result of attributeChangedCallback
        // or as a result of syncing with (or monitoring) locale target (_syncLocaleAndMonitorChanges).
        // We can remove them if they were set
        // as a result of _syncLocaleAndMonitorChanges
        // because when this node will be re-inserted
        // the syncing will happen again and dbui-dir/lang attrs and dbuiDir/Lang provided context will be set again.
        // But we can't delete them if they were set onAttributeChangedCallback
        // because that will not be fired again when node is moved in other part of the DOM.
        if (!this.getAttribute('dir')) {
          // We know that locale props/attrs were set
          // as a result of locale syncing
          // and we can reset locale from _providingContext.
          delete this._providingContext.dbuiDir; // affects context providers / no effect on context receivers
          this.removeAttribute('dbui-dir'); // affects providers and receivers
        }

        if (!this.getAttribute('lang')) {
          delete this._providingContext.dbuiLang;
          this.removeAttribute('dbui-lang');
        }

        if (this._localeObserver) {
          this._localeObserver.disconnect();
          this._localeObserver = null;
        }
      }

      /**
       *
       * @param newContext Object
       * @param prevContext Object
       * @private
       */
      // eslint-disable-next-line
      _onLocaleContextChanged(newContext, prevContext) {
        // If we are monitoring locale from elsewhere discard this notification.
        if (this._localeObserver) return;
        const {
          dbuiDir, dbuiLang
        } = newContext;
        // changes done by attributeChangedCallback(dir/lang) takes precedence over onContextChanged
        !this.getAttribute('dir') && this.setAttribute('dbui-dir', dbuiDir);
        !this.getAttribute('lang') && this.setAttribute('dbui-lang', dbuiLang);
      }

      /**
       *
       * @param name String
       * @param oldValue String
       * @param newValue String
       * @private
       */
      _onLocaleAttributeChangedCallback(name, oldValue, newValue) {
        // If locale value is truthy, set it (on context too)
        // else read value from _targetedLocale
        // or from closestDbuiParent context.
        if (!['dir', 'lang', 'sync-locale-with'].includes(name)) return;

        if (name === 'sync-locale-with') {
          // stop monitoring old target and start monitoring new target
          this._syncLocaleAndMonitorChanges();
          return;
        }

        const contextKey = name === 'dir' ? 'dbuiDir' : 'dbuiLang';
        const hasLocaleSync = !!this.hasAttribute('sync-locale-with');
        const closestDbuiParent = this.closestDbuiParent;
        const isTopDbuiAncestor = !closestDbuiParent;
        const targetedLocale = hasLocaleSync || isTopDbuiAncestor ? this._targetedLocale : null;
        const valueToSet = newValue || targetedLocale && targetedLocale[name] || closestDbuiParent._getContext([contextKey])[contextKey];

        if (newValue || targetedLocale) {
          this.setAttribute(`dbui-${name}`, valueToSet);
          this.setContext({
            [contextKey]: valueToSet
          });
          targetedLocale && this._watchLocaleChanges();
        } else {
          this._resetProvidedLocale();
          this._unsetAndRelinkContext(contextKey);
        }
      }

      _syncLocaleAndMonitorChanges() {
        // Called onConnectedCallback and _onLocaleAttributeChangedCallback (only for sync-locale-with).
        //
        // If being top most dbui ancestor or having attr "sync-locale-with" defined,
        // read locale from target, set values on context
        // then watch for locale changes on target.
        const isDescendantDbui = !!this.closestDbuiParent;
        const hasLocaleSync = !!this.hasAttribute('sync-locale-with');
        if (isDescendantDbui && !hasLocaleSync) return;

        const { dir: targetedDir, lang: targetedLang } = this._targetedLocale;
        const selfDir = this.getAttribute('dir');
        const selfLang = this.getAttribute('lang');
        const newDir = selfDir || targetedDir;
        const newLang = selfLang || targetedLang;

        this.setAttribute('dbui-dir', newDir);
        this.setAttribute('dbui-lang', newLang);

        this.setContext({
          dbuiDir: newDir,
          dbuiLang: newLang
        });

        this._watchLocaleChanges();
      }

      _watchLocaleChanges() {
        // Called from _syncLocaleAndMonitorChanges and _onLocaleAttributeChangedCallback (only for dir/lang).
        if (this._localeObserver) {
          this._localeObserver.disconnect();
        }

        const localeTarget = this._localeTarget;

        this._localeObserver = new MutationObserver(mutations => {
          mutations.forEach(mutation => {
            const attr = mutation.attributeName;
            const value = this._targetedLocale[attr];
            const attrKey = `dbui-${attr}`;
            const contextKey = `dbui${attr.charAt(0).toUpperCase() + attr.slice(1)}`;

            this.setAttribute(attrKey, value);
            this.setContext({
              [contextKey]: value
            });
          });
        });

        this._localeObserver.observe(localeTarget, {
          attributes: true,
          attributeFilter: ['dir', 'lang']
        });
      }

      // ============================ << [Locale]  =============================================

      // ============================ [Context] >> =============================================

      /**
       *
       * @return Array<String>
       */
      static get contextProvide() {
        return ['dbuiDir', 'dbuiLang'];
      }

      /**
       *
       * @return Array<String>
       */
      static get contextSubscribe() {
        return ['dbuiDir', 'dbuiLang'];
      }

      /**
       *
       * @param key String
       * @return Boolean
       * @private
       */
      _providesContextFor(key) {
        return this.constructor.contextProvide.some(_key => _key === key);
      }

      /**
       *
       * @param key String
       * @return Boolean
       * @private
       */
      _hasValueForContext(key) {
        return this._providingContext[key] !== undefined;
      }

      /**
       *
       * @param key String
       * @return Boolean
       * @private
       */
      _subscribesForContext(key) {
        return this.constructor.contextSubscribe.some(_key => _key === key);
      }

      /**
       *
       * @param contextObj Object
       */
      setContext(contextObj) {
        const newKeys = Object.keys(contextObj).filter(key => {
          return this._providesContextFor(key);
        });

        const contextToSet = newKeys.reduce((acc, key) => {
          acc[key] = contextObj[key];
          return acc;
        }, {});

        const newProvidingContext = Object.assign({}, this._providingContext, contextToSet);

        this._providingContext = newProvidingContext;

        if (this._propagatingContext) return;

        this._propagateContextChanged(this._providingContext);
      }

      /**
       *
       * @param newContext Object
       */
      _propagateContextChanged(newContext) {
        this._propagatingContext = true;
        const newContextKeys = Object.keys(newContext);

        // if context is received from ancestors
        if (newContext !== this._providingContext) {
          // makes self aware
          const keysSubscribedFor = newContextKeys.reduce((acc, key) => {
            this._subscribesForContext(key) && acc.push(key);
            return acc;
          }, []);

          if (keysSubscribedFor.length) {
            const contextSubscribedFor = keysSubscribedFor.reduce((acc, key) => {
              acc[key] = newContext[key];
              return acc;
            }, {});
            this._onContextChanged(contextSubscribedFor);
            // At this point user might have call setContext inside onContextChanged
            // in which case _providingContext is updated with latest values.
          }
        }

        // propagate with overrides
        // If user called setContext() from within onContextChanged() then
        // this._providingContext has the newest values to be propagated
        const overriddenContext = this.constructor.contextProvide.reduce((acc, key) => {
          if (this._hasValueForContext(key)) {
            acc[key] = this._providingContext[key];
          }
          return acc;
        }, {});

        const contextToPropagate = Object.assign({}, newContext, overriddenContext);

        // children that will mount later will ask for context (_checkContext)
        this.closestDbuiChildren.forEach(child => {
          child._propagateContextChanged(contextToPropagate);
        });
        this._propagatingContext = false;
      }

      /**
       * Resets _lastReceivedContext and _providingContext,
       * looks up for new value on closestDbuiParent context
       * and propagates that to self and ancestors.
       *
       * @param contextKey String | Array<String>
       * @private
       */
      _unsetAndRelinkContext(contextKey) {
        const contextKeys = Array.isArray(contextKey) ? contextKey : [contextKey];

        contextKeys.forEach(key => {
          delete this._lastReceivedContext[key];
          delete this._providingContext[key];
        });

        const closestDbuiParent = this.closestDbuiParent;
        const valuesToSet = !closestDbuiParent ? undefined : closestDbuiParent._getContext(contextKeys);

        const newContext = contextKeys.reduce((acc, key) => {
          acc[key] = (valuesToSet || {})[key];
          return acc;
        }, {});

        this._propagateContextChanged(newContext);
      }

      /**
       *
       * @param keys Array<String>
       * @return Object
       * @private
       */
      _getContext(keys) {
        // This must run always in the parent of the node asking for context
        // and not in the node itself.
        const ownedKeys = [];
        const keysToAskFor = [];
        keys.forEach(key => {
          if (this._hasValueForContext(key)) {
            ownedKeys.push(key);
          } else {
            keysToAskFor.push(key);
          }
        });
        const closestDbuiParent = this.closestDbuiParent;
        return Object.assign({}, ownedKeys.reduce((acc, key) => {
          acc[key] = this._providingContext[key];
          return acc;
        }, {}), closestDbuiParent ? closestDbuiParent._getContext(keysToAskFor) : {});
      }

      /**
       *
       * @param newContext Object
       * @param options { reset = false }
       * @private
       */
      _onContextChanged(newContext, { reset = false } = {}) {
        // Might be fired more than once until DOM tree settles down.
        // ex: first call is the result of _checkContext which might get the top most existing context.
        // The next ones can be the result of middle ancestors firing attributeChangeCallback
        // which might set their context and propagate it down.
        const lastReceivedContext = this._lastReceivedContext;
        const newContextFilteredKeys = Object.keys(newContext || {}).filter(key => {
          return newContext[key] !== lastReceivedContext[key];
        });
        // Prevents triggering onContextChanged against a context found on some ancestor
        // which did not managed yet to setup its context
        // due to for example attributeChangedCallback did not fired on that ancestor yet.
        if (!newContextFilteredKeys.length && !reset) return;
        const newContextFiltered = newContextFilteredKeys.reduce((acc, key) => {
          acc[key] = newContext[key];
          return acc;
        }, {});
        const contextToSet = reset ? {} : Object.assign({}, lastReceivedContext, newContextFiltered);
        this._lastReceivedContext = contextToSet;
        const [_newContext, _prevContext] = [this._lastReceivedContext, lastReceivedContext];
        this._onLocaleContextChanged(_newContext, _prevContext);
        this.onContextChanged(_newContext, _prevContext);
      }

      /**
       * Public hook.
       *
       * @param newContext Object
       * @param prevContext Object
       */
      // eslint-disable-next-line
      onContextChanged(newContext, prevContext) {
        // pass
      }

      _checkContext() {
        // _checkContext can propagate recursively to the very top even if ancestors are not connected.
        // If there is context defined somewhere upstream then it will be reached by descendants.
        const closestDbuiParent = this.closestDbuiParent;
        // no need to check context if is top most dbui ancestor
        if (!closestDbuiParent) return;

        const newContext = closestDbuiParent._getContext(this.constructor.contextSubscribe);
        this._onContextChanged(newContext);
        // No need to propagate to the children because they can search upward for context
        // until top of the tree is reached, even if ancestors are not connected yet.
        // If some middle ancestor has context to provide and did not managed to provide it yet
        // (ex: attributeChangedCallback not fired before descendants looked for upstream context)
        // then descendants will receive first context from upstream then from middle ancestor.
        // This was verified!
      }

      _resetContext() {
        // this._providingContext is NOT reset from component providing context
        // because if context is dependent on attributeChangedCallback
        // that will not fire when component is moved from one place to another place in DOM tree.
        const closestDbuiParent = this.closestDbuiParent;
        // Checking closestDbuiParent to be symmetric with _checkContext
        // or we'll end up with empty context object after reset,
        // when it initially was undefined.
        if (closestDbuiParent) {
          this._onContextChanged(null, { reset: true });
        }
      }

      // ============================ << [Context] =============================================

      // ============================ [Descendants/Ancestors and registrations] >> =============================================

      /**
       *
       * @param callback Function
       * @return HTMLElement
       */
      getClosestAncestorMatchingCondition(callback) {
        let closestAncestor = this.parentElement;
        while (closestAncestor && !callback(closestAncestor)) {
          closestAncestor = closestAncestor.parentElement;
        }
        return closestAncestor;
      }

      /**
       *
       * @return Array<DBUIWebComponent>
       */
      get shadowDomDbuiChildren() {
        // children in slots are NOT included here
        return [...this.shadowRoot.querySelectorAll('[dbui-web-component]')];
      }

      /**
       *
       * @return DBUIWebComponent | null
       */
      get shadowDomDbuiParent() {
        return this.getRootNode().host || null;
      }

      /**
       *
       * @return DBUIWebComponent | null
       */
      get lightDomDbuiParent() {
        // can return a parent which is in shadow DOM of the grand-parent
        let parent = this.parentElement;
        while (parent && !parent.hasAttribute('dbui-web-component')) {
          parent = parent.parentElement;
        }
        return parent || null;
      }

      /**
       *
       * @return Array<DBUIWebComponent>
       */
      get lightDomDbuiChildren() {
        // children in slots ARE included here
        return [...this.querySelectorAll('[dbui-web-component]')];
      }

      /**
       *
       * @return DBUIWebComponent | null
       */
      get closestDbuiParentLiveQuery() {
        let closestParent = this.parentElement;
        // might be null if disconnected from dom
        if (closestParent === null) {
          return null;
        }
        closestParent = closestParent.closest('[dbui-web-component]');
        return closestParent || this.shadowDomDbuiParent;
      }

      /**
       *
       * @return DBUIWebComponent | null
       */
      get closestDbuiParent() {
        // cached
        // Reason for cache is to allow a child to unregister from its parent when unmounted
        // because when browser calls disconnectedCallback the parent is not reachable anymore.
        // If parent could not be reachable it could not unregister its closest children
        // thus leading to memory leak.
        if (this._closestDbuiParent) {
          return this._closestDbuiParent;
        }
        if (this.isDisconnected) return null;
        this._closestDbuiParent = this.closestDbuiParentLiveQuery;
        return this._closestDbuiParent;
      }

      /**
       *
       * @return DBUIWebComponent | null
       */
      // might be useful in some scenarios
      get topDbuiAncestor() {
        let closestDbuiParent = this.closestDbuiParent;
        while (closestDbuiParent) {
          const _closestDbuiParent = closestDbuiParent.closestDbuiParent;
          if (!_closestDbuiParent) {
            return closestDbuiParent;
          }
          closestDbuiParent = _closestDbuiParent;
        }
        return closestDbuiParent; // this is null
      }

      /**
       *
       * @return Array<DBUIWebComponent>
       */
      // might be useful in some scenarios
      get closestDbuiChildrenLiveQuery() {
        const dbuiChildren = [...this.lightDomDbuiChildren, ...this.shadowDomDbuiChildren];
        const closestDbuiChildren = dbuiChildren.filter(child => child.closestDbuiParentLiveQuery === this);
        return closestDbuiChildren;
      }

      /**
       *
       * @return Array<DBUIWebComponent>
       */
      get closestDbuiChildren() {
        return this._closestDbuiChildren;
      }

      _registerSelfToClosestDbuiParent() {
        const closestDbuiParent = this.closestDbuiParent;
        if (!closestDbuiParent) return;
        closestDbuiParent._registerChild(this);
      }

      _unregisterSelfFromClosestDbuiParent() {
        const closestDbuiParent = this.closestDbuiParent;
        if (!closestDbuiParent) return;
        closestDbuiParent._unregisterChild(this);
      }

      /**
       *
       * @param child DBUIWebComponent
       * @private
       */
      _registerChild(child) {
        this._closestDbuiChildren.push(child);
      }

      /**
       *
       * @param child DBUIWebComponent
       * @private
       */
      _unregisterChild(child) {
        this._closestDbuiChildren = this._closestDbuiChildren.filter(_child => _child !== child);
      }

      // ============================ << [Descendants/Ancestors and registrations] =============================================


      /**
       *
       * @param prop String
       * @private
       */
      _upgradeProperty(prop) {
        // https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
        // https://developers.google.com/web/fundamentals/web-components/examples/howto-checkbox
        /* eslint no-prototype-builtins: 0 */
        if (this.hasOwnProperty(prop)) {
          const value = this[prop];
          // get rid of the property that might shadow a setter/getter
          delete this[prop];
          // this time if a setter was defined it will be properly called
          this[prop] = value;
          // if a getter was defined, it will be called from now on
        }
      }

      /**
       *
       * @param key String
       * @param value String
       * @private
       */
      _defineAttribute(key, value) {
        // don't override user defined attribute
        if (!this.hasAttribute(key)) {
          this.setAttribute(key, value);
        }
      }

      _insertTemplate() {
        const { template } = this.constructor;
        template && this.shadowRoot.appendChild(template.content.cloneNode(true));
      }

      /**
       *
       * @param oldDocument HTMLDocument
       * @param newDocument HTMLDocument
       */
      adoptedCallback(oldDocument, newDocument) {
        // web components standard API
        // callbacks order:
        // disconnectedCallback => adoptedCallback => connectedCallback
        this._onAdoptedCallback(oldDocument, newDocument);
      }

      /**
       *
       * @param oldDocument HTMLDocument
       * @param newDocument HTMLDocument
       * @private
       */
      _onAdoptedCallback(oldDocument, newDocument) {
        // Call public hook.
        this.onAdoptedCallback(oldDocument, newDocument);
      }

      /**
       * Public hook.
       *
       * @param oldDocument HTMLDocument
       * @param newDocument HTMLDocument
       */
      // eslint-disable-next-line
      onAdoptedCallback(oldDocument, newDocument) {}
      // pass


      /*
      * web components standard API
      * connectedCallback is fired from children to parent in shadow DOM
      * but the order is less predictable in light DOM.
      * Should not read light/shadowDomDbuiChildren here.
      * Is called after attributeChangedCallback.
      * */
      connectedCallback() {
        // Using this pattern as it seems that the component
        // is immune to overriding connectedCallback at runtime.
        // Most probably the browser keeps a reference to connectedCallback
        // existing/defined at the time of upgrading and calls that one instead of the
        // latest (monkey patched / runtime evaluated) one.
        // Now, we can monkey patch onConnectedCallback if we want.
        this._onConnectedCallback();
      }

      /**
       * @private
       */
      _onConnectedCallback() {
        this._isMounted = true;
        this._isDisconnected = false;
        win.addEventListener('beforeunload', this.disconnectedCallback, false);
        const { propertiesToUpgrade, attributesToDefine } = this.constructor;
        propertiesToUpgrade.forEach(property => {
          this._upgradeProperty(property);
        });
        Object.keys(attributesToDefine).forEach(property => {
          this._defineAttribute(property, attributesToDefine[property]);
        });
        // We can safely register to closestDbuiParent because it exists at this time
        // but we must not assume it was connected.
        // NOTE: even if closestDbuiParent (or any ancestor) is not connected
        // the top of the tree (topDbuiAncestor) can be reached if needed
        this._registerSelfToClosestDbuiParent();
        this._checkContext(); // is ignored by top most dbui ancestors
        // makes top most ancestors or dbui components having localeTarget specified
        // to set dbuiDir/Locale on context
        this._syncLocaleAndMonitorChanges();
        // Call public hook.
        this.onConnectedCallback();
      }

      /**
       * Public hook.
       */
      onConnectedCallback() {}
      // pass


      // web components standard API
      disconnectedCallback() {
        this._onDisconnectedCallback();
      }

      /**
       * @private
       */
      _onDisconnectedCallback() {
        this._resetContext();
        this._resetProvidedLocale();
        this._unregisterSelfFromClosestDbuiParent();
        win.removeEventListener('beforeunload', this.disconnectedCallback, false);
        this._isMounted = false;
        this._isDisconnected = true;
        this._closestDbuiParent = null;
        // Call public hook.
        this.onDisconnectedCallback();
      }

      /**
       * Public hook.
       */
      onDisconnectedCallback() {
        // pass
      }

      cloneNodeDeep({ idPrefix = '', idSuffix = '' }) {
        const clone = super.cloneNode(true);
        if (!idPrefix && !idSuffix) return clone;
        if (clone.hasAttribute('id')) {
          clone.setAttribute('id', `${idPrefix}${clone.getAttribute('id')}${idSuffix}`);
        }
        clone.querySelectorAll('[dbui-web-component]').forEach(child => {
          if (child.hasAttribute('id')) {
            child.setAttribute('id', `${idPrefix}${child.getAttribute('id')}${idSuffix}`);
          }
        });
        return clone;
      }

      /**
       *
       * @param name String
       * @param oldValue String
       * @param newValue String
       */
      attributeChangedCallback(name, oldValue, newValue) {
        // web components standard API
        // Scenario 1: component was created in detached tree BEFORE being defined.
        // attributeChangedCallback will not be called when being defined but when inserted into DOM.
        // (this implies component is upgraded after being inserted into DOM).
        // Scenario 2: component is created in detached tree AFTER being defined.
        // attributeChangedCallback will be called right away
        // (this implies component is upgraded before being inserted into DOM).
        // When inserted in DOM then connectedCallback will be called.
        // In any case attributeChangedCallback is called before connectedCallback.
        // Things changed as a result of attributeChangedCallback should be preserved
        // when disconnectedCallback because these attribute changes will not be fired again
        // when node is removed then re-inserted back in the DOM tree.
        if (this.getAttribute(name) === oldValue) return;
        this._onAttributeChangedCallback(name, oldValue, newValue);
      }

      /**
       *
       * @param name String
       * @param oldValue String
       * @param newValue String
       * @private
       */
      _onAttributeChangedCallback(name, oldValue, newValue) {
        this._onLocaleAttributeChangedCallback(name, oldValue, newValue);
        // Call public hook.
        this.onAttributeChangedCallback(name, oldValue, newValue);
      }

      /**
       * Public hook.
       *
       * @param name String
       * @param oldValue String
       * @param newValue String
       */
      // eslint-disable-next-line
      onAttributeChangedCallback(name, oldValue, newValue) {
        // pass
      }
    }

    /**
     * @param klass Class
     */
    function defineCommonStaticMethods(klass) {
      const templateInnerHTML = klass.templateInnerHTML;
      const template = document.createElement('template');
      template.innerHTML = templateInnerHTML;

      /**
       * @property template (getter) template element
       */
      Object.defineProperty(klass, 'template', {
        get() {
          return template;
        },
        enumerable: false,
        configurable: true
      });

      /**
       * @property componentStyle (getter/setter) String
       */
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
        // https://html.spec.whatwg.org/multipage/custom-elements.html#concept-upgrade-an-element
        customElements.define(registrationName, klass);
        return registrationName;
      };

      /**
       * @property prototypeChainInfo (getter) Array<Prototype>
       */
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

},{"../../../internals/ensureSingleRegistration":3,"./DBUICommonCssVars":11}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDBUIWebComponentDummy;

var _DBUIWebComponentCore = require('../DBUIWebComponentCore/DBUIWebComponentCore');

var _DBUIWebComponentCore2 = _interopRequireDefault(_DBUIWebComponentCore);

var _ensureSingleRegistration = require('../../../internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const registrationName = 'dbui-web-component-dummy';

function getDBUIWebComponentDummy(win) {
  return (0, _ensureSingleRegistration2.default)(win, registrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = (0, _DBUIWebComponentCore2.default)(win);

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

},{"../../../internals/ensureSingleRegistration":3,"../DBUIWebComponentCore/DBUIWebComponentCore":12}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDBUIWebComponentDummyParent;

var _DBUIWebComponentCore = require('../DBUIWebComponentCore/DBUIWebComponentCore');

var _DBUIWebComponentCore2 = _interopRequireDefault(_DBUIWebComponentCore);

var _DBUIWebComponentDummy = require('../DBUIWebComponentDummy/DBUIWebComponentDummy');

var _DBUIWebComponentDummy2 = _interopRequireDefault(_DBUIWebComponentDummy);

var _ensureSingleRegistration = require('../../../internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const registrationName = 'dbui-web-component-dummy-parent';

function getDBUIWebComponentDummyParent(win) {
  return (0, _ensureSingleRegistration2.default)(win, registrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = (0, _DBUIWebComponentCore2.default)(win);
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

},{"../../../internals/ensureSingleRegistration":3,"../DBUIWebComponentCore/DBUIWebComponentCore":12,"../DBUIWebComponentDummy/DBUIWebComponentDummy":13}],15:[function(require,module,exports){
(function (process){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDBUIWebComponentFormInputText;

var _DBUIWebComponentCore = require('../DBUIWebComponentCore/DBUIWebComponentCore');

var _DBUIWebComponentCore2 = _interopRequireDefault(_DBUIWebComponentCore);

var _ensureSingleRegistration = require('../../../internals/ensureSingleRegistration');

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
    } = (0, _DBUIWebComponentCore2.default)(win);

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

      static get attributesToDefine() {
        return {
          role: 'form-input'
        };
      }

      onLocaleChange(locale) {
        if (process.env.NODE_ENV !== 'production') {
          /* eslint no-console: 0 */
          // console.log('onLocaleChange', locale);
        }
      }

    }

    return Registerable((0, _Focusable2.default)(defineCommonStaticMethods(DBUIWebComponentFormInputText)));
  });
}

getDBUIWebComponentFormInputText.registrationName = registrationName;

}).call(this,require('_process'))

},{"../../../internals/ensureSingleRegistration":3,"../../behaviours/Focusable":10,"../DBUIWebComponentCore/DBUIWebComponentCore":12,"_process":1}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDBUIWebComponentIcon;

var _DBUIWebComponentCore = require('../DBUIWebComponentCore/DBUIWebComponentCore');

var _DBUIWebComponentCore2 = _interopRequireDefault(_DBUIWebComponentCore);

var _ensureSingleRegistration = require('../../../internals/ensureSingleRegistration');

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
    } = (0, _DBUIWebComponentCore2.default)(win);

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
        const path = this.shadowRoot.querySelector('svg g path');
        path.setAttribute('d', this.shape);
      }

      _removeShape() {
        const path = this.shadowRoot.querySelector('svg g path');
        path.setAttribute('d', '');
      }

    }

    return Registerable(defineCommonStaticMethods(DBUIWebComponentIcon));
  });
}

getDBUIWebComponentIcon.registrationName = registrationName;

},{"../../../internals/ensureSingleRegistration":3,"../DBUIWebComponentCore/DBUIWebComponentCore":12}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _appendStyles = require('../../internals/appendStyles');

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

},{"../../internals/appendStyles":2}],"dev-box-ui-core":[function(require,module,exports){
(function (process){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDBUIWebComponentIcon = exports.getDBUIWebComponentFormInputText = exports.getDBUIWebComponentDummyParent = exports.getDBUIWebComponentDummy = exports.onScreenConsole = exports.template = exports.traits = exports.formatters = exports.getDBUII18nService = exports.getDBUILocaleService = exports.Focusable = exports.getDBUIWebComponentCore = exports.ensureSingleRegistration = exports.dbuiWebComponentsSetUp = exports.quickSetupAndLoad = exports.registrations = undefined;

var _dbuiWebComponentsSetup = require('./web-components/helpers/dbuiWebComponentsSetup');

var _dbuiWebComponentsSetup2 = _interopRequireDefault(_dbuiWebComponentsSetup);

var _ensureSingleRegistration = require('./internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

var _DBUIWebComponentCore = require('./web-components/components/DBUIWebComponentCore/DBUIWebComponentCore');

var _DBUIWebComponentCore2 = _interopRequireDefault(_DBUIWebComponentCore);

var _Focusable = require('./web-components/behaviours/Focusable');

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

var _DBUIWebComponentDummy = require('./web-components/components/DBUIWebComponentDummy/DBUIWebComponentDummy');

var _DBUIWebComponentDummy2 = _interopRequireDefault(_DBUIWebComponentDummy);

var _DBUIWebComponentDummyParent = require('./web-components/components/DBUIWebComponentDummyParent/DBUIWebComponentDummyParent');

var _DBUIWebComponentDummyParent2 = _interopRequireDefault(_DBUIWebComponentDummyParent);

var _DBUIWebComponentFormInputText = require('./web-components/components/DBUIWebComponentFormInputText/DBUIWebComponentFormInputText');

var _DBUIWebComponentFormInputText2 = _interopRequireDefault(_DBUIWebComponentFormInputText);

var _DBUIWebComponentIcon = require('./web-components/components/DBUIWebComponentIcon/DBUIWebComponentIcon');

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
If one wants to load just one web-component or a subset of core
they should be loaded from node_modules/dev-box-ui/core by their path
ex:
import SomeComponentLoader from node_modules/dev-box-ui/core/path/to/SomeComponent;
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
exports.getDBUIWebComponentCore = _DBUIWebComponentCore2.default;
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

},{"./internals/ensureSingleRegistration":3,"./services/DBUII18nService":4,"./services/DBUILocaleService":5,"./utils/formatters":6,"./utils/onScreenConsole":7,"./utils/template":8,"./utils/traits":9,"./web-components/behaviours/Focusable":10,"./web-components/components/DBUIWebComponentCore/DBUIWebComponentCore":12,"./web-components/components/DBUIWebComponentDummy/DBUIWebComponentDummy":13,"./web-components/components/DBUIWebComponentDummyParent/DBUIWebComponentDummyParent":14,"./web-components/components/DBUIWebComponentFormInputText/DBUIWebComponentFormInputText":15,"./web-components/components/DBUIWebComponentIcon/DBUIWebComponentIcon":16,"./web-components/helpers/dbuiWebComponentsSetup":17,"_process":1}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwic3JjL2xpYi9jb3JlL2ludGVybmFscy9hcHBlbmRTdHlsZXMuanMiLCJzcmMvbGliL2NvcmUvaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbi5qcyIsInNyYy9saWIvY29yZS9zZXJ2aWNlcy9EQlVJSTE4blNlcnZpY2UuanMiLCJzcmMvbGliL2NvcmUvc2VydmljZXMvREJVSUxvY2FsZVNlcnZpY2UuanMiLCJzcmMvbGliL2NvcmUvdXRpbHMvZm9ybWF0dGVycy5qcyIsInNyYy9saWIvY29yZS91dGlscy9vblNjcmVlbkNvbnNvbGUuanMiLCJzcmMvbGliL2NvcmUvdXRpbHMvdGVtcGxhdGUuanMiLCJzcmMvbGliL2NvcmUvdXRpbHMvdHJhaXRzLmpzIiwic3JjL2xpYi9jb3JlL3dlYi1jb21wb25lbnRzL2JlaGF2aW91cnMvRm9jdXNhYmxlLmpzIiwic3JjL2xpYi9jb3JlL3dlYi1jb21wb25lbnRzL2NvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudENvcmUvREJVSUNvbW1vbkNzc1ZhcnMuanMiLCJzcmMvbGliL2NvcmUvd2ViLWNvbXBvbmVudHMvY29tcG9uZW50cy9EQlVJV2ViQ29tcG9uZW50Q29yZS9EQlVJV2ViQ29tcG9uZW50Q29yZS5qcyIsInNyYy9saWIvY29yZS93ZWItY29tcG9uZW50cy9jb21wb25lbnRzL0RCVUlXZWJDb21wb25lbnREdW1teS9EQlVJV2ViQ29tcG9uZW50RHVtbXkuanMiLCJzcmMvbGliL2NvcmUvd2ViLWNvbXBvbmVudHMvY29tcG9uZW50cy9EQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQvREJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50LmpzIiwic3JjL2xpYi9jb3JlL3dlYi1jb21wb25lbnRzL2NvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudEZvcm1JbnB1dFRleHQvREJVSVdlYkNvbXBvbmVudEZvcm1JbnB1dFRleHQuanMiLCJzcmMvbGliL2NvcmUvd2ViLWNvbXBvbmVudHMvY29tcG9uZW50cy9EQlVJV2ViQ29tcG9uZW50SWNvbi9EQlVJV2ViQ29tcG9uZW50SWNvbi5qcyIsInNyYy9saWIvY29yZS93ZWItY29tcG9uZW50cy9oZWxwZXJzL2RidWlXZWJDb21wb25lbnRzU2V0dXAuanMiLCJzcmMvbGliL3NyYy9saWIvY29yZS9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUN4TEE7Ozs7OztBQU1BLE1BQU0sY0FBZSxHQUFELElBQVMsQ0FBQyxnQkFBRCxFQUFtQixjQUFuQixLQUFzQztBQUNqRSxNQUFJLENBQUMsSUFBSSxpQkFBVCxFQUE0QjtBQUMxQixRQUFJLGlCQUFKLEdBQXdCLEVBQXhCO0FBQ0Q7QUFDRCxNQUFJLGlCQUFKLHFCQUNLLElBQUksaUJBRFQ7QUFFRSxLQUFDLGdCQUFELHFCQUNLLElBQUksaUJBQUosQ0FBc0IsZ0JBQXRCLENBREw7QUFFRTtBQUZGO0FBRkY7QUFPRCxDQVhEOztBQWFBLE1BQU0sZUFBZ0IsR0FBRCxJQUFVLFVBQUQsSUFBZ0I7QUFDNUMsYUFBVyxPQUFYLENBQW1CLENBQUMsRUFBRSxnQkFBRixFQUFvQixjQUFwQixFQUFELEtBQTBDO0FBQzNELGdCQUFZLEdBQVosRUFBaUIsZ0JBQWpCLEVBQW1DLGNBQW5DO0FBQ0QsR0FGRDtBQUdBLFNBQU8sVUFBUDtBQUNELENBTEQ7O2tCQU9lLFk7Ozs7Ozs7O2tCQ2xCUyx3Qjs7QUFQeEI7Ozs7Ozs7QUFPZSxTQUFTLHdCQUFULENBQWtDLEdBQWxDLEVBQXVDLElBQXZDLEVBQTZDLFFBQTdDLEVBQXVEO0FBQ3BFLE1BQUksQ0FBQyxJQUFJLGlCQUFULEVBQTRCO0FBQzFCLFFBQUksaUJBQUosR0FBd0IsRUFBRSxlQUFlLEVBQWpCLEVBQXhCO0FBQ0QsR0FGRCxNQUVPLElBQUksQ0FBQyxJQUFJLGlCQUFKLENBQXNCLGFBQTNCLEVBQTBDO0FBQy9DLFFBQUksaUJBQUosQ0FBc0IsYUFBdEIsR0FBc0MsRUFBdEM7QUFDRDs7QUFFRCxNQUFJLGVBQWUsSUFBSSxpQkFBSixDQUFzQixhQUF0QixDQUFvQyxJQUFwQyxDQUFuQjs7QUFFQSxNQUFJLFlBQUosRUFBa0IsT0FBTyxZQUFQOztBQUVsQixpQkFBZSxVQUFmO0FBQ0EsTUFBSSxpQkFBSixDQUFzQixhQUF0QixDQUFvQyxJQUFwQyxJQUE0QyxZQUE1Qzs7QUFFQSxTQUFPLElBQUksaUJBQUosQ0FBc0IsYUFBdEIsQ0FBb0MsSUFBcEMsQ0FBUDtBQUNEOzs7Ozs7OztrQkNoQnVCLGtCOztBQVB4Qjs7OztBQUNBOzs7Ozs7QUFFQSxNQUFNLFdBQVcsRUFBakI7O0FBRUEsTUFBTSxtQkFBbUIsaUJBQXpCOztBQUVlLFNBQVMsa0JBQVQsQ0FBNEIsR0FBNUIsRUFBaUM7QUFDOUMsUUFBTSxnQkFBZ0IsaUNBQXFCLEdBQXJCLENBQXRCO0FBQ0EsU0FBTyx3Q0FBeUIsR0FBekIsRUFBOEIsZ0JBQTlCLEVBQWdELE1BQU07QUFDM0QsVUFBTSxXQUFOLENBQWtCO0FBQ2hCLG9CQUFjO0FBQ1osc0JBQWMsY0FBZCxDQUE2QixLQUFLLG1CQUFMLENBQXlCLElBQXpCLENBQThCLElBQTlCLENBQTdCO0FBQ0EsYUFBSyxPQUFMLEdBQWUsY0FBYyxNQUE3QjtBQUNBLGFBQUssYUFBTCxHQUFxQixFQUFyQjtBQUNEOztBQUVELDBCQUFvQixNQUFwQixFQUE0QjtBQUMxQixhQUFLLE9BQUwsR0FBZSxNQUFmO0FBQ0Q7O0FBRUQsd0JBQWtCLElBQWxCLEVBQXdCO0FBQ3RCLGVBQU8sS0FBSyxhQUFMLENBQW1CLElBQW5CLENBQVA7QUFDRDs7QUFFRCwyQkFBcUIsWUFBckIsRUFBbUM7QUFDakMsYUFBSyxhQUFMLEdBQXFCLE9BQU8sSUFBUCxDQUFZLFlBQVosRUFBMEIsTUFBMUIsQ0FBaUMsQ0FBQyxHQUFELEVBQU0sSUFBTixLQUFlO0FBQ25FLGNBQUksSUFBSixzQkFDSyxLQUFLLGFBQUwsQ0FBbUIsSUFBbkIsQ0FETCxFQUVLLGFBQWEsSUFBYixDQUZMO0FBSUEsaUJBQU8sR0FBUDtBQUNELFNBTm9CLEVBTWxCLEtBQUssYUFOYSxDQUFyQjtBQU9EOztBQUVELGdCQUFVLEdBQVYsRUFBZTtBQUNiLGVBQU8sS0FBSyx1QkFBTCxDQUE2QixHQUE3QixDQUFQO0FBQ0Q7O0FBRUQsVUFBSSxZQUFKLEdBQW1CO0FBQ2pCLGVBQU8sS0FBSyxhQUFaO0FBQ0Q7O0FBRUQsVUFBSSx1QkFBSixHQUE4QjtBQUM1QixlQUFPLEtBQUssYUFBTCxDQUFtQixLQUFLLE9BQUwsQ0FBYSxJQUFoQyxLQUF5QyxRQUFoRDtBQUNEO0FBbkNlOztBQXNDbEIsVUFBTSxjQUFjLElBQUksV0FBSixFQUFwQjtBQUNBLFdBQU8sV0FBUDtBQUNELEdBekNNLENBQVA7QUEwQ0Q7Ozs7Ozs7O2tCQ3pDdUIsb0I7O0FBVHhCOzs7Ozs7QUFFQSxNQUFNLGdCQUFnQjtBQUNwQixPQUFLLEtBRGU7QUFFcEIsUUFBTTtBQUZjLENBQXRCOztBQUtBLE1BQU0sbUJBQW1CLG1CQUF6Qjs7QUFFZSxTQUFTLG9CQUFULENBQThCLEdBQTlCLEVBQW1DO0FBQ2hELFNBQU8sd0NBQXlCLEdBQXpCLEVBQThCLGdCQUE5QixFQUFnRCxNQUFNO0FBQzNELFVBQU0sYUFBTixDQUFvQjtBQUNsQixvQkFBYztBQUNaLGFBQUssVUFBTCxHQUFrQixFQUFsQjtBQUNBLGFBQUssWUFBTCxHQUFvQixPQUFPLElBQVAsQ0FBWSxhQUFaLENBQXBCO0FBQ0EsYUFBSyxZQUFMLEdBQW9CLElBQUksUUFBSixDQUFhLGFBQWIsQ0FBMkIsc0JBQTNCLEtBQXNELElBQUksUUFBSixDQUFhLGVBQXZGO0FBQ0EsYUFBSyxZQUFMLENBQWtCLE9BQWxCLENBQTJCLElBQUQsSUFBVTtBQUNsQyxjQUFJLENBQUMsS0FBSyxZQUFMLENBQWtCLFlBQWxCLENBQStCLElBQS9CLENBQUwsRUFBMkM7QUFDekMsaUJBQUssWUFBTCxDQUFrQixZQUFsQixDQUErQixJQUEvQixFQUFxQyxjQUFjLElBQWQsQ0FBckM7QUFDRDtBQUNGLFNBSkQ7QUFLQSxhQUFLLE9BQUwsR0FBZSxLQUFLLFlBQUwsQ0FBa0IsTUFBbEIsQ0FBeUIsQ0FBQyxHQUFELEVBQU0sSUFBTixLQUFlO0FBQ3JELGNBQUksSUFBSixJQUFZLEtBQUssWUFBTCxDQUFrQixZQUFsQixDQUErQixJQUEvQixDQUFaO0FBQ0EsaUJBQU8sR0FBUDtBQUNELFNBSGMsRUFHWixFQUhZLENBQWY7QUFJQSxhQUFLLFNBQUwsR0FBaUIsSUFBSSxnQkFBSixDQUFxQixLQUFLLGdCQUFMLENBQXNCLElBQXRCLENBQTJCLElBQTNCLENBQXJCLENBQWpCO0FBQ0EsYUFBSyxTQUFMLENBQWUsT0FBZixDQUF1QixLQUFLLFlBQTVCLEVBQTBDO0FBQ3hDLHNCQUFZO0FBRDRCLFNBQTFDO0FBR0Q7O0FBRUQsdUJBQWlCLFNBQWpCLEVBQTRCO0FBQzFCLGtCQUFVLE9BQVYsQ0FBbUIsUUFBRCxJQUFjO0FBQzlCLGdCQUFNLHdCQUF3QixTQUFTLGFBQXZDO0FBQ0EsY0FBSSxLQUFLLFlBQUwsQ0FBa0IsUUFBbEIsQ0FBMkIscUJBQTNCLENBQUosRUFBdUQ7QUFDckQsaUJBQUssT0FBTCxxQkFDSyxLQUFLLE9BRFY7QUFFRSxlQUFDLHFCQUFELEdBQXlCLEtBQUssWUFBTCxDQUFrQixZQUFsQixDQUErQixxQkFBL0I7QUFGM0I7QUFJQSxpQkFBSyxVQUFMLENBQWdCLE9BQWhCLENBQXdCLFlBQVksU0FBUyxLQUFLLE9BQWQsQ0FBcEM7QUFDRDtBQUNGLFNBVEQ7QUFVRDs7QUFFRCxVQUFJLE1BQUosQ0FBVyxTQUFYLEVBQXNCO0FBQ3BCLGVBQU8sSUFBUCxDQUFZLFNBQVosRUFBdUIsT0FBdkIsQ0FBZ0MsR0FBRCxJQUFTO0FBQ3RDLGVBQUssWUFBTCxDQUFrQixZQUFsQixDQUErQixHQUEvQixFQUFvQyxVQUFVLEdBQVYsQ0FBcEM7QUFDRCxTQUZEO0FBR0Q7O0FBRUQsVUFBSSxNQUFKLEdBQWE7QUFDWCxlQUFPLEtBQUssT0FBWjtBQUNEOztBQUVELHFCQUFlLFFBQWYsRUFBeUI7QUFDdkIsYUFBSyxVQUFMLENBQWdCLElBQWhCLENBQXFCLFFBQXJCO0FBQ0EsaUJBQVMsS0FBSyxNQUFkO0FBQ0EsZUFBTyxNQUFNO0FBQ1gsZUFBSyxVQUFMLEdBQWtCLEtBQUssVUFBTCxDQUFnQixNQUFoQixDQUF1QixNQUFNLE9BQU8sUUFBcEMsQ0FBbEI7QUFDRCxTQUZEO0FBR0Q7QUFqRGlCOztBQW9EcEIsVUFBTSxnQkFBZ0IsSUFBSSxhQUFKLEVBQXRCO0FBQ0EsV0FBTyxhQUFQO0FBQ0QsR0F2RE0sQ0FBUDtBQXdERDs7Ozs7Ozs7QUNuRUQ7O0FBRUE7Ozs7O0FBS0EsTUFBTSxhQUFhLENBQUMsRUFBRSxXQUFXLEdBQWIsS0FBcUIsRUFBdEIsS0FBOEIsS0FBRCxJQUFXO0FBQ3pELFFBQU0sbUJBQW1CLElBQUksTUFBSixDQUFZLEtBQUksUUFBUyxFQUF6QixFQUE0QixHQUE1QixDQUF6QjtBQUNBLFFBQU0saUNBQWlDLElBQUksTUFBSixDQUFZLFFBQU8sUUFBUyxHQUE1QixFQUFnQyxHQUFoQyxDQUF2QztBQUNBLFFBQU0sK0JBQStCLElBQUksTUFBSixDQUFZLE9BQU0sUUFBUyxPQUEzQixFQUFtQyxFQUFuQyxDQUFyQztBQUNBLFFBQU0saUJBQWlCLElBQUksTUFBSixDQUFXLFNBQVgsRUFBc0IsRUFBdEIsQ0FBdkI7QUFDQSxRQUFNLE9BQU8sSUFBSSxNQUFKLENBQVcsTUFBWCxFQUFtQixFQUFuQixDQUFiO0FBQ0EsUUFBTSxXQUFXLElBQUksTUFBSixDQUFXLFFBQVgsRUFBcUIsRUFBckIsQ0FBakI7QUFDQSxRQUFNLHFCQUFxQixJQUFJLE1BQUosQ0FBVyxNQUFYLEVBQW1CLEVBQW5CLENBQTNCOztBQUVBLE1BQUksYUFBYSxLQUFqQjtBQUNBLFFBQU0sZUFBZSxXQUFXLE9BQVgsQ0FBbUIsUUFBbkIsQ0FBckI7QUFDQSxRQUFNLG1CQUFtQixXQUFXLFdBQVgsQ0FBdUIsUUFBdkIsQ0FBekI7QUFDQSxRQUFNLHNCQUFzQixpQkFBaUIsZ0JBQTdDOztBQUVBLE1BQUksbUJBQUosRUFBeUI7QUFDdkIsaUJBQWMsR0FBRSxXQUFXLE9BQVgsQ0FBbUIsZ0JBQW5CLEVBQXFDLEVBQXJDLENBQXlDLEdBQUUsUUFBUyxFQUFwRTtBQUNEOztBQUVELE1BQUksWUFBWSxXQUFXLENBQVgsS0FBaUIsRUFBakM7QUFDQSxNQUFJLFdBQVcsQ0FBQyxXQUFXLE1BQVgsR0FBb0IsQ0FBcEIsR0FBd0IsV0FBVyxXQUFXLE1BQVgsR0FBb0IsQ0FBL0IsQ0FBeEIsR0FBNEQsRUFBN0QsS0FBb0UsRUFBbkY7QUFDQSxNQUFJLGNBQWMsV0FBVyxNQUFYLENBQWtCLENBQWxCLEVBQXFCLFdBQVcsTUFBWCxHQUFvQixDQUF6QyxLQUErQyxFQUFqRTs7QUFFQSxNQUFJLENBQUMsVUFBVSxLQUFWLENBQWdCLGNBQWhCLENBQUwsRUFBc0M7QUFDcEMsZ0JBQVksRUFBWjtBQUNEOztBQUVELGdCQUFjLFlBQVksT0FBWixDQUFvQiw4QkFBcEIsRUFBb0QsRUFBcEQsQ0FBZDs7QUFFQSxNQUFJLENBQUMsU0FBUyxLQUFULENBQWUsNEJBQWYsQ0FBTCxFQUFtRDtBQUNqRCxlQUFXLEVBQVg7QUFDRCxHQUZELE1BRU8sSUFBSSxTQUFTLEtBQVQsQ0FBZSxRQUFmLENBQUosRUFBOEI7QUFDbkMsUUFBSSxnQkFBZ0IsUUFBcEIsRUFBOEI7QUFDNUIsb0JBQWMsRUFBZDtBQUNELEtBRkQsTUFFTyxJQUFJLGdCQUFnQixFQUFoQixJQUFzQixVQUFVLEtBQVYsQ0FBZ0IsSUFBaEIsQ0FBMUIsRUFBaUQ7QUFDdEQsaUJBQVcsRUFBWDtBQUNEO0FBQ0YsR0FOTSxNQU1BLElBQUksYUFBYSxRQUFiLElBQXlCLGdCQUFnQixFQUF6QyxJQUErQyxVQUFVLEtBQVYsQ0FBZ0IsSUFBaEIsQ0FBbkQsRUFBMEU7QUFDL0UsZUFBVyxFQUFYO0FBQ0Q7O0FBRUQsZUFBYSxDQUFDLFNBQUQsRUFBWSxXQUFaLEVBQXlCLFFBQXpCLEVBQW1DLElBQW5DLENBQXdDLEVBQXhDLENBQWI7O0FBRUEsTUFBSSxTQUFTLEtBQVQsQ0FBZSxRQUFmLENBQUosRUFBOEI7QUFDNUIsaUJBQWEsQ0FDWCxPQUFRLEdBQUUsU0FBVSxHQUFFLFdBQVksRUFBM0IsQ0FBNkIsT0FBN0IsQ0FBcUMsUUFBckMsRUFBK0MsR0FBL0MsQ0FBUCxLQUNDLFNBQVMsS0FBVCxDQUFlLGtCQUFmLElBQXFDLElBQXJDLEdBQTRDLE9BRDdDLENBRFcsRUFHWCxRQUhXLEdBR0EsT0FIQSxDQUdRLEdBSFIsRUFHYSxRQUhiLENBQWI7QUFJRDs7QUFFRCxTQUFPLFVBQVA7QUFDRCxDQWxERDs7QUFvREE7Ozs7O0FBS0EsTUFBTSxrQkFBa0IsQ0FBQyxFQUFFLFdBQVcsR0FBYixFQUFrQixxQkFBcUIsR0FBdkMsS0FBK0MsRUFBaEQsS0FBdUQsU0FBUztBQUN0RixVQUFRLE1BQU0sT0FBTixDQUFjLEdBQWQsRUFBbUIsUUFBbkIsQ0FBUjtBQUNBLE1BQUksWUFBWSxNQUFNLENBQU4sS0FBWSxFQUE1QjtBQUNBLGNBQVksQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLFFBQVgsQ0FBb0IsU0FBcEIsSUFBaUMsU0FBakMsR0FBNkMsRUFBekQ7QUFDQSxRQUFNLGtCQUFrQixNQUFNLE9BQU4sQ0FBYyxRQUFkLE1BQTRCLENBQUMsQ0FBckQ7QUFDQSxNQUFJLENBQUMsY0FBYyxFQUFmLEVBQW1CLFdBQVcsRUFBOUIsSUFBb0MsTUFBTSxLQUFOLENBQVksUUFBWixDQUF4QztBQUNBLGdCQUFjLFlBQVksT0FBWixDQUFvQixPQUFwQixFQUE2QixFQUE3QixDQUFkO0FBQ0EsZ0JBQWMsWUFBWSxPQUFaLENBQW9CLHVCQUFwQixFQUE2QyxrQkFBN0MsQ0FBZDtBQUNBLFFBQU0sTUFBTyxHQUFFLFNBQVUsR0FBRSxXQUFZLEdBQUUsa0JBQWtCLFFBQWxCLEdBQTZCLEVBQUcsR0FBRSxRQUFTLEVBQXBGO0FBQ0EsU0FBTyxHQUFQO0FBQ0QsQ0FWRDs7a0JBWWU7QUFDYixZQURhO0FBRWI7QUFGYSxDOzs7Ozs7OztrQkNnRFMsZTtBQTVIeEI7O0FBRUEsTUFBTSxlQUFlLE1BQXJCO0FBQ0EsTUFBTSxjQUFjLEtBQXBCO0FBQ0EsTUFBTSxZQUFZLEtBQWxCOztBQUVBLElBQUksa0JBQWtCLEVBQXRCO0FBQ0EsTUFBTSxhQUFhLFFBQVEsR0FBUixDQUFZLElBQVosQ0FBaUIsT0FBakIsQ0FBbkI7QUFDQSxNQUFNLGtCQUFrQixFQUF4Qjs7QUFFQSxTQUFTLGNBQVQsQ0FBd0IsVUFBeEIsRUFBb0MsT0FBcEMsRUFBNkM7QUFDM0MsUUFBTSxFQUFFLFNBQVMsQ0FBWCxFQUFjLGVBQWUsS0FBN0IsS0FBdUMsT0FBN0M7QUFDQSxRQUFNLFVBQVUsU0FBUyxPQUFULENBQWlCLE1BQWpCLEVBQXlCLEdBQUcsSUFBNUIsRUFBa0M7QUFDaEQsUUFBSSxZQUFKLEVBQWtCO0FBQ2hCLHdCQUFrQixDQUFDLEVBQUUsQ0FBQyxNQUFELEdBQVUsSUFBWixFQUFELENBQWxCO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsc0JBQWdCLElBQWhCLENBQXFCLEVBQUUsQ0FBQyxNQUFELEdBQVUsSUFBWixFQUFyQjtBQUNEOztBQUVELGVBQVcsU0FBWCxHQUF1QixnQkFBZ0IsR0FBaEIsQ0FBcUIsS0FBRCxJQUFXO0FBQ3BELFlBQU0sU0FBUyxPQUFPLElBQVAsQ0FBWSxLQUFaLEVBQW1CLENBQW5CLENBQWY7QUFDQSxZQUFNLFNBQVMsTUFBTSxNQUFOLENBQWY7QUFDQSxZQUFNLFVBQVUsT0FBTyxHQUFQLENBQVksSUFBRCxJQUFVO0FBQ25DLGVBQ0UsQ0FBQyxTQUFELEVBQVksSUFBWixFQUFrQixRQUFsQixDQUEyQixJQUEzQixLQUNBLENBQUMsUUFBRCxFQUFXLFFBQVgsRUFBcUIsVUFBckIsRUFBaUMsUUFBakMsQ0FBMEMsT0FBTyxJQUFqRCxDQUZLLEdBSUwsSUFKSyxHQUtMLENBQUMsS0FBRCxFQUFRLEtBQVIsRUFBZSxRQUFmLENBQXdCLEtBQUssV0FBTCxDQUFpQixJQUF6QyxJQUNHLEdBQUUsS0FBSyxXQUFMLENBQWlCLElBQUssS0FBSSxLQUFLLFNBQUwsQ0FBZSxDQUFDLEdBQUcsSUFBSixDQUFmLENBQTBCLEdBRHpELEdBRUUsS0FBSyxTQUFMLENBQWUsSUFBZixFQUFxQixDQUFDLEdBQUQsRUFBTSxLQUFOLEtBQWdCO0FBQ25DLGNBQUssT0FBTyxLQUFSLEtBQW1CLFVBQXZCLEVBQW1DO0FBQ2pDLG1CQUFPLE1BQU0sUUFBTixFQUFQO0FBQ0Q7QUFDRCxpQkFBTyxLQUFQO0FBQ0QsU0FMRCxFQUtHLE1BTEgsQ0FQSjtBQWFELE9BZGUsRUFjYixJQWRhLENBY1IsSUFkUSxDQUFoQjs7QUFnQkEsWUFBTSxRQUFRO0FBQ1osYUFBSyxNQURPO0FBRVosY0FBTSxRQUZNO0FBR1osZUFBTztBQUhLLFFBSVosTUFKWSxDQUFkOztBQU1BLGFBQVEsc0JBQXFCLEtBQU0sS0FBSSxPQUFRLFFBQS9DO0FBQ0QsS0ExQnNCLEVBMEJwQixJQTFCb0IsQ0EwQmYsSUExQmUsQ0FBdkI7QUEyQkQsR0FsQ0Q7QUFtQ0EsR0FBQyxLQUFELEVBQVEsTUFBUixFQUFnQixPQUFoQixFQUF5QixPQUF6QixDQUFrQyxNQUFELElBQVk7QUFDM0Msb0JBQWdCLE1BQWhCLElBQTBCLFFBQVEsTUFBUixDQUExQjtBQUNBLFlBQVEsTUFBUixJQUFrQixRQUFRLElBQVIsQ0FBYSxPQUFiLEVBQXNCLE1BQXRCLENBQWxCO0FBQ0QsR0FIRDtBQUlBLFNBQU8sZ0JBQVAsQ0FBd0IsT0FBeEIsRUFBa0MsR0FBRCxJQUFTO0FBQ3hDO0FBQ0EsWUFBUSxLQUFSLENBQWUsSUFBRyxJQUFJLE9BQVEsVUFBUyxJQUFJLFFBQVMsSUFBRyxJQUFJLE1BQU8sRUFBbEU7QUFDQSxZQUFRLEtBQVIsQ0FBYyxHQUFkLEVBQW1CLElBQUksS0FBSixDQUFVLEtBQTdCO0FBQ0E7QUFDRCxHQUxEO0FBTUEsYUFBVyxrQkFBWDtBQUNBLFNBQU8sU0FBUyxjQUFULEdBQTBCO0FBQy9CLEtBQUMsS0FBRCxFQUFRLE1BQVIsRUFBZ0IsT0FBaEIsRUFBeUIsT0FBekIsQ0FBa0MsTUFBRCxJQUFZO0FBQzNDLGNBQVEsTUFBUixJQUFrQixnQkFBZ0IsTUFBaEIsQ0FBbEI7QUFDRCxLQUZEO0FBR0EsZUFBVyxrQkFBWDtBQUNELEdBTEQ7QUFNRDs7QUFFRCxTQUFTLGFBQVQsQ0FBdUI7QUFDckIsU0FEcUI7QUFFckIsZ0JBQWM7QUFDWixlQUFXLFdBREMsRUFDWSxZQUFZLFlBRHhCO0FBRVosWUFBUyxnQkFBZSxRQUFTLFVBRnJCLEVBRWdDLFNBQVMsT0FGekM7QUFHWixpQkFBYTtBQUhEO0FBRk8sQ0FBdkIsRUFPRztBQUNELFFBQU0sRUFBRSxNQUFNLEtBQVIsS0FBa0IsT0FBeEI7QUFDQSxRQUFNLFVBQVUsU0FBUyxhQUFULENBQXVCLEtBQXZCLENBQWhCO0FBQ0EsVUFBUSxFQUFSLEdBQWEscUJBQWI7QUFDQSxVQUFRLEtBQVIsQ0FBYyxPQUFkLEdBQXlCOzs7Ozs7YUFNZCxLQUFNO2NBQ0wsTUFBTztXQUNWLFNBQVU7TUFDZixNQUFNLE9BQU4sR0FBZ0IsTUFBTztrQkFDWCxVQUFXOzs7S0FWM0I7QUFjQSxTQUFPLE9BQVA7QUFDRDs7QUFFRCxTQUFTLFlBQVQsQ0FBc0I7QUFDcEIsU0FEb0I7QUFFcEIsZUFBYTtBQUNYLGVBQVcsT0FEQTtBQUVYLFlBQVEsTUFGRyxFQUVLLFNBQVMsWUFGZCxFQUU0QixNQUFNLFNBRmxDLEVBRTZDLFFBQVEsV0FGckQ7QUFHWCxpQkFBYTtBQUhGO0FBRk8sQ0FBdEIsRUFPRztBQUNELFFBQU0sRUFBRSxNQUFNLEtBQVIsS0FBa0IsT0FBeEI7QUFDQSxRQUFNLFNBQVMsU0FBUyxhQUFULENBQXVCLEtBQXZCLENBQWY7QUFDQSxTQUFPLEVBQVAsR0FBWSw0QkFBWjtBQUNBLFNBQU8sS0FBUCxDQUFhLE9BQWIsR0FBd0I7Z0JBQ1YsUUFBUzthQUNaLEtBQU07Y0FDTCxNQUFPO1dBQ1YsR0FBSTtNQUNULE1BQU0sT0FBTixHQUFnQixNQUFPLEtBQUksS0FBTTtrQkFDckIsVUFBVzs7S0FOM0I7QUFTQSxTQUFPLE1BQVA7QUFDRDs7QUFFRDs7Ozs7OztBQU9lLFNBQVMsZUFBVCxDQUF5QjtBQUN0QyxnQkFBYyxFQUR3QjtBQUV0QyxpQkFBZSxFQUZ1QjtBQUd0QyxZQUFVO0FBSDRCLElBSXBDLEVBSlcsRUFJUDtBQUNOLFFBQU0sU0FBUyxhQUFhO0FBQzFCLFdBRDBCO0FBRTFCO0FBRjBCLEdBQWIsQ0FBZjtBQUlBLFFBQU0sVUFBVSxjQUFjO0FBQzVCLG9DQUNLLFlBREw7QUFFRSxpQkFBVyxZQUFZLE1BRnpCO0FBR0UsZ0JBQVUsWUFBWTtBQUh4QixNQUQ0QjtBQU01QjtBQU40QixHQUFkLENBQWhCOztBQVNBLFVBQVEsZ0JBQVIsQ0FBeUIsT0FBekIsRUFBbUMsQ0FBRCxJQUFPO0FBQ3ZDLE1BQUUsZUFBRjtBQUNELEdBRkQ7O0FBSUEsU0FBTyxnQkFBUCxDQUF3QixPQUF4QixFQUFrQyxDQUFELElBQU87QUFDdEMsTUFBRSxlQUFGO0FBQ0EsUUFBSSxDQUFDLE9BQU8sUUFBUCxDQUFnQixPQUFoQixDQUFMLEVBQStCO0FBQzdCLGFBQU8sV0FBUCxDQUFtQixPQUFuQjtBQUNBLGNBQVEsU0FBUixHQUFvQixRQUFRLFlBQVIsR0FBdUIsUUFBUSxZQUFuRDtBQUNELEtBSEQsTUFHTztBQUNMLGFBQU8sV0FBUCxDQUFtQixPQUFuQjtBQUNEO0FBQ0YsR0FSRDs7QUFVQSxXQUFTLElBQVQsQ0FBYyxXQUFkLENBQTBCLE1BQTFCO0FBQ0EsUUFBTSxpQkFBaUIsZUFBZSxPQUFmLEVBQXdCLE9BQXhCLENBQXZCOztBQUVBLFNBQU8sU0FBUyxPQUFULEdBQW1CO0FBQ3hCLGFBQVMsSUFBVCxDQUFjLFdBQWQsQ0FBMEIsTUFBMUI7QUFDQTtBQUNELEdBSEQ7QUFJRDs7Ozs7Ozs7a0JDM0p1QixRO0FBUnhCOzs7Ozs7OztBQVFlLFNBQVMsUUFBVCxDQUFrQixPQUFsQixFQUEyQixHQUFHLElBQTlCLEVBQW9DO0FBQ2pELFNBQVEsQ0FBQyxHQUFHLE1BQUosS0FBZTtBQUNyQixVQUFNLE9BQU8sT0FBTyxPQUFPLE1BQVAsR0FBZ0IsQ0FBdkIsS0FBNkIsRUFBMUM7QUFDQSxVQUFNLFNBQVMsQ0FBQyxRQUFRLENBQVIsQ0FBRCxDQUFmO0FBQ0EsU0FBSyxPQUFMLENBQWEsQ0FBQyxHQUFELEVBQU0sQ0FBTixLQUFZO0FBQ3ZCLFlBQU0sUUFBUSxPQUFPLFNBQVAsQ0FBaUIsR0FBakIsSUFBd0IsT0FBTyxHQUFQLENBQXhCLEdBQXNDLEtBQUssR0FBTCxDQUFwRDtBQUNBLGFBQU8sSUFBUCxDQUFZLEtBQVosRUFBbUIsUUFBUSxJQUFJLENBQVosQ0FBbkI7QUFDRCxLQUhEO0FBSUEsV0FBTyxPQUFPLElBQVAsQ0FBWSxFQUFaLENBQVA7QUFDRCxHQVJEO0FBU0Q7Ozs7Ozs7OztBQ2pCRDs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBOEVBO0FBQ0EsU0FBUyxnQkFBVCxDQUEwQixTQUExQixFQUFxQztBQUNuQyxRQUFNLGVBQWUsUUFBUSxPQUFSLENBQWdCLFNBQWhCLENBQXJCOztBQUVBLFNBQU8sU0FBUyxNQUFULENBQWdCLEtBQWhCLEVBQXVCO0FBQzVCLGlCQUFhLE9BQWIsQ0FBc0IsUUFBRCxJQUFjOztBQUVqQyxZQUFNLHdCQUNKLE9BQU8sd0JBQVAsQ0FBZ0MsU0FBaEMsRUFBMkMsUUFBM0MsQ0FERjtBQUVBLFlBQU0sNkJBQ0osT0FBTyx3QkFBUCxDQUFnQyxNQUFNLFNBQXRDLEVBQWlELFFBQWpELENBREY7O0FBR0EsWUFBTTtBQUNKLGVBQU8sUUFESDtBQUVKLGFBQUssU0FGRDtBQUdKLGFBQUs7QUFIRCxVQUlGLHFCQUpKOztBQU1BLFVBQUksQ0FBQywwQkFBTCxFQUFpQztBQUMvQixZQUFJLFFBQUosRUFBYztBQUNaLGlCQUFPLGNBQVAsQ0FBc0IsTUFBTSxTQUE1QixFQUF1QyxRQUF2QyxFQUFpRDtBQUMvQyxtQkFBTyxRQUR3QztBQUUvQyxzQkFBVSxJQUZxQztBQUcvQyx3QkFBWSxLQUhtQztBQUkvQywwQkFBYztBQUppQyxXQUFqRDtBQU1ELFNBUEQsTUFPTztBQUNMLGlCQUFPLGNBQVAsQ0FBc0IsTUFBTSxTQUE1QixFQUF1QyxRQUF2QyxFQUFpRDtBQUMvQyxpQkFBSyxTQUQwQztBQUUvQyxpQkFBSyxTQUYwQztBQUcvQyx3QkFBWSxLQUhtQztBQUkvQywwQkFBYztBQUppQyxXQUFqRDtBQU1EO0FBQ0YsT0FoQkQsTUFnQk87QUFDTCxjQUFNO0FBQ0osaUJBQU8sYUFESDtBQUVKLG9CQUFVLGdCQUZOO0FBR0osZUFBSyxjQUhEO0FBSUosZUFBSyxjQUpEO0FBS0osc0JBQVksa0JBTFI7QUFNSix3QkFBYztBQU5WLFlBT0YsMEJBUEo7O0FBU0EsWUFBSSxRQUFKLEVBQWM7QUFDWixpQkFBTyxjQUFQLENBQXNCLE1BQU0sU0FBNUIsRUFBdUMsUUFBdkMsRUFBaUQ7QUFDL0Msa0JBQU0sR0FBRyxJQUFULEVBQWU7QUFDYixvQkFBTSxlQUFlLGNBQWMsSUFBZCxDQUFtQixJQUFuQixDQUFyQjtBQUNBLHFCQUFPLFNBQVMsSUFBVCxDQUFjLElBQWQsRUFBb0IsWUFBcEIsRUFBa0MsR0FBRyxJQUFyQyxDQUFQO0FBQ0QsYUFKOEM7QUFLL0Msc0JBQVUsZ0JBTHFDO0FBTS9DLHdCQUFZLGtCQU5tQztBQU8vQywwQkFBYztBQVBpQyxXQUFqRDtBQVNELFNBVkQsTUFVTztBQUNMLGlCQUFPLGNBQVAsQ0FBc0IsTUFBTSxTQUE1QixFQUF1QyxRQUF2QyxFQUFpRDtBQUMvQyxpQkFBSyxhQUFhLGNBRDZCO0FBRS9DLGlCQUFLLGFBQWEsY0FGNkI7QUFHL0Msd0JBQVksa0JBSG1DO0FBSS9DLDBCQUFjO0FBSmlDLFdBQWpEO0FBTUQ7QUFDRjtBQUNGLEtBMUREO0FBMkRBLFdBQU8sS0FBUDtBQUNELEdBN0REO0FBOEREOztrQkFFYyxnQjs7Ozs7Ozs7a0JDbElTLFM7O0FBbEJ4QixNQUFNLHFCQUFxQixDQUFDLFNBQUQsQ0FBM0I7O0FBRUEsTUFBTSxpQkFBaUI7QUFDckIsV0FBVTs7O0FBRFcsQ0FBdkI7O0FBTUE7Ozs7Ozs7Ozs7QUFVZSxTQUFTLFNBQVQsQ0FBbUIsS0FBbkIsRUFBMEI7O0FBRXZDLFFBQU0sY0FBTixJQUF5Qjs7Ozs7Ozs7Ozs7Ozs7OztHQUF6Qjs7QUFrQkE7O0FBRUEsUUFBTSxTQUFOLFNBQXdCLEtBQXhCLENBQThCOztBQUU1QixlQUFXLElBQVgsR0FBa0I7QUFDaEIsYUFBTyxNQUFNLElBQWI7QUFDRDs7QUFFRCxlQUFXLG1CQUFYLEdBQWlDO0FBQy9CO0FBQ0E7QUFDQTtBQUNBLGFBQU8sQ0FBQyxHQUFHLE1BQU0sbUJBQVYsRUFBK0IsU0FBL0IsRUFBMEMsVUFBMUMsQ0FBUDtBQUNEOztBQUVELGVBQVcsa0JBQVgsR0FBZ0M7QUFDOUIsYUFBTyxDQUFDLEdBQUcsTUFBTSxrQkFBVixFQUE4QixVQUE5QixDQUFQO0FBQ0Q7O0FBRUQsZ0JBQVksR0FBRyxJQUFmLEVBQXFCO0FBQ25CLFlBQU0sR0FBRyxJQUFUOztBQUVBLFdBQUssb0JBQUwsR0FBNEIsSUFBNUI7QUFDQSxXQUFLLHNCQUFMLEdBQThCLElBQTlCO0FBQ0EsV0FBSyx3QkFBTCxHQUFnQyxLQUFLLHdCQUFMLENBQThCLElBQTlCLENBQW1DLElBQW5DLENBQWhDO0FBQ0EsV0FBSyxRQUFMLEdBQWdCLEtBQUssUUFBTCxDQUFjLElBQWQsQ0FBbUIsSUFBbkIsQ0FBaEI7QUFDQSxXQUFLLE9BQUwsR0FBZSxLQUFLLE9BQUwsQ0FBYSxJQUFiLENBQWtCLElBQWxCLENBQWY7QUFDQSxXQUFLLE1BQUwsR0FBYyxLQUFLLE1BQUwsQ0FBWSxJQUFaLENBQWlCLElBQWpCLENBQWQ7QUFDRDs7QUFFRCw2QkFBeUIsSUFBekIsRUFBK0IsUUFBL0IsRUFBeUMsUUFBekMsRUFBbUQ7QUFDakQsWUFBTSx3QkFBTixDQUErQixJQUEvQixFQUFxQyxRQUFyQyxFQUErQyxRQUEvQzs7QUFFQSxZQUFNLFdBQVcsYUFBYSxJQUE5QjtBQUNBLFVBQUksU0FBUyxVQUFiLEVBQXlCO0FBQ3ZCLG1CQUFXLEtBQUsseUJBQUwsRUFBWCxHQUE4QyxLQUFLLHdCQUFMLEVBQTlDO0FBQ0Q7QUFDRjs7QUFFRCx3QkFBb0I7QUFDbEIsWUFBTSxpQkFBTjs7QUFFQSx5QkFBbUIsT0FBbkIsQ0FBNEIsZ0JBQUQsSUFBc0I7QUFDL0MsWUFBSSxLQUFLLFlBQUwsQ0FBa0IsZ0JBQWxCLENBQUosRUFBeUM7QUFDdkMsZUFBSyxlQUFMLENBQXFCLGdCQUFyQjtBQUNBLGtCQUFRLElBQVIsQ0FBYSxlQUFlLGdCQUFmLENBQWI7QUFDRDtBQUNGLE9BTEQ7O0FBT0EsVUFBSSxLQUFLLFFBQVQsRUFBbUI7QUFDakIsYUFBSyx5QkFBTDtBQUNELE9BRkQsTUFFTztBQUNMLGFBQUssd0JBQUw7QUFDRDs7QUFFRDtBQUNBLFdBQUssZ0JBQUwsQ0FBc0IsT0FBdEIsRUFBK0IsS0FBSyxRQUFwQztBQUNBLFdBQUssZ0JBQUwsQ0FBc0IsTUFBdEIsRUFBOEIsS0FBSyxPQUFuQztBQUNBLFdBQUssYUFBTCxDQUFtQixnQkFBbkIsQ0FBb0MsV0FBcEMsRUFBaUQsS0FBSyxNQUF0RDtBQUNBLFdBQUssYUFBTCxDQUFtQixnQkFBbkIsQ0FBb0MsWUFBcEMsRUFBa0QsS0FBSyxNQUF2RDs7QUFFQSxXQUFLLGdCQUFMLENBQXNCLE9BQXRCLENBQStCLFNBQUQsSUFBZTtBQUMzQztBQUNBLGtCQUFVLGdCQUFWLENBQTJCLE9BQTNCLEVBQW9DLEtBQUssd0JBQXpDO0FBQ0QsT0FIRDtBQUlEOztBQUVELDJCQUF1QjtBQUNyQixZQUFNLG9CQUFOOztBQUVBLFdBQUssbUJBQUwsQ0FBeUIsT0FBekIsRUFBa0MsS0FBSyxRQUF2QztBQUNBLFdBQUssbUJBQUwsQ0FBeUIsTUFBekIsRUFBaUMsS0FBSyxPQUF0QztBQUNBLFdBQUssYUFBTCxDQUFtQixtQkFBbkIsQ0FBdUMsV0FBdkMsRUFBb0QsS0FBSyxNQUF6RDtBQUNBLFdBQUssYUFBTCxDQUFtQixtQkFBbkIsQ0FBdUMsWUFBdkMsRUFBcUQsS0FBSyxNQUExRDs7QUFFQSxXQUFLLGdCQUFMLENBQXNCLE9BQXRCLENBQStCLFNBQUQsSUFBZTtBQUMzQyxrQkFBVSxtQkFBVixDQUE4QixPQUE5QixFQUF1QyxLQUFLLHdCQUE1QztBQUNELE9BRkQ7QUFHRDs7QUFFRDs7OztBQUlBLFFBQUksT0FBSixHQUFjO0FBQ1osYUFBTyxLQUFLLFlBQUwsQ0FBa0IsU0FBbEIsQ0FBUDtBQUNEOztBQUVELFFBQUksT0FBSixDQUFZLENBQVosRUFBZTtBQUNiLGNBQVEsSUFBUixDQUFhLGVBQWUsT0FBNUI7QUFDRDs7QUFFRDs7OztBQUlBLFFBQUksUUFBSixHQUFlO0FBQ2IsYUFBTyxLQUFLLFlBQUwsQ0FBa0IsVUFBbEIsQ0FBUDtBQUNEOztBQUVELFFBQUksUUFBSixDQUFhLEtBQWIsRUFBb0I7QUFDbEIsWUFBTSxXQUFXLFFBQVEsS0FBUixDQUFqQjtBQUNBLFVBQUksUUFBSixFQUFjO0FBQ1osYUFBSyxZQUFMLENBQWtCLFVBQWxCLEVBQThCLEVBQTlCO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsYUFBSyxlQUFMLENBQXFCLFVBQXJCO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7QUFLQSxRQUFJLGdCQUFKLEdBQXVCO0FBQ3JCLGFBQU8sS0FBSyxVQUFMLENBQWdCLGdCQUFoQixDQUFpQyxZQUFqQyxLQUFrRCxFQUF6RDtBQUNEOztBQUVEOzs7OztBQUtBLFFBQUksb0JBQUosR0FBMkI7QUFDekIsYUFBTyxLQUFLLFVBQUwsQ0FBZ0IsYUFBaEIsQ0FBOEIsWUFBOUIsQ0FBUDtBQUNEOztBQUVEOzs7OztBQUtBLFdBQU8sR0FBUCxFQUFZO0FBQ1YsVUFBSSxJQUFJLE1BQUosS0FBZSxJQUFuQixFQUF5QjtBQUN2QixhQUFLLElBQUw7QUFDRDtBQUNGOztBQUVEOzs7OztBQUtBLDZCQUF5QixHQUF6QixFQUE4QjtBQUM1QixXQUFLLG9CQUFMLEdBQTRCLElBQUksTUFBaEM7QUFDRDs7QUFFRCxlQUFXO0FBQ1QsVUFBSSxLQUFLLFFBQVQsRUFBbUI7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFLLFlBQUwsQ0FBa0IsU0FBbEIsRUFBNkIsRUFBN0I7QUFDQSxXQUFLLHNCQUFMO0FBQ0Q7O0FBRUQsY0FBVTtBQUNSLFdBQUssZUFBTCxDQUFxQixTQUFyQjtBQUNBLFdBQUsscUJBQUw7QUFDRDs7QUFFRCw2QkFBeUI7QUFDdkIsVUFBSSxLQUFLLG9CQUFULEVBQStCO0FBQzdCO0FBQ0E7QUFDQTtBQUNEO0FBQ0QsV0FBSyx5QkFBTDtBQUNEOztBQUVELDRCQUF3QjtBQUN0QixVQUFJLEtBQUssb0JBQVQsRUFBK0I7QUFDN0IsYUFBSyxvQkFBTCxDQUEwQixJQUExQjtBQUNBLGFBQUssb0JBQUwsR0FBNEIsSUFBNUI7QUFDRDtBQUNGOztBQUVELGdDQUE0QjtBQUMxQixZQUFNLHNCQUFzQixLQUFLLG9CQUFqQztBQUNBLFVBQUksbUJBQUosRUFBeUI7QUFDdkIsYUFBSyxvQkFBTCxHQUE0QixtQkFBNUI7QUFDQSw0QkFBb0IsS0FBcEI7QUFDRDtBQUNGOztBQUVELGdDQUE0QjtBQUMxQixVQUFJLEtBQUssc0JBQUwsS0FBZ0MsVUFBcEMsRUFBZ0Q7QUFDaEQsV0FBSyxrQkFBTCxHQUEwQixLQUFLLFlBQUwsQ0FBa0IsVUFBbEIsQ0FBMUI7QUFDQSxXQUFLLGVBQUwsQ0FBcUIsVUFBckI7QUFDQSxXQUFLLGdCQUFMLENBQXNCLE9BQXRCLENBQStCLGNBQUQsSUFBb0I7QUFDaEQsdUJBQWUsWUFBZixDQUE0QixVQUE1QixFQUF3QyxJQUF4QztBQUNBLHVCQUFlLFlBQWYsQ0FBNEIsVUFBNUIsRUFBd0MsVUFBeEM7QUFDQSxZQUFJLGVBQWUsWUFBZixDQUE0QixpQkFBNUIsQ0FBSixFQUFvRDtBQUNsRCx5QkFBZSxZQUFmLENBQTRCLGlCQUE1QixFQUErQyxPQUEvQztBQUNEO0FBQ0YsT0FORDtBQU9BLFdBQUssSUFBTDtBQUNBLFdBQUssc0JBQUwsR0FBOEIsVUFBOUI7QUFDRDs7QUFFRCwrQkFBMkI7QUFDekIsVUFBSSxLQUFLLHNCQUFMLEtBQWdDLFNBQXBDLEVBQStDO0FBQy9DLE9BQUMsS0FBSyxZQUFMLENBQWtCLFVBQWxCLENBQUQsSUFBa0MsS0FBSyxZQUFMLENBQWtCLFVBQWxCLEVBQThCLEtBQUssa0JBQUwsSUFBMkIsQ0FBekQsQ0FBbEM7QUFDQSxXQUFLLGdCQUFMLENBQXNCLE9BQXRCLENBQStCLGNBQUQsSUFBb0I7QUFDaEQsdUJBQWUsWUFBZixDQUE0QixVQUE1QixFQUF3QyxHQUF4QztBQUNBLHVCQUFlLGVBQWYsQ0FBK0IsVUFBL0I7QUFDQSxZQUFJLGVBQWUsWUFBZixDQUE0QixpQkFBNUIsQ0FBSixFQUFvRDtBQUNsRCx5QkFBZSxZQUFmLENBQTRCLGlCQUE1QixFQUErQyxNQUEvQztBQUNEO0FBQ0YsT0FORDtBQU9BLFdBQUssc0JBQUwsR0FBOEIsU0FBOUI7QUFDRDtBQWxOMkI7O0FBcU45QixTQUFPLFNBQVA7QUFDRDs7Ozs7Ozs7O0FDOVBELE1BQU0sb0JBQXFCOzs7Ozs7Ozs7O0dBQTNCOztrQkFZZSxpQjs7Ozs7Ozs7a0JDa0JTLHVCOztBQTlCeEI7Ozs7QUFDQTs7Ozs7O0FBRUEsTUFBTSxtQkFBbUIsc0JBQXpCOztBQUVBLFNBQVMsbUJBQVQsQ0FBNkIsR0FBN0IsRUFBa0M7QUFDaEMsUUFBTSxFQUFFLFFBQUYsS0FBZSxHQUFyQjtBQUNBLFFBQU0sY0FBYyxTQUFTLGFBQVQsQ0FBdUIsT0FBdkIsQ0FBcEI7QUFDQSxjQUFZLFlBQVosQ0FBeUIsc0JBQXpCLEVBQWlELEVBQWpEO0FBQ0EsY0FBWSxTQUFaLEdBQXdCLDJCQUF4QjtBQUNBLFdBQVMsYUFBVCxDQUF1QixNQUF2QixFQUErQixXQUEvQixDQUEyQyxXQUEzQztBQUNEOztBQUVEOzs7Ozs7O0FBT0E7QUFDQTs7Ozs7Ozs7O0FBU2UsU0FBUyx1QkFBVCxDQUFpQyxHQUFqQyxFQUFzQztBQUNuRCxTQUFPLHdDQUF5QixHQUF6QixFQUE4QixnQkFBOUIsRUFBZ0QsTUFBTTtBQUMzRCx3QkFBb0IsR0FBcEI7O0FBRUEsVUFBTSxFQUFFLFFBQUYsRUFBWSxXQUFaLEVBQXlCLGNBQXpCLEtBQTRDLEdBQWxEOztBQUVBLFVBQU0sb0JBQU4sU0FBbUMsV0FBbkMsQ0FBK0M7O0FBRTdDOzs7O0FBSUEsaUJBQVcsZ0JBQVgsR0FBOEI7QUFDNUIsY0FBTSxJQUFJLEtBQUosQ0FBVSxxREFBVixDQUFOO0FBQ0Q7O0FBRUQ7Ozs7QUFJQSxpQkFBVyxpQkFBWCxHQUErQjtBQUM3QixlQUFPLDhCQUFQO0FBQ0Q7O0FBRUQ7Ozs7QUFJQSxpQkFBVyxZQUFYLEdBQTBCO0FBQ3hCLGVBQU8sRUFBUDtBQUNEOztBQUVEOzs7O0FBSUEsaUJBQVcsbUJBQVgsR0FBaUM7QUFDL0IsZUFBTyxFQUFQO0FBQ0Q7O0FBRUQ7Ozs7QUFJQSxpQkFBVyxrQkFBWCxHQUFnQztBQUM5QixlQUFPLEVBQUUsc0JBQXNCLEVBQXhCLEVBQVA7QUFDRDs7QUFFRDs7OztBQUlBLGlCQUFXLGtCQUFYLEdBQWdDO0FBQzlCO0FBQ0EsZUFBTyxDQUFDLEtBQUQsRUFBUSxNQUFSLEVBQWdCLGtCQUFoQixDQUFQO0FBQ0Q7O0FBRUQ7Ozs7QUFJQSxVQUFJLFNBQUosR0FBZ0I7QUFDZCxlQUFPLEtBQUssVUFBWjtBQUNEOztBQUVEOzs7O0FBSUEsVUFBSSxjQUFKLEdBQXFCO0FBQ25CO0FBQ0E7QUFDQTtBQUNBLGVBQU8sS0FBSyxlQUFaO0FBQ0Q7O0FBRUQsa0JBQVksR0FBRyxJQUFmLEVBQXFCO0FBQ25COztBQUVBLGFBQUssWUFBTCxDQUFrQjtBQUNoQixnQkFBTTtBQUNOO0FBQ0E7QUFDQTtBQUpnQixTQUFsQjs7QUFPQSxhQUFLLG1CQUFMLEdBQTJCLEtBQTNCO0FBQ0EsYUFBSyxpQkFBTCxHQUF5QixFQUF6QjtBQUNBLGFBQUssb0JBQUwsR0FBNEIsRUFBNUI7QUFDQSxhQUFLLGtCQUFMLEdBQTBCLElBQTFCO0FBQ0EsYUFBSyxvQkFBTCxHQUE0QixFQUE1QjtBQUNBLGFBQUssVUFBTCxHQUFrQixLQUFsQjtBQUNBLGFBQUssZUFBTCxHQUF1QixLQUF2QjtBQUNBLGFBQUssZUFBTCxHQUF1QixJQUF2QjtBQUNBLGFBQUssZUFBTDs7QUFFQSxhQUFLLGlCQUFMLEdBQXlCLEtBQUssaUJBQUwsQ0FBdUIsSUFBdkIsQ0FBNEIsSUFBNUIsQ0FBekI7QUFDQSxhQUFLLG9CQUFMLEdBQTRCLEtBQUssb0JBQUwsQ0FBMEIsSUFBMUIsQ0FBK0IsSUFBL0IsQ0FBNUI7QUFDQSxhQUFLLHdCQUFMLEdBQWdDLEtBQUssd0JBQUwsQ0FBOEIsSUFBOUIsQ0FBbUMsSUFBbkMsQ0FBaEM7QUFDQSxhQUFLLGVBQUwsR0FBdUIsS0FBSyxlQUFMLENBQXFCLElBQXJCLENBQTBCLElBQTFCLENBQXZCOztBQUVBO0FBQ0EsYUFBSyxJQUFMLElBQWEsS0FBSyxJQUFMLENBQVUsR0FBRyxJQUFiLENBQWI7QUFDRDs7QUFFRDs7QUFFQTs7Ozs7QUFLQSxVQUFJLGFBQUosR0FBb0I7QUFDbEIsY0FBTSxTQUFTLFNBQVMsYUFBVCxDQUF1QixLQUFLLFlBQUwsQ0FBa0Isa0JBQWxCLENBQXZCLENBQWY7QUFDQSxjQUFNLGdCQUFnQixTQUFTLGFBQVQsQ0FBdUIsTUFBdkIsQ0FBdEI7QUFDQSxlQUFPLFVBQVUsYUFBakI7QUFDRDs7QUFFRDs7Ozs7QUFLQSxVQUFJLGVBQUosR0FBc0I7QUFDcEI7QUFDQSxjQUFNLFNBQVMsS0FBSyxhQUFwQjtBQUNBLGVBQU87QUFDTCxlQUFLLE9BQU8sWUFBUCxDQUFvQixLQUFwQixLQUE4QixLQUQ5QjtBQUVMLGdCQUFNLE9BQU8sWUFBUCxDQUFvQixNQUFwQixLQUErQjtBQUZoQyxTQUFQO0FBSUQ7O0FBRUQsNkJBQXVCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJLENBQUMsS0FBSyxZQUFMLENBQWtCLEtBQWxCLENBQUwsRUFBK0I7QUFDN0I7QUFDQTtBQUNBO0FBQ0EsaUJBQU8sS0FBSyxpQkFBTCxDQUF1QixPQUE5QixDQUo2QixDQUlVO0FBQ3ZDLGVBQUssZUFBTCxDQUFxQixVQUFyQixFQUw2QixDQUtLO0FBQ25DOztBQUVELFlBQUksQ0FBQyxLQUFLLFlBQUwsQ0FBa0IsTUFBbEIsQ0FBTCxFQUFnQztBQUM5QixpQkFBTyxLQUFLLGlCQUFMLENBQXVCLFFBQTlCO0FBQ0EsZUFBSyxlQUFMLENBQXFCLFdBQXJCO0FBQ0Q7O0FBRUQsWUFBSSxLQUFLLGVBQVQsRUFBMEI7QUFDeEIsZUFBSyxlQUFMLENBQXFCLFVBQXJCO0FBQ0EsZUFBSyxlQUFMLEdBQXVCLElBQXZCO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7O0FBTUE7QUFDQSw4QkFBd0IsVUFBeEIsRUFBb0MsV0FBcEMsRUFBaUQ7QUFDL0M7QUFDQSxZQUFJLEtBQUssZUFBVCxFQUEwQjtBQUMxQixjQUFNO0FBQ0osaUJBREksRUFDSztBQURMLFlBRUYsVUFGSjtBQUdBO0FBQ0EsU0FBQyxLQUFLLFlBQUwsQ0FBa0IsS0FBbEIsQ0FBRCxJQUE2QixLQUFLLFlBQUwsQ0FBa0IsVUFBbEIsRUFBOEIsT0FBOUIsQ0FBN0I7QUFDQSxTQUFDLEtBQUssWUFBTCxDQUFrQixNQUFsQixDQUFELElBQThCLEtBQUssWUFBTCxDQUFrQixXQUFsQixFQUErQixRQUEvQixDQUE5QjtBQUNEOztBQUVEOzs7Ozs7O0FBT0Esd0NBQWtDLElBQWxDLEVBQXdDLFFBQXhDLEVBQWtELFFBQWxELEVBQTREO0FBQzFEO0FBQ0E7QUFDQTtBQUNBLFlBQUksQ0FBQyxDQUFDLEtBQUQsRUFBUSxNQUFSLEVBQWdCLGtCQUFoQixFQUFvQyxRQUFwQyxDQUE2QyxJQUE3QyxDQUFMLEVBQXlEOztBQUV6RCxZQUFJLFNBQVMsa0JBQWIsRUFBaUM7QUFDL0I7QUFDQSxlQUFLLDRCQUFMO0FBQ0E7QUFDRDs7QUFFRCxjQUFNLGFBQWEsU0FBUyxLQUFULEdBQWlCLFNBQWpCLEdBQTZCLFVBQWhEO0FBQ0EsY0FBTSxnQkFBZ0IsQ0FBQyxDQUFDLEtBQUssWUFBTCxDQUFrQixrQkFBbEIsQ0FBeEI7QUFDQSxjQUFNLG9CQUFvQixLQUFLLGlCQUEvQjtBQUNBLGNBQU0sb0JBQW9CLENBQUMsaUJBQTNCO0FBQ0EsY0FBTSxpQkFDSCxpQkFBaUIsaUJBQWxCLEdBQXVDLEtBQUssZUFBNUMsR0FBOEQsSUFEaEU7QUFFQSxjQUFNLGFBQWEsWUFDaEIsa0JBQWtCLGVBQWUsSUFBZixDQURGLElBRWpCLGtCQUFrQixXQUFsQixDQUE4QixDQUFDLFVBQUQsQ0FBOUIsRUFBNEMsVUFBNUMsQ0FGRjs7QUFJQSxZQUFJLFlBQVksY0FBaEIsRUFBZ0M7QUFDOUIsZUFBSyxZQUFMLENBQW1CLFFBQU8sSUFBSyxFQUEvQixFQUFrQyxVQUFsQztBQUNBLGVBQUssVUFBTCxDQUFnQjtBQUNkLGFBQUMsVUFBRCxHQUFjO0FBREEsV0FBaEI7QUFHQSw0QkFBa0IsS0FBSyxtQkFBTCxFQUFsQjtBQUNELFNBTkQsTUFNTztBQUNMLGVBQUssb0JBQUw7QUFDQSxlQUFLLHNCQUFMLENBQTRCLFVBQTVCO0FBQ0Q7QUFDRjs7QUFFRCxxQ0FBK0I7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU0sbUJBQW1CLENBQUMsQ0FBQyxLQUFLLGlCQUFoQztBQUNBLGNBQU0sZ0JBQWdCLENBQUMsQ0FBQyxLQUFLLFlBQUwsQ0FBa0Isa0JBQWxCLENBQXhCO0FBQ0EsWUFBSSxvQkFBb0IsQ0FBQyxhQUF6QixFQUF3Qzs7QUFFeEMsY0FBTSxFQUFFLEtBQUssV0FBUCxFQUFvQixNQUFNLFlBQTFCLEtBQTJDLEtBQUssZUFBdEQ7QUFDQSxjQUFNLFVBQVUsS0FBSyxZQUFMLENBQWtCLEtBQWxCLENBQWhCO0FBQ0EsY0FBTSxXQUFXLEtBQUssWUFBTCxDQUFrQixNQUFsQixDQUFqQjtBQUNBLGNBQU0sU0FBUyxXQUFXLFdBQTFCO0FBQ0EsY0FBTSxVQUFVLFlBQVksWUFBNUI7O0FBRUEsYUFBSyxZQUFMLENBQWtCLFVBQWxCLEVBQThCLE1BQTlCO0FBQ0EsYUFBSyxZQUFMLENBQWtCLFdBQWxCLEVBQStCLE9BQS9COztBQUVBLGFBQUssVUFBTCxDQUFnQjtBQUNkLG1CQUFTLE1BREs7QUFFZCxvQkFBVTtBQUZJLFNBQWhCOztBQUtBLGFBQUssbUJBQUw7QUFDRDs7QUFFRCw0QkFBc0I7QUFDcEI7QUFDQSxZQUFJLEtBQUssZUFBVCxFQUEwQjtBQUN4QixlQUFLLGVBQUwsQ0FBcUIsVUFBckI7QUFDRDs7QUFFRCxjQUFNLGVBQWUsS0FBSyxhQUExQjs7QUFFQSxhQUFLLGVBQUwsR0FBdUIsSUFBSSxnQkFBSixDQUFzQixTQUFELElBQWU7QUFDekQsb0JBQVUsT0FBVixDQUFtQixRQUFELElBQWM7QUFDOUIsa0JBQU0sT0FBTyxTQUFTLGFBQXRCO0FBQ0Esa0JBQU0sUUFBUSxLQUFLLGVBQUwsQ0FBcUIsSUFBckIsQ0FBZDtBQUNBLGtCQUFNLFVBQVcsUUFBTyxJQUFLLEVBQTdCO0FBQ0Esa0JBQU0sYUFBYyxPQUFNLEtBQUssTUFBTCxDQUFZLENBQVosRUFBZSxXQUFmLEtBQStCLEtBQUssS0FBTCxDQUFXLENBQVgsQ0FBYyxFQUF2RTs7QUFFQSxpQkFBSyxZQUFMLENBQWtCLE9BQWxCLEVBQTJCLEtBQTNCO0FBQ0EsaUJBQUssVUFBTCxDQUFnQjtBQUNkLGVBQUMsVUFBRCxHQUFjO0FBREEsYUFBaEI7QUFHRCxXQVZEO0FBV0QsU0Fac0IsQ0FBdkI7O0FBY0EsYUFBSyxlQUFMLENBQXFCLE9BQXJCLENBQTZCLFlBQTdCLEVBQTJDO0FBQ3pDLHNCQUFZLElBRDZCO0FBRXpDLDJCQUFpQixDQUFDLEtBQUQsRUFBUSxNQUFSO0FBRndCLFNBQTNDO0FBSUQ7O0FBRUQ7O0FBRUE7O0FBRUE7Ozs7QUFJQSxpQkFBVyxjQUFYLEdBQTRCO0FBQzFCLGVBQU8sQ0FBQyxTQUFELEVBQVksVUFBWixDQUFQO0FBQ0Q7O0FBRUQ7Ozs7QUFJQSxpQkFBVyxnQkFBWCxHQUE4QjtBQUM1QixlQUFPLENBQUMsU0FBRCxFQUFZLFVBQVosQ0FBUDtBQUNEOztBQUVEOzs7Ozs7QUFNQSwwQkFBb0IsR0FBcEIsRUFBeUI7QUFDdkIsZUFBTyxLQUFLLFdBQUwsQ0FBaUIsY0FBakIsQ0FBZ0MsSUFBaEMsQ0FBc0MsSUFBRCxJQUFVLFNBQVMsR0FBeEQsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7QUFNQSwwQkFBb0IsR0FBcEIsRUFBeUI7QUFDdkIsZUFBTyxLQUFLLGlCQUFMLENBQXVCLEdBQXZCLE1BQWdDLFNBQXZDO0FBQ0Q7O0FBRUQ7Ozs7OztBQU1BLDRCQUFzQixHQUF0QixFQUEyQjtBQUN6QixlQUFPLEtBQUssV0FBTCxDQUFpQixnQkFBakIsQ0FBa0MsSUFBbEMsQ0FBd0MsSUFBRCxJQUFVLFNBQVMsR0FBMUQsQ0FBUDtBQUNEOztBQUVEOzs7O0FBSUEsaUJBQVcsVUFBWCxFQUF1QjtBQUNyQixjQUFNLFVBQVUsT0FBTyxJQUFQLENBQVksVUFBWixFQUF3QixNQUF4QixDQUFnQyxHQUFELElBQVM7QUFDdEQsaUJBQU8sS0FBSyxtQkFBTCxDQUF5QixHQUF6QixDQUFQO0FBQ0QsU0FGZSxDQUFoQjs7QUFJQSxjQUFNLGVBQWUsUUFBUSxNQUFSLENBQWUsQ0FBQyxHQUFELEVBQU0sR0FBTixLQUFjO0FBQ2hELGNBQUksR0FBSixJQUFXLFdBQVcsR0FBWCxDQUFYO0FBQ0EsaUJBQU8sR0FBUDtBQUNELFNBSG9CLEVBR2xCLEVBSGtCLENBQXJCOztBQUtBLGNBQU0sd0NBQ0QsS0FBSyxpQkFESixFQUVELFlBRkMsQ0FBTjs7QUFLQSxhQUFLLGlCQUFMLEdBQXlCLG1CQUF6Qjs7QUFFQSxZQUFJLEtBQUssbUJBQVQsRUFBOEI7O0FBRTlCLGFBQUssd0JBQUwsQ0FBOEIsS0FBSyxpQkFBbkM7QUFDRDs7QUFFRDs7OztBQUlBLCtCQUF5QixVQUF6QixFQUFxQztBQUNuQyxhQUFLLG1CQUFMLEdBQTJCLElBQTNCO0FBQ0EsY0FBTSxpQkFBaUIsT0FBTyxJQUFQLENBQVksVUFBWixDQUF2Qjs7QUFFQTtBQUNBLFlBQUksZUFBZSxLQUFLLGlCQUF4QixFQUEyQztBQUN6QztBQUNBLGdCQUFNLG9CQUFvQixlQUFlLE1BQWYsQ0FBc0IsQ0FBQyxHQUFELEVBQU0sR0FBTixLQUFjO0FBQzVELGlCQUFLLHFCQUFMLENBQTJCLEdBQTNCLEtBQW1DLElBQUksSUFBSixDQUFTLEdBQVQsQ0FBbkM7QUFDQSxtQkFBTyxHQUFQO0FBQ0QsV0FIeUIsRUFHdkIsRUFIdUIsQ0FBMUI7O0FBS0EsY0FBSSxrQkFBa0IsTUFBdEIsRUFBOEI7QUFDNUIsa0JBQU0sdUJBQXVCLGtCQUFrQixNQUFsQixDQUF5QixDQUFDLEdBQUQsRUFBTSxHQUFOLEtBQWM7QUFDbEUsa0JBQUksR0FBSixJQUFXLFdBQVcsR0FBWCxDQUFYO0FBQ0EscUJBQU8sR0FBUDtBQUNELGFBSDRCLEVBRzFCLEVBSDBCLENBQTdCO0FBSUEsaUJBQUssaUJBQUwsQ0FBdUIsb0JBQXZCO0FBQ0E7QUFDQTtBQUNEO0FBQ0Y7O0FBRUQ7QUFDQTtBQUNBO0FBQ0EsY0FBTSxvQkFBb0IsS0FBSyxXQUFMLENBQWlCLGNBQWpCLENBQWdDLE1BQWhDLENBQXVDLENBQUMsR0FBRCxFQUFNLEdBQU4sS0FBYztBQUM3RSxjQUFJLEtBQUssbUJBQUwsQ0FBeUIsR0FBekIsQ0FBSixFQUFtQztBQUNqQyxnQkFBSSxHQUFKLElBQVcsS0FBSyxpQkFBTCxDQUF1QixHQUF2QixDQUFYO0FBQ0Q7QUFDRCxpQkFBTyxHQUFQO0FBQ0QsU0FMeUIsRUFLdkIsRUFMdUIsQ0FBMUI7O0FBT0EsY0FBTSx1Q0FDRCxVQURDLEVBRUQsaUJBRkMsQ0FBTjs7QUFLQTtBQUNBLGFBQUssbUJBQUwsQ0FBeUIsT0FBekIsQ0FBa0MsS0FBRCxJQUFXO0FBQzFDLGdCQUFNLHdCQUFOLENBQStCLGtCQUEvQjtBQUNELFNBRkQ7QUFHQSxhQUFLLG1CQUFMLEdBQTJCLEtBQTNCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O0FBUUEsNkJBQXVCLFVBQXZCLEVBQW1DO0FBQ2pDLGNBQU0sY0FBYyxNQUFNLE9BQU4sQ0FBYyxVQUFkLElBQTRCLFVBQTVCLEdBQXlDLENBQUMsVUFBRCxDQUE3RDs7QUFFQSxvQkFBWSxPQUFaLENBQXFCLEdBQUQsSUFBUztBQUMzQixpQkFBTyxLQUFLLG9CQUFMLENBQTBCLEdBQTFCLENBQVA7QUFDQSxpQkFBTyxLQUFLLGlCQUFMLENBQXVCLEdBQXZCLENBQVA7QUFDRCxTQUhEOztBQUtBLGNBQU0sb0JBQW9CLEtBQUssaUJBQS9CO0FBQ0EsY0FBTSxjQUNGLENBQUMsaUJBQUQsR0FDRSxTQURGLEdBRUUsa0JBQWtCLFdBQWxCLENBQThCLFdBQTlCLENBSE47O0FBS0EsY0FBTSxhQUFhLFlBQVksTUFBWixDQUFtQixDQUFDLEdBQUQsRUFBTSxHQUFOLEtBQWM7QUFDbEQsY0FBSSxHQUFKLElBQVcsQ0FBQyxlQUFlLEVBQWhCLEVBQW9CLEdBQXBCLENBQVg7QUFDQSxpQkFBTyxHQUFQO0FBQ0QsU0FIa0IsRUFHaEIsRUFIZ0IsQ0FBbkI7O0FBS0EsYUFBSyx3QkFBTCxDQUE4QixVQUE5QjtBQUNEOztBQUVEOzs7Ozs7QUFNQSxrQkFBWSxJQUFaLEVBQWtCO0FBQ2hCO0FBQ0E7QUFDQSxjQUFNLFlBQVksRUFBbEI7QUFDQSxjQUFNLGVBQWUsRUFBckI7QUFDQSxhQUFLLE9BQUwsQ0FBYyxHQUFELElBQVM7QUFDcEIsY0FBSSxLQUFLLG1CQUFMLENBQXlCLEdBQXpCLENBQUosRUFBbUM7QUFDakMsc0JBQVUsSUFBVixDQUFlLEdBQWY7QUFDRCxXQUZELE1BRU87QUFDTCx5QkFBYSxJQUFiLENBQWtCLEdBQWxCO0FBQ0Q7QUFDRixTQU5EO0FBT0EsY0FBTSxvQkFBb0IsS0FBSyxpQkFBL0I7QUFDQSxpQ0FDSyxVQUFVLE1BQVYsQ0FBaUIsQ0FBQyxHQUFELEVBQU0sR0FBTixLQUFjO0FBQ2hDLGNBQUksR0FBSixJQUFXLEtBQUssaUJBQUwsQ0FBdUIsR0FBdkIsQ0FBWDtBQUNBLGlCQUFPLEdBQVA7QUFDRCxTQUhFLEVBR0EsRUFIQSxDQURMLEVBS00sb0JBQW9CLGtCQUFrQixXQUFsQixDQUE4QixZQUE5QixDQUFwQixHQUFrRSxFQUx4RTtBQU9EOztBQUVEOzs7Ozs7QUFNQSx3QkFBa0IsVUFBbEIsRUFBOEIsRUFBRSxRQUFRLEtBQVYsS0FBb0IsRUFBbEQsRUFBc0Q7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNLHNCQUFzQixLQUFLLG9CQUFqQztBQUNBLGNBQU0seUJBQXlCLE9BQU8sSUFBUCxDQUFZLGNBQWMsRUFBMUIsRUFBOEIsTUFBOUIsQ0FBc0MsR0FBRCxJQUFTO0FBQzNFLGlCQUFPLFdBQVcsR0FBWCxNQUFvQixvQkFBb0IsR0FBcEIsQ0FBM0I7QUFDRCxTQUY4QixDQUEvQjtBQUdBO0FBQ0E7QUFDQTtBQUNBLFlBQUksQ0FBQyx1QkFBdUIsTUFBeEIsSUFBa0MsQ0FBQyxLQUF2QyxFQUE4QztBQUM5QyxjQUFNLHFCQUFxQix1QkFBdUIsTUFBdkIsQ0FBOEIsQ0FBQyxHQUFELEVBQU0sR0FBTixLQUFjO0FBQ3JFLGNBQUksR0FBSixJQUFXLFdBQVcsR0FBWCxDQUFYO0FBQ0EsaUJBQU8sR0FBUDtBQUNELFNBSDBCLEVBR3hCLEVBSHdCLENBQTNCO0FBSUEsY0FBTSxlQUFlLFFBQVEsRUFBUixxQkFBa0IsbUJBQWxCLEVBQTBDLGtCQUExQyxDQUFyQjtBQUNBLGFBQUssb0JBQUwsR0FBNEIsWUFBNUI7QUFDQSxjQUFNLENBQUMsV0FBRCxFQUFjLFlBQWQsSUFBOEIsQ0FBQyxLQUFLLG9CQUFOLEVBQTRCLG1CQUE1QixDQUFwQztBQUNBLGFBQUssdUJBQUwsQ0FBNkIsV0FBN0IsRUFBMEMsWUFBMUM7QUFDQSxhQUFLLGdCQUFMLENBQXNCLFdBQXRCLEVBQW1DLFlBQW5DO0FBQ0Q7O0FBR0Q7Ozs7OztBQU1BO0FBQ0EsdUJBQWlCLFVBQWpCLEVBQTZCLFdBQTdCLEVBQTBDO0FBQ3hDO0FBQ0Q7O0FBRUQsc0JBQWdCO0FBQ2Q7QUFDQTtBQUNBLGNBQU0sb0JBQW9CLEtBQUssaUJBQS9CO0FBQ0E7QUFDQSxZQUFJLENBQUMsaUJBQUwsRUFBd0I7O0FBRXhCLGNBQU0sYUFBYSxrQkFBa0IsV0FBbEIsQ0FDakIsS0FBSyxXQUFMLENBQWlCLGdCQURBLENBQW5CO0FBR0EsYUFBSyxpQkFBTCxDQUF1QixVQUF2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNEOztBQUVELHNCQUFnQjtBQUNkO0FBQ0E7QUFDQTtBQUNBLGNBQU0sb0JBQW9CLEtBQUssaUJBQS9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSSxpQkFBSixFQUF1QjtBQUNyQixlQUFLLGlCQUFMLENBQXVCLElBQXZCLEVBQTZCLEVBQUUsT0FBTyxJQUFULEVBQTdCO0FBQ0Q7QUFDRjs7QUFFRDs7QUFFQTs7QUFFQTs7Ozs7QUFLQSwwQ0FBb0MsUUFBcEMsRUFBOEM7QUFDNUMsWUFBSSxrQkFBa0IsS0FBSyxhQUEzQjtBQUNBLGVBQU8sbUJBQW1CLENBQUMsU0FBUyxlQUFULENBQTNCLEVBQXNEO0FBQ3BELDRCQUFrQixnQkFBZ0IsYUFBbEM7QUFDRDtBQUNELGVBQU8sZUFBUDtBQUNEOztBQUVEOzs7O0FBSUEsVUFBSSxxQkFBSixHQUE0QjtBQUMxQjtBQUNBLGVBQU8sQ0FBQyxHQUFHLEtBQUssVUFBTCxDQUFnQixnQkFBaEIsQ0FBaUMsc0JBQWpDLENBQUosQ0FBUDtBQUNEOztBQUVEOzs7O0FBSUEsVUFBSSxtQkFBSixHQUEwQjtBQUN4QixlQUFPLEtBQUssV0FBTCxHQUFtQixJQUFuQixJQUEyQixJQUFsQztBQUNEOztBQUVEOzs7O0FBSUEsVUFBSSxrQkFBSixHQUF5QjtBQUN2QjtBQUNBLFlBQUksU0FBUyxLQUFLLGFBQWxCO0FBQ0EsZUFBTyxVQUFVLENBQUMsT0FBTyxZQUFQLENBQW9CLG9CQUFwQixDQUFsQixFQUE2RDtBQUMzRCxtQkFBUyxPQUFPLGFBQWhCO0FBQ0Q7QUFDRCxlQUFPLFVBQVUsSUFBakI7QUFDRDs7QUFFRDs7OztBQUlBLFVBQUksb0JBQUosR0FBMkI7QUFDekI7QUFDQSxlQUFPLENBQUMsR0FBRyxLQUFLLGdCQUFMLENBQXNCLHNCQUF0QixDQUFKLENBQVA7QUFDRDs7QUFFRDs7OztBQUlBLFVBQUksMEJBQUosR0FBaUM7QUFDL0IsWUFBSSxnQkFBZ0IsS0FBSyxhQUF6QjtBQUNBO0FBQ0EsWUFBSSxrQkFBa0IsSUFBdEIsRUFBNEI7QUFDMUIsaUJBQU8sSUFBUDtBQUNEO0FBQ0Qsd0JBQWdCLGNBQWMsT0FBZCxDQUFzQixzQkFBdEIsQ0FBaEI7QUFDQSxlQUFPLGlCQUFpQixLQUFLLG1CQUE3QjtBQUNEOztBQUVEOzs7O0FBSUEsVUFBSSxpQkFBSixHQUF3QjtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSSxLQUFLLGtCQUFULEVBQTZCO0FBQzNCLGlCQUFPLEtBQUssa0JBQVo7QUFDRDtBQUNELFlBQUksS0FBSyxjQUFULEVBQXlCLE9BQU8sSUFBUDtBQUN6QixhQUFLLGtCQUFMLEdBQTBCLEtBQUssMEJBQS9CO0FBQ0EsZUFBTyxLQUFLLGtCQUFaO0FBQ0Q7O0FBRUQ7Ozs7QUFJQTtBQUNBLFVBQUksZUFBSixHQUFzQjtBQUNwQixZQUFJLG9CQUFvQixLQUFLLGlCQUE3QjtBQUNBLGVBQU8saUJBQVAsRUFBMEI7QUFDeEIsZ0JBQU0scUJBQXFCLGtCQUFrQixpQkFBN0M7QUFDQSxjQUFJLENBQUMsa0JBQUwsRUFBeUI7QUFDdkIsbUJBQU8saUJBQVA7QUFDRDtBQUNELDhCQUFvQixrQkFBcEI7QUFDRDtBQUNELGVBQU8saUJBQVAsQ0FUb0IsQ0FTTTtBQUMzQjs7QUFFRDs7OztBQUlBO0FBQ0EsVUFBSSw0QkFBSixHQUFtQztBQUNqQyxjQUFNLGVBQWUsQ0FBQyxHQUFHLEtBQUssb0JBQVQsRUFBK0IsR0FBRyxLQUFLLHFCQUF2QyxDQUFyQjtBQUNBLGNBQU0sc0JBQXNCLGFBQWEsTUFBYixDQUFxQixLQUFELElBQVcsTUFBTSwwQkFBTixLQUFxQyxJQUFwRSxDQUE1QjtBQUNBLGVBQU8sbUJBQVA7QUFDRDs7QUFFRDs7OztBQUlBLFVBQUksbUJBQUosR0FBMEI7QUFDeEIsZUFBTyxLQUFLLG9CQUFaO0FBQ0Q7O0FBRUQseUNBQW1DO0FBQ2pDLGNBQU0sb0JBQW9CLEtBQUssaUJBQS9CO0FBQ0EsWUFBSSxDQUFDLGlCQUFMLEVBQXdCO0FBQ3hCLDBCQUFrQixjQUFsQixDQUFpQyxJQUFqQztBQUNEOztBQUVELDZDQUF1QztBQUNyQyxjQUFNLG9CQUFvQixLQUFLLGlCQUEvQjtBQUNBLFlBQUksQ0FBQyxpQkFBTCxFQUF3QjtBQUN4QiwwQkFBa0IsZ0JBQWxCLENBQW1DLElBQW5DO0FBQ0Q7O0FBRUQ7Ozs7O0FBS0EscUJBQWUsS0FBZixFQUFzQjtBQUNwQixhQUFLLG9CQUFMLENBQTBCLElBQTFCLENBQStCLEtBQS9CO0FBQ0Q7O0FBRUQ7Ozs7O0FBS0EsdUJBQWlCLEtBQWpCLEVBQXdCO0FBQ3RCLGFBQUssb0JBQUwsR0FDRSxLQUFLLG9CQUFMLENBQTBCLE1BQTFCLENBQWtDLE1BQUQsSUFBWSxXQUFXLEtBQXhELENBREY7QUFFRDs7QUFFRDs7O0FBR0E7Ozs7O0FBS0EsdUJBQWlCLElBQWpCLEVBQXVCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBLFlBQUksS0FBSyxjQUFMLENBQW9CLElBQXBCLENBQUosRUFBK0I7QUFDN0IsZ0JBQU0sUUFBUSxLQUFLLElBQUwsQ0FBZDtBQUNBO0FBQ0EsaUJBQU8sS0FBSyxJQUFMLENBQVA7QUFDQTtBQUNBLGVBQUssSUFBTCxJQUFhLEtBQWI7QUFDQTtBQUNEO0FBQ0Y7O0FBRUQ7Ozs7OztBQU1BLHVCQUFpQixHQUFqQixFQUFzQixLQUF0QixFQUE2QjtBQUMzQjtBQUNBLFlBQUksQ0FBQyxLQUFLLFlBQUwsQ0FBa0IsR0FBbEIsQ0FBTCxFQUE2QjtBQUMzQixlQUFLLFlBQUwsQ0FBa0IsR0FBbEIsRUFBdUIsS0FBdkI7QUFDRDtBQUNGOztBQUVELHdCQUFrQjtBQUNoQixjQUFNLEVBQUUsUUFBRixLQUFlLEtBQUssV0FBMUI7QUFDQSxvQkFDQSxLQUFLLFVBQUwsQ0FBZ0IsV0FBaEIsQ0FBNEIsU0FBUyxPQUFULENBQWlCLFNBQWpCLENBQTJCLElBQTNCLENBQTVCLENBREE7QUFFRDs7QUFFRDs7Ozs7QUFLQSxzQkFBZ0IsV0FBaEIsRUFBNkIsV0FBN0IsRUFBMEM7QUFDeEM7QUFDQTtBQUNBO0FBQ0EsYUFBSyxrQkFBTCxDQUF3QixXQUF4QixFQUFxQyxXQUFyQztBQUNEOztBQUVEOzs7Ozs7QUFNQSx5QkFBbUIsV0FBbkIsRUFBZ0MsV0FBaEMsRUFBNkM7QUFDM0M7QUFDQSxhQUFLLGlCQUFMLENBQXVCLFdBQXZCLEVBQW9DLFdBQXBDO0FBQ0Q7O0FBRUQ7Ozs7OztBQU1BO0FBQ0Esd0JBQWtCLFdBQWxCLEVBQStCLFdBQS9CLEVBQTRDLENBRTNDO0FBREM7OztBQUdGOzs7Ozs7O0FBT0EsMEJBQW9CO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUssb0JBQUw7QUFDRDs7QUFFRDs7O0FBR0EsNkJBQXVCO0FBQ3JCLGFBQUssVUFBTCxHQUFrQixJQUFsQjtBQUNBLGFBQUssZUFBTCxHQUF1QixLQUF2QjtBQUNBLFlBQUksZ0JBQUosQ0FBcUIsY0FBckIsRUFBcUMsS0FBSyxvQkFBMUMsRUFBZ0UsS0FBaEU7QUFDQSxjQUFNLEVBQUUsbUJBQUYsRUFBdUIsa0JBQXZCLEtBQThDLEtBQUssV0FBekQ7QUFDQSw0QkFBb0IsT0FBcEIsQ0FBNkIsUUFBRCxJQUFjO0FBQ3hDLGVBQUssZ0JBQUwsQ0FBc0IsUUFBdEI7QUFDRCxTQUZEO0FBR0EsZUFBTyxJQUFQLENBQVksa0JBQVosRUFBZ0MsT0FBaEMsQ0FBeUMsUUFBRCxJQUFjO0FBQ3BELGVBQUssZ0JBQUwsQ0FBc0IsUUFBdEIsRUFBZ0MsbUJBQW1CLFFBQW5CLENBQWhDO0FBQ0QsU0FGRDtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSyxnQ0FBTDtBQUNBLGFBQUssYUFBTCxHQWhCcUIsQ0FnQkM7QUFDdEI7QUFDQTtBQUNBLGFBQUssNEJBQUw7QUFDQTtBQUNBLGFBQUssbUJBQUw7QUFDRDs7QUFFRDs7O0FBR0EsNEJBQXNCLENBRXJCO0FBREM7OztBQUdGO0FBQ0EsNkJBQXVCO0FBQ3JCLGFBQUssdUJBQUw7QUFDRDs7QUFFRDs7O0FBR0EsZ0NBQTBCO0FBQ3hCLGFBQUssYUFBTDtBQUNBLGFBQUssb0JBQUw7QUFDQSxhQUFLLG9DQUFMO0FBQ0EsWUFBSSxtQkFBSixDQUF3QixjQUF4QixFQUF3QyxLQUFLLG9CQUE3QyxFQUFtRSxLQUFuRTtBQUNBLGFBQUssVUFBTCxHQUFrQixLQUFsQjtBQUNBLGFBQUssZUFBTCxHQUF1QixJQUF2QjtBQUNBLGFBQUssa0JBQUwsR0FBMEIsSUFBMUI7QUFDQTtBQUNBLGFBQUssc0JBQUw7QUFDRDs7QUFFRDs7O0FBR0EsK0JBQXlCO0FBQ3ZCO0FBQ0Q7O0FBRUQsb0JBQWMsRUFBRSxXQUFXLEVBQWIsRUFBaUIsV0FBVyxFQUE1QixFQUFkLEVBQWdEO0FBQzlDLGNBQU0sUUFBUSxNQUFNLFNBQU4sQ0FBZ0IsSUFBaEIsQ0FBZDtBQUNBLFlBQUksQ0FBQyxRQUFELElBQWEsQ0FBQyxRQUFsQixFQUE0QixPQUFPLEtBQVA7QUFDNUIsWUFBSSxNQUFNLFlBQU4sQ0FBbUIsSUFBbkIsQ0FBSixFQUE4QjtBQUM1QixnQkFBTSxZQUFOLENBQW1CLElBQW5CLEVBQTBCLEdBQUUsUUFBUyxHQUFFLE1BQU0sWUFBTixDQUFtQixJQUFuQixDQUF5QixHQUFFLFFBQVMsRUFBM0U7QUFDRDtBQUNELGNBQU0sZ0JBQU4sQ0FBdUIsc0JBQXZCLEVBQStDLE9BQS9DLENBQXdELEtBQUQsSUFBVztBQUNoRSxjQUFJLE1BQU0sWUFBTixDQUFtQixJQUFuQixDQUFKLEVBQThCO0FBQzVCLGtCQUFNLFlBQU4sQ0FBbUIsSUFBbkIsRUFBMEIsR0FBRSxRQUFTLEdBQUUsTUFBTSxZQUFOLENBQW1CLElBQW5CLENBQXlCLEdBQUUsUUFBUyxFQUEzRTtBQUNEO0FBQ0YsU0FKRDtBQUtBLGVBQU8sS0FBUDtBQUNEOztBQUdEOzs7Ozs7QUFNQSwrQkFBeUIsSUFBekIsRUFBK0IsUUFBL0IsRUFBeUMsUUFBekMsRUFBbUQ7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSSxLQUFLLFlBQUwsQ0FBa0IsSUFBbEIsTUFBNEIsUUFBaEMsRUFBMEM7QUFDMUMsYUFBSywyQkFBTCxDQUFpQyxJQUFqQyxFQUF1QyxRQUF2QyxFQUFpRCxRQUFqRDtBQUNEOztBQUVEOzs7Ozs7O0FBT0Esa0NBQTRCLElBQTVCLEVBQWtDLFFBQWxDLEVBQTRDLFFBQTVDLEVBQXNEO0FBQ3BELGFBQUssaUNBQUwsQ0FBdUMsSUFBdkMsRUFBNkMsUUFBN0MsRUFBdUQsUUFBdkQ7QUFDQTtBQUNBLGFBQUssMEJBQUwsQ0FBZ0MsSUFBaEMsRUFBc0MsUUFBdEMsRUFBZ0QsUUFBaEQ7QUFDRDs7QUFFRDs7Ozs7OztBQU9BO0FBQ0EsaUNBQTJCLElBQTNCLEVBQWlDLFFBQWpDLEVBQTJDLFFBQTNDLEVBQXFEO0FBQ25EO0FBQ0Q7QUFqNEI0Qzs7QUFvNEIvQzs7O0FBR0EsYUFBUyx5QkFBVCxDQUFtQyxLQUFuQyxFQUEwQztBQUN4QyxZQUFNLG9CQUFvQixNQUFNLGlCQUFoQztBQUNBLFlBQU0sV0FBVyxTQUFTLGFBQVQsQ0FBdUIsVUFBdkIsQ0FBakI7QUFDQSxlQUFTLFNBQVQsR0FBcUIsaUJBQXJCOztBQUVBOzs7QUFHQSxhQUFPLGNBQVAsQ0FBc0IsS0FBdEIsRUFBNkIsVUFBN0IsRUFBeUM7QUFDdkMsY0FBTTtBQUFFLGlCQUFPLFFBQVA7QUFBa0IsU0FEYTtBQUV2QyxvQkFBWSxLQUYyQjtBQUd2QyxzQkFBYztBQUh5QixPQUF6Qzs7QUFNQTs7O0FBR0EsYUFBTyxjQUFQLENBQXNCLEtBQXRCLEVBQTZCLGdCQUE3QixFQUErQztBQUM3QyxjQUFNO0FBQ0osaUJBQU8sTUFBTSxRQUFOLENBQWUsT0FBZixDQUF1QixhQUF2QixDQUFxQyxPQUFyQyxFQUE4QyxTQUFyRDtBQUNELFNBSDRDO0FBSTdDLFlBQUksS0FBSixFQUFXO0FBQ1QsZ0JBQU0sUUFBTixDQUFlLE9BQWYsQ0FBdUIsYUFBdkIsQ0FBcUMsT0FBckMsRUFBOEMsU0FBOUMsR0FBMEQsS0FBMUQ7QUFDRCxTQU40QztBQU83QyxvQkFBWSxLQVBpQztBQVE3QyxzQkFBYztBQVIrQixPQUEvQzs7QUFXQSxhQUFPLEtBQVA7QUFDRDs7QUFFRCxhQUFTLFlBQVQsQ0FBc0IsS0FBdEIsRUFBNkI7QUFDM0IsWUFBTSxZQUFOLEdBQXFCLE1BQU07QUFDekIsY0FBTSxtQkFBbUIsTUFBTSxnQkFBL0I7QUFDQSxjQUFNLGVBQWUsTUFBTSxZQUEzQjtBQUNBO0FBQ0EscUJBQWEsT0FBYixDQUFzQixVQUFELElBQWdCLFdBQVcsWUFBWCxFQUFyQztBQUNBO0FBQ0EsWUFBSSxlQUFlLEdBQWYsQ0FBbUIsZ0JBQW5CLENBQUosRUFBMEMsT0FBTyxnQkFBUDtBQUMxQztBQUNBLGNBQU0saUJBQWlCLENBQUMsQ0FBQyxJQUFJLGlCQUFKLElBQXlCLEVBQTFCLEVBQThCLGdCQUE5QixLQUFtRCxFQUFwRCxFQUF3RCxjQUEvRTtBQUNBLFlBQUksY0FBSixFQUFvQjtBQUNsQixnQkFBTSxjQUFOLElBQXdCLG1DQUF4QjtBQUNBLGdCQUFNLGNBQU4sSUFBd0IsY0FBeEI7QUFDRDtBQUNEO0FBQ0E7QUFDQSx1QkFBZSxNQUFmLENBQXNCLGdCQUF0QixFQUF3QyxLQUF4QztBQUNBLGVBQU8sZ0JBQVA7QUFDRCxPQWpCRDs7QUFtQkE7OztBQUdBLGFBQU8sY0FBUCxDQUFzQixLQUF0QixFQUE2QixvQkFBN0IsRUFBbUQ7QUFDakQsY0FBTTtBQUNKLGdCQUFNLFFBQVEsQ0FBQyxLQUFELENBQWQ7QUFDQSxjQUFJLGNBQWMsT0FBTyxjQUFQLENBQXNCLEtBQXRCLENBQWxCO0FBQ0EsaUJBQU8sZ0JBQWdCLFdBQXZCLEVBQW9DO0FBQ2xDLGtCQUFNLElBQU4sQ0FBVyxXQUFYO0FBQ0EsMEJBQWMsT0FBTyxjQUFQLENBQXNCLFdBQXRCLENBQWQ7QUFDRDtBQUNELGdCQUFNLElBQU4sQ0FBVyxXQUFYO0FBQ0EsaUJBQU8sS0FBUDtBQUNELFNBVmdEO0FBV2pELG9CQUFZLEtBWHFDO0FBWWpELHNCQUFjO0FBWm1DLE9BQW5EOztBQWVBLGFBQU8sS0FBUDtBQUNEOztBQUVELFdBQU87QUFDTCwwQkFESztBQUVMLCtCQUZLO0FBR0w7QUFISyxLQUFQO0FBS0QsR0F6OUJNLENBQVA7QUEwOUJEOzs7Ozs7OztrQkNwL0J1Qix3Qjs7QUFMeEI7Ozs7QUFDQTs7Ozs7O0FBRUEsTUFBTSxtQkFBbUIsMEJBQXpCOztBQUVlLFNBQVMsd0JBQVQsQ0FBa0MsR0FBbEMsRUFBdUM7QUFDcEQsU0FBTyx3Q0FBeUIsR0FBekIsRUFBOEIsZ0JBQTlCLEVBQWdELE1BQU07QUFDM0QsVUFBTTtBQUNKLDBCQURJO0FBRUosK0JBRkk7QUFHSjtBQUhJLFFBSUYsb0NBQXdCLEdBQXhCLENBSko7O0FBTUEsVUFBTSxxQkFBTixTQUFvQyxvQkFBcEMsQ0FBeUQ7O0FBRXZELGlCQUFXLGdCQUFYLEdBQThCO0FBQzVCLGVBQU8sZ0JBQVA7QUFDRDs7QUFFRCxpQkFBVyxpQkFBWCxHQUErQjtBQUM3QixlQUFROzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7U0FBUjtBQTRFRDs7QUFFRCxxQkFBZSxNQUFmLEVBQXVCO0FBQ3JCO0FBQ0Q7QUF2RnNEOztBQTBGekQsV0FBTyxhQUNMLDBCQUNFLHFCQURGLENBREssQ0FBUDtBQUtELEdBdEdNLENBQVA7QUF1R0Q7O0FBRUQseUJBQXlCLGdCQUF6QixHQUE0QyxnQkFBNUM7Ozs7Ozs7O2tCQ3hHd0IsOEI7O0FBTnhCOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsTUFBTSxtQkFBbUIsaUNBQXpCOztBQUVlLFNBQVMsOEJBQVQsQ0FBd0MsR0FBeEMsRUFBNkM7QUFDMUQsU0FBTyx3Q0FBeUIsR0FBekIsRUFBOEIsZ0JBQTlCLEVBQWdELE1BQU07QUFDM0QsVUFBTTtBQUNKLDBCQURJO0FBRUosK0JBRkk7QUFHSjtBQUhJLFFBSUYsb0NBQXdCLEdBQXhCLENBSko7QUFLQSxVQUFNLHdCQUF3QixxQ0FBeUIsR0FBekIsQ0FBOUI7O0FBRUEsVUFBTSwyQkFBTixTQUEwQyxvQkFBMUMsQ0FBK0Q7O0FBRTdELGlCQUFXLGdCQUFYLEdBQThCO0FBQzVCLGVBQU8sZ0JBQVA7QUFDRDs7QUFFRCxpQkFBVyxpQkFBWCxHQUErQjtBQUM3QixlQUFROzs7Ozs7Ozs7Ozs7Ozs7O1NBQVI7QUFpQkQ7O0FBRUQsaUJBQVcsWUFBWCxHQUEwQjtBQUN4QixlQUFPLENBQUMscUJBQUQsQ0FBUDtBQUNEOztBQTVCNEQ7O0FBZ0MvRCxXQUFPLGFBQ0wsMEJBQ0UsMkJBREYsQ0FESyxDQUFQO0FBS0QsR0E3Q00sQ0FBUDtBQThDRDs7QUFFRCwrQkFBK0IsZ0JBQS9CLEdBQWtELGdCQUFsRDs7Ozs7Ozs7O2tCQ2xEd0IsZ0M7O0FBTnhCOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsTUFBTSxtQkFBbUIsb0NBQXpCOztBQUVlLFNBQVMsZ0NBQVQsQ0FBMEMsR0FBMUMsRUFBK0M7QUFDNUQsU0FBTyx3Q0FBeUIsR0FBekIsRUFBOEIsZ0JBQTlCLEVBQWdELE1BQU07QUFDM0QsVUFBTTtBQUNKLDBCQURJO0FBRUosK0JBRkk7QUFHSjtBQUhJLFFBSUYsb0NBQXdCLEdBQXhCLENBSko7O0FBTUEsVUFBTSw2QkFBTixTQUE0QyxvQkFBNUMsQ0FBaUU7O0FBRS9ELGlCQUFXLGdCQUFYLEdBQThCO0FBQzVCLGVBQU8sZ0JBQVA7QUFDRDs7QUFFRCxpQkFBVyxpQkFBWCxHQUErQjtBQUM3QixlQUFROzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7U0FBUjtBQWdFRDs7QUFFRCxpQkFBVyxrQkFBWCxHQUFnQztBQUM5QixlQUFPO0FBQ0wsZ0JBQU07QUFERCxTQUFQO0FBR0Q7O0FBRUQscUJBQWUsTUFBZixFQUF1QjtBQUNyQixZQUFJLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBN0IsRUFBMkM7QUFDekM7QUFDQTtBQUNEO0FBQ0Y7O0FBcEY4RDs7QUF3RmpFLFdBQU8sYUFDTCx5QkFDRSwwQkFDRSw2QkFERixDQURGLENBREssQ0FBUDtBQVFELEdBdkdNLENBQVA7QUF3R0Q7O0FBRUQsaUNBQWlDLGdCQUFqQyxHQUFvRCxnQkFBcEQ7Ozs7Ozs7Ozs7a0JDdEd3Qix1Qjs7QUFYeEI7Ozs7QUFDQTs7Ozs7O0FBRUEsTUFBTSxtQkFBbUIseUJBQXpCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWUsU0FBUyx1QkFBVCxDQUFpQyxHQUFqQyxFQUFzQztBQUNuRCxTQUFPLHdDQUF5QixHQUF6QixFQUE4QixnQkFBOUIsRUFBZ0QsTUFBTTtBQUMzRCxVQUFNO0FBQ0osMEJBREk7QUFFSiwrQkFGSTtBQUdKO0FBSEksUUFJRixvQ0FBd0IsR0FBeEIsQ0FKSjs7QUFNQSxVQUFNLG9CQUFOLFNBQW1DLG9CQUFuQyxDQUF3RDs7QUFFdEQsaUJBQVcsZ0JBQVgsR0FBOEI7QUFDNUIsZUFBTyxnQkFBUDtBQUNEOztBQUVELGlCQUFXLGlCQUFYLEdBQStCO0FBQzdCLGVBQVE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7U0FBUjtBQXVCRDs7QUFFRCxpQkFBVyxtQkFBWCxHQUFpQztBQUMvQixjQUFNLCtCQUErQixNQUFNLG1CQUFOLElBQTZCLEVBQWxFO0FBQ0EsZUFBTyxDQUFDLEdBQUcsNEJBQUosRUFBa0MsT0FBbEMsQ0FBUDtBQUNEOztBQUVELGlCQUFXLGtCQUFYLEdBQWdDO0FBQzlCLGNBQU0sOEJBQThCLE1BQU0sa0JBQU4sSUFBNEIsRUFBaEU7QUFDQSxlQUFPLENBQUMsR0FBRywyQkFBSixFQUFpQyxPQUFqQyxDQUFQO0FBQ0Q7O0FBRUQsVUFBSSxLQUFKLEdBQVk7QUFDVixlQUFPLEtBQUssWUFBTCxDQUFrQixPQUFsQixDQUFQO0FBQ0Q7O0FBRUQsVUFBSSxLQUFKLENBQVUsS0FBVixFQUFpQjtBQUNmLGNBQU0sV0FBVyxDQUFDLENBQUMsU0FBRCxFQUFZLElBQVosRUFBa0IsUUFBbEIsQ0FBMkIsS0FBM0IsQ0FBbEI7QUFDQSxjQUFNLGNBQWMsT0FBTyxLQUFQLENBQXBCO0FBQ0EsWUFBSSxRQUFKLEVBQWM7QUFDWixlQUFLLFlBQUwsQ0FBa0IsT0FBbEIsRUFBMkIsV0FBM0I7QUFDRCxTQUZELE1BRU87QUFDTCxlQUFLLGVBQUwsQ0FBcUIsT0FBckI7QUFDRDtBQUNGOztBQUVELCtCQUF5QixJQUF6QixFQUErQixRQUEvQixFQUF5QyxRQUF6QyxFQUFtRDtBQUNqRCxjQUFNLHdCQUFOLElBQ0UsTUFBTSx3QkFBTixDQUErQixJQUEvQixFQUFxQyxRQUFyQyxFQUErQyxRQUEvQyxDQURGOztBQUdBLGNBQU0sV0FBVyxDQUFDLENBQUMsU0FBRCxFQUFZLElBQVosRUFBa0IsUUFBbEIsQ0FBMkIsUUFBM0IsQ0FBbEI7QUFDQSxZQUFJLFNBQVMsT0FBYixFQUFzQjtBQUNwQixxQkFBVyxLQUFLLFNBQUwsRUFBWCxHQUE4QixLQUFLLFlBQUwsRUFBOUI7QUFDRDtBQUNGOztBQUVELGtCQUFZO0FBQ1YsY0FBTSxPQUFPLEtBQUssVUFBTCxDQUFnQixhQUFoQixDQUE4QixZQUE5QixDQUFiO0FBQ0EsYUFBSyxZQUFMLENBQWtCLEdBQWxCLEVBQXVCLEtBQUssS0FBNUI7QUFDRDs7QUFFRCxxQkFBZTtBQUNiLGNBQU0sT0FBTyxLQUFLLFVBQUwsQ0FBZ0IsYUFBaEIsQ0FBOEIsWUFBOUIsQ0FBYjtBQUNBLGFBQUssWUFBTCxDQUFrQixHQUFsQixFQUF1QixFQUF2QjtBQUNEOztBQTFFcUQ7O0FBOEV4RCxXQUFPLGFBQ0wsMEJBQ0Usb0JBREYsQ0FESyxDQUFQO0FBTUQsR0EzRk0sQ0FBUDtBQTRGRDs7QUFFRCx3QkFBd0IsZ0JBQXhCLEdBQTJDLGdCQUEzQzs7Ozs7Ozs7O0FDM0dBOzs7Ozs7QUFFQTs7Ozs7Ozs7QUFRQSxNQUFNLHlCQUEwQixHQUFELElBQVUsVUFBRCxJQUFnQjtBQUN0RCxTQUFPLDRCQUFhLEdBQWIsRUFBa0IsVUFBbEIsQ0FBUDtBQUNELENBRkQ7O2tCQUllLHNCOzs7Ozs7Ozs7OztBQ1pmOzs7O0FBR0E7Ozs7QUFHQTs7OztBQUdBOzs7O0FBR0E7Ozs7QUFDQTs7OztBQUdBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBR0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUpBOzs7QUFOQTs7O0FBSkE7OztBQU5BOztBQU5BO0FBNEJBLE1BQU0sZ0JBQWdCO0FBQ3BCLEdBQUMsZ0NBQXlCLGdCQUExQixHQUNFLCtCQUZrQjtBQUdwQixHQUFDLHNDQUErQixnQkFBaEMsR0FDRSxxQ0FKa0I7QUFLcEIsR0FBQyx3Q0FBaUMsZ0JBQWxDLEdBQ0UsdUNBTmtCO0FBT3BCLEdBQUMsK0JBQXdCLGdCQUF6QixHQUNFO0FBUmtCLENBQXRCOztBQVdBOzs7Ozs7Ozs7OztBQTlCQTs7O0FBTkE7QUE2Q0EsU0FBUyxpQkFBVCxDQUEyQixNQUFNLE1BQWpDLEVBQXlDO0FBQ3ZDOzs7Ozs7O0FBT0EsU0FBTyxVQUFVLFVBQVYsRUFBc0I7QUFDM0IsV0FBTyxzQ0FBdUIsR0FBdkIsRUFBNEIsVUFBNUIsRUFDSixNQURJLENBQ0csQ0FBQyxHQUFELEVBQU0sRUFBRSxnQkFBRixFQUFOLEtBQStCO0FBQ3JDLFlBQU0saUJBQWlCLGNBQWMsZ0JBQWQsRUFBZ0MsTUFBaEMsQ0FBdkI7QUFDQSxxQkFBZSxZQUFmO0FBQ0EsVUFBSSxnQkFBSixJQUF3QixjQUF4QjtBQUNBLGFBQU8sR0FBUDtBQUNELEtBTkksRUFNRixFQU5FLENBQVA7QUFPRCxHQVJEO0FBU0Q7O1FBR0MsYSxHQUFBLGE7UUFHQSxpQixHQUFBLGlCO1FBQ0Esc0IsR0FBQSxnQztRQUdBLHdCLEdBQUEsa0M7UUFHQSx1QixHQUFBLDhCO1FBR0EsUyxHQUFBLG1CO1FBR0Esb0IsR0FBQSwyQjtRQUNBLGtCLEdBQUEseUI7UUFHQSxVLEdBQUEsb0I7UUFDQSxNLEdBQUEsZ0I7UUFDQSxRLEdBQUEsa0I7UUFDQSxlLEdBQUEseUI7UUFHQSx3QixHQUFBLCtCO1FBQ0EsOEIsR0FBQSxxQztRQUNBLGdDLEdBQUEsdUM7UUFDQSx1QixHQUFBLDhCOztBQUdGOztBQUVBLElBQUksUUFBUSxZQUFaOztBQUVBLElBQUksUUFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUE3QixFQUEyQztBQUN6QyxVQUFRLFNBQVI7QUFDRDs7QUFFRCxRQUFRLEdBQVIsQ0FBYSxrQ0FBaUMsS0FBTSxTQUFwRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCIvKlxuREJVSVdlYkNvbXBvbmVudEJhc2UgKGZyb20gd2hpY2ggYWxsIHdlYi1jb21wb25lbnRzIGluaGVyaXQpXG53aWxsIHJlYWQgY29tcG9uZW50U3R5bGUgZnJvbSB3aW4uREJVSVdlYkNvbXBvbmVudHNcbndoZW4ga2xhc3MucmVnaXN0ZXJTZWxmKCkgaXMgY2FsbGVkIGdpdmluZyBhIGNoYW5jZSB0byBvdmVycmlkZSBkZWZhdWx0IHdlYi1jb21wb25lbnQgc3R5bGVcbmp1c3QgYmVmb3JlIGl0IGlzIHJlZ2lzdGVyZWQuXG4qL1xuY29uc3QgYXBwZW5kU3R5bGUgPSAod2luKSA9PiAocmVnaXN0cmF0aW9uTmFtZSwgY29tcG9uZW50U3R5bGUpID0+IHtcbiAgaWYgKCF3aW4uREJVSVdlYkNvbXBvbmVudHMpIHtcbiAgICB3aW4uREJVSVdlYkNvbXBvbmVudHMgPSB7fTtcbiAgfVxuICB3aW4uREJVSVdlYkNvbXBvbmVudHMgPSB7XG4gICAgLi4ud2luLkRCVUlXZWJDb21wb25lbnRzLFxuICAgIFtyZWdpc3RyYXRpb25OYW1lXToge1xuICAgICAgLi4ud2luLkRCVUlXZWJDb21wb25lbnRzW3JlZ2lzdHJhdGlvbk5hbWVdLFxuICAgICAgY29tcG9uZW50U3R5bGVcbiAgICB9XG4gIH07XG59O1xuXG5jb25zdCBhcHBlbmRTdHlsZXMgPSAod2luKSA9PiAoY29tcG9uZW50cykgPT4ge1xuICBjb21wb25lbnRzLmZvckVhY2goKHsgcmVnaXN0cmF0aW9uTmFtZSwgY29tcG9uZW50U3R5bGUgfSkgPT4ge1xuICAgIGFwcGVuZFN0eWxlKHdpbikocmVnaXN0cmF0aW9uTmFtZSwgY29tcG9uZW50U3R5bGUpO1xuICB9KTtcbiAgcmV0dXJuIGNvbXBvbmVudHM7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhcHBlbmRTdHlsZXM7XG4iLCJcbi8qKlxuICpcbiAqIEBwYXJhbSB3aW4gV2luZG93XG4gKiBAcGFyYW0gbmFtZSBTdHJpbmdcbiAqIEBwYXJhbSBjYWxsYmFjayBGdW5jdGlvblxuICogQHJldHVybiAqXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbih3aW4sIG5hbWUsIGNhbGxiYWNrKSB7XG4gIGlmICghd2luLkRCVUlXZWJDb21wb25lbnRzKSB7XG4gICAgd2luLkRCVUlXZWJDb21wb25lbnRzID0geyByZWdpc3RyYXRpb25zOiB7fSB9O1xuICB9IGVsc2UgaWYgKCF3aW4uREJVSVdlYkNvbXBvbmVudHMucmVnaXN0cmF0aW9ucykge1xuICAgIHdpbi5EQlVJV2ViQ29tcG9uZW50cy5yZWdpc3RyYXRpb25zID0ge307XG4gIH1cblxuICBsZXQgcmVnaXN0cmF0aW9uID0gd2luLkRCVUlXZWJDb21wb25lbnRzLnJlZ2lzdHJhdGlvbnNbbmFtZV07XG5cbiAgaWYgKHJlZ2lzdHJhdGlvbikgcmV0dXJuIHJlZ2lzdHJhdGlvbjtcblxuICByZWdpc3RyYXRpb24gPSBjYWxsYmFjaygpO1xuICB3aW4uREJVSVdlYkNvbXBvbmVudHMucmVnaXN0cmF0aW9uc1tuYW1lXSA9IHJlZ2lzdHJhdGlvbjtcblxuICByZXR1cm4gd2luLkRCVUlXZWJDb21wb25lbnRzLnJlZ2lzdHJhdGlvbnNbbmFtZV07XG59XG5cbiIsImltcG9ydCBnZXREQlVJbG9jYWxlU2VydmljZSBmcm9tICcuL0RCVUlMb2NhbGVTZXJ2aWNlJztcbmltcG9ydCBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24gZnJvbSAnLi4vaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbic7XG5cbmNvbnN0IGVtcHR5T2JqID0ge307XG5cbmNvbnN0IHJlZ2lzdHJhdGlvbk5hbWUgPSAnREJVSUkxOG5TZXJ2aWNlJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0REJVSUkxOG5TZXJ2aWNlKHdpbikge1xuICBjb25zdCBsb2NhbGVTZXJ2aWNlID0gZ2V0REJVSWxvY2FsZVNlcnZpY2Uod2luKTtcbiAgcmV0dXJuIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbih3aW4sIHJlZ2lzdHJhdGlvbk5hbWUsICgpID0+IHtcbiAgICBjbGFzcyBJMThuU2VydmljZSB7XG4gICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgbG9jYWxlU2VydmljZS5vbkxvY2FsZUNoYW5nZSh0aGlzLl9oYW5kbGVMb2NhbGVDaGFuZ2UuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuX2xvY2FsZSA9IGxvY2FsZVNlcnZpY2UubG9jYWxlO1xuICAgICAgICB0aGlzLl90cmFuc2xhdGlvbnMgPSB7fTtcbiAgICAgIH1cblxuICAgICAgX2hhbmRsZUxvY2FsZUNoYW5nZShsb2NhbGUpIHtcbiAgICAgICAgdGhpcy5fbG9jYWxlID0gbG9jYWxlO1xuICAgICAgfVxuXG4gICAgICBjbGVhclRyYW5zbGF0aW9ucyhsYW5nKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLl90cmFuc2xhdGlvbnNbbGFuZ107XG4gICAgICB9XG5cbiAgICAgIHJlZ2lzdGVyVHJhbnNsYXRpb25zKHRyYW5zbGF0aW9ucykge1xuICAgICAgICB0aGlzLl90cmFuc2xhdGlvbnMgPSBPYmplY3Qua2V5cyh0cmFuc2xhdGlvbnMpLnJlZHVjZSgoYWNjLCBsYW5nKSA9PiB7XG4gICAgICAgICAgYWNjW2xhbmddID0ge1xuICAgICAgICAgICAgLi4udGhpcy5fdHJhbnNsYXRpb25zW2xhbmddLFxuICAgICAgICAgICAgLi4udHJhbnNsYXRpb25zW2xhbmddXG4gICAgICAgICAgfTtcbiAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICB9LCB0aGlzLl90cmFuc2xhdGlvbnMpO1xuICAgICAgfVxuXG4gICAgICB0cmFuc2xhdGUobXNnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRMYW5nVHJhbnNsYXRpb25zW21zZ107XG4gICAgICB9XG5cbiAgICAgIGdldCB0cmFuc2xhdGlvbnMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90cmFuc2xhdGlvbnM7XG4gICAgICB9XG5cbiAgICAgIGdldCBjdXJyZW50TGFuZ1RyYW5zbGF0aW9ucygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zbGF0aW9uc1t0aGlzLl9sb2NhbGUubGFuZ10gfHwgZW1wdHlPYmo7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgaTE4blNlcnZpY2UgPSBuZXcgSTE4blNlcnZpY2UoKTtcbiAgICByZXR1cm4gaTE4blNlcnZpY2U7XG4gIH0pO1xufVxuIiwiXG5pbXBvcnQgZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uIGZyb20gJy4uL2ludGVybmFscy9lbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24nO1xuXG5jb25zdCBkZWZhdWx0TG9jYWxlID0ge1xuICBkaXI6ICdsdHInLFxuICBsYW5nOiAnZW4nXG59O1xuXG5jb25zdCByZWdpc3RyYXRpb25OYW1lID0gJ0RCVUlMb2NhbGVTZXJ2aWNlJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0REJVSUxvY2FsZVNlcnZpY2Uod2luKSB7XG4gIHJldHVybiBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24od2luLCByZWdpc3RyYXRpb25OYW1lLCAoKSA9PiB7XG4gICAgY2xhc3MgTG9jYWxlU2VydmljZSB7XG4gICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tzID0gW107XG4gICAgICAgIHRoaXMuX2xvY2FsZUF0dHJzID0gT2JqZWN0LmtleXMoZGVmYXVsdExvY2FsZSk7XG4gICAgICAgIHRoaXMuX3Jvb3RFbGVtZW50ID0gd2luLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1t4LWRidWktbG9jYWxlLXJvb3RdJykgfHwgd2luLmRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICAgICAgdGhpcy5fbG9jYWxlQXR0cnMuZm9yRWFjaCgoYXR0cikgPT4ge1xuICAgICAgICAgIGlmICghdGhpcy5fcm9vdEVsZW1lbnQuZ2V0QXR0cmlidXRlKGF0dHIpKSB7XG4gICAgICAgICAgICB0aGlzLl9yb290RWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0ciwgZGVmYXVsdExvY2FsZVthdHRyXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fbG9jYWxlID0gdGhpcy5fbG9jYWxlQXR0cnMucmVkdWNlKChhY2MsIGF0dHIpID0+IHtcbiAgICAgICAgICBhY2NbYXR0cl0gPSB0aGlzLl9yb290RWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cik7XG4gICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfSwge30pO1xuICAgICAgICB0aGlzLl9vYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMuX2hhbmRsZU11dGF0aW9ucy5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5fb2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLl9yb290RWxlbWVudCwge1xuICAgICAgICAgIGF0dHJpYnV0ZXM6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIF9oYW5kbGVNdXRhdGlvbnMobXV0YXRpb25zKSB7XG4gICAgICAgIG11dGF0aW9ucy5mb3JFYWNoKChtdXRhdGlvbikgPT4ge1xuICAgICAgICAgIGNvbnN0IG11dGF0aW9uQXR0cmlidXRlTmFtZSA9IG11dGF0aW9uLmF0dHJpYnV0ZU5hbWU7XG4gICAgICAgICAgaWYgKHRoaXMuX2xvY2FsZUF0dHJzLmluY2x1ZGVzKG11dGF0aW9uQXR0cmlidXRlTmFtZSkpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvY2FsZSA9IHtcbiAgICAgICAgICAgICAgLi4udGhpcy5fbG9jYWxlLFxuICAgICAgICAgICAgICBbbXV0YXRpb25BdHRyaWJ1dGVOYW1lXTogdGhpcy5fcm9vdEVsZW1lbnQuZ2V0QXR0cmlidXRlKG11dGF0aW9uQXR0cmlidXRlTmFtZSlcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFja3MuZm9yRWFjaChjYWxsYmFjayA9PiBjYWxsYmFjayh0aGlzLl9sb2NhbGUpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBzZXQgbG9jYWxlKGxvY2FsZU9iaikge1xuICAgICAgICBPYmplY3Qua2V5cyhsb2NhbGVPYmopLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgIHRoaXMuX3Jvb3RFbGVtZW50LnNldEF0dHJpYnV0ZShrZXksIGxvY2FsZU9ialtrZXldKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGdldCBsb2NhbGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sb2NhbGU7XG4gICAgICB9XG5cbiAgICAgIG9uTG9jYWxlQ2hhbmdlKGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuX2NhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgY2FsbGJhY2sodGhpcy5sb2NhbGUpO1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcy5maWx0ZXIoY2IgPT4gY2IgIT09IGNhbGxiYWNrKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBsb2NhbGVTZXJ2aWNlID0gbmV3IExvY2FsZVNlcnZpY2UoKTtcbiAgICByZXR1cm4gbG9jYWxlU2VydmljZTtcbiAgfSk7XG59XG4iLCIvKiBlc2xpbnQgcHJlZmVyLWNvbnN0OiAwICovXG5cbi8qKlxuICpcbiAqIEBwYXJhbSBvcHRpb25zIE9iamVjdFxuICogQHJldHVybnMgZnVuY3Rpb24oU3RyaW5nKTogU3RyaW5nXG4gKi9cbmNvbnN0IGZvcmNlRmxvYXQgPSAoeyBkZWNQb2ludCA9ICcuJyB9ID0ge30pID0+ICh2YWx1ZSkgPT4ge1xuICBjb25zdCBHTE9CQUxfREVDX1BPSU5UID0gbmV3IFJlZ0V4cChgXFxcXCR7ZGVjUG9pbnR9YCwgJ2cnKTtcbiAgY29uc3QgR0xPQkFMX05PTl9OVU1CRVJfT1JfREVDX1BPSU5UID0gbmV3IFJlZ0V4cChgW15cXFxcZCR7ZGVjUG9pbnR9XWAsICdnJyk7XG4gIGNvbnN0IE5VTUJFUl9ERUNfUE9JTlRfT1JfU0hPUlRDVVQgPSBuZXcgUmVnRXhwKGBbXFxcXGQke2RlY1BvaW50fUtrTW1dYCwgJycpO1xuICBjb25zdCBOVU1CRVJfT1JfU0lHTiA9IG5ldyBSZWdFeHAoJ1tcXFxcZCstXScsICcnKTtcbiAgY29uc3QgU0lHTiA9IG5ldyBSZWdFeHAoJ1srLV0nLCAnJyk7XG4gIGNvbnN0IFNIT1JUQ1VUID0gbmV3IFJlZ0V4cCgnW0trTW1dJywgJycpO1xuICBjb25zdCBTSE9SVENVVF9USE9VU0FORFMgPSBuZXcgUmVnRXhwKCdbS2tdJywgJycpO1xuXG4gIGxldCB2YWx1ZVRvVXNlID0gdmFsdWU7XG4gIGNvbnN0IGluZGV4T2ZQb2ludCA9IHZhbHVlVG9Vc2UuaW5kZXhPZihkZWNQb2ludCk7XG4gIGNvbnN0IGxhc3RJbmRleE9mUG9pbnQgPSB2YWx1ZVRvVXNlLmxhc3RJbmRleE9mKGRlY1BvaW50KTtcbiAgY29uc3QgaGFzTW9yZVRoYW5PbmVQb2ludCA9IGluZGV4T2ZQb2ludCAhPT0gbGFzdEluZGV4T2ZQb2ludDtcblxuICBpZiAoaGFzTW9yZVRoYW5PbmVQb2ludCkge1xuICAgIHZhbHVlVG9Vc2UgPSBgJHt2YWx1ZVRvVXNlLnJlcGxhY2UoR0xPQkFMX0RFQ19QT0lOVCwgJycpfSR7ZGVjUG9pbnR9YDtcbiAgfVxuXG4gIGxldCBmaXJzdENoYXIgPSB2YWx1ZVRvVXNlWzBdIHx8ICcnO1xuICBsZXQgbGFzdENoYXIgPSAodmFsdWVUb1VzZS5sZW5ndGggPiAxID8gdmFsdWVUb1VzZVt2YWx1ZVRvVXNlLmxlbmd0aCAtIDFdIDogJycpIHx8ICcnO1xuICBsZXQgbWlkZGxlQ2hhcnMgPSB2YWx1ZVRvVXNlLnN1YnN0cigxLCB2YWx1ZVRvVXNlLmxlbmd0aCAtIDIpIHx8ICcnO1xuXG4gIGlmICghZmlyc3RDaGFyLm1hdGNoKE5VTUJFUl9PUl9TSUdOKSkge1xuICAgIGZpcnN0Q2hhciA9ICcnO1xuICB9XG5cbiAgbWlkZGxlQ2hhcnMgPSBtaWRkbGVDaGFycy5yZXBsYWNlKEdMT0JBTF9OT05fTlVNQkVSX09SX0RFQ19QT0lOVCwgJycpO1xuXG4gIGlmICghbGFzdENoYXIubWF0Y2goTlVNQkVSX0RFQ19QT0lOVF9PUl9TSE9SVENVVCkpIHtcbiAgICBsYXN0Q2hhciA9ICcnO1xuICB9IGVsc2UgaWYgKGxhc3RDaGFyLm1hdGNoKFNIT1JUQ1VUKSkge1xuICAgIGlmIChtaWRkbGVDaGFycyA9PT0gZGVjUG9pbnQpIHtcbiAgICAgIG1pZGRsZUNoYXJzID0gJyc7XG4gICAgfSBlbHNlIGlmIChtaWRkbGVDaGFycyA9PT0gJycgJiYgZmlyc3RDaGFyLm1hdGNoKFNJR04pKSB7XG4gICAgICBsYXN0Q2hhciA9ICcnO1xuICAgIH1cbiAgfSBlbHNlIGlmIChsYXN0Q2hhciA9PT0gZGVjUG9pbnQgJiYgbWlkZGxlQ2hhcnMgPT09ICcnICYmIGZpcnN0Q2hhci5tYXRjaChTSUdOKSkge1xuICAgIGxhc3RDaGFyID0gJyc7XG4gIH1cblxuICB2YWx1ZVRvVXNlID0gW2ZpcnN0Q2hhciwgbWlkZGxlQ2hhcnMsIGxhc3RDaGFyXS5qb2luKCcnKTtcblxuICBpZiAobGFzdENoYXIubWF0Y2goU0hPUlRDVVQpKSB7XG4gICAgdmFsdWVUb1VzZSA9IChcbiAgICAgIE51bWJlcihgJHtmaXJzdENoYXJ9JHttaWRkbGVDaGFyc31gLnJlcGxhY2UoZGVjUG9pbnQsICcuJykpICpcbiAgICAgIChsYXN0Q2hhci5tYXRjaChTSE9SVENVVF9USE9VU0FORFMpID8gMTAwMCA6IDEwMDAwMDApXG4gICAgKS50b1N0cmluZygpLnJlcGxhY2UoJy4nLCBkZWNQb2ludCk7XG4gIH1cblxuICByZXR1cm4gdmFsdWVUb1VzZTtcbn07XG5cbi8qKlxuICpcbiAqIEBwYXJhbSBvcHRpb25zIE9iamVjdFxuICogQHJldHVybnMgZnVuY3Rpb24oU3RyaW5nKTogU3RyaW5nXG4gKi9cbmNvbnN0IG51bWJlckZvcm1hdHRlciA9ICh7IGRlY1BvaW50ID0gJy4nLCB0aG91c2FuZHNTZXBhcmF0b3IgPSAnLCcgfSA9IHt9KSA9PiB2YWx1ZSA9PiB7XG4gIHZhbHVlID0gdmFsdWUucmVwbGFjZSgnLicsIGRlY1BvaW50KTtcbiAgbGV0IGZpcnN0Q2hhciA9IHZhbHVlWzBdIHx8ICcnO1xuICBmaXJzdENoYXIgPSBbJysnLCAnLSddLmluY2x1ZGVzKGZpcnN0Q2hhcikgPyBmaXJzdENoYXIgOiAnJztcbiAgY29uc3QgaXNGbG9hdGluZ1BvaW50ID0gdmFsdWUuaW5kZXhPZihkZWNQb2ludCkgIT09IC0xO1xuICBsZXQgW2ludGVnZXJQYXJ0ID0gJycsIGRlY2ltYWxzID0gJyddID0gdmFsdWUuc3BsaXQoZGVjUG9pbnQpO1xuICBpbnRlZ2VyUGFydCA9IGludGVnZXJQYXJ0LnJlcGxhY2UoL1srLV0vZywgJycpO1xuICBpbnRlZ2VyUGFydCA9IGludGVnZXJQYXJ0LnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csIHRob3VzYW5kc1NlcGFyYXRvcik7XG4gIGNvbnN0IHJldCA9IGAke2ZpcnN0Q2hhcn0ke2ludGVnZXJQYXJ0fSR7aXNGbG9hdGluZ1BvaW50ID8gZGVjUG9pbnQgOiAnJ30ke2RlY2ltYWxzfWA7XG4gIHJldHVybiByZXQ7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGZvcmNlRmxvYXQsXG4gIG51bWJlckZvcm1hdHRlclxufTtcblxuIiwiLyogZXNsaW50IG5vLWNvbnNvbGU6IDAgKi9cblxuY29uc3QgYnV0dG9uSGVpZ2h0ID0gJzI1cHgnO1xuY29uc3QgYnV0dG9uU3RhcnQgPSAnNXB4JztcbmNvbnN0IGJ1dHRvblRvcCA9ICc1cHgnO1xuXG5sZXQgY29uc29sZU1lc3NhZ2VzID0gW107XG5jb25zdCBjb25zb2xlTG9nID0gY29uc29sZS5sb2cuYmluZChjb25zb2xlKTtcbmNvbnN0IGNvbnNvbGVPcmlnaW5hbCA9IHt9O1xuXG5mdW5jdGlvbiBjYXB0dXJlQ29uc29sZShjb25zb2xlRWxtLCBvcHRpb25zKSB7XG4gIGNvbnN0IHsgaW5kZW50ID0gMiwgc2hvd0xhc3RPbmx5ID0gZmFsc2UgfSA9IG9wdGlvbnM7XG4gIGNvbnN0IGhhbmRsZXIgPSBmdW5jdGlvbiBoYW5kbGVyKGFjdGlvbiwgLi4uYXJncykge1xuICAgIGlmIChzaG93TGFzdE9ubHkpIHtcbiAgICAgIGNvbnNvbGVNZXNzYWdlcyA9IFt7IFthY3Rpb25dOiBhcmdzIH1dO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlTWVzc2FnZXMucHVzaCh7IFthY3Rpb25dOiBhcmdzIH0pO1xuICAgIH1cblxuICAgIGNvbnNvbGVFbG0uaW5uZXJIVE1MID0gY29uc29sZU1lc3NhZ2VzLm1hcCgoZW50cnkpID0+IHtcbiAgICAgIGNvbnN0IGFjdGlvbiA9IE9iamVjdC5rZXlzKGVudHJ5KVswXTtcbiAgICAgIGNvbnN0IHZhbHVlcyA9IGVudHJ5W2FjdGlvbl07XG4gICAgICBjb25zdCBtZXNzYWdlID0gdmFsdWVzLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIFt1bmRlZmluZWQsIG51bGxdLmluY2x1ZGVzKGl0ZW0pIHx8XG4gICAgICAgICAgWydudW1iZXInLCAnc3RyaW5nJywgJ2Z1bmN0aW9uJ10uaW5jbHVkZXModHlwZW9mIGl0ZW0pXG4gICAgICAgICkgP1xuICAgICAgICAgIGl0ZW0gOlxuICAgICAgICAgIFsnTWFwJywgJ1NldCddLmluY2x1ZGVzKGl0ZW0uY29uc3RydWN0b3IubmFtZSkgP1xuICAgICAgICAgICAgYCR7aXRlbS5jb25zdHJ1Y3Rvci5uYW1lfSAoJHtKU09OLnN0cmluZ2lmeShbLi4uaXRlbV0pfSlgIDpcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KGl0ZW0sIChrZXksIHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgIGlmICgodHlwZW9mIHZhbHVlKSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS50b1N0cmluZygpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgIH0sIGluZGVudCk7XG4gICAgICB9KS5qb2luKCcsICcpO1xuXG4gICAgICBjb25zdCBjb2xvciA9IHtcbiAgICAgICAgbG9nOiAnIzAwMCcsXG4gICAgICAgIHdhcm46ICdvcmFuZ2UnLFxuICAgICAgICBlcnJvcjogJ2RhcmtyZWQnXG4gICAgICB9W2FjdGlvbl07XG5cbiAgICAgIHJldHVybiBgPHByZSBzdHlsZT1cImNvbG9yOiAke2NvbG9yfVwiPiR7bWVzc2FnZX08L3ByZT5gO1xuICAgIH0pLmpvaW4oJ1xcbicpO1xuICB9O1xuICBbJ2xvZycsICd3YXJuJywgJ2Vycm9yJ10uZm9yRWFjaCgoYWN0aW9uKSA9PiB7XG4gICAgY29uc29sZU9yaWdpbmFsW2FjdGlvbl0gPSBjb25zb2xlW2FjdGlvbl07XG4gICAgY29uc29sZVthY3Rpb25dID0gaGFuZGxlci5iaW5kKGNvbnNvbGUsIGFjdGlvbik7XG4gIH0pO1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCAoZXZ0KSA9PiB7XG4gICAgLy8gZXNsaW50IG5vLWNvbnNvbGU6IDBcbiAgICBjb25zb2xlLmVycm9yKGBcIiR7ZXZ0Lm1lc3NhZ2V9XCIgZnJvbSAke2V2dC5maWxlbmFtZX06JHtldnQubGluZW5vfWApO1xuICAgIGNvbnNvbGUuZXJyb3IoZXZ0LCBldnQuZXJyb3Iuc3RhY2spO1xuICAgIC8vIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9KTtcbiAgY29uc29sZUxvZygnY29uc29sZSBjYXB0dXJlZCcpO1xuICByZXR1cm4gZnVuY3Rpb24gcmVsZWFzZUNvbnNvbGUoKSB7XG4gICAgWydsb2cnLCAnd2FybicsICdlcnJvciddLmZvckVhY2goKGFjdGlvbikgPT4ge1xuICAgICAgY29uc29sZVthY3Rpb25dID0gY29uc29sZU9yaWdpbmFsW2FjdGlvbl07XG4gICAgfSk7XG4gICAgY29uc29sZUxvZygnY29uc29sZSByZWxlYXNlZCcpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVDb25zb2xlKHtcbiAgb3B0aW9ucyxcbiAgY29uc29sZVN0eWxlOiB7XG4gICAgYnRuU3RhcnQgPSBidXR0b25TdGFydCwgYnRuSGVpZ2h0ID0gYnV0dG9uSGVpZ2h0LFxuICAgIHdpZHRoID0gYGNhbGMoMTAwdncgLSAke2J0blN0YXJ0fSAtIDMwcHgpYCwgaGVpZ2h0ID0gJzQwMHB4JyxcbiAgICBiYWNrZ3JvdW5kID0gJ3JnYmEoMCwgMCwgMCwgMC41KSdcbiAgfVxufSkge1xuICBjb25zdCB7IHJ0bCA9IGZhbHNlIH0gPSBvcHRpb25zO1xuICBjb25zdCBjb25zb2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbnNvbGUuaWQgPSAnREJVSW9uU2NyZWVuQ29uc29sZSc7XG4gIGNvbnNvbGUuc3R5bGUuY3NzVGV4dCA9IGBcbiAgICBkaXNwbGF5OiBibG9jaztcbiAgICBtYXJnaW46IDBweDtcbiAgICBwYWRkaW5nOiA1cHg7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIG92ZXJmbG93OiBhdXRvO1xuICAgIHdpZHRoOiAke3dpZHRofTtcbiAgICBoZWlnaHQ6ICR7aGVpZ2h0fTtcbiAgICB0b3A6ICR7YnRuSGVpZ2h0fTtcbiAgICAke3J0bCA/ICdyaWdodCcgOiAnbGVmdCd9OiAwcHg7XG4gICAgYmFja2dyb3VuZDogJHtiYWNrZ3JvdW5kfTtcbiAgICB6LWluZGV4OiA5OTk5O1xuICAgIC13ZWJraXQtb3ZlcmZsb3ctc2Nyb2xsaW5nOiB0b3VjaFxuICAgIGA7XG4gIHJldHVybiBjb25zb2xlO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVCdXR0b24oe1xuICBvcHRpb25zLFxuICBidXR0b25TdHlsZToge1xuICAgIHBvc2l0aW9uID0gJ2ZpeGVkJyxcbiAgICB3aWR0aCA9ICcyNXB4JywgaGVpZ2h0ID0gYnV0dG9uSGVpZ2h0LCB0b3AgPSBidXR0b25Ub3AsIHN0YXJ0ID0gYnV0dG9uU3RhcnQsXG4gICAgYmFja2dyb3VuZCA9ICdyZ2JhKDAsIDAsIDAsIDAuNSknXG4gIH1cbn0pIHtcbiAgY29uc3QgeyBydGwgPSBmYWxzZSB9ID0gb3B0aW9ucztcbiAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGJ1dHRvbi5pZCA9ICdEQlVJb25TY3JlZW5Db25zb2xlVG9nZ2xlcic7XG4gIGJ1dHRvbi5zdHlsZS5jc3NUZXh0ID0gYFxuICAgIHBvc2l0aW9uOiAke3Bvc2l0aW9ufTtcbiAgICB3aWR0aDogJHt3aWR0aH07XG4gICAgaGVpZ2h0OiAke2hlaWdodH07XG4gICAgdG9wOiAke3RvcH07XG4gICAgJHtydGwgPyAncmlnaHQnIDogJ2xlZnQnfTogJHtzdGFydH07XG4gICAgYmFja2dyb3VuZDogJHtiYWNrZ3JvdW5kfTtcbiAgICB6LWluZGV4OiA5OTk5O1xuICAgIGA7XG4gIHJldHVybiBidXR0b247XG59XG5cbi8qKlxub25TY3JlZW5Db25zb2xlKHtcbiAgYnV0dG9uU3R5bGUgPSB7IHBvc2l0aW9uLCB3aWR0aCwgaGVpZ2h0LCB0b3AsIHN0YXJ0LCBiYWNrZ3JvdW5kIH0sXG4gIGNvbnNvbGVTdHlsZSA9IHsgd2lkdGgsIGhlaWdodCwgYmFja2dyb3VuZCB9LFxuICBvcHRpb25zID0geyBydGw6IGZhbHNlLCBpbmRlbnQsIHNob3dMYXN0T25seSB9XG59KVxuKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG9uU2NyZWVuQ29uc29sZSh7XG4gIGJ1dHRvblN0eWxlID0ge30sXG4gIGNvbnNvbGVTdHlsZSA9IHt9LFxuICBvcHRpb25zID0ge31cbn0gPSB7fSkge1xuICBjb25zdCBidXR0b24gPSBjcmVhdGVCdXR0b24oe1xuICAgIG9wdGlvbnMsXG4gICAgYnV0dG9uU3R5bGVcbiAgfSk7XG4gIGNvbnN0IGNvbnNvbGUgPSBjcmVhdGVDb25zb2xlKHtcbiAgICBjb25zb2xlU3R5bGU6IHtcbiAgICAgIC4uLmNvbnNvbGVTdHlsZSxcbiAgICAgIGJ0bkhlaWdodDogYnV0dG9uU3R5bGUuaGVpZ2h0LFxuICAgICAgYnRuU3RhcnQ6IGJ1dHRvblN0eWxlLnN0YXJ0XG4gICAgfSxcbiAgICBvcHRpb25zXG4gIH0pO1xuXG4gIGNvbnNvbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIH0pO1xuXG4gIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBpZiAoIWJ1dHRvbi5jb250YWlucyhjb25zb2xlKSkge1xuICAgICAgYnV0dG9uLmFwcGVuZENoaWxkKGNvbnNvbGUpO1xuICAgICAgY29uc29sZS5zY3JvbGxUb3AgPSBjb25zb2xlLnNjcm9sbEhlaWdodCAtIGNvbnNvbGUuY2xpZW50SGVpZ2h0O1xuICAgIH0gZWxzZSB7XG4gICAgICBidXR0b24ucmVtb3ZlQ2hpbGQoY29uc29sZSk7XG4gICAgfVxuICB9KTtcblxuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGJ1dHRvbik7XG4gIGNvbnN0IHJlbGVhc2VDb25zb2xlID0gY2FwdHVyZUNvbnNvbGUoY29uc29sZSwgb3B0aW9ucyk7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIHJlbGVhc2UoKSB7XG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChidXR0b24pO1xuICAgIHJlbGVhc2VDb25zb2xlKCk7XG4gIH07XG59XG4iLCIvKipcbiAqIGNvbnN0IHQgPSB0ZW1wbGF0ZWAkezB9ICR7MX0gJHsndHdvJ30gJHsndGhyZWUnfWA7XG4gKiBjb25zdCB0ciA9IHQoJ2EnLCAnYicsIHsgdHdvOiAnYycsIHRocmVlOiAnZCcgfSk7XG4gKiBleHBlY3QodHIpLnRvLmVxdWFsKCdhIGIgYyBkJyk7XG4gKiBAcGFyYW0gc3RyaW5nc1xuICogQHBhcmFtIGtleXNcbiAqIEByZXR1cm4ge2Z1bmN0aW9uKC4uLlsqXSl9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRlbXBsYXRlKHN0cmluZ3MsIC4uLmtleXMpIHtcbiAgcmV0dXJuICgoLi4udmFsdWVzKSA9PiB7XG4gICAgY29uc3QgZGljdCA9IHZhbHVlc1t2YWx1ZXMubGVuZ3RoIC0gMV0gfHwge307XG4gICAgY29uc3QgcmVzdWx0ID0gW3N0cmluZ3NbMF1dO1xuICAgIGtleXMuZm9yRWFjaCgoa2V5LCBpKSA9PiB7XG4gICAgICBjb25zdCB2YWx1ZSA9IE51bWJlci5pc0ludGVnZXIoa2V5KSA/IHZhbHVlc1trZXldIDogZGljdFtrZXldO1xuICAgICAgcmVzdWx0LnB1c2godmFsdWUsIHN0cmluZ3NbaSArIDFdKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0LmpvaW4oJycpO1xuICB9KTtcbn1cbiIsIlxuLy8gaHR0cDovL3JhZ2Fud2FsZC5jb20vMjAxNS8xMi8zMS90aGlzLWlzLW5vdC1hbi1lc3NheS1hYm91dC10cmFpdHMtaW4tamF2YXNjcmlwdC5odG1sXG5cbi8qXG5cbmNsYXNzIEEge1xuICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgdGhpcy5pbml0KC4uLmFyZ3MpO1xuICB9XG59XG5cbmNsYXNzIEIgZXh0ZW5kcyBBIHtcbiAgaW5pdCh4KSB7XG4gICAgdGhpcy5feCA9IHg7XG4gIH1cbiAgZ2V0WCgpIHtcbiAgICByZXR1cm4gdGhpcy5feDtcbiAgfVxuICBzZXRYKHZhbHVlKSB7XG4gICAgdGhpcy5feCA9IHZhbHVlO1xuICB9XG4gIGdldCB4KCkge1xuICAgIHJldHVybiB0aGlzLl94O1xuICB9XG4gIHNldCB4KHZhbHVlKSB7XG4gICAgdGhpcy5feCA9IHZhbHVlO1xuICB9XG59XG5cbmZ1bmN0aW9uIHdpdGhEb3VibGVYKGtsYXNzKSB7XG4gIHJldHVybiBPdmVycmlkZU9yRGVmaW5lKHtcblxuICAgIC8vIG92ZXJyaWRlc1xuICAgIGluaXQob3JpZ2luYWxJbml0LCB4LCB5KSB7XG4gICAgICBvcmlnaW5hbEluaXQoeCk7XG4gICAgICB0aGlzLl95ID0geTtcbiAgICB9LFxuICAgIGdldFgob3JpZ2luYWxHZXRYKSB7XG4gICAgICByZXR1cm4gb3JpZ2luYWxHZXRYKCkgKiAyO1xuICAgIH0sXG4gICAgc2V0WChvcmlnaW5hbFNldFgsIHZhbHVlKSB7XG4gICAgICAvLyB0aGlzLl94ID0gdmFsdWUgKiAyO1xuICAgICAgb3JpZ2luYWxTZXRYKHZhbHVlICogMik7XG4gICAgfSxcbiAgICBnZXQgeCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl94ICogMjtcbiAgICB9LFxuICAgIHNldCB4KHZhbHVlKSB7XG4gICAgICB0aGlzLl94ID0gdmFsdWUgKiAyO1xuICAgIH0sXG5cbiAgICAvLyBuZXcgZGVmaW5pdGlvbnNcbiAgICBzZXQgeSh2YWx1ZSkge1xuICAgICAgdGhpcy5feSA9IHZhbHVlICogMjtcbiAgICB9LFxuICAgIGdldCB5KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3kgKiAyO1xuICAgIH0sXG4gICAgaGVsbG8oKSB7XG4gICAgICByZXR1cm4gYGhlbGxvICR7dGhpcy5feH0gYW5kICR7dGhpcy55fWA7XG4gICAgfVxuICB9KShrbGFzcyk7XG59XG5cbkIgPSB3aXRoRG91YmxlWChCKTtcblxuY29uc3QgYiA9IG5ldyBCKDIsIDUpO1xuY29uc29sZS5sb2coYi54KTsgLy8gNFxuY29uc29sZS5sb2coYi5nZXRYKCkpOyAvLyA0XG5cbmIuc2V0WCgzKTtcbi8vIGIueCA9IDM7XG5jb25zb2xlLmxvZyhiLngpOyAvLyAxMlxuY29uc29sZS5sb2coYi5nZXRYKCkpOyAvLyAxMlxuXG4vLyBuZXdcbmNvbnNvbGUubG9nKGIueSk7IC8vIDEwXG5iLnkgPSA5O1xuY29uc29sZS5sb2coYi5oZWxsbygpKTsgLy8gaGVsbG8gNiBhbmQgMzZcblxuKi9cbi8vIFRPRE86dGVzdCB0aGlzXG5mdW5jdGlvbiBPdmVycmlkZU9yRGVmaW5lKGJlaGF2aW91cikge1xuICBjb25zdCBpbnN0YW5jZUtleXMgPSBSZWZsZWN0Lm93bktleXMoYmVoYXZpb3VyKTtcblxuICByZXR1cm4gZnVuY3Rpb24gZGVmaW5lKGtsYXNzKSB7XG4gICAgaW5zdGFuY2VLZXlzLmZvckVhY2goKHByb3BlcnR5KSA9PiB7XG5cbiAgICAgIGNvbnN0IG5ld1Byb3BlcnR5RGVzY3JpcHRvciA9XG4gICAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoYmVoYXZpb3VyLCBwcm9wZXJ0eSk7XG4gICAgICBjb25zdCBvcmlnaW5hbFByb3BlcnR5RGVzY3JpcHRvciA9XG4gICAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioa2xhc3MucHJvdG90eXBlLCBwcm9wZXJ0eSk7XG5cbiAgICAgIGNvbnN0IHtcbiAgICAgICAgdmFsdWU6IG5ld1ZhbHVlLFxuICAgICAgICBnZXQ6IG5ld0dldHRlcixcbiAgICAgICAgc2V0OiBuZXdTZXR0ZXJcbiAgICAgIH0gPSBuZXdQcm9wZXJ0eURlc2NyaXB0b3I7XG5cbiAgICAgIGlmICghb3JpZ2luYWxQcm9wZXJ0eURlc2NyaXB0b3IpIHtcbiAgICAgICAgaWYgKG5ld1ZhbHVlKSB7XG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGtsYXNzLnByb3RvdHlwZSwgcHJvcGVydHksIHtcbiAgICAgICAgICAgIHZhbHVlOiBuZXdWYWx1ZSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGtsYXNzLnByb3RvdHlwZSwgcHJvcGVydHksIHtcbiAgICAgICAgICAgIGdldDogbmV3R2V0dGVyLFxuICAgICAgICAgICAgc2V0OiBuZXdTZXR0ZXIsXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3Qge1xuICAgICAgICAgIHZhbHVlOiBvcmlnaW5hbFZhbHVlLFxuICAgICAgICAgIHdyaXRhYmxlOiBvcmlnaW5hbFdyaXRhYmxlLFxuICAgICAgICAgIGdldDogb3JpZ2luYWxHZXR0ZXIsXG4gICAgICAgICAgc2V0OiBvcmlnaW5hbFNldHRlcixcbiAgICAgICAgICBlbnVtZXJhYmxlOiBvcmlnaW5hbEVudW1lcmFibGUsXG4gICAgICAgICAgY29uZmlndXJhYmxlOiBvcmlnaW5hbENvbmZpZ3VyYWJsZVxuICAgICAgICB9ID0gb3JpZ2luYWxQcm9wZXJ0eURlc2NyaXB0b3I7XG5cbiAgICAgICAgaWYgKG5ld1ZhbHVlKSB7XG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGtsYXNzLnByb3RvdHlwZSwgcHJvcGVydHksIHtcbiAgICAgICAgICAgIHZhbHVlKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgICAgY29uc3QgYm91bmRlZFZhbHVlID0gb3JpZ2luYWxWYWx1ZS5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgICByZXR1cm4gbmV3VmFsdWUuY2FsbCh0aGlzLCBib3VuZGVkVmFsdWUsIC4uLmFyZ3MpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiBvcmlnaW5hbFdyaXRhYmxlLFxuICAgICAgICAgICAgZW51bWVyYWJsZTogb3JpZ2luYWxFbnVtZXJhYmxlLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiBvcmlnaW5hbENvbmZpZ3VyYWJsZSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoa2xhc3MucHJvdG90eXBlLCBwcm9wZXJ0eSwge1xuICAgICAgICAgICAgZ2V0OiBuZXdHZXR0ZXIgfHwgb3JpZ2luYWxHZXR0ZXIsXG4gICAgICAgICAgICBzZXQ6IG5ld1NldHRlciB8fCBvcmlnaW5hbFNldHRlcixcbiAgICAgICAgICAgIGVudW1lcmFibGU6IG9yaWdpbmFsRW51bWVyYWJsZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogb3JpZ2luYWxDb25maWd1cmFibGUsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4ga2xhc3M7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IE92ZXJyaWRlT3JEZWZpbmU7XG4iLCJcbmNvbnN0IHJlYWRPbmx5UHJvcGVydGllcyA9IFsnZm9jdXNlZCddO1xuXG5jb25zdCBFUlJPUl9NRVNTQUdFUyA9IHtcbiAgZm9jdXNlZDogYCdmb2N1c2VkJyBwcm9wZXJ0eSBpcyByZWFkLW9ubHkgYXMgaXQgaXMgY29udHJvbGxlZCBieSB0aGUgY29tcG9uZW50LlxuSWYgeW91IHdhbnQgdG8gc2V0IGZvY3VzIHByb2dyYW1tYXRpY2FsbHkgY2FsbCAuZm9jdXMoKSBtZXRob2Qgb24gY29tcG9uZW50LlxuYFxufTtcblxuLyoqXG4gKiBXaGVuIGFuIGlubmVyIGZvY3VzYWJsZSBpcyBmb2N1c2VkIChleDogdmlhIGNsaWNrKSB0aGUgZW50aXJlIGNvbXBvbmVudCBnZXRzIGZvY3VzZWQuXG4gKiBXaGVuIHRoZSBjb21wb25lbnQgZ2V0cyBmb2N1c2VkIChleDogdmlhIHRhYikgdGhlIGZpcnN0IGlubmVyIGZvY3VzYWJsZSBnZXRzIGZvY3VzZWQgdG9vLlxuICogV2hlbiB0aGUgY29tcG9uZW50IGdldHMgZGlzYWJsZWQgaXQgZ2V0cyBibHVycmVkIHRvbyBhbmQgYWxsIGlubmVyIGZvY3VzYWJsZXMgZ2V0IGRpc2FibGVkIGFuZCBibHVycmVkLlxuICogV2hlbiBkaXNhYmxlZCB0aGUgY29tcG9uZW50IGNhbm5vdCBiZSBmb2N1c2VkLlxuICogV2hlbiBlbmFibGVkIHRoZSBjb21wb25lbnQgY2FuIGJlIGZvY3VzZWQuXG4gKiBAcGFyYW0gS2xhc3NcbiAqIEByZXR1cm5zIHtGb2N1c2FibGV9XG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRm9jdXNhYmxlKEtsYXNzKSB7XG5cbiAgS2xhc3MuY29tcG9uZW50U3R5bGUgKz0gYFxuICA6aG9zdChbZGlzYWJsZWRdKSB7XG4gICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICBvcGFjaXR5OiAwLjU7XG4gICAgXG4gICAgLXdlYmtpdC10b3VjaC1jYWxsb3V0OiBub25lO1xuICAgIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLWtodG1sLXVzZXItc2VsZWN0OiBub25lO1xuICAgIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLW1zLXVzZXItc2VsZWN0OiBub25lO1xuICAgIHVzZXItc2VsZWN0OiBub25lO1xuICB9XG4gIFxuICA6aG9zdChbZGlzYWJsZWRdKSAqIHtcbiAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgfVxuICBgO1xuXG4gIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0NTUy86Zm9jdXMtd2l0aGluXG5cbiAgY2xhc3MgRm9jdXNhYmxlIGV4dGVuZHMgS2xhc3Mge1xuXG4gICAgc3RhdGljIGdldCBuYW1lKCkge1xuICAgICAgcmV0dXJuIHN1cGVyLm5hbWU7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldCBwcm9wZXJ0aWVzVG9VcGdyYWRlKCkge1xuICAgICAgLy8gVGhlIHJlYXNvbiBmb3IgdXBncmFkaW5nICdmb2N1c2VkJyBpcyBvbmx5IHRvIHNob3cgYW4gd2FybmluZ1xuICAgICAgLy8gaWYgdGhlIGNvbnN1bWVyIG9mIHRoZSBjb21wb25lbnQgYXR0ZW1wdGVkIHRvIHNldCBmb2N1cyBwcm9wZXJ0eVxuICAgICAgLy8gd2hpY2ggaXMgcmVhZC1vbmx5LlxuICAgICAgcmV0dXJuIFsuLi5zdXBlci5wcm9wZXJ0aWVzVG9VcGdyYWRlLCAnZm9jdXNlZCcsICdkaXNhYmxlZCddO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCkge1xuICAgICAgcmV0dXJuIFsuLi5zdXBlci5vYnNlcnZlZEF0dHJpYnV0ZXMsICdkaXNhYmxlZCddO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICAgIHN1cGVyKC4uLmFyZ3MpO1xuXG4gICAgICB0aGlzLl9jdXJyZW50SW5uZXJGb2N1c2VkID0gbnVsbDtcbiAgICAgIHRoaXMuX3NpZGVFZmZlY3RzQXBwbGllZEZvciA9IG51bGw7XG4gICAgICB0aGlzLl9vbklubmVyRm9jdXNhYmxlRm9jdXNlZCA9IHRoaXMuX29uSW5uZXJGb2N1c2FibGVGb2N1c2VkLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLl9vbkZvY3VzID0gdGhpcy5fb25Gb2N1cy5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5fb25CbHVyID0gdGhpcy5fb25CbHVyLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLl9vblRhcCA9IHRoaXMuX29uVGFwLmJpbmQodGhpcyk7XG4gICAgfVxuXG4gICAgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSkge1xuICAgICAgc3VwZXIuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSk7XG5cbiAgICAgIGNvbnN0IGhhc1ZhbHVlID0gbmV3VmFsdWUgIT09IG51bGw7XG4gICAgICBpZiAobmFtZSA9PT0gJ2Rpc2FibGVkJykge1xuICAgICAgICBoYXNWYWx1ZSA/IHRoaXMuX2FwcGx5RGlzYWJsZWRTaWRlRWZmZWN0cygpIDogdGhpcy5fYXBwbHlFbmFibGVkU2lkZUVmZmVjdHMoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgIHN1cGVyLmNvbm5lY3RlZENhbGxiYWNrKCk7XG5cbiAgICAgIHJlYWRPbmx5UHJvcGVydGllcy5mb3JFYWNoKChyZWFkT25seVByb3BlcnR5KSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmhhc0F0dHJpYnV0ZShyZWFkT25seVByb3BlcnR5KSkge1xuICAgICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKHJlYWRPbmx5UHJvcGVydHkpO1xuICAgICAgICAgIGNvbnNvbGUud2FybihFUlJPUl9NRVNTQUdFU1tyZWFkT25seVByb3BlcnR5XSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xuICAgICAgICB0aGlzLl9hcHBseURpc2FibGVkU2lkZUVmZmVjdHMoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2FwcGx5RW5hYmxlZFNpZGVFZmZlY3RzKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIHdoZW4gY29tcG9uZW50IGZvY3VzZWQvYmx1cnJlZFxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIHRoaXMuX29uRm9jdXMpO1xuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgdGhpcy5fb25CbHVyKTtcbiAgICAgIHRoaXMub3duZXJEb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLl9vblRhcCk7XG4gICAgICB0aGlzLm93bmVyRG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuX29uVGFwKTtcblxuICAgICAgdGhpcy5faW5uZXJGb2N1c2FibGVzLmZvckVhY2goKGZvY3VzYWJsZSkgPT4ge1xuICAgICAgICAvLyB3aGVuIGlubmVyIGZvY3VzYWJsZSBmb2N1c2VkXG4gICAgICAgIGZvY3VzYWJsZS5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIHRoaXMuX29uSW5uZXJGb2N1c2FibGVGb2N1c2VkKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgc3VwZXIuZGlzY29ubmVjdGVkQ2FsbGJhY2soKTtcblxuICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKCdmb2N1cycsIHRoaXMuX29uRm9jdXMpO1xuICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKCdibHVyJywgdGhpcy5fb25CbHVyKTtcbiAgICAgIHRoaXMub3duZXJEb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLl9vblRhcCk7XG4gICAgICB0aGlzLm93bmVyRG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuX29uVGFwKTtcblxuICAgICAgdGhpcy5faW5uZXJGb2N1c2FibGVzLmZvckVhY2goKGZvY3VzYWJsZSkgPT4ge1xuICAgICAgICBmb2N1c2FibGUucmVtb3ZlRXZlbnRMaXN0ZW5lcignZm9jdXMnLCB0aGlzLl9vbklubmVyRm9jdXNhYmxlRm9jdXNlZCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZWFkIG9ubHkuXG4gICAgICogQHJldHVybiBCb29sZWFuXG4gICAgICovXG4gICAgZ2V0IGZvY3VzZWQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5oYXNBdHRyaWJ1dGUoJ2ZvY3VzZWQnKTtcbiAgICB9XG5cbiAgICBzZXQgZm9jdXNlZChfKSB7XG4gICAgICBjb25zb2xlLndhcm4oRVJST1JfTUVTU0FHRVMuZm9jdXNlZCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIEJvb2xlYW5cbiAgICAgKi9cbiAgICBnZXQgZGlzYWJsZWQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5oYXNBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgfVxuXG4gICAgc2V0IGRpc2FibGVkKHZhbHVlKSB7XG4gICAgICBjb25zdCBoYXNWYWx1ZSA9IEJvb2xlYW4odmFsdWUpO1xuICAgICAgaWYgKGhhc1ZhbHVlKSB7XG4gICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICcnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHJldHVybiBBcnJheTxIVE1MRWxlbWVudD5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGdldCBfaW5uZXJGb2N1c2FibGVzKCkge1xuICAgICAgcmV0dXJuIHRoaXMuc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yQWxsKCdbdGFiaW5kZXhdJykgfHwgW107XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIEhUTUxFbGVtZW50IHx8IG51bGxcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGdldCBfZmlyc3RJbm5lckZvY3VzYWJsZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLnNoYWRvd1Jvb3QucXVlcnlTZWxlY3RvcignW3RhYmluZGV4XScpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIGV2dCBFdmVudCAobW91c2Vkb3duL3RvdWNoc3RhcnQpXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfb25UYXAoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LnRhcmdldCAhPT0gdGhpcykge1xuICAgICAgICB0aGlzLmJsdXIoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBldnQgRXZlbnQgKEZvY3VzRXZlbnQpXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfb25Jbm5lckZvY3VzYWJsZUZvY3VzZWQoZXZ0KSB7XG4gICAgICB0aGlzLl9jdXJyZW50SW5uZXJGb2N1c2VkID0gZXZ0LnRhcmdldDtcbiAgICB9XG5cbiAgICBfb25Gb2N1cygpIHtcbiAgICAgIGlmICh0aGlzLmRpc2FibGVkKSByZXR1cm47XG4gICAgICAvLyBPbmx5IGZvciBzdHlsaW5nIHB1cnBvc2UuXG4gICAgICAvLyBGb2N1c2VkIHByb3BlcnR5IGlzIGNvbnRyb2xsZWQgZnJvbSBpbnNpZGUuXG4gICAgICAvLyBBdHRlbXB0IHRvIHNldCB0aGlzIHByb3BlcnR5IGZyb20gb3V0c2lkZSB3aWxsIHRyaWdnZXIgYSB3YXJuaW5nXG4gICAgICAvLyBhbmQgd2lsbCBiZSBpZ25vcmVkXG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnZm9jdXNlZCcsICcnKTtcbiAgICAgIHRoaXMuX2FwcGx5Rm9jdXNTaWRlRWZmZWN0cygpO1xuICAgIH1cblxuICAgIF9vbkJsdXIoKSB7XG4gICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgnZm9jdXNlZCcpO1xuICAgICAgdGhpcy5fYXBwbHlCbHVyU2lkZUVmZmVjdHMoKTtcbiAgICB9XG5cbiAgICBfYXBwbHlGb2N1c1NpZGVFZmZlY3RzKCkge1xuICAgICAgaWYgKHRoaXMuX2N1cnJlbnRJbm5lckZvY3VzZWQpIHtcbiAgICAgICAgLy8gU29tZSBpbm5lciBjb21wb25lbnQgaXMgYWxyZWFkeSBmb2N1c2VkLlxuICAgICAgICAvLyBObyBuZWVkIHRvIHNldCBmb2N1cyBvbiBhbnl0aGluZy5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5fZm9jdXNGaXJzdElubmVyRm9jdXNhYmxlKCk7XG4gICAgfVxuXG4gICAgX2FwcGx5Qmx1clNpZGVFZmZlY3RzKCkge1xuICAgICAgaWYgKHRoaXMuX2N1cnJlbnRJbm5lckZvY3VzZWQpIHtcbiAgICAgICAgdGhpcy5fY3VycmVudElubmVyRm9jdXNlZC5ibHVyKCk7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRJbm5lckZvY3VzZWQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9mb2N1c0ZpcnN0SW5uZXJGb2N1c2FibGUoKSB7XG4gICAgICBjb25zdCBmaXJzdElubmVyRm9jdXNhYmxlID0gdGhpcy5fZmlyc3RJbm5lckZvY3VzYWJsZTtcbiAgICAgIGlmIChmaXJzdElubmVyRm9jdXNhYmxlKSB7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRJbm5lckZvY3VzZWQgPSBmaXJzdElubmVyRm9jdXNhYmxlO1xuICAgICAgICBmaXJzdElubmVyRm9jdXNhYmxlLmZvY3VzKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2FwcGx5RGlzYWJsZWRTaWRlRWZmZWN0cygpIHtcbiAgICAgIGlmICh0aGlzLl9zaWRlRWZmZWN0c0FwcGxpZWRGb3IgPT09ICdkaXNhYmxlZCcpIHJldHVybjtcbiAgICAgIHRoaXMuX2xhc3RUYWJJbmRleFZhbHVlID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ3RhYmluZGV4Jyk7XG4gICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgndGFiaW5kZXgnKTtcbiAgICAgIHRoaXMuX2lubmVyRm9jdXNhYmxlcy5mb3JFYWNoKChpbm5lckZvY3VzYWJsZSkgPT4ge1xuICAgICAgICBpbm5lckZvY3VzYWJsZS5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJy0xJyk7XG4gICAgICAgIGlubmVyRm9jdXNhYmxlLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCAnZGlzYWJsZWQnKTtcbiAgICAgICAgaWYgKGlubmVyRm9jdXNhYmxlLmhhc0F0dHJpYnV0ZSgnY29udGVudGVkaXRhYmxlJykpIHtcbiAgICAgICAgICBpbm5lckZvY3VzYWJsZS5zZXRBdHRyaWJ1dGUoJ2NvbnRlbnRlZGl0YWJsZScsICdmYWxzZScpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMuYmx1cigpO1xuICAgICAgdGhpcy5fc2lkZUVmZmVjdHNBcHBsaWVkRm9yID0gJ2Rpc2FibGVkJztcbiAgICB9XG5cbiAgICBfYXBwbHlFbmFibGVkU2lkZUVmZmVjdHMoKSB7XG4gICAgICBpZiAodGhpcy5fc2lkZUVmZmVjdHNBcHBsaWVkRm9yID09PSAnZW5hYmxlZCcpIHJldHVybjtcbiAgICAgICF0aGlzLmdldEF0dHJpYnV0ZSgndGFiaW5kZXgnKSAmJiB0aGlzLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCB0aGlzLl9sYXN0VGFiSW5kZXhWYWx1ZSB8fCAwKTtcbiAgICAgIHRoaXMuX2lubmVyRm9jdXNhYmxlcy5mb3JFYWNoKChpbm5lckZvY3VzYWJsZSkgPT4ge1xuICAgICAgICBpbm5lckZvY3VzYWJsZS5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJzAnKTtcbiAgICAgICAgaW5uZXJGb2N1c2FibGUucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgICAgICBpZiAoaW5uZXJGb2N1c2FibGUuaGFzQXR0cmlidXRlKCdjb250ZW50ZWRpdGFibGUnKSkge1xuICAgICAgICAgIGlubmVyRm9jdXNhYmxlLnNldEF0dHJpYnV0ZSgnY29udGVudGVkaXRhYmxlJywgJ3RydWUnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLl9zaWRlRWZmZWN0c0FwcGxpZWRGb3IgPSAnZW5hYmxlZCc7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIEZvY3VzYWJsZTtcbn1cbiIsIlxuY29uc3QgREJVSUNvbW1vbkNzc1ZhcnMgPSBgXG4gIDpyb290IHtcbiAgICAtLWRidWktd2ViLWNvbXBvbmVudC1nbG9iYWwtYm9yZGVyLXJhZGl1czogNXB4O1xuICAgIC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtaGVpZ2h0OiAzMHB4O1xuICAgIC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtY29sb3I6ICMwMDA7XG4gICAgLS1kYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC1iYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICAtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWJvcmRlci1jb2xvcjogI2NjYztcbiAgICAtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWJvcmRlci1zdHlsZTogc29saWQ7XG4gICAgLS1kYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC1ib3JkZXItd2lkdGg6IDFweDtcbiAgfVxuICBgO1xuXG5leHBvcnQgZGVmYXVsdCBEQlVJQ29tbW9uQ3NzVmFycztcbiIsIlxuaW1wb3J0IGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbiBmcm9tICcuLi8uLi8uLi9pbnRlcm5hbHMvZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uJztcbmltcG9ydCBEQlVJQ29tbW9uQ3NzVmFycyBmcm9tICcuL0RCVUlDb21tb25Dc3NWYXJzJztcblxuY29uc3QgcmVnaXN0cmF0aW9uTmFtZSA9ICdEQlVJV2ViQ29tcG9uZW50QmFzZSc7XG5cbmZ1bmN0aW9uIGRlZmluZUNvbW1vbkNTU1ZhcnMod2luKSB7XG4gIGNvbnN0IHsgZG9jdW1lbnQgfSA9IHdpbjtcbiAgY29uc3QgY29tbW9uU3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICBjb21tb25TdHlsZS5zZXRBdHRyaWJ1dGUoJ2RidWktY29tbW9uLWNzcy12YXJzJywgJycpO1xuICBjb21tb25TdHlsZS5pbm5lckhUTUwgPSBEQlVJQ29tbW9uQ3NzVmFycztcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaGVhZCcpLmFwcGVuZENoaWxkKGNvbW1vblN0eWxlKTtcbn1cblxuLypcbkFjY2Vzc2luZyBwYXJlbnRzIGFuZCBjaGlsZHJlbjpcbklmIHBhcmVudCBpcyBhY2Nlc3NlZCBpbiBjb25uZWN0ZWRDYWxsYmFjayBpdCBleGlzdHMgKGlmIGl0IHNob3VsZCBleGlzdCksIGhvd2V2ZXIsXG50aGUgcGFyZW50IG1pZ2h0IG5vdCBiZSBpdHNlbGYgY29ubmVjdGVkIHlldC5cbklmIGNoaWxkcmVuIGFyZSBhY2Nlc3NlZCBpbiBjb25uZWN0ZWRDYWxsYmFjayB0aGV5IG1pZ2h0IG5vdCBiZSBjb21wbGV0ZSB5ZXQgYXQgdGhhdCB0aW1lLlxuKi9cblxuLy8gaHR0cHM6Ly93d3cua2lydXBhLmNvbS9odG1sNS9oYW5kbGluZ19ldmVudHNfZm9yX21hbnlfZWxlbWVudHMuaHRtXG4vKipcbiAqXG4gKiBAcGFyYW0gd2luIFdpbmRvd1xuICogQHJldHVybiB7XG4gKiAgIERCVUlXZWJDb21wb25lbnRCYXNlLFxuICogICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzLFxuICogICBSZWdpc3RlcmFibGVcbiAqIH1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0REJVSVdlYkNvbXBvbmVudENvcmUod2luKSB7XG4gIHJldHVybiBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24od2luLCByZWdpc3RyYXRpb25OYW1lLCAoKSA9PiB7XG4gICAgZGVmaW5lQ29tbW9uQ1NTVmFycyh3aW4pO1xuXG4gICAgY29uc3QgeyBkb2N1bWVudCwgSFRNTEVsZW1lbnQsIGN1c3RvbUVsZW1lbnRzIH0gPSB3aW47XG5cbiAgICBjbGFzcyBEQlVJV2ViQ29tcG9uZW50QmFzZSBleHRlbmRzIEhUTUxFbGVtZW50IHtcblxuICAgICAgLyoqXG4gICAgICAgKlxuICAgICAgICogQHJldHVybiBTdHJpbmdcbiAgICAgICAqL1xuICAgICAgc3RhdGljIGdldCByZWdpc3RyYXRpb25OYW1lKCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3JlZ2lzdHJhdGlvbk5hbWUgbXVzdCBiZSBkZWZpbmVkIGluIGRlcml2ZWQgY2xhc3NlcycpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcmV0dXJuIFN0cmluZyBIVE1MXG4gICAgICAgKi9cbiAgICAgIHN0YXRpYyBnZXQgdGVtcGxhdGVJbm5lckhUTUwoKSB7XG4gICAgICAgIHJldHVybiAnPHN0eWxlPjwvc3R5bGU+PHNsb3Q+PC9zbG90Pic7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm4gQXJyYXk8REJVSVdlYkNvbXBvbmVudD5cbiAgICAgICAqL1xuICAgICAgc3RhdGljIGdldCBkZXBlbmRlbmNpZXMoKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKlxuICAgICAgICogQHJldHVybiBBcnJheTxTdHJpbmc+XG4gICAgICAgKi9cbiAgICAgIHN0YXRpYyBnZXQgcHJvcGVydGllc1RvVXBncmFkZSgpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcmV0dXJuIE9iamVjdCB7IFN0cmluZywgU3RyaW5nIH1cbiAgICAgICAqL1xuICAgICAgc3RhdGljIGdldCBhdHRyaWJ1dGVzVG9EZWZpbmUoKSB7XG4gICAgICAgIHJldHVybiB7ICdkYnVpLXdlYi1jb21wb25lbnQnOiAnJyB9O1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcmV0dXJuIEFycmF5PFN0cmluZz5cbiAgICAgICAqL1xuICAgICAgc3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7XG4gICAgICAgIC8vIHdlYiBjb21wb25lbnRzIHN0YW5kYXJkIEFQSVxuICAgICAgICByZXR1cm4gWydkaXInLCAnbGFuZycsICdzeW5jLWxvY2FsZS13aXRoJ107XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm4gQm9vbGVhblxuICAgICAgICovXG4gICAgICBnZXQgaXNNb3VudGVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faXNNb3VudGVkO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcmV0dXJuIEJvb2xlYW5cbiAgICAgICAqL1xuICAgICAgZ2V0IGlzRGlzY29ubmVjdGVkKCkge1xuICAgICAgICAvLyBXZSBuZWVkIGlzRGlzY29ubmVjdGVkIGluZm8gd2hlbiBET00gdHJlZSBpcyBjb25zdHJ1Y3RlZFxuICAgICAgICAvLyAtIGFmdGVyIGNvbnN0cnVjdG9yKCkgYW5kIGJlZm9yZSBjb25uZWN0ZWRDYWxsYmFjaygpIC1cbiAgICAgICAgLy8gd2hlbiBjbG9zZXN0RGJ1aVBhcmVudCBzaG91bGQgbm90IHJldHVybiBudWxsLlxuICAgICAgICByZXR1cm4gdGhpcy5faXNEaXNjb25uZWN0ZWQ7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLmF0dGFjaFNoYWRvdyh7XG4gICAgICAgICAgbW9kZTogJ29wZW4nLFxuICAgICAgICAgIC8vIGRlbGVnYXRlc0ZvY3VzOiB0cnVlXG4gICAgICAgICAgLy8gTm90IHdvcmtpbmcgb24gSVBhZCBzbyB3ZSBkbyBhbiB3b3JrYXJvdW5kXG4gICAgICAgICAgLy8gYnkgc2V0dGluZyBcImZvY3VzZWRcIiBhdHRyaWJ1dGUgd2hlbiBuZWVkZWQuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuX3Byb3BhZ2F0aW5nQ29udGV4dCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9wcm92aWRpbmdDb250ZXh0ID0ge307XG4gICAgICAgIHRoaXMuX2xhc3RSZWNlaXZlZENvbnRleHQgPSB7fTtcbiAgICAgICAgdGhpcy5fY2xvc2VzdERidWlQYXJlbnQgPSBudWxsO1xuICAgICAgICB0aGlzLl9jbG9zZXN0RGJ1aUNoaWxkcmVuID0gW107XG4gICAgICAgIHRoaXMuX2lzTW91bnRlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9pc0Rpc2Nvbm5lY3RlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9sb2NhbGVPYnNlcnZlciA9IG51bGw7XG4gICAgICAgIHRoaXMuX2luc2VydFRlbXBsYXRlKCk7XG5cbiAgICAgICAgdGhpcy5jb25uZWN0ZWRDYWxsYmFjayA9IHRoaXMuY29ubmVjdGVkQ2FsbGJhY2suYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5kaXNjb25uZWN0ZWRDYWxsYmFjayA9IHRoaXMuZGlzY29ubmVjdGVkQ2FsbGJhY2suYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sgPSB0aGlzLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjay5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmFkb3B0ZWRDYWxsYmFjayA9IHRoaXMuYWRvcHRlZENhbGxiYWNrLmJpbmQodGhpcyk7XG5cbiAgICAgICAgLy8gcHJvdmlkZSBzdXBwb3J0IGZvciB0cmFpdHMgaWYgYW55IGFzIHRoZXkgY2FuJ3Qgb3ZlcnJpZGUgY29uc3RydWN0b3JcbiAgICAgICAgdGhpcy5pbml0ICYmIHRoaXMuaW5pdCguLi5hcmdzKTtcbiAgICAgIH1cblxuICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PSBbTG9jYWxlXSA+PiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgICAgLyoqXG4gICAgICAgKlxuICAgICAgICogQHJldHVybiBIVE1MRWxlbWVudFxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgZ2V0IF9sb2NhbGVUYXJnZXQoKSB7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5nZXRBdHRyaWJ1dGUoJ3N5bmMtbG9jYWxlLXdpdGgnKSk7XG4gICAgICAgIGNvbnN0IGRlZmF1bHRUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdodG1sJyk7XG4gICAgICAgIHJldHVybiB0YXJnZXQgfHwgZGVmYXVsdFRhcmdldDtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKlxuICAgICAgICogQHJldHVybiBPYmplY3QgeyBkaXIsIGxhbmcgfVxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgZ2V0IF90YXJnZXRlZExvY2FsZSgpIHtcbiAgICAgICAgLy8gUmV0dXJuIGxvY2FsZSBmcm9tIHRhcmdldFxuICAgICAgICBjb25zdCB0YXJnZXQgPSB0aGlzLl9sb2NhbGVUYXJnZXQ7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZGlyOiB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkaXInKSB8fCAnbHRyJyxcbiAgICAgICAgICBsYW5nOiB0YXJnZXQuZ2V0QXR0cmlidXRlKCdsYW5nJykgfHwgJ2VuJyxcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgX3Jlc2V0UHJvdmlkZWRMb2NhbGUoKSB7XG4gICAgICAgIC8vIENhbGxlZCBvbkRpc2Nvbm5lY3RlZENhbGxiYWNrLlxuICAgICAgICAvL1xuICAgICAgICAvLyBkYnVpRGlyL0xhbmcgZGJ1aS1kaXIvbGFuZyBjYW4gYmUgc2V0XG4gICAgICAgIC8vIGFzIGEgcmVzdWx0IG9mIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFja1xuICAgICAgICAvLyBvciBhcyBhIHJlc3VsdCBvZiBzeW5jaW5nIHdpdGggKG9yIG1vbml0b3JpbmcpIGxvY2FsZSB0YXJnZXQgKF9zeW5jTG9jYWxlQW5kTW9uaXRvckNoYW5nZXMpLlxuICAgICAgICAvLyBXZSBjYW4gcmVtb3ZlIHRoZW0gaWYgdGhleSB3ZXJlIHNldFxuICAgICAgICAvLyBhcyBhIHJlc3VsdCBvZiBfc3luY0xvY2FsZUFuZE1vbml0b3JDaGFuZ2VzXG4gICAgICAgIC8vIGJlY2F1c2Ugd2hlbiB0aGlzIG5vZGUgd2lsbCBiZSByZS1pbnNlcnRlZFxuICAgICAgICAvLyB0aGUgc3luY2luZyB3aWxsIGhhcHBlbiBhZ2FpbiBhbmQgZGJ1aS1kaXIvbGFuZyBhdHRycyBhbmQgZGJ1aURpci9MYW5nIHByb3ZpZGVkIGNvbnRleHQgd2lsbCBiZSBzZXQgYWdhaW4uXG4gICAgICAgIC8vIEJ1dCB3ZSBjYW4ndCBkZWxldGUgdGhlbSBpZiB0aGV5IHdlcmUgc2V0IG9uQXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrXG4gICAgICAgIC8vIGJlY2F1c2UgdGhhdCB3aWxsIG5vdCBiZSBmaXJlZCBhZ2FpbiB3aGVuIG5vZGUgaXMgbW92ZWQgaW4gb3RoZXIgcGFydCBvZiB0aGUgRE9NLlxuICAgICAgICBpZiAoIXRoaXMuZ2V0QXR0cmlidXRlKCdkaXInKSkge1xuICAgICAgICAgIC8vIFdlIGtub3cgdGhhdCBsb2NhbGUgcHJvcHMvYXR0cnMgd2VyZSBzZXRcbiAgICAgICAgICAvLyBhcyBhIHJlc3VsdCBvZiBsb2NhbGUgc3luY2luZ1xuICAgICAgICAgIC8vIGFuZCB3ZSBjYW4gcmVzZXQgbG9jYWxlIGZyb20gX3Byb3ZpZGluZ0NvbnRleHQuXG4gICAgICAgICAgZGVsZXRlIHRoaXMuX3Byb3ZpZGluZ0NvbnRleHQuZGJ1aURpcjsgLy8gYWZmZWN0cyBjb250ZXh0IHByb3ZpZGVycyAvIG5vIGVmZmVjdCBvbiBjb250ZXh0IHJlY2VpdmVyc1xuICAgICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCdkYnVpLWRpcicpOyAvLyBhZmZlY3RzIHByb3ZpZGVycyBhbmQgcmVjZWl2ZXJzXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuZ2V0QXR0cmlidXRlKCdsYW5nJykpIHtcbiAgICAgICAgICBkZWxldGUgdGhpcy5fcHJvdmlkaW5nQ29udGV4dC5kYnVpTGFuZztcbiAgICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgnZGJ1aS1sYW5nJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fbG9jYWxlT2JzZXJ2ZXIpIHtcbiAgICAgICAgICB0aGlzLl9sb2NhbGVPYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgdGhpcy5fbG9jYWxlT2JzZXJ2ZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSBuZXdDb250ZXh0IE9iamVjdFxuICAgICAgICogQHBhcmFtIHByZXZDb250ZXh0IE9iamVjdFxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgICBfb25Mb2NhbGVDb250ZXh0Q2hhbmdlZChuZXdDb250ZXh0LCBwcmV2Q29udGV4dCkge1xuICAgICAgICAvLyBJZiB3ZSBhcmUgbW9uaXRvcmluZyBsb2NhbGUgZnJvbSBlbHNld2hlcmUgZGlzY2FyZCB0aGlzIG5vdGlmaWNhdGlvbi5cbiAgICAgICAgaWYgKHRoaXMuX2xvY2FsZU9ic2VydmVyKSByZXR1cm47XG4gICAgICAgIGNvbnN0IHtcbiAgICAgICAgICBkYnVpRGlyLCBkYnVpTGFuZ1xuICAgICAgICB9ID0gbmV3Q29udGV4dDtcbiAgICAgICAgLy8gY2hhbmdlcyBkb25lIGJ5IGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhkaXIvbGFuZykgdGFrZXMgcHJlY2VkZW5jZSBvdmVyIG9uQ29udGV4dENoYW5nZWRcbiAgICAgICAgIXRoaXMuZ2V0QXR0cmlidXRlKCdkaXInKSAmJiB0aGlzLnNldEF0dHJpYnV0ZSgnZGJ1aS1kaXInLCBkYnVpRGlyKTtcbiAgICAgICAgIXRoaXMuZ2V0QXR0cmlidXRlKCdsYW5nJykgJiYgdGhpcy5zZXRBdHRyaWJ1dGUoJ2RidWktbGFuZycsIGRidWlMYW5nKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIG5hbWUgU3RyaW5nXG4gICAgICAgKiBAcGFyYW0gb2xkVmFsdWUgU3RyaW5nXG4gICAgICAgKiBAcGFyYW0gbmV3VmFsdWUgU3RyaW5nXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgICBfb25Mb2NhbGVBdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlKSB7XG4gICAgICAgIC8vIElmIGxvY2FsZSB2YWx1ZSBpcyB0cnV0aHksIHNldCBpdCAob24gY29udGV4dCB0b28pXG4gICAgICAgIC8vIGVsc2UgcmVhZCB2YWx1ZSBmcm9tIF90YXJnZXRlZExvY2FsZVxuICAgICAgICAvLyBvciBmcm9tIGNsb3Nlc3REYnVpUGFyZW50IGNvbnRleHQuXG4gICAgICAgIGlmICghWydkaXInLCAnbGFuZycsICdzeW5jLWxvY2FsZS13aXRoJ10uaW5jbHVkZXMobmFtZSkpIHJldHVybjtcblxuICAgICAgICBpZiAobmFtZSA9PT0gJ3N5bmMtbG9jYWxlLXdpdGgnKSB7XG4gICAgICAgICAgLy8gc3RvcCBtb25pdG9yaW5nIG9sZCB0YXJnZXQgYW5kIHN0YXJ0IG1vbml0b3JpbmcgbmV3IHRhcmdldFxuICAgICAgICAgIHRoaXMuX3N5bmNMb2NhbGVBbmRNb25pdG9yQ2hhbmdlcygpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNvbnRleHRLZXkgPSBuYW1lID09PSAnZGlyJyA/ICdkYnVpRGlyJyA6ICdkYnVpTGFuZyc7XG4gICAgICAgIGNvbnN0IGhhc0xvY2FsZVN5bmMgPSAhIXRoaXMuaGFzQXR0cmlidXRlKCdzeW5jLWxvY2FsZS13aXRoJyk7XG4gICAgICAgIGNvbnN0IGNsb3Nlc3REYnVpUGFyZW50ID0gdGhpcy5jbG9zZXN0RGJ1aVBhcmVudDtcbiAgICAgICAgY29uc3QgaXNUb3BEYnVpQW5jZXN0b3IgPSAhY2xvc2VzdERidWlQYXJlbnQ7XG4gICAgICAgIGNvbnN0IHRhcmdldGVkTG9jYWxlID1cbiAgICAgICAgICAoaGFzTG9jYWxlU3luYyB8fCBpc1RvcERidWlBbmNlc3RvcikgPyB0aGlzLl90YXJnZXRlZExvY2FsZSA6IG51bGw7XG4gICAgICAgIGNvbnN0IHZhbHVlVG9TZXQgPSBuZXdWYWx1ZSB8fFxuICAgICAgICAgICh0YXJnZXRlZExvY2FsZSAmJiB0YXJnZXRlZExvY2FsZVtuYW1lXSkgfHxcbiAgICAgICAgICBjbG9zZXN0RGJ1aVBhcmVudC5fZ2V0Q29udGV4dChbY29udGV4dEtleV0pW2NvbnRleHRLZXldO1xuXG4gICAgICAgIGlmIChuZXdWYWx1ZSB8fCB0YXJnZXRlZExvY2FsZSkge1xuICAgICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKGBkYnVpLSR7bmFtZX1gLCB2YWx1ZVRvU2V0KTtcbiAgICAgICAgICB0aGlzLnNldENvbnRleHQoe1xuICAgICAgICAgICAgW2NvbnRleHRLZXldOiB2YWx1ZVRvU2V0XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGFyZ2V0ZWRMb2NhbGUgJiYgdGhpcy5fd2F0Y2hMb2NhbGVDaGFuZ2VzKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fcmVzZXRQcm92aWRlZExvY2FsZSgpO1xuICAgICAgICAgIHRoaXMuX3Vuc2V0QW5kUmVsaW5rQ29udGV4dChjb250ZXh0S2V5KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBfc3luY0xvY2FsZUFuZE1vbml0b3JDaGFuZ2VzKCkge1xuICAgICAgICAvLyBDYWxsZWQgb25Db25uZWN0ZWRDYWxsYmFjayBhbmQgX29uTG9jYWxlQXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrIChvbmx5IGZvciBzeW5jLWxvY2FsZS13aXRoKS5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gSWYgYmVpbmcgdG9wIG1vc3QgZGJ1aSBhbmNlc3RvciBvciBoYXZpbmcgYXR0ciBcInN5bmMtbG9jYWxlLXdpdGhcIiBkZWZpbmVkLFxuICAgICAgICAvLyByZWFkIGxvY2FsZSBmcm9tIHRhcmdldCwgc2V0IHZhbHVlcyBvbiBjb250ZXh0XG4gICAgICAgIC8vIHRoZW4gd2F0Y2ggZm9yIGxvY2FsZSBjaGFuZ2VzIG9uIHRhcmdldC5cbiAgICAgICAgY29uc3QgaXNEZXNjZW5kYW50RGJ1aSA9ICEhdGhpcy5jbG9zZXN0RGJ1aVBhcmVudDtcbiAgICAgICAgY29uc3QgaGFzTG9jYWxlU3luYyA9ICEhdGhpcy5oYXNBdHRyaWJ1dGUoJ3N5bmMtbG9jYWxlLXdpdGgnKTtcbiAgICAgICAgaWYgKGlzRGVzY2VuZGFudERidWkgJiYgIWhhc0xvY2FsZVN5bmMpIHJldHVybjtcblxuICAgICAgICBjb25zdCB7IGRpcjogdGFyZ2V0ZWREaXIsIGxhbmc6IHRhcmdldGVkTGFuZyB9ID0gdGhpcy5fdGFyZ2V0ZWRMb2NhbGU7XG4gICAgICAgIGNvbnN0IHNlbGZEaXIgPSB0aGlzLmdldEF0dHJpYnV0ZSgnZGlyJyk7XG4gICAgICAgIGNvbnN0IHNlbGZMYW5nID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2xhbmcnKTtcbiAgICAgICAgY29uc3QgbmV3RGlyID0gc2VsZkRpciB8fCB0YXJnZXRlZERpcjtcbiAgICAgICAgY29uc3QgbmV3TGFuZyA9IHNlbGZMYW5nIHx8IHRhcmdldGVkTGFuZztcblxuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnZGJ1aS1kaXInLCBuZXdEaXIpO1xuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnZGJ1aS1sYW5nJywgbmV3TGFuZyk7XG5cbiAgICAgICAgdGhpcy5zZXRDb250ZXh0KHtcbiAgICAgICAgICBkYnVpRGlyOiBuZXdEaXIsXG4gICAgICAgICAgZGJ1aUxhbmc6IG5ld0xhbmdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5fd2F0Y2hMb2NhbGVDaGFuZ2VzKCk7XG4gICAgICB9XG5cbiAgICAgIF93YXRjaExvY2FsZUNoYW5nZXMoKSB7XG4gICAgICAgIC8vIENhbGxlZCBmcm9tIF9zeW5jTG9jYWxlQW5kTW9uaXRvckNoYW5nZXMgYW5kIF9vbkxvY2FsZUF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayAob25seSBmb3IgZGlyL2xhbmcpLlxuICAgICAgICBpZiAodGhpcy5fbG9jYWxlT2JzZXJ2ZXIpIHtcbiAgICAgICAgICB0aGlzLl9sb2NhbGVPYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBsb2NhbGVUYXJnZXQgPSB0aGlzLl9sb2NhbGVUYXJnZXQ7XG5cbiAgICAgICAgdGhpcy5fbG9jYWxlT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zKSA9PiB7XG4gICAgICAgICAgbXV0YXRpb25zLmZvckVhY2goKG11dGF0aW9uKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBhdHRyID0gbXV0YXRpb24uYXR0cmlidXRlTmFtZTtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5fdGFyZ2V0ZWRMb2NhbGVbYXR0cl07XG4gICAgICAgICAgICBjb25zdCBhdHRyS2V5ID0gYGRidWktJHthdHRyfWA7XG4gICAgICAgICAgICBjb25zdCBjb250ZXh0S2V5ID0gYGRidWkke2F0dHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBhdHRyLnNsaWNlKDEpfWA7XG5cbiAgICAgICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKGF0dHJLZXksIHZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMuc2V0Q29udGV4dCh7XG4gICAgICAgICAgICAgIFtjb250ZXh0S2V5XTogdmFsdWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl9sb2NhbGVPYnNlcnZlci5vYnNlcnZlKGxvY2FsZVRhcmdldCwge1xuICAgICAgICAgIGF0dHJpYnV0ZXM6IHRydWUsXG4gICAgICAgICAgYXR0cmlidXRlRmlsdGVyOiBbJ2RpcicsICdsYW5nJ11cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT0gPDwgW0xvY2FsZV0gID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09IFtDb250ZXh0XSA+PiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgICAgLyoqXG4gICAgICAgKlxuICAgICAgICogQHJldHVybiBBcnJheTxTdHJpbmc+XG4gICAgICAgKi9cbiAgICAgIHN0YXRpYyBnZXQgY29udGV4dFByb3ZpZGUoKSB7XG4gICAgICAgIHJldHVybiBbJ2RidWlEaXInLCAnZGJ1aUxhbmcnXTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKlxuICAgICAgICogQHJldHVybiBBcnJheTxTdHJpbmc+XG4gICAgICAgKi9cbiAgICAgIHN0YXRpYyBnZXQgY29udGV4dFN1YnNjcmliZSgpIHtcbiAgICAgICAgcmV0dXJuIFsnZGJ1aURpcicsICdkYnVpTGFuZyddO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ga2V5IFN0cmluZ1xuICAgICAgICogQHJldHVybiBCb29sZWFuXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgICBfcHJvdmlkZXNDb250ZXh0Rm9yKGtleSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5jb250ZXh0UHJvdmlkZS5zb21lKChfa2V5KSA9PiBfa2V5ID09PSBrZXkpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ga2V5IFN0cmluZ1xuICAgICAgICogQHJldHVybiBCb29sZWFuXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgICBfaGFzVmFsdWVGb3JDb250ZXh0KGtleSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcHJvdmlkaW5nQ29udGV4dFtrZXldICE9PSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSBrZXkgU3RyaW5nXG4gICAgICAgKiBAcmV0dXJuIEJvb2xlYW5cbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICAgIF9zdWJzY3JpYmVzRm9yQ29udGV4dChrZXkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IuY29udGV4dFN1YnNjcmliZS5zb21lKChfa2V5KSA9PiBfa2V5ID09PSBrZXkpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0gY29udGV4dE9iaiBPYmplY3RcbiAgICAgICAqL1xuICAgICAgc2V0Q29udGV4dChjb250ZXh0T2JqKSB7XG4gICAgICAgIGNvbnN0IG5ld0tleXMgPSBPYmplY3Qua2V5cyhjb250ZXh0T2JqKS5maWx0ZXIoKGtleSkgPT4ge1xuICAgICAgICAgIHJldHVybiB0aGlzLl9wcm92aWRlc0NvbnRleHRGb3Ioa2V5KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgY29udGV4dFRvU2V0ID0gbmV3S2V5cy5yZWR1Y2UoKGFjYywga2V5KSA9PiB7XG4gICAgICAgICAgYWNjW2tleV0gPSBjb250ZXh0T2JqW2tleV07XG4gICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfSwge30pO1xuXG4gICAgICAgIGNvbnN0IG5ld1Byb3ZpZGluZ0NvbnRleHQgPSB7XG4gICAgICAgICAgLi4udGhpcy5fcHJvdmlkaW5nQ29udGV4dCxcbiAgICAgICAgICAuLi5jb250ZXh0VG9TZXRcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLl9wcm92aWRpbmdDb250ZXh0ID0gbmV3UHJvdmlkaW5nQ29udGV4dDtcblxuICAgICAgICBpZiAodGhpcy5fcHJvcGFnYXRpbmdDb250ZXh0KSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5fcHJvcGFnYXRlQ29udGV4dENoYW5nZWQodGhpcy5fcHJvdmlkaW5nQ29udGV4dCk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSBuZXdDb250ZXh0IE9iamVjdFxuICAgICAgICovXG4gICAgICBfcHJvcGFnYXRlQ29udGV4dENoYW5nZWQobmV3Q29udGV4dCkge1xuICAgICAgICB0aGlzLl9wcm9wYWdhdGluZ0NvbnRleHQgPSB0cnVlO1xuICAgICAgICBjb25zdCBuZXdDb250ZXh0S2V5cyA9IE9iamVjdC5rZXlzKG5ld0NvbnRleHQpO1xuXG4gICAgICAgIC8vIGlmIGNvbnRleHQgaXMgcmVjZWl2ZWQgZnJvbSBhbmNlc3RvcnNcbiAgICAgICAgaWYgKG5ld0NvbnRleHQgIT09IHRoaXMuX3Byb3ZpZGluZ0NvbnRleHQpIHtcbiAgICAgICAgICAvLyBtYWtlcyBzZWxmIGF3YXJlXG4gICAgICAgICAgY29uc3Qga2V5c1N1YnNjcmliZWRGb3IgPSBuZXdDb250ZXh0S2V5cy5yZWR1Y2UoKGFjYywga2V5KSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9zdWJzY3JpYmVzRm9yQ29udGV4dChrZXkpICYmIGFjYy5wdXNoKGtleSk7XG4gICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICAgIH0sIFtdKTtcblxuICAgICAgICAgIGlmIChrZXlzU3Vic2NyaWJlZEZvci5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRleHRTdWJzY3JpYmVkRm9yID0ga2V5c1N1YnNjcmliZWRGb3IucmVkdWNlKChhY2MsIGtleSkgPT4ge1xuICAgICAgICAgICAgICBhY2Nba2V5XSA9IG5ld0NvbnRleHRba2V5XTtcbiAgICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgICAgIH0sIHt9KTtcbiAgICAgICAgICAgIHRoaXMuX29uQ29udGV4dENoYW5nZWQoY29udGV4dFN1YnNjcmliZWRGb3IpO1xuICAgICAgICAgICAgLy8gQXQgdGhpcyBwb2ludCB1c2VyIG1pZ2h0IGhhdmUgY2FsbCBzZXRDb250ZXh0IGluc2lkZSBvbkNvbnRleHRDaGFuZ2VkXG4gICAgICAgICAgICAvLyBpbiB3aGljaCBjYXNlIF9wcm92aWRpbmdDb250ZXh0IGlzIHVwZGF0ZWQgd2l0aCBsYXRlc3QgdmFsdWVzLlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHByb3BhZ2F0ZSB3aXRoIG92ZXJyaWRlc1xuICAgICAgICAvLyBJZiB1c2VyIGNhbGxlZCBzZXRDb250ZXh0KCkgZnJvbSB3aXRoaW4gb25Db250ZXh0Q2hhbmdlZCgpIHRoZW5cbiAgICAgICAgLy8gdGhpcy5fcHJvdmlkaW5nQ29udGV4dCBoYXMgdGhlIG5ld2VzdCB2YWx1ZXMgdG8gYmUgcHJvcGFnYXRlZFxuICAgICAgICBjb25zdCBvdmVycmlkZGVuQ29udGV4dCA9IHRoaXMuY29uc3RydWN0b3IuY29udGV4dFByb3ZpZGUucmVkdWNlKChhY2MsIGtleSkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLl9oYXNWYWx1ZUZvckNvbnRleHQoa2V5KSkge1xuICAgICAgICAgICAgYWNjW2tleV0gPSB0aGlzLl9wcm92aWRpbmdDb250ZXh0W2tleV07XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0sIHt9KTtcblxuICAgICAgICBjb25zdCBjb250ZXh0VG9Qcm9wYWdhdGUgPSB7XG4gICAgICAgICAgLi4ubmV3Q29udGV4dCxcbiAgICAgICAgICAuLi5vdmVycmlkZGVuQ29udGV4dFxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIGNoaWxkcmVuIHRoYXQgd2lsbCBtb3VudCBsYXRlciB3aWxsIGFzayBmb3IgY29udGV4dCAoX2NoZWNrQ29udGV4dClcbiAgICAgICAgdGhpcy5jbG9zZXN0RGJ1aUNoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgICAgICAgY2hpbGQuX3Byb3BhZ2F0ZUNvbnRleHRDaGFuZ2VkKGNvbnRleHRUb1Byb3BhZ2F0ZSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9wcm9wYWdhdGluZ0NvbnRleHQgPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBSZXNldHMgX2xhc3RSZWNlaXZlZENvbnRleHQgYW5kIF9wcm92aWRpbmdDb250ZXh0LFxuICAgICAgICogbG9va3MgdXAgZm9yIG5ldyB2YWx1ZSBvbiBjbG9zZXN0RGJ1aVBhcmVudCBjb250ZXh0XG4gICAgICAgKiBhbmQgcHJvcGFnYXRlcyB0aGF0IHRvIHNlbGYgYW5kIGFuY2VzdG9ycy5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0gY29udGV4dEtleSBTdHJpbmcgfCBBcnJheTxTdHJpbmc+XG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgICBfdW5zZXRBbmRSZWxpbmtDb250ZXh0KGNvbnRleHRLZXkpIHtcbiAgICAgICAgY29uc3QgY29udGV4dEtleXMgPSBBcnJheS5pc0FycmF5KGNvbnRleHRLZXkpID8gY29udGV4dEtleSA6IFtjb250ZXh0S2V5XTtcblxuICAgICAgICBjb250ZXh0S2V5cy5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICBkZWxldGUgdGhpcy5fbGFzdFJlY2VpdmVkQ29udGV4dFtrZXldO1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLl9wcm92aWRpbmdDb250ZXh0W2tleV07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGNsb3Nlc3REYnVpUGFyZW50ID0gdGhpcy5jbG9zZXN0RGJ1aVBhcmVudDtcbiAgICAgICAgY29uc3QgdmFsdWVzVG9TZXQgPVxuICAgICAgICAgICAgIWNsb3Nlc3REYnVpUGFyZW50ID9cbiAgICAgICAgICAgICAgdW5kZWZpbmVkIDpcbiAgICAgICAgICAgICAgY2xvc2VzdERidWlQYXJlbnQuX2dldENvbnRleHQoY29udGV4dEtleXMpO1xuXG4gICAgICAgIGNvbnN0IG5ld0NvbnRleHQgPSBjb250ZXh0S2V5cy5yZWR1Y2UoKGFjYywga2V5KSA9PiB7XG4gICAgICAgICAgYWNjW2tleV0gPSAodmFsdWVzVG9TZXQgfHwge30pW2tleV07XG4gICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfSwge30pO1xuXG4gICAgICAgIHRoaXMuX3Byb3BhZ2F0ZUNvbnRleHRDaGFuZ2VkKG5ld0NvbnRleHQpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ga2V5cyBBcnJheTxTdHJpbmc+XG4gICAgICAgKiBAcmV0dXJuIE9iamVjdFxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgX2dldENvbnRleHQoa2V5cykge1xuICAgICAgICAvLyBUaGlzIG11c3QgcnVuIGFsd2F5cyBpbiB0aGUgcGFyZW50IG9mIHRoZSBub2RlIGFza2luZyBmb3IgY29udGV4dFxuICAgICAgICAvLyBhbmQgbm90IGluIHRoZSBub2RlIGl0c2VsZi5cbiAgICAgICAgY29uc3Qgb3duZWRLZXlzID0gW107XG4gICAgICAgIGNvbnN0IGtleXNUb0Fza0ZvciA9IFtdO1xuICAgICAgICBrZXlzLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLl9oYXNWYWx1ZUZvckNvbnRleHQoa2V5KSkge1xuICAgICAgICAgICAgb3duZWRLZXlzLnB1c2goa2V5KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAga2V5c1RvQXNrRm9yLnB1c2goa2V5KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBjbG9zZXN0RGJ1aVBhcmVudCA9IHRoaXMuY2xvc2VzdERidWlQYXJlbnQ7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4ub3duZWRLZXlzLnJlZHVjZSgoYWNjLCBrZXkpID0+IHtcbiAgICAgICAgICAgIGFjY1trZXldID0gdGhpcy5fcHJvdmlkaW5nQ29udGV4dFtrZXldO1xuICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgICB9LCB7fSksXG4gICAgICAgICAgLi4uKGNsb3Nlc3REYnVpUGFyZW50ID8gY2xvc2VzdERidWlQYXJlbnQuX2dldENvbnRleHQoa2V5c1RvQXNrRm9yKSA6IHt9KVxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0gbmV3Q29udGV4dCBPYmplY3RcbiAgICAgICAqIEBwYXJhbSBvcHRpb25zIHsgcmVzZXQgPSBmYWxzZSB9XG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgICBfb25Db250ZXh0Q2hhbmdlZChuZXdDb250ZXh0LCB7IHJlc2V0ID0gZmFsc2UgfSA9IHt9KSB7XG4gICAgICAgIC8vIE1pZ2h0IGJlIGZpcmVkIG1vcmUgdGhhbiBvbmNlIHVudGlsIERPTSB0cmVlIHNldHRsZXMgZG93bi5cbiAgICAgICAgLy8gZXg6IGZpcnN0IGNhbGwgaXMgdGhlIHJlc3VsdCBvZiBfY2hlY2tDb250ZXh0IHdoaWNoIG1pZ2h0IGdldCB0aGUgdG9wIG1vc3QgZXhpc3RpbmcgY29udGV4dC5cbiAgICAgICAgLy8gVGhlIG5leHQgb25lcyBjYW4gYmUgdGhlIHJlc3VsdCBvZiBtaWRkbGUgYW5jZXN0b3JzIGZpcmluZyBhdHRyaWJ1dGVDaGFuZ2VDYWxsYmFja1xuICAgICAgICAvLyB3aGljaCBtaWdodCBzZXQgdGhlaXIgY29udGV4dCBhbmQgcHJvcGFnYXRlIGl0IGRvd24uXG4gICAgICAgIGNvbnN0IGxhc3RSZWNlaXZlZENvbnRleHQgPSB0aGlzLl9sYXN0UmVjZWl2ZWRDb250ZXh0O1xuICAgICAgICBjb25zdCBuZXdDb250ZXh0RmlsdGVyZWRLZXlzID0gT2JqZWN0LmtleXMobmV3Q29udGV4dCB8fCB7fSkuZmlsdGVyKChrZXkpID0+IHtcbiAgICAgICAgICByZXR1cm4gbmV3Q29udGV4dFtrZXldICE9PSBsYXN0UmVjZWl2ZWRDb250ZXh0W2tleV07XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBQcmV2ZW50cyB0cmlnZ2VyaW5nIG9uQ29udGV4dENoYW5nZWQgYWdhaW5zdCBhIGNvbnRleHQgZm91bmQgb24gc29tZSBhbmNlc3RvclxuICAgICAgICAvLyB3aGljaCBkaWQgbm90IG1hbmFnZWQgeWV0IHRvIHNldHVwIGl0cyBjb250ZXh0XG4gICAgICAgIC8vIGR1ZSB0byBmb3IgZXhhbXBsZSBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sgZGlkIG5vdCBmaXJlZCBvbiB0aGF0IGFuY2VzdG9yIHlldC5cbiAgICAgICAgaWYgKCFuZXdDb250ZXh0RmlsdGVyZWRLZXlzLmxlbmd0aCAmJiAhcmVzZXQpIHJldHVybjtcbiAgICAgICAgY29uc3QgbmV3Q29udGV4dEZpbHRlcmVkID0gbmV3Q29udGV4dEZpbHRlcmVkS2V5cy5yZWR1Y2UoKGFjYywga2V5KSA9PiB7XG4gICAgICAgICAgYWNjW2tleV0gPSBuZXdDb250ZXh0W2tleV07XG4gICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfSwge30pO1xuICAgICAgICBjb25zdCBjb250ZXh0VG9TZXQgPSByZXNldCA/IHt9IDogeyAuLi5sYXN0UmVjZWl2ZWRDb250ZXh0LCAuLi5uZXdDb250ZXh0RmlsdGVyZWQgfTtcbiAgICAgICAgdGhpcy5fbGFzdFJlY2VpdmVkQ29udGV4dCA9IGNvbnRleHRUb1NldDtcbiAgICAgICAgY29uc3QgW19uZXdDb250ZXh0LCBfcHJldkNvbnRleHRdID0gW3RoaXMuX2xhc3RSZWNlaXZlZENvbnRleHQsIGxhc3RSZWNlaXZlZENvbnRleHRdO1xuICAgICAgICB0aGlzLl9vbkxvY2FsZUNvbnRleHRDaGFuZ2VkKF9uZXdDb250ZXh0LCBfcHJldkNvbnRleHQpO1xuICAgICAgICB0aGlzLm9uQ29udGV4dENoYW5nZWQoX25ld0NvbnRleHQsIF9wcmV2Q29udGV4dCk7XG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBQdWJsaWMgaG9vay5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0gbmV3Q29udGV4dCBPYmplY3RcbiAgICAgICAqIEBwYXJhbSBwcmV2Q29udGV4dCBPYmplY3RcbiAgICAgICAqL1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgICBvbkNvbnRleHRDaGFuZ2VkKG5ld0NvbnRleHQsIHByZXZDb250ZXh0KSB7XG4gICAgICAgIC8vIHBhc3NcbiAgICAgIH1cblxuICAgICAgX2NoZWNrQ29udGV4dCgpIHtcbiAgICAgICAgLy8gX2NoZWNrQ29udGV4dCBjYW4gcHJvcGFnYXRlIHJlY3Vyc2l2ZWx5IHRvIHRoZSB2ZXJ5IHRvcCBldmVuIGlmIGFuY2VzdG9ycyBhcmUgbm90IGNvbm5lY3RlZC5cbiAgICAgICAgLy8gSWYgdGhlcmUgaXMgY29udGV4dCBkZWZpbmVkIHNvbWV3aGVyZSB1cHN0cmVhbSB0aGVuIGl0IHdpbGwgYmUgcmVhY2hlZCBieSBkZXNjZW5kYW50cy5cbiAgICAgICAgY29uc3QgY2xvc2VzdERidWlQYXJlbnQgPSB0aGlzLmNsb3Nlc3REYnVpUGFyZW50O1xuICAgICAgICAvLyBubyBuZWVkIHRvIGNoZWNrIGNvbnRleHQgaWYgaXMgdG9wIG1vc3QgZGJ1aSBhbmNlc3RvclxuICAgICAgICBpZiAoIWNsb3Nlc3REYnVpUGFyZW50KSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgbmV3Q29udGV4dCA9IGNsb3Nlc3REYnVpUGFyZW50Ll9nZXRDb250ZXh0KFxuICAgICAgICAgIHRoaXMuY29uc3RydWN0b3IuY29udGV4dFN1YnNjcmliZVxuICAgICAgICApO1xuICAgICAgICB0aGlzLl9vbkNvbnRleHRDaGFuZ2VkKG5ld0NvbnRleHQpO1xuICAgICAgICAvLyBObyBuZWVkIHRvIHByb3BhZ2F0ZSB0byB0aGUgY2hpbGRyZW4gYmVjYXVzZSB0aGV5IGNhbiBzZWFyY2ggdXB3YXJkIGZvciBjb250ZXh0XG4gICAgICAgIC8vIHVudGlsIHRvcCBvZiB0aGUgdHJlZSBpcyByZWFjaGVkLCBldmVuIGlmIGFuY2VzdG9ycyBhcmUgbm90IGNvbm5lY3RlZCB5ZXQuXG4gICAgICAgIC8vIElmIHNvbWUgbWlkZGxlIGFuY2VzdG9yIGhhcyBjb250ZXh0IHRvIHByb3ZpZGUgYW5kIGRpZCBub3QgbWFuYWdlZCB0byBwcm92aWRlIGl0IHlldFxuICAgICAgICAvLyAoZXg6IGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayBub3QgZmlyZWQgYmVmb3JlIGRlc2NlbmRhbnRzIGxvb2tlZCBmb3IgdXBzdHJlYW0gY29udGV4dClcbiAgICAgICAgLy8gdGhlbiBkZXNjZW5kYW50cyB3aWxsIHJlY2VpdmUgZmlyc3QgY29udGV4dCBmcm9tIHVwc3RyZWFtIHRoZW4gZnJvbSBtaWRkbGUgYW5jZXN0b3IuXG4gICAgICAgIC8vIFRoaXMgd2FzIHZlcmlmaWVkIVxuICAgICAgfVxuXG4gICAgICBfcmVzZXRDb250ZXh0KCkge1xuICAgICAgICAvLyB0aGlzLl9wcm92aWRpbmdDb250ZXh0IGlzIE5PVCByZXNldCBmcm9tIGNvbXBvbmVudCBwcm92aWRpbmcgY29udGV4dFxuICAgICAgICAvLyBiZWNhdXNlIGlmIGNvbnRleHQgaXMgZGVwZW5kZW50IG9uIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFja1xuICAgICAgICAvLyB0aGF0IHdpbGwgbm90IGZpcmUgd2hlbiBjb21wb25lbnQgaXMgbW92ZWQgZnJvbSBvbmUgcGxhY2UgdG8gYW5vdGhlciBwbGFjZSBpbiBET00gdHJlZS5cbiAgICAgICAgY29uc3QgY2xvc2VzdERidWlQYXJlbnQgPSB0aGlzLmNsb3Nlc3REYnVpUGFyZW50O1xuICAgICAgICAvLyBDaGVja2luZyBjbG9zZXN0RGJ1aVBhcmVudCB0byBiZSBzeW1tZXRyaWMgd2l0aCBfY2hlY2tDb250ZXh0XG4gICAgICAgIC8vIG9yIHdlJ2xsIGVuZCB1cCB3aXRoIGVtcHR5IGNvbnRleHQgb2JqZWN0IGFmdGVyIHJlc2V0LFxuICAgICAgICAvLyB3aGVuIGl0IGluaXRpYWxseSB3YXMgdW5kZWZpbmVkLlxuICAgICAgICBpZiAoY2xvc2VzdERidWlQYXJlbnQpIHtcbiAgICAgICAgICB0aGlzLl9vbkNvbnRleHRDaGFuZ2VkKG51bGwsIHsgcmVzZXQ6IHRydWUgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PSA8PCBbQ29udGV4dF0gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT0gW0Rlc2NlbmRhbnRzL0FuY2VzdG9ycyBhbmQgcmVnaXN0cmF0aW9uc10gPj4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICAgIC8qKlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSBjYWxsYmFjayBGdW5jdGlvblxuICAgICAgICogQHJldHVybiBIVE1MRWxlbWVudFxuICAgICAgICovXG4gICAgICBnZXRDbG9zZXN0QW5jZXN0b3JNYXRjaGluZ0NvbmRpdGlvbihjYWxsYmFjaykge1xuICAgICAgICBsZXQgY2xvc2VzdEFuY2VzdG9yID0gdGhpcy5wYXJlbnRFbGVtZW50O1xuICAgICAgICB3aGlsZSAoY2xvc2VzdEFuY2VzdG9yICYmICFjYWxsYmFjayhjbG9zZXN0QW5jZXN0b3IpKSB7XG4gICAgICAgICAgY2xvc2VzdEFuY2VzdG9yID0gY2xvc2VzdEFuY2VzdG9yLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNsb3Nlc3RBbmNlc3RvcjtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKlxuICAgICAgICogQHJldHVybiBBcnJheTxEQlVJV2ViQ29tcG9uZW50PlxuICAgICAgICovXG4gICAgICBnZXQgc2hhZG93RG9tRGJ1aUNoaWxkcmVuKCkge1xuICAgICAgICAvLyBjaGlsZHJlbiBpbiBzbG90cyBhcmUgTk9UIGluY2x1ZGVkIGhlcmVcbiAgICAgICAgcmV0dXJuIFsuLi50aGlzLnNoYWRvd1Jvb3QucXVlcnlTZWxlY3RvckFsbCgnW2RidWktd2ViLWNvbXBvbmVudF0nKV07XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm4gREJVSVdlYkNvbXBvbmVudCB8IG51bGxcbiAgICAgICAqL1xuICAgICAgZ2V0IHNoYWRvd0RvbURidWlQYXJlbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFJvb3ROb2RlKCkuaG9zdCB8fCBudWxsO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcmV0dXJuIERCVUlXZWJDb21wb25lbnQgfCBudWxsXG4gICAgICAgKi9cbiAgICAgIGdldCBsaWdodERvbURidWlQYXJlbnQoKSB7XG4gICAgICAgIC8vIGNhbiByZXR1cm4gYSBwYXJlbnQgd2hpY2ggaXMgaW4gc2hhZG93IERPTSBvZiB0aGUgZ3JhbmQtcGFyZW50XG4gICAgICAgIGxldCBwYXJlbnQgPSB0aGlzLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIHdoaWxlIChwYXJlbnQgJiYgIXBhcmVudC5oYXNBdHRyaWJ1dGUoJ2RidWktd2ViLWNvbXBvbmVudCcpKSB7XG4gICAgICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhcmVudCB8fCBudWxsO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcmV0dXJuIEFycmF5PERCVUlXZWJDb21wb25lbnQ+XG4gICAgICAgKi9cbiAgICAgIGdldCBsaWdodERvbURidWlDaGlsZHJlbigpIHtcbiAgICAgICAgLy8gY2hpbGRyZW4gaW4gc2xvdHMgQVJFIGluY2x1ZGVkIGhlcmVcbiAgICAgICAgcmV0dXJuIFsuLi50aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYnVpLXdlYi1jb21wb25lbnRdJyldO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcmV0dXJuIERCVUlXZWJDb21wb25lbnQgfCBudWxsXG4gICAgICAgKi9cbiAgICAgIGdldCBjbG9zZXN0RGJ1aVBhcmVudExpdmVRdWVyeSgpIHtcbiAgICAgICAgbGV0IGNsb3Nlc3RQYXJlbnQgPSB0aGlzLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIC8vIG1pZ2h0IGJlIG51bGwgaWYgZGlzY29ubmVjdGVkIGZyb20gZG9tXG4gICAgICAgIGlmIChjbG9zZXN0UGFyZW50ID09PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY2xvc2VzdFBhcmVudCA9IGNsb3Nlc3RQYXJlbnQuY2xvc2VzdCgnW2RidWktd2ViLWNvbXBvbmVudF0nKTtcbiAgICAgICAgcmV0dXJuIGNsb3Nlc3RQYXJlbnQgfHwgdGhpcy5zaGFkb3dEb21EYnVpUGFyZW50O1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcmV0dXJuIERCVUlXZWJDb21wb25lbnQgfCBudWxsXG4gICAgICAgKi9cbiAgICAgIGdldCBjbG9zZXN0RGJ1aVBhcmVudCgpIHtcbiAgICAgICAgLy8gY2FjaGVkXG4gICAgICAgIC8vIFJlYXNvbiBmb3IgY2FjaGUgaXMgdG8gYWxsb3cgYSBjaGlsZCB0byB1bnJlZ2lzdGVyIGZyb20gaXRzIHBhcmVudCB3aGVuIHVubW91bnRlZFxuICAgICAgICAvLyBiZWNhdXNlIHdoZW4gYnJvd3NlciBjYWxscyBkaXNjb25uZWN0ZWRDYWxsYmFjayB0aGUgcGFyZW50IGlzIG5vdCByZWFjaGFibGUgYW55bW9yZS5cbiAgICAgICAgLy8gSWYgcGFyZW50IGNvdWxkIG5vdCBiZSByZWFjaGFibGUgaXQgY291bGQgbm90IHVucmVnaXN0ZXIgaXRzIGNsb3Nlc3QgY2hpbGRyZW5cbiAgICAgICAgLy8gdGh1cyBsZWFkaW5nIHRvIG1lbW9yeSBsZWFrLlxuICAgICAgICBpZiAodGhpcy5fY2xvc2VzdERidWlQYXJlbnQpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5fY2xvc2VzdERidWlQYXJlbnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuaXNEaXNjb25uZWN0ZWQpIHJldHVybiBudWxsO1xuICAgICAgICB0aGlzLl9jbG9zZXN0RGJ1aVBhcmVudCA9IHRoaXMuY2xvc2VzdERidWlQYXJlbnRMaXZlUXVlcnk7XG4gICAgICAgIHJldHVybiB0aGlzLl9jbG9zZXN0RGJ1aVBhcmVudDtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKlxuICAgICAgICogQHJldHVybiBEQlVJV2ViQ29tcG9uZW50IHwgbnVsbFxuICAgICAgICovXG4gICAgICAvLyBtaWdodCBiZSB1c2VmdWwgaW4gc29tZSBzY2VuYXJpb3NcbiAgICAgIGdldCB0b3BEYnVpQW5jZXN0b3IoKSB7XG4gICAgICAgIGxldCBjbG9zZXN0RGJ1aVBhcmVudCA9IHRoaXMuY2xvc2VzdERidWlQYXJlbnQ7XG4gICAgICAgIHdoaWxlIChjbG9zZXN0RGJ1aVBhcmVudCkge1xuICAgICAgICAgIGNvbnN0IF9jbG9zZXN0RGJ1aVBhcmVudCA9IGNsb3Nlc3REYnVpUGFyZW50LmNsb3Nlc3REYnVpUGFyZW50O1xuICAgICAgICAgIGlmICghX2Nsb3Nlc3REYnVpUGFyZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gY2xvc2VzdERidWlQYXJlbnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNsb3Nlc3REYnVpUGFyZW50ID0gX2Nsb3Nlc3REYnVpUGFyZW50O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjbG9zZXN0RGJ1aVBhcmVudDsgLy8gdGhpcyBpcyBudWxsXG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm4gQXJyYXk8REJVSVdlYkNvbXBvbmVudD5cbiAgICAgICAqL1xuICAgICAgLy8gbWlnaHQgYmUgdXNlZnVsIGluIHNvbWUgc2NlbmFyaW9zXG4gICAgICBnZXQgY2xvc2VzdERidWlDaGlsZHJlbkxpdmVRdWVyeSgpIHtcbiAgICAgICAgY29uc3QgZGJ1aUNoaWxkcmVuID0gWy4uLnRoaXMubGlnaHREb21EYnVpQ2hpbGRyZW4sIC4uLnRoaXMuc2hhZG93RG9tRGJ1aUNoaWxkcmVuXTtcbiAgICAgICAgY29uc3QgY2xvc2VzdERidWlDaGlsZHJlbiA9IGRidWlDaGlsZHJlbi5maWx0ZXIoKGNoaWxkKSA9PiBjaGlsZC5jbG9zZXN0RGJ1aVBhcmVudExpdmVRdWVyeSA9PT0gdGhpcyk7XG4gICAgICAgIHJldHVybiBjbG9zZXN0RGJ1aUNoaWxkcmVuO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcmV0dXJuIEFycmF5PERCVUlXZWJDb21wb25lbnQ+XG4gICAgICAgKi9cbiAgICAgIGdldCBjbG9zZXN0RGJ1aUNoaWxkcmVuKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY2xvc2VzdERidWlDaGlsZHJlbjtcbiAgICAgIH1cblxuICAgICAgX3JlZ2lzdGVyU2VsZlRvQ2xvc2VzdERidWlQYXJlbnQoKSB7XG4gICAgICAgIGNvbnN0IGNsb3Nlc3REYnVpUGFyZW50ID0gdGhpcy5jbG9zZXN0RGJ1aVBhcmVudDtcbiAgICAgICAgaWYgKCFjbG9zZXN0RGJ1aVBhcmVudCkgcmV0dXJuO1xuICAgICAgICBjbG9zZXN0RGJ1aVBhcmVudC5fcmVnaXN0ZXJDaGlsZCh0aGlzKTtcbiAgICAgIH1cblxuICAgICAgX3VucmVnaXN0ZXJTZWxmRnJvbUNsb3Nlc3REYnVpUGFyZW50KCkge1xuICAgICAgICBjb25zdCBjbG9zZXN0RGJ1aVBhcmVudCA9IHRoaXMuY2xvc2VzdERidWlQYXJlbnQ7XG4gICAgICAgIGlmICghY2xvc2VzdERidWlQYXJlbnQpIHJldHVybjtcbiAgICAgICAgY2xvc2VzdERidWlQYXJlbnQuX3VucmVnaXN0ZXJDaGlsZCh0aGlzKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIGNoaWxkIERCVUlXZWJDb21wb25lbnRcbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICAgIF9yZWdpc3RlckNoaWxkKGNoaWxkKSB7XG4gICAgICAgIHRoaXMuX2Nsb3Nlc3REYnVpQ2hpbGRyZW4ucHVzaChjaGlsZCk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSBjaGlsZCBEQlVJV2ViQ29tcG9uZW50XG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgICBfdW5yZWdpc3RlckNoaWxkKGNoaWxkKSB7XG4gICAgICAgIHRoaXMuX2Nsb3Nlc3REYnVpQ2hpbGRyZW4gPVxuICAgICAgICAgIHRoaXMuX2Nsb3Nlc3REYnVpQ2hpbGRyZW4uZmlsdGVyKChfY2hpbGQpID0+IF9jaGlsZCAhPT0gY2hpbGQpO1xuICAgICAgfVxuXG4gICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09IDw8IFtEZXNjZW5kYW50cy9BbmNlc3RvcnMgYW5kIHJlZ2lzdHJhdGlvbnNdID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cbiAgICAgIC8qKlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSBwcm9wIFN0cmluZ1xuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgX3VwZ3JhZGVQcm9wZXJ0eShwcm9wKSB7XG4gICAgICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL3dlYi9mdW5kYW1lbnRhbHMvd2ViLWNvbXBvbmVudHMvYmVzdC1wcmFjdGljZXMjbGF6eS1wcm9wZXJ0aWVzXG4gICAgICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL3dlYi9mdW5kYW1lbnRhbHMvd2ViLWNvbXBvbmVudHMvZXhhbXBsZXMvaG93dG8tY2hlY2tib3hcbiAgICAgICAgLyogZXNsaW50IG5vLXByb3RvdHlwZS1idWlsdGluczogMCAqL1xuICAgICAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICAgIGNvbnN0IHZhbHVlID0gdGhpc1twcm9wXTtcbiAgICAgICAgICAvLyBnZXQgcmlkIG9mIHRoZSBwcm9wZXJ0eSB0aGF0IG1pZ2h0IHNoYWRvdyBhIHNldHRlci9nZXR0ZXJcbiAgICAgICAgICBkZWxldGUgdGhpc1twcm9wXTtcbiAgICAgICAgICAvLyB0aGlzIHRpbWUgaWYgYSBzZXR0ZXIgd2FzIGRlZmluZWQgaXQgd2lsbCBiZSBwcm9wZXJseSBjYWxsZWRcbiAgICAgICAgICB0aGlzW3Byb3BdID0gdmFsdWU7XG4gICAgICAgICAgLy8gaWYgYSBnZXR0ZXIgd2FzIGRlZmluZWQsIGl0IHdpbGwgYmUgY2FsbGVkIGZyb20gbm93IG9uXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIGtleSBTdHJpbmdcbiAgICAgICAqIEBwYXJhbSB2YWx1ZSBTdHJpbmdcbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICAgIF9kZWZpbmVBdHRyaWJ1dGUoa2V5LCB2YWx1ZSkge1xuICAgICAgICAvLyBkb24ndCBvdmVycmlkZSB1c2VyIGRlZmluZWQgYXR0cmlidXRlXG4gICAgICAgIGlmICghdGhpcy5oYXNBdHRyaWJ1dGUoa2V5KSkge1xuICAgICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKGtleSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIF9pbnNlcnRUZW1wbGF0ZSgpIHtcbiAgICAgICAgY29uc3QgeyB0ZW1wbGF0ZSB9ID0gdGhpcy5jb25zdHJ1Y3RvcjtcbiAgICAgICAgdGVtcGxhdGUgJiZcbiAgICAgICAgdGhpcy5zaGFkb3dSb290LmFwcGVuZENoaWxkKHRlbXBsYXRlLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIG9sZERvY3VtZW50IEhUTUxEb2N1bWVudFxuICAgICAgICogQHBhcmFtIG5ld0RvY3VtZW50IEhUTUxEb2N1bWVudFxuICAgICAgICovXG4gICAgICBhZG9wdGVkQ2FsbGJhY2sob2xkRG9jdW1lbnQsIG5ld0RvY3VtZW50KSB7XG4gICAgICAgIC8vIHdlYiBjb21wb25lbnRzIHN0YW5kYXJkIEFQSVxuICAgICAgICAvLyBjYWxsYmFja3Mgb3JkZXI6XG4gICAgICAgIC8vIGRpc2Nvbm5lY3RlZENhbGxiYWNrID0+IGFkb3B0ZWRDYWxsYmFjayA9PiBjb25uZWN0ZWRDYWxsYmFja1xuICAgICAgICB0aGlzLl9vbkFkb3B0ZWRDYWxsYmFjayhvbGREb2N1bWVudCwgbmV3RG9jdW1lbnQpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0gb2xkRG9jdW1lbnQgSFRNTERvY3VtZW50XG4gICAgICAgKiBAcGFyYW0gbmV3RG9jdW1lbnQgSFRNTERvY3VtZW50XG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgICBfb25BZG9wdGVkQ2FsbGJhY2sob2xkRG9jdW1lbnQsIG5ld0RvY3VtZW50KSB7XG4gICAgICAgIC8vIENhbGwgcHVibGljIGhvb2suXG4gICAgICAgIHRoaXMub25BZG9wdGVkQ2FsbGJhY2sob2xkRG9jdW1lbnQsIG5ld0RvY3VtZW50KTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBQdWJsaWMgaG9vay5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0gb2xkRG9jdW1lbnQgSFRNTERvY3VtZW50XG4gICAgICAgKiBAcGFyYW0gbmV3RG9jdW1lbnQgSFRNTERvY3VtZW50XG4gICAgICAgKi9cbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgICAgb25BZG9wdGVkQ2FsbGJhY2sob2xkRG9jdW1lbnQsIG5ld0RvY3VtZW50KSB7XG4gICAgICAgIC8vIHBhc3NcbiAgICAgIH1cblxuICAgICAgLypcbiAgICAgICogd2ViIGNvbXBvbmVudHMgc3RhbmRhcmQgQVBJXG4gICAgICAqIGNvbm5lY3RlZENhbGxiYWNrIGlzIGZpcmVkIGZyb20gY2hpbGRyZW4gdG8gcGFyZW50IGluIHNoYWRvdyBET01cbiAgICAgICogYnV0IHRoZSBvcmRlciBpcyBsZXNzIHByZWRpY3RhYmxlIGluIGxpZ2h0IERPTS5cbiAgICAgICogU2hvdWxkIG5vdCByZWFkIGxpZ2h0L3NoYWRvd0RvbURidWlDaGlsZHJlbiBoZXJlLlxuICAgICAgKiBJcyBjYWxsZWQgYWZ0ZXIgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrLlxuICAgICAgKiAqL1xuICAgICAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIC8vIFVzaW5nIHRoaXMgcGF0dGVybiBhcyBpdCBzZWVtcyB0aGF0IHRoZSBjb21wb25lbnRcbiAgICAgICAgLy8gaXMgaW1tdW5lIHRvIG92ZXJyaWRpbmcgY29ubmVjdGVkQ2FsbGJhY2sgYXQgcnVudGltZS5cbiAgICAgICAgLy8gTW9zdCBwcm9iYWJseSB0aGUgYnJvd3NlciBrZWVwcyBhIHJlZmVyZW5jZSB0byBjb25uZWN0ZWRDYWxsYmFja1xuICAgICAgICAvLyBleGlzdGluZy9kZWZpbmVkIGF0IHRoZSB0aW1lIG9mIHVwZ3JhZGluZyBhbmQgY2FsbHMgdGhhdCBvbmUgaW5zdGVhZCBvZiB0aGVcbiAgICAgICAgLy8gbGF0ZXN0IChtb25rZXkgcGF0Y2hlZCAvIHJ1bnRpbWUgZXZhbHVhdGVkKSBvbmUuXG4gICAgICAgIC8vIE5vdywgd2UgY2FuIG1vbmtleSBwYXRjaCBvbkNvbm5lY3RlZENhbGxiYWNrIGlmIHdlIHdhbnQuXG4gICAgICAgIHRoaXMuX29uQ29ubmVjdGVkQ2FsbGJhY2soKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgICBfb25Db25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgICAgdGhpcy5faXNNb3VudGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5faXNEaXNjb25uZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgd2luLmFkZEV2ZW50TGlzdGVuZXIoJ2JlZm9yZXVubG9hZCcsIHRoaXMuZGlzY29ubmVjdGVkQ2FsbGJhY2ssIGZhbHNlKTtcbiAgICAgICAgY29uc3QgeyBwcm9wZXJ0aWVzVG9VcGdyYWRlLCBhdHRyaWJ1dGVzVG9EZWZpbmUgfSA9IHRoaXMuY29uc3RydWN0b3I7XG4gICAgICAgIHByb3BlcnRpZXNUb1VwZ3JhZGUuZm9yRWFjaCgocHJvcGVydHkpID0+IHtcbiAgICAgICAgICB0aGlzLl91cGdyYWRlUHJvcGVydHkocHJvcGVydHkpO1xuICAgICAgICB9KTtcbiAgICAgICAgT2JqZWN0LmtleXMoYXR0cmlidXRlc1RvRGVmaW5lKS5mb3JFYWNoKChwcm9wZXJ0eSkgPT4ge1xuICAgICAgICAgIHRoaXMuX2RlZmluZUF0dHJpYnV0ZShwcm9wZXJ0eSwgYXR0cmlidXRlc1RvRGVmaW5lW3Byb3BlcnR5XSk7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBXZSBjYW4gc2FmZWx5IHJlZ2lzdGVyIHRvIGNsb3Nlc3REYnVpUGFyZW50IGJlY2F1c2UgaXQgZXhpc3RzIGF0IHRoaXMgdGltZVxuICAgICAgICAvLyBidXQgd2UgbXVzdCBub3QgYXNzdW1lIGl0IHdhcyBjb25uZWN0ZWQuXG4gICAgICAgIC8vIE5PVEU6IGV2ZW4gaWYgY2xvc2VzdERidWlQYXJlbnQgKG9yIGFueSBhbmNlc3RvcikgaXMgbm90IGNvbm5lY3RlZFxuICAgICAgICAvLyB0aGUgdG9wIG9mIHRoZSB0cmVlICh0b3BEYnVpQW5jZXN0b3IpIGNhbiBiZSByZWFjaGVkIGlmIG5lZWRlZFxuICAgICAgICB0aGlzLl9yZWdpc3RlclNlbGZUb0Nsb3Nlc3REYnVpUGFyZW50KCk7XG4gICAgICAgIHRoaXMuX2NoZWNrQ29udGV4dCgpOyAvLyBpcyBpZ25vcmVkIGJ5IHRvcCBtb3N0IGRidWkgYW5jZXN0b3JzXG4gICAgICAgIC8vIG1ha2VzIHRvcCBtb3N0IGFuY2VzdG9ycyBvciBkYnVpIGNvbXBvbmVudHMgaGF2aW5nIGxvY2FsZVRhcmdldCBzcGVjaWZpZWRcbiAgICAgICAgLy8gdG8gc2V0IGRidWlEaXIvTG9jYWxlIG9uIGNvbnRleHRcbiAgICAgICAgdGhpcy5fc3luY0xvY2FsZUFuZE1vbml0b3JDaGFuZ2VzKCk7XG4gICAgICAgIC8vIENhbGwgcHVibGljIGhvb2suXG4gICAgICAgIHRoaXMub25Db25uZWN0ZWRDYWxsYmFjaygpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIFB1YmxpYyBob29rLlxuICAgICAgICovXG4gICAgICBvbkNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgICAvLyBwYXNzXG4gICAgICB9XG5cbiAgICAgIC8vIHdlYiBjb21wb25lbnRzIHN0YW5kYXJkIEFQSVxuICAgICAgZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHRoaXMuX29uRGlzY29ubmVjdGVkQ2FsbGJhY2soKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgICBfb25EaXNjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgICAgdGhpcy5fcmVzZXRDb250ZXh0KCk7XG4gICAgICAgIHRoaXMuX3Jlc2V0UHJvdmlkZWRMb2NhbGUoKTtcbiAgICAgICAgdGhpcy5fdW5yZWdpc3RlclNlbGZGcm9tQ2xvc2VzdERidWlQYXJlbnQoKTtcbiAgICAgICAgd2luLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2JlZm9yZXVubG9hZCcsIHRoaXMuZGlzY29ubmVjdGVkQ2FsbGJhY2ssIGZhbHNlKTtcbiAgICAgICAgdGhpcy5faXNNb3VudGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2lzRGlzY29ubmVjdGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fY2xvc2VzdERidWlQYXJlbnQgPSBudWxsO1xuICAgICAgICAvLyBDYWxsIHB1YmxpYyBob29rLlxuICAgICAgICB0aGlzLm9uRGlzY29ubmVjdGVkQ2FsbGJhY2soKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBQdWJsaWMgaG9vay5cbiAgICAgICAqL1xuICAgICAgb25EaXNjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgICAgLy8gcGFzc1xuICAgICAgfVxuXG4gICAgICBjbG9uZU5vZGVEZWVwKHsgaWRQcmVmaXggPSAnJywgaWRTdWZmaXggPSAnJyB9KSB7XG4gICAgICAgIGNvbnN0IGNsb25lID0gc3VwZXIuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICBpZiAoIWlkUHJlZml4ICYmICFpZFN1ZmZpeCkgcmV0dXJuIGNsb25lO1xuICAgICAgICBpZiAoY2xvbmUuaGFzQXR0cmlidXRlKCdpZCcpKSB7XG4gICAgICAgICAgY2xvbmUuc2V0QXR0cmlidXRlKCdpZCcsIGAke2lkUHJlZml4fSR7Y2xvbmUuZ2V0QXR0cmlidXRlKCdpZCcpfSR7aWRTdWZmaXh9YCk7XG4gICAgICAgIH1cbiAgICAgICAgY2xvbmUucXVlcnlTZWxlY3RvckFsbCgnW2RidWktd2ViLWNvbXBvbmVudF0nKS5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgICAgICAgIGlmIChjaGlsZC5oYXNBdHRyaWJ1dGUoJ2lkJykpIHtcbiAgICAgICAgICAgIGNoaWxkLnNldEF0dHJpYnV0ZSgnaWQnLCBgJHtpZFByZWZpeH0ke2NoaWxkLmdldEF0dHJpYnV0ZSgnaWQnKX0ke2lkU3VmZml4fWApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBjbG9uZTtcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0gbmFtZSBTdHJpbmdcbiAgICAgICAqIEBwYXJhbSBvbGRWYWx1ZSBTdHJpbmdcbiAgICAgICAqIEBwYXJhbSBuZXdWYWx1ZSBTdHJpbmdcbiAgICAgICAqL1xuICAgICAgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSkge1xuICAgICAgICAvLyB3ZWIgY29tcG9uZW50cyBzdGFuZGFyZCBBUElcbiAgICAgICAgLy8gU2NlbmFyaW8gMTogY29tcG9uZW50IHdhcyBjcmVhdGVkIGluIGRldGFjaGVkIHRyZWUgQkVGT1JFIGJlaW5nIGRlZmluZWQuXG4gICAgICAgIC8vIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayB3aWxsIG5vdCBiZSBjYWxsZWQgd2hlbiBiZWluZyBkZWZpbmVkIGJ1dCB3aGVuIGluc2VydGVkIGludG8gRE9NLlxuICAgICAgICAvLyAodGhpcyBpbXBsaWVzIGNvbXBvbmVudCBpcyB1cGdyYWRlZCBhZnRlciBiZWluZyBpbnNlcnRlZCBpbnRvIERPTSkuXG4gICAgICAgIC8vIFNjZW5hcmlvIDI6IGNvbXBvbmVudCBpcyBjcmVhdGVkIGluIGRldGFjaGVkIHRyZWUgQUZURVIgYmVpbmcgZGVmaW5lZC5cbiAgICAgICAgLy8gYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIHJpZ2h0IGF3YXlcbiAgICAgICAgLy8gKHRoaXMgaW1wbGllcyBjb21wb25lbnQgaXMgdXBncmFkZWQgYmVmb3JlIGJlaW5nIGluc2VydGVkIGludG8gRE9NKS5cbiAgICAgICAgLy8gV2hlbiBpbnNlcnRlZCBpbiBET00gdGhlbiBjb25uZWN0ZWRDYWxsYmFjayB3aWxsIGJlIGNhbGxlZC5cbiAgICAgICAgLy8gSW4gYW55IGNhc2UgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrIGlzIGNhbGxlZCBiZWZvcmUgY29ubmVjdGVkQ2FsbGJhY2suXG4gICAgICAgIC8vIFRoaW5ncyBjaGFuZ2VkIGFzIGEgcmVzdWx0IG9mIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayBzaG91bGQgYmUgcHJlc2VydmVkXG4gICAgICAgIC8vIHdoZW4gZGlzY29ubmVjdGVkQ2FsbGJhY2sgYmVjYXVzZSB0aGVzZSBhdHRyaWJ1dGUgY2hhbmdlcyB3aWxsIG5vdCBiZSBmaXJlZCBhZ2FpblxuICAgICAgICAvLyB3aGVuIG5vZGUgaXMgcmVtb3ZlZCB0aGVuIHJlLWluc2VydGVkIGJhY2sgaW4gdGhlIERPTSB0cmVlLlxuICAgICAgICBpZiAodGhpcy5nZXRBdHRyaWJ1dGUobmFtZSkgPT09IG9sZFZhbHVlKSByZXR1cm47XG4gICAgICAgIHRoaXMuX29uQXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSBuYW1lIFN0cmluZ1xuICAgICAgICogQHBhcmFtIG9sZFZhbHVlIFN0cmluZ1xuICAgICAgICogQHBhcmFtIG5ld1ZhbHVlIFN0cmluZ1xuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgX29uQXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSkge1xuICAgICAgICB0aGlzLl9vbkxvY2FsZUF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpO1xuICAgICAgICAvLyBDYWxsIHB1YmxpYyBob29rLlxuICAgICAgICB0aGlzLm9uQXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogUHVibGljIGhvb2suXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIG5hbWUgU3RyaW5nXG4gICAgICAgKiBAcGFyYW0gb2xkVmFsdWUgU3RyaW5nXG4gICAgICAgKiBAcGFyYW0gbmV3VmFsdWUgU3RyaW5nXG4gICAgICAgKi9cbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgICAgb25BdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlKSB7XG4gICAgICAgIC8vIHBhc3NcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ga2xhc3MgQ2xhc3NcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzKGtsYXNzKSB7XG4gICAgICBjb25zdCB0ZW1wbGF0ZUlubmVySFRNTCA9IGtsYXNzLnRlbXBsYXRlSW5uZXJIVE1MO1xuICAgICAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAgICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gdGVtcGxhdGVJbm5lckhUTUw7XG5cbiAgICAgIC8qKlxuICAgICAgICogQHByb3BlcnR5IHRlbXBsYXRlIChnZXR0ZXIpIHRlbXBsYXRlIGVsZW1lbnRcbiAgICAgICAqL1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGtsYXNzLCAndGVtcGxhdGUnLCB7XG4gICAgICAgIGdldCgpIHsgcmV0dXJuIHRlbXBsYXRlOyB9LFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9KTtcblxuICAgICAgLyoqXG4gICAgICAgKiBAcHJvcGVydHkgY29tcG9uZW50U3R5bGUgKGdldHRlci9zZXR0ZXIpIFN0cmluZ1xuICAgICAgICovXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoa2xhc3MsICdjb21wb25lbnRTdHlsZScsIHtcbiAgICAgICAgZ2V0KCkge1xuICAgICAgICAgIHJldHVybiBrbGFzcy50ZW1wbGF0ZS5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ3N0eWxlJykuaW5uZXJIVE1MO1xuICAgICAgICB9LFxuICAgICAgICBzZXQodmFsdWUpIHtcbiAgICAgICAgICBrbGFzcy50ZW1wbGF0ZS5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ3N0eWxlJykuaW5uZXJIVE1MID0gdmFsdWU7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4ga2xhc3M7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gUmVnaXN0ZXJhYmxlKGtsYXNzKSB7XG4gICAgICBrbGFzcy5yZWdpc3RlclNlbGYgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlZ2lzdHJhdGlvbk5hbWUgPSBrbGFzcy5yZWdpc3RyYXRpb25OYW1lO1xuICAgICAgICBjb25zdCBkZXBlbmRlbmNpZXMgPSBrbGFzcy5kZXBlbmRlbmNpZXM7XG4gICAgICAgIC8vIE1ha2Ugc3VyZSBvdXIgZGVwZW5kZW5jaWVzIGFyZSByZWdpc3RlcmVkIGJlZm9yZSB3ZSByZWdpc3RlciBzZWxmXG4gICAgICAgIGRlcGVuZGVuY2llcy5mb3JFYWNoKChkZXBlbmRlbmN5KSA9PiBkZXBlbmRlbmN5LnJlZ2lzdGVyU2VsZigpKTtcbiAgICAgICAgLy8gRG9uJ3QgdHJ5IHRvIHJlZ2lzdGVyIHNlbGYgaWYgYWxyZWFkeSByZWdpc3RlcmVkXG4gICAgICAgIGlmIChjdXN0b21FbGVtZW50cy5nZXQocmVnaXN0cmF0aW9uTmFtZSkpIHJldHVybiByZWdpc3RyYXRpb25OYW1lO1xuICAgICAgICAvLyBHaXZlIGEgY2hhbmNlIHRvIG92ZXJyaWRlIHdlYi1jb21wb25lbnQgc3R5bGUgaWYgcHJvdmlkZWQgYmVmb3JlIGJlaW5nIHJlZ2lzdGVyZWQuXG4gICAgICAgIGNvbnN0IGNvbXBvbmVudFN0eWxlID0gKCh3aW4uREJVSVdlYkNvbXBvbmVudHMgfHwge30pW3JlZ2lzdHJhdGlvbk5hbWVdIHx8IHt9KS5jb21wb25lbnRTdHlsZTtcbiAgICAgICAgaWYgKGNvbXBvbmVudFN0eWxlKSB7XG4gICAgICAgICAga2xhc3MuY29tcG9uZW50U3R5bGUgKz0gJ1xcblxcbi8qID09PT0gb3ZlcnJpZGVzID09PT0gKi9cXG5cXG4nO1xuICAgICAgICAgIGtsYXNzLmNvbXBvbmVudFN0eWxlICs9IGNvbXBvbmVudFN0eWxlO1xuICAgICAgICB9XG4gICAgICAgIC8vIERvIHJlZ2lzdHJhdGlvblxuICAgICAgICAvLyBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9jdXN0b20tZWxlbWVudHMuaHRtbCNjb25jZXB0LXVwZ3JhZGUtYW4tZWxlbWVudFxuICAgICAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUocmVnaXN0cmF0aW9uTmFtZSwga2xhc3MpO1xuICAgICAgICByZXR1cm4gcmVnaXN0cmF0aW9uTmFtZTtcbiAgICAgIH07XG5cbiAgICAgIC8qKlxuICAgICAgICogQHByb3BlcnR5IHByb3RvdHlwZUNoYWluSW5mbyAoZ2V0dGVyKSBBcnJheTxQcm90b3R5cGU+XG4gICAgICAgKi9cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShrbGFzcywgJ3Byb3RvdHlwZUNoYWluSW5mbycsIHtcbiAgICAgICAgZ2V0KCkge1xuICAgICAgICAgIGNvbnN0IGNoYWluID0gW2tsYXNzXTtcbiAgICAgICAgICBsZXQgcGFyZW50UHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yoa2xhc3MpO1xuICAgICAgICAgIHdoaWxlIChwYXJlbnRQcm90byAhPT0gSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgIGNoYWluLnB1c2gocGFyZW50UHJvdG8pO1xuICAgICAgICAgICAgcGFyZW50UHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YocGFyZW50UHJvdG8pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjaGFpbi5wdXNoKHBhcmVudFByb3RvKTtcbiAgICAgICAgICByZXR1cm4gY2hhaW47XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4ga2xhc3M7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIERCVUlXZWJDb21wb25lbnRCYXNlLFxuICAgICAgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyxcbiAgICAgIFJlZ2lzdGVyYWJsZVxuICAgIH07XG4gIH0pO1xufVxuIiwiXG5pbXBvcnQgZ2V0REJVSVdlYkNvbXBvbmVudENvcmUgZnJvbSAnLi4vREJVSVdlYkNvbXBvbmVudENvcmUvREJVSVdlYkNvbXBvbmVudENvcmUnO1xuaW1wb3J0IGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbiBmcm9tICcuLi8uLi8uLi9pbnRlcm5hbHMvZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uJztcblxuY29uc3QgcmVnaXN0cmF0aW9uTmFtZSA9ICdkYnVpLXdlYi1jb21wb25lbnQtZHVtbXknO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXREQlVJV2ViQ29tcG9uZW50RHVtbXkod2luKSB7XG4gIHJldHVybiBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24od2luLCByZWdpc3RyYXRpb25OYW1lLCAoKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgREJVSVdlYkNvbXBvbmVudEJhc2UsXG4gICAgICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzLFxuICAgICAgUmVnaXN0ZXJhYmxlXG4gICAgfSA9IGdldERCVUlXZWJDb21wb25lbnRDb3JlKHdpbik7XG5cbiAgICBjbGFzcyBEQlVJV2ViQ29tcG9uZW50RHVtbXkgZXh0ZW5kcyBEQlVJV2ViQ29tcG9uZW50QmFzZSB7XG5cbiAgICAgIHN0YXRpYyBnZXQgcmVnaXN0cmF0aW9uTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHJlZ2lzdHJhdGlvbk5hbWU7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgdGVtcGxhdGVJbm5lckhUTUwoKSB7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgICAgPHN0eWxlPlxuICAgICAgICAgIDpob3N0IHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgbWF4LXdpZHRoOiA0MDBweDtcbiAgICAgICAgICAgIGhlaWdodDogdmFyKC0tZGJ1aS1pbnB1dC1oZWlnaHQsIDUwcHgpO1xuICAgICAgICAgICAgY29sb3I6IG1hcm9vbjtcbiAgICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIGdyYXk7XG4gICAgICAgICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICA6aG9zdCBiLCA6aG9zdCBkaXZbeC1oYXMtc2xvdF0gc3Bhblt4LXNsb3Qtd3JhcHBlcl0ge1xuICAgICAgICAgICAgdW5pY29kZS1iaWRpOiBiaWRpLW92ZXJyaWRlO1xuICAgICAgICAgICAgdGV4dC1zaGFkb3c6IHZhcigtLWR1bW15LWItdGV4dC1zaGFkb3csIG5vbmUpO1xuICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICA6aG9zdChbZGlyPXJ0bF0pIGIge1xuICAgICAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIDpob3N0KFtkaXI9bHRyXSkgYiB7XG4gICAgICAgICAgICB0ZXh0LWRlY29yYXRpb246IG92ZXJsaW5lO1xuICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICA6aG9zdChbZGlyPWx0cl0pICNjb250YWluZXIgPiBkaXZbZGlyPXJ0bF0sXG4gICAgICAgICAgOmhvc3QoW2Rpcj1ydGxdKSAjY29udGFpbmVyID4gZGl2W2Rpcj1sdHJdIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIDpob3N0ICNjb250YWluZXIgPiBkaXZbeC1oYXMtc2xvdF0ge1xuICAgICAgICAgICAgbWFyZ2luLWxlZnQ6IDBweDtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgI2NvbnRhaW5lciB7XG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgIGhlaWdodDogMTAwJTtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBmbGV4LWZsb3c6IHJvdyBub3dyYXA7XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogc3RyZXRjaDtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgI2NvbnRhaW5lciA+IGRpdiB7XG4gICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCBncmF5O1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogdmFyKC0tZHVtbXktaW5uZXItc2VjdGlvbnMtYm9yZGVyLXJhZGl1cywgMHB4KTtcbiAgICAgICAgICAgIGZsZXg6IDEgMCAwJTtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBtYXJnaW46IDVweDtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgI2NvbnRhaW5lciA+IGRpdiA+IGRpdiB7XG4gICAgICAgICAgICBtYXJnaW46IGF1dG87XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIDwvc3R5bGU+XG4gICAgICAgICAgXG4gICAgICAgICAgPGRpdiBpZD1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgPGRpdiBkaXI9XCJsdHJcIj5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8Yj5EdW1teSBzaGFkb3c8L2I+IFtMVFJdXG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIDxkaXYgeC1oYXMtc2xvdD5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8c3Bhbj5bPC9zcGFuPjxzcGFuIHgtc2xvdC13cmFwcGVyPjxzbG90Pjwvc2xvdD48L3NwYW4+PHNwYW4+XTwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgPGRpdiBkaXI9XCJydGxcIj5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8Yj5EdW1teSBzaGFkb3c8L2I+IFtSVExdXG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIGA7XG4gICAgICB9XG5cbiAgICAgIG9uTG9jYWxlQ2hhbmdlKGxvY2FsZSkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnb25Mb2NhbGVDaGFuZ2UnLCBsb2NhbGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBSZWdpc3RlcmFibGUoXG4gICAgICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzKFxuICAgICAgICBEQlVJV2ViQ29tcG9uZW50RHVtbXlcbiAgICAgIClcbiAgICApO1xuICB9KTtcbn1cblxuZ2V0REJVSVdlYkNvbXBvbmVudER1bW15LnJlZ2lzdHJhdGlvbk5hbWUgPSByZWdpc3RyYXRpb25OYW1lO1xuXG4iLCJcblxuaW1wb3J0IGdldERCVUlXZWJDb21wb25lbnRDb3JlIGZyb20gJy4uL0RCVUlXZWJDb21wb25lbnRDb3JlL0RCVUlXZWJDb21wb25lbnRDb3JlJztcbmltcG9ydCBnZXREQlVJV2ViQ29tcG9uZW50RHVtbXkgZnJvbSAnLi4vREJVSVdlYkNvbXBvbmVudER1bW15L0RCVUlXZWJDb21wb25lbnREdW1teSc7XG5pbXBvcnQgZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uIGZyb20gJy4uLy4uLy4uL2ludGVybmFscy9lbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24nO1xuXG5jb25zdCByZWdpc3RyYXRpb25OYW1lID0gJ2RidWktd2ViLWNvbXBvbmVudC1kdW1teS1wYXJlbnQnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXREQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQod2luKSB7XG4gIHJldHVybiBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24od2luLCByZWdpc3RyYXRpb25OYW1lLCAoKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgREJVSVdlYkNvbXBvbmVudEJhc2UsXG4gICAgICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzLFxuICAgICAgUmVnaXN0ZXJhYmxlXG4gICAgfSA9IGdldERCVUlXZWJDb21wb25lbnRDb3JlKHdpbik7XG4gICAgY29uc3QgREJVSVdlYkNvbXBvbmVudER1bW15ID0gZ2V0REJVSVdlYkNvbXBvbmVudER1bW15KHdpbik7XG5cbiAgICBjbGFzcyBEQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQgZXh0ZW5kcyBEQlVJV2ViQ29tcG9uZW50QmFzZSB7XG5cbiAgICAgIHN0YXRpYyBnZXQgcmVnaXN0cmF0aW9uTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHJlZ2lzdHJhdGlvbk5hbWU7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgdGVtcGxhdGVJbm5lckhUTUwoKSB7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgICAgPHN0eWxlPlxuICAgICAgICAgIDpob3N0IHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgbWF4LXdpZHRoOiA0MDBweDtcbiAgICAgICAgICB9XG4gICAgICAgICAgPC9zdHlsZT5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPGI+RHVtbXkgUGFyZW50IHNoYWRvdzwvYj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPGRidWktd2ViLWNvbXBvbmVudC1kdW1teT48c2xvdD48L3Nsb3Q+PC9kYnVpLXdlYi1jb21wb25lbnQtZHVtbXk+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCBkZXBlbmRlbmNpZXMoKSB7XG4gICAgICAgIHJldHVybiBbREJVSVdlYkNvbXBvbmVudER1bW15XTtcbiAgICAgIH1cblxuICAgIH1cblxuICAgIHJldHVybiBSZWdpc3RlcmFibGUoXG4gICAgICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzKFxuICAgICAgICBEQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnRcbiAgICAgIClcbiAgICApO1xuICB9KTtcbn1cblxuZ2V0REJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50LnJlZ2lzdHJhdGlvbk5hbWUgPSByZWdpc3RyYXRpb25OYW1lO1xuXG4iLCJcbmltcG9ydCBnZXREQlVJV2ViQ29tcG9uZW50Q29yZSBmcm9tICcuLi9EQlVJV2ViQ29tcG9uZW50Q29yZS9EQlVJV2ViQ29tcG9uZW50Q29yZSc7XG5pbXBvcnQgZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uIGZyb20gJy4uLy4uLy4uL2ludGVybmFscy9lbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24nO1xuaW1wb3J0IEZvY3VzYWJsZSBmcm9tICcuLi8uLi9iZWhhdmlvdXJzL0ZvY3VzYWJsZSc7XG5cbmNvbnN0IHJlZ2lzdHJhdGlvbk5hbWUgPSAnZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtdGV4dCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldERCVUlXZWJDb21wb25lbnRGb3JtSW5wdXRUZXh0KHdpbikge1xuICByZXR1cm4gZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uKHdpbiwgcmVnaXN0cmF0aW9uTmFtZSwgKCkgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIERCVUlXZWJDb21wb25lbnRCYXNlLFxuICAgICAgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyxcbiAgICAgIFJlZ2lzdGVyYWJsZVxuICAgIH0gPSBnZXREQlVJV2ViQ29tcG9uZW50Q29yZSh3aW4pO1xuXG4gICAgY2xhc3MgREJVSVdlYkNvbXBvbmVudEZvcm1JbnB1dFRleHQgZXh0ZW5kcyBEQlVJV2ViQ29tcG9uZW50QmFzZSB7XG5cbiAgICAgIHN0YXRpYyBnZXQgcmVnaXN0cmF0aW9uTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHJlZ2lzdHJhdGlvbk5hbWU7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgdGVtcGxhdGVJbm5lckhUTUwoKSB7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgICAgPHN0eWxlPlxuICAgICAgICAgIDpob3N0IHtcbiAgICAgICAgICAgIGFsbDogaW5pdGlhbDsgXG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgIC8qaGVpZ2h0OiB2YXIoLS1kYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC1oZWlnaHQpOyovXG4gICAgICAgICAgICAvKmxpbmUtaGVpZ2h0OiB2YXIoLS1kYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC1oZWlnaHQpOyovXG4gICAgICAgICAgICBoZWlnaHQ6IDMwMHB4O1xuICAgICAgICAgICAgcGFkZGluZzogMHB4O1xuICAgICAgICAgICAgZm9udC1zaXplOiAxOHB4O1xuICAgICAgICAgICAgY29sb3I6IHZhcigtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWNvbG9yKTtcbiAgICAgICAgICAgIC8qYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtYmFja2dyb3VuZC1jb2xvcik7Ki9cbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAxMDAsIDAsIDAuMSk7XG4gICAgICAgICAgICB1bmljb2RlLWJpZGk6IGJpZGktb3ZlcnJpZGU7XG4gICAgICAgICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgICAgICAgICAgYm9yZGVyOiBub25lO1xuICAgICAgICAgICAgYm9yZGVyLWJvdHRvbTogdmFyKC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtYm9yZGVyLXdpZHRoKSB2YXIoLS1kYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC1ib3JkZXItc3R5bGUpIHZhcigtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWJvcmRlci1jb2xvcik7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIDpob3N0IFt0YWJpbmRleF0ge1xuICAgICAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgICAgICBoZWlnaHQ6IDUwcHg7XG4gICAgICAgICAgICBsaW5lLWhlaWdodDogNTBweDtcbiAgICAgICAgICAgIGJvcmRlcjogbm9uZTtcbiAgICAgICAgICAgIG1hcmdpbjogMHB4O1xuICAgICAgICAgICAgcGFkZGluZzogMHB4O1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiAwcHg7XG4gICAgICAgICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgICAgICAgICAgdW5pY29kZS1iaWRpOiBiaWRpLW92ZXJyaWRlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICA6aG9zdCBbdGFiaW5kZXhdOmZvY3VzIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAwLCAwLCAuMyk7XG4gICAgICAgICAgICBvdXRsaW5lOiBub25lO1xuICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICA6aG9zdChbZm9jdXNlZF0pIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMjU1LCAwLCAuMyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIC8qOmhvc3QoW2Rpc2FibGVkXSkgeyovXG4gICAgICAgICAgICAvKmJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgLjMpOyovXG4gICAgICAgICAgLyp9Ki9cbiAgICBcbiAgICAgICAgICA6aG9zdChbaGlkZGVuXSkge1xuICAgICAgICAgICAgZGlzcGxheTogbm9uZTtcbiAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgOmhvc3QoW2Rpcj1ydGxdKSB7XG4gICAgICAgICAgXG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIDpob3N0KFtkaXI9bHRyXSkge1xuICAgICAgICAgIFxuICAgICAgICAgIH1cbiAgICAgICAgICA8L3N0eWxlPlxuICAgICAgICAgIDxwPkRCVUlXZWJDb21wb25lbnRGb3JtSW5wdXRUZXh0PC9wPlxuICAgICAgICAgIDxkaXYgY29udGVudGVkaXRhYmxlPVwidHJ1ZVwiIHRhYmluZGV4PVwiMFwiPjwvZGl2PlxuICAgICAgICAgIDxkaXYgY29udGVudGVkaXRhYmxlPVwidHJ1ZVwiIHRhYmluZGV4PVwiMFwiPjwvZGl2PlxuICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIHRhYmluZGV4PVwiMFwiIC8+XG4gICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgdGFiaW5kZXg9XCIwXCIgLz5cbiAgICAgICAgYDtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCBhdHRyaWJ1dGVzVG9EZWZpbmUoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgcm9sZTogJ2Zvcm0taW5wdXQnXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIG9uTG9jYWxlQ2hhbmdlKGxvY2FsZSkge1xuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgIC8qIGVzbGludCBuby1jb25zb2xlOiAwICovXG4gICAgICAgICAgLy8gY29uc29sZS5sb2coJ29uTG9jYWxlQ2hhbmdlJywgbG9jYWxlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgfVxuXG4gICAgcmV0dXJuIFJlZ2lzdGVyYWJsZShcbiAgICAgIEZvY3VzYWJsZShcbiAgICAgICAgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyhcbiAgICAgICAgICBEQlVJV2ViQ29tcG9uZW50Rm9ybUlucHV0VGV4dFxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcblxuICB9KTtcbn1cblxuZ2V0REJVSVdlYkNvbXBvbmVudEZvcm1JbnB1dFRleHQucmVnaXN0cmF0aW9uTmFtZSA9IHJlZ2lzdHJhdGlvbk5hbWU7XG5cbiIsIlxuaW1wb3J0IGdldERCVUlXZWJDb21wb25lbnRDb3JlIGZyb20gJy4uL0RCVUlXZWJDb21wb25lbnRDb3JlL0RCVUlXZWJDb21wb25lbnRDb3JlJztcbmltcG9ydCBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24gZnJvbSAnLi4vLi4vLi4vaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbic7XG5cbmNvbnN0IHJlZ2lzdHJhdGlvbk5hbWUgPSAnZGJ1aS13ZWItY29tcG9uZW50LWljb24nO1xuXG4vLyBodHRwczovL2dpdGh1Yi5jb20vZ29yYW5nYWppYy9yZWFjdC1pY29uLWJhc2UvYmxvYi9tYXN0ZXIvaW5kZXguanNcbi8vIGh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9nb3JhbmdhamljL3JlYWN0LWljb25zL21hc3Rlci9pY29ucy9nby9tYXJrLWdpdGh1Yi5zdmdcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9nb3JhbmdhamljL3JlYWN0LWljb25zXG4vLyBodHRwczovL2dpdGh1Yi5jb20vZ29yYW5nYWppYy9yZWFjdC1pY29ucy9ibG9iL21hc3Rlci9nby9tYXJrLWdpdGh1Yi5qc1xuLy8gaHR0cHM6Ly9nb3JhbmdhamljLmdpdGh1Yi5pby9yZWFjdC1pY29ucy9nby5odG1sXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldERCVUlXZWJDb21wb25lbnRJY29uKHdpbikge1xuICByZXR1cm4gZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uKHdpbiwgcmVnaXN0cmF0aW9uTmFtZSwgKCkgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIERCVUlXZWJDb21wb25lbnRCYXNlLFxuICAgICAgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyxcbiAgICAgIFJlZ2lzdGVyYWJsZVxuICAgIH0gPSBnZXREQlVJV2ViQ29tcG9uZW50Q29yZSh3aW4pO1xuXG4gICAgY2xhc3MgREJVSVdlYkNvbXBvbmVudEljb24gZXh0ZW5kcyBEQlVJV2ViQ29tcG9uZW50QmFzZSB7XG5cbiAgICAgIHN0YXRpYyBnZXQgcmVnaXN0cmF0aW9uTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHJlZ2lzdHJhdGlvbk5hbWU7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgdGVtcGxhdGVJbm5lckhUTUwoKSB7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgICAgPHN0eWxlPlxuICAgICAgICAgIDpob3N0IHtcbiAgICAgICAgICAgIGFsbDogaW5pdGlhbDtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogaW5oZXJpdDsgXG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICAgICAgICB3aWR0aDogMWVtO1xuICAgICAgICAgICAgaGVpZ2h0OiAxZW07XG4gICAgICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuICAgICAgICAgICAgY29sb3I6IGluaGVyaXQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIDpob3N0IHN2ZyB7XG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICAgICAgICB3aWR0aDogMWVtO1xuICAgICAgICAgICAgaGVpZ2h0OiAxZW07XG4gICAgICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogdG9wO1xuICAgICAgICAgICAgZmlsbDogY3VycmVudENvbG9yO1xuICAgICAgICAgIH1cbiAgICAgICAgICA8L3N0eWxlPlxuICAgICAgICAgIDxzdmcgdmlld0JveD1cIjAgMCA0MCA0MFwiICBwcmVzZXJ2ZUFzcGVjdFJhdGlvPVwieE1pZFlNaWQgbWVldFwiID5cbiAgICAgICAgICAgIDxnPjxwYXRoIGQ9XCJcIi8+PC9nPlxuICAgICAgICAgIDwvc3ZnPlxuICAgICAgICBgO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IHByb3BlcnRpZXNUb1VwZ3JhZGUoKSB7XG4gICAgICAgIGNvbnN0IGluaGVyaXRlZFByb3BlcnRpZXNUb1VwZ3JhZGUgPSBzdXBlci5wcm9wZXJ0aWVzVG9VcGdyYWRlIHx8IFtdO1xuICAgICAgICByZXR1cm4gWy4uLmluaGVyaXRlZFByb3BlcnRpZXNUb1VwZ3JhZGUsICdzaGFwZSddO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IG9ic2VydmVkQXR0cmlidXRlcygpIHtcbiAgICAgICAgY29uc3QgaW5oZXJpdGVkT2JzZXJ2ZWRBdHRyaWJ1dGVzID0gc3VwZXIub2JzZXJ2ZWRBdHRyaWJ1dGVzIHx8IFtdO1xuICAgICAgICByZXR1cm4gWy4uLmluaGVyaXRlZE9ic2VydmVkQXR0cmlidXRlcywgJ3NoYXBlJ107XG4gICAgICB9XG5cbiAgICAgIGdldCBzaGFwZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKCdzaGFwZScpO1xuICAgICAgfVxuXG4gICAgICBzZXQgc2hhcGUodmFsdWUpIHtcbiAgICAgICAgY29uc3QgaGFzVmFsdWUgPSAhW3VuZGVmaW5lZCwgbnVsbF0uaW5jbHVkZXModmFsdWUpO1xuICAgICAgICBjb25zdCBzdHJpbmdWYWx1ZSA9IFN0cmluZyh2YWx1ZSk7XG4gICAgICAgIGlmIChoYXNWYWx1ZSkge1xuICAgICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdzaGFwZScsIHN0cmluZ1ZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgnc2hhcGUnKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlKSB7XG4gICAgICAgIHN1cGVyLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayAmJlxuICAgICAgICAgIHN1cGVyLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpO1xuXG4gICAgICAgIGNvbnN0IGhhc1ZhbHVlID0gIVt1bmRlZmluZWQsIG51bGxdLmluY2x1ZGVzKG5ld1ZhbHVlKTtcbiAgICAgICAgaWYgKG5hbWUgPT09ICdzaGFwZScpIHtcbiAgICAgICAgICBoYXNWYWx1ZSA/IHRoaXMuX3NldFNoYXBlKCkgOiB0aGlzLl9yZW1vdmVTaGFwZSgpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIF9zZXRTaGFwZSgpIHtcbiAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMuc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yKCdzdmcgZyBwYXRoJyk7XG4gICAgICAgIHBhdGguc2V0QXR0cmlidXRlKCdkJywgdGhpcy5zaGFwZSk7XG4gICAgICB9XG5cbiAgICAgIF9yZW1vdmVTaGFwZSgpIHtcbiAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMuc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yKCdzdmcgZyBwYXRoJyk7XG4gICAgICAgIHBhdGguc2V0QXR0cmlidXRlKCdkJywgJycpO1xuICAgICAgfVxuXG4gICAgfVxuXG4gICAgcmV0dXJuIFJlZ2lzdGVyYWJsZShcbiAgICAgIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMoXG4gICAgICAgIERCVUlXZWJDb21wb25lbnRJY29uXG4gICAgICApXG4gICAgKTtcblxuICB9KTtcbn1cblxuZ2V0REJVSVdlYkNvbXBvbmVudEljb24ucmVnaXN0cmF0aW9uTmFtZSA9IHJlZ2lzdHJhdGlvbk5hbWU7XG5cbiIsImltcG9ydCBhcHBlbmRTdHlsZXMgZnJvbSAnLi4vLi4vaW50ZXJuYWxzL2FwcGVuZFN0eWxlcyc7XG5cbi8qKlxuKiBAcGFyYW0gY29tcG9uZW50cyBBcnJheTxPYmplY3Q+IFt7XG4qICByZWdpc3RyYXRpb25OYW1lLFxuKiAgY29tcG9uZW50U3R5bGUsXG4qICAuLi5cbiogfV1cbiogQHJldHVybnMgY29tcG9uZW50cyBBcnJheTxPYmplY3Q+XG4qL1xuY29uc3QgZGJ1aVdlYkNvbXBvbmVudHNTZXRVcCA9ICh3aW4pID0+IChjb21wb25lbnRzKSA9PiB7XG4gIHJldHVybiBhcHBlbmRTdHlsZXMod2luKShjb21wb25lbnRzKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGRidWlXZWJDb21wb25lbnRzU2V0VXA7XG4iLCJcbi8vIEhlbHBlcnNcbmltcG9ydCBkYnVpV2ViQ29tcG9uZW50c1NldFVwIGZyb20gJy4vd2ViLWNvbXBvbmVudHMvaGVscGVycy9kYnVpV2ViQ29tcG9uZW50c1NldHVwJztcblxuLy8gSW50ZXJuYWxzXG5pbXBvcnQgZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uIGZyb20gJy4vaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbic7XG5cbi8vIENvbXBvbmVudEJhc2VcbmltcG9ydCBnZXREQlVJV2ViQ29tcG9uZW50Q29yZSBmcm9tICcuL3dlYi1jb21wb25lbnRzL2NvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudENvcmUvREJVSVdlYkNvbXBvbmVudENvcmUnO1xuXG4vLyBCZWhhdmlvdXJzXG5pbXBvcnQgRm9jdXNhYmxlIGZyb20gJy4vd2ViLWNvbXBvbmVudHMvYmVoYXZpb3Vycy9Gb2N1c2FibGUnO1xuXG4vLyBTZXJ2aWNlc1xuaW1wb3J0IGdldERCVUlMb2NhbGVTZXJ2aWNlIGZyb20gJy4vc2VydmljZXMvREJVSUxvY2FsZVNlcnZpY2UnO1xuaW1wb3J0IGdldERCVUlJMThuU2VydmljZSBmcm9tICcuL3NlcnZpY2VzL0RCVUlJMThuU2VydmljZSc7XG5cbi8vIFV0aWxzXG5pbXBvcnQgZm9ybWF0dGVycyBmcm9tICcuL3V0aWxzL2Zvcm1hdHRlcnMnO1xuaW1wb3J0IHRyYWl0cyBmcm9tICcuL3V0aWxzL3RyYWl0cyc7XG5pbXBvcnQgdGVtcGxhdGUgZnJvbSAnLi91dGlscy90ZW1wbGF0ZSc7XG5pbXBvcnQgb25TY3JlZW5Db25zb2xlIGZyb20gJy4vdXRpbHMvb25TY3JlZW5Db25zb2xlJztcblxuLy8gQ29tcG9uZW50c1xuaW1wb3J0IGdldERCVUlXZWJDb21wb25lbnREdW1teSBmcm9tICcuL3dlYi1jb21wb25lbnRzL2NvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudER1bW15L0RCVUlXZWJDb21wb25lbnREdW1teSc7XG5pbXBvcnQgZ2V0REJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50IGZyb20gJy4vd2ViLWNvbXBvbmVudHMvY29tcG9uZW50cy9EQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQvREJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50JztcbmltcG9ydCBnZXREQlVJV2ViQ29tcG9uZW50Rm9ybUlucHV0VGV4dCBmcm9tICcuL3dlYi1jb21wb25lbnRzL2NvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudEZvcm1JbnB1dFRleHQvREJVSVdlYkNvbXBvbmVudEZvcm1JbnB1dFRleHQnO1xuaW1wb3J0IGdldERCVUlXZWJDb21wb25lbnRJY29uIGZyb20gJy4vd2ViLWNvbXBvbmVudHMvY29tcG9uZW50cy9EQlVJV2ViQ29tcG9uZW50SWNvbi9EQlVJV2ViQ29tcG9uZW50SWNvbic7XG5cbmNvbnN0IHJlZ2lzdHJhdGlvbnMgPSB7XG4gIFtnZXREQlVJV2ViQ29tcG9uZW50RHVtbXkucmVnaXN0cmF0aW9uTmFtZV06XG4gICAgZ2V0REJVSVdlYkNvbXBvbmVudER1bW15LFxuICBbZ2V0REJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50LnJlZ2lzdHJhdGlvbk5hbWVdOlxuICAgIGdldERCVUlXZWJDb21wb25lbnREdW1teVBhcmVudCxcbiAgW2dldERCVUlXZWJDb21wb25lbnRGb3JtSW5wdXRUZXh0LnJlZ2lzdHJhdGlvbk5hbWVdOlxuICAgIGdldERCVUlXZWJDb21wb25lbnRGb3JtSW5wdXRUZXh0LFxuICBbZ2V0REJVSVdlYkNvbXBvbmVudEljb24ucmVnaXN0cmF0aW9uTmFtZV06XG4gICAgZ2V0REJVSVdlYkNvbXBvbmVudEljb25cbn07XG5cbi8qXG5UaGlzIGhlbHBlciBmdW5jdGlvbiBpcyBqdXN0IGZvciBjb252ZW5pZW5jZS5cblVzaW5nIGl0IGltcGxpZXMgdGhhdCBlbnRpcmUgREJVSVdlYkNvbXBvbmVudHMgbGlicmFyeSBpcyBhbHJlYWR5IGxvYWRlZC5cbkl0IGlzIHVzZWZ1bCBlc3BlY2lhbGx5IHdoZW4gd29ya2luZyB3aXRoIGRpc3RyaWJ1dGlvbiBidWlsZC5cbklmIG9uZSB3YW50cyB0byBsb2FkIGp1c3Qgb25lIHdlYi1jb21wb25lbnQgb3IgYSBzdWJzZXQgb2YgY29yZVxudGhleSBzaG91bGQgYmUgbG9hZGVkIGZyb20gbm9kZV9tb2R1bGVzL2Rldi1ib3gtdWkvY29yZSBieSB0aGVpciBwYXRoXG5leDpcbmltcG9ydCBTb21lQ29tcG9uZW50TG9hZGVyIGZyb20gbm9kZV9tb2R1bGVzL2Rldi1ib3gtdWkvY29yZS9wYXRoL3RvL1NvbWVDb21wb25lbnQ7XG4qL1xuZnVuY3Rpb24gcXVpY2tTZXR1cEFuZExvYWQod2luID0gd2luZG93KSB7XG4gIC8qKlxuICAgKiBAcGFyYW0gY29tcG9uZW50cyBPYmplY3Qge1xuICAgKiAgcmVnaXN0cmF0aW9uTmFtZSxcbiAgICogIGNvbXBvbmVudFN0eWxlXG4gICAqIH1cbiAgICogQHJldHVybiBPYmplY3QgeyA8cmVnaXN0cmF0aW9uTmFtZT4sIDxjb21wb25lbnRDbGFzcz4gfVxuICAgKi9cbiAgcmV0dXJuIGZ1bmN0aW9uIChjb21wb25lbnRzKSB7XG4gICAgcmV0dXJuIGRidWlXZWJDb21wb25lbnRzU2V0VXAod2luKShjb21wb25lbnRzKVxuICAgICAgLnJlZHVjZSgoYWNjLCB7IHJlZ2lzdHJhdGlvbk5hbWUgfSkgPT4ge1xuICAgICAgICBjb25zdCBjb21wb25lbnRDbGFzcyA9IHJlZ2lzdHJhdGlvbnNbcmVnaXN0cmF0aW9uTmFtZV0od2luZG93KTtcbiAgICAgICAgY29tcG9uZW50Q2xhc3MucmVnaXN0ZXJTZWxmKCk7XG4gICAgICAgIGFjY1tyZWdpc3RyYXRpb25OYW1lXSA9IGNvbXBvbmVudENsYXNzO1xuICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgfSwge30pO1xuICB9O1xufVxuXG5leHBvcnQge1xuICByZWdpc3RyYXRpb25zLFxuXG4gIC8vIEhlbHBlcnNcbiAgcXVpY2tTZXR1cEFuZExvYWQsXG4gIGRidWlXZWJDb21wb25lbnRzU2V0VXAsXG5cbiAgLy8gSW50ZXJuYWxzXG4gIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbixcblxuICAvLyBDb21wb25lbnRDb3JlXG4gIGdldERCVUlXZWJDb21wb25lbnRDb3JlLFxuXG4gIC8vIEJlaGF2aW91cnNcbiAgRm9jdXNhYmxlLFxuXG4gIC8vIFNlcnZpY2VzXG4gIGdldERCVUlMb2NhbGVTZXJ2aWNlLFxuICBnZXREQlVJSTE4blNlcnZpY2UsXG5cbiAgLy8gVXRpbHNcbiAgZm9ybWF0dGVycyxcbiAgdHJhaXRzLFxuICB0ZW1wbGF0ZSxcbiAgb25TY3JlZW5Db25zb2xlLFxuXG4gIC8vIENvbXBvbmVudHNcbiAgZ2V0REJVSVdlYkNvbXBvbmVudER1bW15LFxuICBnZXREQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQsXG4gIGdldERCVUlXZWJDb21wb25lbnRGb3JtSW5wdXRUZXh0LFxuICBnZXREQlVJV2ViQ29tcG9uZW50SWNvblxufTtcblxuLyogZXNsaW50IG5vLWNvbnNvbGU6IDAgKi9cblxubGV0IGJ1aWxkID0gJ3Byb2R1Y3Rpb24nO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICBidWlsZCA9ICdkZXZlbG9wJztcbn1cblxuY29uc29sZS5sb2coYFVzaW5nIERCVUlXZWJDb21wb25lbnRzRGlzdExpYiAke2J1aWxkfSBidWlsZC5gKTtcblxuIl19
