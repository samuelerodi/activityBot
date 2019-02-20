const Extra = require('telegraf/extra')
const User = require('../models/user')
const tools = require('../tools')
const config = require('../config')


/**
 * Creates a new user
 */
module.exports.create = async function (ctx, next) {
  console.log("Creating user! : " + JSON.stringify(ctx.body) )
  var user = await User.findOne({tid:ctx.body.tid}).exec();
  if (user) console.log("Found user "+ user.tid + " with role " + user.role + ". Updating...")
  if (!user) user = new User({tid: ctx.body.tid, username: ctx.body.username});
  user.username = ctx.body.username;
  user.role = ctx.body.role || user.role;
  user = await user.save();
  return ctx.reply('✅ New user: ' + user.username + ' as ' + user.role)
}

/**
 * Deletes a user
 */
module.exports.delete = async function (ctx, next) {
  if (!ctx.user.isSuperUser()) return  ctx.replyWithHTML('⛔️ Forbidden!');
  var r = await User.findByIdAndRemove(ctx.body._id).exec();
  return ctx.reply(r ? '✅ Successfully deleted!' : '⛔️ User not found...');
}

/**
 * Ban a user
 */
module.exports.ban = async function (ctx, next) {
  if (!ctx.user.isAdmin()) return  ctx.replyWithHTML('⛔️ Forbidden!');
  var r = await User.findById(ctx.body._id).exec();
  if(!r) return ctx.reply("⛔️ User not found")
  r.banned = tools.toBoolean(ctx.body.ban);
  r = await r.save();
  return ctx.reply(r.banned ? '✅ User banned!' : '✅ Ban removed');
}


/**
 * Show a user
 */
module.exports.show = async function (ctx, next) {
  var r = await User.findById(ctx.body._id).exec();
  return ctx.replyWithHTML(r.toHTML());
}


/**
 * Get me
 */
module.exports.me = async function (ctx, next) {
  var r = ctx.user
  return ctx.replyWithHTML(r.toHTML());
}

/**
 * Authenticate user
 */
module.exports.auth = async function (ctx, next) {
  var tid = ctx.from.id;
  var user = await User.findOne({tid}).exec();
  if (!user || user.banned) return;
  ctx.user = user;
  console.log("Interacting with " + user.role +": " +  user.username + "  userId:"  + user.tid)
  return next()
}

/**
 * Change user role
 */
module.exports.setRole = async function (ctx, next) {
  if (!ctx.user.isSuperUser()) return  ctx.replyWithHTML('⛔️ Forbidden!');
  var user = await User.findById(ctx.body._id).exec();
  if (!user) return ctx.reply('⛔️ Inexisting user: ' + ctx.body.username)
  user.role = ctx.body.role;
  user = await user.save();
  await ctx.telegram.sendMessage(user.tid, user.isAdmin() ? ('🎊👍 Wonderful! Your were upgraded to ' + user.role) : ('🥶👎 Sorry! Your were downgraded to ' + user.role) )
  return ctx.reply('✅ User ' + user.username + ' has become an ' + user.role)
}

/**
 * Alert Superuser
 */
module.exports.alertSuperUser = async function (ctx, message) {
  var users = await User.find({role:'superuser'}).exec();
  for (var u of users) {
    await ctx.telegram.sendMessage(u.tid, message, {parse_mode:'HTML'})
  }
}
