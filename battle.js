var utils = require('./utils.js');
var Global = require('./global.js');
var pokemon = require('./pokemon.js');

function Battle(p1) {
  this.p1 = p1.uuid;
  this.p2 = null;

  this.teams = {p1: [], p2: []};
  this.active = {p1: null, p2: null};
  this.buffered_moves = {p1: null, p2: null};

  this.open = true;
  this.fainted = null;

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
    Global.users[this.p1].socket.sendUTF(JSON.stringify({info: 'p1active', result: this.active.p1, p1hp: this.active.p1.hp, p1maxhp: this.active.p1.maxhp}));
    Global.users[this.p2].socket.sendUTF(JSON.stringify({info: 'p1active', result: this.active.p1, p1hp: this.active.p1.hp, p1maxhp: this.active.p1.maxhp}));
    Global.users[this.p1].socket.sendUTF(JSON.stringify({info: 'p2active', result: this.active.p2, p2hp: this.active.p2.hp, p1maxhp: this.active.p2.maxhp}));
    Global.users[this.p2].socket.sendUTF(JSON.stringify({info: 'p2active', result: this.active.p2, p2hp: this.active.p2.hp, p1maxhp: this.active.p2.maxhp}));

    console.log(this.teams);

  }
}

Battle.prototype.alive = function (player_id) {
  result = [];
  console.log('teamalive')
  console.log(this.teams[player_id])
  for (var i = 0; i < this.teams[player_id].length; i++) {
    if (this.teams[player_id][i].hp > 0) {
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
      Global.users[this.p1].socket.sendUTF(JSON.stringify({info: 'forceswitch',
                                                           toswitch: canswitch}));
      if (canswitch.length == 0) {
        this.gameover = true;
        var winner = 'p2';
        Global.users[this.p1].socket.sendUTF(JSON.stringify({info: 'gameover',
                                                             winner: winner}));
        Global.users[this.p2].socket.sendUTF(JSON.stringify({info: 'gameover',
                                                             winner: winner}));
      }
      break;
    case 'p2':
      canswitch = this.alive('p2');
      console.log(canswitch);
      Global.users[this.p2].socket.sendUTF(JSON.stringify({info: 'forceswitch',
                                                           toswitch: canswitch}));
      if (canswitch.length == 0) {
        this.gameover = true;
        var winner = 'p1';
        Global.users[this.p1].socket.sendUTF(JSON.stringify({info: 'gameover',
                                                             winner: winner}));
        Global.users[this.p2].socket.sendUTF(JSON.stringify({info: 'gameover',
                                                             winner: winner}));
      }
      break;
  }
}

Battle.prototype.finalise_switch = function (playerid, pokemonid) {
  this.active[playerid] = this.teams[playerid][pokemonid];

  Global.users[this.p1].socket.sendUTF(JSON.stringify({info: playerid + 'active', result: this.active[playerid]}));
  Global.users[this.p2].socket.sendUTF(JSON.stringify({info: playerid + 'active', result: this.active[playerid]}));
}

Battle.prototype.get_move = function(playerid, moveid) {
  this.buffered_moves[playerid] = moveid;
  if (this.buffered_moves['p1'] !== null && this.buffered_moves['p2'] !== null) {
    console.log("Both players have chosen! Moving..");
    this.move(this.buffered_moves['p1'], this.buffered_moves['p2']);
    this.buffered_moves = {p1: null, p2: null};
  }
}

Battle.prototype.move = function (p1moveid, p2moveid) {
  p1move = this.active.p1.moves[p1moveid];
  p2move = this.active.p2.moves[p2moveid];

  this.fainted = '';

  var message = '';
  if (this.active.p1.spe >= this.active.p2.spe) {
    var dealt_damage = Math.floor(pokemon.Moves[p1move].damage * (this.active.p1.atk / this.active.p2.def));

    message += this.active.p1.name + ' has dealt ' + (dealt_damage*100/this.active.p2.maxhp).toString().slice(0, 4) + '% damage to ' + this.active.p2.name + '!\n';
    this.active.p2.hp -= dealt_damage;
    if (this.active.p2.hp <= 0) {
      message += this.active.p2.name + ' fainted!\n';
      this.fainted = 'p2'
      //this.switch('p2');
      //return;
    }
    var dealt_damage = Math.floor(pokemon.Moves[p2move].damage * (this.active.p2.atk / this.active.p1.def));
    // faint check
    if (this.active.p2.hp > 0) {
      message += this.active.p2.name + ' has dealt ' + (dealt_damage*100/this.active.p1.maxhp).toString().slice(0, 4) + '% damage to ' + this.active.p1.name + '!\n';
      this.active.p1.hp -= dealt_damage;
    }

    if (this.active.p1.hp <= 0) {
      message += this.active.p1.name + ' fainted!\n';
      this.fainted = 'p1'
      //this.switch('p1');
      //return;
    }
  } else {
    var dealt_damage = Math.floor(pokemon.Moves[p2move].damage * (this.active.p2.atk / this.active.p1.def));
    message += this.active.p2.name + ' has dealt ' + (dealt_damage*100/this.active.p1.maxhp).toString().slice(0, 4) + '% damage to ' + this.active.p1.name + '!\n';
    this.active.p1.hp -= dealt_damage;
    if (this.active.p1.hp <= 0) {
      message += this.active.p1.name + ' fainted!\n';
      this.fainted = 'p1'
      //this.switch('p1');
      //return;
    }

    // faint check again
    var dealt_damage = Math.floor(pokemon.Moves[p1move].damage * (this.active.p1.atk / this.active.p2.def));

    if (this.active.p1.hp > 0) {
      message += this.active.p1.name + ' has dealt ' + (dealt_damage*100/this.active.p2.maxhp).toString().slice(0, 4) + '% damage to ' + this.active.p2.name + '!\n';
      this.active.p2.hp -= dealt_damage;
    }
    if (this.active.p2.hp <= 0) {
      message += this.active.p2.name + ' fainted!\n';
      this.fainted = 'p2'
      //this.switch('p2');
      //return;
    }
  }

  Global.users[this.p1].socket.sendUTF(JSON.stringify({info: 'battlemsg', msg: message, p1hp: this.active.p1.hp, p2hp: this.active.p2.hp, p1maxhp: this.active.p1.maxhp, p2maxhp: this.active.p2.maxhp}));
  Global.users[this.p1].socket.sendUTF(JSON.stringify({info: 'battlemsg', msg: message, p1hp: this.active.p1.hp, p2hp: this.active.p2.hp, p1maxhp: this.active.p1.maxhp, p2maxhp: this.active.p2.maxhp}));

  this.switch(this.fainted);

  console.log(message);
}


exports.Battle = Battle;
