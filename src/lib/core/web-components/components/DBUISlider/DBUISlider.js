
import getDBUIWebComponentCore from '../DBUIWebComponentCore/DBUIWebComponentCore';
import ensureSingleRegistration from '../../../internals/ensureSingleRegistration';
import getDBUIDraggable from '../DBUIDraggable/DBUIDraggable';
import { trunc, getStep } from '../../../utils/math';
import { getWheelDelta } from '../../../utils/mouse';

const PERCENT_AMOUNT_INCREASE = 0.01;
const DRAGGABLE_ID = 'draggable';
const registrationName = 'dbui-slider';

/*
TODO:
 - should move with arrow keys and scroll, needs some speed
 - should be suitable for scrolling too (auto-adjusts inner scroll dimension)
 - should be used by next component scrollable
 - should be focusable somehow when used as a scroll either
 - should receive a range and on slide should emit an event reporting the value
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
    --dbui-slider-draggable-font-size: 8px;
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

const getValueDisplayNode = (self) => {
  if (self._valueDisplayNode) {
    return self._valueDisplayNode;
  }
  // self._valueDisplayNode = getDraggable(self).shadowRoot.querySelector('slot').assignedNodes()[0];
  // self._valueDisplayNode = getDraggable(self).querySelector('#value-display');
  self._valueDisplayNode = self.shadowRoot.querySelector('#value-display');
  return self._valueDisplayNode;
};

const updateDisplayedValue = (self, value) => {
  self.showValue && (getValueDisplayNode(self).innerText = value);
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

const adjustPosition = (self) => {
  if (self.isSliding) return;
  const draggable = getDraggable(self);
  const percent = self.percent;
  const targetTranslate = self.vertical ? 'targetTranslateY' : 'targetTranslateX';
  const targetTranslateOther = self.vertical ? 'targetTranslateX' : 'targetTranslateY';
  draggable[targetTranslate] = percentToTranslate(self, percent);
  draggable[targetTranslateOther] = 0;
  updateDisplayedValue(self, percent);
};

const adjustPercent = (self) => {
  const { steps, step, percent: currentPercent } = self;
  const percent = !steps ? currentPercent : step / (steps - 1);
  self.percent = percent;
};

const adjustPercentFromPointerCoords = (self, pointerCoords) => {
  const { clientX, clientY } = pointerCoords;
  const totalLength = getAvailableLength(self);
  const wrapperMiddle = getWrapperMiddle(self);
  const dimension = self.vertical ? 'y' : 'x';
  const wrapperMiddlePosition = wrapperMiddle.getBoundingClientRect()[dimension];
  const pointerPosition = self.vertical ? clientY : clientX;
  const distance = pointerPosition - wrapperMiddlePosition;
  const percent = trunc(2)(distance / totalLength);
  const safePercent = Math.max(0, Math.min(1, percent));// getStep
  const { value: finalPercent } = getStep(0, 1, safePercent, self.steps);
  self.percent = finalPercent;
};

const adjustRatio = (self) => {
  const draggable = getDraggable(self);
  if (!self.hasAttribute('ratio')) {
    draggable.style.width = null;
    draggable.style.height = null;
    return;
  }
  const ratio = self.ratio;
  const availableLength = getAvailableLength(self);
  const dimension = self.vertical ? 'height' : 'width';
  const otherDimension = self.vertical ? 'width' : 'height';
  draggable.style[dimension] = ratio * availableLength;
  draggable.style[otherDimension] = '100%';
};

const forwardSteps = (self) => {
  const steps = self.vertical ? 'constraintStepsY' : 'constraintStepsX';
  getDraggable(self)[steps] = self.steps;
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
          
          #value-display-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
          }
          
          #value-display {
            display: inline;
            font-size: var(--dbui-slider-draggable-font-size);
          }
          
          </style>
          <div id="wrapper-outer">
            <div id="wrapper-middle">
              <div id="inner"></div>
              <dbui-draggable
                id="${DRAGGABLE_ID}"
                constraint-type="boundingClientRectOf"
                constraint-selector="parent"
                constraint-steps-x="0"
                constraint-steps-y="0"
              ><div id="value-display-wrapper"><div id="value-display"></div></div></dbui-draggable>
            </div>
          </div>
        `;
      }

      static get dependencies() {
        return [...super.dependencies, DBUIDraggable];
      }

      static get propertiesToUpgrade() {
        return [...super.propertiesToUpgrade, 'steps', 'step', 'percent', 'vertical', 'ratio'];
      }

      static get observedAttributes() {
        return [...super.observedAttributes, 'steps', 'step', 'percent', 'vertical', 'ratio'];
      }

      constructor() {
        super();
        this._wrapperMiddle = null;
        this._draggable = null;
        this._valueDisplayNode = null;
        this._isSliding = false;
        this._onDraggableMove = this._onDraggableMove.bind(this);
        this._onDraggableDragStart = this._onDraggableDragStart.bind(this);
        this._onDraggableDragEnd = this._onDraggableDragEnd.bind(this);
        this._onMouseEnter = this._onMouseEnter.bind(this);
        this._onMouseLeave = this._onMouseLeave.bind(this);
        this._onWheel = this._onWheel.bind(this);
        this._onSliderMouseDown = this._onSliderMouseDown.bind(this);
        this._onSliderTouchStart = this._onSliderTouchStart.bind(this);
      }

      get isSliding() {
        return this._isSliding;
      }

      get showValue() {
        return this.getAttribute('show-value') !== null;
      }

      set showValue(value) {
        const newValue = !!value;
        newValue && this.setAttribute('show-value', '');
        !newValue && this.removeAttribute('show-value');
      }

      get steps() {
        return +this.getAttribute('steps') || 0;
      }

      set steps(value) {
        const newValue = (Math.round(+value) || 0).toString();
        this.setAttribute('steps', newValue);
      }

      get step() {
        return +this.getAttribute('step') || 0;
      }

      set step(value) {
        const newValue = (Math.round(+value) || 0).toString();
        this.setAttribute('step', newValue);
      }

      get percent() {
        return +this.getAttribute('percent') || 0;
      }

      set percent(value) {
        const newValue = trunc(2)(+value);
        this.setAttribute('percent', newValue);
      }

      get ratio() {
        return +this.getAttribute('ratio') || 0;
      }

      set ratio(value) {
        const newValue = trunc(2)(+value);
        this.setAttribute('ratio', newValue);
      }

      get vertical() {
        return this.getAttribute('vertical') !== null;
      }

      set vertical(value) {
        const newValue = !!value;
        newValue && this.setAttribute('vertical', '');
        !newValue && this.removeAttribute('vertical');
      }

      onLocaleDirChanged(newDir, oldDir) {
        // acts like an init
        super.onLocaleDirChanged(newDir, oldDir);
        adjustRatio(this);
        if (this.steps) {
          adjustPercent(this);
        }
        forwardSteps(this);
        adjustPosition(this);
      }

      _onDraggableMove(evt) {
        const {
          targetPercentX, targetPercentY
        } = evt.detail;
        const percent = this.vertical ? targetPercentY : targetPercentX;
        const localePercent = getLocalePercent(this, percent);
        updateDisplayedValue(this, localePercent);
        this.percent = localePercent;
      }

      _onDraggableDragStart() {
        this._isSliding = true;
      }

      _onDraggableDragEnd() {
        this._isSliding = false;
      }

      _onMouseEnter() {
        this.addEventListener('wheel', this._onWheel);
      }

      _onMouseLeave() {
        this.removeEventListener('wheel', this._onWheel);
      }

      _onWheel(evt) {
        evt.preventDefault();
        const delta = getWheelDelta(evt, this.steps ? false : undefined);
        if (this.steps) {
          const nextStep = this.step + delta;
          const newStep = Math.max(0, Math.min(this.steps - 1, nextStep));
          this.step = newStep;
          return;
        }
        const nextPercent = this.percent + (delta * PERCENT_AMOUNT_INCREASE);
        const newPercent = Math.max(0, Math.min(1, nextPercent));
        this.percent = newPercent;
      }

      _onSliderMouseDown(evt) {
        if (evt.which === 3) return;
        evt.preventDefault();
        evt.stopPropagation();
        const { clientX, clientY } = evt;
        adjustPercentFromPointerCoords(this, {
          clientX: Math.round(clientX),
          clientY: Math.round(clientY),
        });
      }

      _onSliderTouchStart(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        const wrapperMiddle = getWrapperMiddle(this);
        const touch = [...evt.touches].find((t) => t.target === wrapperMiddle);
        const { clientX, clientY } = touch;
        adjustPercentFromPointerCoords(this, {
          clientX: Math.round(clientX),
          clientY: Math.round(clientY),
        });
      }

      onConnectedCallback() {
        super.onConnectedCallback();
        getDraggable(this).addEventListener('dragmove', this._onDraggableMove);
        getDraggable(this).addEventListener('dragstart', this._onDraggableDragStart);
        getDraggable(this).addEventListener('dragend', this._onDraggableDragEnd);
        getWrapperMiddle(this).addEventListener('mousedown', this._onSliderMouseDown);
        getWrapperMiddle(this).addEventListener('touchstart', this._onSliderTouchStart);
        this.addEventListener('mouseenter', this._onMouseEnter);
        this.addEventListener('mouseleave', this._onMouseLeave);
      }

      onDisconnectedCallback() {
        super.onDisconnectedCallback();
        getDraggable(this).removeEventListener('dragmove', this._onDraggableMove);
        getDraggable(this).removeEventListener('dragstart', this._onDraggableDragStart);
        getDraggable(this).removeEventListener('dragend', this._onDraggableDragEnd);
        getWrapperMiddle(this).removeEventListener('mousedown', this._onSliderMouseDown);
        getWrapperMiddle(this).removeEventListener('touchstart', this._onSliderTouchStart);
        this.removeEventListener('mouseenter', this._onMouseEnter);
        this.removeEventListener('mouseleave', this._onMouseLeave);
        this.removeEventListener('wheel', this._onWheel);
        this._wrapperMiddle = null;
        this._draggable = null;
      }

      onAttributeChangedCallback(name, oldValue, newValue) {
        super.onAttributeChangedCallback(name, oldValue, newValue);
        if (!this.isMounted) return;
        switch (name) {
          case 'ratio': {
            adjustRatio(this);
            adjustPosition(this);
            break;
          }
          case 'percent': {
            adjustPosition(this);
            break;
          }
          case 'vertical': {
            forwardSteps(this);
            adjustRatio(this);
            adjustPosition(this);
            break;
          }
          case 'steps':
          case 'step': {
            // forward steps
            forwardSteps(this);
            adjustPercent(this);
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

