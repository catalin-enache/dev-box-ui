import { createTheming } from 'theming';

const theming = createTheming('__DBU_THEMING__');

const { channel, withTheme, ThemeProvider, themeListener } = theming;

export {
  channel,
  withTheme,
  ThemeProvider,
  themeListener,
};