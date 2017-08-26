(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _devBoxUi = require('dev-box-ui');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _devBoxUi.onScreenConsole)({ buttonStyle: {}, consoleStyle: {}, options: { rtl: false } });
for (let i = 0; i < 100; i += 1) {
  console.log('foo', 'bar', 5, null, undefined, new Map([[2, 7]]), new Set([4, 5]), [8, 9, 10], function () {
    console.log('bla');
  }, { a: { b: { c: [1, function () {
          console.log('inline');
        }] } } });
}
console.warn('warning');
console.error('error');

const { ThemeProvider } = _devBoxUi.theming;

const customTheme = {
  vars: {
    colors: {
      primaryTextColor: 'brown',
      secondaryTextColor: 'green'
    }
  },
  animations: _devBoxUi.defaultTheme.animations
};

class App extends _react2.default.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      theme: _devBoxUi.defaultTheme
    };
  }

  componentDidMount() {
    // setInterval(() => {
    //   this.setState({
    //     theme: this.state.theme === defaultTheme ?
    //       customTheme :
    //       defaultTheme
    //   });
    // }, 1000);
  }

  render() {
    return _react2.default.createElement(
      ThemeProvider,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFRQSwrQkFBZ0IsRUFBRSxhQUFhLEVBQWYsRUFBb0IsY0FBYyxFQUFsQyxFQUF1QyxTQUFTLEVBQUUsS0FBSyxLQUFQLEVBQWhELEVBQWhCO0FBQ0EsS0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEdBQXBCLEVBQXlCLEtBQUssQ0FBOUIsRUFBaUM7QUFDL0IsVUFBUSxHQUFSLENBQVksS0FBWixFQUFtQixLQUFuQixFQUEwQixDQUExQixFQUE2QixJQUE3QixFQUFtQyxTQUFuQyxFQUE4QyxJQUFJLEdBQUosQ0FBUSxDQUFDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBRCxDQUFSLENBQTlDLEVBQWlFLElBQUksR0FBSixDQUFRLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBUixDQUFqRSxFQUFrRixDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssRUFBTCxDQUFsRixFQUE2RixZQUFVO0FBQUMsWUFBUSxHQUFSLENBQVksS0FBWjtBQUFtQixHQUEzSCxFQUE2SCxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUQsRUFBSSxZQUFVO0FBQUMsa0JBQVEsR0FBUixDQUFZLFFBQVo7QUFBc0IsU0FBckMsQ0FBTCxFQUFMLEVBQUwsRUFBN0g7QUFDRDtBQUNELFFBQVEsSUFBUixDQUFhLFNBQWI7QUFDQSxRQUFRLEtBQVIsQ0FBYyxPQUFkOztBQUdBLE1BQU0sRUFBRSxhQUFGLHNCQUFOOztBQUVBLE1BQU0sY0FBYztBQUNsQixRQUFNO0FBQ0osWUFBUTtBQUNOLHdCQUFrQixPQURaO0FBRU4sMEJBQW9CO0FBRmQ7QUFESixHQURZO0FBT2xCLGNBQVksdUJBQWE7QUFQUCxDQUFwQjs7QUFVQSxNQUFNLEdBQU4sU0FBa0IsZ0JBQU0sU0FBeEIsQ0FBa0M7QUFDaEMsY0FBWSxLQUFaLEVBQW1CLE9BQW5CLEVBQTRCO0FBQzFCLFVBQU0sS0FBTixFQUFhLE9BQWI7QUFDQSxTQUFLLEtBQUwsR0FBYTtBQUNYO0FBRFcsS0FBYjtBQUdEOztBQUVELHNCQUFvQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNEOztBQUVELFdBQVM7QUFDUCxXQUNFO0FBQUMsbUJBQUQ7QUFBQSxRQUFlLE9BQU8sS0FBSyxLQUFMLENBQVcsS0FBakM7QUFDRTtBQUFBO0FBQUE7QUFDRSw0REFERjtBQUVFLDREQUZGO0FBR0UsNERBSEY7QUFJRSx3REFBTSxPQUFPLENBQUMsT0FBRCxFQUFVLE1BQVYsQ0FBYixHQUpGO0FBS0Usd0RBQU0sT0FBTyxDQUFDLE9BQUQsRUFBVSxNQUFWLENBQWI7QUFMRjtBQURGLEtBREY7QUFXRDtBQTlCK0I7O0FBaUNsQyxtQkFBUyxNQUFULENBQ0UsOEJBQUMsR0FBRCxPQURGLEVBRUcsU0FBUyxjQUFULENBQXdCLEtBQXhCLENBRkgiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nO1xuaW1wb3J0IHtcbiAgb25TY3JlZW5Db25zb2xlLFxuICBIZWxsbyxcbiAgTGlzdCxcbiAgdGhlbWluZyxcbiAgZGVmYXVsdFRoZW1lXG59IGZyb20gJ2Rldi1ib3gtdWknO1xuXG5vblNjcmVlbkNvbnNvbGUoeyBidXR0b25TdHlsZTogeyB9LCBjb25zb2xlU3R5bGU6IHsgfSwgb3B0aW9uczogeyBydGw6IGZhbHNlIH0gfSk7XG5mb3IgKGxldCBpID0gMDsgaSA8IDEwMDsgaSArPSAxKSB7XG4gIGNvbnNvbGUubG9nKCdmb28nLCAnYmFyJywgNSwgbnVsbCwgdW5kZWZpbmVkLCBuZXcgTWFwKFtbMiwgN11dKSwgbmV3IFNldChbNCwgNV0pLCBbOCw5LDEwXSwgIGZ1bmN0aW9uKCl7Y29uc29sZS5sb2coJ2JsYScpfSwgeyBhOiB7IGI6IHsgYzogWzEsIGZ1bmN0aW9uKCl7Y29uc29sZS5sb2coJ2lubGluZScpfV0gfSB9IH0pO1xufVxuY29uc29sZS53YXJuKCd3YXJuaW5nJyk7XG5jb25zb2xlLmVycm9yKCdlcnJvcicpO1xuXG5cbmNvbnN0IHsgVGhlbWVQcm92aWRlciB9ID0gdGhlbWluZztcblxuY29uc3QgY3VzdG9tVGhlbWUgPSB7XG4gIHZhcnM6IHtcbiAgICBjb2xvcnM6IHtcbiAgICAgIHByaW1hcnlUZXh0Q29sb3I6ICdicm93bicsXG4gICAgICBzZWNvbmRhcnlUZXh0Q29sb3I6ICdncmVlbicsXG4gICAgfVxuICB9LFxuICBhbmltYXRpb25zOiBkZWZhdWx0VGhlbWUuYW5pbWF0aW9uc1xufTtcblxuY2xhc3MgQXBwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMsIGNvbnRleHQpIHtcbiAgICBzdXBlcihwcm9wcywgY29udGV4dCk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHRoZW1lOiBkZWZhdWx0VGhlbWVcbiAgICB9O1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgLy8gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgIC8vICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgLy8gICAgIHRoZW1lOiB0aGlzLnN0YXRlLnRoZW1lID09PSBkZWZhdWx0VGhlbWUgP1xuICAgIC8vICAgICAgIGN1c3RvbVRoZW1lIDpcbiAgICAvLyAgICAgICBkZWZhdWx0VGhlbWVcbiAgICAvLyAgIH0pO1xuICAgIC8vIH0sIDEwMDApO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8VGhlbWVQcm92aWRlciB0aGVtZT17dGhpcy5zdGF0ZS50aGVtZX0+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPEhlbGxvLz5cbiAgICAgICAgICA8SGVsbG8vPlxuICAgICAgICAgIDxIZWxsby8+XG4gICAgICAgICAgPExpc3QgaXRlbXM9e1sndGhyZWUnLCAnZm91ciddfS8+XG4gICAgICAgICAgPExpc3QgaXRlbXM9e1sndGhyZWUnLCAnZm91ciddfS8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9UaGVtZVByb3ZpZGVyPlxuICAgICk7XG4gIH1cbn1cblxuUmVhY3RET00ucmVuZGVyKChcbiAgPEFwcC8+XG4pLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJykpO1xuIl19
