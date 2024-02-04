const { app, BrowserWindow, ipcMain } = require("electron");
require("electron-reloader")(module);
const dbConnection = require("./db");
const path = require("path");
const { error } = require("console");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "index.html"));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// send user data
ipcMain.on("get-items", async (event) => {
  const db = await dbConnection();
  try {
    const result = await db.query("SELECT * FROM users");
    event.sender.send("get-items-success", result);
  } catch (error) {
    event.sender.send("get-items-error", error.message);
  }
});

// set user data

ipcMain.on("set-item", async (event, formData) => {
  const {
    firstName,
    lastName,
    phone,
    email,
    password,
    address,
    country,
    postalZipCode,
    companyName,
    publishStatus,
    bankDetail,
  } = formData;
  const db = await dbConnection();

  console.log(formData);
  try {
    const result = await db.query(
      "INSERT INTO users (firstName,lastName,phone,email,passwordHash,address,country,postalZipCode,companyName,publishStatus,bankDetails) VALUES(?,?,?,?,?,?,?,?,?,?,?)",
      [
        firstName,
        lastName,
        phone,
        email,
        password,
        address,
        country,
        postalZipCode,
        companyName,
        publishStatus,
        bankDetail,
      ]
    );
    console.log("result", result);
    event.sender.send("set-tiem-success", result);
  } catch (error) {
    console.log("error", error.message);
    event.sender.send("set-item-error", error.message);
  }
});

// delete user

ipcMain.on("delete-item", async (event, id) => {
  console.log("this is call");
  const db = await dbConnection();

  try {
    const result = await db.query("DELETE FROM users WHERE id = ?", [id]);
    event.sender.send("delete-item-success", result);
  } catch (error) {
    console.log(error.message);
    event.sender.send("delete-item-error", error.message);
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
