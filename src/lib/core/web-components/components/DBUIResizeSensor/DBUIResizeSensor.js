import getDBUIWebComponentCore from '../DBUIWebComponentCore/DBUIWebComponentCore';
import ensureSingleRegistration from '../../../internals/ensureSingleRegistration';

// Inspired from:
// http://www.backalleycoder.com/2013/03/18/cross-browser-event-based-element-resize-detection/
// https://github.com/sdecima/javascript-detect-element-resize/blob/master/detect-element-resize.js
// https://github.com/marcj/css-element-queries/blob/master/src/ResizeSensor.js
// https://github.com/flowkey/resize-sensor/blob/master/ResizeSensor.js

const registrationName = 'dbui-resize-sensor';

const getElement = (self, id) => {
  if (self[`_${id}`]) {
    return self[`_${id}`];
  }
  self[`_${id}`] =
    self.shadowRoot.querySelector(`#${id}`);
  return self[`_${id}`];
};

const getElementSize = (element) => {
  return {
    width: element.offsetWidth,
    height: element.offsetHeight
  };

  // const rect = element.getBoundingClientRect();
  // return {
  //   width: Math.round(rect.width),
  //   height: Math.round(rect.height)
  // };
};

const reset = (self) => {
  const expand = getElement(self, 'expand');
  const expandChild = getElement(self, 'expand-child');
  const shrink = getElement(self, 'shrink');
  const size = getElementSize(self);
  const width = self.offsetWidth;
  const height = self.offsetHeight;

  expandChild.style.width = `${width + 10}px`;
  expandChild.style.height = `${height + 10}px`;
  expand.scrollLeft = width + 10;
  expand.scrollTop = height + 10;
  shrink.scrollLeft = width + 10;
  shrink.scrollTop = height + 10;
  self._lastWidth = size.width;
  self._lastHeight = size.height;
};

const dispatchResizeEvent = (self) => {
  const win = self.ownerDocument.defaultView;
  self.dispatchEvent(new win.CustomEvent('resize'));
};

export default function getDBUIResizeSensor(win) {
  return ensureSingleRegistration(win, registrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = getDBUIWebComponentCore(win);

    class DBUIResizeSensor extends DBUIWebComponentBase {

      static get registrationName() {
        return registrationName;
      }

      static get templateInnerHTML() {
        return `
          <style>
          :host {
            /* all: initial; */
            display: inline-block;
            position: relative;
          }
          
          #expand, #shrink {
            pointer-events: none;
            display: block;
            position: absolute;
            left: 0px; top: 0px; right: 0; bottom: 0;
            overflow: hidden;
            z-index: -1;
            visibility: hidden;
          }
    
          #expand-child {
            position: absolute; left: 0; top: 0; transition: 0s;
          }
    
          #shrink-child {
            position: absolute; left: 0; top: 0; transition: 0s;
            width: 200%; height: 200%;
          }
          </style>
          
          <div id="expand" dir="ltr">
            <div id="expand-child" dir="ltr"></div>
          </div>
          <div id="shrink" dir="ltr">
            <div id="shrink-child" dir="ltr"></div>
          </div>
          <slot></slot>
        `;
      }

      constructor() {
        super();
        this._onShrinkScroll = this._onShrinkScroll.bind(this);
        this._onExpandScroll = this._onExpandScroll.bind(this);
      }

      _onShrinkScroll() {
        this._onScroll();
      }

      _onExpandScroll() {
        this._onScroll();
      }

      _onScroll() {
        const size = getElementSize(this);
        const dirty = size.width !== this._lastWidth || size.height !== this._lastHeight;
        if (dirty) {
          dispatchResizeEvent(this);
        }
        reset(this);
      }

      onConnectedCallback() {
        super.onConnectedCallback();
        reset(this);
        getElement(this, 'expand').addEventListener('scroll', this._onExpandScroll);
        getElement(this, 'shrink').addEventListener('scroll', this._onShrinkScroll);
      }

      onDisconnectedCallback() {
        super.onDisconnectedCallback();
        getElement(this, 'expand').removeEventListener('scroll', this._onExpandScroll);
        getElement(this, 'shrink').removeEventListener('scroll', this._onShrinkScroll);
      }

    }

    return Registerable(
      defineCommonStaticMethods(
        DBUIResizeSensor
      )
    );
  });
}

getDBUIResizeSensor.registrationName = registrationName;

