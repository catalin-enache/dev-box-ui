import { jss } from 'react-jss';
import commonAnimations from './commonAnimations';
import commonVars from './commonVars';
import commonClasses from './commonClasses';

const animations = jss.createStyleSheet(commonAnimations, {
  meta: 'commonAnimations'
}).attach();

const common = jss.createStyleSheet(commonClasses, {
  meta: 'commonClasses'
}).attach();

const defaultTheme = {
  vars: commonVars,
  animations: animations.classes,
  common: common.classes
};

export default defaultTheme;

