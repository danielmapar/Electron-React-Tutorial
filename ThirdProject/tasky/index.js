const electron = require('electron');

const { app, BrowserWindow } = electron;

let mainWindow;

// LECTURE 40
app.on('ready', () => {
  mainWindow = new BrowserWindow({
    height: 500,
    width: 300,
    frame: false, // Remove top bar
    resizable: false
  });
  mainWindow.loadURL(`file://${__dirname}/src/index.html`)
});
