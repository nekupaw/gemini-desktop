const { app, Tray, Menu, shell, BrowserWindow, globalShortcut, screen, ipcMain } = require('electron'),
    path = require('path'),
    Store = require('electron-store'),
    store = new Store();

let tray, gemini;

function exec(code) {
    gemini.webContents.executeJavaScript(code).catch(console.error);
}

function getValue(a) {
    return store.get(a, true);
}

function optimizePage() {
    exec(`
function get(e){return document.querySelector(e)}function cb(e,t,n,i,a,o){let r=document.createElement(e);return t&&(r.textContent=t),n&&(r.className=n),i&&i.forEach(e=>r.appendChild(e)),a&&r.setAttribute(a,o),r}const style=document.createElement("style");style.textContent=".containerA {margin-top: 30px;display: flex;flex-direction: column;gap: 10px;}.containerA p {font-family: 'Google Sans', 'Helvetica Neue', sans-serif;opacity: 0.2;margin: 0;}",document.head.appendChild(style),get(".prompt-suggestion-cards-container").remove(),get(".gmat-caption").textContent="Gemini Client by @nekupaw",get(".gmat-caption").style.opacity="0.5",get(".zero-state-wrapper").appendChild(cb("div",null,"containerA",[cb("p","open Gemini from anywhere with [CTRL + G]"),cb("p","talk to Gemini with [CTRL + Shift + G]")]));
    `);
}

const createWindow = () => {
    const { width, height } = screen.getPrimaryDisplay().bounds,
        winWidth = 400, winHeight = 700;

    gemini = new BrowserWindow({
        width: winWidth, height: winHeight,
        frame: false,
        maximizable: false,
        resizable: false,
        skipTaskbar: true,
        alwaysOnTop: true,
        x: width - winWidth - 10, y: height - winHeight - 50,
        icon: path.resolve(__dirname, 'icon.png'),
        webPreferences: { contextIsolation: true, devTools: true, preload: path.join(__dirname, 'preload.js'), nodeIntegration: false,}
    });

    gemini.loadURL('https://gemini.google.com/app').catch(console.error);

    gemini.webContents.on('did-finish-load', optimizePage);
    gemini.webContents.on('did-navigate', optimizePage);

    ipcMain.handle('get-local-storage', (event, a) => {
        return getValue(a);
    });

    ipcMain.on('set-local-storage', (event, a, b) => {
        store.set(a, b);
    });

    gemini.on('blur', () => {
        if (!getValue('always-on-top')) gemini.hide();
    });
};

app.whenReady().then(() => {
    tray = new Tray(path.resolve(__dirname, 'icon.png'));
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Quit Gemini',
            click: () => gemini.close()
        },
        {
            label: 'About (GitHub)',
            click: () => shell.openExternal('https://github.com/nekupaw/gemini-desktop').catch(console.error)
        },
        {
            label: 'always on top',
            type: "checkbox",
            checked: getValue('always-on-top'),
            click: (a) => store.set('always-on-top', a.checked)
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
        exec("document.querySelector('.speech_dictation_mic_button').click()");
    });
}).catch(console.error);
