
import getDBUIWebComponentCore from '../DBUIWebComponentCore/DBUIWebComponentCore';
import ensureSingleRegistration from '../../../internals/ensureSingleRegistration';
import getDBUIDraggable from '../DBUIDraggable/DBUIDraggable';
import getDBUIResizeSensor from '../DBUIResizeSensor/DBUIResizeSensor';
import { trunc, getStep } from '../../../utils/math';
import { getWheelDelta } from '../../../utils/mouse';

const PERCENT_AMOUNT_INCREASE = 0.01;
const DEFAULT_PERCENT_PRECISION = 4;
const DRAGGABLE_ID = 'draggable';
const registrationName = 'dbui-slider';
const DELTA_MULTIPLIER = {
  ctrlAlt: 20,
  ctrl: 5,
  alt: 10
};
const KEYS_TO_DELTA_MAP = {
  38: 1, 39: 1, 37: -1, 40: -1
};

/*
Behavior extras:
 - changing step will adjust percent but changing percent will NOT adjust step
 - repaints itself
    - when locale dir changes
    - when any of step/steps/percent/ratio/vertical attributes change
 - captures arrow keys if capture-arrow-keys attr is set directly or via captureArrowKeys property.
   when arrow keys are captured it adjusts self percentage via an internal delta
   that can be influenced by altKey and ctrlKey
 - is mouse scroll aware with speed influenced by altKey and ctrlKey
 - if no ratio is set then the thickness of the slider button is determined by --dbui-slider-draggable-size css var
 - if debug-show-value is set the component will display current internal percentage on top of slider button
 - percent-precision is configurable (defaults to 4)

TODO:
 - what happens when ratio change while scrolling ? (ex: in scrollable resize event is fired)
 - when size changes independently then ratio and position should auto-update.
 - make sure slide event is not dispatched when slide was triggered programmatically
 - when slider is moved and resize happens slider gets out of constraint
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
    
    --dbui-slider-draggable-size: 16px;
    --dbui-slider-draggable-color: rgba(0, 0, 0, 0.2);
    --dbui-slider-draggable-border-radius: 0px;
    --dbui-slider-draggable-font-size: 8px;
  }
  `;

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

const getInner = (self) => {
  if (self._inner) {
    return self._inner;
  }
  self._inner = self.shadowRoot.querySelector('#inner');
  return self._inner;
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
  getValueDisplayNode(self).innerText = self.debugShowValue ? value : '';
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

const getLocalePercent = (self, percent) => {
  return +(self.isDbuiRTL ? 1 - percent : percent).toFixed(self.percentPrecision);
};

const percentToTranslate = (self, percent) => {
  const availableLength = getAvailableLength(self);
  const draggableLength = getDraggableLength(self);
  const localePercent = getLocalePercent(self, percent);
  return Math.round((availableLength - draggableLength) * localePercent);
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
  const percent = !steps ? currentPercent : trunc(self.percentPrecision)(step / (steps - 1));
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
  const percent = trunc(self.percentPrecision)(distance / totalLength);
  const safePercent = Math.max(0, Math.min(1, percent));
  const { value: finalPercent } = getStep(0, 1, safePercent, self.steps, self.percentPrecision);
  const localePercent = getLocalePercent(self, finalPercent);
  self.percent = localePercent;
  dispatchSlideEvent(self);
};

const adjustPercentOrStepFromDelta = (self, delta) => {
  if (self.steps) {
    const nextStep = self.step + delta;
    const newStep = Math.max(0, Math.min(self.steps - 1, nextStep));
    self.step = newStep;
    // self.percent is calculated automatically
    dispatchSlideEvent(self);
    return;
  }
  const nextPercent = self.percent + (delta * PERCENT_AMOUNT_INCREASE);
  const newPercent = Math.max(0, Math.min(1, nextPercent));
  self.percent = newPercent;
  dispatchSlideEvent(self);
};

const adjustRatio = (self) => {
  const draggable = getDraggable(self);
  const inner = getInner(self);
  if (!self.hasAttribute('ratio')) {
    draggable.style.width = null;
    draggable.style.height = null;
    inner.style.top = null;
    inner.style.bottom = null;
    inner.style.left = null;
    inner.style.right = null;
    return;
  }
  const ratio = self.ratio;
  if (self.ratio === 1) {
    draggable.style.display = 'none';
    self.style.cursor = 'auto';
  } else {
    draggable.style.removeProperty('display');
    self.style.removeProperty('cursor');
  }
  const dimension = self.vertical ? 'height' : 'width';
  const otherDimension = self.vertical ? 'width' : 'height';
  const newDraggableSize = trunc(self.percentPrecision)(100 * ratio);
  // TODO: re-check these and see if should be percent or pixels
  draggable.style[dimension] = `${newDraggableSize}%`;
  draggable.style[otherDimension] = '100%';
  const innerOffset = `calc(0.5 * ${newDraggableSize}%)`;
  if (self.vertical) {
    inner.style.top = innerOffset;
    inner.style.bottom = innerOffset;
    inner.style.left = null;
    inner.style.right = null;
  } else {
    inner.style.left = innerOffset;
    inner.style.right = innerOffset;
    inner.style.top = null;
    inner.style.bottom = null;
  }

};

const forwardSteps = (self) => {
  const steps = self.vertical ? 'constraintStepsY' : 'constraintStepsX';
  getDraggable(self)[steps] = self.steps;
};

const dispatchSlideEvent = (self) => {
  self.dispatchDbuiEvent('dbui-event-slidemove', {
    detail: {}
  });
};

const dispatchReadyEvent = (self) => {
  self.dispatchDbuiEvent('dbui-event-ready', { detail: {} });
};

export default function getDBUISlider(win) {
  return ensureSingleRegistration(win, registrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = getDBUIWebComponentCore(win);

    const DBUIDraggable = getDBUIDraggable(win);
    const DBUIResizeSensor = getDBUIResizeSensor(win);

    class DBUISlider extends DBUIWebComponentBase {

      static get registrationName() {
        return registrationName;
      }

      static get cssVars() {
        return DBUISliderCssVars;
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
            min-width: var(--dbui-slider-draggable-size);
            height: 100%;
          }
          
          :host([vertical]) #${DRAGGABLE_ID} {
            width: 100%;
            height: var(--dbui-slider-draggable-size);
            min-height: var(--dbui-slider-draggable-size);
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
            <dbui-resize-sensor id="wrapper-middle">
              <div id="inner"></div>
              <dbui-draggable
                id="${DRAGGABLE_ID}"
                constraint-type="boundingClientRectOf"
                constraint-selector="parent"
                constraint-steps-x="0"
                constraint-steps-y="0"
              ><div id="value-display-wrapper"><div id="value-display"></div></div></dbui-draggable>
            </dbui-resize-sensor>
          </div>
        `;
      }

      static get dependencies() {
        return [...super.dependencies, DBUIDraggable, DBUIResizeSensor];
      }

      static get propertiesToUpgrade() {
        return [...super.propertiesToUpgrade,
          'steps', 'step', 'percent', 'vertical', 'ratio', 'captureArrowKeys',
          'debugShowValue', 'percentPrecision'
        ];
      }

      static get observedAttributes() {
        return [...super.observedAttributes,
          'steps', 'step', 'percent', 'vertical', 'ratio', 'capture-arrow-keys',
          'debug-show-value', 'percent-precision'
        ];
      }

      constructor() {
        super();
        this._wrapperMiddle = null;
        this._draggable = null;
        this._inner = null;
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
        this._onKeyDown = this._onKeyDown.bind(this);
        this._onResize = this._onResize.bind(this);
        this._onResizeSensorReady = this._onResizeSensorReady.bind(this);
      }

      /**
       * Returns precision to be used when calculating percent
       * @return {number} integer
       */
      get percentPrecision() {
        return this.getAttribute('percent-precision') || DEFAULT_PERCENT_PRECISION;
      }

      /**
       * Sets precision to be used when calculating percent
       * @param value {number} integer
       */
      set percentPrecision(value) {
        const newValue = (Math.round(+value) || 0).toString();
        this.setAttribute('percent-precision', newValue);
      }


      get isSliding() {
        return this._isSliding;
      }

      get debugShowValue() {
        return this.getAttribute('debug-show-value') !== null;
      }

      set debugShowValue(value) {
        const newValue = !!value;
        newValue && this.setAttribute('debug-show-value', '');
        !newValue && this.removeAttribute('debug-show-value');
      }

      get captureArrowKeys() {
        return this.getAttribute('capture-arrow-keys') !== null;
      }

      set captureArrowKeys(value) {
        const newValue = !!value;
        newValue && this.setAttribute('capture-arrow-keys', '');
        !newValue && this.removeAttribute('capture-arrow-keys');
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
        const newValue = trunc(this.percentPrecision)(+value);
        this.setAttribute('percent', newValue);
      }

      get ratio() {
        return +this.getAttribute('ratio') || 0;
      }

      set ratio(value) {
        const newValue = trunc(this.percentPrecision)(+value);
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
          targetPercentX, targetPercentY, targetStepX, targetStepY
        } = evt.detail;
        const percent = this.vertical ? targetPercentY : targetPercentX;
        const step = this.vertical ? targetStepY : targetStepX;
        const localePercent = getLocalePercent(this, percent);
        if (this.steps) {
          this.step = step;
          // will adjust percent too
        } else {
          this.percent = localePercent;
        }
        updateDisplayedValue(this, this.percent);
        dispatchSlideEvent(this);
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
        const delta = getWheelDelta(evt, !this.steps);
        adjustPercentOrStepFromDelta(this, delta);
      }

      _onSliderMouseDown(evt) {
        if (evt.buttons !== 1) return;
        evt.preventDefault();
        const wrapperMiddle = getWrapperMiddle(this);
        const inner = getInner(this);
        if (![wrapperMiddle, inner].includes(evt.target)) {
          // prevent slider to slide on mousedown if target is not wrapper-middle
          return;
        }
        const { clientX, clientY } = evt;
        adjustPercentFromPointerCoords(this, {
          clientX: Math.round(clientX),
          clientY: Math.round(clientY),
        });
      }

      _onSliderTouchStart(evt) {
        evt.preventDefault();
        const wrapperMiddle = getWrapperMiddle(this);
        const inner = getInner(this);
        if (![wrapperMiddle, inner].includes(evt.target)) {
          // prevent slider to slide on mousedown if target is not wrapper-middle
          return;
        }
        const touch = [...evt.touches].find((t) => t.target === wrapperMiddle);
        const { clientX, clientY } = touch;
        adjustPercentFromPointerCoords(this, {
          clientX: Math.round(clientX),
          clientY: Math.round(clientY),
        });
      }

      _onKeyDown(evt) {
        evt.preventDefault();
        const { keyCode, ctrlKey, altKey } = evt;
        const _delta = KEYS_TO_DELTA_MAP[keyCode] || 0;
        const delta = (ctrlKey && altKey) ? _delta * DELTA_MULTIPLIER.ctrlAlt :
          ctrlKey ? _delta * DELTA_MULTIPLIER.ctrl :
            altKey ? _delta * DELTA_MULTIPLIER.alt :
              _delta;
        adjustPercentOrStepFromDelta(this, delta);
      }

      _onResize() {
        adjustPosition(this);
      }

      _onResizeSensorReady() {
        dispatchReadyEvent(this);
      }

      _toggleCaptureArrowKeys() {
        if (this.captureArrowKeys) {
          win.document.addEventListener('keydown', this._onKeyDown);
        } else {
          win.document.removeEventListener('keydown', this._onKeyDown);
        }
      }

      onConnectedCallback() {
        super.onConnectedCallback();
        getDraggable(this).addEventListener('dbui-event-dragmove', this._onDraggableMove);
        getDraggable(this).addEventListener('dbui-event-dragstart', this._onDraggableDragStart);
        getDraggable(this).addEventListener('dbui-event-dragend', this._onDraggableDragEnd);
        getWrapperMiddle(this).addEventListener('mousedown', this._onSliderMouseDown);
        getWrapperMiddle(this).addEventListener('touchstart', this._onSliderTouchStart);
        getWrapperMiddle(this).addEventListener('dbui-event-resize', this._onResize);
        getWrapperMiddle(this).addEventListener('dbui-event-ready', this._onResizeSensorReady);
        this.addEventListener('mouseenter', this._onMouseEnter);
        this.addEventListener('mouseleave', this._onMouseLeave);
        getDraggable(this).percentPrecision = this.percentPrecision;
        this._toggleCaptureArrowKeys();
      }

      onDisconnectedCallback() {
        super.onDisconnectedCallback();
        getDraggable(this).removeEventListener('dbui-event-dragmove', this._onDraggableMove);
        getDraggable(this).removeEventListener('dbui-event-dragstart', this._onDraggableDragStart);
        getDraggable(this).removeEventListener('dbui-event-dragend', this._onDraggableDragEnd);
        getWrapperMiddle(this).removeEventListener('mousedown', this._onSliderMouseDown);
        getWrapperMiddle(this).removeEventListener('touchstart', this._onSliderTouchStart);
        getWrapperMiddle(this).removeEventListener('dbui-event-resize', this._onResize);
        getWrapperMiddle(this).removeEventListener('dbui-event-ready', this._onResizeSensorReady);
        this.removeEventListener('mouseenter', this._onMouseEnter);
        this.removeEventListener('mouseleave', this._onMouseLeave);
        this.removeEventListener('wheel', this._onWheel);
        win.document.removeEventListener('keypress', this._onKeyDown);
      }

      onAttributeChangedCallback(name, oldValue, newValue) {
        super.onAttributeChangedCallback(name, oldValue, newValue);
        if (!this.isMounted) return;
        switch (name) {
          case 'capture-arrow-keys': {
            this._toggleCaptureArrowKeys();
            break;
          }
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
            if (!this.isSliding) {
              forwardSteps(this);
            }
            adjustPercent(this);
            break;
          }
          case 'debug-show-value': {
            updateDisplayedValue(this, this.percent);
            break;
          }
          case 'percent-precision': {
            getDraggable(this).percentPrecision = newValue;
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

