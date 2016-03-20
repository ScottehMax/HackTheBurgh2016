"use strict";

var stocks = {'AAPL': [92.0, 134.54],
              'GOOG': [515.18, 789.87],
              'MSFT': [39.0, 56.0]}

var i, Global = {
  battles: {},
  users: {},
  largestbattleid: 1,
  stocks: stocks,
};

module.exports = Global;
