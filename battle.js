var utils = require('./utils.js');
var Global = require('./global.js');
var pokemon = require('./pokemon.js');

function Battle(p1) {
  this.p1 = p1.uuid;
  this.p2 = null;

  this.teams = {p1: [], p2: []};
  this.active = {p1: null, p2: null};

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

    // sending message to both users to say it's all okay!
    Global.users[this.p1].socket.sendUTF(JSON.stringify({info: 'game_start', id: this.id}));
    Global.users[this.p2].socket.sendUTF(JSON.stringify({info: 'game_start', id: this.id}));

    // generate teams here
    for (var i = 0; i < 3; i++) {
      random_stock = Object.keys(Global.stocks)[Math.floor(Math.random() * Object.keys(Global.stocks).length)]
      random_stock_data = Global.stocks[random_stock];
      this.teams.p1.push(new pokemon.Pokemon(random_stock, random_stock_data[0], random_stock_data[1]));
    }

    for (var i = 0; i < 3; i++) {
      random_stock = Object.keys(Global.stocks)[Math.floor(Math.random() * Object.keys(Global.stocks).length)]
      random_stock_data = Global.stocks[random_stock];
      this.teams.p2.push(new pokemon.Pokemon(random_stock, random_stock_data[0], random_stock_data[1]));
    }

    // here, send each user their teams
    Global.users[this.p1].socket.sendUTF(JSON.stringify({info: 'team_info', team: this.teams.p1}));
    Global.users[this.p2].socket.sendUTF(JSON.stringify({info: 'team_info', team: this.teams.p2}));

    this.active.p1 = this.teams.p1[0];
    this.active.p2 = this.teams.p2[0];

    // update view on these ones...
    Global.users[this.p1].socket.sendUTF(JSON.stringify({info: 'p1active', result: this.active.p1}));
    Global.users[this.p2].socket.sendUTF(JSON.stringify({info: 'p1active', result: this.active.p1}));
    Global.users[this.p1].socket.sendUTF(JSON.stringify({info: 'p2active', result: this.active.p2}));
    Global.users[this.p2].socket.sendUTF(JSON.stringify({info: 'p2active', result: this.active.p2}));

    console.log(this.teams);

  }
}

Battle.prototype.alive = function (idn) {
  result = [];
  for (var i = 0; i < this.teams[idn].length; i++) {
    if (this.teams[idn][i].hp > 0) {
      result.push(i);
    }
  }
  return result;
}

Battle.prototype.switch = function (idn) {
  switch(idn) {
    case 'p1':
      canswitch = this.alive('p1');
      console.log(canswitch);
      break;
    case 'p2':
      canswitch = this.alive('p2');
      console.log(canswitch);
      break;
  }
}

Battle.prototype.move = function (p1moveid, p2moveid) {
  p1move = this.active.p1.moves.p1moveid;
  p2move = this.active.p2.moves.p2moveid;

  if (this.active.p1.spe >= this.active.p2.spe) {
    this.active.p2.hp -= pokemon.moves(p1move).damage * (this.active.p1.atk / this.active.p2.def)
    if (this.active.p2.hp <= 0) {
      this.switch('p2');
      return;
    }
    this.active.p1.hp -= pokemon.moves(p2move).damage * (this.active.p2.atk / this.active.p1.def)
    if (this.active.p1.hp <= 0) {
      this.switch('p1');
      return;
    }
  } else {
    this.active.p1.hp -= pokemon.moves(p2move).damage * (this.active.p2.atk / this.active.p1.def)
    if (this.active.p1.hp <= 0) {
      this.switch('p1');
      return;
    }
    this.active.p2.hp -= pokemon.moves(p1move).damage * (this.active.p1.atk / this.active.p2.def)
    if (this.active.p2.hp <= 0) {
      this.switch('p2');
      return;
    }
  }
}


exports.Battle = Battle;
