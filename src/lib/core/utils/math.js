
const STEP_PRECISION = 4;

export const trunc = (precision) => (number) => (
  (+number * (10 ** precision)).toFixed(1).split('.')[0] / (10 ** precision)
);

/**
 * @param min Number
 * @param max Number
 * @param current Number
 * @param steps Number (optional)
 * @return { value: Number, index: Number (if steps >= 2), percent: Number }
 */
export const getStep = (min, max, current, steps) => {
  const _steps = Number(steps);
  const interval = max - min;

  let percent = null;

  if (!_steps || _steps < 2) {
    percent = +(((current - min) / interval) || 0).toFixed(STEP_PRECISION);
    return { value: current, percent };
  }

  const stepSize = interval / (_steps - 1);
  const allSteps = [];
  let minDist = Infinity;
  let idx = null;
  for (let i = 1; i <= _steps; i += 1) {
    if (i === 1) {
      allSteps.push(min);
    } else if (i === _steps) {
      allSteps.push(max);
    } else {
      allSteps.push(min + ((i - 1) * stepSize));
    }
    if (Math.abs(allSteps[i - 1] - current) < minDist) {
      minDist = Math.abs(allSteps[i - 1] - current);
      idx = i - 1;
    }
  }
  const stepValue = +allSteps[idx].toFixed(STEP_PRECISION);
  percent = +(((stepValue - min) / interval) || 0).toFixed(STEP_PRECISION);
  return { value: allSteps[idx], index: idx, percent };
};
