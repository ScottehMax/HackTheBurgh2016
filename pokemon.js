var utils = require('./utils.js');

exports.Moves = {takedown: {name: "Take Down", damage: 80},
                 hyperbeam: {name: "Hyper Beam", damage: 150},}

function Pokemon(name, min, max) {
  this.name = name
  this.hp = Math.floor(Math.log10(Math.floor(utils.randint(min, max))) * 100) + 200;
  this.maxhp = this.hp;
  this.atk = Math.floor(Math.log10(Math.floor(utils.randint(min, max))) * 100);
  this.def = Math.floor(Math.log10(Math.floor(utils.randint(min, max))) * 100);
  this.spe = Math.floor(Math.log10(Math.floor(utils.randint(min, max))) * 100);

  this.moves = ['takedown', 'hyperbeam', 'hyperbeam', 'hyperbeam'];
};

exports.Pokemon = Pokemon;
