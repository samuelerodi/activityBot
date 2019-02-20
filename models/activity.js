const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('../config');
const tools = require('../tools');
const Extra = require('telegraf/extra')

var status = ['pending', 'progress', 'done', 'completed'];

var ActivitySchema = new Schema({
  title: { type: String,  required: true},
  status : {  type: String, enum: status, default: 'pending',  required: true},
  user: {type: Schema.Types.ObjectId, ref: 'User', index:true, required: false},
  description: {type: String, default:false},
  created: {type: Date, required: true, default: Date.now}
});

ActivitySchema.methods = {
  toHTML (){
    var s = "<b>Title:</b>\n"
    s = s + this.title + "\n"
    s = s + "<b>Description:</b>\n"
    s = s + this.description + "\n"
    if (this.isPending()) s = s + "<b>📝 Current activity is waiting to be assigned</b>\n"
    if (this.isInProgress()) s = s + "<b>⏱ Current activity is in progress</b>\n"
    if (this.isDone()) s = s + "<b>✅ The activity has been marked as done</b>\n"
    if (this.isCompleted()) s = s + "<b>🎊 Congrats! The activity is complete!</b>\n"
    if (this.isAssigned() && this.user.username) s = s + "\n<i>Assigned to " + this.user.username + "</i>\n"
    return s;
  },
  setProgress(){
    this.status = 'progress'
  },
  setDone(){
    this.status = 'done'
  },
  setCompleted(){
    this.status = 'completed'
  },
  isAssigned(){
    return status.indexOf(this.status) >= status.indexOf('progress')
  },
  isPending (){
    return this.status == 'pending'
  },
  isInProgress (){
    return this.status == 'progress'
  },
  isDone (){
    return this.status == 'done'
  },
  isCompleted (){
    return this.status == 'completed'
  },
  optionsToKeyboard(user){
    if(this.isCompleted()) return;
    var owned = this.user ? this.user._id.equals(user._id) : false;
    if(this.isAssigned() && !user.isAdmin() && !owned) return;
    var out = Extra.HTML().markup((m) =>{
      var k = [];
      if (this.isPending()) k.push(m.callbackButton('📝 Start the activity','activity.setProgress.' + this._id));
      if (this.isInProgress()) k.push(m.callbackButton('✅ Marked this activity as done','activity.setDone.' + this._id));
      if (this.isDone() && user.isAdmin()) {
        k.push(m.callbackButton('❗️ Reject and set in progress','activity.setReopen.' + this._id));
        k.push(m.callbackButton('🎉Complete','activity.setCompleted.' + this._id));
      }
      return m.inlineKeyboard(k, {columns:1})
    });
    return out;
  },
}

ActivitySchema.statics.isValidStatus = function(s) {
    return status.indexOf(s)!=-1 ;
};

ActivitySchema.statics.isValidTitle = async function(s) {
  if (!s) return false;
  var p = await Activity.findOne({title:s}).exec()
  return !p
};

ActivitySchema.statics.isValidDescription = function(s) {
    return !!s;
};


const Activity = mongoose.model('Activity', ActivitySchema);
module.exports = Activity;
