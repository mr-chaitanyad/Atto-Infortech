const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const promisify = require('es6-promisify');
const config = require('../config/');

const transport = nodemailer.createTransport({
  host: config.mail.host,
  port: config.mail.port,
  secure: false,
  tls: {
    rejectUnauthorized: false
  },
  auth: {
    user: config.mail.username,
    pass: config.mail.password
  }
});

const generateHTML = (filename, options = {}) => {
  const html = pug.renderFile(`${__dirname}/../views/emails/${filename}.pug`, options);
  const inclined = juice(html);
  return inclined;
};

exports.send = async (options) => {
  const html = generateHTML(options.filename, options);
  const text = htmlToText.fromString(html);

  const mailOptions = {
    from: `Smoothcipher Inc. <travel9@smoothcipher.com>`,
    to: options.user,
    subject: options.subject,
    html,
    text
  };

  const sendMail = promisify(transport.sendMail, transport);
  return sendMail(mailOptions);
};