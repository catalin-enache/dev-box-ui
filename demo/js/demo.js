(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _devBoxUi = require('dev-box-ui');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const customTheme = {
  primaryTextColor: 'brown',
  secondaryTextColor: 'green'
};

class App extends _react2.default.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      theme: _devBoxUi.defaultTheme
    };
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({
        theme: this.state.theme === _devBoxUi.defaultTheme ? customTheme : _devBoxUi.defaultTheme
      });
    }, 1000);
  }

  render() {
    return _react2.default.createElement(
      _devBoxUi.ThemeProvider,
      { theme: this.state.theme },
      _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_devBoxUi.Hello, null),
        _react2.default.createElement(_devBoxUi.Hello, null),
        _react2.default.createElement(_devBoxUi.Hello, null),
        _react2.default.createElement(_devBoxUi.List, { items: ['three', 'four'] }),
        _react2.default.createElement(_devBoxUi.List, { items: ['three', 'four'] })
      )
    );
  }
}

_reactDom2.default.render(_react2.default.createElement(App, null), document.getElementById('app'));

},{"dev-box-ui":"dev-box-ui","react":"react","react-dom":"react-dom"}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQSxNQUFNLGNBQWM7QUFDbEIsb0JBQWtCLE9BREE7QUFFbEIsc0JBQW9CO0FBRkYsQ0FBcEI7O0FBS0EsTUFBTSxHQUFOLFNBQWtCLGdCQUFNLFNBQXhCLENBQWtDO0FBQ2hDLGNBQVksS0FBWixFQUFtQixPQUFuQixFQUE0QjtBQUMxQixVQUFNLEtBQU4sRUFBYSxPQUFiO0FBQ0EsU0FBSyxLQUFMLEdBQWE7QUFDWDtBQURXLEtBQWI7QUFHRDs7QUFFRCxzQkFBb0I7QUFDbEIsZ0JBQVksTUFBTTtBQUNoQixXQUFLLFFBQUwsQ0FBYztBQUNaLGVBQU8sS0FBSyxLQUFMLENBQVcsS0FBWCw4QkFDTCxXQURLO0FBREssT0FBZDtBQUtELEtBTkQsRUFNRyxJQU5IO0FBT0Q7O0FBRUQsV0FBUztBQUNQLFdBQ0U7QUFBQTtBQUFBLFFBQWUsT0FBTyxLQUFLLEtBQUwsQ0FBVyxLQUFqQztBQUNFO0FBQUE7QUFBQTtBQUNFLDREQURGO0FBRUUsNERBRkY7QUFHRSw0REFIRjtBQUlFLHdEQUFNLE9BQU8sQ0FBQyxPQUFELEVBQVUsTUFBVixDQUFiLEdBSkY7QUFLRSx3REFBTSxPQUFPLENBQUMsT0FBRCxFQUFVLE1BQVYsQ0FBYjtBQUxGO0FBREYsS0FERjtBQVdEO0FBOUIrQjs7QUFpQ2xDLG1CQUFTLE1BQVQsQ0FDRSw4QkFBQyxHQUFELE9BREYsRUFFRyxTQUFTLGNBQVQsQ0FBd0IsS0FBeEIsQ0FGSCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQge0hlbGxvLCBMaXN0LCBUaGVtZVByb3ZpZGVyLCBkZWZhdWx0VGhlbWV9IGZyb20gJ2Rldi1ib3gtdWknO1xuXG5jb25zdCBjdXN0b21UaGVtZSA9IHtcbiAgcHJpbWFyeVRleHRDb2xvcjogJ2Jyb3duJyxcbiAgc2Vjb25kYXJ5VGV4dENvbG9yOiAnZ3JlZW4nXG59O1xuXG5jbGFzcyBBcHAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCkge1xuICAgIHN1cGVyKHByb3BzLCBjb250ZXh0KTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgdGhlbWU6IGRlZmF1bHRUaGVtZVxuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHNldEludGVydmFsKCgpID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICB0aGVtZTogdGhpcy5zdGF0ZS50aGVtZSA9PT0gZGVmYXVsdFRoZW1lID9cbiAgICAgICAgICBjdXN0b21UaGVtZSA6XG4gICAgICAgICAgZGVmYXVsdFRoZW1lXG4gICAgICB9KVxuICAgIH0sIDEwMDApO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8VGhlbWVQcm92aWRlciB0aGVtZT17dGhpcy5zdGF0ZS50aGVtZX0+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPEhlbGxvLz5cbiAgICAgICAgICA8SGVsbG8vPlxuICAgICAgICAgIDxIZWxsby8+XG4gICAgICAgICAgPExpc3QgaXRlbXM9e1sndGhyZWUnLCAnZm91ciddfS8+XG4gICAgICAgICAgPExpc3QgaXRlbXM9e1sndGhyZWUnLCAnZm91ciddfS8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9UaGVtZVByb3ZpZGVyPlxuICAgICk7XG4gIH1cbn1cblxuUmVhY3RET00ucmVuZGVyKChcbiAgPEFwcC8+XG4pLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJykpO1xuIl19
