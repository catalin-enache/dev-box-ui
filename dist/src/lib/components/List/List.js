'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class List extends _react2.default.Component {
    render() {
        return _react2.default.createElement(
            'ul',
            null,
            this.props.items.map(item => _react2.default.createElement(
                'li',
                { key: item },
                item
            ))
        );
    }
}

exports.default = List;
List.defaultProps = {
    items: []
};

List.propTypes = {
    items: _propTypes2.default.array
};