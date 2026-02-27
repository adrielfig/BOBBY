require('dotenv').config();
const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs');

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'assets', 'images', 'icon.jpg'),
    resizable: false,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })
  mainWindow.maximize();
  mainWindow.loadFile('./index.html')
  Menu.setApplicationMenu(null);
}

app.whenReady().then(async () => {
  ipcMain.handle('get-cloud-page', async (event, page) => {
    await fetch(`${process.env.PURGE_URL}/pages/${page}`)
    const response = await fetch(`${process.env.GITHUB_CLOUD}/pages/${page}`, {
      cache: 'no-store'
    });
    return await response.text();
  });

  ipcMain.handle('get-campeonatos', async () => {
    const response = await fetch(`${process.env.FIREBASE_URL}/campeonatos.json?auth=${process.env.FIREBASE_AUTH_KEY}`, {
      cache: 'no-store'
    });
    const body = await response.json();
    if (!body) return [];
    console.log(body);
    console.log(Object.keys(body));
    console.log(body ? Object.keys(body).map(key => ({ nome: key })) : [])

    return body ? Object.keys(body).map(key => ({ nome: key})) : [];
  });  

  ipcMain.handle('get-ingressos', async (event, campeonato) => {
    const response = await fetch(`${process.env.FIREBASE_URL}/campeonatos/${campeonato}/ingressos.json?auth=${process.env.FIREBASE_AUTH_KEY}`, {
      cache: 'no-store'
    });
    return response.json();
  });

  ipcMain.handle('criar-campeonato', async (event, data) => {
    const exists = await fetch(`${process.env.FIREBASE_URL}/campeonatos/${data}.json?auth=${process.env.FIREBASE_AUTH_KEY}`, {
      cache: 'no-store'
    });

    const existResult = await exists.text()

    if (existResult !== "null" && existResult !== null) return "existente";

    const response = await fetch(`${process.env.FIREBASE_URL}/campeonatos/${data}.json?auth=${process.env.FIREBASE_AUTH_KEY}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'      },
      body: JSON.stringify({ createdAt: new Date().toISOString() })
    });

    return response.json();
  });

  ipcMain.handle('excluir-campeonato', async (event, data) => {

    const response = await fetch(`${process.env.FIREBASE_URL}/campeonatos/${data}.json?auth=${process.env.FIREBASE_AUTH_KEY}`, {
      method: 'DELETE'
    });
    return response.json();
  });

  ipcMain.handle('set-ingresso', async (event, data) => {
    try {
      if (!data || !data.campeonato || !data.ingresso) {
        throw new Error('Dados de ingresso inválidos.');
      }

      const { campeonato, ingresso } = data;

      const response = await fetch(`${process.env.FIREBASE_URL}/campeonatos/${campeonato}/ingressos.json?auth=${process.env.FIREBASE_AUTH_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ingresso)
      });

      return response.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  });

  ipcMain.handle('excluir-ingresso', async (event, campeonato, id) => {
    const response = await fetch(`${process.env.FIREBASE_URL}/campeonatos/${campeonato}/ingressos/${id}.json?auth=${process.env.FIREBASE_AUTH_KEY}`, {
      method: 'DELETE'
    });
    return response.json();
  });

  ipcMain.handle('atualizar-ingresso', async (event, campeonato, id, data) => {
    const response = await fetch(`${process.env.FIREBASE_URL}/campeonatos/${campeonato}/ingressos/${id}.json?auth=${process.env.FIREBASE_AUTH_KEY}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  });

  ipcMain.handle('get-estatisticas', async () => {
    try {
      const campeonatosResponse = await fetch(`${process.env.FIREBASE_URL}/campeonatos.json?auth=${process.env.FIREBASE_AUTH_KEY}`, {
        cache: 'no-store'
      });
      const campeonatosBody = await campeonatosResponse.json();
      const campeonatos = campeonatosBody ? Object.keys(campeonatosBody) : [];

      let totalIngressos = 0;
      let totalCompras = 0;
      const ingressosPorCampeonato = [];

      for (const nome of campeonatos) {
        const ingressosResponse = await fetch(`${process.env.FIREBASE_URL}/campeonatos/${nome}/ingressos.json?auth=${process.env.FIREBASE_AUTH_KEY}`, {
          cache: 'no-store'
        });
        const ingressosBody = await ingressosResponse.json();
        const ingressosIds = ingressosBody ? Object.keys(ingressosBody) : [];
        const quantidadeIngressos = ingressosIds.length;
        let quantidadeCompras = 0;

        ingressosIds.forEach(id => {
          const ingresso = ingressosBody[id];
          if (ingresso && ingresso.compras && typeof ingresso.compras === 'object') {
            quantidadeCompras += Object.keys(ingresso.compras).length;
          }
        });

        totalIngressos += quantidadeIngressos;
        totalCompras += quantidadeCompras;

        ingressosPorCampeonato.push({
          campeonato: nome,
          quantidadeIngressos,
          quantidadeCompras
        });
      }

      return {
        totalCampeonatos: campeonatos.length,
        totalIngressos,
        totalCompras,
        ingressosPorCampeonato
      };
    } catch (error) {
      console.error(error);
      return {
        totalCampeonatos: 0,
        totalIngressos: 0,
        ingressosPorCampeonato: []
      };
    }
  });

  ipcMain.handle('window-minimize', () => {
    if (mainWindow) mainWindow.minimize();
  });

  ipcMain.handle('window-toggle-maximize', () => {
    if (!mainWindow) return;
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });

  ipcMain.handle('window-close', () => {
    if (mainWindow) mainWindow.close();
  });

  createWindow()
})