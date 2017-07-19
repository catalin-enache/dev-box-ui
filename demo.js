import React from 'react';
import ReactDOM from 'react-dom';
import { Hello } from 'lib';
// const DBU = require('lib');

class App extends React.Component {
    render() {
        return (
            <Hello />
        );
    }
}

ReactDOM.render((
    <App />
), document.getElementById('app'));
