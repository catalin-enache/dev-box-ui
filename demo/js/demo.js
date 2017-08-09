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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQSxNQUFNLGNBQWM7QUFDaEIsc0JBQWtCLE9BREY7QUFFaEIsd0JBQW9CO0FBRkosQ0FBcEI7O0FBS0EsTUFBTSxHQUFOLFNBQWtCLGdCQUFNLFNBQXhCLENBQWtDO0FBQzlCLGdCQUFZLEtBQVosRUFBbUIsT0FBbkIsRUFBNEI7QUFDeEIsY0FBTSxLQUFOLEVBQWEsT0FBYjtBQUNBLGFBQUssS0FBTCxHQUFhO0FBQ1Q7QUFEUyxTQUFiO0FBR0g7O0FBRUQsd0JBQW9CO0FBQ2hCLG9CQUFZLE1BQU07QUFDZCxpQkFBSyxRQUFMLENBQWM7QUFDVix1QkFBTyxLQUFLLEtBQUwsQ0FBVyxLQUFYLDhCQUNILFdBREc7QUFERyxhQUFkO0FBS0gsU0FORCxFQU1HLElBTkg7QUFPSDs7QUFFRCxhQUFTO0FBQ0wsZUFDSTtBQUFBO0FBQUEsY0FBZSxPQUFPLEtBQUssS0FBTCxDQUFXLEtBQWpDO0FBQ0k7QUFBQTtBQUFBO0FBQ0ksb0VBREo7QUFFSSxvRUFGSjtBQUdJLG9FQUhKO0FBSUksZ0VBQU0sT0FBTyxDQUFDLE9BQUQsRUFBVSxNQUFWLENBQWIsR0FKSjtBQUtJLGdFQUFNLE9BQU8sQ0FBQyxPQUFELEVBQVUsTUFBVixDQUFiO0FBTEo7QUFESixTQURKO0FBV0g7QUE5QjZCOztBQWlDbEMsbUJBQVMsTUFBVCxDQUNJLDhCQUFDLEdBQUQsT0FESixFQUVHLFNBQVMsY0FBVCxDQUF3QixLQUF4QixDQUZIIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCB7IEhlbGxvLCBMaXN0LCBUaGVtZVByb3ZpZGVyLCBkZWZhdWx0VGhlbWUgfSBmcm9tICdkZXYtYm94LXVpJztcblxuY29uc3QgY3VzdG9tVGhlbWUgPSB7XG4gICAgcHJpbWFyeVRleHRDb2xvcjogJ2Jyb3duJyxcbiAgICBzZWNvbmRhcnlUZXh0Q29sb3I6ICdncmVlbidcbn07XG5cbmNsYXNzIEFwcCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMsIGNvbnRleHQpIHtcbiAgICAgICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgdGhlbWU6IGRlZmF1bHRUaGVtZVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIHRoZW1lOiB0aGlzLnN0YXRlLnRoZW1lID09PSBkZWZhdWx0VGhlbWUgP1xuICAgICAgICAgICAgICAgICAgICBjdXN0b21UaGVtZSA6XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHRUaGVtZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSwgMTAwMCk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFRoZW1lUHJvdmlkZXIgdGhlbWU9e3RoaXMuc3RhdGUudGhlbWV9PlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxIZWxsbyAvPlxuICAgICAgICAgICAgICAgICAgICA8SGVsbG8gLz5cbiAgICAgICAgICAgICAgICAgICAgPEhlbGxvIC8+XG4gICAgICAgICAgICAgICAgICAgIDxMaXN0IGl0ZW1zPXtbJ3RocmVlJywgJ2ZvdXInXX0gLz5cbiAgICAgICAgICAgICAgICAgICAgPExpc3QgaXRlbXM9e1sndGhyZWUnLCAnZm91ciddfSAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9UaGVtZVByb3ZpZGVyPlxuICAgICAgICApO1xuICAgIH1cbn1cblxuUmVhY3RET00ucmVuZGVyKChcbiAgICA8QXBwIC8+XG4pLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJykpO1xuIl19
