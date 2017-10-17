import grid from './grid/grid';
import form from './form/form';
import utils from './utils/utils';

const commonClasses = (themeVars) => {
  return {
    ...grid(themeVars),
    ...form(themeVars),
    ...utils(themeVars)
  };
};

export default commonClasses;
