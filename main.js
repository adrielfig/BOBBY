require('dotenv').config();
const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path')

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
  await fetch(`${process.env.PURGE_URL}`).then(() => {
    console.log('Cache purgado com sucesso!');
  }).catch(error => {
    console.error('Erro ao purgar cache:', error);
  });
  ipcMain.handle('get-cloud-page', async (event, page) => {
    const response = await fetch(`${process.env.GITHUB_CLOUD}/pages/${page}`);
    return response.text();
  });

  ipcMain.handle('get-campeonatos', async () => {
    const response = await fetch(`${process.env.FIREBASE_URL}/campeonatos.json?auth=${process.env.FIREBASE_AUTH_KEY}`);
    return response.json();
  });
  
  createWindow()
})