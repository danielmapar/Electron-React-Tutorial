const path = require('path');
const electron = require('electron');
const MainWindow = require('./app/main_window');
const TimerTray = require('./app/timer_tray');

const { app, BrowserWindow } = electron;

let mainWindow;
let tray;

app.on('ready', () => {
  // Hide dock icon
  app.dock.hide();

  mainWindow = new MainWindow({
    height: 500,
    width: 300,
    frame: false, // Remove top bar
    resizable: false,
    show: false, // Browser window not visible
    // Electron slows down a process in case the window is not open
    // To disable that and make the clock work normally, we set throttling to false
    webPreferences: { backgroundThrottling: false }
  });
  mainWindow.loadURL(`file://${__dirname}/src/index.html`);

  // Electron will process the '@2x' separatly
  const iconName = process.platform === 'win32' ? 'windows-icon.png' : 'iconTemplate.png';
  const iconPath = path.join(__dirname, `./src/assets/${iconName}`);

  // It will get garbage collected over time if we remove "let tray"
  tray = new TimerTray(iconPath, mainWindow);
});
