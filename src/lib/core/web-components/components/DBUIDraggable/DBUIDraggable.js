
import getDBUIWebComponentCore from '../DBUIWebComponentCore/DBUIWebComponentCore';
import ensureSingleRegistration from '../../../internals/ensureSingleRegistration';
// import onScreenConsole from '../../../utils/onScreenConsole';

const events = {
  mouse: {
    mousemove() {
      return (evt) => {
        evt.which === 1 ? doMove(evt) : unregisterDocumentEvents(evt);
      };
    },
    mouseup() {
      return (evt) => unregisterDocumentEvents(evt);
    }
  },
  touch: {
    touchmove() {
      return (evt) => doMove(evt);
    },
    touchend() {
      return (evt) => unregisterDocumentEvents(evt);
    },
    touchcancel() {
      return (evt) => unregisterDocumentEvents(evt);
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

  const newEventHandlers =
    Object.keys(events[type]).reduce((acc, event) => {
      return {
        ...acc,
        [event]: events[type][event]()
      };
    }, {});

  if (!win._dbuiDraggableRegisteredEvents.has(self)) {
    win._dbuiDraggableRegisteredEvents.set(self, newEventHandlers);
    Object.keys(newEventHandlers).forEach((event) => {
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
      // do not unregister if there are still pointers on the target
      return;
    }
  }

  Object.keys(eventHandlers).forEach((event) => {
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
  return win.Touch && ((evt instanceof win.Touch) || (evt instanceof win.TouchEvent));
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
function extractSingleEvent(evt) {
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

  const {
    width: targetWidthOnStart, height: targetHeightOnStart,
    x: _targetXOnStart, y: _targetYOnStart
  } = targetBoundingRect;
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
  self._cachedConstraintPreset = null;
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

  if (self._dragRunning) { return; }
  self._dragRunning = true;
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

    self.targetTranslateX = revisedTranslateX;
    self.targetTranslateY = revisedTranslateY;

    self.dispatchEvent(new win.CustomEvent('translate', {
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
    self._dragRunning = false;
  });
}

const getStep = (minX, maxX, x, steps) => {
  const _steps = Number(steps);
  if (!_steps || _steps < 2) {
    return { value: x, index: undefined };
  }
  const interval = maxX - minX;
  const stepSize = interval / (_steps - 1);
  const allSteps = [];
  let minDist = Infinity;
  let idx = null;
  for (let i = 1; i <= _steps; i += 1) {
    if (i === 1) {
      allSteps.push(minX);
    } else if (i === _steps) {
      allSteps.push(maxX);
    } else {
      allSteps.push(minX + ((i - 1) * stepSize));
    }
    if (Math.abs(allSteps[i - 1] - x) < minDist) {
      minDist = Math.abs(allSteps[i - 1] - x);
      idx = i - 1;
    }
  }
  return { value: allSteps[idx], index: idx };
};

const getConstraintsForBoundingClientRect = (targetNode, constraintNode) => {
  const win = targetNode.ownerDocument.defaultView;
  const targetStyle = win.getComputedStyle(targetNode, null);
  const targetBoundingClientRect = targetNode.getBoundingClientRect();
  const constraintBoundingRect = constraintNode.getBoundingClientRect();

  const matrix = targetStyle.transform.match(/-?\d*\.?\d+/g).map(Number);
  const [targetTranslatedX, targetTranslatedY] = [matrix[4], matrix[5]];

  const { x: aX, y: aY } = targetBoundingClientRect;
  const { x: bX, y: bY } = constraintBoundingRect;
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


    const { value: stepX } = getStep(_offsetX, maxX + _offsetX, revisedTranslateX, stepsX);
    const { value: stepY } = getStep(_offsetY, maxY + _offsetY, revisedTranslateY, stepsY);
    return { targetTranslateX: stepX, targetTranslateY: stepY };
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
    const { value: degreeStep, index: stepIndex } =
      getStep(0, 360, degrees, steps ? steps + 1 : 0);
    const radiansStep = (degreeStep * Math.PI) / 180;

    const cos = +Math.cos(radiansStep).toFixed(15);
    const sin = +Math.sin(radiansStep).toFixed(15);

    const newAbsX = (radius * cos) + cx;
    // * -1 as math coords are different than display coords
    const newAbsY = ((radius * sin) * -1) + cy;

    const revisedTargetTranslateX = newAbsX - targetOriginalX - targetHalfWidth;
    const revisedTargetTranslateY = newAbsY - targetOriginalY - targetHalfHeight;

    const percent = radiansStep / fullRotation;

    return {
      targetTranslateX: revisedTargetTranslateX,
      targetTranslateY: revisedTargetTranslateY,
      radians,
      degrees,
      percent,
      radiansStep,
      degreeStep,
      stepIndex,
      cos, sin
    };
  };

const presetNoConstraint =
({ targetTranslateX, targetTranslateY }) => {
  return { targetTranslateX, targetTranslateY };
};

/*
TODO:
4. improve presets algorithms
5. improve code where possible
*/

const registrationName = 'dbui-draggable';

export default function getDBUIDraggable(win) {
  return ensureSingleRegistration(win, registrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = getDBUIWebComponentCore(win);

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
          'constraint'
        ];
      }

      static get observedAttributes() {
        return [...super.observedAttributes,
          'target-translate-x',
          'target-translate-y',
          'drag-target',
          'constraint'
        ];
      }

      constructor() {
        super();
        this._cachedTargetToDrag = null;
        this._cachedConstraintPreset = null;
        this._dbuiDraggable = true;
        this._targetToDragOldTransform = '';
        this._targetToDragOldTransformOrigin = '';
      }

      /**
       * Get X translation of target.
       * @return Number
       */
      get targetTranslateX() {
        return Number(this.getAttribute('target-translate-x')) || 0;
      }

      /**
       * Set X translation of target.
       * @param value Number | String
       */
      set targetTranslateX(value) {
        const newValue = (Number(value) || 0).toString();
        this.setAttribute('target-translate-x', newValue);
      }

      /**
       * Get Y translation of target.
       * @return Number
       */
      get targetTranslateY() {
        return Number(this.getAttribute('target-translate-y')) || 0;
      }

      /**
       * Set Y translation of target.
       * @param value Number | String
       */
      set targetTranslateY(value) {
        const newValue = (Number(value) || 0).toString();
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
       * Get constraint preset to apply on dragging.
       * @return String
       */
      get constraint() {
        return this.getAttribute('constraint');
      }

      /**
       * Set constraint preset to apply on dragging
       * ex: boundingClientRectOf("selector")
       * circle(5, 7, 20)
       * @param value String
       */
      set constraint(value) {
        return this.setAttribute('constraint', value.toString());
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
        const constraint = this.constraint || '';

        if (!constraint) {
          this._cachedConstraintPreset = presetNoConstraint;
          return this._cachedConstraintPreset;
        }

        try {
          const jsonString = constraint.match(/\((.+)\)/)[1];
          const data = JSON.parse(jsonString);
          switch (true) {
            case constraint.startsWith('boundingClientRectOf'): {
              const { selector, stepsX, stepsY } = data;
              const constraintNode =
              selector === 'parent' ?
                this.parentElement :
                this.ownerDocument.querySelector(selector);
              const constraintsForBoundingClientRect =
                getConstraintsForBoundingClientRect(this, constraintNode);
              this._cachedConstraintPreset =
                presetBoundingClientRect({ ...constraintsForBoundingClientRect, stepsX, stepsY });
              break;
            }
            case constraint.startsWith('circle'): {
              const { cx, cy, radius, steps } = data;
              this._cachedConstraintPreset = presetCircle({ cx, cy, radius, steps });
              break;
            }
            default:
              // pass
          }
        } catch (_) {
          this.ownerDocument.defaultView.console.error(`Invalid constraint ${constraint}`);
          this._cachedConstraintPreset = presetNoConstraint;
        }

        return this._cachedConstraintPreset;
      }

      get _targetToDrag() {
        if (this._cachedTargetToDrag) return this._cachedTargetToDrag;
        const targetToDrag =
          this.getRootNode().querySelector(this.dragTarget) || this;
        this._cachedTargetToDrag = targetToDrag;
        return this._cachedTargetToDrag;
      }

      _initializeTargetToDrag() {
        this._cachedTargetToDrag = null; // needed when drag-target attribute changes
        const targetToDrag = this._targetToDrag;
        targetToDrag.setAttribute('dbui-draggable-target', '');
        this._targetToDragOldTransform = targetToDrag.style.transform;
        this._targetToDragOldTransformOrigin = targetToDrag.style.transformOrigin;
        targetToDrag.style.transform = `translate(${this.targetTranslateX}px,${this.targetTranslateY}px)`;
        targetToDrag.style.transformOrigin = 'center';
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
          case 'target-translate-x':
            if (!this.isMounted) break;
            valueToSet = (Number(newValue) || 0).toString();
            this._targetToDrag.style.transform = `translate(${valueToSet}px,${this.targetTranslateY}px)`;
            break;
          case 'target-translate-y':
            if (!this.isMounted) break;
            valueToSet = (Number(newValue) || 0).toString();
            this._targetToDrag.style.transform = `translate(${this.targetTranslateX}px,${valueToSet}px)`;
            break;
          case 'drag-target':
            if (!this.isMounted) break;
            this._resetTargetToDrag();
            this._initializeTargetToDrag();
            break;
          case 'constraint':
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

