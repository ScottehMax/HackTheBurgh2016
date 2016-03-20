"use strict";

var stocks = { 'Alphabet Inc.': [ '736.80', '737.60', 'images/google_pixel.png', "images/google_maps_logo.png" ],
  'Apple Inc.': [ '105.76', '105.77', 'images/apple_pixel.png', "images/iphone_logo.png" ],
  'Yahoo! Inc.': [ '35.00', '35.08', 'images/apple_pixel.png',"images/circle-256.gif" ],
  'Amazon.com, Inc.': [ '551.70', '552.75', 'images/apple_pixel.png',"images/circle-256.gif" ],
  'Microsoft Corporation': [ '53.41', '53.64', 'images/apple_pixel.png',"images/circle-256.gif" ],
  'Facebook, Inc.': [ '111.35', '111.47', 'images/apple_pixel.png',"images/circle-256.gif" ],
  'BlackRock, Inc. Common Stock': [ '342.52', '342.79', 'images/apple_pixel.png',"images/circle-256.gif" ],
  'ARM Holdings plc': [ '39.00', '45.00', 'images/apple_pixel.png',"images/circle-256.gif" ],
  'JP Morgan Chase & Co. Common St': [ '60.40', '60.48', 'images/apple_pixel.png',"images/circle-256.gif" ] }

var i, Global = {
  battles: {},
  users: {},
  largestbattleid: 1,
  stocks: stocks,
};

module.exports = Global;
