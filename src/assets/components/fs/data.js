const fsModule = require('./fsModule.js');
const param = require('./param.js');

module.exports = {
  getData: () => {
    const DEFAULT_DATA = { cellIndex = 0 }
    let key = param.getKey();
    const LOADED_DATA = fsModule.load('data', key);

    // return default data if loaded data is undefined (data.json doesn't exist)
    return LOADED_DATA ? LOADED_DATA : DEFAULT_DATA;
  },

  setData: (newData) => {
    // generate a new key
    let key = param.generateKey();

    // save config and data with new key
    fsModule.save('config', key);
    fsModule.save('data', key);
  }
}