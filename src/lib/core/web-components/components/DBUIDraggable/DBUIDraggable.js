
import getDBUIWebComponentCore from '../DBUIWebComponentCore/DBUIWebComponentCore';
import ensureSingleRegistration from '../../../internals/ensureSingleRegistration';
// import onScreenConsole from '../../../utils/onScreenConsole';

const events = {
  mouse: {
    mousemove() {
      return (evt) => doMove(evt);
    },
    mouseup() {
      return (evt) => unregisterDocumentEvents(evt);
    },
    mouseout() {
      return (evt) => {
        const nodeName = ((evt.relatedTarget || {}).nodeName || 'HTML').toString();
        nodeName === 'HTML' && unregisterDocumentEvents(evt);
      };
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
 * pointerXOnStart: Number, pointerYOnStart: Number,
 * targetTranslatedXOnStart: Number, targetTranslatedYOnStart: Number,
 * targetWidthOnStart: Number, targetHeightOnStart: Number
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

  const { width: targetWidthOnStart, height: targetHeightOnStart } = targetBoundingRect;
  const { clientX: pointerXOnStart, clientY: pointerYOnStart } = extractedEvent;
  const [targetTranslatedXOnStart, targetTranslatedYOnStart] = [matrix[4], matrix[5]];

  return {
    pointerXOnStart, pointerYOnStart,
    targetTranslatedXOnStart, targetTranslatedYOnStart,
    targetWidthOnStart, targetHeightOnStart
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
  self._constraintPresetCached = null;
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
      pointerXOnStart, pointerYOnStart,
      targetTranslatedXOnStart, targetTranslatedYOnStart,
      targetWidthOnStart, targetHeightOnStart
    } = self._measurements;
    const [pointerDistanceX, pointerDistanceY] =
      [evt.clientX - pointerXOnStart, evt.clientY - pointerYOnStart];

    const nextTargetTranslateX = targetTranslatedXOnStart + pointerDistanceX;
    const nextTargetTranslateY = targetTranslatedYOnStart + pointerDistanceY;

    const { targetTranslateX: revisedTranslateX, targetTranslateY: revisedTranslateY } =
      self.applyCorrection({
        targetTranslateX: nextTargetTranslateX,
        targetTranslateY: nextTargetTranslateY,
        targetWidthOnStart, targetHeightOnStart
      });

    self.targetTranslateX = revisedTranslateX;
    self.targetTranslateY = revisedTranslateY;

    self.dispatchEvent(new win.CustomEvent('translate', {
      detail: {
        targetTranslateX: revisedTranslateX,
        targetTranslateY: revisedTranslateY
      }
    }));
    self._dragRunning = false;
  });
}

const presetBoundingClientRect =
({ rectWidth, rectHeight, offsetX, offsetY }) =>
  ({ targetTranslateX, targetTranslateY, targetWidthOnStart, targetHeightOnStart }) => {
    const maxX = rectWidth - targetWidthOnStart;
    const maxY = rectHeight - targetHeightOnStart;
    const _offsetX = offsetX; // 5
    const _offsetY = offsetY; // -190
    const revisedTranslateX = Math.max(_offsetX, Math.min(targetTranslateX, maxX + _offsetX));
    const revisedTranslateY = Math.max(_offsetY, Math.min(targetTranslateY, maxY + _offsetY));

    return { targetTranslateX: revisedTranslateX, targetTranslateY: revisedTranslateY };
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

const presetCircle =
({ cx, cy, radius }) =>
  ({ targetTranslateX, targetTranslateY, targetWidthOnStart, targetHeightOnStart }) => {

};

const presetNoConstraint =
({ targetTranslateX, targetTranslateY }) => {
  return { targetTranslateX, targetTranslateY };
};

/*
TODO:
4.
steps ?
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
        return [...super.propertiesToUpgrade, 'applyCorrection', 'targetTranslateX', 'targetTranslateY', 'dragTarget', 'constraint'];
      }

      static get observedAttributes() {
        return [...super.observedAttributes, 'target-translate-x', 'target-translate-y', 'drag-target', 'constraint'];
      }

      constructor() {
        super();
        this._cachedTargetToDrag = null;
        this._dbuiDraggable = true;
      }

      /**
       * x translation of target
       * @return Number
       */
      get targetTranslateX() {
        return Number(this.getAttribute('target-translate-x')) || 0;
      }

      /**
       * x translation of target
       * @param value Number | String
       */
      set targetTranslateX(value) {
        const newValue = (Number(value) || 0).toString();
        this.setAttribute('target-translate-x', newValue);
      }

      /**
       * y translation of target
       * @return Number
       */
      get targetTranslateY() {
        return Number(this.getAttribute('target-translate-y')) || 0;
      }

      /**
       * y translation of target
       * @param value Number | String
       */
      set targetTranslateY(value) {
        const newValue = (Number(value) || 0).toString();
        this.setAttribute('target-translate-y', newValue);
      }

      /**
       * Selector of target to drag
       * @return String
       */
      get dragTarget() {
        return this.getAttribute('drag-target');
      }

      /**
       * Selector of target to drag
       * @param value String
       */
      set dragTarget(value) {
        this.setAttribute('drag-target', value.toString());
      }

      /**
       * Constraint preset to apply on dragging
       * @return String
       */
      get constraint() {
        return this.getAttribute('constraint');
      }

      /**
       * Constraint preset to apply on dragging
       * ex: boundingClientRectOf("selector")
       * circle(5, 7, 20)
       * @param value String
       */
      set constraint(value) {
        return this.setAttribute('constraint', value.toString());
      }

      get _constraintPreset() {
        if (this._constraintPresetCached) {
          return this._constraintPresetCached;
        }
        const constraint = this.constraint || '';
        switch (true) {
          case constraint.startsWith('boundingClientRectOf'): {
            const selector = constraint.match(/("|')(.+)(\1)/)[2];
            const constraintNode =
              selector === 'parent' ? this.parentElement : this.ownerDocument.querySelector(selector);
            const constraintsForBoundingClientRect =
              getConstraintsForBoundingClientRect(this, constraintNode);
            this._constraintPresetCached =
              presetBoundingClientRect({ ...constraintsForBoundingClientRect });
            break;
          }
          default:
            this._constraintPresetCached = presetNoConstraint;
        }
        return this._constraintPresetCached;
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
        targetToDrag.style.transform = `translate(${this.targetTranslateX}px,${this.targetTranslateY}px)`;
        targetToDrag.style.transformOrigin = 'center';
      }

      _resetTargetToDrag() {
        const targetToDrag = this._targetToDrag;
        targetToDrag.removeAttribute('dbui-draggable-target');
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
            valueToSet = (Number(newValue) || 0).toString();
            this._targetToDrag.style.transform = `translate(${valueToSet}px,${this.targetTranslateY}px)`;
            break;
          case 'target-translate-y':
            valueToSet = (Number(newValue) || 0).toString();
            this._targetToDrag.style.transform = `translate(${this.targetTranslateX}px,${valueToSet}px)`;
            break;
          case 'drag-target':
            this._resetTargetToDrag();
            this._initializeTargetToDrag();
            break;
          default:
            // pass
        }
      }

      /**
       * Can be overridden
       * @param targetTranslateX Number
       * @param targetTranslateY Number
       * @param targetWidthOnStart Number
       * @param targetHeightOnStart Number
       * @return Object {
       *  targetTranslateX: Number, targetTranslateY: Number
       * }
       */
      applyCorrection({ targetTranslateX, targetTranslateY, targetWidthOnStart, targetHeightOnStart }) {
        // different algorithms for different constraints/presets
        // if overridden by consumer the constraints/presets are ignored
        return this._constraintPreset({
          targetTranslateX, targetTranslateY,
          targetWidthOnStart, targetHeightOnStart
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

