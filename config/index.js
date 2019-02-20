const _ = require('lodash');

const general = {
  mongodb : {
      uri: process.env.MONGO_DB_URI,
  },
  telegram : {
    botToken: process.env.BOT_TOKEN,
  },
  welcomeMessage: "<b>Welcome to the Activity Bot!</b>"
}

var envConfig;
if (process.env.NODE_ENV) envConfig = require('./' + process.env.NODE_ENV) || {};
else envConfig = require('./development');
const config = _.merge(general, envConfig || {});

if (!config.telegram.botToken) {
  console.error("Bot token not specified!\nUse either BOT_TOKEN environment variable or configuration file parameter telegram.botToken")
  return process.exit(-1);
}
module.exports = config;
