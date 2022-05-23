const 
  nodemailer = require('nodemailer'),
  { google } = require('googleapis'),
  CLIENT_ID=process.env.CLIENT_ID,
  CLIENT_SECRET=process.env.CLIENT_SECRET,
  REDIRECT_URI=process.env.REDIRECT_URI,
  REFRESH_TOKEN=process.env.REFRESH_TOKEN,
  oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

module.exports = {
  send
};

async function send(mailOptions) {

  try {

    const 
      accessToken = await oAuth2Client.getAccessToken(),
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'oAuth2',
          user: process.env.MAIL_USER,
          clientId: CLIENT_ID,
          clientSecret : CLIENT_SECRET,
          refreshToken : REFRESH_TOKEN,
          accessToken: accessToken
        }
      }),
      result = await transporter.sendMail(mailOptions);

    return result;

  } catch (error) {
    return error;
  }
}