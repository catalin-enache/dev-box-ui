
import getDBUIWebComponentCore from '../DBUIWebComponentCore/DBUIWebComponentCore';
import ensureSingleRegistration from '../../../internals/ensureSingleRegistration';
import onScreenConsole from '../../../utils/onScreenConsole';

const registrationName = 'dbui-draggable';

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
 * @return { startX, startY, translateX, translateY, width, height }
 */
function getMeasurements(evt) {
  const self = evt.currentTarget;
  const win = self.ownerDocument.defaultView;
  const targetToDrag = self._targetToDrag;

  const nodeComputedStyle = win.getComputedStyle(targetToDrag, null);
  const matrix = nodeComputedStyle.transform.match(/-?\d*\.?\d+/g).map(Number);
  const boundingRect = targetToDrag.getBoundingClientRect();
  const extractedEvent = extractSingleEvent(evt);

  const { width, height } = boundingRect;
  const { clientX: startX, clientY: startY } = extractedEvent;
  const [translateX, translateY] = [matrix[4], matrix[5]];

  return {
    startX, startY, translateX, translateY, width, height
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
      startX, startY, translateX, translateY, width, height
    } = self._measurements;
    const [distanceX, distanceY] = [evt.clientX - startX, evt.clientY - startY];

    const nextTranslateX = translateX + distanceX;
    const nextTranslateY = translateY + distanceY;

    const { translateX: revisedTranslateX, translateY: revisedTranslateY } =
      self.applyCorrection({ translateX: nextTranslateX, translateY: nextTranslateY, width, height });

    self.translateX = revisedTranslateX;
    self.translateY = revisedTranslateY;

    self.dispatchEvent(new win.CustomEvent('translate', {
      detail: {
        translateX: revisedTranslateX,
        translateY: revisedTranslateY
      }
    }));
    self._dragRunning = false;
  });
}

/*
TODO:
3.
predefined constraints
4.
steps ?
*/

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
          }
          
          :host([dbui-dir=rtl]) {
          }
          </style>
          <slot></slot>
        `;
      }

      static get propertiesToUpgrade() {
        return [...super.propertiesToUpgrade, 'applyCorrection', 'translateX', 'translateY', 'dragTarget'];
      }

      static get observedAttributes() {
        return [...super.observedAttributes, 'translate-x', 'translate-y', 'drag-target'];
      }

      constructor() {
        super();
        this._cachedTargetToDrag = null;
        this._dbuiDraggable = true;
      }

      get translateX() {
        return Number(this.getAttribute('translate-x')) || 0;
      }

      set translateX(value) {
        const newValue = (Number(value) || 0).toString();
        this.setAttribute('translate-x', newValue);
      }

      get translateY() {
        return Number(this.getAttribute('translate-y')) || 0;
      }

      set translateY(value) {
        const newValue = (Number(value) || 0).toString();
        this.setAttribute('translate-y', newValue);
      }

      get dragTarget() {
        return this.getAttribute('drag-target');
      }

      set dragTarget(value) {
        this.setAttribute('drag-target', value.toString());
      }

      get _targetToDrag() {
        if (this._cachedTargetToDrag) return this._cachedTargetToDrag;
        const targetToDrag =
          this.getRootNode().querySelector(this.getAttribute('drag-target')) || this;
        this._cachedTargetToDrag = targetToDrag;
        return this._cachedTargetToDrag;
      }

      _initializeTargetToDrag() {
        this._cachedTargetToDrag = null; // needed when drag-target attribute changes
        const targetToDrag = this._targetToDrag;
        targetToDrag.setAttribute('dbui-draggable-target', '');
        targetToDrag.style.transform = `translate(${this.translateX}px,${this.translateY}px)`;
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
          case 'translate-x':
            valueToSet = (Number(newValue) || 0).toString();
            this._targetToDrag.style.transform = `translate(${valueToSet}px,${this.translateY}px)`;
            break;
          case 'translate-y':
            valueToSet = (Number(newValue) || 0).toString();
            this._targetToDrag.style.transform = `translate(${this.translateX}px,${valueToSet}px)`;
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
       * @param translateX Number
       * @param translateY Number
       * @return Object { translateX: Number, translateY: Number }
       */
      applyCorrection({ translateX, translateY }) {
        return { translateX, translateY };
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

