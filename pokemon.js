var utils = require('./utils.js');

exports.Moves = {takedown: {name: "Take Down", damage: 80},
                 hyperbeam: {name: "Hyper Beam", damage: 150},
                 stomp: {name: "Stomp", damage: 100},
                 doubleedge: {name: "Double-Edge", damage: 120},}

function Pokemon(name, min, max, sprite, ball) {
  this.name = name
  this.hp = Math.floor(Math.log10(Math.floor(utils.randint(min, max))) * 100) + 200;
  this.maxhp = this.hp;
  this.atk = Math.floor(Math.log10(Math.floor(utils.randint(min, max))) * 100);
  this.def = Math.floor(Math.log10(Math.floor(utils.randint(min, max))) * 100);
  this.spe = Math.floor(Math.log10(Math.floor(utils.randint(min, max))) * 100);

  this.sprite = sprite;
  this.ball = ball;

  this.moves = ['takedown', 'hyperbeam', 'stomp', 'doubleedge'];
};

exports.Pokemon = Pokemon;
