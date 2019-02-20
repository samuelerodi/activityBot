const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')

const keyboardConfig = {
  'admin-home': {
    name: 'Menu',
    children: ['users', 'activity']
  },
  'home': {
    name: 'Menu',
    children: [{
      name: 'Show user',
      command: 'user.show'
    }, {
      name: 'Show Activities',
      command: 'activity.show'
    }]
  },
  'users': {
    name: 'Users',
    children: [{
      name: 'Show user',
      command: 'user.show'
    },{
      name: 'Set user Role',
      command: 'user.setRole',
      onlySuperUser:true
    },{
      name: 'Delete user',
      command: 'user.delete',
      onlyAdmin:true
    },{
      name: 'Ban user',
      command: 'user.ban',
      onlyAdmin:true
    }]
  },
  'activity': {
    name:'Activities',
    children: [{
        name: 'Show Activities',
        command: 'activity.show'
      },{
        name: 'Create Activity',
        command: 'activity.create',
        onlyAdmin:true
      },{
        name: 'Delete Activity',
        command: 'activity.delete',
        onlyAdmin:true
      }]
  },
}
module.exports.config = keyboardConfig

module.exports.set = async (ctx, next) => {
  if (!ctx.update.message && !ctx.update.callback_query) return next();
  var c = ctx.update.callback_query ? ctx.update.callback_query.data : ctx.update.message.text.toLowerCase();
  if (c!='menu' && !keyboardConfig[c]) return next();
  ctx.session = {};
  var admin = ctx.user.isAdmin();
  if (c=='menu') c = admin ? 'admin-home' : 'home';
  var k = keyboardConfig[c];
  if (k.admin && !admin) return ctx.reply('Forbidden!')
  var m = await ctx.reply(k.name, Extra.HTML().markup((m) =>{
    var b = [];
    for (var e of k.children){
      if (typeof e == 'string') {
        b.push(Markup.callbackButton(keyboardConfig[e].name, e))
        continue;
      }
      if (e.onlyAdmin && !admin) continue;
      if (e.onlySuperUser && !ctx.user.isSuperUser()) continue;
      b.push(Markup.callbackButton(e.name, e.command));
    }
    return m.inlineKeyboard(b, {columns:2});
  }))
  ctx.session.messageToDelete = m;
  return m;
}

module.exports.base = (ctx, next) => {
  return ctx.reply('Use the keyboard to open the menu', Extra.markup(
    Markup.keyboard([ 'Menu', 'Cancel'], {columns:2})
  ))
}
