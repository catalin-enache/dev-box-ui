'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _List = require('../List/List');

var _List2 = _interopRequireDefault(_List);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Hello extends _react2.default.Component {
    render() {
        if (process.env.NODE_ENV !== 'production') {
            console.log('rendering Hello component');
        }
        return _react2.default.createElement(
            'div',
            null,
            'Hello ',
            this.props.name || 'Nobody',
            _react2.default.createElement(_List2.default, { items: ['one', 'two'] })
        );
    }
}

exports.default = Hello;
Hello.propTypes = {
    name: _propTypes2.default.string.isRequired
};