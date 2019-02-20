const Extra = require('telegraf/extra')
const Activity = require('../models/activity')
const tools = require('../tools')
const config = require('../config')


/**
 * Creates a new activity
 */
module.exports.create = async function (ctx, next) {
  if (!ctx.user.isAdmin()) return  ctx.replyWithHTML('⛔️ Forbidden!');
  console.log("Creating Activity! : " + JSON.stringify(ctx.body) )
  var item = await Activity.findOne({title:ctx.body.title}).exec();
  if (item) return ctx.reply('Activity with same title already present! Check twice')
  item = new Activity(ctx.body);
  item = await item.save();
  return ctx.reply('Added activity: ' + item.title) ;
}

/**
 * Deletes a activity
 */
module.exports.delete = async function (ctx, next) {
  if (!ctx.user.isAdmin()) return  ctx.replyWithHTML('⛔️ Forbidden!');
  await Activity.findByIdAndRemove(ctx.body._id).exec();
  return ctx.reply('Successfully deleted!');
}


/**
 * Show activity
 */
module.exports.show = async function (ctx, next) {
  var c = await Activity.findById(ctx.body._id)
                        .populate('user')
                        .exec();
  if (!c) return ctx.reply('No activity like that...')
  return ctx.replyWithHTML(c.toHTML(), c.optionsToKeyboard(ctx.user));
}


// /**
//  * Update a activity
//  */
module.exports.setReopen = async function (ctx, next) {
  if (!ctx.user.isAdmin()) return  ctx.replyWithHTML('⛔️ Forbidden!');
  var aId = ctx.body[0];
  var c = await Activity.findById(aId)
    .populate('user')
    .exec();
  if (!c.isDone()) return  ctx.replyWithHTML('⛔️ Invalid activity state!');
  c.setProgress();
  await c.save();
  await ctx.telegram.sendMessage(c.user.tid, "😭 Your task has been reopened");
  return ctx.replyWithHTML('The task has been reopened!');
}


module.exports.setProgress = async function (ctx, next) {
  var aId = ctx.body[0];
  var c = await Activity.findById(aId)
    .populate('user')
    .exec();
  if (!c.isPending()) return  ctx.replyWithHTML('⛔️ Invalid activity state!');
  c.user = ctx.user;
  c.setProgress();
  await c.save();
  return ctx.replyWithHTML('🔥 Congrats! You have won an activity! Now start working!');
}

module.exports.setDone = async function (ctx, next) {
  if (!ctx.user._id) return  ctx.replyWithHTML('⛔️ Forbidden!');
  var aId = ctx.body[0];
  var c = await Activity.findById(aId)
    .populate('user')
    .exec();
  if (!c.isInProgress()) return  ctx.replyWithHTML('⛔️ Invalid activity state!');
  if (!ctx.user._id.equals(c.user._id)) return  ctx.replyWithHTML('⛔️ Not your duty.. sorry!');
  c.setDone();
  await c.save();
  return ctx.replyWithHTML('✅ The task has been marked as <i>done!</i>');
}

module.exports.setCompleted = async function (ctx, next) {
  if (!ctx.user.isAdmin()) return  ctx.replyWithHTML('⛔️ Forbidden!');
  var aId = ctx.body[0];
  var c = await Activity.findById(aId)
    .populate('user')
    .exec();
  if (!c.isDone()) return  ctx.replyWithHTML('⛔️ Invalid activity state!');
  c.setCompleted();
  await c.save();
  await ctx.telegram.sendMessage(c.user.tid, "🎉 Congrats! Your task " + c.title + "  has been approved and set completed!");
  return ctx.replyWithHTML('👍 The task has been marked as <i>completed!</i>');
}
