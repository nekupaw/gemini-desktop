# Quickly add a tray icon to an electron app

Very basic at the moment, this module is either going nowhere or I might extend it to deal with app lifecycle management, window toggling etc.

## Usage:
```javascript
const trayControl = new TrayControl(electron.app, iconPath[, menu]);
```
...where `menu` is passed to [`electron.MenuItem`](https://electron.atom.io/docs/api/menu-item/) via [`electron.Menu.buildFromTemplate()`](https://electron.atom.io/docs/api/menu/) i.e. it's just a normal electron menu.

### Example:
```javascript
import path from 'path';

import electron from 'electron';
const app = electron.app;

import TrayControl from 'electron-tray';

const iconPath = path.join(__dirname, 'icon.png');

// Keep this reference around otherwise the icon will
//   vanish when the TrayControl instance gets GCed.
const trayControl = new TrayControl(app, iconPath);

// ... initialise your app here as normal ...


```

# Changes
 - [ ] If clean way to do it, add ability to persist app while all windows are closed, minimise/close to tray etc.
 - [ ] If Windows machine available, investigate integration of [`electron-promote-windows-tray-items`](https://www.npmjs.com/package/electron-promote-windows-tray-items) (Issues [#1](https://github.com/mixmaxhq/electron-promote-windows-tray-items/issues/1) and [#2](https://github.com/mixmaxhq/electron-promote-windows-tray-items/issues/2) may be blockers and will this thing even work with newer electron versions?).
 - [x] Basic functionality works. You can haz icon, and menu.
