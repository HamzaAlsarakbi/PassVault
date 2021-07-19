function updateAttempts() {
  let config = window.api.configHandler.getConfig();
  config.login.attempts++;
  if (config.login.attempts >= 5) {
    startCooldown(config);
  }
  window.api.configHandler.setConfig('login', config.login);
}


if (window.api.configHandler.getConfig().login.cooldown > 0) startCooldown(window.api.configHandler.getConfig());
function startCooldown(config) {
  console.log('started cooldown');
  config.login.cooldown = 5 * 60 * config.login.cooldowns;
  error.classList.add('error');
  error.textContent = 'Login disabled. Please wait ' + ((config.login.cooldown - (config.login.cooldown % 60)) / 60) + ' minute(s) and 0 second(s)';
  window.api.configHandler.setConfig('login', config.login);
  // save()



  let cooldown = setInterval(() => {
    config.login.cooldown--;
    // calculate minutes and seconds remainaing
    error.textContent = 'Login disabled. Please wait ' + ((config.login.cooldown - (config.login.cooldown % 60)) / 60) + ' minute(s) and ' + (config.login.cooldown % 60) + ' second(s).';
    if (config.login.cooldown <= 0) {
      // clear interval, double cooldowns reset attempts, and remove error message
      clearInterval(cooldown);
      config.login.cooldowns *= 2;
      config.login.attempts = 0;
      error.classList.remove('error');
      error.textContent = '';
      window.api.configHandler.setConfig('login', config.login);
    }
  }, 1000);
}