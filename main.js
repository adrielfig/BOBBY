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
  //Menu.setApplicationMenu(null);
}

app.whenReady().then(() => {
  ipcMain.handle('get-cloud-page', async (event, page) => {
    const response = await fetch(`${process.env.GITHUB_CLOUD}/pages/${page}`);
    return response.text();
  });
  
  createWindow()
})