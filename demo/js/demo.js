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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNEZW1vL2RlbW8uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQVFBLCtCQUFnQixFQUFFLGFBQWEsRUFBZixFQUFvQixjQUFjLEVBQWxDLEVBQXVDLFNBQVMsRUFBRSxLQUFLLEtBQVAsRUFBaEQsRUFBaEI7QUFDQSxLQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksR0FBcEIsRUFBeUIsS0FBSyxDQUE5QixFQUFpQztBQUMvQixVQUFRLEdBQVIsQ0FBWSxLQUFaLEVBQW1CLEtBQW5CLEVBQTBCLENBQTFCLEVBQTZCLElBQTdCLEVBQW1DLFNBQW5DLEVBQThDLElBQUksR0FBSixDQUFRLENBQUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFELENBQVIsQ0FBOUMsRUFBaUUsSUFBSSxHQUFKLENBQVEsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFSLENBQWpFLEVBQWtGLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxFQUFMLENBQWxGLEVBQTZGLFlBQVU7QUFBQyxZQUFRLEdBQVIsQ0FBWSxLQUFaO0FBQW1CLEdBQTNILEVBQTZILEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBRCxFQUFJLFlBQVU7QUFBQyxrQkFBUSxHQUFSLENBQVksUUFBWjtBQUFzQixTQUFyQyxDQUFMLEVBQUwsRUFBTCxFQUE3SDtBQUNEO0FBQ0QsUUFBUSxJQUFSLENBQWEsU0FBYjtBQUNBLFFBQVEsS0FBUixDQUFjLE9BQWQ7O0FBRUEsTUFBTSxFQUFFLGFBQUYsc0JBQU47O0FBRUEsTUFBTSxjQUFjO0FBQ2xCLFFBQU07QUFDSixZQUFRO0FBQ04sd0JBQWtCLE9BRFo7QUFFTiwwQkFBb0I7QUFGZDtBQURKLEdBRFk7QUFPbEIsY0FBWSx1QkFBYTtBQVBQLENBQXBCOztBQVVBLE1BQU0sR0FBTixTQUFrQixnQkFBTSxTQUF4QixDQUFrQztBQUNoQyxjQUFZLEtBQVosRUFBbUIsT0FBbkIsRUFBNEI7QUFDMUIsVUFBTSxLQUFOLEVBQWEsT0FBYjtBQUNBLFNBQUssS0FBTCxHQUFhO0FBQ1g7QUFEVyxLQUFiO0FBR0Q7O0FBRUQsc0JBQW9CO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Q7O0FBRUQsV0FBUztBQUNQLFdBQ0U7QUFBQyxtQkFBRDtBQUFBLFFBQWUsT0FBTyxLQUFLLEtBQUwsQ0FBVyxLQUFqQztBQUNFO0FBQUE7QUFBQTtBQUNFLDREQURGO0FBRUUsNERBRkY7QUFHRSw0REFIRjtBQUlFLHdEQUFNLE9BQU8sQ0FBQyxPQUFELEVBQVUsTUFBVixDQUFiLEdBSkY7QUFLRSx3REFBTSxPQUFPLENBQUMsT0FBRCxFQUFVLE1BQVYsQ0FBYjtBQUxGO0FBREYsS0FERjtBQVdEO0FBOUIrQjs7QUFpQ2xDLG1CQUFTLE1BQVQsQ0FDRSw4QkFBQyxHQUFELE9BREYsRUFFRyxTQUFTLGNBQVQsQ0FBd0IsS0FBeEIsQ0FGSCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQge1xuICBvblNjcmVlbkNvbnNvbGUsXG4gIEhlbGxvLFxuICBMaXN0LFxuICB0aGVtaW5nLFxuICBkZWZhdWx0VGhlbWVcbn0gZnJvbSAnZGV2LWJveC11aSc7XG5cbm9uU2NyZWVuQ29uc29sZSh7IGJ1dHRvblN0eWxlOiB7IH0sIGNvbnNvbGVTdHlsZTogeyB9LCBvcHRpb25zOiB7IHJ0bDogZmFsc2UgfSB9KTtcbmZvciAobGV0IGkgPSAwOyBpIDwgMTAwOyBpICs9IDEpIHtcbiAgY29uc29sZS5sb2coJ2ZvbycsICdiYXInLCA1LCBudWxsLCB1bmRlZmluZWQsIG5ldyBNYXAoW1syLCA3XV0pLCBuZXcgU2V0KFs0LCA1XSksIFs4LDksMTBdLCAgZnVuY3Rpb24oKXtjb25zb2xlLmxvZygnYmxhJyl9LCB7IGE6IHsgYjogeyBjOiBbMSwgZnVuY3Rpb24oKXtjb25zb2xlLmxvZygnaW5saW5lJyl9XSB9IH0gfSk7XG59XG5jb25zb2xlLndhcm4oJ3dhcm5pbmcnKTtcbmNvbnNvbGUuZXJyb3IoJ2Vycm9yJyk7XG5cbmNvbnN0IHsgVGhlbWVQcm92aWRlciB9ID0gdGhlbWluZztcblxuY29uc3QgY3VzdG9tVGhlbWUgPSB7XG4gIHZhcnM6IHtcbiAgICBjb2xvcnM6IHtcbiAgICAgIHByaW1hcnlUZXh0Q29sb3I6ICdicm93bicsXG4gICAgICBzZWNvbmRhcnlUZXh0Q29sb3I6ICdncmVlbicsXG4gICAgfVxuICB9LFxuICBhbmltYXRpb25zOiBkZWZhdWx0VGhlbWUuYW5pbWF0aW9uc1xufTtcblxuY2xhc3MgQXBwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMsIGNvbnRleHQpIHtcbiAgICBzdXBlcihwcm9wcywgY29udGV4dCk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHRoZW1lOiBkZWZhdWx0VGhlbWVcbiAgICB9O1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgLy8gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgIC8vICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgLy8gICAgIHRoZW1lOiB0aGlzLnN0YXRlLnRoZW1lID09PSBkZWZhdWx0VGhlbWUgP1xuICAgIC8vICAgICAgIGN1c3RvbVRoZW1lIDpcbiAgICAvLyAgICAgICBkZWZhdWx0VGhlbWVcbiAgICAvLyAgIH0pO1xuICAgIC8vIH0sIDEwMDApO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8VGhlbWVQcm92aWRlciB0aGVtZT17dGhpcy5zdGF0ZS50aGVtZX0+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPEhlbGxvLz5cbiAgICAgICAgICA8SGVsbG8vPlxuICAgICAgICAgIDxIZWxsby8+XG4gICAgICAgICAgPExpc3QgaXRlbXM9e1sndGhyZWUnLCAnZm91ciddfS8+XG4gICAgICAgICAgPExpc3QgaXRlbXM9e1sndGhyZWUnLCAnZm91ciddfS8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9UaGVtZVByb3ZpZGVyPlxuICAgICk7XG4gIH1cbn1cblxuUmVhY3RET00ucmVuZGVyKChcbiAgPEFwcC8+XG4pLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJykpO1xuIl19
