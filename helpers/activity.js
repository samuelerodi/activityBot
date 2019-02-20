const Extra = require('telegraf/extra')
const Activity = require('../models/activity')



module.exports.inlineList = async function (ctx, next, q) {
  var c={}
  if (ctx.session.body.user && ctx.session.body.user !='-') c.user = ctx.session.body.user;
  if (ctx.session.body.status && ctx.session.body.status !='-') c.status = ctx.session.body.status;
  var items = await Activity.find(c).exec();
  if (!items || !items.length) return ctx.reply('No activities available');
  return ctx.reply(q.text, Extra.HTML().markup((m) =>{
    return m.inlineKeyboard(items.map(u=>m.callbackButton(u.title,u._id)), {columns:2})
  }))
}

module.exports.inlineFilter = async function (ctx, next, q) {
  return await ctx.reply(q.text, Extra.HTML().markup((m) =>{
    return m.inlineKeyboard([
      m.callbackButton('All', '-'),
      m.callbackButton('Unassigned', 'pending'),
      m.callbackButton('In progress', 'progress'),
      m.callbackButton('To be approved', 'done'),
      m.callbackButton('Completed', 'completed'),
    ], {columns:2})
  }))
}
