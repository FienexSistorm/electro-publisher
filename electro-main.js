const {
  app,
  BrowserWindow,
  Menu,
} = require('electron');
const log = require('electron-log');
const {
  autoUpdater
} = require("electron-updater");

//-------------------------------------------------------------------

//-------------------------------------------------------------------
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');



let win;
let progressInterval;

function sendStatusToWindow(text) {
  log.info(text);
  win.webContents.send('message', text);
}

function showProgress(percent) {
  const INTERVAL_DELAY = 100 // ms
  progressInterval = setInterval(() => {
    if (percent < 1) {
      percent += INCREMENT
      win.setProgressBar(percent);
    } else {
      win.setProgressBar(-1);
      clearInterval(progressInterval)
    }
  }, INTERVAL_DELAY)

}

function createDefaultWindow() {
  win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.webContents.openDevTools();
  win.on('closed', () => {
    win = null;
  });
  win.loadURL(`file://${__dirname}/dist/electronDemo/index.html`);
  // win.loadFile("./dist/electronDemo/index.html");
  return win;
}
autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
})

autoUpdater.on('download-progress', (progressObj) => {
  showProgress(progressObj.percent);
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
})

autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded');
  autoUpdater.quitAndInstall();
});

app.on('ready', function () {
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
  console.log(app.getVersion())
  createDefaultWindow();
});

app.on('window-all-closed', () => {
  app.quit();
});

app.on('ready', function () {
  autoUpdater.checkForUpdatesAndNotify();
});


/**
 * TODO:
 * 1- Checking the existance of an update before rendering the page
 * 2- If anupdate has beeb deteced, it should no render the index page itself, but it must show a page holding informations about the update
 * 3- (OTHER OPTION) Try using quiet install instead of showing the page of installation
 * 4- Main Objectif is to skip the installation steps in case of updates  (silent install)
 *
 */
