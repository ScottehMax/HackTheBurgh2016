var utils = require('./utils.js');
var Global = require('./global.js');

function User(socket) {
  // User class. Constructor sets all variables and associates the object with the socket.
  this.socket = socket;
  this.name = null;
  this.uuid = utils.uuid();
  this.battles = {};

  Global.users[this.uuid] = this;
};

User.prototype.set_name = function (name) {
  console.log("Setting user with UUID" + this.uuid + " to " + name);
  this.name = name;
};

User.prototype.join = function(room_id) {
  if (!Global.battles[room_id]) return;
  if (Global.battles[room_id].p1 != this.uuid) {
    Global.battles[room_id].join(this);
  }
  console.log(Global.battles);

}

exports.User = User;
