require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Hello extends _react2.default.Component {
    render() {
        return _react2.default.createElement(
            'div',
            null,
            'Hello ',
            this.props.name
        );
    }
}

exports.default = Hello;
Hello.propTypes = {
    name: _propTypes2.default.string.isRequired
};

},{"prop-types":"prop-types","react":"react"}],"/src/index.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Hello = undefined;

var _Hello = require('lib/Hello/Hello');

var _Hello2 = _interopRequireDefault(_Hello);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Hello = _Hello2.default;

},{"lib/Hello/Hello":1}]},{},[]);
