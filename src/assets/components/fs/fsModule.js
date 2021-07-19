// This module handles all saving/loading
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

function getUserHome() {
  return process.env[process.platform == 'win32' ? 'USERPROFILE' : 'HOME'];
}
let appDir = 'PassVault';
// require('electron-is-dev') isntead of true
if (true) appDir += 'Dev';
if (process.platform == 'win32') appDir = `AppData/Local/${appDir}`;
const PASSVAULT_DIR = path.join(getUserHome(), appDir)
const PARENT_DIR = path.join(getUserHome(), `${appDir}/Data`);

module.exports = {
  path: PARENT_DIR,

  // save with encrypting
  save: (name, object, key) => {
    // check if two directories exist
    if (!fs.existsSync(PASSVAULT_DIR)) fs.mkdirSync(PASSVAULT_DIR);
    if (!fs.existsSync(PARENT_DIR)) fs.mkdirSync(PARENT_DIR); // data dir
    // append absolute path to object name
    let encrypted = encrypt(JSON.stringify(object), key);
    module.exports.packSync(name, encrypted);
    return;
  },
  load: (name, key) => {

    let encoded = module.exports.unpackSync(name);
    return JSON.parse(decrypt(encoded, key));
  },

  // save without encryption (used for param.json) using name ("data", "config", or "param", and the actual object)
  packSync: (name, object) => {
    let objectPath = path.join(PARENT_DIR, `/${name}.json`);
    fs.writeFileSync(objectPath, JSON.stringify(object));
  },
  unpackSync: (name) => {
    let object;
    try {
      let objectPath = path.join(PARENT_DIR, `/${name}.json`);
      object = JSON.parse(fs.readFileSync(objectPath));
    } catch (err) {
      console.error(err);
      console.log(`File "${name}" does not exist. Returning undefined`);
    }
    return object
  }
}

function encrypt(text, key) {
  // encrypt string using key, then return encrypted object
  let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key.keyO), Buffer.from(key.ivO));
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: Buffer.from(key.ivO).toString('hex'), encryptedData: encrypted.toString('hex') };
}

function decrypt(text, key) {
  // decrypt string using key, then return decrypted string
  let encryptedText = Buffer.from(text.encryptedData, 'hex');
  let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key.keyO), Buffer.from(text.iv, 'hex'));
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}