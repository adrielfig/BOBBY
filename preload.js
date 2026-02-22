const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getCloudPage: (page) => ipcRenderer.invoke('get-cloud-page', page),
  getCampeonatos: () => ipcRenderer.invoke('get-campeonatos'),
  getIngressos: (campeonato) => ipcRenderer.invoke('get-ingressos', campeonato),
  setCampeonato: (data) => ipcRenderer.invoke('set-campeonato', data),
  setIngresso: (data) => ipcRenderer.invoke('set-ingresso', data),

});
