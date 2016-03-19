#!/usr/bin/env node
var request = require('request');
var util = require('util');

var args = process.argv.slice(2);
var parameterString = "";

//console.log("process.argv: " + process.argv);
//console.log("args: " + args);

if (args.length !== 0){
    parameterString = args[0];
}

for (var i = 1; i < args.length; i++) {
    parameterString = parameterString + "+" + args[i];
}
var urlString = util.format('http://download.finance.yahoo.com/d/quotes.csv?s=%s&f=nab', parameterString);

//console.log("parameterString: " + parameterString);
//console.log("urlString: " + urlString);

request.get(urlString, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var csvArray = body.match(/[^\r\n]+/g);
        var csvDictionary = {};

        for (var i = 0; i < csvArray.length; i++) {
            var splitList = csvArray[i].split(",");

            var name = splitList.slice(0, (splitList.length - 2)).join();
            name = name.substring(1, (name.length - 1));

            var ask = splitList[(splitList.length - 2)];
            var bid = splitList[(splitList.length - 1)];

            csvDictionary[name] = [bid, ask];
        }

        console.log(csvDictionary);

    }
});
