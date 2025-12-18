const Cryptr = require('cryptr');
const config = require('../config/');
const cryptr = new Cryptr(config.keys.secret);

exports.textEncrypter = (text) => {
  return cryptr.encrypt(text);
};

exports.textDecrypter = (text) => {
  return cryptr.decrypt(text);
};