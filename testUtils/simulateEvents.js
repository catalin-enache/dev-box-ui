
/* eslint import/prefer-default-export: 0 */

// https://stackoverflow.com/questions/29018151/how-do-i-programmatically-create-a-touchevent-in-chrome-41
// https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/TouchEvent
// https://developer.mozilla.org/en-US/docs/Web/API/Touch/Touch
// https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/UIEvent
// https://developer.mozilla.org/en-US/docs/Web/API/Event/Event
export function sendTouchEvent(element, eventType, {
  cancelable = true, bubbles = true, composed = true,
  identifier = Date.now(),
  clientX = 0, clientY = 0, screenX, screenY, pageX, pageY,
  radiusX = 2.5, radiusY = 2.5, rotationAngle = 10, force = 0.5,
  // if !element.ownerDocument then element is document
  view = (element.ownerDocument || element).defaultView,
  detail,
  target = element,
  ctrlKey, shiftKey, altKey, metaKey,
} = {}) {
  const touchObj = new Touch({
    identifier, target,
    clientX, clientY, screenX, screenY, pageX, pageY,
    radiusX, radiusY, rotationAngle, force
  });

  const touchEvent = new TouchEvent(eventType, {
    cancelable, bubbles, composed,
    touches: [touchObj],
    targetTouches: [],
    changedTouches: [touchObj],
    view, detail,
    ctrlKey, shiftKey, altKey, metaKey,
  });

  element.dispatchEvent(touchEvent);
}

// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/MouseEvent
// https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/UIEvent
// https://developer.mozilla.org/en-US/docs/Web/API/Event/Event
export function sendMouseEvent(element, eventType, {
  cancelable = true, bubbles = true, composed = true,
  clientX = 0, clientY = 0, screenX, screenY,
  ctrlKey, shiftKey, altKey, metaKey,
  button, buttons,
  relatedTarget, region,
  // if !element.ownerDocument then element is document
  view = (element.ownerDocument || element).defaultView,
  detail = 0,
} = {}) {
  const mouseEvent = new MouseEvent(eventType, {
    cancelable, bubbles, composed,
    clientX, clientY, screenX, screenY,
    ctrlKey, shiftKey, altKey, metaKey,
    button, buttons,
    relatedTarget, region,
    view, detail,
  });

  element.dispatchEvent(mouseEvent);
}

export function sendTapEvent(element, eventType, {
  cancelable, bubbles, composed,
  clientX, clientY, screenX, screenY,
  ctrlKey, shiftKey, altKey, metaKey,
  view, detail
} = {}) {
  const _eventType = (MouseEvent ? {
    start: 'mousedown',
    move: 'mousemove',
    end: 'mouseup'
  } : {
    start: 'touchstart',
    move: 'touchmove',
    end: 'touchend'
  })[eventType];

  const func = MouseEvent ? sendMouseEvent : sendTouchEvent;

  const commonProps = {
    cancelable, bubbles, composed,
    clientX, clientY, screenX, screenY,
    ctrlKey, shiftKey, altKey, metaKey,
    view, detail,
  };

  func(element, _eventType, {
    ...commonProps,
    ...(MouseEvent ? { button: 0, buttons: 0 } : {})
  });
}
