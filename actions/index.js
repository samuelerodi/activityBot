const helpers = require('../helpers')
const config = require('../config')
const user = require('./user')
const activity = require('./activity')
const keyboard = require('../keyboard')

module.exports.user = user
module.exports.activity = activity

module.exports.start = async (ctx, next)=>{
  var tid = ctx.chat.id;
  var username = ctx.chat.username || ctx.chat.first_name;
  ctx.body = {
    tid : tid,
    username : username
  };
  await ctx.replyWithHTML(config.welcomeMessage)
  if (!(await helpers.user.countRole('superuser'))) ctx.body.role = 'superuser'
  await user.create(ctx, ()=>{})
  await user.alertSuperUser(ctx, "✅ A new user has succesfully joined ActivityBot: <a href=\"tg://user?id=" + tid +"\">@"+ username +" </a>");
  return keyboard.base(ctx)
}
