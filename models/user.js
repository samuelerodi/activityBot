const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('../config');
const tools = require('../tools');

var roles = ['user', 'admin', 'superuser'];

var UserSchema = new Schema({
  tid: { type: String,  required: true, unique:true},
  username: { type: String,  required: true},
  role: {  type: String, enum: roles, default: 'user',  required: true},
  banned:{type: Boolean, default:false},
  created: {type: Date, required: true, default: Date.now}
});

UserSchema.methods = {
  toHTML (){
    var s = "<b>Username:</b>\n"
    s = s + this.username + "\n"
    s = s + "<b>Role:</b>\n"
    s = s + this.role + "\n"
    s = s + (this.banned ? "<b>⛔️ THIS USER HAS BEEN BANNED!</b>\n": "")
    return s;
  },
  isAdmin (){
    return roles.indexOf(this.role) >= roles.indexOf('admin')
  },
  isSuperUser (){
    return this.role == 'superuser'
  }
}

UserSchema.statics.isValidRole = function(role) {
    return roles.indexOf(role)!=-1 ;
};

module.exports = mongoose.model('User', UserSchema);
