"use strict";

var stocks = { 'Alphabet Inc.': [ '736.80', '737.60', 'images/google_pixel.png', "images/google_maps_logo.png" ],
  'Apple Inc.': [ '105.76', '105.77', 'images/apple_pixel.png', "images/iphone_logo.png" ],
  'Yahoo! Inc.': [ '35.00', '35.08', 'images/pixel_yahoo_logo.png',"images/circle-256.gif" ],
  'Amazon.com, Inc.': [ '551.70', '552.75', 'images/pixel_amazon_logo.png',"images/circle-256.gif" ],
  'Microsoft Corporation': [ '53.41', '53.64', 'images/pixel_microsoft_logo.png',"images/circle-256.gif" ],
  'Facebook, Inc.': [ '111.35', '111.47', 'images/pixel_facebook_logo.png',"images/circle-256.gif" ],
  'BlackRock, Inc.': [ '342.52', '342.79', 'images/blackrock_logo.png',"images/circle-256.gif" ],
  'ARM Holdings plc': [ '39.00', '45.00', 'images/arm_logo.png',"images/circle-256.gif" ],
  'JP Morgan Chase & Co.': [ '60.40', '60.48', 'images/jpmorgan_logo.png',"images/circle-256.gif" ] }

var i, Global = {
  battles: {},
  users: {},
  largestbattleid: 1,
  stocks: stocks,
};

module.exports = Global;
