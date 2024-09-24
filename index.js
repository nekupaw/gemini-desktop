const {app, Tray, Menu, shell, BrowserWindow, globalShortcut, screen, ipcMain} = require('electron');
const path = require('path');
const Store = require('electron-store');
const store = new Store();

let tray, gemini;

function exec(code) {
    gemini.webContents.executeJavaScript(code).catch(console.error);
}

function getValue(key) {
    return store.get(key, false);
}

function registerKeybindings() {
    globalShortcut.unregisterAll();

    const shortcutA = getValue('shortcutA'),
          shortcutB = getValue('shortcutB');

    if (shortcutA) {
        globalShortcut.register(shortcutA, () => {
            gemini.isVisible() ? gemini.hide() : gemini.show();
        });
    }

    if (shortcutB) {
        globalShortcut.register(shortcutB, () => {
            if (!gemini.isVisible()) gemini.show();
            exec("document.querySelector('.speech_dictation_mic_button').click()");
        });
    }
}

function optimizePage() {
    exec(`
        function createElement(tag, text = '', className = '', children = [], attribute = '', value = '') {
            const el = document.createElement(tag);
            if (text) el.textContent = text;
            if (className) el.className = className;
            if (attribute) el.setAttribute(attribute, value);
            children.forEach(child => el.appendChild(child));
            return el;
        }

        const style = document.createElement("style");
        style.textContent = ".containerA { margin-top: 30px; display: flex; flex-direction: column; gap: 10px; } .containerA p { font-family: 'Google Sans', 'Helvetica Neue', sans-serif; opacity: 0.2; margin: 0; }";
        document.head.appendChild(style);

        document.querySelector(".prompt-suggestion-cards-container")?.remove();
        const caption = document.querySelector(".gmat-caption");
        if (caption) {
            caption.textContent = "Gemini Client by @nekupaw";
            caption.style.opacity = "0.5";
        }

        const zeroStateWrapper = document.querySelector(".zero-state-wrapper");
        if (zeroStateWrapper) {
            zeroStateWrapper.appendChild(
                createElement("div", "", "containerA", [
                    createElement("p", "Open Gemini from anywhere with [CTRL + G]"),
                    createElement("p", "Talk to Gemini with [CTRL + Shift + G]")
                ])
            );
        }
    `);
}

function createWindow() {
    const {width, height} = screen.getPrimaryDisplay().bounds;
    const winWidth = 400, winHeight = 700;

    gemini = new BrowserWindow({
        width: winWidth,
        height: winHeight,
        frame: false,
        maximizable: false,
        resizable: false,
        skipTaskbar: true,
        alwaysOnTop: true,
        x: width - winWidth - 10,
        y: height - winHeight - 50,
        icon: path.resolve(__dirname, 'icon.png'),
        webPreferences: { contextIsolation: true, devTools: true, nodeIntegration: false }
    });

    gemini.loadURL('https://gemini.google.com/app').catch(console.error);

    gemini.webContents.on('did-finish-load', optimizePage);
    gemini.webContents.on('did-navigate', optimizePage);

    gemini.on('blur', () => {
        if (!getValue('always-on-top')) gemini.hide();
    });

    ipcMain.handle('get-local-storage', (event, key) => getValue(key));

    ipcMain.on('set-local-storage', (event, key, value) => {
        store.set(key, value);
        registerKeybindings();
    });

    ipcMain.on('close', (event) => {
        BrowserWindow.fromWebContents(event.sender).close();
    });
}

function createTray() {
    tray = new Tray(path.resolve(__dirname, 'icon.png'));

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'About (GitHub)',
            click: () => shell.openExternal('https://github.com/nekupaw/gemini-desktop').catch(console.error)
        },
        { type: 'separator' },
        {
            label: "Set Keybindings",
            click: () => {
                const dialog = new BrowserWindow({
                    width: 500,
                    height: 370,
                    frame: false,
                    maximizable: false,
                    resizable: false,
                    skipTaskbar: true,
                    webPreferences: {
                        contextIsolation: true, preload: path.join(__dirname, 'components/setKeybindingsOverlay/preload.js')
                    }
                });
                dialog.loadFile('components/setKeybindingsOverlay/index.html').catch(console.error);
                dialog.show();
            }
        },
        {
            label: 'Always on Top',
            type: 'checkbox',
            checked: getValue('always-on-top'),
            click: (menuItem) => store.set('always-on-top', menuItem.checked)
        },
        { type: 'separator' },
        {
            label: 'Quit Gemini',
            click: () => gemini.close()
        }
    ]);

    tray.setContextMenu(contextMenu);
    tray.on('click', () => gemini.show());
}

app.whenReady().then(() => {
    createTray();
    createWindow();
    registerKeybindings();
}).catch(console.error);
