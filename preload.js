const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getCloudPage: (page) => ipcRenderer.invoke('get-cloud-page', page),
  getCampeonatos: () => ipcRenderer.invoke('get-campeonatos'),
  getIngressos: () => ipcRenderer.invoke('get-ingressos'),
  setCampeonato: (data) => ipcRenderer.invoke('set-campeonato', data),
  setIngresso: (data) => ipcRenderer.invoke('set-ingresso', data),

});
