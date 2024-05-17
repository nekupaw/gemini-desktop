const { app, Tray, Menu, shell, BrowserWindow, globalShortcut, screen, systemPreferences } = require('electron');
const path = require('path');
const { generateColor } = require('./generateColor');

let tray;
let win;
const icon = path.join(__dirname, 'icon/google-gemini-icon.png');
const accentColor = systemPreferences.getAccentColor().substring(0, 6);
const backgroundColorAccent = generateColor(`#${accentColor}`, 0.2);

const isAlreadyRunning = app.requestSingleInstanceLock();

if (!isAlreadyRunning) {
    app.quit();
} else {
    app.on('second-instance', () => {
        if (win) {
            if (win.isMinimized()) win.restore();
            win.focus();
        }
    });
}

const createWindow = () => {
    const { width, height } = screen.getPrimaryDisplay().bounds;

    win = new BrowserWindow({
        width: 430,
        height: 800,
        show: false,
        frame: false,
        skipTaskbar: true,
        x: width - 440,
        y: height - 860,
        icon: icon,
        maximizable: false,
        resizable: false,
        webPreferences: {
            devTools: true
        }
    });

    win.loadURL('https://gemini.google.com/app').catch(console.error);

    Menu.setApplicationMenu(null);

    win.webContents.on('did-finish-load', loadPreScript);
    win.webContents.on('did-navigate', loadPreScript);

    win.on('blur', () => win.hide());
};

app.whenReady().then(() => {
    tray = new Tray(icon);
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Quit Gemini',
            type: 'normal',
            click: () => win.close()
        },
        {
            label: 'about (GitHub)',
            type: 'normal',
            click: () => shell.openExternal('https://github.com/nekupaw/gemini-desktop').catch(console.error)
        }
    ]);
    tray.setContextMenu(contextMenu);
    tray.on('click', () => win.show());

    createWindow();

    globalShortcut.register('Ctrl+g', () => {
        if (win.isVisible()) win.hide();
        else win.show();
    });

    globalShortcut.register('Ctrl+Shift+g', () => {
        if (!win.isVisible()) win.show();
        win.webContents.executeJavaScript("document.querySelector('.speech_dictation_mic_button').click()").catch(console.error);
    });
}).catch(console.error);

const preScript = `
    const darkMode = document.body.classList.contains('dark-theme');
    function a(a) {
        return document.querySelector('.' + a);
    }
    const loginFrame = document.getElementsByClassName('gb_Ld')[0];
    const addedTextStyle = {
        marginTop: '10px',
        fontFamily: 'Google Sans',
        fontSize: '15px',
        opacity: 0,
        transition: 'opacity 0.4s',
        pointerEvents: 'none'
    };
    const openWithText = document.createElement('span');
    openWithText.textContent = "open Gemini with [Ctrl] + [G]";
    Object.assign(openWithText.style, addedTextStyle);
    const openMicText = document.createElement('span');
    openMicText.textContent = 'activate mic with [Ctrl] + [Shift] + [G]';
    Object.assign(openMicText.style, addedTextStyle);

    if (!loginFrame) {
        const gmatCaption = document.querySelector('.gmat-caption');
        const zeroStateWrapper = document.querySelector('.zero-state-wrapper');
        zeroStateWrapper.style.cssText = 'display: flex; flex-direction: column; gap: 10px;';
        zeroStateWrapper.append(openWithText, openMicText);
        gmatCaption.textContent = 'Gemini Client for Windows by @nekupaw';
        const hello = document.querySelector('.bard-hello').textContent.split(' ');
        const greetings = ['heyaa', 'hewuu', 'hiii', 'ayy'];
        hello[0] = greetings[Math.floor(Math.random() * greetings.length)];
        document.querySelector('.bard-hello').textContent = hello.join(' ');
        document.querySelector('.bard-hello').style.pointerEvents = 'none';
        document.querySelector('.bard-question').textContent = 'how can I help? owo';
        let o;
        if (darkMode) {
            o = 0.5;
            const style = document.createElement('style');
            style.textContent = \`
                body, .chat-container, .response-container, .chat-history, .mat-drawer, 
                .mat-expansion-panel-header, .mat-expansion-panel-content {background-color: ${backgroundColorAccent} !important}
                .bottom-container:before {background: linear-gradient(to top, ${backgroundColorAccent}, rgba(0, 0, 0, 0)) !important}
                .bottom-container, .mat-bottom-sheet-container, .bard-mode-bottom-sheet, .mat-mdc-dialog-surface {background: ${backgroundColorAccent} !important}
                .bard-question {pointer-events: none}
                .gmat-caption {pointer-events: none !important}
                .text-input-field, .circular-background {background: none !important; backdrop-filter: brightness(0.7)}
                .bard-question {color: white !important; opacity: 0.4}
                .prompt-container, .prompt-icon-container {background: rgba(255, 255, 255, 0.1) !important; transition: all 0.3s ease !important}
                .prompt-container:hover{background: rgba(255, 255, 255, 0.15) !important}
            \`;
            document.head.appendChild(style);
        } else o = 0.8;
        Object.assign(gmatCaption.style, {
            opacity: o,
            pointerEvents: 'none'
        });
        setTimeout(() => { openWithText.style.opacity = o; }, 600);
        setTimeout(() => { openMicText.style.opacity = o; }, 700);
    }
`;

function loadPreScript() {
    setTimeout(() => {
        win.webContents.executeJavaScript(preScript).then(() => {
            setTimeout(() => win.show(), 2500);
        }).catch(console.error);
    }, 500);
}
