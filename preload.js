const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getCloudPage: (page) => ipcRenderer.invoke('get-cloud-page', page)
});
