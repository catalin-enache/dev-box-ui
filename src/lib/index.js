import Hello from './components/Hello/Hello';
import List from './components/List/List';
import FormInputNumber from './components/FormInputNumber/FormInputNumber';
import onScreenConsole from './utils/onScreenConsole';
import localeService from './services/LocaleService';
import i18nService from './services/I18nService';
import { theming, createTheming } from './theming/theming';
import localeAware from './HOC/localeAware';
import themeAware from './HOC/themeAware';
import theme from './styles/theme';
import themeVars from './styles/themeVars';
import template from './utils/template';

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
