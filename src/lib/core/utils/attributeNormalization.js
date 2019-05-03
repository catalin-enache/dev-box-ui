
export const setBooleanAttribute = (value, name, self) => {
  const newValue = !!value;
  newValue && self.setAttribute(name, '');
  !newValue && self.removeAttribute(name);
};

export const getBooleanAttribute = (name, self) => {
  return self.getAttribute(name) !== null;
};


const _getValue = (value, _default = 0) => {
  return [undefined, null, NaN, ''].includes(value) ? _default : (+value || _default);
};

export const numberBetween = (value, min, max, _default = 0) => {
  const _value = _getValue(value, _default || min);
  const newValue = _value > max ? max : _value < min ? min : _value;
  return newValue;
};

export const positiveIntegerIncludingZero = (value, _default = 0) => {
  const _value = _getValue(value, _default);
  const newValue = Math.abs(Math.round(_value));
  return newValue;
};

export const enumeration = (value, allowedValues, _default = '') => {
  const _value = allowedValues.includes(value) ? value : _default;
  return _value;
};

