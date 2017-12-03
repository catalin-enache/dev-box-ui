require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDBUWebComponentBase;

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

    constructor() {
      super();
      const { template } = this.constructor;
      if (template) {
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(template.content.cloneNode(true));
      }
    }

    connectedCallback() {
      if (this.hasAttribute('componentInstanceStyle')) {
        const componentInstanceStyle = this.getAttribute('componentInstanceStyle');
        this.shadowRoot.querySelector('style').innerHTML = componentInstanceStyle;
      }
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
      if (customElements.get(componentName)) return;
      customElements.define(componentName, klass);
    };
  }

  cache.set(win, {
    DBUWebComponentBase,
    defineCommonStaticMethods
  });

  return cache.get(win);
}

},{}],2:[function(require,module,exports){
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
    b {
      text-shadow: var(--b-text-shadow, none);
    }
    </style>
    <b>I'm in shadow dom!</b>
    <slot></slot>
  `;

  class DBUWebComponentDummy extends DBUWebComponentBase {
    static get componentName() {
      return 'dbu-web-component-dummy';
    }

    static get template() {
      return template;
    }
  }

  defineCommonStaticMethods(DBUWebComponentDummy);

  cache.set(win, DBUWebComponentDummy);

  return cache.get(win);
}

},{"../DBUWebComponentBase/DBUWebComponentBase":1}],3:[function(require,module,exports){
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
    <b>I'm in shadow dom! (parent)</b>
    <dbu-web-component-dummy>aaa</dbu-web-component-dummy>
    <slot></slot>
  `;

  class DBUWebComponentDummyParent extends DBUWebComponentBase {
    static get componentName() {
      return 'dbu-web-component-dummy-parent';
    }

    static get template() {
      return template;
    }

    static registerSelf() {
      super.registerSelf();
      DBUWebComponentDummy.registerSelf();
    }
  }

  defineCommonStaticMethods(DBUWebComponentDummyParent);

  cache.set(win, DBUWebComponentDummyParent);

  return cache.get(win);
}

},{"../DBUWebComponentBase/DBUWebComponentBase":1,"../DBUWebComponentDummy/DBUWebComponentDummy":2}],"dev-box-ui-webcomponents":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDBUWebComponentDummyParent = exports.getDBUWebComponentDummy = undefined;

var _DBUWebComponentDummy = require('./DBUWebComponentDummy/DBUWebComponentDummy');

var _DBUWebComponentDummy2 = _interopRequireDefault(_DBUWebComponentDummy);

var _DBUWebComponentDummyParent = require('./DBUWebComponentDummyParent/DBUWebComponentDummyParent');

var _DBUWebComponentDummyParent2 = _interopRequireDefault(_DBUWebComponentDummyParent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.getDBUWebComponentDummy = _DBUWebComponentDummy2.default;
exports.getDBUWebComponentDummyParent = _DBUWebComponentDummyParent2.default;

},{"./DBUWebComponentDummy/DBUWebComponentDummy":2,"./DBUWebComponentDummyParent/DBUWebComponentDummyParent":3}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL3dlYmNvbXBvbmVudHMvREJVV2ViQ29tcG9uZW50QmFzZS9EQlVXZWJDb21wb25lbnRCYXNlLmpzIiwic3JjL2xpYi93ZWJjb21wb25lbnRzL0RCVVdlYkNvbXBvbmVudER1bW15L0RCVVdlYkNvbXBvbmVudER1bW15LmpzIiwic3JjL2xpYi93ZWJjb21wb25lbnRzL0RCVVdlYkNvbXBvbmVudER1bW15UGFyZW50L0RCVVdlYkNvbXBvbmVudER1bW15UGFyZW50LmpzIiwic3JjL2xpYi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O2tCQ0t3QixzQjs7QUFKeEIsUUFBUSxHQUFSLENBQVksa0NBQVo7O0FBRU8sTUFBTSx3QkFBUSxJQUFJLE9BQUosRUFBZDs7QUFFUSxTQUFTLHNCQUFULENBQWdDLEdBQWhDLEVBQXFDO0FBQ2xELE1BQUksTUFBTSxHQUFOLENBQVUsR0FBVixDQUFKLEVBQW9CO0FBQ2xCLFdBQU8sTUFBTSxHQUFOLENBQVUsR0FBVixDQUFQO0FBQ0Q7O0FBRUQsUUFBTSxFQUFFLFFBQUYsRUFBWSxXQUFaLEVBQXlCLGNBQXpCLEtBQTRDLEdBQWxEOztBQUVBLFFBQU0sV0FBVyxTQUFTLGFBQVQsQ0FBdUIsVUFBdkIsQ0FBakI7QUFDQSxXQUFTLFNBQVQsR0FBcUIsOEJBQXJCOztBQUVBLFFBQU0sbUJBQU4sU0FBa0MsV0FBbEMsQ0FBOEM7O0FBRTVDLGVBQVcsUUFBWCxHQUFzQjtBQUNwQixhQUFPLFFBQVA7QUFDRDs7QUFFRCxrQkFBYztBQUNaO0FBQ0EsWUFBTSxFQUFFLFFBQUYsS0FBZSxLQUFLLFdBQTFCO0FBQ0EsVUFBSSxRQUFKLEVBQWM7QUFDWixjQUFNLGFBQWEsS0FBSyxZQUFMLENBQWtCLEVBQUUsTUFBTSxNQUFSLEVBQWxCLENBQW5CO0FBQ0EsbUJBQVcsV0FBWCxDQUF1QixTQUFTLE9BQVQsQ0FBaUIsU0FB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QTZEO0FBQzNELGVBQVcsYUFBWCxHQUEyQjtBQUN6QixhQUFPLGdDQUFQO0FBQ0Q7O0FBRUQsZUFBVyxRQUFYLEdBQXNCO0FBQ3BCLGFBQU8sUUFBUDtBQUNEOztBQUVELFdBQU8sWUFBUCxHQUFzQjtBQUNwQixZQUFNLFlBQU47QUFDQSwyQkFBcUIsWUFBckI7QUFDRDtBQVowRDs7QUFlN0QsNEJBQTBCLDBCQUExQjs7QUFFQSxRQUFNLEdBQU4sQ0FBVSxHQUFWLEVBQWUsMEJBQWY7O0FBRUEsU0FBTyxNQUFNLEdBQU4sQ0FBVSxHQUFWLENBQVA7QUFFRDs7Ozs7Ozs7OztBQzdDRDs7OztBQUNBOzs7Ozs7UUFHRSx1QjtRQUNBLDZCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxuY29uc29sZS5sb2coJ2ltcG9ydGluZyBnZXREQlVXZWJDb21wb25lbnRCYXNlJyk7XG5cbmV4cG9ydCBjb25zdCBjYWNoZSA9IG5ldyBXZWFrTWFwKCk7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldERCVVdlYkNvbXBvbmVudEJhc2Uod2luKSB7XG4gIGlmIChjYWNoZS5oYXMod2luKSkge1xuICAgIHJldHVybiBjYWNoZS5nZXQod2luKTtcbiAgfVxuXG4gIGNvbnN0IHsgZG9jdW1lbnQsIEhUTUxFbGVtZW50LCBjdXN0b21FbGVtZW50cyB9ID0gd2luO1xuXG4gIGNvbnN0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgdGVtcGxhdGUuaW5uZXJIVE1MID0gJzxzdHlsZT48L3N0eWxlPjxzbG90Pjwvc2xvdD4nO1xuXG4gIGNsYXNzIERCVVdlYkNvbXBvbmVudEJhc2UgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG5cbiAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlKCkge1xuICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIGNvbnN0IHsgdGVtcGxhdGUgfSA9IHRoaXMuY29uc3RydWN0b3I7XG4gICAgICBpZiAodGVtcGxhdGUpIHtcbiAgICAgICAgY29uc3Qgc2hhZG93Um9vdCA9IHRoaXMuYXR0YWNoU2hhZG93KHsgbW9kZTogJ29wZW4nIH0pO1xuICAgICAgICBzaGFkb3dSb290LmFwcGVuZENoaWxkKHRlbXBsYXRlLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgIGlmICh0aGlzLmhhc0F0dHJpYnV0ZSgnY29tcG9uZW50SW5zdGFuY2VTdHlsZScpKSB7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudEluc3RhbmNlU3R5bGUgPSB0aGlzLmdldEF0dHJpYnV0ZSgnY29tcG9uZW50SW5zdGFuY2VTdHlsZScpO1xuICAgICAgICB0aGlzLnNoYWRvd1Jvb3QucXVlcnlTZWxlY3Rvcignc3R5bGUnKS5pbm5lckhUTUwgPSBjb21wb25lbnRJbnN0YW5jZVN0eWxlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMoa2xhc3MpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoa2xhc3MsICdjb21wb25lbnRTdHlsZScsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgcmV0dXJuIGtsYXNzLnRlbXBsYXRlLmNvbnRlbnQucXVlcnlTZWxlY3Rvcignc3R5bGUnKS5pbm5lckhUTUw7XG4gICAgICB9LFxuICAgICAgc2V0KHZhbHVlKSB7XG4gICAgICAgIGtsYXNzLnRlbXBsYXRlLmNvbnRlbnQucXVlcnlTZWxlY3Rvcignc3R5bGUnKS5pbm5lckhUTUwgPSB2YWx1ZTtcbiAgICAgIH0sXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAga2xhc3MucmVnaXN0ZXJTZWxmID0gKCkgPT4ge1xuICAgICAgY29uc3QgY29tcG9uZW50TmFtZSA9IGtsYXNzLmNvbXBvbmVudE5hbWU7XG4gICAgICBpZiAoY3VzdG9tRWxlbWVudHMuZ2V0KGNvbXBvbmVudE5hbWUpKSByZXR1cm47XG4gICAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUoY29tcG9uZW50TmFtZSwga2xhc3MpO1xuICAgIH07XG4gIH1cblxuICBjYWNoZS5zZXQod2luLCB7XG4gICAgREJVV2ViQ29tcG9uZW50QmFzZSxcbiAgICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzXG4gIH0pO1xuXG4gIHJldHVybiBjYWNoZS5nZXQod2luKTtcblxufVxuIiwiXG5pbXBvcnQgZ2V0REJVV2ViQ29tcG9uZW50QmFzZSBmcm9tICcuLi9EQlVXZWJDb21wb25lbnRCYXNlL0RCVVdlYkNvbXBvbmVudEJhc2UnO1xuXG5jb25zb2xlLmxvZygnaW1wb3J0aW5nIGdldERCVVdlYkNvbXBvbmVudCcpO1xuXG5leHBvcnQgY29uc3QgY2FjaGUgPSBuZXcgV2Vha01hcCgpO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXREQlVXZWJDb21wb25lbnREdW1teSh3aW4pIHtcbiAgaWYgKGNhY2hlLmhhcyh3aW4pKSByZXR1cm4gY2FjaGUuZ2V0KHdpbik7XG5cbiAgY29uc3QgeyBEQlVXZWJDb21wb25lbnRCYXNlLCBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzIH0gPSBnZXREQlVXZWJDb21wb25lbnRCYXNlKHdpbik7XG4gIGNvbnN0IHsgZG9jdW1lbnQgfSA9IHdpbjtcbiAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBgXG4gICAgPHN0eWxlPlxuICAgIDpob3N0IHtcbiAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgY29sb3I6IG1hcm9vbjtcbiAgICB9XG4gICAgYiB7XG4gICAgICB0ZXh0LXNoYWRvdzogdmFyKC0tYi10ZXh0LXNoYWRvdywgbm9uZSk7XG4gICAgfVxuICAgIDwvc3R5bGU+XG4gICAgPGI+SSdtIGluIHNoYWRvdyBkb20hPC9iPlxuICAgIDxzbG90Pjwvc2xvdD5cbiAgYDtcblxuICBjbGFzcyBEQlVXZWJDb21wb25lbnREdW1teSBleHRlbmRzIERCVVdlYkNvbXBvbmVudEJhc2Uge1xuICAgIHN0YXRpYyBnZXQgY29tcG9uZW50TmFtZSgpIHtcbiAgICAgIHJldHVybiAnZGJ1LXdlYi1jb21wb25lbnQtZHVtbXknO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXQgdGVtcGxhdGUoKSB7XG4gICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgfVxuICB9XG5cbiAgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyhEQlVXZWJDb21wb25lbnREdW1teSk7XG5cbiAgY2FjaGUuc2V0KHdpbiwgREJVV2ViQ29tcG9uZW50RHVtbXkpO1xuXG4gIHJldHVybiBjYWNoZS5nZXQod2luKTtcbn1cblxuIiwiXG5cbmltcG9ydCBnZXREQlVXZWJDb21wb25lbnRCYXNlIGZyb20gJy4uL0RCVVdlYkNvbXBvbmVudEJhc2UvREJVV2ViQ29tcG9uZW50QmFzZSc7XG5pbXBvcnQgZ2V0REJVV2ViQ29tcG9uZW50RHVtbXkgZnJvbSAnLi4vREJVV2ViQ29tcG9uZW50RHVtbXkvREJVV2ViQ29tcG9uZW50RHVtbXknO1xuXG5leHBvcnQgY29uc3QgY2FjaGUgPSBuZXcgV2Vha01hcCgpO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXREQlVXZWJDb21wb25lbnREdW1teVBhcmVudCh3aW4pIHtcbiAgaWYgKGNhY2hlLmhhcyh3aW4pKSByZXR1cm4gY2FjaGUuZ2V0KHdpbik7XG5cbiAgY29uc3QgeyBEQlVXZWJDb21wb25lbnRCYXNlLCBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzIH0gPSBnZXREQlVXZWJDb21wb25lbnRCYXNlKHdpbik7XG4gIGNvbnN0IERCVVdlYkNvbXBvbmVudER1bW15ID0gZ2V0REJVV2ViQ29tcG9uZW50RHVtbXkod2luKTtcblxuICBjb25zdCB7IGRvY3VtZW50IH0gPSB3aW47XG5cbiAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBgXG4gICAgPHN0eWxlPlxuICAgIDpob3N0IHtkaXNwbGF5OiBibG9jazt9XG4gICAgPC9zdHlsZT5cbiAgICA8Yj5JJ20gaW4gc2hhZG93IGRvbSEgKHBhcmVudCk8L2I+XG4gICAgPGRidS13ZWItY29tcG9uZW50LWR1bW15PmFhYTwvZGJ1LXdlYi1jb21wb25lbnQtZHVtbXk+XG4gICAgPHNsb3Q+PC9zbG90PlxuICBgO1xuXG4gIGNsYXNzIERCVVdlYkNvbXBvbmVudER1bW15UGFyZW50IGV4dGVuZHMgREJVV2ViQ29tcG9uZW50QmFzZSB7XG4gICAgc3RhdGljIGdldCBjb21wb25lbnROYW1lKCkge1xuICAgICAgcmV0dXJuICdkYnUtd2ViLWNvbXBvbmVudC1kdW1teS1wYXJlbnQnO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXQgdGVtcGxhdGUoKSB7XG4gICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgfVxuXG4gICAgc3RhdGljIHJlZ2lzdGVyU2VsZigpIHtcbiAgICAgIHN1cGVyLnJlZ2lzdGVyU2VsZigpO1xuICAgICAgREJVV2ViQ29tcG9uZW50RHVtbXkucmVnaXN0ZXJTZWxmKCk7XG4gICAgfVxuICB9XG5cbiAgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyhEQlVXZWJDb21wb25lbnREdW1teVBhcmVudCk7XG5cbiAgY2FjaGUuc2V0KHdpbiwgREJVV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQpO1xuXG4gIHJldHVybiBjYWNoZS5nZXQod2luKTtcblxufVxuXG4iLCJcbmltcG9ydCBnZXREQlVXZWJDb21wb25lbnREdW1teSBmcm9tICcuL0RCVVdlYkNvbXBvbmVudER1bW15L0RCVVdlYkNvbXBvbmVudER1bW15JztcbmltcG9ydCBnZXREQlVXZWJDb21wb25lbnREdW1teVBhcmVudCBmcm9tICcuL0RCVVdlYkNvbXBvbmVudER1bW15UGFyZW50L0RCVVdlYkNvbXBvbmVudER1bW15UGFyZW50JztcblxuZXhwb3J0IHtcbiAgZ2V0REJVV2ViQ29tcG9uZW50RHVtbXksXG4gIGdldERCVVdlYkNvbXBvbmVudER1bW15UGFyZW50XG59O1xuIl19
