

const formInput = (themeVars) => {
  const {
    dimensions: {
      formInputHeight,
      formInputBorderWidth,
      formInputPaddingStartEnd,
      formInputFontSize
    },
    colors: {
      formInputColor,
      formInputBorderColor,
      formInputBackgroundColor
    }
  } = themeVars;
  return {
    width: '100%',
    height: formInputHeight,
    padding: `0px ${formInputPaddingStartEnd}px`,
    fontSize: formInputFontSize,
    boxSizing: 'border-box',
    color: formInputColor,
    backgroundColor: formInputBackgroundColor,
    borderTop: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    borderBottom: `${formInputBorderWidth}px solid ${formInputBorderColor}`,
    '&:focus': {
      outline: 'none'
    }
  };
};

export default function form(themeVars) {
  return {
    formInput: formInput(themeVars)
  };
}
