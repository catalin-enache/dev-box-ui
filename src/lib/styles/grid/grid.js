
export default function grid(themeVars) {
  const { dir, grid: { cols, breakpoints } } = themeVars;
  const start = dir === 'ltr' ? 'left' : 'right';
  /*  eslint no-unused-vars: 0 */
  const end = dir === 'ltr' ? 'right' : 'left';

  return {
    clearfix: {
      zoom: 1,
      '&:before, &:after': {
        content: '""',
        display: 'table'
      },
      '&:after': {
        clear: 'both'
      }
    },
    row: {
      extend: 'clearfix'
    },
    col: {
      float: start,
      textAlign: start,
      width: '100%'
    },
    ...Object.keys(breakpoints).reduce((acc, key) => {
      return Array.from({ length: cols })
        .map((el, i) => i + 1)
        .reduce((acc, i) => {
          acc[`${key}${i}`] = {
            [`@media (min-width: ${breakpoints[key]})`]: {
              width: `${(i / cols) * 100}%`
            }
          };
          return acc;
        }, acc);
    }, {})
  };
}
