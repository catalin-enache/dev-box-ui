
import getDBUIWebComponentCore from '../DBUIWebComponentCore/DBUIWebComponentCore';
import ensureSingleRegistration from '../../../internals/ensureSingleRegistration';
import { getStep } from '../../../utils/math';

const events = {
  mouse: {
    mousemove() {
      return (evt) => {
        evt.buttons === 1 ? doMove(evt) : unregisterRootEvents(evt);
      };
    },
    mouseup() {
      return (evt) => unregisterRootEvents(evt);
    }
  },
  touch: {
    touchmove() {
      return (evt) => doMove(evt);
    },
    touchend() {
      return (evt) => unregisterRootEvents(evt);
    },
    touchcancel() {
      return (evt) => unregisterRootEvents(evt);
    }
  }
};

const eventOptions = {
  mouse: { capture: false, passive: false },
  touch: { capture: false, passive: false },
};

/**
 *
 * @param evt TouchEvent || MouseEvent always coming from Draggable
 */
function registerRootEvents(evt) {
  const type = isTouchEvent(evt) ? 'touch' : 'mouse';
  const self = evt.currentTarget;
  const { win, root, doc } = getRootDocAndWin(evt);

  if (type === 'mouse' && !win._dbuiCurrentElementBeingDragged) {
    win._dbuiCurrentElementBeingDragged = self;
  }

  // If nested draggables then only one MouseEvent allowed (the inner most) to be registered.
  // However, multiple TouchEvents are allowed to be registered.
  const _self = win._dbuiCurrentElementBeingDragged || self;

  if (!win._dbuiDraggableRegisteredEvents) {
    win._dbuiDraggableRegisteredEvents = new Map();
  }

  const newEventHandlers =
    Object.keys(events[type]).reduce((acc, event) => {
      return {
        ...acc,
        [event]: events[type][event]()
      };
    }, {});

  if (!win._dbuiDraggableRegisteredEvents.has(_self)) {
    win._dbuiDraggableRegisteredEvents.set(_self, newEventHandlers);
    Object.keys(newEventHandlers).forEach((event) => {
      (type === 'touch' ? root : doc).addEventListener(event, newEventHandlers[event], eventOptions[type]);
    });
  }
}

/**
 *
 * @param evt TouchEvent || MouseEvent always coming from Document
 */
function unregisterRootEvents(evt) {
  const type = isTouchEvent(evt) ? 'touch' : 'mouse';
  const { win } = getRootDocAndWin(evt);

  const self = getElementBeingDragged(evt);
  /* istanbul ignore next */
  if (!self) {
    // may occur when
    // 1. touchstart inside draggable
    // 2. touchstart outside draggable
    // 3. touchend outside draggable => this event is not for self
    return;
  }

  const eventHandlers = win._dbuiDraggableRegisteredEvents.get(self);
  if (!eventHandlers) {
    // Might happen when unregisterRootEvents is called twice for the same self.
    // It happens because listeners are called in the order of their registration, in sequence.
    // When touchstart A touchstart B then
    // touchend A (fires A(A), listener for A are removed then fires B(A) - listeners for A already removed)
    // touchend B (fires B(B) listeners for B are removed)
    return;
  }

  if (type === 'touch') {
    const touchesNum = Array.from(evt.touches).reduce((acc, touchEvt) => {
      const target = getElementBeingDragged(touchEvt);
      if (target === self) {
        return acc + 1;
      }
      return acc;
    }, 0);

    if (touchesNum > 0) {
      // do not unregister if there are still pointers on the target
      return;
    }
  }

  cancelDragging(self);
}

function cancelDragging(self) {
  const doc = self.ownerDocument;
  const win = doc.defaultView;
  const root = self.getRootNode();
  const dbuiDraggableRegisteredEvents = win._dbuiDraggableRegisteredEvents || new Map();
  const eventHandlers = dbuiDraggableRegisteredEvents.get(self) || {};
  Object.keys(events).forEach((type) => {
    Object.keys(eventHandlers).forEach((event) => {
      (type === 'touch' ? root : doc).removeEventListener(event, eventHandlers[event], eventOptions[type]);
    });
  });
  self._lastEvent = null;
  win._dbuiCurrentElementBeingDragged = null;
  dbuiDraggableRegisteredEvents.delete(self);
  // TODO: must rename dragend as it shadows native event
  self.dispatchEvent(new win.CustomEvent('dragend', {
    detail: {}
  }));
}

/**
 *
 * @param evt Touch || TouchEvent || MouseEvent
 * @return Object { doc, win }
 */
function getRootDocAndWin(evt) {
  // if target.ownerDocument is null then target is document
  const doc = evt.target.ownerDocument || evt.target;
  // In light DOM rootNode === ownerDocument
  // In shadow DOM rootNode !== ownerDocument but is a document-fragment
  const root = evt.target.getRootNode();
  const win = doc.defaultView;
  return { doc, win, root };
}

/**
 *
 * @param evt Touch || TouchEvent || MouseEvent
 * @return Boolean
 */
function isTouchEvent(evt) {
  const { win } = getRootDocAndWin(evt);
  return win.Touch && ((evt instanceof win.Touch) || (evt instanceof win.TouchEvent));
}

/**
 *
 * @param evt Touch || TouchEvent || MouseEvent coming from either Draggable or Document
 * @return HTMLElement || null
 */
export function getElementBeingDragged(evt) {
  const type = isTouchEvent(evt) ? 'touch' : 'mouse';
  const { win } = getRootDocAndWin(evt);

  if (type === 'mouse') {
    return win._dbuiCurrentElementBeingDragged;
  }

  // target is defined on all
  // Touch,
  // TouchEvent (inherited from Event interface),
  // MouseEvent (inherited from Event interface)
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
export function extractSingleEvent(evt) {
  return isTouchEvent(evt) ?
    Array.from(evt.touches).find(
      (e) => getElementBeingDragged(e) === getElementBeingDragged(evt)
    ) :
    evt;
}

/**
 *
 * @param evt MouseEvent || TouchEvent always coming from Draggable
 * @return {
 * targetTranslatedXOnStart: Number, targetTranslatedYOnStart: Number,
 * targetWidthOnStart: Number, targetHeightOnStart: Number,
 * targetXOnStart: Number, targetYOnStart: Number,
 * pointerXOnStart: Number, pointerYOnStart: Number,
 * }
 */
function getMeasurements(evt) {
  const self = evt.currentTarget;
  const win = self.ownerDocument.defaultView;
  const targetToDrag = self._targetToDrag;

  const targetStyle = win.getComputedStyle(targetToDrag, null);
  const matrix = targetStyle.transform.match(/-?\d*\.?\d+/g).map(Number);
  const targetBoundingRect = targetToDrag.getBoundingClientRect();
  const extractedEvent = extractSingleEvent(evt);
  const winScrollX = win.scrollX;
  const winScrollY = win.scrollY;

  const targetWidthOnStart = Math.round(targetBoundingRect.width);
  const targetHeightOnStart = Math.round(targetBoundingRect.height);
  const _targetXOnStart = Math.round(targetBoundingRect.x);
  const _targetYOnStart = Math.round(targetBoundingRect.y);

  const { clientX: _pointerXOnStart, clientY: _pointerYOnStart } = extractedEvent;
  const [targetTranslatedXOnStart, targetTranslatedYOnStart] = [matrix[4], matrix[5]];
  const targetXOnStart = _targetXOnStart + winScrollX;
  const targetYOnStart = _targetYOnStart + winScrollY;
  const pointerXOnStart = _pointerXOnStart + winScrollX;
  const pointerYOnStart = _pointerYOnStart + winScrollY;

  return {
    targetTranslatedXOnStart, targetTranslatedYOnStart,
    targetWidthOnStart, targetHeightOnStart,
    targetXOnStart, targetYOnStart,
    pointerXOnStart, pointerYOnStart
  };
}

/**
 *
 * @param evt MouseEvent always coming from Draggable
 */
/* istanbul ignore next */
function handleMouseDown(evt) {
  if (evt.buttons !== 1) return;
  onPointerDown(evt);
}

/**
 *
 * @param evt TouchEvent always coming from Draggable
 */
// https://github.com/gotwarlost/istanbul/blob/master/ignoring-code-for-coverage.md
/* istanbul ignore next */
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
  // stopPropagation for nested draggables (allow dragging of inner most one)
  self.stopPropagatingPointerDown && evt.stopPropagation();
  self._lastEvent = evt;
  self._cachedConstraintPreset = null;
  self._measurements = getMeasurements(evt);
  registerRootEvents(evt);
  const { win } = getRootDocAndWin(evt);
  const extractedEvent = extractSingleEvent(evt);
  const {
    clientX, clientY
  } = extractedEvent;
  self.dispatchEvent(new win.CustomEvent('dragstart', {
    detail: {
      clientX, clientY
    }
  }));
}

/**
 *
 * @param evt MouseEvent (mousemove) || TouchEvent (touchmove) always coming from Document
 */
function doMove(_evt, { forceDispatch = false } = {}) {
  _evt.preventDefault(); // prevent selection and scrolling
  _evt.stopPropagation(); // for nested draggables (allow dragging of inner most one)
  const evt = extractSingleEvent(_evt);

  /* istanbul ignore next */
  if (!evt) {
    return;
  }

  const self = getElementBeingDragged(evt);

  /* istanbul ignore next */
  if (!self) {
    // may occur when
    // 1. touchstart inside draggable
    // 2. touchstart outside draggable
    // 3. touchmove outside draggable => this event is not for self
    return;
  }

  const { win } = getRootDocAndWin(evt);

  if (self._dragRunning) { return; }
  self._dragRunning = true;
  self._lastEvent = _evt;
  win.requestAnimationFrame(() => {
    if (!self.isMounted) { // might be unmounted meanwhile
      self._dragRunning = false;
      return;
    }

    const {
      targetTranslatedXOnStart, targetTranslatedYOnStart,
      targetWidthOnStart, targetHeightOnStart,
      targetXOnStart, targetYOnStart,
      pointerXOnStart, pointerYOnStart,
    } = self._measurements;
    const winScrollX = win.scrollX;
    const winScrollY = win.scrollY;
    const pointerX = evt.clientX + winScrollX;
    const pointerY = evt.clientY + winScrollY;
    const [pointerDistanceX, pointerDistanceY] =
      [pointerX - pointerXOnStart, pointerY - pointerYOnStart];

    const nextTargetTranslateX = targetTranslatedXOnStart + pointerDistanceX;
    const nextTargetTranslateY = targetTranslatedYOnStart + pointerDistanceY;
    const targetX = targetXOnStart + pointerDistanceX;
    const targetY = targetYOnStart + pointerDistanceY;
    const targetOriginalX = targetX - nextTargetTranslateX;
    const targetOriginalY = targetY - nextTargetTranslateY;

    const {
      targetTranslateX: revisedTranslateX,
      targetTranslateY: revisedTranslateY,
      ...rest
    } =
      self.applyCorrection({
        targetWidthOnStart, targetHeightOnStart,
        targetXOnStart, targetYOnStart,
        targetTranslatedXOnStart, targetTranslatedYOnStart,
        targetTranslateX: nextTargetTranslateX, targetTranslateY: nextTargetTranslateY,
        targetX, targetY,
        targetOriginalX, targetOriginalY,
        pointerXOnStart, pointerYOnStart,
        pointerX, pointerY
      });

    const prevTargetTranslateX = self.targetTranslateX;
    const prevTargetTranslateY = self.targetTranslateY;
    const newTargetTranslateX = Math.round(revisedTranslateX);
    const newTargetTranslateY = Math.round(revisedTranslateY);
    self.targetTranslateX = newTargetTranslateX;
    self.targetTranslateY = newTargetTranslateY;

    if (forceDispatch || newTargetTranslateX !== prevTargetTranslateX || newTargetTranslateY !== prevTargetTranslateY) {
      self.dispatchEvent(new win.CustomEvent('dragmove', {
        detail: {
          targetWidthOnStart, targetHeightOnStart,
          targetXOnStart, targetYOnStart,
          targetTranslatedXOnStart, targetTranslatedYOnStart,
          targetTranslateX: revisedTranslateX, targetTranslateY: revisedTranslateY,
          targetX: targetX - (nextTargetTranslateX - revisedTranslateX),
          targetY: targetY - (nextTargetTranslateY - revisedTranslateY),
          targetOriginalX, targetOriginalY,
          pointerXOnStart, pointerYOnStart,
          pointerX, pointerY,
          ...rest
        }
      }));
    }

    self._dragRunning = false;
  });
}

const getConstraintsForBoundingClientRect = (targetNode, constraintNode) => {
  const win = targetNode.ownerDocument.defaultView;
  const targetStyle = win.getComputedStyle(targetNode, null);
  const targetBoundingClientRect = targetNode.getBoundingClientRect();
  const constraintBoundingRect = constraintNode.getBoundingClientRect();

  const matrix = targetStyle.transform.match(/-?\d*\.?\d+/g).map(Number);
  const [targetTranslatedX, targetTranslatedY] = [matrix[4], matrix[5]];

  const aX = Math.round(targetBoundingClientRect.x);
  const aY = Math.round(targetBoundingClientRect.y);
  const bX = Math.round(constraintBoundingRect.x);
  const bY = Math.round(constraintBoundingRect.y);

  const offsetX = (bX - aX) + targetTranslatedX;
  const offsetY = (bY - aY) + targetTranslatedY;

  const rectWidth = parseInt(constraintBoundingRect.width, 10);
  const rectHeight = parseInt(constraintBoundingRect.height, 10);

  return { offsetX, offsetY, rectWidth, rectHeight };
};

const presetBoundingClientRect =
({ rectWidth, rectHeight, offsetX, offsetY, stepsX = 0, stepsY = 0 }) =>
  ({
    targetTranslateX, targetTranslateY, targetWidthOnStart, targetHeightOnStart
  }) => {
    const maxX = rectWidth - targetWidthOnStart;
    const maxY = rectHeight - targetHeightOnStart;
    const _offsetX = offsetX;
    const _offsetY = offsetY;
    const revisedTranslateX = Math.max(_offsetX, Math.min(targetTranslateX, maxX + _offsetX));
    const revisedTranslateY = Math.max(_offsetY, Math.min(targetTranslateY, maxY + _offsetY));

    const { value: stepX, percent: percentX, index: stepIndexX } =
      getStep(_offsetX, maxX + _offsetX, revisedTranslateX, stepsX);
    const { value: stepY, percent: percentY, index: stepIndexY } =
      getStep(_offsetY, maxY + _offsetY, revisedTranslateY, stepsY);

    return {
      targetTranslateX: stepX, targetTranslateY: stepY,
      targetPercentX: percentX, targetPercentY: percentY,
      targetStepX: stepIndexX, targetStepY: stepIndexY
    };
  };

const presetCircle =
({ cx, cy, radius, steps = 0 }) =>
  ({
    targetWidthOnStart, targetHeightOnStart,
    targetOriginalX, targetOriginalY,
    pointerX, pointerY
  }) => {
    const targetHalfWidth = targetWidthOnStart / 2;
    const targetHalfHeight = targetHeightOnStart / 2;
    const xDistance = (pointerX) - cx;
    const yDistance = (pointerY) - cy;
    const distanceFromCenter = Math.sqrt((xDistance ** 2) + (yDistance ** 2));
    const _cos = xDistance / distanceFromCenter;
    const _sin = yDistance / distanceFromCenter;

    const quadrant =
      _sin <= 0 && _cos >= 0 ? 1 :
        _sin <= 0 && _cos <= 0 ? 2 :
          _sin >= 0 && _cos <= 0 ? 3 :
            4; // _sin >= 0 && _cos >= 0
    const _rad = Math.acos(_cos);

    const fullRotation = 2 * Math.PI;
    const radians = quadrant < 3 ? _rad : fullRotation - _rad;
    const degrees = (radians * 180) / Math.PI;
    // for circle first step (0) === last step (2 * Math.PI or 360deg)
    const { value: degreeStep, index: stepIndex, percent } =
      getStep(0, 360, degrees, steps ? steps + 1 : 0);
    const radiansStep = (degreeStep * Math.PI) / 180;

    const cos = +Math.cos(radiansStep).toFixed(15);
    const sin = +Math.sin(radiansStep).toFixed(15);

    const newAbsX = (radius * cos) + cx;
    // * -1 as math coords are different than display coords
    const newAbsY = ((radius * sin) * -1) + cy;

    const revisedTargetTranslateX = newAbsX - targetOriginalX - targetHalfWidth;
    const revisedTargetTranslateY = newAbsY - targetOriginalY - targetHalfHeight;

    return {
      targetTranslateX: revisedTargetTranslateX,
      targetTranslateY: revisedTargetTranslateY,
      targetPercent: percent,
      targetStep: stepIndex,
      radians,
      degrees,
      radiansStep,
      degreeStep,
      cos, sin
    };
  };

const presetNoConstraint =
({ targetTranslateX, targetTranslateY }) => {
  return { targetTranslateX, targetTranslateY };
};

/*
TODO:
 - presetBoundingClientRect try not to require offset but constraint absolute x and y ?
 - unittest for applyCorrection
 - improve presets algorithms
 - improve code where possible
 - add circleAround({ selector, steps }) preset ?
 - allow consumer to set the percent precision with default fallback
*/

const registrationName = 'dbui-draggable';

export default function getDBUIDraggable(win) {
  return ensureSingleRegistration(win, registrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = getDBUIWebComponentCore(win);

    class DBUIDraggable extends DBUIWebComponentBase {

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
          }
          
          :host([dbui-dir=ltr]) {
            /* pass */
          }
          
          :host([dbui-dir=rtl]) {
            /* pass */
          }
          </style>
          <slot></slot>
        `;
      }

      static get propertiesToUpgrade() {
        return [...super.propertiesToUpgrade,
          'applyCorrection',
          'targetTranslateX',
          'targetTranslateY',
          'dragTarget',
          'constraintType', 'constraintSelector',
          'constraintCX', 'constraintCY', 'constraintRadius',
          'constraintStepsX', 'constraintStepsY', 'constraintSteps',
          'stopPropagatingPointerDown'
        ];
      }

      static get observedAttributes() {
        return [...super.observedAttributes,
          'target-translate-x',
          'target-translate-y',
          'drag-target',
          'constraint-type', 'constraint-selector',
          'constraint-cx', 'constraint-cy', 'constraint-radius',
          'constraint-steps-x', 'constraint-steps-y', 'constraint-steps',
          'stop-propagating-pointer-down'
        ];
      }

      constructor() {
        super();
        this._lastEvent = null;
        this._cachedTargetToDrag = null;
        this._cachedConstraintPreset = null;
        this._cachedConstraintNode = null;
        this._dbuiDraggable = true;
        this._targetToDragOldTransform = '';
        this._targetToDragOldTransformOrigin = '';
        this._onConstraintNodeResize = this._onConstraintNodeResize.bind(this);
      }

      /**
       * Returns whether should stop propagate mousedown or touchstart event.
       * Useful for nested draggables
       * @return {boolean}
       */
      get stopPropagatingPointerDown() {
        return this.getAttribute('stop-propagating-pointer-down') !== null;
      }

      /**
       * Sets whether should stop propagate mousedown or touchstart event.
       * Useful for nested draggables
       * @param value {boolean}
       */
      set stopPropagatingPointerDown(value) {
        const newValue = !!value;
        newValue && this.setAttribute('stop-propagating-pointer-down', '');
        !newValue && this.removeAttribute('stop-propagating-pointer-down');
      }

      /**
       * Get X translation of target.
       * @return Number
       */
      get targetTranslateX() {
        return +this.getAttribute('target-translate-x') || 0;
      }

      /**
       * Set X translation of target.
       * @param value Number | String
       */
      set targetTranslateX(value) {
        const newValue = (Math.round(+value) || 0).toString();
        this.setAttribute('target-translate-x', newValue);
      }

      /**
       * Get Y translation of target.
       * @return Number
       */
      get targetTranslateY() {
        return +this.getAttribute('target-translate-y') || 0;
      }

      /**
       * Set Y translation of target.
       * @param value Number | String
       */
      set targetTranslateY(value) {
        const newValue = (Math.round(+value) || 0).toString();
        this.setAttribute('target-translate-y', newValue);
      }

      /**
       * Get Selector of target to drag.
       * @return String
       */
      get dragTarget() {
        return this.getAttribute('drag-target');
      }

      /**
       * Set Selector of target to drag.
       * @param value String
       */
      set dragTarget(value) {
        this.setAttribute('drag-target', value.toString());
      }

      get applyCorrection() {
        return this._applyCorrection;
      }

      set applyCorrection(funcValue) {
        this._applyCorrection = funcValue.bind(this);
      }

      /**
       * Get constraint type.
       * @return String
       */
      get constraintType() {
        return this.getAttribute('constraint-type');
      }

      /**
       * Set constraint type.
       * @param value String
       */
      set constraintType(value) {
        this.setAttribute('constraint-type', value);
      }

      /**
       * Get constraint selector.
       * @return String
       */
      get constraintSelector() {
        return this.getAttribute('constraint-selector');
      }

      /**
       * Set constraint selector.
       * @param value String
       */
      set constraintSelector(value) {
        this.setAttribute('constraint-selector', value);
      }

      /**
       * Get constraint CX.
       * @return Number
       */
      get constraintCX() {
        return +this.getAttribute('constraint-cx') || 0;
      }

      /**
       * Set constraint CX.
       * @param value Number | String
       */
      set constraintCX(value) {
        const newValue = (Math.round(+value) || 0).toString();
        this.setAttribute('constraint-cx', newValue);
      }

      /**
       * Get constraint CY.
       * @return Number
       */
      get constraintCY() {
        return +this.getAttribute('constraint-cy') || 0;
      }

      /**
       * Set constraint CY.
       * @param value Number | String
       */
      set constraintCY(value) {
        const newValue = (Math.round(+value) || 0).toString();
        this.setAttribute('constraint-cy', newValue);
      }

      /**
       * Get constraint radius.
       * @return Number
       */
      get constraintRadius() {
        return +this.getAttribute('constraint-radius') || 0;
      }

      /**
       * Set constraint radius.
       * @param value Number | String
       */
      set constraintRadius(value) {
        const newValue = (Math.round(+value) || 0).toString();
        this.setAttribute('constraint-radius', newValue);
      }

      /**
       * Get constraint steps X.
       * @return Number
       */
      get constraintStepsX() {
        return +this.getAttribute('constraint-steps-x') || 0;
      }

      /**
       * Set constraint steps X.
       * @param value Number | String
       */
      set constraintStepsX(value) {
        const newValue = (Math.round(+value) || 0).toString();
        this.setAttribute('constraint-steps-x', newValue);
      }

      /**
       * Get constraint steps Y.
       * @return Number
       */
      get constraintStepsY() {
        return +this.getAttribute('constraint-steps-y') || 0;
      }

      /**
       * Set constraint steps Y.
       * @param value Number | String
       */
      set constraintStepsY(value) {
        const newValue = (Math.round(+value) || 0).toString();
        this.setAttribute('constraint-steps-y', newValue);
      }

      /**
       * Get constraint steps.
       * @return Number
       */
      get constraintSteps() {
        return +this.getAttribute('constraint-steps') || 0;
      }

      /**
       * Set constraint steps.
       * @param value Number | String
       */
      set constraintSteps(value) {
        const newValue = (Math.round(+value) || 0).toString();
        this.setAttribute('constraint-steps', newValue);
      }

      /**
       * Evaluated on drag start, cached while dragging.
       * @return Function to apply correction.
       * @private
       */
      get _constraintPreset() {
        if (this._cachedConstraintPreset) {
          return this._cachedConstraintPreset;
        }
        const constraintType = this.constraintType;

        if (!constraintType) {
          this._cachedConstraintPreset = presetNoConstraint;
          return this._cachedConstraintPreset;
        }

        try {
          switch (true) {
            case constraintType === 'boundingClientRectOf': {
              const [stepsX, stepsY] = [this.constraintStepsX, this.constraintStepsY];
              const constraintNode = this._constraintNode;
              const constraintsForBoundingClientRect =
                getConstraintsForBoundingClientRect(this._targetToDrag, constraintNode);
              this._cachedConstraintPreset =
                presetBoundingClientRect({ ...constraintsForBoundingClientRect, stepsX, stepsY });
              break;
            }
            case constraintType === 'circle': {
              const [cx, cy, radius, steps] = [
                this.constraintCX, this.constraintCY, this.constraintRadius, this.constraintSteps
              ];
              this._cachedConstraintPreset = presetCircle({ cx, cy, radius, steps });
              break;
            }
            default:
              // pass
          }
        } catch (_) {
          this.ownerDocument.defaultView.console.error(`Invalid constraint ${constraintType}`);
          this._cachedConstraintPreset = presetNoConstraint;
        }

        return this._cachedConstraintPreset;
      }

      _adjustPosition(name) {
        let targetTranslateX = this.targetTranslateX;
        let targetTranslateY = this.targetTranslateY;
        switch (true) {
          case name === 'target-translate-x': {
            targetTranslateX = this.targetTranslateX;
            break;
          }
          case name === 'target-translate-y': {
            targetTranslateY = this.targetTranslateY;
            break;
          }
          default:
            // pass
        }
        this._targetToDrag.style.transform = `translate(${targetTranslateX}px,${targetTranslateY}px)`;
      }

      get _targetToDrag() {
        if (this._cachedTargetToDrag) return this._cachedTargetToDrag;
        const dragTarget = this.dragTarget;
        const targetToDrag = dragTarget === 'parent' ? this.parentElement :
          (this.getRootNode().querySelector(dragTarget) || this);
        this._cachedTargetToDrag = targetToDrag;
        return this._cachedTargetToDrag;
      }

      get _constraintNode() {
        if (this._cachedConstraintNode) {
          return this._cachedConstraintNode;
        }
        const selector = this.constraintSelector;
        const constraintNode =
          selector === 'parent' ?
            this._targetToDrag.parentElement :
            this.getRootNode().querySelector(selector);
        this._cachedConstraintNode = constraintNode;
        return this._cachedConstraintNode;
      }

      _initializeTargetToDrag() {
        this._cachedTargetToDrag = null; // needed when drag-target attribute changes
        const targetToDrag = this._targetToDrag;
        targetToDrag.setAttribute('dbui-draggable-target', '');
        this._targetToDragOldTransform = targetToDrag.style.transform;
        this._targetToDragOldTransformOrigin = targetToDrag.style.transformOrigin;
        targetToDrag.style.transformOrigin = 'center';
        // define initial translation
        this._adjustPosition('target-translate-x');
        this._adjustPosition('target-translate-y');
      }

      _resetTargetToDrag() {
        const targetToDrag = this._targetToDrag;
        targetToDrag.removeAttribute('dbui-draggable-target');
        targetToDrag.style.transform = this._targetToDragOldTransform;
        targetToDrag.style.transformOrigin = this._targetToDragOldTransformOrigin;
        this._targetToDragOldTransform = '';
        this._targetToDragOldTransformOrigin = '';
        this._cachedTargetToDrag = null;
      }

      _onConstraintNodeResize() {
        const targetToDrag = this._targetToDrag;
        const targetBoundingRect = targetToDrag.getBoundingClientRect();
        const newTargetWidthOnStart = Math.round(targetBoundingRect.width);
        const newTargetHeightOnStart = Math.round(targetBoundingRect.height);
        (this._measurements || {}).targetWidthOnStart = newTargetWidthOnStart;
        (this._measurements || {}).targetHeightOnStart = newTargetHeightOnStart;

        this._cachedConstraintPreset = null;
        this._lastEvent && doMove(this._lastEvent, { forceDispatch: true });
        // cancelDragging(this);
      }

      onConnectedCallback() {
        this.setAttribute('unselectable', '');
        this.addEventListener('mousedown', handleMouseDown, eventOptions.mouse);
        this.addEventListener('touchstart', handleTouchStart, eventOptions.touch);
        this._initializeTargetToDrag();
        this._constraintNode &&
          this._constraintNode.addEventListener('resize', this._onConstraintNodeResize);
      }

      onDisconnectedCallback() {
        this.removeAttribute('unselectable');
        this.removeEventListener('mousedown', handleMouseDown, eventOptions.mouse);
        this.removeEventListener('touchstart', handleTouchStart, eventOptions.touch);
        // should also remove the rest of listeners here
        this._resetTargetToDrag();
        this._constraintNode &&
          this._constraintNode.removeEventListener('resize', this._onConstraintNodeResize);
      }

      // eslint-disable-next-line
      onAttributeChangedCallback(name, oldValue, newValue) {
        if (!this.isMounted) return;
        switch (name) {
          // position adjusters attributes
          case 'target-translate-x':
          case 'target-translate-y':
            this._adjustPosition(name);
            break;
          case 'drag-target':
            this._resetTargetToDrag();
            this._initializeTargetToDrag();
            break;
          // constraint attributes
          case 'constraint-selector':
            this._constraintNode &&
              this._constraintNode.removeEventListener('resize', this._onConstraintNodeResize);
            this._cachedConstraintNode = null;
            break;
          case 'constraint-type':
          case 'constraint-cx':
          case 'constraint-cy':
          case 'constraint-radius':
          case 'constraint-steps-x':
          case 'constraint-steps-y':
          case 'constraint-steps':
            // pass
            // _constraintPreset is evaluated on drag start.
            break;
          default:
            // pass
        }
      }

      /**
       * Applies correction on suggested translated coordinates.
       * Can be overridden.
       * If overridden by consumer the constraint presets are ignored.
       * @param targetWidthOnStart Number
       * @param targetHeightOnStart Number
       * @param targetXOnStart Number
       * @param targetYOnStart Number
       * @param targetTranslatedXOnStart Number
       * @param targetTranslatedYOnStart Number
       * @param targetTranslateX Number (Suggested translation).
       * @param targetTranslateY Number (Suggested translation).
       * @param targetX Number
       * @param targetY Number
       * @param targetOriginalX Number
       * @param targetOriginalY Number
       * @param pointerXOnStart Number
       * @param pointerYOnStart Number
       * @param pointerX Number
       * @param pointerY Number
       * @return Object {
       *  targetTranslateX: Number, targetTranslateY: Number
       * }
       */
      _applyCorrection({
        targetWidthOnStart, targetHeightOnStart,
        targetXOnStart, targetYOnStart,
        targetTranslatedXOnStart, targetTranslatedYOnStart,
        targetTranslateX, targetTranslateY,
        targetX, targetY,
        targetOriginalX, targetOriginalY,
        pointerXOnStart, pointerYOnStart,
        pointerX, pointerY
      }) {
        // Different algorithms for different constraint presets.
        return this._constraintPreset({
          targetWidthOnStart, targetHeightOnStart,
          targetXOnStart, targetYOnStart,
          targetTranslatedXOnStart, targetTranslatedYOnStart,
          targetTranslateX, targetTranslateY,
          targetX, targetY,
          targetOriginalX, targetOriginalY,
          pointerXOnStart, pointerYOnStart,
          pointerX, pointerY
        });
      }

    }

    return Registerable(
      defineCommonStaticMethods(
        DBUIDraggable
      )
    );
  });
}

getDBUIDraggable.registrationName = registrationName;

