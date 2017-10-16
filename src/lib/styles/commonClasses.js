import grid from './grid/grid';
import form from './form/form';

const commonClasses = (commonVars) => {
  return {
    ...grid(commonVars),
    ...form(commonVars)
  };
};

export default commonClasses;
