const { app, BrowserWindow, ipcMain, screen } = require("electron");
const path = require("node:path");

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile("index.html");
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  ipcMain.on("displays", (event) => {
    const displays = screen.getAllDisplays();
    event.reply("displays", displays);
  });

  ipcMain.on("show", (event, fillDisplayID, keyDisplayID) => {
    const displays = screen.getAllDisplays();
    const fillDisplay = displays.find(
      (display) => display.id.toString() === fillDisplayID
    );
    const keyDisplay = displays.find(
      (display) => display.id.toString() === keyDisplayID
    );

    const fillScreen = new BrowserWindow({
      x: fillDisplay.bounds.x,
      y: fillDisplay.bounds.y,
      width: fillDisplay.bounds.width,
      height: fillDisplay.bounds.height,
      frame: false, // 테두리 없애기
      fullscreen: true, // 풀스크린 모드
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    fillScreen.loadFile("fill.html");
    fillScreen.setFullScreen(true); // 풀스크린 활성화

    const keyScreen = new BrowserWindow({
      x: keyDisplay.bounds.x,
      y: keyDisplay.bounds.y,
      width: keyDisplay.bounds.width,
      height: keyDisplay.bounds.height,
      frame: false, // 테두리 없애기
      fullscreen: true, // 풀스크린 모드
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    keyScreen.loadFile("key.html");
    keyScreen.setFullScreen(true); // 풀스크린 활성화
  });

  ipcMain.on("changeText", (event, text) => {
    const allWindows = BrowserWindow.getAllWindows();
    allWindows.forEach((window) => {
      window.webContents.send("changeText", text);
    });
  });

  ipcMain.on("changeTitle", (event, title) => {
    const allWindows = BrowserWindow.getAllWindows();
    allWindows.forEach((window) => {
      window.webContents.send("changeTitle", title);
    });
  });

  ipcMain.on("changeOutline", () => {
    const allWindows = BrowserWindow.getAllWindows();
    allWindows.forEach((window) => {
      window.webContents.send("changeOutline");
    });
  });

  ipcMain.on("changeOutlineShadow", () => {
    const allWindows = BrowserWindow.getAllWindows();
    allWindows.forEach((window) => {
      window.webContents.send("changeOutlineShadow");
    });
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
