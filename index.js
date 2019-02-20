const config = require('./config')
const database = require('./database')

const Telegraf = require('telegraf')
const Router = require('telegraf/router')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const session = require('telegraf/session')


const sessions = require('./sessions')
const actions = require('./actions')
const tools = require('./tools')
const groups = require('./groups')
const keyboard = require('./keyboard')

const TIME_TO_LIVE = 90;



const bot = new Telegraf(config.telegram.botToken)
bot.use(session({ ttl: TIME_TO_LIVE }))
bot.start(actions.start)
bot.use(actions.user.auth)
bot.use(groups.actions)
bot.use(async (ctx,next)=>{
  if (ctx.session.messageToDelete) {
    var mId = ctx.session.messageToDelete.message_id
    await ctx.deleteMessage(mId).catch(console.error)
    ctx.session.messageToDelete = {}
  }
  return next()
})
bot.on('callback_query', keyboard.set)
bot.on('callback_query', sessions.initSession)
bot.on('callback_query', sessions.middleware)
bot.on('text', keyboard.set)
bot.on('text', sessions.middleware)



bot.catch(console.error)

console.log('Starting bot...')
bot.launch()
