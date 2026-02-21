require('dotenv').config();
const { app, BrowserWindow, Menu } = require('electron')

app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: './assets/images/icon.jpg',
  })

  win.loadFile('./assets/pages/index.html')
  Menu.setApplicationMenu(null);
})