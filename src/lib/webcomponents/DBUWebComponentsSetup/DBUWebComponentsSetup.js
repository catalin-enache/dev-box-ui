
/*
DBUWebComponentBase (from which all web-components inherit)
will read componentStyle from win.DBUWebComponents
when klass.registerSelf() is called giving a chance to override default web-component style
just before it is registered.
*/
const appendStyle = (win) => (registrationName, componentStyle) => {
  if (!win.DBUWebComponents) {
    win.DBUWebComponents = {};
  }
  win.DBUWebComponents = {
    ...win.DBUWebComponents,
    [registrationName]: {
      ...win.DBUWebComponents[registrationName],
      componentStyle
    }
  };
};

export default function dbuWebComponentsSetUp(win) {
  return {
    appendStyle: appendStyle(win)
  };
}
