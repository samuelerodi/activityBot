const tools = require('../tools')
const sessions = {}
sessions.user = require('./user')
sessions.activity = require('./activity')

module.exports = sessions;


module.exports.initSession = (ctx, next) => {
  if (!ctx.update.callback_query && !ctx.update.callback_query.data) return next();
  var c = ctx.update.callback_query.data;
  const sObj = c.split('.')
  if (sObj.length<2) return next();
  const domain = sObj[0];
  const name = sObj[1];
  if (!sessions[domain] || !sessions[domain][name]) return next();
  return module.exports.createSession(c,ctx,next);
}


module.exports.createSession = async function (sessionName ,ctx, next) {
  if (!sessionName) throw new Error('Invalid session name: ' + sessionName);
  const sObj = sessionName.split('.')
  if (sObj.length<2) throw new Error('Invalid session name: ' + sessionName);
  const domain = sObj[0];
  const name = sObj[1];
  const paramId = sObj.length>2 ? sObj[2] : undefined;
  if (!sessions[domain] || !sessions[domain][name]) throw new Error('Inexisting session: ' + sessionName);
  const s = sessions[domain][name];
  if (sObj.length>3 && !s.shortcut) throw new Error('Invalid session params: ' + sessionName);
  if (s.shortcut) {
    var prms = sObj;
    prms.shift();
    prms.shift();
    ctx.body = prms;
    await s.done(ctx,next);
    ctx.session = {};
    return
  }
  // console.log(!!s.q + ' ' + !!s.done + ' ' + !!s.invalidReply + ' ' + !!s.stop)
  if (!s.q || !s.done) throw new Error('Session badly defined: ' + sessionName);
  var msg, media, mediaType;
  msg = tools.getText(ctx.update) || "";
  var stop = sessions[domain][name].stop || 'cancel'
  if (msg.toLowerCase() == stop.toLowerCase()) {
    ctx.session = {};
    return ctx.reply('Canceled');
  }
  ctx.session.name = sessionName;
  ctx.session.qid = ctx.session.qid || 0;
  ctx.session.body = ctx.session.body || {}
  ctx.session.body._id = ctx.session.body._id || paramId;
  for (i = 0; i <= s.q.length; i++) {
    if (i != ctx.session.qid) continue;
    var prevQ = i ? s.q[i-1] : {};
    var defaultInvalidReply = "❌ Invalid answer. Digit cancel to interrupt.";
    if (prevQ.isValid && !(await prevQ.isValid(msg, ctx))) return sessionError(prevQ.invalidText || s.invalidReply || defaultInvalidReply, ctx, next);
    if (prevQ.field && !(prevQ.field=='_id' && paramId)) ctx.session.body[prevQ.field] = msg
    if (prevQ.media) ctx.session.body[prevQ.media] = tools.getMedia(ctx.update);
    if (prevQ.mediaType) ctx.session.body[prevQ.mediaType] = tools.getMediaType(ctx.update);
    if (ctx.session.qid == s.q.length) break;
    ctx.session.qid++
    var q = s.q[i]
    if (paramId && q.field=='_id') continue;
    if (q.middleware) return await q.middleware(ctx, next, q)
    var m = await ctx.replyWithHTML(q.text)
    ctx.session.messageToDelete = m
    return m;
  }
  ctx.body = ctx.session.body
  await s.done(ctx,next);
  ctx.session = {};
  return
}


function sessionError(message, ctx, next) {
  return ctx.reply(message)
}

function getMessage(ctx){
  if (ctx.update.callback_query) return ctx.update.callback_query.data;
  if (ctx.update.message) return ctx.update.message.caption || ctx.update.message.text;
}

module.exports.isSession = (ctx, s)=>{
  var m = getMessage(ctx);
  const sObj = m.split('.')
  if (sObj.length<2) return false;
  const domain = sObj[0];
  const name = sObj[1];
  if (!sessions[domain] || !sessions[domain][name]) return false;
  if (!s) return true;
  var compareTo = domain + '.' + name
  return compareTo == s;
}

module.exports.middleware = (ctx,next)=>{
  if (ctx.session.name) return module.exports.createSession(ctx.session.name, ctx, next);
  if (getMessage(ctx).toLowerCase() == 'cancel') return;
  return ctx.reply("Sorry... Don't know what to do..");
}
