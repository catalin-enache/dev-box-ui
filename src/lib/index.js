import Hello from './components/Hello/Hello';
import List from './components/List/List';
import { ThemeProvider } from './theming/theming';
import defaultTheme from './styles/defaultTheme'

let customTheme;

function getTheme() {
    return customTheme || defaultTheme;
}

function setTheme(theme) {
    customTheme = theme;
}

export {
    getTheme, setTheme,
    ThemeProvider,
    Hello,
    List
};