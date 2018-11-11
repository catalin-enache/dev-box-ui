/* eslint no-console: 0 */

const buttonHeight = '25px';
const buttonStart = '5px';
const buttonTop = '5px';

let consoleMessages = [];
const consoleLog = console.log.bind(console);
const consoleOriginal = {};

function captureConsole(win, consoleElm, options) {
  const { indent = 2, showLastOnly = false } = options;
  const errorHandler = (evt) => {
    console.error(`"${evt.message}" from ${evt.filename}:${evt.lineno}`);
    console.error(evt, evt.error.stack);
    // evt.preventDefault();
  };
  const handler = function handler(action, ...args) {
    if (showLastOnly) {
      consoleMessages = [{ [action]: args }];
    } else {
      consoleMessages.push({ [action]: args });
    }

    consoleElm.innerHTML = consoleMessages.map((entry) => {
      const action = Object.keys(entry)[0];
      const values = entry[action];
      const stringify = (item, replacer, indent) => {
        try {
          return JSON.stringify(item, replacer, indent);
        } catch (_) {
          return item.toString();
        }
      };
      const colors = {
        log: '#000',
        warn: 'orange',
        error: 'darkred'
      };
      let color = colors[action];
      let message = '';
      try {
        message = values.map((item) => {
          return (
            [undefined, null].includes(item) ||
            ['number', 'string', 'function'].includes(typeof item)
          ) ?
            item :
            ['Map', 'Set'].includes(item.constructor.name) ?
              `${item.constructor.name} (${stringify([...item])})` :
              stringify(item, (key, value) => {
                if ((typeof value) === 'function') {
                  return value.toString();
                }
                return value;
              }, indent);
        }).join(', ');
      } catch (err) {
        message = `Error caught while capturing console: ${err.message}`;
        color = colors.error;
      }

      return `<pre style="color: ${color}">${message}</pre>`;
    }).join('\n');
  };
  ['log', 'warn', 'error'].forEach((action) => {
    consoleOriginal[action] = console[action];
    console[action] = handler.bind(console, action);
  });
  ['error', 'unhandledrejection'].forEach((evtType) => {
    const windows = [window];
    if (win !== window) {
      windows.push(win);
    }
    windows.forEach((_win) => {
      _win.addEventListener(evtType, errorHandler);
    });
  });
  consoleLog('console captured');
  return function releaseConsole() {
    ['log', 'warn', 'error'].forEach((action) => {
      console[action] = consoleOriginal[action];
    });
    ['error', 'unhandledrejection'].forEach((evtType) => {
      const windows = [window];
      if (win !== window) {
        windows.push(win);
      }
      windows.forEach((_win) => {
        _win.removeEventListener(evtType, errorHandler);
      });
    });
    consoleLog('console released');
  };
}

function createConsole({
  options,
  consoleStyle: {
    btnStart = buttonStart, btnHeight = buttonHeight,
    width = `calc(100vw - ${btnStart} - 30px)`, height = '400px',
    background = 'rgba(0, 0, 0, 0.5)'
  }
}) {
  const { rtl = false } = options;
  const console = document.createElement('div');
  console.id = 'DBUIonScreenConsole';
  console.style.cssText = `
    display: block;
    margin: 0px;
    padding: 5px;
    position: absolute;
    overflow: auto;
    width: ${width};
    height: ${height};
    top: ${btnHeight};
    ${rtl ? 'right' : 'left'}: 0px;
    background: ${background};
    z-index: 9999;
    -webkit-overflow-scrolling: touch
    `;
  return console;
}

function createButton({
  options,
  buttonStyle: {
    position = 'fixed',
    width = '25px', height = buttonHeight, top = buttonTop, start = buttonStart,
    background = 'rgba(0, 0, 0, 0.5)'
  }
}) {
  const { rtl = false } = options;
  const button = document.createElement('div');
  button.id = 'DBUIonScreenConsoleToggler';
  button.style.cssText = `
    position: ${position};
    width: ${width};
    height: ${height};
    top: ${top};
    ${rtl ? 'right' : 'left'}: ${start};
    background: ${background};
    z-index: 9999;
    `;
  return button;
}

/**
onScreenConsole({
  buttonStyle = { position, width, height, top, start, background },
  consoleStyle = { width, height, background },
  options = { rtl: false, indent, showLastOnly }
})
*/
export default function onScreenConsole({
  win = window,
  buttonStyle = {},
  consoleStyle = {},
  options = {}
} = {}) {
  const button = createButton({
    options,
    buttonStyle
  });
  const console = createConsole({
    consoleStyle: {
      ...consoleStyle,
      btnHeight: buttonStyle.height,
      btnStart: buttonStyle.start
    },
    options
  });

  console.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  button.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!button.contains(console)) {
      button.appendChild(console);
      console.scrollTop = console.scrollHeight - console.clientHeight;
    } else {
      button.removeChild(console);
    }
  });

  document.body.appendChild(button);
  const releaseConsole = captureConsole(win, console, options);

  return function release() {
    document.body.removeChild(button);
    releaseConsole();
  };
}
