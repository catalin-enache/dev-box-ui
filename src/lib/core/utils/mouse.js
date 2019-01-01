
const grace = 100;
let lastTimeStamp = 0;

// eslint-disable-next-line
export function getWheelDelta(wheelEvent, withMultiplier) {
  const delta = wheelEvent.deltaY < 0 ? -1 : 1;
  const currentTimeStamp = Math.round(wheelEvent.timeStamp);
  const diff = Math.min(grace, currentTimeStamp - lastTimeStamp);
  let acceleration = grace - diff;

  if (acceleration === 0 || !withMultiplier) {
    lastTimeStamp = currentTimeStamp;
    return delta;
  }

  acceleration = 12 * (1 / (grace / acceleration));
  // simulate some curve
  acceleration = Math.log2((acceleration + 1) * (acceleration + 1)) * 2;
  acceleration = Math.round(acceleration);

  const acceleratedDelta = acceleration * delta;
  lastTimeStamp = currentTimeStamp;
  return acceleratedDelta;
}
