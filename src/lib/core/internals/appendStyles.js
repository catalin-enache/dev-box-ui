/*
DBUIWebComponentBase (from which all web-components inherit)
will read componentStyle from win.DBUIWebComponents
when klass.registerSelf() is called giving a chance to override default web-component style
just before it is registered.
*/
export const _appendStyle = (win) => (registrationName, componentStyle) => {
  if (!win.DBUIWebComponents) {
    win.DBUIWebComponents = {};
  }
  win.DBUIWebComponents = {
    ...win.DBUIWebComponents,
    [registrationName]: {
      ...win.DBUIWebComponents[registrationName],
      componentStyle
    }
  };
};

const appendStyles = (win) => (components) => {
  components.forEach(({ registrationName, componentStyle }) => {
    _appendStyle(win)(registrationName, componentStyle);
  });
  return components;
};

export default appendStyles;
