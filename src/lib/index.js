// Utils
import template from './utils/template';
import onScreenConsole from './utils/onScreenConsole';

// Services
import localeService from './services/LocaleService';
import i18nService from './services/I18nService';

// HOC
import localeAware from './HOC/localeAware';
import themeAware from './HOC/themeAware';

// Theme
import theme from './styles/theme';
import themeVars from './styles/themeVars';

// Theming
import { theming, createTheming } from './theming/theming';

// Components
import Hello from './components/Hello/Hello';
import List from './components/List/List';
import FormInputNumber from './components/FormInputNumber/FormInputNumber';


export {
  // Utils
  template,
  onScreenConsole,

  // Services
  localeService,
  i18nService,

  // HOC
  localeAware,
  themeAware,

  // Theme
  themeVars,
  theme,

  // Theming
  theming,
  createTheming,

  // Components
  Hello,
  List,
  FormInputNumber
};
