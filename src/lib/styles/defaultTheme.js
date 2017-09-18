import { jss } from 'react-jss';
import commonVars from './commonVars';
import commonAnimations from './commonAnimations';
import commonClasses from './commonClasses';

const defaultTheme = ['ltr', 'rtl'].reduce((acc, dir) => {
  const commonVarsDir = commonVars(dir);

  const commonAnimationsDir = jss.createStyleSheet(
    commonAnimations(commonVarsDir), {
      meta: `commonAnimations_${dir}`
    }
  ).attach();

  const commonClassesDir = jss.createStyleSheet(
    commonClasses(commonVarsDir), {
      meta: `commonClasses_${dir}`
    }
  ).attach();

  acc[dir] = {
    vars: commonVarsDir,
    animations: commonAnimationsDir.classes,
    common: commonClassesDir.classes
  };

  return acc;
}, {});

export default defaultTheme;

