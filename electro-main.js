const { app, BrowserWindow, Menu, } = require('electron');
const log = require('electron-log');
const { autoUpdater } = require("electron-updater");


// Defining the log
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');


// Declaring the window object
let win;


/**@method sendStatusToWindow to push messages to the window (the interface html page) */
function sendStatusToWindow(text) {
  log.info(text);
  win.webContents.send('message', text);
}

/**@method createDefaultWindow return the configured window object */
function createDefaultWindow() {
  // setting up the window
  win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true
    }
  });

  // opening the devtools on lunch
  win.webContents.openDevTools();
  win.on('closed', () => {
    win = null;
  });
  win.loadURL(`file://${__dirname}/dist/loading.html`);
  return win;
}


app.on('ready', function () {
  // const menu = Menu.buildFromTemplate(template);
  // Menu.setApplicationMenu(menu);
  createDefaultWindow();
  console.log(app.getVersion())
  autoUpdater.checkForUpdatesAndNotify()
});

// Handle the window closure action
app.on('window-all-closed', () => {
  app.quit();
});




/******************************************* */
/************** AUTO UPDATER *************** */
autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
  win.loadURL(`file://${__dirname}/dist/loading.html`);
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
  win.loadURL(`file://${__dirname}/dist/version.html`);
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
  win.loadURL(`file://${__dirname}/dist/electronDemo/index.html`);
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
  win.loadURL(`file://${__dirname}/dist/electronDemo/index.html`);
})

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
})

autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded');
  autoUpdater.quitAndInstall(true, true);
});

/**
 * TODO:
 * 1- Checking the existance of an update before rendering the page
 * 2- If anupdate has beeb deteced, it should no render the index page itself, but it must show a page holding informations about the update
 * 3- (OTHER OPTION) Try using quiet install instead of showing the page of installation
 * 4- Main Objectif is to skip the installation steps in case of updates  (silent install)
 * 5- Create an update page to be displayed in case the app is in update progress mode
 * 6- DO ALL OF THIS FOR THE MAIN APPLICATION WINPHARM
 */
