module.exports = {
  mongodb : {
      uri: process.env.MONGO_DB_URI || 'mongodb://127.0.0.1/activitybot',
  },
  telegram : {
    botToken: process.env.BOT_TOKEN,
  },
}
