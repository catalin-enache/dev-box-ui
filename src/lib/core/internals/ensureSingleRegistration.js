
/**
 *
 * @param win Window
 * @param name String
 * @param callback Function
 * @return *
 */
export default function ensureSingleRegistration(win, name, callback) {
  if (!win.DBUIWebComponents) {
    win.DBUIWebComponents = { registrations: {} };
  } else if (!win.DBUIWebComponents.registrations) {
    win.DBUIWebComponents.registrations = {};
  }

  let registration = win.DBUIWebComponents.registrations[name];

  if (registration) return registration;

  registration = callback();
  win.DBUIWebComponents.registrations[name] = registration;

  return win.DBUIWebComponents.registrations[name];
}

