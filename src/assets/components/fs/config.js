const fsModule = require('./fsModule.js');
const param = require('./param.js');

module.exports = {
  getConfig: () => {
    // console.trace();
    const DEFAULT_CONFIG = {
      theme: 'dark',
      gridlinesOn: false,
      firstTime: true,
    };

    const NEW_COMPONENTS = {
      devTools: false,
      enableAnimations: true,
      login: {
        cooldown: 0,
        cooldowns: 1,
        attempts: 0
      },
      timeout: 2
    }
    const LOADED_CONFIG = fsModule.load('config', param.getKey());

    // use default config if loaded config is undefined (does not exist)
    let config = LOADED_CONFIG ? LOADED_CONFIG : DEFAULT_CONFIG;
    for (let component in NEW_COMPONENTS) {
      if (!config[component]) {
        console.log(`%cAppending missing component "${component}".`, 'color: cyan');
        config[component] = NEW_COMPONENTS[component];
      }
    }
    return config;
  },
  setConfig: (property, value) => {
    let config = module.exports.getConfig();
    config[property] = value;
    fsModule.save('config', config, param.getKey());
  }
}