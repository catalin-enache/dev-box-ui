import React from 'react';
import ReactDOM from 'react-dom';
// import DBU from './src/index';
const DBU = require('./src/index');

class App extends React.Component {
    render() {
        return (
            <DBU.Hello name="John" />
        );
    }
}

ReactDOM.render((
    <App />
), document.getElementById('app'));
