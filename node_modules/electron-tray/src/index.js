
// Cribbed from https://github.com/hokein/electron-sample-apps/blob/master/tray/main.js

import {Tray, Menu, BrowserWindow} from 'electron';
import path from 'path';

// Menu is a https://electron.atom.io/docs/api/menu-item/
const defaultMenu = [
  // {
  //   label: 'Item1',
  //   type: 'radio',
  //   icon: iconPath
  // },
  // {
  //   label: 'Item2',
  //   submenu: [
  //     { label: 'submenu1' },
  //     { label: 'submenu2' }
  //   ]
  // },
  // {
  //   label: 'Item3',
  //   type: 'radio',
  //   checked: true
  // },
  // {
  //   label: 'Toggle DevTools',
  //   accelerator: 'CommandOrControl+Shift+I',
  //   click: function() {
  //     win.show();
  //     win.toggleDevTools();
  //   }
  // },
  { label: 'Quit',
    accelerator: 'CommandOrControl+Q',
    selector: 'terminate:',
  }
];

class TrayControl {
  constructor(app, iconPath, menu = defaultMenu) {
    this.app = app;
    app.on('ready', () => {
      this.appIcon = new Tray(iconPath);
      this.contextMenu = Menu.buildFromTemplate(menu);
      this.appIcon.setToolTip('This is my application.');
      this.appIcon.setContextMenu(this.contextMenu);
    });
  };
}

export default TrayControl;
