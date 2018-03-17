const electron = require('electron');
const { Tray, Menu, app, ipcMain } = electron;

class TimerTray extends Tray {
  constructor(iconPath, mainWindow) {
    super(iconPath)

    this.mainWindow = mainWindow;

    this.setToolTip('Timer App');
    this.on('click', this.onClick.bind(this));
    this.on('right-click', this.onRightClick.bind(this));
    ipcMain.on('update-timer', this.updateTimer.bind(this));
  }

  updateTimer(event, timeLeft) {
    this.setTitle(timeLeft);
  }

  onRightClick() {
    const menuConfig = Menu.buildFromTemplate([
      {
        label: 'Quit',
        click: () => app.quit()
      }
    ]);
    this.popUpContextMenu(menuConfig);
  }

  onClick(event, bounds) {
    // console.log(bounds.x, bounds.y) -> Position of the click (top right)
    // Click event bounds
    const { x, y } = bounds;

    // Windows height and width
    const { height, width } = this.mainWindow.getBounds();

    if (this.mainWindow.isVisible()) {
      this.mainWindow.hide();
    } else {
      const yPosition = process.platform === 'darwin' ? y : y - height;
      const xPosition = x - (width/2);
      this.mainWindow.setBounds({
        x: xPosition,
        y: yPosition,
        height,
        width,
      });
      this.mainWindow.show();
    }
  }

}

module.exports = TimerTray;
