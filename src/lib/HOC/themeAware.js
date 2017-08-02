import React from 'react';
import injectSheet, { ThemeProvider } from 'react-jss';

const defaultTheme = {};

export default function themeAware({ theme = defaultTheme, styles } = {}) {
    return function themeAwareInner(Component) {
       class ThemeAware extends React.Component {
            render() {
                return(
                    <ThemeProvider theme={theme}>
                        <Component {...this.props} />
                    </ThemeProvider>
                );
            }
       }
       ThemeAware.displayName = `ThemeAware(${Component.displayName ||
           Component.name || 'Component'})`;
       return styles ? injectSheet(styles)(ThemeAware) : ThemeAware;
    }
}