const { contextBridge, ipcRenderer } = require("electron");

// Expose ipcRenderer.send to the renderer process
contextBridge.exposeInMainWorld("electronAPI", {
  send: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  receive: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
});
