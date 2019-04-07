
// These utils are to be used only in unit tests not in live app.

export const isSafari = (win) => (
  win.navigator.vendor === 'Apple Computer, Inc.'
);

export const isChrome = (win) => (
  win.navigator.vendor === 'Google Inc.'
);

export const isFirefox = (win) => (
  win.navigator.userAgent.includes('Firefox')
);
