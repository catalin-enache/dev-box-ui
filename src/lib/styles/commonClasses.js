import commonVars from './commonVars';

const { grid: { cols, breakpoints } } = commonVars;

const commonClasses = {
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
    float: 'left',
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

export default commonClasses;
