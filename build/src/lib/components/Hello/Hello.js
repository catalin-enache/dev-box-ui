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

var _reactJss = require('react-jss');

var _reactJss2 = _interopRequireDefault(_reactJss);

var _withThemeWrapper = require('../../HOC/withThemeWrapper');

var _withThemeWrapper2 = _interopRequireDefault(_withThemeWrapper);

var _spinner = require('react-icons/lib/fa/spinner');

var _spinner2 = _interopRequireDefault(_spinner);

var _commonStyles = require('../../../styles/commonStyles');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const styles = theme => Object.assign({}, (0, _commonStyles.getCommonStyles)(), {
    hello: {
        color: theme.primaryTextColor || 'orange'
    }
});

class Hello extends _react2.default.Component {
    render() {
        if (process.env.NODE_ENV !== 'production') {
            console.log('rendering Hello component');
        }
        return _react2.default.createElement(
            'div',
            { className: this.props.classes.hello },
            'Hello ',
            this.props.name || 'Nobody',
            _react2.default.createElement(_spinner2.default, { className: this.props.classes.faSpin }),
            _react2.default.createElement(_List2.default, { items: ['one', 'two'] })
        );
    }
}

Hello.propTypes = {
    name: _propTypes2.default.string.isRequired,
    classes: _propTypes2.default.object
};

exports.default = (0, _withThemeWrapper2.default)({})((0, _reactJss2.default)(styles)(Hello));