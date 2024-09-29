const { ipcRenderer } = require('electron');

ipcRenderer.on('toggle-visibility', (e, action) => {
    document.querySelector('.view').classList.toggle('close', !action);
});
