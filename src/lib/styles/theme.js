import { jss } from 'react-jss';
import commonAnimations from './commonAnimations';
import commonClasses from './commonClasses';

const theme = (themeVars) => ['ltr', 'rtl'].reduce((acc, dir) => {
  const themeVarsDir = themeVars(dir);

  const commonAnimationsDir = jss.createStyleSheet(
    commonAnimations(themeVarsDir), {
      meta: `commonAnimations_${dir}`
    }
  ).attach();

  const commonClassesDir = jss.createStyleSheet(
    commonClasses(themeVarsDir), {
      meta: `commonClasses_${dir}`
    }
  ).attach();

  acc[dir] = {
    vars: themeVarsDir,
    animations: commonAnimationsDir.classes,
    common: commonClassesDir.classes
  };

  return acc;
}, {});

export default theme;

