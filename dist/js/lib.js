require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lib = require('lib');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Hello extends _react2.default.Component {
    render() {
        return _react2.default.createElement(
            'div',
            null,
            'Hello ',
            this.props.name || 'Nobody',
            _react2.default.createElement(_lib.List, { items: ['one', 'two'] })
        );
    }
}

exports.default = Hello;
Hello.propTypes = {
    name: _propTypes2.default.string.isRequired
};

},{"lib":"lib","prop-types":"prop-types","react":"react"}],2:[function(require,module,exports){
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

},{"prop-types":"prop-types","react":"react"}],"lib":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.List = exports.Hello = undefined;

var _Hello = require('lib/components/Hello/Hello');

var _Hello2 = _interopRequireDefault(_Hello);

var _List = require('lib/components/List/List');

var _List2 = _interopRequireDefault(_List);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Hello = _Hello2.default;
exports.List = _List2.default;

},{"lib/components/Hello/Hello":1,"lib/components/List/List":2}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL2NvbXBvbmVudHMvSGVsbG8vSGVsbG8uanMiLCJzcmMvbGliL2NvbXBvbmVudHMvTGlzdC9MaXN0LmpzIiwiaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7QUNDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFZSxNQUFNLEtBQU4sU0FBb0IsZ0JBQU0sU0FBMUIsQ0FBb0M7QUFDL0MsYUFBUztBQUNMLGVBQ0k7QUFBQTtBQUFBO0FBQUE7QUFDVyxpQkFBSyxLQUFMLENBQVcsSUFBWCxJQUFtQixRQUQ5QjtBQUVJLHVEQUFNLE9BQU8sQ0FBQyxLQUFELEVBQVEsS0FBUixDQUFiO0FBRkosU0FESjtBQU1IO0FBUjhDOztrQkFBOUIsSztBQVdyQixNQUFNLFNBQU4sR0FBa0I7QUFDaEIsVUFBTSxvQkFBVSxNQUFWLENBQWlCO0FBRFAsQ0FBbEI7Ozs7Ozs7OztBQ2ZBOzs7O0FBQ0E7Ozs7OztBQUVlLE1BQU0sSUFBTixTQUFtQixnQkFBTSxTQUF6QixDQUFtQztBQUM5QyxhQUFTO0FBQ0wsZUFDSTtBQUFBO0FBQUE7QUFDSyxpQkFBSyxLQUFMLENBQVcsS0FBWCxDQUFpQixHQUFqQixDQUFzQixJQUFELElBQVU7QUFBQTtBQUFBLGtCQUFJLEtBQUssSUFBVDtBQUFpQjtBQUFqQixhQUEvQjtBQURMLFNBREo7QUFLSDtBQVA2Qzs7a0JBQTdCLEk7QUFVckIsS0FBSyxZQUFMLEdBQW9CO0FBQ2xCLFdBQU87QUFEVyxDQUFwQjs7QUFJQSxLQUFLLFNBQUwsR0FBaUI7QUFDZixXQUFPLG9CQUFVO0FBREYsQ0FBakI7Ozs7Ozs7Ozs7QUNsQkE7Ozs7QUFDQTs7Ozs7O1FBR0ksSztRQUNBLEkiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7IExpc3QgfSBmcm9tICdsaWInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIZWxsbyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICBIZWxsbyB7dGhpcy5wcm9wcy5uYW1lIHx8ICdOb2JvZHknfVxuICAgICAgICAgICAgICAgIDxMaXN0IGl0ZW1zPXtbJ29uZScsICd0d28nXX0vPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufVxuXG5IZWxsby5wcm9wVHlwZXMgPSB7XG4gIG5hbWU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZFxufTsiLCJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaXN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8dWw+XG4gICAgICAgICAgICAgICAge3RoaXMucHJvcHMuaXRlbXMubWFwKChpdGVtKSA9PiA8bGkga2V5PXtpdGVtfT57IGl0ZW0gfTwvbGk+KX1cbiAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICk7XG4gICAgfVxufVxuXG5MaXN0LmRlZmF1bHRQcm9wcyA9IHtcbiAgaXRlbXM6IFtdXG59O1xuXG5MaXN0LnByb3BUeXBlcyA9IHtcbiAgaXRlbXM6IFByb3BUeXBlcy5hcnJheVxufTsiLCJpbXBvcnQgSGVsbG8gZnJvbSAnbGliL2NvbXBvbmVudHMvSGVsbG8vSGVsbG8nO1xuaW1wb3J0IExpc3QgZnJvbSAnbGliL2NvbXBvbmVudHMvTGlzdC9MaXN0JztcblxuZXhwb3J0IHtcbiAgICBIZWxsbyxcbiAgICBMaXN0XG59Il19
