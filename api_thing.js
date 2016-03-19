#!/usr/bin/env node

var args = process.argv.slice(2);
var first = args[0];
var second = args[1];

var http = require('http');

var csvFile = "";

//http://finance.yahoo.com/d/quotes.csv?s=AAPL+GOOG+MSFT&f=nab
//http://download.finance.yahoo.com/d/quotes.csv?s=AAPL+GOOG+MSFT&f=nab
var options = {
  host: 'download.finance.yahoo.com',
  path: '/d/quotes.csv?s=AAPL+GOOG+MSFT&f=nab',
  method: 'GET'
};

var req = http.request(options, function(res){
    res.setEncoding('utf8');
    var content = [];

    res.on('data', function (chunk){
        // chunk contains data read from the stream
        // - save it to content
        content += chunk;
    });

    res.on( 'end' , function(){
        // content is read, do what you want
        console.log("content: " + content);
    });
});

var httpOutput = req.end();
//req.end();
var outputType = Object.prototype.toString.call(httpOutput);

console.log("process.argv: " + process.argv);
console.log("args: " + args);
for (var i = 0; i < args.length; i++) {
    console.log("arg[" + [i] + "]: " + args[i]);
}
