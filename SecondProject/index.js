const electron = require('electron');

const { app, BrowserWindow, Menu, ipcMain } = electron;

// For MacOSX users only
app.disableHardwareAcceleration();

let mainWindow;
let addWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(`file://${__dirname}/main.html`);

  // Destroy all windows on quit
  mainWindow.on('closed', () => app.quit());

  // Set app top menu
  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

function createAddWindow() {
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: 'Add New Todo'
  });
  addWindow.loadURL(`file://${__dirname}/add.html`);

  // Garbage collection of the window
  addWindow.on('close', () => addWindow = null);
}

ipcMain.on('todo:add', (event, todo) => {
  mainWindow.webContents.send('todo:add', todo);
  addWindow.close();
  //addWindow = null; // Garbage collection
});

function clearTodo(){
  mainWindow.webContents.send('todo:clear');
}

// Each item in this array corresponds to a menu option on the top
const menuTemplate = [
  //{}, // MacOSX first element is the apps name
  {
    label: 'File',
    submenu: [
      {
        label: 'New Todo',
        click() {
          createAddWindow();
        }
      },
      {
        label: 'Clear Todo',
        click() {
          clearTodo();
        }
      },
      {
        label: 'Quit',
        //accelerator: 'Command+Q', // hot key to access this option
        /*accelerator: (() => {
          if (process.platform === 'darwin') {
            return 'Command+Q';
          }
          return 'Ctrl+Q';
        })(), // Using an IIFE*/
        accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click() {
          app.quit();
        }
      }
    ]
  }
];

if (process.platform === 'darwin') {
  menuTemplate.unshift({}); // MacOSX first element is the apps name
}

if (process.env.NODE_ENV !== 'production') {
  menuTemplate.push({
    label: 'Developer',
    submenu: [
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Command+Alt+I' : 'Ctrl+Shift+I',
        click(item, focusedWindow) {
          // We will open the developer tools in the current focused window
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: 'reload' // Electron shortcuts
      }
    ]
  });
}
