'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = form;


const formInput = commonVars => {
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
  } = commonVars;
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

function form(commonVars) {
  return {
    formInput: formInput(commonVars)
  };
}