const sessions = require('./sessions')
const actions = require('./actions')
module.exports.actions = async (ctx, next) =>{
  var chat = ctx.chat;
  if (chat.type=="private") return next()
  console.log("This is a group message")
}
