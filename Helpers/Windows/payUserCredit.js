const { BrowserWindow } = require("electron");
const url = require("url");
const path = require("path");
function W_PayUserCredit(width, height) {
  const addModalWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    width,
    height,
    title: "MAIN",
  });
  addModalWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "/../../views/payment.html"),
      slashes: true,
      protocol: "file:",
    })
  );
}
module.exports = {
  W_PayUserCredit,
};
