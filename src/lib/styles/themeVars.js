
const borderRadius = 5;

const commonVars = dir => ({
  dir,
  colors: {
    primaryColor: 'green',
    secondaryColor: 'blue',
    formInputColor: 'black',
    formInputBorderColor: 'grey',
    formInputBackgroundColor: 'white'
  },
  dimensions: {
    borderRadius,
    formInputHeight: 26,
    formInputFontSize: 16,
    formInputPaddingStartEnd: 5,
    formInputBorderTopWidth: 0,
    formInputBorderRightWidth: 0,
    formInputBorderBottomWidth: 1,
    formInputBorderLeftWidth: 0,
    formInputBorderTopLeftRadius: borderRadius,
    formInputBorderTopRightRadius: borderRadius,
    formInputBorderBottomLeftRadius: borderRadius,
    formInputBorderBottomRightRadius: borderRadius,
  },
  grid: {
    breakpoints: {
      xs: '1px',
      s: '576px',
      m: '768px',
      l: '992px',
      xl: '1200px'
    },
    cols: 12
  }
});

export default commonVars;
