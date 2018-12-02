
import getDBUIWebComponentCore from '../DBUIWebComponentCore/DBUIWebComponentCore';
import ensureSingleRegistration from '../../../internals/ensureSingleRegistration';
import getDBUIDraggable from '../DBUIDraggable/DBUIDraggable';

const DRAGGABLE_ID = 'draggable';
const registrationName = 'dbui-slider';

/*
TODO:
 - should move with arrow keys and scroll, needs some speed
 - should autodetect is is horizontal or vertical depending on width/height ratio
 - should use some global css dimensions and colors
 - should be suitable for scrolling too (auto-adjusts inner scroll dimension)
 - should be configurable from outside by steps or percentage
 - should be dir aware
 - should be used by next component scrollable
 - should be focusable somehow when used as a scroll either
 - should receive a ratio attribute
 - should slide on clicking the bar
 - percent value should fallback on steps if given
*/

const DBUISliderCssVars = `
  :root {
    --dbui-slider-outer-padding: 5px;
    --dbui-slider-outer-color: rgba(255, 0, 0, 0.2);
    --dbui-slider-outer-border-radius: 0px;

    --dbui-slider-middle-color: rgba(0, 255, 0, 0.2);
    --dbui-slider-middle-border-radius: 0px;

    --dbui-slider-inner-size: 1px;
    --dbui-slider-inner-color: rgba(0, 0, 255, 0.2);
    
    --dbui-slider-draggable-size: 30px;
    --dbui-slider-draggable-color: rgba(0, 0, 0, 0.2);
    --dbui-slider-draggable-border-radius: 0px;
  }
  `;

function defineComponentCSS(win) {
  const { document } = win;
  const commonCSSVarsStyleNode = document.querySelector('[dbui-common-css-vars]');
  commonCSSVarsStyleNode.innerHTML += DBUISliderCssVars;
}


const getDraggable = (self) => {
  if (self._draggable) {
    return self._draggable;
  }
  self._draggable = self.shadowRoot.querySelector(`#${DRAGGABLE_ID}`);
  return self._draggable;
};

const getWrapperMiddle = (self) => {
  if (self._wrapperMiddle) {
    return self._wrapperMiddle;
  }
  self._wrapperMiddle = self.shadowRoot.querySelector('#wrapper-middle');
  return self._wrapperMiddle;
};

const getAvailableLength = (self) => {
  const wrapperMiddle = getWrapperMiddle(self);
  const dimension = self.vertical ? 'height' : 'width';
  const availableLength = wrapperMiddle.getBoundingClientRect()[dimension];
  return availableLength;
};

const getDraggableLength = (self) => {
  const draggable = getDraggable(self);
  const dimension = self.vertical ? 'height' : 'width';
  const draggableLength = draggable.getBoundingClientRect()[dimension];
  return draggableLength;
};

const isDbuiRTL = (self) => {
  return self.getAttribute('dbui-dir') === 'rtl';
};

const getLocalePercent = (self, percent) => {
  return +(isDbuiRTL(self) ? 1 - percent : percent).toFixed(2);
};

const percentToTranslate = (self, percent) => {
  const availableLength = getAvailableLength(self);
  const draggableLength = getDraggableLength(self);
  const localePercent = getLocalePercent(self, percent);
  return (availableLength - draggableLength) * localePercent;
};

export default function getDBUISlider(win) {
  return ensureSingleRegistration(win, registrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = getDBUIWebComponentCore(win);

    defineComponentCSS(win);

    const DBUIDraggable = getDBUIDraggable(win);

    class DBUISlider extends DBUIWebComponentBase {

      static get registrationName() {
        return registrationName;
      }

      static get templateInnerHTML() {
        return `
          <style>
          :host {
            /*all: initial;*/
            cursor: pointer;
            touch-action: none;
            display: inline-block;
            width: 100%;
            height: 100%;
          }
          
          :host([dbui-dir=ltr]) {
            /* pass */
          }
          
          :host([dbui-dir=rtl]) {
            /* pass */
          }
          
          #wrapper-outer {
            width: 100%;
            height: 100%;
            padding: var(--dbui-slider-outer-padding);
            box-sizing: border-box;
            background-color: var(--dbui-slider-outer-color);
            border-radius: var(--dbui-slider-outer-border-radius);
          }
          
          #wrapper-middle {
            position: relative;
            width: 100%;
            height: 100%;
            background-color: var(--dbui-slider-middle-color);
            border-radius: var(--dbui-slider-middle-border-radius);
          }
          
          #inner {
            position: absolute;
            background-color: var(--dbui-slider-inner-color);
          }
          
          :host(:not([vertical])) #inner {
            top: 50%;
            bottom: auto;
            left: calc(0.5 * var(--dbui-slider-draggable-size));
            right: calc(0.5 * var(--dbui-slider-draggable-size));
            transform: translate(0px, -50%);
            width: auto;
            height: var(--dbui-slider-inner-size);
          }
          
          :host([vertical]) #inner {
            top: calc(0.5 * var(--dbui-slider-draggable-size));
            bottom: calc(0.5 * var(--dbui-slider-draggable-size));
            left: 50%;
            right: auto;
            transform: translate(-50%, 0px);
            width: var(--dbui-slider-inner-size);
            height: auto;
          }
          
          #${DRAGGABLE_ID} {
            position: absolute;
            left: 0px; /* for both ltr and rtl */
            border-radius: var(--dbui-slider-draggable-border-radius);
            background-color: var(--dbui-slider-draggable-color);
          }
          
          :host(:not([vertical])) #${DRAGGABLE_ID} {
            width: var(--dbui-slider-draggable-size);
            height: 100%;
          }
          
          :host([vertical]) #${DRAGGABLE_ID} {
            width: 100%;
            height: var(--dbui-slider-draggable-size);
          }
          
          </style>
          <div id="wrapper-outer">
            <div id="wrapper-middle">
              <div id="inner"></div>
              <dbui-draggable
                id="${DRAGGABLE_ID}"
                constraint='boundingClientRectOf({ "selector": "parent", "stepsX": 0, "stepsY": 0 })'
              ></dbui-draggable>
            </div>
          </div>
        `;
      }

      static get dependencies() {
        return [...super.dependencies, DBUIDraggable];
      }

      static get propertiesToUpgrade() {
        return [...super.propertiesToUpgrade, 'steps', 'step', 'percent', 'vertical'];
      }

      static get observedAttributes() {
        return [...super.observedAttributes, 'steps', 'step', 'percent', 'vertical'];
      }

      constructor() {
        super();
        this._wrapperMiddle = null;
        this._draggable = null;
        this._onDraggableMove = this._onDraggableMove.bind(this);
      }

      get steps() {
        return Number(this.getAttribute('steps')) || 0;
      }

      set steps(value) {
        const newValue = (Number(value) || 0).toString();
        this.setAttribute('steps', newValue);
      }

      get step() {
        return Number(this.getAttribute('step')) || 0;
      }

      set step(value) {
        const newValue = (Number(value) || 0).toString();
        this.setAttribute('step', newValue);
      }

      get percent() {
        return Number(this.getAttribute('percent')) || 0;
      }

      set percent(value) {
        const newValue = (Number(value) || 0).toString();
        this.setAttribute('percent', newValue);
      }

      get vertical() {
        return this.getAttribute('vertical') !== null;
      }

      set vertical(value) {
        const newValue = !!value;
        newValue && this.setAttribute('vertical', '');
        !newValue && this.removeAttribute('vertical');
      }

      _adjustPosition() {
        const draggable = getDraggable(this);
        const percent = this.percent;
        const targetTranslate = this.vertical ? 'targetTranslateY' : 'targetTranslateX';
        const targetTranslateOther = this.vertical ? 'targetTranslateX' : 'targetTranslateY';
        draggable[targetTranslate] = percentToTranslate(this, percent);
        draggable[targetTranslateOther] = 0;
        draggable.innerHTML = `<div>${percent}</div>`;
      }

      onLocaleDirChanged(newDir, oldDir) {
        super.onLocaleDirChanged(newDir, oldDir);
        this._adjustPosition();
      }

      _onDraggableMove(evt) {
        const {
          percentX, percentY
        } = evt.detail;
        const percent = this.vertical ? percentY : percentX;
        const localePercent = getLocalePercent(this, percent);
        evt.target.innerHTML = `<div>${localePercent}</div>`;
        this.percent = localePercent;
      }

      onConnectedCallback() {
        super.onConnectedCallback();
        getDraggable(this).addEventListener('translate', this._onDraggableMove);
      }

      onDisconnectedCallback() {
        super.onDisconnectedCallback();
        getDraggable(this).removeEventListener('translate', this._onDraggableMove);
        this._wrapperMiddle = null;
        this._draggable = null;
      }

      onAttributeChangedCallback(name, oldValue, newValue) {
        super.onAttributeChangedCallback(name, oldValue, newValue);
        switch (name) {
          case 'percent': {
            if (!this.isMounted) break;
            this._adjustPosition();
            break;
          }
          case 'vertical': {
            if (!this.isMounted) break;
            this._adjustPosition();
            break;
          }
          default:
            // pass
        }
      }

    }

    return Registerable(
      defineCommonStaticMethods(
        DBUISlider
      )
    );
  });
}

getDBUISlider.registrationName = registrationName;

