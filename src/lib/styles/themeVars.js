
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
    formInputHeight: 26,
    formInputFontSize: 16,
    formInputPaddingStartEnd: 5,
    formInputBorderRadius: 0,
    formInputBorderTopWidth: 0,
    formInputBorderRightWidth: 0,
    formInputBorderBottomWidth: 1,
    formInputBorderLeftWidth: 0,
    formInputBorderTopLeftRadius: 0,
    formInputBorderTopRightRadius: 0,
    formInputBorderBottomLeftRadius: 0,
    formInputBorderBottomRightRadius: 0,
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
