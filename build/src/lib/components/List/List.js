'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactJss = require('react-jss');

var _reactJss2 = _interopRequireDefault(_reactJss);

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

var _withThemeWrapper = require('../../HOC/withThemeWrapper');

var _withThemeWrapper2 = _interopRequireDefault(_withThemeWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const styles = theme => ({
    list: {
        color: (0, _color2.default)(theme.secondaryTextColor || 'orange').lighten(0.5).hex()
    }
});

class List extends _react2.default.Component {
    render() {
        return _react2.default.createElement(
            'ul',
            { className: this.props.classes.list },
            this.props.items.map(item => _react2.default.createElement(
                'li',
                { key: item },
                item
            ))
        );
    }
}

List.defaultProps = {
    items: []
};

List.propTypes = {
    items: _propTypes2.default.array,
    classes: _propTypes2.default.object
};

exports.default = (0, _withThemeWrapper2.default)({})((0, _reactJss2.default)(styles)(List));