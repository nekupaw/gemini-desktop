const { app, Tray, Menu, shell, BrowserWindow, globalShortcut, screen } = require('electron');
const path = require('path');
const { generateColor } = require('./generateColor');

// if (app.requestSingleInstanceLock()) {
//     app.quit();
//     return;
// }

let tray;
let gemini;

const createWindow = () => {
    const { width, height } = screen.getPrimaryDisplay().bounds;
    const winWidth = 420;
    const winHeight = 750;

    gemini = new BrowserWindow({
        width: winWidth,
        height: winHeight,
        frame: false,
        maximizable: false,
        resizable: false,
        skipTaskbar: true,
        x: width - winWidth - 10,
        y: height - winHeight - 50,
        icon: path.join(__dirname, 'icon.png'),
        webPreferences: { devTools: false }
    });

    gemini.loadURL('https://gemini.google.com/app').catch(console.error);

    Menu.setApplicationMenu(null);

    gemini.webContents.on('did-finish-load', () => {
        // Optional: Add code if needed when the window has finished loading
    });

    gemini.on('blur', () => gemini.hide());
};

app.whenReady().then(() => {
    tray = new Tray(path.join(__dirname, 'icon/icon.png'));
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Quit Gemini',
            click: () => gemini.close()
        },
        {
            label: 'About (GitHub)',
            click: () => shell.openExternal('https://github.com/nekupaw/gemini-desktop').catch(console.error)
        }
    ]);
    tray.setContextMenu(contextMenu);
    tray.on('click', () => gemini.show());

    createWindow();

    globalShortcut.register('Ctrl+g', () => {
        gemini.isVisible() ? gemini.hide() : gemini.show();
    });

    globalShortcut.register('Ctrl+Shift+g', () => {
        if (!gemini.isVisible()) gemini.show();
        gemini.webContents.executeJavaScript("document.querySelector('.speech_dictation_mic_button').click()").catch(console.error);
    });
}).catch(console.error);
