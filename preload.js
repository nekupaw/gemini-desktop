const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    getLocalStorage: (key) => ipcRenderer.invoke('get-local-storage', key),
    setLocalStorage: (key, value) => ipcRenderer.send('set-local-storage', key, value)
});
