const { app, Tray, Menu, shell, BrowserWindow, globalShortcut, screen, ipcMain } = require('electron');
const path = require('path');
const Store = require('electron-store');
const store = new Store();

let tray, gemini;

function exec(code) {
    gemini.webContents.executeJavaScript(code).catch(console.error);
}

function getValue(val) {
    return store.get(val, true);
}

function optimizePage() {
    exec(`
        function get(selector) { 
            return document.querySelector(selector); 
        }

        function cb(tag, text, className, children, attributeName, attributeValue) { 
            const element = document.createElement(tag); 
            if (text) element.textContent = text; 
            if (className) element.className = className; 
            if (children) children.forEach(child => element.appendChild(child)); 
            if (attributeName) element.setAttribute(attributeName, attributeValue); 
            return element; 
        }

        const style = document.createElement('style');
        style.textContent = ".containerA { margin-top: 30px; display: flex; flex-direction: column; gap: 10px; } .containerA p { font-family: 'Google Sans', 'Helvetica Neue', sans-serif; opacity: 0.2; margin: 0; } .containerB { height: 70px; width: 100%; padding: 20px; box-sizing: border-box; border-radius: 10px; background: #202026; display: flex; justify-content: space-between; margin-top: 50px; align-items: center; p{font-family: 'Google Sans', 'Helvetica Neue', sans-serif; opacity: 0.5; font-size: 20px; margin: 0}} .containerB label{ position: relative; display: inline-block; width: 43px; height: 24px; } .containerB input { opacity: 0; width: 0; height: 0; } .containerB span { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #3a394d; transition: .2s; border-radius: 34px; } .containerB input:checked + span { background-color: #8a6979; } .containerB input:focus + span { box-shadow: 0 0 1px #7986b9; } .containerB input:checked + span:before { transform: translateX(20px); } .containerB span:before { position: absolute; content: ''; height: 15px; width: 15px; left: 4px; bottom: 4px; background-color: white; transition: .2s ease; border-radius: 34px; }";
        document.head.appendChild(style);

        get('.prompt-suggestion-cards-container').remove();
        get('.gmat-caption').textContent = "Gemini Client by @nekupaw";
        get('.gmat-caption').style.opacity = "0.5";

        const checkBox = cb('input', null, null, null, "type", "checkbox");
        window.electron.getLocalStorage('get-always-on-top').then(value => {
            checkBox.checked = value;
        });
        checkBox.onchange = (event) => window.electron.setLocalStorage('set-always-on-top', event.target.checked);

        const containerA = cb('div', null, 'containerA', [
            cb("p", "open Gemini from anywhere with [CTRL + G]"), 
            cb("p", "talk to Gemini with [CTRL + Shift + G]")
        ]);

        const containerB = cb('div', null, 'containerB', [
            cb("p", "window always on top"),
            cb("label", null, null, [checkBox, cb('span')])
        ]);

        get('.zero-state-wrapper').append(containerB, containerA);
    `);
}

const createWindow = () => {
    const { width, height } = screen.getPrimaryDisplay().bounds;
    const winWidth = 400, winHeight = 700;

    gemini = new BrowserWindow({
        width: winWidth, height: winHeight,
        frame: false,
        maximizable: false,
        resizable: false,
        skipTaskbar: true,
        alwaysOnTop: true,
        x: width - winWidth - 10, y: height - winHeight - 50,
        icon: path.resolve(__dirname, 'icon.png'),
        webPreferences: { contextIsolation: true, devTools: true, preload: path.resolve(__dirname, 'preload.js') }
    });

    gemini.loadURL('https://gemini.google.com/app').catch(console.error);

    gemini.webContents.on('did-finish-load', optimizePage);
    gemini.webContents.on('did-navigate', optimizePage);

    ipcMain.handle('get-always-on-top', () => {
        return getValue('alwaysOnTop');
    });

    ipcMain.on('set-always-on-top', (event, value) => {
        store.set('alwaysOnTop', value);
        gemini.setAlwaysOnTop(value); // Setze den Wert für das Fenster
    });

    gemini.on('blur', () => {
        if (getValue('alwaysOnTop')) gemini.hide();
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
