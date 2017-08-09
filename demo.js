import React from 'react';
import ReactDOM from 'react-dom';
import { Hello, List, ThemeProvider, defaultTheme } from 'dev-box-ui';

const customTheme = {
    primaryTextColor: 'brown',
    secondaryTextColor: 'green'
};

class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            theme: defaultTheme
        }
    }

    componentDidMount() {
        setInterval(() => {
            this.setState({
                theme: this.state.theme === defaultTheme ?
                    customTheme :
                    defaultTheme
            })
        }, 1000);
    }

    render() {
        return (
            <ThemeProvider theme={this.state.theme}>
                <div>
                    <Hello />
                    <Hello />
                    <Hello />
                    <List items={['three', 'four']} />
                    <List items={['three', 'four']} />
                </div>
            </ThemeProvider>
        );
    }
}

ReactDOM.render((
    <App />
), document.getElementById('app'));
