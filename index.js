const { app, Tray, Menu, shell, BrowserWindow, globalShortcut, screen, desktopCapturer} = require('electron');
const path = require('path');
const Store = require('electron-store');

const store = new Store();

let tray;
let win;
let icon = path.join(__dirname, 'icon/google-gemini-icon.png');

const isAlreadyRunning = app.requestSingleInstanceLock();

if (isAlreadyRunning) {
    app.on('second-instance', app.quit);
}

const createWindow = () => {
    const display = screen.getPrimaryDisplay();

    const lastWinWidth = store.get('winWidth', 430);

    let width = display.bounds.width;
    let height = display.bounds.height;

    win = new BrowserWindow({
        width: lastWinWidth,
        height: 800,
        maxHeight: 800,
        maxWidth: 430,
        minHeight: 800,
        minWidth: 400,
        show: false,
        frame: false,
        skipTaskbar: true,
        showInBackground: true,
        x: width - 460,
        y: height -860,
        icon: icon,
        webPreferences: {
            devTools: false
        }
    });

    win.loadURL('https://gemini.google.com/app');

    win.on('close', () => {
        store.set('winWidth', win.getBounds().width);
    })

    win.webContents.on('did-finish-load', () => {
        loadPreScript();
        win.show();
    });

    win.webContents.on('did-navigate', () => {
        loadPreScript();
    });

    win.on('blur', win.hide);
};

app.whenReady().then(() => {
    tray = new Tray(icon);
    const contextMenu = Menu.buildFromTemplate([
        {label: 'Quit Gemini', type: 'normal', click: () => {
            win.close();
            }},
        {label: 'about (GitHub)', type: 'normal', click: () => {
                const url = 'https://github.com/nekupaw/gemini-desktop';
                shell.openExternal(url);
            }}
    ])
    tray.setContextMenu(contextMenu);
    tray.on('click', (event) => {
        win.show();
    })

    createWindow();

    globalShortcut.register('Ctrl+g', () => {
        if (win.isVisible()) win.hide();
        else win.show();
    })

    globalShortcut.register('Ctrl+Shift+g', () => {
        if (!win.isVisible()) win.show();
        win.webContents.executeJavaScript("document.querySelector('.speech_dictation_mic_button').click()");
    })
});

function loadPreScript() {
    win.webContents.executeJavaScript(`
    const loginFrame = document.getElementsByClassName('gb_Ld')[0];
    const openWithText = document.createElement('span');
    openWithText.textContent = "open Gemini with [Ctrl] + [G]";
    openWithText.style.cssText = 'font-family: "Google Sans","Helvetica Neue",sans-serif; font-size: 15px; opacity: 0; transition: 0.2s';
    setTimeout(() => {openWithText.style.opacity = 0.5;}, 600);
    
    const openMicText = document.createElement('span');
    openMicText.textContent = 'activate mic with [Ctrl] + [Shift] + [G]';
    openMicText.style.cssText = 'font-family: "Google Sans","Helvetica Neue",sans-serif; font-size: 15px; opacity: 0; transition: 0.2s';
    setTimeout(() => {openMicText.style.opacity = 0.5;},700);

    if (!loginFrame) {

        const gmatCaption = document.querySelector('.gmat-caption');
        const zeroStateWrapper = document.querySelector('.zero-state-wrapper');
        
        zeroStateWrapper.style.cssText = 'display: flex; flex-direction: column; gap: 10px;';
        zeroStateWrapper.append(openWithText, openMicText);
        gmatCaption.textContent = 'Gemini Client for Windows by @nekupaw';
        gmatCaption.style.opacity = '0.5';
        const hello = document.querySelector('.bard-hello').textContent.split(' ');
        const greetings = ['heyaa', 'hewuu', 'hiii', 'ayy'];
        hello[0] = greetings[Math.floor(Math.random() * greetings.length)];
        document.querySelector('.bard-hello').textContent = hello.join(' ');
        document.querySelector('.bard-question').textContent = 'how can I help? owo';
    }`);
}
