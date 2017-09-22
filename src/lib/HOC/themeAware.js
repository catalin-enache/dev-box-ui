import React from 'react';
import injectSheet from 'react-jss';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { theming } from '../theming/theming';


const { ThemeProvider } = theming;

export default function themeAware({ theme, style }) {
  return function themeAwareInner(Component) {
    const ToRender = style ? injectSheet(style, { theming })(Component) : Component;

    class ThemeAware extends React.PureComponent {
      render() {
        return (
          theme ?
            <ThemeProvider theme={ theme }>
              <ToRender { ...this.props } />
            </ThemeProvider> :
            <ToRender { ...this.props } />
        );
      }
    }

    ThemeAware.displayName = `ThemeAware(${
      Component.displayName ||
      Component.name ||
      'Component'
    })`;

    return hoistNonReactStatics(ThemeAware, Component);
  };
}
