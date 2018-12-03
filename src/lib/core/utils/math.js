
// eslint-disable-next-line
export const trunc = (precision) => (number) => (
  (+number * (10 ** precision)).toFixed(1).split('.')[0] / (10 ** precision)
);
