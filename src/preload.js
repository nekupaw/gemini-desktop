const { ipcRenderer } = require('electron');

ipcRenderer.on('toggle-visibility', (e, action) => {
    document.querySelector('webview').classList.toggle('close', !action);
    console.log('test');
});