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
exports.default = getDBUWebComponentBase;

var _LocaleService = require('../../services/LocaleService');

var _LocaleService2 = _interopRequireDefault(_LocaleService);

var _ensureSingleRegistration = require('../internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log('importing getDBUWebComponentBase');

const registrationName = 'DBUWebComponentBase';

function getDBUWebComponentBase(win) {
  return (0, _ensureSingleRegistration2.default)(win, registrationName, () => {
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
        const registrationName = klass.registrationName;
        const dependencies = klass.dependencies;
        dependencies.forEach(dependency => dependency.registerSelf());
        if (customElements.get(registrationName)) return registrationName;
        const componentStyle = ((win.DBUWebComponents || {})[registrationName] || {}).componentStyle;
        if (componentStyle) {
          klass.componentStyle += componentStyle;
        }
        customElements.define(registrationName, klass);
        return registrationName;
      };
    }

    return {
      DBUWebComponentBase,
      defineCommonStaticMethods
    };
  });
}

},{"../../services/LocaleService":2,"../internals/ensureSingleRegistration":7}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDBUWebComponentDummy;

var _DBUWebComponentBase = require('../DBUWebComponentBase/DBUWebComponentBase');

var _DBUWebComponentBase2 = _interopRequireDefault(_DBUWebComponentBase);

var _ensureSingleRegistration = require('../internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log('importing getDBUWebComponent');

const registrationName = 'dbu-web-component-dummy';

function getDBUWebComponentDummy(win) {
  return (0, _ensureSingleRegistration2.default)(win, registrationName, () => {
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
      static get registrationName() {
        return registrationName;
      }

      static get template() {
        return template;
      }

      onLocaleChange(locale) {
        console.log('onLocaleChange', locale);
      }
    }

    defineCommonStaticMethods(DBUWebComponentDummy);

    return DBUWebComponentDummy;
  });
}

getDBUWebComponentDummy.registrationName = registrationName;

},{"../DBUWebComponentBase/DBUWebComponentBase":3,"../internals/ensureSingleRegistration":7}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDBUWebComponentDummyParent;

var _DBUWebComponentBase = require('../DBUWebComponentBase/DBUWebComponentBase');

var _DBUWebComponentBase2 = _interopRequireDefault(_DBUWebComponentBase);

var _DBUWebComponentDummy = require('../DBUWebComponentDummy/DBUWebComponentDummy');

var _DBUWebComponentDummy2 = _interopRequireDefault(_DBUWebComponentDummy);

var _ensureSingleRegistration = require('../internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const registrationName = 'dbu-web-component-dummy-parent';

function getDBUWebComponentDummyParent(win) {
  return (0, _ensureSingleRegistration2.default)(win, registrationName, () => {
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
      static get registrationName() {
        return registrationName;
      }

      static get template() {
        return template;
      }

      static get dependencies() {
        return [DBUWebComponentDummy];
      }

    }

    defineCommonStaticMethods(DBUWebComponentDummyParent);

    return DBUWebComponentDummyParent;
  });
}

getDBUWebComponentDummyParent.registrationName = registrationName;

},{"../DBUWebComponentBase/DBUWebComponentBase":3,"../DBUWebComponentDummy/DBUWebComponentDummy":4,"../internals/ensureSingleRegistration":7}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = dbuWebComponentsSetUp;


const appendStyle = win => (registrationName, componentStyle) => {
  if (!win.DBUWebComponents) {
    win.DBUWebComponents = {};
  }
  win.DBUWebComponents = Object.assign({}, win.DBUWebComponents, {
    [registrationName]: Object.assign({}, win.DBUWebComponents[registrationName], {
      componentStyle
    })
  });
};

function dbuWebComponentsSetUp(win) {
  return {
    appendStyle: appendStyle(win)
  };
}

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ensureSingleRegistration;
function ensureSingleRegistration(win, name, callback) {
  if (!win.DBUWebComponents) {
    win.DBUWebComponents = { registrations: {} };
  } else if (!win.DBUWebComponents.registrations) {
    win.DBUWebComponents.registrations = {};
  }

  let registration = win.DBUWebComponents.registrations[name];

  if (registration) return registration;

  registration = callback();
  win.DBUWebComponents.registrations[name] = registration;

  return win.DBUWebComponents.registrations[name];
}

},{}],8:[function(require,module,exports){
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

},{"./screens":16,"_process":1,"prop-types":"prop-types","react":"react"}],9:[function(require,module,exports){
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

var _DBUWebComponentsSetup = require('../src/lib/webcomponents/DBUWebComponentsSetup/DBUWebComponentsSetup');

var _DBUWebComponentsSetup2 = _interopRequireDefault(_DBUWebComponentsSetup);

var _DBUWebComponentDummy = require('../src/lib/webcomponents/DBUWebComponentDummy/DBUWebComponentDummy');

var _DBUWebComponentDummy2 = _interopRequireDefault(_DBUWebComponentDummy);

var _DBUWebComponentDummyParent = require('../src/lib/webcomponents/DBUWebComponentDummyParent/DBUWebComponentDummyParent');

var _DBUWebComponentDummyParent2 = _interopRequireDefault(_DBUWebComponentDummyParent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _DBUWebComponentsSetup2.default)(window).appendStyle('dbu-web-component-dummy', `
  b {
    color: deepskyblue;
    font-style: oblique;
  }
`);

// import getDBUWebComponentDummy from '../build/src/lib/webcomponents/DBUWebComponentDummy/DBUWebComponentDummy';
// import getDBUWebComponentDummyParent from '../build/src/lib/webcomponents/DBUWebComponentDummyParent/DBUWebComponentDummyParent';


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

  (0, _DBUWebComponentsSetup2.default)(target.contentWindow).appendStyle('dbu-web-component-dummy', `
    b {
      font-style: oblique;
      opacity: 0.5;
    }
  `);
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

},{"../src/lib/webcomponents/DBUWebComponentDummy/DBUWebComponentDummy":4,"../src/lib/webcomponents/DBUWebComponentDummyParent/DBUWebComponentDummyParent":5,"../src/lib/webcomponents/DBUWebComponentsSetup/DBUWebComponentsSetup":6,"./app":8,"_process":1,"dev-box-ui":"dev-box-ui","prop-types":"prop-types","react":"react","react-dom":"react-dom"}],10:[function(require,module,exports){
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

},{"react":"react"}],11:[function(require,module,exports){
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

},{"dev-box-ui":"dev-box-ui","react":"react"}],12:[function(require,module,exports){
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

},{"dev-box-ui":"dev-box-ui","react":"react"}],13:[function(require,module,exports){
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

},{"dev-box-ui":"dev-box-ui","react":"react"}],14:[function(require,module,exports){
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

},{"_process":1,"dev-box-ui":"dev-box-ui","react":"react"}],15:[function(require,module,exports){
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

},{"dev-box-ui":"dev-box-ui","react":"react"}],16:[function(require,module,exports){
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

},{"./DBUWebComponentDummyScreen":10,"./DraggableScreen":11,"./FormInputNumberScreen":12,"./FormInputScreen":13,"./HelloScreen":14,"./ListScreen":15}]},{},[9])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwic3JjL2xpYi9zZXJ2aWNlcy9Mb2NhbGVTZXJ2aWNlLmpzIiwic3JjL2xpYi93ZWJjb21wb25lbnRzL0RCVVdlYkNvbXBvbmVudEJhc2UvREJVV2ViQ29tcG9uZW50QmFzZS5qcyIsInNyYy9saWIvd2ViY29tcG9uZW50cy9EQlVXZWJDb21wb25lbnREdW1teS9EQlVXZWJDb21wb25lbnREdW1teS5qcyIsInNyYy9saWIvd2ViY29tcG9uZW50cy9EQlVXZWJDb21wb25lbnREdW1teVBhcmVudC9EQlVXZWJDb21wb25lbnREdW1teVBhcmVudC5qcyIsInNyYy9saWIvd2ViY29tcG9uZW50cy9EQlVXZWJDb21wb25lbnRzU2V0dXAvREJVV2ViQ29tcG9uZW50c1NldHVwLmpzIiwic3JjL2xpYi93ZWJjb21wb25lbnRzL2ludGVybmFscy9lbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24uanMiLCJzcmNEZW1vL2FwcC5qcyIsInNyY0RlbW8vZGVtby5qcyIsInNyY0RlbW8vc2NyZWVucy9EQlVXZWJDb21wb25lbnREdW1teVNjcmVlbi5qcyIsInNyY0RlbW8vc2NyZWVucy9EcmFnZ2FibGVTY3JlZW4uanMiLCJzcmNEZW1vL3NjcmVlbnMvRm9ybUlucHV0TnVtYmVyU2NyZWVuLmpzIiwic3JjRGVtby9zY3JlZW5zL0Zvcm1JbnB1dFNjcmVlbi5qcyIsInNyY0RlbW8vc2NyZWVucy9IZWxsb1NjcmVlbi5qcyIsInNyY0RlbW8vc2NyZWVucy9MaXN0U2NyZWVuLmpzIiwic3JjRGVtby9zY3JlZW5zL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUN2TEEsTUFBTSxnQkFBZ0I7QUFDcEIsT0FBSyxLQURlO0FBRXBCLFFBQU07QUFGYyxDQUF0Qjs7QUFLQSxN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LENBQWIsR0FERjtBQUVFLHNEQUFNLE9BQU8sQ0FBQyxPQUFELEVBQVUsTUFBVixDQUFiO0FBRkYsS0FERjtBQU1EO0FBUnNDOztrQkFXMUIsVTs7Ozs7Ozs7O0FDaEJmOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O2tCQUVlO0FBQ2Isb0NBRGE7QUFFYixrQ0FGYTtBQUdiLDRDQUhhO0FBSWIsd0RBSmE7QUFLYixzQ0FMYTtBQU1iO0FBTmEsQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiXG5jb25zdCBkZWZhdWx0TG9jYWxlID0ge1xuICBkaXI6ICdsdHInLFxuICBsYW5nOiAnZW4nXG59O1xuXG5jbGFzcyBMb2NhbGVTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fY2FsbGJhY2tzID0gW107XG4gICAgdGhpcy5fbG9jYWxlQXR0cnMgPSBPYmplY3Qua2V5cyhkZWZhdWx0TG9jYWxlKTtcbiAgICB0aGlzLl9yb290RWxlbWVudCA9IHdpbmRvdy5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgdGhpcy5fbG9jYWxlQXR0cnMuZm9yRWFjaCgoYXR0cikgPT4ge1xuICAgICAgaWYgKCF0aGlzLl9yb290RWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cikpIHtcbiAgICAgICAgdGhpcy5fcm9vdEVsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHIsIGRlZmF1bHRMb2NhbGVbYXR0cl0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuX2xvY2FsZSA9IHRoaXMuX2xvY2FsZUF0dHJzLnJlZHVjZSgoYWNjLCBhdHRyKSA9PiB7XG4gICAgICBhY2NbYXR0cl0gPSB0aGlzLl9yb290RWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cik7XG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHt9KTtcbiAgICB0aGlzLl9vYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMuX2hhbmRsZU11dGF0aW9ucy5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLl9vYnNlcnZlci5vYnNlcnZlKHRoaXMuX3Jvb3RFbGVtZW50LCB7XG4gICAgICBhdHRyaWJ1dGVzOiB0cnVlXG4gICAgfSk7XG4gIH1cblxuICBfaGFuZGxlTXV0YXRpb25zKG11dGF0aW9ucykge1xuICAgIG11dGF0aW9ucy5mb3JFYWNoKChtdXRhdGlvbikgPT4ge1xuICAgICAgY29uc3QgbXV0YXRpb25BdHRyaWJ1dGVOYW1lID0gbXV0YXRpb24uYXR0cmlidXRlTmFtZTtcbiAgICAgIGlmICh0aGlzLl9sb2NhbGVBdHRycy5pbmNsdWRlcyhtdXRhdGlvbkF0dHJpYnV0ZU5hbWUpKSB7XG4gICAgICAgIHRoaXMuX2xvY2FsZSA9IHtcbiAgICAgICAgICAuLi50aGlzLl9sb2NhbGUsXG4gICAgICAgICAgW211dGF0aW9uQXR0cmlidXRlTmFtZV06IHRoaXMuX3Jvb3RFbGVtZW50LmdldEF0dHJpYnV0ZShtdXRhdGlvbkF0dHJpYnV0ZU5hbWUpXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX2NhbGxiYWNrcy5mb3JFYWNoKGNhbGxiYWNrID0+IGNhbGxiYWNrKHRoaXMuX2xvY2FsZSkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc2V0IGxvY2FsZShsb2NhbGVPYmopIHtcbiAgICBPYmplY3Qua2V5cyhsb2NhbGVPYmopLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgdGhpcy5fcm9vdEVsZW1lbnQuc2V0QXR0cmlidXRlKGtleSwgbG9jYWxlT2JqW2tleV0pO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0IGxvY2FsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fbG9jYWxlO1xuICB9XG5cbiAgb25Mb2NhbGVDaGFuZ2UoY2FsbGJhY2spIHtcbiAgICB0aGlzLl9jYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG4gICAgY2FsbGJhY2sodGhpcy5sb2NhbGUpO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MuZmlsdGVyKGNiID0+IGNiICE9PSBjYWxsYmFjayk7XG4gICAgfTtcbiAgfVxufVxuXG5jb25zdCBsb2NhbGVTZXJ2aWNlID0gbmV3IExvY2FsZVNlcnZpY2UoKTtcbmV4cG9ydCBkZWZhdWx0IGxvY2FsZVNlcnZpY2U7XG4iLCJcbmltcG9ydCBMb2NhbGVTZXJ2aWNlIGZyb20gJy4uLy4uL3NlcnZpY2VzL0xvY2FsZVNlcnZpY2UnO1xuaW1wb3J0IGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbiBmcm9tICcuLi9pbnRlcm5hbHMvZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uJztcblxuY29uc29sZS5sb2coJ2ltcG9ydGluZyBnZXREQlVXZWJDb21wb25lbnRCYXNlJyk7XG5cbmNvbnN0IHJlZ2lzdHJhdGlvbk5hbWUgPSAnREJVV2ViQ29tcG9uZW50QmFzZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldERCVVdlYkNvbXBvbmVudEJhc2Uod2luKSB7XG4gIHJldHVybiBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24od2luLCByZWdpc3RyYXRpb25OYW1lLCAoKSA9PiB7XG4gICAgY29uc3QgeyBkb2N1bWVudCwgSFRNTEVsZW1lbnQsIGN1c3RvbUVsZW1lbnRzIH0gPSB3aW47XG5cbiAgICBjb25zdCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gJzxzdHlsZT48L3N0eWxlPjxzbG90Pjwvc2xvdD4nO1xuXG4gICAgY2xhc3MgREJVV2ViQ29tcG9uZW50QmFzZSBleHRlbmRzIEhUTUxFbGVtZW50IHtcblxuICAgICAgc3RhdGljIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IGRlcGVuZGVuY2llcygpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IHVzZVNoYWRvdygpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICBjb25zdCB7IHVzZVNoYWRvdyB9ID0gdGhpcy5jb25zdHJ1Y3RvcjtcbiAgICAgICAgaWYgKHVzZVNoYWRvdykge1xuICAgICAgICAgIHRoaXMuYXR0YWNoU2hhZG93KHsgbW9kZTogJ29wZW4nIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2luc2VydFRlbXBsYXRlKCk7XG5cbiAgICAgICAgdGhpcy5jb25uZWN0ZWRDYWxsYmFjayA9IHRoaXMuY29ubmVjdGVkQ2FsbGJhY2suYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5kaXNjb25uZWN0ZWRDYWxsYmFjayA9IHRoaXMuZGlzY29ubmVjdGVkQ2FsbGJhY2suYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5faGFuZGxlTG9jYWxlQ2hhbmdlID0gdGhpcy5faGFuZGxlTG9jYWxlQ2hhbmdlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMub25Mb2NhbGVDaGFuZ2UgJiYgKHRoaXMub25Mb2NhbGVDaGFuZ2UgPSB0aGlzLm9uTG9jYWxlQ2hhbmdlLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLnVucmVnaXN0ZXJMb2NhbGVDaGFuZ2UgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2JlZm9yZXVubG9hZCcsIHRoaXMuZGlzY29ubmVjdGVkQ2FsbGJhY2ssIGZhbHNlKTtcblxuICAgICAgICB0aGlzLnVucmVnaXN0ZXJMb2NhbGVDaGFuZ2UgPVxuICAgICAgICAgIExvY2FsZVNlcnZpY2Uub25Mb2NhbGVDaGFuZ2UodGhpcy5faGFuZGxlTG9jYWxlQ2hhbmdlKTtcbiAgICAgIH1cblxuICAgICAgZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHRoaXMudW5yZWdpc3RlckxvY2FsZUNoYW5nZSgpO1xuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignYmVmb3JldW5sb2FkJywgdGhpcy5kaXNjb25uZWN0ZWRDYWxsYmFjaywgZmFsc2UpO1xuICAgICAgfVxuXG4gICAgICBnZXQgY2hpbGRyZW5UcmVlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci51c2VTaGFkb3cgPyB0aGlzLnNoYWRvd1Jvb3QgOiB0aGlzO1xuICAgICAgfVxuXG4gICAgICBfaW5zZXJ0VGVtcGxhdGUoKSB7XG4gICAgICAgIGNvbnN0IHsgdGVtcGxhdGUgfSA9IHRoaXMuY29uc3RydWN0b3I7XG5cbiAgICAgICAgaWYgKHRlbXBsYXRlKSB7XG4gICAgICAgICAgdGhpcy5jaGlsZHJlblRyZWUuYXBwZW5kQ2hpbGQodGVtcGxhdGUuY29udGVudC5jbG9uZU5vZGUodHJ1ZSkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIF9oYW5kbGVMb2NhbGVDaGFuZ2UobG9jYWxlKSB7XG4gICAgICAgIHRoaXMuY2hpbGRyZW5UcmVlLmlubmVySFRNTCA9ICcnO1xuICAgICAgICB0aGlzLl9pbnNlcnRUZW1wbGF0ZSgpO1xuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnZGlyJywgbG9jYWxlLmRpcik7XG4gICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdsYW5nJywgbG9jYWxlLmxhbmcpO1xuICAgICAgICB0aGlzLm9uTG9jYWxlQ2hhbmdlICYmIHRoaXMub25Mb2NhbGVDaGFuZ2UobG9jYWxlKTtcbiAgICAgIH1cblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMoa2xhc3MpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShrbGFzcywgJ2NvbXBvbmVudFN0eWxlJywge1xuICAgICAgICBnZXQoKSB7XG4gICAgICAgICAgcmV0dXJuIGtsYXNzLnRlbXBsYXRlLmNvbnRlbnQucXVlcnlTZWxlY3Rvcignc3R5bGUnKS5pbm5lckhUTUw7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCh2YWx1ZSkge1xuICAgICAgICAgIGtsYXNzLnRlbXBsYXRlLmNvbnRlbnQucXVlcnlTZWxlY3Rvcignc3R5bGUnKS5pbm5lckhUTUwgPSB2YWx1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9KTtcblxuICAgICAga2xhc3MucmVnaXN0ZXJTZWxmID0gKCkgPT4ge1xuICAgICAgICBjb25zdCByZWdpc3RyYXRpb25OYW1lID0ga2xhc3MucmVnaXN0cmF0aW9uTmFtZTtcbiAgICAgICAgY29uc3QgZGVwZW5kZW5jaWVzID0ga2xhc3MuZGVwZW5kZW5jaWVzO1xuICAgICAgICBkZXBlbmRlbmNpZXMuZm9yRWFjaCgoZGVwZW5kZW5jeSkgPT4gZGVwZW5kZW5jeS5yZWdpc3RlclNlbGYoKSk7XG4gICAgICAgIGlmIChjdXN0b21FbGVtZW50cy5nZXQocmVnaXN0cmF0aW9uTmFtZSkpIHJldHVybiByZWdpc3RyYXRpb25OYW1lO1xuICAgICAgICBjb25zdCBjb21wb25lbnRTdHlsZSA9ICgod2luLkRCVVdlYkNvbXBvbmVudHMgfHwge30pW3JlZ2lzdHJhdGlvbk5hbWVdIHx8IHt9KS5jb21wb25lbnRTdHlsZTtcbiAgICAgICAgaWYgKGNvbXBvbmVudFN0eWxlKSB7XG4gICAgICAgICAga2xhc3MuY29tcG9uZW50U3R5bGUgKz0gY29tcG9uZW50U3R5bGU7XG4gICAgICAgIH1cbiAgICAgICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKHJlZ2lzdHJhdGlvbk5hbWUsIGtsYXNzKTtcbiAgICAgICAgcmV0dXJuIHJlZ2lzdHJhdGlvbk5hbWU7XG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBEQlVXZWJDb21wb25lbnRCYXNlLFxuICAgICAgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kc1xuICAgIH07XG4gIH0pO1xufVxuIiwiXG5pbXBvcnQgZ2V0REJVV2ViQ29tcG9uZW50QmFzZSBmcm9tICcuLi9EQlVXZWJDb21wb25lbnRCYXNlL0RCVVdlYkNvbXBvbmVudEJhc2UnO1xuaW1wb3J0IGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbiBmcm9tICcuLi9pbnRlcm5hbHMvZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uJztcblxuY29uc29sZS5sb2coJ2ltcG9ydGluZyBnZXREQlVXZWJDb21wb25lbnQnKTtcblxuY29uc3QgcmVnaXN0cmF0aW9uTmFtZSA9ICdkYnUtd2ViLWNvbXBvbmVudC1kdW1teSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldERCVVdlYkNvbXBvbmVudER1bW15KHdpbikge1xuICByZXR1cm4gZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uKHdpbiwgcmVnaXN0cmF0aW9uTmFtZSwgKCkgPT4ge1xuICAgIGNvbnN0IHsgREJVV2ViQ29tcG9uZW50QmFzZSwgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyB9ID0gZ2V0REJVV2ViQ29tcG9uZW50QmFzZSh3aW4pO1xuICAgIGNvbnN0IHsgZG9jdW1lbnQgfSA9IHdpbjtcblxuICAgIGNvbnN0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBgXG4gICAgICA8c3R5bGU+XG4gICAgICA6aG9zdCB7XG4gICAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgICBjb2xvcjogbWFyb29uO1xuICAgICAgfVxuICAgICAgXG4gICAgICA6aG9zdCBiIHtcbiAgICAgICAgdGV4dC1zaGFkb3c6IHZhcigtLWItdGV4dC1zaGFkb3csIG5vbmUpO1xuICAgICAgfVxuICAgICAgXG4gICAgICA6aG9zdChbZGlyPXJ0bF0pIGIge1xuICAgICAgICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcbiAgICAgICAgcGFkZGluZzogNXB4O1xuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCByZWQ7XG4gICAgICB9XG4gICAgICA6aG9zdChbZGlyPWx0cl0pIGIge1xuICAgICAgICB0ZXh0LWRlY29yYXRpb246IG92ZXJsaW5lO1xuICAgICAgICBwYWRkaW5nOiA1cHg7XG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIGdyZWVuO1xuICAgICAgfVxuICAgICAgXG4gICAgICA6aG9zdChbZGlyPXJ0bF0pIHNwYW5beC1oYXMtc2xvdF0ge1xuICAgICAgICBmbG9hdDogbGVmdDtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgOmhvc3QoW2Rpcj1sdHJdKSBzcGFuW3gtaGFzLXNsb3RdIHtcbiAgICAgICAgZmxvYXQ6IHJpZ2h0O1xuICAgICAgfVxuICAgICAgXG4gICAgICA6aG9zdChbZGlyPWx0cl0pICpbZGlyPXJ0bF0ge1xuICAgICAgICBkaXNwbGF5OiBub25lO1xuICAgICAgfVxuICAgICAgOmhvc3QoW2Rpcj1ydGxdKSAqW2Rpcj1sdHJdIHtcbiAgICAgICAgZGlzcGxheTogbm9uZTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgPC9zdHlsZT5cbiAgICAgIFxuICAgICAgPGIgZGlyPVwibHRyXCI+SSdtIGluIHNoYWRvdyBkb20hIGx0ciAoREJVV2ViQ29tcG9uZW50RHVtbXkpPC9iPlxuICAgICAgPHNwYW4geC1oYXMtc2xvdD48c3Bhbj5bPC9zcGFuPjxzbG90Pjwvc2xvdD48c3Bhbj5dPC9zcGFuPjwvc3Bhbj5cbiAgICAgIDxiIGRpcj1cInJ0bFwiPkknbSBpbiBzaGFkb3cgZG9tISBydGwgKERCVVdlYkNvbXBvbmVudER1bW15KTwvYj5cbiAgICBgO1xuXG4gICAgY2xhc3MgREJVV2ViQ29tcG9uZW50RHVtbXkgZXh0ZW5kcyBEQlVXZWJDb21wb25lbnRCYXNlIHtcbiAgICAgIHN0YXRpYyBnZXQgcmVnaXN0cmF0aW9uTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHJlZ2lzdHJhdGlvbk5hbWU7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgdGVtcGxhdGUoKSB7XG4gICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICAgIH1cblxuICAgICAgb25Mb2NhbGVDaGFuZ2UobG9jYWxlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdvbkxvY2FsZUNoYW5nZScsIGxvY2FsZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyhEQlVXZWJDb21wb25lbnREdW1teSk7XG5cbiAgICByZXR1cm4gREJVV2ViQ29tcG9uZW50RHVtbXk7XG4gIH0pO1xufVxuXG5nZXREQlVXZWJDb21wb25lbnREdW1teS5yZWdpc3RyYXRpb25OYW1lID0gcmVnaXN0cmF0aW9uTmFtZTtcblxuIiwiXG5cbmltcG9ydCBnZXREQlVXZWJDb21wb25lbnRCYXNlIGZyb20gJy4uL0RCVVdlYkNvbXBvbmVudEJhc2UvREJVV2ViQ29tcG9uZW50QmFzZSc7XG5pbXBvcnQgZ2V0REJVV2ViQ29tcG9uZW50RHVtbXkgZnJvbSAnLi4vREJVV2ViQ29tcG9uZW50RHVtbXkvREJVV2ViQ29tcG9uZW50RHVtbXknO1xuaW1wb3J0IGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbiBmcm9tICcuLi9pbnRlcm5hbHMvZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uJztcblxuY29uc3QgcmVnaXN0cmF0aW9uTmFtZSA9ICdkYnUtd2ViLWNvbXBvbmVudC1kdW1teS1wYXJlbnQnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXREQlVXZWJDb21wb25lbnREdW1teVBhcmVudCh3aW4pIHtcbiAgcmV0dXJuIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbih3aW4sIHJlZ2lzdHJhdGlvbk5hbWUsICgpID0+IHtcbiAgICBjb25zdCB7IERCVVdlYkNvbXBvbmVudEJhc2UsIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMgfSA9IGdldERCVVdlYkNvbXBvbmVudEJhc2Uod2luKTtcbiAgICBjb25zdCBEQlVXZWJDb21wb25lbnREdW1teSA9IGdldERCVVdlYkNvbXBvbmVudER1bW15KHdpbik7XG5cbiAgICBjb25zdCB7IGRvY3VtZW50IH0gPSB3aW47XG5cbiAgICBjb25zdCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gYFxuICAgICAgPHN0eWxlPlxuICAgICAgOmhvc3Qge2Rpc3BsYXk6IGJsb2NrO31cbiAgICAgIDwvc3R5bGU+XG4gICAgICA8Yj5JJ20gaW4gc2hhZG93IGRvbSEgKERCVVdlYkNvbXBvbmVudER1bW15UGFyZW50KTwvYj5cbiAgICAgIDxkYnUtd2ViLWNvbXBvbmVudC1kdW1teT48c2xvdD48L3Nsb3Q+PC9kYnUtd2ViLWNvbXBvbmVudC1kdW1teT5cbiAgICBgO1xuXG4gICAgY2xhc3MgREJVV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQgZXh0ZW5kcyBEQlVXZWJDb21wb25lbnRCYXNlIHtcbiAgICAgIHN0YXRpYyBnZXQgcmVnaXN0cmF0aW9uTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHJlZ2lzdHJhdGlvbk5hbWU7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgdGVtcGxhdGUoKSB7XG4gICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCBkZXBlbmRlbmNpZXMoKSB7XG4gICAgICAgIHJldHVybiBbREJVV2ViQ29tcG9uZW50RHVtbXldO1xuICAgICAgfVxuXG4gICAgfVxuXG4gICAgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyhEQlVXZWJDb21wb25lbnREdW1teVBhcmVudCk7XG5cbiAgICByZXR1cm4gREJVV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQ7XG4gIH0pO1xufVxuXG5nZXREQlVXZWJDb21wb25lbnREdW1teVBhcmVudC5yZWdpc3RyYXRpb25OYW1lID0gcmVnaXN0cmF0aW9uTmFtZTtcblxuIiwiXG5cbmNvbnN0IGFwcGVuZFN0eWxlID0gKHdpbikgPT4gKHJlZ2lzdHJhdGlvbk5hbWUsIGNvbXBvbmVudFN0eWxlKSA9PiB7XG4gIGlmICghd2luLkRCVVdlYkNvbXBvbmVudHMpIHtcbiAgICB3aW4uREJVV2ViQ29tcG9uZW50cyA9IHt9O1xuICB9XG4gIHdpbi5EQlVXZWJDb21wb25lbnRzID0ge1xuICAgIC4uLndpbi5EQlVXZWJDb21wb25lbnRzLFxuICAgIFtyZWdpc3RyYXRpb25OYW1lXToge1xuICAgICAgLi4ud2luLkRCVVdlYkNvbXBvbmVudHNbcmVnaXN0cmF0aW9uTmFtZV0sXG4gICAgICBjb21wb25lbnRTdHlsZVxuICAgIH1cbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRidVdlYkNvbXBvbmVudHNTZXRVcCh3aW4pIHtcbiAgcmV0dXJuIHtcbiAgICBhcHBlbmRTdHlsZTogYXBwZW5kU3R5bGUod2luKVxuICB9O1xufVxuIiwiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbih3aW4sIG5hbWUsIGNhbGxiYWNrKSB7XG4gIGlmICghd2luLkRCVVdlYkNvbXBvbmVudHMpIHtcbiAgICB3aW4uREJVV2ViQ29tcG9uZW50cyA9IHsgcmVnaXN0cmF0aW9uczoge30gfTtcbiAgfSBlbHNlIGlmICghd2luLkRCVVdlYkNvbXBvbmVudHMucmVnaXN0cmF0aW9ucykge1xuICAgIHdpbi5EQlVXZWJDb21wb25lbnRzLnJlZ2lzdHJhdGlvbnMgPSB7fTtcbiAgfVxuXG4gIGxldCByZWdpc3RyYXRpb24gPSB3aW4uREJVV2ViQ29tcG9uZW50cy5yZWdpc3RyYXRpb25zW25hbWVdO1xuXG4gIGlmIChyZWdpc3RyYXRpb24pIHJldHVybiByZWdpc3RyYXRpb247XG5cbiAgcmVnaXN0cmF0aW9uID0gY2FsbGJhY2soKTtcbiAgd2luLkRCVVdlYkNvbXBvbmVudHMucmVnaXN0cmF0aW9uc1tuYW1lXSA9IHJlZ2lzdHJhdGlvbjtcblxuICByZXR1cm4gd2luLkRCVVdlYkNvbXBvbmVudHMucmVnaXN0cmF0aW9uc1tuYW1lXTtcbn1cblxuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgc2NyZWVucyBmcm9tICcuL3NjcmVlbnMnO1xuXG5jbGFzcyBBcHAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsIHRoaXMub25IYXNoQ2hhbmdlLmJpbmQodGhpcykpO1xuICB9XG5cbiAgb25IYXNoQ2hhbmdlKCkge1xuICAgIHRoaXMuZm9yY2VVcGRhdGUoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgLyogZXNsaW50IG5vLWNvbnNvbGU6IDAgKi9cbiAgICAgIC8vIGNvbnNvbGUubG9nKCdyZW5kZXJpbmcgQXBwIGNvbXBvbmVudCcpO1xuICAgIH1cbiAgICBjb25zdCBzY3JlZW5zS2V5cyA9IE9iamVjdC5rZXlzKHNjcmVlbnMpO1xuICAgIGNvbnN0IGxpbmtzID0gPHVsPlxuICAgICAge1xuICAgICAgICBzY3JlZW5zS2V5cy5tYXAoKHNjcmVlbiwgaWR4KSA9PiAoXG4gICAgICAgICAgPGxpIGtleT17aWR4fT5cbiAgICAgICAgICAgIDxhIGtleT17aWR4fSBocmVmPXtgIyR7c2NyZWVufWB9PntzY3JlZW59PC9hPlxuICAgICAgICAgIDwvbGk+XG4gICAgICAgICkpXG4gICAgICB9XG4gICAgPC91bD47XG4gICAgY29uc3QgU2NyZWVuID0gc2NyZWVuc1sod2luZG93LmxvY2F0aW9uLmhhc2ggfHwgYCMke3NjcmVlbnNLZXlzWzBdfWApLnJlcGxhY2UoJyMnLCAnJyldO1xuXG4gICAgaWYgKCFTY3JlZW4pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIHtsaW5rc31cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPFNjcmVlbi8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5BcHAucHJvcFR5cGVzID0ge1xuICBjbGFzc2VzOiBQcm9wVHlwZXMub2JqZWN0LFxuICB0aGVtZTogUHJvcFR5cGVzLm9iamVjdFxufTtcblxuZXhwb3J0IGRlZmF1bHQgQXBwO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7XG4gIC8vIG9uU2NyZWVuQ29uc29sZSxcbiAgbG9jYWxlQXdhcmVcbn0gZnJvbSAnZGV2LWJveC11aSc7XG5pbXBvcnQgQXBwIGZyb20gJy4vYXBwJztcblxuLy8gaW1wb3J0IGdldERCVVdlYkNvbXBvbmVudER1bW15IGZyb20gJy4uL2J1aWxkL3NyYy9saWIvd2ViY29tcG9uZW50cy9EQlVXZWJDb21wb25lbnREdW1teS9EQlVXZWJDb21wb25lbnREdW1teSc7XG4vLyBpbXBvcnQgZ2V0REJVV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQgZnJvbSAnLi4vYnVpbGQvc3JjL2xpYi93ZWJjb21wb25lbnRzL0RCVVdlYkNvbXBvbmVudER1bW15UGFyZW50L0RCVVdlYkNvbXBvbmVudER1bW15UGFyZW50JztcbmltcG9ydCBkYnVXZWJDb21wb25lbnRzU2V0VXAgZnJvbSAnLi4vc3JjL2xpYi93ZWJjb21wb25lbnRzL0RCVVdlYkNvbXBvbmVudHNTZXR1cC9EQlVXZWJDb21wb25lbnRzU2V0dXAnO1xuaW1wb3J0IGdldERCVVdlYkNvbXBvbmVudER1bW15IGZyb20gJy4uL3NyYy9saWIvd2ViY29tcG9uZW50cy9EQlVXZWJDb21wb25lbnREdW1teS9EQlVXZWJDb21wb25lbnREdW1teSc7XG5pbXBvcnQgZ2V0REJVV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQgZnJvbSAnLi4vc3JjL2xpYi93ZWJjb21wb25lbnRzL0RCVVdlYkNvbXBvbmVudER1bW15UGFyZW50L0RCVVdlYkNvbXBvbmVudER1bW15UGFyZW50JztcblxuZGJ1V2ViQ29tcG9uZW50c1NldFVwKHdpbmRvdykuYXBwZW5kU3R5bGUoJ2RidS13ZWItY29tcG9uZW50LWR1bW15JywgYFxuICBiIHtcbiAgICBjb2xvcjogZGVlcHNreWJsdWU7XG4gICAgZm9udC1zdHlsZTogb2JsaXF1ZTtcbiAgfVxuYCk7XG5cbmNvbnN0IERCVVdlYkNvbXBvbmVudER1bW15ID0gZ2V0REJVV2ViQ29tcG9uZW50RHVtbXkod2luZG93KTtcbmNvbnN0IERCVVdlYkNvbXBvbmVudER1bW15UGFyZW50ID0gZ2V0REJVV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQod2luZG93KTtcblxuXG5zZXRUaW1lb3V0KCgpID0+IHtcbiAgREJVV2ViQ29tcG9uZW50RHVtbXkucmVnaXN0ZXJTZWxmKCk7XG4gIERCVVdlYkNvbXBvbmVudER1bW15UGFyZW50LnJlZ2lzdGVyU2VsZigpO1xufSwgMjAwMCk7XG5cbmNvbnN0IGlmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpO1xuXG53aW5kb3cub25tZXNzYWdlID0gZnVuY3Rpb24gKG1zZykgeyBjb25zb2xlLmxvZygnbXNnIGZyb20gaWZyYW1lJywgbXNnKTsgfTtcbmlmcmFtZS5vbmxvYWQgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gIGNvbnN0IHRhcmdldCA9IGV2dC50YXJnZXQ7XG5cbiAgdGFyZ2V0LmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQud3JpdGUoYFxuICAgIDxodG1sPlxuICAgIDxib2R5PlxuICAgICAgPGRidS13ZWItY29tcG9uZW50LWR1bW15XG4gICAgICAgIHN0eWxlPVwiY29sb3I6IGJsdWVcIlxuICAgICAgPlxuICAgICAgICA8c3Bhbj5oZWxsbyB3b3JsZCAzPC9zcGFuPlxuICAgICAgPC9kYnUtd2ViLWNvbXBvbmVudC1kdW1teT5cbiAgICAgIDxkYnUtd2ViLWNvbXBvbmVudC1kdW1teS1wYXJlbnQ+PC9kYnUtd2ViLWNvbXBvbmVudC1kdW1teS1wYXJlbnQ+XG4gICAgPC9ib2R5PlxuICAgIDxzY3JpcHQ+XG4gICAgICB3aW5kb3cub25tZXNzYWdlID0gZnVuY3Rpb24gKG1zZykge1xuICAgICAgICBjb25zb2xlLmxvZygnbXNnIGZyb20gd2luZG93JywgbXNnKTtcbiAgICAgICAgd2luZG93LnRvcC5wb3N0TWVzc2FnZSgnd29ybGQnLCAnKicpO1xuICAgICAgfTtcbiAgICA8L3NjcmlwdD5cbiAgICA8L2h0bWw+XG4gIGApO1xuICB0YXJnZXQuY29udGVudFdpbmRvdy5wb3N0TWVzc2FnZSgnaGVsbG8nLCAnKicpO1xuXG4gIGRidVdlYkNvbXBvbmVudHNTZXRVcCh0YXJnZXQuY29udGVudFdpbmRvdykuYXBwZW5kU3R5bGUoJ2RidS13ZWItY29tcG9uZW50LWR1bW15JywgYFxuICAgIGIge1xuICAgICAgZm9udC1zdHlsZTogb2JsaXF1ZTtcbiAgICAgIG9wYWNpdHk6IDAuNTtcbiAgICB9XG4gIGApO1xuICBjb25zdCBEQlVXZWJDb21wb25lbnREdW1teTIgPSBnZXREQlVXZWJDb21wb25lbnREdW1teSh0YXJnZXQuY29udGVudFdpbmRvdyk7XG4gIGNvbnN0IERCVVdlYkNvbXBvbmVudER1bW15UGFyZW50MiA9IGdldERCVVdlYkNvbXBvbmVudER1bW15UGFyZW50KHRhcmdldC5jb250ZW50V2luZG93KTtcbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgREJVV2ViQ29tcG9uZW50RHVtbXkyLnJlZ2lzdGVyU2VsZigpO1xuICAgIERCVVdlYkNvbXBvbmVudER1bW15UGFyZW50Mi5yZWdpc3RlclNlbGYoKTtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgLy8gdGFyZ2V0LnJlbW92ZSgpO1xuICAgIH0sIDIwMDApO1xuICB9LCAyMDAwKTtcbn07XG5cbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcblxuXG4vLyBvblNjcmVlbkNvbnNvbGUoeyBvcHRpb25zOiB7IHNob3dMYXN0T25seTogZmFsc2UgfSB9KTtcblxubGV0IERlbW8gPSBjbGFzcyBEZW1vIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAvKiBlc2xpbnQgbm8tY29uc29sZTogMCAqL1xuICAgICAgLy8gY29uc29sZS5sb2coJ3JlbmRlcmluZyBEZW1vIGNvbXBvbmVudCcpO1xuICAgIH1cbiAgICBjb25zdCB7IGxvY2FsZTogeyBkaXIgfSB9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gKFxuICAgICAgPEFwcCAvPlxuICAgICk7XG4gIH1cbn07XG5cbkRlbW8ucHJvcFR5cGVzID0ge1xuICBsb2NhbGU6IFByb3BUeXBlcy5vYmplY3Rcbn07XG5cbkRlbW8gPSBsb2NhbGVBd2FyZShEZW1vKTtcblxuUmVhY3RET00ucmVuZGVyKChcbiAgPERlbW8vPlxuKSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RlbW8nKSk7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5jbGFzcyBEQlVXZWJDb21wb25lbnREdW1teVNjcmVlbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cblxuICAgICAgICA8ZGJ1LXdlYi1jb21wb25lbnQtZHVtbXlcbiAgICAgICAgICBzdHlsZT17eyBjb2xvcjogJ2JsdWUnIH19XG4gICAgICAgID5cbiAgICAgICAgICA8c3Bhbj5oZWxsbyB3b3JsZCAxPC9zcGFuPlxuICAgICAgICA8L2RidS13ZWItY29tcG9uZW50LWR1bW15PlxuXG4gICAgICAgIDxkYnUtd2ViLWNvbXBvbmVudC1kdW1teVxuICAgICAgICAgIHN0eWxlPXt7IGNvbG9yOiAnYmx1ZScgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxzcGFuPmhlbGxvIHdvcmxkIDI8L3NwYW4+XG4gICAgICAgIDwvZGJ1LXdlYi1jb21wb25lbnQtZHVtbXk+XG4gICAgICAgIDxkYnUtd2ViLWNvbXBvbmVudC1kdW1teS1wYXJlbnQ+PC9kYnUtd2ViLWNvbXBvbmVudC1kdW1teS1wYXJlbnQ+XG5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgREJVV2ViQ29tcG9uZW50RHVtbXlTY3JlZW47XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtcbiAgRHJhZ2dhYmxlLCBEaXNhYmxlU2VsZWN0aW9uXG59IGZyb20gJ2Rldi1ib3gtdWknO1xuXG5jbGFzcyBUb1JlbmRlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICAvLyBjb25zb2xlLmxvZygnVG9SZW5kZXIjcmVuZGVyJyk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgc3R5bGU9e3sgd2lkdGg6IDMwMCwgaGVpZ2h0OiAzMDAgfX1cbiAgICAgICAgb25Nb3VzZURvd249e3RoaXMucHJvcHMub25Nb3VzZURvd259XG4gICAgICAgIG9uTW91c2VVcD17dGhpcy5wcm9wcy5vbk1vdXNlVXB9XG4gICAgICAgIG9uQ2xpY2s9e3RoaXMucHJvcHMub25DbGlja31cbiAgICAgICAgb25Ub3VjaFN0YXJ0PXt0aGlzLnByb3BzLm9uVG91Y2hTdGFydH1cbiAgICAgICAgb25Ub3VjaEVuZD17dGhpcy5wcm9wcy5vblRvdWNoRW5kfVxuICAgICAgPlxuICAgICAgICA8cD5kcmFnZ2FibGUgcCB7dGhpcy5wcm9wcy5jb3VudGVyfSA8YSBocmVmPVwiaHR0cDovL2dvb2dsZS5jb21cIiB0YXJnZXQ9XCJfYmxhbmtcIj5saW5rPC9hPjwvcD5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuY2xhc3MgRHJhZ2dhYmxlU2NyZWVuIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5oYW5kbGVNb3VzZURvd24gPSB0aGlzLmhhbmRsZU1vdXNlRG93bi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlVG91Y2hTdGFydCA9IHRoaXMuaGFuZGxlVG91Y2hTdGFydC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlTW91c2VVcCA9IHRoaXMuaGFuZGxlTW91c2VVcC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlVG91Y2hFbmQgPSB0aGlzLmhhbmRsZVRvdWNoRW5kLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVDbGljayA9IHRoaXMuaGFuZGxlQ2xpY2suYmluZCh0aGlzKTtcblxuICAgIHRoaXMuY291bnRlciA9IDE7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGRyYWdnYWJsZUNvbnRlbnQ6IHRoaXMuZHJhZ2dhYmxlQ29udGVudFxuICAgIH07XG4gIH1cblxuICBnZXQgZHJhZ2dhYmxlQ29udGVudCgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFRvUmVuZGVyXG4gICAgICAgIG9uTW91c2VEb3duPXt0aGlzLmhhbmRsZU1vdXNlRG93bn1cbiAgICAgICAgb25Nb3VzZVVwPXt0aGlzLmhhbmRsZU1vdXNlVXB9XG4gICAgICAgIG9uVG91Y2hTdGFydD17dGhpcy5oYW5kbGVUb3VjaFN0YXJ0fVxuICAgICAgICBvblRvdWNoRW5kPXt0aGlzLmhhbmRsZVRvdWNoRW5kfVxuICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrfVxuICAgICAgICBjb3VudGVyPXt0aGlzLmNvdW50ZXJ9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICBoYW5kbGVNb3VzZURvd24oZXZ0KSB7XG4gICAgY29uc29sZS5sb2coJ0RyYWdnYWJsZVNjcmVlbiNoYW5kbGVNb3VzZURvd24nKTtcbiAgfVxuICBoYW5kbGVNb3VzZVVwKGV2dCkge1xuICAgIGNvbnNvbGUubG9nKCdEcmFnZ2FibGVTY3JlZW4jaGFuZGxlTW91c2VVcCcpO1xuICB9XG4gIGhhbmRsZVRvdWNoU3RhcnQoZXZ0KSB7XG4gICAgY29uc29sZS5sb2coJ0RyYWdnYWJsZVNjcmVlbiNoYW5kbGVUb3VjaFN0YXJ0Jyk7XG4gIH1cbiAgaGFuZGxlVG91Y2hFbmQoZXZ0KSB7XG4gICAgY29uc29sZS5sb2coJ0RyYWdnYWJsZVNjcmVlbiNoYW5kbGVUb3VjaEVuZCcpO1xuICB9XG4gIGhhbmRsZUNsaWNrKGV2dCkge1xuICAgIGNvbnNvbGUubG9nKCdEcmFnZ2FibGVTY3JlZW4jaGFuZGxlQ2xpY2snKTtcbiAgICAvLyB0aGlzLmNvdW50ZXIgPSB0aGlzLmNvdW50ZXIgKyAxO1xuICAgIC8vIHRoaXMuc2V0U3RhdGUoe1xuICAgIC8vICAgZHJhZ2dhYmxlQ29udGVudDogdGhpcy5kcmFnZ2FibGVDb250ZW50XG4gICAgLy8gfSk7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuY291bnRlciA9IHRoaXMuY291bnRlciArIDE7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgZHJhZ2dhYmxlQ29udGVudDogdGhpcy5kcmFnZ2FibGVDb250ZW50XG4gICAgICB9KTtcbiAgICB9LCAzMDAwKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPERyYWdnYWJsZSBzdHlsZT17eyBib3JkZXI6ICcxcHggc29saWQgYmx1ZScsIHdpZHRoOiAyMDAsIGhlaWdodDogMjAwLCBvdmVyZmxvd1g6ICdzY3JvbGwnLCBvdmVyZmxvd1k6ICdzY3JvbGwnIH19PlxuICAgICAgICAgIHt0aGlzLnN0YXRlLmRyYWdnYWJsZUNvbnRlbnR9XG4gICAgICAgIDwvRHJhZ2dhYmxlPlxuICAgICAgICA8RGlzYWJsZVNlbGVjdGlvbj5cbiAgICAgICAgICA8cD5kaXNhYmxlZCBzZWxlY3Rpb248L3A+XG4gICAgICAgIDwvRGlzYWJsZVNlbGVjdGlvbj5cbiAgICAgICAge0FycmF5LmZyb20oeyBsZW5ndGg6IDEwIH0pLm1hcCgoZWwsIGkpID0+IDxwIGtleT17aX0+e2l9IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLTwvcD4pfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBEcmFnZ2FibGVTY3JlZW47XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtcbiAgRm9ybUlucHV0TnVtYmVyXG59IGZyb20gJ2Rldi1ib3gtdWknO1xuXG5cbmNsYXNzIEZvcm1JbnB1dE51bWJlclNjcmVlbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBpbnB1dFZhbHVlOiAtNy4wOFxuICAgIH07XG4gICAgdGhpcy5oYW5kbGVDaGFuZ2UgPSB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaGFuZGxlQ2hhbmdlKGlucHV0VmFsdWUpIHtcbiAgICBjb25zdCB2YWx1ZVRvU2VuZEJhY2sgPSBOdW1iZXIoaW5wdXRWYWx1ZS50b1ByZWNpc2lvbigxNikpO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaW5wdXRWYWx1ZTogdmFsdWVUb1NlbmRCYWNrXG4gICAgfSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxGb3JtSW5wdXROdW1iZXJcbiAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS5pbnB1dFZhbHVlfVxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX1cbiAgICAgICAgICBkZWZhdWx0RGVjUG9pbnQ9XCIsXCJcbiAgICAgICAgICBkZWZhdWx0VGhvdXNhbmRzU2VwYXJhdG9yPVwiLlwiXG4gICAgICAgIC8+XG4gICAgICAgIDxGb3JtSW5wdXROdW1iZXJcbiAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS5pbnB1dFZhbHVlfVxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX1cbiAgICAgICAgLz5cbiAgICAgICAgPHA+e3RoaXMuc3RhdGUuaW5wdXRWYWx1ZX17J1xcdTAwQTAnfTwvcD5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRm9ybUlucHV0TnVtYmVyU2NyZWVuO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7XG4gIEZvcm1JbnB1dFxufSBmcm9tICdkZXYtYm94LXVpJztcblxuXG5jbGFzcyBGb3JtSW5wdXRTY3JlZW4gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgaW5wdXRWYWx1ZTogNlxuICAgIH07XG4gICAgdGhpcy5oYW5kbGVDaGFuZ2UgPSB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaGFuZGxlQ2hhbmdlKGlucHV0VmFsdWUpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGlucHV0VmFsdWVcbiAgICB9KTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPEZvcm1JbnB1dFxuICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLmlucHV0VmFsdWV9XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfVxuICAgICAgICAgIGhhc1dhcm5pbmc9e2ZhbHNlfVxuICAgICAgICAgIGhhc0Vycm9yPXtmYWxzZX1cbiAgICAgICAgICBkaXNhYmxlZD17ZmFsc2V9XG4gICAgICAgIC8+XG4gICAgICAgIDxwPnt0aGlzLnN0YXRlLmlucHV0VmFsdWV9eydcXHUwMEEwJ308L3A+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEZvcm1JbnB1dFNjcmVlbjtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1xuICBIZWxsb1xufSBmcm9tICdkZXYtYm94LXVpJztcblxuY2xhc3MgSGVsbG9TY3JlZW4gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIC8qIGVzbGludCBuby1jb25zb2xlOiAwICovXG4gICAgICAvLyBjb25zb2xlLmxvZygncmVuZGVyaW5nIEhlbGxvU2NyZWVuIGNvbXBvbmVudCcpO1xuICAgIH1cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPEhlbGxvIC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEhlbGxvU2NyZWVuO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7XG4gIExpc3Rcbn0gZnJvbSAnZGV2LWJveC11aSc7XG5cbmNsYXNzIExpc3RTY3JlZW4gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxMaXN0IGl0ZW1zPXtbJ3RocmVlJywgJ2ZvdXInXX0vPlxuICAgICAgICA8TGlzdCBpdGVtcz17Wyd0aHJlZScsICdmb3VyJ119Lz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTGlzdFNjcmVlbjtcbiIsImltcG9ydCBIZWxsb1NjcmVlbiBmcm9tICcuL0hlbGxvU2NyZWVuJztcbmltcG9ydCBMaXN0U2NyZWVuIGZyb20gJy4vTGlzdFNjcmVlbic7XG5pbXBvcnQgRm9ybUlucHV0U2NyZWVuIGZyb20gJy4vRm9ybUlucHV0U2NyZWVuJztcbmltcG9ydCBGb3JtSW5wdXROdW1iZXJTY3JlZW4gZnJvbSAnLi9Gb3JtSW5wdXROdW1iZXJTY3JlZW4nO1xuaW1wb3J0IERyYWdnYWJsZSBmcm9tICcuL0RyYWdnYWJsZVNjcmVlbic7XG5pbXBvcnQgREJVV2ViQ29tcG9uZW50RHVtbXlTY3JlZW4gZnJvbSAnLi9EQlVXZWJDb21wb25lbnREdW1teVNjcmVlbic7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgSGVsbG9TY3JlZW4sXG4gIExpc3RTY3JlZW4sXG4gIEZvcm1JbnB1dFNjcmVlbixcbiAgRm9ybUlucHV0TnVtYmVyU2NyZWVuLFxuICBEcmFnZ2FibGUsXG4gIERCVVdlYkNvbXBvbmVudER1bW15U2NyZWVuXG59O1xuIl19
