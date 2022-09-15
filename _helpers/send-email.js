const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');

//Simple script to send verification and forgot password emails.
//currently hosting a free mailgun account, so the email will not actually be sent until
//the account is upgraded.

const auth = {
  auth: {
    api_key: process.env.API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  },
};

const nodemailerMailgun = nodemailer.createTransport(mg(auth));

module.exports = { send };

function send(mailOptions) {
  nodemailerMailgun.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(`Error: ${err}`);
    } else {
      console.log(`Response: ${info}`);
    }
  });
}
