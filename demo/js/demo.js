(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _devBoxUi = require('dev-box-ui');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const theme = {
    primaryTextColor: 'green',
    secondaryTextColor: 'blue'
};

class App extends _react2.default.Component {
    render() {
        return _react2.default.createElement(_devBoxUi.Hello, null);
    }
}

_reactDom2.default.render(_react2.default.createElement(
    _devBoxUi.ThemeProvider,
    { theme: theme },
    _react2.default.createElement(App, null)
), document.getElementById('app'));

},{"dev-box-ui":"dev-box-ui","react":"react","react-dom":"react-dom"}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQSxNQUFNLFFBQVE7QUFDVixzQkFBa0IsT0FEUjtBQUVWLHdCQUFvQjtBQUZWLENBQWQ7O0FBS0EsTUFBTSxHQUFOLFNBQWtCLGdCQUFNLFNBQXhCLENBQWtDO0FBQzlCLGFBQVM7QUFDTCxlQUNJLG9EQURKO0FBR0g7QUFMNkI7O0FBUWxDLG1CQUFTLE1BQVQsQ0FDSTtBQUFBO0FBQUEsTUFBZSxPQUFPLEtBQXRCO0FBQ0ksa0NBQUMsR0FBRDtBQURKLENBREosRUFJRyxTQUFTLGNBQVQsQ0FBd0IsS0FBeEIsQ0FKSCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQgeyBIZWxsbywgVGhlbWVQcm92aWRlciB9IGZyb20gJ2Rldi1ib3gtdWknO1xuXG5jb25zdCB0aGVtZSA9IHtcbiAgICBwcmltYXJ5VGV4dENvbG9yOiAnZ3JlZW4nLFxuICAgIHNlY29uZGFyeVRleHRDb2xvcjogJ2JsdWUnXG59O1xuXG5jbGFzcyBBcHAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxIZWxsbyAvPlxuICAgICAgICApO1xuICAgIH1cbn1cblxuUmVhY3RET00ucmVuZGVyKChcbiAgICA8VGhlbWVQcm92aWRlciB0aGVtZT17dGhlbWV9PlxuICAgICAgICA8QXBwIC8+XG4gICAgPC9UaGVtZVByb3ZpZGVyPlxuKSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpKTtcbiJdfQ==
