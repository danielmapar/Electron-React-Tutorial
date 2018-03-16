// NodeJS still uses the CommonJS syntax
const electron = require('electron');
const ffmpeg = require('fluent-ffmpeg');

// App is the overall electron process that enables us to create
// child processes (it starts when we start our app up)
// App process is created
const { app, BrowserWindow, ipcMain } = electron;

// For MacOSX users only
app.disableHardwareAcceleration();

let mainWindow;

// Event-based programming
app.on('ready', () => {
  console.log('App is now ready');
  // MainWindow
  mainWindow = new BrowserWindow({});
  // Command+R to reload window
  mainWindow.loadURL(`file://${__dirname}/index.html`);
});

// Receive event from MainWindow
ipcMain.on('video:submit', (event, path) => {
  // event --> carries information on which window triggered the event
  ffmpeg.ffprobe(path, (err, metadata) => {
    console.log('Video duration is: ' + metadata.format.duration);
    mainWindow.webContents.send('video:metadata', metadata.format.duration);
  });
});
