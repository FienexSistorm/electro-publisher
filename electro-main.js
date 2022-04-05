const { app, screen, BrowserWindow, globalShortcut, Menu, } = require("electron");
const { autoUpdater } = require("electron-updater");

const path = require("path");

let mainWindow;



//-----------------------------------------
// -----------------LOGGING---------------
//-----------------------------------------
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');
/*-------------- END OF LOGGING----------- */


const createWindow = () => {
  // getting the size of the screen
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    title: "Electropharm",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      webSecurity: false,
      devTools: true,
      nodeIntegration: true,
    },
  });
  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      {
        label: "Refresh",
        accelerator: "Ctrl+R",
        click() {
          BrowserWindow.getFocusedWindow().reload();
          mainWindow.loadFile("dist/electronDemo/index.html");
        },
      },
      {
        label: "Inspect",
        accelerator: "Shift+CommandOrControl+I",
        click() {
          console.log("inspected");
          mainWindow.webContents.openDevTools();
        },
      },
    ])
  );
  mainWindow.loadFile("dist/electronDemo/index.html");

  mainWindow.on("resize", () => {
    console.log("resizing");
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
};

var reload = () => {
  BrowserWindow.getFocusedWindow().reload();
  mainWindow.loadFile("dist/electronDemo/index.html");
};







//// CREATING THE APPLICATION FRAME
app.whenReady()
  .then(() => {
    globalShortcut.register("Shift+CommandOrControl+I", () => {
      mainWindow.webContents.openDevTools();
    });
  }).then(() => {
    createWindow();
    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });
app.on("session-created", () => console.log("session created"));

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    console.log("closed");
  }
});

/*----------------------------------------------------
                    AUTO UPDATER
----------------------------------------------------*/

function sendStatusToWindow(text) {
  log.info(text);
  win.webContents.send('message', text);
}

ipcMain.on("app_version", (event) => {
  event.sender.send("app_version", { version: app.getVersion() });
});

autoUpdater.on("update-available", () => {
  console.log("Main, an update is available");
  mainWindow.webContents.send("update_available");
});

autoUpdater.on("update-downloaded", () => {
  console.log("Main, and update is being downloaded");
  mainWindow.webContents.send("update_downloaded");
});

ipcMain.on("restart_app", () => {
  autoUpdater.quitAndInstall();
});
