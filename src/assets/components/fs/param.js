const fsModule = require('./fsModule.js');

// This module generates a new encryption key or retreives saved key on demand
module.exports = {
  generateKey: () => {
    return { keyO: crypto.randomBytes(32), ivO: crypto.randomBytes(32) };
  },
  getKey: () => {
    let unpacked = fsModule.unpackSync('param');

    // return generated key if unpacked key is undefined;
    return unpacked ? unpacked : module.exports.generateKey();
  }
}