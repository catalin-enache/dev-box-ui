'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

var _themeAware = require('../../HOC/themeAware');

var _themeAware2 = _interopRequireDefault(_themeAware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const style = ({ vars }) => {
  return {
    list: {
      // color: color(vars.colors.secondaryTextColor || 'orange').lighten(0.5).hex()
      color: vars.dir === 'ltr' ? 'green' : 'red'
    }
  };
};

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

exports.default = (0, _themeAware2.default)({ style })(List);