import { jss } from 'react-jss';
import commonAnimations from './commonAnimations';

const animations = jss.createStyleSheet(commonAnimations, {
  meta: 'commonAnimations'
}).attach();

const defaultTheme = {
  primaryTextColor: 'green',
  secondaryTextColor: 'blue',
  animations: animations.classes
};

export default defaultTheme;

