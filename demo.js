import React from 'react';
import ReactDOM from 'react-dom';
import { Hello } from 'dev-box-ui';
import { ThemeProvider } from 'react-jss';

const theme = {
    primaryTextColor: 'green',
    secondaryTextColor: 'blue'
};

class App extends React.Component {
    render() {
        return (
            <Hello />
        );
    }
}

ReactDOM.render((
    <ThemeProvider theme={theme}>
        <App />
    </ThemeProvider>
), document.getElementById('app'));
