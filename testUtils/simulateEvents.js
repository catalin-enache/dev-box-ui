
/* eslint import/prefer-default-export: 0 */

// https://stackoverflow.com/questions/29018151/how-do-i-programmatically-create-a-touchevent-in-chrome-41
export function sendTouchEvent(x, y, element, eventType) {
  const touchObj = new Touch({
    identifier: Date.now(),
    target: element,
    clientX: x,
    clientY: y,
    radiusX: 2.5,
    radiusY: 2.5,
    rotationAngle: 10,
    force: 0.5,
  });

  const touchEvent = new TouchEvent(eventType, {
    cancelable: true,
    bubbles: true,
    touches: [touchObj],
    targetTouches: [],
    changedTouches: [touchObj],
    shiftKey: true,
  });

  element.dispatchEvent(touchEvent);
}
