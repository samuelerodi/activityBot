const rp = require('request-promise')

module.exports.getText = function (u){
  if (u.message && u.message.text) return u.message.text;
  if (u.message && u.message.photo) return u.message.caption;
  if (u.callback_query) return u.callback_query.data;
  return;
}

module.exports.isNumberNotZero = (n) =>{
  return n && module.exports.isNumber(n);
}
module.exports.isNumberNotZeroOrNull = (n) =>{
  return module.exports.isNumberNotZero(n) || n== '-';
}
module.exports.isNumber = (n) =>{
  return Number.isFinite(parseFloat(n.replace(',','.')));
}
module.exports.toNumber = (n) =>{
  return parseFloat(n.replace(',','.'));
}
module.exports.isBoolean = (n) =>{
  return (typeof n == 'boolean') || n=='false' || n=='true';
}

module.exports.toBoolean = (s) => {
  return s ? (!(s=='false')) : false;
}

module.exports.contains = function (string) {
  return new RegExp('.*' + string + '.*', 'i');
}

module.exports.listToString = function (list, fields) {
  var out = '';
  for (var e of list) {
    for (var f of fields){
      out = out + e[f] + '\t'
    }
    out = out + '\n'
  }
  return out;
}

module.exports.searchCondition = function (stringToSearch, columnsArray, base) {
  var conditions = {};
  if (base!==undefined && typeof base === 'object') {
    conditions=base;
  }
  if (!conditions.hasOwnProperty('$and')) {
    conditions['$and'] = [];
  }
  if (stringToSearch==''){
    return conditions;
  }
  stringToSearch.split(' ')
    .forEach(function (token) {
      if (token.length != 0) {
        var condition = {};
        condition['$or'] = [];
        for (var ii in columnsArray) {
          var column = columnsArray[ii];
          var obj = {};
          obj[column] = module.exports.contains(token);
          condition['$or'].push(obj);
        }
        conditions['$and'].push(condition);
      }
    });
  return conditions;
}
