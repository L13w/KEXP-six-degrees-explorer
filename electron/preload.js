const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  scanShows: () => ipcRenderer.invoke('scan-shows'),
});
