var Global = require('./global.js');
console.log(Global);
var user = require('./user.js');
var utils = require('./utils.js');

var PORT = 9001;
var MAX_USERS = 20;


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

  
});
