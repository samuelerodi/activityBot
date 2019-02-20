const Extra = require('telegraf/extra')
const User = require('../models/user')

module.exports.inlineList = async function (ctx, next, q) {
  var c = {}
  var b = ctx.session.body;
  if (b && b.role && b.role!='-') c.role = b.role;
  var users = await User.find(c).exec();
  if (!users || !users.length) return ctx.reply('No users available');
  return ctx.reply(q.text, Extra.HTML().markup((m) =>{
    return m.inlineKeyboard(users.map(u=>m.callbackButton(u.username,u._id)), {columns:2})
  }))
}
module.exports.inlineListBan = async function (ctx, next, q) {
  var c = {}
  c.tid = {$ne:ctx.user.tid};
  c.role = {$ne:'superuser'};
  var users = await User.find(c).exec();
  if (!users || !users.length) return ctx.reply('No users available');
  return ctx.reply(q.text, Extra.HTML().markup((m) =>{
    return m.inlineKeyboard(users.map(u=>m.callbackButton(u.username,u._id)), {columns:2})
  }))
}
module.exports.inlineListAndAll = async function (ctx, next, q) {
  var c = {}
  var b = ctx.session.body;
  if (b && b.role && b.role!='-') c.role = b.role;
  var users = await User.find(c).exec();
  if (!users || !users.length) return ctx.reply('No users available');
  return ctx.reply(q.text, Extra.HTML().markup((m) =>{
    var l = users.map(u=>m.callbackButton(u.username,u._id));
    l.unshift(m.callbackButton('All','-'))
    return m.inlineKeyboard(l, {columns:2})
  }))
}


module.exports.inlineFilter = async function (ctx, next, q) {
  return await ctx.reply(q.text, Extra.HTML().markup((m) =>{
    return m.inlineKeyboard([
      m.callbackButton('All', '-'),
      m.callbackButton('User', 'user'),
      m.callbackButton('Admin', 'admin'),
      m.callbackButton('Superuser', 'superuser'),
    ], {columns:2})
  }))
}
module.exports.inlineBan = async function (ctx, next, q) {
  return await ctx.reply(q.text, Extra.HTML().markup((m) =>{
    return m.inlineKeyboard([
      m.callbackButton('Ban', 'true'),
      m.callbackButton('Remove ban', 'false'),
    ], {columns:2})
  }))
}
module.exports.inlineRole = async function (ctx, next, q) {
  return await ctx.reply(q.text, Extra.HTML().markup((m) =>{
    return m.inlineKeyboard([
      m.callbackButton('User', 'user'),
      m.callbackButton('Admin', 'admin'),
      m.callbackButton('Superuser', 'superuser'),
    ])
  }))
}


/**
 * Count user with role
 */
module.exports.countRole = async function (role) {
  return await User.countDocuments({role}).exec();
}
