const Extra = require('telegraf/extra')
const tools = require('../tools')


module.exports.inlineBoolean = async function (ctx, next, q) {
  return await ctx.reply(q.text, Extra.HTML().markup((m) =>{
    return m.inlineKeyboard([
      m.callbackButton('Yes',"true"),
      m.callbackButton('No',"false")
    ])
  }))
}
