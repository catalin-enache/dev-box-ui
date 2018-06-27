
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
 * @return { startX, startY, translateX, translateY }
 */
function getMeasurements(evt) {
  const self = evt.currentTarget;
  const win = self.ownerDocument.defaultView;
  const nodeComputedStyle = win.getComputedStyle(self, null);
  const extractedEvent = extractSingleEvent(evt);
  const { clientX: startX, clientY: startY } = extractedEvent;
  const matrix = nodeComputedStyle.transform.match(/-?\d*\.?\d+/g).map(Number);
  const [translateX, translateY] = [matrix[4], matrix[5]];
  const ret = {
    startX, startY, translateX, translateY
  };
  return ret;
}

/**
 *
 * @param evt MouseEvent always coming from Draggable
 */
function handleMouseDown(evt) {
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
      startX, startY, translateX, translateY
    } = self._measurements;
    const [distanceX, distanceY] = [evt.clientX - startX, evt.clientY - startY];

    const nextTranslateX = translateX + distanceX;
    const nextTranslateY = translateY + distanceY;

    self._translateX = nextTranslateX;
    self._translateY = nextTranslateY;
    self.style.transform = `translate(${self._translateX}px,${self._translateY}px)`;
    self._dragRunning = false;
  });
}

export default function getDBUIDraggable(win) {
  return ensureSingleRegistration(win, registrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = getDBUIWebComponentCore(win);

    onScreenConsole();

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
            position: absolute;
            display: inline-block;
            border: 1px solid blue;
          }
          </style>
          <slot></slot>
        `;
      }

      static get observedAttributes() {
        return [...super.observedAttributes, 'translate', 'rotate', 'transformOrigin'];
      }

      constructor() {
        super();
        this._dbuiDraggable = true;
        this._translateX = 0;
        this._translateY = 0;
        this._originX = 0;
        this._originY = 0;
        this._rotate = 0;
      }

      onConnectedCallback() {
        this.setAttribute('unselectable', '');
        this.addEventListener('mousedown', handleMouseDown, eventOptions);
        this.addEventListener('touchstart', handleTouchStart, eventOptions);
        this.style.transform = `translate(${0}px, ${0}px) rotate(${0}deg)`;
        this.style.transformOrigin = 'center';
      }

      onDisconnectedCallback() {
        this.removeAttribute('unselectable');
        this.removeEventListener('mousedown', handleMouseDown, eventOptions);
        this.removeEventListener('touchstart', handleTouchStart, eventOptions);
      }

      onAttributeChangedCallback() {
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

