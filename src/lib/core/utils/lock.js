
const map = new WeakMap();

// eslint-disable-next-line
export const withLock = (target, lockFlag, callback) => {
  !map.get(target) && map.set(target, {});
  const flags = map.get(target);
  if (flags[lockFlag]) return;
  flags[lockFlag] = true;
  callback();
  delete flags[lockFlag];
};
