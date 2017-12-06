"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = dbuWebComponentsSetUp;


const appendStyle = win => (componentName, componentStyle) => {
  if (!win.DBUWebComponents) {
    win.DBUWebComponents = {};
  }
  win.DBUWebComponents = Object.assign({}, win.DBUWebComponents, {
    [componentName]: Object.assign({}, win.DBUWebComponents[componentName], {
      componentStyle
    })
  });
};

function dbuWebComponentsSetUp(win) {
  return {
    appendStyle: appendStyle(win)
  };
}