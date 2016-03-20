var Global = require('./global.js');

exports.randintold = function (a, b) {
  return Math.floor(Math.random() * b) + a;
};

exports.randint = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.uuid = function () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

exports.datelog = function (s) {
  console.log((new Date()) + ' ' + s);
};

exports.sendConsole = function (s) {
  if (!Global.console) {
    return false;
  }
  Global.console.sendUTF(s);
  console.log("sending " + s + " to console");
};

exports.arraysEqual = function (a1, a2) {
  return JSON.stringify(a1) === JSON.stringify(a2);
};
