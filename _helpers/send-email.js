const 
  nodemailer = require('nodemailer'),
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
  });

module.exports = {
  send
};

async function send(mailOptions) {

  transporter.sendMail(mailOptions, function(err, data) {

    if (err){

      console.log(err);

    } else {

      console.log('sent: ', data);

    }

  });
  return;
}