const { ipcRenderer, contextBridge, webFrame } = require('electron');
const IS_DEV = require('./../isDev.js');


console.log("Preloading config.js");
contextBridge.exposeInMainWorld('api', {
  VERSION: require('./../../../../package.json').version,
  configHandler: require('../fs/config.js'),
  // electron: IS_DEV ? require('electron') : undefined,
  window: {
    close: webFrame.context.close,
    minimize: minimize,
    maximize: maximize
  },
  dev: IS_DEV,
  events: {
    login: login,
    logout: logout
  }
})

// because webFrame.context doesn't have minimize()
function minimize() { send('minimize') }
function maximize() { send('maximize') }
function login() { send('login') }
function logout() { send('logout') }

function send(msg) {
  ipcRenderer.send(msg);
}