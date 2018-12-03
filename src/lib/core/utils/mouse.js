
// eslint-disable-next-line
export function getWheelDelta(wheelEvent, withMultiplier = {
  ctrlAlt: 20,
  ctrl: 5,
  alt: 10
}) {
  console.log(withMultiplier)
  const delta = wheelEvent.deltaY < 0 ? 1 : -1;
  const multiplier = !withMultiplier ? 1 :
    wheelEvent.ctrlKey && wheelEvent.altKey ? withMultiplier.ctrlAlt :
      wheelEvent.ctrlKey ? withMultiplier.ctrl :
        wheelEvent.altKey ? withMultiplier.alt : 1;
  return multiplier * delta;
}
