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
function get(e){return document.querySelector(e)}function cb(e,t,n,o,a,i){let c=document.createElement(e);return t&&(c.textContent=t),n&&(c.className=n),o&&o.forEach(e=>c.appendChild(e)),a&&c.setAttribute(a,i),c}const style=document.createElement("style");style.textContent=".containerA { margin-top: 30px; display: flex; flex-direction: column; gap: 10px; } .containerA p { font-family: 'Google Sans', 'Helvetica Neue', sans-serif; opacity: 0.2; margin: 0; } .containerB { height: 70px; width: 100%; padding: 20px; box-sizing: border-box; border-radius: 10px; background: #202026; display: flex; justify-content: space-between; margin-top: 50px; align-items: center; p{font-family: 'Google Sans', 'Helvetica Neue', sans-serif; opacity: 0.5; font-size: 20px; margin: 0}} .containerB label{ position: relative; display: inline-block; width: 43px; height: 24px; } .containerB input { opacity: 0; width: 0; height: 0; } .containerB span { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #3a394d; transition: .2s; border-radius: 34px; } .containerB input:checked + span { background-color: #8a6979; } .containerB input:focus + span { box-shadow: 0 0 1px #7986b9; } .containerB input:checked + span:before { transform: translateX(20px); } .containerB span:before { position: absolute; content: ''; height: 15px; width: 15px; left: 4px; bottom: 4px; background-color: white; transition: .2s ease; border-radius: 34px; }",document.head.appendChild(style),get(".prompt-suggestion-cards-container").remove(),get(".gmat-caption").textContent="Gemini Client by @nekupaw",get(".gmat-caption").style.opacity="0.5";const checkBox=cb("input",null,null,null,"type","checkbox");window.electron.getLocalStorage("always-on-top").then(e=>{checkBox.checked=e}),checkBox.onchange=e=>window.electron.setLocalStorage("always-on-top",e.target.checked);const containerA=cb("div",null,"containerA",[cb("p","open Gemini from anywhere with [CTRL + G]"),cb("p","talk to Gemini with [CTRL + Shift + G]")]),containerB=cb("div",null,"containerB",[cb("p","window always on top"),cb("label",null,null,[checkBox,cb("span")])]);get(".zero-state-wrapper").append(containerB,containerA);
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
        }
        // {
        //     label: 'always on top',
        //     type: "checkbox",
        //     checked: getValue('always-on-top'),
        //     click: (a) => store.set('always-on-top', a.checked)
        // }
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
