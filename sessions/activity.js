const Activity = require('../models/activity');
const actions = require('../actions');
const helpers = require('../helpers');
const tools = require('../tools')

module.exports = {
  create : {
    q: [{
          text: "<b>Create a new Activity!</b>\n Write short title:",
          isValid: Activity.isValidTitle,
          invalidText: "❌ Invalid title or tile already existing! Choose different title or cancel to interrupt.",
          field: "title",
      },{
          text: "Write extended activity description:",
          isValid: Activity.isValidDescription,
          invalidText: "❌ Invalid activity description! Retype or digit cancel to interrupt.",
          field: "description",
      }],
    done: actions.activity.create,
  },
  delete : {
    q: [{
          text: "Select activity status or 'cancel' to interrupt:",
          middleware: helpers.activity.inlineFilter,
          invalidText: "Invalid filter! Retype or digit cancel to interrupt.",
          field: "status"
      },{
          text: "Select activity or type 'cancel' to interrupt:",
          middleware: helpers.activity.inlineList,
          invalidText: "Invalid activity id! Retype or digit cancel to interrupt.",
          field: "_id",
      }],
    done: actions.activity.delete,
  },
  show : {
    q: [{
          text: "Select activity status or 'cancel' to interrupt:",
          middleware: helpers.activity.inlineFilter,
          invalidText: "Invalid filter! Retype or digit cancel to interrupt.",
          field: "status"
      },{
          text: "Select activity:",
          middleware: helpers.activity.inlineList,
          invalidText: "Invalid activity! Retype or digit cancel to interrupt.",
          field: "_id"
      }],
    done: actions.activity.show,
  },
  setProgress : {
    q: [],
    shortcut: true,
    done: actions.activity.setProgress,
  },
  setDone : {
    q: [],
    shortcut: true,
    done: actions.activity.setDone,
  },
  setCompleted : {
    q: [],
    shortcut: true,
    done: actions.activity.setCompleted,
  },
  setReopen : {
    q: [],
    shortcut: true,
    done: actions.activity.setReopen,
  }
}
