var utils = require('./utils.js');
var Global = require('./global.js');

function User(socket) {
  // User class. Constructor sets all variables and associates the object with the socket.
  this.socket = socket;
  this.uuid = utils.uuid();

  Global.users[this.uuid] = this;
};

User.prototype.set_name = function (name) {
  console.log("Setting user with UUID" + this.uuid + " to " + name);
  this.name = name;
};

exports.User = User;
