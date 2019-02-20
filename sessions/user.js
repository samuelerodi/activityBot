const User = require('../models/user');
const actions = require('../actions');
const helpers = require('../helpers');
const tools = require('../tools')

module.exports = {
  me : {
    q: [],
    done: actions.user.me,
  },
  setRole : {
    q: [{
            text: "Choose user:",
            middleware: helpers.user.inlineList,
            invalidText: "Invalid user! Retype or digit cancel to interrupt.",
            field: "_id"
    },{
            text: "Choose role:",
            isValid: User.isValidRole,
            middleware: helpers.user.inlineRole,
            invalidText: "Invalid user role! Retype or digit cancel to interrupt.",
            field: "role"
      }],
    done: actions.user.setRole,
  },
  delete : {
    q: [{
          text: "Select user or type 'cancel' to interrupt:",
          middleware: helpers.user.inlineList,
          invalidText: "Invalid user id! Retype or digit cancel to interrupt.",
          field: "_id",
      }],
    done: actions.user.delete,
  },
  ban : {
    q: [{
          text: "Select user or type 'cancel' to interrupt:",
          middleware: helpers.user.inlineListBan,
          invalidText: "Invalid user id! Retype or digit cancel to interrupt.",
          field: "_id",
      },{
          text: "What do you want to do?",
          middleware: helpers.user.inlineBan,
          invalidText: "Invalid value! Retype or digit cancel to interrupt.",
          field: "ban",
      }],
    done: actions.user.ban,
  },
  show : {
    q: [{
          text: "Select user role or 'cancel' to interrupt:",
          middleware: helpers.user.inlineFilter,
          invalidText: "Invalid filter! Retype or digit cancel to interrupt.",
          field: "role"
      },{
          text: "Select user:",
          middleware: helpers.user.inlineList,
          invalidText: "Invalid user! Retype or digit cancel to interrupt.",
          field: "_id"
      }],
    done: actions.user.show,
  }
}
