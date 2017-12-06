

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
