const { BrowserWindow } = require("electron");
const url = require("url");
const path = require("path");
function W_addUser(width, height) {
  const addModalWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule:true
    },
    width,
    height,
    title: "MAIN",
   
  });
  
  addModalWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "/../../views/addUser.html"),
      slashes: true,
      protocol: "file:",
    })
  );
  return  addModalWindow
}
module.exports = {
  W_addUser,
};
