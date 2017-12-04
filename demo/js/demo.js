(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cache = undefined;
exports.default = getDBUWebComponentBase;

var _LocaleService = require('../../services/LocaleService');

var _LocaleService2 = _interopRequireDefault(_LocaleService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log('importing getDBUWebComponentBase');

const cache = exports.cache = new WeakMap();

function getDBUWebComponentBase(win) {
  if (cache.has(win)) {
    return cache.get(win);
  }

  const { document, HTMLElement, customElements } = win;

  const template = document.createElement('template');
  template.innerHTML = '<style></style><slot></slot>';

  class DBUWebComponentBase extends HTMLElement {

    static get template() {
      return template;
    }

    static get dependencies() {
      return [];
    }

    static get useShadow() {
      return true;
    }

    constructor() {
      super();
      const { useShadow } = this.constructor;
      if (useShadow) {
        this.attachShadow({ mode: 'open' });
      }
      this._insertTemplate();

      this.connectedCallback = this.connectedCallback.bind(this);
      this.disconnectedCallback = this.disconnectedCallback.bind(this);
      this._handleLocaleChange = this._handleLocaleChange.bind(this);
      this.onLocaleChange && (this.onLocaleChange = this.onLocaleChange.bind(this));
      this.unregisterLocaleChange = null;
    }

    connectedCallback() {

      window.addEventListener('beforeunload', this.disconnectedCallback, false);

      this.unregisterLocaleChange = _LocaleService2.default.onLocaleChange(this._handleLocaleChange);
    }

    disconnectedCallback() {
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
      this.childrenTree.innerHTML = '';
      this._insertTemplate();
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
      enumerable: true,
      configurable: true
    });
    klass.registerSelf = () => {
      const componentName = klass.componentName;
      const dependencies = klass.dependencies;
      dependencies.forEach(dependency => dependency.registerSelf());
      if (customElements.get(componentName)) return;
      const componentStyle = ((win.DBUWebComponents || {})[componentName] || {}).componentStyle;
      if (componentStyle) {
        klass.componentStyle += componentStyle;
      }
      customElements.define(componentName, klass);
    };
  }

  cache.set(win, {
    DBUWebComponentBase,
    defineCommonStaticMethods
  });

  return cache.get(win);
}

},{"../../services/LocaleService":2}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cache = undefined;
exports.default = getDBUWebComponentDummy;

var _DBUWebComponentBase = require('../DBUWebComponentBase/DBUWebComponentBase');

var _DBUWebComponentBase2 = _interopRequireDefault(_DBUWebComponentBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log('importing getDBUWebComponent');

const cache = exports.cache = new WeakMap();

function getDBUWebComponentDummy(win) {
  if (cache.has(win)) return cache.get(win);

  const { DBUWebComponentBase, defineCommonStaticMethods } = (0, _DBUWebComponentBase2.default)(win);
  const { document } = win;

  const template = document.createElement('template');
  template.innerHTML = `
    <style>
    :host {
      display: block;
      color: maroon;
    }
    
    :host b {
      text-shadow: var(--b-text-shadow, none);
    }
    
    :host([dir=rtl]) b {
      text-decoration: underline;
      padding: 5px;
      border: 1px solid red;
    }
    :host([dir=ltr]) b {
      text-decoration: overline;
      padding: 5px;
      border: 1px solid green;
    }
    
    :host([dir=rtl]) span[x-has-slot] {
      float: left;
    }
    
    :host([dir=ltr]) span[x-has-slot] {
      float: right;
    }
    
    :host([dir=ltr]) *[dir=rtl] {
      display: none;
    }
    :host([dir=rtl]) *[dir=ltr] {
      display: none;
    }
    
    </style>
    
    <b dir="ltr">I'm in shadow dom! ltr (DBUWebComponentDummy)</b>
    <span x-has-slot><span>[</span><slot></slot><span>]</span></span>
    <b dir="rtl">I'm in shadow dom! rtl (DBUWebComponentDummy)</b>
  `;

  class DBUWebComponentDummy extends DBUWebComponentBase {
    static get componentName() {
      return 'dbu-web-component-dummy';
    }

    static get template() {
      return template;
    }

    onLocaleChange(locale) {
      console.log('onLocaleChange', locale);
    }
  }

  defineCommonStaticMethods(DBUWebComponentDummy);

  cache.set(win, DBUWebComponentDummy);

  return cache.get(win);
}

},{"../DBUWebComponentBase/DBUWebComponentBase":3}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cache = undefined;
exports.default = getDBUWebComponentDummyParent;

var _DBUWebComponentBase = require('../DBUWebComponentBase/DBUWebComponentBase');

var _DBUWebComponentBase2 = _interopRequireDefault(_DBUWebComponentBase);

var _DBUWebComponentDummy = require('../DBUWebComponentDummy/DBUWebComponentDummy');

var _DBUWebComponentDummy2 = _interopRequireDefault(_DBUWebComponentDummy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const cache = exports.cache = new WeakMap();

function getDBUWebComponentDummyParent(win) {
  if (cache.has(win)) return cache.get(win);

  const { DBUWebComponentBase, defineCommonStaticMethods } = (0, _DBUWebComponentBase2.default)(win);
  const DBUWebComponentDummy = (0, _DBUWebComponentDummy2.default)(win);

  const { document } = win;

  const template = document.createElement('template');
  template.innerHTML = `
    <style>
    :host {display: block;}
    </style>
    <b>I'm in shadow dom! (DBUWebComponentDummyParent)</b>
    <dbu-web-component-dummy><slot></slot></dbu-web-component-dummy>
  `;

  class DBUWebComponentDummyParent extends DBUWebComponentBase {
    static get componentName() {
      return 'dbu-web-component-dummy-parent';
    }

    static get template() {
      return template;
    }

    static get dependencies() {
      return [DBUWebComponentDummy];
    }

  }

  defineCommonStaticMethods(DBUWebComponentDummyParent);

  cache.set(win, DBUWebComponentDummyParent);

  return cache.get(win);
}

},{"../DBUWebComponentBase/DBUWebComponentBase":3,"../DBUWebComponentDummy/DBUWebComponentDummy":4}],6:[function(require,module,exports){
(function (process){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _screens = require('./screens');

var _screens2 = _interopRequireDefault(_screens);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class App extends _react2.default.Component {
  componentDidMount() {
    window.addEventListener('hashchange', this.onHashChange.bind(this));
  }

  onHashChange() {
    this.forceUpdate();
  }

  render() {
    if (process.env.NODE_ENV !== 'production') {
      /* eslint no-console: 0 */
      // console.log('rendering App component');
    }
    const screensKeys = Object.keys(_screens2.default);
    const links = _react2.default.createElement(
      'ul',
      null,
      screensKeys.map((screen, idx) => _react2.default.createElement(
        'li',
        { key: idx },
        _react2.default.createElement(
          'a',
          { key: idx, href: `#${screen}` },
          screen
        )
      ))
    );
    const Screen = _screens2.default[(window.location.hash || `#${screensKeys[0]}`).replace('#', '')];

    if (!Screen) {
      return null;
    }

    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'div',
        null,
        links
      ),
      _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(Screen, null)
      )
    );
  }
}

App.propTypes = {
  classes: _propTypes2.default.object,
  theme: _propTypes2.default.object
};

exports.default = App;

}).call(this,require('_process'))

},{"./screens":14,"_process":1,"prop-types":"prop-types","react":"react"}],7:[function(require,module,exports){
(function (process){
'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _devBoxUi = require('dev-box-ui');

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

var _DBUWebComponentDummy = require('../src/lib/webcomponents/DBUWebComponentDummy/DBUWebComponentDummy');

var _DBUWebComponentDummy2 = _interopRequireDefault(_DBUWebComponentDummy);

var _DBUWebComponentDummyParent = require('../src/lib/webcomponents/DBUWebComponentDummyParent/DBUWebComponentDummyParent');

var _DBUWebComponentDummyParent2 = _interopRequireDefault(_DBUWebComponentDummyParent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import getDBUWebComponentDummy from '../build/src/lib/webcomponents/DBUWebComponentDummy/DBUWebComponentDummy';
// import getDBUWebComponentDummyParent from '../build/src/lib/webcomponents/DBUWebComponentDummyParent/DBUWebComponentDummyParent';
window.DBUWebComponents = {
  'dbu-web-component-dummy': {
    componentStyle: `
       b {
        color: orange;
        font-style: oblique;
        }
    `
  }
};

const DBUWebComponentDummy = (0, _DBUWebComponentDummy2.default)(window);
const DBUWebComponentDummyParent = (0, _DBUWebComponentDummyParent2.default)(window);

setTimeout(() => {
  DBUWebComponentDummy.registerSelf();
  DBUWebComponentDummyParent.registerSelf();
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
      <dbu-web-component-dummy
        style="color: blue"
      >
        <span>hello world 3</span>
      </dbu-web-component-dummy>
      <dbu-web-component-dummy-parent></dbu-web-component-dummy-parent>
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

  const DBUWebComponentDummy2 = (0, _DBUWebComponentDummy2.default)(target.contentWindow);
  const DBUWebComponentDummyParent2 = (0, _DBUWebComponentDummyParent2.default)(target.contentWindow);
  setTimeout(() => {
    DBUWebComponentDummy2.registerSelf();
    DBUWebComponentDummyParent2.registerSelf();

    setTimeout(() => {
      // target.remove();
    }, 2000);
  }, 2000);
};

document.body.appendChild(iframe);

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

Demo = (0, _devBoxUi.localeAware)(Demo);

_reactDom2.default.render(_react2.default.createElement(Demo, null), document.getElementById('demo'));

}).call(this,require('_process'))

},{"../src/lib/webcomponents/DBUWebComponentDummy/DBUWebComponentDummy":4,"../src/lib/webcomponents/DBUWebComponentDummyParent/DBUWebComponentDummyParent":5,"./app":6,"_process":1,"dev-box-ui":"dev-box-ui","prop-types":"prop-types","react":"react","react-dom":"react-dom"}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class DBUWebComponentDummyScreen extends _react2.default.Component {
  render() {
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'dbu-web-component-dummy',
        {
          style: { color: 'blue' }
        },
        _react2.default.createElement(
          'span',
          null,
          'hello world 1'
        )
      ),
      _react2.default.createElement(
        'dbu-web-component-dummy',
        {
          style: { color: 'blue' }
        },
        _react2.default.createElement(
          'span',
          null,
          'hello world 2'
        )
      ),
      _react2.default.createElement('dbu-web-component-dummy-parent', null)
    );
  }
}

exports.default = DBUWebComponentDummyScreen;

},{"react":"react"}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _devBoxUi = require('dev-box-ui');

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
    setTimeout(() => {
      this.counter = this.counter + 1;
      this.setState({
        draggableContent: this.draggableContent
      });
    }, 3000);
  }

  render() {
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        _devBoxUi.Draggable,
        { style: { border: '1px solid blue', width: 200, height: 200, overflowX: 'scroll', overflowY: 'scroll' } },
        this.state.draggableContent
      ),
      _react2.default.createElement(
        _devBoxUi.DisableSelection,
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
    );
  }
}

exports.default = DraggableScreen;

},{"dev-box-ui":"dev-box-ui","react":"react"}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _devBoxUi = require('dev-box-ui');

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
      null,
      _react2.default.createElement(_devBoxUi.FormInputNumber, {
        value: this.state.inputValue,
        onChange: this.handleChange,
        defaultDecPoint: ',',
        defaultThousandsSeparator: '.'
      }),
      _react2.default.createElement(_devBoxUi.FormInputNumber, {
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

},{"dev-box-ui":"dev-box-ui","react":"react"}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _devBoxUi = require('dev-box-ui');

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
      null,
      _react2.default.createElement(_devBoxUi.FormInput, {
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

},{"dev-box-ui":"dev-box-ui","react":"react"}],12:[function(require,module,exports){
(function (process){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _devBoxUi = require('dev-box-ui');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class HelloScreen extends _react2.default.Component {
  render() {
    if (process.env.NODE_ENV !== 'production') {
      /* eslint no-console: 0 */
      // console.log('rendering HelloScreen component');
    }
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(_devBoxUi.Hello, null)
    );
  }
}

exports.default = HelloScreen;

}).call(this,require('_process'))

},{"_process":1,"dev-box-ui":"dev-box-ui","react":"react"}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _devBoxUi = require('dev-box-ui');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ListScreen extends _react2.default.Component {
  render() {
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(_devBoxUi.List, { items: ['three', 'four'] }),
      _react2.default.createElement(_devBoxUi.List, { items: ['three', 'four'] })
    );
  }
}

exports.default = ListScreen;

},{"dev-box-ui":"dev-box-ui","react":"react"}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _HelloScreen = require('./HelloScreen');

var _HelloScreen2 = _interopRequireDefault(_HelloScreen);

var _ListScreen = require('./ListScreen');

var _ListScreen2 = _interopRequireDefault(_ListScreen);

var _FormInputScreen = require('./FormInputScreen');

var _FormInputScreen2 = _interopRequireDefault(_FormInputScreen);

var _FormInputNumberScreen = require('./FormInputNumberScreen');

var _FormInputNumberScreen2 = _interopRequireDefault(_FormInputNumberScreen);

var _DraggableScreen = require('./DraggableScreen');

var _DraggableScreen2 = _interopRequireDefault(_DraggableScreen);

var _DBUWebComponentDummyScreen = require('./DBUWebComponentDummyScreen');

var _DBUWebComponentDummyScreen2 = _interopRequireDefault(_DBUWebComponentDummyScreen);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  HelloScreen: _HelloScreen2.default,
  ListScreen: _ListScreen2.default,
  FormInputScreen: _FormInputScreen2.default,
  FormInputNumberScreen: _FormInputNumberScreen2.default,
  Draggable: _DraggableScreen2.default,
  DBUWebComponentDummyScreen: _DBUWebComponentDummyScreen2.default
};

},{"./DBUWebComponentDummyScreen":8,"./DraggableScreen":9,"./FormInputNumberScreen":10,"./FormInputScreen":11,"./HelloScreen":12,"./ListScreen":13}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwic3JjL2xpYi9zZXJ2aWNlcy9Mb2NhbGVTZXJ2aWNlLmpzIiwic3JjL2xpYi93ZWJjb21wb25lbnRzL0RCVVdlYkNvbXBvbmVudEJhc2UvREJVV2ViQ29tcG9uZW50QmFzZS5qcyIsInNyYy9saWIvd2ViY29tcG9uZW50cy9EQlVXZWJDb21wb25lbnREdW1teS9EQlVXZWJDb21wb25lbnREdW1teS5qcyIsInNyYy9saWIvd2ViY29tcG9uZW50cy9EQlVXZWJDb21wb25lbnREdW1teVBhcmVudC9EQlVXZWJDb21wb25lbnREdW1teVBhcmVudC5qcyIsInNyY0RlbW8vYXBwLmpzIiwic3JjRGVtby9kZW1vLmpzIiwic3JjRGVtby9zY3JlZW5zL0RCVVdlYkNvbXBvbmVudER1bW15U2NyZWVuLmpzIiwic3JjRGVtby9zY3JlZW5zL0RyYWdnYWJsZVNjcmVlbi5qcyIsInNyY0RlbW8vc2NyZWVucy9Gb3JtSW5wdXROdW1iZXJTY3JlZW4uanMiLCJzcmNEZW1vL3NjcmVlbnMvRm9ybUlucHV0U2NyZWVuLmpzIiwic3JjRGVtby9zY3JlZW5zL0hlbGxvU2NyZWVuLmpzIiwic3JjRGVtby9zY3JlZW5zL0xpc3RTY3JlZW4uanMiLCJzcmNEZW1vL3NjcmVlbnMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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REY7QUFFRSxzREFBTSxPQUFPLENBQUMsT0FBRCxFQUFVLE1BQVYsQ0FBYjtBQUZGLEtBREY7QUFNRDtBQVJzQzs7a0JBVzFCLFU7Ozs7Ozs7OztBQ2hCZjs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztrQkFFZTtBQUNiLG9DQURhO0FBRWIsa0NBRmE7QUFHYiw0Q0FIYTtBQUliLHdEQUphO0FBS2Isc0NBTGE7QUFNYjtBQU5hLEMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIlxuY29uc3QgZGVmYXVsdExvY2FsZSA9IHtcbiAgZGlyOiAnbHRyJyxcbiAgbGFuZzogJ2VuJ1xufTtcblxuY2xhc3MgTG9jYWxlU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX2NhbGxiYWNrcyA9IFtdO1xuICAgIHRoaXMuX2xvY2FsZUF0dHJzID0gT2JqZWN0LmtleXMoZGVmYXVsdExvY2FsZSk7XG4gICAgdGhpcy5fcm9vdEVsZW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgIHRoaXMuX2xvY2FsZUF0dHJzLmZvckVhY2goKGF0dHIpID0+IHtcbiAgICAgIGlmICghdGhpcy5fcm9vdEVsZW1lbnQuZ2V0QXR0cmlidXRlKGF0dHIpKSB7XG4gICAgICAgIHRoaXMuX3Jvb3RFbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyLCBkZWZhdWx0TG9jYWxlW2F0dHJdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLl9sb2NhbGUgPSB0aGlzLl9sb2NhbGVBdHRycy5yZWR1Y2UoKGFjYywgYXR0cikgPT4ge1xuICAgICAgYWNjW2F0dHJdID0gdGhpcy5fcm9vdEVsZW1lbnQuZ2V0QXR0cmlidXRlKGF0dHIpO1xuICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCB7fSk7XG4gICAgdGhpcy5fb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcih0aGlzLl9oYW5kbGVNdXRhdGlvbnMuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5fb2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLl9yb290RWxlbWVudCwge1xuICAgICAgYXR0cmlidXRlczogdHJ1ZVxuICAgIH0pO1xuICB9XG5cbiAgX2hhbmRsZU11dGF0aW9ucyhtdXRhdGlvbnMpIHtcbiAgICBtdXRhdGlvbnMuZm9yRWFjaCgobXV0YXRpb24pID0+IHtcbiAgICAgIGNvbnN0IG11dGF0aW9uQXR0cmlidXRlTmFtZSA9IG11dGF0aW9uLmF0dHJpYnV0ZU5hbWU7XG4gICAgICBpZiAodGhpcy5fbG9jYWxlQXR0cnMuaW5jbHVkZXMobXV0YXRpb25BdHRyaWJ1dGVOYW1lKSkge1xuICAgICAgICB0aGlzLl9sb2NhbGUgPSB7XG4gICAgICAgICAgLi4udGhpcy5fbG9jYWxlLFxuICAgICAgICAgIFttdXRhdGlvbkF0dHJpYnV0ZU5hbWVdOiB0aGlzLl9yb290RWxlbWVudC5nZXRBdHRyaWJ1dGUobXV0YXRpb25BdHRyaWJ1dGVOYW1lKVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9jYWxsYmFja3MuZm9yRWFjaChjYWxsYmFjayA9PiBjYWxsYmFjayh0aGlzLl9sb2NhbGUpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHNldCBsb2NhbGUobG9jYWxlT2JqKSB7XG4gICAgT2JqZWN0LmtleXMobG9jYWxlT2JqKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIHRoaXMuX3Jvb3RFbGVtZW50LnNldEF0dHJpYnV0ZShrZXksIGxvY2FsZU9ialtrZXldKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldCBsb2NhbGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xvY2FsZTtcbiAgfVxuXG4gIG9uTG9jYWxlQ2hhbmdlKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuICAgIGNhbGxiYWNrKHRoaXMubG9jYWxlKTtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzLmZpbHRlcihjYiA9PiBjYiAhPT0gY2FsbGJhY2spO1xuICAgIH07XG4gIH1cbn1cblxuY29uc3QgbG9jYWxlU2VydmljZSA9IG5ldyBMb2NhbGVTZXJ2aWNlKCk7XG5leHBvcnQgZGVmYXVsdCBsb2NhbGVTZXJ2aWNlO1xuIiwiXG5pbXBvcnQgTG9jYWxlU2VydmljZSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9Mb2NhbGVTZXJ2aWNlJztcblxuY29uc29sZS5sb2coJ2ltcG9ydGluZyBnZXREQlVXZWJDb21wb25lbnRCYXNlJyk7XG5cbmV4cG9ydCBjb25zdCBjYWNoZSA9IG5ldyBXZWFrTWFwKCk7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldERCVVdlYkNvbXBvbmVudEJhc2Uod2luKSB7XG4gIGlmIChjYWNoZS5oYXMod2luKSkge1xuICAgIHJldHVybiBjYWNoZS5nZXQod2luKTtcbiAgfVxuXG4gIGNvbnN0IHsgZG9jdW1lbnQsIEhUTUxFbGVtZW50LCBjdXN0b21FbGVtZW50cyB9ID0gd2luO1xuXG4gIGNvbnN0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgdGVtcGxhdGUuaW5uZXJIVE1MID0gJzxzdHlsZT48L3N0eWxlPjxzbG90Pjwvc2xvdD4nO1xuXG4gIGNsYXNzIERCVVdlYkNvbXBvbmVudEJhc2UgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG5cbiAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlKCkge1xuICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXQgZGVwZW5kZW5jaWVzKCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXQgdXNlU2hhZG93KCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgY29uc3QgeyB1c2VTaGFkb3cgfSA9IHRoaXMuY29uc3RydWN0b3I7XG4gICAgICBpZiAodXNlU2hhZG93KSB7XG4gICAgICAgIHRoaXMuYXR0YWNoU2hhZG93KHsgbW9kZTogJ29wZW4nIH0pO1xuICAgICAgfVxuICAgICAgdGhpcy5faW5zZXJ0VGVtcGxhdGUoKTtcblxuICAgICAgdGhpcy5jb25uZWN0ZWRDYWxsYmFjayA9IHRoaXMuY29ubmVjdGVkQ2FsbGJhY2suYmluZCh0aGlzKTtcbiAgICAgIHRoaXMuZGlzY29ubmVjdGVkQ2FsbGJhY2sgPSB0aGlzLmRpc2Nvbm5lY3RlZENhbGxiYWNrLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLl9oYW5kbGVMb2NhbGVDaGFuZ2UgPSB0aGlzLl9oYW5kbGVMb2NhbGVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgICAgIHRoaXMub25Mb2NhbGVDaGFuZ2UgJiYgKHRoaXMub25Mb2NhbGVDaGFuZ2UgPSB0aGlzLm9uTG9jYWxlQ2hhbmdlLmJpbmQodGhpcykpO1xuICAgICAgdGhpcy51bnJlZ2lzdGVyTG9jYWxlQ2hhbmdlID0gbnVsbDtcbiAgICB9XG5cbiAgICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcblxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2JlZm9yZXVubG9hZCcsIHRoaXMuZGlzY29ubmVjdGVkQ2FsbGJhY2ssIGZhbHNlKTtcblxuICAgICAgdGhpcy51bnJlZ2lzdGVyTG9jYWxlQ2hhbmdlID1cbiAgICAgICAgTG9jYWxlU2VydmljZS5vbkxvY2FsZUNoYW5nZSh0aGlzLl9oYW5kbGVMb2NhbGVDaGFuZ2UpO1xuICAgIH1cblxuICAgIGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgdGhpcy51bnJlZ2lzdGVyTG9jYWxlQ2hhbmdlKCk7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignYmVmb3JldW5sb2FkJywgdGhpcy5kaXNjb25uZWN0ZWRDYWxsYmFjaywgZmFsc2UpO1xuICAgIH1cblxuICAgIGdldCBjaGlsZHJlblRyZWUoKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci51c2VTaGFkb3cgPyB0aGlzLnNoYWRvd1Jvb3QgOiB0aGlzO1xuICAgIH1cblxuICAgIF9pbnNlcnRUZW1wbGF0ZSgpIHtcbiAgICAgIGNvbnN0IHsgdGVtcGxhdGUgfSA9IHRoaXMuY29uc3RydWN0b3I7XG5cbiAgICAgIGlmICh0ZW1wbGF0ZSkge1xuICAgICAgICB0aGlzLmNoaWxkcmVuVHJlZS5hcHBlbmRDaGlsZCh0ZW1wbGF0ZS5jb250ZW50LmNsb25lTm9kZSh0cnVlKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2hhbmRsZUxvY2FsZUNoYW5nZShsb2NhbGUpIHtcbiAgICAgIHRoaXMuY2hpbGRyZW5UcmVlLmlubmVySFRNTCA9ICcnO1xuICAgICAgdGhpcy5faW5zZXJ0VGVtcGxhdGUoKTtcbiAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdkaXInLCBsb2NhbGUuZGlyKTtcbiAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdsYW5nJywgbG9jYWxlLmxhbmcpO1xuICAgICAgdGhpcy5vbkxvY2FsZUNoYW5nZSAmJiB0aGlzLm9uTG9jYWxlQ2hhbmdlKGxvY2FsZSk7XG4gICAgfVxuXG4gIH1cblxuICBmdW5jdGlvbiBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzKGtsYXNzKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGtsYXNzLCAnY29tcG9uZW50U3R5bGUnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiBrbGFzcy50ZW1wbGF0ZS5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ3N0eWxlJykuaW5uZXJIVE1MO1xuICAgICAgfSxcbiAgICAgIHNldCh2YWx1ZSkge1xuICAgICAgICBrbGFzcy50ZW1wbGF0ZS5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ3N0eWxlJykuaW5uZXJIVE1MID0gdmFsdWU7XG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIGtsYXNzLnJlZ2lzdGVyU2VsZiA9ICgpID0+IHtcbiAgICAgIGNvbnN0IGNvbXBvbmVudE5hbWUgPSBrbGFzcy5jb21wb25lbnROYW1lO1xuICAgICAgY29uc3QgZGVwZW5kZW5jaWVzID0ga2xhc3MuZGVwZW5kZW5jaWVzO1xuICAgICAgZGVwZW5kZW5jaWVzLmZvckVhY2goKGRlcGVuZGVuY3kpID0+IGRlcGVuZGVuY3kucmVnaXN0ZXJTZWxmKCkpO1xuICAgICAgaWYgKGN1c3RvbUVsZW1lbnRzLmdldChjb21wb25lbnROYW1lKSkgcmV0dXJuO1xuICAgICAgY29uc3QgY29tcG9uZW50U3R5bGUgPSAoKHdpbi5EQlVXZWJDb21wb25lbnRzIHx8IHt9KVtjb21wb25lbnROYW1lXSB8fCB7fSkuY29tcG9uZW50U3R5bGU7XG4gICAgICBpZiAoY29tcG9uZW50U3R5bGUpIHtcbiAgICAgICAga2xhc3MuY29tcG9uZW50U3R5bGUgKz0gY29tcG9uZW50U3R5bGU7XG4gICAgICB9XG4gICAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUoY29tcG9uZW50TmFtZSwga2xhc3MpO1xuICAgIH07XG4gIH1cblxuICBjYWNoZS5zZXQod2luLCB7XG4gICAgREJVV2ViQ29tcG9uZW50QmFzZSxcbiAgICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzXG4gIH0pO1xuXG4gIHJldHVybiBjYWNoZS5nZXQod2luKTtcblxufVxuIiwiXG5pbXBvcnQgZ2V0REJVV2ViQ29tcG9uZW50QmFzZSBmcm9tICcuLi9EQlVXZWJDb21wb25lbnRCYXNlL0RCVVdlYkNvbXBvbmVudEJhc2UnO1xuXG5jb25zb2xlLmxvZygnaW1wb3J0aW5nIGdldERCVVdlYkNvbXBvbmVudCcpO1xuXG5leHBvcnQgY29uc3QgY2FjaGUgPSBuZXcgV2Vha01hcCgpO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXREQlVXZWJDb21wb25lbnREdW1teSh3aW4pIHtcbiAgaWYgKGNhY2hlLmhhcyh3aW4pKSByZXR1cm4gY2FjaGUuZ2V0KHdpbik7XG5cbiAgY29uc3QgeyBEQlVXZWJDb21wb25lbnRCYXNlLCBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzIH0gPSBnZXREQlVXZWJDb21wb25lbnRCYXNlKHdpbik7XG4gIGNvbnN0IHsgZG9jdW1lbnQgfSA9IHdpbjtcblxuICBjb25zdCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gIHRlbXBsYXRlLmlubmVySFRNTCA9IGBcbiAgICA8c3R5bGU+XG4gICAgOmhvc3Qge1xuICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICBjb2xvcjogbWFyb29uO1xuICAgIH1cbiAgICBcbiAgICA6aG9zdCBiIHtcbiAgICAgIHRleHQtc2hhZG93OiB2YXIoLS1iLXRleHQtc2hhZG93LCBub25lKTtcbiAgICB9XG4gICAgXG4gICAgOmhvc3QoW2Rpcj1ydGxdKSBiIHtcbiAgICAgIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xuICAgICAgcGFkZGluZzogNXB4O1xuICAgICAgYm9yZGVyOiAxcHggc29saWQgcmVkO1xuICAgIH1cbiAgICA6aG9zdChbZGlyPWx0cl0pIGIge1xuICAgICAgdGV4dC1kZWNvcmF0aW9uOiBvdmVybGluZTtcbiAgICAgIHBhZGRpbmc6IDVweDtcbiAgICAgIGJvcmRlcjogMXB4IHNvbGlkIGdyZWVuO1xuICAgIH1cbiAgICBcbiAgICA6aG9zdChbZGlyPXJ0bF0pIHNwYW5beC1oYXMtc2xvdF0ge1xuICAgICAgZmxvYXQ6IGxlZnQ7XG4gICAgfVxuICAgIFxuICAgIDpob3N0KFtkaXI9bHRyXSkgc3Bhblt4LWhhcy1zbG90XSB7XG4gICAgICBmbG9hdDogcmlnaHQ7XG4gICAgfVxuICAgIFxuICAgIDpob3N0KFtkaXI9bHRyXSkgKltkaXI9cnRsXSB7XG4gICAgICBkaXNwbGF5OiBub25lO1xuICAgIH1cbiAgICA6aG9zdChbZGlyPXJ0bF0pICpbZGlyPWx0cl0ge1xuICAgICAgZGlzcGxheTogbm9uZTtcbiAgICB9XG4gICAgXG4gICAgPC9zdHlsZT5cbiAgICBcbiAgICA8YiBkaXI9XCJsdHJcIj5JJ20gaW4gc2hhZG93IGRvbSEgbHRyIChEQlVXZWJDb21wb25lbnREdW1teSk8L2I+XG4gICAgPHNwYW4geC1oYXMtc2xvdD48c3Bhbj5bPC9zcGFuPjxzbG90Pjwvc2xvdD48c3Bhbj5dPC9zcGFuPjwvc3Bhbj5cbiAgICA8YiBkaXI9XCJydGxcIj5JJ20gaW4gc2hhZG93IGRvbSEgcnRsIChEQlVXZWJDb21wb25lbnREdW1teSk8L2I+XG4gIGA7XG5cbiAgY2xhc3MgREJVV2ViQ29tcG9uZW50RHVtbXkgZXh0ZW5kcyBEQlVXZWJDb21wb25lbnRCYXNlIHtcbiAgICBzdGF0aWMgZ2V0IGNvbXBvbmVudE5hbWUoKSB7XG4gICAgICByZXR1cm4gJ2RidS13ZWItY29tcG9uZW50LWR1bW15JztcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlKCkge1xuICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuICAgIH1cblxuICAgIG9uTG9jYWxlQ2hhbmdlKGxvY2FsZSkge1xuICAgICAgY29uc29sZS5sb2coJ29uTG9jYWxlQ2hhbmdlJywgbG9jYWxlKTtcbiAgICB9XG4gIH1cblxuICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzKERCVVdlYkNvbXBvbmVudER1bW15KTtcblxuICBjYWNoZS5zZXQod2luLCBEQlVXZWJDb21wb25lbnREdW1teSk7XG5cbiAgcmV0dXJuIGNhY2hlLmdldCh3aW4pO1xufVxuXG4iLCJcblxuaW1wb3J0IGdldERCVVdlYkNvbXBvbmVudEJhc2UgZnJvbSAnLi4vREJVV2ViQ29tcG9uZW50QmFzZS9EQlVXZWJDb21wb25lbnRCYXNlJztcbmltcG9ydCBnZXREQlVXZWJDb21wb25lbnREdW1teSBmcm9tICcuLi9EQlVXZWJDb21wb25lbnREdW1teS9EQlVXZWJDb21wb25lbnREdW1teSc7XG5cbmV4cG9ydCBjb25zdCBjYWNoZSA9IG5ldyBXZWFrTWFwKCk7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldERCVVdlYkNvbXBvbmVudER1bW15UGFyZW50KHdpbikge1xuICBpZiAoY2FjaGUuaGFzKHdpbikpIHJldHVybiBjYWNoZS5nZXQod2luKTtcblxuICBjb25zdCB7IERCVVdlYkNvbXBvbmVudEJhc2UsIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMgfSA9IGdldERCVVdlYkNvbXBvbmVudEJhc2Uod2luKTtcbiAgY29uc3QgREJVV2ViQ29tcG9uZW50RHVtbXkgPSBnZXREQlVXZWJDb21wb25lbnREdW1teSh3aW4pO1xuXG4gIGNvbnN0IHsgZG9jdW1lbnQgfSA9IHdpbjtcblxuICBjb25zdCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gIHRlbXBsYXRlLmlubmVySFRNTCA9IGBcbiAgICA8c3R5bGU+XG4gICAgOmhvc3Qge2Rpc3BsYXk6IGJsb2NrO31cbiAgICA8L3N0eWxlPlxuICAgIDxiPkknbSBpbiBzaGFkb3cgZG9tISAoREJVV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQpPC9iPlxuICAgIDxkYnUtd2ViLWNvbXBvbmVudC1kdW1teT48c2xvdD48L3Nsb3Q+PC9kYnUtd2ViLWNvbXBvbmVudC1kdW1teT5cbiAgYDtcblxuICBjbGFzcyBEQlVXZWJDb21wb25lbnREdW1teVBhcmVudCBleHRlbmRzIERCVVdlYkNvbXBvbmVudEJhc2Uge1xuICAgIHN0YXRpYyBnZXQgY29tcG9uZW50TmFtZSgpIHtcbiAgICAgIHJldHVybiAnZGJ1LXdlYi1jb21wb25lbnQtZHVtbXktcGFyZW50JztcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlKCkge1xuICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXQgZGVwZW5kZW5jaWVzKCkge1xuICAgICAgcmV0dXJuIFtEQlVXZWJDb21wb25lbnREdW1teV07XG4gICAgfVxuXG4gIH1cblxuICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzKERCVVdlYkNvbXBvbmVudER1bW15UGFyZW50KTtcblxuICBjYWNoZS5zZXQod2luLCBEQlVXZWJDb21wb25lbnREdW1teVBhcmVudCk7XG5cbiAgcmV0dXJuIGNhY2hlLmdldCh3aW4pO1xuXG59XG5cbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHNjcmVlbnMgZnJvbSAnLi9zY3JlZW5zJztcblxuY2xhc3MgQXBwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLCB0aGlzLm9uSGFzaENoYW5nZS5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIG9uSGFzaENoYW5nZSgpIHtcbiAgICB0aGlzLmZvcmNlVXBkYXRlKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIC8qIGVzbGludCBuby1jb25zb2xlOiAwICovXG4gICAgICAvLyBjb25zb2xlLmxvZygncmVuZGVyaW5nIEFwcCBjb21wb25lbnQnKTtcbiAgICB9XG4gICAgY29uc3Qgc2NyZWVuc0tleXMgPSBPYmplY3Qua2V5cyhzY3JlZW5zKTtcbiAgICBjb25zdCBsaW5rcyA9IDx1bD5cbiAgICAgIHtcbiAgICAgICAgc2NyZWVuc0tleXMubWFwKChzY3JlZW4sIGlkeCkgPT4gKFxuICAgICAgICAgIDxsaSBrZXk9e2lkeH0+XG4gICAgICAgICAgICA8YSBrZXk9e2lkeH0gaHJlZj17YCMke3NjcmVlbn1gfT57c2NyZWVufTwvYT5cbiAgICAgICAgICA8L2xpPlxuICAgICAgICApKVxuICAgICAgfVxuICAgIDwvdWw+O1xuICAgIGNvbnN0IFNjcmVlbiA9IHNjcmVlbnNbKHdpbmRvdy5sb2NhdGlvbi5oYXNoIHx8IGAjJHtzY3JlZW5zS2V5c1swXX1gKS5yZXBsYWNlKCcjJywgJycpXTtcblxuICAgIGlmICghU2NyZWVuKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICB7bGlua3N9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxTY3JlZW4vPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuQXBwLnByb3BUeXBlcyA9IHtcbiAgY2xhc3NlczogUHJvcFR5cGVzLm9iamVjdCxcbiAgdGhlbWU6IFByb3BUeXBlcy5vYmplY3Rcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFwcDtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge1xuICAvLyBvblNjcmVlbkNvbnNvbGUsXG4gIGxvY2FsZUF3YXJlXG59IGZyb20gJ2Rldi1ib3gtdWknO1xuaW1wb3J0IEFwcCBmcm9tICcuL2FwcCc7XG5cbi8vIGltcG9ydCBnZXREQlVXZWJDb21wb25lbnREdW1teSBmcm9tICcuLi9idWlsZC9zcmMvbGliL3dlYmNvbXBvbmVudHMvREJVV2ViQ29tcG9uZW50RHVtbXkvREJVV2ViQ29tcG9uZW50RHVtbXknO1xuLy8gaW1wb3J0IGdldERCVVdlYkNvbXBvbmVudER1bW15UGFyZW50IGZyb20gJy4uL2J1aWxkL3NyYy9saWIvd2ViY29tcG9uZW50cy9EQlVXZWJDb21wb25lbnREdW1teVBhcmVudC9EQlVXZWJDb21wb25lbnREdW1teVBhcmVudCc7XG5pbXBvcnQgZ2V0REJVV2ViQ29tcG9uZW50RHVtbXkgZnJvbSAnLi4vc3JjL2xpYi93ZWJjb21wb25lbnRzL0RCVVdlYkNvbXBvbmVudER1bW15L0RCVVdlYkNvbXBvbmVudER1bW15JztcbmltcG9ydCBnZXREQlVXZWJDb21wb25lbnREdW1teVBhcmVudCBmcm9tICcuLi9zcmMvbGliL3dlYmNvbXBvbmVudHMvREJVV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQvREJVV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQnO1xuXG5cbndpbmRvdy5EQlVXZWJDb21wb25lbnRzID0ge1xuICAnZGJ1LXdlYi1jb21wb25lbnQtZHVtbXknOiB7XG4gICAgY29tcG9uZW50U3R5bGU6IGBcbiAgICAgICBiIHtcbiAgICAgICAgY29sb3I6IG9yYW5nZTtcbiAgICAgICAgZm9udC1zdHlsZTogb2JsaXF1ZTtcbiAgICAgICAgfVxuICAgIGBcbiAgfVxufTtcblxuY29uc3QgREJVV2ViQ29tcG9uZW50RHVtbXkgPSBnZXREQlVXZWJDb21wb25lbnREdW1teSh3aW5kb3cpO1xuY29uc3QgREJVV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQgPSBnZXREQlVXZWJDb21wb25lbnREdW1teVBhcmVudCh3aW5kb3cpO1xuXG5cbnNldFRpbWVvdXQoKCkgPT4ge1xuICBEQlVXZWJDb21wb25lbnREdW1teS5yZWdpc3RlclNlbGYoKTtcbiAgREJVV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQucmVnaXN0ZXJTZWxmKCk7XG59LCAyMDAwKTtcblxuY29uc3QgaWZyYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaWZyYW1lJyk7XG5cbndpbmRvdy5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAobXNnKSB7IGNvbnNvbGUubG9nKCdtc2cgZnJvbSBpZnJhbWUnLCBtc2cpOyB9O1xuaWZyYW1lLm9ubG9hZCA9IGZ1bmN0aW9uIChldnQpIHtcbiAgY29uc3QgdGFyZ2V0ID0gZXZ0LnRhcmdldDtcblxuICB0YXJnZXQuY29udGVudFdpbmRvdy5kb2N1bWVudC53cml0ZShgXG4gICAgPGh0bWw+XG4gICAgPGJvZHk+XG4gICAgICA8ZGJ1LXdlYi1jb21wb25lbnQtZHVtbXlcbiAgICAgICAgc3R5bGU9XCJjb2xvcjogYmx1ZVwiXG4gICAgICA+XG4gICAgICAgIDxzcGFuPmhlbGxvIHdvcmxkIDM8L3NwYW4+XG4gICAgICA8L2RidS13ZWItY29tcG9uZW50LWR1bW15PlxuICAgICAgPGRidS13ZWItY29tcG9uZW50LWR1bW15LXBhcmVudD48L2RidS13ZWItY29tcG9uZW50LWR1bW15LXBhcmVudD5cbiAgICA8L2JvZHk+XG4gICAgPHNjcmlwdD5cbiAgICAgIHdpbmRvdy5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdtc2cgZnJvbSB3aW5kb3cnLCBtc2cpO1xuICAgICAgICB3aW5kb3cudG9wLnBvc3RNZXNzYWdlKCd3b3JsZCcsICcqJyk7XG4gICAgICB9O1xuICAgIDwvc2NyaXB0PlxuICAgIDwvaHRtbD5cbiAgYCk7XG4gIHRhcmdldC5jb250ZW50V2luZG93LnBvc3RNZXNzYWdlKCdoZWxsbycsICcqJylcblxuICBjb25zdCBEQlVXZWJDb21wb25lbnREdW1teTIgPSBnZXREQlVXZWJDb21wb25lbnREdW1teSh0YXJnZXQuY29udGVudFdpbmRvdyk7XG4gIGNvbnN0IERCVVdlYkNvbXBvbmVudER1bW15UGFyZW50MiA9IGdldERCVVdlYkNvbXBvbmVudER1bW15UGFyZW50KHRhcmdldC5jb250ZW50V2luZG93KTtcbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgREJVV2ViQ29tcG9uZW50RHVtbXkyLnJlZ2lzdGVyU2VsZigpO1xuICAgIERCVVdlYkNvbXBvbmVudER1bW15UGFyZW50Mi5yZWdpc3RlclNlbGYoKTtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgLy8gdGFyZ2V0LnJlbW92ZSgpO1xuICAgIH0sIDIwMDApO1xuICB9LCAyMDAwKTtcbn07XG5cbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcblxuXG4vLyBvblNjcmVlbkNvbnNvbGUoeyBvcHRpb25zOiB7IHNob3dMYXN0T25seTogZmFsc2UgfSB9KTtcblxubGV0IERlbW8gPSBjbGFzcyBEZW1vIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAvKiBlc2xpbnQgbm8tY29uc29sZTogMCAqL1xuICAgICAgLy8gY29uc29sZS5sb2coJ3JlbmRlcmluZyBEZW1vIGNvbXBvbmVudCcpO1xuICAgIH1cbiAgICBjb25zdCB7IGxvY2FsZTogeyBkaXIgfSB9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gKFxuICAgICAgPEFwcCAvPlxuICAgICk7XG4gIH1cbn07XG5cbkRlbW8ucHJvcFR5cGVzID0ge1xuICBsb2NhbGU6IFByb3BUeXBlcy5vYmplY3Rcbn07XG5cbkRlbW8gPSBsb2NhbGVBd2FyZShEZW1vKTtcblxuUmVhY3RET00ucmVuZGVyKChcbiAgPERlbW8vPlxuKSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RlbW8nKSk7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5jbGFzcyBEQlVXZWJDb21wb25lbnREdW1teVNjcmVlbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cblxuICAgICAgICA8ZGJ1LXdlYi1jb21wb25lbnQtZHVtbXlcbiAgICAgICAgICBzdHlsZT17eyBjb2xvcjogJ2JsdWUnIH19XG4gICAgICAgID5cbiAgICAgICAgICA8c3Bhbj5oZWxsbyB3b3JsZCAxPC9zcGFuPlxuICAgICAgICA8L2RidS13ZWItY29tcG9uZW50LWR1bW15PlxuXG4gICAgICAgIDxkYnUtd2ViLWNvbXBvbmVudC1kdW1teVxuICAgICAgICAgIHN0eWxlPXt7IGNvbG9yOiAnYmx1ZScgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxzcGFuPmhlbGxvIHdvcmxkIDI8L3NwYW4+XG4gICAgICAgIDwvZGJ1LXdlYi1jb21wb25lbnQtZHVtbXk+XG4gICAgICAgIDxkYnUtd2ViLWNvbXBvbmVudC1kdW1teS1wYXJlbnQ+PC9kYnUtd2ViLWNvbXBvbmVudC1kdW1teS1wYXJlbnQ+XG5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgREJVV2ViQ29tcG9uZW50RHVtbXlTY3JlZW47XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtcbiAgRHJhZ2dhYmxlLCBEaXNhYmxlU2VsZWN0aW9uXG59IGZyb20gJ2Rldi1ib3gtdWknO1xuXG5jbGFzcyBUb1JlbmRlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICAvLyBjb25zb2xlLmxvZygnVG9SZW5kZXIjcmVuZGVyJyk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgc3R5bGU9e3sgd2lkdGg6IDMwMCwgaGVpZ2h0OiAzMDAgfX1cbiAgICAgICAgb25Nb3VzZURvd249e3RoaXMucHJvcHMub25Nb3VzZURvd259XG4gICAgICAgIG9uTW91c2VVcD17dGhpcy5wcm9wcy5vbk1vdXNlVXB9XG4gICAgICAgIG9uQ2xpY2s9e3RoaXMucHJvcHMub25DbGlja31cbiAgICAgICAgb25Ub3VjaFN0YXJ0PXt0aGlzLnByb3BzLm9uVG91Y2hTdGFydH1cbiAgICAgICAgb25Ub3VjaEVuZD17dGhpcy5wcm9wcy5vblRvdWNoRW5kfVxuICAgICAgPlxuICAgICAgICA8cD5kcmFnZ2FibGUgcCB7dGhpcy5wcm9wcy5jb3VudGVyfSA8YSBocmVmPVwiaHR0cDovL2dvb2dsZS5jb21cIiB0YXJnZXQ9XCJfYmxhbmtcIj5saW5rPC9hPjwvcD5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuY2xhc3MgRHJhZ2dhYmxlU2NyZWVuIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5oYW5kbGVNb3VzZURvd24gPSB0aGlzLmhhbmRsZU1vdXNlRG93bi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlVG91Y2hTdGFydCA9IHRoaXMuaGFuZGxlVG91Y2hTdGFydC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlTW91c2VVcCA9IHRoaXMuaGFuZGxlTW91c2VVcC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlVG91Y2hFbmQgPSB0aGlzLmhhbmRsZVRvdWNoRW5kLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVDbGljayA9IHRoaXMuaGFuZGxlQ2xpY2suYmluZCh0aGlzKTtcblxuICAgIHRoaXMuY291bnRlciA9IDE7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGRyYWdnYWJsZUNvbnRlbnQ6IHRoaXMuZHJhZ2dhYmxlQ29udGVudFxuICAgIH07XG4gIH1cblxuICBnZXQgZHJhZ2dhYmxlQ29udGVudCgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFRvUmVuZGVyXG4gICAgICAgIG9uTW91c2VEb3duPXt0aGlzLmhhbmRsZU1vdXNlRG93bn1cbiAgICAgICAgb25Nb3VzZVVwPXt0aGlzLmhhbmRsZU1vdXNlVXB9XG4gICAgICAgIG9uVG91Y2hTdGFydD17dGhpcy5oYW5kbGVUb3VjaFN0YXJ0fVxuICAgICAgICBvblRvdWNoRW5kPXt0aGlzLmhhbmRsZVRvdWNoRW5kfVxuICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrfVxuICAgICAgICBjb3VudGVyPXt0aGlzLmNvdW50ZXJ9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICBoYW5kbGVNb3VzZURvd24oZXZ0KSB7XG4gICAgY29uc29sZS5sb2coJ0RyYWdnYWJsZVNjcmVlbiNoYW5kbGVNb3VzZURvd24nKTtcbiAgfVxuICBoYW5kbGVNb3VzZVVwKGV2dCkge1xuICAgIGNvbnNvbGUubG9nKCdEcmFnZ2FibGVTY3JlZW4jaGFuZGxlTW91c2VVcCcpO1xuICB9XG4gIGhhbmRsZVRvdWNoU3RhcnQoZXZ0KSB7XG4gICAgY29uc29sZS5sb2coJ0RyYWdnYWJsZVNjcmVlbiNoYW5kbGVUb3VjaFN0YXJ0Jyk7XG4gIH1cbiAgaGFuZGxlVG91Y2hFbmQoZXZ0KSB7XG4gICAgY29uc29sZS5sb2coJ0RyYWdnYWJsZVNjcmVlbiNoYW5kbGVUb3VjaEVuZCcpO1xuICB9XG4gIGhhbmRsZUNsaWNrKGV2dCkge1xuICAgIGNvbnNvbGUubG9nKCdEcmFnZ2FibGVTY3JlZW4jaGFuZGxlQ2xpY2snKTtcbiAgICAvLyB0aGlzLmNvdW50ZXIgPSB0aGlzLmNvdW50ZXIgKyAxO1xuICAgIC8vIHRoaXMuc2V0U3RhdGUoe1xuICAgIC8vICAgZHJhZ2dhYmxlQ29udGVudDogdGhpcy5kcmFnZ2FibGVDb250ZW50XG4gICAgLy8gfSk7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuY291bnRlciA9IHRoaXMuY291bnRlciArIDE7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgZHJhZ2dhYmxlQ29udGVudDogdGhpcy5kcmFnZ2FibGVDb250ZW50XG4gICAgICB9KTtcbiAgICB9LCAzMDAwKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPERyYWdnYWJsZSBzdHlsZT17eyBib3JkZXI6ICcxcHggc29saWQgYmx1ZScsIHdpZHRoOiAyMDAsIGhlaWdodDogMjAwLCBvdmVyZmxvd1g6ICdzY3JvbGwnLCBvdmVyZmxvd1k6ICdzY3JvbGwnIH19PlxuICAgICAgICAgIHt0aGlzLnN0YXRlLmRyYWdnYWJsZUNvbnRlbnR9XG4gICAgICAgIDwvRHJhZ2dhYmxlPlxuICAgICAgICA8RGlzYWJsZVNlbGVjdGlvbj5cbiAgICAgICAgICA8cD5kaXNhYmxlZCBzZWxlY3Rpb248L3A+XG4gICAgICAgIDwvRGlzYWJsZVNlbGVjdGlvbj5cbiAgICAgICAge0FycmF5LmZyb20oeyBsZW5ndGg6IDEwIH0pLm1hcCgoZWwsIGkpID0+IDxwIGtleT17aX0+e2l9IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLTwvcD4pfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBEcmFnZ2FibGVTY3JlZW47XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtcbiAgRm9ybUlucHV0TnVtYmVyXG59IGZyb20gJ2Rldi1ib3gtdWknO1xuXG5cbmNsYXNzIEZvcm1JbnB1dE51bWJlclNjcmVlbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBpbnB1dFZhbHVlOiAtNy4wOFxuICAgIH07XG4gICAgdGhpcy5oYW5kbGVDaGFuZ2UgPSB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaGFuZGxlQ2hhbmdlKGlucHV0VmFsdWUpIHtcbiAgICBjb25zdCB2YWx1ZVRvU2VuZEJhY2sgPSBOdW1iZXIoaW5wdXRWYWx1ZS50b1ByZWNpc2lvbigxNikpO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaW5wdXRWYWx1ZTogdmFsdWVUb1NlbmRCYWNrXG4gICAgfSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxGb3JtSW5wdXROdW1iZXJcbiAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS5pbnB1dFZhbHVlfVxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX1cbiAgICAgICAgICBkZWZhdWx0RGVjUG9pbnQ9XCIsXCJcbiAgICAgICAgICBkZWZhdWx0VGhvdXNhbmRzU2VwYXJhdG9yPVwiLlwiXG4gICAgICAgIC8+XG4gICAgICAgIDxGb3JtSW5wdXROdW1iZXJcbiAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS5pbnB1dFZhbHVlfVxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX1cbiAgICAgICAgLz5cbiAgICAgICAgPHA+e3RoaXMuc3RhdGUuaW5wdXRWYWx1ZX17J1xcdTAwQTAnfTwvcD5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRm9ybUlucHV0TnVtYmVyU2NyZWVuO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7XG4gIEZvcm1JbnB1dFxufSBmcm9tICdkZXYtYm94LXVpJztcblxuXG5jbGFzcyBGb3JtSW5wdXRTY3JlZW4gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgaW5wdXRWYWx1ZTogNlxuICAgIH07XG4gICAgdGhpcy5oYW5kbGVDaGFuZ2UgPSB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaGFuZGxlQ2hhbmdlKGlucHV0VmFsdWUpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGlucHV0VmFsdWVcbiAgICB9KTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPEZvcm1JbnB1dFxuICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLmlucHV0VmFsdWV9XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfVxuICAgICAgICAgIGhhc1dhcm5pbmc9e2ZhbHNlfVxuICAgICAgICAgIGhhc0Vycm9yPXtmYWxzZX1cbiAgICAgICAgICBkaXNhYmxlZD17ZmFsc2V9XG4gICAgICAgIC8+XG4gICAgICAgIDxwPnt0aGlzLnN0YXRlLmlucHV0VmFsdWV9eydcXHUwMEEwJ308L3A+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEZvcm1JbnB1dFNjcmVlbjtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1xuICBIZWxsb1xufSBmcm9tICdkZXYtYm94LXVpJztcblxuY2xhc3MgSGVsbG9TY3JlZW4gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIC8qIGVzbGludCBuby1jb25zb2xlOiAwICovXG4gICAgICAvLyBjb25zb2xlLmxvZygncmVuZGVyaW5nIEhlbGxvU2NyZWVuIGNvbXBvbmVudCcpO1xuICAgIH1cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPEhlbGxvIC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEhlbGxvU2NyZWVuO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7XG4gIExpc3Rcbn0gZnJvbSAnZGV2LWJveC11aSc7XG5cbmNsYXNzIExpc3RTY3JlZW4gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxMaXN0IGl0ZW1zPXtbJ3RocmVlJywgJ2ZvdXInXX0vPlxuICAgICAgICA8TGlzdCBpdGVtcz17Wyd0aHJlZScsICdmb3VyJ119Lz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTGlzdFNjcmVlbjtcbiIsImltcG9ydCBIZWxsb1NjcmVlbiBmcm9tICcuL0hlbGxvU2NyZWVuJztcbmltcG9ydCBMaXN0U2NyZWVuIGZyb20gJy4vTGlzdFNjcmVlbic7XG5pbXBvcnQgRm9ybUlucHV0U2NyZWVuIGZyb20gJy4vRm9ybUlucHV0U2NyZWVuJztcbmltcG9ydCBGb3JtSW5wdXROdW1iZXJTY3JlZW4gZnJvbSAnLi9Gb3JtSW5wdXROdW1iZXJTY3JlZW4nO1xuaW1wb3J0IERyYWdnYWJsZSBmcm9tICcuL0RyYWdnYWJsZVNjcmVlbic7XG5pbXBvcnQgREJVV2ViQ29tcG9uZW50RHVtbXlTY3JlZW4gZnJvbSAnLi9EQlVXZWJDb21wb25lbnREdW1teVNjcmVlbic7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgSGVsbG9TY3JlZW4sXG4gIExpc3RTY3JlZW4sXG4gIEZvcm1JbnB1dFNjcmVlbixcbiAgRm9ybUlucHV0TnVtYmVyU2NyZWVuLFxuICBEcmFnZ2FibGUsXG4gIERCVVdlYkNvbXBvbmVudER1bW15U2NyZWVuXG59O1xuIl19
