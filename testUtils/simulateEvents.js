
/*
EventInit: bubbles, cancelable, composed
UIEventInit: detail, view, sourceCapabilities
MouseEventInit: screenX, screenY, clientX, clientY, ctrlKey, shiftKey, altKey, metaKey, button, buttons,
                relatedTarget, region
TouchEventInit: touches, targetTouches, changedTouches, ctrlKey, shiftKey, altKey, metaKey
TouchInit: identifier, target, clientX, clientY, screenX, screenY, pageX, pageY, radiusX, radiusY, rotationAngle, force
The TouchEventInit dictionary also accepts fields from UIEventInit and from EventInit dictionaries.
The MouseEventInit dictionary also accepts fields from UIEventInit and from EventInit dictionaries.

https://stackoverflow.com/questions/29018151/how-do-i-programmatically-create-a-touchevent-in-chrome-41
https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/TouchEvent
https://developer.mozilla.org/en-US/docs/Web/API/Touch/Touch
https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/UIEvent
https://developer.mozilla.org/en-US/docs/Web/API/Event/Event
*/

export function sendTouchEvent(element, eventType, {
  cancelable = true, bubbles = true, composed = true,
  identifier = Date.now(),
  clientX = 0, clientY = 0, screenX, screenY, pageX, pageY,
  radiusX = 2.5, radiusY = 2.5, rotationAngle = 10, force = 0.5,
  // if !element.ownerDocument then element is document
  view = (element.ownerDocument || element).defaultView,
  detail,
  target,
  ctrlKey, shiftKey, altKey, metaKey,
} = {}) {
  const touchObj = new view.Touch({
    identifier,
    target: target || element,
    clientX, clientY, screenX, screenY, pageX, pageY,
    radiusX, radiusY, rotationAngle, force
  });

  const touchEvent = new view.TouchEvent(eventType, {
    cancelable, bubbles, composed,
    touches: [touchObj],
    targetTouches: [],
    changedTouches: [touchObj],
    view, detail,
    ctrlKey, shiftKey, altKey, metaKey,
  });

  (target || element).dispatchEvent(touchEvent);
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
  target,
  // if !element.ownerDocument then element is document
  view = (element.ownerDocument || element).defaultView,
  detail = 0,
} = {}) {
  const mouseEvent = new view.MouseEvent(eventType, {
    cancelable, bubbles, composed,
    clientX, clientY, screenX, screenY,
    ctrlKey, shiftKey, altKey, metaKey,
    button, buttons,
    relatedTarget, region,
    view, detail,
  });

  (target || element).dispatchEvent(mouseEvent);
}

export function sendTapEvent(element, eventType, {
  cancelable, bubbles, composed,
  clientX, clientY, screenX, screenY,
  ctrlKey, shiftKey, altKey, metaKey,
  view = (element.ownerDocument || element).defaultView,
  detail, target, relatedTarget
} = {}) {
  // target is not an init param, it is determined by the caller of dispatchEvent
  // currentTarget is the listener of the event (who called addEventListener with a listener that received the event)
  const _eventType = (view.MouseEvent ? {
    start: 'mousedown',
    move: 'mousemove',
    end: 'mouseup'
  } : {
    start: 'touchstart',
    move: 'touchmove',
    end: 'touchend'
  })[eventType];

  const func = view.MouseEvent ? sendMouseEvent : sendTouchEvent;

  const commonProps = {
    cancelable, bubbles, composed,
    clientX, clientY, screenX, screenY,
    ctrlKey, shiftKey, altKey, metaKey,
    view, detail, target
  };

  func(element, _eventType, {
    ...commonProps,
    ...(view.MouseEvent ? { button: 0, buttons: 0, relatedTarget } : {})
  });
}
