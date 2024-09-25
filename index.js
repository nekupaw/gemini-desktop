const {app, Tray, Menu, shell, BrowserWindow, globalShortcut, screen, ipcMain} = require('electron');
const path = require('path');
const Store = require('electron-store');
const store = new Store();

let tray, gemini, visible = true;

const exec = code => gemini.webContents.executeJavaScript(code).catch(console.error),
    getValue = key => store.get(key, false);

const toggleVisibility = action => {
    visible = action;
    action ? gemini.show() : setTimeout(() => gemini.hide(), 400);
    gemini.webContents.send('toggle-visibility', action);
};

const registerKeybindings = () => {
    globalShortcut.unregisterAll();
    const shortcutA = getValue('shortcutA'),
        shortcutB = getValue('shortcutB');

    if (shortcutA) {
        globalShortcut.register(shortcutA, () => toggleVisibility(!visible));
    }

    if (shortcutB) {
        globalShortcut.register(shortcutB, () => {
            toggleVisibility(true);
            exec("document.querySelector('.speech_dictation_mic_button').click()");
        });
    }
};

const createWindow = () => {
    const {width, height} = screen.getPrimaryDisplay().bounds,
        winWidth = 400, winHeight = 700;

    gemini = new BrowserWindow({
        width: winWidth,
        height: winHeight,
        frame: false,
        maximizable: false,
        resizable: false,
        skipTaskbar: true,
        alwaysOnTop: true,
        transparent: true,
        x: width - winWidth - 10,
        y: height - winHeight - 50,
        icon: path.resolve(__dirname, 'icon.png'),
        webPreferences: {
            contextIsolation: true,
            devTools: true,
            nodeIntegration: false,
            webviewTag: true,
            preload: path.join(__dirname, 'src/preload.js')
        }
    });

    gemini.loadFile('src/index.html').catch(console.error);

    gemini.on('blur', () => {
        if (!getValue('always-on-top')) toggleVisibility(true);
    });

    ipcMain.handle('get-local-storage', (event, key) => getValue(key));
    ipcMain.on('set-local-storage', (event, key, value) => {
        store.set(key, value);
        registerKeybindings();
    });
    ipcMain.on('close', event => {
        BrowserWindow.fromWebContents(event.sender).close();
    });
};

const createTray = () => {
    tray = new Tray(path.resolve(__dirname, 'icon.png'));
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'About (GitHub)',
            click: () => shell.openExternal('https://github.com/nekupaw/gemini-desktop').catch(console.error)
        },
        {type: 'separator'},
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
                        contextIsolation: true,
                        preload: path.join(__dirname, 'components/setKeybindingsOverlay/preload.js')
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
            click: menuItem => store.set('always-on-top', menuItem.checked)
        },
        {type: 'separator'},
        {
            label: 'Quit Gemini',
            click: () => gemini.close()
        }
    ]);

    tray.setContextMenu(contextMenu);
    tray.on('click', () => toggleVisibility(true));
};

app.whenReady().then(() => {
    createTray();
    createWindow();
    registerKeybindings();
}).catch(console.error);
