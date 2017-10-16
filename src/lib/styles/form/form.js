

const formInput = (themeVars) => {
  const {
    dimensions: {
      formInputHeight,
      formInputBorderTopWidth,
      formInputBorderRightWidth,
      formInputBorderBottomWidth,
      formInputBorderLeftWidth,
      formInputBorderTopLeftRadius,
      formInputBorderTopRightRadius,
      formInputBorderBottomLeftRadius,
      formInputBorderBottomRightRadius,
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
    borderTop: `${formInputBorderTopWidth}px solid ${formInputBorderColor}`,
    borderRight: `${formInputBorderRightWidth}px solid ${formInputBorderColor}`,
    borderLeft: `${formInputBorderLeftWidth}px solid ${formInputBorderColor}`,
    borderBottom: `${formInputBorderBottomWidth}px solid ${formInputBorderColor}`,
    borderTopLeftRadius: formInputBorderTopLeftRadius,
    borderTopRightRadius: formInputBorderTopRightRadius,
    borderBottomLeftRadius: formInputBorderBottomLeftRadius,
    borderBottomRightRadius: formInputBorderBottomRightRadius,
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
