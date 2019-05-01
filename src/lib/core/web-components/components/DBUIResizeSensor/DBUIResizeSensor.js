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

const reset = (self, size) => {
  const expand = getElement(self, 'expand');
  const expandChild = getElement(self, 'expand-child');
  const shrink = getElement(self, 'shrink');
  const width = self.offsetWidth;
  const height = self.offsetHeight;

  const offset = 1; // arbitrary value

  // shrinkChild is always 200%
  expandChild.style.width = `${width + offset}px`;
  expandChild.style.height = `${height + offset}px`;
  expand.scrollLeft = width + offset;
  expand.scrollTop = height + offset;
  shrink.scrollLeft = width + offset;
  shrink.scrollTop = height + offset;
  self._lastWidth = size.width;
  self._lastHeight = size.height;
};

/*
TODO: add Behavior Extras
*/

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
        const size = this.dimensionsAndCoordinates;
        const dirty = size.width !== this._lastWidth || size.height !== this._lastHeight;

        if (dirty) {
          this.dispatchDbuiEvent('dbui-event-resize');
        }
        reset(this, size);
      }

      onConnectedCallback() {
        super.onConnectedCallback();
        setTimeout(() => {
          reset(this, this.dimensionsAndCoordinates);
        }, 0);
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

