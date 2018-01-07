/*
DBUIWebComponentBase (from which all web-components inherit)
will read componentStyle from win.DBUIWebComponents
when klass.registerSelf() is called giving a chance to override default web-component style
just before it is registered.
*/
const appendStyle = (win) => (registrationName, componentStyle) => {
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

export default appendStyle;
