const fs = require('fs');
const path = require('path');
const PARENT_DIR = require('./fsModule.js').path;
module.exports = {
  getInternalIcons: async () => {
    await readdir(path.join(__dirname, '../../../assets/img/icons')).then(e => {
      return e;
    });
  },

  getExternalIcons: async () => {
    const DIR = path.join(PARENT_DIR, '/icon');
    // check if folder exists, then list all files
    fs.promises.access(DIR).then(e => {
      console.log('External icons folder exists.');
      fs.promises.readdir(DIR).then(e => {
        return e;
      });


      // create folder if it does not exist
    }).catch(() => {
      console.log('External icons folder does not exist. Creating one');
      fs.promises.mkdir(DIR).then(() => { return; })
        .catch(err => {
          console.log('Encountered error when creating folder');
          console.error(err);
          return;
        });
    })
  }
}

async function readdir(dir) {
  try {
    fs.promises.readdir(dir).then(e => {
      return e;
    });
  } catch (err) {
    console.log(`Error while reading directory "${dir}".`);
  }
}

let icons = module.exports.getInternalIcons();
console.log(icons);