function updateAttempts() {
  config.login.attempts++;
  if(config.login.attempts >= 5) {
    startCooldown();
  }
  save();
}


if(config.login.cooldown > 0) startCooldown();
function startCooldown() {
  console.log('started cooldown');
  config.login.cooldown = 5 * 60 * config.login.cooldowns;
  error.classList.add('error');
  error.textContent = 'Login disabled. Please wait ' + ((config.login.cooldown - (config.login.cooldown % 60)) / 60) + ' minute(s) and 0 second(s)';
  
  // save
  save();

  let cooldown = setInterval(()=> {
    config.login.cooldown--;
    // calculate minutes and seconds remainaing
    error.textContent = 'Login disabled. Please wait ' + ((config.login.cooldown - (config.login.cooldown % 60)) / 60) + ' minute(s) and ' + (config.login.cooldown % 60) + ' second(s).';
    if(config.login.cooldown >= 0) {
      // clear interval, double cooldowns reset attempts, and remove error message
      clearInterval(cooldown);
      config.login.cooldowns *= 2;
      config.login.attempts = 0;
      error.classList.remove('error');
      error.textContent = '';
      save();
    }
  }, 1000);
}

function save() {

  // encrypt config
  configEncrypted = encrypt(JSON.stringify(config));
  
  // save encrypted config
  package(JSON.stringify(configEncrypted), configFullPath);
}

function encrypt(text) {
	// encrypt string
	let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
	let encrypted = cipher.update(text);
	encrypted = Buffer.concat([ encrypted, cipher.final() ]);
	return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

function package(object, pathOfObject) {
	fs.writeFileSync(pathOfObject, object, function(err) {
		if (err) throw err;
		console.log('Saved ' + object + '!');
	});
}