const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getCloudPage: (page) => ipcRenderer.invoke('get-cloud-page', page),
  getCampeonatos: () => ipcRenderer.invoke('get-campeonatos'),
  getIngressos: (campeonato) => ipcRenderer.invoke('get-ingressos', campeonato),
  criarCampeonato: (data) => ipcRenderer.invoke('criar-campeonato', data),
  excluirCampeonato: (data) => ipcRenderer.invoke('excluir-campeonato', data),
  setIngresso: (data) => ipcRenderer.invoke('set-ingresso', data),
  excluirIngresso: (campeonato, id) => ipcRenderer.invoke('excluir-ingresso', campeonato, id),
  atualizarIngresso: (campeonato, id, data) => ipcRenderer.invoke('atualizar-ingresso', campeonato, id, data),
  getEstatisticas: () => ipcRenderer.invoke('get-estatisticas'),
  windowMinimize: () => ipcRenderer.invoke('window-minimize'),
  windowToggleMaximize: () => ipcRenderer.invoke('window-toggle-maximize'),
  windowClose: () => ipcRenderer.invoke('window-close'),

});
