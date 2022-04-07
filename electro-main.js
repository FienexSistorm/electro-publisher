const {
  app,
  BrowserWindow,
  Menu,
  ipcMain
} = require('electron');
const log = require('electron-log');
const {
  autoUpdater
} = require("electron-updater");



// Defining the log
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');


// Declaring the window object
let win;
let loadingWin;
//TODO: Create another window just for loading that will be closed when the mainwindow is rendered
// you can simulate this effect by setting a timeout to initiate the second window
// template :: menu items
let template = [{
    label: "Quit",
    click() {
      console.log("Quit");
      app.quit();
    }
  },
  {
    label: "Reluanch",
    click() {
      console.log("Relaunched");
      app.relaunch();
    }
  },
  {
    label: "Exit",
    click() {
      console.log("Exit");
      app.exit();
    }
  }
];


/**@method sendStatusToWindow to push messages to the window (the interface html page) */
function sendStatusToWindow(text) {
  log.info(text);
  win.webContents.send('message', text);
}

/**@method createDefaultWindow return the configured window object */
function createDefaultWindow() {
  // setting up the window
  win = new BrowserWindow({
    icon: "images/icon.svg",
    modal: true,
    // titleBarStyle: 'hidden',
    // titleBarOverlay: {
    //   color: '#2f3241',
    //   symbolColor: '#74b1be'
    // },,
    parent: loadingWin,
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
  // win.loadURL(`file://${__dirname}/dist/loading.html`);

  win.loadURL(`file://${__dirname}/dist/electronDemo/index.html`);
  return win;
}


function createLoadingWindow() {
  // setting up the window
  loadingWin = new BrowserWindow({
    icon: "images/icon.svg",
    width: 500,
    height: 250,
    frame:false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });
  loadingWin.on('closed', () => {
    loadingWin = null;
  });

  loadingWin.loadURL(`file://${__dirname}/dist/loading.html`);
  return loadingWin;
}





app.on('ready', function () {

  createLoadingWindow();
  setTimeout(() => {
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
    createDefaultWindow()
  }, 5000);

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


// Sanding the current version of the application when requested by the angular application via the 'get-version' listener
ipcMain.on('get-version', (event, arg) => {
  console.log("the request made with this comment", arg)
  event.sender.send('get-version-replay', app.getVersion());
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
