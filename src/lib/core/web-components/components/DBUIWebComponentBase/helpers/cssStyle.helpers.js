import DBUICommonCssVars from '../DBUICommonCssVars';
import DBUICommonCssClasses from '../DBUICommonCssClasses';
import { booleanAttributeValue } from '../constants';

const cssMap = {
  'dbui-common-css-vars': DBUICommonCssVars,
  'dbui-common-css-classes': DBUICommonCssClasses,
};

export function defineCommonCSS(win) {
  const { document } = win;
  Object.keys(cssMap).forEach((key) => {
    const commonStyle = document.createElement('style');
    commonStyle.setAttribute(key, booleanAttributeValue);
    commonStyle.innerHTML = cssMap[key];
    document.querySelector('head').appendChild(commonStyle);
  });
}

/* istanbul ignore next */
export function defineComponentCssVars(win, cssVars) {
  const { document } = win;
  const commonCSSVarsStyleNode = document.querySelector('[dbui-common-css-vars]');
  commonCSSVarsStyleNode.innerHTML += cssVars;
}

/* istanbul ignore next */
export function defineComponentCssClasses(win, cssClasses) {
  const { document } = win;
  const commonCSSClassesStyleNode = document.querySelector('[dbui-common-css-classes]');
  commonCSSClassesStyleNode.innerHTML += cssClasses;
}
