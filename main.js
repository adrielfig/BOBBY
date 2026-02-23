require('dotenv').config();
const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'assets', 'images', 'icon.jpg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  win.loadFile('./index.html')
  // Menu.setApplicationMenu(null);
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

  createWindow()
})