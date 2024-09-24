const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('electron', {
    getLocalStorage: a => ipcRenderer.invoke('get-local-storage', a),
    setLocalStorage: (a, b) => ipcRenderer.send('set-local-storage', a, b),
    close: () => ipcRenderer.send('close')
});
