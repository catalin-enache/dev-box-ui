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
const _appendStyle = exports._appendStyle = win => (registrationName, componentStyle) => {
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
    _appendStyle(win)(registrationName, componentStyle);
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

var _ensureSingleRegistration = require('../internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const emptyObj = {};

const registrationName = 'DBUII18nService';

function getDBUII18nService(win) {
  return (0, _ensureSingleRegistration2.default)(win, registrationName, () => {
    class DBUII18nService {
      constructor() {
        this._translations = {};
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

      translate(msg, lang) {
        return (this.translations[lang] || emptyObj)[msg];
      }

      get translations() {
        return this._translations;
      }
    }

    const dbuiI18nService = new DBUII18nService();
    return dbuiI18nService;
  });
}

},{"../internals/ensureSingleRegistration":3}],5:[function(require,module,exports){
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
    class DBUILocaleService {
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

    const dbuiLocaleService = new DBUILocaleService();
    return dbuiLocaleService;
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
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

// import onScreenConsole from '../utils/onScreenConsole';

const _cssDisableSelection = node => {
  const win = node.ownerDocument.defaultView;
  const cursorStyle = win.getComputedStyle(node).cursor;
  const newCursorStyle = cursorStyle === 'pointer' ? cursorStyle : 'default';
  node.style.cursor = newCursorStyle;
  node.style.MozUserSelect = 'none';
  node.style.WebkitUserSelect = 'none';
  node.style.MsUserSelect = 'none';
  node.style.userSelect = 'none';
};

const _cssEnableSelection = node => {
  node.style.removeProperty('cursor');
  node.style.MozUserSelect = null;
  node.style.WebkitUserSelect = null;
  node.style.MsUserSelect = null;
  node.style.userSelect = null;
};

const _jsDisableSelection = node => {
  node.addEventListener('mousemove', _killSelection);
  node.addEventListener('touchmove', _killSelection);
  node.addEventListener('mouseup', _enableSelection);
  node.addEventListener('touchend', _enableSelection);
  node.addEventListener('touchcancel', _enableSelection);
};

const _jsEnableSelection = node => {
  node.removeEventListener('mousemove', _killSelection);
  node.removeEventListener('touchmove', _killSelection);
  node.removeEventListener('mouseup', _enableSelection);
  node.removeEventListener('touchend', _enableSelection);
  node.removeEventListener('touchcancel', _enableSelection);
};

const _killSelection = e => {
  const node = e.target;
  const doc = node.ownerDocument;
  const win = doc.defaultView;
  switch (e.type) {
    case 'mousemove':
    case 'touchmove':
      win.getSelection && win.getSelection().removeAllRanges();
      break;
    default:
    // pass
  }
};

const _disableSelection = e => {
  const node = e.target;
  const doc = node.ownerDocument;
  const win = doc.defaultView;
  // first clear any current selection
  win.getSelection && win.getSelection().removeAllRanges();
  // then disable further selection
  // 1. by style
  _cssDisableSelection(doc.body);
  // 2. by adding event listeners
  _jsDisableSelection(doc);
};

const _enableSelection = e => {
  const node = e.target;
  const doc = node.ownerDocument;
  // enable further selection
  // 1. by style
  _cssEnableSelection(doc.body);
  // 2. by removing event listeners
  _jsEnableSelection(doc);
};

const _handleTapStart = e => {
  // on tablet e.preventDefault() prevents
  // - selection,
  // - tap-highlight,
  // - triggering/doubling corresponding mouse events.
  e.preventDefault(); // css doubled: -webkit-tap-highlight-color:rgba(0,0,0,0);
  _disableSelection(e);
};

const disableSelection = node => {
  // onScreenConsole();
  _cssDisableSelection(node);
  node.addEventListener('touchstart', _handleTapStart);
  node.addEventListener('mousedown', _handleTapStart);
};

const enableSelection = node => {
  _cssEnableSelection(node);
  node.removeEventListener('touchstart', _handleTapStart);
  node.removeEventListener('mousedown', _handleTapStart);
};

exports.default = {
  disableSelection,
  enableSelection
};

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDBUIDraggable;

var _DBUIWebComponentCore = require('../DBUIWebComponentCore/DBUIWebComponentCore');

var _DBUIWebComponentCore2 = _interopRequireDefault(_DBUIWebComponentCore);

var _ensureSingleRegistration = require('../../../internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

var _onScreenConsole = require('../../../utils/onScreenConsole');

var _onScreenConsole2 = _interopRequireDefault(_onScreenConsole);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const registrationName = 'dbui-draggable';

const events = {
  mouse: {
    mousemove() {
      return evt => doMove(evt);
    },
    mouseup() {
      return evt => unregisterDocumentEvents(evt);
    },
    mouseout() {
      return evt => {
        const nodeName = ((evt.relatedTarget || {}).nodeName || 'HTML').toString();
        nodeName === 'HTML' && unregisterDocumentEvents(evt);
      };
    }
  },
  touch: {
    touchmove() {
      return evt => doMove(evt);
    },
    touchend() {
      return evt => unregisterDocumentEvents(evt);
    },
    touchcancel() {
      return evt => unregisterDocumentEvents(evt);
    }
  }
};

const eventOptions = { capture: true, passive: false };

/**
 *
 * @param evt TouchEvent || MouseEvent always coming from Draggable
 */
function registerDocumentEvents(evt) {
  const type = isTouchEvent(evt) ? 'touch' : 'mouse';
  const self = evt.currentTarget;
  const { doc, win } = getDocAndWin(evt);

  if (type === 'mouse') {
    win._dbuiCurrentElementBeingDragged = self;
  }

  if (!win._dbuiDraggableRegisteredEvents) {
    win._dbuiDraggableRegisteredEvents = new Map();
  }

  const newEventHandlers = Object.keys(events[type]).reduce((acc, event) => {
    return Object.assign({}, acc, {
      [event]: events[type][event]()
    });
  }, {});

  if (!win._dbuiDraggableRegisteredEvents.has(self)) {
    win._dbuiDraggableRegisteredEvents.set(self, newEventHandlers);
    Object.keys(newEventHandlers).forEach(event => {
      doc.addEventListener(event, newEventHandlers[event], eventOptions);
    });
  }
}

/**
 *
 * @param evt TouchEvent || MouseEvent always coming from Document
 */
function unregisterDocumentEvents(evt) {
  const type = isTouchEvent(evt) ? 'touch' : 'mouse';
  const { doc, win } = getDocAndWin(evt);

  const self = getElementBeingDragged(evt);

  if (!self) {
    // may occur when
    // 1. touchstart inside draggable
    // 2. touchstart outside draggable
    // 3. touchend outside draggable => this event is not for self
    return;
  }

  const eventHandlers = win._dbuiDraggableRegisteredEvents.get(self);

  if (type === 'touch') {
    const touchesNum = Array.from(evt.touches).reduce((acc, touchEvt) => {
      const target = getElementBeingDragged(touchEvt);
      if (target === self) {
        return acc + 1;
      }
      return acc;
    }, 0);

    if (touchesNum > 0) {
      return;
    }
  }

  Object.keys(eventHandlers).forEach(event => {
    doc.removeEventListener(event, eventHandlers[event], eventOptions);
  });
  win._dbuiCurrentElementBeingDragged = null;
  win._dbuiDraggableRegisteredEvents.delete(self);
}

/**
 *
 * @param evt Touch || TouchEvent || MouseEvent
 * @return Object { doc, win }
 */
function getDocAndWin(evt) {
  // if target.ownerDocument is null then target is document
  const doc = evt.target.ownerDocument || evt.target;
  const win = doc.defaultView;
  return { doc, win };
}

/**
 *
 * @param evt Touch || TouchEvent || MouseEvent
 * @return Boolean
 */
function isTouchEvent(evt) {
  const { win } = getDocAndWin(evt);
  return win.Touch && (evt instanceof win.Touch || evt instanceof win.TouchEvent);
}

/**
 *
 * @param evt Touch || TouchEvent || MouseEvent coming from either Draggable or Document
 * @return HTMLElement || null
 */
function getElementBeingDragged(evt) {
  const type = isTouchEvent(evt) ? 'touch' : 'mouse';
  const { win } = getDocAndWin(evt);

  if (type === 'mouse') {
    return win._dbuiCurrentElementBeingDragged;
  }

  const element = evt.target;

  if (element._dbuiDraggable) {
    return element;
  }

  let parentElement = element.parentElement;
  while (parentElement && !parentElement._dbuiDraggable) {
    parentElement = parentElement.parentElement;
  }

  return parentElement;
}

/**
 *
 * @param evt Event coming from either Draggable or Document
 * @return Event || null
 */
function extractSingleEvent(evt) {
  return isTouchEvent(evt) ? Array.from(evt.touches).find(e => getElementBeingDragged(e) === getElementBeingDragged(evt)) : evt;
}

/**
 *
 * @param evt MouseEvent || TouchEvent always coming from Draggable
 * @return { startX, startY, translateX, translateY, width, height }
 */
function getMeasurements(evt) {
  const self = evt.currentTarget;
  const win = self.ownerDocument.defaultView;
  const targetToDrag = self._targetToDrag;

  const nodeComputedStyle = win.getComputedStyle(targetToDrag, null);
  const matrix = nodeComputedStyle.transform.match(/-?\d*\.?\d+/g).map(Number);
  const boundingRect = targetToDrag.getBoundingClientRect();
  const extractedEvent = extractSingleEvent(evt);

  const { width, height } = boundingRect;
  const { clientX: startX, clientY: startY } = extractedEvent;
  const [translateX, translateY] = [matrix[4], matrix[5]];

  return {
    startX, startY, translateX, translateY, width, height
  };
}

/**
 *
 * @param evt MouseEvent always coming from Draggable
 */
function handleMouseDown(evt) {
  if (evt.which === 3) return;
  onPointerDown(evt);
}

/**
 *
 * @param evt TouchEvent always coming from Draggable
 */
function handleTouchStart(evt) {
  onPointerDown(evt);
}

/**
 *
 * @param evt MouseEvent || TouchEvent always coming from Draggable
 */
function onPointerDown(evt) {
  evt.preventDefault(); // prevents TouchEvent to trigger MouseEvent
  const self = evt.currentTarget;
  self._measurements = getMeasurements(evt);
  registerDocumentEvents(evt);
}

/**
 *
 * @param evt MouseEvent (mousemove) || TouchEvent (touchmove) always coming from Document
 */
function doMove(_evt) {
  _evt.preventDefault(); // prevent selection and scrolling
  const evt = extractSingleEvent(_evt);

  if (!evt) {
    return;
  }

  const self = getElementBeingDragged(evt);

  if (!self) {
    // may occur when
    // 1. touchstart inside draggable
    // 2. touchstart outside draggable
    // 3. touchmove outside draggable => this event is not for self
    return;
  }

  const { win } = getDocAndWin(evt);

  if (self._dragRunning) {
    return;
  }
  self._dragRunning = true;
  win.requestAnimationFrame(() => {
    if (!self.isMounted) {
      // might be unmounted meanwhile
      self._dragRunning = false;
      return;
    }

    const {
      startX, startY, translateX, translateY, width, height
    } = self._measurements;
    const [distanceX, distanceY] = [evt.clientX - startX, evt.clientY - startY];

    const nextTranslateX = translateX + distanceX;
    const nextTranslateY = translateY + distanceY;

    const { translateX: revisedTranslateX, translateY: revisedTranslateY } = self.applyCorrection({ translateX: nextTranslateX, translateY: nextTranslateY, width, height });

    self.translateX = revisedTranslateX;
    self.translateY = revisedTranslateY;

    // const targetToDrag = self._targetToDrag;
    // targetToDrag.style.transform = `translate(${revisedTranslateX}px,${revisedTranslateY}px)`;

    self.dispatchEvent(new win.CustomEvent('translate', {
      detail: {
        translateX: revisedTranslateX,
        translateY: revisedTranslateY
      }
    }));
    self._dragRunning = false;
  });
}

/*
TODO:
1.
dir rtl ?
2.
attributeChanged
3.
predefined constraints
4.
steps ?
5.
write from the outside
6.
work with react
*/

function getDBUIDraggable(win) {
  return (0, _ensureSingleRegistration2.default)(win, registrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = (0, _DBUIWebComponentCore2.default)(win);

    // onScreenConsole();

    class DBUIDraggable extends DBUIWebComponentBase {

      static get registrationName() {
        return registrationName;
      }

      static get templateInnerHTML() {
        return `
          <style>
          :host {
            all: initial;
            cursor: pointer;
            touch-action: none;
            display: inline-block;
          }
          
          :host([dbui-dir=ltr]) {
          }
          
          :host([dbui-dir=rtl]) {
          }
          </style>
          <slot></slot>
        `;
      }

      static get propertiesToUpgrade() {
        return [...super.propertiesToUpgrade, 'applyCorrection', 'translateX', 'translateY', 'dragTarget'];
      }

      static get observedAttributes() {
        return [...super.observedAttributes, 'translate-x', 'translate-y', 'drag-target'];
      }

      constructor() {
        super();
        this._cachedTargetToDrag = null;
        this._dbuiDraggable = true;
      }

      get translateX() {
        return Number(this.getAttribute('translate-x')) || 0;
      }

      set translateX(value) {
        const newValue = (Number(value) || 0).toString();
        this.setAttribute('translate-x', newValue);
      }

      get translateY() {
        return Number(this.getAttribute('translate-y')) || 0;
      }

      set translateY(value) {
        const newValue = (Number(value) || 0).toString();
        this.setAttribute('translate-y', newValue);
      }

      get dragTarget() {
        return this.getAttribute('drag-target');
      }

      set dragTarget(value) {
        this.setAttribute('drag-target', value.toString());
      }

      get _targetToDrag() {
        if (this._cachedTargetToDrag) return this._cachedTargetToDrag;
        const targetToDrag = this.getRootNode().querySelector(this.getAttribute('drag-target')) || this;
        this._cachedTargetToDrag = targetToDrag;
        return this._cachedTargetToDrag;
      }

      _initializeTargetToDrag() {
        this._cachedTargetToDrag = null; // needed when drag-target attribute changes
        const targetToDrag = this._targetToDrag;
        targetToDrag.setAttribute('dbui-draggable-target', '');
        targetToDrag.style.transform = `translate(${this.translateX}px,${this.translateY}px)`;
        targetToDrag.style.transformOrigin = 'center';
      }

      _resetTargetToDrag() {
        const targetToDrag = this._targetToDrag;
        targetToDrag.removeAttribute('dbui-draggable-target');
        this._cachedTargetToDrag = null;
      }

      onConnectedCallback() {
        this.setAttribute('unselectable', '');
        this.addEventListener('mousedown', handleMouseDown, eventOptions);
        this.addEventListener('touchstart', handleTouchStart, eventOptions);
        this._initializeTargetToDrag();
      }

      onDisconnectedCallback() {
        this.removeAttribute('unselectable');
        this.removeEventListener('mousedown', handleMouseDown, eventOptions);
        this.removeEventListener('touchstart', handleTouchStart, eventOptions);
        this._resetTargetToDrag();
      }

      onAttributeChangedCallback(name, oldValue, newValue) {
        let valueToSet = null;
        switch (name) {
          case 'translate-x':
            valueToSet = (Number(newValue) || 0).toString();
            this._targetToDrag.style.transform = `translate(${valueToSet}px,${this.translateY}px)`;
            break;
          case 'translate-y':
            valueToSet = (Number(newValue) || 0).toString();
            this._targetToDrag.style.transform = `translate(${this.translateX}px,${valueToSet}px)`;
            break;
          case 'drag-target':
            this._resetTargetToDrag();
            this._initializeTargetToDrag();
            break;
          default:
          // pass
        }
      }

      /**
       * Can be overridden
       * @param translateX Number
       * @param translateY Number
       * @return Object { translateX: Number, translateY: Number }
       */
      applyCorrection({ translateX, translateY }) {
        return { translateX, translateY };
      }

    }

    return Registerable(defineCommonStaticMethods(DBUIDraggable));
  });
}

getDBUIDraggable.registrationName = registrationName;

},{"../../../internals/ensureSingleRegistration":3,"../../../utils/onScreenConsole":7,"../DBUIWebComponentCore/DBUIWebComponentCore":18}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDBUIDummy;

var _DBUIWebComponentCore = require('../DBUIWebComponentCore/DBUIWebComponentCore');

var _DBUIWebComponentCore2 = _interopRequireDefault(_DBUIWebComponentCore);

var _ensureSingleRegistration = require('../../../internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const registrationName = 'dbui-dummy';

function getDBUIDummy(win) {
  return (0, _ensureSingleRegistration2.default)(win, registrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = (0, _DBUIWebComponentCore2.default)(win);

    class DBUIDummy extends DBUIWebComponentBase {

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
    }

    return Registerable(defineCommonStaticMethods(DBUIDummy));
  });
}

getDBUIDummy.registrationName = registrationName;

},{"../../../internals/ensureSingleRegistration":3,"../DBUIWebComponentCore/DBUIWebComponentCore":18}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDBUIDummyParent;

var _DBUIWebComponentCore = require('../DBUIWebComponentCore/DBUIWebComponentCore');

var _DBUIWebComponentCore2 = _interopRequireDefault(_DBUIWebComponentCore);

var _DBUIDummy = require('../DBUIDummy/DBUIDummy');

var _DBUIDummy2 = _interopRequireDefault(_DBUIDummy);

var _ensureSingleRegistration = require('../../../internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const registrationName = 'dbui-dummy-parent';

function getDBUIDummyParent(win) {
  return (0, _ensureSingleRegistration2.default)(win, registrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = (0, _DBUIWebComponentCore2.default)(win);
    const DBUIDummy = (0, _DBUIDummy2.default)(win);

    class DBUIDummyParent extends DBUIWebComponentBase {

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
              <dbui-dummy><slot></slot></dbui-dummy>
            </div>
          </div>
        `;
      }

      static get dependencies() {
        return [DBUIDummy];
      }

    }

    return Registerable(defineCommonStaticMethods(DBUIDummyParent));
  });
}

getDBUIDummyParent.registrationName = registrationName;

},{"../../../internals/ensureSingleRegistration":3,"../DBUIDummy/DBUIDummy":11,"../DBUIWebComponentCore/DBUIWebComponentCore":18}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDBUIFormInputText;

var _DBUIWebComponentCore = require('../DBUIWebComponentCore/DBUIWebComponentCore');

var _DBUIWebComponentCore2 = _interopRequireDefault(_DBUIWebComponentCore);

var _ensureSingleRegistration = require('../../../internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

var _Focusable = require('../../decorators/Focusable');

var _Focusable2 = _interopRequireDefault(_Focusable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const registrationName = 'dbui-form-input-text';
/* eslint max-len: 0 */

function getDBUIFormInputText(win) {
  return (0, _ensureSingleRegistration2.default)(win, registrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = (0, _DBUIWebComponentCore2.default)(win);

    class DBUIFormInputText extends DBUIWebComponentBase {

      static get registrationName() {
        return registrationName;
      }

      static get templateInnerHTML() {
        // noinspection CssUnresolvedCustomProperty
        return `
          <style>
          :host {
            all: initial; 
            display: inline-block;
            width: 100%;
            /*height: var(--dbui-form-input-height);*/
            /*line-height: var(--dbui-form-input-height);*/
            height: 300px;
            padding: 0px;
            font-size: 18px;
            color: var(--dbui-form-input-color);
            /*background-color: var(--dbui-form-input-background-color);*/
            background-color: rgba(255, 100, 0, 0.1);
            unicode-bidi: bidi-override;
            box-sizing: border-box;
            border: none;
            border-bottom: var(--dbui-form-input-border-width) var(--dbui-form-input-border-style) var(--dbui-form-input-border-color);
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
          <p>DBUIFormInputText</p>
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

    }

    return Registerable((0, _Focusable2.default)(defineCommonStaticMethods(DBUIFormInputText)));
  });
}

getDBUIFormInputText.registrationName = registrationName;

},{"../../../internals/ensureSingleRegistration":3,"../../decorators/Focusable":19,"../DBUIWebComponentCore/DBUIWebComponentCore":18}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDBUIIcon;

var _DBUIWebComponentCore = require('../DBUIWebComponentCore/DBUIWebComponentCore');

var _DBUIWebComponentCore2 = _interopRequireDefault(_DBUIWebComponentCore);

var _ensureSingleRegistration = require('../../../internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const registrationName = 'dbui-icon';

// https://github.com/gorangajic/react-icon-base/blob/master/index.js
// https://raw.githubusercontent.com/gorangajic/react-icons/master/icons/go/mark-github.svg
// https://github.com/gorangajic/react-icons
// https://github.com/gorangajic/react-icons/blob/master/go/mark-github.js
// https://gorangajic.github.io/react-icons/go.html

function getDBUIIcon(win) {
  return (0, _ensureSingleRegistration2.default)(win, registrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = (0, _DBUIWebComponentCore2.default)(win);

    class DBUIIcon extends DBUIWebComponentBase {

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

    return Registerable(defineCommonStaticMethods(DBUIIcon));
  });
}

getDBUIIcon.registrationName = registrationName;

},{"../../../internals/ensureSingleRegistration":3,"../DBUIWebComponentCore/DBUIWebComponentCore":18}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDBUITranslated;

var _DBUIWebComponentCore = require('../DBUIWebComponentCore/DBUIWebComponentCore');

var _DBUIWebComponentCore2 = _interopRequireDefault(_DBUIWebComponentCore);

var _ensureSingleRegistration = require('../../../internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

var _DBUII18nService = require('../../../services/DBUII18nService');

var _DBUII18nService2 = _interopRequireDefault(_DBUII18nService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const INTERPOLATION_ATTR_PREFIX = 'message-';

const registrationName = 'dbui-translated';

function getDBUITranslated(win) {
  return (0, _ensureSingleRegistration2.default)(win, registrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = (0, _DBUIWebComponentCore2.default)(win);

    const i18nService = (0, _DBUII18nService2.default)(win);

    class DBUITranslated extends DBUIWebComponentBase {

      static get registrationName() {
        return registrationName;
      }

      static get templateInnerHTML() {
        return `
          <style>
          :host {
            display: inline;
          }
          </style>
          <span></span>
        `;
      }

      static get observedAttributes() {
        return [...super.observedAttributes, 'message', 'dbui-lang'];
      }

      get observedDynamicAttributes() {
        return [...super.observedDynamicAttributes, ...this._interpolationAttributesNames];
      }

      get hasDynamicAttributes() {
        return true;
      }

      get _message() {
        return this.getAttribute('message');
      }

      get _currentLang() {
        return this.getAttribute('dbui-lang');
      }

      get _currentLangTranslations() {
        return i18nService.translations[this._currentLang] || {};
      }

      get _template() {
        return this._currentLangTranslations[this._message] || (() => '[Translated]');
      }

      get _interpolationAttributes() {
        // noinspection JSCheckFunctionSignatures
        return Array.from(this.attributes).filter(attr => attr.name.startsWith(INTERPOLATION_ATTR_PREFIX));
      }

      get _interpolationAttributesNames() {
        return this._interpolationAttributes.map(attr => attr.name);
      }

      get _interpolations() {
        // noinspection JSCheckFunctionSignatures
        return this._interpolationAttributes.reduce((acc, attr) => {
          acc[attr.name.slice(INTERPOLATION_ATTR_PREFIX.length)] = attr.value;
          return acc;
        }, {});
      }

      _updateTranslation() {
        const interpolations = this._interpolations;
        const args = [];
        const kwargs = {};

        Object.keys(interpolations).forEach(key => {
          Number.isInteger(Number(key)) ? args.push(interpolations[key]) : kwargs[key] = interpolations[key];
        });

        this.shadowRoot.querySelector('span').innerHTML = this._template(...args, kwargs);
      }

      onConnectedCallback() {
        this._updateTranslation();
      }

      onAttributeChangedCallback() {
        this._updateTranslation();
      }

    }

    return Registerable(defineCommonStaticMethods(DBUITranslated));
  });
}

getDBUITranslated.registrationName = registrationName;

},{"../../../internals/ensureSingleRegistration":3,"../../../services/DBUII18nService":4,"../DBUIWebComponentCore/DBUIWebComponentCore":18}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const DBUICommonCssClasses = `
  [dbui-draggable-target] {
  }
  `;

exports.default = DBUICommonCssClasses;

},{}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const DBUICommonCssVars = `
  :root {
    --dbui-global-border-radius: 5px;
    --dbui-form-input-height: 30px;
    --dbui-form-input-color: #000;
    --dbui-form-input-background-color: transparent;
    --dbui-form-input-border-color: #ccc;
    --dbui-form-input-border-style: solid;
    --dbui-form-input-border-width: 1px;
  }
  `;

exports.default = DBUICommonCssVars;

},{}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDBUIWebComponentCore;

var _ensureSingleRegistration = require('../../../internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

var _DBUICommonCssVars = require('./DBUICommonCssVars');

var _DBUICommonCssVars2 = _interopRequireDefault(_DBUICommonCssVars);

var _DBUICommonCssClasses = require('./DBUICommonCssClasses');

var _DBUICommonCssClasses2 = _interopRequireDefault(_DBUICommonCssClasses);

var _toggleSelectable = require('../../../utils/toggleSelectable');

var _toggleSelectable2 = _interopRequireDefault(_toggleSelectable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  disableSelection,
  enableSelection
} = _toggleSelectable2.default;

const registrationName = 'DBUIWebComponentBase';

const cssMap = {
  'dbui-common-css-vars': _DBUICommonCssVars2.default,
  'dbui-common-css-classes': _DBUICommonCssClasses2.default
};

function defineCommonCSS(win) {
  const { document } = win;
  Object.keys(cssMap).forEach(key => {
    const commonStyle = document.createElement('style');
    commonStyle.setAttribute(key, '');
    commonStyle.innerHTML = cssMap[key];
    document.querySelector('head').appendChild(commonStyle);
  });
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
    defineCommonCSS(win);

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
        return ['unselectable'];
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
        return ['dir', 'lang', 'sync-locale-with', 'unselectable'];
      }

      /**
       *
       * @return Array<String>
       */
      get observedDynamicAttributes() {
        return [];
      }

      /**
       *
       * @return Boolean
       */
      get hasDynamicAttributes() {
        return false;
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

      constructor() {
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
        this._dynamicAttributesObserver = null;
        this._previouslyObservedDynamicAttributes = {};
        this._insertTemplate();

        this.connectedCallback = this.connectedCallback.bind(this);
        this.disconnectedCallback = this.disconnectedCallback.bind(this);
        this.attributeChangedCallback = this.attributeChangedCallback.bind(this);
        this.adoptedCallback = this.adoptedCallback.bind(this);
      }

      // ============================ [Observe Dynamic Attributes] >> =============================================

      _initializeDynamicAttributesObserver() {
        if (!this.hasDynamicAttributes) return;

        this._dynamicAttributesObserver = new win.MutationObserver(mutations => {
          mutations.forEach(mutation => {
            const { oldValue, attributeName } = mutation;
            const newValue = this.getAttribute(attributeName);
            const currentlyObservedDynamicAttributesKeys = this.observedDynamicAttributes;
            const previouslyObservedDynamicAttributes = this._previouslyObservedDynamicAttributes;
            const previouslyObservedDynamicAttributesKeys = Object.keys(previouslyObservedDynamicAttributes);
            const isInCurrentlyObservedDynamicAttributes = currentlyObservedDynamicAttributesKeys.includes(attributeName);
            const isInPreviouslyObservedDynamicAttributes = previouslyObservedDynamicAttributesKeys.includes(attributeName);

            if (isInCurrentlyObservedDynamicAttributes) {
              this._previouslyObservedDynamicAttributes[attributeName] = newValue;
              this.attributeChangedCallback(attributeName, oldValue, newValue);
            } else if (isInPreviouslyObservedDynamicAttributes) {
              const oldValue = this._previouslyObservedDynamicAttributes[attributeName];
              delete this._previouslyObservedDynamicAttributes[attributeName];
              this.attributeChangedCallback(attributeName, oldValue, null);
            }
          });
        });

        this._dynamicAttributesObserver.observe(this, {
          attributes: true,
          attributeOldValue: true
        });
      }

      _dismissDynamicAttributesObserver() {
        if (!this._dynamicAttributesObserver) return;

        this._dynamicAttributesObserver.disconnect();
        this._dynamicAttributesObserver = null;
      }

      // ============================ << [Observe Dynamic Attributes] =============================================

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

        this._localeObserver = new win.MutationObserver(mutations => {
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


      // ============================ [unselectable] >> =============================================

      _onUnselectableAttributeChanged() {
        const unselectable = this.unselectable;

        if (unselectable) {
          disableSelection(this);
        } else {
          enableSelection(this);
        }
      }

      get unselectable() {
        return this.hasAttribute('unselectable');
      }

      set unselectable(value) {
        const hasValue = Boolean(value);
        if (hasValue) {
          this.setAttribute('unselectable', '');
        } else {
          this.removeAttribute('unselectable');
        }
      }

      // ============================ << [unselectable] =============================================

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
        this._initializeDynamicAttributesObserver();
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
        this._dismissDynamicAttributesObserver();
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
        ['dir', 'lang', 'sync-locale-with'].includes(name) && this._onLocaleAttributeChangedCallback(name, oldValue, newValue);
        name === 'unselectable' && this._onUnselectableAttributeChanged();
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

},{"../../../internals/ensureSingleRegistration":3,"../../../utils/toggleSelectable":9,"./DBUICommonCssClasses":16,"./DBUICommonCssVars":17}],19:[function(require,module,exports){
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
      this._onDocumentTap = this._onDocumentTap.bind(this);
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
          // eslint-disable-next-line
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
      this.ownerDocument.addEventListener('mousedown', this._onDocumentTap);
      this.ownerDocument.addEventListener('touchstart', this._onDocumentTap);

      this._innerFocusables.forEach(focusable => {
        // when inner focusable focused
        focusable.addEventListener('focus', this._onInnerFocusableFocused);
      });
    }

    disconnectedCallback() {
      super.disconnectedCallback();

      this.removeEventListener('focus', this._onFocus);
      this.removeEventListener('blur', this._onBlur);
      this.ownerDocument.removeEventListener('mousedown', this._onDocumentTap);
      this.ownerDocument.removeEventListener('touchstart', this._onDocumentTap);

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
      // eslint-disable-next-line
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
    _onDocumentTap(evt) {
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

},{}],20:[function(require,module,exports){
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
exports.getDBUIDraggable = exports.getDBUITranslated = exports.getDBUIIcon = exports.getDBUIFormInputText = exports.getDBUIDummyParent = exports.getDBUIDummy = exports.onScreenConsole = exports.template = exports.toggleSelectable = exports.formatters = exports.getDBUII18nService = exports.getDBUILocaleService = exports.Focusable = exports.getDBUIWebComponentCore = exports.ensureSingleRegistration = exports.dbuiWebComponentsSetUp = exports.quickSetupAndLoad = exports.registrations = undefined;

var _dbuiWebComponentsSetup = require('./web-components/helpers/dbuiWebComponentsSetup');

var _dbuiWebComponentsSetup2 = _interopRequireDefault(_dbuiWebComponentsSetup);

var _ensureSingleRegistration = require('./internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

var _DBUIWebComponentCore = require('./web-components/components/DBUIWebComponentCore/DBUIWebComponentCore');

var _DBUIWebComponentCore2 = _interopRequireDefault(_DBUIWebComponentCore);

var _Focusable = require('./web-components/decorators/Focusable');

var _Focusable2 = _interopRequireDefault(_Focusable);

var _DBUILocaleService = require('./services/DBUILocaleService');

var _DBUILocaleService2 = _interopRequireDefault(_DBUILocaleService);

var _DBUII18nService = require('./services/DBUII18nService');

var _DBUII18nService2 = _interopRequireDefault(_DBUII18nService);

var _formatters = require('./utils/formatters');

var _formatters2 = _interopRequireDefault(_formatters);

var _toggleSelectable = require('./utils/toggleSelectable');

var _toggleSelectable2 = _interopRequireDefault(_toggleSelectable);

var _template = require('./utils/template');

var _template2 = _interopRequireDefault(_template);

var _onScreenConsole = require('./utils/onScreenConsole');

var _onScreenConsole2 = _interopRequireDefault(_onScreenConsole);

var _DBUIDummy = require('./web-components/components/DBUIDummy/DBUIDummy');

var _DBUIDummy2 = _interopRequireDefault(_DBUIDummy);

var _DBUIDummyParent = require('./web-components/components/DBUIDummyParent/DBUIDummyParent');

var _DBUIDummyParent2 = _interopRequireDefault(_DBUIDummyParent);

var _DBUIFormInputText = require('./web-components/components/DBUIFormInputText/DBUIFormInputText');

var _DBUIFormInputText2 = _interopRequireDefault(_DBUIFormInputText);

var _DBUIIcon = require('./web-components/components/DBUIIcon/DBUIIcon');

var _DBUIIcon2 = _interopRequireDefault(_DBUIIcon);

var _DBUITranslated = require('./web-components/components/DBUITranslated/DBUITranslated');

var _DBUITranslated2 = _interopRequireDefault(_DBUITranslated);

var _DBUIDraggable = require('./web-components/components/DBUIDraggable/DBUIDraggable');

var _DBUIDraggable2 = _interopRequireDefault(_DBUIDraggable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Components


// Utils


// Services


// ComponentBase
/* eslint max-len: 0 */
// Helpers
const registrations = {
  [_DBUIDummy2.default.registrationName]: _DBUIDummy2.default,
  [_DBUIDummyParent2.default.registrationName]: _DBUIDummyParent2.default,
  [_DBUIFormInputText2.default.registrationName]: _DBUIFormInputText2.default,
  [_DBUIIcon2.default.registrationName]: _DBUIIcon2.default,
  [_DBUITranslated2.default.registrationName]: _DBUITranslated2.default,
  [_DBUIDraggable2.default.registrationName]: _DBUIDraggable2.default
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


// Decorators


// Internals
function quickSetupAndLoad(win = window) {
  /**
   * @param components Object {
   *  registrationName,
   *  componentStyle
   * }
   * @return Object { <registrationName>, <componentClass> }
   */
  return components => {
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
exports.toggleSelectable = _toggleSelectable2.default;
exports.template = _template2.default;
exports.onScreenConsole = _onScreenConsole2.default;
exports.getDBUIDummy = _DBUIDummy2.default;
exports.getDBUIDummyParent = _DBUIDummyParent2.default;
exports.getDBUIFormInputText = _DBUIFormInputText2.default;
exports.getDBUIIcon = _DBUIIcon2.default;
exports.getDBUITranslated = _DBUITranslated2.default;
exports.getDBUIDraggable = _DBUIDraggable2.default;

/* eslint no-console: 0 */

let build = 'production';

if (process.env.NODE_ENV !== 'production') {
  build = 'develop';
}

console.log(`Using DBUIWebComponentsDistLib ${build} build.`);

}).call(this,require('_process'))

},{"./internals/ensureSingleRegistration":3,"./services/DBUII18nService":4,"./services/DBUILocaleService":5,"./utils/formatters":6,"./utils/onScreenConsole":7,"./utils/template":8,"./utils/toggleSelectable":9,"./web-components/components/DBUIDraggable/DBUIDraggable":10,"./web-components/components/DBUIDummy/DBUIDummy":11,"./web-components/components/DBUIDummyParent/DBUIDummyParent":12,"./web-components/components/DBUIFormInputText/DBUIFormInputText":13,"./web-components/components/DBUIIcon/DBUIIcon":14,"./web-components/components/DBUITranslated/DBUITranslated":15,"./web-components/components/DBUIWebComponentCore/DBUIWebComponentCore":18,"./web-components/decorators/Focusable":19,"./web-components/helpers/dbuiWebComponentsSetup":20,"_process":1}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwic3JjL2xpYi9jb3JlL2ludGVybmFscy9hcHBlbmRTdHlsZXMuanMiLCJzcmMvbGliL2NvcmUvaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbi5qcyIsInNyYy9saWIvY29yZS9zZXJ2aWNlcy9EQlVJSTE4blNlcnZpY2UuanMiLCJzcmMvbGliL2NvcmUvc2VydmljZXMvREJVSUxvY2FsZVNlcnZpY2UuanMiLCJzcmMvbGliL2NvcmUvdXRpbHMvZm9ybWF0dGVycy5qcyIsInNyYy9saWIvY29yZS91dGlscy9vblNjcmVlbkNvbnNvbGUuanMiLCJzcmMvbGliL2NvcmUvdXRpbHMvdGVtcGxhdGUuanMiLCJzcmMvbGliL2NvcmUvdXRpbHMvdG9nZ2xlU2VsZWN0YWJsZS5qcyIsInNyYy9saWIvY29yZS93ZWItY29tcG9uZW50cy9jb21wb25lbnRzL0RCVUlEcmFnZ2FibGUvREJVSURyYWdnYWJsZS5qcyIsInNyYy9saWIvY29yZS93ZWItY29tcG9uZW50cy9jb21wb25lbnRzL0RCVUlEdW1teS9EQlVJRHVtbXkuanMiLCJzcmMvbGliL2NvcmUvd2ViLWNvbXBvbmVudHMvY29tcG9uZW50cy9EQlVJRHVtbXlQYXJlbnQvREJVSUR1bW15UGFyZW50LmpzIiwic3JjL2xpYi9jb3JlL3dlYi1jb21wb25lbnRzL2NvbXBvbmVudHMvREJVSUZvcm1JbnB1dFRleHQvREJVSUZvcm1JbnB1dFRleHQuanMiLCJzcmMvbGliL2NvcmUvd2ViLWNvbXBvbmVudHMvY29tcG9uZW50cy9EQlVJSWNvbi9EQlVJSWNvbi5qcyIsInNyYy9saWIvY29yZS93ZWItY29tcG9uZW50cy9jb21wb25lbnRzL0RCVUlUcmFuc2xhdGVkL0RCVUlUcmFuc2xhdGVkLmpzIiwic3JjL2xpYi9jb3JlL3dlYi1jb21wb25lbnRzL2NvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudENvcmUvREJVSUNvbW1vbkNzc0NsYXNzZXMuanMiLCJzcmMvbGliL2NvcmUvd2ViLWNvbXBvbmVudHMvY29tcG9uZW50cy9EQlVJV2ViQ29tcG9uZW50Q29yZS9EQlVJQ29tbW9uQ3NzVmFycy5qcyIsInNyYy9saWIvY29yZS93ZWItY29tcG9uZW50cy9jb21wb25lbnRzL0RCVUlXZWJDb21wb25lbnRDb3JlL0RCVUlXZWJDb21wb25lbnRDb3JlLmpzIiwic3JjL2xpYi9jb3JlL3dlYi1jb21wb25lbnRzL2RlY29yYXRvcnMvRm9jdXNhYmxlLmpzIiwic3JjL2xpYi9jb3JlL3dlYi1jb21wb25lbnRzL2hlbHBlcnMvZGJ1aVdlYkNvbXBvbmVudHNTZXR1cC5qcyIsInNyYy9saWIvc3JjL2xpYi9jb3JlL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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UUFBUSxZQUFaOztBQUVBLElBQUksUUFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUE3QixFQUEyQztBQUN6QyxVQUFRLFNBQVI7QUFDRDs7QUFFRCxRQUFRLEdBQVIsQ0FBYSxrQ0FBaUMsS0FBTSxTQUFwRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCIvKlxuREJVSVdlYkNvbXBvbmVudEJhc2UgKGZyb20gd2hpY2ggYWxsIHdlYi1jb21wb25lbnRzIGluaGVyaXQpXG53aWxsIHJlYWQgY29tcG9uZW50U3R5bGUgZnJvbSB3aW4uREJVSVdlYkNvbXBvbmVudHNcbndoZW4ga2xhc3MucmVnaXN0ZXJTZWxmKCkgaXMgY2FsbGVkIGdpdmluZyBhIGNoYW5jZSB0byBvdmVycmlkZSBkZWZhdWx0IHdlYi1jb21wb25lbnQgc3R5bGVcbmp1c3QgYmVmb3JlIGl0IGlzIHJlZ2lzdGVyZWQuXG4qL1xuZXhwb3J0IGNvbnN0IF9hcHBlbmRTdHlsZSA9ICh3aW4pID0+IChyZWdpc3RyYXRpb25OYW1lLCBjb21wb25lbnRTdHlsZSkgPT4ge1xuICBpZiAoIXdpbi5EQlVJV2ViQ29tcG9uZW50cykge1xuICAgIHdpbi5EQlVJV2ViQ29tcG9uZW50cyA9IHt9O1xuICB9XG4gIHdpbi5EQlVJV2ViQ29tcG9uZW50cyA9IHtcbiAgICAuLi53aW4uREJVSVdlYkNvbXBvbmVudHMsXG4gICAgW3JlZ2lzdHJhdGlvbk5hbWVdOiB7XG4gICAgICAuLi53aW4uREJVSVdlYkNvbXBvbmVudHNbcmVnaXN0cmF0aW9uTmFtZV0sXG4gICAgICBjb21wb25lbnRTdHlsZVxuICAgIH1cbiAgfTtcbn07XG5cbmNvbnN0IGFwcGVuZFN0eWxlcyA9ICh3aW4pID0+IChjb21wb25lbnRzKSA9PiB7XG4gIGNvbXBvbmVudHMuZm9yRWFjaCgoeyByZWdpc3RyYXRpb25OYW1lLCBjb21wb25lbnRTdHlsZSB9KSA9PiB7XG4gICAgX2FwcGVuZFN0eWxlKHdpbikocmVnaXN0cmF0aW9uTmFtZSwgY29tcG9uZW50U3R5bGUpO1xuICB9KTtcbiAgcmV0dXJuIGNvbXBvbmVudHM7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhcHBlbmRTdHlsZXM7XG4iLCJcbi8qKlxuICpcbiAqIEBwYXJhbSB3aW4gV2luZG93XG4gKiBAcGFyYW0gbmFtZSBTdHJpbmdcbiAqIEBwYXJhbSBjYWxsYmFjayBGdW5jdGlvblxuICogQHJldHVybiAqXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbih3aW4sIG5hbWUsIGNhbGxiYWNrKSB7XG4gIGlmICghd2luLkRCVUlXZWJDb21wb25lbnRzKSB7XG4gICAgd2luLkRCVUlXZWJDb21wb25lbnRzID0geyByZWdpc3RyYXRpb25zOiB7fSB9O1xuICB9IGVsc2UgaWYgKCF3aW4uREJVSVdlYkNvbXBvbmVudHMucmVnaXN0cmF0aW9ucykge1xuICAgIHdpbi5EQlVJV2ViQ29tcG9uZW50cy5yZWdpc3RyYXRpb25zID0ge307XG4gIH1cblxuICBsZXQgcmVnaXN0cmF0aW9uID0gd2luLkRCVUlXZWJDb21wb25lbnRzLnJlZ2lzdHJhdGlvbnNbbmFtZV07XG5cbiAgaWYgKHJlZ2lzdHJhdGlvbikgcmV0dXJuIHJlZ2lzdHJhdGlvbjtcblxuICByZWdpc3RyYXRpb24gPSBjYWxsYmFjaygpO1xuICB3aW4uREJVSVdlYkNvbXBvbmVudHMucmVnaXN0cmF0aW9uc1tuYW1lXSA9IHJlZ2lzdHJhdGlvbjtcblxuICByZXR1cm4gd2luLkRCVUlXZWJDb21wb25lbnRzLnJlZ2lzdHJhdGlvbnNbbmFtZV07XG59XG5cbiIsImltcG9ydCBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24gZnJvbSAnLi4vaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbic7XG5cbmNvbnN0IGVtcHR5T2JqID0ge307XG5cbmNvbnN0IHJlZ2lzdHJhdGlvbk5hbWUgPSAnREJVSUkxOG5TZXJ2aWNlJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0REJVSUkxOG5TZXJ2aWNlKHdpbikge1xuICByZXR1cm4gZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uKHdpbiwgcmVnaXN0cmF0aW9uTmFtZSwgKCkgPT4ge1xuICAgIGNsYXNzIERCVUlJMThuU2VydmljZSB7XG4gICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5fdHJhbnNsYXRpb25zID0ge307XG4gICAgICB9XG5cbiAgICAgIGNsZWFyVHJhbnNsYXRpb25zKGxhbmcpIHtcbiAgICAgICAgZGVsZXRlIHRoaXMuX3RyYW5zbGF0aW9uc1tsYW5nXTtcbiAgICAgIH1cblxuICAgICAgcmVnaXN0ZXJUcmFuc2xhdGlvbnModHJhbnNsYXRpb25zKSB7XG4gICAgICAgIHRoaXMuX3RyYW5zbGF0aW9ucyA9IE9iamVjdC5rZXlzKHRyYW5zbGF0aW9ucykucmVkdWNlKChhY2MsIGxhbmcpID0+IHtcbiAgICAgICAgICBhY2NbbGFuZ10gPSB7XG4gICAgICAgICAgICAuLi50aGlzLl90cmFuc2xhdGlvbnNbbGFuZ10sXG4gICAgICAgICAgICAuLi50cmFuc2xhdGlvbnNbbGFuZ11cbiAgICAgICAgICB9O1xuICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0sIHRoaXMuX3RyYW5zbGF0aW9ucyk7XG4gICAgICB9XG5cbiAgICAgIHRyYW5zbGF0ZShtc2csIGxhbmcpIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLnRyYW5zbGF0aW9uc1tsYW5nXSB8fCBlbXB0eU9iailbbXNnXTtcbiAgICAgIH1cblxuICAgICAgZ2V0IHRyYW5zbGF0aW9ucygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zbGF0aW9ucztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBkYnVpSTE4blNlcnZpY2UgPSBuZXcgREJVSUkxOG5TZXJ2aWNlKCk7XG4gICAgcmV0dXJuIGRidWlJMThuU2VydmljZTtcbiAgfSk7XG59XG4iLCJcbmltcG9ydCBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24gZnJvbSAnLi4vaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbic7XG5cbmNvbnN0IGRlZmF1bHRMb2NhbGUgPSB7XG4gIGRpcjogJ2x0cicsXG4gIGxhbmc6ICdlbidcbn07XG5cbmNvbnN0IHJlZ2lzdHJhdGlvbk5hbWUgPSAnREJVSUxvY2FsZVNlcnZpY2UnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXREQlVJTG9jYWxlU2VydmljZSh3aW4pIHtcbiAgcmV0dXJuIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbih3aW4sIHJlZ2lzdHJhdGlvbk5hbWUsICgpID0+IHtcbiAgICBjbGFzcyBEQlVJTG9jYWxlU2VydmljZSB7XG4gICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tzID0gW107XG4gICAgICAgIHRoaXMuX2xvY2FsZUF0dHJzID0gT2JqZWN0LmtleXMoZGVmYXVsdExvY2FsZSk7XG4gICAgICAgIHRoaXMuX3Jvb3RFbGVtZW50ID0gd2luLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1t4LWRidWktbG9jYWxlLXJvb3RdJykgfHwgd2luLmRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICAgICAgdGhpcy5fbG9jYWxlQXR0cnMuZm9yRWFjaCgoYXR0cikgPT4ge1xuICAgICAgICAgIGlmICghdGhpcy5fcm9vdEVsZW1lbnQuZ2V0QXR0cmlidXRlKGF0dHIpKSB7XG4gICAgICAgICAgICB0aGlzLl9yb290RWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0ciwgZGVmYXVsdExvY2FsZVthdHRyXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fbG9jYWxlID0gdGhpcy5fbG9jYWxlQXR0cnMucmVkdWNlKChhY2MsIGF0dHIpID0+IHtcbiAgICAgICAgICBhY2NbYXR0cl0gPSB0aGlzLl9yb290RWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cik7XG4gICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfSwge30pO1xuICAgICAgICB0aGlzLl9vYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMuX2hhbmRsZU11dGF0aW9ucy5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5fb2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLl9yb290RWxlbWVudCwge1xuICAgICAgICAgIGF0dHJpYnV0ZXM6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIF9oYW5kbGVNdXRhdGlvbnMobXV0YXRpb25zKSB7XG4gICAgICAgIG11dGF0aW9ucy5mb3JFYWNoKChtdXRhdGlvbikgPT4ge1xuICAgICAgICAgIGNvbnN0IG11dGF0aW9uQXR0cmlidXRlTmFtZSA9IG11dGF0aW9uLmF0dHJpYnV0ZU5hbWU7XG4gICAgICAgICAgaWYgKHRoaXMuX2xvY2FsZUF0dHJzLmluY2x1ZGVzKG11dGF0aW9uQXR0cmlidXRlTmFtZSkpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvY2FsZSA9IHtcbiAgICAgICAgICAgICAgLi4udGhpcy5fbG9jYWxlLFxuICAgICAgICAgICAgICBbbXV0YXRpb25BdHRyaWJ1dGVOYW1lXTogdGhpcy5fcm9vdEVsZW1lbnQuZ2V0QXR0cmlidXRlKG11dGF0aW9uQXR0cmlidXRlTmFtZSlcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFja3MuZm9yRWFjaChjYWxsYmFjayA9PiBjYWxsYmFjayh0aGlzLl9sb2NhbGUpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBzZXQgbG9jYWxlKGxvY2FsZU9iaikge1xuICAgICAgICBPYmplY3Qua2V5cyhsb2NhbGVPYmopLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgIHRoaXMuX3Jvb3RFbGVtZW50LnNldEF0dHJpYnV0ZShrZXksIGxvY2FsZU9ialtrZXldKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGdldCBsb2NhbGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sb2NhbGU7XG4gICAgICB9XG5cbiAgICAgIG9uTG9jYWxlQ2hhbmdlKGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuX2NhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgY2FsbGJhY2sodGhpcy5sb2NhbGUpO1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcy5maWx0ZXIoY2IgPT4gY2IgIT09IGNhbGxiYWNrKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBkYnVpTG9jYWxlU2VydmljZSA9IG5ldyBEQlVJTG9jYWxlU2VydmljZSgpO1xuICAgIHJldHVybiBkYnVpTG9jYWxlU2VydmljZTtcbiAgfSk7XG59XG4iLCIvKiBlc2xpbnQgcHJlZmVyLWNvbnN0OiAwICovXG5cbi8qKlxuICpcbiAqIEBwYXJhbSBvcHRpb25zIE9iamVjdFxuICogQHJldHVybnMgZnVuY3Rpb24oU3RyaW5nKTogU3RyaW5nXG4gKi9cbmNvbnN0IGZvcmNlRmxvYXQgPSAoeyBkZWNQb2ludCA9ICcuJyB9ID0ge30pID0+ICh2YWx1ZSkgPT4ge1xuICBjb25zdCBHTE9CQUxfREVDX1BPSU5UID0gbmV3IFJlZ0V4cChgXFxcXCR7ZGVjUG9pbnR9YCwgJ2cnKTtcbiAgY29uc3QgR0xPQkFMX05PTl9OVU1CRVJfT1JfREVDX1BPSU5UID0gbmV3IFJlZ0V4cChgW15cXFxcZCR7ZGVjUG9pbnR9XWAsICdnJyk7XG4gIGNvbnN0IE5VTUJFUl9ERUNfUE9JTlRfT1JfU0hPUlRDVVQgPSBuZXcgUmVnRXhwKGBbXFxcXGQke2RlY1BvaW50fUtrTW1dYCwgJycpO1xuICBjb25zdCBOVU1CRVJfT1JfU0lHTiA9IG5ldyBSZWdFeHAoJ1tcXFxcZCstXScsICcnKTtcbiAgY29uc3QgU0lHTiA9IG5ldyBSZWdFeHAoJ1srLV0nLCAnJyk7XG4gIGNvbnN0IFNIT1JUQ1VUID0gbmV3IFJlZ0V4cCgnW0trTW1dJywgJycpO1xuICBjb25zdCBTSE9SVENVVF9USE9VU0FORFMgPSBuZXcgUmVnRXhwKCdbS2tdJywgJycpO1xuXG4gIGxldCB2YWx1ZVRvVXNlID0gdmFsdWU7XG4gIGNvbnN0IGluZGV4T2ZQb2ludCA9IHZhbHVlVG9Vc2UuaW5kZXhPZihkZWNQb2ludCk7XG4gIGNvbnN0IGxhc3RJbmRleE9mUG9pbnQgPSB2YWx1ZVRvVXNlLmxhc3RJbmRleE9mKGRlY1BvaW50KTtcbiAgY29uc3QgaGFzTW9yZVRoYW5PbmVQb2ludCA9IGluZGV4T2ZQb2ludCAhPT0gbGFzdEluZGV4T2ZQb2ludDtcblxuICBpZiAoaGFzTW9yZVRoYW5PbmVQb2ludCkge1xuICAgIHZhbHVlVG9Vc2UgPSBgJHt2YWx1ZVRvVXNlLnJlcGxhY2UoR0xPQkFMX0RFQ19QT0lOVCwgJycpfSR7ZGVjUG9pbnR9YDtcbiAgfVxuXG4gIGxldCBmaXJzdENoYXIgPSB2YWx1ZVRvVXNlWzBdIHx8ICcnO1xuICBsZXQgbGFzdENoYXIgPSAodmFsdWVUb1VzZS5sZW5ndGggPiAxID8gdmFsdWVUb1VzZVt2YWx1ZVRvVXNlLmxlbmd0aCAtIDFdIDogJycpIHx8ICcnO1xuICBsZXQgbWlkZGxlQ2hhcnMgPSB2YWx1ZVRvVXNlLnN1YnN0cigxLCB2YWx1ZVRvVXNlLmxlbmd0aCAtIDIpIHx8ICcnO1xuXG4gIGlmICghZmlyc3RDaGFyLm1hdGNoKE5VTUJFUl9PUl9TSUdOKSkge1xuICAgIGZpcnN0Q2hhciA9ICcnO1xuICB9XG5cbiAgbWlkZGxlQ2hhcnMgPSBtaWRkbGVDaGFycy5yZXBsYWNlKEdMT0JBTF9OT05fTlVNQkVSX09SX0RFQ19QT0lOVCwgJycpO1xuXG4gIGlmICghbGFzdENoYXIubWF0Y2goTlVNQkVSX0RFQ19QT0lOVF9PUl9TSE9SVENVVCkpIHtcbiAgICBsYXN0Q2hhciA9ICcnO1xuICB9IGVsc2UgaWYgKGxhc3RDaGFyLm1hdGNoKFNIT1JUQ1VUKSkge1xuICAgIGlmIChtaWRkbGVDaGFycyA9PT0gZGVjUG9pbnQpIHtcbiAgICAgIG1pZGRsZUNoYXJzID0gJyc7XG4gICAgfSBlbHNlIGlmIChtaWRkbGVDaGFycyA9PT0gJycgJiYgZmlyc3RDaGFyLm1hdGNoKFNJR04pKSB7XG4gICAgICBsYXN0Q2hhciA9ICcnO1xuICAgIH1cbiAgfSBlbHNlIGlmIChsYXN0Q2hhciA9PT0gZGVjUG9pbnQgJiYgbWlkZGxlQ2hhcnMgPT09ICcnICYmIGZpcnN0Q2hhci5tYXRjaChTSUdOKSkge1xuICAgIGxhc3RDaGFyID0gJyc7XG4gIH1cblxuICB2YWx1ZVRvVXNlID0gW2ZpcnN0Q2hhciwgbWlkZGxlQ2hhcnMsIGxhc3RDaGFyXS5qb2luKCcnKTtcblxuICBpZiAobGFzdENoYXIubWF0Y2goU0hPUlRDVVQpKSB7XG4gICAgdmFsdWVUb1VzZSA9IChcbiAgICAgIE51bWJlcihgJHtmaXJzdENoYXJ9JHttaWRkbGVDaGFyc31gLnJlcGxhY2UoZGVjUG9pbnQsICcuJykpICpcbiAgICAgIChsYXN0Q2hhci5tYXRjaChTSE9SVENVVF9USE9VU0FORFMpID8gMTAwMCA6IDEwMDAwMDApXG4gICAgKS50b1N0cmluZygpLnJlcGxhY2UoJy4nLCBkZWNQb2ludCk7XG4gIH1cblxuICByZXR1cm4gdmFsdWVUb1VzZTtcbn07XG5cbi8qKlxuICpcbiAqIEBwYXJhbSBvcHRpb25zIE9iamVjdFxuICogQHJldHVybnMgZnVuY3Rpb24oU3RyaW5nKTogU3RyaW5nXG4gKi9cbmNvbnN0IG51bWJlckZvcm1hdHRlciA9ICh7IGRlY1BvaW50ID0gJy4nLCB0aG91c2FuZHNTZXBhcmF0b3IgPSAnLCcgfSA9IHt9KSA9PiB2YWx1ZSA9PiB7XG4gIHZhbHVlID0gdmFsdWUucmVwbGFjZSgnLicsIGRlY1BvaW50KTtcbiAgbGV0IGZpcnN0Q2hhciA9IHZhbHVlWzBdIHx8ICcnO1xuICBmaXJzdENoYXIgPSBbJysnLCAnLSddLmluY2x1ZGVzKGZpcnN0Q2hhcikgPyBmaXJzdENoYXIgOiAnJztcbiAgY29uc3QgaXNGbG9hdGluZ1BvaW50ID0gdmFsdWUuaW5kZXhPZihkZWNQb2ludCkgIT09IC0xO1xuICBsZXQgW2ludGVnZXJQYXJ0ID0gJycsIGRlY2ltYWxzID0gJyddID0gdmFsdWUuc3BsaXQoZGVjUG9pbnQpO1xuICBpbnRlZ2VyUGFydCA9IGludGVnZXJQYXJ0LnJlcGxhY2UoL1srLV0vZywgJycpO1xuICBpbnRlZ2VyUGFydCA9IGludGVnZXJQYXJ0LnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csIHRob3VzYW5kc1NlcGFyYXRvcik7XG4gIGNvbnN0IHJldCA9IGAke2ZpcnN0Q2hhcn0ke2ludGVnZXJQYXJ0fSR7aXNGbG9hdGluZ1BvaW50ID8gZGVjUG9pbnQgOiAnJ30ke2RlY2ltYWxzfWA7XG4gIHJldHVybiByZXQ7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGZvcmNlRmxvYXQsXG4gIG51bWJlckZvcm1hdHRlclxufTtcblxuIiwiLyogZXNsaW50IG5vLWNvbnNvbGU6IDAgKi9cblxuY29uc3QgYnV0dG9uSGVpZ2h0ID0gJzI1cHgnO1xuY29uc3QgYnV0dG9uU3RhcnQgPSAnNXB4JztcbmNvbnN0IGJ1dHRvblRvcCA9ICc1cHgnO1xuXG5sZXQgY29uc29sZU1lc3NhZ2VzID0gW107XG5jb25zdCBjb25zb2xlTG9nID0gY29uc29sZS5sb2cuYmluZChjb25zb2xlKTtcbmNvbnN0IGNvbnNvbGVPcmlnaW5hbCA9IHt9O1xuXG5mdW5jdGlvbiBjYXB0dXJlQ29uc29sZShjb25zb2xlRWxtLCBvcHRpb25zKSB7XG4gIGNvbnN0IHsgaW5kZW50ID0gMiwgc2hvd0xhc3RPbmx5ID0gZmFsc2UgfSA9IG9wdGlvbnM7XG4gIGNvbnN0IGhhbmRsZXIgPSBmdW5jdGlvbiBoYW5kbGVyKGFjdGlvbiwgLi4uYXJncykge1xuICAgIGlmIChzaG93TGFzdE9ubHkpIHtcbiAgICAgIGNvbnNvbGVNZXNzYWdlcyA9IFt7IFthY3Rpb25dOiBhcmdzIH1dO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlTWVzc2FnZXMucHVzaCh7IFthY3Rpb25dOiBhcmdzIH0pO1xuICAgIH1cblxuICAgIGNvbnNvbGVFbG0uaW5uZXJIVE1MID0gY29uc29sZU1lc3NhZ2VzLm1hcCgoZW50cnkpID0+IHtcbiAgICAgIGNvbnN0IGFjdGlvbiA9IE9iamVjdC5rZXlzKGVudHJ5KVswXTtcbiAgICAgIGNvbnN0IHZhbHVlcyA9IGVudHJ5W2FjdGlvbl07XG4gICAgICBjb25zdCBtZXNzYWdlID0gdmFsdWVzLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIFt1bmRlZmluZWQsIG51bGxdLmluY2x1ZGVzKGl0ZW0pIHx8XG4gICAgICAgICAgWydudW1iZXInLCAnc3RyaW5nJywgJ2Z1bmN0aW9uJ10uaW5jbHVkZXModHlwZW9mIGl0ZW0pXG4gICAgICAgICkgP1xuICAgICAgICAgIGl0ZW0gOlxuICAgICAgICAgIFsnTWFwJywgJ1NldCddLmluY2x1ZGVzKGl0ZW0uY29uc3RydWN0b3IubmFtZSkgP1xuICAgICAgICAgICAgYCR7aXRlbS5jb25zdHJ1Y3Rvci5uYW1lfSAoJHtKU09OLnN0cmluZ2lmeShbLi4uaXRlbV0pfSlgIDpcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KGl0ZW0sIChrZXksIHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgIGlmICgodHlwZW9mIHZhbHVlKSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS50b1N0cmluZygpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgIH0sIGluZGVudCk7XG4gICAgICB9KS5qb2luKCcsICcpO1xuXG4gICAgICBjb25zdCBjb2xvciA9IHtcbiAgICAgICAgbG9nOiAnIzAwMCcsXG4gICAgICAgIHdhcm46ICdvcmFuZ2UnLFxuICAgICAgICBlcnJvcjogJ2RhcmtyZWQnXG4gICAgICB9W2FjdGlvbl07XG5cbiAgICAgIHJldHVybiBgPHByZSBzdHlsZT1cImNvbG9yOiAke2NvbG9yfVwiPiR7bWVzc2FnZX08L3ByZT5gO1xuICAgIH0pLmpvaW4oJ1xcbicpO1xuICB9O1xuICBbJ2xvZycsICd3YXJuJywgJ2Vycm9yJ10uZm9yRWFjaCgoYWN0aW9uKSA9PiB7XG4gICAgY29uc29sZU9yaWdpbmFsW2FjdGlvbl0gPSBjb25zb2xlW2FjdGlvbl07XG4gICAgY29uc29sZVthY3Rpb25dID0gaGFuZGxlci5iaW5kKGNvbnNvbGUsIGFjdGlvbik7XG4gIH0pO1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCAoZXZ0KSA9PiB7XG4gICAgLy8gZXNsaW50IG5vLWNvbnNvbGU6IDBcbiAgICBjb25zb2xlLmVycm9yKGBcIiR7ZXZ0Lm1lc3NhZ2V9XCIgZnJvbSAke2V2dC5maWxlbmFtZX06JHtldnQubGluZW5vfWApO1xuICAgIGNvbnNvbGUuZXJyb3IoZXZ0LCBldnQuZXJyb3Iuc3RhY2spO1xuICAgIC8vIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9KTtcbiAgY29uc29sZUxvZygnY29uc29sZSBjYXB0dXJlZCcpO1xuICByZXR1cm4gZnVuY3Rpb24gcmVsZWFzZUNvbnNvbGUoKSB7XG4gICAgWydsb2cnLCAnd2FybicsICdlcnJvciddLmZvckVhY2goKGFjdGlvbikgPT4ge1xuICAgICAgY29uc29sZVthY3Rpb25dID0gY29uc29sZU9yaWdpbmFsW2FjdGlvbl07XG4gICAgfSk7XG4gICAgY29uc29sZUxvZygnY29uc29sZSByZWxlYXNlZCcpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVDb25zb2xlKHtcbiAgb3B0aW9ucyxcbiAgY29uc29sZVN0eWxlOiB7XG4gICAgYnRuU3RhcnQgPSBidXR0b25TdGFydCwgYnRuSGVpZ2h0ID0gYnV0dG9uSGVpZ2h0LFxuICAgIHdpZHRoID0gYGNhbGMoMTAwdncgLSAke2J0blN0YXJ0fSAtIDMwcHgpYCwgaGVpZ2h0ID0gJzQwMHB4JyxcbiAgICBiYWNrZ3JvdW5kID0gJ3JnYmEoMCwgMCwgMCwgMC41KSdcbiAgfVxufSkge1xuICBjb25zdCB7IHJ0bCA9IGZhbHNlIH0gPSBvcHRpb25zO1xuICBjb25zdCBjb25zb2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbnNvbGUuaWQgPSAnREJVSW9uU2NyZWVuQ29uc29sZSc7XG4gIGNvbnNvbGUuc3R5bGUuY3NzVGV4dCA9IGBcbiAgICBkaXNwbGF5OiBibG9jaztcbiAgICBtYXJnaW46IDBweDtcbiAgICBwYWRkaW5nOiA1cHg7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIG92ZXJmbG93OiBhdXRvO1xuICAgIHdpZHRoOiAke3dpZHRofTtcbiAgICBoZWlnaHQ6ICR7aGVpZ2h0fTtcbiAgICB0b3A6ICR7YnRuSGVpZ2h0fTtcbiAgICAke3J0bCA/ICdyaWdodCcgOiAnbGVmdCd9OiAwcHg7XG4gICAgYmFja2dyb3VuZDogJHtiYWNrZ3JvdW5kfTtcbiAgICB6LWluZGV4OiA5OTk5O1xuICAgIC13ZWJraXQtb3ZlcmZsb3ctc2Nyb2xsaW5nOiB0b3VjaFxuICAgIGA7XG4gIHJldHVybiBjb25zb2xlO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVCdXR0b24oe1xuICBvcHRpb25zLFxuICBidXR0b25TdHlsZToge1xuICAgIHBvc2l0aW9uID0gJ2ZpeGVkJyxcbiAgICB3aWR0aCA9ICcyNXB4JywgaGVpZ2h0ID0gYnV0dG9uSGVpZ2h0LCB0b3AgPSBidXR0b25Ub3AsIHN0YXJ0ID0gYnV0dG9uU3RhcnQsXG4gICAgYmFja2dyb3VuZCA9ICdyZ2JhKDAsIDAsIDAsIDAuNSknXG4gIH1cbn0pIHtcbiAgY29uc3QgeyBydGwgPSBmYWxzZSB9ID0gb3B0aW9ucztcbiAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGJ1dHRvbi5pZCA9ICdEQlVJb25TY3JlZW5Db25zb2xlVG9nZ2xlcic7XG4gIGJ1dHRvbi5zdHlsZS5jc3NUZXh0ID0gYFxuICAgIHBvc2l0aW9uOiAke3Bvc2l0aW9ufTtcbiAgICB3aWR0aDogJHt3aWR0aH07XG4gICAgaGVpZ2h0OiAke2hlaWdodH07XG4gICAgdG9wOiAke3RvcH07XG4gICAgJHtydGwgPyAncmlnaHQnIDogJ2xlZnQnfTogJHtzdGFydH07XG4gICAgYmFja2dyb3VuZDogJHtiYWNrZ3JvdW5kfTtcbiAgICB6LWluZGV4OiA5OTk5O1xuICAgIGA7XG4gIHJldHVybiBidXR0b247XG59XG5cbi8qKlxub25TY3JlZW5Db25zb2xlKHtcbiAgYnV0dG9uU3R5bGUgPSB7IHBvc2l0aW9uLCB3aWR0aCwgaGVpZ2h0LCB0b3AsIHN0YXJ0LCBiYWNrZ3JvdW5kIH0sXG4gIGNvbnNvbGVTdHlsZSA9IHsgd2lkdGgsIGhlaWdodCwgYmFja2dyb3VuZCB9LFxuICBvcHRpb25zID0geyBydGw6IGZhbHNlLCBpbmRlbnQsIHNob3dMYXN0T25seSB9XG59KVxuKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG9uU2NyZWVuQ29uc29sZSh7XG4gIGJ1dHRvblN0eWxlID0ge30sXG4gIGNvbnNvbGVTdHlsZSA9IHt9LFxuICBvcHRpb25zID0ge31cbn0gPSB7fSkge1xuICBjb25zdCBidXR0b24gPSBjcmVhdGVCdXR0b24oe1xuICAgIG9wdGlvbnMsXG4gICAgYnV0dG9uU3R5bGVcbiAgfSk7XG4gIGNvbnN0IGNvbnNvbGUgPSBjcmVhdGVDb25zb2xlKHtcbiAgICBjb25zb2xlU3R5bGU6IHtcbiAgICAgIC4uLmNvbnNvbGVTdHlsZSxcbiAgICAgIGJ0bkhlaWdodDogYnV0dG9uU3R5bGUuaGVpZ2h0LFxuICAgICAgYnRuU3RhcnQ6IGJ1dHRvblN0eWxlLnN0YXJ0XG4gICAgfSxcbiAgICBvcHRpb25zXG4gIH0pO1xuXG4gIGNvbnNvbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIH0pO1xuXG4gIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBpZiAoIWJ1dHRvbi5jb250YWlucyhjb25zb2xlKSkge1xuICAgICAgYnV0dG9uLmFwcGVuZENoaWxkKGNvbnNvbGUpO1xuICAgICAgY29uc29sZS5zY3JvbGxUb3AgPSBjb25zb2xlLnNjcm9sbEhlaWdodCAtIGNvbnNvbGUuY2xpZW50SGVpZ2h0O1xuICAgIH0gZWxzZSB7XG4gICAgICBidXR0b24ucmVtb3ZlQ2hpbGQoY29uc29sZSk7XG4gICAgfVxuICB9KTtcblxuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGJ1dHRvbik7XG4gIGNvbnN0IHJlbGVhc2VDb25zb2xlID0gY2FwdHVyZUNvbnNvbGUoY29uc29sZSwgb3B0aW9ucyk7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIHJlbGVhc2UoKSB7XG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChidXR0b24pO1xuICAgIHJlbGVhc2VDb25zb2xlKCk7XG4gIH07XG59XG4iLCIvKipcbiAqIGNvbnN0IHQgPSB0ZW1wbGF0ZWAkezB9ICR7MX0gJHsndHdvJ30gJHsndGhyZWUnfWA7XG4gKiBjb25zdCB0ciA9IHQoJ2EnLCAnYicsIHsgdHdvOiAnYycsIHRocmVlOiAnZCcgfSk7XG4gKiBleHBlY3QodHIpLnRvLmVxdWFsKCdhIGIgYyBkJyk7XG4gKiBAcGFyYW0gc3RyaW5nc1xuICogQHBhcmFtIGtleXNcbiAqIEByZXR1cm4ge2Z1bmN0aW9uKC4uLlsqXSl9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRlbXBsYXRlKHN0cmluZ3MsIC4uLmtleXMpIHtcbiAgcmV0dXJuICgoLi4udmFsdWVzKSA9PiB7XG4gICAgY29uc3QgZGljdCA9IHZhbHVlc1t2YWx1ZXMubGVuZ3RoIC0gMV0gfHwge307XG4gICAgY29uc3QgcmVzdWx0ID0gW3N0cmluZ3NbMF1dO1xuICAgIGtleXMuZm9yRWFjaCgoa2V5LCBpKSA9PiB7XG4gICAgICBjb25zdCB2YWx1ZSA9IE51bWJlci5pc0ludGVnZXIoa2V5KSA/IHZhbHVlc1trZXldIDogZGljdFtrZXldO1xuICAgICAgcmVzdWx0LnB1c2godmFsdWUsIHN0cmluZ3NbaSArIDFdKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0LmpvaW4oJycpO1xuICB9KTtcbn1cbiIsIlxuLy8gaW1wb3J0IG9uU2NyZWVuQ29uc29sZSBmcm9tICcuLi91dGlscy9vblNjcmVlbkNvbnNvbGUnO1xuXG5jb25zdCBfY3NzRGlzYWJsZVNlbGVjdGlvbiA9IChub2RlKSA9PiB7XG4gIGNvbnN0IHdpbiA9IG5vZGUub3duZXJEb2N1bWVudC5kZWZhdWx0VmlldztcbiAgY29uc3QgY3Vyc29yU3R5bGUgPSB3aW4uZ2V0Q29tcHV0ZWRTdHlsZShub2RlKS5jdXJzb3I7XG4gIGNvbnN0IG5ld0N1cnNvclN0eWxlID0gY3Vyc29yU3R5bGUgPT09ICdwb2ludGVyJyA/IGN1cnNvclN0eWxlIDogJ2RlZmF1bHQnO1xuICBub2RlLnN0eWxlLmN1cnNvciA9IG5ld0N1cnNvclN0eWxlO1xuICBub2RlLnN0eWxlLk1velVzZXJTZWxlY3QgPSAnbm9uZSc7XG4gIG5vZGUuc3R5bGUuV2Via2l0VXNlclNlbGVjdCA9ICdub25lJztcbiAgbm9kZS5zdHlsZS5Nc1VzZXJTZWxlY3QgPSAnbm9uZSc7XG4gIG5vZGUuc3R5bGUudXNlclNlbGVjdCA9ICdub25lJztcbn07XG5cbmNvbnN0IF9jc3NFbmFibGVTZWxlY3Rpb24gPSAobm9kZSkgPT4ge1xuICBub2RlLnN0eWxlLnJlbW92ZVByb3BlcnR5KCdjdXJzb3InKTtcbiAgbm9kZS5zdHlsZS5Nb3pVc2VyU2VsZWN0ID0gbnVsbDtcbiAgbm9kZS5zdHlsZS5XZWJraXRVc2VyU2VsZWN0ID0gbnVsbDtcbiAgbm9kZS5zdHlsZS5Nc1VzZXJTZWxlY3QgPSBudWxsO1xuICBub2RlLnN0eWxlLnVzZXJTZWxlY3QgPSBudWxsO1xufTtcblxuY29uc3QgX2pzRGlzYWJsZVNlbGVjdGlvbiA9IChub2RlKSA9PiB7XG4gIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgX2tpbGxTZWxlY3Rpb24pO1xuICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIF9raWxsU2VsZWN0aW9uKTtcbiAgbm9kZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgX2VuYWJsZVNlbGVjdGlvbik7XG4gIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBfZW5hYmxlU2VsZWN0aW9uKTtcbiAgbm9kZS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIF9lbmFibGVTZWxlY3Rpb24pO1xufTtcblxuY29uc3QgX2pzRW5hYmxlU2VsZWN0aW9uID0gKG5vZGUpID0+IHtcbiAgbm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBfa2lsbFNlbGVjdGlvbik7XG4gIG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgX2tpbGxTZWxlY3Rpb24pO1xuICBub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBfZW5hYmxlU2VsZWN0aW9uKTtcbiAgbm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIF9lbmFibGVTZWxlY3Rpb24pO1xuICBub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgX2VuYWJsZVNlbGVjdGlvbik7XG59O1xuXG5jb25zdCBfa2lsbFNlbGVjdGlvbiA9IChlKSA9PiB7XG4gIGNvbnN0IG5vZGUgPSBlLnRhcmdldDtcbiAgY29uc3QgZG9jID0gbm9kZS5vd25lckRvY3VtZW50O1xuICBjb25zdCB3aW4gPSBkb2MuZGVmYXVsdFZpZXc7XG4gIHN3aXRjaCAoZS50eXBlKSB7XG4gICAgY2FzZSAnbW91c2Vtb3ZlJzpcbiAgICBjYXNlICd0b3VjaG1vdmUnOlxuICAgICAgd2luLmdldFNlbGVjdGlvbiAmJiB3aW4uZ2V0U2VsZWN0aW9uKCkucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgLy8gcGFzc1xuICB9XG59O1xuXG5jb25zdCBfZGlzYWJsZVNlbGVjdGlvbiA9IChlKSA9PiB7XG4gIGNvbnN0IG5vZGUgPSBlLnRhcmdldDtcbiAgY29uc3QgZG9jID0gbm9kZS5vd25lckRvY3VtZW50O1xuICBjb25zdCB3aW4gPSBkb2MuZGVmYXVsdFZpZXc7XG4gIC8vIGZpcnN0IGNsZWFyIGFueSBjdXJyZW50IHNlbGVjdGlvblxuICB3aW4uZ2V0U2VsZWN0aW9uICYmIHdpbi5nZXRTZWxlY3Rpb24oKS5yZW1vdmVBbGxSYW5nZXMoKTtcbiAgLy8gdGhlbiBkaXNhYmxlIGZ1cnRoZXIgc2VsZWN0aW9uXG4gIC8vIDEuIGJ5IHN0eWxlXG4gIF9jc3NEaXNhYmxlU2VsZWN0aW9uKGRvYy5ib2R5KTtcbiAgLy8gMi4gYnkgYWRkaW5nIGV2ZW50IGxpc3RlbmVyc1xuICBfanNEaXNhYmxlU2VsZWN0aW9uKGRvYyk7XG59O1xuXG5jb25zdCBfZW5hYmxlU2VsZWN0aW9uID0gKGUpID0+IHtcbiAgY29uc3Qgbm9kZSA9IGUudGFyZ2V0O1xuICBjb25zdCBkb2MgPSBub2RlLm93bmVyRG9jdW1lbnQ7XG4gIC8vIGVuYWJsZSBmdXJ0aGVyIHNlbGVjdGlvblxuICAvLyAxLiBieSBzdHlsZVxuICBfY3NzRW5hYmxlU2VsZWN0aW9uKGRvYy5ib2R5KTtcbiAgLy8gMi4gYnkgcmVtb3ZpbmcgZXZlbnQgbGlzdGVuZXJzXG4gIF9qc0VuYWJsZVNlbGVjdGlvbihkb2MpO1xufTtcblxuY29uc3QgX2hhbmRsZVRhcFN0YXJ0ID0gKGUpID0+IHtcbiAgLy8gb24gdGFibGV0IGUucHJldmVudERlZmF1bHQoKSBwcmV2ZW50c1xuICAvLyAtIHNlbGVjdGlvbixcbiAgLy8gLSB0YXAtaGlnaGxpZ2h0LFxuICAvLyAtIHRyaWdnZXJpbmcvZG91YmxpbmcgY29ycmVzcG9uZGluZyBtb3VzZSBldmVudHMuXG4gIGUucHJldmVudERlZmF1bHQoKTsgLy8gY3NzIGRvdWJsZWQ6IC13ZWJraXQtdGFwLWhpZ2hsaWdodC1jb2xvcjpyZ2JhKDAsMCwwLDApO1xuICBfZGlzYWJsZVNlbGVjdGlvbihlKTtcbn07XG5cbmNvbnN0IGRpc2FibGVTZWxlY3Rpb24gPSAobm9kZSkgPT4ge1xuICAvLyBvblNjcmVlbkNvbnNvbGUoKTtcbiAgX2Nzc0Rpc2FibGVTZWxlY3Rpb24obm9kZSk7XG4gIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIF9oYW5kbGVUYXBTdGFydCk7XG4gIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgX2hhbmRsZVRhcFN0YXJ0KTtcbn07XG5cbmNvbnN0IGVuYWJsZVNlbGVjdGlvbiA9IChub2RlKSA9PiB7XG4gIF9jc3NFbmFibGVTZWxlY3Rpb24obm9kZSk7XG4gIG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIF9oYW5kbGVUYXBTdGFydCk7XG4gIG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgX2hhbmRsZVRhcFN0YXJ0KTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGlzYWJsZVNlbGVjdGlvbixcbiAgZW5hYmxlU2VsZWN0aW9uXG59O1xuIiwiXG5pbXBvcnQgZ2V0REJVSVdlYkNvbXBvbmVudENvcmUgZnJvbSAnLi4vREJVSVdlYkNvbXBvbmVudENvcmUvREJVSVdlYkNvbXBvbmVudENvcmUnO1xuaW1wb3J0IGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbiBmcm9tICcuLi8uLi8uLi9pbnRlcm5hbHMvZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uJztcbmltcG9ydCBvblNjcmVlbkNvbnNvbGUgZnJvbSAnLi4vLi4vLi4vdXRpbHMvb25TY3JlZW5Db25zb2xlJztcblxuY29uc3QgcmVnaXN0cmF0aW9uTmFtZSA9ICdkYnVpLWRyYWdnYWJsZSc7XG5cbmNvbnN0IGV2ZW50cyA9IHtcbiAgbW91c2U6IHtcbiAgICBtb3VzZW1vdmUoKSB7XG4gICAgICByZXR1cm4gKGV2dCkgPT4gZG9Nb3ZlKGV2dCk7XG4gICAgfSxcbiAgICBtb3VzZXVwKCkge1xuICAgICAgcmV0dXJuIChldnQpID0+IHVucmVnaXN0ZXJEb2N1bWVudEV2ZW50cyhldnQpO1xuICAgIH0sXG4gICAgbW91c2VvdXQoKSB7XG4gICAgICByZXR1cm4gKGV2dCkgPT4ge1xuICAgICAgICBjb25zdCBub2RlTmFtZSA9ICgoZXZ0LnJlbGF0ZWRUYXJnZXQgfHwge30pLm5vZGVOYW1lIHx8ICdIVE1MJykudG9TdHJpbmcoKTtcbiAgICAgICAgbm9kZU5hbWUgPT09ICdIVE1MJyAmJiB1bnJlZ2lzdGVyRG9jdW1lbnRFdmVudHMoZXZ0KTtcbiAgICAgIH07XG4gICAgfVxuICB9LFxuICB0b3VjaDoge1xuICAgIHRvdWNobW92ZSgpIHtcbiAgICAgIHJldHVybiAoZXZ0KSA9PiBkb01vdmUoZXZ0KTtcbiAgICB9LFxuICAgIHRvdWNoZW5kKCkge1xuICAgICAgcmV0dXJuIChldnQpID0+IHVucmVnaXN0ZXJEb2N1bWVudEV2ZW50cyhldnQpO1xuICAgIH0sXG4gICAgdG91Y2hjYW5jZWwoKSB7XG4gICAgICByZXR1cm4gKGV2dCkgPT4gdW5yZWdpc3RlckRvY3VtZW50RXZlbnRzKGV2dCk7XG4gICAgfVxuICB9XG59O1xuXG5jb25zdCBldmVudE9wdGlvbnMgPSB7IGNhcHR1cmU6IHRydWUsIHBhc3NpdmU6IGZhbHNlIH07XG5cbi8qKlxuICpcbiAqIEBwYXJhbSBldnQgVG91Y2hFdmVudCB8fCBNb3VzZUV2ZW50IGFsd2F5cyBjb21pbmcgZnJvbSBEcmFnZ2FibGVcbiAqL1xuZnVuY3Rpb24gcmVnaXN0ZXJEb2N1bWVudEV2ZW50cyhldnQpIHtcbiAgY29uc3QgdHlwZSA9IGlzVG91Y2hFdmVudChldnQpID8gJ3RvdWNoJyA6ICdtb3VzZSc7XG4gIGNvbnN0IHNlbGYgPSBldnQuY3VycmVudFRhcmdldDtcbiAgY29uc3QgeyBkb2MsIHdpbiB9ID0gZ2V0RG9jQW5kV2luKGV2dCk7XG5cbiAgaWYgKHR5cGUgPT09ICdtb3VzZScpIHtcbiAgICB3aW4uX2RidWlDdXJyZW50RWxlbWVudEJlaW5nRHJhZ2dlZCA9IHNlbGY7XG4gIH1cblxuICBpZiAoIXdpbi5fZGJ1aURyYWdnYWJsZVJlZ2lzdGVyZWRFdmVudHMpIHtcbiAgICB3aW4uX2RidWlEcmFnZ2FibGVSZWdpc3RlcmVkRXZlbnRzID0gbmV3IE1hcCgpO1xuICB9XG5cbiAgY29uc3QgbmV3RXZlbnRIYW5kbGVycyA9XG4gICAgT2JqZWN0LmtleXMoZXZlbnRzW3R5cGVdKS5yZWR1Y2UoKGFjYywgZXZlbnQpID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLmFjYyxcbiAgICAgICAgW2V2ZW50XTogZXZlbnRzW3R5cGVdW2V2ZW50XSgpXG4gICAgICB9O1xuICAgIH0sIHt9KTtcblxuICBpZiAoIXdpbi5fZGJ1aURyYWdnYWJsZVJlZ2lzdGVyZWRFdmVudHMuaGFzKHNlbGYpKSB7XG4gICAgd2luLl9kYnVpRHJhZ2dhYmxlUmVnaXN0ZXJlZEV2ZW50cy5zZXQoc2VsZiwgbmV3RXZlbnRIYW5kbGVycyk7XG4gICAgT2JqZWN0LmtleXMobmV3RXZlbnRIYW5kbGVycykuZm9yRWFjaCgoZXZlbnQpID0+IHtcbiAgICAgIGRvYy5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBuZXdFdmVudEhhbmRsZXJzW2V2ZW50XSwgZXZlbnRPcHRpb25zKTtcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqXG4gKiBAcGFyYW0gZXZ0IFRvdWNoRXZlbnQgfHwgTW91c2VFdmVudCBhbHdheXMgY29taW5nIGZyb20gRG9jdW1lbnRcbiAqL1xuZnVuY3Rpb24gdW5yZWdpc3RlckRvY3VtZW50RXZlbnRzKGV2dCkge1xuICBjb25zdCB0eXBlID0gaXNUb3VjaEV2ZW50KGV2dCkgPyAndG91Y2gnIDogJ21vdXNlJztcbiAgY29uc3QgeyBkb2MsIHdpbiB9ID0gZ2V0RG9jQW5kV2luKGV2dCk7XG5cbiAgY29uc3Qgc2VsZiA9IGdldEVsZW1lbnRCZWluZ0RyYWdnZWQoZXZ0KTtcblxuICBpZiAoIXNlbGYpIHtcbiAgICAvLyBtYXkgb2NjdXIgd2hlblxuICAgIC8vIDEuIHRvdWNoc3RhcnQgaW5zaWRlIGRyYWdnYWJsZVxuICAgIC8vIDIuIHRvdWNoc3RhcnQgb3V0c2lkZSBkcmFnZ2FibGVcbiAgICAvLyAzLiB0b3VjaGVuZCBvdXRzaWRlIGRyYWdnYWJsZSA9PiB0aGlzIGV2ZW50IGlzIG5vdCBmb3Igc2VsZlxuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGV2ZW50SGFuZGxlcnMgPSB3aW4uX2RidWlEcmFnZ2FibGVSZWdpc3RlcmVkRXZlbnRzLmdldChzZWxmKTtcblxuICBpZiAodHlwZSA9PT0gJ3RvdWNoJykge1xuICAgIGNvbnN0IHRvdWNoZXNOdW0gPSBBcnJheS5mcm9tKGV2dC50b3VjaGVzKS5yZWR1Y2UoKGFjYywgdG91Y2hFdnQpID0+IHtcbiAgICAgIGNvbnN0IHRhcmdldCA9IGdldEVsZW1lbnRCZWluZ0RyYWdnZWQodG91Y2hFdnQpO1xuICAgICAgaWYgKHRhcmdldCA9PT0gc2VsZikge1xuICAgICAgICByZXR1cm4gYWNjICsgMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBhY2M7XG4gICAgfSwgMCk7XG5cbiAgICBpZiAodG91Y2hlc051bSA+IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cblxuICBPYmplY3Qua2V5cyhldmVudEhhbmRsZXJzKS5mb3JFYWNoKChldmVudCkgPT4ge1xuICAgIGRvYy5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBldmVudEhhbmRsZXJzW2V2ZW50XSwgZXZlbnRPcHRpb25zKTtcbiAgfSk7XG4gIHdpbi5fZGJ1aUN1cnJlbnRFbGVtZW50QmVpbmdEcmFnZ2VkID0gbnVsbDtcbiAgd2luLl9kYnVpRHJhZ2dhYmxlUmVnaXN0ZXJlZEV2ZW50cy5kZWxldGUoc2VsZik7XG59XG5cbi8qKlxuICpcbiAqIEBwYXJhbSBldnQgVG91Y2ggfHwgVG91Y2hFdmVudCB8fCBNb3VzZUV2ZW50XG4gKiBAcmV0dXJuIE9iamVjdCB7IGRvYywgd2luIH1cbiAqL1xuZnVuY3Rpb24gZ2V0RG9jQW5kV2luKGV2dCkge1xuICAvLyBpZiB0YXJnZXQub3duZXJEb2N1bWVudCBpcyBudWxsIHRoZW4gdGFyZ2V0IGlzIGRvY3VtZW50XG4gIGNvbnN0IGRvYyA9IGV2dC50YXJnZXQub3duZXJEb2N1bWVudCB8fCBldnQudGFyZ2V0O1xuICBjb25zdCB3aW4gPSBkb2MuZGVmYXVsdFZpZXc7XG4gIHJldHVybiB7IGRvYywgd2luIH07XG59XG5cbi8qKlxuICpcbiAqIEBwYXJhbSBldnQgVG91Y2ggfHwgVG91Y2hFdmVudCB8fCBNb3VzZUV2ZW50XG4gKiBAcmV0dXJuIEJvb2xlYW5cbiAqL1xuZnVuY3Rpb24gaXNUb3VjaEV2ZW50KGV2dCkge1xuICBjb25zdCB7IHdpbiB9ID0gZ2V0RG9jQW5kV2luKGV2dCk7XG4gIHJldHVybiB3aW4uVG91Y2ggJiYgKChldnQgaW5zdGFuY2VvZiB3aW4uVG91Y2gpIHx8IChldnQgaW5zdGFuY2VvZiB3aW4uVG91Y2hFdmVudCkpO1xufVxuXG4vKipcbiAqXG4gKiBAcGFyYW0gZXZ0IFRvdWNoIHx8IFRvdWNoRXZlbnQgfHwgTW91c2VFdmVudCBjb21pbmcgZnJvbSBlaXRoZXIgRHJhZ2dhYmxlIG9yIERvY3VtZW50XG4gKiBAcmV0dXJuIEhUTUxFbGVtZW50IHx8IG51bGxcbiAqL1xuZnVuY3Rpb24gZ2V0RWxlbWVudEJlaW5nRHJhZ2dlZChldnQpIHtcbiAgY29uc3QgdHlwZSA9IGlzVG91Y2hFdmVudChldnQpID8gJ3RvdWNoJyA6ICdtb3VzZSc7XG4gIGNvbnN0IHsgd2luIH0gPSBnZXREb2NBbmRXaW4oZXZ0KTtcblxuICBpZiAodHlwZSA9PT0gJ21vdXNlJykge1xuICAgIHJldHVybiB3aW4uX2RidWlDdXJyZW50RWxlbWVudEJlaW5nRHJhZ2dlZDtcbiAgfVxuXG4gIGNvbnN0IGVsZW1lbnQgPSBldnQudGFyZ2V0O1xuXG4gIGlmIChlbGVtZW50Ll9kYnVpRHJhZ2dhYmxlKSB7XG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH1cblxuICBsZXQgcGFyZW50RWxlbWVudCA9IGVsZW1lbnQucGFyZW50RWxlbWVudDtcbiAgd2hpbGUgKHBhcmVudEVsZW1lbnQgJiYgIXBhcmVudEVsZW1lbnQuX2RidWlEcmFnZ2FibGUpIHtcbiAgICBwYXJlbnRFbGVtZW50ID0gcGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50O1xuICB9XG5cbiAgcmV0dXJuIHBhcmVudEVsZW1lbnQ7XG59XG5cbi8qKlxuICpcbiAqIEBwYXJhbSBldnQgRXZlbnQgY29taW5nIGZyb20gZWl0aGVyIERyYWdnYWJsZSBvciBEb2N1bWVudFxuICogQHJldHVybiBFdmVudCB8fCBudWxsXG4gKi9cbmZ1bmN0aW9uIGV4dHJhY3RTaW5nbGVFdmVudChldnQpIHtcbiAgcmV0dXJuIGlzVG91Y2hFdmVudChldnQpID9cbiAgICBBcnJheS5mcm9tKGV2dC50b3VjaGVzKS5maW5kKFxuICAgICAgKGUpID0+IGdldEVsZW1lbnRCZWluZ0RyYWdnZWQoZSkgPT09IGdldEVsZW1lbnRCZWluZ0RyYWdnZWQoZXZ0KVxuICAgICkgOlxuICAgIGV2dDtcbn1cblxuLyoqXG4gKlxuICogQHBhcmFtIGV2dCBNb3VzZUV2ZW50IHx8IFRvdWNoRXZlbnQgYWx3YXlzIGNvbWluZyBmcm9tIERyYWdnYWJsZVxuICogQHJldHVybiB7IHN0YXJ0WCwgc3RhcnRZLCB0cmFuc2xhdGVYLCB0cmFuc2xhdGVZLCB3aWR0aCwgaGVpZ2h0IH1cbiAqL1xuZnVuY3Rpb24gZ2V0TWVhc3VyZW1lbnRzKGV2dCkge1xuICBjb25zdCBzZWxmID0gZXZ0LmN1cnJlbnRUYXJnZXQ7XG4gIGNvbnN0IHdpbiA9IHNlbGYub3duZXJEb2N1bWVudC5kZWZhdWx0VmlldztcbiAgY29uc3QgdGFyZ2V0VG9EcmFnID0gc2VsZi5fdGFyZ2V0VG9EcmFnO1xuXG4gIGNvbnN0IG5vZGVDb21wdXRlZFN0eWxlID0gd2luLmdldENvbXB1dGVkU3R5bGUodGFyZ2V0VG9EcmFnLCBudWxsKTtcbiAgY29uc3QgbWF0cml4ID0gbm9kZUNvbXB1dGVkU3R5bGUudHJhbnNmb3JtLm1hdGNoKC8tP1xcZCpcXC4/XFxkKy9nKS5tYXAoTnVtYmVyKTtcbiAgY29uc3QgYm91bmRpbmdSZWN0ID0gdGFyZ2V0VG9EcmFnLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICBjb25zdCBleHRyYWN0ZWRFdmVudCA9IGV4dHJhY3RTaW5nbGVFdmVudChldnQpO1xuXG4gIGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gYm91bmRpbmdSZWN0O1xuICBjb25zdCB7IGNsaWVudFg6IHN0YXJ0WCwgY2xpZW50WTogc3RhcnRZIH0gPSBleHRyYWN0ZWRFdmVudDtcbiAgY29uc3QgW3RyYW5zbGF0ZVgsIHRyYW5zbGF0ZVldID0gW21hdHJpeFs0XSwgbWF0cml4WzVdXTtcblxuICByZXR1cm4ge1xuICAgIHN0YXJ0WCwgc3RhcnRZLCB0cmFuc2xhdGVYLCB0cmFuc2xhdGVZLCB3aWR0aCwgaGVpZ2h0XG4gIH07XG59XG5cbi8qKlxuICpcbiAqIEBwYXJhbSBldnQgTW91c2VFdmVudCBhbHdheXMgY29taW5nIGZyb20gRHJhZ2dhYmxlXG4gKi9cbmZ1bmN0aW9uIGhhbmRsZU1vdXNlRG93bihldnQpIHtcbiAgaWYgKGV2dC53aGljaCA9PT0gMykgcmV0dXJuO1xuICBvblBvaW50ZXJEb3duKGV2dCk7XG59XG5cbi8qKlxuICpcbiAqIEBwYXJhbSBldnQgVG91Y2hFdmVudCBhbHdheXMgY29taW5nIGZyb20gRHJhZ2dhYmxlXG4gKi9cbmZ1bmN0aW9uIGhhbmRsZVRvdWNoU3RhcnQoZXZ0KSB7XG4gIG9uUG9pbnRlckRvd24oZXZ0KTtcbn1cblxuLyoqXG4gKlxuICogQHBhcmFtIGV2dCBNb3VzZUV2ZW50IHx8IFRvdWNoRXZlbnQgYWx3YXlzIGNvbWluZyBmcm9tIERyYWdnYWJsZVxuICovXG5mdW5jdGlvbiBvblBvaW50ZXJEb3duKGV2dCkge1xuICBldnQucHJldmVudERlZmF1bHQoKTsgLy8gcHJldmVudHMgVG91Y2hFdmVudCB0byB0cmlnZ2VyIE1vdXNlRXZlbnRcbiAgY29uc3Qgc2VsZiA9IGV2dC5jdXJyZW50VGFyZ2V0O1xuICBzZWxmLl9tZWFzdXJlbWVudHMgPSBnZXRNZWFzdXJlbWVudHMoZXZ0KTtcbiAgcmVnaXN0ZXJEb2N1bWVudEV2ZW50cyhldnQpO1xufVxuXG4vKipcbiAqXG4gKiBAcGFyYW0gZXZ0IE1vdXNlRXZlbnQgKG1vdXNlbW92ZSkgfHwgVG91Y2hFdmVudCAodG91Y2htb3ZlKSBhbHdheXMgY29taW5nIGZyb20gRG9jdW1lbnRcbiAqL1xuZnVuY3Rpb24gZG9Nb3ZlKF9ldnQpIHtcbiAgX2V2dC5wcmV2ZW50RGVmYXVsdCgpOyAvLyBwcmV2ZW50IHNlbGVjdGlvbiBhbmQgc2Nyb2xsaW5nXG4gIGNvbnN0IGV2dCA9IGV4dHJhY3RTaW5nbGVFdmVudChfZXZ0KTtcblxuICBpZiAoIWV2dCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHNlbGYgPSBnZXRFbGVtZW50QmVpbmdEcmFnZ2VkKGV2dCk7XG5cbiAgaWYgKCFzZWxmKSB7XG4gICAgLy8gbWF5IG9jY3VyIHdoZW5cbiAgICAvLyAxLiB0b3VjaHN0YXJ0IGluc2lkZSBkcmFnZ2FibGVcbiAgICAvLyAyLiB0b3VjaHN0YXJ0IG91dHNpZGUgZHJhZ2dhYmxlXG4gICAgLy8gMy4gdG91Y2htb3ZlIG91dHNpZGUgZHJhZ2dhYmxlID0+IHRoaXMgZXZlbnQgaXMgbm90IGZvciBzZWxmXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgeyB3aW4gfSA9IGdldERvY0FuZFdpbihldnQpO1xuXG4gIGlmIChzZWxmLl9kcmFnUnVubmluZykgeyByZXR1cm47IH1cbiAgc2VsZi5fZHJhZ1J1bm5pbmcgPSB0cnVlO1xuICB3aW4ucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICBpZiAoIXNlbGYuaXNNb3VudGVkKSB7IC8vIG1pZ2h0IGJlIHVubW91bnRlZCBtZWFud2hpbGVcbiAgICAgIHNlbGYuX2RyYWdSdW5uaW5nID0gZmFsc2U7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qge1xuICAgICAgc3RhcnRYLCBzdGFydFksIHRyYW5zbGF0ZVgsIHRyYW5zbGF0ZVksIHdpZHRoLCBoZWlnaHRcbiAgICB9ID0gc2VsZi5fbWVhc3VyZW1lbnRzO1xuICAgIGNvbnN0IFtkaXN0YW5jZVgsIGRpc3RhbmNlWV0gPSBbZXZ0LmNsaWVudFggLSBzdGFydFgsIGV2dC5jbGllbnRZIC0gc3RhcnRZXTtcblxuICAgIGNvbnN0IG5leHRUcmFuc2xhdGVYID0gdHJhbnNsYXRlWCArIGRpc3RhbmNlWDtcbiAgICBjb25zdCBuZXh0VHJhbnNsYXRlWSA9IHRyYW5zbGF0ZVkgKyBkaXN0YW5jZVk7XG5cbiAgICBjb25zdCB7IHRyYW5zbGF0ZVg6IHJldmlzZWRUcmFuc2xhdGVYLCB0cmFuc2xhdGVZOiByZXZpc2VkVHJhbnNsYXRlWSB9ID1cbiAgICAgIHNlbGYuYXBwbHlDb3JyZWN0aW9uKHsgdHJhbnNsYXRlWDogbmV4dFRyYW5zbGF0ZVgsIHRyYW5zbGF0ZVk6IG5leHRUcmFuc2xhdGVZLCB3aWR0aCwgaGVpZ2h0IH0pO1xuXG4gICAgc2VsZi50cmFuc2xhdGVYID0gcmV2aXNlZFRyYW5zbGF0ZVg7XG4gICAgc2VsZi50cmFuc2xhdGVZID0gcmV2aXNlZFRyYW5zbGF0ZVk7XG5cbiAgICAvLyBjb25zdCB0YXJnZXRUb0RyYWcgPSBzZWxmLl90YXJnZXRUb0RyYWc7XG4gICAgLy8gdGFyZ2V0VG9EcmFnLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoJHtyZXZpc2VkVHJhbnNsYXRlWH1weCwke3JldmlzZWRUcmFuc2xhdGVZfXB4KWA7XG5cbiAgICBzZWxmLmRpc3BhdGNoRXZlbnQobmV3IHdpbi5DdXN0b21FdmVudCgndHJhbnNsYXRlJywge1xuICAgICAgZGV0YWlsOiB7XG4gICAgICAgIHRyYW5zbGF0ZVg6IHJldmlzZWRUcmFuc2xhdGVYLFxuICAgICAgICB0cmFuc2xhdGVZOiByZXZpc2VkVHJhbnNsYXRlWVxuICAgICAgfVxuICAgIH0pKTtcbiAgICBzZWxmLl9kcmFnUnVubmluZyA9IGZhbHNlO1xuICB9KTtcbn1cblxuLypcblRPRE86XG4xLlxuZGlyIHJ0bCA/XG4yLlxuYXR0cmlidXRlQ2hhbmdlZFxuMy5cbnByZWRlZmluZWQgY29uc3RyYWludHNcbjQuXG5zdGVwcyA/XG41Llxud3JpdGUgZnJvbSB0aGUgb3V0c2lkZVxuNi5cbndvcmsgd2l0aCByZWFjdFxuKi9cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0REJVSURyYWdnYWJsZSh3aW4pIHtcbiAgcmV0dXJuIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbih3aW4sIHJlZ2lzdHJhdGlvbk5hbWUsICgpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBEQlVJV2ViQ29tcG9uZW50QmFzZSxcbiAgICAgIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMsXG4gICAgICBSZWdpc3RlcmFibGVcbiAgICB9ID0gZ2V0REJVSVdlYkNvbXBvbmVudENvcmUod2luKTtcblxuICAgIC8vIG9uU2NyZWVuQ29uc29sZSgpO1xuXG4gICAgY2xhc3MgREJVSURyYWdnYWJsZSBleHRlbmRzIERCVUlXZWJDb21wb25lbnRCYXNlIHtcblxuICAgICAgc3RhdGljIGdldCByZWdpc3RyYXRpb25OYW1lKCkge1xuICAgICAgICByZXR1cm4gcmVnaXN0cmF0aW9uTmFtZTtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCB0ZW1wbGF0ZUlubmVySFRNTCgpIHtcbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgICA8c3R5bGU+XG4gICAgICAgICAgOmhvc3Qge1xuICAgICAgICAgICAgYWxsOiBpbml0aWFsO1xuICAgICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICAgICAgdG91Y2gtYWN0aW9uOiBub25lO1xuICAgICAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICA6aG9zdChbZGJ1aS1kaXI9bHRyXSkge1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICA6aG9zdChbZGJ1aS1kaXI9cnRsXSkge1xuICAgICAgICAgIH1cbiAgICAgICAgICA8L3N0eWxlPlxuICAgICAgICAgIDxzbG90Pjwvc2xvdD5cbiAgICAgICAgYDtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCBwcm9wZXJ0aWVzVG9VcGdyYWRlKCkge1xuICAgICAgICByZXR1cm4gWy4uLnN1cGVyLnByb3BlcnRpZXNUb1VwZ3JhZGUsICdhcHBseUNvcnJlY3Rpb24nLCAndHJhbnNsYXRlWCcsICd0cmFuc2xhdGVZJywgJ2RyYWdUYXJnZXQnXTtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7XG4gICAgICAgIHJldHVybiBbLi4uc3VwZXIub2JzZXJ2ZWRBdHRyaWJ1dGVzLCAndHJhbnNsYXRlLXgnLCAndHJhbnNsYXRlLXknLCAnZHJhZy10YXJnZXQnXTtcbiAgICAgIH1cblxuICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuX2NhY2hlZFRhcmdldFRvRHJhZyA9IG51bGw7XG4gICAgICAgIHRoaXMuX2RidWlEcmFnZ2FibGUgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBnZXQgdHJhbnNsYXRlWCgpIHtcbiAgICAgICAgcmV0dXJuIE51bWJlcih0aGlzLmdldEF0dHJpYnV0ZSgndHJhbnNsYXRlLXgnKSkgfHwgMDtcbiAgICAgIH1cblxuICAgICAgc2V0IHRyYW5zbGF0ZVgodmFsdWUpIHtcbiAgICAgICAgY29uc3QgbmV3VmFsdWUgPSAoTnVtYmVyKHZhbHVlKSB8fCAwKS50b1N0cmluZygpO1xuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZSgndHJhbnNsYXRlLXgnLCBuZXdWYWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIGdldCB0cmFuc2xhdGVZKCkge1xuICAgICAgICByZXR1cm4gTnVtYmVyKHRoaXMuZ2V0QXR0cmlidXRlKCd0cmFuc2xhdGUteScpKSB8fCAwO1xuICAgICAgfVxuXG4gICAgICBzZXQgdHJhbnNsYXRlWSh2YWx1ZSkge1xuICAgICAgICBjb25zdCBuZXdWYWx1ZSA9IChOdW1iZXIodmFsdWUpIHx8IDApLnRvU3RyaW5nKCk7XG4gICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCd0cmFuc2xhdGUteScsIG5ld1ZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgZ2V0IGRyYWdUYXJnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZSgnZHJhZy10YXJnZXQnKTtcbiAgICAgIH1cblxuICAgICAgc2V0IGRyYWdUYXJnZXQodmFsdWUpIHtcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2RyYWctdGFyZ2V0JywgdmFsdWUudG9TdHJpbmcoKSk7XG4gICAgICB9XG5cbiAgICAgIGdldCBfdGFyZ2V0VG9EcmFnKCkge1xuICAgICAgICBpZiAodGhpcy5fY2FjaGVkVGFyZ2V0VG9EcmFnKSByZXR1cm4gdGhpcy5fY2FjaGVkVGFyZ2V0VG9EcmFnO1xuICAgICAgICBjb25zdCB0YXJnZXRUb0RyYWcgPVxuICAgICAgICAgIHRoaXMuZ2V0Um9vdE5vZGUoKS5xdWVyeVNlbGVjdG9yKHRoaXMuZ2V0QXR0cmlidXRlKCdkcmFnLXRhcmdldCcpKSB8fCB0aGlzO1xuICAgICAgICB0aGlzLl9jYWNoZWRUYXJnZXRUb0RyYWcgPSB0YXJnZXRUb0RyYWc7XG4gICAgICAgIHJldHVybiB0aGlzLl9jYWNoZWRUYXJnZXRUb0RyYWc7XG4gICAgICB9XG5cbiAgICAgIF9pbml0aWFsaXplVGFyZ2V0VG9EcmFnKCkge1xuICAgICAgICB0aGlzLl9jYWNoZWRUYXJnZXRUb0RyYWcgPSBudWxsOyAvLyBuZWVkZWQgd2hlbiBkcmFnLXRhcmdldCBhdHRyaWJ1dGUgY2hhbmdlc1xuICAgICAgICBjb25zdCB0YXJnZXRUb0RyYWcgPSB0aGlzLl90YXJnZXRUb0RyYWc7XG4gICAgICAgIHRhcmdldFRvRHJhZy5zZXRBdHRyaWJ1dGUoJ2RidWktZHJhZ2dhYmxlLXRhcmdldCcsICcnKTtcbiAgICAgICAgdGFyZ2V0VG9EcmFnLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoJHt0aGlzLnRyYW5zbGF0ZVh9cHgsJHt0aGlzLnRyYW5zbGF0ZVl9cHgpYDtcbiAgICAgICAgdGFyZ2V0VG9EcmFnLnN0eWxlLnRyYW5zZm9ybU9yaWdpbiA9ICdjZW50ZXInO1xuICAgICAgfVxuXG4gICAgICBfcmVzZXRUYXJnZXRUb0RyYWcoKSB7XG4gICAgICAgIGNvbnN0IHRhcmdldFRvRHJhZyA9IHRoaXMuX3RhcmdldFRvRHJhZztcbiAgICAgICAgdGFyZ2V0VG9EcmFnLnJlbW92ZUF0dHJpYnV0ZSgnZGJ1aS1kcmFnZ2FibGUtdGFyZ2V0Jyk7XG4gICAgICAgIHRoaXMuX2NhY2hlZFRhcmdldFRvRHJhZyA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIG9uQ29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCd1bnNlbGVjdGFibGUnLCAnJyk7XG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgaGFuZGxlTW91c2VEb3duLCBldmVudE9wdGlvbnMpO1xuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBoYW5kbGVUb3VjaFN0YXJ0LCBldmVudE9wdGlvbnMpO1xuICAgICAgICB0aGlzLl9pbml0aWFsaXplVGFyZ2V0VG9EcmFnKCk7XG4gICAgICB9XG5cbiAgICAgIG9uRGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCd1bnNlbGVjdGFibGUnKTtcbiAgICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBoYW5kbGVNb3VzZURvd24sIGV2ZW50T3B0aW9ucyk7XG4gICAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIGhhbmRsZVRvdWNoU3RhcnQsIGV2ZW50T3B0aW9ucyk7XG4gICAgICAgIHRoaXMuX3Jlc2V0VGFyZ2V0VG9EcmFnKCk7XG4gICAgICB9XG5cbiAgICAgIG9uQXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSkge1xuICAgICAgICBsZXQgdmFsdWVUb1NldCA9IG51bGw7XG4gICAgICAgIHN3aXRjaCAobmFtZSkge1xuICAgICAgICAgIGNhc2UgJ3RyYW5zbGF0ZS14JzpcbiAgICAgICAgICAgIHZhbHVlVG9TZXQgPSAoTnVtYmVyKG5ld1ZhbHVlKSB8fCAwKS50b1N0cmluZygpO1xuICAgICAgICAgICAgdGhpcy5fdGFyZ2V0VG9EcmFnLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoJHt2YWx1ZVRvU2V0fXB4LCR7dGhpcy50cmFuc2xhdGVZfXB4KWA7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICd0cmFuc2xhdGUteSc6XG4gICAgICAgICAgICB2YWx1ZVRvU2V0ID0gKE51bWJlcihuZXdWYWx1ZSkgfHwgMCkudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIHRoaXMuX3RhcmdldFRvRHJhZy5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7dGhpcy50cmFuc2xhdGVYfXB4LCR7dmFsdWVUb1NldH1weClgO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnZHJhZy10YXJnZXQnOlxuICAgICAgICAgICAgdGhpcy5fcmVzZXRUYXJnZXRUb0RyYWcoKTtcbiAgICAgICAgICAgIHRoaXMuX2luaXRpYWxpemVUYXJnZXRUb0RyYWcoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAvLyBwYXNzXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBDYW4gYmUgb3ZlcnJpZGRlblxuICAgICAgICogQHBhcmFtIHRyYW5zbGF0ZVggTnVtYmVyXG4gICAgICAgKiBAcGFyYW0gdHJhbnNsYXRlWSBOdW1iZXJcbiAgICAgICAqIEByZXR1cm4gT2JqZWN0IHsgdHJhbnNsYXRlWDogTnVtYmVyLCB0cmFuc2xhdGVZOiBOdW1iZXIgfVxuICAgICAgICovXG4gICAgICBhcHBseUNvcnJlY3Rpb24oeyB0cmFuc2xhdGVYLCB0cmFuc2xhdGVZIH0pIHtcbiAgICAgICAgcmV0dXJuIHsgdHJhbnNsYXRlWCwgdHJhbnNsYXRlWSB9O1xuICAgICAgfVxuXG4gICAgfVxuXG4gICAgcmV0dXJuIFJlZ2lzdGVyYWJsZShcbiAgICAgIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMoXG4gICAgICAgIERCVUlEcmFnZ2FibGVcbiAgICAgIClcbiAgICApO1xuICB9KTtcbn1cblxuZ2V0REJVSURyYWdnYWJsZS5yZWdpc3RyYXRpb25OYW1lID0gcmVnaXN0cmF0aW9uTmFtZTtcblxuIiwiXG5pbXBvcnQgZ2V0REJVSVdlYkNvbXBvbmVudENvcmUgZnJvbSAnLi4vREJVSVdlYkNvbXBvbmVudENvcmUvREJVSVdlYkNvbXBvbmVudENvcmUnO1xuaW1wb3J0IGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbiBmcm9tICcuLi8uLi8uLi9pbnRlcm5hbHMvZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uJztcblxuY29uc3QgcmVnaXN0cmF0aW9uTmFtZSA9ICdkYnVpLWR1bW15JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0REJVSUR1bW15KHdpbikge1xuICByZXR1cm4gZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uKHdpbiwgcmVnaXN0cmF0aW9uTmFtZSwgKCkgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIERCVUlXZWJDb21wb25lbnRCYXNlLFxuICAgICAgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyxcbiAgICAgIFJlZ2lzdGVyYWJsZVxuICAgIH0gPSBnZXREQlVJV2ViQ29tcG9uZW50Q29yZSh3aW4pO1xuXG4gICAgY2xhc3MgREJVSUR1bW15IGV4dGVuZHMgREJVSVdlYkNvbXBvbmVudEJhc2Uge1xuXG4gICAgICBzdGF0aWMgZ2V0IHJlZ2lzdHJhdGlvbk5hbWUoKSB7XG4gICAgICAgIHJldHVybiByZWdpc3RyYXRpb25OYW1lO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlSW5uZXJIVE1MKCkge1xuICAgICAgICByZXR1cm4gYFxuICAgICAgICAgIDxzdHlsZT5cbiAgICAgICAgICA6aG9zdCB7XG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgIG1heC13aWR0aDogNDAwcHg7XG4gICAgICAgICAgICBoZWlnaHQ6IHZhcigtLWRidWktaW5wdXQtaGVpZ2h0LCA1MHB4KTtcbiAgICAgICAgICAgIGNvbG9yOiBtYXJvb247XG4gICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCBncmF5O1xuICAgICAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgOmhvc3QgYiwgOmhvc3QgZGl2W3gtaGFzLXNsb3RdIHNwYW5beC1zbG90LXdyYXBwZXJdIHtcbiAgICAgICAgICAgIHVuaWNvZGUtYmlkaTogYmlkaS1vdmVycmlkZTtcbiAgICAgICAgICAgIHRleHQtc2hhZG93OiB2YXIoLS1kdW1teS1iLXRleHQtc2hhZG93LCBub25lKTtcbiAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgOmhvc3QoW2Rpcj1ydGxdKSBiIHtcbiAgICAgICAgICAgIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICA6aG9zdChbZGlyPWx0cl0pIGIge1xuICAgICAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiBvdmVybGluZTtcbiAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgOmhvc3QoW2Rpcj1sdHJdKSAjY29udGFpbmVyID4gZGl2W2Rpcj1ydGxdLFxuICAgICAgICAgIDpob3N0KFtkaXI9cnRsXSkgI2NvbnRhaW5lciA+IGRpdltkaXI9bHRyXSB7XG4gICAgICAgICAgICBkaXNwbGF5OiBub25lO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICA6aG9zdCAjY29udGFpbmVyID4gZGl2W3gtaGFzLXNsb3RdIHtcbiAgICAgICAgICAgIG1hcmdpbi1sZWZ0OiAwcHg7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgICNjb250YWluZXIge1xuICAgICAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgZmxleC1mbG93OiByb3cgbm93cmFwO1xuICAgICAgICAgICAgYWxpZ24taXRlbXM6IHN0cmV0Y2g7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgICNjb250YWluZXIgPiBkaXYge1xuICAgICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgZ3JheTtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IHZhcigtLWR1bW15LWlubmVyLXNlY3Rpb25zLWJvcmRlci1yYWRpdXMsIDBweCk7XG4gICAgICAgICAgICBmbGV4OiAxIDAgMCU7XG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgbWFyZ2luOiA1cHg7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgICNjb250YWluZXIgPiBkaXYgPiBkaXYge1xuICAgICAgICAgICAgbWFyZ2luOiBhdXRvO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICA8L3N0eWxlPlxuICAgICAgICAgIFxuICAgICAgICAgIDxkaXYgaWQ9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgIDxkaXYgZGlyPVwibHRyXCI+XG4gICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGI+RHVtbXkgc2hhZG93PC9iPiBbTFRSXVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgXG4gICAgICAgICAgICA8ZGl2IHgtaGFzLXNsb3Q+XG4gICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPHNwYW4+Wzwvc3Bhbj48c3BhbiB4LXNsb3Qtd3JhcHBlcj48c2xvdD48L3Nsb3Q+PC9zcGFuPjxzcGFuPl08L3NwYW4+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIDxkaXYgZGlyPVwicnRsXCI+XG4gICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGI+RHVtbXkgc2hhZG93PC9iPiBbUlRMXVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBSZWdpc3RlcmFibGUoXG4gICAgICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzKFxuICAgICAgICBEQlVJRHVtbXlcbiAgICAgIClcbiAgICApO1xuICB9KTtcbn1cblxuZ2V0REJVSUR1bW15LnJlZ2lzdHJhdGlvbk5hbWUgPSByZWdpc3RyYXRpb25OYW1lO1xuXG4iLCJcblxuaW1wb3J0IGdldERCVUlXZWJDb21wb25lbnRDb3JlIGZyb20gJy4uL0RCVUlXZWJDb21wb25lbnRDb3JlL0RCVUlXZWJDb21wb25lbnRDb3JlJztcbmltcG9ydCBnZXREQlVJRHVtbXkgZnJvbSAnLi4vREJVSUR1bW15L0RCVUlEdW1teSc7XG5pbXBvcnQgZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uIGZyb20gJy4uLy4uLy4uL2ludGVybmFscy9lbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24nO1xuXG5jb25zdCByZWdpc3RyYXRpb25OYW1lID0gJ2RidWktZHVtbXktcGFyZW50JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0REJVSUR1bW15UGFyZW50KHdpbikge1xuICByZXR1cm4gZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uKHdpbiwgcmVnaXN0cmF0aW9uTmFtZSwgKCkgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIERCVUlXZWJDb21wb25lbnRCYXNlLFxuICAgICAgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyxcbiAgICAgIFJlZ2lzdGVyYWJsZVxuICAgIH0gPSBnZXREQlVJV2ViQ29tcG9uZW50Q29yZSh3aW4pO1xuICAgIGNvbnN0IERCVUlEdW1teSA9IGdldERCVUlEdW1teSh3aW4pO1xuXG4gICAgY2xhc3MgREJVSUR1bW15UGFyZW50IGV4dGVuZHMgREJVSVdlYkNvbXBvbmVudEJhc2Uge1xuXG4gICAgICBzdGF0aWMgZ2V0IHJlZ2lzdHJhdGlvbk5hbWUoKSB7XG4gICAgICAgIHJldHVybiByZWdpc3RyYXRpb25OYW1lO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlSW5uZXJIVE1MKCkge1xuICAgICAgICByZXR1cm4gYFxuICAgICAgICAgIDxzdHlsZT5cbiAgICAgICAgICA6aG9zdCB7XG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgIG1heC13aWR0aDogNDAwcHg7XG4gICAgICAgICAgfVxuICAgICAgICAgIDwvc3R5bGU+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxiPkR1bW15IFBhcmVudCBzaGFkb3c8L2I+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxkYnVpLWR1bW15PjxzbG90Pjwvc2xvdD48L2RidWktZHVtbXk+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCBkZXBlbmRlbmNpZXMoKSB7XG4gICAgICAgIHJldHVybiBbREJVSUR1bW15XTtcbiAgICAgIH1cblxuICAgIH1cblxuICAgIHJldHVybiBSZWdpc3RlcmFibGUoXG4gICAgICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzKFxuICAgICAgICBEQlVJRHVtbXlQYXJlbnRcbiAgICAgIClcbiAgICApO1xuICB9KTtcbn1cblxuZ2V0REJVSUR1bW15UGFyZW50LnJlZ2lzdHJhdGlvbk5hbWUgPSByZWdpc3RyYXRpb25OYW1lO1xuXG4iLCJcbi8qIGVzbGludCBtYXgtbGVuOiAwICovXG5cbmltcG9ydCBnZXREQlVJV2ViQ29tcG9uZW50Q29yZSBmcm9tICcuLi9EQlVJV2ViQ29tcG9uZW50Q29yZS9EQlVJV2ViQ29tcG9uZW50Q29yZSc7XG5pbXBvcnQgZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uIGZyb20gJy4uLy4uLy4uL2ludGVybmFscy9lbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24nO1xuaW1wb3J0IEZvY3VzYWJsZSBmcm9tICcuLi8uLi9kZWNvcmF0b3JzL0ZvY3VzYWJsZSc7XG5cbmNvbnN0IHJlZ2lzdHJhdGlvbk5hbWUgPSAnZGJ1aS1mb3JtLWlucHV0LXRleHQnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXREQlVJRm9ybUlucHV0VGV4dCh3aW4pIHtcbiAgcmV0dXJuIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbih3aW4sIHJlZ2lzdHJhdGlvbk5hbWUsICgpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBEQlVJV2ViQ29tcG9uZW50QmFzZSxcbiAgICAgIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMsXG4gICAgICBSZWdpc3RlcmFibGVcbiAgICB9ID0gZ2V0REJVSVdlYkNvbXBvbmVudENvcmUod2luKTtcblxuICAgIGNsYXNzIERCVUlGb3JtSW5wdXRUZXh0IGV4dGVuZHMgREJVSVdlYkNvbXBvbmVudEJhc2Uge1xuXG4gICAgICBzdGF0aWMgZ2V0IHJlZ2lzdHJhdGlvbk5hbWUoKSB7XG4gICAgICAgIHJldHVybiByZWdpc3RyYXRpb25OYW1lO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlSW5uZXJIVE1MKCkge1xuICAgICAgICAvLyBub2luc3BlY3Rpb24gQ3NzVW5yZXNvbHZlZEN1c3RvbVByb3BlcnR5XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgICAgPHN0eWxlPlxuICAgICAgICAgIDpob3N0IHtcbiAgICAgICAgICAgIGFsbDogaW5pdGlhbDsgXG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgIC8qaGVpZ2h0OiB2YXIoLS1kYnVpLWZvcm0taW5wdXQtaGVpZ2h0KTsqL1xuICAgICAgICAgICAgLypsaW5lLWhlaWdodDogdmFyKC0tZGJ1aS1mb3JtLWlucHV0LWhlaWdodCk7Ki9cbiAgICAgICAgICAgIGhlaWdodDogMzAwcHg7XG4gICAgICAgICAgICBwYWRkaW5nOiAwcHg7XG4gICAgICAgICAgICBmb250LXNpemU6IDE4cHg7XG4gICAgICAgICAgICBjb2xvcjogdmFyKC0tZGJ1aS1mb3JtLWlucHV0LWNvbG9yKTtcbiAgICAgICAgICAgIC8qYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZGJ1aS1mb3JtLWlucHV0LWJhY2tncm91bmQtY29sb3IpOyovXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMTAwLCAwLCAwLjEpO1xuICAgICAgICAgICAgdW5pY29kZS1iaWRpOiBiaWRpLW92ZXJyaWRlO1xuICAgICAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAgICAgICAgIGJvcmRlcjogbm9uZTtcbiAgICAgICAgICAgIGJvcmRlci1ib3R0b206IHZhcigtLWRidWktZm9ybS1pbnB1dC1ib3JkZXItd2lkdGgpIHZhcigtLWRidWktZm9ybS1pbnB1dC1ib3JkZXItc3R5bGUpIHZhcigtLWRidWktZm9ybS1pbnB1dC1ib3JkZXItY29sb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICA6aG9zdCBbdGFiaW5kZXhdIHtcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgaGVpZ2h0OiA1MHB4O1xuICAgICAgICAgICAgbGluZS1oZWlnaHQ6IDUwcHg7XG4gICAgICAgICAgICBib3JkZXI6IG5vbmU7XG4gICAgICAgICAgICBtYXJnaW46IDBweDtcbiAgICAgICAgICAgIHBhZGRpbmc6IDBweDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMHB4O1xuICAgICAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAgICAgICAgIHVuaWNvZGUtYmlkaTogYmlkaS1vdmVycmlkZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgOmhvc3QgW3RhYmluZGV4XTpmb2N1cyB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMCwgMCwgLjMpO1xuICAgICAgICAgICAgb3V0bGluZTogbm9uZTtcbiAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgOmhvc3QoW2ZvY3VzZWRdKSB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDI1NSwgMCwgLjMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICAvKjpob3N0KFtkaXNhYmxlZF0pIHsqL1xuICAgICAgICAgICAgLypiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIC4zKTsqL1xuICAgICAgICAgIC8qfSovXG4gICAgXG4gICAgICAgICAgOmhvc3QoW2hpZGRlbl0pIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgICAgICAgfVxuICAgIFxuICAgICAgICAgIDpob3N0KFtkaXI9cnRsXSkge1xuICAgICAgICAgIFxuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICA6aG9zdChbZGlyPWx0cl0pIHtcbiAgICAgICAgICBcbiAgICAgICAgICB9XG4gICAgICAgICAgPC9zdHlsZT5cbiAgICAgICAgICA8cD5EQlVJRm9ybUlucHV0VGV4dDwvcD5cbiAgICAgICAgICA8ZGl2IGNvbnRlbnRlZGl0YWJsZT1cInRydWVcIiB0YWJpbmRleD1cIjBcIj48L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNvbnRlbnRlZGl0YWJsZT1cInRydWVcIiB0YWJpbmRleD1cIjBcIj48L2Rpdj5cbiAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiB0YWJpbmRleD1cIjBcIiAvPlxuICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIHRhYmluZGV4PVwiMFwiIC8+XG4gICAgICAgIGA7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgYXR0cmlidXRlc1RvRGVmaW5lKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHJvbGU6ICdmb3JtLWlucHV0J1xuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgfVxuXG4gICAgcmV0dXJuIFJlZ2lzdGVyYWJsZShcbiAgICAgIEZvY3VzYWJsZShcbiAgICAgICAgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyhcbiAgICAgICAgICBEQlVJRm9ybUlucHV0VGV4dFxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcblxuICB9KTtcbn1cblxuZ2V0REJVSUZvcm1JbnB1dFRleHQucmVnaXN0cmF0aW9uTmFtZSA9IHJlZ2lzdHJhdGlvbk5hbWU7XG5cbiIsIlxuaW1wb3J0IGdldERCVUlXZWJDb21wb25lbnRDb3JlIGZyb20gJy4uL0RCVUlXZWJDb21wb25lbnRDb3JlL0RCVUlXZWJDb21wb25lbnRDb3JlJztcbmltcG9ydCBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24gZnJvbSAnLi4vLi4vLi4vaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbic7XG5cbmNvbnN0IHJlZ2lzdHJhdGlvbk5hbWUgPSAnZGJ1aS1pY29uJztcblxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2dvcmFuZ2FqaWMvcmVhY3QtaWNvbi1iYXNlL2Jsb2IvbWFzdGVyL2luZGV4LmpzXG4vLyBodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vZ29yYW5nYWppYy9yZWFjdC1pY29ucy9tYXN0ZXIvaWNvbnMvZ28vbWFyay1naXRodWIuc3ZnXG4vLyBodHRwczovL2dpdGh1Yi5jb20vZ29yYW5nYWppYy9yZWFjdC1pY29uc1xuLy8gaHR0cHM6Ly9naXRodWIuY29tL2dvcmFuZ2FqaWMvcmVhY3QtaWNvbnMvYmxvYi9tYXN0ZXIvZ28vbWFyay1naXRodWIuanNcbi8vIGh0dHBzOi8vZ29yYW5nYWppYy5naXRodWIuaW8vcmVhY3QtaWNvbnMvZ28uaHRtbFxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXREQlVJSWNvbih3aW4pIHtcbiAgcmV0dXJuIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbih3aW4sIHJlZ2lzdHJhdGlvbk5hbWUsICgpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBEQlVJV2ViQ29tcG9uZW50QmFzZSxcbiAgICAgIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMsXG4gICAgICBSZWdpc3RlcmFibGVcbiAgICB9ID0gZ2V0REJVSVdlYkNvbXBvbmVudENvcmUod2luKTtcblxuICAgIGNsYXNzIERCVUlJY29uIGV4dGVuZHMgREJVSVdlYkNvbXBvbmVudEJhc2Uge1xuXG4gICAgICBzdGF0aWMgZ2V0IHJlZ2lzdHJhdGlvbk5hbWUoKSB7XG4gICAgICAgIHJldHVybiByZWdpc3RyYXRpb25OYW1lO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlSW5uZXJIVE1MKCkge1xuICAgICAgICByZXR1cm4gYFxuICAgICAgICAgIDxzdHlsZT5cbiAgICAgICAgICA6aG9zdCB7XG4gICAgICAgICAgICBhbGw6IGluaXRpYWw7XG4gICAgICAgICAgICBmb250LXNpemU6IGluaGVyaXQ7IFxuICAgICAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgICAgICAgd2lkdGg6IDFlbTtcbiAgICAgICAgICAgIGhlaWdodDogMWVtO1xuICAgICAgICAgICAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgICAgICAgICAgIGNvbG9yOiBpbmhlcml0O1xuICAgICAgICAgIH1cbiAgICAgICAgICA6aG9zdCBzdmcge1xuICAgICAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgICAgICAgd2lkdGg6IDFlbTtcbiAgICAgICAgICAgIGhlaWdodDogMWVtO1xuICAgICAgICAgICAgdmVydGljYWwtYWxpZ246IHRvcDtcbiAgICAgICAgICAgIGZpbGw6IGN1cnJlbnRDb2xvcjtcbiAgICAgICAgICB9XG4gICAgICAgICAgPC9zdHlsZT5cbiAgICAgICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgNDAgNDBcIiAgcHJlc2VydmVBc3BlY3RSYXRpbz1cInhNaWRZTWlkIG1lZXRcIiA+XG4gICAgICAgICAgICA8Zz48cGF0aCBkPVwiXCIvPjwvZz5cbiAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgYDtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCBwcm9wZXJ0aWVzVG9VcGdyYWRlKCkge1xuICAgICAgICBjb25zdCBpbmhlcml0ZWRQcm9wZXJ0aWVzVG9VcGdyYWRlID0gc3VwZXIucHJvcGVydGllc1RvVXBncmFkZSB8fCBbXTtcbiAgICAgICAgcmV0dXJuIFsuLi5pbmhlcml0ZWRQcm9wZXJ0aWVzVG9VcGdyYWRlLCAnc2hhcGUnXTtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7XG4gICAgICAgIGNvbnN0IGluaGVyaXRlZE9ic2VydmVkQXR0cmlidXRlcyA9IHN1cGVyLm9ic2VydmVkQXR0cmlidXRlcyB8fCBbXTtcbiAgICAgICAgcmV0dXJuIFsuLi5pbmhlcml0ZWRPYnNlcnZlZEF0dHJpYnV0ZXMsICdzaGFwZSddO1xuICAgICAgfVxuXG4gICAgICBnZXQgc2hhcGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZSgnc2hhcGUnKTtcbiAgICAgIH1cblxuICAgICAgc2V0IHNoYXBlKHZhbHVlKSB7XG4gICAgICAgIGNvbnN0IGhhc1ZhbHVlID0gIVt1bmRlZmluZWQsIG51bGxdLmluY2x1ZGVzKHZhbHVlKTtcbiAgICAgICAgY29uc3Qgc3RyaW5nVmFsdWUgPSBTdHJpbmcodmFsdWUpO1xuICAgICAgICBpZiAoaGFzVmFsdWUpIHtcbiAgICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnc2hhcGUnLCBzdHJpbmdWYWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoJ3NoYXBlJyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSkge1xuICAgICAgICBzdXBlci5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sgJiZcbiAgICAgICAgICBzdXBlci5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlKTtcblxuICAgICAgICBjb25zdCBoYXNWYWx1ZSA9ICFbdW5kZWZpbmVkLCBudWxsXS5pbmNsdWRlcyhuZXdWYWx1ZSk7XG4gICAgICAgIGlmIChuYW1lID09PSAnc2hhcGUnKSB7XG4gICAgICAgICAgaGFzVmFsdWUgPyB0aGlzLl9zZXRTaGFwZSgpIDogdGhpcy5fcmVtb3ZlU2hhcGUoKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBfc2V0U2hhcGUoKSB7XG4gICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLnNoYWRvd1Jvb3QucXVlcnlTZWxlY3Rvcignc3ZnIGcgcGF0aCcpO1xuICAgICAgICBwYXRoLnNldEF0dHJpYnV0ZSgnZCcsIHRoaXMuc2hhcGUpO1xuICAgICAgfVxuXG4gICAgICBfcmVtb3ZlU2hhcGUoKSB7XG4gICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLnNoYWRvd1Jvb3QucXVlcnlTZWxlY3Rvcignc3ZnIGcgcGF0aCcpO1xuICAgICAgICBwYXRoLnNldEF0dHJpYnV0ZSgnZCcsICcnKTtcbiAgICAgIH1cblxuICAgIH1cblxuICAgIHJldHVybiBSZWdpc3RlcmFibGUoXG4gICAgICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzKFxuICAgICAgICBEQlVJSWNvblxuICAgICAgKVxuICAgICk7XG5cbiAgfSk7XG59XG5cbmdldERCVUlJY29uLnJlZ2lzdHJhdGlvbk5hbWUgPSByZWdpc3RyYXRpb25OYW1lO1xuXG4iLCJcbmltcG9ydCBnZXREQlVJV2ViQ29tcG9uZW50Q29yZSBmcm9tICcuLi9EQlVJV2ViQ29tcG9uZW50Q29yZS9EQlVJV2ViQ29tcG9uZW50Q29yZSc7XG5pbXBvcnQgZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uIGZyb20gJy4uLy4uLy4uL2ludGVybmFscy9lbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24nO1xuaW1wb3J0IGdldERCVUlJMThuU2VydmljZSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9EQlVJSTE4blNlcnZpY2UnO1xuXG5jb25zdCBJTlRFUlBPTEFUSU9OX0FUVFJfUFJFRklYID0gJ21lc3NhZ2UtJztcblxuY29uc3QgcmVnaXN0cmF0aW9uTmFtZSA9ICdkYnVpLXRyYW5zbGF0ZWQnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXREQlVJVHJhbnNsYXRlZCh3aW4pIHtcbiAgcmV0dXJuIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbih3aW4sIHJlZ2lzdHJhdGlvbk5hbWUsICgpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBEQlVJV2ViQ29tcG9uZW50QmFzZSxcbiAgICAgIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMsXG4gICAgICBSZWdpc3RlcmFibGVcbiAgICB9ID0gZ2V0REJVSVdlYkNvbXBvbmVudENvcmUod2luKTtcblxuICAgIGNvbnN0IGkxOG5TZXJ2aWNlID0gZ2V0REJVSUkxOG5TZXJ2aWNlKHdpbik7XG5cbiAgICBjbGFzcyBEQlVJVHJhbnNsYXRlZCBleHRlbmRzIERCVUlXZWJDb21wb25lbnRCYXNlIHtcblxuICAgICAgc3RhdGljIGdldCByZWdpc3RyYXRpb25OYW1lKCkge1xuICAgICAgICByZXR1cm4gcmVnaXN0cmF0aW9uTmFtZTtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCB0ZW1wbGF0ZUlubmVySFRNTCgpIHtcbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgICA8c3R5bGU+XG4gICAgICAgICAgOmhvc3Qge1xuICAgICAgICAgICAgZGlzcGxheTogaW5saW5lO1xuICAgICAgICAgIH1cbiAgICAgICAgICA8L3N0eWxlPlxuICAgICAgICAgIDxzcGFuPjwvc3Bhbj5cbiAgICAgICAgYDtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7XG4gICAgICAgIHJldHVybiBbLi4uc3VwZXIub2JzZXJ2ZWRBdHRyaWJ1dGVzLCAnbWVzc2FnZScsICdkYnVpLWxhbmcnXTtcbiAgICAgIH1cblxuICAgICAgZ2V0IG9ic2VydmVkRHluYW1pY0F0dHJpYnV0ZXMoKSB7XG4gICAgICAgIHJldHVybiBbLi4uc3VwZXIub2JzZXJ2ZWREeW5hbWljQXR0cmlidXRlcywgLi4udGhpcy5faW50ZXJwb2xhdGlvbkF0dHJpYnV0ZXNOYW1lc107XG4gICAgICB9XG5cbiAgICAgIGdldCBoYXNEeW5hbWljQXR0cmlidXRlcygpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIGdldCBfbWVzc2FnZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKCdtZXNzYWdlJyk7XG4gICAgICB9XG5cbiAgICAgIGdldCBfY3VycmVudExhbmcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZSgnZGJ1aS1sYW5nJyk7XG4gICAgICB9XG5cbiAgICAgIGdldCBfY3VycmVudExhbmdUcmFuc2xhdGlvbnMoKSB7XG4gICAgICAgIHJldHVybiBpMThuU2VydmljZS50cmFuc2xhdGlvbnNbdGhpcy5fY3VycmVudExhbmddIHx8IHt9O1xuICAgICAgfVxuXG4gICAgICBnZXQgX3RlbXBsYXRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY3VycmVudExhbmdUcmFuc2xhdGlvbnNbdGhpcy5fbWVzc2FnZV0gfHwgKCgpID0+ICdbVHJhbnNsYXRlZF0nKTtcbiAgICAgIH1cblxuICAgICAgZ2V0IF9pbnRlcnBvbGF0aW9uQXR0cmlidXRlcygpIHtcbiAgICAgICAgLy8gbm9pbnNwZWN0aW9uIEpTQ2hlY2tGdW5jdGlvblNpZ25hdHVyZXNcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5hdHRyaWJ1dGVzKVxuICAgICAgICAgIC5maWx0ZXIoKGF0dHIpID0+IGF0dHIubmFtZS5zdGFydHNXaXRoKElOVEVSUE9MQVRJT05fQVRUUl9QUkVGSVgpKTtcbiAgICAgIH1cblxuICAgICAgZ2V0IF9pbnRlcnBvbGF0aW9uQXR0cmlidXRlc05hbWVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faW50ZXJwb2xhdGlvbkF0dHJpYnV0ZXMubWFwKChhdHRyKSA9PiBhdHRyLm5hbWUpO1xuICAgICAgfVxuXG4gICAgICBnZXQgX2ludGVycG9sYXRpb25zKCkge1xuICAgICAgICAvLyBub2luc3BlY3Rpb24gSlNDaGVja0Z1bmN0aW9uU2lnbmF0dXJlc1xuICAgICAgICByZXR1cm4gdGhpcy5faW50ZXJwb2xhdGlvbkF0dHJpYnV0ZXNcbiAgICAgICAgICAucmVkdWNlKChhY2MsIGF0dHIpID0+IHtcbiAgICAgICAgICAgIGFjY1thdHRyLm5hbWUuc2xpY2UoSU5URVJQT0xBVElPTl9BVFRSX1BSRUZJWC5sZW5ndGgpXSA9IGF0dHIudmFsdWU7XG4gICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICAgIH0sIHt9KTtcbiAgICAgIH1cblxuXG4gICAgICBfdXBkYXRlVHJhbnNsYXRpb24oKSB7XG4gICAgICAgIGNvbnN0IGludGVycG9sYXRpb25zID0gdGhpcy5faW50ZXJwb2xhdGlvbnM7XG4gICAgICAgIGNvbnN0IGFyZ3MgPSBbXTtcbiAgICAgICAgY29uc3Qga3dhcmdzID0ge307XG5cbiAgICAgICAgT2JqZWN0LmtleXMoaW50ZXJwb2xhdGlvbnMpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgIE51bWJlci5pc0ludGVnZXIoTnVtYmVyKGtleSkpID9cbiAgICAgICAgICAgIGFyZ3MucHVzaChpbnRlcnBvbGF0aW9uc1trZXldKSA6XG4gICAgICAgICAgICAoa3dhcmdzW2tleV0gPSBpbnRlcnBvbGF0aW9uc1trZXldKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3IoJ3NwYW4nKS5pbm5lckhUTUwgPVxuICAgICAgICAgIHRoaXMuX3RlbXBsYXRlKC4uLmFyZ3MsIGt3YXJncyk7XG4gICAgICB9XG5cbiAgICAgIG9uQ29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVRyYW5zbGF0aW9uKCk7XG4gICAgICB9XG5cbiAgICAgIG9uQXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKCkge1xuICAgICAgICB0aGlzLl91cGRhdGVUcmFuc2xhdGlvbigpO1xuICAgICAgfVxuXG4gICAgfVxuXG4gICAgcmV0dXJuIFJlZ2lzdGVyYWJsZShcbiAgICAgIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMoXG4gICAgICAgIERCVUlUcmFuc2xhdGVkXG4gICAgICApXG4gICAgKTtcbiAgfSk7XG59XG5cbmdldERCVUlUcmFuc2xhdGVkLnJlZ2lzdHJhdGlvbk5hbWUgPSByZWdpc3RyYXRpb25OYW1lO1xuXG4iLCJcbmNvbnN0IERCVUlDb21tb25Dc3NDbGFzc2VzID0gYFxuICBbZGJ1aS1kcmFnZ2FibGUtdGFyZ2V0XSB7XG4gIH1cbiAgYDtcblxuZXhwb3J0IGRlZmF1bHQgREJVSUNvbW1vbkNzc0NsYXNzZXM7XG4iLCJcbmNvbnN0IERCVUlDb21tb25Dc3NWYXJzID0gYFxuICA6cm9vdCB7XG4gICAgLS1kYnVpLWdsb2JhbC1ib3JkZXItcmFkaXVzOiA1cHg7XG4gICAgLS1kYnVpLWZvcm0taW5wdXQtaGVpZ2h0OiAzMHB4O1xuICAgIC0tZGJ1aS1mb3JtLWlucHV0LWNvbG9yOiAjMDAwO1xuICAgIC0tZGJ1aS1mb3JtLWlucHV0LWJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICAgIC0tZGJ1aS1mb3JtLWlucHV0LWJvcmRlci1jb2xvcjogI2NjYztcbiAgICAtLWRidWktZm9ybS1pbnB1dC1ib3JkZXItc3R5bGU6IHNvbGlkO1xuICAgIC0tZGJ1aS1mb3JtLWlucHV0LWJvcmRlci13aWR0aDogMXB4O1xuICB9XG4gIGA7XG5cbmV4cG9ydCBkZWZhdWx0IERCVUlDb21tb25Dc3NWYXJzO1xuIiwiXG5pbXBvcnQgZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uIGZyb20gJy4uLy4uLy4uL2ludGVybmFscy9lbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24nO1xuaW1wb3J0IERCVUlDb21tb25Dc3NWYXJzIGZyb20gJy4vREJVSUNvbW1vbkNzc1ZhcnMnO1xuaW1wb3J0IERCVUlDb21tb25Dc3NDbGFzc2VzIGZyb20gJy4vREJVSUNvbW1vbkNzc0NsYXNzZXMnO1xuaW1wb3J0IHRvZ2dsZVNlbGVjdGFibGUgZnJvbSAnLi4vLi4vLi4vdXRpbHMvdG9nZ2xlU2VsZWN0YWJsZSc7XG5cbmNvbnN0IHtcbiAgZGlzYWJsZVNlbGVjdGlvbixcbiAgZW5hYmxlU2VsZWN0aW9uXG59ID0gdG9nZ2xlU2VsZWN0YWJsZTtcblxuY29uc3QgcmVnaXN0cmF0aW9uTmFtZSA9ICdEQlVJV2ViQ29tcG9uZW50QmFzZSc7XG5cbmNvbnN0IGNzc01hcCA9IHtcbiAgJ2RidWktY29tbW9uLWNzcy12YXJzJzogREJVSUNvbW1vbkNzc1ZhcnMsXG4gICdkYnVpLWNvbW1vbi1jc3MtY2xhc3Nlcyc6IERCVUlDb21tb25Dc3NDbGFzc2VzLFxufTtcblxuZnVuY3Rpb24gZGVmaW5lQ29tbW9uQ1NTKHdpbikge1xuICBjb25zdCB7IGRvY3VtZW50IH0gPSB3aW47XG4gIE9iamVjdC5rZXlzKGNzc01hcCkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgY29uc3QgY29tbW9uU3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgIGNvbW1vblN0eWxlLnNldEF0dHJpYnV0ZShrZXksICcnKTtcbiAgICBjb21tb25TdHlsZS5pbm5lckhUTUwgPSBjc3NNYXBba2V5XTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdoZWFkJykuYXBwZW5kQ2hpbGQoY29tbW9uU3R5bGUpO1xuICB9KTtcbn1cblxuXG4vKlxuQWNjZXNzaW5nIHBhcmVudHMgYW5kIGNoaWxkcmVuOlxuSWYgcGFyZW50IGlzIGFjY2Vzc2VkIGluIGNvbm5lY3RlZENhbGxiYWNrIGl0IGV4aXN0cyAoaWYgaXQgc2hvdWxkIGV4aXN0KSwgaG93ZXZlcixcbnRoZSBwYXJlbnQgbWlnaHQgbm90IGJlIGl0c2VsZiBjb25uZWN0ZWQgeWV0LlxuSWYgY2hpbGRyZW4gYXJlIGFjY2Vzc2VkIGluIGNvbm5lY3RlZENhbGxiYWNrIHRoZXkgbWlnaHQgbm90IGJlIGNvbXBsZXRlIHlldCBhdCB0aGF0IHRpbWUuXG4qL1xuXG4vLyBodHRwczovL3d3dy5raXJ1cGEuY29tL2h0bWw1L2hhbmRsaW5nX2V2ZW50c19mb3JfbWFueV9lbGVtZW50cy5odG1cbi8qKlxuICpcbiAqIEBwYXJhbSB3aW4gV2luZG93XG4gKiBAcmV0dXJuIHtcbiAqICAgREJVSVdlYkNvbXBvbmVudEJhc2UsXG4gKiAgIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMsXG4gKiAgIFJlZ2lzdGVyYWJsZVxuICogfVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXREQlVJV2ViQ29tcG9uZW50Q29yZSh3aW4pIHtcbiAgcmV0dXJuIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbih3aW4sIHJlZ2lzdHJhdGlvbk5hbWUsICgpID0+IHtcbiAgICBkZWZpbmVDb21tb25DU1Mod2luKTtcblxuICAgIGNvbnN0IHsgZG9jdW1lbnQsIEhUTUxFbGVtZW50LCBjdXN0b21FbGVtZW50cyB9ID0gd2luO1xuXG4gICAgY2xhc3MgREJVSVdlYkNvbXBvbmVudEJhc2UgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG5cbiAgICAgIC8qKlxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm4gU3RyaW5nXG4gICAgICAgKi9cbiAgICAgIHN0YXRpYyBnZXQgcmVnaXN0cmF0aW9uTmFtZSgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdyZWdpc3RyYXRpb25OYW1lIG11c3QgYmUgZGVmaW5lZCBpbiBkZXJpdmVkIGNsYXNzZXMnKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKlxuICAgICAgICogQHJldHVybiBTdHJpbmcgSFRNTFxuICAgICAgICovXG4gICAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlSW5uZXJIVE1MKCkge1xuICAgICAgICByZXR1cm4gJzxzdHlsZT48L3N0eWxlPjxzbG90Pjwvc2xvdD4nO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcmV0dXJuIEFycmF5PERCVUlXZWJDb21wb25lbnQ+XG4gICAgICAgKi9cbiAgICAgIHN0YXRpYyBnZXQgZGVwZW5kZW5jaWVzKCkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm4gQXJyYXk8U3RyaW5nPlxuICAgICAgICovXG4gICAgICBzdGF0aWMgZ2V0IHByb3BlcnRpZXNUb1VwZ3JhZGUoKSB7XG4gICAgICAgIHJldHVybiBbJ3Vuc2VsZWN0YWJsZSddO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcmV0dXJuIE9iamVjdCB7IFN0cmluZywgU3RyaW5nIH1cbiAgICAgICAqL1xuICAgICAgc3RhdGljIGdldCBhdHRyaWJ1dGVzVG9EZWZpbmUoKSB7XG4gICAgICAgIHJldHVybiB7ICdkYnVpLXdlYi1jb21wb25lbnQnOiAnJyB9O1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcmV0dXJuIEFycmF5PFN0cmluZz5cbiAgICAgICAqL1xuICAgICAgc3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7XG4gICAgICAgIC8vIHdlYiBjb21wb25lbnRzIHN0YW5kYXJkIEFQSVxuICAgICAgICByZXR1cm4gWydkaXInLCAnbGFuZycsICdzeW5jLWxvY2FsZS13aXRoJywgJ3Vuc2VsZWN0YWJsZSddO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcmV0dXJuIEFycmF5PFN0cmluZz5cbiAgICAgICAqL1xuICAgICAgZ2V0IG9ic2VydmVkRHluYW1pY0F0dHJpYnV0ZXMoKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKlxuICAgICAgICogQHJldHVybiBCb29sZWFuXG4gICAgICAgKi9cbiAgICAgIGdldCBoYXNEeW5hbWljQXR0cmlidXRlcygpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcmV0dXJuIEJvb2xlYW5cbiAgICAgICAqL1xuICAgICAgZ2V0IGlzTW91bnRlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzTW91bnRlZDtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKlxuICAgICAgICogQHJldHVybiBCb29sZWFuXG4gICAgICAgKi9cbiAgICAgIGdldCBpc0Rpc2Nvbm5lY3RlZCgpIHtcbiAgICAgICAgLy8gV2UgbmVlZCBpc0Rpc2Nvbm5lY3RlZCBpbmZvIHdoZW4gRE9NIHRyZWUgaXMgY29uc3RydWN0ZWRcbiAgICAgICAgLy8gLSBhZnRlciBjb25zdHJ1Y3RvcigpIGFuZCBiZWZvcmUgY29ubmVjdGVkQ2FsbGJhY2soKSAtXG4gICAgICAgIC8vIHdoZW4gY2xvc2VzdERidWlQYXJlbnQgc2hvdWxkIG5vdCByZXR1cm4gbnVsbC5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzRGlzY29ubmVjdGVkO1xuICAgICAgfVxuXG4gICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLmF0dGFjaFNoYWRvdyh7XG4gICAgICAgICAgbW9kZTogJ29wZW4nLFxuICAgICAgICAgIC8vIGRlbGVnYXRlc0ZvY3VzOiB0cnVlXG4gICAgICAgICAgLy8gTm90IHdvcmtpbmcgb24gSVBhZCBzbyB3ZSBkbyBhbiB3b3JrYXJvdW5kXG4gICAgICAgICAgLy8gYnkgc2V0dGluZyBcImZvY3VzZWRcIiBhdHRyaWJ1dGUgd2hlbiBuZWVkZWQuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuX3Byb3BhZ2F0aW5nQ29udGV4dCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9wcm92aWRpbmdDb250ZXh0ID0ge307XG4gICAgICAgIHRoaXMuX2xhc3RSZWNlaXZlZENvbnRleHQgPSB7fTtcbiAgICAgICAgdGhpcy5fY2xvc2VzdERidWlQYXJlbnQgPSBudWxsO1xuICAgICAgICB0aGlzLl9jbG9zZXN0RGJ1aUNoaWxkcmVuID0gW107XG4gICAgICAgIHRoaXMuX2lzTW91bnRlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9pc0Rpc2Nvbm5lY3RlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9sb2NhbGVPYnNlcnZlciA9IG51bGw7XG4gICAgICAgIHRoaXMuX2R5bmFtaWNBdHRyaWJ1dGVzT2JzZXJ2ZXIgPSBudWxsO1xuICAgICAgICB0aGlzLl9wcmV2aW91c2x5T2JzZXJ2ZWREeW5hbWljQXR0cmlidXRlcyA9IHt9O1xuICAgICAgICB0aGlzLl9pbnNlcnRUZW1wbGF0ZSgpO1xuXG4gICAgICAgIHRoaXMuY29ubmVjdGVkQ2FsbGJhY2sgPSB0aGlzLmNvbm5lY3RlZENhbGxiYWNrLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuZGlzY29ubmVjdGVkQ2FsbGJhY2sgPSB0aGlzLmRpc2Nvbm5lY3RlZENhbGxiYWNrLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrID0gdGhpcy5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2suYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5hZG9wdGVkQ2FsbGJhY2sgPSB0aGlzLmFkb3B0ZWRDYWxsYmFjay5iaW5kKHRoaXMpO1xuICAgICAgfVxuXG4gICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09IFtPYnNlcnZlIER5bmFtaWMgQXR0cmlidXRlc10gPj4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICAgIF9pbml0aWFsaXplRHluYW1pY0F0dHJpYnV0ZXNPYnNlcnZlcigpIHtcbiAgICAgICAgaWYgKCF0aGlzLmhhc0R5bmFtaWNBdHRyaWJ1dGVzKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5fZHluYW1pY0F0dHJpYnV0ZXNPYnNlcnZlciA9IG5ldyB3aW4uTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zKSA9PiB7XG4gICAgICAgICAgbXV0YXRpb25zLmZvckVhY2goKG11dGF0aW9uKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IG9sZFZhbHVlLCBhdHRyaWJ1dGVOYW1lIH0gPSBtdXRhdGlvbjtcbiAgICAgICAgICAgIGNvbnN0IG5ld1ZhbHVlID0gdGhpcy5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSk7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50bHlPYnNlcnZlZER5bmFtaWNBdHRyaWJ1dGVzS2V5cyA9IHRoaXMub2JzZXJ2ZWREeW5hbWljQXR0cmlidXRlcztcbiAgICAgICAgICAgIGNvbnN0IHByZXZpb3VzbHlPYnNlcnZlZER5bmFtaWNBdHRyaWJ1dGVzID0gdGhpcy5fcHJldmlvdXNseU9ic2VydmVkRHluYW1pY0F0dHJpYnV0ZXM7XG4gICAgICAgICAgICBjb25zdCBwcmV2aW91c2x5T2JzZXJ2ZWREeW5hbWljQXR0cmlidXRlc0tleXMgPSBPYmplY3Qua2V5cyhwcmV2aW91c2x5T2JzZXJ2ZWREeW5hbWljQXR0cmlidXRlcyk7XG4gICAgICAgICAgICBjb25zdCBpc0luQ3VycmVudGx5T2JzZXJ2ZWREeW5hbWljQXR0cmlidXRlcyA9XG4gICAgICAgICAgICAgIGN1cnJlbnRseU9ic2VydmVkRHluYW1pY0F0dHJpYnV0ZXNLZXlzLmluY2x1ZGVzKGF0dHJpYnV0ZU5hbWUpO1xuICAgICAgICAgICAgY29uc3QgaXNJblByZXZpb3VzbHlPYnNlcnZlZER5bmFtaWNBdHRyaWJ1dGVzID1cbiAgICAgICAgICAgICAgcHJldmlvdXNseU9ic2VydmVkRHluYW1pY0F0dHJpYnV0ZXNLZXlzLmluY2x1ZGVzKGF0dHJpYnV0ZU5hbWUpO1xuXG4gICAgICAgICAgICBpZiAoaXNJbkN1cnJlbnRseU9ic2VydmVkRHluYW1pY0F0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgICAgdGhpcy5fcHJldmlvdXNseU9ic2VydmVkRHluYW1pY0F0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0gPSBuZXdWYWx1ZTtcbiAgICAgICAgICAgICAgdGhpcy5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlTmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlzSW5QcmV2aW91c2x5T2JzZXJ2ZWREeW5hbWljQXR0cmlidXRlcykge1xuICAgICAgICAgICAgICBjb25zdCBvbGRWYWx1ZSA9IHRoaXMuX3ByZXZpb3VzbHlPYnNlcnZlZER5bmFtaWNBdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdO1xuICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fcHJldmlvdXNseU9ic2VydmVkRHluYW1pY0F0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV07XG4gICAgICAgICAgICAgIHRoaXMuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKFxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZU5hbWUsIG9sZFZhbHVlLCBudWxsXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5fZHluYW1pY0F0dHJpYnV0ZXNPYnNlcnZlci5vYnNlcnZlKHRoaXMsIHtcbiAgICAgICAgICBhdHRyaWJ1dGVzOiB0cnVlLFxuICAgICAgICAgIGF0dHJpYnV0ZU9sZFZhbHVlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBfZGlzbWlzc0R5bmFtaWNBdHRyaWJ1dGVzT2JzZXJ2ZXIoKSB7XG4gICAgICAgIGlmICghdGhpcy5fZHluYW1pY0F0dHJpYnV0ZXNPYnNlcnZlcikgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuX2R5bmFtaWNBdHRyaWJ1dGVzT2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICB0aGlzLl9keW5hbWljQXR0cmlidXRlc09ic2VydmVyID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PSA8PCBbT2JzZXJ2ZSBEeW5hbWljIEF0dHJpYnV0ZXNdID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09IFtMb2NhbGVdID4+ID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcmV0dXJuIEhUTUxFbGVtZW50XG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgICBnZXQgX2xvY2FsZVRhcmdldCgpIHtcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLmdldEF0dHJpYnV0ZSgnc3luYy1sb2NhbGUtd2l0aCcpKTtcbiAgICAgICAgY29uc3QgZGVmYXVsdFRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2h0bWwnKTtcbiAgICAgICAgcmV0dXJuIHRhcmdldCB8fCBkZWZhdWx0VGFyZ2V0O1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcmV0dXJuIE9iamVjdCB7IGRpciwgbGFuZyB9XG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgICBnZXQgX3RhcmdldGVkTG9jYWxlKCkge1xuICAgICAgICAvLyBSZXR1cm4gbG9jYWxlIGZyb20gdGFyZ2V0XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMuX2xvY2FsZVRhcmdldDtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBkaXI6IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RpcicpIHx8ICdsdHInLFxuICAgICAgICAgIGxhbmc6IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2xhbmcnKSB8fCAnZW4nLFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBfcmVzZXRQcm92aWRlZExvY2FsZSgpIHtcbiAgICAgICAgLy8gQ2FsbGVkIG9uRGlzY29ubmVjdGVkQ2FsbGJhY2suXG4gICAgICAgIC8vXG4gICAgICAgIC8vIGRidWlEaXIvTGFuZyBkYnVpLWRpci9sYW5nIGNhbiBiZSBzZXRcbiAgICAgICAgLy8gYXMgYSByZXN1bHQgb2YgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrXG4gICAgICAgIC8vIG9yIGFzIGEgcmVzdWx0IG9mIHN5bmNpbmcgd2l0aCAob3IgbW9uaXRvcmluZykgbG9jYWxlIHRhcmdldCAoX3N5bmNMb2NhbGVBbmRNb25pdG9yQ2hhbmdlcykuXG4gICAgICAgIC8vIFdlIGNhbiByZW1vdmUgdGhlbSBpZiB0aGV5IHdlcmUgc2V0XG4gICAgICAgIC8vIGFzIGEgcmVzdWx0IG9mIF9zeW5jTG9jYWxlQW5kTW9uaXRvckNoYW5nZXNcbiAgICAgICAgLy8gYmVjYXVzZSB3aGVuIHRoaXMgbm9kZSB3aWxsIGJlIHJlLWluc2VydGVkXG4gICAgICAgIC8vIHRoZSBzeW5jaW5nIHdpbGwgaGFwcGVuIGFnYWluIGFuZCBkYnVpLWRpci9sYW5nIGF0dHJzIGFuZCBkYnVpRGlyL0xhbmcgcHJvdmlkZWQgY29udGV4dCB3aWxsIGJlIHNldCBhZ2Fpbi5cbiAgICAgICAgLy8gQnV0IHdlIGNhbid0IGRlbGV0ZSB0aGVtIGlmIHRoZXkgd2VyZSBzZXQgb25BdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2tcbiAgICAgICAgLy8gYmVjYXVzZSB0aGF0IHdpbGwgbm90IGJlIGZpcmVkIGFnYWluIHdoZW4gbm9kZSBpcyBtb3ZlZCBpbiBvdGhlciBwYXJ0IG9mIHRoZSBET00uXG4gICAgICAgIGlmICghdGhpcy5nZXRBdHRyaWJ1dGUoJ2RpcicpKSB7XG4gICAgICAgICAgLy8gV2Uga25vdyB0aGF0IGxvY2FsZSBwcm9wcy9hdHRycyB3ZXJlIHNldFxuICAgICAgICAgIC8vIGFzIGEgcmVzdWx0IG9mIGxvY2FsZSBzeW5jaW5nXG4gICAgICAgICAgLy8gYW5kIHdlIGNhbiByZXNldCBsb2NhbGUgZnJvbSBfcHJvdmlkaW5nQ29udGV4dC5cbiAgICAgICAgICBkZWxldGUgdGhpcy5fcHJvdmlkaW5nQ29udGV4dC5kYnVpRGlyOyAvLyBhZmZlY3RzIGNvbnRleHQgcHJvdmlkZXJzIC8gbm8gZWZmZWN0IG9uIGNvbnRleHQgcmVjZWl2ZXJzXG4gICAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoJ2RidWktZGlyJyk7IC8vIGFmZmVjdHMgcHJvdmlkZXJzIGFuZCByZWNlaXZlcnNcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5nZXRBdHRyaWJ1dGUoJ2xhbmcnKSkge1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLl9wcm92aWRpbmdDb250ZXh0LmRidWlMYW5nO1xuICAgICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCdkYnVpLWxhbmcnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9sb2NhbGVPYnNlcnZlcikge1xuICAgICAgICAgIHRoaXMuX2xvY2FsZU9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICB0aGlzLl9sb2NhbGVPYnNlcnZlciA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIG5ld0NvbnRleHQgT2JqZWN0XG4gICAgICAgKiBAcGFyYW0gcHJldkNvbnRleHQgT2JqZWN0XG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICAgIF9vbkxvY2FsZUNvbnRleHRDaGFuZ2VkKG5ld0NvbnRleHQsIHByZXZDb250ZXh0KSB7XG4gICAgICAgIC8vIElmIHdlIGFyZSBtb25pdG9yaW5nIGxvY2FsZSBmcm9tIGVsc2V3aGVyZSBkaXNjYXJkIHRoaXMgbm90aWZpY2F0aW9uLlxuICAgICAgICBpZiAodGhpcy5fbG9jYWxlT2JzZXJ2ZXIpIHJldHVybjtcbiAgICAgICAgY29uc3Qge1xuICAgICAgICAgIGRidWlEaXIsIGRidWlMYW5nXG4gICAgICAgIH0gPSBuZXdDb250ZXh0O1xuICAgICAgICAvLyBjaGFuZ2VzIGRvbmUgYnkgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKGRpci9sYW5nKSB0YWtlcyBwcmVjZWRlbmNlIG92ZXIgb25Db250ZXh0Q2hhbmdlZFxuICAgICAgICAhdGhpcy5nZXRBdHRyaWJ1dGUoJ2RpcicpICYmIHRoaXMuc2V0QXR0cmlidXRlKCdkYnVpLWRpcicsIGRidWlEaXIpO1xuICAgICAgICAhdGhpcy5nZXRBdHRyaWJ1dGUoJ2xhbmcnKSAmJiB0aGlzLnNldEF0dHJpYnV0ZSgnZGJ1aS1sYW5nJywgZGJ1aUxhbmcpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0gbmFtZSBTdHJpbmdcbiAgICAgICAqIEBwYXJhbSBvbGRWYWx1ZSBTdHJpbmdcbiAgICAgICAqIEBwYXJhbSBuZXdWYWx1ZSBTdHJpbmdcbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICAgIF9vbkxvY2FsZUF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpIHtcbiAgICAgICAgLy8gSWYgbG9jYWxlIHZhbHVlIGlzIHRydXRoeSwgc2V0IGl0IChvbiBjb250ZXh0IHRvbylcbiAgICAgICAgLy8gZWxzZSByZWFkIHZhbHVlIGZyb20gX3RhcmdldGVkTG9jYWxlXG4gICAgICAgIC8vIG9yIGZyb20gY2xvc2VzdERidWlQYXJlbnQgY29udGV4dC5cblxuICAgICAgICBpZiAobmFtZSA9PT0gJ3N5bmMtbG9jYWxlLXdpdGgnKSB7XG4gICAgICAgICAgLy8gc3RvcCBtb25pdG9yaW5nIG9sZCB0YXJnZXQgYW5kIHN0YXJ0IG1vbml0b3JpbmcgbmV3IHRhcmdldFxuICAgICAgICAgIHRoaXMuX3N5bmNMb2NhbGVBbmRNb25pdG9yQ2hhbmdlcygpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNvbnRleHRLZXkgPSBuYW1lID09PSAnZGlyJyA/ICdkYnVpRGlyJyA6ICdkYnVpTGFuZyc7XG4gICAgICAgIGNvbnN0IGhhc0xvY2FsZVN5bmMgPSAhIXRoaXMuaGFzQXR0cmlidXRlKCdzeW5jLWxvY2FsZS13aXRoJyk7XG4gICAgICAgIGNvbnN0IGNsb3Nlc3REYnVpUGFyZW50ID0gdGhpcy5jbG9zZXN0RGJ1aVBhcmVudDtcbiAgICAgICAgY29uc3QgaXNUb3BEYnVpQW5jZXN0b3IgPSAhY2xvc2VzdERidWlQYXJlbnQ7XG4gICAgICAgIGNvbnN0IHRhcmdldGVkTG9jYWxlID1cbiAgICAgICAgICAoaGFzTG9jYWxlU3luYyB8fCBpc1RvcERidWlBbmNlc3RvcikgPyB0aGlzLl90YXJnZXRlZExvY2FsZSA6IG51bGw7XG4gICAgICAgIGNvbnN0IHZhbHVlVG9TZXQgPSBuZXdWYWx1ZSB8fFxuICAgICAgICAgICh0YXJnZXRlZExvY2FsZSAmJiB0YXJnZXRlZExvY2FsZVtuYW1lXSkgfHxcbiAgICAgICAgICBjbG9zZXN0RGJ1aVBhcmVudC5fZ2V0Q29udGV4dChbY29udGV4dEtleV0pW2NvbnRleHRLZXldO1xuXG4gICAgICAgIGlmIChuZXdWYWx1ZSB8fCB0YXJnZXRlZExvY2FsZSkge1xuICAgICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKGBkYnVpLSR7bmFtZX1gLCB2YWx1ZVRvU2V0KTtcbiAgICAgICAgICB0aGlzLnNldENvbnRleHQoe1xuICAgICAgICAgICAgW2NvbnRleHRLZXldOiB2YWx1ZVRvU2V0XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGFyZ2V0ZWRMb2NhbGUgJiYgdGhpcy5fd2F0Y2hMb2NhbGVDaGFuZ2VzKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fcmVzZXRQcm92aWRlZExvY2FsZSgpO1xuICAgICAgICAgIHRoaXMuX3Vuc2V0QW5kUmVsaW5rQ29udGV4dChjb250ZXh0S2V5KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBfc3luY0xvY2FsZUFuZE1vbml0b3JDaGFuZ2VzKCkge1xuICAgICAgICAvLyBDYWxsZWQgb25Db25uZWN0ZWRDYWxsYmFjayBhbmQgX29uTG9jYWxlQXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrIChvbmx5IGZvciBzeW5jLWxvY2FsZS13aXRoKS5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gSWYgYmVpbmcgdG9wIG1vc3QgZGJ1aSBhbmNlc3RvciBvciBoYXZpbmcgYXR0ciBcInN5bmMtbG9jYWxlLXdpdGhcIiBkZWZpbmVkLFxuICAgICAgICAvLyByZWFkIGxvY2FsZSBmcm9tIHRhcmdldCwgc2V0IHZhbHVlcyBvbiBjb250ZXh0XG4gICAgICAgIC8vIHRoZW4gd2F0Y2ggZm9yIGxvY2FsZSBjaGFuZ2VzIG9uIHRhcmdldC5cbiAgICAgICAgY29uc3QgaXNEZXNjZW5kYW50RGJ1aSA9ICEhdGhpcy5jbG9zZXN0RGJ1aVBhcmVudDtcbiAgICAgICAgY29uc3QgaGFzTG9jYWxlU3luYyA9ICEhdGhpcy5oYXNBdHRyaWJ1dGUoJ3N5bmMtbG9jYWxlLXdpdGgnKTtcbiAgICAgICAgaWYgKGlzRGVzY2VuZGFudERidWkgJiYgIWhhc0xvY2FsZVN5bmMpIHJldHVybjtcblxuICAgICAgICBjb25zdCB7IGRpcjogdGFyZ2V0ZWREaXIsIGxhbmc6IHRhcmdldGVkTGFuZyB9ID0gdGhpcy5fdGFyZ2V0ZWRMb2NhbGU7XG4gICAgICAgIGNvbnN0IHNlbGZEaXIgPSB0aGlzLmdldEF0dHJpYnV0ZSgnZGlyJyk7XG4gICAgICAgIGNvbnN0IHNlbGZMYW5nID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2xhbmcnKTtcbiAgICAgICAgY29uc3QgbmV3RGlyID0gc2VsZkRpciB8fCB0YXJnZXRlZERpcjtcbiAgICAgICAgY29uc3QgbmV3TGFuZyA9IHNlbGZMYW5nIHx8IHRhcmdldGVkTGFuZztcblxuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnZGJ1aS1kaXInLCBuZXdEaXIpO1xuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnZGJ1aS1sYW5nJywgbmV3TGFuZyk7XG5cbiAgICAgICAgdGhpcy5zZXRDb250ZXh0KHtcbiAgICAgICAgICBkYnVpRGlyOiBuZXdEaXIsXG4gICAgICAgICAgZGJ1aUxhbmc6IG5ld0xhbmdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5fd2F0Y2hMb2NhbGVDaGFuZ2VzKCk7XG4gICAgICB9XG5cbiAgICAgIF93YXRjaExvY2FsZUNoYW5nZXMoKSB7XG4gICAgICAgIC8vIENhbGxlZCBmcm9tIF9zeW5jTG9jYWxlQW5kTW9uaXRvckNoYW5nZXMgYW5kIF9vbkxvY2FsZUF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayAob25seSBmb3IgZGlyL2xhbmcpLlxuICAgICAgICBpZiAodGhpcy5fbG9jYWxlT2JzZXJ2ZXIpIHtcbiAgICAgICAgICB0aGlzLl9sb2NhbGVPYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBsb2NhbGVUYXJnZXQgPSB0aGlzLl9sb2NhbGVUYXJnZXQ7XG5cbiAgICAgICAgdGhpcy5fbG9jYWxlT2JzZXJ2ZXIgPSBuZXcgd2luLk11dGF0aW9uT2JzZXJ2ZXIoKG11dGF0aW9ucykgPT4ge1xuICAgICAgICAgIG11dGF0aW9ucy5mb3JFYWNoKChtdXRhdGlvbikgPT4ge1xuICAgICAgICAgICAgY29uc3QgYXR0ciA9IG11dGF0aW9uLmF0dHJpYnV0ZU5hbWU7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuX3RhcmdldGVkTG9jYWxlW2F0dHJdO1xuICAgICAgICAgICAgY29uc3QgYXR0cktleSA9IGBkYnVpLSR7YXR0cn1gO1xuICAgICAgICAgICAgY29uc3QgY29udGV4dEtleSA9IGBkYnVpJHthdHRyLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgYXR0ci5zbGljZSgxKX1gO1xuXG4gICAgICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShhdHRyS2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICB0aGlzLnNldENvbnRleHQoe1xuICAgICAgICAgICAgICBbY29udGV4dEtleV06IHZhbHVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5fbG9jYWxlT2JzZXJ2ZXIub2JzZXJ2ZShsb2NhbGVUYXJnZXQsIHtcbiAgICAgICAgICBhdHRyaWJ1dGVzOiB0cnVlLFxuICAgICAgICAgIGF0dHJpYnV0ZUZpbHRlcjogWydkaXInLCAnbGFuZyddXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09IDw8IFtMb2NhbGVdICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PSBbQ29udGV4dF0gPj4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICAgIC8qKlxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm4gQXJyYXk8U3RyaW5nPlxuICAgICAgICovXG4gICAgICBzdGF0aWMgZ2V0IGNvbnRleHRQcm92aWRlKCkge1xuICAgICAgICByZXR1cm4gWydkYnVpRGlyJywgJ2RidWlMYW5nJ107XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm4gQXJyYXk8U3RyaW5nPlxuICAgICAgICovXG4gICAgICBzdGF0aWMgZ2V0IGNvbnRleHRTdWJzY3JpYmUoKSB7XG4gICAgICAgIHJldHVybiBbJ2RidWlEaXInLCAnZGJ1aUxhbmcnXTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIGtleSBTdHJpbmdcbiAgICAgICAqIEByZXR1cm4gQm9vbGVhblxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgX3Byb3ZpZGVzQ29udGV4dEZvcihrZXkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IuY29udGV4dFByb3ZpZGUuc29tZSgoX2tleSkgPT4gX2tleSA9PT0ga2V5KTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIGtleSBTdHJpbmdcbiAgICAgICAqIEByZXR1cm4gQm9vbGVhblxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgX2hhc1ZhbHVlRm9yQ29udGV4dChrZXkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Byb3ZpZGluZ0NvbnRleHRba2V5XSAhPT0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ga2V5IFN0cmluZ1xuICAgICAgICogQHJldHVybiBCb29sZWFuXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgICBfc3Vic2NyaWJlc0ZvckNvbnRleHQoa2V5KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLmNvbnRleHRTdWJzY3JpYmUuc29tZSgoX2tleSkgPT4gX2tleSA9PT0ga2V5KTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIGNvbnRleHRPYmogT2JqZWN0XG4gICAgICAgKi9cbiAgICAgIHNldENvbnRleHQoY29udGV4dE9iaikge1xuICAgICAgICBjb25zdCBuZXdLZXlzID0gT2JqZWN0LmtleXMoY29udGV4dE9iaikuZmlsdGVyKChrZXkpID0+IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5fcHJvdmlkZXNDb250ZXh0Rm9yKGtleSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGNvbnRleHRUb1NldCA9IG5ld0tleXMucmVkdWNlKChhY2MsIGtleSkgPT4ge1xuICAgICAgICAgIGFjY1trZXldID0gY29udGV4dE9ialtrZXldO1xuICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0sIHt9KTtcblxuICAgICAgICBjb25zdCBuZXdQcm92aWRpbmdDb250ZXh0ID0ge1xuICAgICAgICAgIC4uLnRoaXMuX3Byb3ZpZGluZ0NvbnRleHQsXG4gICAgICAgICAgLi4uY29udGV4dFRvU2V0XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5fcHJvdmlkaW5nQ29udGV4dCA9IG5ld1Byb3ZpZGluZ0NvbnRleHQ7XG5cbiAgICAgICAgaWYgKHRoaXMuX3Byb3BhZ2F0aW5nQ29udGV4dCkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuX3Byb3BhZ2F0ZUNvbnRleHRDaGFuZ2VkKHRoaXMuX3Byb3ZpZGluZ0NvbnRleHQpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0gbmV3Q29udGV4dCBPYmplY3RcbiAgICAgICAqL1xuICAgICAgX3Byb3BhZ2F0ZUNvbnRleHRDaGFuZ2VkKG5ld0NvbnRleHQpIHtcbiAgICAgICAgdGhpcy5fcHJvcGFnYXRpbmdDb250ZXh0ID0gdHJ1ZTtcbiAgICAgICAgY29uc3QgbmV3Q29udGV4dEtleXMgPSBPYmplY3Qua2V5cyhuZXdDb250ZXh0KTtcblxuICAgICAgICAvLyBpZiBjb250ZXh0IGlzIHJlY2VpdmVkIGZyb20gYW5jZXN0b3JzXG4gICAgICAgIGlmIChuZXdDb250ZXh0ICE9PSB0aGlzLl9wcm92aWRpbmdDb250ZXh0KSB7XG4gICAgICAgICAgLy8gbWFrZXMgc2VsZiBhd2FyZVxuICAgICAgICAgIGNvbnN0IGtleXNTdWJzY3JpYmVkRm9yID0gbmV3Q29udGV4dEtleXMucmVkdWNlKChhY2MsIGtleSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fc3Vic2NyaWJlc0ZvckNvbnRleHQoa2V5KSAmJiBhY2MucHVzaChrZXkpO1xuICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgICB9LCBbXSk7XG5cbiAgICAgICAgICBpZiAoa2V5c1N1YnNjcmliZWRGb3IubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBjb250ZXh0U3Vic2NyaWJlZEZvciA9IGtleXNTdWJzY3JpYmVkRm9yLnJlZHVjZSgoYWNjLCBrZXkpID0+IHtcbiAgICAgICAgICAgICAgYWNjW2tleV0gPSBuZXdDb250ZXh0W2tleV07XG4gICAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgICAgICB9LCB7fSk7XG4gICAgICAgICAgICB0aGlzLl9vbkNvbnRleHRDaGFuZ2VkKGNvbnRleHRTdWJzY3JpYmVkRm9yKTtcbiAgICAgICAgICAgIC8vIEF0IHRoaXMgcG9pbnQgdXNlciBtaWdodCBoYXZlIGNhbGwgc2V0Q29udGV4dCBpbnNpZGUgb25Db250ZXh0Q2hhbmdlZFxuICAgICAgICAgICAgLy8gaW4gd2hpY2ggY2FzZSBfcHJvdmlkaW5nQ29udGV4dCBpcyB1cGRhdGVkIHdpdGggbGF0ZXN0IHZhbHVlcy5cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBwcm9wYWdhdGUgd2l0aCBvdmVycmlkZXNcbiAgICAgICAgLy8gSWYgdXNlciBjYWxsZWQgc2V0Q29udGV4dCgpIGZyb20gd2l0aGluIG9uQ29udGV4dENoYW5nZWQoKSB0aGVuXG4gICAgICAgIC8vIHRoaXMuX3Byb3ZpZGluZ0NvbnRleHQgaGFzIHRoZSBuZXdlc3QgdmFsdWVzIHRvIGJlIHByb3BhZ2F0ZWRcbiAgICAgICAgY29uc3Qgb3ZlcnJpZGRlbkNvbnRleHQgPSB0aGlzLmNvbnN0cnVjdG9yLmNvbnRleHRQcm92aWRlLnJlZHVjZSgoYWNjLCBrZXkpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5faGFzVmFsdWVGb3JDb250ZXh0KGtleSkpIHtcbiAgICAgICAgICAgIGFjY1trZXldID0gdGhpcy5fcHJvdmlkaW5nQ29udGV4dFtrZXldO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICB9LCB7fSk7XG5cbiAgICAgICAgY29uc3QgY29udGV4dFRvUHJvcGFnYXRlID0ge1xuICAgICAgICAgIC4uLm5ld0NvbnRleHQsXG4gICAgICAgICAgLi4ub3ZlcnJpZGRlbkNvbnRleHRcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBjaGlsZHJlbiB0aGF0IHdpbGwgbW91bnQgbGF0ZXIgd2lsbCBhc2sgZm9yIGNvbnRleHQgKF9jaGVja0NvbnRleHQpXG4gICAgICAgIHRoaXMuY2xvc2VzdERidWlDaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgICAgICAgIGNoaWxkLl9wcm9wYWdhdGVDb250ZXh0Q2hhbmdlZChjb250ZXh0VG9Qcm9wYWdhdGUpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fcHJvcGFnYXRpbmdDb250ZXh0ID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogUmVzZXRzIF9sYXN0UmVjZWl2ZWRDb250ZXh0IGFuZCBfcHJvdmlkaW5nQ29udGV4dCxcbiAgICAgICAqIGxvb2tzIHVwIGZvciBuZXcgdmFsdWUgb24gY2xvc2VzdERidWlQYXJlbnQgY29udGV4dFxuICAgICAgICogYW5kIHByb3BhZ2F0ZXMgdGhhdCB0byBzZWxmIGFuZCBhbmNlc3RvcnMuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIGNvbnRleHRLZXkgU3RyaW5nIHwgQXJyYXk8U3RyaW5nPlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgX3Vuc2V0QW5kUmVsaW5rQ29udGV4dChjb250ZXh0S2V5KSB7XG4gICAgICAgIGNvbnN0IGNvbnRleHRLZXlzID0gQXJyYXkuaXNBcnJheShjb250ZXh0S2V5KSA/IGNvbnRleHRLZXkgOiBbY29udGV4dEtleV07XG5cbiAgICAgICAgY29udGV4dEtleXMuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgZGVsZXRlIHRoaXMuX2xhc3RSZWNlaXZlZENvbnRleHRba2V5XTtcbiAgICAgICAgICBkZWxldGUgdGhpcy5fcHJvdmlkaW5nQ29udGV4dFtrZXldO1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBjbG9zZXN0RGJ1aVBhcmVudCA9IHRoaXMuY2xvc2VzdERidWlQYXJlbnQ7XG4gICAgICAgIGNvbnN0IHZhbHVlc1RvU2V0ID1cbiAgICAgICAgICAgICFjbG9zZXN0RGJ1aVBhcmVudCA/XG4gICAgICAgICAgICAgIHVuZGVmaW5lZCA6XG4gICAgICAgICAgICAgIGNsb3Nlc3REYnVpUGFyZW50Ll9nZXRDb250ZXh0KGNvbnRleHRLZXlzKTtcblxuICAgICAgICBjb25zdCBuZXdDb250ZXh0ID0gY29udGV4dEtleXMucmVkdWNlKChhY2MsIGtleSkgPT4ge1xuICAgICAgICAgIGFjY1trZXldID0gKHZhbHVlc1RvU2V0IHx8IHt9KVtrZXldO1xuICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0sIHt9KTtcblxuICAgICAgICB0aGlzLl9wcm9wYWdhdGVDb250ZXh0Q2hhbmdlZChuZXdDb250ZXh0KTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIGtleXMgQXJyYXk8U3RyaW5nPlxuICAgICAgICogQHJldHVybiBPYmplY3RcbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICAgIF9nZXRDb250ZXh0KGtleXMpIHtcbiAgICAgICAgLy8gVGhpcyBtdXN0IHJ1biBhbHdheXMgaW4gdGhlIHBhcmVudCBvZiB0aGUgbm9kZSBhc2tpbmcgZm9yIGNvbnRleHRcbiAgICAgICAgLy8gYW5kIG5vdCBpbiB0aGUgbm9kZSBpdHNlbGYuXG4gICAgICAgIGNvbnN0IG93bmVkS2V5cyA9IFtdO1xuICAgICAgICBjb25zdCBrZXlzVG9Bc2tGb3IgPSBbXTtcbiAgICAgICAga2V5cy5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5faGFzVmFsdWVGb3JDb250ZXh0KGtleSkpIHtcbiAgICAgICAgICAgIG93bmVkS2V5cy5wdXNoKGtleSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGtleXNUb0Fza0Zvci5wdXNoKGtleSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgY2xvc2VzdERidWlQYXJlbnQgPSB0aGlzLmNsb3Nlc3REYnVpUGFyZW50O1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLm93bmVkS2V5cy5yZWR1Y2UoKGFjYywga2V5KSA9PiB7XG4gICAgICAgICAgICBhY2Nba2V5XSA9IHRoaXMuX3Byb3ZpZGluZ0NvbnRleHRba2V5XTtcbiAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgICAgfSwge30pLFxuICAgICAgICAgIC4uLihjbG9zZXN0RGJ1aVBhcmVudCA/IGNsb3Nlc3REYnVpUGFyZW50Ll9nZXRDb250ZXh0KGtleXNUb0Fza0ZvcikgOiB7fSlcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIG5ld0NvbnRleHQgT2JqZWN0XG4gICAgICAgKiBAcGFyYW0gb3B0aW9ucyB7IHJlc2V0ID0gZmFsc2UgfVxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgX29uQ29udGV4dENoYW5nZWQobmV3Q29udGV4dCwgeyByZXNldCA9IGZhbHNlIH0gPSB7fSkge1xuICAgICAgICAvLyBNaWdodCBiZSBmaXJlZCBtb3JlIHRoYW4gb25jZSB1bnRpbCBET00gdHJlZSBzZXR0bGVzIGRvd24uXG4gICAgICAgIC8vIGV4OiBmaXJzdCBjYWxsIGlzIHRoZSByZXN1bHQgb2YgX2NoZWNrQ29udGV4dCB3aGljaCBtaWdodCBnZXQgdGhlIHRvcCBtb3N0IGV4aXN0aW5nIGNvbnRleHQuXG4gICAgICAgIC8vIFRoZSBuZXh0IG9uZXMgY2FuIGJlIHRoZSByZXN1bHQgb2YgbWlkZGxlIGFuY2VzdG9ycyBmaXJpbmcgYXR0cmlidXRlQ2hhbmdlQ2FsbGJhY2tcbiAgICAgICAgLy8gd2hpY2ggbWlnaHQgc2V0IHRoZWlyIGNvbnRleHQgYW5kIHByb3BhZ2F0ZSBpdCBkb3duLlxuICAgICAgICBjb25zdCBsYXN0UmVjZWl2ZWRDb250ZXh0ID0gdGhpcy5fbGFzdFJlY2VpdmVkQ29udGV4dDtcbiAgICAgICAgY29uc3QgbmV3Q29udGV4dEZpbHRlcmVkS2V5cyA9IE9iamVjdC5rZXlzKG5ld0NvbnRleHQgfHwge30pLmZpbHRlcigoa2V5KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIG5ld0NvbnRleHRba2V5XSAhPT0gbGFzdFJlY2VpdmVkQ29udGV4dFtrZXldO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gUHJldmVudHMgdHJpZ2dlcmluZyBvbkNvbnRleHRDaGFuZ2VkIGFnYWluc3QgYSBjb250ZXh0IGZvdW5kIG9uIHNvbWUgYW5jZXN0b3JcbiAgICAgICAgLy8gd2hpY2ggZGlkIG5vdCBtYW5hZ2VkIHlldCB0byBzZXR1cCBpdHMgY29udGV4dFxuICAgICAgICAvLyBkdWUgdG8gZm9yIGV4YW1wbGUgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrIGRpZCBub3QgZmlyZWQgb24gdGhhdCBhbmNlc3RvciB5ZXQuXG4gICAgICAgIGlmICghbmV3Q29udGV4dEZpbHRlcmVkS2V5cy5sZW5ndGggJiYgIXJlc2V0KSByZXR1cm47XG4gICAgICAgIGNvbnN0IG5ld0NvbnRleHRGaWx0ZXJlZCA9IG5ld0NvbnRleHRGaWx0ZXJlZEtleXMucmVkdWNlKChhY2MsIGtleSkgPT4ge1xuICAgICAgICAgIGFjY1trZXldID0gbmV3Q29udGV4dFtrZXldO1xuICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0sIHt9KTtcbiAgICAgICAgY29uc3QgY29udGV4dFRvU2V0ID0gcmVzZXQgPyB7fSA6IHsgLi4ubGFzdFJlY2VpdmVkQ29udGV4dCwgLi4ubmV3Q29udGV4dEZpbHRlcmVkIH07XG4gICAgICAgIHRoaXMuX2xhc3RSZWNlaXZlZENvbnRleHQgPSBjb250ZXh0VG9TZXQ7XG4gICAgICAgIGNvbnN0IFtfbmV3Q29udGV4dCwgX3ByZXZDb250ZXh0XSA9IFt0aGlzLl9sYXN0UmVjZWl2ZWRDb250ZXh0LCBsYXN0UmVjZWl2ZWRDb250ZXh0XTtcbiAgICAgICAgdGhpcy5fb25Mb2NhbGVDb250ZXh0Q2hhbmdlZChfbmV3Q29udGV4dCwgX3ByZXZDb250ZXh0KTtcbiAgICAgICAgdGhpcy5vbkNvbnRleHRDaGFuZ2VkKF9uZXdDb250ZXh0LCBfcHJldkNvbnRleHQpO1xuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogUHVibGljIGhvb2suXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIG5ld0NvbnRleHQgT2JqZWN0XG4gICAgICAgKiBAcGFyYW0gcHJldkNvbnRleHQgT2JqZWN0XG4gICAgICAgKi9cbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgICAgb25Db250ZXh0Q2hhbmdlZChuZXdDb250ZXh0LCBwcmV2Q29udGV4dCkge1xuICAgICAgICAvLyBwYXNzXG4gICAgICB9XG5cbiAgICAgIF9jaGVja0NvbnRleHQoKSB7XG4gICAgICAgIC8vIF9jaGVja0NvbnRleHQgY2FuIHByb3BhZ2F0ZSByZWN1cnNpdmVseSB0byB0aGUgdmVyeSB0b3AgZXZlbiBpZiBhbmNlc3RvcnMgYXJlIG5vdCBjb25uZWN0ZWQuXG4gICAgICAgIC8vIElmIHRoZXJlIGlzIGNvbnRleHQgZGVmaW5lZCBzb21ld2hlcmUgdXBzdHJlYW0gdGhlbiBpdCB3aWxsIGJlIHJlYWNoZWQgYnkgZGVzY2VuZGFudHMuXG4gICAgICAgIGNvbnN0IGNsb3Nlc3REYnVpUGFyZW50ID0gdGhpcy5jbG9zZXN0RGJ1aVBhcmVudDtcbiAgICAgICAgLy8gbm8gbmVlZCB0byBjaGVjayBjb250ZXh0IGlmIGlzIHRvcCBtb3N0IGRidWkgYW5jZXN0b3JcbiAgICAgICAgaWYgKCFjbG9zZXN0RGJ1aVBhcmVudCkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IG5ld0NvbnRleHQgPSBjbG9zZXN0RGJ1aVBhcmVudC5fZ2V0Q29udGV4dChcbiAgICAgICAgICB0aGlzLmNvbnN0cnVjdG9yLmNvbnRleHRTdWJzY3JpYmVcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5fb25Db250ZXh0Q2hhbmdlZChuZXdDb250ZXh0KTtcbiAgICAgICAgLy8gTm8gbmVlZCB0byBwcm9wYWdhdGUgdG8gdGhlIGNoaWxkcmVuIGJlY2F1c2UgdGhleSBjYW4gc2VhcmNoIHVwd2FyZCBmb3IgY29udGV4dFxuICAgICAgICAvLyB1bnRpbCB0b3Agb2YgdGhlIHRyZWUgaXMgcmVhY2hlZCwgZXZlbiBpZiBhbmNlc3RvcnMgYXJlIG5vdCBjb25uZWN0ZWQgeWV0LlxuICAgICAgICAvLyBJZiBzb21lIG1pZGRsZSBhbmNlc3RvciBoYXMgY29udGV4dCB0byBwcm92aWRlIGFuZCBkaWQgbm90IG1hbmFnZWQgdG8gcHJvdmlkZSBpdCB5ZXRcbiAgICAgICAgLy8gKGV4OiBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sgbm90IGZpcmVkIGJlZm9yZSBkZXNjZW5kYW50cyBsb29rZWQgZm9yIHVwc3RyZWFtIGNvbnRleHQpXG4gICAgICAgIC8vIHRoZW4gZGVzY2VuZGFudHMgd2lsbCByZWNlaXZlIGZpcnN0IGNvbnRleHQgZnJvbSB1cHN0cmVhbSB0aGVuIGZyb20gbWlkZGxlIGFuY2VzdG9yLlxuICAgICAgICAvLyBUaGlzIHdhcyB2ZXJpZmllZCFcbiAgICAgIH1cblxuICAgICAgX3Jlc2V0Q29udGV4dCgpIHtcbiAgICAgICAgLy8gdGhpcy5fcHJvdmlkaW5nQ29udGV4dCBpcyBOT1QgcmVzZXQgZnJvbSBjb21wb25lbnQgcHJvdmlkaW5nIGNvbnRleHRcbiAgICAgICAgLy8gYmVjYXVzZSBpZiBjb250ZXh0IGlzIGRlcGVuZGVudCBvbiBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2tcbiAgICAgICAgLy8gdGhhdCB3aWxsIG5vdCBmaXJlIHdoZW4gY29tcG9uZW50IGlzIG1vdmVkIGZyb20gb25lIHBsYWNlIHRvIGFub3RoZXIgcGxhY2UgaW4gRE9NIHRyZWUuXG4gICAgICAgIGNvbnN0IGNsb3Nlc3REYnVpUGFyZW50ID0gdGhpcy5jbG9zZXN0RGJ1aVBhcmVudDtcbiAgICAgICAgLy8gQ2hlY2tpbmcgY2xvc2VzdERidWlQYXJlbnQgdG8gYmUgc3ltbWV0cmljIHdpdGggX2NoZWNrQ29udGV4dFxuICAgICAgICAvLyBvciB3ZSdsbCBlbmQgdXAgd2l0aCBlbXB0eSBjb250ZXh0IG9iamVjdCBhZnRlciByZXNldCxcbiAgICAgICAgLy8gd2hlbiBpdCBpbml0aWFsbHkgd2FzIHVuZGVmaW5lZC5cbiAgICAgICAgaWYgKGNsb3Nlc3REYnVpUGFyZW50KSB7XG4gICAgICAgICAgdGhpcy5fb25Db250ZXh0Q2hhbmdlZChudWxsLCB7IHJlc2V0OiB0cnVlIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT0gPDwgW0NvbnRleHRdID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09IFtEZXNjZW5kYW50cy9BbmNlc3RvcnMgYW5kIHJlZ2lzdHJhdGlvbnNdID4+ID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0gY2FsbGJhY2sgRnVuY3Rpb25cbiAgICAgICAqIEByZXR1cm4gSFRNTEVsZW1lbnRcbiAgICAgICAqL1xuICAgICAgZ2V0Q2xvc2VzdEFuY2VzdG9yTWF0Y2hpbmdDb25kaXRpb24oY2FsbGJhY2spIHtcbiAgICAgICAgbGV0IGNsb3Nlc3RBbmNlc3RvciA9IHRoaXMucGFyZW50RWxlbWVudDtcbiAgICAgICAgd2hpbGUgKGNsb3Nlc3RBbmNlc3RvciAmJiAhY2FsbGJhY2soY2xvc2VzdEFuY2VzdG9yKSkge1xuICAgICAgICAgIGNsb3Nlc3RBbmNlc3RvciA9IGNsb3Nlc3RBbmNlc3Rvci5wYXJlbnRFbGVtZW50O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjbG9zZXN0QW5jZXN0b3I7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm4gQXJyYXk8REJVSVdlYkNvbXBvbmVudD5cbiAgICAgICAqL1xuICAgICAgZ2V0IHNoYWRvd0RvbURidWlDaGlsZHJlbigpIHtcbiAgICAgICAgLy8gY2hpbGRyZW4gaW4gc2xvdHMgYXJlIE5PVCBpbmNsdWRlZCBoZXJlXG4gICAgICAgIHJldHVybiBbLi4udGhpcy5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYnVpLXdlYi1jb21wb25lbnRdJyldO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcmV0dXJuIERCVUlXZWJDb21wb25lbnQgfCBudWxsXG4gICAgICAgKi9cbiAgICAgIGdldCBzaGFkb3dEb21EYnVpUGFyZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRSb290Tm9kZSgpLmhvc3QgfHwgbnVsbDtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKlxuICAgICAgICogQHJldHVybiBEQlVJV2ViQ29tcG9uZW50IHwgbnVsbFxuICAgICAgICovXG4gICAgICBnZXQgbGlnaHREb21EYnVpUGFyZW50KCkge1xuICAgICAgICAvLyBjYW4gcmV0dXJuIGEgcGFyZW50IHdoaWNoIGlzIGluIHNoYWRvdyBET00gb2YgdGhlIGdyYW5kLXBhcmVudFxuICAgICAgICBsZXQgcGFyZW50ID0gdGhpcy5wYXJlbnRFbGVtZW50O1xuICAgICAgICB3aGlsZSAocGFyZW50ICYmICFwYXJlbnQuaGFzQXR0cmlidXRlKCdkYnVpLXdlYi1jb21wb25lbnQnKSkge1xuICAgICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnRFbGVtZW50O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYXJlbnQgfHwgbnVsbDtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKlxuICAgICAgICogQHJldHVybiBBcnJheTxEQlVJV2ViQ29tcG9uZW50PlxuICAgICAgICovXG4gICAgICBnZXQgbGlnaHREb21EYnVpQ2hpbGRyZW4oKSB7XG4gICAgICAgIC8vIGNoaWxkcmVuIGluIHNsb3RzIEFSRSBpbmNsdWRlZCBoZXJlXG4gICAgICAgIHJldHVybiBbLi4udGhpcy5xdWVyeVNlbGVjdG9yQWxsKCdbZGJ1aS13ZWItY29tcG9uZW50XScpXTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKlxuICAgICAgICogQHJldHVybiBEQlVJV2ViQ29tcG9uZW50IHwgbnVsbFxuICAgICAgICovXG4gICAgICBnZXQgY2xvc2VzdERidWlQYXJlbnRMaXZlUXVlcnkoKSB7XG4gICAgICAgIGxldCBjbG9zZXN0UGFyZW50ID0gdGhpcy5wYXJlbnRFbGVtZW50O1xuICAgICAgICAvLyBtaWdodCBiZSBudWxsIGlmIGRpc2Nvbm5lY3RlZCBmcm9tIGRvbVxuICAgICAgICBpZiAoY2xvc2VzdFBhcmVudCA9PT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNsb3Nlc3RQYXJlbnQgPSBjbG9zZXN0UGFyZW50LmNsb3Nlc3QoJ1tkYnVpLXdlYi1jb21wb25lbnRdJyk7XG4gICAgICAgIHJldHVybiBjbG9zZXN0UGFyZW50IHx8IHRoaXMuc2hhZG93RG9tRGJ1aVBhcmVudDtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKlxuICAgICAgICogQHJldHVybiBEQlVJV2ViQ29tcG9uZW50IHwgbnVsbFxuICAgICAgICovXG4gICAgICBnZXQgY2xvc2VzdERidWlQYXJlbnQoKSB7XG4gICAgICAgIC8vIGNhY2hlZFxuICAgICAgICAvLyBSZWFzb24gZm9yIGNhY2hlIGlzIHRvIGFsbG93IGEgY2hpbGQgdG8gdW5yZWdpc3RlciBmcm9tIGl0cyBwYXJlbnQgd2hlbiB1bm1vdW50ZWRcbiAgICAgICAgLy8gYmVjYXVzZSB3aGVuIGJyb3dzZXIgY2FsbHMgZGlzY29ubmVjdGVkQ2FsbGJhY2sgdGhlIHBhcmVudCBpcyBub3QgcmVhY2hhYmxlIGFueW1vcmUuXG4gICAgICAgIC8vIElmIHBhcmVudCBjb3VsZCBub3QgYmUgcmVhY2hhYmxlIGl0IGNvdWxkIG5vdCB1bnJlZ2lzdGVyIGl0cyBjbG9zZXN0IGNoaWxkcmVuXG4gICAgICAgIC8vIHRodXMgbGVhZGluZyB0byBtZW1vcnkgbGVhay5cbiAgICAgICAgaWYgKHRoaXMuX2Nsb3Nlc3REYnVpUGFyZW50KSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuX2Nsb3Nlc3REYnVpUGFyZW50O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmlzRGlzY29ubmVjdGVkKSByZXR1cm4gbnVsbDtcbiAgICAgICAgdGhpcy5fY2xvc2VzdERidWlQYXJlbnQgPSB0aGlzLmNsb3Nlc3REYnVpUGFyZW50TGl2ZVF1ZXJ5O1xuICAgICAgICByZXR1cm4gdGhpcy5fY2xvc2VzdERidWlQYXJlbnQ7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm4gREJVSVdlYkNvbXBvbmVudCB8IG51bGxcbiAgICAgICAqL1xuICAgICAgLy8gbWlnaHQgYmUgdXNlZnVsIGluIHNvbWUgc2NlbmFyaW9zXG4gICAgICBnZXQgdG9wRGJ1aUFuY2VzdG9yKCkge1xuICAgICAgICBsZXQgY2xvc2VzdERidWlQYXJlbnQgPSB0aGlzLmNsb3Nlc3REYnVpUGFyZW50O1xuICAgICAgICB3aGlsZSAoY2xvc2VzdERidWlQYXJlbnQpIHtcbiAgICAgICAgICBjb25zdCBfY2xvc2VzdERidWlQYXJlbnQgPSBjbG9zZXN0RGJ1aVBhcmVudC5jbG9zZXN0RGJ1aVBhcmVudDtcbiAgICAgICAgICBpZiAoIV9jbG9zZXN0RGJ1aVBhcmVudCkge1xuICAgICAgICAgICAgcmV0dXJuIGNsb3Nlc3REYnVpUGFyZW50O1xuICAgICAgICAgIH1cbiAgICAgICAgICBjbG9zZXN0RGJ1aVBhcmVudCA9IF9jbG9zZXN0RGJ1aVBhcmVudDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2xvc2VzdERidWlQYXJlbnQ7IC8vIHRoaXMgaXMgbnVsbFxuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcmV0dXJuIEFycmF5PERCVUlXZWJDb21wb25lbnQ+XG4gICAgICAgKi9cbiAgICAgIC8vIG1pZ2h0IGJlIHVzZWZ1bCBpbiBzb21lIHNjZW5hcmlvc1xuICAgICAgZ2V0IGNsb3Nlc3REYnVpQ2hpbGRyZW5MaXZlUXVlcnkoKSB7XG4gICAgICAgIGNvbnN0IGRidWlDaGlsZHJlbiA9IFsuLi50aGlzLmxpZ2h0RG9tRGJ1aUNoaWxkcmVuLCAuLi50aGlzLnNoYWRvd0RvbURidWlDaGlsZHJlbl07XG4gICAgICAgIGNvbnN0IGNsb3Nlc3REYnVpQ2hpbGRyZW4gPSBkYnVpQ2hpbGRyZW4uZmlsdGVyKChjaGlsZCkgPT4gY2hpbGQuY2xvc2VzdERidWlQYXJlbnRMaXZlUXVlcnkgPT09IHRoaXMpO1xuICAgICAgICByZXR1cm4gY2xvc2VzdERidWlDaGlsZHJlbjtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKlxuICAgICAgICogQHJldHVybiBBcnJheTxEQlVJV2ViQ29tcG9uZW50PlxuICAgICAgICovXG4gICAgICBnZXQgY2xvc2VzdERidWlDaGlsZHJlbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Nsb3Nlc3REYnVpQ2hpbGRyZW47XG4gICAgICB9XG5cbiAgICAgIF9yZWdpc3RlclNlbGZUb0Nsb3Nlc3REYnVpUGFyZW50KCkge1xuICAgICAgICBjb25zdCBjbG9zZXN0RGJ1aVBhcmVudCA9IHRoaXMuY2xvc2VzdERidWlQYXJlbnQ7XG4gICAgICAgIGlmICghY2xvc2VzdERidWlQYXJlbnQpIHJldHVybjtcbiAgICAgICAgY2xvc2VzdERidWlQYXJlbnQuX3JlZ2lzdGVyQ2hpbGQodGhpcyk7XG4gICAgICB9XG5cbiAgICAgIF91bnJlZ2lzdGVyU2VsZkZyb21DbG9zZXN0RGJ1aVBhcmVudCgpIHtcbiAgICAgICAgY29uc3QgY2xvc2VzdERidWlQYXJlbnQgPSB0aGlzLmNsb3Nlc3REYnVpUGFyZW50O1xuICAgICAgICBpZiAoIWNsb3Nlc3REYnVpUGFyZW50KSByZXR1cm47XG4gICAgICAgIGNsb3Nlc3REYnVpUGFyZW50Ll91bnJlZ2lzdGVyQ2hpbGQodGhpcyk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSBjaGlsZCBEQlVJV2ViQ29tcG9uZW50XG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgICBfcmVnaXN0ZXJDaGlsZChjaGlsZCkge1xuICAgICAgICB0aGlzLl9jbG9zZXN0RGJ1aUNoaWxkcmVuLnB1c2goY2hpbGQpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0gY2hpbGQgREJVSVdlYkNvbXBvbmVudFxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgX3VucmVnaXN0ZXJDaGlsZChjaGlsZCkge1xuICAgICAgICB0aGlzLl9jbG9zZXN0RGJ1aUNoaWxkcmVuID1cbiAgICAgICAgICB0aGlzLl9jbG9zZXN0RGJ1aUNoaWxkcmVuLmZpbHRlcigoX2NoaWxkKSA9PiBfY2hpbGQgIT09IGNoaWxkKTtcbiAgICAgIH1cblxuICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PSA8PCBbRGVzY2VuZGFudHMvQW5jZXN0b3JzIGFuZCByZWdpc3RyYXRpb25zXSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXG4gICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09IFt1bnNlbGVjdGFibGVdID4+ID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgICBfb25VbnNlbGVjdGFibGVBdHRyaWJ1dGVDaGFuZ2VkKCkge1xuICAgICAgICBjb25zdCB1bnNlbGVjdGFibGUgPSB0aGlzLnVuc2VsZWN0YWJsZTtcblxuICAgICAgICBpZiAodW5zZWxlY3RhYmxlKSB7XG4gICAgICAgICAgZGlzYWJsZVNlbGVjdGlvbih0aGlzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbmFibGVTZWxlY3Rpb24odGhpcyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZ2V0IHVuc2VsZWN0YWJsZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGFzQXR0cmlidXRlKCd1bnNlbGVjdGFibGUnKTtcbiAgICAgIH1cblxuICAgICAgc2V0IHVuc2VsZWN0YWJsZSh2YWx1ZSkge1xuICAgICAgICBjb25zdCBoYXNWYWx1ZSA9IEJvb2xlYW4odmFsdWUpO1xuICAgICAgICBpZiAoaGFzVmFsdWUpIHtcbiAgICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZSgndW5zZWxlY3RhYmxlJywgJycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCd1bnNlbGVjdGFibGUnKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09IDw8IFt1bnNlbGVjdGFibGVdID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0gcHJvcCBTdHJpbmdcbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICAgIF91cGdyYWRlUHJvcGVydHkocHJvcCkge1xuICAgICAgICAvLyBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS93ZWIvZnVuZGFtZW50YWxzL3dlYi1jb21wb25lbnRzL2Jlc3QtcHJhY3RpY2VzI2xhenktcHJvcGVydGllc1xuICAgICAgICAvLyBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS93ZWIvZnVuZGFtZW50YWxzL3dlYi1jb21wb25lbnRzL2V4YW1wbGVzL2hvd3RvLWNoZWNrYm94XG4gICAgICAgIC8qIGVzbGludCBuby1wcm90b3R5cGUtYnVpbHRpbnM6IDAgKi9cbiAgICAgICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXNbcHJvcF07XG4gICAgICAgICAgLy8gZ2V0IHJpZCBvZiB0aGUgcHJvcGVydHkgdGhhdCBtaWdodCBzaGFkb3cgYSBzZXR0ZXIvZ2V0dGVyXG4gICAgICAgICAgZGVsZXRlIHRoaXNbcHJvcF07XG4gICAgICAgICAgLy8gdGhpcyB0aW1lIGlmIGEgc2V0dGVyIHdhcyBkZWZpbmVkIGl0IHdpbGwgYmUgcHJvcGVybHkgY2FsbGVkXG4gICAgICAgICAgdGhpc1twcm9wXSA9IHZhbHVlO1xuICAgICAgICAgIC8vIGlmIGEgZ2V0dGVyIHdhcyBkZWZpbmVkLCBpdCB3aWxsIGJlIGNhbGxlZCBmcm9tIG5vdyBvblxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSBrZXkgU3RyaW5nXG4gICAgICAgKiBAcGFyYW0gdmFsdWUgU3RyaW5nXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgICBfZGVmaW5lQXR0cmlidXRlKGtleSwgdmFsdWUpIHtcbiAgICAgICAgLy8gZG9uJ3Qgb3ZlcnJpZGUgdXNlciBkZWZpbmVkIGF0dHJpYnV0ZVxuICAgICAgICBpZiAoIXRoaXMuaGFzQXR0cmlidXRlKGtleSkpIHtcbiAgICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBfaW5zZXJ0VGVtcGxhdGUoKSB7XG4gICAgICAgIGNvbnN0IHsgdGVtcGxhdGUgfSA9IHRoaXMuY29uc3RydWN0b3I7XG4gICAgICAgIHRlbXBsYXRlICYmXG4gICAgICAgIHRoaXMuc2hhZG93Um9vdC5hcHBlbmRDaGlsZCh0ZW1wbGF0ZS5jb250ZW50LmNsb25lTm9kZSh0cnVlKSk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSBvbGREb2N1bWVudCBIVE1MRG9jdW1lbnRcbiAgICAgICAqIEBwYXJhbSBuZXdEb2N1bWVudCBIVE1MRG9jdW1lbnRcbiAgICAgICAqL1xuICAgICAgYWRvcHRlZENhbGxiYWNrKG9sZERvY3VtZW50LCBuZXdEb2N1bWVudCkge1xuICAgICAgICAvLyB3ZWIgY29tcG9uZW50cyBzdGFuZGFyZCBBUElcbiAgICAgICAgLy8gY2FsbGJhY2tzIG9yZGVyOlxuICAgICAgICAvLyBkaXNjb25uZWN0ZWRDYWxsYmFjayA9PiBhZG9wdGVkQ2FsbGJhY2sgPT4gY29ubmVjdGVkQ2FsbGJhY2tcbiAgICAgICAgdGhpcy5fb25BZG9wdGVkQ2FsbGJhY2sob2xkRG9jdW1lbnQsIG5ld0RvY3VtZW50KTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIG9sZERvY3VtZW50IEhUTUxEb2N1bWVudFxuICAgICAgICogQHBhcmFtIG5ld0RvY3VtZW50IEhUTUxEb2N1bWVudFxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgX29uQWRvcHRlZENhbGxiYWNrKG9sZERvY3VtZW50LCBuZXdEb2N1bWVudCkge1xuICAgICAgICAvLyBDYWxsIHB1YmxpYyBob29rLlxuICAgICAgICB0aGlzLm9uQWRvcHRlZENhbGxiYWNrKG9sZERvY3VtZW50LCBuZXdEb2N1bWVudCk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogUHVibGljIGhvb2suXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIG9sZERvY3VtZW50IEhUTUxEb2N1bWVudFxuICAgICAgICogQHBhcmFtIG5ld0RvY3VtZW50IEhUTUxEb2N1bWVudFxuICAgICAgICovXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICAgIG9uQWRvcHRlZENhbGxiYWNrKG9sZERvY3VtZW50LCBuZXdEb2N1bWVudCkge1xuICAgICAgICAvLyBwYXNzXG4gICAgICB9XG5cbiAgICAgIC8qXG4gICAgICAqIHdlYiBjb21wb25lbnRzIHN0YW5kYXJkIEFQSVxuICAgICAgKiBjb25uZWN0ZWRDYWxsYmFjayBpcyBmaXJlZCBmcm9tIGNoaWxkcmVuIHRvIHBhcmVudCBpbiBzaGFkb3cgRE9NXG4gICAgICAqIGJ1dCB0aGUgb3JkZXIgaXMgbGVzcyBwcmVkaWN0YWJsZSBpbiBsaWdodCBET00uXG4gICAgICAqIFNob3VsZCBub3QgcmVhZCBsaWdodC9zaGFkb3dEb21EYnVpQ2hpbGRyZW4gaGVyZS5cbiAgICAgICogSXMgY2FsbGVkIGFmdGVyIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjay5cbiAgICAgICogKi9cbiAgICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgICAvLyBVc2luZyB0aGlzIHBhdHRlcm4gYXMgaXQgc2VlbXMgdGhhdCB0aGUgY29tcG9uZW50XG4gICAgICAgIC8vIGlzIGltbXVuZSB0byBvdmVycmlkaW5nIGNvbm5lY3RlZENhbGxiYWNrIGF0IHJ1bnRpbWUuXG4gICAgICAgIC8vIE1vc3QgcHJvYmFibHkgdGhlIGJyb3dzZXIga2VlcHMgYSByZWZlcmVuY2UgdG8gY29ubmVjdGVkQ2FsbGJhY2tcbiAgICAgICAgLy8gZXhpc3RpbmcvZGVmaW5lZCBhdCB0aGUgdGltZSBvZiB1cGdyYWRpbmcgYW5kIGNhbGxzIHRoYXQgb25lIGluc3RlYWQgb2YgdGhlXG4gICAgICAgIC8vIGxhdGVzdCAobW9ua2V5IHBhdGNoZWQgLyBydW50aW1lIGV2YWx1YXRlZCkgb25lLlxuICAgICAgICAvLyBOb3csIHdlIGNhbiBtb25rZXkgcGF0Y2ggb25Db25uZWN0ZWRDYWxsYmFjayBpZiB3ZSB3YW50LlxuICAgICAgICB0aGlzLl9vbkNvbm5lY3RlZENhbGxiYWNrKCk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgX29uQ29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHRoaXMuX2lzTW91bnRlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuX2lzRGlzY29ubmVjdGVkID0gZmFsc2U7XG4gICAgICAgIHdpbi5hZGRFdmVudExpc3RlbmVyKCdiZWZvcmV1bmxvYWQnLCB0aGlzLmRpc2Nvbm5lY3RlZENhbGxiYWNrLCBmYWxzZSk7XG4gICAgICAgIGNvbnN0IHsgcHJvcGVydGllc1RvVXBncmFkZSwgYXR0cmlidXRlc1RvRGVmaW5lIH0gPSB0aGlzLmNvbnN0cnVjdG9yO1xuICAgICAgICBwcm9wZXJ0aWVzVG9VcGdyYWRlLmZvckVhY2goKHByb3BlcnR5KSA9PiB7XG4gICAgICAgICAgdGhpcy5fdXBncmFkZVByb3BlcnR5KHByb3BlcnR5KTtcbiAgICAgICAgfSk7XG4gICAgICAgIE9iamVjdC5rZXlzKGF0dHJpYnV0ZXNUb0RlZmluZSkuZm9yRWFjaCgocHJvcGVydHkpID0+IHtcbiAgICAgICAgICB0aGlzLl9kZWZpbmVBdHRyaWJ1dGUocHJvcGVydHksIGF0dHJpYnV0ZXNUb0RlZmluZVtwcm9wZXJ0eV0pO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gV2UgY2FuIHNhZmVseSByZWdpc3RlciB0byBjbG9zZXN0RGJ1aVBhcmVudCBiZWNhdXNlIGl0IGV4aXN0cyBhdCB0aGlzIHRpbWVcbiAgICAgICAgLy8gYnV0IHdlIG11c3Qgbm90IGFzc3VtZSBpdCB3YXMgY29ubmVjdGVkLlxuICAgICAgICAvLyBOT1RFOiBldmVuIGlmIGNsb3Nlc3REYnVpUGFyZW50IChvciBhbnkgYW5jZXN0b3IpIGlzIG5vdCBjb25uZWN0ZWRcbiAgICAgICAgLy8gdGhlIHRvcCBvZiB0aGUgdHJlZSAodG9wRGJ1aUFuY2VzdG9yKSBjYW4gYmUgcmVhY2hlZCBpZiBuZWVkZWRcbiAgICAgICAgdGhpcy5fcmVnaXN0ZXJTZWxmVG9DbG9zZXN0RGJ1aVBhcmVudCgpO1xuICAgICAgICB0aGlzLl9jaGVja0NvbnRleHQoKTsgLy8gaXMgaWdub3JlZCBieSB0b3AgbW9zdCBkYnVpIGFuY2VzdG9yc1xuICAgICAgICAvLyBtYWtlcyB0b3AgbW9zdCBhbmNlc3RvcnMgb3IgZGJ1aSBjb21wb25lbnRzIGhhdmluZyBsb2NhbGVUYXJnZXQgc3BlY2lmaWVkXG4gICAgICAgIC8vIHRvIHNldCBkYnVpRGlyL0xvY2FsZSBvbiBjb250ZXh0XG4gICAgICAgIHRoaXMuX3N5bmNMb2NhbGVBbmRNb25pdG9yQ2hhbmdlcygpO1xuICAgICAgICB0aGlzLl9pbml0aWFsaXplRHluYW1pY0F0dHJpYnV0ZXNPYnNlcnZlcigpO1xuICAgICAgICAvLyBDYWxsIHB1YmxpYyBob29rLlxuICAgICAgICB0aGlzLm9uQ29ubmVjdGVkQ2FsbGJhY2soKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBQdWJsaWMgaG9vay5cbiAgICAgICAqL1xuICAgICAgb25Db25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgICAgLy8gcGFzc1xuICAgICAgfVxuXG4gICAgICAvLyB3ZWIgY29tcG9uZW50cyBzdGFuZGFyZCBBUElcbiAgICAgIGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgICB0aGlzLl9vbkRpc2Nvbm5lY3RlZENhbGxiYWNrKCk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgX29uRGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHRoaXMuX3Jlc2V0Q29udGV4dCgpO1xuICAgICAgICB0aGlzLl9yZXNldFByb3ZpZGVkTG9jYWxlKCk7XG4gICAgICAgIHRoaXMuX3VucmVnaXN0ZXJTZWxmRnJvbUNsb3Nlc3REYnVpUGFyZW50KCk7XG4gICAgICAgIHdpbi5yZW1vdmVFdmVudExpc3RlbmVyKCdiZWZvcmV1bmxvYWQnLCB0aGlzLmRpc2Nvbm5lY3RlZENhbGxiYWNrLCBmYWxzZSk7XG4gICAgICAgIHRoaXMuX2lzTW91bnRlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9pc0Rpc2Nvbm5lY3RlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuX2Nsb3Nlc3REYnVpUGFyZW50ID0gbnVsbDtcbiAgICAgICAgdGhpcy5fZGlzbWlzc0R5bmFtaWNBdHRyaWJ1dGVzT2JzZXJ2ZXIoKTtcbiAgICAgICAgLy8gQ2FsbCBwdWJsaWMgaG9vay5cbiAgICAgICAgdGhpcy5vbkRpc2Nvbm5lY3RlZENhbGxiYWNrKCk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogUHVibGljIGhvb2suXG4gICAgICAgKi9cbiAgICAgIG9uRGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIC8vIHBhc3NcbiAgICAgIH1cblxuICAgICAgY2xvbmVOb2RlRGVlcCh7IGlkUHJlZml4ID0gJycsIGlkU3VmZml4ID0gJycgfSkge1xuICAgICAgICBjb25zdCBjbG9uZSA9IHN1cGVyLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgaWYgKCFpZFByZWZpeCAmJiAhaWRTdWZmaXgpIHJldHVybiBjbG9uZTtcbiAgICAgICAgaWYgKGNsb25lLmhhc0F0dHJpYnV0ZSgnaWQnKSkge1xuICAgICAgICAgIGNsb25lLnNldEF0dHJpYnV0ZSgnaWQnLCBgJHtpZFByZWZpeH0ke2Nsb25lLmdldEF0dHJpYnV0ZSgnaWQnKX0ke2lkU3VmZml4fWApO1xuICAgICAgICB9XG4gICAgICAgIGNsb25lLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYnVpLXdlYi1jb21wb25lbnRdJykuZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgICAgICBpZiAoY2hpbGQuaGFzQXR0cmlidXRlKCdpZCcpKSB7XG4gICAgICAgICAgICBjaGlsZC5zZXRBdHRyaWJ1dGUoJ2lkJywgYCR7aWRQcmVmaXh9JHtjaGlsZC5nZXRBdHRyaWJ1dGUoJ2lkJyl9JHtpZFN1ZmZpeH1gKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gY2xvbmU7XG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIG5hbWUgU3RyaW5nXG4gICAgICAgKiBAcGFyYW0gb2xkVmFsdWUgU3RyaW5nXG4gICAgICAgKiBAcGFyYW0gbmV3VmFsdWUgU3RyaW5nXG4gICAgICAgKi9cbiAgICAgIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpIHtcbiAgICAgICAgLy8gd2ViIGNvbXBvbmVudHMgc3RhbmRhcmQgQVBJXG4gICAgICAgIC8vIFNjZW5hcmlvIDE6IGNvbXBvbmVudCB3YXMgY3JlYXRlZCBpbiBkZXRhY2hlZCB0cmVlIEJFRk9SRSBiZWluZyBkZWZpbmVkLlxuICAgICAgICAvLyBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sgd2lsbCBub3QgYmUgY2FsbGVkIHdoZW4gYmVpbmcgZGVmaW5lZCBidXQgd2hlbiBpbnNlcnRlZCBpbnRvIERPTS5cbiAgICAgICAgLy8gKHRoaXMgaW1wbGllcyBjb21wb25lbnQgaXMgdXBncmFkZWQgYWZ0ZXIgYmVpbmcgaW5zZXJ0ZWQgaW50byBET00pLlxuICAgICAgICAvLyBTY2VuYXJpbyAyOiBjb21wb25lbnQgaXMgY3JlYXRlZCBpbiBkZXRhY2hlZCB0cmVlIEFGVEVSIGJlaW5nIGRlZmluZWQuXG4gICAgICAgIC8vIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayB3aWxsIGJlIGNhbGxlZCByaWdodCBhd2F5XG4gICAgICAgIC8vICh0aGlzIGltcGxpZXMgY29tcG9uZW50IGlzIHVwZ3JhZGVkIGJlZm9yZSBiZWluZyBpbnNlcnRlZCBpbnRvIERPTSkuXG4gICAgICAgIC8vIFdoZW4gaW5zZXJ0ZWQgaW4gRE9NIHRoZW4gY29ubmVjdGVkQ2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQuXG4gICAgICAgIC8vIEluIGFueSBjYXNlIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayBpcyBjYWxsZWQgYmVmb3JlIGNvbm5lY3RlZENhbGxiYWNrLlxuICAgICAgICAvLyBUaGluZ3MgY2hhbmdlZCBhcyBhIHJlc3VsdCBvZiBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sgc2hvdWxkIGJlIHByZXNlcnZlZFxuICAgICAgICAvLyB3aGVuIGRpc2Nvbm5lY3RlZENhbGxiYWNrIGJlY2F1c2UgdGhlc2UgYXR0cmlidXRlIGNoYW5nZXMgd2lsbCBub3QgYmUgZmlyZWQgYWdhaW5cbiAgICAgICAgLy8gd2hlbiBub2RlIGlzIHJlbW92ZWQgdGhlbiByZS1pbnNlcnRlZCBiYWNrIGluIHRoZSBET00gdHJlZS5cbiAgICAgICAgaWYgKHRoaXMuZ2V0QXR0cmlidXRlKG5hbWUpID09PSBvbGRWYWx1ZSkgcmV0dXJuO1xuICAgICAgICB0aGlzLl9vbkF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0gbmFtZSBTdHJpbmdcbiAgICAgICAqIEBwYXJhbSBvbGRWYWx1ZSBTdHJpbmdcbiAgICAgICAqIEBwYXJhbSBuZXdWYWx1ZSBTdHJpbmdcbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICAgIF9vbkF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpIHtcbiAgICAgICAgWydkaXInLCAnbGFuZycsICdzeW5jLWxvY2FsZS13aXRoJ10uaW5jbHVkZXMobmFtZSkgJiZcbiAgICAgICAgICB0aGlzLl9vbkxvY2FsZUF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpO1xuICAgICAgICBuYW1lID09PSAndW5zZWxlY3RhYmxlJyAmJlxuICAgICAgICAgIHRoaXMuX29uVW5zZWxlY3RhYmxlQXR0cmlidXRlQ2hhbmdlZCgpO1xuICAgICAgICAvLyBDYWxsIHB1YmxpYyBob29rLlxuICAgICAgICB0aGlzLm9uQXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogUHVibGljIGhvb2suXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIG5hbWUgU3RyaW5nXG4gICAgICAgKiBAcGFyYW0gb2xkVmFsdWUgU3RyaW5nXG4gICAgICAgKiBAcGFyYW0gbmV3VmFsdWUgU3RyaW5nXG4gICAgICAgKi9cbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgICAgb25BdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlKSB7XG4gICAgICAgIC8vIHBhc3NcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ga2xhc3MgQ2xhc3NcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzKGtsYXNzKSB7XG4gICAgICBjb25zdCB0ZW1wbGF0ZUlubmVySFRNTCA9IGtsYXNzLnRlbXBsYXRlSW5uZXJIVE1MO1xuICAgICAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAgICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gdGVtcGxhdGVJbm5lckhUTUw7XG5cbiAgICAgIC8qKlxuICAgICAgICogQHByb3BlcnR5IHRlbXBsYXRlIChnZXR0ZXIpIHRlbXBsYXRlIGVsZW1lbnRcbiAgICAgICAqL1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGtsYXNzLCAndGVtcGxhdGUnLCB7XG4gICAgICAgIGdldCgpIHsgcmV0dXJuIHRlbXBsYXRlOyB9LFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9KTtcblxuICAgICAgLyoqXG4gICAgICAgKiBAcHJvcGVydHkgY29tcG9uZW50U3R5bGUgKGdldHRlci9zZXR0ZXIpIFN0cmluZ1xuICAgICAgICovXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoa2xhc3MsICdjb21wb25lbnRTdHlsZScsIHtcbiAgICAgICAgZ2V0KCkge1xuICAgICAgICAgIHJldHVybiBrbGFzcy50ZW1wbGF0ZS5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ3N0eWxlJykuaW5uZXJIVE1MO1xuICAgICAgICB9LFxuICAgICAgICBzZXQodmFsdWUpIHtcbiAgICAgICAgICBrbGFzcy50ZW1wbGF0ZS5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ3N0eWxlJykuaW5uZXJIVE1MID0gdmFsdWU7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4ga2xhc3M7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gUmVnaXN0ZXJhYmxlKGtsYXNzKSB7XG4gICAgICBrbGFzcy5yZWdpc3RlclNlbGYgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlZ2lzdHJhdGlvbk5hbWUgPSBrbGFzcy5yZWdpc3RyYXRpb25OYW1lO1xuICAgICAgICBjb25zdCBkZXBlbmRlbmNpZXMgPSBrbGFzcy5kZXBlbmRlbmNpZXM7XG4gICAgICAgIC8vIE1ha2Ugc3VyZSBvdXIgZGVwZW5kZW5jaWVzIGFyZSByZWdpc3RlcmVkIGJlZm9yZSB3ZSByZWdpc3RlciBzZWxmXG4gICAgICAgIGRlcGVuZGVuY2llcy5mb3JFYWNoKChkZXBlbmRlbmN5KSA9PiBkZXBlbmRlbmN5LnJlZ2lzdGVyU2VsZigpKTtcbiAgICAgICAgLy8gRG9uJ3QgdHJ5IHRvIHJlZ2lzdGVyIHNlbGYgaWYgYWxyZWFkeSByZWdpc3RlcmVkXG4gICAgICAgIGlmIChjdXN0b21FbGVtZW50cy5nZXQocmVnaXN0cmF0aW9uTmFtZSkpIHJldHVybiByZWdpc3RyYXRpb25OYW1lO1xuICAgICAgICAvLyBHaXZlIGEgY2hhbmNlIHRvIG92ZXJyaWRlIHdlYi1jb21wb25lbnQgc3R5bGUgaWYgcHJvdmlkZWQgYmVmb3JlIGJlaW5nIHJlZ2lzdGVyZWQuXG4gICAgICAgIGNvbnN0IGNvbXBvbmVudFN0eWxlID0gKCh3aW4uREJVSVdlYkNvbXBvbmVudHMgfHwge30pW3JlZ2lzdHJhdGlvbk5hbWVdIHx8IHt9KS5jb21wb25lbnRTdHlsZTtcbiAgICAgICAgaWYgKGNvbXBvbmVudFN0eWxlKSB7XG4gICAgICAgICAga2xhc3MuY29tcG9uZW50U3R5bGUgKz0gJ1xcblxcbi8qID09PT0gb3ZlcnJpZGVzID09PT0gKi9cXG5cXG4nO1xuICAgICAgICAgIGtsYXNzLmNvbXBvbmVudFN0eWxlICs9IGNvbXBvbmVudFN0eWxlO1xuICAgICAgICB9XG4gICAgICAgIC8vIERvIHJlZ2lzdHJhdGlvblxuICAgICAgICAvLyBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9jdXN0b20tZWxlbWVudHMuaHRtbCNjb25jZXB0LXVwZ3JhZGUtYW4tZWxlbWVudFxuICAgICAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUocmVnaXN0cmF0aW9uTmFtZSwga2xhc3MpO1xuICAgICAgICByZXR1cm4gcmVnaXN0cmF0aW9uTmFtZTtcbiAgICAgIH07XG5cbiAgICAgIC8qKlxuICAgICAgICogQHByb3BlcnR5IHByb3RvdHlwZUNoYWluSW5mbyAoZ2V0dGVyKSBBcnJheTxQcm90b3R5cGU+XG4gICAgICAgKi9cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShrbGFzcywgJ3Byb3RvdHlwZUNoYWluSW5mbycsIHtcbiAgICAgICAgZ2V0KCkge1xuICAgICAgICAgIGNvbnN0IGNoYWluID0gW2tsYXNzXTtcbiAgICAgICAgICBsZXQgcGFyZW50UHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yoa2xhc3MpO1xuICAgICAgICAgIHdoaWxlIChwYXJlbnRQcm90byAhPT0gSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgIGNoYWluLnB1c2gocGFyZW50UHJvdG8pO1xuICAgICAgICAgICAgcGFyZW50UHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YocGFyZW50UHJvdG8pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjaGFpbi5wdXNoKHBhcmVudFByb3RvKTtcbiAgICAgICAgICByZXR1cm4gY2hhaW47XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4ga2xhc3M7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIERCVUlXZWJDb21wb25lbnRCYXNlLFxuICAgICAgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyxcbiAgICAgIFJlZ2lzdGVyYWJsZVxuICAgIH07XG4gIH0pO1xufVxuIiwiXG5jb25zdCByZWFkT25seVByb3BlcnRpZXMgPSBbJ2ZvY3VzZWQnXTtcblxuY29uc3QgRVJST1JfTUVTU0FHRVMgPSB7XG4gIGZvY3VzZWQ6IGAnZm9jdXNlZCcgcHJvcGVydHkgaXMgcmVhZC1vbmx5IGFzIGl0IGlzIGNvbnRyb2xsZWQgYnkgdGhlIGNvbXBvbmVudC5cbklmIHlvdSB3YW50IHRvIHNldCBmb2N1cyBwcm9ncmFtbWF0aWNhbGx5IGNhbGwgLmZvY3VzKCkgbWV0aG9kIG9uIGNvbXBvbmVudC5cbmBcbn07XG5cbi8qKlxuICogV2hlbiBhbiBpbm5lciBmb2N1c2FibGUgaXMgZm9jdXNlZCAoZXg6IHZpYSBjbGljaykgdGhlIGVudGlyZSBjb21wb25lbnQgZ2V0cyBmb2N1c2VkLlxuICogV2hlbiB0aGUgY29tcG9uZW50IGdldHMgZm9jdXNlZCAoZXg6IHZpYSB0YWIpIHRoZSBmaXJzdCBpbm5lciBmb2N1c2FibGUgZ2V0cyBmb2N1c2VkIHRvby5cbiAqIFdoZW4gdGhlIGNvbXBvbmVudCBnZXRzIGRpc2FibGVkIGl0IGdldHMgYmx1cnJlZCB0b28gYW5kIGFsbCBpbm5lciBmb2N1c2FibGVzIGdldCBkaXNhYmxlZCBhbmQgYmx1cnJlZC5cbiAqIFdoZW4gZGlzYWJsZWQgdGhlIGNvbXBvbmVudCBjYW5ub3QgYmUgZm9jdXNlZC5cbiAqIFdoZW4gZW5hYmxlZCB0aGUgY29tcG9uZW50IGNhbiBiZSBmb2N1c2VkLlxuICogQHBhcmFtIEtsYXNzXG4gKiBAcmV0dXJucyB7Rm9jdXNhYmxlfVxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEZvY3VzYWJsZShLbGFzcykge1xuXG4gIEtsYXNzLmNvbXBvbmVudFN0eWxlICs9IGBcbiAgOmhvc3QoW2Rpc2FibGVkXSkge1xuICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgb3BhY2l0eTogMC41O1xuICAgIFxuICAgIC13ZWJraXQtdG91Y2gtY2FsbG91dDogbm9uZTtcbiAgICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1xuICAgIC1raHRtbC11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAtbW96LXVzZXItc2VsZWN0OiBub25lO1xuICAgIC1tcy11c2VyLXNlbGVjdDogbm9uZTtcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgfVxuICBcbiAgOmhvc3QoW2Rpc2FibGVkXSkgKiB7XG4gICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gIH1cbiAgYDtcblxuICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9DU1MvOmZvY3VzLXdpdGhpblxuXG4gIGNsYXNzIEZvY3VzYWJsZSBleHRlbmRzIEtsYXNzIHtcblxuICAgIHN0YXRpYyBnZXQgbmFtZSgpIHtcbiAgICAgIHJldHVybiBzdXBlci5uYW1lO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXQgcHJvcGVydGllc1RvVXBncmFkZSgpIHtcbiAgICAgIC8vIFRoZSByZWFzb24gZm9yIHVwZ3JhZGluZyAnZm9jdXNlZCcgaXMgb25seSB0byBzaG93IGFuIHdhcm5pbmdcbiAgICAgIC8vIGlmIHRoZSBjb25zdW1lciBvZiB0aGUgY29tcG9uZW50IGF0dGVtcHRlZCB0byBzZXQgZm9jdXMgcHJvcGVydHlcbiAgICAgIC8vIHdoaWNoIGlzIHJlYWQtb25seS5cbiAgICAgIHJldHVybiBbLi4uc3VwZXIucHJvcGVydGllc1RvVXBncmFkZSwgJ2ZvY3VzZWQnLCAnZGlzYWJsZWQnXTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0IG9ic2VydmVkQXR0cmlidXRlcygpIHtcbiAgICAgIHJldHVybiBbLi4uc3VwZXIub2JzZXJ2ZWRBdHRyaWJ1dGVzLCAnZGlzYWJsZWQnXTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgICBzdXBlciguLi5hcmdzKTtcblxuICAgICAgdGhpcy5fY3VycmVudElubmVyRm9jdXNlZCA9IG51bGw7XG4gICAgICB0aGlzLl9zaWRlRWZmZWN0c0FwcGxpZWRGb3IgPSBudWxsO1xuICAgICAgdGhpcy5fb25Jbm5lckZvY3VzYWJsZUZvY3VzZWQgPSB0aGlzLl9vbklubmVyRm9jdXNhYmxlRm9jdXNlZC5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5fb25Gb2N1cyA9IHRoaXMuX29uRm9jdXMuYmluZCh0aGlzKTtcbiAgICAgIHRoaXMuX29uQmx1ciA9IHRoaXMuX29uQmx1ci5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5fb25Eb2N1bWVudFRhcCA9IHRoaXMuX29uRG9jdW1lbnRUYXAuYmluZCh0aGlzKTtcbiAgICB9XG5cbiAgICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlKSB7XG4gICAgICBzdXBlci5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlKTtcblxuICAgICAgY29uc3QgaGFzVmFsdWUgPSBuZXdWYWx1ZSAhPT0gbnVsbDtcbiAgICAgIGlmIChuYW1lID09PSAnZGlzYWJsZWQnKSB7XG4gICAgICAgIGhhc1ZhbHVlID8gdGhpcy5fYXBwbHlEaXNhYmxlZFNpZGVFZmZlY3RzKCkgOiB0aGlzLl9hcHBseUVuYWJsZWRTaWRlRWZmZWN0cygpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgc3VwZXIuY29ubmVjdGVkQ2FsbGJhY2soKTtcblxuICAgICAgcmVhZE9ubHlQcm9wZXJ0aWVzLmZvckVhY2goKHJlYWRPbmx5UHJvcGVydHkpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaGFzQXR0cmlidXRlKHJlYWRPbmx5UHJvcGVydHkpKSB7XG4gICAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUocmVhZE9ubHlQcm9wZXJ0eSk7XG4gICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgICAgICAgY29uc29sZS53YXJuKEVSUk9SX01FU1NBR0VTW3JlYWRPbmx5UHJvcGVydHldKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgIHRoaXMuX2FwcGx5RGlzYWJsZWRTaWRlRWZmZWN0cygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fYXBwbHlFbmFibGVkU2lkZUVmZmVjdHMoKTtcbiAgICAgIH1cblxuICAgICAgLy8gd2hlbiBjb21wb25lbnQgZm9jdXNlZC9ibHVycmVkXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdGhpcy5fb25Gb2N1cyk7XG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCB0aGlzLl9vbkJsdXIpO1xuICAgICAgdGhpcy5vd25lckRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuX29uRG9jdW1lbnRUYXApO1xuICAgICAgdGhpcy5vd25lckRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl9vbkRvY3VtZW50VGFwKTtcblxuICAgICAgdGhpcy5faW5uZXJGb2N1c2FibGVzLmZvckVhY2goKGZvY3VzYWJsZSkgPT4ge1xuICAgICAgICAvLyB3aGVuIGlubmVyIGZvY3VzYWJsZSBmb2N1c2VkXG4gICAgICAgIGZvY3VzYWJsZS5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIHRoaXMuX29uSW5uZXJGb2N1c2FibGVGb2N1c2VkKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgc3VwZXIuZGlzY29ubmVjdGVkQ2FsbGJhY2soKTtcblxuICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKCdmb2N1cycsIHRoaXMuX29uRm9jdXMpO1xuICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKCdibHVyJywgdGhpcy5fb25CbHVyKTtcbiAgICAgIHRoaXMub3duZXJEb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLl9vbkRvY3VtZW50VGFwKTtcbiAgICAgIHRoaXMub3duZXJEb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5fb25Eb2N1bWVudFRhcCk7XG5cbiAgICAgIHRoaXMuX2lubmVyRm9jdXNhYmxlcy5mb3JFYWNoKChmb2N1c2FibGUpID0+IHtcbiAgICAgICAgZm9jdXNhYmxlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdGhpcy5fb25Jbm5lckZvY3VzYWJsZUZvY3VzZWQpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVhZCBvbmx5LlxuICAgICAqIEByZXR1cm4gQm9vbGVhblxuICAgICAqL1xuICAgIGdldCBmb2N1c2VkKCkge1xuICAgICAgcmV0dXJuIHRoaXMuaGFzQXR0cmlidXRlKCdmb2N1c2VkJyk7XG4gICAgfVxuXG4gICAgc2V0IGZvY3VzZWQoXykge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgICBjb25zb2xlLndhcm4oRVJST1JfTUVTU0FHRVMuZm9jdXNlZCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIEJvb2xlYW5cbiAgICAgKi9cbiAgICBnZXQgZGlzYWJsZWQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5oYXNBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgfVxuXG4gICAgc2V0IGRpc2FibGVkKHZhbHVlKSB7XG4gICAgICBjb25zdCBoYXNWYWx1ZSA9IEJvb2xlYW4odmFsdWUpO1xuICAgICAgaWYgKGhhc1ZhbHVlKSB7XG4gICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICcnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHJldHVybiBBcnJheTxIVE1MRWxlbWVudD5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGdldCBfaW5uZXJGb2N1c2FibGVzKCkge1xuICAgICAgcmV0dXJuIHRoaXMuc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yQWxsKCdbdGFiaW5kZXhdJykgfHwgW107XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIEhUTUxFbGVtZW50IHx8IG51bGxcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGdldCBfZmlyc3RJbm5lckZvY3VzYWJsZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLnNoYWRvd1Jvb3QucXVlcnlTZWxlY3RvcignW3RhYmluZGV4XScpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIGV2dCBFdmVudCAobW91c2Vkb3duL3RvdWNoc3RhcnQpXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfb25Eb2N1bWVudFRhcChldnQpIHtcbiAgICAgIGlmIChldnQudGFyZ2V0ICE9PSB0aGlzKSB7XG4gICAgICAgIHRoaXMuYmx1cigpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIGV2dCBFdmVudCAoRm9jdXNFdmVudClcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9vbklubmVyRm9jdXNhYmxlRm9jdXNlZChldnQpIHtcbiAgICAgIHRoaXMuX2N1cnJlbnRJbm5lckZvY3VzZWQgPSBldnQudGFyZ2V0O1xuICAgIH1cblxuICAgIF9vbkZvY3VzKCkge1xuICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHJldHVybjtcbiAgICAgIC8vIE9ubHkgZm9yIHN0eWxpbmcgcHVycG9zZS5cbiAgICAgIC8vIEZvY3VzZWQgcHJvcGVydHkgaXMgY29udHJvbGxlZCBmcm9tIGluc2lkZS5cbiAgICAgIC8vIEF0dGVtcHQgdG8gc2V0IHRoaXMgcHJvcGVydHkgZnJvbSBvdXRzaWRlIHdpbGwgdHJpZ2dlciBhIHdhcm5pbmdcbiAgICAgIC8vIGFuZCB3aWxsIGJlIGlnbm9yZWRcbiAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdmb2N1c2VkJywgJycpO1xuICAgICAgdGhpcy5fYXBwbHlGb2N1c1NpZGVFZmZlY3RzKCk7XG4gICAgfVxuXG4gICAgX29uQmx1cigpIHtcbiAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCdmb2N1c2VkJyk7XG4gICAgICB0aGlzLl9hcHBseUJsdXJTaWRlRWZmZWN0cygpO1xuICAgIH1cblxuICAgIF9hcHBseUZvY3VzU2lkZUVmZmVjdHMoKSB7XG4gICAgICBpZiAodGhpcy5fY3VycmVudElubmVyRm9jdXNlZCkge1xuICAgICAgICAvLyBTb21lIGlubmVyIGNvbXBvbmVudCBpcyBhbHJlYWR5IGZvY3VzZWQuXG4gICAgICAgIC8vIE5vIG5lZWQgdG8gc2V0IGZvY3VzIG9uIGFueXRoaW5nLlxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLl9mb2N1c0ZpcnN0SW5uZXJGb2N1c2FibGUoKTtcbiAgICB9XG5cbiAgICBfYXBwbHlCbHVyU2lkZUVmZmVjdHMoKSB7XG4gICAgICBpZiAodGhpcy5fY3VycmVudElubmVyRm9jdXNlZCkge1xuICAgICAgICB0aGlzLl9jdXJyZW50SW5uZXJGb2N1c2VkLmJsdXIoKTtcbiAgICAgICAgdGhpcy5fY3VycmVudElubmVyRm9jdXNlZCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2ZvY3VzRmlyc3RJbm5lckZvY3VzYWJsZSgpIHtcbiAgICAgIGNvbnN0IGZpcnN0SW5uZXJGb2N1c2FibGUgPSB0aGlzLl9maXJzdElubmVyRm9jdXNhYmxlO1xuICAgICAgaWYgKGZpcnN0SW5uZXJGb2N1c2FibGUpIHtcbiAgICAgICAgdGhpcy5fY3VycmVudElubmVyRm9jdXNlZCA9IGZpcnN0SW5uZXJGb2N1c2FibGU7XG4gICAgICAgIGZpcnN0SW5uZXJGb2N1c2FibGUuZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfYXBwbHlEaXNhYmxlZFNpZGVFZmZlY3RzKCkge1xuICAgICAgaWYgKHRoaXMuX3NpZGVFZmZlY3RzQXBwbGllZEZvciA9PT0gJ2Rpc2FibGVkJykgcmV0dXJuO1xuICAgICAgdGhpcy5fbGFzdFRhYkluZGV4VmFsdWUgPSB0aGlzLmdldEF0dHJpYnV0ZSgndGFiaW5kZXgnKTtcbiAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCd0YWJpbmRleCcpO1xuICAgICAgdGhpcy5faW5uZXJGb2N1c2FibGVzLmZvckVhY2goKGlubmVyRm9jdXNhYmxlKSA9PiB7XG4gICAgICAgIGlubmVyRm9jdXNhYmxlLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcbiAgICAgICAgaW5uZXJGb2N1c2FibGUuc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICdkaXNhYmxlZCcpO1xuICAgICAgICBpZiAoaW5uZXJGb2N1c2FibGUuaGFzQXR0cmlidXRlKCdjb250ZW50ZWRpdGFibGUnKSkge1xuICAgICAgICAgIGlubmVyRm9jdXNhYmxlLnNldEF0dHJpYnV0ZSgnY29udGVudGVkaXRhYmxlJywgJ2ZhbHNlJyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhpcy5ibHVyKCk7XG4gICAgICB0aGlzLl9zaWRlRWZmZWN0c0FwcGxpZWRGb3IgPSAnZGlzYWJsZWQnO1xuICAgIH1cblxuICAgIF9hcHBseUVuYWJsZWRTaWRlRWZmZWN0cygpIHtcbiAgICAgIGlmICh0aGlzLl9zaWRlRWZmZWN0c0FwcGxpZWRGb3IgPT09ICdlbmFibGVkJykgcmV0dXJuO1xuICAgICAgIXRoaXMuZ2V0QXR0cmlidXRlKCd0YWJpbmRleCcpICYmIHRoaXMuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIHRoaXMuX2xhc3RUYWJJbmRleFZhbHVlIHx8IDApO1xuICAgICAgdGhpcy5faW5uZXJGb2N1c2FibGVzLmZvckVhY2goKGlubmVyRm9jdXNhYmxlKSA9PiB7XG4gICAgICAgIGlubmVyRm9jdXNhYmxlLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnMCcpO1xuICAgICAgICBpbm5lckZvY3VzYWJsZS5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgICAgIGlmIChpbm5lckZvY3VzYWJsZS5oYXNBdHRyaWJ1dGUoJ2NvbnRlbnRlZGl0YWJsZScpKSB7XG4gICAgICAgICAgaW5uZXJGb2N1c2FibGUuc2V0QXR0cmlidXRlKCdjb250ZW50ZWRpdGFibGUnLCAndHJ1ZScpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX3NpZGVFZmZlY3RzQXBwbGllZEZvciA9ICdlbmFibGVkJztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gRm9jdXNhYmxlO1xufVxuIiwiaW1wb3J0IGFwcGVuZFN0eWxlcyBmcm9tICcuLi8uLi9pbnRlcm5hbHMvYXBwZW5kU3R5bGVzJztcblxuLyoqXG4qIEBwYXJhbSBjb21wb25lbnRzIEFycmF5PE9iamVjdD4gW3tcbiogIHJlZ2lzdHJhdGlvbk5hbWUsXG4qICBjb21wb25lbnRTdHlsZSxcbiogIC4uLlxuKiB9XVxuKiBAcmV0dXJucyBjb21wb25lbnRzIEFycmF5PE9iamVjdD5cbiovXG5jb25zdCBkYnVpV2ViQ29tcG9uZW50c1NldFVwID0gKHdpbikgPT4gKGNvbXBvbmVudHMpID0+IHtcbiAgcmV0dXJuIGFwcGVuZFN0eWxlcyh3aW4pKGNvbXBvbmVudHMpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZGJ1aVdlYkNvbXBvbmVudHNTZXRVcDtcbiIsIi8qIGVzbGludCBtYXgtbGVuOiAwICovXG4vLyBIZWxwZXJzXG5pbXBvcnQgZGJ1aVdlYkNvbXBvbmVudHNTZXRVcCBmcm9tICcuL3dlYi1jb21wb25lbnRzL2hlbHBlcnMvZGJ1aVdlYkNvbXBvbmVudHNTZXR1cCc7XG5cbi8vIEludGVybmFsc1xuaW1wb3J0IGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbiBmcm9tICcuL2ludGVybmFscy9lbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24nO1xuXG4vLyBDb21wb25lbnRCYXNlXG5pbXBvcnQgZ2V0REJVSVdlYkNvbXBvbmVudENvcmUgZnJvbSAnLi93ZWItY29tcG9uZW50cy9jb21wb25lbnRzL0RCVUlXZWJDb21wb25lbnRDb3JlL0RCVUlXZWJDb21wb25lbnRDb3JlJztcblxuLy8gRGVjb3JhdG9yc1xuaW1wb3J0IEZvY3VzYWJsZSBmcm9tICcuL3dlYi1jb21wb25lbnRzL2RlY29yYXRvcnMvRm9jdXNhYmxlJztcblxuLy8gU2VydmljZXNcbmltcG9ydCBnZXREQlVJTG9jYWxlU2VydmljZSBmcm9tICcuL3NlcnZpY2VzL0RCVUlMb2NhbGVTZXJ2aWNlJztcbmltcG9ydCBnZXREQlVJSTE4blNlcnZpY2UgZnJvbSAnLi9zZXJ2aWNlcy9EQlVJSTE4blNlcnZpY2UnO1xuXG4vLyBVdGlsc1xuaW1wb3J0IGZvcm1hdHRlcnMgZnJvbSAnLi91dGlscy9mb3JtYXR0ZXJzJztcbmltcG9ydCB0b2dnbGVTZWxlY3RhYmxlIGZyb20gJy4vdXRpbHMvdG9nZ2xlU2VsZWN0YWJsZSc7XG5pbXBvcnQgdGVtcGxhdGUgZnJvbSAnLi91dGlscy90ZW1wbGF0ZSc7XG5pbXBvcnQgb25TY3JlZW5Db25zb2xlIGZyb20gJy4vdXRpbHMvb25TY3JlZW5Db25zb2xlJztcblxuLy8gQ29tcG9uZW50c1xuaW1wb3J0IGdldERCVUlEdW1teSBmcm9tICcuL3dlYi1jb21wb25lbnRzL2NvbXBvbmVudHMvREJVSUR1bW15L0RCVUlEdW1teSc7XG5pbXBvcnQgZ2V0REJVSUR1bW15UGFyZW50IGZyb20gJy4vd2ViLWNvbXBvbmVudHMvY29tcG9uZW50cy9EQlVJRHVtbXlQYXJlbnQvREJVSUR1bW15UGFyZW50JztcbmltcG9ydCBnZXREQlVJRm9ybUlucHV0VGV4dCBmcm9tICcuL3dlYi1jb21wb25lbnRzL2NvbXBvbmVudHMvREJVSUZvcm1JbnB1dFRleHQvREJVSUZvcm1JbnB1dFRleHQnO1xuaW1wb3J0IGdldERCVUlJY29uIGZyb20gJy4vd2ViLWNvbXBvbmVudHMvY29tcG9uZW50cy9EQlVJSWNvbi9EQlVJSWNvbic7XG5pbXBvcnQgZ2V0REJVSVRyYW5zbGF0ZWQgZnJvbSAnLi93ZWItY29tcG9uZW50cy9jb21wb25lbnRzL0RCVUlUcmFuc2xhdGVkL0RCVUlUcmFuc2xhdGVkJztcbmltcG9ydCBnZXREQlVJRHJhZ2dhYmxlIGZyb20gJy4vd2ViLWNvbXBvbmVudHMvY29tcG9uZW50cy9EQlVJRHJhZ2dhYmxlL0RCVUlEcmFnZ2FibGUnO1xuXG5jb25zdCByZWdpc3RyYXRpb25zID0ge1xuICBbZ2V0REJVSUR1bW15LnJlZ2lzdHJhdGlvbk5hbWVdOlxuICAgIGdldERCVUlEdW1teSxcbiAgW2dldERCVUlEdW1teVBhcmVudC5yZWdpc3RyYXRpb25OYW1lXTpcbiAgICBnZXREQlVJRHVtbXlQYXJlbnQsXG4gIFtnZXREQlVJRm9ybUlucHV0VGV4dC5yZWdpc3RyYXRpb25OYW1lXTpcbiAgICBnZXREQlVJRm9ybUlucHV0VGV4dCxcbiAgW2dldERCVUlJY29uLnJlZ2lzdHJhdGlvbk5hbWVdOlxuICAgIGdldERCVUlJY29uLFxuICBbZ2V0REJVSVRyYW5zbGF0ZWQucmVnaXN0cmF0aW9uTmFtZV06XG4gICAgZ2V0REJVSVRyYW5zbGF0ZWQsXG4gIFtnZXREQlVJRHJhZ2dhYmxlLnJlZ2lzdHJhdGlvbk5hbWVdOlxuICAgIGdldERCVUlEcmFnZ2FibGVcbn07XG5cbi8qXG5UaGlzIGhlbHBlciBmdW5jdGlvbiBpcyBqdXN0IGZvciBjb252ZW5pZW5jZS5cblVzaW5nIGl0IGltcGxpZXMgdGhhdCBlbnRpcmUgREJVSVdlYkNvbXBvbmVudHMgbGlicmFyeSBpcyBhbHJlYWR5IGxvYWRlZC5cbkl0IGlzIHVzZWZ1bCBlc3BlY2lhbGx5IHdoZW4gd29ya2luZyB3aXRoIGRpc3RyaWJ1dGlvbiBidWlsZC5cbklmIG9uZSB3YW50cyB0byBsb2FkIGp1c3Qgb25lIHdlYi1jb21wb25lbnQgb3IgYSBzdWJzZXQgb2YgY29yZVxudGhleSBzaG91bGQgYmUgbG9hZGVkIGZyb20gbm9kZV9tb2R1bGVzL2Rldi1ib3gtdWkvY29yZSBieSB0aGVpciBwYXRoXG5leDpcbmltcG9ydCBTb21lQ29tcG9uZW50TG9hZGVyIGZyb20gbm9kZV9tb2R1bGVzL2Rldi1ib3gtdWkvY29yZS9wYXRoL3RvL1NvbWVDb21wb25lbnQ7XG4qL1xuZnVuY3Rpb24gcXVpY2tTZXR1cEFuZExvYWQod2luID0gd2luZG93KSB7XG4gIC8qKlxuICAgKiBAcGFyYW0gY29tcG9uZW50cyBPYmplY3Qge1xuICAgKiAgcmVnaXN0cmF0aW9uTmFtZSxcbiAgICogIGNvbXBvbmVudFN0eWxlXG4gICAqIH1cbiAgICogQHJldHVybiBPYmplY3QgeyA8cmVnaXN0cmF0aW9uTmFtZT4sIDxjb21wb25lbnRDbGFzcz4gfVxuICAgKi9cbiAgcmV0dXJuIChjb21wb25lbnRzKSA9PiB7XG4gICAgcmV0dXJuIGRidWlXZWJDb21wb25lbnRzU2V0VXAod2luKShjb21wb25lbnRzKVxuICAgICAgLnJlZHVjZSgoYWNjLCB7IHJlZ2lzdHJhdGlvbk5hbWUgfSkgPT4ge1xuICAgICAgICBjb25zdCBjb21wb25lbnRDbGFzcyA9IHJlZ2lzdHJhdGlvbnNbcmVnaXN0cmF0aW9uTmFtZV0od2luZG93KTtcbiAgICAgICAgY29tcG9uZW50Q2xhc3MucmVnaXN0ZXJTZWxmKCk7XG4gICAgICAgIGFjY1tyZWdpc3RyYXRpb25OYW1lXSA9IGNvbXBvbmVudENsYXNzO1xuICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgfSwge30pO1xuICB9O1xufVxuXG5leHBvcnQge1xuICByZWdpc3RyYXRpb25zLFxuXG4gIC8vIEhlbHBlcnNcbiAgcXVpY2tTZXR1cEFuZExvYWQsXG4gIGRidWlXZWJDb21wb25lbnRzU2V0VXAsXG5cbiAgLy8gSW50ZXJuYWxzXG4gIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbixcblxuICAvLyBDb21wb25lbnRDb3JlXG4gIGdldERCVUlXZWJDb21wb25lbnRDb3JlLFxuXG4gIC8vIERlY29yYXRvcnNcbiAgRm9jdXNhYmxlLFxuXG4gIC8vIFNlcnZpY2VzXG4gIGdldERCVUlMb2NhbGVTZXJ2aWNlLFxuICBnZXREQlVJSTE4blNlcnZpY2UsXG5cbiAgLy8gVXRpbHNcbiAgZm9ybWF0dGVycyxcbiAgdG9nZ2xlU2VsZWN0YWJsZSxcbiAgdGVtcGxhdGUsXG4gIG9uU2NyZWVuQ29uc29sZSxcblxuICAvLyBDb21wb25lbnRzXG4gIGdldERCVUlEdW1teSxcbiAgZ2V0REJVSUR1bW15UGFyZW50LFxuICBnZXREQlVJRm9ybUlucHV0VGV4dCxcbiAgZ2V0REJVSUljb24sXG4gIGdldERCVUlUcmFuc2xhdGVkLFxuICBnZXREQlVJRHJhZ2dhYmxlXG59O1xuXG4vKiBlc2xpbnQgbm8tY29uc29sZTogMCAqL1xuXG5sZXQgYnVpbGQgPSAncHJvZHVjdGlvbic7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIGJ1aWxkID0gJ2RldmVsb3AnO1xufVxuXG5jb25zb2xlLmxvZyhgVXNpbmcgREJVSVdlYkNvbXBvbmVudHNEaXN0TGliICR7YnVpbGR9IGJ1aWxkLmApO1xuXG4iXX0=
