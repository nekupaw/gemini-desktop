const { ipcRenderer } = require('electron');

ipcRenderer.on('toggle-visibility', (e, action) => {
    document.querySelector('.view').classList.toggle('close', !action);
});

ipcRenderer.on('activate-mic', () => {
    const view = document.querySelector('webview');
    view.addEventListener('dom-ready', () => {
        view.executeJavaScript("document.querySelector('.speech_dictation_mic_button').click()", true);
    }, {once: true});
})