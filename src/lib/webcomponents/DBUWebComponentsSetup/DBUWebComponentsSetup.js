
window.DBUWebComponents = {
  'dbu-web-component-dummy': {
    componentStyle: `
       b {
        color: orange;
        font-style: oblique;
        }
    `
  }
};

const appendStyle = (win) => (componentName, componentStyle) => {
  if (!win.DBUWebComponents) {
    win.DBUWebComponents = {};
  }
  win.DBUWebComponents = {
    ...win.DBUWebComponents,
    [componentName]: {
      ...win.DBUWebComponents[componentName],
      componentStyle
    }
  };
};

export default function dbuWebComponentsSetUp(win) {
  return {
    appendStyle: appendStyle(win)
  };
}
