import { jss } from 'react-jss';
import commonAnimations from './commonAnimations';
import commonVars from './commonVars';

const animations = jss.createStyleSheet(commonAnimations, {
  meta: 'commonAnimations'
}).attach();

const defaultTheme = {
  vars: commonVars,
  animations: animations.classes
};

export default defaultTheme;

