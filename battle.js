var utils = require('./utils.js');
var Global = require('./global.js');

function Battle(p1) {
  this.p1 = p1.uuid;
  this.p2 = null;

  this.open = true;

  this.id = Global.largestbattleid;
  Global.battles[this.id] = this;
  Global.largestbattleid++;

  console.log('Battle created!');

  // send msg to p1 with waiting screen
  Global.users[this.p1].socket.sendUTF(JSON.stringify({info: 'battle_create_success', id: this.id}));
};

Battle.prototype.join = function (p2) {
  if (this.open) {
    this.p2 = p2.uuid;
    this.open = false;

    // make sure to send a message to both players saying that it's ready!
  }
}

exports.Battle = Battle;
