import grid from './grid/grid';
import form from './form/form';

const commonClasses = (themeVars) => {
  return {
    ...grid(themeVars),
    ...form(themeVars)
  };
};

export default commonClasses;
