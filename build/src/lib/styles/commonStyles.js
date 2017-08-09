'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getCommonStyles = getCommonStyles;
exports.setCommonStyles = setCommonStyles;

let commonStyles = {

    '@keyframes fa-spin': {
        '0%': {
            transform: 'rotate(0deg)'
        },

        '100%': {
            transform: 'rotate(359deg)'
        }
    },

    faSpin: {
        animation: 'fa-spin 2s infinite linear',
        animationName: 'fa-spin',
        animationDuration: '2s',
        animationTimingFunction: 'linear',
        animationDelay: 'initial',
        animationIterationCount: 'infinite',
        animationDirection: 'initial',
        animationFillMode: 'initial',
        animationPlayState: 'initial'
    }

};

function getCommonStyles() {
    return commonStyles;
}

function setCommonStyles(style) {
    commonStyles = style;
}