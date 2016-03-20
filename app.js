var Global = require('./global.js');
console.log(Global);
var user = require('./user.js');
var utils = require('./utils.js');
var battle = require('./battle.js');

var PORT = 9001;
var MAX_USERS = 20;

/* Stuff */


function current_battles() {
  result = {info: 'battle_list', battles: {}};
  for (var btl in Global.battles) {
    batt = Global.battles[btl]
    if (batt.open) {
      result.battles[batt.id] = {p1: Global.users[batt.p1].name}
    }
  }
  return result;
};


/* End Stuff */

var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function (request, response) {
  console.log((new Date()) + ' Received request for ' + request.url);
  response.writeHead(404);
  response.end();
});

server.listen(PORT, function () {
  console.log((new Date()) + ' | Server is listening on port ' + PORT);
});

var wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false
});

wsServer.on('request', function (request) {
  var connection = request.accept('echo-protocol', request.origin);
  var new_user = new user.User(connection);

  connection.sendUTF(JSON.stringify({'uuid': new_user.uuid}));
  connection.uuid = new_user.uuid;

  console.log("UUID assigned! Now they need to pick a name.");

  connection.sendUTF(JSON.stringify({'info': 'name'}));

  connection.on('message', function (message) {
    if (message.type === 'utf8') {
      try {
        cmd = JSON.parse(message.utf8Data);
      } catch (e) {
        connection.sendUTF("{'error': 'Invalid JSON'}");
        cmd = {};
      }

      console.log(cmd);
      switch(cmd.type) {
      case 'set_name':
        Global.users[cmd.uuid].set_name(cmd.name);
        break;
      case 'create_battle':
        var new_battle = new battle.Battle(Global.users[cmd.uuid]);
        Global.users[cmd.uuid].battle = new_battle.id;
        Global.users[cmd.uuid].playerid = 'p1';
        console.log(Global.battles);
        break;
      case 'get_battles':
        var battle_dict = current_battles();
        if (battle_dict) {
          connection.sendUTF(JSON.stringify(battle_dict));
        }
        break;
      case 'join_battle':
        Global.users[cmd.uuid].join(cmd.battle_id);
        Global.users[cmd.uuid].battle = cmd.battle_id;
        Global.users[cmd.uuid].playerid = 'p2';
        break;
      case 'pick_move':
        cur_battle = Global.battles[Global.users[cmd.uuid].battle];
        cur_battle.get_move(Global.users[cmd.uuid].playerid, cmd.id);
        break;
      case 'send_switch':
        cur_battle = Global.battles[Global.users[cmd.uuid].battle];
        cur_battle.finalise_switch(Global.users[cmd.uuid].playerid, cmd.pokemon_id);
      }
    }
  });


});
