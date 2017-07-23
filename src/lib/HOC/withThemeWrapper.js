import React from 'react';
import { ThemeProvider } from 'react-jss';

export default function withThemeWrapper(theme) {
    return function (Component) {
       return class extends React.Component {
            render() {
                return(
                    <ThemeProvider theme={theme}>
                        <Component {...this.props} />
                    </ThemeProvider>
                );
            }
       }
    }
}